
import { ChatMessage } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Get agent response stream from backend (SSE)
 * This replaces the direct Gemini API call to protect API keys
 */
export async function* getAgentResponseStream(
  messages: ChatMessage[],
  systemInstruction: string,
  model: string = 'gemini-3-flash-preview'
): AsyncGenerator<{ text: string }, void, unknown> {
  try {
    const response = await fetch(`${API_BASE}/agent/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemInstruction,
        model,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to connect to agent service');
    }

    // Parse SSE stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              yield { text: data.text };
            }
            if (data.error) {
              throw new Error(data.error);
            }
            if (data.done) {
              return;
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.warn('Failed to parse SSE data:', line);
          }
        }
      }
    }
  } catch (error) {
    console.error("Agent Streaming Error:", error);
    throw error;
  }
}

/**
 * Parse service JSON (kept for backward compatibility, but should be handled by backend)
 * @deprecated This should be handled by the backend agent service
 */
export const parseServiceJson = async (text: string) => {
  // This functionality should be moved to backend
  // For now, return null to indicate it's not available
  console.warn('parseServiceJson is deprecated. This should be handled by the backend agent.');
  return null;
};
