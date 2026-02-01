import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { messageStore } from '../storage/messageStore';
import { x402OrderStore } from '../storage/orderStore';

export const messagesRouter = Router();

const sendMessageSchema = z.object({
  senderAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  content: z.string().min(1).max(2000),
});

messagesRouter.post('/:orderId/messages', (req: Request, res: Response) => {
  const orderId = typeof req.params.orderId === 'string'
    ? req.params.orderId
    : req.params.orderId[0];
  
  const order = x402OrderStore.getOrder(orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Order not found' });
  }

  const validation = sendMessageSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(422).json({ success: false, error: 'VALIDATION_ERROR', details: validation.error.issues });
  }

  const { senderAddress, content } = validation.data;
  
  const isBuyer = senderAddress.toLowerCase() === order.buyerAddress.toLowerCase();
  const isSeller = senderAddress.toLowerCase() === order.sellerPayTo.toLowerCase();
  
  if (!isBuyer && !isSeller) {
    return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Only buyer or seller can send messages' });
  }

  const role = isBuyer ? 'buyer' : 'seller';
  const msg = messageStore.addMessage(orderId, senderAddress, role as 'buyer' | 'seller', content);

  res.status(201).json({ success: true, data: msg });
});

messagesRouter.get('/:orderId/messages', (req: Request, res: Response) => {
  const orderId = typeof req.params.orderId === 'string'
    ? req.params.orderId
    : req.params.orderId[0];
  
  const order = x402OrderStore.getOrder(orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Order not found' });
  }

  const messages = messageStore.getMessages(orderId);
  res.json({ success: true, data: messages, meta: { total: messages.length } });
});
