
import React, { useState } from 'react';
import { Service, Demand } from '../types';
import ServiceCard from './ServiceCard';
import MapModule from './MapModule';

interface HomeProps {
  services: Service[];
  demands: Demand[];
  onAction: (item: any) => void;
  focusItem?: any | null;
  currentUserAddress?: string;
}

const Home: React.FC<HomeProps> = ({ services, demands, onAction, focusItem, currentUserAddress }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'demands'>('services');

  const recommendedServices = [...services]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  
  const highBudgetDemands = [...demands]
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 3);

  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <section className="max-w-4xl">
        <header className="space-y-8">
          <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span></span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Sepolia Network Online</span>
          </div>
          <h1 className="text-[5rem] font-extrabold tracking-tight text-slate-900 leading-[1.05]">Local Life <br/><span className="text-blue-600 italic">Connected.</span></h1>
          <p className="text-xl font-medium text-slate-400 leading-relaxed max-w-2xl">A peer-to-peer protocol for discovery, coordination, and automated settlement of real-world services. Empowering communities with AI-driven service tokenization.</p>
        </header>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between"><div className="space-y-1"><h2 className="text-3xl font-bold text-slate-900 tracking-tight">Geospatial Registry</h2><p className="text-sm font-medium text-slate-400">Visualizing live protocol activity across Chiang Mai.</p></div></div>
        <MapModule services={services} demands={demands} onAction={onAction} focusItem={focusItem} currentUserAddress={currentUserAddress} />
      </section>

      <section className="space-y-10">
        <div className="flex items-center gap-8 justify-between">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl ring-1 ring-black/[0.03]">
             <button onClick={() => setActiveTab('services')} className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'services' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/[0.02]' : 'text-slate-400 hover:text-slate-900'}`}>Top Services</button>
             <button onClick={() => setActiveTab('demands')} className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'demands' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/[0.02]' : 'text-slate-400 hover:text-slate-900'}`}>High-Value Demands</button>
          </div>
          <div className="h-px flex-1 bg-slate-100 hidden md:block"></div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hidden md:block">Trending Now</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {activeTab === 'services' ? (
             recommendedServices.map(service => (
               <ServiceCard key={service.id} service={service} onSelect={onAction} />
             ))
           ) : (
             highBudgetDemands.map(demand => (
                <div key={demand.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                   <div className="flex items-center gap-4 mb-6"><img src={demand.avatarUrl} className="w-12 h-12 rounded-2xl bg-slate-100 object-cover border border-black/5 shadow-inner" alt="User" /><div><span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{demand.category}</span><h4 className="text-sm font-bold text-slate-900 uppercase mt-1 tracking-tight">Active Intent</h4></div></div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{demand.title}</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">{demand.description}</p>
                   <div className="flex items-center justify-between pt-6 border-t border-black/[0.04]">
                      <div><span className="text-2xl font-bold text-slate-900">{demand.budget}</span><span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">USDC</span></div>
                      <button onClick={() => onAction(demand)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-black/10">Send Offer</button>
                   </div>
                </div>
             ))
           )}
        </div>
      </section>
    </div>
  );
};

export default Home;
