import type { EIP1193Provider } from '../types';

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

const IDENTITY_REGISTRY = '0x8004A818BFB912233c491871b3d84c89A494BD9e';
const REPUTATION_REGISTRY = '0x8004B663056A597Dffe9eCcC1965A193B7388713';

// keccak256("register(string)") first 4 bytes
const REGISTER_SELECTOR = 'f2c298be';
// keccak256("giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)") first 4 bytes
const GIVE_FEEDBACK_SELECTOR = '3c036a7e';

// ---------------------------------------------------------------------------
// Minimal ABI encoder (no ethers/viem) — handles uint256, int128, uint8,
// string, bytes32 in a positional ABI-encoding layout.
// ---------------------------------------------------------------------------

function padLeft(hex: string, bytes: number): string {
  return hex.padStart(bytes * 2, '0');
}

function uint256Hex(n: number | bigint): string {
  const big = typeof n === 'bigint' ? n : BigInt(n);
  return padLeft(big.toString(16), 32);
}

function int128Hex(n: number | bigint): string {
  let big = typeof n === 'bigint' ? n : BigInt(n);
  if (big < 0n) {
    // two's complement for 256-bit slot
    big = (1n << 256n) + big;
  }
  return padLeft(big.toString(16), 32);
}

function uint8Hex(n: number): string {
  return padLeft(n.toString(16), 32);
}

function bytes32Hex(hex: string): string {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  return padLeft(clean, 32);
}

function encodeString(s: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(s);
  const lenHex = uint256Hex(bytes.length);
  const dataHex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  // Pad to 32-byte boundary
  const paddedLen = Math.ceil(bytes.length / 32) * 32;
  const padded = dataHex.padEnd(paddedLen * 2, '0');
  return lenHex + padded;
}

/**
 * ABI-encode `register(string agentURI)`.
 *
 * Layout:
 *   [4 bytes selector]
 *   [32 bytes offset to string data = 0x20]
 *   [encoded string: 32-byte length + padded data]
 */
function encodeRegister(agentURI: string): string {
  const offset = uint256Hex(32); // dynamic param starts at byte 32
  const stringData = encodeString(agentURI);
  return '0x' + REGISTER_SELECTOR + offset + stringData;
}

/**
 * ABI-encode `giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)`.
 *
 * 8 params total. Static params are in-place, dynamic params use offsets.
 * Params 0-2 are static (uint256, int128, uint8).
 * Params 3-6 are dynamic (string, string, string, string).
 * Param 7 is static (bytes32).
 */
function encodeGiveFeedback(
  agentId: number | bigint,
  value: number | bigint,
  valueDecimals: number,
  tag1: string,
  tag2: string,
  endpoint: string,
  feedbackURI: string,
  feedbackHash: string,
): string {
  // Head section: 8 slots x 32 bytes = 256 bytes (0x100)
  const headSlots = 8;
  const headSize = headSlots * 32;

  // Encode all dynamic strings first to know their sizes
  const tag1Encoded = encodeString(tag1);
  const tag2Encoded = encodeString(tag2);
  const endpointEncoded = encodeString(endpoint);
  const feedbackURIEncoded = encodeString(feedbackURI);

  // Compute offsets for dynamic params (offset from start of params, not selector)
  let currentTailOffset = headSize;

  const tag1Offset = currentTailOffset;
  currentTailOffset += tag1Encoded.length / 2;

  const tag2Offset = currentTailOffset;
  currentTailOffset += tag2Encoded.length / 2;

  const endpointOffset = currentTailOffset;
  currentTailOffset += endpointEncoded.length / 2;

  const feedbackURIOffset = currentTailOffset;

  // Build head
  const head =
    uint256Hex(agentId) +                    // slot 0: agentId
    int128Hex(value) +                       // slot 1: value (int128 in uint256 slot)
    uint8Hex(valueDecimals) +                // slot 2: valueDecimals
    uint256Hex(tag1Offset) +                 // slot 3: offset to tag1
    uint256Hex(tag2Offset) +                 // slot 4: offset to tag2
    uint256Hex(endpointOffset) +             // slot 5: offset to endpoint
    uint256Hex(feedbackURIOffset) +          // slot 6: offset to feedbackURI
    bytes32Hex(feedbackHash);                // slot 7: feedbackHash (static)

  // Build tail
  const tail = tag1Encoded + tag2Encoded + endpointEncoded + feedbackURIEncoded;

  return '0x' + GIVE_FEEDBACK_SELECTOR + head + tail;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RegisterAgentResult {
  txHash: string;
}

export async function registerAgent(
  provider: EIP1193Provider,
  senderAddress: string,
  agentURI: string,
): Promise<RegisterAgentResult> {
  const calldata = encodeRegister(agentURI);

  const txHash = (await provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: senderAddress,
        to: IDENTITY_REGISTRY,
        data: calldata,
        gas: '0x7A120',
      },
    ],
  })) as string;

  return { txHash };
}

export interface GiveFeedbackResult {
  txHash: string;
}

export async function giveFeedback(
  provider: EIP1193Provider,
  senderAddress: string,
  agentId: number | bigint,
  value: number | bigint,
  valueDecimals: number,
  tag1: string,
  tag2: string,
  endpoint: string,
  feedbackURI: string,
  feedbackHash: string,
): Promise<GiveFeedbackResult> {
  const calldata = encodeGiveFeedback(
    agentId,
    value,
    valueDecimals,
    tag1,
    tag2,
    endpoint,
    feedbackURI,
    feedbackHash,
  );

  const txHash = (await provider.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: senderAddress,
        to: REPUTATION_REGISTRY,
        data: calldata,
        gas: '0x7A120',
      },
    ],
  })) as string;

  return { txHash };
}

export async function ensureSepoliaChain(
  _provider: EIP1193Provider,
  currentChainId: number | null,
  switchChain: (chainId: number) => Promise<void>,
): Promise<void> {
  if (currentChainId === SEPOLIA_CHAIN_ID) return;

  // Use wagmi's switchChainAsync directly — it works reliably through
  // Dynamic SDK's connector and triggers the MetaMask chain-switch popup.
  // The raw provider.request('wallet_switchEthereumChain') can hang when
  // routed through Dynamic's adapter layer.
  await switchChain(SEPOLIA_CHAIN_ID);
}

export { SEPOLIA_CHAIN_ID };
