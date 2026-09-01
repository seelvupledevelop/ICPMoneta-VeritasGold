import React from 'react';
import type { Perspective } from '../types';
import { UserCheck, Building2, Terminal, ShieldAlert, KeyRound } from 'lucide-react';

interface PersonaSwitcherProps {
  perspective: Perspective;
  setPerspective: (p: Perspective) => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ perspective, setPerspective }) => {
  const personas: { id: Perspective; label: string; role: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'trader',
      label: 'Institutional Trader',
      role: 'Asset Owner / Trader',
      icon: UserCheck,
      color: '#065FD4',
      desc: 'Execute RWA Split & Move, Cash Transfers, and generate Blinded Keys',
    },
    {
      id: 'issuer',
      label: 'RWA Issuer & Custodian',
      role: 'Asset Originator',
      icon: Building2,
      color: '#2BA640',
      desc: 'Tokenize Real-World Assets, manage Vault Reserves, handle Redemptions',
    },
    {
      id: 'ops',
      label: 'Operations & SRE',
      role: 'Protocol Engineer',
      icon: Terminal,
      color: '#FB8C00',
      desc: 'Track async Protocol State Machines, monitor Canister telemetry',
    },
    {
      id: 'regulator',
      label: 'Regulator & Auditor',
      role: 'Central Bank / Audit',
      icon: ShieldAlert,
      color: '#FF0000',
      desc: 'Double-Spend watchdog, Conservation Invariant audit, Blinded unmasking',
    },
    {
      id: 'admin',
      label: 'System Admin',
      role: 'Canister Governance',
      icon: KeyRound,
      color: '#7B1FA2',
      desc: 'Onboard verified participants, manage permissions & policies',
    },
  ];

  const activePersona = personas.find((p) => p.id === perspective) || personas[0];

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '12px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#606060', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Perspective:
          </span>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {personas.map((p) => {
              const Icon = p.icon;
              const isSelected = perspective === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPerspective(p.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: isSelected ? '#0F0F0F' : '#F2F2F2',
                    color: isSelected ? '#FFFFFF' : '#0F0F0F',
                    border: isSelected ? '1px solid #0F0F0F' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} color={isSelected ? '#FFFFFF' : p.color} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#606060' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activePersona.color }}></span>
          <span style={{ fontWeight: 600, color: '#0F0F0F' }}>{activePersona.role} View:</span>
          <span>{activePersona.desc}</span>
        </div>
      </div>
    </div>
  );
};
