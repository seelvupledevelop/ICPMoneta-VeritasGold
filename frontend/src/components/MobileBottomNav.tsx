import React from 'react';
import type { AppSection } from '../types';
import { Landmark, Key, ShieldCheck, TrendingUp, Layers } from 'lucide-react';

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
    { id: 'collateral', label: 'Collateral', icon: Layers },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#0a101d',
        borderTop: '1px solid #172642',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        padding: '0 8px',
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
              color: isActive ? '#00d2ee' : '#8494b0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              gap: '3px',
            }}
          >
            <Icon size={18} color={isActive ? '#00d2ee' : '#52637f'} />
            <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
