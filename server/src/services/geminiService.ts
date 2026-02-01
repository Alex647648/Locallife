import { GoogleGenAI, Type } from '@google/genai';
import { ChatMessage } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function* getAgentResponseStream(
  messages: ChatMessage[],
  systemInstruction: string,
  model: string = 'gemini-3-flash-preview'
): AsyncGenerator<{ text: string }, void, unknown> {
  // Convert ChatMessage format to Gemini's content format
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield { text: chunk.text };
      }
    }
  } catch (error) {
    console.error('Gemini Streaming Error:', error);
    throw error;
  }
}

export async function parseServiceJson(text: string): Promise<any> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract the service information into JSON from this text. If information is missing, use null.\nText: ${text}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            location: { type: Type.STRING },
            price: { type: Type.NUMBER },
            unit: { type: Type.STRING }
          },
          required: ['title', 'category', 'location', 'price', 'unit']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error('Parse Service JSON Error:', e);
    return null;
  }
}
