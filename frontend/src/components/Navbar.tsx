import React from 'react';
import { ShieldCheck, Activity, Landmark, Coins, Users } from 'lucide-react';

interface NavbarProps {
  networkStatus: 'healthy' | 'connecting' | 'offline';
  accountCount: number;
  holdingCount: number;
  protocolCount: number;
  identityCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  networkStatus,
  accountCount,
  holdingCount,
  protocolCount,
  identityCount,
}) => {
  return (
    <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 800, fontSize: '18px' }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Red Broadcast <span style={{ fontSize: '12px', fontWeight: 500, color: '#606060' }}>ICP Financial Ledger</span>
            </h1>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#606060' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Landmark size={14} color="#065FD4" /> <b>{accountCount}</b> Accounts
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Coins size={14} color="#FF0000" /> <b>{holdingCount}</b> Holdings
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={14} color="#2BA640" /> <b>{protocolCount}</b> Protocols
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="#7B1FA2" /> <b>{identityCount}</b> Entities
            </span>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E5E5' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '9999px', backgroundColor: '#F2F2F2', fontSize: '12px', fontWeight: 500 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: networkStatus === 'healthy' ? '#2BA640' : '#FF0000' }}></span>
              ICP Canister Suite
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '9999px', backgroundColor: '#FFEBEE', color: '#FF0000', fontSize: '11px', fontWeight: 600 }}>
              <ShieldCheck size={13} /> NVIDIA Engine Active
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
