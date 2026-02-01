import { Router, Request, Response } from 'express';
import { getAgentResponseStream } from '../services/geminiService';
import { ChatMessage } from '../types';

export const agentRouter = Router();

// In-memory storage for conversation context (in production, use Redis)
const conversationContexts = new Map<string, ChatMessage[]>();

interface ChatRequest {
  messages: ChatMessage[];
  systemInstruction: string;
  model?: string;
  contextId?: string;
}

// POST /api/v1/agent/chat - SSE endpoint for streaming chat
agentRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction, model, contextId }: ChatRequest = req.body;

    if (!messages || !systemInstruction) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'messages and systemInstruction are required'
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Stream response
    try {
      const stream = getAgentResponseStream(messages, systemInstruction, model);
      let fullResponse = '';

      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          // Send chunk as SSE
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      // Store conversation context if contextId provided
      if (contextId) {
        const updatedMessages = [...messages, {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: fullResponse,
          timestamp: Date.now()
        }];
        conversationContexts.set(contextId, updatedMessages);
      }

      // Send completion signal
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (streamError: any) {
      console.error('Stream error:', streamError);
      res.write(`data: ${JSON.stringify({ error: streamError.message || 'Stream error' })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error('Agent chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message || 'Failed to process chat request'
      });
    }
  }
});

// GET /api/v1/agent/context/:contextId - Get conversation context
agentRouter.get('/context/:contextId', (req: Request, res: Response) => {
  const { contextId } = req.params;
  const messages = conversationContexts.get(contextId) || [];
  
  res.json({
    success: true,
    data: { messages }
  });
});
