import { useAccount } from 'wagmi';
import { useSwitchChain } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

export function useWalletAdapter() {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const { setShowAuthFlow } = useDynamicContext();

  // walletClient from wagmi v2 has a .transport that is EIP-1193 compatible
  // But we can also use walletClient directly since it has request() method
  const provider: EIP1193Provider | null = walletClient ? {
    request: async (args: { method: string; params?: unknown[] }) => {
      return walletClient.request(args as any);
    }
  } : null;

  return {
    address: address ?? null,
    provider,
    chainId: chainId ?? null,
    switchChain: async (targetChainId: number) => {
      await switchChainAsync({ chainId: targetChainId });
    },
    openWalletModal: () => setShowAuthFlow(true),
  };
}
