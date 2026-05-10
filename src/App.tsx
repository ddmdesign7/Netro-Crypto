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
  Coins,
  Loader2,
  ArrowDown,
  ChevronDown,
  ArrowUpDown,
  Info,
  Image as ImageIcon,
  Search,
  Filter
} from 'lucide-react';
import { cn, formatCurrency, formatPercent } from '@/src/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MOCK_PORTFOLIO, MOCK_TRANSACTIONS, MOCK_TOKENS, MOCK_NFTS, Token, Transaction, NFT } from '@/src/types';
import { NetroAIService } from '@/src/services/geminiService';
import { NetroAIModal } from '@/src/components/NetroAIModal';
import Markdown from 'react-markdown';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'swap' | 'nfts' | 'history' | 'defi'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Staking State
  const [stakingAmount, setStakingAmount] = useState<number>(100);
  const [stakingDuration, setStakingDuration] = useState<string>('1 year');
  const [stakingResult, setStakingResult] = useState<string>('');
  const [isStakingLoading, setIsStakingLoading] = useState<boolean>(false);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Token; direction: 'asc' | 'desc' } | null>({
    key: 'value',
    direction: 'desc'
  });

  // Swap State
  const [swapFrom, setSwapFrom] = useState<Token>(MOCK_TOKENS[0]);
  const [swapTo, setSwapTo] = useState<Token>(MOCK_TOKENS[1]);
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Asset Details State
  const [selectedAsset, setSelectedAsset] = useState<Token | null>(null);

  // NFT State
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [nftSearch, setNftSearch] = useState('');
  const [nftFilter, setNftFilter] = useState<'all' | 'rare' | 'legendary'>('all');

  const sortedTokens = [...MOCK_TOKENS].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key] ?? 0;
    const bValue = b[key] ?? 0;
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Token) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleSwap = async () => {
    setIsSwapping(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSwapping(false);
    setIsSwapModalOpen(false);
    setSwapAmount('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // AI Modal State
  const [aiModal, setAiModal] = useState({
    isOpen: false,
    title: '',
    content: '',
    isLoading: false,
    loadingMessage: ''
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      setIsWalletConnected(false);
      return;
    }
    
    setIsConnecting(true);
    // Simulate wallet connection delay - reduced for better performance
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsWalletConnected(true);
    setIsConnecting(false);
    
    // Show success feedback
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleCalculateStaking = async () => {
    setIsStakingLoading(true);
    try {
      const result = await NetroAIService.getStakingProjection({
        token: 'LINK',
        apy: 4.5,
        amount: stakingAmount,
        duration: stakingDuration
      });
      setStakingResult(result);
    } catch (error) {
      setStakingResult("Failed to calculate projection.");
    } finally {
      setIsStakingLoading(false);
    }
  };

  const handleNetroAIAction = async (action: string, data?: any) => {
    let loadingMessage = "NetroAI is analyzing your data...";
    let title = "NetroAI Analysis";

    switch (action) {
      case 'portfolio-summary':
        loadingMessage = "Synthesizing portfolio performance...";
        title = "Portfolio Intelligence";
        break;
      case 'explain-tx':
        loadingMessage = "Deconstructing blockchain transaction...";
        title = "Transaction Breakdown";
        break;
      case 'risk-scan':
        loadingMessage = "Scanning for smart contract vulnerabilities...";
        title = "Security Audit";
        break;
      case 'staking-projection':
        loadingMessage = "Calculating yield trajectories...";
        title = "Staking Strategy";
        break;
    }

    setAiModal({ 
      isOpen: true, 
      title, 
      content: '', 
      isLoading: true,
      loadingMessage 
    });
    
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
    { id: 'swap', label: 'Swap', icon: RefreshCw },
    { id: 'nfts', label: 'NFTs', icon: ImageIcon },
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
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 min-w-[140px] justify-center",
                isConnecting
                  ? "bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed"
                  : isWalletConnected 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              )}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isWalletConnected ? (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>0x7a...3f21</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </>
              )}
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
                      <th className="px-6 py-4 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('symbol')}>
                        <div className="flex items-center gap-1">
                          Asset <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('balance')}>
                        <div className="flex items-center justify-end gap-1">
                          Balance <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('price')}>
                        <div className="flex items-center justify-end gap-1">
                          Price <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('change24h')}>
                        <div className="flex items-center justify-end gap-1">
                          24h Change <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold text-right cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('value')}>
                        <div className="flex items-center justify-end gap-1">
                          Value <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedTokens.slice(0, 4).map((token) => (
                      <motion.tr 
                        key={token.symbol} 
                        whileHover={{ 
                          y: -2,
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          transition: { duration: 0.2 }
                        }}
                        className="transition-colors group cursor-pointer"
                      >
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
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(token);
                            }}
                            className="p-2 glass glass-hover rounded-xl text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                            title="View Details"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="glass rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  Recent Activity
                </h2>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View History
                </button>
              </div>
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <History className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No transactions yet</h3>
                <p className="text-gray-400 max-w-sm leading-relaxed">
                  Your activity will appear here once you start using your account.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Asset Portfolio</h2>
                <p className="text-gray-400 mt-1">Detailed breakdown of your Web3 holdings.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleNetroAIAction('portfolio-summary')}
                  className="px-6 py-3 glass glass-hover rounded-2xl text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  AI Analysis
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Allocation Chart */}
              <div className="lg:col-span-1 glass rounded-[40px] p-8 flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-xl font-bold mb-6 self-start">Asset Allocation</h3>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={MOCK_TOKENS}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {MOCK_TOKENS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  {MOCK_TOKENS.map((token) => (
                    <div key={token.symbol} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: token.color }} />
                      <span className="text-xs font-bold text-gray-400">{token.symbol}</span>
                      <span className="text-xs font-black ml-auto">{formatPercent((token.value / MOCK_PORTFOLIO.totalValue) * 100)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Asset List */}
              <div className="lg:col-span-2 space-y-4">
                {MOCK_TOKENS.map((token) => (
                  <motion.div 
                    key={token.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="glass rounded-3xl p-6 flex items-center justify-between group cursor-pointer border border-white/5 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center p-2">
                        <img src={token.icon} alt={token.symbol} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black">{token.symbol}</h4>
                          <span className="text-xs font-bold text-gray-500">{token.name}</span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">
                          {token.balance.toLocaleString()} {token.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:block flex-1 max-w-[120px] mx-8">
                      <svg viewBox="0 0 100 30" className="w-full h-8 overflow-visible">
                        <path 
                          d={`M 0 ${15 + Math.random() * 10} Q 25 ${Math.random() * 30} 50 ${Math.random() * 30} T 100 ${Math.random() * 30}`}
                          fill="none"
                          stroke={token.change24h >= 0 ? "#10B981" : "#EF4444"}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p className="text-lg font-black">{formatCurrency(token.value)}</p>
                        <div className={cn(
                          "text-xs font-bold flex items-center justify-end gap-1",
                          token.change24h >= 0 ? "text-emerald-400" : "text-destructive"
                        )}>
                          {token.change24h > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                          {Math.abs(token.change24h)}%
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 glass glass-hover rounded-xl text-blue-400" title="Trade">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 glass glass-hover rounded-xl text-emerald-400" title="Stake">
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black tracking-tight">Instant Swap</h2>
              <p className="text-gray-400">Exchange your assets with the best market rates.</p>
            </div>

            <div className="glass rounded-[40px] p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />
              
              <div className="space-y-2 relative">
                {/* From Asset */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">From</label>
                    <span className="text-xs text-gray-500">Balance: {swapFrom.balance} {swapFrom.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <input 
                      type="number" 
                      placeholder="0.0"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="bg-transparent text-3xl font-black outline-none w-full" 
                    />
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl">
                      <img src={swapFrom.icon} className="w-6 h-6 rounded-full" alt={swapFrom.symbol} referrerPolicy="no-referrer" />
                      <span className="font-bold">{swapFrom.symbol}</span>
                    </div>
                  </div>
                </div>

                {/* Swap Icon */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <button 
                    onClick={() => {
                      const temp = swapFrom;
                      setSwapFrom(swapTo);
                      setSwapTo(temp);
                    }}
                    className="p-4 glass rounded-2xl hover:rotate-180 transition-all duration-500 shadow-xl"
                  >
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                  </button>
                </div>

                {/* To Asset */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">To (Estimated)</label>
                    <span className="text-xs text-gray-500">Balance: {swapTo.balance} {swapTo.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <input 
                      type="number" 
                      value={swapAmount ? (Number(swapAmount) * (swapFrom.price / swapTo.price)).toFixed(4) : ''} 
                      readOnly 
                      placeholder="0.0"
                      className="bg-transparent text-3xl font-black outline-none w-full text-gray-400" 
                    />
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl">
                      <img src={swapTo.icon} className="w-6 h-6 rounded-full" alt={swapTo.symbol} referrerPolicy="no-referrer" />
                      <span className="font-bold">{swapTo.symbol}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-bold">Exchange Rate</span>
                  <span className="text-white font-black">1 {swapFrom.symbol} = {(swapFrom.price / swapTo.price).toFixed(4)} {swapTo.symbol}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-bold">Slippage Tolerance</span>
                  <span className="text-blue-400 font-black">0.5%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-bold">Network Fee</span>
                  <span className="text-gray-300 font-black">~$2.45</span>
                </div>
              </div>

              <button 
                onClick={() => setIsSwapModalOpen(true)}
                disabled={!swapAmount || Number(swapAmount) <= 0}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-600/20 transition-all"
              >
                Review Swap
              </button>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">NFT Gallery</h2>
                <p className="text-gray-400 mt-1">Your digital collectibles across all networks.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search NFTs..." 
                    value={nftSearch}
                    onChange={(e) => setNftSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 glass rounded-xl text-sm font-bold outline-none focus:border-blue-500/50 transition-all w-full md:w-64"
                  />
                </div>
                <div className="flex glass rounded-xl p-1">
                  {(['all', 'rare', 'legendary'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setNftFilter(filter)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        nftFilter === filter ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {MOCK_NFTS
                .filter(nft => 
                  nft.name.toLowerCase().includes(nftSearch.toLowerCase()) &&
                  (nftFilter === 'all' || nft.rarity?.toLowerCase() === nftFilter)
                )
                .map((nft) => (
                  <motion.div
                    key={nft.id}
                    layoutId={`nft-${nft.id}`}
                    onClick={() => setSelectedNFT(nft)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8 }}
                    className="glass rounded-[32px] overflow-hidden cursor-pointer group border border-white/5 hover:border-blue-500/30 transition-all"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                        {nft.rarity}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{nft.collection}</p>
                        <h3 className="text-lg font-black group-hover:text-blue-400 transition-colors">{nft.name}</h3>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Floor Price</p>
                          <p className="font-black text-white">{nft.floorPrice} ETH</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Sale</p>
                          <p className="font-black text-gray-300">{nft.lastSale} ETH</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                        className="px-4 py-2 glass glass-hover rounded-xl text-blue-400 text-sm font-bold flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                        title="Explain with NetroAI"
                      >
                        <Sparkles className="w-4 h-4" />
                        Details
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
                        <img src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/link.png" className="w-8 h-8" alt="LINK" referrerPolicy="no-referrer" />
                        <span className="text-xl font-bold">LINK</span>
                      </div>
                      <span className="text-emerald-400 font-black">4.5% APY</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Amount</label>
                      <div className="flex items-center justify-between">
                        <input 
                          type="number" 
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(Number(e.target.value))}
                          className="bg-transparent text-2xl font-black outline-none w-full"
                        />
                      </div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Duration</label>
                      <select 
                        value={stakingDuration}
                        onChange={(e) => setStakingDuration(e.target.value)}
                        className="bg-transparent text-xl font-black outline-none w-full appearance-none cursor-pointer"
                      >
                        <option value="1 month" className="bg-[#0A0C0E]">1 Month</option>
                        <option value="3 months" className="bg-[#0A0C0E]">3 Months</option>
                        <option value="6 months" className="bg-[#0A0C0E]">6 Months</option>
                        <option value="1 year" className="bg-[#0A0C0E]">1 Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleCalculateStaking}
                    disabled={isStakingLoading}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all border border-white/5 flex items-center justify-center gap-2"
                  >
                    {isStakingLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    )}
                    Calculate Projection
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {(stakingResult || isStakingLoading) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 glass rounded-3xl border-emerald-500/20 bg-emerald-500/5 overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">NetroAI Projection</span>
                      </div>
                      
                      {isStakingLoading ? (
                        <div className="flex items-center gap-3 py-4">
                          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                          <p className="text-sm text-gray-400">NetroAI is calculating yields...</p>
                        </div>
                      ) : (
                        <div className="markdown-body prose-sm prose-invert max-w-none">
                          <Markdown>{stakingResult}</Markdown>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
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
                        <img src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png" className="w-5 h-5" alt="ETH" referrerPolicy="no-referrer" />
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
                        <img src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png" className="w-5 h-5" alt="USDC" referrerPolicy="no-referrer" />
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
        loadingMessage={aiModal.loadingMessage}
      />

      {/* NFT Details Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNFT(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`nft-${selectedNFT.id}`}
              className="relative w-full max-w-2xl glass rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 aspect-square">
                  <img 
                    src={selectedNFT.image} 
                    alt={selectedNFT.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-1/2 p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{selectedNFT.collection}</p>
                      <h2 className="text-3xl font-black">{selectedNFT.name}</h2>
                    </div>
                    <button onClick={() => setSelectedNFT(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Description</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{selectedNFT.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Floor Price</p>
                        <p className="text-lg font-black">{selectedNFT.floorPrice} ETH</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Rarity</p>
                        <p className="text-lg font-black text-blue-400">{selectedNFT.rarity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all">
                      List for Sale
                    </button>
                    <button className="w-full py-4 glass glass-hover text-white rounded-2xl font-black transition-all">
                      Transfer NFT
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Asset Details Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 p-3">
                      <img src={selectedAsset.icon} alt={selectedAsset.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black">{selectedAsset.symbol}</h2>
                      <p className="text-gray-500 font-bold">{selectedAsset.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-xl font-black">{formatCurrency(selectedAsset.price)}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">24h Change</p>
                    <p className={cn("text-xl font-black", selectedAsset.change24h >= 0 ? "text-emerald-400" : "text-destructive")}>
                      {selectedAsset.change24h > 0 ? '+' : ''}{selectedAsset.change24h}%
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Balance</p>
                    <p className="text-xl font-black">{selectedAsset.balance.toLocaleString()} {selectedAsset.symbol}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Value</p>
                    <p className="text-xl font-black">{formatCurrency(selectedAsset.value)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setSwapFrom(selectedAsset);
                      setActiveTab('swap');
                      setSelectedAsset(null);
                    }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all"
                  >
                    Swap {selectedAsset.symbol}
                  </button>
                  <button className="w-full py-4 glass glass-hover text-white rounded-2xl font-black transition-all">
                    View on Explorer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swap Confirmation Modal */}
      <AnimatePresence>
        {isSwapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSwapping && setIsSwapModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">Confirm Swap</h2>
                  <p className="text-gray-400">Please review your transaction details.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={swapFrom.icon} className="w-8 h-8 rounded-full" alt="" referrerPolicy="no-referrer" />
                      <span className="font-black text-xl">{swapAmount} {swapFrom.symbol}</span>
                    </div>
                    <ArrowDown className="w-5 h-5 text-gray-600" />
                    <div className="flex items-center gap-3">
                      <img src={swapTo.icon} className="w-8 h-8 rounded-full" alt="" referrerPolicy="no-referrer" />
                      <span className="font-black text-xl">{(Number(swapAmount) * (swapFrom.price / swapTo.price)).toFixed(4)} {swapTo.symbol}</span>
                    </div>
                  </div>

                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-bold">Rate</span>
                      <span className="text-white font-black">1 {swapFrom.symbol} = {(swapFrom.price / swapTo.price).toFixed(4)} {swapTo.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-bold">Network Fee</span>
                      <span className="text-gray-300 font-black">~$2.45</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-bold">Max Slippage</span>
                      <span className="text-blue-400 font-black">0.5%</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSwap}
                  disabled={isSwapping}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
                >
                  {isSwapping ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Swapping...
                    </>
                  ) : (
                    'Confirm Swap'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-500/20 flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5" />
            Wallet Connected Successfully
          </motion.div>
        )}
      </AnimatePresence>

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
