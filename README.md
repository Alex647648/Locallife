# LocalLife Protocol
**ETHChiangmai 2026 Hackathon Submission**

> Decentralized local service marketplace powered by AI agents, on-chain identity, and programmable payments.

LocalLife Protocol bridges the gap between physical local services and digital on-chain liquidity. Built for the ETHChiangmai 2026 ecosystem, it enables service providers to become on-chain agents with verifiable reputation and receive instant USDC payments through a specialized x402 protocol.

---

## ✅ What's Implemented

- **ERC-8004 On-Chain Agent Identity**: IdentityRegistry deployed on Ethereum Sepolia. Service providers register as on-chain agents with verifiable metadata URIs.
- **ERC-8004 Reputation System**: ReputationRegistry on Ethereum Sepolia. Enables immutable buyer feedback (1-5 stars + comments) linked to agent identities.
- **x402 USDC Payments**: A real HTTP 402 payment protocol implemented on Base Sepolia. Utilizes EIP-3009 `transferWithAuthorization` for gasless USDC transfers.
- **Dynamic SDK + wagmi**: Seamless multi-wallet connection and chain switching (Sepolia & Base Sepolia) via Dynamic Labs.
- **AI Chat Agent**: Integrated Google Gemini via SSE for streaming buyer (Explore) and seller (Offer) interactions.
- **Service Marketplace**: 16+ pre-loaded categories (Wellness, Tech, Food, etc.) with real-time search, filtering, and interactive Leaflet maps.
- **Demand Board**: Decentralized board for buyers to post requests and providers to respond.
- **Order Lifecycle**: Full state machine management: `CREATED` → `PAID` (via x402) → `FULFILLED` → `SETTLED`.
- **On-Chain UI**: Dedicated panels for Agent Registration (minting) and Feedback submission.

---

## 🏗️ Tech Stack

**Frontend:**
- **Core**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS (Glassmorphism design)
- **Web3**: Dynamic SDK, wagmi, viem
- **Maps**: Leaflet
- **Data**: TanStack Query

**Backend:**
- **Engine**: Express.js, TypeScript
- **AI**: Google Gemini API (SSE Streaming)
- **Blockchain**: ethers v6 (Contract reads/interaction)
- **Storage**: In-memory (Order persistence & JSON hosting)

---

## ⛓️ Smart Contracts

| Contract | Address | Network |
|----------|---------|---------|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Ethereum Sepolia |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | Ethereum Sepolia |
| USDC | Standard USDC | Base Sepolia |

---

## 📁 Project Structure

```
LocalLife/
├── App.tsx                          # Main app entry
├── components/
│   ├── Home.tsx                     # Landing & Map
│   ├── Marketplace.tsx              # Service grid
│   ├── ChatWindow.tsx               # AI Agent sidebar
│   ├── AgentRegistrationPanel.tsx   # ERC-8004 Registration
│   └── FeedbackPanel.tsx            # ERC-8004 Reputation
├── hooks/
│   ├── useWallet.ts                 # Wallet state logic
│   ├── useBooking.ts                # x402 payment flow
│   └── useFeedback.ts              # Reputation logic
├── services/
│   ├── x402Service.ts               # HTTP 402 / EIP-3009
│   └── erc8004WriteService.ts       # On-chain ABI encoding
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── erc8004.ts           # Agent endpoints
│   │   │   ├── orders.ts            # x402 fulfillment
│   │   │   └── agent.ts             # Gemini SSE chat
│   │   └── storage/
│   │       └── orderStore.ts        # x402 persistence
```

---

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   npm install
   cd server && npm install
   ```
2. **Environment Setup**:
   - `server/.env`: `GEMINI_API_KEY=...`, `PORT=3001`
   - root `.env`: `VITE_DYNAMIC_ENV_ID=...` (from Dynamic Labs)
3. **Run Services**:
   - Terminal 1 (Backend): `cd server && npm run dev`
   - Terminal 2 (Frontend): `npm run dev`
4. **Access**: Open `http://localhost:3000` and connect wallet.

---

## 🗺️ Architecture

```
User → Dynamic Wallet → React Frontend
                            ↓
                     Express Backend (port 3001)
                     ├── Gemini AI (chat)
                     ├── ERC-8004 reads (Sepolia via ethers)
                     └── x402 order fulfillment
                            ↓
              ┌─────────────┴─────────────┐
        Ethereum Sepolia            Base Sepolia
        (Identity + Reputation)     (USDC Payments)
```

---
---

# LocalLife Protocol (中文)
**ETHChiangmai 2026 黑客松参赛项目**

> 由 AI Agent、链上身份和可编程支付驱动的去中心化本地服务市场。

LocalLife 协议旨在桥接现实世界的本地服务与链上流动性。该项目专为 ETHChiangmai 2026 生态打造，使服务提供者能够转化为拥有可验证信誉的链上 Agent，并通过专用的 x402 协议接收即时的 USDC 支付。

---

## ✅ 已实现功能

- **ERC-8004 链上 Agent 身份**: 在 Ethereum Sepolia 上部署了 IdentityRegistry。服务提供者可注册为链上 Agent，并关联可验证的元数据 URI。
- **ERC-8004 信誉系统**: 在 Ethereum Sepolia 上部署了 ReputationRegistry。支持将不可篡改的买家反馈（1-5 星 + 评论）与 Agent 身份绑定。
- **x402 USDC 支付**: 在 Base Sepolia 上实现了真实的 HTTP 402 支付协议。使用 EIP-3009 `transferWithAuthorization` 实现无 Gas 的 USDC 转账。
- **Dynamic SDK + wagmi**: 通过 Dynamic Labs 实现无缝的多钱包连接和网络切换（Sepolia 与 Base Sepolia）。
- **AI 聊天 Agent**: 集成 Google Gemini API，通过 SSE 流式传输支持买家（探索）和卖家（发布）模式的自然语言交互。
- **服务市场**: 预载 16 个以上服务类别，支持实时搜索、过滤和基于 Leaflet 的交互式地图展示。
- **需求看板**: 去中心化看板，买家可发布服务需求，服务提供者可直接响应。
- **订单生命周期**: 完整的状态机管理：`已创建` → `已支付` (通过 x402) → `已履行` → `已结算`。
- **链上交互 UI**: 包含 Agent 注册面板和信誉评价面板，支持真实的链上交互。

---

## 🏗️ 技术栈

**前端:**
- **核心**: React 19, TypeScript, Vite 6
- **样式**: Tailwind CSS (毛玻璃设计风格)
- **Web3**: Dynamic SDK, wagmi, viem
- **地图**: Leaflet
- **数据**: TanStack Query

**后端:**
- **引擎**: Express.js, TypeScript
- **AI**: Google Gemini API (SSE 流式响应)
- **区块链**: ethers v6 (合约读取与交互)
- **存储**: 内存存储 (用于订单持久化与 JSON 托管)

---

## ⛓️ 智能合约

| 合约 | 地址 | 网络 |
|----------|---------|---------|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Ethereum Sepolia |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | Ethereum Sepolia |
| USDC | 标准 USDC | Base Sepolia |

---

## 📁 项目结构

```
LocalLife/
├── App.tsx                          # 应用主入口
├── components/
│   ├── Home.tsx                     # 落地页与地图
│   ├── Marketplace.tsx              # 服务网格
│   ├── ChatWindow.tsx               # AI Agent 侧边栏
│   ├── AgentRegistrationPanel.tsx   # ERC-8004 注册
│   └── FeedbackPanel.tsx            # ERC-8004 信誉反馈
├── hooks/
│   ├── useWallet.ts                 # 钱包状态逻辑
│   ├── useBooking.ts                # x402 支付流程
│   └── useFeedback.ts              # 信誉评价逻辑
├── services/
│   ├── x402Service.ts               # HTTP 402 / EIP-3009
│   └── erc8004WriteService.ts       # 链上 ABI 编码
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── erc8004.ts           # Agent 接口
│   │   │   ├── orders.ts            # x402 订单执行
│   │   │   └── agent.ts             # Gemini SSE 聊天
│   │   └── storage/
│   │       └── orderStore.ts        # x402 数据持久化
```

---

## 🚀 快速开始

1. **克隆并安装**:
   ```bash
   npm install
   cd server && npm install
   ```
2. **环境配置**:
   - `server/.env`: 设置 `GEMINI_API_KEY=...`, `PORT=3001`
   - 根目录 `.env`: 设置 `VITE_DYNAMIC_ENV_ID=...` (从 Dynamic Labs 获取)
3. **启动服务**:
   - 终端 1 (后端): `cd server && npm run dev`
   - 终端 2 (前端): `npm run dev`
4. **访问**: 打开 `http://localhost:3000` 并通过 Dynamic 连接钱包。

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

*Built with ❤️ for ETHChiangmai 2026*
