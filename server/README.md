# LocalLife Backend API

LocalLife 协议的后端服务，提供 RESTful API 和 AI Agent 流式响应支持。

## 📋 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [注意事项](#注意事项)
- [后续计划](#后续计划)

---

## ✨ 功能特性

- ✅ **AI Agent 流式对话**: 基于 Google Gemini API 的 Server-Sent Events (SSE) 流式响应
- ✅ **服务资产管理**: 支持服务的创建、查询和筛选
- ✅ **需求管理**: 支持需求意向的发布和查询
- ✅ **订单管理**: 完整的订单生命周期管理（CREATED → PAID → SETTLED）
- ✅ **输入验证**: 使用 Zod 进行严格的请求参数验证
- ✅ **统一错误处理**: 标准化的 API 响应格式
- ✅ **CORS 支持**: 配置化的跨域资源共享
- ✅ **健康检查**: `/health` 端点用于服务监控

---

## 🚀 快速开始

### 前置要求

- Node.js 20+ (LTS)
- npm 或 yarn
- Google Gemini API Key ([获取地址](https://aistudio.google.com/app/apikey))

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
# 服务器配置
PORT=3001
FRONTEND_URL=http://localhost:3000

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

### 4. 验证服务

```bash
# 健康检查
curl http://localhost:3001/health

# 预期响应
{"status":"ok","timestamp":1234567890}
```

### 5. 生产构建

```bash
npm run build
npm start
```

---

## 📡 API 文档

### 基础信息

- **Base URL**: `http://localhost:3001/api/v1`
- **Content-Type**: `application/json`
- **响应格式**: 统一使用 JSON

### 健康检查

**GET** `/health`

检查服务运行状态。

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": 1704067200000
}
```

---

### Agent (AI 对话)

#### 流式对话

**POST** `/api/v1/agent/chat`

通过 Server-Sent Events (SSE) 提供流式 AI 对话响应。

**请求体**:
```json
{
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "帮我在清迈找一个泰拳训练营",
      "timestamp": 1704067200000
    }
  ],
  "systemInstruction": "You are a helpful assistant...",
  "model": "gemini-3-flash-preview",
  "contextId": "ctx-123" // 可选，用于持久化对话上下文
}
```

**响应** (SSE 流):
```
data: {"text":"我"}
data: {"text":"可以"}
data: {"text":"帮您"}
...
data: {"done":true}
```

**使用示例** (JavaScript):
```javascript
const eventSource = new EventSource('/api/v1/agent/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [...],
    systemInstruction: '...'
  })
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.text) {
    // 处理流式文本
  }
  if (data.done) {
    eventSource.close();
  }
};
```

#### 获取对话上下文

**GET** `/api/v1/agent/context/:contextId`

获取指定上下文的对话历史。

**响应示例**:
```json
{
  "success": true,
  "data": {
    "messages": [...]
  }
}
```

---

### Services (服务资产)

#### 获取服务列表

**GET** `/api/v1/services`

支持按 `category` 和 `location` 筛选。

**查询参数**:
- `category` (可选): 服务类别
- `location` (可选): 位置关键词

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "s-1234567890-abc123",
      "sellerId": "0x123...",
      "title": "泰拳训练营",
      "description": "...",
      "category": "Wellness",
      "location": "Chiang Mai",
      "price": 50,
      "unit": "USDC/hr",
      "timestamp": 1704067200000
    }
  ],
  "meta": {
    "total": 1,
    "filtered": false
  }
}
```

#### 获取特定服务

**GET** `/api/v1/services/:id`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "s-1234567890-abc123",
    "title": "泰拳训练营",
    ...
  }
}
```

**错误响应** (404):
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Service with id s-1234567890-abc123 not found"
}
```

#### 创建新服务

**POST** `/api/v1/services`

**请求体**:
```json
{
  "title": "泰拳训练营",
  "description": "专业的泰拳训练课程",
  "category": "Wellness",
  "location": "Chiang Mai",
  "price": 50,
  "unit": "USDC/hr",
  "sellerId": "0x123...",
  "tokenAddress": "0x456...", // 可选
  "supply": 10, // 可选
  "imageUrl": "https://...", // 可选
  "avatarUrl": "https://..." // 可选
}
```

**响应示例** (201):
```json
{
  "success": true,
  "data": {
    "id": "s-1234567890-abc123",
    "title": "泰拳训练营",
    ...
  }
}
```

**验证错误** (422):
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    {
      "path": ["price"],
      "message": "Expected number, received string"
    }
  ]
}
```

---

### Demands (需求)

#### 获取需求列表

**GET** `/api/v1/demands`

支持按 `category` 和 `location` 筛选。

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "d-1234567890-abc123",
      "buyerId": "0x789...",
      "title": "寻找泰拳教练",
      "description": "...",
      "category": "Wellness",
      "location": "Chiang Mai",
      "budget": 50,
      "timestamp": 1704067200000
    }
  ],
  "meta": {
    "total": 1
  }
}
```

#### 创建新需求

**POST** `/api/v1/demands`

**请求体**:
```json
{
  "title": "寻找泰拳教练",
  "description": "需要一位经验丰富的泰拳教练",
  "category": "Wellness",
  "location": "Chiang Mai",
  "budget": 50,
  "buyerId": "0x789...",
  "avatarUrl": "https://..." // 可选
}
```

---

### Orders (订单)

#### 获取订单详情

**GET** `/api/v1/orders/:id`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "ord-1234567890-abc123",
    "serviceId": "s-123...",
    "buyerId": "0x789...",
    "sellerId": "0x123...",
    "amount": 50,
    "status": "CREATED",
    "timestamp": 1704067200000
  }
}
```

#### 创建新订单

**POST** `/api/v1/orders`

**请求体**:
```json
{
  "serviceId": "s-123...",
  "buyerId": "0x789...",
  "sellerId": "0x123...", // 可选
  "amount": 50 // 可选
}
```

**响应示例** (201):
```json
{
  "success": true,
  "data": {
    "id": "ord-1234567890-abc123",
    "serviceId": "s-123...",
    "status": "CREATED",
    ...
  }
}
```

#### 更新订单状态

**PATCH** `/api/v1/orders/:id/status`

**请求体**:
```json
{
  "status": "PAID"
}
```

**可用状态**:
- `CREATED` - 已创建
- `MATCHED` - 已匹配
- `ACCEPTED` - 已接受
- `PAID` - 已支付
- `IN_SERVICE` - 服务中
- `COMPLETED` - 已完成
- `SETTLED` - 已结算
- `REFUNDED` - 已退款

---

## 🛠️ 技术栈

- **运行时**: Node.js 20+
- **框架**: Express.js 4.21.1
- **语言**: TypeScript 5.8.2
- **验证**: Zod 4.3.6
- **AI**: Google Gemini API (@google/genai 1.39.0)
- **开发工具**: tsx (热重载)

---

## 📁 项目结构

```
server/
├── src/
│   ├── index.ts              # 主服务器文件
│   ├── types.ts              # 类型定义（与前端共享）
│   ├── routes/               # API 路由
│   │   ├── agent.ts          # AI Agent 路由
│   │   ├── services.ts       # 服务资产路由
│   │   ├── demands.ts        # 需求路由
│   │   └── orders.ts         # 订单路由
│   └── services/             # 业务逻辑服务
│       └── geminiService.ts  # Gemini API 服务
├── dist/                     # 编译输出（生产构建）
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💻 开发指南

### 开发命令

```bash
# 开发模式（热重载）
npm run dev

# 类型检查
npm run type-check

# 生产构建
npm run build

# 启动生产服务器
npm start
```

### 代码规范

- 使用 TypeScript 严格模式
- 所有 API 端点必须使用 Zod 验证输入
- 统一使用 `ApiResponse<T>` 类型作为响应格式
- 错误处理使用统一的错误中间件

### 添加新路由

1. 在 `src/routes/` 创建新的路由文件
2. 使用 Zod 定义验证 schema
3. 在 `src/index.ts` 中注册路由
4. 更新本 README 的 API 文档部分

---

## ⚠️ 注意事项

### 当前限制

1. **内存存储**: 所有数据存储在内存中，重启服务器后数据会丢失
   - **生产环境**: 必须集成 PostgreSQL 或 MongoDB

2. **对话上下文**: 使用内存 Map 存储，不支持分布式部署
   - **生产环境**: 应使用 Redis 存储对话上下文

3. **无认证**: 当前所有 API 端点都是公开的
   - **生产环境**: 必须实现 SIWE (Sign-In with Ethereum) 认证

4. **无速率限制**: API 没有速率限制保护
   - **生产环境**: 应添加 express-rate-limit 中间件

5. **无日志系统**: 仅使用 console.log
   - **生产环境**: 应集成 Winston 或 Pino 进行结构化日志

### 安全建议

- ✅ API Key 存储在环境变量中，不提交到代码仓库
- ✅ 使用 Zod 进行输入验证，防止注入攻击
- ✅ CORS 配置限制前端来源
- ⚠️ 生产环境必须启用 HTTPS
- ⚠️ 生产环境应添加 API 速率限制
- ⚠️ 生产环境应实现认证和授权

---

## 🚧 后续计划

### 短期 (P1)

- [ ] 集成 PostgreSQL + Prisma ORM
- [ ] 集成 Redis 用于对话上下文存储
- [ ] 实现 SIWE (Sign-In with Ethereum) 认证
- [ ] 添加 API 速率限制中间件
- [ ] 添加结构化日志系统 (Winston/Pino)

### 中期 (P2)

- [ ] 添加单元测试和集成测试
- [ ] 实现链上事件监听器 (Indexer)
- [ ] 添加健康检查和就绪检查端点
- [ ] 实现数据库迁移脚本
- [ ] 添加 Prometheus 指标收集

### 长期 (P3)

- [ ] 性能优化和缓存策略
- [ ] 分布式部署支持
- [ ] API 文档自动生成 (Swagger/OpenAPI)
- [ ] 完整的监控和告警系统
- [ ] CI/CD 流水线配置

---

## 📚 相关文档

- [项目主文档](../README.md)
- [API 规范文档](../Instruction_docs/API_SPECIFICATION.md)
- [后端架构建议](../Instruction_docs/BACKEND_PROPOSAL.md)
- [安全修复说明](../Instruction_docs/SECURITY_FIXES.md)
- [实施指南](../Instruction_docs/IMPLEMENTATION_GUIDE.md)
- [生产部署指南](../PRODUCTION_GUIDE.md)

---

## 📝 更新日志

### v1.0.0 (当前版本)

- ✅ 基础 API 端点实现
- ✅ AI Agent 流式响应支持
- ✅ Zod 输入验证
- ✅ 统一错误处理
- ✅ CORS 配置
- ✅ 健康检查端点

---

*最后更新: 2026年*
