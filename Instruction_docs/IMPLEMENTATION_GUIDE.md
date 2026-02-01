# 功能修复实施指南

本文档说明已实施的功能修复和如何使用修复后的系统。

## ✅ 已完成的修复

### 1. 后端服务实现 ✅

创建了完整的后端服务架构：
- **框架**: Express.js + TypeScript
- **API 端点**: Services, Demands, Orders, Agent
- **安全**: API Key 保护、输入验证、CORS 配置
- **流式响应**: SSE (Server-Sent Events) 支持

### 2. 前端服务层修复 ✅

- **apiService.ts**: 连接真实后端 API，统一错误处理
- **geminiService.ts**: 通过后端代理调用 AI，移除 API Key 暴露
- **Vite 配置**: 移除 API Key 注入，添加 API 代理

### 3. 安全性修复 ✅

- ✅ API Key 不再暴露在前端
- ✅ 输入验证（Zod）
- ✅ 统一错误处理
- ✅ CORS 配置

## 🚀 快速开始

### 步骤 1: 安装后端依赖

```bash
cd server
npm install
```

### 步骤 2: 配置后端环境变量

```bash
cd server
cp .env.example .env
```

编辑 `server/.env` 文件：

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_actual_api_key_here
```

**获取 Gemini API Key**: https://aistudio.google.com/app/apikey

### 步骤 3: 启动后端服务

```bash
cd server
npm run dev
```

后端将在 `http://localhost:3001` 启动。

### 步骤 4: 配置前端环境变量（可选）

```bash
# 在项目根目录
cp .env.example .env
```

编辑 `.env` 文件（如果需要自定义后端地址）：

```env
VITE_API_BASE_URL=http://localhost:3001
```

**注意**: 如果不设置，前端会使用默认值 `http://localhost:3001`。

### 步骤 5: 启动前端服务

```bash
# 在项目根目录
npm run dev
```

前端将在 `http://localhost:3000` 启动。

## 📡 API 端点

### Agent (AI 对话)

**POST** `/api/v1/agent/chat`
- 流式 AI 对话响应（SSE）
- Body: `{ messages, systemInstruction, model? }`
- Response: Server-Sent Events stream

**GET** `/api/v1/agent/context/:contextId`
- 获取对话上下文

### Services

**GET** `/api/v1/services?category=xxx&location=xxx`
- 获取服务列表

**GET** `/api/v1/services/:id`
- 获取特定服务

**POST** `/api/v1/services`
- 创建新服务
- Body: `{ title, description, category, location, price, unit, sellerId, ... }`

### Demands

**GET** `/api/v1/demands?category=xxx&location=xxx`
- 获取需求列表

**POST** `/api/v1/demands`
- 创建新需求
- Body: `{ title, description, category, location, budget, buyerId, ... }`

### Orders

**GET** `/api/v1/orders/:id`
- 获取订单详情

**POST** `/api/v1/orders`
- 创建新订单
- Body: `{ serviceId, buyerId, sellerId?, amount? }`

**PATCH** `/api/v1/orders/:id/status`
- 更新订单状态
- Body: `{ status: OrderStatus }`

## 🔄 数据流

### AI 对话流程

```
前端 (App.tsx)
  ↓ 调用 getAgentResponseStream()
前端服务层 (geminiService.ts)
  ↓ POST /api/v1/agent/chat (SSE)
后端路由 (server/src/routes/agent.ts)
  ↓ 调用 Gemini API
后端服务 (server/src/services/geminiService.ts)
  ↓ 流式响应
前端 (通过 SSE 接收)
```

### API 请求流程

```
前端组件
  ↓ 调用 apiService 方法
前端服务层 (apiService.ts)
  ↓ HTTP 请求
后端路由 (server/src/routes/*.ts)
  ↓ 验证和处理
内存存储 (未来: 数据库)
  ↓ 响应
前端组件
```

## 🛠️ 技术栈兼容性

### 前端
- ✅ React 19.2.4
- ✅ TypeScript 5.8.2
- ✅ Vite 6.2.0
- ✅ 保持原有组件和 UI 不变

### 后端
- ✅ Express.js 4.21.1
- ✅ TypeScript 5.8.2
- ✅ Zod 4.3.6 (验证)
- ✅ @google/genai 1.39.0 (AI)

## ⚠️ 注意事项

### 当前限制

1. **内存存储**: 数据存储在内存中，重启服务器后丢失
   - **解决方案**: 集成 PostgreSQL 或 MongoDB

2. **对话上下文**: 存储在内存中，不支持分布式部署
   - **解决方案**: 集成 Redis

3. **无认证**: 当前所有 API 端点都是公开的
   - **解决方案**: 实现 SIWE 认证

### 生产环境准备

- [ ] 集成数据库（PostgreSQL + Prisma）
- [ ] 集成 Redis（对话上下文）
- [ ] 实现 SIWE 认证
- [ ] 添加 API 速率限制
- [ ] 添加日志和监控
- [ ] 配置 HTTPS
- [ ] 设置环境变量管理（Secrets Manager）

## 🐛 故障排除

### 前端无法连接后端

1. 检查后端是否运行在 `http://localhost:3001`
2. 检查 `VITE_API_BASE_URL` 环境变量
3. 检查浏览器控制台的 CORS 错误
4. 检查后端日志

### AI 对话不工作

1. 检查 `server/.env` 中的 `GEMINI_API_KEY` 是否正确
2. 检查后端日志中的错误信息
3. 验证 API Key 是否有效

### 数据丢失

这是预期的，因为当前使用内存存储。重启服务器会清空所有数据。

## 📚 相关文档

- [SECURITY_FIXES.md](./SECURITY_FIXES.md) - 安全修复说明
- [server/README.md](./server/README.md) - 后端 API 文档
- [Instruction_docs/PROJECT_ANALYSIS.md](./Instruction_docs/PROJECT_ANALYSIS.md) - 项目分析报告
