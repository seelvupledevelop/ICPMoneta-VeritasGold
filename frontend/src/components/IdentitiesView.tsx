import React, { useState } from 'react';
import type { PrincipalProfile } from '../types';
import { registerIdentity, issueBlindedIdentity } from '../services/api';
import { Users, EyeOff, ShieldCheck, Plus } from 'lucide-react';

interface IdentitiesViewProps {
  identities: PrincipalProfile[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const IdentitiesView: React.FC<IdentitiesViewProps> = ({ identities, onRefresh, onNotify }) => {
  const [showBlindModal, setShowBlindModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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
      onNotify(`Registered Legal Entity: ${legalName}`);
      setShowRegisterModal(false);
      setLegalName('');
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlindSwap = async () => {
    setSubmitting(true);
    try {
      const res = await issueBlindedIdentity({
        well_known: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        anonymous: 'ryjl3-hexae-mc6xm-gopwt-x5jg7-2a',
      });
      onNotify(`Blinded Identity Issued! Anonymous Principal: ${res.anonymous_principal.slice(0, 14)}...`);
      setShowBlindModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Identity Registry & Blinded Privacy</h2>
          <p style={{ fontSize: '13px', color: '#606060', marginTop: '4px' }}>
            Verified network legal principals and ephemeral blinded cryptographic counterparties for selective privacy.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => setShowRegisterModal(true)}>
            <Plus size={16} /> Register Entity
          </button>
          <button className="btn-accent" onClick={() => setShowBlindModal(true)}>
            <EyeOff size={16} /> Generate Blinded Key
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {identities.map((id) => (
          <div key={id.principal} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#065FD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{id.legal_name}</h3>
                  <span style={{ fontSize: '12px', color: '#606060' }}>Role: {id.role}</span>
                </div>
              </div>
              <span className="badge badge-active">
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> Verified
              </span>
            </div>

            <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#606060' }}>
              <div>Principal ID:</div>
              <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0F0F0F' }}>{id.principal}</code>
            </div>
          </div>
        ))}
      </div>

      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Register Legal Participant</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Verify and associate an ICP principal with a real-world legal entity profile.
            </p>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Entity Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Frankfurt Liquidity Desk GmbH"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Network Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-flat"
                >
                  <option value="Trader">Institutional Trader</option>
                  <option value="Custodian">Asset Custodian</option>
                  <option value="Regulator">Central Bank / Regulator</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRegisterModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlindModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Generate Blinded Identity</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Creates an ephemeral anonymous counterparty with cryptographic proof of ownership for Alice Trading Corp.
            </p>

            <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#606060' }}>
              <div>Parent Principal: <b>Alice Trading Corp</b></div>
              <div style={{ marginTop: '4px' }}>Proof Type: <b>BLINDED_PROOF_V1_SHA256</b></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowBlindModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-accent" onClick={handleBlindSwap} disabled={submitting}>
                {submitting ? 'Generating Proof...' : 'Issue Anonymous Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
