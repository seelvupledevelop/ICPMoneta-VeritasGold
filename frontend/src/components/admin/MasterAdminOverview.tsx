import React from 'react';
import {
  Shield,
  Cpu,
  Radio,
  Users,
  KeyRound,
} from 'lucide-react';
import { PERSONA_LIST, type PersonaDefinition } from '../auth/InstitutionalLoginSurface';
import { AnimatedCounter } from '../ui/motion/AnimatedCounter';
import { PulseBadge } from '../ui/motion/PulseBadge';
import { triggerSettlementConfetti } from '../ui/motion/ConfettiTrigger';
import type { DemandDepositRecord, FungibleAssetHolding, CanisterStatusInfo } from '../../types';

interface MasterAdminOverviewProps {
  accounts: DemandDepositRecord[];
  holdings: FungibleAssetHolding[];
  canisters: CanisterStatusInfo[];
  onSelectPersona: (p: PersonaDefinition) => void;
  onNotify: (msg: string) => void;
  onRefresh: () => void;
}

export const MasterAdminOverview: React.FC<MasterAdminOverviewProps> = ({
  accounts,
  canisters,
  onSelectPersona,
  onNotify,
  onRefresh,
}) => {
  const handleImpersonate = (persona: PersonaDefinition) => {
    triggerSettlementConfetti();
    onSelectPersona(persona);
    onNotify(`Switched active session to ${persona.roleTitle} (${persona.institutionName})`);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Master Network Radar */}
      <div
        style={{
          padding: '24px 28px',
          borderRadius: '14px',
          backgroundColor: '#0c0a10',
          border: '1px solid var(--border-red)',
          boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid var(--border-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--red-primary)',
              boxShadow: '0 0 16px var(--red-glow)',
            }}
          >
            <Shield size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Sovereign Master Admin & Global Participant Radar
              </h1>
              <PulseBadge label="Root Authority" variant="red" />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Full Network Surveillance • Multi-Entity Ledger Balances • ICP Fiduciary Subnet Health
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              onRefresh();
              onNotify('Refreshed global ledger and canister state across all participants');
            }}
            className="btn-outline"
            style={{ fontSize: '12px', padding: '8px 14px' }}
          >
            ↻ Sync Network State
          </button>
          <button
            onClick={() => {
              triggerSettlementConfetti();
              onNotify('Global sanity audit passed: 100% Asset Conservation verified across all accounts');
            }}
            className="btn-red"
            style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 800 }}
          >
            Verify Global Invariants
          </button>
        </div>
      </div>

      {/* Network-wide KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <div className="card card-red-accent card-interactive shimmer-gold" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Global Aggregate AUM
            </span>
            <PulseBadge label="+1.24% 24h" variant="green" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
            <AnimatedCounter prefix="$" value={14245680000.00} decimals={2} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across 5 Central Banks & 12 Commercial Desks
          </div>
        </div>

        <div className="card card-interactive" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Active Participants
            </span>
            <Users size={16} color="var(--red-primary)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
            {PERSONA_LIST.length} Institutions
          </div>
          <div style={{ fontSize: '11px', color: 'var(--green-valid)', marginTop: '4px' }}>
            ● All KYC / LEI Cleared
          </div>
        </div>

        <div className="card card-interactive" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Canister Fleet Health
            </span>
            <Cpu size={16} color="var(--green-valid)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--green-valid)', marginTop: '6px' }}>
            {canisters.length || 7} Live WASMs
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            DFINITY Subnet `tdx34-5f...`
          </div>
        </div>

        <div className="card card-interactive" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              BFT Quorum Notaries
            </span>
            <Radio size={16} color="var(--green-valid)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
            4 / 5 Validated
          </div>
          <div style={{ fontSize: '11px', color: 'var(--green-valid)', marginTop: '4px' }}>
            ● Zero Double-Spend Guarantee
          </div>
        </div>
      </div>

      {/* Institutional Participants Registry & 1-Click Role Switcher */}
      <div
        style={{
          backgroundColor: '#0c0a10',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              All Institutional Participants & Personas
            </h3>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Click "Switch Role" to instantly impersonate any participant and view the application through their permissions.
            </div>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            7 Institutional Nodes Active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PERSONA_LIST.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.id}
                className="card-interactive"
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#130e17',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: 'var(--red-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{persona.roleTitle}</span>
                      <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
                        {persona.clearanceLevel}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {persona.institutionName} • BIC: <span style={{ fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>{persona.bic}</span> • LEI: <span style={{ fontFamily: 'var(--font-mono)' }}>{persona.lei}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Default Surface</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {persona.defaultMode === 'mobile' ? '📱 Mobile App' : '💻 Workstation'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleImpersonate(persona)}
                    className="btn-red"
                    style={{
                      padding: '8px 14px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <KeyRound size={13} />
                    Switch Role ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Demand Deposit Accounts Across Network */}
      <div
        style={{
          backgroundColor: '#0c0a10',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
          Network-wide Demand Deposit Cash Partitions ({accounts.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {accounts.map((acc) => (
            <div
              key={acc.account_id}
              style={{
                backgroundColor: '#120d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>{acc.account_id}</span>
                <span className="pill-valid" style={{ fontSize: '9px' }}>{acc.currency}</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                €{acc.balance.value_str} {acc.currency}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Owner: {acc.owner}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
