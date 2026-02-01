# LocalLife Protocol - 产品介绍与功能说明

> **ETHChiangmai 2026 Hackathon 参赛项目**
>
> 由 AI Agent、链上身份（ERC-8004）和可编程支付（x402）驱动的去中心化本地服务市场协议。

---

## 一、产品概述

### 1.1 一句话介绍

**LocalLife** 是一个去中心化的本地生活服务撮合协议，它将现实世界的服务（如烹饪课、瑜伽、导游等）与链上流动性桥接，让每一位本地服务提供者都能拥有自己的链上 Agent 身份，并通过 USDC 即时收款。

### 1.2 产品定位

| 维度 | 说明 |
|------|------|
| **目标用户** | 清迈及周边地区的本地服务提供者（卖家）和旅行者/数字游牧民（买家） |
| **核心场景** | 本地生活服务的发现、撮合、支付与信誉积累 |
| **技术定位** | Web3 协议层 — 非托管、链上可验证、AI 原生 |
| **当前网络** | Ethereum Sepolia（身份与信誉）+ Base Sepolia（USDC 支付） |

### 1.3 产品愿景

在传统本地服务市场中，存在三个核心痛点：

| 痛点 | 传统方案 | LocalLife 方案 |
|------|----------|----------------|
| **信任成本高** | 依赖平台背书，用户评价不透明 | ERC-8004 链上身份 + 不可篡改的信誉评分 |
| **中介抽成重** | 平台抽取 15-30% 佣金 | 点对点直接交易，协议不持有资金 |
| **交互体验差** | 繁琐的表单和搜索 | AI Agent 自然语言交互，意图即服务 |

---

## 二、核心功能

### 2.1 AI Agent 对话系统

LocalLife 的核心交互入口。用户不需要填写复杂表单，只需通过自然语言与 AI Agent 对话即可完成所有操作。

#### 买家探索代理（Explore Agent）

帮助买家发现和匹配本地服务。

**使用场景示例**：
> **用户**：帮我在古城附近找一个泰餐烹饪课  
> **Agent**：我找到了几个不错的选择！这个"Authentic Thai Cooking Class"在古城区，45 USDC/节，评分很高，要看看吗？

**核心能力**：
- **意图捕获**：实时分析用户的预算、位置偏好和时间要求
- **语义匹配**：基于 Google Gemini 的智能服务推荐
- **需求发布**：当平台没有匹配的服务时，自动引导用户发布需求，等待服务提供者响应
- **卡片展示**：在对话中直接展示服务卡片，可一键预订

#### 卖家供给代理（Offer Agent）

帮助服务提供者将服务"代币化"上链。

**使用场景示例**：
> **用户**：我想上架我的泰语课  
> **Agent**：听起来很有趣！你的课程在清迈哪个区域？大概收费多少？  
> **用户**：在宁曼路，每小时 20 USDC  
> **Agent**：我先帮你看看有没有人正在找泰语课... 找到了！有个人在发布"Thai-English Language Exchange Partner"的需求，要不要联系他？

**核心能力**：
- **对话式上架**：通过 3-5 轮自然对话完成服务信息收集
- **需求匹配**：自动搜索平台上与卖家服务匹配的买家需求
- **卡片预览**：生成服务卡片预览，卖家确认后正式上架
- **地理定位**：自动将位置信息转换为地图坐标，在地图上展示

#### 技术实现
- 基于 Google Gemini API 的流式对话（Server-Sent Events）
- 支持 JSON Action 指令嵌入（show_service、create_demand 等）
- 对话上下文自动携带平台服务/需求数据，实现智能推荐

---

### 2.2 服务市场（Marketplace）

服务资产的可视化注册表，展示所有已上架的本地服务。

**功能清单**：

| 功能 | 说明 |
|------|------|
| **分类筛选** | 按 Culinary / Wellness / Education / Tours / Digital 五大类别筛选 |
| **搜索** | 支持关键词搜索服务标题和描述 |
| **服务卡片** | 展示服务图片、USDC 价格、位置、提供者头像、信誉徽章 |
| **一键预订** | 直接从卡片发起 x402 USDC 支付 |
| **响应式布局** | 自适应 1-3 列网格布局，带悬停动画效果 |

**服务类别详情**：

| 类别 | 典型服务 | 价格区间 |
|------|----------|----------|
| Culinary（烹饪） | 泰餐烹饪课、夜市美食之旅、茶艺体验、咖啡庄园参观 | 35-75 USDC |
| Wellness（健康） | 传统泰式瑜伽、泰拳训练、草药按摩 | 25-40 USDC |
| Education（教育） | 泰语速成课、兰纳竹编、兰纳传统舞蹈、青瓷陶艺 | 20-45 USDC |
| Tours（旅游） | 因他农日出徒步、大象保护区、漂流探险、寺庙摄影团 | 15-120 USDC |
| Digital（数字） | Solidity 审计、UI/UX 设计、播客工作室、联合办公 | 12-800 USDC |

---

### 2.3 需求看板（Demands Board）

买家主动发布需求，等待服务提供者响应的双向撮合机制。

**功能清单**：

| 功能 | 说明 |
|------|------|
| **需求发布** | 通过 AI Agent 对话或直接表单发布需求 |
| **需求展示** | 卡片式展示需求标题、预算、类别、位置 |
| **分类浏览** | 按类别筛选需求 |
| **地图标注** | 需求位置在地图上可视化展示 |

---

### 2.4 地理空间注册表（Geospatial Registry）

基于 Leaflet 的交互式地图模块，可视化展示清迈地区所有服务和需求的地理分布。

**功能清单**：
- 服务和需求在地图上以标记点展示
- 点击标记可查看详细信息
- 支持服务/需求的切换显示
- 与 AI Agent 联动 — Agent 推荐的服务会在地图上高亮聚焦

---

### 2.5 ERC-8004 链上身份系统

基于 ERC-8004 标准的链上 Agent 身份注册与信誉系统，部署在 Ethereum Sepolia 测试网。

#### Agent 身份注册

服务提供者可以在链上注册为 Agent，获得不可篡改的链上身份。

**注册流程**：
1. 连接钱包（支持 MetaMask 等多种钱包）
2. 填写 Agent 信息（名称、描述、类别、位置、定价、支持的协议）
3. 后端生成元数据 JSON 并托管（提供 URI）
4. 调用 IdentityRegistry 合约的 `registerAgent` 方法
5. 链上铸造 Agent Token，绑定元数据 URI

**链上数据结构**：
```
Agent Token
├── owner: 钱包地址
├── agentURI: 元数据 URI（指向 JSON 文件）
├── name: Agent 名称
├── description: 描述
├── category: 服务类别
├── location: 位置
├── pricing: 定价信息
└── protocols: 支持的协议（如 a2a、mcp）
```

#### 链上信誉评价

买家可以对完成服务的 Agent 提交链上评价，评价一旦上链即不可修改。

**评价系统**：
- **评分**：1-5 星（链上存储为 20-100 的数值，除以 20 得到星级）
- **评论**：文字评论通过 URI 存储
- **标签**：支持 "starred"、"locallife" 等分类标签
- **不可篡改**：评价写入 ReputationRegistry 合约，永久存储

**智能合约地址**：

| 合约 | 地址 | 网络 |
|------|------|------|
| IdentityRegistry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Ethereum Sepolia |
| ReputationRegistry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` | Ethereum Sepolia |

---

### 2.6 x402 USDC 支付系统

基于 HTTP 402 协议的 USDC 即时支付系统，部署在 Base Sepolia 测试网。

#### 支付流程

```
买家发起预订
    ↓
创建订单（状态: CREATED）
    ↓
x402 协议构建支付请求
    ↓
EIP-3009 transferWithAuthorization（无 Gas 授权转账）
    ↓
USDC 从买家钱包转入卖家地址
    ↓
订单状态更新为 PAID
    ↓
服务完成后 → FULFILLED → SETTLED
```

**关键特性**：

| 特性 | 说明 |
|------|------|
| **即时结算** | USDC 点对点直接转账，无需等待 |
| **无 Gas 费** | 使用 EIP-3009 授权转账，买家无需支付 Gas 费 |
| **非托管** | 协议不持有用户资金，资金直接从买家到卖家 |
| **可验证** | 所有支付记录链上可查 |

**USDC 合约地址**：`0x036CbD53842c5426634e7929541eC2318f3dCF7e`（Base Sepolia）

---

### 2.7 订单管理

完整的订单生命周期管理。

**订单状态流转**：

```
CREATED → PAID → IN_SERVICE → COMPLETED → SETTLED
                                    ↓
                                REFUNDED（退款）
```

| 状态 | 说明 |
|------|------|
| CREATED | 订单创建，等待支付 |
| PAID | 已通过 x402 支付 USDC |
| IN_SERVICE | 服务进行中 |
| COMPLETED | 服务已完成 |
| SETTLED | 最终结算完成 |
| REFUNDED | 订单退款 |

**订单聊天**：每个订单支持买卖双方的实时消息沟通。

---

### 2.8 钱包连接

支持多钱包连接，无缝切换不同区块链网络。

**技术栈**：
- **Dynamic SDK**：统一的钱包连接入口
- **wagmi + viem**：链交互层
- **支持网络**：
  - Ethereum Sepolia（ERC-8004 身份与信誉操作）
  - Base Sepolia（x402 USDC 支付）

**功能**：
- 一键连接 MetaMask、Coinbase Wallet 等主流钱包
- 自动切换网络（身份操作切换到 Sepolia，支付操作切换到 Base Sepolia）
- 显示当前连接状态和钱包地址

---

## 三、用户流程

### 3.1 买家完整流程

```
1. 连接钱包
      ↓
2. 打开 Explore Agent 对话
      ↓
3. 描述需求（如"我想找泰餐课"）
      ↓
4. AI 推荐匹配服务 → 展示服务卡片
      ↓
   ┌── 有匹配 → 查看服务详情 → x402 支付 → 等待服务 → 评价 Agent
   └── 无匹配 → 发布需求到 Demand Board → 等待卖家响应
```

### 3.2 卖家完整流程

```
1. 连接钱包
      ↓
2. 打开 Offer Agent 对话
      ↓
3. 描述服务内容
      ↓
4. AI 收集信息（类别、位置、价格）
      ↓
5. AI 搜索匹配需求 → 推荐潜在买家
      ↓
6. 生成服务卡片预览 → 确认上架
      ↓
7.（可选）注册 ERC-8004 链上 Agent 身份
      ↓
8. 接收订单 → 提供服务 → 收款
```

---

## 四、系统架构

### 4.1 整体架构

```
                    ┌─────────────────────────────────────┐
                    │          用户界面 (React 19)          │
                    │  ┌───────┐ ┌──────┐ ┌─────────────┐ │
                    │  │AI Chat│ │Market│ │ Map / Demand │ │
                    │  └───┬───┘ └──┬───┘ └──────┬──────┘ │
                    └──────┼────────┼─────────────┼────────┘
                           │        │             │
                    ┌──────┴────────┴─────────────┴────────┐
                    │        Express 后端 (Port 3001)       │
                    │  ┌─────────┐ ┌────────┐ ┌─────────┐ │
                    │  │ Gemini  │ │  CRUD  │ │ ERC-8004│ │
                    │  │   AI    │ │  APIs  │ │  Reads  │ │
                    │  └────┬────┘ └────────┘ └────┬────┘ │
                    └───────┼──────────────────────┼───────┘
                            │                      │
              ┌─────────────┴──────┐    ┌─────────┴──────────┐
              │   Google Gemini    │    │  Ethereum Sepolia   │
              │      API           │    │  (Identity + Rep)   │
              └────────────────────┘    └────────────────────┘
                                                   +
                                        ┌─────────────────────┐
                                        │   Base Sepolia      │
                                        │   (USDC Settlement) │
                                        └─────────────────────┘
```

### 4.2 技术栈总结

| 层级 | 技术 | 用途 |
|------|------|------|
| **前端** | React 19 + TypeScript + Vite 6 | 用户界面 |
| **样式** | Tailwind CSS | 毛玻璃效果 UI |
| **地图** | Leaflet | 地理空间可视化 |
| **AI** | Google Gemini API | 流式对话与意图理解 |
| **后端** | Express.js + TypeScript | API 服务与数据管理 |
| **验证** | Zod | 请求参数校验 |
| **钱包** | Dynamic SDK + wagmi + viem | Web3 钱包连接 |
| **身份** | ERC-8004 (ethers v6) | 链上 Agent 注册与信誉 |
| **支付** | x402 + EIP-3009 | USDC 无 Gas 即时支付 |

---

## 五、产品亮点

### 5.1 AI 原生交互

不是在传统平台上加了个聊天框，而是**对话即操作**：
- 搜索服务 = 对 Agent 说话
- 上架服务 = 与 Agent 聊天
- 匹配需求 = Agent 自动完成
- 发布需求 = Agent 引导生成

### 5.2 链上可验证信任

- 服务提供者的身份注册在链上，不可伪造
- 评价评分写入智能合约，不可删除或篡改
- 支付记录链上可查，完全透明

### 5.3 真正的点对点

- 协议**不持有任何用户资金**
- USDC 从买家钱包直接转到卖家钱包
- 无中介抽成，无隐藏费用

### 5.4 无 Gas 支付体验

- 使用 EIP-3009 `transferWithAuthorization`
- 买家签署授权，无需支付 Gas 费
- 接近传统支付的用户体验

### 5.5 双链架构

| 链 | 用途 | 原因 |
|---|------|------|
| Ethereum Sepolia | 身份 + 信誉 | 安全性高，适合身份验证 |
| Base Sepolia | USDC 支付 | 低成本，适合高频支付 |

---

## 六、服务类别与示例数据

平台当前涵盖以下五大服务类别，所有数据围绕**清迈本地生活场景**设计：

### Culinary（烹饪美食）
- Authentic Thai Cooking Class — 45 USDC/节
- Night Market Food Safari — 35 USDC/人
- Artisanal Tea Blending — 55 USDC/场
- Organic Farm Cooking Experience — 50 USDC/人
- Highland Coffee Plantation Tour — 75 USDC/人

### Wellness（健康养生）
- Traditional Thai Yoga — 25 USDC/时
- Traditional Muay Thai Training — 30 USDC/节
- Traditional Herbal Compress Massage — 40 USDC/节

### Education（教育文化）
- Thai Language Crash Course — 20 USDC/时
- Lanna Bamboo Weaving — 40 USDC/节
- Lanna Traditional Dance Class — 25 USDC/课
- Celadon Pottery Workshop — 45 USDC/场

### Tours（旅游体验）
- Doi Inthanon Sunrise Hike — 120 USDC/人
- Ethical Elephant Sanctuary — 95 USDC/天
- Sacred Temple Photography Tour — 65 USDC/人
- Mae Taeng River Rafting — 85 USDC/人
- Scooter Rental with Local Guide — 15 USDC/天

### Digital（数字服务）
- Solidity Smart Contract Audit — 800 USDC/项目
- UI/UX Figma Prototype — 450 USDC/项目
- Co-working Space Day Pass — 12 USDC/天
- Podcast Studio Rental — 30 USDC/时

---

## 七、协议标准说明

### 7.1 ERC-8004 — 链上 Agent 身份标准

ERC-8004 是 LocalLife 使用的链上身份标准，包含两个核心合约：

**IdentityRegistry（身份注册表）**
- 服务提供者调用 `registerAgent` 注册链上身份
- 每个 Agent 绑定一个元数据 URI，指向 JSON 格式的详细信息
- Agent Token 是不可转让的（灵魂绑定），确保身份与钱包地址绑定

**ReputationRegistry（信誉注册表）**
- 买家调用 `submitFeedback` 提交评价
- 评价包含：评分值（20-100）、标签、评论 URI
- 所有评价永久存储，不可修改或删除
- 支持按 Agent ID 查询所有历史评价

### 7.2 x402 — HTTP 402 支付协议

x402 是 LocalLife 使用的支付协议，基于 HTTP 402 状态码实现：

**核心流程**：
1. 买家发起支付请求
2. 服务端返回 HTTP 402 响应，附带支付要求（金额、收款地址、Token 地址）
3. 买家钱包签署 EIP-3009 授权（不需要 Gas）
4. 支付信息发送到 Facilitator 完成转账
5. 服务端确认支付完成，更新订单状态

**优势**：
- 与 HTTP 协议原生集成
- 无需额外的支付网关
- 支持 USDC 等 ERC-20 稳定币
- 使用 EIP-3009 实现免 Gas 转账

---

## 八、当前状态与未来规划

### 当前状态：功能原型（Functional Prototype）

| 模块 | 完成度 |
|------|--------|
| AI Agent 对话系统 | ✅ 完成 |
| 服务市场 | ✅ 完成 |
| 需求看板 | ✅ 完成 |
| 订单管理 | ✅ 完成 |
| ERC-8004 链上身份 | ✅ 完成 |
| 链上信誉系统 | ✅ 完成 |
| x402 USDC 支付 | ✅ 完成 |
| 多钱包连接 | ✅ 完成 |
| 数据持久化 | ⚠️ 内存存储（待升级） |

### 未来规划

**短期（P1）— 生产就绪**：
- [ ] PostgreSQL + Prisma ORM 持久化存储
- [ ] Redis 对话上下文缓存
- [ ] API 速率限制
- [ ] 单元测试覆盖率 > 80%
- [ ] 链上事件监听器（Indexer）

**长期（P2）— 规模化**：
- [ ] 完整测试覆盖（单元 + 集成 + E2E）
- [ ] 性能优化与缓存策略
- [ ] 监控与日志系统
- [ ] CI/CD 流水线
- [ ] 生产环境部署（主网）

---

## 九、快速体验

### 环境要求
- Node.js 20+
- Google Gemini API Key
- Dynamic Labs Environment ID

### 启动步骤

```bash
# 1. 安装依赖
npm install
cd server && npm install && cd ..

# 2. 配置环境变量
# 根目录 .env → VITE_DYNAMIC_ENV_ID
# server/.env → GEMINI_API_KEY 等

# 3. 启动后端
cd server && npm run dev

# 4. 启动前端（新终端）
npm run dev

# 5. 打开浏览器访问 http://localhost:3000
```

### 核心操作演示

1. **连接钱包** → 点击右上角钱包按钮
2. **探索服务** → 切换到 Explore 页面，与 AI Agent 对话
3. **上架服务** → 切换到 Offer 页面，描述你的服务
4. **查看市场** → 切换到 Marketplace 浏览所有服务
5. **链上注册** → Agent Registration 面板注册链上身份
6. **支付体验** → 点击服务卡片的 Book 按钮发起 x402 支付

---

*LocalLife — 让每位本地劳动者都能拥有自己的链上代理。*

*Built with love for ETHChiangmai 2026*
