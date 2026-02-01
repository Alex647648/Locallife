import { Router, Request, Response } from 'express';
import {
  getAgentRegistration,
  getFeedback,
  getWellKnownRegistrations,
  isValidWallet,
  isValidOrderId,
} from '../storage/hostedJsonStore';

export const hostedJsonRouter = Router();

hostedJsonRouter.get('/agents/by-wallet/:wallet/registration.json', async (req: Request, res: Response) => {
  const wallet = typeof req.params.wallet === 'string' ? req.params.wallet : req.params.wallet[0];

  if (!isValidWallet(wallet)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Wallet must be 0x followed by 40 hexadecimal characters',
    });
    return;
  }

  try {
    const data = await getAgentRegistration(wallet);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({ success: true, data });
  } catch (err) {
    console.error('[hostedJson] Error fetching agent registration:', err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve agent registration',
    });
  }
});

hostedJsonRouter.get('/feedback/:orderId/:buyerWallet.json', async (req: Request, res: Response) => {
  const orderId = typeof req.params.orderId === 'string' ? req.params.orderId : req.params.orderId[0];
  const buyerWallet = typeof req.params.buyerWallet === 'string' ? req.params.buyerWallet : req.params.buyerWallet[0];

  if (!isValidOrderId(orderId)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'OrderId must be 1-80 alphanumeric characters, hyphens, or underscores',
    });
    return;
  }

  if (!isValidWallet(buyerWallet)) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Wallet must be 0x followed by 40 hexadecimal characters',
    });
    return;
  }

  try {
    const data = await getFeedback(orderId, buyerWallet);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data });
  } catch (err) {
    console.error('[hostedJson] Error fetching feedback:', err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve feedback',
    });
  }
});

hostedJsonRouter.get('/.well-known/agent-registration.json', async (_req: Request, res: Response) => {
  try {
    const data = await getWellKnownRegistrations();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json({ success: true, data });
  } catch (err) {
    console.error('[hostedJson] Error fetching well-known registrations:', err);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve well-known registrations',
    });
  }
});
