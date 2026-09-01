import React, { useState } from 'react';
import type { PrincipalProfile } from '../../types';
import { registerIdentity } from '../../services/api';
import { Users, ShieldCheck, UserPlus, Sliders } from 'lucide-react';

interface AdminDashboardProps {
  identities: PrincipalProfile[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ identities, onRefresh, onNotify }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [legalName, setLegalName] = useState('');
  const [role, setRole] = useState('Trader');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerIdentity({
        principal: 'jsrcu-gibai-aaaaa-aaaaa-cai',
        legal_name: legalName,
        role,
      });
      onNotify(`Onboarded Verified Institutional Entity: ${legalName}`);
      setShowAddModal(false);
      setLegalName('');
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">Canister Governance</span>
            <span style={{ fontSize: '12px', color: '#606060' }}>System Administrator View</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Participant Governance & Canister Controls</h2>
        </div>

        <button className="btn-accent" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} /> Onboard Institution
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Verified Network Participant Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {identities.map((id) => (
              <div key={id.principal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#F9F9F9', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#065FD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{id.legal_name}</h4>
                    <div style={{ fontSize: '11px', color: '#606060' }}>Principal: <code style={{ fontFamily: 'var(--font-mono)' }}>{id.principal}</code></div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-blue">{id.role}</span>
                  <span className="badge badge-active"><ShieldCheck size={11} style={{ display: 'inline', marginRight: '3px' }} /> Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#7B1FA2" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>System Configuration</h3>
          </div>

          <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ color: '#606060' }}>Default Daily Velocity Cap</div>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>€5,000.00 EUR</div>
            </div>
            <div>
              <div style={{ color: '#606060' }}>Consensus Notary Quorum</div>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>1/1 Finality Authority Canister</div>
            </div>
            <div>
              <div style={{ color: '#606060' }}>Orthogonal Storage Mode</div>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>ICP Stable Memory (64-bit)</div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Onboard Verified Institutional Entity</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Assign legal entity metadata, compliance authorization, and network roles.
            </p>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Entity Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zurich Digital Custody AG"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Network Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input-flat">
                  <option value="Trader">Institutional Trader</option>
                  <option value="Custodian">Asset Custodian / Originator</option>
                  <option value="Regulator">Central Bank / Regulatory Auditor</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Registering...' : 'Verify & Onboard'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
