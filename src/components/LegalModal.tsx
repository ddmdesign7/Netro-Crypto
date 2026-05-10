import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, FileText, HelpCircle } from 'lucide-react';
import Markdown from 'react-markdown';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'security' | 'docs';
}

const CONTENT = {
  privacy: `
# Privacy Policy
*Effective Date: May 10, 2026*

At **NetroBank**, your privacy is our secondary signature. We operate on a **Zero-Persistence Policy**.

### 1. Data Collection
We do **not** collect your personal information, IP addresses, or browser history. All wallet data is fetched directly from the blockchain via public RPC providers.

### 2. NetroAI Privacy
Your interactions with NetroAI are processed in a stateless manner. Prompts sent to our AI engines (powered by Gemini) do not include personally identifiable information unless you explicitly provide it.

### 3. Local Storage
Any settings (like your preferred currency or theme) are stored locally in your browser's \`localStorage\` and never leave your device.

### 4. Zero Tracking
No Google Analytics, no Facebook Pixels, no cookies. Just pure Web3.
  `,
  terms: `
# Terms of Service
*Last Updated: May 10, 2026*

By using NetroBank, you acknowledge and agree to the following:

### 1. Non-Custodial Nature
NetroBank is a non-custodial interface. We do **not** hold, manage, or have access to your private keys or seed phrases. You are solely responsible for the safety of your assets.

### 2. "As-Is" Software
NetroBank is currently in **Beta Evolution**. While we strive for excellence, the software is provided "as-is" without warranty of any kind. 

### 3. Financial Disclaimer
**NetroBank and NetroAI do NOT provide financial advice.** All analysis, staking projections, and risk scores are for informational purposes only. Web3 involves significant risk; never invest more than you can afford to lose.

### 4. Smart Contract Interaction
Interacting with decentralized protocols (Uniswap, Aave, etc.) via NetroBank carries inherent smart contract risk.
  `,
  security: `
# Security Architecture
NetroBank is engineered for institutional-grade safety.

### 1. Real-Time Risk Scanning
Our **NetroAI Security Sentinel** performs deep audits of your wallet permissions and asset concentration every time you connect.

### 2. Transaction Forensics
Before you sign, NetroAI deconstructs complex transaction payloads into human-readable stories, preventing "blind signing" attacks.

### 3. Front-Running Protection
Our swap routing uses MEV-resistant RPCs (where available) to ensure your trades aren't front-run by bots.

### 4. Hardware Wallet Support
We recommend and fully support Ledger and Trezor integration for an extra layer of cold-storage security.
  `,
  docs: `
# NetroBank Documentation
Welcome to the Web3 Evolution.

### 1. Getting Started
Connect your wallet using the "Connect Wallet" button. We support MetaMask, Coinbase Wallet, and WalletConnect.

### 2. Intelligent Portfolio
The dashboard provides a synthesized view of your assets. Use **NetroAI Portfolio Intelligence** to get an executive summary of your performance.

### 3. Smart Staking
Our DeFi Hub uses predictive modeling to forecast yields. APY rates are fetched in real-time from top-tier protocols.

### 4. NFT Management
The NFT Gallery allows you to view and manage your collectibles across multiple chains. Use the shared transitions to view high-resolution metadata.

### 5. API Access
Developers can integrate with our analysis engine. Contact the NetroLabs team for API credentials.
  `
};

export const LegalModal: React.FC<LegalModalProps> = ({ 
  isOpen, 
  onClose, 
  type
}) => {
  const getHeaderInfo = () => {
    switch (type) {
      case 'privacy': return { title: 'Privacy Policy', icon: Lock, color: 'text-blue-400' };
      case 'terms': return { title: 'Terms of Service', icon: FileText, color: 'text-emerald-400' };
      case 'security': return { title: 'Security Protocol', icon: Shield, color: 'text-purple-400' };
      case 'docs': return { title: 'Documentation', icon: HelpCircle, color: 'text-blue-500' };
    }
  };

  const info = getHeaderInfo();
  const Icon = info.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white/5 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{info.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="markdown-body prose prose-invert max-w-none prose-h1:text-4xl prose-h1:font-black prose-h3:text-blue-400 prose-p:text-gray-400 prose-li:text-gray-400">
                <Markdown>{CONTENT[type]}</Markdown>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
