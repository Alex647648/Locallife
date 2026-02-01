
import React, { useState } from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  onLocate?: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, onLocate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  const isFeatured = service.price > 100;
  const isDigital = service.category === 'Digital';
  const fallbackUrl = 'https://images.unsplash.com/photo-1541613569553-332abbced5d2?q=80&w=800&auto=format&fit=crop';

  return (
    <div className={`group relative bg-white border rounded-[2.5rem] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${
      isFeatured ? 'ring-2 ring-blue-500/20 border-blue-100 shadow-blue-500/5' : 'border-slate-100 shadow-sm'
    }`}>
      
      {isFeatured && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>}

      <div className={`relative h-56 mb-6 -mx-1 -mt-1 rounded-[1.75rem] overflow-hidden shadow-inner ${
        isDigital ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-50'
      }`}>
        {imgStatus === 'loading' && !isDigital && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!isDigital ? (
          <img 
            src={imgStatus === 'error' ? fallbackUrl : service.imageUrl} 
            alt={service.title} 
            onLoad={() => setImgStatus('loaded')}
            onError={() => setImgStatus('error')}
            className={`w-full h-full object-cover transition-all duration-700 ${imgStatus === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} group-hover:scale-105`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white/90">
             <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-4">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">x402 Protocol Node</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {isFeatured && <span className="bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white px-3 py-1.5 rounded-full shadow-lg">High Liquidity</span>}
           <span className="bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-white/50">{isDigital ? 'Virtual Asset' : 'Local Resource'}</span>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/40 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/60 text-slate-600 hover:bg-white/90'}`}
        ><svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full border border-black/5 overflow-hidden shadow-sm bg-slate-100"><img src={service.avatarUrl} alt="Provider" className="w-full h-full object-cover" /></div>
        <span className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1.5 rounded-full ${isDigital ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'}`}>{service.category}</span>
      </div>

       <h4 className="text-xl font-bold text-slate-900 mb-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">{service.title}</h4>
       <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">{service.description}</p>
       
       {/* Reputation Badge */}
       {service.reputation && service.reputation.reviewCount > 0 && (
         <div className="flex items-center gap-2 mb-4">
           <div className="flex gap-0.5">
             {[1, 2, 3, 4, 5].map((star) => (
               <svg
                 key={star}
                 className={`w-4 h-4 ${star <= Math.round(service.reputation!.averageRating) ? 'text-amber-400' : 'text-slate-200'}`}
                 fill="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
               </svg>
             ))}
           </div>
           <span className="text-[11px] font-semibold text-slate-500">
             {service.reputation.averageRating.toFixed(1)}
           </span>
           <span className="text-[10px] text-slate-400">
             ({service.reputation.reviewCount} reviews)
           </span>
           {service.reputation.verified && (
             <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
               On-Chain Verified
             </span>
           )}
         </div>
       )}
       
       <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {service.location}
        </div>
        {onLocate && (
          <button 
            onClick={() => onLocate(service)}
            className="p-2 hover:bg-slate-50 rounded-lg text-blue-600 transition-colors"
            title="Locate on Map"
          ><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></button>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-black/[0.04] pt-6">
        <div>
          <div className="flex items-baseline gap-1"><span className="text-2xl font-bold text-slate-900 tracking-tight">{service.price}</span><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">USDC</span></div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase tracking-widest">{service.unit}</span>
        </div>
        <button onClick={() => onSelect(service)} className={`text-[10px] font-bold uppercase tracking-[0.1em] px-6 py-3.5 rounded-2xl transition-all active:scale-95 shadow-xl ${isFeatured ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-blue-600'}`}>Book Now</button>
      </div>
    </div>
  );
};

export default ServiceCard;
