import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  OrderStatus, 
  Service, 
  Demand,
  ChatMessage, 
  Order 
} from './types';
import { 
  SYSTEM_INSTRUCTIONS,
  MOCK_SERVICES,
  MOCK_DEMANDS
} from './constants';
import { getAgentResponseStream } from './services/geminiService';
import { apiService } from './services/apiService';
import { generateServiceImageUrl } from './utils/imageGenerator';
import ChatWindow from './components/ChatWindow';
import Marketplace from './components/Marketplace';
import DemandsBoard from './components/DemandsBoard';
import Documentation from './components/Documentation';
import X402Standard from './components/X402Standard';
import SmartEscrow from './components/SmartEscrow';
import Home from './components/Home';
import BackgroundEffect from './components/BackgroundEffect';
import { useBooking } from './hooks/useBooking';
import AgentRegistrationPanel from './components/AgentRegistrationPanel';
import FeedbackPanel from './components/FeedbackPanel';
import OrderChat from './components/OrderChat';
import AgentChatModal from './components/AgentChatModal';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

type ViewType = 'home' | 'explore' | 'offer' | 'docs' | 'x402' | 'escrow';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Wallet state from wagmi
  const { address, isConnected, chainId: currentChainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Format wallet address for display
  const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  
  const [services, setServices] = useState<Service[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [focusedItem, setFocusedItem] = useState<any | null>(null);
  const [agentChatService, setAgentChatService] = useState<Service | null>(null);

   const booking = useBooking();
   const [feedbackTarget, setFeedbackTarget] = useState<{ orderId: string; agentId?: string } | null>(null);
   const [pendingAgentId, setPendingAgentId] = useState<string | null>(null);

  const [buyerMessages, setBuyerMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'So nice to see you here! What do you want to explore today?', timestamp: Date.now() }
  ]);
  const [sellerMessages, setSellerMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'So nice to see you here! Tell me what you want to share today?', timestamp: Date.now() }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

   // Load data from backend on startup
   useEffect(() => {
     const loadData = async () => {
       setDataLoading(true);
       try {
         const [servicesData, demandsData, agentsRaw] = await Promise.all([
           apiService.getServices(),
           apiService.getDemands(),
           apiService.getErc8004Agents().catch(() => []),
         ]);

         // agentsRaw may be { items: [...], source, total } or just an array
         const agentItems: any[] = Array.isArray(agentsRaw) ? agentsRaw : ((agentsRaw as any)?.items || []);

         // Build lookup: ownerWalletLower → agent
         const agentsByOwner = new Map<string, any>();
         for (const agent of agentItems) {
           if (agent.owner) {
             agentsByOwner.set(agent.owner.toLowerCase(), agent);
           }
         }

         // Enrich existing services with reputation info from matching agents
         const enrichedServices = servicesData.map((s: Service) => {
           const agent = agentsByOwner.get(s.sellerId.toLowerCase());
           if (agent) {
             agentsByOwner.delete(s.sellerId.toLowerCase());
             return {
               ...s,
               reputation: {
                 agentId: agent.id,
                 averageRating: 0,
                 reviewCount: 0,
                 verified: true,
               },
             };
           }
           return s;
         });

          // Create synthetic Service objects for agents without backend services
          const syntheticServices: Service[] = [];
          agentsByOwner.forEach((agent, ownerLower) => {
            const meta = agent.metadata || agent;
            // Ensure location is always a string; if it's an object (e.g., { lat, lng }), fall back to default
            const locationValue = meta.location;
            const locationStr = typeof locationValue === 'string' ? locationValue : 'Chiang Mai';
            syntheticServices.push({
              id: `agent-${agent.id}`,
              sellerId: agent.owner || ownerLower,
              title: meta.name || `Agent #${agent.id}`,
              description: meta.description || 'On-chain registered agent',
              category: meta.category || 'general',
              location: locationStr,
              price: meta.pricing ? parseFloat(String(meta.pricing).replace(/[^0-9.]/g, '')) || 10 : 10,
              unit: 'USDC',
              reputation: {
                agentId: agent.id,
                averageRating: 0,
                reviewCount: 0,
                verified: true,
              },
            });
          });

         setServices([...enrichedServices, ...syntheticServices]);
         setDemands(demandsData);
         console.log(`Loaded ${servicesData.length} services, ${demandsData.length} demands, ${agentItems.length} agents`);
       } catch (error) {
         console.error('Failed to load data from backend:', error);
       } finally {
         setDataLoading(false);
       }
      };
      loadData();
    }, [refreshTrigger]);

   useEffect(() => {
     if (booking.bookingResult) {
       setFeedbackTarget({ orderId: booking.bookingResult.orderId, agentId: pendingAgentId || undefined });
       setPendingAgentId(null);
       booking.reset();
     }
   }, [booking.bookingResult, pendingAgentId]);

  useEffect(() => {
    if (booking.error) {
      alert(`Booking failed: ${booking.error}`);
      booking.reset();
    }
  }, [booking.error]);

  // Open wallet picker modal
  const connectWallet = () => setShowWalletModal(true);

  const navigateToDashboard = (targetRole: UserRole) => {
    setRole(targetRole);
    setView(targetRole === UserRole.BUYER ? 'explore' : 'offer');
  };

  const handleSendMessage = async (text: string, modelId: string, apiKey?: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    const assistantId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() };

    const currentMsgs = role === UserRole.BUYER ? buyerMessages : sellerMessages;
    const setMsgs = role === UserRole.BUYER ? setBuyerMessages : setSellerMessages;
    
    // 在调用 AI 前，先检索相关的服务和需求
    let relevantServices: Service[] = [];
    let relevantDemands: Demand[] = [];
    let searchContext = '';

     if (role === UserRole.BUYER) {
       // 买家模式：检索服务和需求
       try {
         // 获取所有服务和需求
         const allServices = await apiService.getServices();
         const allDemands = await apiService.getDemands();
         
         // Also include registered agents as searchable services
         const agentsRaw = await apiService.getErc8004Agents().catch(() => []);
         const agentItems: any[] = Array.isArray(agentsRaw) ? agentsRaw : ((agentsRaw as any)?.items || []);
         const serviceSellerIds = new Set(allServices.map((s: any) => s.sellerId.toLowerCase()));
         for (const agent of agentItems) {
           if (agent.owner && !serviceSellerIds.has(agent.owner.toLowerCase())) {
             const meta = agent.metadata || agent;
             const locationStr = typeof meta.location === 'string' ? meta.location : 'Chiang Mai';
             allServices.push({
               id: `agent-${agent.id}`,
               sellerId: agent.owner,
               title: meta.name || `Agent #${agent.id}`,
               description: meta.description || 'On-chain registered agent',
               category: meta.category || 'general',
               location: locationStr,
               price: meta.pricing ? parseFloat(String(meta.pricing).replace(/[^0-9.]/g, '')) || 10 : 10,
               unit: 'USDC',
             });
           }
         }
         
         console.log(`[Search] Fetched ${allServices.length} services, ${allDemands.length} demands`);
        
        // 智能关键词提取和匹配
        const userTextLower = text.toLowerCase();
        
        // 类别映射（支持中英文和同义词）
        const categoryMap: { [key: string]: string[] } = {
          'culinary': ['culinary', 'cooking', 'food', 'restaurant', 'chef', 'cuisine', '烹饪', '美食', '料理'],
          'wellness': ['wellness', 'health', 'fitness', 'yoga', 'massage', 'spa', '健康', '健身', '瑜伽', '按摩'],
          'education': ['education', 'class', 'course', 'lesson', 'tutor', 'learn', '教育', '课程', '学习', '教学'],
          'tours': ['tour', 'guide', 'travel', 'trip', 'excursion', 'sightseeing', '旅游', '导游', '旅行', '观光'],
          'digital': ['digital', 'online', 'remote', 'virtual', 'web', 'tech', '数字', '在线', '远程', '虚拟']
        };
        
        // 查找匹配的类别
        let matchedCategories: string[] = [];
        for (const [category, keywords] of Object.entries(categoryMap)) {
          if (keywords.some(kw => userTextLower.includes(kw))) {
            matchedCategories.push(category);
          }
        }
        
        // 提取位置关键词（常见城市和地点）
        const locationKeywords = ['chiang mai', 'bangkok', 'phuket', 'pattaya', '清迈', '曼谷', '普吉', '芭提雅'];
        const matchedLocation = locationKeywords.find(loc => userTextLower.includes(loc));
        
        // 提取用户查询中的关键词（用于直接匹配title和description）
        // 改进：保留更多关键词，包括短词和重要词汇
        const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'let', 'put', 'say', 'she', 'too', 'use', 'want', 'find', 'looking', 'a', 'an', 'i', 'am', 'is', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'from', 'as', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must'];
        const userKeywords = userTextLower
          .split(/\s+/)
          .filter(w => w.length >= 2 && !stopWords.includes(w));
        
        // 构建搜索查询字符串（用于模糊匹配）
        const searchQuery = userTextLower.trim();
        
        // 筛选服务和需求 - 使用更灵活的匹配策略
        if (matchedCategories.length > 0) {
          // 先按类别匹配，然后按关键词匹配
          relevantServices = allServices.filter(s => {
            // 类别匹配
            const categoryMatch = matchedCategories.some(cat => s.category.toLowerCase() === cat);
            // 关键词匹配（title或description）
            const keywordMatch = userKeywords.some(kw => 
              s.title.toLowerCase().includes(kw) || 
              s.description.toLowerCase().includes(kw)
            );
            // 全文匹配（更宽松的匹配）
            const fullTextMatch = s.title.toLowerCase().includes(searchQuery) || 
                                  s.description.toLowerCase().includes(searchQuery);
            return categoryMatch || keywordMatch || fullTextMatch;
          });
          
          relevantDemands = allDemands.filter(d => {
            const categoryMatch = matchedCategories.some(cat => d.category.toLowerCase() === cat);
            const keywordMatch = userKeywords.some(kw => 
              d.title.toLowerCase().includes(kw) || 
              d.description.toLowerCase().includes(kw)
            );
            const fullTextMatch = d.title.toLowerCase().includes(searchQuery) || 
                                  d.description.toLowerCase().includes(searchQuery);
            return categoryMatch || keywordMatch || fullTextMatch;
          });
        } else {
          // 如果没有匹配的类别，使用全文搜索
          relevantServices = allServices.filter(s => {
            const keywordMatch = userKeywords.some(kw => 
              s.title.toLowerCase().includes(kw) || 
              s.description.toLowerCase().includes(kw) ||
              s.location.toLowerCase().includes(kw) ||
              s.category.toLowerCase().includes(kw)
            );
            const fullTextMatch = s.title.toLowerCase().includes(searchQuery) || 
                                  s.description.toLowerCase().includes(searchQuery);
            return keywordMatch || fullTextMatch;
          });
          
          relevantDemands = allDemands.filter(d => {
            const keywordMatch = userKeywords.some(kw => 
              d.title.toLowerCase().includes(kw) || 
              d.description.toLowerCase().includes(kw) ||
              d.location.toLowerCase().includes(kw) ||
              d.category.toLowerCase().includes(kw)
            );
            const fullTextMatch = d.title.toLowerCase().includes(searchQuery) || 
                                  d.description.toLowerCase().includes(searchQuery);
            return keywordMatch || fullTextMatch;
          });
        }
        
        // 如果匹配了位置，进一步筛选
        if (matchedLocation) {
          relevantServices = relevantServices.filter(s => 
            s.location.toLowerCase().includes(matchedLocation)
          );
          relevantDemands = relevantDemands.filter(d => 
            d.location.toLowerCase().includes(matchedLocation)
          );
        }

        // 调试日志（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log('[Search Debug]', {
            userQuery: text,
            allServicesCount: allServices.length,
            matchedCategories,
            userKeywords,
            relevantServicesCount: relevantServices.length,
            relevantServices: relevantServices.map(s => ({ id: s.id, title: s.title }))
          });
        }

        // 构建搜索上下文 - 更友好的格式，包含完整服务信息
        if (relevantServices.length > 0 || relevantDemands.length > 0) {
          searchContext = '\n\n=== ⚠️ CRITICAL: CHECK THIS FIRST! MATCHING SERVICES FOUND ===\n';
          searchContext += `User query: "${text}"\n`;
          searchContext += 'I have already searched the LocalLife platform and found matching services for the user\'s request.\n';
          searchContext += 'YOU MUST check this list FIRST before asking any follow-up questions!\n';
          searchContext += 'If services are listed below, present them immediately using the "show_service" action.\n';
          searchContext += 'DO NOT say "I don\'t see any" if services are listed here!\n\n';
          
          if (relevantServices.length > 0) {
            searchContext += `✅ FOUND ${relevantServices.length} MATCHING SERVICE(S) - YOU MUST SHOW THESE:\n\n`;
            relevantServices.slice(0, 5).forEach((s, idx) => {
              searchContext += `[SERVICE #${idx + 1}]\n`;
              searchContext += `ID: ${s.id}\n`;
              searchContext += `Title: "${s.title}"\n`;
              searchContext += `Category: ${s.category}\n`;
              searchContext += `Location: ${s.location}\n`;
              searchContext += `Price: ${s.price} ${s.unit}\n`;
              searchContext += `Description: ${s.description}\n`;
              searchContext += `Image: ${s.imageUrl || 'N/A'}\n`;
              searchContext += `Avatar: ${s.avatarUrl || 'N/A'}\n`;
              searchContext += `\nTo show this service card, use:\n`;
              searchContext += `@@@JSON_START@@@\n{"action": "show_service", "data": {"id": "${s.id}", "title": "${s.title}", "category": "${s.category}", "description": "${s.description}", "location": "${s.location}", "price": ${s.price}, "unit": "${s.unit}", "imageUrl": "${s.imageUrl || ''}", "avatarUrl": "${s.avatarUrl || ''}"}}\n@@@JSON_END@@@\n\n`;
            });
            searchContext += '⚠️ ACTION REQUIRED: Present these services to the user immediately! Use "show_service" action for each one.\n';
            searchContext += 'DO NOT ask follow-up questions if services are found - show them first!\n';
            searchContext += 'DO NOT say "I don\'t see any" - the services are listed above!\n\n';
          }
          
          if (relevantDemands.length > 0) {
            searchContext += `Also found ${relevantDemands.length} related demand(s) (for reference):\n`;
            relevantDemands.slice(0, 3).forEach((d, idx) => {
              searchContext += `${idx + 1}. [DEMAND] "${d.title}" - ${d.category} - ${d.location} - Budget: ${d.budget} USDC\n`;
            });
            searchContext += '\n';
          }
          
          searchContext += 'CRITICAL: You can ONLY recommend services from the list above. If services are found, show them immediately!\n';
          searchContext += 'If you see services listed above, you MUST show them - do not say you cannot find any!\n';
        } else {
          searchContext = '\n\n=== NO MATCHING SERVICES FOUND ===\n';
          searchContext += 'I searched the LocalLife platform but didn\'t find any services matching what the user is looking for.\n';
          searchContext += 'This is perfectly fine! You should:\n';
          searchContext += '1. Let them know in a friendly way: "I don\'t see anything exactly like that right now"\n';
          searchContext += '2. Suggest creating a demand: "But we can create a request so service providers can see what you need! Want to do that?"\n';
          searchContext += '3. If they agree, guide them through creating a demand card with simple, natural questions\n';
          searchContext += '4. Ask for: what they need, category, description, location, and budget\n';
          searchContext += '5. Show a preview and get confirmation before creating\n';
        }
      } catch (error) {
        console.error('Error fetching services/demands:', error);
        searchContext = '\n\n=== SEARCH UNAVAILABLE ===\n';
        searchContext += 'Unable to search the LocalLife platform at the moment. You can still help the user, but you should suggest they check the marketplace directly or create a demand. Remember: you can only work with LocalLife platform data.\n';
      }
    } else if (role === UserRole.SELLER) {
      // 卖家模式：检索匹配的需求
      // 计算用户消息数量（对话轮数）
      const userMessageCount = currentMsgs.filter(m => m.role === 'user').length;
      const shouldRecommendDemands = userMessageCount >= 3; // 至少3轮对话后才推荐
      
      // 只有在对话轮数足够时才进行需求匹配
      if (shouldRecommendDemands) {
        try {
          // 获取所有需求（如果API返回空，使用本地MOCK数据作为后备）
          let allDemands = await apiService.getDemands();
          
          // 如果API返回空数组，使用本地MOCK数据
          if (allDemands.length === 0) {
            allDemands = MOCK_DEMANDS;
          }
          
          // 智能关键词提取和匹配 - 将卖家的能力描述与需求进行匹配
          const userTextLower = text.toLowerCase();
        
        // 类别映射（支持中英文和同义词）
        const categoryMap: { [key: string]: string[] } = {
          'culinary': ['culinary', 'cooking', 'food', 'restaurant', 'chef', 'cuisine', '烹饪', '美食', '料理'],
          'wellness': ['wellness', 'health', 'fitness', 'yoga', 'massage', 'spa', '健康', '健身', '瑜伽', '按摩'],
          'education': ['education', 'class', 'course', 'lesson', 'tutor', 'learn', '教育', '课程', '学习', '教学'],
          'tours': ['tour', 'guide', 'travel', 'trip', 'excursion', 'sightseeing', '旅游', '导游', '旅行', '观光'],
          'digital': ['digital', 'online', 'remote', 'virtual', 'web', 'tech', '数字', '在线', '远程', '虚拟']
        };
        
        // 查找匹配的类别
        let matchedCategories: string[] = [];
        for (const [category, keywords] of Object.entries(categoryMap)) {
          if (keywords.some(kw => userTextLower.includes(kw))) {
            matchedCategories.push(category);
          }
        }
        
        // 提取位置关键词
        const locationKeywords = ['chiang mai', 'bangkok', 'phuket', 'pattaya', '清迈', '曼谷', '普吉', '芭提雅'];
        const matchedLocation = locationKeywords.find(loc => userTextLower.includes(loc));
        
        // 提取用户查询中的关键词
        const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'let', 'put', 'say', 'she', 'too', 'use', 'want', 'find', 'looking', 'a', 'an', 'i', 'am', 'is', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'from', 'as', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'offer', 'provide', 'can', 'help', 'do', 'service'];
        const userKeywords = userTextLower
          .split(/\s+/)
          .filter(w => w.length >= 2 && !stopWords.includes(w));
        
        // 构建搜索查询字符串
        const searchQuery = userTextLower.trim();
        
        // 筛选匹配的需求
        if (matchedCategories.length > 0) {
          relevantDemands = allDemands.filter(d => {
            const categoryMatch = matchedCategories.some(cat => d.category.toLowerCase() === cat);
            const keywordMatch = userKeywords.some(kw => 
              d.title.toLowerCase().includes(kw) || 
              d.description.toLowerCase().includes(kw)
            );
            const fullTextMatch = d.title.toLowerCase().includes(searchQuery) || 
                                  d.description.toLowerCase().includes(searchQuery);
            return categoryMatch || keywordMatch || fullTextMatch;
          });
        } else {
          relevantDemands = allDemands.filter(d => {
            const keywordMatch = userKeywords.some(kw => 
              d.title.toLowerCase().includes(kw) || 
              d.description.toLowerCase().includes(kw) ||
              d.location.toLowerCase().includes(kw) ||
              d.category.toLowerCase().includes(kw)
            );
            const fullTextMatch = d.title.toLowerCase().includes(searchQuery) || 
                                  d.description.toLowerCase().includes(searchQuery);
            return keywordMatch || fullTextMatch;
          });
        }
        
        // 如果匹配了位置，进一步筛选
        if (matchedLocation) {
          relevantDemands = relevantDemands.filter(d => 
            d.location.toLowerCase().includes(matchedLocation) || 
            d.location.toLowerCase() === 'remote'
          );
        }

        // 调试日志（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log('[Demand Match Debug]', {
            userQuery: text,
            allDemandsCount: allDemands.length,
            matchedCategories,
            userKeywords,
            relevantDemandsCount: relevantDemands.length,
            relevantDemands: relevantDemands.map(d => ({ id: d.id, title: d.title }))
          });
        }

          // 构建搜索上下文 - 匹配的需求信息
          if (relevantDemands.length > 0) {
            searchContext = '\n\n=== MATCHING DEMANDS FOUND (FRIENDLY SUGGESTION) ===\n';
            searchContext += `Based on what you've told me about your service, I found some people looking for what you might be able to offer.\n`;
            searchContext += 'These are just suggestions - you can check them out if you\'re interested, or we can continue creating your service card.\n\n';
            
            searchContext += `I found ${relevantDemands.length} potential match(es):\n\n`;
            relevantDemands.slice(0, 3).forEach((d, idx) => {
              searchContext += `[DEMAND #${idx + 1}]\n`;
              searchContext += `ID: ${d.id}\n`;
              searchContext += `Title: "${d.title}"\n`;
              searchContext += `Category: ${d.category}\n`;
              searchContext += `Location: ${d.location}\n`;
              searchContext += `Budget: ${d.budget} USDC\n`;
              searchContext += `Description: ${d.description}\n`;
              searchContext += `Avatar: ${d.avatarUrl || 'N/A'}\n`;
              searchContext += `\nTo show this demand card, use:\n`;
              searchContext += `@@@JSON_START@@@\n{"action": "show_demand", "data": {"id": "${d.id}", "title": "${d.title}", "category": "${d.category}", "description": "${d.description}", "location": "${d.location}", "budget": ${d.budget}, "avatarUrl": "${d.avatarUrl || ''}"}}\n@@@JSON_END@@@\n\n`;
            });
            searchContext += 'SUGGESTION: You can show these demands to the user in a friendly, non-pushy way.\n';
            searchContext += 'Say something like: "By the way, I noticed some people looking for [category] services. Would you like to see them? They might be a good match!"\n';
            searchContext += 'Use a friendly, suggestive tone - not urgent or demanding.\n';
            searchContext += 'If they\'re interested, show 1-2 most relevant cards using "show_demand" action.\n';
            searchContext += 'If they want to continue creating their service, that\'s perfectly fine too!\n';
          } else {
            searchContext = '\n\n=== NO MATCHING DEMANDS FOUND ===\n';
            searchContext += 'I searched the LocalLife platform but didn\'t find any demands matching what the user can offer.\n';
            searchContext += 'This is perfectly fine! Continue helping them create their service card.\n';
          }
        } catch (error) {
          console.error('Error fetching demands:', error);
          searchContext = '\n\n=== SEARCH UNAVAILABLE ===\n';
          searchContext += 'Unable to search the LocalLife platform at the moment. You can still help the user create their service card.\n';
        }
      } else {
        // 对话轮数不足，不进行需求匹配
        searchContext = '\n\n=== INFORMATION GATHERING PHASE ===\n';
        searchContext += `Current conversation round: ${userMessageCount + 1}\n`;
        searchContext += 'You are still in the information gathering phase. Continue asking friendly questions to understand:\n';
        searchContext += '1. What service they offer\n';
        searchContext += '2. Category\n';
        searchContext += '3. Description/details\n';
        searchContext += '4. Location\n';
        searchContext += '5. Price expectations\n';
        searchContext += '6. Unit (per hour, session, etc.)\n\n';
        searchContext += 'DO NOT search for or recommend demands yet. Wait until you have collected enough information (at least 3-5 rounds of conversation).\n';
        searchContext += 'Focus on understanding their service first, then we can look for matching opportunities later.\n';
      }
    }

    // 构建增强的系统指令
    let enhancedInstruction = role === UserRole.BUYER ? SYSTEM_INSTRUCTIONS.EXPLORE_AGENT : SYSTEM_INSTRUCTIONS.OFFER_AGENT;
    if (role === UserRole.BUYER) {
      enhancedInstruction += searchContext;
    } else if (role === UserRole.SELLER) {
      enhancedInstruction += searchContext;
    }

    setMsgs(prev => [...prev, userMessage, assistantPlaceholder]);
    
    try {
      const stream = await getAgentResponseStream([...currentMsgs, userMessage], enhancedInstruction, modelId, apiKey);
      let fullResponse = "";
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setMsgs(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk.text } : m));
        }
      }

      // Check for JSON action block
      const jsonMatch = fullResponse.match(/@@@JSON_START@@@([\s\S]*?)@@@JSON_END@@@/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const actionData = JSON.parse(jsonMatch[1]);
          
          // Preview actions are handled by ChatWindow's CardPreview component
          // Create actions are handled here
          if (actionData.action === 'preview_service' || actionData.action === 'preview_demand') {
            // Preview is handled in ChatWindow, keep the message with JSON for preview display
            // Don't remove JSON here - ChatWindow needs it to show preview
          } else if (actionData.action === 'create_demand') {
            // User confirmed, create the demand card
            const newDemand = await apiService.postDemand({
              id: `d-${Date.now()}`,
              ...actionData.data,
              buyerId: address || '0xCurrentUser',
              timestamp: Date.now(),
              avatarUrl: 'https://i.pravatar.cc/150?u=0xCurrentUser'
            });
            setDemands(prev => [newDemand, ...prev]);
            // Remove JSON from UI and add success message
            const cleanText = fullResponse.replace(/@@@JSON_START@@@[\s\S]*?@@@JSON_END@@@/g, '').trim();
            setMsgs(prev => prev.map(m => m.id === assistantId ? { ...m, content: cleanText + '\n\n✅ Demand card created successfully!' } : m));
          } else if (actionData.action === 'create_service') {
            // User confirmed, create the service card
            const autoImageUrl = generateServiceImageUrl({
              title: actionData.data.title || '',
              description: actionData.data.description,
              category: actionData.data.category || '',
              location: actionData.data.location
            });
            
            const newService = await apiService.createService({
              id: `s-${Date.now()}`,
              ...actionData.data,
              sellerId: address || '0xCurrentUser',
              walletAddress: address || undefined,
              tokenAddress: `0x${Date.now().toString(16)}`,
              imageUrl: autoImageUrl,
              avatarUrl: 'https://i.pravatar.cc/150?u=0xCurrentUser'
            });
            setServices(prev => [newService, ...prev]);
            // Remove JSON from UI and add success message
            const cleanText = fullResponse.replace(/@@@JSON_START@@@[\s\S]*?@@@JSON_END@@@/g, '').trim();
            setMsgs(prev => prev.map(m => m.id === assistantId ? { ...m, content: cleanText + '\n\n✅ Service card created successfully!' } : m));
          }
        } catch (e) {
          console.error("Failed to parse agent action", e);
        }
      }

    } catch (error) {
      setMsgs(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Error: Communication error." } : m));
    }
    setIsLoading(false);
  };

  const buildAgentSystemInstruction = (service: Service | null): string => {
    if (!service) return '';
    return `You are a customer service agent for the following service:

**Service**: ${service.title}
**Category**: ${service.category}
**Price**: ${service.price} ${service.unit}
**Location**: ${service.location}

**About this service**:
${service.description}

Answer customer questions based on the above information. Be helpful, concise, and friendly. If you don't have specific information to answer a question, say so honestly rather than making something up.`;
  };

  const handleChatAgent = (chatService: Service) => {
    // Look up the full service from enriched services state (which has reputation data)
    const enrichedService = services.find(s => s.id === chatService.id);
    // Use enriched version if found (has reputation), otherwise use the passed service
    setAgentChatService(enrichedService || chatService);
  };

  const handleLocate = (item: any) => {
    setFocusedItem(item);
    setView('home');
    // Give react time to switch view then scroll
    setTimeout(() => {
      document.getElementById('map-registry')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

   const handleAction = async (item: any) => {
      if (!isConnected) { connectWallet(); return; }
      if (role === UserRole.BUYER) {
        if (item.reputation?.agentId) {
          setPendingAgentId(item.reputation.agentId);
        }
        // Determine payTo: prefer walletAddress if valid, fallback to sellerId if valid, else undefined
        const payTo = (item.walletAddress && /^0x[0-9a-fA-F]{40}$/.test(item.walletAddress)) 
          ? item.walletAddress 
          : (/^0x[0-9a-fA-F]{40}$/.test(item.sellerId || '')) 
            ? item.sellerId 
            : undefined;
        await booking.book(item.id, item.price || 0, payTo);
      } else {
        alert(`Response sent to: ${item.title}`);
      }
    };

  // handleConfirmCard 已移除 - 现在只通过AI的create动作来创建卡片，避免重复创建

  const renderContent = () => {
    // Show loading state
    if (dataLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">L</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-sm font-medium text-slate-400">Loading services from backend...</span>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'home': 
        return <Home services={services} demands={demands} onAction={handleAction} focusItem={focusedItem} currentUserAddress={address} />;
      case 'explore': 
        return <Marketplace services={services} onBook={handleAction} onLocate={handleLocate} />;
       case 'offer': 
         return (
           <DemandsBoard 
             demands={demands} 
             onAccept={handleAction} 
             onLocate={handleLocate}
             onRegistrationSuccess={() => setRefreshTrigger(t => t + 1)}
           />
         );
      case 'docs': 
        return <Documentation />;
      case 'x402': 
        return <X402Standard />;
      case 'escrow': 
        return <SmartEscrow />;
      default: 
        return <Home services={services} demands={demands} onAction={handleAction} focusItem={focusedItem} currentUserAddress={address} />;
    }
  };

  return (
    <div className="relative selection:bg-blue-100 selection:text-blue-900">
      <BackgroundEffect />
      {/* Wallet connector picker modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowWalletModal(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Connect Wallet</h3>
            <p className="text-xs text-slate-400 mb-6">Choose a wallet to connect to LocalLife</p>
            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => { connect({ connector }); setShowWalletModal(false); }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">
                    {connector.name.includes('MetaMask') ? '🦊' : connector.name.includes('Coinbase') ? '🔵' : connector.name.includes('WalletConnect') ? '🔗' : '💎'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{connector.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">{connector.type}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowWalletModal(false)} className="w-full mt-4 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
      {booking.isBooking && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-900">Processing Payment...</p>
            <p className="text-xs text-slate-400 text-center">Signing x402 payment. Please confirm in your wallet.</p>
          </div>
        </div>
      )}
      {feedbackTarget && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mb-4">
              <h3 className="text-lg font-bold text-blue-900">Booking Confirmed!</h3>
              <p className="text-sm text-blue-700 mt-1">Order <span className="font-mono font-bold">{feedbackTarget.orderId}</span> paid.</p>
            </div>
            <FeedbackPanel orderId={feedbackTarget.orderId} agentId={feedbackTarget.agentId} onDismiss={() => setFeedbackTarget(null)} />
            
            {address && (
              <div className="mt-4 pb-4">
                <OrderChat orderId={feedbackTarget.orderId} userAddress={address} />
              </div>
            )}
          </div>
        </div>
      )}
      {agentChatService && (
        <AgentChatModal
          isOpen={agentChatService !== null}
          onClose={() => setAgentChatService(null)}
          service={agentChatService}
          systemInstruction={buildAgentSystemInstruction(agentChatService)}
        />
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-black/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-bold text-white group-hover:bg-blue-600 transition-all shadow-lg shadow-black/10">L</div>
            <span className="text-xl font-bold text-slate-900">LocalLife</span>
          </div>
          <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl ring-1 ring-black/[0.03]">
            <button onClick={() => navigateToDashboard(UserRole.BUYER)} className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${view === 'explore' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/[0.02]' : 'text-slate-400 hover:text-slate-600'}`}>Explore</button>
            <button onClick={() => navigateToDashboard(UserRole.SELLER)} className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${view === 'offer' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/[0.02]' : 'text-slate-400 hover:text-slate-600'}`}>Offer</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!dataLoading && (
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>{services.length} services</span>
              <span className="text-slate-200">|</span>
              <span>{demands.length} demands</span>
            </div>
          )}
          {/* Network switcher + wallet button */}
          {isConnected && currentChainId && (
            <div className="relative group">
              <button className="px-4 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600">
                {currentChainId === 11155111 ? 'Sepolia' : currentChainId === 84532 ? 'Base Sepolia' : currentChainId === 1 ? 'Ethereum' : `Chain ${currentChainId}`}
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-2 min-w-[160px] hidden group-hover:block z-50">
                {[{ id: 1, name: 'Ethereum' }, { id: 11155111, name: 'Sepolia' }, { id: 84532, name: 'Base Sepolia' }].map(chain => (
                  <button key={chain.id} onClick={() => switchChain({ chainId: chain.id as 1 | 11155111 | 84532 })} className={`block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${currentChainId === chain.id ? 'text-blue-600' : 'text-slate-600'}`}>
                    {currentChainId === chain.id && <span className="mr-1.5">●</span>}{chain.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isConnected ? (
            <button onClick={() => disconnect()} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-black/10">
              {formattedAddress}
            </button>
          ) : (
            <button onClick={connectWallet} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-black/10">
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <div className="pt-20 relative min-h-screen">
        <main className={`px-8 md:px-16 py-16 transition-all duration-500 ${sidebarOpen ? 'mr-[400px]' : 'mr-0'}`}>
          <div className="max-w-7xl mx-auto pb-32">{renderContent()}</div>
          <footer className="max-w-7xl mx-auto border-t border-slate-100 py-16 grid grid-cols-1 md:grid-cols-3 gap-16">
             <div><h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">LocalLife Labs</h4><p className="text-slate-400 text-sm leading-relaxed font-medium">Non-custodial service coordination for the next billion users.</p></div>
             <div className="col-span-2 grid grid-cols-2 gap-10">
                <div><h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">Protocol</h4><ul className="text-xs font-bold text-slate-400 space-y-4 uppercase tracking-widest"><li><button onClick={() => setView('docs')} className="hover:text-blue-600">Docs</button></li><li><button onClick={() => setView('x402')} className="hover:text-blue-600">X402 Standard</button></li><li><button onClick={() => setView('escrow')} className="hover:text-blue-600">Smart Escrow</button></li></ul></div>
                <div><h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">Network</h4><ul className="text-xs font-bold text-slate-400 space-y-4 uppercase tracking-widest"><li><a href="#" className="hover:text-blue-600">Sepolia Explorer</a></li><li><a href="#" className="hover:text-blue-600">Node Status</a></li><li><a href="#" className="hover:text-blue-600">Twitter</a></li></ul></div>
             </div>
          </footer>
        </main>
        <aside className={`fixed right-0 top-20 bottom-0 z-40 transition-all duration-500 overflow-hidden ${sidebarOpen ? 'w-[400px]' : 'w-0'}`}><div className="w-[400px] h-full"><ChatWindow role={role} onRoleChange={(r) => { setRole(r); setView(r === UserRole.BUYER ? 'explore' : 'offer'); }} messages={role === UserRole.BUYER ? buyerMessages : sellerMessages} onSendMessage={handleSendMessage} onBookService={handleAction} onAcceptDemand={handleAction} onLocate={handleLocate} onChatAgent={handleChatAgent} isLoading={isLoading} className="h-full" /></div></aside>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-500 flex items-center justify-center group ${sidebarOpen ? 'right-[400px]' : 'right-0'}`} aria-label="Toggle AI Agent"><div className={`flex items-center gap-2 px-3 py-6 rounded-l-3xl shadow-2xl border-y border-l transition-all ${sidebarOpen ? 'bg-white border-black/5 text-slate-400 hover:text-blue-600' : 'bg-slate-900 border-white/10 text-white hover:bg-blue-600 translate-x-1 hover:translate-x-0'}`}><div className="flex flex-col items-center gap-1"><span className={`text-[10px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-lr] transition-opacity ${sidebarOpen ? 'opacity-40' : 'opacity-100'}`}>{sidebarOpen ? 'CLOSE' : 'AGENT'}</span><svg className={`w-5 h-5 mt-2 transition-transform duration-500 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></div></div></button>
      </div>
    </div>
  );
};

export default App;
