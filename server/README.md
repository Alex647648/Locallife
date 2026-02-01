# LocalLife Backend API

后端服务，提供 RESTful API 和 AI Agent 流式响应。

## 安全修复

✅ **API Key 保护**: Gemini API Key 现在仅存储在后端环境变量中，不再暴露给前端
✅ **输入验证**: 使用 Zod 进行请求参数验证
✅ **错误处理**: 统一的错误响应格式
✅ **CORS 配置**: 限制前端来源

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置 `GEMINI_API_KEY`。

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

### 4. 生产构建

```bash
npm run build
npm start
```

## API 端点

### Agent (AI 对话)

- `POST /api/v1/agent/chat` - 流式 AI 对话 (SSE)
- `GET /api/v1/agent/context/:contextId` - 获取对话上下文

### Services (服务资产)

- `GET /api/v1/services` - 获取服务列表（支持 `category` 和 `location` 查询参数）
- `GET /api/v1/services/:id` - 获取特定服务
- `POST /api/v1/services` - 创建新服务

### Demands (需求)

- `GET /api/v1/demands` - 获取需求列表
- `POST /api/v1/demands` - 创建新需求

### Orders (订单)

- `GET /api/v1/orders/:id` - 获取订单详情
- `POST /api/v1/orders` - 创建新订单
- `PATCH /api/v1/orders/:id/status` - 更新订单状态

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

### 错误响应

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": [ ... ]
}
```

## 技术栈

- **框架**: Express.js + TypeScript
- **验证**: Zod
- **AI**: Google Gemini API (@google/genai)
- **存储**: 内存存储（生产环境应使用数据库）

## 注意事项

⚠️ **当前实现使用内存存储**，重启服务器后数据会丢失。生产环境应集成 PostgreSQL 或 MongoDB。

⚠️ **对话上下文**存储在内存中，生产环境应使用 Redis。

## 下一步

- [ ] 集成数据库（PostgreSQL + Prisma）
- [ ] 集成 Redis 用于对话上下文
- [ ] 实现 SIWE 认证
- [ ] 添加链上事件监听器
- [ ] 添加 API 速率限制
- [ ] 添加日志和监控
