
import { Service, Demand, Order, OrderStatus } from '../types';

const API_BASE = '/api/v1';

/**
 * Standard API Response Wrapper
 */
interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: any;
}

export const apiService = {
  // --- Services (X402 Assets) ---
  async getServices(category?: string): Promise<Service[]> {
    // In production: fetch(`${API_BASE}/services?category=${category}`)
    console.log(`[API] Fetching services for category: ${category}`);
    return Promise.resolve([]); // Placeholder for actual fetch
  },

  async createService(serviceData: Partial<Service>): Promise<Service> {
    console.log('[API] Creating new X402 service asset', serviceData);
    return Promise.resolve(serviceData as Service);
  },

  // --- Demands ---
  async getDemands(): Promise<Demand[]> {
    console.log('[API] Fetching active demands');
    return Promise.resolve([]);
  },

  async postDemand(demandData: Partial<Demand>): Promise<Demand> {
    console.log('[API] Posting new user intent', demandData);
    return Promise.resolve(demandData as Demand);
  },

  // --- Escrow & Orders ---
  async createOrder(serviceId: string, buyerId: string): Promise<Order> {
    console.log('[API] Initializing Smart Escrow for service:', serviceId);
    return Promise.resolve({
      id: `ord-${Date.now()}`,
      serviceId,
      buyerId,
      sellerId: '0xPending',
      amount: 0,
      status: OrderStatus.CREATED,
      timestamp: Date.now()
    });
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    console.log(`[API] Syncing order ${orderId} status to ${status}`);
    return Promise.resolve(true);
  }
};
