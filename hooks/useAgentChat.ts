import { useState, useCallback, useRef } from 'react';
import { ChatMessage } from '../types';
import { getAgentResponseStream } from '../services/geminiService';

interface UseAgentChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

export function useAgentChat(systemInstruction: string): UseAgentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to avoid re-creating sendMessage when systemInstruction changes
  const systemInstructionRef = useRef(systemInstruction);
  systemInstructionRef.current = systemInstruction;

  const sendMessage = useCallback(async (text: string) => {
    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Create assistant placeholder
    const assistantId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    // Build updated messages array (setState is async, so we build manually)
    const updatedMessages = [...messages, userMessage];

    // Append both messages to state
    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setIsLoading(true);
    setError(null);

    try {
      // Call streaming API with all messages including the new user message
      const stream = await getAgentResponseStream(
        updatedMessages,
        systemInstructionRef.current,
        'gemini-2.0-flash'
      );

      let fullResponse = '';

      // Iterate chunks and accumulate response
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          // Update assistant message with accumulated response
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, content: fullResponse } : m
            )
          );
        }
      }

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Communication error occurred';
      setError(errorMessage);
      setIsLoading(false);
      
      // Remove the empty assistant placeholder on error
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
