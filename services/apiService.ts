
import { Service, Demand, Order, OrderStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Standard API Response Wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

/**
 * Handle API errors consistently
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json().catch(() => ({
      success: false,
      error: 'UNKNOWN_ERROR',
      message: `HTTP ${response.status}: ${response.statusText}`
    }));
    throw new Error(errorData.message || errorData.error || 'API request failed');
  }
  
  const data: ApiResponse<T> = await response.json();
  if (!data.success) {
    throw new Error(data.message || data.error || 'API request failed');
  }
  
  return data.data as T;
}

export const apiService = {
  // --- Services (X402 Assets) ---
  async getServices(category?: string): Promise<Service[]> {
    try {
      const url = new URL(`${API_BASE}/services`);
      if (category) {
        url.searchParams.append('category', category);
      }
      const response = await fetch(url.toString());
      return await handleResponse<Service[]>(response);
    } catch (error) {
      console.error('[API] Error fetching services:', error);
      // Fallback to empty array for graceful degradation
      return [];
    }
  },

  async createService(serviceData: Partial<Service>): Promise<Service> {
    try {
      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      return await handleResponse<Service>(response);
    } catch (error) {
      console.error('[API] Error creating service:', error);
      throw error;
    }
  },

  // --- Demands ---
  async getDemands(): Promise<Demand[]> {
    try {
      const response = await fetch(`${API_BASE}/demands`);
      return await handleResponse<Demand[]>(response);
    } catch (error) {
      console.error('[API] Error fetching demands:', error);
      // Fallback to empty array for graceful degradation
      return [];
    }
  },

  async postDemand(demandData: Partial<Demand>): Promise<Demand> {
    try {
      const response = await fetch(`${API_BASE}/demands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demandData),
      });
      return await handleResponse<Demand>(response);
    } catch (error) {
      console.error('[API] Error posting demand:', error);
      throw error;
    }
  },

  // --- Escrow & Orders ---
  async createOrder(serviceId: string, buyerId: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId, buyerId }),
      });
      return await handleResponse<Order>(response);
    } catch (error) {
      console.error('[API] Error creating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      await handleResponse<Order>(response);
      return true;
    } catch (error) {
      console.error('[API] Error updating order status:', error);
      throw error;
    }
  }
};
