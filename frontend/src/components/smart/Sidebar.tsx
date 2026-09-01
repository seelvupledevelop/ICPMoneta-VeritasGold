import React from 'react';
import type { AppSection } from '../../types';
import {
  Landmark,
  Key,
  ShieldCheck,
  ArrowLeftRight,
  Scale,
  TrendingUp,
  Layers,
  HelpCircle,
  FileText,
  X,
  Radio,
  Gavel,
  Coins,
  UserCheck,
  Bot,
  Activity,
  Cpu,
  Droplets,
} from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  accountCount?: number;
  holdingCount?: number;
  offerCount?: number;
  collateralCount?: number;
  auctionCount?: number;
  approvalCount?: number;
  canisterCount?: number;
  poolCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isOpenMobile,
  onCloseMobile,
  accountCount = 2,
  holdingCount = 3,
  offerCount = 4,
  collateralCount = 2,
  auctionCount = 2,
  approvalCount = 2,
  canisterCount = 3,
  poolCount = 2,
}) => {
  const primaryItems: { id: AppSection; label: string; icon: any; badge?: string }[] = [
    { id: 'notaries', label: 'Notaries', icon: ShieldCheck, badge: 'BFT Quorum' },
    { id: 'portfolio', label: 'Portfolio', icon: Landmark, badge: `${accountCount}` },
    { id: 'vault', label: 'Vault Custody', icon: Key, badge: `${holdingCount} Assets` },
    { id: 'trade', label: 'Trade & DvP', icon: TrendingUp, badge: `${offerCount} Offers` },
    { id: 'collateral', label: 'Collateral Desk', icon: Layers, badge: `${collateralCount}` },
    { id: 'auctions', label: 'Bond Auctions', icon: Gavel, badge: `${auctionCount} Live` },
    { id: 'corporate_actions', label: 'Coupon Engine', icon: Coins, badge: 'ACTUS' },
    { id: 'governance', label: 'Maker-Checker', icon: UserCheck, badge: `${approvalCount} Pending` },
    { id: 'vault_telemetry', label: 'PoR Telemetry', icon: Activity, badge: 'IoT Live' },
    { id: 'sweeper', label: 'Liquidity Sweeper', icon: Bot, badge: 'Active' },
    { id: 'bridge', label: 'Harmonix Bridge', icon: ArrowLeftRight, badge: 'Chain-Key' },
    { id: 'canister_mgmt', label: 'Smart Contracts', icon: Cpu, badge: `${canisterCount} Canisters` },
    { id: 'liquidity_pools', label: 'Wholesale Pools', icon: Droplets, badge: `${poolCount} Pools` },
    { id: 'interoperability', label: 'Interoperability', icon: ArrowLeftRight, badge: 'SWIFT' },
    { id: 'compliance', label: 'Compliance', icon: Scale, badge: 'Radar' },
  ];

  const bottomItems: { id: AppSection; label: string; icon: any }[] = [
    { id: 'support', label: 'Support & Docs', icon: HelpCircle },
    { id: 'logs', label: 'Logs & ERP Export', icon: FileText },
  ];

  const handleSelect = (id: AppSection) => {
    setActiveSection(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 8, 15, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 1100,
          }}
        />
      )}

      <aside
        className="desktop-sidebar"
        style={{
          width: '240px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          position: isOpenMobile ? 'fixed' : 'sticky',
          top: isOpenMobile ? 0 : '64px',
          left: isOpenMobile ? 0 : 'auto',
          bottom: isOpenMobile ? 0 : 'auto',
          zIndex: isOpenMobile ? 1200 : 'auto',
          transition: 'transform 0.2s ease',
        }}
      >
        {isOpenMobile && (
          <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>SOVEREIGN LEDGER</div>
            <button onClick={onCloseMobile} style={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Primary Navigation Items */}
        <div style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
            CENTRAL LEDGER & WORKSTATION
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    backgroundColor: isActive ? '#1c2d52' : 'transparent',
                    color: isActive ? 'var(--cyan-primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '12.5px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    border: isActive ? '1px solid rgba(0, 210, 238, 0.3)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={15} color={isActive ? 'var(--cyan-primary)' : 'var(--text-dim)'} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 5px',
                        borderRadius: '9999px',
                        backgroundColor: isActive ? 'rgba(0, 210, 238, 0.2)' : '#121b2d',
                        color: isActive ? 'var(--cyan-primary)' : 'var(--text-dim)',
                        border: `1px solid ${isActive ? 'rgba(0, 210, 238, 0.4)' : '#1e2d4a'}`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support & Logs Items */}
        <div style={{ marginTop: 'auto', padding: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '7px',
                  backgroundColor: isActive ? '#1c2d52' : 'transparent',
                  color: isActive ? 'var(--cyan-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '12px',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} color={isActive ? 'var(--cyan-primary)' : 'var(--text-dim)'} />
                {item.label}
              </button>
            );
          })}

          {/* Notary Consensus Live Status Badge */}
          <div style={{ marginTop: '6px', backgroundColor: '#0b1324', border: '1px solid var(--border-subtle)', padding: '6px 8px', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={13} color="var(--green-valid)" className="pulse-glow" />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-main)' }}>Raft Quorum 4/5</div>
              <div style={{ fontSize: '8.5px', color: 'var(--green-valid)' }}>● Zero Double-Spend Active</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
