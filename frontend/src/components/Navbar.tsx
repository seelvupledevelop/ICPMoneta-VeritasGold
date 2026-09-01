import React, { useState } from 'react';
import { Search, Bell, Settings, Wallet, Menu, Smartphone } from 'lucide-react';

interface NavbarProps {
  networkStatus: 'healthy' | 'connecting' | 'offline';
  accountCount: number;
  holdingCount: number;
  protocolCount: number;
  identityCount: number;
  phoneMode: boolean;
  setPhoneMode: (p: boolean) => void;
  onToggleMobileMenu: () => void;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  phoneMode,
  setPhoneMode,
  onToggleMobileMenu,
  onSearch,
}) => {
  const [activeNetwork, setActiveNetwork] = useState<'mainnet' | 'sandbox'>('mainnet');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-navbar)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Node Info & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={onToggleMobileMenu}
          className="mobile-hamburger"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <Menu size={22} />
        </button>

        {/* Node Alpha Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              backgroundColor: '#0051d5',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '13px',
              boxShadow: '0 0 12px rgba(0, 81, 213, 0.4)',
            }}
          >
            N1
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Node Alpha-1
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              O=Institutional, L=London, CH
            </div>
          </div>
        </div>

        <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

        {/* Brand Name */}
        <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Sovereign <span style={{ color: 'var(--cyan-primary)' }}>Ledger</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          flex: 1,
          maxWidth: '480px',
          margin: '0 24px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
        }}
      >
        <Search size={16} color="var(--text-dim)" />
        <input
          type="text"
          placeholder="Search TxID or StateRef..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--text-main)',
            width: '100%',
            fontSize: '12.5px',
            marginLeft: '8px',
            outline: 'none',
            fontFamily: 'var(--font-mono)',
          }}
        />
      </form>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mainnet / Sandbox Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          <button
            onClick={() => setActiveNetwork('mainnet')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeNetwork === 'mainnet' ? '#00d2ee' : 'transparent',
              color: activeNetwork === 'mainnet' ? '#070c14' : 'var(--text-muted)',
              fontWeight: 800,
              boxShadow: activeNetwork === 'mainnet' ? '0 0 10px var(--cyan-glow)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            MAINNET
          </button>
          <button
            onClick={() => setActiveNetwork('sandbox')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeNetwork === 'sandbox' ? '#00d2ee' : 'transparent',
              color: activeNetwork === 'sandbox' ? '#070c14' : 'var(--text-muted)',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
          >
            SANDBOX
          </button>
        </div>

        {/* Smartphone Simulator Toggle */}
        <button
          onClick={() => setPhoneMode(!phoneMode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: phoneMode ? 'rgba(0, 210, 238, 0.15)' : 'var(--bg-card)',
            color: phoneMode ? 'var(--cyan-primary)' : 'var(--text-muted)',
            border: `1px solid ${phoneMode ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Smartphone size={14} />
          {phoneMode ? 'Exit Mobile' : 'Phone View'}
        </button>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              padding: '7px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-card)',
            }}
            title="Institutional Wallet"
          >
            <Wallet size={16} />
          </button>

          <button
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              padding: '7px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
            }}
            title="Notifications"
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--amber-warning)',
                borderRadius: '9999px',
              }}
            />
          </button>

          <button
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              padding: '7px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-card)',
            }}
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* User Profile Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: '#1e293b',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            U
          </div>
        </div>
      </div>
    </header>
  );
};
