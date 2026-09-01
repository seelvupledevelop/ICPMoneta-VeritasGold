import React from 'react';
import type { AppSection } from '../types';
import { Landmark, Key, ShieldCheck, TrendingUp, Gavel, ArrowLeftRight } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeSection, setActiveSection }) => {
  const items: { id: AppSection; label: string; icon: any }[] = [
    { id: 'notaries', label: 'Notaries', icon: ShieldCheck },
    { id: 'portfolio', label: 'Portfolio', icon: Landmark },
    { id: 'vault', label: 'Vault', icon: Key },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'auctions', label: 'Auctions', icon: Gavel },
    { id: 'bridge', label: 'Bridge', icon: ArrowLeftRight },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: '#0c0b0e',
        borderTop: '1px solid var(--border-red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        padding: '0 6px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.8)',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--red-primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              gap: '3px',
            }}
          >
            <div
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: isActive ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={17} color={isActive ? 'var(--red-primary)' : 'var(--text-dim)'} />
            </div>
            <span style={{ fontSize: '9.5px', fontWeight: isActive ? 800 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
