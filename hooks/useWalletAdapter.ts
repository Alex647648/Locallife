import { useAccount, useConnect, useSwitchChain, useWalletClient } from 'wagmi';

export interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

export function useWalletAdapter() {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const { connect, connectors } = useConnect();

  // walletClient from wagmi v2 has a request() method that is EIP-1193 compatible
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
    openWalletModal: () => {
      const connector = connectors[0];
      if (connector) connect({ connector });
    },
  };
}
