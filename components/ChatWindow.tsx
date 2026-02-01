
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole, Service, Demand } from '../types';
import AgentSettings from './AgentSettings';
import CardPreview from './CardPreview';
import ServiceCard from './ServiceCard';
import DemandCard from './DemandCard';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, modelId: string, apiKey?: string) => void;
  isLoading: boolean;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onBookService?: (service: Service) => void;
  onAcceptDemand?: (demand: Demand) => void;
  onLocate?: (item: Service | Demand) => void;
  placeholder?: string;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onSendMessage,
  isLoading, 
  role,
  onRoleChange,
  onBookService,
  onAcceptDemand,
  onLocate,
  placeholder = "How can I help you today?",
  className = ""
}) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isAgentStarted, setIsAgentStarted] = useState(true);
  const [modelId, setModelId] = useState('gemini-3-flash-preview');
  const [apiKey, setApiKey] = useState<string>(() => {
    // 从 localStorage 读取 API Key
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [previewCard, setPreviewCard] = useState<{
    type: 'service' | 'demand';
    data: Partial<Service> | Partial<Demand>;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 自适应输入框高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 重置高度以获取正确的 scrollHeight
      textarea.style.height = 'auto';
      // 计算新高度，最小高度为一行，最大高度为6行（约144px）
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 48; // py-3.5 (14px * 2) + 文本行高约20px
      const maxHeight = 144; // 约6行
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
      // 如果超过最大高度，显示滚动条
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input, modelId, apiKey);
    setInput('');
    // 重置输入框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleStartAgent = () => {
    setIsAgentStarted(!isAgentStarted);
  };

  const handleConfirmCard = () => {
    if (previewCard) {
      // 只发送确认消息给AI，让AI返回create动作，避免重复创建
      const confirmText = previewCard.type === 'service' 
        ? 'Yes, this looks good! Please create the service card.'
        : 'Yes, this looks good! Please create the demand card.';
      onSendMessage(confirmText, modelId, apiKey);
      setPreviewCard(null);
    }
  };

  const handleEditCard = () => {
    // 将卡片数据转换为自然语言，让用户继续编辑
    if (previewCard) {
      const card = previewCard.data;
      let editPrompt = '';
      if (previewCard.type === 'service') {
        const s = card as Partial<Service>;
        editPrompt = `I want to edit my service. Current details: Title: ${s.title}, Category: ${s.category}, Description: ${s.description}, Location: ${s.location}, Price: ${s.price} ${s.unit}. What would you like to change?`;
      } else {
        const d = card as Partial<Demand>;
        editPrompt = `I want to edit my demand. Current details: Title: ${d.title}, Category: ${d.category}, Description: ${d.description}, Location: ${d.location}, Budget: ${d.budget} USDC. What would you like to change?`;
      }
      setPreviewCard(null);
      onSendMessage(editPrompt, modelId, apiKey);
    }
  };

  const handleCancelCard = () => {
    // 发送取消消息给AI
    onSendMessage('Actually, I want to cancel this. Let me start over.', modelId, apiKey);
    setPreviewCard(null);
  };

  // 检查消息中是否包含预览卡片数据
  useEffect(() => {
    if (!isLoading) {
      const assistantMessages = messages.filter(m => m.role === 'assistant');
      const lastMessage = assistantMessages[assistantMessages.length - 1];
      if (lastMessage) {
        // 检查所有JSON块（可能有多条show_service动作）
        const jsonMatches = lastMessage.content.matchAll(/@@@JSON_START@@@([\s\S]*?)@@@JSON_END@@@/g);
        let foundPreview = false;
        
        for (const match of jsonMatches) {
          try {
            const actionData = JSON.parse(match[1]);
            if (actionData.action === 'preview_service' || actionData.action === 'preview_demand') {
              setPreviewCard({
                type: actionData.action === 'preview_service' ? 'service' : 'demand',
                data: actionData.data
              });
              foundPreview = true;
              break;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
        
        if (!foundPreview) {
          // 如果没有预览动作，清除预览
          setPreviewCard(null);
        }
      }
    }
  }, [messages, isLoading]);

  return (
    <div className={`flex flex-col bg-white/80 backdrop-blur-3xl border-l border-black/5 h-full shadow-2xl relative ${className}`}>
      
      {/* Settings Overlay */}
      <AgentSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        isStarted={isAgentStarted}
        onStart={handleStartAgent}
        role={role}
        selectedModel={modelId}
        onModelChange={setModelId}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />

      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-black/5 shrink-0 bg-white/40">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{role === UserRole.BUYER ? 'Explore' : 'Offer'} Node</span>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-1.5 h-1.5 rounded-full ${isAgentStarted ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
             <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">{modelId.split('-').slice(0, 3).join(' ')}</span>
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          className="text-slate-400 hover:text-blue-600 transition-colors p-2 bg-slate-50 rounded-xl border border-slate-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.filter(m => m.role !== 'system').map((msg) => {
          // 检查是否包含JSON动作（预览、服务卡片、需求卡片等）
          const jsonMatches = Array.from(msg.content.matchAll(/@@@JSON_START@@@([\s\S]*?)@@@JSON_END@@@/g));
          const serviceCards: Service[] = [];
          const demandCards: Demand[] = [];
          let hasPreview = false;
          
          // 提取所有服务卡片、需求卡片和预览动作
          jsonMatches.forEach(match => {
            try {
              const actionData = JSON.parse(match[1]);
              if (actionData.action === 'show_service') {
                // 构建完整的Service对象
                const service: Service = {
                  id: actionData.data.id || `temp-${Date.now()}`,
                  sellerId: '0xServiceProvider',
                  title: actionData.data.title,
                  category: actionData.data.category,
                  description: actionData.data.description,
                  location: actionData.data.location,
                  price: actionData.data.price,
                  unit: actionData.data.unit,
                  imageUrl: actionData.data.imageUrl,
                  avatarUrl: actionData.data.avatarUrl
                };
                serviceCards.push(service);
              } else if (actionData.action === 'show_demand') {
                // 构建完整的Demand对象
                const demand: Demand = {
                  id: actionData.data.id || `temp-${Date.now()}`,
                  buyerId: '0xBuyer',
                  title: actionData.data.title,
                  category: actionData.data.category,
                  description: actionData.data.description,
                  location: actionData.data.location,
                  budget: actionData.data.budget,
                  timestamp: Date.now(),
                  avatarUrl: actionData.data.avatarUrl || 'https://i.pravatar.cc/150?u=0xBuyer'
                };
                demandCards.push(demand);
              } else if (actionData.action === 'preview_service' || actionData.action === 'preview_demand') {
                hasPreview = true;
              }
            } catch (e) {
              // 忽略解析错误
            }
          });
          
          // 清理消息内容（移除所有JSON，但保留预览JSON用于CardPreview组件）
          let cleanContent = msg.content;
          if (!hasPreview) {
            // 如果没有预览动作，移除所有JSON（包括create_service和create_demand）
            cleanContent = msg.content.replace(/@@@JSON_START@@@[\s\S]*?@@@JSON_END@@@/g, '').trim();
          } else {
            // 如果有预览动作，移除show_service和create动作的JSON，但保留preview动作
            cleanContent = msg.content
              .replace(/@@@JSON_START@@@[\s\S]*?"action":\s*"show_service"[\s\S]*?@@@JSON_END@@@/g, '')
              .replace(/@@@JSON_START@@@[\s\S]*?"action":\s*"create_service"[\s\S]*?@@@JSON_END@@@/g, '')
              .replace(/@@@JSON_START@@@[\s\S]*?"action":\s*"create_demand"[\s\S]*?@@@JSON_END@@@/g, '')
              .trim();
          }
          
          return (
            <div key={msg.id} className="space-y-3">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-black/5 shadow-sm'
                }`}>
                  {cleanContent && (
                    <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{cleanContent}</p>
                  )}
                  <div className={`flex items-center gap-2 mt-2 opacity-40 ${msg.role === 'user' ? 'text-white' : 'text-slate-500'}`}>
                     <span className="text-[8px] font-bold uppercase tracking-widest">{msg.role}</span>
                     <span className="text-[8px] font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              
              {/* 显示服务卡片 */}
              {msg.role === 'assistant' && serviceCards.length > 0 && (
                <div className="flex justify-start gap-4 flex-wrap">
                  {serviceCards.map((service) => (
                    <div key={service.id} className="w-full max-w-sm">
                      <ServiceCard
                        service={service}
                        onSelect={onBookService || (() => {})}
                        onLocate={onLocate ? () => onLocate(service) : undefined}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* 显示需求卡片 */}
              {msg.role === 'assistant' && demandCards.length > 0 && (
                <div className="flex justify-start gap-4 flex-wrap">
                  {demandCards.map((demand) => (
                    <div key={demand.id} className="w-full max-w-full">
                      {/* 聊天窗口中的需求卡片 - 强制垂直布局以确保完整显示 */}
                      <div className="group bg-white/80 border p-6 rounded-2xl flex flex-col gap-6 transition-all hover:bg-white hover:shadow-xl border-black/5 overflow-visible">
                        <div className="flex gap-4 items-start">
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-black/5 shadow-inner">
                              <img src={demand.avatarUrl} className="w-full h-full object-cover" alt="Buyer" />
                            </div>
                            {demand.budget > 200 && demand.category === 'Digital' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                                demand.budget > 200 && demand.category === 'Digital' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                              }`}>
                                {demand.budget > 200 && demand.category === 'Digital' ? 'Flash Intent' : demand.category}
                              </span>
                              {demand.budget >= 1000 && (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Contract</span>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{demand.title}</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{demand.description}</p>
                            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                {demand.location}
                              </span>
                              <span>•</span>
                              <span>{new Date(demand.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/5">
                          <div className="text-left">
                            <div className="flex items-baseline gap-1">
                              <span className={`text-xl font-bold ${
                                demand.budget > 200 && demand.category === 'Digital' ? 'text-red-600' : 'text-slate-900'
                              }`}>
                                {demand.budget}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">USDC</span>
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300 block mt-0.5">
                              {demand.budget >= 1000 ? 'Estimated Budget' : 'Quick Bounty'}
                            </span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {onLocate && (
                              <button 
                                onClick={() => onLocate(demand)}
                                className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                              </button>
                            )}
                            <button 
                              onClick={() => onAcceptDemand?.(demand)}
                              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md whitespace-nowrap ${
                                demand.budget > 200 && demand.category === 'Digital' 
                                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' 
                                  : 'bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/10'
                              }`}
                            >
                              Send Offer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-black/5">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* 预览卡片 - 显示在消息列表底部 */}
        {previewCard && !isLoading && (
          <div className="flex justify-start">
            <CardPreview
              type={previewCard.type}
              data={previewCard.data}
              onConfirm={handleConfirmCard}
              onEdit={handleEditCard}
              onCancel={handleCancelCard}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 bg-white/20 border-t border-black/5 shrink-0">
        <div className="relative flex items-end group">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Enter 提交，Shift+Enter 换行
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!input.trim() || isLoading) return;
                onSendMessage(input, modelId, apiKey);
                setInput('');
                // 重置输入框高度
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto';
                }
              }
            }}
            disabled={isLoading || !isAgentStarted}
            placeholder={isAgentStarted ? placeholder : "Agent offline..."}
            rows={1}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 pr-12 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 text-black transition-all resize-none overflow-hidden"
            style={{ minHeight: '48px', maxHeight: '144px' }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !isAgentStarted}
            className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
