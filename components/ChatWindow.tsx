
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole } from '../types';
import AgentSettings from './AgentSettings';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, modelId: string) => void;
  isLoading: boolean;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  placeholder?: string;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  role,
  onRoleChange,
  placeholder = "How can I help you today?",
  className = ""
}) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isAgentStarted, setIsAgentStarted] = useState(true);
  const [modelId, setModelId] = useState('gemini-3-flash-preview');
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
    onSendMessage(input, modelId);
    setInput('');
    // 重置输入框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleStartAgent = () => {
    setIsAgentStarted(!isAgentStarted);
  };

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
        {messages.filter(m => m.role !== 'system').map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-4 py-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none shadow-lg' 
                : 'bg-white text-slate-800 rounded-tl-none border border-black/5 shadow-sm'
            }`}>
              <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className={`flex items-center gap-2 mt-2 opacity-40 ${msg.role === 'user' ? 'text-white' : 'text-slate-500'}`}>
                 <span className="text-[8px] font-bold uppercase tracking-widest">{msg.role}</span>
                 <span className="text-[8px] font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
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
                onSendMessage(input, modelId);
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
