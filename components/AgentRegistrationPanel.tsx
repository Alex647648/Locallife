import React, { useState } from 'react';
import { useAgentRegistration, type RegistrationInput } from '../hooks/useAgentRegistration';
import { useWalletAdapter } from '../hooks/useWalletAdapter';
import { SEPOLIA_CHAIN_ID } from '../services/erc8004WriteService';

interface AgentRegistrationPanelProps {
  prefillData?: Partial<RegistrationInput>;
}

const AgentRegistrationPanel: React.FC<AgentRegistrationPanelProps> = ({ prefillData }) => {
  const wallet = useWalletAdapter();
  const { register, isRegistering, result, error, reset } = useAgentRegistration();

  const [form, setForm] = useState<RegistrationInput>({
    name: prefillData?.name || '',
    description: prefillData?.description || '',
    category: prefillData?.category || 'general',
    location: prefillData?.location || '',
    pricing: prefillData?.pricing || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) return;
    await register(form);
  };

  const isWrongChain = wallet.chainId !== null && wallet.chainId !== SEPOLIA_CHAIN_ID;

  if (result) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Agent Registered On-Chain!</h3>
            <p className="text-xs text-emerald-600 font-mono mt-1">Tx: {result.txHash.slice(0, 16)}...{result.txHash.slice(-8)}</p>
          </div>
        </div>
        {result.agentId && (
          <div className="bg-emerald-100/50 rounded-xl p-3 mt-3">
            <p className="text-xs font-bold text-emerald-800">
              Your Agent ID: <span className="font-mono text-lg">{result.agentId}</span>
            </p>
            <p className="text-[10px] text-emerald-600 mt-1">
              Save this ID — buyers will use it to leave you on-chain feedback.
            </p>
          </div>
        )}
        <p className="text-sm text-emerald-700">Your agent identity is now on Sepolia via ERC-8004 IdentityRegistry.</p>
        <div className="flex gap-3">
          <a
            href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline"
          >
            View on Etherscan
          </a>
          <button onClick={reset} className="text-xs font-bold text-slate-400 hover:text-slate-600">
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-sm ring-1 ring-black/[0.02] space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Register as ERC-8004 Agent</h3>
        <p className="text-sm text-slate-400 mt-1">Mint your on-chain identity on Sepolia to build reputation and receive verified orders.</p>
      </div>

      {isWrongChain && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Your wallet is on chain {wallet.chainId}. This transaction requires <strong>Sepolia (11155111)</strong>. You'll be prompted to switch.
        </div>
      )}

      {!wallet.address ? (
        <button
          onClick={() => wallet.openWalletModal()}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
        >
          Connect Wallet First
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Agent Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. ChiangMai Guide"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="general">General</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transport</option>
                <option value="wellness">Wellness</option>
                <option value="tours">Tours & Experiences</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Service Description (Agent Knowledge) *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your services in detail — this becomes your AI agent's knowledge for answering customer questions..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">This description powers your AI customer service agent. Buyers can chat with your agent to learn more about your service.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Chiang Mai"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Pricing</label>
              <input
                type="text"
                value={form.pricing}
                onChange={(e) => setForm(prev => ({ ...prev, pricing: e.target.value }))}
                placeholder="e.g. $10/hour"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
              {error}
              <button onClick={reset} className="ml-2 underline font-bold">Dismiss</button>
            </div>
          )}

          <button
            type="submit"
            disabled={isRegistering || !form.name || !form.description}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isRegistering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering on Sepolia...
              </>
            ) : (
              'Register Agent on Sepolia'
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center">
            Requires Sepolia ETH for gas. Your agent URI will be hosted and linked on-chain.
          </p>
        </form>
      )}
    </div>
  );
};

export default AgentRegistrationPanel;
