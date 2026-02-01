
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
  reputation?: ReputationSummary;
  walletAddress?: string; // Real Ethereum wallet for x402 payments
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

export interface OrderMessage {
  id: string;
  orderId: string;
  senderAddress: string;
  senderRole: 'buyer' | 'seller';
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

// === ERC-8004 Agent Identity & Reputation Types ===

export interface ERC8004Agent {
  id: string;             // on-chain token ID
  owner: string;          // wallet address of agent owner
  agentURI: string;       // HTTP or IPFS URI to registration.json
  name: string;
  description: string;
  category?: string;
  location?: string;
  pricing?: string;
  protocols?: string[];   // e.g. ['a2a', 'mcp']
  createdAt?: string;
}

export interface ERC8004Feedback {
  id: string;
  agentId: string;
  sender: string;         // reviewer wallet
  value: number;          // decoded rating value (e.g. 20, 40, 60, 80, 100)
  valueDecimals: number;
  tag1: string;           // e.g. "starred"
  tag2: string;           // e.g. "locallife"
  feedbackURI: string;
  feedbackHash: string;
  timestamp?: number;
  comment?: string;       // from feedbackURI content
}

export interface ERC8004AgentStats {
  totalReviews: number;
  averageRating: number;  // 1-5 scale (derived from value/20)
  totalFeedbackValue: number;
}

export interface ReputationSummary {
  agentId: string;
  averageRating: number;  // 1-5 scale
  reviewCount: number;
  verified: boolean;      // whether agent is on-chain registered
}
