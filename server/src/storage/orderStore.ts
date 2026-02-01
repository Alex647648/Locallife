import fs from 'fs';
import path from 'path';

export interface X402Order {
  id: string;
  serviceId: string;
  buyerAddress: string;
  sellerPayTo: string;
  price: string;
  status: 'CREATED' | 'PAID' | 'COMPLETED';
  createdAt: number;
  paidAt?: number;
  txHash?: string;
  payerAddress?: string;
}

export interface CreateX402OrderInput {
  serviceId: string;
  buyerAddress: string;
  sellerPayTo: string;
  price: string;
}

const DATA_DIR = path.join(__dirname, '../../data');
const ORDERS_FILE = path.join(DATA_DIR, 'x402-orders.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

class X402OrderStore {
  private orders: X402Order[] = [];

  constructor() {
    this.load();
  }

  private load() {
    ensureDataDir();
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
        this.orders = JSON.parse(data);
      }
    } catch (err) {
      console.error('[x402OrderStore] Failed to load orders:', err);
      this.orders = [];
    }
  }

  private save() {
    ensureDataDir();
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(this.orders, null, 2), 'utf-8');
    } catch (err) {
      console.error('[x402OrderStore] Failed to save orders:', err);
    }
  }

  private generateId(): string {
    const ts = Date.now();
    const rand = Math.random().toString(36).substring(2, 8);
    return `ord-${ts}-${rand}`;
  }

  createOrder(input: CreateX402OrderInput): X402Order {
    const id = this.generateId();
    const order: X402Order = {
      id,
      serviceId: input.serviceId,
      buyerAddress: input.buyerAddress,
      sellerPayTo: input.sellerPayTo,
      price: input.price,
      status: 'CREATED',
      createdAt: Date.now(),
    };
    this.orders.push(order);
    this.save();
    return order;
  }

  getOrder(orderId: string): X402Order | null {
    return this.orders.find(o => o.id === orderId) ?? null;
  }

  markPaid(orderId: string, txHash?: string, payerAddress?: string): X402Order | null {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;

    if (order.status === 'PAID' || order.status === 'COMPLETED') {
      if (txHash && !order.txHash) order.txHash = txHash;
      if (payerAddress && !order.payerAddress) order.payerAddress = payerAddress;
      this.save();
      return order;
    }

    order.status = 'PAID';
    order.paidAt = Date.now();
    if (txHash) order.txHash = txHash;
    if (payerAddress) order.payerAddress = payerAddress;
    this.save();
    return order;
  }
}

export const x402OrderStore = new X402OrderStore();
