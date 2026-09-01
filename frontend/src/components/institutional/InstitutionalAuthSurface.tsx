import React, { useState } from 'react';
import { Building2, Lock, Globe, CheckCircle2 } from 'lucide-react';

export interface InstitutionProfile {
  id: string;
  name: string;
  bic: string;
  lei: string;
  jurisdiction: string;
  role: 'CentralBank' | 'Tier1Commercial' | 'CustodyVault' | 'AssetManager';
  allocatedAumEur: string;
  supportedCurrencies: string[];
}

export const INSTITUTION_PROFILES: InstitutionProfile[] = [
  {
    id: 'INST-JPMC-NY',
    name: 'JPMorgan Chase Bank, N.A.',
    bic: 'JPMCUS33XXX',
    lei: '7H6GLXDRUGQFU57RNE97',
    jurisdiction: 'United States (FedNow / FedWire)',
    role: 'Tier1Commercial',
    allocatedAumEur: '4,850,000,000.00',
    supportedCurrencies: ['USD', 'EUR', 'CHF', 'GBP', 'SGD', 'XAU'],
  },
  {
    id: 'INST-SNB-ZRH',
    name: 'Swiss National Bank (SNB)',
    bic: 'SNBCH22XXXX',
    lei: '5493006MHB8U70A88Z85',
    jurisdiction: 'Switzerland (SIC / SIX SIS)',
    role: 'CentralBank',
    allocatedAumEur: '6,200,000,000.00',
    supportedCurrencies: ['CHF', 'EUR', 'USD', 'XAU'],
  },
  {
    id: 'INST-GS-LN',
    name: 'Goldman Sachs International',
    bic: 'GOLDSACXXXX',
    lei: 'W22LROWP2IHZNBB6K528',
    jurisdiction: 'United Kingdom (CHAPS / TARGET2)',
    role: 'Tier1Commercial',
    allocatedAumEur: '2,400,000,000.00',
    supportedCurrencies: ['GBP', 'EUR', 'USD', 'XAU'],
  },
  {
    id: 'INST-ZRH-VAULT',
    name: 'Zurich Swiss Bullion Custody AG',
    bic: 'ZRHVAULTXXX',
    lei: '89450000000000000001',
    jurisdiction: 'Switzerland (Duty-Free Vault ZRH-01)',
    role: 'CustodyVault',
    allocatedAumEur: '8,420,000,000.00',
    supportedCurrencies: ['XAU', 'CHF', 'USD'],
  },
];

interface InstitutionalAuthSurfaceProps {
  currentProfile: InstitutionProfile;
  onSelectProfile: (profile: InstitutionProfile) => void;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const InstitutionalAuthSurface: React.FC<InstitutionalAuthSurfaceProps> = ({
  currentProfile,
  onSelectProfile,
  onClose,
  onNotify,
}) => {
  const [selected, setSelected] = useState<string>(currentProfile.id);
  const [authMethod, setAuthMethod] = useState<'mTLS' | 'FIDO2' | 'ThresholdECDSA'>('mTLS');

  const handleAuthenticate = () => {
    const prof = INSTITUTION_PROFILES.find((p) => p.id === selected);
    if (prof) {
      onSelectProfile(prof);
      onNotify(`Institutional Session Established for ${prof.name} (${prof.bic}) via ${authMethod}`);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card fade-in" style={{ maxWidth: '640px', border: '1px solid var(--border-red)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>Institutional Participant Access</h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>J.P. Morgan Kinexys & Veritas Gold Settlement Portal</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-outline" style={{ padding: '4px 10px', fontSize: '11px' }}>
            Close
          </button>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Select Institutional Node Identity:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {INSTITUTION_PROFILES.map((p) => {
              const isSelected = selected === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? 'var(--border-red)' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.12)' : '#0e0c12',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: isSelected ? 'var(--red-primary)' : '#1c151c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#FFFFFF' : 'var(--text-muted)' }}>
                      <Globe size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#FFFFFF' : 'var(--text-main)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        BIC: {p.bic} • LEI: {p.lei.slice(0, 10)}... • {p.jurisdiction}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={isSelected ? 'pill-valid' : 'pill-gold'} style={{ fontSize: '9.5px' }}>
                      {p.role}
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      AUM: €{p.allocatedAumEur.slice(0, 5)}M
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Security Handshake Protocol:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['mTLS', 'FIDO2', 'ThresholdECDSA'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAuthMethod(m)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${authMethod === m ? 'var(--border-red)' : 'var(--border-subtle)'}`,
                    backgroundColor: authMethod === m ? 'rgba(239, 68, 68, 0.2)' : '#120f17',
                    color: authMethod === m ? 'var(--red-primary)' : 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <Lock size={12} /> {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAuthenticate}
            className="btn-red"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px', fontSize: '13.5px' }}
          >
            <CheckCircle2 size={16} /> Establish Institutional Session
          </button>
        </div>
      </div>
    </div>
  );
};
