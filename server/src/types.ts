// Shared types with frontend
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
  tokenAddress?: string;
  supply?: number;
  imageUrl?: string;
  avatarUrl?: string;
  lat?: number;
  lng?: number;
  walletAddress?: string;  // Real Ethereum wallet for x402 payments
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
  lat?: number;
  lng?: number;
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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}
