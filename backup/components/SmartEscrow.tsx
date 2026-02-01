
import React from 'react';

const SmartEscrow: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">The Trust Layer</span>
        <h1 className="text-6xl font-bold tracking-tight text-slate-900">Smart Escrow</h1>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          Automated, non-custodial fund protection. LocalLife eliminates the middleman and replaces it with a set of audited, immutable smart contracts.
        </p>
      </header>

      <section className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">Contract States</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Created', color: 'bg-slate-200' },
            { label: 'Paid', color: 'bg-blue-500 text-white' },
            { label: 'In Service', color: 'bg-blue-600 text-white' },
            { label: 'Settled', color: 'bg-emerald-500 text-white' }
          ].map((state, idx) => (
            <div key={state.label} className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border border-black/5 ${state.color}`}>
              <span className="text-[9px] font-bold uppercase font-mono">Step 0{idx+1}</span>
              <span className="text-xs font-bold uppercase tracking-widest">{state.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h4 className="text-2xl font-bold text-slate-900">For Buyers</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div></div>
              <p className="text-sm font-medium text-slate-500">Protection against non-delivery of services.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div></div>
              <p className="text-sm font-medium text-slate-500">Funds only release upon your explicit confirmation.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div></div>
              <p className="text-sm font-medium text-slate-500">Automatic refund capability if seller cancels.</p>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-2xl font-bold text-slate-900">For Sellers</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div></div>
              <p className="text-sm font-medium text-slate-500">Verified Proof of Funds before you start working.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div></div>
              <p className="text-sm font-medium text-slate-500">Instant payout on the Sepolia network upon settlement.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div></div>
              <p className="text-sm font-medium text-slate-500">Build on-chain history with every successful deal.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default SmartEscrow;
