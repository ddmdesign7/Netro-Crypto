import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  LayoutDashboard, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X,
  TrendingUp,
  PieChart,
  Coins
} from 'lucide-react';
import { cn, formatCurrency, formatPercent } from '@/src/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MOCK_PORTFOLIO, MOCK_TRANSACTIONS, MOCK_TOKENS, Token, Transaction } from '@/src/types';
import { NetroAIService } from '@/src/services/geminiService';
import { NetroAIModal } from '@/src/components/NetroAIModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'history' | 'defi'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // AI Modal State
  const [aiModal, setAiModal] = useState({
    isOpen: false,
    title: '',
    content: '',
    isLoading: false
  });

  const handleNetroAIAction = async (action: string, data?: any) => {
    setAiModal({ isOpen: true, title: 'NetroAI Analysis', content: '', isLoading: true });
    
    let result = '';
    try {
      switch (action) {
        case 'portfolio-summary':
          result = await NetroAIService.getPortfolioSummary(MOCK_PORTFOLIO);
          break;
        case 'explain-tx':
          result = await NetroAIService.explainTransaction(data);
          break;
        case 'risk-scan':
          result = await NetroAIService.getWalletRiskScan(MOCK_PORTFOLIO.tokens);
          break;
        case 'staking-projection':
          result = await NetroAIService.getStakingProjection(data);
          break;
        default:
          result = "Action not recognized.";
      }
      setAiModal(prev => ({ ...prev, content: result, isLoading: false }));
    } catch (error) {
      setAiModal(prev => ({ ...prev, content: "Failed to connect to NetroAI.", isLoading: false }));
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Coins },
    { id: 'history', label: 'History', icon: History },
    { id: 'defi', label: 'DeFi Hub', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C0E] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              Netro<span className="text-blue-500">Bank</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  activeTab === item.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNetroAIAction('risk-scan')}
              className="p-2 glass glass-hover rounded-xl text-emerald-400 border-emerald-500/20"
              title="NetroAI Risk Scan"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                isWalletConnected 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              )}
            >
              <Wallet className="w-4 h-4" />
              {isWalletConnected ? '0x7a...3f21' : 'Connect Wallet'}
            </button>
            <button 
              className="md:hidden p-2 glass rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 pt-24 px-6 bg-[#0A0C0E] md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full p-4 rounded-2xl text-lg font-medium flex items-center gap-4",
                    activeTab === item.id ? "bg-blue-600 text-white" : "glass text-gray-400"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Portfolio Value</p>
                      <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                        {formatCurrency(MOCK_PORTFOLIO.totalValue)}
                      </h1>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/20">
                        <ArrowUpRight className="w-4 h-4" />
                        {formatPercent(MOCK_PORTFOLIO.change24h)}
                      </div>
                      <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Past 24 Hours</p>
                    </div>
                  </div>
                  
                  <div className="h-[250px] w-full mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_PORTFOLIO.history}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="date" hide />
                        <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#3B82F6' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="glass rounded-3xl p-6 flex-1 flex flex-col justify-between border-l-4 border-blue-500">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">NetroAI Insight</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Portfolio Optimization</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Your Arbitrum exposure is up 5.8%. NetroAI suggests rebalancing or staking your ARB for 4.2% APY.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNetroAIAction('portfolio-summary')}
                    className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all border border-white/5"
                  >
                    Generate AI Summary
                  </button>
                </div>

                <div className="glass rounded-3xl p-6 flex-1 flex flex-col justify-between border-l-4 border-emerald-500">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Safety Score</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-black text-white">94</span>
                      <span className="text-gray-500 font-bold mb-1">/100</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      No high-risk approvals detected. Your wallet security is excellent.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNetroAIAction('risk-scan')}
                    className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all border border-white/5"
                  >
                    Run Security Scan
                  </button>
                </div>
              </div>
            </div>

            {/* Assets Table */}
            <div className="glass rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-400" />
                  Top Assets
                </h2>
                <button 
                  onClick={() => setActiveTab('assets')}
                  className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-widest">
                      <th className="px-6 py-4 font-bold">Asset</th>
                      <th className="px-6 py-4 font-bold text-right">Balance</th>
                      <th className="px-6 py-4 font-bold text-right">Price</th>
                      <th className="px-6 py-4 font-bold text-right">24h Change</th>
                      <th className="px-6 py-4 font-bold text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_TOKENS.slice(0, 4).map((token) => (
                      <tr key={token.symbol} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={token.icon} alt={token.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{token.symbol}</p>
                              <p className="text-gray-500 text-xs">{token.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {token.balance.toLocaleString()} {token.symbol}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatCurrency(token.price)}
                        </td>
                        <td className={cn(
                          "px-6 py-4 text-right font-bold",
                          token.change24h >= 0 ? "text-emerald-400" : "text-destructive"
                        )}>
                          {token.change24h > 0 ? '+' : ''}{token.change24h}%
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-white">
                          {formatCurrency(token.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight">Transaction History</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 glass rounded-xl text-sm font-bold hover:bg-white/10 transition-all">Export CSV</button>
                <button className="px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">Filter</button>
              </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="p-6 hover:bg-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                        tx.type === 'receive' ? "bg-emerald-500/20 text-emerald-400 shadow-emerald-500/10" :
                        tx.type === 'send' ? "bg-destructive/20 text-destructive shadow-destructive/10" :
                        "bg-blue-500/20 text-blue-400 shadow-blue-500/10"
                      )}>
                        {tx.type === 'receive' ? <ArrowDownLeft /> : 
                         tx.type === 'send' ? <ArrowUpRight /> : 
                         <RefreshCw />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg capitalize">{tx.type}</p>
                          <span className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {tx.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {new Date(tx.timestamp).toLocaleDateString()} • {tx.hash}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className={cn(
                          "text-xl font-black",
                          tx.type === 'receive' ? "text-emerald-400" : "text-white"
                        )}>
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
                          {formatCurrency(tx.amount * (MOCK_TOKENS.find(t => t.symbol === tx.token)?.price || 0))}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleNetroAIAction('explain-tx', tx)}
                        className="p-3 glass glass-hover rounded-2xl text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Explain with NetroAI"
                      >
                        <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'defi' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">DeFi Hub</h2>
                <p className="text-gray-400 mt-1">Optimize your yields with NetroAI intelligence.</p>
              </div>
              <div className="flex gap-3">
                <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Live Rates</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Staking Card */}
              <div className="glass rounded-[40px] p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px]" />
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black">Smart Staking</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Select Asset</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="https://cryptologos.cc/logos/chainlink-link-logo.png" className="w-8 h-8" alt="LINK" referrerPolicy="no-referrer" />
                        <span className="text-xl font-bold">LINK</span>
                      </div>
                      <span className="text-emerald-400 font-black">4.5% APY</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Amount</label>
                    <div className="flex items-center justify-between">
                      <input 
                        type="number" 
                        defaultValue="100" 
                        className="bg-transparent text-2xl font-black outline-none w-full"
                      />
                      <button className="text-blue-400 font-bold text-sm">MAX</button>
                    </div>
                  </div>
                </div>

                <div className="p-6 glass rounded-3xl border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">NetroAI Projection</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Staking 100 LINK for 1 year will yield approximately 4.5 LINK. NetroAI predicts a 12% upside in LINK value based on network activity.
                  </p>
                </div>

                <button 
                  onClick={() => handleNetroAIAction('staking-projection', { token: 'LINK', apy: 4.5, amount: 100, duration: '1 year' })}
                  className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all"
                >
                  Stake Now
                </button>
              </div>

              {/* Swap Card */}
              <div className="glass rounded-[40px] p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black">Instant Swap</h3>
                </div>

                <div className="space-y-2 relative">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">From</label>
                    <div className="flex items-center justify-between">
                      <input type="number" defaultValue="1.5" className="bg-transparent text-2xl font-black outline-none w-full" />
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-5 h-5" alt="ETH" referrerPolicy="no-referrer" />
                        <span className="font-bold">ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button className="p-3 glass rounded-2xl hover:rotate-180 transition-all duration-500">
                      <ArrowDownLeft className="w-5 h-5 text-blue-400" />
                    </button>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">To (Estimated)</label>
                    <div className="flex items-center justify-between">
                      <input type="number" defaultValue="4267.8" readOnly className="bg-transparent text-2xl font-black outline-none w-full" />
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
                        <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" className="w-5 h-5" alt="USDC" referrerPolicy="no-referrer" />
                        <span className="font-bold">USDC</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm px-2">
                  <span className="text-gray-500 font-bold">Slippage Tolerance</span>
                  <span className="text-blue-400 font-black">0.5%</span>
                </div>

                <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-600/20 transition-all">
                  Swap Assets
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Modal */}
      <NetroAIModal 
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
        title={aiModal.title}
        content={aiModal.content}
        isLoading={aiModal.isLoading}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold">NetroBank <span className="text-gray-500 font-medium">Web3 Evolution</span></span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <p className="text-gray-600 text-xs">© 2026 NetroBank. Non-financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
