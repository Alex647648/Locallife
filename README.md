# LocalLife Protocol (2026)
[🇨🇳 中文版](./README_CN.md)

**ETHChiangmai 2026 Hackathon | Decentralized Local Service Marketplace**

LocalLife is a decentralized local service coordination protocol that bridges physical services with on-chain liquidity. Designed for the ETHChiangmai 2026 ecosystem, it enables service providers to transform into on-chain Agents with verifiable reputations, receiving instant USDC payments via the specialized x402 protocol.

---

## 📋 Table of Contents

- [Core Vision](#core-vision)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Project Status](#project-status)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Core Modules](#core-modules)

---

## 🎯 Core Vision

In traditional local service markets, trust costs and middleman take-rates severely limit both provider income and consumer experience. LocalLife solves these pain points through:

- **AI Interaction Layer**: Replace tedious forms with natural language Agents that capture user intent.
- **ERC-8004 Identity & Reputation Layer**: On-chain Agent identity registration and immutable reputation system.
- **x402 Payment Layer**: Instant USDC payments via HTTP 402 protocol, using EIP-3009 for gasless authorized transfers.

---

## ✨ Features

### Implemented ✅

- **AI Agent Chat System**: Streaming dialogue based on Google Gemini, supporting both Buyer Exploration and Seller Listing roles.
- **Service Marketplace**: Comprehensive display, filtering, and search functionality for service assets.
- **Demand Board**: Buyers can post requirements and wait for service provider responses.
- **Order Management**: Full order lifecycle management (CREATED → PAID → FULFILLED → SETTLED).
- **Backend API**: RESTful API service supporting all core functions.
- **Security**: API key protection, input validation, and CORS configuration.
- **Responsive UI**: Modern glassmorphism interface with map visualization support.
- **ERC-8004 On-Chain Agent Identity**: IdentityRegistry deployed on Ethereum Sepolia, allowing providers to register as on-chain Agents.
- **ERC-8004 Reputation System**: ReputationRegistry deployed on Ethereum Sepolia, supporting 1-5 star ratings and on-chain comments.
- **x402 USDC Payments**: Real USDC payments on Base Sepolia via HTTP 402 protocol (EIP-3009 gasless transfers).
- **Dynamic SDK + wagmi Wallet Connection**: Multi-wallet support with seamless switching between Sepolia and Base Sepolia.
- **Order Chat**: Buyer-seller messaging system per order (REST API + React component).
- **Seller Wallet Binding**: Services can specify a `walletAddress` for direct USDC payment routing.
- **On-Chain Interaction UI**: Dedicated panels for Agent registration and reputation feedback with real on-chain interactions.

---

## 🏗️ Tech Stack

### Frontend

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (Swiss-Grid Design System)
- **Map**: Leaflet
- **State Management**: React Hooks + TanStack Query
- **Web3 Wallet**: Dynamic SDK + wagmi + viem (Multi-wallet connection and chain interaction)

### Backend

- **Framework**: Express.js + TypeScript
- **Validation**: Zod
- **AI**: Google Gemini API (@google/genai)
- **Storage**: In-memory storage (for prototype demonstration)
- **Blockchain**: ethers v6 (ERC-8004 contract reading and interaction)
- **Communication**: Server-Sent Events (SSE) for streaming responses

### Web3 (Integrated) ✅

- **Wallet Connection**: Dynamic SDK + wagmi + viem
- **Networks**: Ethereum Sepolia (ERC-8004 Identity & Reputation) + Base Sepolia (x402 USDC Payments)
- **Identity Standard**: ERC-8004 (IdentityRegistry + ReputationRegistry)
- **Payment Protocol**: x402 (HTTP 402 + EIP-3009 transferWithAuthorization)

---

## ⛓️ Smart Contracts

| Contract | Address | Network |
|------|------|------|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Ethereum Sepolia |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | Ethereum Sepolia |
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Base Sepolia |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm or yarn
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))
- Dynamic Labs Environment ID ([Get it here](https://app.dynamic.xyz))

### 1. Environment Setup

Refer to the `.env.example` files in the root and `server/` directories:

**Backend Config** (`server/.env`):
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
PUBLIC_BASE_URL=http://localhost:3001
GEMINI_API_KEY=your_key
SEPOLIA_RPC_URL=your_rpc (optional)
FACILITATOR_URL=https://x402.org/facilitator
DEFAULT_PAY_TO=0x0000000000000000000000000000000000000000
```

**Frontend Config** (root `.env`):
```env
VITE_DYNAMIC_ENV_ID=your_dynamic_id
# Dev-only: Vite proxies /api/* to this backend origin
VITE_API_BASE_URL=http://localhost:3001
```

Notes:
- Frontend calls the API via relative paths under `/api/v1/*` (works in both dev proxy and production monolith).
- For production, set `FRONTEND_URL` and `PUBLIC_BASE_URL` to your deployed app URL (same origin as the server).

### 2. Development (two terminals)

```bash
# Install dependencies
npm install
cd server && npm install
cd ..

# Start Backend (Terminal 1)
cd server && npm run dev

# Start Frontend (Terminal 2)
npm run dev
```

### 3. Production / Railway (single monolith service)

The backend serves the built frontend (`dist/`) and exposes `/api/v1/*` from the same process.

```bash
npm install
npm run build
npm start
```

---

## 📁 Project Structure

```
Locallife/
├── App.tsx                          # Main app component (Dynamic wallet + booking + feedback)
├── types.ts                         # Type definitions (including EIP1193Provider)
├── constants.ts                     # Mock service/demand data
├── config/
│   ├── dynamic.ts                   # Dynamic SDK configuration
│   └── wagmi.ts                     # Wagmi chain config (Sepolia + Base Sepolia)
├── providers/
│   └── DynamicProvider.tsx          # Wallet provider stack
├── components/
│   ├── Home.tsx                     # Landing page and Map
│   ├── Marketplace.tsx              # Service marketplace
│   ├── ChatWindow.tsx               # AI Agent sidebar
│   ├── MapModule.tsx                # Leaflet map module
│   ├── AgentRegistrationPanel.tsx   # ERC-8004 Agent registration
│   ├── FeedbackPanel.tsx            # On-chain reputation feedback
│   ├── OrderChat.tsx                # Buyer-seller messaging per order
│   └── ...
├── hooks/
│   ├── useWallet.ts                 # Dynamic/wagmi wallet state
│   ├── useWalletAdapter.ts          # EIP-1193 bridge adapter
│   ├── useBooking.ts                # x402 payment flow
│   ├── useAgentRegistration.ts      # ERC-8004 Agent minting
│   └── useFeedback.ts              # ERC-8004 reputation submission
├── services/
│   ├── apiService.ts                # Backend API client
│   ├── x402Service.ts               # x402 payment protocol (EIP-3009)
│   └── erc8004WriteService.ts       # On-chain ABI encoding
├── server/
│   ├── src/
│   │   ├── index.ts                 # Express main server
│   │   ├── config.ts                # Contract addresses & RPC config
│   │   ├── contracts/abis.ts        # ERC-8004 ABI fragments
│   │   ├── routes/
│   │   │   ├── agent.ts             # AI Agent SSE routes
│   │   │   ├── services.ts          # Service CRUD
│   │   │   ├── demands.ts           # Demand CRUD
│   │   │   ├── orders.ts            # Orders + x402 fulfillment
│   │   │   ├── messages.ts          # Order messaging routes
│   │   │   ├── erc8004.ts           # Agent list endpoint
│   │   │   ├── erc8004Write.ts      # Registration/feedback JSON hosting
│   │   │   └── hostedJson.ts        # On-chain pointer URI hosting
│   │   ├── services/
│   │   │   ├── geminiService.ts     # Gemini API service
│   │   │   └── erc8004Service.ts    # ethers v6 contract reading
│   │   └── storage/
│   │       ├── orderStore.ts        # x402 order storage
│   │       ├── messageStore.ts      # Order messages storage
│   │       └── hostedJsonStore.ts   # Agent/feedback JSON storage
│   └── README.md           # Backend documentation
├── Instruction_docs/       # Project documentation
└── README.md               # This file
```

---

## 📊 Project Status

### Current Stage: **Functional Prototype**

| Module | Status | Description |
|------|------|------|
| Frontend UI | ✅ Completed | Production-grade UI, feature complete |
| AI Agent | ✅ Completed | Streaming chat, dual-role support |
| Backend API | ✅ Completed | RESTful API, input validation |
| Data Storage | ⚠️ In-memory | Using in-memory storage, lost on restart |
| Web3 Wallet | ✅ Completed | Dynamic SDK + wagmi multi-wallet connection |
| ERC-8004 Identity | ✅ Completed | On-chain Agent registration & reputation (Sepolia) |
| x402 Payments | ✅ Completed | HTTP 402 USDC payments (Base Sepolia) |

### Core Feature Status

- ✅ **AI Chat**: Fully functional, supporting streaming responses.
- ✅ **Service Management**: Complete CRUD operations.
- ✅ **Demand Management**: Full publishing and querying capabilities.
- ✅ **Order Management**: Complete lifecycle (CREATED → PAID → FULFILLED → SETTLED).
- ✅ **Wallet Connection**: Dynamic SDK + wagmi, supporting Sepolia and Base Sepolia.
- ✅ **On-Chain Identity**: ERC-8004 Agent registration with metadata URI hosting.
- ✅ **On-Chain Reputation**: Immutable 1-5 star rating system.
- ✅ **USDC Payments**: x402 protocol with EIP-3009 gasless transfers.
- ⚠️ **Data Persistence**: Currently in-memory, will be lost upon server restart.

---

## ⚠️ Known Gotchas / Important Notes

### Base Sepolia USDC EIP-712 Domain
The USDC contract on Base Sepolia returns `name()` = `"USDC"`, NOT `"USD Coin"` (which is what Base Mainnet uses). The `@x402/evm` SDK uses `extra.name` from PaymentRequirements as the EIP-712 domain name. If this doesn't match the contract's `DOMAIN_SEPARATOR`, `transferWithAuthorization` reverts silently (facilitator returns generic `transaction_failed`).

**Fix**: Set `extra.name: 'USDC'` for Base Sepolia.

- **USDC Contract**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **EIP-712 Domain**: `{ name: "USDC", version: "2", chainId: 84532 }`

---

## 📚 Documentation

- [Backend API Docs](./server/README.md) - Complete guide for backend API usage.
- [Project Analysis Report](./Instruction_docs/PROJECT_ANALYSIS.md) - Detailed analysis of project status.
- [Protocol Documentation (English)](./Instruction_docs/DOCUMENTATION.md) - Detailed protocol features.

---

## 🗺️ Architecture

```
User → Dynamic Wallet → React Frontend
                            ↓
                     Express Backend (port 3001)
                     ├── Gemini AI (chat)
                     ├── ERC-8004 reads (via ethers to Sepolia)
                     └── x402 order fulfillment
                            ↓
              ┌─────────────┴─────────────┐
        Ethereum Sepolia            Base Sepolia
        (Identity + Reputation)     (USDC Settlement)
```

---

## 🚀 Roadmap

### Completed ✅

- [x] Integrated wagmi + viem wallet connection.
- [x] Implemented ERC-8004 on-chain identity standard.
- [x] Implemented x402 USDC payment protocol.
- [x] Full on-chain settlement flow for orders.

### Short-term (P1) - Production Ready

- [ ] Integrate PostgreSQL + Prisma ORM.
- [ ] Integrate Redis (for chat context storage).
- [ ] Add API rate limiting.
- [ ] Add unit tests (> 80% coverage).
- [ ] On-chain event listener (Indexer).

### Long-term (P2) - Scaling

- [ ] Full test coverage (Unit, Integration, E2E).
- [ ] Performance optimization and caching strategies.
- [ ] Monitoring and logging systems.
- [ ] CI/CD pipelines.
- [ ] Production environment deployment.

---

## 🎨 Core Modules

### 2.1 Agent Terminal (Core Interaction)

The central command center for both buyers and sellers.

- **Explore Agent (Buyer Role)**: Helps users discover local services (e.g., "Find me a cooking class in the Old City"). It uses semantic matching to recommend services from the marketplace.
- **Offer Agent (Seller Role)**: Guides local service providers through the tokenization process, extracting service details via natural conversation.
- **Visuals**: "Glassmorphism" containers with Gaussian blur, real-time typing indicators, and clear typographic hierarchy.

#### Explore Agent
Smart terminal for buyers. Helps users accurately match assets from the decentralized marketplace through semantic recognition and geospatial indexing.

- **Intent Capture**: Real-time analysis of user budget, location, and time preferences.
- **Dynamic Matching**: Optimal recommendation combining on-chain reputation scores with physical distance.

#### Offer Agent
Tokenization assistant for sellers. Guides local service providers to transform their skills, time, or resources into tradable digital assets.

- **Asset Minting**: Automatically extracts conversation content to generate on-chain metadata (location, category, pricing).
- **Inventory Management**: Automatically adjusts service slot availability through the Agent.

### 2.2 Service Marketplace

A visual registry of "Verified Assets."

- **Asset Filtering**: Search and filter by category (Cooking, Health, Education, etc.).
- **Visualization**: Each card displays protocol-specific data like USDC price, location, and "Verified Asset" status badges.
- **Behavior**: Smooth hover animations and responsive grid layout (1 to 3 columns).

### 2.3 Protocol Configuration (Agent Settings)

Dedicated panel for managing the underlying Agent infrastructure.

- **Inference Engine**: Supports multiple LLM providers (Gemini, OpenAI, Anthropic, DeepSeek, etc.).
- **Operation Mode**: Switch between `Mock` (demonstration simulation) and `Testnet` (Sepolia testnet) environments.
- **Settlement Logic**: `Automatic` or `Manual` settlement options.

### 2.4 On-Chain Payment & Identity

The trust and settlement layer of the application.

- **ERC-8004 Identity**: Service providers register as on-chain Agents on Ethereum Sepolia with verifiable metadata URIs.
- **ERC-8004 Reputation**: Buyers submit immutable on-chain evaluations (1-5 stars + text reviews).
- **x402 Payment**: Instant USDC payments on Base Sepolia via HTTP 402 protocol.
- **Order Lifecycle**: `CREATED` → `PAID` (x402) → `FULFILLED` → `SETTLED`.

### x402 Protocol Standard

Innovative hybrid asset protocol optimized for the service industry:

- **Fungibility**: Standardized service pricing units (e.g., priced in USDC).
- **Uniqueness (Metadata)**: Includes immutable metadata such as geographic coordinates, fulfillment timing, and anti-counterfeiting credentials.

---

## 🤝 Contributing

Contributions are welcome!

---

## 📄 License

This project is created for the ETHChiangmai 2026 Hackathon.

---

## 🌟 About Us

LocalLife adheres to the core spirit of Web3:

- **Non-custodial**: The protocol does not hold user funds.
- **Transparency**: All service asset metadata is verifiable on-chain.
- **Agentic**: Empowering individuals, allowing every local worker to have their own on-chain agent.

---

*Built with ❤️ for ETHChiangmai 2026*
