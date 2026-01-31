# LocalLife Protocol Documentation

## 1. Project Overview
**LocalLife** is a decentralized local service coordination protocol built for the ETHGlobal hackathon. It utilizes AI Agents as the primary user interface to bridge real-world services with the blockchain via the **X402 token standard** and **Smart Escrow** settlement layers.

---

## 2. Functional Modules

### 2.1 Agent Terminal (Core Interaction)
The central command center for both Buyers and Sellers.
- **Explore Agent (Buyer Role):** Helps users discover local services (e.g., "Find me a cooking class in Old City"). It uses semantic matching to suggest services from the marketplace.
- **Offer Agent (Seller Role):** Guides local providers through the tokenization process, extracting service details via natural conversation.
- **Visuals:** A "glassmorphism" container with blur effects, real-time typing indicators, and a clean typography hierarchy.

### 2.2 Service Marketplace
A visual registry of "Verified Assets."
- **Asset Filtering:** Search and filter by category (Culinary, Wellness, etc.).
- **X402 Visualization:** Each card displays protocol-specific data like price in USDC, location, and a "Verified Asset" status badge.
- **Behavior:** Smooth hover animations and responsive grid layout (1 to 3 columns).

### 2.3 Protocol Configuration (Agent Settings)
A specialized panel for managing the underlying agentic infrastructure.
- **Inference Engine:** Support for multiple LLM providers (Gemini, OpenAI, Anthropic, etc.).
- **Run Mode:** Toggle between `Mock` (demo) and `Testnet` (Sepolia) environments.
- **Settlement Logic:** Options for `Auto` or `Manual` escrow release.

### 2.4 DeFi Settlement (Orders & Escrow)
The trust layer of the application.
- **Active Contracts:** Displays the lifecycle of ongoing service agreements.
- **Smart Escrow Flow:** Funds are locked in a non-custodial contract (`PAID`) and released (`SETTLED`) only upon buyer confirmation.

---

## 3. Technical Architecture

### 3.1 Data Models (`types.ts`)
- **`Service`**: The X402 asset definition including `tokenAddress`, `price`, and metadata.
- **`Order`**: Represents a state-machine contract tracking `OrderStatus` (CREATED -> PAID -> SETTLED).
- **`ChatMessage`**: Unified message format for streaming AI interactions.

### 3.2 AI Integration (`geminiService.ts`)
- **`getAgentResponseStream`**: Facilitates real-time, low-latency streaming of agent responses using the Gemini 3 Flash/Pro models.
- **`parseServiceJson`**: A utility function that uses structured output (JSON Schema) to extract service parameters from unstructured seller pitches.

### 3.3 UI Components
- **Tailwind CSS**: Utility-first styling with a custom "Swiss-Grid" background and animated "breathe" orbs.
- **React State**: Managed locally for the prototype to ensure rapid UI responsiveness.

---

## 4. API & Interface Definition

### AI Agent Stream
```typescript
// Location: services/geminiService.ts
export const getAgentResponseStream = async (
  messages: ChatMessage[],
  systemInstruction: string,
  model: string
): Promise<GenerateContentResponseStream>
```
*   **Input**: Full chat history and role-specific system instructions.
*   **Output**: An async iterator providing text chunks for a smooth "typing" experience.

### Structured Extraction
```typescript
// Location: services/geminiService.ts
export const parseServiceJson = async (text: string): Promise<ServiceParams | null>
```
*   **Logic**: Uses `responseMimeType: "application/json"` and `responseSchema` to guarantee valid service objects for on-chain listing.

---

## 5. Protocol Standards

### X402 Standard
A hybrid token model optimized for services:
- **Fungibility**: Price units in USDC.
- **Metadata**: Immutable on-chain location and category data.

### Smart Escrow
A non-custodial logic flow:
1.  **Creation**: Order initiated on-chain.
2.  **Lock**: USDC transferred to escrow contract.
3.  **Settlement**: Proof-of-Fulfillment triggers fund release.

---
*Built for ETHGlobal 2026*