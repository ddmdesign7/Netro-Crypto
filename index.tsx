import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// --- THEME & TYPOGRAPHY SYSTEM ---
const COLORS = {
  primary: '#E0242A',       // Netro Red
  primaryHover: '#C01F24',
  dark: '#0A0C0E',          // Obsidian for Web3
  light: '#F8F9FB',         // Soft White
  white: '#FFFFFF',
  text: '#121417',
  textMuted: '#525C67',
  border: '#E2E8F0',
  success: '#10B981',
  obsidianCard: '#121518',
};

const ANIMATION = {
  fast: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  subtle: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
};

const TYPOGRAPHY = {
  heroTitle: { size: 'clamp(40px, 5vw, 48px)', weight: 700 },
  pageTitle: { size: 'clamp(28px, 4vw, 32px)', weight: 600 },
  sectionHeader: { size: 'clamp(20px, 3vw, 24px)', weight: 600 },
  body: { size: '16px', weight: 400 },
  small: { size: '13px', weight: 400 },
};

// Standardized Button Styles
const PRIMARY_BUTTON_STYLE: React.CSSProperties = {
  backgroundColor: COLORS.primary,
  color: COLORS.white,
  padding: '14px 24px',
  borderRadius: '10px',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '15px',
  display: 'inline-block',
  transition: `all ${ANIMATION.fast}`,
  border: 'none',
  cursor: 'pointer',
  textAlign: 'center'
};

const SECONDARY_BUTTON_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: COLORS.white,
  padding: '14px 24px',
  borderRadius: '10px',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '15px',
  display: 'inline-block',
  transition: `all ${ANIMATION.fast}`,
  cursor: 'pointer',
  textAlign: 'center'
};

// --- ICONS ---
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
  </svg>
);

const SwapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 3 4 4-4 4"></path>
    <path d="M20 7H4"></path>
    <path d="m8 21-4-4 4-4"></path>
    <path d="M4 17h16"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
    <path d="M9 9h6v6H9z"></path>
    <path d="M15 2v2"></path>
    <path d="M9 2v2"></path>
    <path d="M15 20v2"></path>
    <path d="M9 20v2"></path>
    <path d="M20 15h2"></path>
    <path d="M20 9h2"></path>
    <path d="M2 15h2"></path>
    <path d="M2 9h2"></path>
  </svg>
);

const LayoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

// --- COMPONENTS ---

const LoadingIndicator = () => (
  <div style={{
    width: '40px',
    height: '40px',
    border: '3px solid rgba(224, 36, 42, 0.1)',
    borderTop: `3px solid ${COLORS.primary}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }}>
    <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
  </div>
);

const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-fade-in">
      {children}
    </div>
  );
};

const EmptyState = ({ title, message, actionText }: { title: string, message: string, actionText?: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: `1px dashed rgba(255, 255, 255, 0.1)`,
    animation: 'fadeIn 0.4s ease-out'
  }}>
    <div style={{ marginBottom: '24px', opacity: 0.2 }}>
      <WalletIcon />
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.white, marginBottom: '12px' }}>{title}</h3>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6, maxWidth: '320px', margin: '0 auto 24px' }}>{message}</p>
    {actionText && (
      <button className="primary-btn-hover" style={{ ...PRIMARY_BUTTON_STYLE, padding: '12px 24px', fontSize: '14px' }}>
        {actionText}
      </button>
    )}
  </div>
);

const TopBar = () => (
  <div style={{
    backgroundColor: COLORS.dark,
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    padding: '8px 5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{ display: 'flex', gap: '24px' }}>
      <span style={{ color: COLORS.primary, fontWeight: 700 }}>Mainnet</span>
      <span className="hover-white" style={{ cursor: 'pointer', transition: ANIMATION.fast }}>Polygon</span>
      <span className="hover-white" style={{ cursor: 'pointer', transition: ANIMATION.fast }}>Arbitrum</span>
    </div>
    <div style={{ display: 'flex', gap: '16px' }}>
      <span>Gas: 18 Gwei</span>
      <span style={{ color: COLORS.success }}>● Connected</span>
    </div>
    <style>{`.hover-white:hover { color: white; }`}</style>
  </div>
);

const Header = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      backgroundColor: scrolled ? 'rgba(10, 12, 14, 0.95)' : COLORS.dark,
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <div style={{
          width: '36px',
          height: '36px',
          backgroundColor: COLORS.primary,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '800',
          fontSize: '20px',
        }}>N</div>
        <span style={{
          fontSize: '22px',
          fontWeight: 700,
          color: COLORS.white,
          marginLeft: '12px',
          letterSpacing: '-0.5px'
        }}>NetroBank</span>
      </Link>

      <nav style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-nav">
        {['Assets', 'Swap', 'Stake', 'NFTs'].map(item => (
          <Link key={item} to="#" style={{
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
            fontSize: '15px',
            transition: `color ${ANIMATION.fast}`
          }} className="nav-link">
            {item}
          </Link>
        ))}
        <Link to="/dashboard" style={{
          textDecoration: 'none',
          color: location.pathname === '/dashboard' ? COLORS.primary : 'rgba(255,255,255,0.7)',
          fontWeight: 600,
          fontSize: '15px',
        }}>Dashboard</Link>
        <button className="primary-btn-hover" style={{
          ...PRIMARY_BUTTON_STYLE,
          fontSize: '14px',
          padding: '10px 20px',
          marginLeft: '10px'
        }}>
          0x4f...92e1
        </button>
      </nav>

      <button onClick={onMenuOpen} style={{
        display: 'block',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
      }} className="mobile-toggle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .nav-link:hover { color: white !important; }
        .primary-btn-hover:hover {
          background-color: ${COLORS.primaryHover} !important;
          transform: translateY(-1px);
        }
      `}</style>
    </header>
  );
};

const Hero = () => (
  <section style={{
    position: 'relative',
    height: '620px',
    backgroundColor: COLORS.dark,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      right: '-10%',
      top: '10%',
      width: '60%',
      height: '80%',
      background: 'radial-gradient(circle, rgba(224, 36, 42, 0.1) 0%, rgba(10, 12, 14, 0) 70%)',
      zIndex: 1
    }}></div>
    
    <div style={{
      position: 'relative',
      zIndex: 2,
      padding: '0 5%',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      animation: 'fadeInUp 0.8s ease-out'
    }}>
      <div style={{ maxWidth: '640px' }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 12px',
          backgroundColor: 'rgba(224, 36, 42, 0.1)',
          color: COLORS.primary,
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '24px',
          border: '1px solid rgba(224, 36, 42, 0.2)'
        }}>WEB3 CUSTODY REDEFINED</div>
        <h1 style={{
          fontSize: TYPOGRAPHY.heroTitle.size,
          fontWeight: TYPOGRAPHY.heroTitle.weight,
          color: COLORS.white,
          lineHeight: 1.1,
          marginBottom: '24px',
          letterSpacing: '-1.5px'
        }}>Your assets, <span style={{ color: COLORS.primary }}>your control.</span></h1>
        <p style={{
          fontSize: '18px',
          lineHeight: 1.6,
          marginBottom: '40px',
          color: 'rgba(255,255,255,0.6)',
        }}>NetroBank is the institutional-grade gateway to decentralized finance. Secure, transparent, and built for the future of digital wealth.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="primary-btn-hover" style={PRIMARY_BUTTON_STYLE}>
            Launch Dashboard
          </Link>
          <Link to="#" className="secondary-btn-hover" style={SECONDARY_BUTTON_STYLE}>
            Explore Ecosystem
          </Link>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      .secondary-btn-hover:hover { background-color: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.2) !important; }
    `}</style>
  </section>
);

const SecurityTrust = () => (
  <section style={{ padding: '100px 5%', backgroundColor: COLORS.dark }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: TYPOGRAPHY.pageTitle.size, fontWeight: TYPOGRAPHY.pageTitle.weight, color: COLORS.white, marginBottom: '16px' }}>
          Institutional-Grade Security
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>
          We leverage MPC technology and hardware-level security to ensure your private keys never leave your control.
        </p>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {[
          {
            icon: <ShieldIcon />,
            title: 'Self-Custody Design',
            desc: 'You own your keys. You own your crypto. NetroBank provides the interface; you provide the authorization.'
          },
          {
            icon: <CpuIcon />,
            title: 'MPC Infrastructure',
            desc: 'Multi-Party Computation ensures that no single point of failure can compromise your digital assets.'
          },
          {
            icon: <LayoutIcon />,
            title: 'Smart Vaults',
            desc: 'Programmable security rules for large movements, requiring multi-sig approval or time-locks.'
          }
        ].map((item, idx) => (
          <div key={idx} style={{ 
            backgroundColor: COLORS.obsidianCard, 
            borderRadius: '20px', 
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.3s ease'
          }} className="security-card">
            <div style={{ color: COLORS.primary, marginBottom: '24px' }}>{item.icon}</div>
            <h4 style={{ color: COLORS.white, margin: '0 0 12px 0', fontSize: '20px', fontWeight: 600 }}>{item.title}</h4>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      .security-card:hover { transform: translateY(-5px); border-color: rgba(224, 36, 42, 0.3); }
    `}</style>
  </section>
);

const DashboardView = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.dark }}>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <main style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', backgroundColor: COLORS.dark }}>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: TYPOGRAPHY.pageTitle.size, fontWeight: TYPOGRAPHY.pageTitle.weight, color: COLORS.white, marginBottom: '8px' }}>Portfolio</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage your digital assets across 4 networks.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn-hover" style={{ ...SECONDARY_BUTTON_STYLE, padding: '10px 16px', fontSize: '14px' }}>Send</button>
          <button className="primary-btn-hover" style={{ ...PRIMARY_BUTTON_STYLE, padding: '10px 16px', fontSize: '14px' }}>Swap Tokens</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ 
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #90161A 100%)`, 
          borderRadius: '20px', 
          padding: '32px', 
          color: 'white' 
        }}>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>Net Worth</span>
          <h2 style={{ fontSize: '42px', margin: '12px 0', fontWeight: 700 }}>$142,504.32</h2>
          <div style={{ color: COLORS.success, fontSize: '14px', fontWeight: 600 }}>+$2,104.22 (1.49%) Today</div>
        </div>
        <div style={{ backgroundColor: COLORS.obsidianCard, borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Staking Yield</span>
          <h2 style={{ fontSize: '42px', margin: '12px 0', fontWeight: 700, color: COLORS.white }}>$824.11</h2>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>3 Pending Rewards</div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.white }}>Asset Allocation</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: COLORS.primary, fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>All Assets</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', cursor: 'pointer' }}>NFTs</span>
          </div>
        </div>
        <div style={{ backgroundColor: COLORS.obsidianCard, borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ paddingBottom: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '13px' }}>Asset</th>
                <th style={{ paddingBottom: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '13px' }}>Price</th>
                <th style={{ paddingBottom: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '13px' }}>Balance</th>
                <th style={{ paddingBottom: '16px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '13px', textAlign: 'right' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Ethereum', sym: 'ETH', price: '$2,450.12', balance: '12.42 ETH', val: '$30,430.49' },
                { name: 'Wrapped Bitcoin', sym: 'WBTC', price: '$44,120.90', balance: '0.85 WBTC', val: '$37,502.76' },
                { name: 'Netro Token', sym: 'NTR', price: '$4.12', balance: '5,000 NTR', val: '$20,600.00' },
                { name: 'USDC', sym: 'USDC', price: '$1.00', balance: '15,204.00 USDC', val: '$15,204.00' },
              ].map((token, i) => (
                <tr key={i} style={{ borderBottom: i === 3 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '20px 0', color: COLORS.white }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{token.sym[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{token.name}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{token.sym}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: COLORS.white, fontSize: '15px' }}>{token.price}</td>
                  <td style={{ color: COLORS.white, fontSize: '15px' }}>{token.balance}</td>
                  <td style={{ color: COLORS.white, fontSize: '15px', fontWeight: 600, textAlign: 'right' }}>{token.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

const LandingView = () => (
  <div style={{ backgroundColor: COLORS.dark }}>
    <Hero />
    <section style={{ padding: '100px 5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        {[
          { title: 'DeFi Swap', desc: 'Aggregated liquidity across every major DEX for the best execution prices.', icon: <SwapIcon /> },
          { title: 'Stake & Earn', desc: 'Direct staking into protocols with automated compound management.', icon: <CpuIcon /> },
          { title: 'NFT Gallery', desc: 'A sophisticated hub to manage, view, and trade your digital collections.', icon: <LayoutIcon /> },
          { title: 'Secure Vaults', desc: 'Cold-storage level security with hot-wallet accessibility.', icon: <WalletIcon /> }
        ].map((item, idx) => (
          <div key={idx} style={{
            backgroundColor: COLORS.obsidianCard,
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.4s ease'
          }} className="feature-card">
            <div style={{ color: COLORS.primary, marginBottom: '24px' }}>{item.icon}</div>
            <h4 style={{ color: COLORS.white, fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{item.title}</h4>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <SecurityTrust />
    <section style={{ padding: '120px 5%', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: TYPOGRAPHY.pageTitle.size, fontWeight: TYPOGRAPHY.pageTitle.weight, color: COLORS.white, marginBottom: '24px' }}>The future is decentralized.</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', lineHeight: 1.6, marginBottom: '40px' }}>
          Join over 50,000 institutional and retail investors who trust NetroBank for their digital asset custody and DeFi interactions.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="primary-btn-hover" style={{ ...PRIMARY_BUTTON_STYLE, padding: '16px 48px' }}>Enter Dashboard</Link>
          <Link to="#" className="secondary-btn-hover" style={{ ...SECONDARY_BUTTON_STYLE, padding: '16px 48px' }}>Read Whitepaper</Link>
        </div>
      </div>
    </section>
    <style>{`
      .feature-card:hover { transform: translateY(-10px); background-color: #171B1F; border-color: rgba(224, 36, 42, 0.4); }
    `}</style>
  </div>
);

const Footer = () => (
  <footer style={{ backgroundColor: '#050607', color: 'rgba(255,255,255,0.4)', padding: '100px 5% 40px', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '80px', maxWidth: '1200px', margin: '0 auto 80px' }}>
      <div style={{ gridColumn: 'span 2' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.primary, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>N</div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginLeft: '12px' }}>NetroBank</span>
        </div>
        <p style={{ lineHeight: 1.8, marginBottom: '30px', maxWidth: '400px' }}>
          NetroBank is the premier interface for digital asset management. We provide the tools for self-custody and decentralized financial interactions.
        </p>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '24px', fontWeight: 600 }}>Platform</h4>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2.4 }}>
          <li style={{ cursor: 'pointer' }} className="footer-link">Asset Management</li>
          <li style={{ cursor: 'pointer' }} className="footer-link">Token Swap</li>
          <li style={{ cursor: 'pointer' }} className="footer-link">Staking Pools</li>
          <li style={{ cursor: 'pointer' }} className="footer-link">Bridge Assets</li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '24px', fontWeight: 600 }}>Protocol</h4>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2.4 }}>
          <li style={{ cursor: 'pointer' }} className="footer-link">Security Audit</li>
          <li style={{ cursor: 'pointer' }} className="footer-link">Governance</li>
          <li style={{ cursor: 'pointer' }} className="footer-link">Documentation</li>
          <li style={{ cursor: 'pointer' }} className="footer-link">Status</li>
        </ul>
      </div>
    </div>
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', opacity: 0.6 }}>
      <p>&copy; 2025 NetroBank Labs. Non-custodial software protocol. Invest at your own risk.</p>
    </div>
    <style>{`.footer-link:hover { color: white; }`}</style>
  </footer>
);

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <>
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: isOpen ? 'block' : 'none',
      zIndex: 1999,
      backdropFilter: 'blur(10px)',
      transition: `opacity ${ANIMATION.subtle}`
    }} onClick={onClose}></div>
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '85%',
      maxWidth: '350px',
      height: '100%',
      backgroundColor: COLORS.dark,
      zIndex: 2000,
      padding: '80px 40px',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: '-10px 0 60px rgba(0,0,0,0.5)',
      borderLeft: '1px solid rgba(255,255,255,0.05)'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', fontSize: '36px', cursor: 'pointer', color: 'white' }}>&times;</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: '28px' }} onClick={onClose}>Home</Link>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: '28px' }} onClick={onClose}>Dashboard</Link>
        {['Assets', 'Swap', 'Stake', 'NFTs'].map(item => (
          <Link key={item} to="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '20px' }} onClick={onClose}>{item}</Link>
        ))}
        <button className="primary-btn-hover" style={{ ...PRIMARY_BUTTON_STYLE, marginTop: '20px' }} onClick={onClose}>Connect Wallet</button>
      </div>
    </div>
  </>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HashRouter>
      <div style={{ 
        fontFamily: "'Inter', sans-serif", 
        color: COLORS.white, 
        backgroundColor: COLORS.dark, 
        minHeight: '100vh',
        overflowX: 'hidden' 
      }}>
        <TopBar />
        <Header onMenuOpen={() => setIsMenuOpen(true)} />
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        <Routes>
          <Route path="/" element={<PageWrapper><LandingView /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><DashboardView /></PageWrapper>} />
        </Routes>

        <Footer />
        
        <style>{`
          .page-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          * { box-sizing: border-box; }
          body { margin: 0; background: ${COLORS.dark}; }
        `}</style>
      </div>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);