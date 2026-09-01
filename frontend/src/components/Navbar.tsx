import React, { useState } from 'react';
import { Search, Bell, Settings, Wallet, Smartphone, X, ShieldCheck } from 'lucide-react';
import type { DemandDepositRecord } from '../types';

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
  accounts?: DemandDepositRecord[];
  
  onNotify?: (msg: string, isError?: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  phoneMode,
  setPhoneMode,
  onToggleMobileMenu,
  onSearch,
  accounts = [],
  
  onNotify,
}) => {
  const [activeNetwork, setActiveNetwork] = useState<'mainnet' | 'sandbox'>('mainnet');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    if (onNotify && searchQuery) {
      onNotify(`Searching StateRef / Transaction: "${searchQuery}"`);
    }
  };

  const handleNetworkSwitch = (net: 'mainnet' | 'sandbox') => {
    setActiveNetwork(net);
    if (onNotify) {
      onNotify(`Switched to ${net.toUpperCase()} network partition`);
    }
  };

  return (
    <>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={onToggleMobileMenu}
            className="mobile-hamburger"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ☰
          </button>

          {/* Node Alpha Badge */}
          <div
            onClick={() => setShowProfileModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            title="Click to view Node Alpha-1 details"
          >
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
            maxWidth: '460px',
            margin: '0 20px',
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
            placeholder="Search TxID, StateRef, or Account..."
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              onClick={() => handleNetworkSwitch('mainnet')}
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
              onClick={() => handleNetworkSwitch('sandbox')}
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
              onClick={() => setShowWalletModal(true)}
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
              onClick={() => setShowNotificationModal(true)}
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
              onClick={() => setShowSettingsModal(true)}
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
              onClick={() => setShowProfileModal(true)}
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
              title="Profile & Node Status"
            >
              U
            </div>
          </div>
        </div>
      </header>

      {/* Modal 1: Institutional Wallet Inspector */}
      {showWalletModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={18} color="var(--cyan-primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Institutional Wallet & Keys</h3>
              </div>
              <button onClick={() => setShowWalletModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Node Principal ID</div>
                <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)', fontSize: '12px', wordBreak: 'break-all' }}>
                  lpmt4-wqbam-aaaaa-aaaaa-cai
                </code>
              </div>

              <div style={{ backgroundColor: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Settled Liquidity</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--green-valid)', marginTop: '2px' }}>
                  €3,500.00 EUR <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(+ €1,000.00 Overdraft)</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Active Demand Deposit Accounts:</div>
                {accounts.map((a) => (
                  <div key={a.account_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: '#09101f', borderRadius: '6px', marginBottom: '4px', fontSize: '12px' }}>
                    <code style={{ fontFamily: 'var(--font-mono)' }}>{a.account_id}</code>
                    <b style={{ color: 'var(--cyan-primary)' }}>€{a.balance.value_str} {a.currency}</b>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-cyan" onClick={() => setShowWalletModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Live Notifications Modal */}
      {showNotificationModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="var(--amber-warning)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Consensus Alerts & Notifications</h3>
              </div>
              <button onClick={() => setShowNotificationModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#09101f', borderRadius: '8px', borderLeft: '3px solid var(--green-valid)' }}>
                <b style={{ color: 'var(--green-valid)' }}>Consensus Finality Nominal</b>
                <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '2px' }}>Sub-second finality verified at 0.4s (Throughput: 1,245 TPS).</p>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: '#09101f', borderRadius: '8px', borderLeft: '3px solid var(--red-reject)' }}>
                <b style={{ color: 'var(--red-reject)' }}>Double-Spend Attempt Intercepted</b>
                <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '2px' }}>StateRef 4A1F02...E3:0 rejected with 0/5 signatures.</p>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: '#09101f', borderRadius: '8px', borderLeft: '3px solid var(--cyan-primary)' }}>
                <b style={{ color: 'var(--cyan-primary)' }}>SWIFT Wire On-Ramp Settled</b>
                <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '2px' }}>€150.00 EURD credited via pacs.008 gateway.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-cyan" onClick={() => setShowNotificationModal(false)}>Acknowledge All</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Canister Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} color="var(--cyan-primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Node Alpha-1 Configuration</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Canister Target Gateway</label>
                <input className="input-dark" value="http://localhost:8080" readOnly />
              </div>

              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Raft Quorum Threshold</label>
                <input className="input-dark" value="4 / 5 Nodes (80% BFT Quorum)" readOnly />
              </div>

              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '4px' }}>ISO 20022 Compliance Mode</label>
                <input className="input-dark" value="STRICT_CAMT_PACS_ENFORCED" readOnly />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-cyan" onClick={() => setShowSettingsModal(false)}>Save & Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Profile & Legal Entity Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--green-valid)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Institutional Node Identity</h3>
              </div>
              <button onClick={() => setShowProfileModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Legal Entity Name</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  Node Alpha-1 (London / Zurich Central Clearing)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Role</span>
                  <div style={{ fontWeight: 700, color: 'var(--cyan-primary)' }}>Central Bank / Clearinghouse</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>KYC/AML Status</span>
                  <div style={{ fontWeight: 700, color: 'var(--green-valid)' }}>Verified Tier-1</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-cyan" onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
