import React from 'react';
import { Service, Demand } from '../types';

interface CardPreviewProps {
  type: 'service' | 'demand';
  data: Partial<Service> | Partial<Demand>;
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({ type, data, onConfirm, onEdit, onCancel }) => {
  if (type === 'service') {
    const service = data as Partial<Service>;
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 my-4 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Preview - Service Card</span>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">?</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              {service.category || 'Category'}
            </span>
          </div>
          
          <h4 className="text-lg font-bold text-slate-900 mb-2">{service.title || 'Service Title'}</h4>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">{service.description || 'Description will appear here...'}</p>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>{service.location || 'Location'}</span>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">{service.price || 0}</span>
                <span className="text-[10px] font-bold text-slate-400">USDC</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">{service.unit || 'per unit'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95 shadow-md"
          >
            Confirm & Create
          </button>
          <button
            onClick={onEdit}
            className="px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-slate-200 transition-all active:scale-95"
          >
            Edit
          </button>
          <button
            onClick={onCancel}
            className="px-4 bg-white hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    const demand = data as Partial<Demand>;
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 my-4 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Preview - Demand Card</span>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">?</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
              {demand.category || 'Category'}
            </span>
          </div>
          
          <h4 className="text-lg font-bold text-slate-900 mb-2">{demand.title || 'Demand Title'}</h4>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">{demand.description || 'Description will appear here...'}</p>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>{demand.location || 'Location'}</span>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-600">Budget: {demand.budget || 0}</span>
                <span className="text-[10px] font-bold text-slate-400">USDC</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95 shadow-md"
          >
            Confirm & Post
          </button>
          <button
            onClick={onEdit}
            className="px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-slate-200 transition-all active:scale-95"
          >
            Edit
          </button>
          <button
            onClick={onCancel}
            className="px-4 bg-white hover:bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
};

export default CardPreview;
