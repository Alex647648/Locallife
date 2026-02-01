import { Contract, JsonRpcProvider, FetchRequest, Network } from 'ethers';
import { config } from '../config';
import { IDENTITY_REGISTRY_ABI, REPUTATION_REGISTRY_ABI } from '../contracts/abis';

const cache = new Map<string, { data: unknown; expiresAt: number }>();
const DEFAULT_TTL_MS = 60_000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttlMs = DEFAULT_TTL_MS): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

let provider: JsonRpcProvider | null = null;
let identityRegistry: Contract | null = null;
let reputationRegistry: Contract | null = null;

function getProvider(): JsonRpcProvider {
  if (!provider) {
     const fetchReq = new FetchRequest(config.sepoliaRpcUrl);
     fetchReq.timeout = 15_000;
    const sepoliaNetwork = Network.from(11155111);
    provider = new JsonRpcProvider(fetchReq, sepoliaNetwork, { staticNetwork: true });
  }
  return provider;
}

function getIdentityRegistry(): Contract {
  if (!identityRegistry) {
    identityRegistry = new Contract(
      config.identityRegistryAddress,
      IDENTITY_REGISTRY_ABI,
      getProvider(),
    );
  }
  return identityRegistry;
}

function getReputationRegistry(): Contract {
  if (!reputationRegistry) {
    reputationRegistry = new Contract(
      config.reputationRegistryAddress,
      REPUTATION_REGISTRY_ABI,
      getProvider(),
    );
  }
  return reputationRegistry;
}

const MOCK_AGENTS = [
  {
    id: '1',
    owner: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Alice Home Cleaning',
    description: 'Professional home cleaning services in downtown area',
    category: 'cleaning',
    location: { lat: 37.7749, lng: -122.4194 },
    priceRange: '$30-60/hr',
    tokenURI: 'https://example.com/agent/1/metadata.json',
  },
  {
    id: '2',
    owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    name: 'Bob Plumbing',
    description: 'Licensed plumber, 10+ years experience',
    category: 'plumbing',
    location: { lat: 37.7849, lng: -122.4094 },
    priceRange: '$50-100/hr',
    tokenURI: 'https://example.com/agent/2/metadata.json',
  },
  {
    id: '3',
    owner: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'Carol Dog Walking',
    description: 'Reliable dog walking & pet sitting',
    category: 'pets',
    location: { lat: 37.7649, lng: -122.4294 },
    priceRange: '$20-35/walk',
    tokenURI: 'https://example.com/agent/3/metadata.json',
  },
];

function getMockAgent(agentId: string) {
  return MOCK_AGENTS.find((a) => a.id === agentId) ?? null;
}

export interface AgentListResult {
  items: unknown[];
  source: 'on-chain' | 'mock';
  total: number;
}

export interface AgentDetail {
  id: string;
  owner: string;
  tokenURI: string;
  metadata: unknown | null;
  source: 'on-chain' | 'mock';
}

export interface ReputationSummary {
  agentId: string;
  count: number;
  averageValue: number;
  decimals: number;
  source: 'on-chain' | 'mock';
}

export async function listAgents(
   page: number,
   limit: number,
): Promise<AgentListResult> {
   const cacheKey = `agents:${page}:${limit}`;
   const cached = getCached<AgentListResult>(cacheKey);
   if (cached) return cached;

   try {
     const registry = getIdentityRegistry();
     const totalSupplyBN: bigint = await registry.totalSupply();
     const total = Number(totalSupplyBN);

     const start = total - (page - 1) * limit;
     const end = Math.max(start - limit + 1, 1);
     const items: unknown[] = [];

     for (let tokenId = start; tokenId >= end; tokenId--) {
       try {
         const [owner, tokenURI] = await Promise.all([
           registry.ownerOf(tokenId) as Promise<string>,
           registry.tokenURI(tokenId) as Promise<string>,
         ]);
         items.push({ id: String(tokenId), owner, tokenURI });
       } catch {
         // token may not exist (burned), skip
       }
     }

     const result: AgentListResult = { items, source: 'on-chain', total };
     setCache(cacheKey, result);
     return result;
   } catch (err) {
     console.warn('[erc8004] RPC failed for listAgents, using mock fallback:', (err as Error).message);
     const start = (page - 1) * limit;
     const slice = MOCK_AGENTS.slice(start, start + limit);
     return { items: slice, source: 'mock', total: MOCK_AGENTS.length };
   }
}

export async function getAgentDetail(agentId: string): Promise<AgentDetail | null> {
  const cacheKey = `agent:${agentId}`;
  const cached = getCached<AgentDetail>(cacheKey);
  if (cached) return cached;

  try {
    const registry = getIdentityRegistry();
    const tokenId = BigInt(agentId);

    const [owner, tokenURI] = await Promise.all([
      registry.ownerOf(tokenId) as Promise<string>,
      registry.tokenURI(tokenId) as Promise<string>,
    ]);

    let metadata: unknown = null;
    if (tokenURI && tokenURI.startsWith('http')) {
      try {
        const resp = await fetch(tokenURI, { signal: AbortSignal.timeout(5000) });
        if (resp.ok) metadata = await resp.json();
      } catch {
        // metadata fetch failed — non-critical
      }
    } else if (tokenURI && tokenURI.startsWith('data:application/json')) {
      try {
        const base64 = tokenURI.split(',')[1];
        metadata = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
      } catch {
        // malformed data URI
      }
    }

    const result: AgentDetail = {
      id: agentId,
      owner,
      tokenURI,
      metadata,
      source: 'on-chain',
    };
    setCache(cacheKey, result);
    return result;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === 'CALL_EXCEPTION') {
      const mock = getMockAgent(agentId);
      if (!mock) return null;
      return { id: agentId, owner: mock.owner, tokenURI: mock.tokenURI, metadata: mock, source: 'mock' };
    }
    console.warn('[erc8004] RPC failed for getAgentDetail, using mock fallback:', (err as Error).message);
    const mock = getMockAgent(agentId);
    if (!mock) return null;
    return { id: agentId, owner: mock.owner, tokenURI: mock.tokenURI, metadata: mock, source: 'mock' };
  }
}

export async function getReputationSummary(agentId: string): Promise<ReputationSummary> {
  const cacheKey = `reputation:${agentId}`;
  const cached = getCached<ReputationSummary>(cacheKey);
  if (cached) return cached;

  try {
    const registry = getReputationRegistry();
    const [count, summaryValue, summaryValueDecimals] = await registry.getSummary(
      BigInt(agentId),
      [],
      'starred',
      '',
    ) as [bigint, bigint, bigint];

    const decimals = Number(summaryValueDecimals);
    const averageValue = decimals > 0
      ? Number(summaryValue) / 10 ** decimals
      : Number(summaryValue);

    const result: ReputationSummary = {
      agentId,
      count: Number(count),
      averageValue,
      decimals,
      source: 'on-chain',
    };
    setCache(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('[erc8004] RPC failed for getReputationSummary, using mock fallback:', (err as Error).message);
    const result: ReputationSummary = {
      agentId,
      count: 12,
      averageValue: 4.5,
      decimals: 1,
      source: 'mock',
    };
    setCache(cacheKey, result);
    return result;
  }
}
