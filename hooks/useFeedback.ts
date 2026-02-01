import { useState, useCallback } from 'react';
import { useWalletAdapter } from './useWalletAdapter';
import { apiService } from '../services/apiService';
import {
  giveFeedback,
  ensureSepoliaChain,
  type GiveFeedbackResult,
} from '../services/erc8004WriteService';

export interface FeedbackInput {
  orderId: string;
  agentId: string;
  rating: number;
  comment: string;
}

export interface UseFeedbackReturn {
  submitFeedback: (input: FeedbackInput) => Promise<void>;
  isSubmitting: boolean;
  result: (GiveFeedbackResult & { feedbackURI: string }) | null;
  error: string | null;
  reset: () => void;
}

export function useFeedback(): UseFeedbackReturn {
  const wallet = useWalletAdapter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<(GiveFeedbackResult & { feedbackURI: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const submitFeedback = useCallback(
    async (input: FeedbackInput) => {
      if (!wallet.address) {
        wallet.openWalletModal();
        return;
      }
      if (!wallet.provider) {
        setError('Wallet provider not available. Reconnect your wallet.');
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setResult(null);

      try {
        await ensureSepoliaChain(wallet.provider, wallet.chainId, wallet.switchChain);

        const backendResult = await apiService.createFeedbackURI({
          orderId: input.orderId,
          buyerWallet: wallet.address,
          agentId: input.agentId,
          rating: input.rating,
          comment: input.comment,
        });

        if (!backendResult) {
          throw new Error('Failed to generate feedback on backend');
        }

        const feedbackValue = BigInt(input.rating) * 100n;

        const txResult = await giveFeedback(
          wallet.provider,
          wallet.address,
          BigInt(input.agentId),
          feedbackValue,
          2,
          'service',
          'locallife',
          '',
          backendResult.feedbackURI,
          backendResult.feedbackHash,
        );

        setResult({ ...txResult, feedbackURI: backendResult.feedbackURI });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Feedback submission failed';
        console.error('[useFeedback] Error:', e);
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [wallet],
  );

  return { submitFeedback, isSubmitting, result, error, reset };
}
