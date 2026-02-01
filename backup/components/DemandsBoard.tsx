
import React, { useState, useRef } from 'react';
import { Demand } from '../types';
import { CATEGORIES } from '../constants';
import DemandCard from './DemandCard';
import AgentRegistrationPanel from './AgentRegistrationPanel';

interface DemandsBoardProps {
  demands: Demand[];
  onAccept: (demand: Demand) => void;
  onLocate?: (demand: Demand) => void;
  onRegistrationSuccess?: () => void;
}

const DemandsBoard: React.FC<DemandsBoardProps> = ({ demands, onAccept, onLocate, onRegistrationSuccess }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFullRegistration, setShowFullRegistration] = useState(false);
  const registrationRef = useRef<HTMLDivElement>(null);

  const filteredDemands = demands.filter(d => 
    activeCategory === 'All' || d.category === activeCategory
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-stretch justify-between gap-8 flex-wrap">
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-3">I Can Help</h2>
            <p className="text-slate-400 font-medium text-lg">Real-time intent captured from local buyers.</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-stretch">
          <AgentRegistrationPanel 
            compact={true} 
            onRegistrationSuccess={onRegistrationSuccess}
            onShowFullForm={() => {
              setShowFullRegistration(true);
              setTimeout(() => {
                registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
          />
        </div>
      </header>
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
      
      {showFullRegistration && (
        <div ref={registrationRef} className="pt-8">
          <AgentRegistrationPanel 
            onRegistrationSuccess={() => {
              setShowFullRegistration(false);
              onRegistrationSuccess?.();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DemandsBoard;
