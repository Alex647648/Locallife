# 草稿：ERC-8004 集成到 LocalLife

> **状态**：研究已完成；核心决策已确认；x402 网关后端选 Express；剩余少量产品/UX 选项待定
> **更新日期**：2026-02-01
> **背景**：ETHGlobal 2026 黑客松原型项目

---

## 项目现状

**LocalLife** 是一个面向清迈本地服务市场的 AI 优先 SPA 原型（React 19 + TypeScript + Vite）。

- 买家通过「探索代理」(Explore Agent，Gemini 驱动) 查找服务
- 卖家通过「供给代理」(Offer Agent) 将技能代币化
- 目前全部是假数据（`constants.ts` 中的 `MOCK_SERVICES`、`MOCK_DEMANDS`）
- 没有后端 — `services/apiService.ts` 全是桩函数，返回 `Promise.resolve(...)`
- 钱包集成是假的 — `WalletModal.tsx` 只是 UI 摆设
- 没有测试基础设施（无 jest/vitest/任何测试框架）

（补充：构建/环境变量现状）
- 当前通过 `vite.config.ts` 的 `define` 把 `process.env.API_KEY`（= `GEMINI_API_KEY`）编译期注入到前端 bundle
- 目前项目里没有 `.env` / `.env.example`，且 `.gitignore` 也未默认忽略 `.env*`（需要在计划里修复，避免误提交 key）

**目标**：集成 ERC-8004，让 **卖家 Agent** + **平台官方 Explore/Offer Agents** 获得**链上身份 + 声誉系统**。

**新增关注点（用户提出）**：
- 支付希望支持 **x402**（倾向用 **USDC**）
- 面向非技术用户：希望能在平台内一键/表单式完成 ERC-8004 Agent 注册与使用（无需写代码）；同时也要支持“厉害用户”带入/绑定自己已有的 Agent
- 用户举例希望支持外部 Agent：`https://openclaw.ai/`（或类似产品）

**实现风险提示（待确认）**：LocalLife 目前是纯前端原型；而 **x402 是 HTTP 402 paywall 模式**，严格意义上的端到端通常需要一个“服务端资源”来返回 402 并校验支付。是否允许新增一个最小后端/网关会影响实现方案。

**已识别风险（来自复盘清单）**：
- ERC-8004 Validation Registry 地址在不同资料来源中可能不一致；黑客松版本明确 **不使用 Validation**，避免依赖不确定地址
- `agent0-sdk` 文档与 npm 版本可能不一致；以 npm 实际版本为准，并在计划里先校验版本/API
- x402 存在 v1/v2 迁移与 headers 差异；黑客松版本以 v2（`@x402/*` + `PAYMENT-*` headers）为准
- 子图（The Graph）subgraph ID/endpoint 需要在计划中加入“可用性验证”任务（避免 ID 过期或 schema 变化）
- EIP-8004 对 endpoint domain verification 的 `.well-known` 规范（文件：`/.well-known/agent-registration.json`）：黑客松版本先走平台域名托管（不做复杂域名验证），并在计划里标注为风险/后续增强
- 双链（Sepolia 身份/声誉 + Base Sepolia 支付）对“网络切换/资金水龙头”的 UX 要求高：计划里会把切链提示与资金检查做成硬性验收项

---

## 研究成果（已确认）

### 1. ERC-8004 标准概述
- **3 个链上注册表**：
  - **Identity Registry**（身份注册表）— ERC-721 NFT，每个代理获得一个链上身份
  - **Reputation Registry**（声誉注册表）— 有符号定点数反馈，任何人都可以提交评价
  - **Validation Registry**（验证注册表）— TEE/zkML 验证器协调（仍在讨论中）
- EIP 草案状态，由来自 MetaMask、以太坊基金会、Google、Coinbase 的个人作者起草（避免将组织作为规范作者过度表述）
- 已有**官方发布的单例部署**（由核心团队维护）在 **以太坊主网** + **Sepolia 测试网**：
  - ✅ Identity Registry
  - ✅ Reputation Registry
  - ⚠️ Validation Registry：规范里有接口与合约实现，但官方仓库未发布稳定部署地址（仍在与 TEE 社区讨论）— **黑客松阶段跳过**
- 支付功能明确不在 ERC-8004 范围内（x402 是独立协议）

### 2. Agent0 SDK (`agent0-sdk`) — 主要集成路径
- TypeScript SDK（ESM 包）
- **版本以 npm 发布为准**（避免文档站点与仓库 HEAD/commit 不一致；该项目仍处于 beta）
  - 规划阶段不锁死具体版本号：在执行阶段以 `npm view agent0-sdk version` 结果为准，并在计划里加入“校验 API surface 与版本”的前置任务
- 备注：该包对 Node.js 版本有要求（本机建议按 npm `engines` 要求准备 Node 22+）；浏览器端使用不受 Node 版本约束
- **浏览器端可用**：通过 ERC-6963 钱包发现协议（支持 MetaMask、Rabby 等）
- **只读模式**：不需要钱包即可浏览市场数据
- 注册流程只需 5 行代码：
  ```typescript
  const sdk = new SDK({ chainId: 11155111, rpcUrl, walletProvider });
  const agent = sdk.createAgent(name, description, image);
  await agent.setA2A(endpoint);
  agent.setTrust(true, true, false);
  // 注意：registerHTTP 需要你先给出一个最终可访问的 URL。
  // 由于 agentId 是注册上链后才生成的，URL 不应依赖“尚未知晓的 agentId”。
  // 推荐用 sellerWallet 或随机 uuid 做稳定路径。
  const agentUri = `https://<gateway-host>/agents/by-wallet/<sellerWallet>/registration.json`;
  const tx = await agent.registerHTTP(agentUri); // 铸造 NFT + 设置 agentURI（HTTP）
  const { result } = await tx.waitConfirmed({ timeoutMs: 120_000 });
  ```
- 搜索 API：`sdk.searchAgents()`、`sdk.getAgent()`、`sdk.getReputationSummary()`（以实际 npm 版本 API 为准）
- 反馈 API：`sdk.giveFeedback(...)`（以实际 npm 版本 API 为准）
- **我们黑客松版本不依赖 IPFS**：agentURI/feedbackURI 走平台后端 HTTP 托管
- 源码：[github.com/agent0lab/agent0-ts](https://github.com/agent0lab/agent0-ts)

### 3. The Graph 子图 — 数据查询层
- 多链子图，索引所有 3 个注册表 + IPFS 链下数据
- 子图 ID（来源：ERC-8004 explorer demo）：`6wQRC7geo9XYAhckfmfo8kbMRLeWU8KQd3XsJqFKmZLT`
  - ⚠️ 该 ID 形式上是合法的 Graph Subgraph ID（Base58），但“是否仍对应 ERC-8004 数据”需要在执行阶段做可用性验证（避免 republish 导致 ID 变化）
  - 计划里会先用后端 + The Graph API key 验证查询是否可用（以及 schema 字段是否匹配）
- The Graph Gateway endpoint（两种方式二选一；建议后端用 Bearer，避免 key 出现在 URL/log）：
  - URL 带 key：`https://gateway.thegraph.com/api/<API_KEY>/subgraphs/id/<SUBGRAPH_ID>`
  - Bearer header：`https://gateway.thegraph.com/api/subgraphs/id/<SUBGRAPH_ID>` + `Authorization: Bearer <API_KEY>`
- 可用的 GraphQL 查询：代理列表、按名称搜索、按 MCP/A2A 协议过滤、代理详情+反馈+统计
- 黑客松版本读取路径：**后端代理 The Graph**（避免把 API key 暴露到前端）
- 生产环境需要 The Graph API key（已确认：需要创建，放后端环境变量）

补充说明：
- `agent0-sdk`/demo 仓库里存在默认子图 URL（包含公开的 demo API key），但该 key 可能随时被限流/吊销
- 黑客松方案：创建自己的 The Graph API key，并放在后端（不依赖 demo key）

### 4. 合约地址（Sepolia 测试网）

| 合约 | 地址 |
|------|------|
| Identity Registry（身份） | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry（声誉） | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| Validation Registry（验证） | （不使用；地址来源不确定，避免依赖） |

（参考：以太坊主网，供将来迁移时使用）

| 合约 | 地址 |
|------|------|
| Identity Registry（身份） | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| Reputation Registry（声誉） | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

### 5. 分析过的 Demo 仓库
- **demo-agent**（`Eversmile12/erc-8004-demo-agent`）：完整注册流程，OpenAI + Express A2A + MCP 服务器
- **explorer-demo**（`Eversmile12/erc-8004-agents-explorer-demo`）：Next.js 16 + React 19 + Tailwind + shadcn/ui，通过 `graphql-request` 查询子图 — **和 LocalLife 技术栈相同**
- **subgraph**（`agent0lab/subgraph`）：AssemblyScript 索引器，完整 GraphQL schema，8 个网络配置

### 6. 生态替代方案（已评估，不推荐用于 LocalLife）
- **ChaosChain**（Python）— 太重了，是多代理协作的问责/DKG 层
- **Lucid Agents / Daydreams**（TypeScript）— 商业化框架，有 x402 支付，但增加复杂度；通过 `@lucid-agents/identity` 支持 ERC-8004
- **create-8004-agent** CLI — 脚手架工具，生成新项目用的，不适合集成到已有项目

### 6.1 Coinbase CDP 文档 MCP Server（开发工具）
- 文档页：`https://docs.cdp.coinbase.com/get-started/develop-with-ai/setup/ai-mcp-setup`
- 作用：把 Coinbase CDP 文档接入支持 MCP 的 AI 工具（Claude/Cursor/VS Code），提供**文档搜索**能力
- MCP server URL：`https://docs.cdp.coinbase.com/mcp`
- 说明：当前只提供 doc `search`，**不会执行 API 调用**（更安全）
- 预期用途：在实现 x402/embedded wallets 等 CDP 相关能力时，用 AI 直接查 CDP 官方文档减少踩坑（不是产品功能本身）

### 7. 声誉系统细节
- 反馈是有符号定点数：`int128 value` + `uint8 valueDecimals`
- 示例标签（EIP 规范中的示例）：`starred`（0-100 质量评分）、`uptime`（在线率）、`responseTime`（响应时间）、`successRate`（成功率）、`revenues`（收入）
- 星级映射（来自 best-practices 仓库的建议，非 EIP 规范硬性规定）：1★=20、2★=40、3★=60、4★=80、5★=100（`tag1="starred"`）
- 防女巫机制：`getSummary()` 必须传入 `clientAddresses` — 你自己决定信任谁的评价
- 链上评分算法：WAD（18位小数）简单平均（sum/count），输出精度取众数
- 禁止自评：代理的 owner/operators 不能给自己评分

### 8. x402 支付协议（已确认：端到端真实支付）
- x402 是基于 HTTP 的支付协议：服务端用 **HTTP 402 Payment Required** 发起支付挑战
- 关键 Headers（我们采用 v2，按 Coinbase CDP 最新文档）：
  - `PAYMENT-REQUIRED`（Server → Client，base64 的支付要求）
  - `PAYMENT-SIGNATURE`（Client → Server，base64 的 PaymentPayload 对象）
  - `PAYMENT-RESPONSE`（Server → Client，结算确认信息）
- 兼容性说明：历史上存在 v1 的 `payment requirements` / `X-PAYMENT*` 等描述；黑客松版本以 v2 为准（因为我们客户端与服务端都可控），必要时网关可做“读取/容错”兼容
- **对“端到端”实现的含义**：必须有一个资源服务器（resource server）来返回 402，并在收到签名后做 verify/settle（推荐走 Facilitator）
- 测试网 Facilitator（无需 API key）：`https://x402.org/facilitator`
  - 支持网络（测试网）：**Base Sepolia `eip155:84532`**、Solana Devnet
  - 不支持 Ethereum Sepolia → 需要采用“双链”：ERC-8004 用 Ethereum Sepolia；x402 支付用 Base Sepolia
- 推荐 npm 包（TypeScript，x402 v2）：
  - Server：`@x402/express`（或 `@x402/hono` / `@x402/next`）
  - Client：`@x402/fetch`（或 `@x402/axios`）
  - EVM Scheme：`@x402/evm/exact/client` + `@x402/evm/exact/server`
  - Core：`@x402/core/*`（需要按 subpath import：`@x402/core/server`、`@x402/core/client`、`@x402/core/http`、`@x402/core/types` 等）
  - 备注：这些是 v2 的 scoped 包；对应 v1 的 `x402-express` / `x402-fetch` 等（见 CDP x402 migration guide）

实现要点（与本项目强相关）：
- v2 的 `PaymentOption.payTo` / `PaymentOption.price` 支持动态函数（可根据请求上下文计算），这使得“平台网关为不同卖家/不同订单动态收款地址与价格”成为可能
- 推荐网关实现为：
  - `POST /orders`：先创建订单（未支付），返回 `orderId` + 将要支付的金额/卖家收款地址
  - `POST /orders/[orderId]/fulfill`：该路由受 x402 保护；payTo/price 从订单里读取（动态）

（已验证版本）
- 已验证（本机 `npm view`）：`@x402/express` / `@x402/fetch` / `@x402/core` / `@x402/evm` 当前版本均为 `2.2.0`（2026-02-01）
- v1 legacy 包仍存在：`x402-express` / `x402-fetch` / `x402` 版本为 `1.1.0`（不采用）

### 9. Base Sepolia USDC 参数（x402 关键依赖）
- x402 在 EVM 上要求 token 支持 **EIP-3009**（Transfer With Authorization）
- Base Sepolia 测试网 USDC（EIP-3009）：`0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Base Sepolia USDC decimals：6
- Base 主网 USDC：`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`（黑客松不使用，仅记录）
- 需要在 UX 中明确：
  - Base Sepolia 需要测试 USDC（提供 faucet 指引）
  - Ethereum Sepolia 需要测试 ETH（用于注册/评价等链上交易）
  - Base Sepolia 是否需要测试 ETH 取决于支付路径：走 Facilitator 的 EIP-3009 授权模式时，付款方通常不需要自备 gas（但仍需要测试 USDC）

---

## 补强点（会影响实现的关键细节）

### A) HTTP agentURI 注册的“自举/回填”问题（必须写清楚）

你已经确认 agentURI 走 HTTP 且 URL 不能依赖未知 agentId；但要注意：EIP-8004 的 endpoint domain verification 机制要求 `/.well-known/agent-registration.json` 至少包含 `registrations` 列表（每条包含 `agentId` + `agentRegistry`），而完整 registration file 也通常包含 `registrations`。因此必须解决 “注册前不知道 agentId，但 registration.json/.well-known 文件里又需要 agentId” 的自举问题。

黑客松推荐方案（与我们已有后端网关契合）：
- agentURI 使用稳定路径：`/agents/by-wallet/<sellerWallet>/registration.json`
- 后端以 sellerWallet 为 key 存储 agentId（注册成功后回填）
- 同时提供 `/.well-known/agent-registration.json`（可选）：返回包含 `registrations` 的最小 JSON，用于 verifier 做 endpoint-domain 证明
- 注册流程：
  - 前端先确保该 URL 可访问（返回占位 JSON 也可）
  - 上链注册完成后，后端把 `registrations` 回填为真实 `agentId`
  - 若发现 SDK/生态在注册时强校验 registration.json，则改为“两步上链”：先 `register()` 拿到 agentId，再 `setAgentURI(agentId, url)`

### B) feedbackURI + feedbackHash（HTTP 托管时必须补齐完整性承诺）

黑客松方案里文字评价与订单/支付证明写入 `feedbackURI`（HTTP）。

重要澄清：EIP-8004 中 `feedbackHash` 是 **可选参数**；但当 `feedbackURI` 是 `https://...` 这种“非内容寻址”的 URL 时，**强烈建议**同时提交 `feedbackHash` 作为完整性承诺（推荐对 feedback.json 的 UTF-8 bytes 做 `keccak256`）。

建议：后端生成 feedback file（尽量用 compact JSON、无多余空白）→ 计算 `keccak256` → 返回 `(feedbackURI, feedbackHash)` 给前端 → 前端用 `giveFeedback(..., feedbackURI, feedbackHash)` 上链。

（补充：如果后续改用 IPFS/Arweave 这类内容寻址 URI，则 `feedbackHash` 可省略，传 `bytes32(0)`。）


---

## 技术决策（已通过研究确认）

| 决策项 | 选择 | 理由 |
|--------|------|------|
| **SDK** | `agent0-sdk` | 唯一成熟的 TS SDK，浏览器兼容，覆盖完整生命周期 |
| **ERC-8004 网络** | Ethereum Sepolia | 合约+子图已部署，免费测试网 |
| **x402 支付网络** | Base Sepolia | x402 Facilitator 唯一支持的 EVM 测试网 |
| **agentURI 托管** | 平台后端 HTTP | 黑客松避免引入 IPFS pinning 等额外 secret；链上仍可发现 |
| **ERC-8004 数据查询** | 后端代理 The Graph 子图 | API key 不暴露在前端；前端走自家 API |
| **Validation Registry** | 跳过 | 仍在讨论中，市场功能不需要 |
| **AI 模型** | 保持 Gemini（现有的） | 不需要换成 OpenAI；ERC-8004 是身份层，不是 AI 层 |

（用户决策补充）
- **外部 Agent 接入策略**：允许接入但标记“未验证”（鼓励后续补齐 ERC-8004 注册以获得可发现/可声誉）
- **带入已有 Agent（BYO）**：支持（推荐方案）— 最小实现：用户输入 `agentId`（可选 `agentURI`/A2A/MCP endpoint），绑定到个人资料/服务页面
- **x402 支付范围**：黑客松版本做到端到端真实支付（USDC）
- **链选择（已更新）**：**双链方案** — ERC-8004 身份/声誉用 Ethereum Sepolia，x402 支付用 Base Sepolia（Facilitator 限制）
- **x402 收款方**：买家直接付给卖家钱包（优先使用卖家 ERC-8004 `agentWallet`）
- **x402 服务端**：平台提供 x402 网关（Express 后端），替卖家托管 402 paywall；USDC 直接打到卖家钱包
- **x402 付费保护动作**：创建订单/预定（buy → pay → get orderId/receipt）
- **x402 Facilitator**：使用 `https://x402.org/facilitator`（测试网免费，无需 API key）
- **x402 npm 包**：`@x402/express`（服务端 middleware）、`@x402/evm`（EVM scheme）、`@x402/core`（facilitator client）
- **钱包支持**：外部钱包（MetaMask/Rabby）+ CDP Embedded Wallet（两者都支持）
- **CDP 服务端能力**：黑客松版本不使用（因此不需要 Secret API Key / Wallet Secret）
- **CDP 默认登录方式**：Email OTP（已定）
- **ERC-8004 上链范围**：卖家 + 平台 Explore/Offer（已定；买家不强制上链）
- **agentURI 托管方式**：平台后端托管 HTTP registration file（已定；黑客松不依赖 IPFS）
- **黑客松集成深度**：完整闭环（注册 → 浏览/搜索 → x402 下单/预定 → 完成后链上反馈）
- **ERC-8004 数据查询**：后端代理 The Graph 子图（已定；API key 放后端）
- **The Graph API key**：需要创建；配置在后端环境变量（不放前端）
- **反馈内容**：5 星评分 + 文字评价（评分链上 tag1=starred；文字/订单/支付回执写到后端 `feedbackURI`）
- **验证策略**：自动化 Smoke 验证（Playwright E2E + 后端 curl）（已定）

（默认/可调整）
- **Mock 数据策略**：链上/子图数据优先；mock 作为 fallback，并提供开关方便 demo
- **Offer Agent 注册 UX**：聊天生成服务信息 → 用户点击 “Publish/Register on-chain” 才触发 ERC-8004 注册（不做全自动上链）
- **Sepolia RPC**：优先用公开 RPC（例如 `https://ethereum-sepolia-rpc.publicnode.com`）；必要时再换 Infura/Alchemy

---

## 集成架构（提案 v2 — 双链 + x402 网关）

```
┌─────────────────────────────────────────────────────────────┐
│                    LocalLife 前端                              │
│                (React 19 + Vite + Tailwind)                   │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  市场浏览     │  供给代理     │  服务详情     │  购买/支付      │
│ (Marketplace)│ (Offer Agent)│ (Detail)     │  (Payment)     │
│              │              │              │                │
│ sdk.search   │ sdk.create   │ sdk.getAgent │ fetchWith      │
│ Agents()     │ Agent()      │ sdk.getRep   │ Payment()      │
│ (只读)       │ registerHTTP │ Summary()    │ (x402 客户端)   │
├──────────────┴──────────────┴──────────────┴────────────────┤
│           agent0-sdk (浏览器端) + x402-fetch (浏览器端)         │
│            ERC-6963 钱包发现 ←→ MetaMask / Rabby              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ Ethereum Sepolia ─────────┐  ┌─ Base Sepolia ──────────┐│
│  │ IdentityRegistry (身份)     │  │ USDC (测试代币)          ││
│  │ ReputationRegistry (声誉)   │  │ x402 Facilitator 结算   ││
│  └────────────────────────────┘  └──────────────────────────┘│
│                                                              │
├──────────────────────────────────────────────────────────────┤
│              LocalLife x402 网关 (新增后端)                     │
│              Express + @x402/express middleware                │
│              替卖家托管 402 paywall → USDC 直达卖家钱包          │
│              Facilitator: https://x402.org/facilitator         │
└──────────────────────────────────────────────────────────────┘
```

---

## 前端配置（需要补齐到实现/计划里）

> 目标：让同一个前端同时支持
> - 外部钱包（MetaMask/Rabby）
> - CDP Embedded Wallet（邮箱/社交登录）
>
> 同时能完成：ERC-8004 注册/查询（Ethereum Sepolia）+ x402 端到端支付（Base Sepolia）

### 1) 运行时配置来源
- **环境变量（推荐）**：Vite 使用 `import.meta.env.VITE_*`
- **UI 配置面板（可选）**：在现有 “Protocol Config / Settings” 页面里增加网络/开关配置（便于 demo）

### 2) 建议的环境变量（草案）

ERC-8004（身份/声誉，Ethereum Sepolia）：
- `VITE_ERC8004_CHAIN_ID=11155111`
- `VITE_ERC8004_RPC_URL=...`（只读查询用；写入走钱包 provider）
- `VITE_ERC8004_SUBGRAPH_ID=6wQRC7geo9XYAhckfmfo8kbMRLeWU8KQd3XsJqFKmZLT`
- （前端不放 The Graph API key）ERC-8004 列表/搜索/详情走后端代理接口

后端（x402 网关 + ERC-8004 数据代理）：
- `THEGRAPH_API_KEY=...`（需要创建；仅后端使用）
- `THEGRAPH_SUBGRAPH_ID=6wQRC7geo9XYAhckfmfo8kbMRLeWU8KQd3XsJqFKmZLT`
- `X402_FACILITATOR_URL=https://x402.org/facilitator`
- `X402_NETWORK=eip155:84532`
- `X402_ASSET_USDC=0x036CbD53842c5426634e7929541eC2318f3dCF7e`

x402（支付，Base Sepolia）：
- `VITE_X402_NETWORK=eip155:84532`
- `VITE_X402_FACILITATOR_URL=https://x402.org/facilitator`
- `VITE_X402_GATEWAY_URL=/x402`（同域反代/子路径，或完整 URL）
- `VITE_X402_ASSET_USDC=0x036CbD53842c5426634e7929541eC2318f3dCF7e`（Base Sepolia USDC，EIP-3009）

CDP Embedded Wallet（前端）：
- `VITE_CDP_PROJECT_ID=c83eb6a1-c501-4910-9043-642921ce74ff`
- `VITE_CDP_BASE_PATH=https://api.cdp.coinbase.com`
- （可选）`VITE_CDP_USE_MOCK=false`

CDP API Keys（说明）：
- **Secret API Key**：用于服务端→CDP 的 REST API 调用（必须保密，不能放前端）
- **Wallet Secret**：用于服务端钱包/预生成钱包等敏感操作（必须保密，不能放前端）
- **Client API Key**：用于客户端→CDP 的 JSON-RPC（可放前端）；但在很多 Embedded Wallets 的 React hooks 用法里，只用 `projectId` 即可

> 注意：
> - 以上变量名是建议命名（便于统一管理）；具体会根据你现有 `vite.config.ts` 的注入方式微调
> - 黑客松版本 `agentURI` 走后端 HTTP 托管，因此不依赖 IPFS；The Graph API key 也只放后端

### 3) 钱包模式（前端状态机）

统一抽象：`WalletMode = external | embedded`

外部钱包（MetaMask/Rabby）：
- 通过 ERC-6963 发现 provider（EIP-1193）
- 用该 provider：
  - 给 `agent0-sdk` 用于 ERC-8004 写交易（Sepolia）
  - 给 x402 client 用于签名（Base Sepolia，需要能 `signTypedData`）
- UX：需要提示用户在 **Sepolia**（注册/评价）与 **Base Sepolia**（支付）之间切换网络

CDP Embedded Wallet：
- 前端加 `CDPHooksProvider`（`projectId`, `basePath` 等）
- 使用 `useX402()` 得到 `fetchWithPayment`（嵌入式钱包对新手最友好）
- Embedded wallet 也能提供 EIP-1193 provider（`createCDPEmbeddedWallet`），可喂给 `agent0-sdk` 完成 ERC-8004 写交易

认证方式（hackathon 默认）：
- 使用 **Email OTP**（不接入 OAuth/custom JWT）

### 4) 前端如何配置 x402 客户端

两条路径（两者都支持）：
- **Embedded wallet 路径（推荐新手默认）**：`@coinbase/cdp-hooks` 的 `useX402` → `fetchWithPayment(url, options)`
- **外部钱包路径**：`@x402/fetch` + `@x402/evm/exact/client`，把外部钱包转换成 x402 的 signer

### 5) 前端如何配置 ERC-8004 客户端

- 只读（浏览市场）：用 `rpcUrl` + subgraph（不需要钱包）
- 写入（注册 agent / giveFeedback）：用当前选中的钱包 provider（external 或 embedded）

### 当前代码文件的集成触点

| 现有文件 | 集成内容 |
|---------|---------|
| `types.ts` | 添加 ERC-8004 类型（Agent、Feedback、AgentStats） |
| `services/apiService.ts` | 用真实 SDK 调用替换桩函数 |
| `constants.ts` | 保留 MOCK 数据作为降级方案；添加 SDK 初始化配置 |
| `App.tsx` | 添加钱包连接状态、SDK Context Provider |
| `components/WalletModal.tsx` | 用真实的 ERC-6963 钱包发现替换假的弹窗 |
| `components/ServiceCard.tsx` | 添加声誉徽章（星级 + 评价总数） |
| `components/Marketplace.tsx` | 从子图获取真实代理数据，和 mock 数据并存 |
| `components/ChatWindow.tsx` | 供给代理流程（Offer）：生成服务信息 → 用户点击发布/上链注册 |

---

## 待确认问题（可选；不阻塞计划）

### 锦上添花（可默认）
- N1. **8004scan.io 链接**：注册成功后是否显示「在 8004scan 上查看」的链接？（默认：是）

---

## 范围边界（初步，需在访谈中确认）

### 包含（INCLUDE）
- `agent0-sdk` 安装和初始化（浏览器端）
- 真实钱包连接（ERC-6963）替换假的 `WalletModal.tsx`
- x402 端到端真实支付（USDC on Base Sepolia）
- **新增 LocalLife x402 网关后端**（Express + `@x402/express`）
- 卖家代理通过供给代理流程进行链上注册（Ethereum Sepolia）
- 服务卡片上展示声誉（星级 + 评价数量）
- 市场页面从子图获取并浏览真实代理
- 外部 Agent 接入（允许但标记未验证）

### 排除（EXCLUDE，黑客松阶段）
- Validation Registry 集成
- ChaosChain / Lucid Agents 框架
- 后端/服务器端注册 ERC-8004（保持浏览器端注册）
- 主网部署（仅测试网）
- OASF 分类标签（之后再加）
- 自部署子图（使用现有 Sepolia 子图）
- 自建 Facilitator（使用 x402.org 免费测试网 Facilitator）

---

## 实现关键参考资料

| 资源 | 地址 | 用途 |
|------|------|------|
| agent0-sdk npm 包 | `npm install agent0-sdk` | 核心 SDK |
| SDK GitHub 仓库 | github.com/agent0lab/agent0-ts | API 参考、代码示例 |
| SDK 文档站 | sdk.ag0.xyz | 官方文档（JS 渲染的 SPA） |
| Demo 注册脚本 | github.com/Eversmile12/erc-8004-demo-agent/src/register.ts | 注册流程参考 |
| Explorer 子图查询 | github.com/Eversmile12/erc-8004-agents-explorer-demo/src/lib/subgraph.handler.ts | GraphQL 查询模板 |
| Explorer 类型定义 | github.com/Eversmile12/erc-8004-agents-explorer-demo/src/types/agent.ts | TypeScript 接口定义 |
| 最佳实践：注册 | github.com/erc-8004/best-practices/Registration.md | 代理注册四大黄金法则 |
| 最佳实践：声誉 | github.com/erc-8004/best-practices/Reputation.md | 反馈模式、星级映射 |
| 合约 ABI | github.com/erc-8004/erc-8004-contracts/abis/ | IdentityRegistry.json、ReputationRegistry.json |
| 子图查询示例 | github.com/agent0lab/subgraph/examples/queries.graphql | 完整 GraphQL 查询示例 |
| 8004scan 浏览器 | 8004scan.io | 查看已注册的代理 |
| EIP-8004 规范 | eips.ethereum.org/EIPS/eip-8004 | 正式规范文档 |
| ERC8004SPEC.md | github.com/erc-8004/erc-8004-contracts/ERC8004SPEC.md | 协议详细规范（433 行） |
| Coinbase CDP MCP Setup | https://docs.cdp.coinbase.com/get-started/develop-with-ai/setup/ai-mcp-setup | 把 CDP 文档接入 MCP（开发期文档搜索） |
| Coinbase CDP MCP URL | https://docs.cdp.coinbase.com/mcp | MCP 服务器地址（doc search） |
| x402 Welcome | https://docs.cdp.coinbase.com/x402/welcome | x402 协议总览 |
| x402 How it works | https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works | 402 challenge → 支付 → settle 全流程 |
| x402 Quickstart (Sellers) | https://docs.cdp.coinbase.com/x402/quickstart-for-sellers | 服务端加 402 paywall/middleware |
| x402 Quickstart (Buyers) | https://docs.cdp.coinbase.com/x402/quickstart-for-buyers | 客户端自动处理 402 支付 |
| x402 Network Support | https://docs.cdp.coinbase.com/x402/network-support | 测试网 facilitator 支持 Base Sepolia |
| CDP x402 Facilitator API | https://docs.cdp.coinbase.com/api-reference/v2/rest-api/x402-facilitator/x402-facilitator | verify/settle API 参考 |
| CDP Embedded Wallets Quickstart | https://docs.cdp.coinbase.com/embedded-wallets/quickstart | 嵌入式钱包 10 分钟上手 |
| CDP Embedded Wallets React Hooks | https://docs.cdp.coinbase.com/embedded-wallets/react-hooks | `CDPHooksProvider` 配置 + hooks 入口 |
| CDP `useX402` hook | https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks/Functions/useX402 | 嵌入式钱包侧的 x402 支付封装 |
| CDP `createCDPEmbeddedWallet` | https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core/Functions/createCDPEmbeddedWallet | 创建 EIP-1193 provider（可供 agent0-sdk 使用） |

---

## 测试策略决策
- **测试基础设施是否存在**：否（LocalLife 没有任何测试工具）
- **用户是否需要测试**：是（自动化 Smoke 验证）
- **QA 方式**：Playwright E2E（注册→下单→评价）+ 后端 curl 校验（x402 订单/网关）
