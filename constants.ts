
import { Service, Demand } from './types';

export const MOCK_SERVICES: Service[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xChefJoy'
  },
  {
    id: 's6',
    sellerId: '0xNightBite',
    title: 'Night Market Food Safari',
    description: 'A curated evening tour through Chiang Mai’s hidden night markets. Taste over 10 different local delicacies.',
    category: 'Culinary',
    location: 'Chang Puak Gate',
    price: 35,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xNightBite'
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
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xTeaMaster'
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
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xZenMaster'
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
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xThaiTalk'
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
    imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xWeaver'
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
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xGuide'
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
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xStickyDiver'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xElephantJoy'
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
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xDevNode'
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
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xDesignFlow'
  },
  {
    id: 's18',
    sellerId: '0xPodHost',
    title: 'Podcast Studio Rental',
    description: 'Professional sound-proof booth with high-end microphones and technical support for digital nomads and founders.',
    category: 'Digital',
    location: 'Nimman Area',
    price: 30,
    unit: 'USDC/hr',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xPodHost'
  }
];

export const MOCK_DEMANDS: Demand[] = [
  {
    id: 'd1',
    buyerId: '0xHackathonLead',
    title: 'Emergency Web3 Front-end Help',
    description: 'Need help integrating RainbowKit for a hackathon project. Must be finished in 4 hours!',
    category: 'Digital',
    location: 'Nimman Area',
    budget: 250,
    timestamp: Date.now() - 1800000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xHackathonLead'
  },
  {
    id: 'd10',
    buyerId: '0xCryptoVentures',
    title: 'Protocol Whitepaper Designer',
    description: 'Looking for a designer to layout a 20-page DeFi whitepaper with custom technical diagrams.',
    category: 'Digital',
    location: 'Remote',
    budget: 1200,
    timestamp: Date.now() - 7200000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xCryptoVentures'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xRetreatFounder'
  },
  {
    id: 'd11',
    buyerId: '0xSoloTraveler',
    title: 'Daily Meditation Coach',
    description: 'Looking for a 1-on-1 meditation guide for early morning sessions (7 AM) during my stay.',
    category: 'Wellness',
    location: 'Suthep Road',
    budget: 200,
    timestamp: Date.now() - 14400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xSoloTraveler'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xRestoOwner'
  },
  {
    id: 'd12',
    buyerId: '0xMusicLover',
    title: 'Acoustic Guitar Teacher',
    description: 'Looking for weekly lessons for a beginner. Interested in fingerstyle and folk music.',
    category: 'Education',
    location: 'Nimman',
    budget: 35,
    timestamp: Date.now() - 21600000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMusicLover'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMotoExplorer'
  },
  {
    id: 'd13',
    buyerId: '0xBirdWatcher',
    title: 'Doi Suthep Birding Expert',
    description: 'Searching for a local guide who can identify endemic bird species in Doi Suthep national park.',
    category: 'Tours',
    location: 'Doi Suthep',
    budget: 120,
    timestamp: Date.now() - 86400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xBirdWatcher'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xHealthNut'
  },
  {
    id: 'd14',
    buyerId: '0xCoffeeAddict',
    title: 'Coffee Roasting Consultant',
    description: 'Need an expert to help calibrate a micro-roaster and source green beans from local farmers.',
    category: 'Culinary',
    location: 'Nimman Area',
    budget: 300,
    timestamp: Date.now() - 3600000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xCoffeeAddict'
  }
];

export const CATEGORIES = ['All', 'Culinary', 'Wellness', 'Education', 'Tours', 'Digital'];

export const SYSTEM_INSTRUCTIONS = {
  OFFER_AGENT: `You are the Offer Agent for LocalLife. Your goal is to help local service providers tokenize their skills and list them on the marketplace.
  
  Interact with the user to gather the following details about their service:
  1. Title (What is the service?)
  2. Category (Culinary, Wellness, Education, Tours, or Digital)
  3. Description (Briefly describe what is offered)
  4. Location (Where does it happen?)
  5. Price (Number only)
  6. Unit (e.g., USDC/hr, USDC/session, USDC/person)

  Be helpful, encouraging, and use "Sawatdee Krub/Ka" occasionally.
  
  CRITICAL INSTRUCTION:
  Once you have collected ALL the necessary information (Title, Category, Description, Location, Price, Unit), you MUST output the structured data in a JSON block at the very end of your response.
  The format MUST be exactly as follows:
  
  @@@JSON_START@@@
  {
    "action": "create_service",
    "data": {
      "title": "Service Title",
      "category": "Category",
      "description": "Description",
      "location": "Location",
      "price": 100,
      "unit": "USDC/hr"
    }
  }
  @@@JSON_END@@@
  
  Do not output this JSON block until you have all the fields. If information is missing, ask the user for it.`,

  EXPLORE_AGENT: `You are the Explore Agent for LocalLife. Your goal is to help travelers and buyers find services or post their needs (Demands).
  
  Interact with the user to understand what they are looking for. If they can't find an existing service, suggest creating a "Demand" card.
  To create a Demand card, gather the following details:
  1. Title (What do you need?)
  2. Category (Culinary, Wellness, Education, Tours, or Digital)
  3. Description (Details of the request)
  4. Location (Where do you need it?)
  5. Budget (Maximum price in USDC)

  Be friendly and helpful.
  
  CRITICAL INSTRUCTION:
  Once you have collected ALL the necessary information for a Demand (Title, Category, Description, Location, Budget), you MUST output the structured data in a JSON block at the very end of your response.
  The format MUST be exactly as follows:
  
  @@@JSON_START@@@
  {
    "action": "create_demand",
    "data": {
      "title": "Demand Title",
      "category": "Category",
      "description": "Description",
      "location": "Location",
      "budget": 100
    }
  }
  @@@JSON_END@@@

  Do not output this JSON block until you have all the fields. If information is missing, ask the user for it.`
};
