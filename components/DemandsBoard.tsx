
import React, { useState } from 'react';
import { Demand } from '../types';
import { CATEGORIES } from '../constants';
import DemandCard from './DemandCard';

interface DemandsBoardProps {
  demands: Demand[];
  onAccept: (demand: Demand) => void;
  onLocate?: (demand: Demand) => void;
}

const DemandsBoard: React.FC<DemandsBoardProps> = ({ demands, onAccept, onLocate }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDemands = demands.filter(d => 
    activeCategory === 'All' || d.category === activeCategory
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header><h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-3">I Can Help</h2><p className="text-slate-400 font-medium text-lg">Real-time intent captured from local buyers.</p></header>
      <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-2 rounded-[2rem] inline-flex items-center gap-1 shadow-sm ring-1 ring-black/[0.02] overflow-x-auto max-w-full no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-7 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredDemands.length > 0 ? (
          filteredDemands.map(demand => (
            <DemandCard key={demand.id} demand={demand} onAccept={onAccept} onLocate={onLocate} />
          ))
        ) : (
          <div className="py-32 text-center bg-white/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200"><p className="text-slate-400 font-medium italic">No demands match your current parameters.</p></div>
        )}
      </div>
    </div>
  );
};

export default DemandsBoard;
