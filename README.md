# LocalLife Protocol (2026)

> **Decentralized Local Service Coordination via AI-Driven Agentic Flows & X402 Asset Standards.**

LocalLife 是一个下一代点对点 (P2P) 协议，旨在将现实世界服务代币化并实现无需信任的自动化结算。专为 **ETHChiangmai** 生态系统构建，它弥合了非结构化本地需求与链上流动性之间的差距。

---

## 📋 目录

- [核心愿景](#核心愿景)
- [功能特性](#功能特性)
- [技术架构](#技术架构)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [项目状态](#项目状态)
- [文档](#文档)
- [开发计划](#开发计划)
- [核心模块](#核心模块)

---

## 🎯 核心愿景

在传统的本地服务市场中，信任成本（Trust Cost）和中介抽成（Middleman Take-rate）极大地限制了服务提供者的收益和消费者的体验。LocalLife 通过以下技术栈解决这些痛点：

- **AI 交互层**: 替代繁琐的表单，通过自然语言 Agent 捕获用户意图
- **X402 资产层**: 混合型代币标准，赋予服务资产流动性与链上元数据
- **Smart Escrow 结算层**: 非托管智能合约，确保资金仅在履约达成时释放

---

## ✨ 功能特性

### 已实现 ✅

- **AI Agent 对话系统**: 基于 Google Gemini 的流式对话，支持买家探索和卖家发布两种角色
- **服务市场**: 完整的服务资产展示、筛选和搜索功能
- **需求发布**: 买家可以发布需求意向，等待服务提供者响应
- **订单管理**: 完整的订单生命周期管理（CREATED → PAID → SETTLED）
- **后端 API**: RESTful API 服务，支持所有核心功能
- **安全保护**: API Key 后端保护，输入验证，CORS 配置
- **响应式 UI**: 现代化的毛玻璃效果界面，支持地图可视化

### 开发中 🚧

- **Web3 集成**: 钱包连接和智能合约交互（当前为模拟模式）
- **数据库持久化**: PostgreSQL + Prisma 集成
- **认证系统**: SIWE (Sign-In with Ethereum) 认证

---

## 🏗️ 技术架构

### 前端

- **框架**: React 19.2.4 + TypeScript 5.8.2
- **构建工具**: Vite 6.2.0
- **样式**: Tailwind CSS (Swiss-Grid 设计系统)
- **地图**: Leaflet
- **状态管理**: React Hooks + TanStack Query (部分)
- **AI 集成**: 通过后端代理调用 Gemini API

### 后端

- **框架**: Express.js 4.21.1 + TypeScript 5.8.2
- **验证**: Zod 4.3.6
- **AI**: Google Gemini API (@google/genai 1.39.0)
- **存储**: 内存存储（生产环境需集成数据库）
- **通信**: Server-Sent Events (SSE) 流式响应

### Web3 (计划中)

- **钱包**: wagmi + viem (待集成)
- **网络**: Sepolia 测试网
- **标准**: X402 代币标准
- **结算**: Smart Escrow 智能合约

---

## 🚀 快速开始

### 前置要求

- Node.js 20+ (LTS)
- npm 或 yarn
- Google Gemini API Key ([获取地址](https://aistudio.google.com/app/apikey))

### 1. 克隆项目

```bash
git clone <repository-url>
cd Locallife
```

### 2. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 3. 配置环境变量

**后端配置** (`server/.env`):

```bash
cd server
cp .env.example .env
```

编辑 `server/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

**前端配置** (可选，`.env`):

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 4. 启动服务

**启动后端** (终端 1):

```bash
cd server
npm run dev
```

后端将在 `http://localhost:3001` 启动。

**启动前端** (终端 2):

```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动。

### 5. 访问应用

打开浏览器访问 `http://localhost:3000`

---

## 📁 项目结构

```
Locallife/
├── components/              # React 组件
│   ├── ChatWindow.tsx      # AI 对话窗口
│   ├── Marketplace.tsx     # 服务市场
│   ├── DemandsBoard.tsx    # 需求看板
│   ├── MapModule.tsx       # 地图模块
│   └── ...
├── services/               # 前端服务层
│   ├── apiService.ts       # API 调用服务
│   └── geminiService.ts    # AI 服务（通过后端代理）
├── server/                 # 后端服务
│   ├── src/
│   │   ├── index.ts        # 主服务器文件
│   │   ├── routes/         # API 路由
│   │   │   ├── agent.ts    # AI Agent 路由
│   │   │   ├── services.ts # 服务路由
│   │   │   ├── demands.ts  # 需求路由
│   │   │   └── orders.ts   # 订单路由
│   │   └── services/       # 业务逻辑
│   │       └── geminiService.ts
│   └── README.md           # 后端文档
├── Instruction_docs/       # 项目文档
│   ├── API_SPECIFICATION.md
│   ├── BACKEND_PROPOSAL.md
│   ├── DOCUMENTATION.md
│   └── ...
├── App.tsx                 # 主应用组件
├── types.ts                # 类型定义
└── README.md               # 本文件
```

---

## 📊 项目状态

### 当前阶段: **混合原型阶段 (Hybrid Prototype)**

| 模块 | 状态 | 说明 |
|------|------|------|
| 前端 UI | ✅ 完成 | 生产级 UI，功能完整 |
| AI Agent | ✅ 完成 | 流式对话，支持双角色 |
| 后端 API | ✅ 完成 | RESTful API，输入验证 |
| 数据存储 | ⚠️ 内存 | 使用内存存储，需集成数据库 |
| Web3 集成 | ❌ 模拟 | 仅 UI 展示，无真实交互 |
| 认证系统 | ❌ 未实现 | 需实现 SIWE 认证 |
| 测试 | ❌ 未实现 | 需添加单元测试和集成测试 |

### 核心功能状态

- ✅ **AI 对话**: 完全功能，支持流式响应
- ✅ **服务管理**: CRUD 操作完整
- ✅ **需求管理**: 发布和查询功能完整
- ✅ **订单管理**: 状态流转完整
- ⚠️ **数据持久化**: 内存存储，重启后丢失
- ❌ **区块链交互**: 仅 UI 模拟

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

### 规范文档

- [AI 编程规则](./Instruction_docs/AI_RULES.md) - AI 编程约束和规则
- [功能修复总结](./Instruction_docs/FIXES_SUMMARY.md) - 已完成的修复总结

---

## 🗺️ 开发计划

### 短期 (P1) - 核心功能完善

- [ ] 集成 PostgreSQL + Prisma ORM
- [ ] 集成 Redis（对话上下文存储）
- [ ] 实现 SIWE (Sign-In with Ethereum) 认证
- [ ] 添加 API 速率限制
- [ ] 添加单元测试（覆盖率 > 80%）

### 中期 (P2) - Web3 集成

- [ ] 集成 wagmi + viem 钱包连接
- [ ] 实现 X402 代币标准
- [ ] 实现 Smart Escrow 智能合约
- [ ] 链上事件监听器 (Indexer)
- [ ] 完整的订单链上结算流程

### 长期 (P3) - 生产就绪

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

面向买家的智能终端。通过语义识别和地理空间索引，帮助用户从去中心化市场中精准匹配符合需求的 X402 资产。

- **意图捕获**: 实时分析用户预算、位置和时间偏好
- **动态匹配**: 结合链上信誉分与物理距离进行最优推荐

#### 供给代理 (Offer Agent)

面向卖家的代币化助手。引导本地服务商将其技能、时间或资源转化为可交易的 X402 数字资产。

- **资产铸造 (Minting)**: 自动提取对话内容生成链上元数据（位置、类别、定价）
- **库存管理**: 通过 Agent 自动调整服务槽位的可用性

### 2.2 服务市场

"已验证资产"的视觉注册表。

- **资产筛选**: 按类别（烹饪、健康、教育等）搜索和筛选
- **X402 可视化**: 每张卡片显示协议特定的数据，如 USDC 价格、位置和"已验证资产"状态徽章
- **行为**: 平滑的悬停动画和响应式网格布局（1 到 3 列）

### 2.3 协议配置 (Agent 设置)

用于管理底层 Agent 基础设施的专门面板。

- **推理引擎**: 支持多个 LLM 提供商（Gemini, OpenAI, Anthropic, DeepSeek 等）
- **运行模式**: 在 `Mock` (演示模拟) 和 `Testnet` (Sepolia 测试网) 环境之间切换
- **结算逻辑**: `自动` 或 `手动` 托管释放选项

### 2.4 DeFi 结算 (订单与托管)

应用程序的信任层。

- **活动合约**: 显示进行中的服务协议的生命周期
- **智能托管流程**: 资金锁定在非托管合约中 (`PAID`)，仅在买家确认后释放 (`SETTLED`)

### X402 协议标准

针对服务业优化的创新混合资产协议：

- **可替代性 (Fungibility)**: 服务计价单位标准化（如以 USDC 计价）
- **独特性 (Metadata)**: 包含地理坐标、履约时效、防伪凭证等不可篡改的元数据

### 智能托管结算 (Smart Escrow)

基于 Sepolia 测试网的非托管逻辑：

1. **创建 (Creation)**: 在链上发起订单
2. **锁定 (Lock)**: USDC 转移到托管合约
3. **结算 (Settlement)**: 履约证明触发资金释放或争议处理

---

## 🤝 贡献

欢迎贡献！请查看 [开发最佳实践](./Instruction_docs/DEVELOPMENT_BEST_PRACTICES.md) 了解代码规范和开发流程。

---

## 📄 许可证

本项目为 ETHChiangmai 黑客松项目。

---

## 🌟 关于我们

LocalLife 坚持 Web3 的核心精神：

- **非托管 (Non-custodial)**: 协议不持有用户资金
- **透明性 (Transparency)**: 所有的服务资产元数据均在链上可查
- **Agentic**: 赋能个体，让每位本地劳动者都能拥有自己的链上代理

---

*Built for ETHChiangmai*
