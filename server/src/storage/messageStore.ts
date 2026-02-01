import fs from 'fs';
import path from 'path';

export interface OrderMessage {
  id: string;
  orderId: string;
  senderAddress: string;  // wallet address of sender
  senderRole: 'buyer' | 'seller';
  content: string;
  timestamp: number;
}

const DATA_DIR = path.join(__dirname, '../../data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

class MessageStore {
  private messages: OrderMessage[] = [];

  constructor() {
    this.load();
  }

  private load() {
    ensureDataDir();
    try {
      if (fs.existsSync(MESSAGES_FILE)) {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
        this.messages = JSON.parse(data);
      }
    } catch (err) {
      console.error('[messageStore] Failed to load messages:', err);
      this.messages = [];
    }
  }

  private save() {
    ensureDataDir();
    try {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(this.messages, null, 2), 'utf-8');
    } catch (err) {
      console.error('[messageStore] Failed to save messages:', err);
    }
  }

  addMessage(orderId: string, senderAddress: string, senderRole: 'buyer' | 'seller', content: string): OrderMessage {
    const msg: OrderMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      orderId,
      senderAddress,
      senderRole,
      content,
      timestamp: Date.now(),
    };
    this.messages.push(msg);
    this.save();
    return msg;
  }

  getMessages(orderId: string): OrderMessage[] {
    return this.messages.filter(m => m.orderId === orderId);
  }
}

export const messageStore = new MessageStore();
