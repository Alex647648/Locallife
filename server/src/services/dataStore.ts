import fs from 'fs';
import path from 'path';
import { Service, Demand, Order } from '../types';

const DATA_DIR = path.join(__dirname, '../../data');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const DEMANDS_FILE = path.join(DATA_DIR, 'demands.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic read/write helpers
function readJsonFile<T>(filePath: string, defaultValue: T[]): T[] {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

// Initial mock data with coordinates for Chiang Mai regions
const INITIAL_SERVICES: Service[] = [
  // --- CULINARY (烹饪) ---
  {
    id: 's1',
    sellerId: '0xChefJoy',
    title: 'Authentic Thai Cooking Class',
    description: 'Master the art of Northern Thai cuisine. Learn to pound fresh curry paste and prepare Khao Seoi in an open-air kitchen.',
    category: 'Culinary',
    location: 'Chiang Mai, Old City',
    price: 45,
    unit: 'USDC/session',
    tokenAddress: '0xTHAI-COOK-X402',
    supply: 50,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xChefJoy',
    lat: 18.7868,
    lng: 98.9893
  },
  {
    id: 's6',
    sellerId: '0xNightBite',
    title: 'Night Market Food Safari',
    description: 'A curated evening tour through Chiang Mai\'s hidden night markets. Taste over 10 different local delicacies.',
    category: 'Culinary',
    location: 'Chang Puak Gate',
    price: 35,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xNightBite',
    lat: 18.7962,
    lng: 98.9847
  },
  {
    id: 's14',
    sellerId: '0xTeaMaster',
    title: 'Artisanal Tea Blending',
    description: 'Discover the secrets of organic mountain tea. Create your own signature blend using local herbs and dried flowers.',
    category: 'Culinary',
    location: 'Mae Rim Valley',
    price: 55,
    unit: 'USDC/workshop',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xTeaMaster',
    lat: 18.8912,
    lng: 98.9456
  },
  // --- WELLNESS (健康) ---
  {
    id: 's2',
    sellerId: '0xZenMaster',
    title: 'Traditional Thai Yoga',
    description: 'Ancient Thai self-stretching (Reusi Dat Ton) to improve flexibility and energy flow, practiced in a peaceful pavilion.',
    category: 'Wellness',
    location: 'Nimman Road',
    price: 25,
    unit: 'USDC/hr',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xZenMaster',
    lat: 18.7985,
    lng: 98.9672
  },
  {
    id: 's19',
    sellerId: '0xMuayThaiPro',
    title: 'Traditional Muay Thai Training',
    description: 'Authentic Thai boxing training with former professional fighters. Learn proper technique, conditioning, and respect for the art in a traditional gym setting.',
    category: 'Wellness',
    location: 'Suthep Road',
    price: 30,
    unit: 'USDC/session',
    tokenAddress: '0xMUAYTHAI-X402',
    supply: 100,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMuayThaiPro',
    lat: 18.7912,
    lng: 98.9589
  },
  {
    id: 's24',
    sellerId: '0xHerbalSpa',
    title: 'Traditional Herbal Compress Massage',
    description: 'Experience authentic Thai herbal ball massage using locally grown herbs. Relieves muscle tension and promotes deep relaxation in a serene garden setting.',
    category: 'Wellness',
    location: 'Spa Garden, Old City',
    price: 40,
    unit: 'USDC/session',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xHerbalSpa',
    lat: 18.7845,
    lng: 98.9856
  },
  // --- EDUCATION (教育) ---
  {
    id: 's9',
    sellerId: '0xThaiTalk',
    title: 'Thai Language Crash Course',
    description: 'Survival Thai for digital nomads. Master tones and essential phrases for daily life in Chiang Mai.',
    category: 'Education',
    location: 'Nimman Hub',
    price: 20,
    unit: 'USDC/hr',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xThaiTalk',
    lat: 18.8001,
    lng: 98.9698
  },
  {
    id: 's16',
    sellerId: '0xWeaver',
    title: 'Lanna Bamboo Weaving',
    description: 'Learn the meditative art of weaving bamboo baskets and coasters from a local village elder.',
    category: 'Education',
    location: 'Bo Sang Village',
    price: 40,
    unit: 'USDC/session',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xWeaver',
    lat: 18.7723,
    lng: 99.0567
  },
  {
    id: 's21',
    sellerId: '0xLannaDance',
    title: 'Lanna Traditional Dance Class',
    description: 'Learn graceful Northern Thai dance movements and cultural stories. Perfect for understanding Lanna heritage through movement and music.',
    category: 'Education',
    location: 'Cultural Center, Old City',
    price: 25,
    unit: 'USDC/class',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xLannaDance',
    lat: 18.7889,
    lng: 98.9912
  },
  // --- TOURS (旅游) ---
  {
    id: 's4',
    sellerId: '0xGuide',
    title: 'Doi Inthanon Sunrise Hike',
    description: 'Experience the highest point in Thailand. Professional guide with local history insights and panoramic views.',
    category: 'Tours',
    location: 'Doi Inthanon',
    price: 120,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xGuide',
    lat: 18.5875,
    lng: 98.4867
  },
  {
    id: 's11',
    sellerId: '0xStickyDiver',
    title: 'Sticky Waterfalls Adventure',
    description: 'Climb the Bua Thong waterfalls like a lizard. We provide transport and organic lunch at the site.',
    category: 'Tours',
    location: 'Mae Taeng District',
    price: 40,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xStickyDiver',
    lat: 19.0234,
    lng: 98.9123
  },
  {
    id: 's17',
    sellerId: '0xElephantJoy',
    title: 'Ethical Elephant Sanctuary',
    description: 'Spend a day caring for rescued elephants. Prepare their herbal vitamins and bath with them in the river.',
    category: 'Tours',
    location: 'Mae Wang',
    price: 95,
    unit: 'USDC/day',
    imageUrl: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xElephantJoy',
    lat: 18.6234,
    lng: 98.7456
  },
  {
    id: 's20',
    sellerId: '0xTempleTour',
    title: 'Sacred Temple Photography Tour',
    description: 'Capture stunning photos of Chiang Mai\'s ancient temples at golden hour. Learn composition techniques while visiting Wat Phra That Doi Suthep, Wat Chedi Luang, and hidden gems.',
    category: 'Tours',
    location: 'Old City & Doi Suthep',
    price: 65,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xTempleTour',
    lat: 18.8048,
    lng: 98.9212
  },
  // --- DIGITAL (数字) ---
  {
    id: 's3',
    sellerId: '0xDevNode',
    title: 'Solidity Smart Contract Audit',
    description: 'Security validation for DeFi protocols on Sepolia. Includes detailed vulnerability reports and x402 minting support.',
    category: 'Digital',
    location: 'Remote / Nimman',
    price: 800,
    unit: 'USDC/audit',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xDevNode',
    lat: 18.7998,
    lng: 98.9712
  },
  {
    id: 's13',
    sellerId: '0xDesignFlow',
    title: 'UI/UX Figma Prototype',
    description: 'High-fidelity Figma prototypes for your DApp. Focus on accessibility and modern Web3 aesthetics for retail users.',
    category: 'Digital',
    location: 'Remote',
    price: 450,
    unit: 'USDC/project',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xDesignFlow',
    lat: 18.7956,
    lng: 98.9689
  },
  {
    id: 's27',
    sellerId: '0xNomadHub',
    title: 'Co-working Space Day Pass',
    description: 'High-speed WiFi, ergonomic chairs, and quiet zones in the heart of Nimman. Perfect for digital nomads. Includes free coffee and meeting room access.',
    category: 'Digital',
    location: 'Nimman Road',
    price: 12,
    unit: 'USDC/day',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xNomadHub',
    lat: 18.8012,
    lng: 98.9656
  }
];

const INITIAL_DEMANDS: Demand[] = [
  {
    id: 'd1',
    buyerId: '0xHackathonLead',
    title: 'Emergency Web3 Front-end Help',
    description: 'Need help integrating RainbowKit for a hackathon project. Must be finished in 4 hours!',
    category: 'Digital',
    location: 'Nimman Area',
    budget: 250,
    timestamp: Date.now() - 1800000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xHackathonLead',
    lat: 18.7989,
    lng: 98.9701
  },
  {
    id: 'd2',
    buyerId: '0xRetreatFounder',
    title: 'Yoga Retreat Coordinator',
    description: 'Manage schedules and space for our monthly 5-day digital nomad mindfulness retreat.',
    category: 'Wellness',
    location: 'Old City',
    budget: 1500,
    timestamp: Date.now() - 10800000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xRetreatFounder',
    lat: 18.7867,
    lng: 98.9878
  },
  {
    id: 'd3',
    buyerId: '0xRestoOwner',
    title: 'Menu Translation (Thai-English)',
    description: 'Need a professional translation for a new fusion restaurant menu with 60+ specialty items.',
    category: 'Education',
    location: 'Remote',
    budget: 60,
    timestamp: Date.now() - 3600000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xRestoOwner',
    lat: 18.7912,
    lng: 98.9823
  },
  {
    id: 'd4',
    buyerId: '0xHealthNut',
    title: 'Vegetarian Food Guide',
    description: 'Show us the best 5 local hidden vegetarian gems in Chiang Mai. Evening tour preferred.',
    category: 'Culinary',
    location: 'City Center',
    budget: 60,
    timestamp: Date.now() - 14400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xHealthNut',
    lat: 18.7901,
    lng: 98.9867
  },
  {
    id: 'd8',
    buyerId: '0xMotoExplorer',
    title: 'Mae Hong Son Loop Guide',
    description: 'Experienced rider needed to guide a group of 3 motorcycles on the 1864 curve loop.',
    category: 'Tours',
    location: 'City Center Start',
    budget: 350,
    timestamp: Date.now() - 4200000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMotoExplorer',
    lat: 18.7923,
    lng: 98.9845
  },
  {
    id: 'd15',
    buyerId: '0xYogaRetreat',
    title: 'Weekend Yoga Retreat Organizer',
    description: 'Looking for someone to organize a 2-day yoga retreat for 15 people. Need venue booking, meal planning, and activity coordination.',
    category: 'Wellness',
    location: 'Mae Rim Area',
    budget: 800,
    timestamp: Date.now() - 5400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xYogaRetreat',
    lat: 18.8923,
    lng: 98.9512
  }
];

// Data Store Class
class DataStore {
  private services: Service[] = [];
  private demands: Demand[] = [];
  private orders: Order[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    
    ensureDataDir();
    
    // Load services (initialize with mock data if empty)
    this.services = readJsonFile<Service>(SERVICES_FILE, []);
    if (this.services.length === 0) {
      this.services = INITIAL_SERVICES;
      this.saveServices();
      console.log('📦 Initialized services with mock data');
    }
    
    // Load demands (initialize with mock data if empty)
    this.demands = readJsonFile<Demand>(DEMANDS_FILE, []);
    if (this.demands.length === 0) {
      this.demands = INITIAL_DEMANDS;
      this.saveDemands();
      console.log('📦 Initialized demands with mock data');
    }
    
    // Load orders
    this.orders = readJsonFile<Order>(ORDERS_FILE, []);
    
    this.initialized = true;
    console.log(`✅ DataStore loaded: ${this.services.length} services, ${this.demands.length} demands, ${this.orders.length} orders`);
  }

  // Services
  getServices(filter?: { category?: string; location?: string }): Service[] {
    let result = [...this.services];
    if (filter?.category) {
      result = result.filter(s => s.category === filter.category);
    }
    if (filter?.location) {
      result = result.filter(s => s.location.toLowerCase().includes(filter.location!.toLowerCase()));
    }
    return result;
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  addService(service: Service): Service {
    this.services.push(service);
    this.saveServices();
    return service;
  }

  updateService(id: string, updates: Partial<Service>): Service | undefined {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.services[index] = { ...this.services[index], ...updates };
    this.saveServices();
    return this.services[index];
  }

  deleteService(id: string): boolean {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    this.saveServices();
    return true;
  }

  private saveServices() {
    writeJsonFile(SERVICES_FILE, this.services);
  }

  // Demands
  getDemands(filter?: { category?: string; location?: string }): Demand[] {
    let result = [...this.demands];
    if (filter?.category) {
      result = result.filter(d => d.category === filter.category);
    }
    if (filter?.location) {
      result = result.filter(d => d.location.toLowerCase().includes(filter.location!.toLowerCase()));
    }
    return result;
  }

  getDemandById(id: string): Demand | undefined {
    return this.demands.find(d => d.id === id);
  }

  addDemand(demand: Demand): Demand {
    this.demands.push(demand);
    this.saveDemands();
    return demand;
  }

  updateDemand(id: string, updates: Partial<Demand>): Demand | undefined {
    const index = this.demands.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    this.demands[index] = { ...this.demands[index], ...updates };
    this.saveDemands();
    return this.demands[index];
  }

  deleteDemand(id: string): boolean {
    const index = this.demands.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.demands.splice(index, 1);
    this.saveDemands();
    return true;
  }

  private saveDemands() {
    writeJsonFile(DEMANDS_FILE, this.demands);
  }

  // Orders
  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  addOrder(order: Order): Order {
    this.orders.push(order);
    this.saveOrders();
    return order;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    this.orders[index] = { ...this.orders[index], ...updates };
    this.saveOrders();
    return this.orders[index];
  }

  private saveOrders() {
    writeJsonFile(ORDERS_FILE, this.orders);
  }

  // Reset to initial data (useful for testing)
  reset() {
    this.services = INITIAL_SERVICES;
    this.demands = INITIAL_DEMANDS;
    this.orders = [];
    this.saveServices();
    this.saveDemands();
    this.saveOrders();
    console.log('🔄 DataStore reset to initial data');
  }
}

// Export singleton instance
export const dataStore = new DataStore();
