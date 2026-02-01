
import React from 'react';

const X402Standard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">The Asset Layer</span>
        <h1 className="text-6xl font-bold tracking-tight text-slate-900">X402 Standard</h1>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          X402 is a specialized token standard for real-world services. It combines the fungibility of ERC-20 with the unique metadata of ERC-721, optimized for time-based assets.
        </p>
      </header>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Metadata</span>
            <h4 className="text-lg font-bold mb-2">Rich Context</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Embed location, category, and historical quality metrics directly on-chain.</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Fungibility</span>
            <h4 className="text-lg font-bold mb-2">Standard Pricing</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Service units are fractionalized, allowing for seamless pricing and partial bookings.</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Governance</span>
            <h4 className="text-lg font-bold mb-2">Escrow-Native</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Native hooks for integration with the LocalLife Smart Escrow protocol.</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32"></div>
      </div>

      <section className="space-y-8">
        <h3 className="text-3xl font-bold text-slate-900">Why X402?</h3>
        <div className="space-y-12">
          <div className="flex gap-8">
            <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">01</div>
            <div>
              <h5 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tight">Time as a Commodity</h5>
              <p className="text-slate-500 font-medium leading-relaxed">Services are inherently perishable. X402 introduces "expiry logic" into the token metadata, ensuring that service slots are used or recycled back into the supply pool.</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">02</div>
            <div>
              <h5 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tight">Proof of Fulfillment</h5>
              <p className="text-slate-500 font-medium leading-relaxed">Each service session generates an ephemeral fulfillment key. Upon service completion, this key is rotated, updating the asset's reputation score across the decentralized network.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default X402Standard;
