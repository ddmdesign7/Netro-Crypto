export interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
  icon: string;
  value: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'approve';
  status: 'completed' | 'pending' | 'failed';
  token: string;
  amount: number;
  timestamp: string;
  hash: string;
  from?: string;
  to?: string;
  details?: any;
}

export interface PortfolioData {
  totalValue: number;
  change24h: number;
  tokens: Token[];
  history: { date: string; value: number }[];
}

export const MOCK_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 2.45, price: 2845.20, change24h: 3.2, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', value: 6970.74 },
  { symbol: 'USDC', name: 'USD Coin', balance: 12500, price: 1.00, change24h: 0.01, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', value: 12500 },
  { symbol: 'LINK', name: 'Chainlink', balance: 150, price: 18.45, change24h: -1.5, icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png', value: 2767.50 },
  { symbol: 'ARB', name: 'Arbitrum', balance: 850, price: 1.12, change24h: 5.8, icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', value: 952 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'swap', status: 'completed', token: 'ETH', amount: 0.5, timestamp: '2024-03-20T14:30:00Z', hash: '0x7a...3f21', details: { from: 'ETH', to: 'USDC', rate: 2850 } },
  { id: '2', type: 'receive', status: 'completed', token: 'USDC', amount: 500, timestamp: '2024-03-19T09:15:00Z', hash: '0x1b...9e44', from: '0x88...1234' },
  { id: '3', type: 'stake', status: 'completed', token: 'LINK', amount: 100, timestamp: '2024-03-18T16:45:00Z', hash: '0x4c...a1b2', details: { protocol: 'Aave', apy: 4.5 } },
  { id: '4', type: 'approve', status: 'completed', token: 'ARB', amount: 0, timestamp: '2024-03-17T11:20:00Z', hash: '0x9d...c3d4', details: { spender: 'Uniswap V3' } },
];

export const MOCK_PORTFOLIO: PortfolioData = {
  totalValue: 23190.24,
  change24h: 2.4,
  tokens: MOCK_TOKENS,
  history: [
    { date: '2024-03-14', value: 21500 },
    { date: '2024-03-15', value: 22100 },
    { date: '2024-03-16', value: 21800 },
    { date: '2024-03-17', value: 22400 },
    { date: '2024-03-18', value: 22900 },
    { date: '2024-03-19', value: 22600 },
    { date: '2024-03-20', value: 23190 },
  ]
};
