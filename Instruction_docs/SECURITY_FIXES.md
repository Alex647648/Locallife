# 安全修复说明

本文档说明已实施的安全修复措施。

## 🔒 已修复的安全问题

### 1. API Key 暴露风险 ✅

**问题**: Gemini API Key 直接暴露在前端代码中，任何人都可以在浏览器中查看和使用。

**修复**:
- ✅ 将 Gemini API 调用移至后端服务
- ✅ API Key 仅存储在后端环境变量 (`server/.env`)
- ✅ 前端通过 SSE (Server-Sent Events) 接收流式响应
- ✅ 移除了 Vite 配置中的 API Key 注入

**影响**: 
- 前端不再需要 `GEMINI_API_KEY` 环境变量
- 所有 AI 请求现在通过后端代理，API Key 安全保护

### 2. 输入验证 ✅

**修复**:
- ✅ 后端使用 Zod 进行请求参数验证
- ✅ 统一的错误响应格式
- ✅ 类型安全的 API 接口

### 3. CORS 配置 ✅

**修复**:
- ✅ 后端配置了 CORS，限制前端来源
- ✅ 可通过 `FRONTEND_URL` 环境变量配置允许的来源

## 📋 环境变量变更

### 前端 (`.env`)

**移除**:
- ❌ `GEMINI_API_KEY` (不再需要)

**新增**:
- ✅ `VITE_API_BASE_URL` - 后端 API 地址（默认: `http://localhost:3001`）

### 后端 (`server/.env`)

**必需**:
- ✅ `GEMINI_API_KEY` - Gemini API 密钥（从 https://aistudio.google.com/app/apikey 获取）
- ✅ `PORT` - 后端服务端口（默认: 3001）
- ✅ `FRONTEND_URL` - 前端地址（用于 CORS，默认: `http://localhost:3000`）

## 🚀 使用说明

### 1. 启动后端服务

```bash
cd server
npm install
cp .env.example .env
# 编辑 .env 文件，填入 GEMINI_API_KEY
npm run dev
```

### 2. 启动前端服务

```bash
# 在项目根目录
npm install
cp .env.example .env
# .env 文件会自动使用默认值，或根据需要修改 VITE_API_BASE_URL
npm run dev
```

### 3. 验证连接

前端应能正常连接到后端 API。检查浏览器控制台和终端日志确认连接成功。

## ⚠️ 注意事项

1. **不要提交 `.env` 文件**: 确保 `.env` 在 `.gitignore` 中
2. **生产环境**: 使用环境变量管理工具（如 AWS Secrets Manager、HashiCorp Vault）存储敏感信息
3. **API 速率限制**: 考虑在后端添加速率限制以防止滥用
4. **HTTPS**: 生产环境必须使用 HTTPS

## 📝 后续改进建议

- [ ] 实现 SIWE (Sign-In with Ethereum) 认证
- [ ] 添加 API 速率限制
- [ ] 添加请求日志和监控
- [ ] 实现 API Key 轮换机制
- [ ] 添加请求签名验证
