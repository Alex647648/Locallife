
import React, { useState } from 'react';
import { Service } from '../types';
import { CATEGORIES } from '../constants';
import ServiceCard from './ServiceCard';

interface MarketplaceProps {
  services: Service[];
  onBook: (service: Service) => void;
  onLocate?: (service: Service) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ services, onBook, onLocate }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesCategory;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-3">Find Something New</h2>
          <p className="text-slate-400 font-medium text-lg">Discovery verified local service assets on ETH Sepolia.</p>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-2 rounded-[2rem] inline-flex items-center gap-1 shadow-sm ring-1 ring-black/[0.02]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-7 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'}`}
          >{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} onSelect={onBook} onLocate={onLocate} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><p className="text-slate-400 font-medium italic">No assets match your current discovery parameters.</p></div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
