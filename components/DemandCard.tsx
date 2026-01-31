
import React from 'react';
import { Demand } from '../types';

interface DemandCardProps {
  demand: Demand;
  onAccept: (demand: Demand) => void;
  onLocate?: (demand: Demand) => void;
}

const DemandCard: React.FC<DemandCardProps> = ({ demand, onAccept, onLocate }) => {
  const isUrgent = demand.budget > 200 && demand.category === 'Digital';
  const isLongTerm = demand.budget >= 1000;

  return (
    <div className={`group bg-white/80 border p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all hover:bg-white hover:shadow-xl ${
      isUrgent ? 'border-red-100 ring-2 ring-red-500/5' : 'border-black/5'
    }`}>
      <div className="flex gap-6 items-start">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-black/5 shrink-0 shadow-inner"><img src={demand.avatarUrl} className="w-full h-full object-cover" alt="Buyer" /></div>
          {isUrgent && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></div>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${isUrgent ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>{isUrgent ? 'Flash Intent' : demand.category}</span>
             {isLongTerm && <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Contract</span>}
          </div>
          <h4 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{demand.title}</h4>
          <p className="text-sm text-slate-500 font-medium max-w-xl">{demand.description}</p>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <span className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onLocate?.(demand)}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {demand.location}
             </span>
             <span>•</span>
             <span>{new Date(demand.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-black/5">
        <div className="text-right">
          <div className="flex items-baseline gap-1"><span className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-slate-900'}`}>{demand.budget}</span><span className="text-[10px] font-bold text-slate-400">USDC</span></div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 block mt-1">{isLongTerm ? 'Estimated Budget' : 'Quick Bounty'}</span>
        </div>
        <div className="flex gap-2">
          {onLocate && (
            <button 
              onClick={() => onLocate(demand)}
              className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
            ><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>
          )}
          <button onClick={() => onAccept(demand)} className={`px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg ${isUrgent ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' : 'bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/10'}`}>Send Offer</button>
        </div>
      </div>
    </div>
  );
};

export default DemandCard;
