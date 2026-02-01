import React, { useEffect, useRef } from 'react';
import { Service } from '../types';
import { useAgentChat } from '../hooks/useAgentChat';

interface AgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  systemInstruction: string;
}

const AgentChatModal: React.FC<AgentChatModalProps> = ({
  isOpen,
  onClose,
  service,
  systemInstruction,
}) => {
  const { messages, isLoading, error, sendMessage, clearChat } = useAgentChat(systemInstruction);
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear chat when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearChat();
    }
  }, [isOpen, clearChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue;
    setInputValue('');
    await sendMessage(messageText);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render nothing when closed
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/5">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-900">{service.title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-3">
            {service.category} · {service.location}
          </p>

          {/* Reputation Stars */}
          {service.reputation && service.reputation.reviewCount > 0 ? (
            <div className="flex items-center gap-2">
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
          ) : (
            <p className="text-xs text-slate-400">No ratings yet</p>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 text-sm">Ask me anything about this service!</p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-300 min-w-max mb-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading Dots */}
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-white/40 border-t border-black/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about this service..."
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-black/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentChatModal;
