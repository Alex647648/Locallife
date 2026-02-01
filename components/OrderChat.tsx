import React, { useState, useEffect, useRef } from 'react';
import { OrderMessage } from '../types';
import { apiService } from '../services/apiService';

interface OrderChatProps {
  orderId: string;
  userAddress: string;
}

const OrderChat: React.FC<OrderChatProps> = ({ orderId, userAddress }) => {
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages function
  const fetchMessages = async () => {
    try {
      const data = await apiService.getOrderMessages(orderId);
      // Sort by timestamp (oldest first)
      const sorted = data.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sorted);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and polling
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [orderId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const sentMsg = await apiService.sendOrderMessage(orderId, userAddress, newMessage);
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/[0.02] flex flex-col h-[400px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/5 bg-white/40">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Order Chat</h3>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Order ID: {orderId}</p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderAddress.toLowerCase() === userAddress.toLowerCase();
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-300 min-w-max mb-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className={`text-[9px] font-bold uppercase tracking-wider text-slate-300 mt-1 mx-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {isMe ? 'You' : msg.senderRole}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white/40 border-t border-black/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-4 py-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-black/5"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderChat;
