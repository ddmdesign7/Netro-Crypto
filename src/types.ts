export interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
  icon: string;
  value: number;
  color?: string;
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
  { symbol: 'ETH', name: 'Ethereum', balance: 2.45, price: 2845.20, change24h: 3.2, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png', value: 6970.74, color: '#627EEA' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, price: 65432.10, change24h: 1.5, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png', value: 9814.81, color: '#F7931A' },
  { symbol: 'USDC', name: 'USD Coin', balance: 12500, price: 1.00, change24h: 0.01, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png', value: 12500, color: '#2775CA' },
  { symbol: 'LINK', name: 'Chainlink', balance: 150, price: 18.45, change24h: -1.5, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/link.png', value: 2767.50, color: '#2A5ADA' },
  { symbol: 'ARB', name: 'Arbitrum', balance: 850, price: 1.12, change24h: 5.8, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/arb.png', value: 952, color: '#28A0F0' },
  { symbol: 'SOL', name: 'Solana', balance: 45, price: 145.20, change24h: 8.4, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png', value: 6534, color: '#14F195' },
  { symbol: 'MATIC', name: 'Polygon', balance: 2500, price: 0.85, change24h: -2.1, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png', value: 2125, color: '#8247E5' },
  { symbol: 'AVAX', name: 'Avalanche', balance: 120, price: 35.40, change24h: 4.2, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/avax.png', value: 4248, color: '#E84142' },
  { symbol: 'DOT', name: 'Polkadot', balance: 350, price: 7.20, change24h: -1.8, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dot.png', value: 2520, color: '#E6007A' },
  { symbol: 'UNI', name: 'Uniswap', balance: 200, price: 12.15, change24h: 2.5, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/uni.png', value: 2430, color: '#FF007A' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'swap', status: 'completed', token: 'ETH', amount: 0.5, timestamp: '2024-03-20T14:30:00Z', hash: '0x7a...3f21', details: { from: 'ETH', to: 'USDC', rate: 2850 } },
  { id: '2', type: 'receive', status: 'completed', token: 'USDC', amount: 500, timestamp: '2024-03-19T09:15:00Z', hash: '0x1b...9e44', from: '0x88...1234' },
  { id: '3', type: 'stake', status: 'completed', token: 'LINK', amount: 100, timestamp: '2024-03-18T16:45:00Z', hash: '0x4c...a1b2', details: { protocol: 'Aave', apy: 4.5 } },
  { id: '4', type: 'approve', status: 'completed', token: 'ARB', amount: 0, timestamp: '2024-03-17T11:20:00Z', hash: '0x9d...c3d4', details: { spender: 'Uniswap V3' } },
];

export const MOCK_PORTFOLIO: PortfolioData = {
  totalValue: 50862.05,
  change24h: 3.8,
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

export interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPrice: number;
  lastSale?: number;
  rarity?: string;
  description: string;
}

export const MOCK_NFTS: NFT[] = [
  {
    id: '1',
    name: 'Bored Ape #4521',
    collection: 'Bored Ape Yacht Club',
    image: 'https://picsum.photos/seed/ape1/400/400',
    floorPrice: 12.5,
    lastSale: 11.2,
    rarity: 'Rare',
    description: 'A unique digital collectible on the Ethereum blockchain.'
  },
  {
    id: '2',
    name: 'CryptoPunk #8832',
    collection: 'CryptoPunks',
    image: 'https://picsum.photos/seed/punk1/400/400',
    floorPrice: 45.2,
    lastSale: 42.0,
    rarity: 'Legendary',
    description: 'One of the earliest examples of a Non-Fungible Token.'
  },
  {
    id: '3',
    name: 'Azuki #1244',
    collection: 'Azuki',
    image: 'https://picsum.photos/seed/azuki1/400/400',
    floorPrice: 6.8,
    lastSale: 6.5,
    rarity: 'Common',
    description: 'A brand for the metaverse. Built by the community.'
  },
  {
    id: '4',
    name: 'Doodle #9921',
    collection: 'Doodles',
    image: 'https://picsum.photos/seed/doodle1/400/400',
    floorPrice: 2.4,
    lastSale: 2.1,
    rarity: 'Uncommon',
    description: 'A collection of 10,000 hand-drawn Doodles.'
  },
  {
    id: '5',
    name: 'CloneX #5521',
    collection: 'CloneX',
    image: 'https://picsum.photos/seed/clonex1/400/400',
    floorPrice: 1.8,
    lastSale: 1.5,
    rarity: 'Rare',
    description: 'RTFKT and Takashi Murakami collaboration.'
  },
  {
    id: '6',
    name: 'Moonbird #3321',
    collection: 'Moonbirds',
    image: 'https://picsum.photos/seed/moonbird1/400/400',
    floorPrice: 0.9,
    lastSale: 0.8,
    rarity: 'Common',
    description: 'A collection of 10,000 utility-enabled PFPs.'
  }
];
