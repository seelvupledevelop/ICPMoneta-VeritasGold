import React from 'react';
import type { AppSection } from '../../types';
import { Landmark, ShoppingBag, Tag, ArrowLeftRight, Activity, ShieldCheck, Zap, Eye } from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;
  accountCount: number;
  rwaCount: number;
  offerCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, accountCount, rwaCount, offerCount }) => {
  const items: { id: AppSection; label: string; icon: any; badge?: string }[] = [
    { id: 'banking', label: 'Bank Account & Wire', icon: Landmark, badge: `${accountCount}` },
    { id: 'marketplace', label: 'RWA Marketplace', icon: ShoppingBag, badge: `${rwaCount} Assets` },
    { id: 'offers', label: 'P2P RWA Trade Book', icon: Tag, badge: `${offerCount} Offers` },
    { id: 'rfq', label: 'RFQ Trade Desk', icon: Zap, badge: 'Instant' },
    { id: 'exchange', label: 'Gold & FX Rates', icon: ArrowLeftRight },
    { id: 'protocols', label: 'Protocol Activity', icon: Activity },
    { id: 'supervision', label: 'Supervisory Radar', icon: Eye, badge: 'Admin' },
    { id: 'audit', label: 'Consensus & Audit', icon: ShieldCheck },
  ];

  return (
    <aside style={{ width: '270px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', position: 'sticky', top: '64px' }}>
      <div style={{ padding: '20px 16px 10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px', marginBottom: '8px' }}>
          Smart Application
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#0F0F0F' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#0F0F0F',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  border: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={isActive ? '#FFFFFF' : '#606060'} />
                  {item.label}
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: isActive ? '#FF0000' : '#F2F2F2',
                      color: isActive ? '#FFFFFF' : '#606060',
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

      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #E5E5E5' }}>
        <div style={{ backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#FF0000', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F0F0F' }}>ICP Ledger Active</div>
            <div style={{ fontSize: '10px', color: '#606060' }}>Zero Double-Spend</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
