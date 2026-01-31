import React, { useState } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletName: string) => void;
}

const WALLETS = [
  { 
    name: 'MetaMask', 
    icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/Metamask-logo.svg' 
  },
  { 
    name: 'Coinbase', 
    icon: 'https://avatars.githubusercontent.com/u/18060234?v=4' 
  },
  { 
    name: 'WalletConnect', 
    icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg' 
  },
  { 
    name: 'Trust', 
    icon: 'https://avatars.githubusercontent.com/u/32179889?v=4' 
  },
  { 
    name: 'Rainbow', 
    icon: 'https://avatars.githubusercontent.com/u/48327834?v=4' 
  }
];

const WalletIcon: React.FC<{ wallet: typeof WALLETS[0] }> = ({ wallet }) => {
  const [error, setError] = useState(false);
  
  if (error || !wallet.icon) {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-lg font-bold">
        {wallet.name[0]}
      </div>
    );
  }

  return (
    <img 
      src={wallet.icon} 
      alt={wallet.name} 
      className="w-full h-full object-contain" 
      onError={() => setError(true)}
    />
  );
};

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
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
            Log in or sign up
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

        <div className="px-10 pb-8 space-y-3 max-h-[460px] overflow-y-auto scrollbar-hide">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onConnect(wallet.name)}
              className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform p-1.5">
                <WalletIcon wallet={wallet} />
              </div>
              <span className="text-[15px] font-bold text-slate-800 tracking-tight">{wallet.name}</span>
            </button>
          ))}
        </div>

        <div className="bg-slate-50/80 py-4 px-10 border-t border-slate-100 flex items-center justify-center gap-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by</span>
           <div className="flex items-center gap-1 opacity-40 grayscale group-hover:grayscale-0 transition-all">
             <div className="w-4 h-4 bg-slate-400 rotate-45 rounded-[2px]"></div>
             <span className="text-[11px] font-extrabold text-slate-900 tracking-tighter italic">dynamic</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;