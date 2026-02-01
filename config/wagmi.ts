import { http, createConfig } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';

// Wagmi config for Dynamic SDK
// Supports both Ethereum Sepolia (ERC-8004) and Base Sepolia (x402 payments)
export const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia],
  multiInjectedProviderDiscovery: false, // Dynamic handles wallet discovery
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Chain IDs for reference
export const CHAIN_IDS = {
  ETHEREUM_SEPOLIA: sepolia.id,    // 11155111 - for ERC-8004 identity/reputation
  BASE_SEPOLIA: baseSepolia.id,    // 84532 - for x402 USDC payments
} as const;

// Contract addresses (from erc-8004-integration.md)
export const CONTRACTS = {
  // ERC-8004 on Ethereum Sepolia
  IDENTITY_REGISTRY: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  REPUTATION_REGISTRY: '0x8004B663056A597Dffe9eCcC1965A193B7388713',
  // USDC on Base Sepolia (EIP-3009 compatible)
  USDC_BASE_SEPOLIA: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
} as const;
