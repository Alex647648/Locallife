
import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Protocol Overview</span>
        <h1 className="text-6xl font-bold tracking-tight text-slate-900">How LocalLife Works</h1>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          LocalLife is a peer-to-peer coordination protocol designed to bring real-world services onto the blockchain through AI-enabled agentic flows and x402 tokenization.
        </p>
      </header>

      {/* Core Mechanics: Trust Triangle */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Core Mechanics: Trust Triangle</h2>
          <div className="h-px w-full bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI Agent */}
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Interface | Intent Capture</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
              <strong>AI Agent</strong> — Converts natural language dialogue into structured on-chain evidence. Hides Web3 complexity, transforming conversations into on-chain proof.
            </p>
            <div className="space-y-3 text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-700 mb-1">Explore Agent (Buyer)</p>
                <p>Real-time analysis of user budget, location preferences, and time requirements. Uses Google Gemini for semantic matching, automatically recommending services or guiding demand posting.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1">Offer Agent (Seller)</p>
                <p>Collects service information through 3-5 rounds of natural conversation, automatically matches buyer needs, generates service card previews, and supports conversational listing.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1">AI Mediation | On-Chain Notary</p>
                <p>AI records user intent throughout the process. When disputes occur, AI intent evidence serves as the basis for arbitration. Upgraded from "chat assistant" to "on-chain notary".</p>
              </div>
            </div>
          </div>

          {/* ERC-8004 */}
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-600/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Credit Layer | Reputation Asset</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
              <strong>ERC-8004</strong> — Pay-before-feedback logic. Every order builds your portable 'Honor Badge'. Post-payment feedback. Every successful order becomes a portable "on-chain badge" for sellers.
            </p>
            <div className="space-y-3 text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-700 mb-1">IdentityRegistry</p>
                <p>Service providers register on-chain Agent identity, bind metadata URI, mint non-transferable soul-bound tokens, ensuring identity is bound to wallet address.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1">ReputationRegistry</p>
                <p>Buyers submit 1-5 star ratings (stored on-chain as 20-100 values), ratings are permanently stored and immutable, supports querying historical ratings by Agent ID.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1">On-Chain Verifiable Trust</p>
                <p>Identity registration is on-chain and unforgeable, ratings are written to smart contracts and cannot be deleted, all records are on-chain verifiable and fully transparent.</p>
              </div>
            </div>
          </div>

          {/* x402 Escrow */}
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-black/10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Settlement | Escrow</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
              <strong>x402 Escrow</strong> — Smart locking (Commit) and instant release (Confirm) upon task completion. Booking lock (Commit), dialogue confirmation means settlement (Confirm).
            </p>
            <div className="space-y-3 text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-700 mb-1">HTTP 402 Protocol</p>
                <p>Implemented based on HTTP 402 status code. Server returns payment requirements, buyer signs EIP-3009 authorization, completes USDC transfer through Facilitator.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1">Gasless Payment Experience</p>
                <p>Uses EIP-3009 transferWithAuthorization. Buyers sign authorization without paying gas fees, providing a user experience close to traditional payments.</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-1">True Peer-to-Peer</p>
                <p>The protocol does not hold any user funds. USDC transfers directly from buyer wallet to seller wallet, no intermediary fees, no hidden costs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Watchdog & Lifecycle */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">The Lifecycle</h2>
          <div className="h-px w-full bg-slate-100"></div>
        </div>
        <div className="space-y-6">
          {[
            { 
              step: '01', 
              title: 'Intent Definition', 
              desc: 'Buyers describe their needs through Explore Agent using natural language. AI analyzes budget, location preferences, and time requirements in real-time, capturing user intent and converting it into structured data.',
              element: 'AI Agent'
            },
            { 
              step: '02', 
              title: 'Asset Matching', 
              desc: 'Agent queries the service marketplace based on semantic matching, recommends matching services or guides demand posting. Simultaneously searches ERC-8004 on-chain Agent identities and displays reputation badges.',
              element: 'AI Agent + ERC-8004'
            },
            { 
              step: '03', 
              title: 'Escrow Lock', 
              desc: 'Buyer initiates booking, creating an order (CREATED). Builds payment request through x402 protocol, uses EIP-3009 authorized transfer. USDC transfers directly from buyer wallet to seller address, order status updates to PAID.',
              element: 'x402 Escrow'
            },
            { 
              step: '04', 
              title: 'Service Delivery', 
              desc: 'Seller fulfills real-world service, order status flows from IN_SERVICE → COMPLETED. Both parties can communicate in real-time through order chat functionality.',
              element: 'AI Agent (Mediation)'
            },
            { 
              step: '05', 
              title: 'Consensus Release', 
              desc: 'After service completion, buyer submits ERC-8004 on-chain rating (1-5 stars), rating is permanently stored. Order is finally settled as SETTLED. If disputes occur, AI intent evidence serves as arbitration basis.',
              element: 'ERC-8004 + x402'
            }
          ].map((item) => (
            <div key={item.step} className="flex gap-8 group">
              <span className="text-4xl font-bold text-slate-200 group-hover:text-blue-100 transition-colors font-mono">{item.step}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    {item.element}
                  </span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Protocol Watchdog */}
        <div className="mt-12 p-8 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-[2.5rem]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">PROTOCOL_WATCHDOG</h3>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
            <pre className="text-xs font-mono text-slate-700 leading-relaxed">
{`// PROTOCOL_WATCHDOG
IF (dispute_triggered) {
  VERIFY(intent_log);      // AI intent evidence verification
  EXECUTE(x402_mediation); // x402 protocol arbitration
  QUERY(erc8004_reputation); // Query on-chain reputation history
}`}
            </pre>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              AI is not just translation or search; it records intent throughout the process. When disputes occur, AI intent evidence serves as the basis for arbitration. Combined with ERC-8004 on-chain reputation history and x402 payment records, it achieves a fair and transparent on-chain arbitration mechanism.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
