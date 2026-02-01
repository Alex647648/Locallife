import { Router, Request, Response } from 'express';
import { Order, OrderStatus } from '../types';
import { z } from 'zod';
import { x402OrderStore } from '../storage/orderStore';
import { config } from '../config';

export const ordersRouter = Router();

// In-memory storage (in production, use database)
const orders: Order[] = [];

// Validation schemas
const createOrderSchema = z.object({
  serviceId: z.string().min(1),
  buyerId: z.string().min(1),
  sellerId: z.string().optional(),
  amount: z.number().positive().optional()
});

const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

// GET /api/v1/orders/:id - Get specific order
ordersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Order with id ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to fetch order'
    });
  }
});

// POST /api/v1/orders - Create new order
ordersRouter.post('/', (req: Request, res: Response) => {
  try {
    const validationResult = createOrderSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: validationResult.error.errors
      });
    }
    
    const orderData = validationResult.data;
    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      serviceId: orderData.serviceId,
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId || '0xPending',
      amount: orderData.amount || 0,
      status: OrderStatus.CREATED,
      timestamp: Date.now()
    };
    
    orders.push(newOrder);
    
    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create order'
    });
  }
});

// PATCH /api/v1/orders/:id/status - Update order status
ordersRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationResult = updateOrderStatusSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid status',
        details: validationResult.error.errors
      });
    }
    
    const order = orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Order with id ${id} not found`
      });
    }
    
    order.status = validationResult.data.status;
    
    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to update order status'
    });
  }
});

// --- x402-style order creation and fulfillment ---

ordersRouter.post('/x402', (req: Request, res: Response) => {
  const { serviceId, buyerAddress, price, payTo } = req.body as {
    serviceId?: string;
    buyerAddress?: string;
    price?: string;
    payTo?: string;
  };

  if (!serviceId || !buyerAddress || !price) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Missing required fields: serviceId, buyerAddress, price',
    });
    return;
  }

  const sellerPayTo = payTo || config.defaultPayTo;
  const order = x402OrderStore.createOrder({ serviceId, buyerAddress, sellerPayTo, price });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      status: order.status,
      price: order.price,
      payTo: order.sellerPayTo,
      network: 'eip155:84532',
      asset: config.baseSepoliaUsdcAddress,
      createdAt: order.createdAt,
    },
  });
});

ordersRouter.post('/x402/:orderId/fulfill', (req: Request, res: Response) => {
  const orderId = typeof req.params.orderId === 'string'
    ? req.params.orderId
    : req.params.orderId[0];

  const order = x402OrderStore.getOrder(orderId);
  if (!order) {
    res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Order not found',
    });
    return;
  }

  if (order.status === 'CREATED') {
    res.status(402).json({
      success: false,
      error: 'PAYMENT_REQUIRED',
      message: 'Payment required before fulfillment',
      data: {
        orderId: order.id,
        price: order.price,
        payTo: order.sellerPayTo,
        network: 'eip155:84532',
        asset: config.baseSepoliaUsdcAddress,
      },
    });
    return;
  }

  res.json({ success: true, data: order });
});

ordersRouter.get('/x402/:orderId', (req: Request, res: Response) => {
  const orderId = typeof req.params.orderId === 'string'
    ? req.params.orderId
    : req.params.orderId[0];

  const order = x402OrderStore.getOrder(orderId);
  if (!order) {
    res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Order not found',
    });
    return;
  }

  res.json({ success: true, data: order });
});
