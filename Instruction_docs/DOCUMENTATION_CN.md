# LocalLife 协议文档

## 1. 项目概述
**LocalLife** 是一个为 ETHGlobal 黑客松打造的去中心化本地服务协作协议。它利用 AI Agent 作为主要用户交互界面，通过 **X402 代币标准** 和 **智能托管 (Smart Escrow)** 结算层将现实世界服务与区块链连接起来。

---

## 2. 功能模块

### 2.1 Agent 终端 (核心交互)
买家和卖家的中央指挥中心。
- **Explore Agent (买家角色):** 帮助用户发现本地服务（例如：“帮我在古城找一个烹饪课”）。它使用语义匹配从市场中推荐服务。
- **Offer Agent (卖家角色):** 引导本地服务提供者完成代币化过程，通过自然对话提取服务细节。
- **视觉效果:** 具有高斯模糊效果的“毛玻璃”容器、实时打字指示器和清晰的排版层次结构。

### 2.2 服务市场
“已验证资产”的视觉注册表。
- **资产筛选:** 按类别（烹饪、健康、教育等）搜索和筛选。
- **X402 可视化:** 每张卡片显示协议特定的数据，如 USDC 价格、位置和“已验证资产”状态徽章。
- **行为:** 平滑的悬停动画和响应式网格布局（1 到 3 列）。

### 2.3 协议配置 (Agent 设置)
用于管理底层 Agent 基础设施的专门面板。
- **推理引擎:** 支持多个 LLM 提供商（Gemini, OpenAI, Anthropic, DeepSeek 等）。
- **运行模式:** 在 `Mock` (演示模拟) 和 `Testnet` (Sepolia 测试网) 环境之间切换。
- **结算逻辑:** `自动` 或 `手动` 托管释放选项。

### 2.4 DeFi 结算 (订单与托管)
应用程序的信任层。
- **活动合约:** 显示进行中的服务协议的生命周期。
- **智能托管流程:** 资金锁定在非托管合约中 (`PAID`)，仅在买家确认后释放 (`SETTLED`)。

---

## 3. 技术架构

### 3.1 数据模型 (`types.ts`)
- **`Service`**: X402 资产定义，包括 `tokenAddress`、`price` 和元数据。
- **`Order`**: 代表跟踪 `OrderStatus` (CREATED -> PAID -> SETTLED) 的状态机合约。
- **`ChatMessage`**: 流式 AI 交互的统一消息格式。

### 3.2 AI 集成 (`geminiService.ts`)
- **`getAgentResponseStream`**: 使用 Gemini 3 Flash/Pro 模型促进 Agent 响应的实时、开低延迟流式传输。
- **`parseServiceJson`**: 一个利用结构化输出 (JSON Schema) 从非结构化卖家对话中提取服务参数的实用函数。

### 3.3 UI 组件
- **Tailwind CSS**: 采用原子类优先的样式设计，具有自定义的“瑞士网格”背景和动画“呼吸”光球。
- **React State**: 在原型阶段采用 React 本地状态管理，以确保极速的 UI 响应。

---

## 4. API 与接口定义

### AI Agent 流
```typescript
// 位置: services/geminiService.ts
export const getAgentResponseStream = async (
  messages: ChatMessage[],
  systemInstruction: string,
  model: string
): Promise<GenerateContentResponseStream>
```
*   **输入**: 完整的聊天历史记录和角色特定的系统指令。
*   **输出**: 一个异步迭代器，提供文本块以实现平滑的“打字”体验。

### 结构化提取
```typescript
// 位置: services/geminiService.ts
export const parseServiceJson = async (text: string): Promise<ServiceParams | null>
```
*   **逻辑**: 使用 `responseMimeType: "application/json"` 和 `responseSchema` 来保证上架所需的有效服务对象。

---

## 5. 协议标准

### X402 标准
一种针对服务优化的混合代币模型：
- **同质化**: 以 USDC 计价的价格单位。
- **元数据**: 不可篡改的链上位置、类别和到期逻辑数据。

### 智能托管
一种非托管逻辑流：
1.  **创建 (Creation)**: 在链上发起订单。
2.  **锁定 (Lock)**: USDC 转移到托管合约。
3.  **结算 (Settlement)**: 履约证明触发资金释放或争议处理。

---
*Built for ETHGlobal 2026*