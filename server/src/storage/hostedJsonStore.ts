import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function isValidWallet(wallet: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(wallet);
}

export function isValidOrderId(orderId: string): boolean {
  return /^[a-zA-Z0-9-_]{1,80}$/.test(orderId);
}

function getAgentRegistrationPath(wallet: string): string {
  const normalized = wallet.toLowerCase();
  return path.join(DATA_DIR, 'agents', 'by-wallet', `${normalized}.json`);
}

function getFeedbackPath(orderId: string, buyerWallet: string): string {
  const normalizedWallet = buyerWallet.toLowerCase();
  return path.join(DATA_DIR, 'feedback', orderId, `${normalizedWallet}.json`);
}

async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

async function readJsonFile(filePath: string): Promise<any | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

async function writeJsonFile(filePath: string, data: any): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateDefaultAgentRegistration(wallet: string): any {
  return {
    agentId: null,
    sellerWallet: wallet.toLowerCase(),
    agentURI: `https://example.com/agents/by-wallet/${wallet.toLowerCase()}/registration.json`,
    metadata: {
      name: 'Unnamed Agent',
      description: 'Agent registration pending',
      category: 'general',
      location: null,
      pricing: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateDefaultFeedback(orderId: string, buyerWallet: string): any {
  return {
    orderId,
    buyerWallet: buyerWallet.toLowerCase(),
    rating: null,
    comment: null,
    feedbackURI: `https://example.com/feedback/${orderId}/${buyerWallet.toLowerCase()}.json`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getAgentRegistration(wallet: string): Promise<any> {
  if (!isValidWallet(wallet)) {
    throw new Error('Invalid wallet address format');
  }

  const filePath = getAgentRegistrationPath(wallet);
  let data = await readJsonFile(filePath);

  if (!data) {
    data = generateDefaultAgentRegistration(wallet);
    await writeJsonFile(filePath, data);
  }

  return data;
}

export async function getFeedback(orderId: string, buyerWallet: string): Promise<any> {
  if (!isValidOrderId(orderId)) {
    throw new Error('Invalid orderId format');
  }
  if (!isValidWallet(buyerWallet)) {
    throw new Error('Invalid wallet address format');
  }

  const filePath = getFeedbackPath(orderId, buyerWallet);
  let data = await readJsonFile(filePath);

  if (!data) {
    data = generateDefaultFeedback(orderId, buyerWallet);
    await writeJsonFile(filePath, data);
  }

  return data;
}

export async function saveAgentRegistration(
  wallet: string,
  data: {
    name: string;
    description: string;
    category: string;
    location?: string;
    pricing?: string;
  },
): Promise<{ filePath: string; registration: any }> {
  if (!isValidWallet(wallet)) {
    throw new Error('Invalid wallet address format');
  }

  const normalized = wallet.toLowerCase();
  const registration = {
    agentId: null,
    sellerWallet: normalized,
    agentURI: `/agents/by-wallet/${normalized}/registration.json`,
    metadata: {
      name: data.name,
      description: data.description,
      category: data.category,
      location: data.location || null,
      pricing: data.pricing || null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const filePath = getAgentRegistrationPath(wallet);
  await writeJsonFile(filePath, registration);
  return { filePath, registration };
}

export async function saveFeedback(
  orderId: string,
  buyerWallet: string,
  data: {
    agentId: string;
    rating: number;
    comment: string;
  },
): Promise<{ filePath: string; feedback: any; feedbackHash: string }> {
  if (!isValidOrderId(orderId)) {
    throw new Error('Invalid orderId format');
  }
  if (!isValidWallet(buyerWallet)) {
    throw new Error('Invalid wallet address format');
  }

  const normalized = buyerWallet.toLowerCase();
  const feedback = {
    orderId,
    buyerWallet: normalized,
    agentId: data.agentId,
    rating: data.rating,
    comment: data.comment,
    feedbackURI: `/feedback/${orderId}/${normalized}.json`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const filePath = getFeedbackPath(orderId, buyerWallet);
  await writeJsonFile(filePath, feedback);

  const { keccak256, toUtf8Bytes } = await import('ethers');
  const compactJson = JSON.stringify(feedback);
  const feedbackHash = keccak256(toUtf8Bytes(compactJson));

  return { filePath, feedback, feedbackHash };
}

export async function updateAgentId(wallet: string, agentId: string): Promise<any> {
  if (!isValidWallet(wallet)) throw new Error('Invalid wallet');
  const filePath = getAgentRegistrationPath(wallet);
  const data = await readJsonFile(filePath);
  if (!data) throw new Error('Registration not found');
  data.agentId = agentId;
  data.updatedAt = new Date().toISOString();
  await writeJsonFile(filePath, data);
  return data;
}

export async function getWellKnownRegistrations(): Promise<any> {
  try {
    const agentsDir = path.join(DATA_DIR, 'agents', 'by-wallet');
    const files = await fs.readdir(agentsDir).catch(() => []);
    const registrations = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const data = await readJsonFile(path.join(agentsDir, file));
      if (data && data.agentId) {
        registrations.push({
          agentId: data.agentId,
          agentRegistry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
          chainId: 11155111,
        });
      }
    }

    return { registrations };
  } catch {
    return { registrations: [] };
  }
}
