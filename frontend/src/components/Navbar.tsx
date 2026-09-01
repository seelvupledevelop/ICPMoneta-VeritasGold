import React from 'react';
import { Smartphone, Monitor, Menu } from 'lucide-react';

interface NavbarProps {
  networkStatus: 'healthy' | 'connecting' | 'offline';
  accountCount?: number;
  holdingCount?: number;
  protocolCount?: number;
  identityCount?: number;
  phoneMode: boolean;
  setPhoneMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  networkStatus,
  phoneMode,
  setPhoneMode,
  onToggleMobileMenu,
}) => {
  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(12px, 3vw, 24px)',
        position: 'sticky',
        top: 0,
        zIndex: 500,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleMobileMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#F2F2F2',
            color: '#0F0F0F',
          }}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#FF0000',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '16px',
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              MONETA <span style={{ color: '#FF0000' }}>WEB3</span>
              <span className="badge badge-red" style={{ fontSize: '9px', padding: '1px 5px' }}>v0.1</span>
            </div>
            <div style={{ fontSize: '10px', color: '#606060', fontWeight: 500 }}>
              Veritas Gold • ICP Canister Suite
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setPhoneMode((p) => !p)}
          className="chip"
          style={{
            backgroundColor: phoneMode ? '#FFEBEE' : '#F2F2F2',
            color: phoneMode ? '#FF0000' : '#0F0F0F',
            fontWeight: 600,
            fontSize: '11px',
            padding: '5px 10px',
          }}
          title="Toggle Smartphone Simulator Mode"
        >
          {phoneMode ? <Smartphone size={14} color="#FF0000" /> : <Monitor size={14} />}
          <span>{phoneMode ? 'Phone Frame: ON' : 'Phone View'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: networkStatus === 'healthy' ? '#2BA640' : '#FF0000',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#606060' }}>
            {networkStatus === 'healthy' ? 'ICP Live' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
};
