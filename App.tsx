
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
  MOCK_SERVICES, 
  MOCK_DEMANDS,
  SYSTEM_INSTRUCTIONS 
} from './constants';
import { getAgentResponseStream } from './services/geminiService';
import { apiService } from './services/apiService';
import ChatWindow from './components/ChatWindow';
import Marketplace from './components/Marketplace';
import DemandsBoard from './components/DemandsBoard';
import WalletModal from './components/WalletModal';
import Documentation from './components/Documentation';
import X402Standard from './components/X402Standard';
import SmartEscrow from './components/SmartEscrow';
import Home from './components/Home';
import BackgroundEffect from './components/BackgroundEffect';

type ViewType = 'home' | 'explore' | 'offer' | 'docs' | 'x402' | 'escrow';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [demands, setDemands] = useState<Demand[]>(MOCK_DEMANDS);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [focusedItem, setFocusedItem] = useState<any | null>(null);

  const [buyerMessages, setBuyerMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Explore mode active. I can help you find verified services in Chiang Mai.', timestamp: Date.now() }
  ]);
  const [sellerMessages, setSellerMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Offer mode active. Ready to tokenize your skills as X402 assets.', timestamp: Date.now() }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {};
    loadData();
  }, []);

  const connectWallet = () => setIsWalletModalOpen(true);
  const handleConnectWallet = (walletName: string) => {
    setWalletConnected(true);
    setIsWalletModalOpen(false);
  };

  const navigateToDashboard = (targetRole: UserRole) => {
    setRole(targetRole);
    setView(targetRole === UserRole.BUYER ? 'explore' : 'offer');
  };

  const handleSendMessage = async (text: string, modelId: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    const assistantId = (Date.now() + 1).toString();
    const assistantPlaceholder: ChatMessage = { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() };

    const currentMsgs = role === UserRole.BUYER ? buyerMessages : sellerMessages;
    const setMsgs = role === UserRole.BUYER ? setBuyerMessages : setSellerMessages;
    const instruction = role === UserRole.BUYER ? SYSTEM_INSTRUCTIONS.EXPLORE_AGENT : SYSTEM_INSTRUCTIONS.OFFER_AGENT;

    setMsgs(prev => [...prev, userMessage, assistantPlaceholder]);
    
    try {
      const stream = await getAgentResponseStream([...currentMsgs, userMessage], instruction, modelId);
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
          
          // Remove JSON from UI for cleaner look
          const cleanText = fullResponse.replace(/@@@JSON_START@@@[\s\S]*?@@@JSON_END@@@/, '').trim();
          setMsgs(prev => prev.map(m => m.id === assistantId ? { ...m, content: cleanText } : m));

          if (actionData.action === 'create_demand') {
            const newDemand = await apiService.postDemand({
              id: `d-${Date.now()}`,
              ...actionData.data,
              buyerId: '0xCurrentUser',
              timestamp: Date.now(),
              avatarUrl: 'https://i.pravatar.cc/150?u=0xCurrentUser'
            });
            setDemands(prev => [newDemand, ...prev]);
            alert(`🎉 Demand Card Created: ${actionData.data.title}`);
          } else if (actionData.action === 'create_service') {
             const newService = await apiService.createService({
              id: `s-${Date.now()}`,
              ...actionData.data,
              sellerId: '0xCurrentUser',
              tokenAddress: `0x${Date.now().toString(16)}`,
              imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
              avatarUrl: 'https://i.pravatar.cc/150?u=0xCurrentUser'
            });
            setServices(prev => [newService, ...prev]);
            alert(`🎉 Service Listed: ${actionData.data.title}`);
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

  const handleLocate = (item: any) => {
    setFocusedItem(item);
    setView('home');
    // Give react time to switch view then scroll
    setTimeout(() => {
      document.getElementById('map-registry')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleAction = async (item: any) => {
    if (!walletConnected) { setIsWalletModalOpen(true); return; }
    if (role === UserRole.BUYER) {
      const newOrder = await apiService.createOrder(item.id, '0xCurrentBuyer');
      setOrders(prev => [...prev, newOrder]);
      alert(`Booking initiated! Smart Escrow created for: ${item.title}`);
    } else {
      alert(`Response sent to: ${item.title}`);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'home': 
        return <Home services={services} demands={demands} onAction={handleAction} focusItem={focusedItem} />;
      case 'explore': 
        return <Marketplace services={services} onBook={handleAction} onLocate={handleLocate} />;
      case 'offer': 
        return <DemandsBoard demands={demands} onAccept={handleAction} onLocate={handleLocate} />;
      case 'docs': 
        return <Documentation />;
      case 'x402': 
        return <X402Standard />;
      case 'escrow': 
        return <SmartEscrow />;
      default: 
        return <Home services={services} demands={demands} onAction={handleAction} focusItem={focusedItem} />;
    }
  };

  return (
    <div className="relative selection:bg-blue-100 selection:text-blue-900">
      <BackgroundEffect />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} onConnect={handleConnectWallet} />

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
        <div className="flex items-center gap-6">
          <button onClick={connectWallet} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-black/10">{walletConnected ? '0x3f...2e4d' : 'Connect Wallet'}</button>
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
        <aside className={`fixed right-0 top-20 bottom-0 z-40 transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-3xl shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.05)] ${sidebarOpen ? 'w-[400px] border-l border-black/5' : 'w-0'}`}><div className="w-[400px] h-full"><ChatWindow role={role} onRoleChange={(r) => { setRole(r); setView(r === UserRole.BUYER ? 'explore' : 'offer'); }} messages={role === UserRole.BUYER ? buyerMessages : sellerMessages} onSendMessage={handleSendMessage} isLoading={isLoading} className="h-full" /></div></aside>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-500 flex items-center justify-center group ${sidebarOpen ? 'right-[400px]' : 'right-0'}`} aria-label="Toggle AI Agent"><div className={`flex items-center gap-2 px-3 py-6 rounded-l-3xl shadow-2xl border-y border-l transition-all ${sidebarOpen ? 'bg-white border-black/5 text-slate-400 hover:text-blue-600' : 'bg-slate-900 border-white/10 text-white hover:bg-blue-600 translate-x-1 hover:translate-x-0'}`}><div className="flex flex-col items-center gap-1"><span className={`text-[10px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-lr] transition-opacity ${sidebarOpen ? 'opacity-40' : 'opacity-100'}`}>{sidebarOpen ? 'CLOSE' : 'AGENT'}</span><svg className={`w-5 h-5 mt-2 transition-transform duration-500 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></div></div></button>
      </div>
    </div>
  );
};

export default App;
