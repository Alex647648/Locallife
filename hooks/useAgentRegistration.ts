import { useState, useCallback } from 'react';
import { useWalletAdapter } from './useWalletAdapter';
import { apiService } from '../services/apiService';
import {
  registerAgent,
  ensureSepoliaChain,
  type RegisterAgentResult,
} from '../services/erc8004WriteService';

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
  result: (RegisterAgentResult & { agentURI: string }) | null;
  error: string | null;
  reset: () => void;
}

export function useAgentRegistration(): UseAgentRegistrationReturn {
  const wallet = useWalletAdapter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [result, setResult] = useState<(RegisterAgentResult & { agentURI: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
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

        setResult({ ...txResult, agentURI: backendResult.agentURI });
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
