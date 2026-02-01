# LocalLife Protocol (2026)
[🇨🇳 中文版](#中文版)

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
GEMINI_API_KEY=your_key
SEPOLIA_RPC_URL=your_rpc (optional)
```

**Frontend Config** (root `.env`):
```env
VITE_DYNAMIC_ENV_ID=your_dynamic_id
VITE_API_BASE_URL=http://localhost:3001
```

### 2. Install & Run

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
│   │   │   ├── erc8004.ts           # Agent list endpoint
│   │   │   ├── erc8004Write.ts      # Registration/feedback JSON hosting
│   │   │   └── hostedJson.ts        # On-chain pointer URI hosting
│   │   ├── services/
│   │   │   ├── geminiService.ts     # Gemini API service
│   │   │   └── erc8004Service.ts    # ethers v6 contract reading
│   │   └── storage/
│   │       ├── orderStore.ts        # x402 order storage
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

## 📚 Documentation

### Core Docs

- [Backend API Docs](./server/README.md) - Complete guide for backend API usage.
- [API Specification](./Instruction_docs/API_SPECIFICATION.md) - API interface standards and integration.
- [Project Analysis Report](./Instruction_docs/PROJECT_ANALYSIS.md) - Detailed analysis of project status.
- [Implementation Guide](./Instruction_docs/IMPLEMENTATION_GUIDE.md) - Instructions for feature fixes and implementation.

### Functional Docs

- [Protocol Documentation (English)](./Instruction_docs/DOCUMENTATION.md) - Detailed protocol features.
- [Protocol Documentation (Chinese)](./Instruction_docs/DOCUMENTATION_CN.md) - Detailed protocol features (CN version).
- [Backend Proposal](./Instruction_docs/BACKEND_PROPOSAL.md) - Backend tech stack selection.

### Development Docs

- [Development Best Practices](./Instruction_docs/DEVELOPMENT_BEST_PRACTICES.md) - Coding standards and workflow.
- [Production Deployment Guide](./PRODUCTION_GUIDE.md) - Complete production environment setup.
- [Deployment Checklist](./Instruction_docs/DEPLOYMENT_CHECKLIST.md) - Pre-deployment checks.
- [Security Fixes](./Instruction_docs/SECURITY_FIXES.md) - Details on security patches.

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

Contributions are welcome! Please check [Development Best Practices](./Instruction_docs/DEVELOPMENT_BEST_PRACTICES.md) for coding standards and development workflows.

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

---
---

<a id="中文版"></a>
# LocalLife Protocol（中文版）
[🇬🇧 English Version](#locallife-protocol-2026)

**ETHChiangmai 2026 黑客松参赛项目**

> 由 AI Agent、链上身份和可编程支付驱动的去中心化本地服务市场。

LocalLife 协议旨在桥接现实世界的本地服务与链上流动性。该项目专为 ETHChiangmai 2026 生态打造，使服务提供者能够转化为拥有可验证信誉的链上 Agent，并通过专用的 x402 协议接收即时的 USDC 支付。

---

## 📋 目录

- [核心愿景](#核心愿景)
- [功能特性](#功能特性)
- [技术架构](#技术架构)
- [智能合约](#智能合约)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [项目状态](#项目状态)
- [文档](#文档)
- [系统架构](#系统架构)
- [开发计划](#开发计划)
- [核心模块](#核心模块)

---

## 🎯 核心愿景

在传统的本地服务市场中，信任成本（Trust Cost）和中介抽成（Middleman Take-rate）极大地限制了服务提供者的收益和消费者的体验。LocalLife 通过以下技术栈解决这些痛点：

- **AI 交互层**: 替代繁琐的表单，通过自然语言 Agent 捕获用户意图
- **ERC-8004 身份与信誉层**: 链上 Agent 身份注册与不可篡改的信誉评价系统
- **x402 支付层**: 基于 HTTP 402 协议的 USDC 即时支付，使用 EIP-3009 实现无 Gas 授权转账

---

## ✨ 功能特性

### 已实现 ✅

- **AI Agent 对话系统**: 基于 Google Gemini 的流式对话，支持买家探索和卖家发布两种角色
- **服务市场**: 完整的服务资产展示、筛选和搜索功能
- **需求发布**: 买家可以发布需求意向，等待服务提供者响应
- **订单管理**: 完整的订单生命周期管理（CREATED → PAID → FULFILLED → SETTLED）
- **后端 API**: RESTful API 服务，支持所有核心功能
- **安全保护**: API Key 后端保护，输入验证，CORS 配置
- **响应式 UI**: 现代化的毛玻璃效果界面，支持地图可视化
- **ERC-8004 链上 Agent 身份**: IdentityRegistry 部署于 Ethereum Sepolia，服务提供者可注册为链上 Agent
- **ERC-8004 信誉系统**: ReputationRegistry 部署于 Ethereum Sepolia，支持 1-5 星评价与链上评论
- **x402 USDC 支付**: 基于 HTTP 402 协议在 Base Sepolia 上实现真实 USDC 支付（EIP-3009 无 Gas 授权转账）
- **Dynamic SDK + wagmi 钱包连接**: 多钱包支持，Sepolia 与 Base Sepolia 双链切换
- **链上交互 UI**: Agent 注册面板与信誉评价面板，支持真实链上交互

---

## 🏗️ 技术架构

### 前端

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS (Swiss-Grid 设计系统)
- **地图**: Leaflet
- **状态管理**: React Hooks + TanStack Query
- **Web3 钱包**: Dynamic SDK + wagmi + viem（多钱包连接与链交互）

### 后端

- **框架**: Express.js + TypeScript
- **验证**: Zod
- **AI**: Google Gemini API (@google/genai)
- **存储**: 内存存储（用于原型展示）
- **区块链**: ethers v6（ERC-8004 合约读取与交互）
- **通信**: Server-Sent Events (SSE) 流式响应

### Web3 (已集成) ✅

- **钱包连接**: Dynamic SDK + wagmi + viem
- **网络**: Ethereum Sepolia（ERC-8004 身份与信誉）+ Base Sepolia（x402 USDC 支付）
- **身份标准**: ERC-8004 (IdentityRegistry + ReputationRegistry)
- **支付协议**: x402 (HTTP 402 + EIP-3009 transferWithAuthorization)

---

## ⛓️ 智能合约

| 合约 | 地址 | 网络 |
|------|------|------|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Ethereum Sepolia |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | Ethereum Sepolia |
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Base Sepolia |

---

## 🚀 快速开始

### 前置要求

- Node.js 20+ (LTS)
- npm 或 yarn
- Google Gemini API Key ([获取地址](https://aistudio.google.com/app/apikey))
- Dynamic Labs 环境 ID ([获取地址](https://app.dynamic.xyz))

### 1. 配置环境变量

参考根目录和 `server/` 目录下的 `.env.example` 文件：

**后端配置** (`server/.env`):
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_key
SEPOLIA_RPC_URL=your_rpc (optional)
```

**前端配置** (根目录 `.env`):
```env
VITE_DYNAMIC_ENV_ID=your_dynamic_id
VITE_API_BASE_URL=http://localhost:3001
```

### 2. 安装与启动

```bash
# 安装依赖
npm install
cd server && npm install
cd ..

# 启动后端 (终端 1)
cd server && npm run dev

# 启动前端 (终端 2)
npm run dev
```

---

## 📁 项目结构

```
Locallife/
├── App.tsx                          # 主应用组件（Dynamic 钱包 + 预订 + 反馈）
├── types.ts                         # 类型定义（含 EIP1193Provider）
├── constants.ts                     # 模拟服务/需求数据
├── config/
│   ├── dynamic.ts                   # Dynamic SDK 配置
│   └── wagmi.ts                     # Wagmi 链配置（Sepolia + Base Sepolia）
├── providers/
│   └── DynamicProvider.tsx          # 钱包 Provider 堆栈
├── components/
│   ├── Home.tsx                     # 落地页与地图
│   ├── Marketplace.tsx              # 服务市场
│   ├── ChatWindow.tsx               # AI Agent 侧边栏
│   ├── MapModule.tsx                # Leaflet 地图模块
│   ├── AgentRegistrationPanel.tsx   # ERC-8004 Agent 注册
│   ├── FeedbackPanel.tsx            # 链上信誉评价
│   └── ...
├── hooks/
│   ├── useWallet.ts                 # Dynamic/wagmi 钱包状态
│   ├── useWalletAdapter.ts          # EIP-1193 桥接适配器
│   ├── useBooking.ts                # x402 支付流程
│   ├── useAgentRegistration.ts      # ERC-8004 Agent 铸造
│   └── useFeedback.ts              # ERC-8004 信誉提交
├── services/
│   ├── apiService.ts                # 后端 API 客户端
│   ├── x402Service.ts               # x402 支付协议（EIP-3009）
│   └── erc8004WriteService.ts       # 链上 ABI 编码
├── server/
│   ├── src/
│   │   ├── index.ts                 # Express 主服务器
│   │   ├── config.ts                # 合约地址与 RPC 配置
│   │   ├── contracts/abis.ts        # ERC-8004 ABI 片段
│   │   ├── routes/
│   │   │   ├── agent.ts             # AI Agent SSE 路由
│   │   │   ├── services.ts          # 服务 CRUD
│   │   │   ├── demands.ts           # 需求 CRUD
│   │   │   ├── orders.ts            # 订单 + x402 履行
│   │   │   ├── erc8004.ts           # Agent 列表端点
│   │   │   ├── erc8004Write.ts      # 注册/反馈 JSON 托管
│   │   │   └── hostedJson.ts        # 链上指针 URI 托管
│   │   ├── services/
│   │   │   ├── geminiService.ts     # Gemini API 服务
│   │   │   └── erc8004Service.ts    # ethers v6 合约读取
│   │   └── storage/
│   │       ├── orderStore.ts        # x402 订单存储
│   │       └── hostedJsonStore.ts   # Agent/反馈 JSON 存储
│   └── README.md           # 后端文档
├── Instruction_docs/       # 项目文档
└── README.md               # 本文件
```

---

## 📊 项目状态

### 当前阶段: **功能原型阶段 (Functional Prototype)**

| 模块 | 状态 | 说明 |
|------|------|------|
| 前端 UI | ✅ 完成 | 生产级 UI，功能完整 |
| AI Agent | ✅ 完成 | 流式对话，支持双角色 |
| 后端 API | ✅ 完成 | RESTful API，输入验证 |
| 数据存储 | ⚠️ 内存 | 使用内存存储，重启后丢失 |
| Web3 钱包 | ✅ 完成 | Dynamic SDK + wagmi 多钱包连接 |
| ERC-8004 身份 | ✅ 完成 | 链上 Agent 注册与信誉评价（Sepolia） |
| x402 支付 | ✅ 完成 | HTTP 402 USDC 支付（Base Sepolia） |

### 核心功能状态

- ✅ **AI 对话**: 完全功能，支持流式响应
- ✅ **服务管理**: CRUD 操作完整
- ✅ **需求管理**: 发布和查询功能完整
- ✅ **订单管理**: 完整生命周期（CREATED → PAID → FULFILLED → SETTLED）
- ✅ **钱包连接**: Dynamic SDK + wagmi，支持 Sepolia 和 Base Sepolia
- ✅ **链上身份**: ERC-8004 Agent 注册与元数据 URI 托管
- ✅ **链上信誉**: 不可篡改的 1-5 星评价系统
- ✅ **USDC 支付**: x402 协议，EIP-3009 无 Gas 授权转账
- ⚠️ **数据持久化**: 内存存储，重启后丢失

---

## 📚 文档

### 核心文档

- [后端 API 文档](./server/README.md) - 完整的后端 API 使用指南
- [API 规范](./Instruction_docs/API_SPECIFICATION.md) - API 接口规范与对接标准
- [项目分析报告](./Instruction_docs/PROJECT_ANALYSIS.md) - 详细的项目状态分析
- [实施指南](./Instruction_docs/IMPLEMENTATION_GUIDE.md) - 功能修复和实施说明

### 功能文档

- [协议文档 (英文)](./Instruction_docs/DOCUMENTATION.md) - 协议功能详述
- [协议文档 (中文)](./Instruction_docs/DOCUMENTATION_CN.md) - 协议功能详述（中文版）
- [后端架构建议](./Instruction_docs/BACKEND_PROPOSAL.md) - 后端技术栈选型

### 开发文档

- [开发最佳实践](./Instruction_docs/DEVELOPMENT_BEST_PRACTICES.md) - 代码规范和开发指南
- [生产部署指南](./PRODUCTION_GUIDE.md) - 完整的生产环境部署指南
- [部署检查清单](./Instruction_docs/DEPLOYMENT_CHECKLIST.md) - 部署前检查项
- [安全修复说明](./Instruction_docs/SECURITY_FIXES.md) - 安全修复详情

---

## 🗺️ 系统架构

```
用户 → Dynamic 钱包 → React 前端
                            ↓
                     Express 后端 (端口 3001)
                     ├── Gemini AI (聊天)
                     ├── ERC-8004 读取 (通过 ethers 连接 Sepolia)
                     └── x402 订单履行
                            ↓
              ┌─────────────┴─────────────┐
        Ethereum Sepolia            Base Sepolia
        (身份 + 信誉系统)           (USDC 支付结算)
```

---

## 🚀 开发计划

### 已完成 ✅

- [x] 集成 wagmi + viem 钱包连接
- [x] 实现 ERC-8004 链上身份标准
- [x] 实现 x402 USDC 支付协议
- [x] 完整的订单链上结算流程

### 短期 (P1) - 生产就绪

- [ ] 集成 PostgreSQL + Prisma ORM
- [ ] 集成 Redis（对话上下文存储）
- [ ] 添加 API 速率限制
- [ ] 添加单元测试（覆盖率 > 80%）
- [ ] 链上事件监听器 (Indexer)

### 长期 (P2) - 规模化

- [ ] 完整的测试覆盖（单元、集成、E2E）
- [ ] 性能优化和缓存策略
- [ ] 监控和日志系统
- [ ] CI/CD 流水线
- [ ] 生产环境部署

---

## 🎨 核心模块

### 2.1 Agent 终端 (核心交互)

买家和卖家的中央指挥中心。

- **Explore Agent (买家角色)**: 帮助用户发现本地服务（例如："帮我在古城找一个烹饪课"）。它使用语义匹配从市场中推荐服务。
- **Offer Agent (卖家角色)**: 引导本地服务提供者完成代币化过程，通过自然对话提取服务细节。
- **视觉效果**: 具有高斯模糊效果的"毛玻璃"容器、实时打字指示器和清晰的排版层次结构。

#### 探索代理 (Explore Agent)

面向买家的智能终端。通过语义识别和地理空间索引，帮助用户从去中心化市场中精准匹配符合需求的资产。

- **意图捕获**: 实时分析用户预算、位置和时间偏好
- **动态匹配**: 结合链上信誉分与物理距离进行最优推荐

#### 供给代理 (Offer Agent)

面向卖家的代币化助手。引导本地服务商将其技能、时间或资源转化为可交易的数字资产。

- **资产铸造 (Minting)**: 自动提取对话内容生成链上元数据（位置、类别、定价）
- **库存管理**: 通过 Agent 自动调整服务槽位的可用性

### 2.2 服务市场

"已验证资产"的视觉注册表。

- **资产筛选**: 按类别（烹饪、健康、教育等）搜索和筛选
- **可视化**: 每张卡片显示协议特定的数据，如 USDC 价格、位置和"已验证资产"状态徽章
- **行为**: 平滑的悬停动画和响应式网格布局（1 到 3 列）

### 2.3 协议配置 (Agent 设置)

用于管理底层 Agent 基础设施的专门面板。

- **推理引擎**: 支持多个 LLM 提供商（Gemini, OpenAI, Anthropic, DeepSeek 等）
- **运行模式**: 在 `Mock` (演示模拟) 和 `Testnet` (Sepolia 测试网) 环境之间切换
- **结算逻辑**: `自动` 或 `手动` 结算选项

### 2.4 链上支付与身份 (On-Chain Payment & Identity)

应用程序的信任与结算层。

- **ERC-8004 身份**: 服务提供者在 Ethereum Sepolia 上注册为链上 Agent，拥有可验证的元数据 URI
- **ERC-8004 信誉**: 买家提交不可篡改的链上评价（1-5 星 + 文字评论）
- **x402 支付**: 通过 HTTP 402 协议实现 Base Sepolia USDC 即时支付
- **订单生命周期**: `CREATED` → `PAID` (x402) → `FULFILLED` → `SETTLED`

### x402 协议标准

针对服务业优化的创新混合资产协议：

- **可替代性 (Fungibility)**: 服务计价单位标准化（如以 USDC 计价）
- **独特性 (Metadata)**: 包含地理坐标、履约时效、防伪凭证等不可篡改的元数据

---

## 🤝 贡献

欢迎贡献！请查看 [开发最佳实践](./Instruction_docs/DEVELOPMENT_BEST_PRACTICES.md) 了解代码规范和开发流程。

---

## 📄 许可证

本项目为 ETHChiangmai 2026 黑客松项目。

---

## 🌟 关于我们

LocalLife 坚持 Web3 的核心精神：

- **非托管 (Non-custodial)**: 协议不持有用户资金
- **透明性 (Transparency)**: 所有的服务资产元数据均在链上可查
- **Agentic**: 赋能个体，让每位本地劳动者都能拥有自己的链上代理

---

*Built with ❤️ for ETHChiangmai 2026*
