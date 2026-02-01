import React, { useState } from 'react';
import { useFeedback, type FeedbackInput } from '../hooks/useFeedback';
import { useWalletAdapter } from '../hooks/useWalletAdapter';
import { SEPOLIA_CHAIN_ID } from '../services/erc8004WriteService';

interface FeedbackPanelProps {
  orderId: string;
  agentId?: string;
  onDismiss: () => void;
}

const STARS = [1, 2, 3, 4, 5] as const;

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ orderId, agentId, onDismiss }) => {
  const wallet = useWalletAdapter();
  const { submitFeedback, isSubmitting, result, error, reset } = useFeedback();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [agentIdInput, setAgentIdInput] = useState('');
  const [agentIdError, setAgentIdError] = useState('');

  const validateAgentId = (value: string): boolean => {
    if (!value.trim()) {
      setAgentIdError('Agent ID is required');
      return false;
    }
    if (!/^\d+$/.test(value)) {
      setAgentIdError('Agent ID must be a numeric value');
      return false;
    }
    const num = BigInt(value);
    if (num < 1n) {
      setAgentIdError('Agent ID must be >= 1');
      return false;
    }
    setAgentIdError('');
    return true;
  };

  const handleAgentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgentIdInput(value);
    if (value) {
      validateAgentId(value);
    } else {
      setAgentIdError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAgentId = agentId || agentIdInput;
    if (!agentId && !validateAgentId(finalAgentId)) {
      return;
    }

    const input: FeedbackInput = {
      orderId,
      agentId: finalAgentId,
      rating,
      comment,
    };
    await submitFeedback(input);
  };

  const isWrongChain = wallet.chainId !== null && wallet.chainId !== SEPOLIA_CHAIN_ID;

  if (result) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Feedback Submitted On-Chain!</h3>
            <p className="text-xs text-emerald-600 font-mono mt-1">Tx: {result.txHash.slice(0, 16)}...{result.txHash.slice(-8)}</p>
          </div>
        </div>
        <p className="text-sm text-emerald-700">Your feedback is now recorded in the ERC-8004 ReputationRegistry on Sepolia.</p>
        <div className="flex gap-3">
          <a
            href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline"
          >
            View on Etherscan
          </a>
          <button onClick={onDismiss} className="text-xs font-bold text-slate-400 hover:text-slate-600">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-sm ring-1 ring-black/[0.02] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Leave On-Chain Feedback</h3>
          <p className="text-sm text-slate-400 mt-1">Rate your experience. Recorded permanently on Sepolia.</p>
        </div>
        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 p-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {isWrongChain && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Switch to <strong>Sepolia (11155111)</strong> to submit feedback.
        </div>
      )}

       <form onSubmit={handleSubmit} className="space-y-5">
         {!agentId && (
           <div>
             <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Agent ID</label>
             <input
               type="text"
               value={agentIdInput}
               onChange={handleAgentIdChange}
               placeholder="Enter your ERC-8004 Agent ID (numeric)"
               className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none transition-colors ${
                 agentIdError
                   ? 'border-red-300 focus:ring-red-500'
                   : 'border-slate-200 focus:ring-blue-500'
               }`}
             />
             {agentIdError && (
               <p className="text-xs text-red-600 mt-2">{agentIdError}</p>
             )}
           </div>
         )}

         <div>
           <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Rating</label>
          <div className="flex gap-2">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="transition-transform hover:scale-125"
              >
                <svg
                  className={`w-8 h-8 ${star <= (hoveredStar ?? rating) ? 'text-amber-400' : 'text-slate-200'} transition-colors`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
            <span className="ml-3 text-sm font-bold text-slate-500 self-center">{rating}/5</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your experience?"
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

         <div className="text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3">
           Order: <span className="font-mono font-bold">{orderId}</span>
           {(agentId || agentIdInput) && <> | Agent ID: <span className="font-mono font-bold">{agentId || agentIdInput}</span></>}
         </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {error}
            <button onClick={reset} className="ml-2 underline font-bold">Dismiss</button>
          </div>
        )}

         <button
           type="submit"
           disabled={isSubmitting || (!agentId && (!agentIdInput || agentIdError !== ''))}
           className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
         >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting to Sepolia...
            </>
          ) : (
            'Submit Feedback on Sepolia'
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackPanel;
