import { useState, useCallback } from 'react';
import { useWalletAdapter } from './useWalletAdapter';
import { apiService } from '../services/apiService';
import { x402Fulfill, ensureCorrectChain, type BookingResult } from '../services/x402Service';

export interface UseBookingReturn {
  book: (serviceId: string, price: number, payTo?: string) => Promise<void>;
  isBooking: boolean;
  bookingResult: BookingResult | null;
  error: string | null;
  reset: () => void;
}

export function useBooking(): UseBookingReturn {
  const wallet = useWalletAdapter();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setBookingResult(null);
    setError(null);
  }, []);

  const book = useCallback(async (serviceId: string, price: number, payTo?: string) => {
    if (!wallet.address) {
      wallet.openWalletModal();
      return;
    }

    if (!wallet.provider) {
      setError('Wallet provider not available. Reconnect your wallet.');
      return;
    }

    setIsBooking(true);
    setError(null);
    setBookingResult(null);

    try {
      await ensureCorrectChain(wallet.chainId, wallet.switchChain);

      const order = await apiService.createX402Order(serviceId, wallet.address, price, payTo);
      if (!order) {
        throw new Error('Failed to create order');
      }

      const result = await x402Fulfill(order.orderId, wallet.provider, wallet.address);
      setBookingResult(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Booking failed';
      console.error('[useBooking] Error:', e);
      setError(message);
    } finally {
      setIsBooking(false);
    }
  }, [wallet]);

  return { book, isBooking, bookingResult, error, reset };
}
