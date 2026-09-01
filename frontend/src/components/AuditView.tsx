import React from 'react';
import { Lock, Database } from 'lucide-react';

export const AuditView: React.FC = () => {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Settlement Engine & Finality Authority</h2>
        <p style={{ fontSize: '13px', color: '#606060', marginTop: '4px' }}>
          Real-time consensus verification, input record tombstoning, and double-spend cryptographic proof verification.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFEBEE', color: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Finality Authority Service</h3>
              <div style={{ fontSize: '12px', color: '#606060' }}>Consensus Uniqueness Engine</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Double-Spend Protection:</span>
              <span className="badge badge-active">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Consensus Mechanism:</span>
              <b>Atomic Input Locking</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Proof Signature Format:</span>
              <code style={{ fontFamily: 'var(--font-mono)' }}>SHA256_FINALITY_V1</code>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#065FD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Settlement Engine Registry</h3>
              <div style={{ fontSize: '12px', color: '#606060' }}>Global Record State Store</div>
            </div>
          </div>
          <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Orthogonal Persistence:</span>
              <span className="badge badge-active">ICP Stable Heap</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LocalLedgerView Indexing:</span>
              <b>Inverted Participant Index</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Verification Policies:</span>
              <b>AssetConservation + AccountLimits</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
