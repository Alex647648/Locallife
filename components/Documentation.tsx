
import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Protocol Overview</span>
        <h1 className="text-6xl font-bold tracking-tight text-slate-900">How LocalLife Works</h1>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          LocalLife is a peer-to-peer coordination protocol designed to bring real-world services onto the blockchain through AI-enabled agentic flows and x402 tokenization.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Agentic Discovery</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Instead of complex forms, users interact with AI Agents using natural language. The Explore Agent matches buyer needs to local service assets, while the Offer Agent helps sellers tokenize their time.
          </p>
        </div>

        <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-black/10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Secured Settlements</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Every transaction is backed by a non-custodial smart escrow contract. Funds are only released when both parties confirm the service delivery, ensuring zero-counterparty risk.
          </p>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">The Lifecycle</h2>
          <div className="h-px w-full bg-slate-100"></div>
        </div>
        <div className="space-y-6">
          {[
            { step: '01', title: 'Intent Definition', desc: 'Buyer describes what they need to the Explore Agent.' },
            { step: '02', title: 'Asset Matching', desc: 'Agent queries the X402 registry for matching local services.' },
            { step: '03', title: 'Escrow Lock', desc: 'Payment in USDC is locked into the Smart Escrow contract.' },
            { step: '04', title: 'Service Delivery', desc: 'The seller fulfills the real-world service.' },
            { step: '05', title: 'Consensus Release', desc: 'Buyer releases funds or initiates dispute resolution.' }
          ].map((item) => (
            <div key={item.step} className="flex gap-8 group">
              <span className="text-4xl font-bold text-slate-200 group-hover:text-blue-100 transition-colors font-mono">{item.step}</span>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Documentation;
