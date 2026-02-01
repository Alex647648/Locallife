import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../config/wagmi';

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface DynamicProviderProps {
  children: React.ReactNode;
}

/**
 * Plain wagmi + react-query provider stack.
 * Dynamic SDK removed — wallet discovery handled by wagmi connectors (injected + coinbaseWallet).
 */
export const DynamicProvider: React.FC<DynamicProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default DynamicProvider;
