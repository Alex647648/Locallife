import React from 'react';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletName: string) => void;
}

// Using Dynamic SDK's built-in widget for wallet connection
// This replaces the fake wallet buttons with real MetaMask/Coinbase/etc integration
const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const { primaryWallet, user } = useDynamicContext();

  // When wallet connects via Dynamic, notify parent component
  React.useEffect(() => {
    if (primaryWallet && user) {
      onConnect(primaryWallet.connector?.name || 'wallet');
      onClose();
    }
  }, [primaryWallet, user, onConnect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="pt-10 pb-6 px-10 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold text-slate-900 tracking-tight flex-1 text-center pr-2 ml-4">
            Connect Wallet
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-10 pb-8">
          {/* Dynamic Widget handles all wallet connections */}
          <DynamicWidget 
            innerButtonComponent={
              <button className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
                Connect Wallet
              </button>
            }
          />
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Connect with MetaMask, Coinbase, or create an embedded wallet
          </p>
        </div>

        <div className="bg-slate-50/80 py-4 px-10 border-t border-slate-100 flex items-center justify-center gap-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by</span>
           <div className="flex items-center gap-1">
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
               <rect x="4" y="4" width="16" height="16" rx="4" fill="#6366f1"/>
             </svg>
             <span className="text-[11px] font-extrabold text-slate-900 tracking-tighter">Dynamic</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
