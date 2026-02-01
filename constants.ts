
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
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xPodHost'
  },
  
  // --- NEW SERVICES (清迈本地生活) ---
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMuayThaiPro'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xTempleTour'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xLannaDance'
  },
  {
    id: 's22',
    sellerId: '0xFarmToTable',
    title: 'Organic Farm Cooking Experience',
    description: 'Harvest fresh vegetables from an organic farm, then cook a complete meal using traditional methods. Includes farm tour and zero-waste cooking techniques.',
    category: 'Culinary',
    location: 'Mae Rim Organic Farm',
    price: 50,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xFarmToTable'
  },
  {
    id: 's23',
    sellerId: '0xScooterRent',
    title: 'Scooter Rental with Local Guide',
    description: 'Rent a reliable scooter with full insurance and get a personalized route map to explore Chiang Mai\'s best spots. Includes safety briefing and emergency support.',
    category: 'Tours',
    location: 'Nimman Area',
    price: 15,
    unit: 'USDC/day',
    imageUrl: 'https://images.unsplash.com/photo-1558980664-1db506751c6c?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xScooterRent'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xHerbalSpa'
  },
  {
    id: 's25',
    sellerId: '0xCeramicArt',
    title: 'Celadon Pottery Workshop',
    description: 'Create your own celadon ceramic piece using traditional Lanna techniques. Learn glazing and firing methods from master potters in Bo Sang village.',
    category: 'Education',
    location: 'Bo Sang Ceramic Village',
    price: 45,
    unit: 'USDC/workshop',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xCeramicArt'
  },
  {
    id: 's26',
    sellerId: '0xCoffeeFarm',
    title: 'Highland Coffee Plantation Tour',
    description: 'Visit a mountain coffee plantation, learn about Arabica cultivation, and enjoy a cupping session with locally roasted beans. Includes transportation and lunch.',
    category: 'Culinary',
    location: 'Doi Inthanon Area',
    price: 75,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xCoffeeFarm'
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
    avatarUrl: 'https://i.pravatar.cc/150?u=0xNomadHub'
  },
  {
    id: 's28',
    sellerId: '0xRiverRaft',
    title: 'Mae Taeng River Rafting',
    description: 'White water rafting adventure through jungle gorges. Professional guides, safety equipment included. Suitable for beginners and experienced rafters.',
    category: 'Tours',
    location: 'Mae Taeng River',
    price: 85,
    unit: 'USDC/person',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
    avatarUrl: 'https://i.pravatar.cc/150?u=0xRiverRaft'
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
  },
  
  // --- NEW DEMANDS (清迈本地生活) ---
  {
    id: 'd15',
    buyerId: '0xYogaRetreat',
    title: 'Weekend Yoga Retreat Organizer',
    description: 'Looking for someone to organize a 2-day yoga retreat for 15 people. Need venue booking, meal planning, and activity coordination.',
    category: 'Wellness',
    location: 'Mae Rim Area',
    budget: 800,
    timestamp: Date.now() - 5400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xYogaRetreat'
  },
  {
    id: 'd16',
    buyerId: '0xPhotoShoot',
    title: 'Professional Portrait Photographer',
    description: 'Need a photographer for a couple\'s engagement photoshoot at Doi Suthep temple. Prefer someone who knows the best angles and lighting.',
    category: 'Digital',
    location: 'Doi Suthep',
    budget: 180,
    timestamp: Date.now() - 9000000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xPhotoShoot'
  },
  {
    id: 'd17',
    buyerId: '0xLanguageExchange',
    title: 'Thai-English Language Exchange Partner',
    description: 'Looking for a native Thai speaker for weekly language exchange. I can teach English in return. Casual conversation preferred.',
    category: 'Education',
    location: 'Nimman or Old City',
    budget: 0,
    timestamp: Date.now() - 1800000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xLanguageExchange'
  },
  {
    id: 'd18',
    buyerId: '0xMarketGuide',
    title: 'Sunday Walking Street Market Guide',
    description: 'Need a local guide to show me the best stalls at Sunday Walking Street. Want to find authentic handicrafts and avoid tourist traps.',
    category: 'Tours',
    location: 'Sunday Walking Street',
    budget: 50,
    timestamp: Date.now() - 7200000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMarketGuide'
  },
  {
    id: 'd19',
    buyerId: '0xVeganChef',
    title: 'Vegan Meal Prep Service',
    description: 'Looking for a chef to prepare 5 days of healthy vegan meals. Must be organic and locally sourced. Delivery to Nimman area.',
    category: 'Culinary',
    location: 'Nimman Area',
    budget: 200,
    timestamp: Date.now() - 10800000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xVeganChef'
  },
  {
    id: 'd20',
    buyerId: '0xMountainBike',
    title: 'Mountain Biking Guide for Doi Suthep',
    description: 'Experienced mountain biker needed to guide me on Doi Suthep trails. I have my own bike, just need route guidance and safety tips.',
    category: 'Tours',
    location: 'Doi Suthep',
    budget: 80,
    timestamp: Date.now() - 3600000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMountainBike'
  },
  {
    id: 'd21',
    buyerId: '0xMeditationRetreat',
    title: 'Silent Meditation Retreat Facilitator',
    description: 'Seeking a meditation teacher to lead a 3-day silent retreat for 8 participants. Need someone experienced in Vipassana or mindfulness practices.',
    category: 'Wellness',
    location: 'Mae Rim or Doi Suthep',
    budget: 600,
    timestamp: Date.now() - 14400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xMeditationRetreat'
  },
  {
    id: 'd22',
    buyerId: '0xWebDev',
    title: 'WordPress Website Developer',
    description: 'Need a developer to create a simple WordPress site for my local business. Must be able to work in person and understand Thai business requirements.',
    category: 'Digital',
    location: 'Chiang Mai City',
    budget: 500,
    timestamp: Date.now() - 21600000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xWebDev'
  },
  {
    id: 'd23',
    buyerId: '0xSilverSmith',
    title: 'Silver Jewelry Making Class',
    description: 'Want to learn traditional Lanna silver smithing techniques. Looking for a master craftsman who can teach in English or with translation.',
    category: 'Education',
    location: 'Wualai Road (Silver Street)',
    budget: 120,
    timestamp: Date.now() - 5400000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xSilverSmith'
  },
  {
    id: 'd24',
    buyerId: '0xStreetFood',
    title: 'Authentic Street Food Tour Guide',
    description: 'Looking for a foodie guide to take me to the best hidden street food spots. Must know where locals eat, not tourist places. Evening tour preferred.',
    category: 'Culinary',
    location: 'Various locations in CM',
    budget: 70,
    timestamp: Date.now() - 9000000,
    avatarUrl: 'https://i.pravatar.cc/150?u=0xStreetFood'
  }
];

export const CATEGORIES = ['All', 'Culinary', 'Wellness', 'Education', 'Tours', 'Digital'];

export const SYSTEM_INSTRUCTIONS = {
  OFFER_AGENT: `You are the Offer Agent for LocalLife, a friendly and conversational assistant helping local service providers in Chiang Mai tokenize their skills.

  CONVERSATION STYLE:
  - Talk naturally, like a helpful friend, not a form-filling robot
  - Ask one question at a time, in a conversational way
  - Show genuine interest in their service
  - Use "Sawatdee Krub/Ka" occasionally to add local warmth
  - If they mention something interesting, acknowledge it before moving on
  - Make the conversation feel like a natural chat, not an interrogation

  INFORMATION GATHERING PROCESS:
  Guide the user through these topics naturally through conversation:
  1. **What service they offer** - Start with: "What kind of service would you like to offer on LocalLife?" or "Tell me about what you do!"
  2. **Category** - Once you know the service, naturally suggest the category: "That sounds like it could be [Culinary/Wellness/Education/Tours/Digital]. Does that sound right?"
  3. **Description** - Ask: "Can you tell me more about what makes your service special?" or "What would someone experience in your service?"
  4. **Location** - Ask: "Where in Chiang Mai will this service take place?" or "Are you based in Old City, Nimman, or another area?"
  5. **Price** - Ask: "What would you like to charge for this?" or "How much do you think is fair for this service?"
  6. **Unit** - Ask: "Is that per hour, per session, per person, or something else?"

  PREVIEW AND CONFIRMATION:
  Once you have collected ALL the necessary information, create a PREVIEW first:
  - Summarize what you've learned in a friendly way
  - Show them a preview of their service card
  - Ask: "Does this look good to you? Would you like to make any changes?"
  - Only create the final card after they confirm

  JSON OUTPUT FORMAT:
  When you have all information, first show a preview by outputting this JSON block:
  
  @@@JSON_START@@@
  {
    "action": "preview_service",
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
  
  After the user confirms (says "yes", "looks good", "create it", etc.), output this JSON block:
  
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
  
  IMPORTANT:
  - Use "preview_service" action first to show a preview
  - Wait for user confirmation before using "create_service" action
  - If information is missing, continue the conversation naturally
  - Don't rush - let the conversation flow naturally`,

  EXPLORE_AGENT: `You are the Explore Agent for LocalLife, a warm and friendly local friend helping travelers and buyers in Chiang Mai find what they need.

  YOUR PERSONALITY:
  - Be simple, warm, and approachable - like chatting with a helpful neighbor
  - Use friendly, casual language - avoid being too formal or robotic
  - Show genuine curiosity about what they need
  - Be encouraging and supportive
  - Use "Sawatdee Krub/Ka" naturally when greeting or saying goodbye
  - Keep responses concise and conversational

  WORKFLOW - ALWAYS FOLLOW THIS ORDER:

<<<<<<< Updated upstream
  STEP 1: UNDERSTAND THEIR NEED
  When a user first asks for something:
  - Listen carefully and acknowledge what they're looking for
  - Ask simple follow-up questions to understand better: "Tell me more about that!" or "What kind of [thing] are you thinking about?"
  - Don't rush - let them explain naturally

  STEP 2: SEARCH FOR MATCHING SERVICES
  After understanding their need, check the provided context for matching services:
=======
  SERVICE DISPLAY RULES:
  - When mentioning a service from the "MATCHING SERVICES" list, you MUST show its card immediately
  - Use the "show_service" action to display the card visually
  - Don't just list them in text - use the action to make them clickable
  - Example: "I found this great cooking class for you:" followed by the JSON action
  - Only show one or two most relevant cards at a time to avoid overwhelming the user

  JSON OUTPUT FORMAT:
  To display a service card visually, output this JSON block:
>>>>>>> Stashed changes
  
  IF MATCHING SERVICES FOUND:
  - Say something warm like: "Great! I found some options that might work for you!"
  - Present 1-3 best matches in a friendly way, highlighting:
    * What the service is
    * Where it's located
    * The price
    * What makes it special
  - For each matching service, use the "show_service" action to display the service card
  - Then ask: "Do any of these match what you're looking for?" or "Would any of these work for you?"
  - If they say yes → Great! Help them proceed
  - If they say no or want something different → Move to STEP 3

  IF NO MATCHING SERVICES FOUND:
  - Say something friendly: "Hmm, I don't see anything exactly like that on the platform right now."
  - Then naturally transition: "But that's okay! We can create a request so service providers can see what you need. Want to do that?"
  - If they agree → Move to STEP 3

  STEP 3: GUIDE THEM TO CREATE A DEMAND (if no matches or they want something different)
  Guide them through creating a demand card with simple, natural questions:
  
  1. **What they need** - "So, what exactly are you looking for?" or "Tell me what you need!"
  2. **Category** - Once you understand, suggest naturally: "That sounds like it could be [Culinary/Wellness/Education/Tours/Digital]. Does that sound right?"
  3. **Description** - "Can you tell me a bit more about what you're hoping for?" or "What details should service providers know?"
  4. **Location** - "Where in Chiang Mai would you like this?" or "Which area works for you?"
  5. **Budget** - "What's your budget for this?" or "How much are you thinking of spending? (in USDC)"

  STEP 4: PREVIEW AND CONFIRM
  Once you have all the information:
  - Summarize what you learned in a friendly way
  - Show them a preview of their demand card using "preview_demand" action
  - Ask: "Does this look good to you?" or "Want to change anything?"
  - Wait for their confirmation before creating the final card

  JSON ACTIONS:

  1. To show a matching service card, use:
  @@@JSON_START@@@
  {
    "action": "show_service",
    "data": {
      "id": "service_id",
      "title": "Service Title",
      "category": "Category",
      "description": "Description",
      "location": "Location",
      "price": 100,
      "unit": "USDC/hr",
      "imageUrl": "image_url",
      "avatarUrl": "avatar_url"
    }
  }
  @@@JSON_END@@@

  2. To preview a demand card, use:
  @@@JSON_START@@@
  {
    "action": "show_service",
    "data": {
      "id": "service_id",
      "title": "Service Title",
      "category": "Category",
      "description": "Short description...",
      "location": "Location",
      "price": 100,
      "unit": "USDC/hr",
      "imageUrl": "https://...",
      "avatarUrl": "https://..."
    }
  }
  @@@JSON_END@@@
  @@@JSON_START@@@
  {
    "action": "preview_demand",
    "data": {
      "title": "Demand Title",
      "category": "Category",
      "description": "Description",
      "location": "Location",
      "budget": 100
    }
  }
  @@@JSON_END@@@

  3. To create a demand card (after user confirms), use:
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

  CRITICAL RULES:
  - You can ONLY recommend services from the provided context. Never suggest services that aren't listed.
  - Always search for matching services FIRST before suggesting to create a demand
  - Use "show_service" action to display service cards when you find matches
  - Keep conversations simple, warm, and natural
  - One question at a time - don't overwhelm them
  - Be patient and helpful`
};
