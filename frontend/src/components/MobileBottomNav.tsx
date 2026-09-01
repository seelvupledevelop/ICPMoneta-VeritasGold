import React from 'react';
import type { AppSection } from '../types';
import { Landmark, ShoppingBag, Tag, Zap, Eye } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeSection, setActiveSection }) => {
  const items: { id: AppSection; label: string; icon: any }[] = [
    { id: 'banking', label: 'Banking', icon: Landmark },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'offers', label: 'P2P Trade', icon: Tag },
    { id: 'rfq', label: 'RFQ Desk', icon: Zap },
    { id: 'supervision', label: 'Radar', icon: Eye },
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
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E5E5',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
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
              gap: '3px',
              padding: '6px 0',
              flex: 1,
              backgroundColor: 'transparent',
              color: isActive ? '#FF0000' : '#606060',
              fontWeight: isActive ? 700 : 500,
              fontSize: '10px',
            }}
          >
            <Icon size={18} color={isActive ? '#FF0000' : '#606060'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
