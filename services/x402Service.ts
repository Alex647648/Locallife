import { x402Client } from '@x402/core/client';
import { x402HTTPClient } from '@x402/core/http';
import { ExactEvmScheme } from '@x402/evm';
import type { EIP1193Provider } from '../types';

// Frontend uses Vite dev server proxying `/api/*` to backend.
// In production monolith, backend serves the frontend and `/api/*` on same origin.
const API_BASE = '/api/v1';
const BASE_SEPOLIA_CHAIN_ID = 84532;

export interface BookingResult {
  orderId: string;
  txHash: string;
  network: string;
  payer?: string;
  success: boolean;
}

/** Adapts an EIP-1193 provider into the ClientEvmSigner interface required by @x402/evm */
function createEIP1193Signer(
  provider: EIP1193Provider,
  address: string,
): { address: `0x${string}`; signTypedData: (msg: { domain: Record<string, unknown>; types: Record<string, unknown>; primaryType: string; message: Record<string, unknown> }) => Promise<`0x${string}`> } {
  const checksumAddress = address as `0x${string}`;

  return {
    address: checksumAddress,

    async signTypedData(msg: {
      domain: Record<string, unknown>;
      types: Record<string, unknown>;
      primaryType: string;
      message: Record<string, unknown>;
    }): Promise<`0x${string}`> {
      const typedData = {
        domain: msg.domain,
        types: {
          // EIP-712 requires EIP712Domain type alongside the payload types
          EIP712Domain: buildEIP712DomainType(msg.domain),
          ...msg.types,
        },
        primaryType: msg.primaryType,
        message: msg.message,
      };

      const signature = (await provider.request({
        method: 'eth_signTypedData_v4',
        params: [checksumAddress, JSON.stringify(typedData, (_k, v) => typeof v === 'bigint' ? v.toString() : v)],
      })) as `0x${string}`;

      return signature;
    },
  };
}

/** Field order matters per EIP-712 spec — must match the domain fields present */
function buildEIP712DomainType(
  domain: Record<string, unknown>,
): Array<{ name: string; type: string }> {
  const fields: Array<{ name: string; type: string }> = [];
  if ('name' in domain) fields.push({ name: 'name', type: 'string' });
  if ('version' in domain) fields.push({ name: 'version', type: 'string' });
  if ('chainId' in domain) fields.push({ name: 'chainId', type: 'uint256' });
  if ('verifyingContract' in domain) fields.push({ name: 'verifyingContract', type: 'address' });
  if ('salt' in domain) fields.push({ name: 'salt', type: 'bytes32' });
  return fields;
}

/**
 * Full x402 payment flow: call fulfill → parse 402 → sign → retry → parse settlement.
 * Uses @x402/core + @x402/evm to handle EIP-3009 transferWithAuthorization.
 */
export async function x402Fulfill(
  orderId: string,
  provider: EIP1193Provider,
  address: string,
): Promise<BookingResult> {
  const signer = createEIP1193Signer(provider, address);
  const coreClient = new x402Client().register('eip155:*', new ExactEvmScheme(signer));
  const httpClient = new x402HTTPClient(coreClient);

  const fulfillUrl = `${API_BASE}/orders/x402/${encodeURIComponent(orderId)}/fulfill`;

  const initialResponse = await fetch(fulfillUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (initialResponse.status !== 402) {
    if (initialResponse.ok) {
      const settleResponse = httpClient.getPaymentSettleResponse(
        (name) => initialResponse.headers.get(name),
      );
      return {
        orderId,
        txHash: settleResponse.transaction || '',
        network: settleResponse.network || `eip155:${BASE_SEPOLIA_CHAIN_ID}`,
        payer: settleResponse.payer,
        success: true,
      };
    }
    const errorBody = await initialResponse.text().catch(() => '');
    throw new Error(
      `Unexpected response from fulfill: ${initialResponse.status} ${errorBody}`,
    );
  }

  let body: unknown;
  try {
    body = await initialResponse.clone().json();
  } catch {
    body = undefined;
  }
  const paymentRequired = httpClient.getPaymentRequiredResponse(
    (name) => initialResponse.headers.get(name),
    body,
  );

  console.log('[x402] Payment required:', paymentRequired);

  const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);

  const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);

  const paidResponse = await fetch(fulfillUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...paymentHeaders,
    },
  });

  if (!paidResponse.ok) {
    const errorBody = await paidResponse.text().catch(() => '');
    throw new Error(`Payment failed: ${paidResponse.status} ${errorBody}`);
  }

  const settleResponse = httpClient.getPaymentSettleResponse(
    (name) => paidResponse.headers.get(name),
  );

  return {
    orderId,
    txHash: settleResponse.transaction,
    network: settleResponse.network,
    payer: settleResponse.payer,
    success: settleResponse.success,
  };
}

export async function ensureCorrectChain(
  chainId: number | null,
  switchChain: (targetChainId: number) => Promise<void>,
): Promise<boolean> {
  if (chainId === BASE_SEPOLIA_CHAIN_ID) return true;
  await switchChain(BASE_SEPOLIA_CHAIN_ID);
  return true;
}
