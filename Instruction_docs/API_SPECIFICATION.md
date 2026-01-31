# LocalLife 协议：后端对接与接口规范文档

## 1. 架构概述 (Architecture Overview)

LocalLife 采用典型的前后端分离 + 索引器 (Indexer) 架构。
- **前端**: React + Tailwind + Gemini AI SDK (Edge 侧)。
- **后端**: Node.js/Go 服务，处理业务逻辑、元数据存储及 AI 上下文持久化。
- **索引器**: 监听 Sepolia 测试网合约事件，维护本地缓存数据库。

## 2. 认证协议 (Authentication)

采用 **SIWE (Sign-In with Ethereum, EIP-4361)** 标准。

1. **获取 Nonce**: `GET /api/v1/auth/nonce` -> 返回随机字符串。
2. **签名验证**: `POST /api/v1/auth/verify` -> 前端发送签名消息 -> 返回 JWT。
3. **鉴权**: 之后所有请求 Header 需包含 `Authorization: Bearer <token>`。

---

## 3. 核心 API 接口定义

### 3.1 服务资产 (Services / X402)
| 路由 | 方法 | 说明 | 状态码 |
| :--- | :--- | :--- | :--- |
| `/api/v1/services` | GET | 查询市场服务，支持 category/location 过滤 | 200 |
| `/api/v1/services` | POST | 发布新服务。后端需同步生成 X402 元数据 JSON | 201 |
| `/api/v1/services/:id` | GET | 获取特定资产详情 | 200 |

### 3.2 需求意向 (Demands)
| 路由 | 方法 | 说明 | 关键参数 |
| :--- | :--- | :--- | :--- |
| `/api/v1/demands` | GET | 获取所有活跃需求 | - |
| `/api/v1/demands` | POST | 发布需求意向 | title, budget, expiry |

### 3.3 订单与托管 (Orders & Escrow)
| 路由 | 方法 | 说明 |
| :--- | :--- | :--- |
| `/api/v1/orders` | POST | 创建订单，后端初始化托管合约监听 |
| `/api/v1/orders/:id` | GET | 查询订单状态 (CREATED, PAID, SETTLED) |
| `/api/v1/orders/:id/tx` | PATCH | 更新交易哈希，供后端手动验证链上状态 |

---

## 4. AI Agent 通信协议 (WebSocket)

为了实现流式对话输出，推荐使用 WebSocket 或 SSE。

**连接地址**: `ws://api.locallife.io/v1/agent/chat`

**消息格式**:
```json
{
  "role": "user",
  "content": "帮我在清迈找一个泰拳训练营",
  "context": {
    "view": "explore",
    "location": "Chiang Mai"
  }
}
```

---

## 5. 链上数据同步 (Indexer Logic)

后端必须运行事件监听脚本，处理以下逻辑：
1. **监听 `X402Minted`**: 自动将新铸造的服务加入数据库。
2. **监听 `FundsLocked`**: 将对应 Order 状态更新为 `PAID`，触发前端通知。
3. **监听 `FundsReleased`**: 将 Order 状态更新为 `SETTLED`，完成闭环。

## 6. 错误处理标准

| 错误码 | 说明 |
| :--- | :--- |
| 401 | 未认证或签名过期 |
| 402 | 链上交易验证失败 |
| 422 | 参数校验失败 (如价格为负) |
| 500 | 内部服务错误 |

---
*LocalLife Protocol Specification v1.0*