
import React, { useState, useEffect, useRef } from 'react';
import { Service, Demand } from '../types';
import L from 'leaflet';

interface MapModuleProps {
  services: Service[];
  demands: Demand[];
  onAction: (item: any) => void;
  focusItem?: any | null; // New prop to handle external focus requests
}

// Generate fallback coordinates for items without real lat/lng
export const getFallbackPos = (id: string, category: string) => {
  const seededRandom = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  };

  const REGIONS = {
    OLD_CITY: [18.7830, 18.7930, 98.9810, 98.9930],
    NIMMAN: [18.7940, 18.8040, 98.9640, 98.9740],
    SUTHEP: [18.7850, 18.7950, 98.9550, 98.9700]
  };

  const seed = seededRandom(id);
  const isDigital = category === 'Digital';
  const isCulinary = category === 'Culinary';
  
  let bounds;
  if (isDigital) {
    bounds = seed % 10 < 7 ? REGIONS.NIMMAN : REGIONS.SUTHEP;
  } else if (isCulinary) {
    bounds = seed % 10 < 8 ? REGIONS.OLD_CITY : REGIONS.NIMMAN;
  } else {
    const rand = seed % 3;
    bounds = rand === 0 ? REGIONS.OLD_CITY : rand === 1 ? REGIONS.NIMMAN : REGIONS.SUTHEP;
  }

  const lat = bounds[0] + ((seed % 1000) / 1000) * (bounds[1] - bounds[0]);
  const lng = bounds[2] + ((seededRandom(id + 'alt') % 1000) / 1000) * (bounds[3] - bounds[2]);

  return { lat, lng };
};

// Get position for an item - use real coordinates if available, otherwise fallback
export const getStablePos = (item: { id: string; category: string; lat?: number; lng?: number }) => {
  // If item has real coordinates, use them
  if (item.lat !== undefined && item.lng !== undefined) {
    return { lat: item.lat, lng: item.lng, isReal: true };
  }
  // Otherwise generate fallback coordinates
  const fallback = getFallbackPos(item.id, item.category);
  return { ...fallback, isReal: false };
};

const MapModule: React.FC<MapModuleProps> = ({ services, demands, onAction, focusItem }) => {
  const [viewType, setViewType] = useState<'all' | 'services' | 'demands'>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const VIEW_CENTER: [number, number] = [18.7930, 98.9750]; 

  const geoItems = [
    ...services.map(s => ({ ...s, type: 'service' as const, ...getStablePos(s) })),
    ...demands.map(d => ({ ...d, type: 'demand' as const, ...getStablePos(d) }))
  ];

  // Map Initialization
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: VIEW_CENTER,
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CartoDB'
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    setTimeout(() => map.invalidateSize(), 100);

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  // Marker Rendering
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;
    markersLayer.current.clearLayers();

    const filtered = geoItems.filter(item => {
      if (viewType === 'all') return true;
      return viewType === 'services' ? item.type === 'service' : item.type === 'demand';
    });

    filtered.forEach(item => {
      const color = item.type === 'service' ? '#2563eb' : '#10b981';
      const isReal = (item as any).isReal;
      // Real coordinates get a solid marker, generated ones get a ring
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: isReal 
          ? `<div style="background-color: ${color}; width: 16px; height: 16px; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer;"></div>`
          : `<div style="background-color: transparent; width: 14px; height: 14px; border: 3px solid ${color}; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; opacity: 0.7;"></div>`,
        iconSize: isReal ? [16, 16] : [14, 14],
        iconAnchor: isReal ? [8, 8] : [7, 7]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon })
        .on('click', (e) => {
          setSelectedItem(item);
          mapInstance.current?.setView([item.lat, item.lng], 16, { animate: true });
          L.DomEvent.stopPropagation(e);
        });

      markersLayer.current?.addLayer(marker);
    });
  }, [viewType, geoItems]);

  // External Focus Listener
  useEffect(() => {
    if (focusItem && mapInstance.current) {
      const pos = getStablePos(focusItem);
      setSelectedItem({ ...focusItem, ...pos });
      mapInstance.current.setView([pos.lat, pos.lng], 16, { animate: true });
    }
  }, [focusItem]);

  const handleZoom = (delta: number) => {
    if (mapInstance.current) {
      mapInstance.current.setZoom(mapInstance.current.getZoom() + delta);
    }
  };

  return (
    <div id="map-registry" className="relative w-full h-[640px] bg-white border border-slate-200 rounded-[3.5rem] shadow-2xl overflow-hidden group">
      <div ref={mapRef} className="absolute inset-0 z-0 bg-slate-50"></div>

      <div className="absolute top-8 right-8 z-20 pointer-events-none">
         <div className="bg-slate-900/95 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Protocol Node Explorer</span>
         </div>
      </div>

      <div className="absolute bottom-8 left-8 flex flex-col gap-3 z-20">
        <button onClick={() => handleZoom(1)} className="w-12 h-12 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl flex items-center justify-center shadow-xl hover:bg-white active:scale-90 transition-all text-slate-900"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg></button>
        <button onClick={() => handleZoom(-1)} className="w-12 h-12 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl flex items-center justify-center shadow-xl hover:bg-white active:scale-90 transition-all text-slate-900"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg></button>
      </div>

      <div className="absolute top-8 left-8 flex bg-white/90 backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-white/50 shadow-2xl z-20">
         {(['all', 'services', 'demands'] as const).map(type => {
            const displayText = type === 'services' ? 'EXPLORE' : type === 'demands' ? 'OFFER' : 'ALL';
            return (
              <button key={type} onClick={() => { setViewType(type); setSelectedItem(null); }} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${viewType === type ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{displayText}</button>
            );
         })}
      </div>

      {selectedItem && (
        <div className="absolute bottom-8 right-8 w-80 bg-white/98 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-7 z-30 animate-in slide-in-from-right-8 duration-500">
           <button onClick={() => setSelectedItem(null)} className="absolute top-5 right-5 text-slate-300 hover:text-slate-900 transition-colors p-1"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
           <div className="flex items-center gap-3 mb-5">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${selectedItem.type === 'service' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{selectedItem.type === 'service' ? 'X402 Asset' : 'Local Intent'}</span>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID {selectedItem.id}</span>
           </div>
           <h4 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight">{selectedItem.title}</h4>
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-8 uppercase tracking-[0.1em]"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>{selectedItem.location}</div>
           <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex flex-col"><div className="flex items-baseline gap-1"><span className="text-2xl font-black text-slate-900">{selectedItem.price || selectedItem.budget}</span><span className="text-[10px] font-black text-slate-400 uppercase">USDC</span></div><span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Escrow Secured</span></div>
              <button onClick={() => onAction(selectedItem)} className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all active:scale-95">{selectedItem.type === 'service' ? 'Interact' : 'Fulfill'}</button>
           </div>
        </div>
      )}

      {!selectedItem && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
           <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Explore Service Topology</span>
        </div>
      )}
    </div>
  );
};

export default MapModule;
