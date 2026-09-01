import React from 'react';
import type { AppSection } from '../../types';
import { Landmark, ShoppingBag, Tag, ArrowLeftRight, Activity, ShieldCheck, Zap, Eye, FileText, Layers, X } from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;
  accountCount: number;
  rwaCount: number;
  offerCount: number;
  txnCount: number;
  collateralCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  accountCount,
  rwaCount,
  offerCount,
  txnCount,
  collateralCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const items: { id: AppSection; label: string; icon: any; badge?: string }[] = [
    { id: 'banking', label: 'Tokenized Deposits (JPMD)', icon: Landmark, badge: `${accountCount}` },
    { id: 'marketplace', label: 'RWA Marketplace', icon: ShoppingBag, badge: `${rwaCount} Assets` },
    { id: 'offers', label: 'P2P RWA Trade Book', icon: Tag, badge: `${offerCount} Offers` },
    { id: 'rfq', label: 'RFQ Trade Desk', icon: Zap, badge: 'Instant' },
    { id: 'accounting', label: 'Treasury & GL Reports', icon: FileText, badge: `${txnCount} TXNs` },
    { id: 'collateral', label: 'Collateral & Repo Desk', icon: Layers, badge: `${collateralCount} Pledged` },
    { id: 'exchange', label: 'Gold & FX Rates', icon: ArrowLeftRight },
    { id: 'protocols', label: 'Protocol Activity', icon: Activity },
    { id: 'supervision', label: 'Supervisory Radar', icon: Eye, badge: 'Admin' },
    { id: 'audit', label: 'Consensus & Audit', icon: ShieldCheck },
  ];

  const handleItemClick = (id: AppSection) => {
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 1100,
          }}
        />
      )}

      <aside
        className="desktop-sidebar"
        style={{
          width: '275px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E5E5',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          position: isOpenMobile ? 'fixed' : 'sticky',
          top: isOpenMobile ? 0 : '64px',
          left: isOpenMobile ? 0 : 'auto',
          bottom: isOpenMobile ? 0 : 'auto',
          zIndex: isOpenMobile ? 1200 : 'auto',
          boxShadow: isOpenMobile ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
          transition: 'transform 0.2s ease',
        }}
      >
        {isOpenMobile && (
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E5E5' }}>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>MONETA NAVIGATION</div>
            <button onClick={onCloseMobile} style={{ backgroundColor: '#F2F2F2', padding: '6px', borderRadius: '6px' }}>
              <X size={18} />
            </button>
          </div>
        )}

        <div style={{ padding: '20px 16px 10px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px', marginBottom: '8px' }}>
            Enterprise Banking Suite
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#0F0F0F' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#0F0F0F',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '12.5px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    border: 'none',
                    minHeight: '38px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isActive ? '#FFFFFF' : '#606060'} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '9.5px',
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

        <div style={{ marginTop: 'auto', padding: '14px 16px', borderTop: '1px solid #E5E5E5' }}>
          <div style={{ backgroundColor: '#FFEBEE', padding: '10px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#FF0000', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F0F0F' }}>ICP Ledger Active</div>
              <div style={{ fontSize: '9px', color: '#606060' }}>Zero Double-Spend</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
