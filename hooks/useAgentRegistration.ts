import { useState, useCallback } from 'react';
import { parseEventLogs } from 'viem';
import { getPublicClient } from 'wagmi/actions';
import { useWalletAdapter } from './useWalletAdapter';
import { apiService } from '../services/apiService';
import { wagmiConfig } from '../config/wagmi';
import {
  registerAgent,
  ensureSepoliaChain,
  type RegisterAgentResult,
} from '../services/erc8004WriteService';

const STORAGE_KEY = 'locallife_registration_result';

const erc721TransferAbi = [{
  type: 'event',
  name: 'Transfer',
  inputs: [
    { type: 'address', name: 'from', indexed: true },
    { type: 'address', name: 'to', indexed: true },
    { type: 'uint256', name: 'tokenId', indexed: true },
  ],
}] as const;

export interface RegistrationInput {
  name: string;
  description: string;
  category: string;
  location?: string;
  pricing?: string;
}

export interface UseAgentRegistrationReturn {
  register: (input: RegistrationInput) => Promise<void>;
  isRegistering: boolean;
  result: (RegisterAgentResult & { agentURI: string; agentId?: string | null }) | null;
  error: string | null;
  reset: () => void;
}

export function useAgentRegistration(): UseAgentRegistrationReturn {
  const wallet = useWalletAdapter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [result, setResult] = useState<(RegisterAgentResult & { agentURI: string; agentId?: string | null }) | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const register = useCallback(
    async (input: RegistrationInput) => {
      if (!wallet.address) {
        wallet.openWalletModal();
        return;
      }
      if (!wallet.provider) {
        setError('Wallet provider not available. Reconnect your wallet.');
        return;
      }

      setIsRegistering(true);
      setError(null);
      setResult(null);

      try {
        await ensureSepoliaChain(wallet.provider, wallet.chainId, wallet.switchChain);

        const backendResult = await apiService.createAgentRegistration({
          sellerWallet: wallet.address,
          ...input,
        });

        if (!backendResult) {
          throw new Error('Failed to generate agent registration on backend');
        }

        const txResult = await registerAgent(
          wallet.provider,
          wallet.address,
          backendResult.agentURI,
        );

        // Extract agentId from tx receipt by parsing ERC-721 Transfer event
        let agentId: string | null = null;
        try {
          const publicClient = getPublicClient(wagmiConfig, { chainId: 11155111 });
          if (publicClient) {
            const receipt = await publicClient.waitForTransactionReceipt({
              hash: txResult.txHash as `0x${string}`,
            });
            const transferLogs = parseEventLogs({
              abi: erc721TransferAbi,
              logs: receipt.logs,
              eventName: 'Transfer',
            });
            const mintLog = (transferLogs as any[]).find(
              (log: any) =>
                log.args?.from === '0x0000000000000000000000000000000000000000' &&
                log.address?.toLowerCase() ===
                  '0x8004A818BFB912233c491871b3d84c89A494BD9e'.toLowerCase(),
            );
            if (mintLog?.args?.tokenId != null) {
              agentId = String(mintLog.args.tokenId);
            }
          }
        } catch (err) {
          console.warn('[useAgentRegistration] Could not extract agentId from receipt:', err);
        }

         // Best-effort: backfill agentId to backend
         if (agentId) {
           try {
             await fetch(
               `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/erc8004/register/${wallet.address}/backfill`,
               {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ agentId }),
               },
             );
           } catch {
             /* best-effort */
           }
         }

         const resultData = { ...txResult, agentURI: backendResult.agentURI, agentId };
         setResult(resultData);
         try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resultData)); } catch {}
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Registration failed';
        console.error('[useAgentRegistration] Error:', e);
        setError(message);
      } finally {
        setIsRegistering(false);
      }
    },
    [wallet],
  );

  return { register, isRegistering, result, error, reset };
}
