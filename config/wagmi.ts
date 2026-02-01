import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains';
import { metaMask, coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

// WalletConnect project ID — get one free at https://cloud.walletconnect.com
const WC_PROJECT_ID = '8b3cc0c991ab9eed5dd4a1c6c4b49eb9';

// Wagmi config — plain wagmi, no Dynamic SDK
// Supports Ethereum Mainnet (default MetaMask chain), Sepolia (ERC-8004), and Base Sepolia (x402 payments)
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, baseSepolia],
  connectors: [
    metaMask(),                                             // MetaMask SDK (works even without window.ethereum)
    coinbaseWallet({ appName: 'LocalLife' }),                // Coinbase Wallet SDK
    walletConnect({ projectId: WC_PROJECT_ID }),             // WalletConnect v2 (mobile wallets)
    injected(),                                             // Fallback: any injected provider
  ],
  transports: {
    [mainnet.id]: http(),
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
