# 后端技术栈与架构建议方案

本文档基于 `trae_adapted_project` 中的 L4 级开发规范，结合 LocalLife 项目的业务特点（地图、AI Agent、Web3 交易），提供后端技术栈选型与模块设计建议。

## 1. 技术栈选型 (Technology Stack)

### 1.1 核心框架 (Core Framework)
*   **推荐**: **NestJS (Node.js)**
*   **理由**:
    *   **统一语言**: 前后端均使用 TypeScript，类型定义 (`types.ts`) 可直接共享 (Monorepo 或 Shared Library)，减少接口不一致风险。
    *   **架构严谨**: NestJS 的模块化 (Module) 和依赖注入 (DI) 机制适合复杂的业务逻辑（如订单状态机、支付结算）。
    *   **生态丰富**: 拥有成熟的 TypeORM/Prisma 集成、WebSocket 网关（用于实时聊天/位置更新）和 Microservices 支持。
    *   **符合 SOP**: SOP L4 推荐 NestJS 用于需要长期维护的企业级/大型项目。

### 1.2 数据库 (Database)
*   **关系型数据库**: **PostgreSQL**
    *   **理由**: 处理复杂的订单关系、用户数据和地理空间数据 (PostGIS)。
    *   **ORM**: **Prisma** (推荐) 或 TypeORM。Prisma 的类型安全特性与 TypeScript 完美契合。
*   **缓存/消息队列**: **Redis**
    *   **理由**: 用于缓存热点服务数据、管理 Agent 对话上下文 (Session Store)、以及处理异步任务（如链上事件监听）。

### 1.3 AI 集成 (AI Integration)
*   **方案**: 后端作为 Gemini API 的代理 (Proxy)。
    *   **安全**: API Key 存储在后端环境变量 (`.env`)，绝不暴露给前端。
    *   **上下文管理**: 后端维护 `System Instructions` 和历史对话，前端仅发送用户增量消息。
    *   **流式转发**: 使用 Server-Sent Events (SSE) 或 WebSocket 将 Gemini 的流式响应转发给前端。

### 1.4 Web3 集成 (Web3 Integration)
*   **库**: **viem** 或 **ethers.js**。
*   **功能**: 监听链上事件 (Smart Contract Events)，同步链上状态（如 Escrow 锁定、结算）到本地数据库。

## 2. 功能模块划分 (Module Design)

建议采用 NestJS 的模块化结构：

```
src/
├── app.module.ts
├── auth/                 # 认证模块 (Wallet Connect / JWT)
├── users/                # 用户模块 (Profile, Reputation)
├── services/             # 服务模块 (Service Listings)
├── demands/              # 需求模块 (Demand Cards)
├── orders/               # 订单模块 (Escrow, Lifecycle)
├── agent/                # AI 代理模块 (Gemini Integration)
├── map/                  # 地理空间模块 (Location Search)
└── common/               # 共享守卫、拦截器、过滤器
```

### 2.1 核心模块详情

#### A. Auth Module (认证)
*   **机制**: SiWE (Sign-In with Ethereum) 或简单的钱包签名认证。
*   **输出**: JWT Token，用于后续 API 鉴权。

#### B. Agent Module (AI)
*   **职责**:
    *   接收前端聊天消息。
    *   根据用户角色 (Buyer/Seller) 组装 System Prompt。
    *   调用 Google Gemini API。
    *   解析 Gemini 返回的结构化数据 (JSON)，触发内部业务逻辑（如自动创建 Service/Demand）。

#### C. Order Module (订单)
*   **状态机**: 管理 `CREATED` -> `MATCHED` -> `ACCEPTED` -> `PAID` -> `COMPLETED` 状态流转。
*   **Web3 同步**: 监听链上 Escrow 合约事件，自动更新数据库订单状态。

## 3. 前后端对接标准 (API Standards)

### 3.1 接口规范
*   **风格**: RESTful API
*   **版本控制**: `/api/v1/...`
*   **数据格式**: JSON

### 3.2 统一响应结构
所有 API 必须遵循以下响应格式（参考 `apiService.ts` 中的定义并扩展）：

```typescript
// 成功响应 (HTTP 200/201)
{
  "success": true,
  "data": { ... },       // 具体业务数据
  "meta": {              // 分页或元数据 (可选)
    "total": 100,
    "page": 1,
    "limit": 10
  }
}

// 错误响应 (HTTP 4xx/5xx)
{
  "success": false,
  "error": "INVALID_INPUT",      // 错误码
  "message": "Price must be greater than 0", // 人类可读消息
  "details": [ ... ]             // 验证错误详情 (Zod issues)
}
```

### 3.3 关键 API 定义示例

#### 1. 服务 (Services)
*   `GET /api/v1/services`
    *   Query: `category`, `lat`, `lng`, `radius`
    *   Response: `Service[]`
*   `POST /api/v1/services`
    *   Body: `{ title, category, price, location, ... }`
    *   Auth: Required

#### 2. 需求 (Demands)
*   `GET /api/v1/demands`
*   `POST /api/v1/demands`

#### 3. 聊天 (Chat / AI)
*   `POST /api/v1/agent/chat`
    *   Body: `{ message: string, contextId: string }`
    *   Response: Stream (SSE) 或 JSON (如果非流式)

#### 4. 订单 (Orders)
*   `POST /api/v1/orders`
    *   Body: `{ serviceId }`
*   `GET /api/v1/orders/:id`

## 4. 下一步行动计划 (Action Plan)

1.  **初始化后端仓库**: 使用 NestJS CLI 初始化项目。
2.  **配置数据库**: 设置 PostgreSQL 和 Prisma Schema。
3.  **迁移 API**: 将前端 `apiService.ts` 中的 Mock 逻辑迁移到后端 Controller。
4.  **AI 迁移**: 将 `geminiService.ts` 逻辑移至后端 `AgentService`，保护 API Key。
5.  **联调**: 修改前端 `apiService.ts` 指向真实后端地址。
