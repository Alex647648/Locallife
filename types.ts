
export enum OrderStatus {
  CREATED = 'CREATED',
  MATCHED = 'MATCHED',
  ACCEPTED = 'ACCEPTED',
  PAID = 'PAID',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  SETTLED = 'SETTLED',
  REFUNDED = 'REFUNDED'
}

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}

export interface Service {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  unit: string;
  tokenAddress?: string; // x402 tokenized service address
  supply?: number;
  imageUrl?: string; // Main service theme image
  avatarUrl?: string; // Service provider avatar
  lat?: number; // Latitude for map positioning
  lng?: number; // Longitude for map positioning
}

export interface Demand {
  id: string;
  buyerId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  timestamp: number;
  avatarUrl?: string;
  lat?: number; // Latitude for map positioning
  lng?: number; // Longitude for map positioning
}

export interface Order {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: OrderStatus;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AgentResponse {
  message: string;
  action?: 'onboard' | 'demand' | 'confirm_payment' | 'confirm_complete';
  data?: any;
}

export interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}
