import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface AgentSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isStarted: boolean;
  onStart: () => void;
  role: UserRole;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  apiKey?: string;
  onApiKeyChange?: (apiKey: string) => void;
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
  onModelChange,
  apiKey = '',
  onApiKeyChange
}) => {
  const [activeTab, setActiveTab] = useState<'General' | 'Specific'>('General');
  
  const [runMode, setRunMode] = useState<'Mock' | 'Testnet'>('Testnet');
  const [settleMode, setSettleMode] = useState<'Auto' | 'Manual'>('Manual');
  const [selectedProvider, setSelectedProvider] = useState('google');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');

  const [discoveryRange, setDiscoveryRange] = useState<'5km' | '10km' | 'Global'>('10km');
  const [buyerPriority, setBuyerPriority] = useState<'Price' | 'Distance'>('Price');

  const [autoAccept, setAutoAccept] = useState<boolean>(false);
  const [serviceRadius, setServiceRadius] = useState<'Local' | 'Global'>('Local');

  // 同步外部 API Key 变化到本地状态
  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  const handleApiKeyChange = (value: string) => {
    setLocalApiKey(value);
    // 清除之前的保存状态
    if (saveStatus !== 'idle') {
      setSaveStatus('idle');
      setSaveMessage('');
    }
  };

  const handleSaveApiKey = async () => {
    const trimmedKey = localApiKey.trim();
    
    // 如果为空，直接清除
    if (!trimmedKey) {
      try {
        localStorage.removeItem('gemini_api_key');
        onApiKeyChange?.('');
        setSaveStatus('success');
        setSaveMessage('API Key cleared successfully');
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveMessage('');
        }, 3000);
      } catch (error) {
        setSaveStatus('error');
        setSaveMessage('Failed to clear API Key: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
      return;
    }

    // 验证 API Key 格式（Gemini API Key 通常以特定格式开头）
    if (!trimmedKey.startsWith('AI') && trimmedKey.length < 20) {
      setSaveStatus('error');
      setSaveMessage('Invalid API Key format. Please check your key.');
      return;
    }

    setSaveStatus('saving');
    setSaveMessage('Validating and saving...');

    try {
      // 通过后端验证 API Key（避免 CORS 问题）
      // 如果 VITE_API_BASE_URL 未设置，使用相对路径（适用于 monolith 部署）
      // 如果设置了，使用绝对路径（适用于开发环境或分离部署）
      const envApiBase = import.meta.env.VITE_API_BASE_URL;
      const API_BASE = envApiBase || '/api/v1';
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3f4bf410-9649-4bb8-88b7-4f0a7038d061',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AgentSettings.tsx:157',message:'API_BASE URL configuration',data:{envApiBase,apiBase:API_BASE,isRelative:!envApiBase},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const fetchUrl = `${API_BASE}/agent/chat`;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3f4bf410-9649-4bb8-88b7-4f0a7038d061',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AgentSettings.tsx:162',message:'Fetch request details',data:{fetchUrl,method:'POST'},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      const testResponse = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ id: 'test', role: 'user', content: 'test', timestamp: Date.now() }],
          systemInstruction: 'You are a helpful assistant.',
          model: 'gemini-3-flash-preview',
          apiKey: trimmedKey
        }),
        // Add timeout and better error handling
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3f4bf410-9649-4bb8-88b7-4f0a7038d061',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AgentSettings.tsx:175',message:'Response status',data:{ok:testResponse.ok,status:testResponse.status,statusText:testResponse.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Validation failed (${testResponse.status})`;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3f4bf410-9649-4bb8-88b7-4f0a7038d061',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AgentSettings.tsx:181',message:'Response error',data:{status:testResponse.status,errorData,errorMessage},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        throw new Error(errorMessage);
      }

      // 验证成功，保存到 localStorage
      localStorage.setItem('gemini_api_key', trimmedKey);
      onApiKeyChange?.(trimmedKey);
      
      setSaveStatus('success');
      setSaveMessage('API Key validated and saved successfully!');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3f4bf410-9649-4bb8-88b7-4f0a7038d061',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AgentSettings.tsx:211',message:'Catch block error',data:{errorMessage,errorType:error instanceof Error ? error.constructor.name : typeof error,errorName:error instanceof Error ? error.name : undefined,isAbortError:error instanceof Error && error.name === 'AbortError',isNetworkError:error instanceof Error && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')),stack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      // 提供更友好的错误消息
      let friendlyMessage = errorMessage;
      
      // Check for specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError' || errorMessage.includes('timeout')) {
          friendlyMessage = 'Request timeout. Please check your connection and try again.';
        } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('network')) {
          friendlyMessage = 'Network error. Please check your connection and backend server.';
        } else if (errorMessage.includes('CORS') || errorMessage.includes('Cross-Origin')) {
          friendlyMessage = 'CORS error. Please check backend server configuration.';
        } else if (errorMessage.includes('401') || errorMessage.includes('UNAUTHORIZED') || errorMessage.includes('API key')) {
          friendlyMessage = 'Invalid API Key. Please check your key and try again.';
        } else if (errorMessage.includes('403') || errorMessage.includes('FORBIDDEN')) {
          friendlyMessage = 'API Key access denied. Please check your key permissions.';
        } else if (errorMessage.includes('429') || errorMessage.includes('RATE_LIMIT')) {
          friendlyMessage = 'Rate limit exceeded. Please try again later.';
        }
      }
      
      setSaveMessage(`Failed to save: ${friendlyMessage}`);
      
      // 5秒后清除错误消息
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 5000);
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-0.5">API Key</span>
                  <span className="text-[10px] text-slate-400 font-medium">Gemini API credentials</span>
                </div>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={localApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your Gemini API Key"
                  disabled={saveStatus === 'saving'}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-slate-900 transition-all pr-20 ${
                    saveStatus === 'error' ? 'border-red-300 focus:border-red-500' : 
                    saveStatus === 'success' ? 'border-emerald-300 focus:border-emerald-500' : 
                    'border-slate-200'
                  } ${saveStatus === 'saving' ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={saveStatus === 'saving'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95 ${
                    saveStatus === 'saving' 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : saveStatus === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : saveStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-500'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving</span>
                    </div>
                  ) : saveStatus === 'success' ? (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Saved</span>
                    </div>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
              
              {/* 状态消息 */}
              {saveMessage && (
                <div className={`px-4 py-2.5 rounded-xl text-[10px] font-medium flex items-start gap-2 ${
                  saveStatus === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : saveStatus === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {saveStatus === 'success' ? (
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : saveStatus === 'error' ? (
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span className="flex-1 leading-relaxed">{saveMessage}</span>
                </div>
              )}
              
              <p className="text-[9px] text-slate-400 leading-relaxed">
                Your API key is stored locally and sent with each request. Get your key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Google AI Studio
                </a>
              </p>
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