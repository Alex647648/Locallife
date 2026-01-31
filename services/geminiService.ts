
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

export const getAgentResponseStream = async (
  messages: ChatMessage[],
  systemInstruction: string,
  model: string = 'gemini-3-flash-preview'
) => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert our ChatMessage format to Gemini's content format
  // Filter out system messages as they are passed via config
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
    return responseStream;
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
};

export const parseServiceJson = async (text: string) => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract the service information into JSON from this text. If information is missing, use null.\nText: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            location: { type: Type.STRING },
            price: { type: Type.NUMBER },
            unit: { type: Type.STRING }
          },
          required: ["title", "category", "location", "price", "unit"]
        }
      }
    });
    // The response.text property directly returns the string output.
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};
