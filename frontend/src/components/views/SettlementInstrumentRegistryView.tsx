import React, { useState } from 'react';
import {
  Coins,
} from 'lucide-react';
import { PulseBadge } from '../ui/motion/PulseBadge';
import { ContextualGuidanceDrawer } from '../ui/ContextualGuidanceDrawer';

export interface SettlementInstrument {
  id: string;
  name: string;
  symbol: string;
  currency: string;
  issuer: string;
  legalClassification: string;
  jurisdiction: string;
  backingPolicy: string;
  attestationFrequency: string;
  issueCap: string;
  currentCirculating: string;
  status: 'Active (Sandbox)' | 'Verified (Production)' | 'Pending Approval';
  canisterId: string;
}

export const SETTLEMENT_INSTRUMENT_DATA: SettlementInstrument[] = [
  {
    id: 'INST-SEURD',
    name: 'Sandbox Euro Settlement Token',
    symbol: 'sEURD',
    currency: 'EUR',
    issuer: 'Veritas Fiduciary Simulation Rail',
    legalClassification: 'Simulated Sandbox Token (Valueless / Non-Redeemable)',
    jurisdiction: 'Simulated European Banking Rail',
    backingPolicy: '100% Simulated Target2 Central Bank Reserves',
    attestationFrequency: 'Continuous Real-Time (ICP Subnet Notarization)',
    issueCap: '€10,000,000,000.00 EUR',
    currentCirculating: '€1,480,250,000.00 EUR',
    status: 'Active (Sandbox)',
    canisterId: '2vxsx-yme-seurd-fiduciary',
  },
  {
    id: 'INST-SUSDD',
    name: 'Sandbox US Dollar Settlement Token',
    symbol: 'sUSDD',
    currency: 'USD',
    issuer: 'Veritas Fiduciary Simulation Rail',
    legalClassification: 'Simulated Sandbox Token (Valueless / Non-Redeemable)',
    jurisdiction: 'Simulated Fedwire / FedNow Rail',
    backingPolicy: '100% Simulated US Treasury Overnight Repo Backing',
    attestationFrequency: 'Continuous Real-Time (ICP Subnet Notarization)',
    issueCap: '$10,000,000,000.00 USD',
    currentCirculating: '$2,150,000,000.00 USD',
    status: 'Active (Sandbox)',
    canisterId: '3vysy-zme-susdd-fiduciary',
  },
  {
    id: 'INST-XAU-PHYSICAL',
    name: 'Swiss Allocated Physical Gold Bullion',
    symbol: 'XAU',
    currency: 'XAU',
    issuer: 'Zurich Swiss Bullion Custody AG',
    legalClassification: 'Physical Allocated Title (Swiss BankG Art. 899 CO)',
    jurisdiction: 'Switzerland (Duty-Free Vault ZRH-01)',
    backingPolicy: '100% 1:1 Physical LBMA Good Delivery 999.9 Gold Bars',
    attestationFrequency: 'Continuous IoT Ultrasonic Sensor Density Telemetry',
    issueCap: '50,000.00 Fine Troy Ounces',
    currentCirculating: '14,250.00 Fine Troy Ounces',
    status: 'Verified (Production)',
    canisterId: '4wztz-ame-xau-fiduciary',
  },
  {
    id: 'INST-SCHF',
    name: 'Swiss Franc Sovereign Fiduciary Token',
    symbol: 'sCHF',
    currency: 'CHF',
    issuer: 'Swiss National Bank / Fiduciary Desk',
    legalClassification: 'Sovereign Fiduciary Instrument',
    jurisdiction: 'Switzerland (SIC Rail)',
    backingPolicy: '100% SNB Fiduciary Sight Deposit Backing',
    attestationFrequency: 'Daily Central Bank Reconciliation',
    issueCap: '5,000,000,000.00 CHF',
    currentCirculating: '850,000,000.00 CHF',
    status: 'Active (Sandbox)',
    canisterId: '5xaua-bme-schf-fiduciary',
  },
];

export const SettlementInstrumentRegistryView: React.FC = () => {
  const [selectedInst, setSelectedInst] = useState<SettlementInstrument>(SETTLEMENT_INSTRUMENT_DATA[0]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Contextual Guidance Drawer */}
      <ContextualGuidanceDrawer
        pageTitle="Settlement Instrument Registry"
        whatIsThis="The official institutional registry of all authorized cash, tokenized deposit, and settlement instruments available on the Veritas network. Distinguishes valueless simulated sandbox instruments (sEURD/sUSDD) from regulated production titles."
        whoCanUse={['Central Bank Operator', 'Commercial Bank Treasury', 'Custodian / Notary', 'Auditor']}
        dataOrigin="Canister smart contract metadata validated by 4/5 BFT consensus notaries and Swiss custody ledgers."
        operationalSteps={[
          '1. Inspect available settlement instruments, circulating volumes, and issuer legal entities.',
          '2. Review reserve backing policies and attestation frequencies before initiating high-value transfers.',
          '3. Check issue caps and per-account limits.',
        ]}
        controlsAndApprovals="Minting, burning, or changing instrument supply caps requires Level 5 Sovereign clearance and 2-of-2 maker-checker notarization."
        riskWarnings={[
          'Warning: sEURD and sUSDD are strictly sandbox tokens for simulated testing and carry zero external cash value.',
        ]}
        auditEvidence="All token balance movements produce immutable ISO 20022 camt.054 debit/credit notifications archived for 10 years."
      />

      {/* Top Banner */}
      <div
        style={{
          padding: '20px 24px',
          borderRadius: '12px',
          backgroundColor: '#0c0a10',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--border-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--red-primary)',
            }}
          >
            <Coins size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Settlement Instrument Registry
            </h2>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Generic Multi-Currency Settlement Engine • ISO 4217 Currency Standards
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <PulseBadge label="sEURD / sUSDD Sandbox Active" variant="gold" />
          <PulseBadge label="Zero Floating-Point Drift (u128 Math)" variant="green" />
        </div>
      </div>

      {/* Instruments Table */}
      <div
        style={{
          backgroundColor: '#0c0a10',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
          Registered Settlement Assets ({SETTLEMENT_INSTRUMENT_DATA.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SETTLEMENT_INSTRUMENT_DATA.map((inst) => {
            const isSelected = selectedInst.id === inst.id;
            return (
              <div
                key={inst.id}
                onClick={() => setSelectedInst(inst)}
                className="card-interactive"
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#160e18' : '#110c14',
                  border: isSelected ? '1px solid var(--border-red)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
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
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: 'var(--red-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {inst.symbol}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>{inst.name}</span>
                      <span
                        style={{
                          fontSize: '9.5px',
                          padding: '1px 6px',
                          borderRadius: '3px',
                          backgroundColor: inst.status.includes('Sandbox') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: inst.status.includes('Sandbox') ? '#f59e0b' : 'var(--green-valid)',
                          fontWeight: 700,
                        }}
                      >
                        {inst.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Issuer: {inst.issuer} • Classification: <span style={{ color: 'var(--red-primary)' }}>{inst.legalClassification}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Circulating Volume</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                    {inst.currentCirculating}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Cap: {inst.issueCap}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
