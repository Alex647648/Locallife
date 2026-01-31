import React, { useState } from 'react';
import { UserRole } from '../types';

interface AgentSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isStarted: boolean;
  onStart: () => void;
  role: UserRole;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const PROVIDERS = [
  { id: 'google', name: 'Google Gemini', icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v2.svg' },
  { id: 'openai', name: 'OpenAI', icon: 'https://openai.com/favicon.ico' },
  { id: 'anthropic', name: 'Anthropic', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Anthropic_logo.svg' },
  { id: 'deepseek', name: 'DeepSeek', icon: 'https://www.deepseek.com/favicon.ico' },
  { id: 'qwen', name: 'Alibaba Qwen', icon: 'https://img.alicdn.com/imgextra/i4/O1CN01fP4tK21R3uWvWjV9X_!!6000000002054-2-tps-192-192.png' },
  { id: 'zhipu', name: 'Zhipu AI', icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/Metamask-logo.svg' /* Placeholder, using fallback logic below */ },
  { id: 'minimax', name: 'MiniMax', icon: 'https://api.minimax.chat/favicon.ico' }
];

const MODELS = {
  google: [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Fastest & Balanced' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'Most Capable' },
    { id: 'gemini-2.5-flash-lite-latest', name: 'Gemini 2.5 Lite', desc: 'Resource Efficient' },
    { id: 'gemini-2.5-flash-native-audio-preview-12-2025', name: 'Gemini 2.5 Audio', desc: 'Audio-Native' }
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', desc: 'Omni Model' },
    { id: 'o1-preview', name: 'o1 Reasoning', desc: 'Advanced Logic' }
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'High Intelligence' }
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek-V3', desc: 'Efficient Reasoning' },
    { id: 'deepseek-reasoner', name: 'DeepSeek-R1', desc: 'Deep Thinking' }
  ],
  qwen: [
    { id: 'qwen-max', name: 'Qwen-Max', desc: 'Strongest Large Model' },
    { id: 'qwen-plus', name: 'Qwen-Plus', desc: 'Enhanced Capability' },
    { id: 'qwen-turbo', name: 'Qwen-Turbo', desc: 'Fast Inference' }
  ],
  zhipu: [
    { id: 'glm-4-plus', name: 'GLM-4 Plus', desc: 'Flagship Intelligence' },
    { id: 'glm-4-flash', name: 'GLM-4 Flash', desc: 'High-speed Response' }
  ],
  minimax: [
    { id: 'abab6.5s-chat', name: 'MiniMax-6.5s', desc: 'Sophisticated Chat' },
    { id: 'abab6.5g-chat', name: 'MiniMax-6.5g', desc: 'General Purpose' }
  ]
};

const ProviderIcon: React.FC<{ provider: typeof PROVIDERS[0]; size?: string }> = ({ provider, size = "w-5 h-5" }) => {
  const [error, setError] = useState(false);
  
  if (error || !provider.icon) {
    return (
      <div className={`${size} rounded-md bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white uppercase`}>
        {provider.name[0]}
      </div>
    );
  }

  return (
    <img 
      src={provider.icon} 
      className={`${size} rounded-md object-contain bg-slate-50 p-0.5 border border-slate-100`} 
      alt={provider.name} 
      onError={() => setError(true)}
    />
  );
};

const AgentSettings: React.FC<AgentSettingsProps> = ({ 
  isOpen, 
  onClose, 
  isStarted, 
  onStart, 
  role,
  selectedModel,
  onModelChange
}) => {
  const [activeTab, setActiveTab] = useState<'General' | 'Specific'>('General');
  
  const [runMode, setRunMode] = useState<'Mock' | 'Testnet'>('Testnet');
  const [settleMode, setSettleMode] = useState<'Auto' | 'Manual'>('Manual');
  const [selectedProvider, setSelectedProvider] = useState('google');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [discoveryRange, setDiscoveryRange] = useState<'5km' | '10km' | 'Global'>('10km');
  const [buyerPriority, setBuyerPriority] = useState<'Price' | 'Distance'>('Price');

  const [autoAccept, setAutoAccept] = useState<boolean>(false);
  const [serviceRadius, setServiceRadius] = useState<'Local' | 'Global'>('Local');

  const handleManageKey = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && window.aistudio.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      } else {
        console.warn("API Key selection dialog is not available in this environment.");
      }
    } catch (error) {
      console.error("Failed to open API key selection:", error);
    }
  };

  if (!isOpen) return null;

  const roleName = role === UserRole.BUYER ? 'Explore' : 'Offer';
  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider) || PROVIDERS[0];
  const currentModel = (MODELS as any)[selectedProvider]?.find((m: any) => m.id === selectedModel) || (MODELS as any)[selectedProvider][0];

  return (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-3xl flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 rounded-[2rem] overflow-hidden border border-white/50 shadow-2xl">
      
      <div className="px-8 py-6 flex items-center justify-between border-b border-black/[0.03] shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest text-[10px]">Protocol Config</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isStarted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse' : 'bg-slate-300'}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isStarted ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isStarted ? 'Node Active' : 'Node Offline'}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-200/50 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex px-4 pt-4 shrink-0">
        <div className="bg-slate-100/50 p-1.5 rounded-2xl flex w-full">
          <button 
            onClick={() => setActiveTab('General')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all rounded-xl ${activeTab === 'General' ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/[0.03]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            General
          </button>
          <button 
            onClick={() => setActiveTab('Specific')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all rounded-xl ${activeTab === 'Specific' ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/[0.03]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {roleName} Agent
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide pb-24">
        {activeTab === 'General' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Run Mode</span>
                 <span className="text-[10px] text-slate-400 font-medium">Environment scope</span>
              </div>
              <div className="flex bg-slate-100/80 p-1 rounded-xl">
                <button onClick={() => setRunMode('Mock')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${runMode === 'Mock' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Mock</button>
                <button onClick={() => setRunMode('Testnet')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${runMode === 'Testnet' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400'}`}>Testnet</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
               <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Settle Mode</span>
                 <span className="text-[10px] text-slate-400 font-medium">Escrow finality</span>
              </div>
              <div className="flex bg-slate-100/80 p-1 rounded-xl">
                <button onClick={() => setSettleMode('Auto')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${settleMode === 'Auto' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Auto</button>
                <button onClick={() => setSettleMode('Manual')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${settleMode === 'Manual' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Manual</button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block">Inference Engine</span>
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProviderDropdown(!showProviderDropdown);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 bg-white border rounded-2xl transition-all shadow-sm ${showProviderDropdown ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <ProviderIcon provider={currentProvider} />
                    <span className="text-sm font-bold text-slate-900">{currentProvider?.name}</span>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${showProviderDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showProviderDropdown && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-y-auto max-h-[250px] z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {PROVIDERS.map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => {
                          setSelectedProvider(provider.id);
                          setShowProviderDropdown(false);
                          onModelChange((MODELS as any)[provider.id][0].id);
                        }}
                        className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors ${selectedProvider === provider.id ? 'bg-blue-50/50' : ''}`}
                      >
                        <ProviderIcon provider={provider} size="w-6 h-6" />
                        <span className="text-sm font-bold text-slate-900">{provider.name}</span>
                        {selectedProvider === provider.id && (
                          <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block">LLM Parameter</span>
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModelDropdown(!showModelDropdown);
                    setShowProviderDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all shadow-lg ${showModelDropdown ? 'bg-slate-800' : 'bg-slate-900 hover:bg-slate-800'}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-white">{currentModel?.name}</span>
                    <span className="text-[10px] font-medium opacity-60 uppercase tracking-widest text-slate-300">{currentModel?.desc}</span>
                  </div>
                  <svg className={`w-4 h-4 text-white opacity-60 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showModelDropdown && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-y-auto max-h-[250px] z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    {(MODELS as any)[selectedProvider]?.map((model: any) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onModelChange(model.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full flex flex-col items-start px-5 py-4 hover:bg-slate-50 transition-colors ${selectedModel === model.id ? 'bg-blue-50/50' : ''}`}
                      >
                        <span className="text-sm font-bold text-slate-900">{model.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{model.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
               <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Project Credentials</span>
                 <span className="text-[10px] text-slate-400 font-medium">Encrypted key storage</span>
              </div>
              <button 
                onClick={handleManageKey}
                className="px-6 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-600 transition-all active:scale-95 shadow-sm flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Manage Access
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {role === UserRole.BUYER ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Discovery Range</span>
                    <span className="text-[10px] text-slate-400 font-medium">Geospatial filter</span>
                  </div>
                  <div className="flex bg-slate-100/80 p-1 rounded-xl">
                    {(['5km', '10km', 'Global'] as const).map(opt => (
                      <button key={opt} onClick={() => setDiscoveryRange(opt)} className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${discoveryRange === opt ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Optimization</span>
                    <span className="text-[10px] text-slate-400 font-medium">Matching priority</span>
                  </div>
                  <div className="flex bg-slate-100/80 p-1 rounded-xl">
                    {(['Price', 'Distance'] as const).map(opt => (
                      <button key={opt} onClick={() => setBuyerPriority(opt)} className={`px-3 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${buyerPriority === opt ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Auto-Accept</span>
                    <span className="text-[10px] text-slate-400 font-medium">Instant order handling</span>
                  </div>
                  <button 
                    onClick={() => setAutoAccept(!autoAccept)}
                    className={`w-12 h-6 rounded-full transition-all relative ${autoAccept ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoAccept ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">Service Reach</span>
                    <span className="text-[10px] text-slate-400 font-medium">Market visibility</span>
                  </div>
                  <div className="flex bg-slate-100/80 p-1 rounded-xl">
                    {(['Local', 'Global'] as const).map(opt => (
                      <button key={opt} onClick={() => setServiceRadius(opt)} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${serviceRadius === opt ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="pt-8 border-t border-black/[0.03]">
           {!isStarted ? (
             <div className="bg-slate-50/50 rounded-3xl p-8 text-center border border-slate-200/50 shadow-inner">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md ring-1 ring-black/[0.02] text-slate-300">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-widest">Protocol Stalled</h4>
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">
                 Initialize the Agent node to start processing LocalLife service assets.
               </p>
             </div>
           ) : (
             <div className="bg-emerald-50/30 rounded-3xl p-8 text-center border border-emerald-100/50 shadow-inner">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md ring-1 ring-emerald-100 text-emerald-500">
                 <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
               <h4 className="text-sm font-bold text-emerald-600 mb-2 uppercase tracking-widest">Node Synchronized</h4>
               <p className="text-[11px] text-emerald-600/60 font-medium leading-relaxed max-w-[200px] mx-auto">
                 Listening for smart contract events and user explore patterns.
               </p>
             </div>
           )}
        </div>
      </div>

      <div className="p-8 border-t border-black/[0.03] bg-slate-50/30 shrink-0">
        <button 
          onClick={onStart}
          className={`w-full py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl ${isStarted ? 'bg-white text-red-500 border border-red-100 shadow-red-500/5 hover:bg-red-50' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/20'}`}
        >
          {isStarted ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              Terminate Node
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              Initialize Agent
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AgentSettings;