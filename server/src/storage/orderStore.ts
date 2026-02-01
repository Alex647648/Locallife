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

class X402OrderStore {
  private orders = new Map<string, X402Order>();

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
    this.orders.set(id, order);
    return order;
  }

  getOrder(orderId: string): X402Order | null {
    return this.orders.get(orderId) ?? null;
  }

  markPaid(orderId: string, txHash?: string, payerAddress?: string): X402Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    if (order.status === 'PAID' || order.status === 'COMPLETED') {
      if (txHash && !order.txHash) order.txHash = txHash;
      if (payerAddress && !order.payerAddress) order.payerAddress = payerAddress;
      return order;
    }

    order.status = 'PAID';
    order.paidAt = Date.now();
    if (txHash) order.txHash = txHash;
    if (payerAddress) order.payerAddress = payerAddress;
    return order;
  }
}

export const x402OrderStore = new X402OrderStore();
