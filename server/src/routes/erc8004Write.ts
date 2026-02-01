import { Router, Request, Response } from 'express';
import { config } from '../config';
import {
  saveAgentRegistration,
  saveFeedback,
  isValidWallet,
  isValidOrderId,
} from '../storage/hostedJsonStore';

export const erc8004WriteRouter = Router();

erc8004WriteRouter.post('/register', async (req: Request, res: Response) => {
  const { sellerWallet, name, description, category, location, pricing } = req.body ?? {};

  if (!sellerWallet || !isValidWallet(sellerWallet)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid or missing sellerWallet (0x + 40 hex chars)',
    });
    return;
  }
  if (!name || typeof name !== 'string') {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'name is required',
    });
    return;
  }
  if (!description || typeof description !== 'string') {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'description is required',
    });
    return;
  }

  try {
    const { registration } = await saveAgentRegistration(sellerWallet, {
      name,
      description: description || '',
      category: category || 'general',
      location,
      pricing,
    });

    const baseUrl = `http://localhost:${config.port}`;
    const agentURI = `${baseUrl}/agents/by-wallet/${sellerWallet.toLowerCase()}/registration.json`;

    res.json({
      success: true,
      data: {
        agentURI,
        registration,
      },
    });
  } catch (err) {
    console.error('[erc8004Write] register error:', err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: (err as Error).message,
    });
  }
});

erc8004WriteRouter.post('/feedback', async (req: Request, res: Response) => {
  const { orderId, buyerWallet, agentId, rating, comment } = req.body ?? {};

  if (!orderId || !isValidOrderId(orderId)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid or missing orderId',
    });
    return;
  }
  if (!buyerWallet || !isValidWallet(buyerWallet)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid or missing buyerWallet',
    });
    return;
  }
  if (!agentId || typeof agentId !== 'string') {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'agentId is required',
    });
    return;
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'rating must be a number between 1 and 5',
    });
    return;
  }

  try {
    const { feedback, feedbackHash } = await saveFeedback(orderId, buyerWallet, {
      agentId,
      rating,
      comment: comment || '',
    });

    const baseUrl = `http://localhost:${config.port}`;
    const feedbackURI = `${baseUrl}/feedback/${orderId}/${buyerWallet.toLowerCase()}.json`;

    res.json({
      success: true,
      data: {
        feedbackURI,
        feedbackHash,
        feedback,
      },
    });
  } catch (err) {
    console.error('[erc8004Write] feedback error:', err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: (err as Error).message,
    });
  }
});
