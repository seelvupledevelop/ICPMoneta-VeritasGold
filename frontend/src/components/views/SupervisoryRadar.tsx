import React, { useState, useEffect } from 'react';
import type { SupervisionData } from '../../types';
import { fetchSupervisionData } from '../../services/api';
import { Eye, Lock, RefreshCw, ShieldCheck } from 'lucide-react';

export const SupervisoryRadar: React.FC = () => {
  const [data, setData] = useState<SupervisionData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRadar = async () => {
    setLoading(true);
    try {
      const res = await fetchSupervisionData();
      setData(res);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRadar();
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-red">Central Bank & Supervisory Radar</span>
            <span style={{ fontSize: '11px', color: '#606060' }}>Complete Unmasked Institutional Supervision</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, marginTop: '4px' }}>Global Institutional Oversight & Anonymous Key Unmasking</h2>
        </div>

        <button className="btn-secondary" onClick={loadRadar} disabled={loading}>
          <RefreshCw size={14} /> Refresh Radar
        </button>
      </div>

      <div className="grid-4col" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Supervisory Authority</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FF0000', marginTop: '4px' }}>
            CENTRAL_BANK_SUPERUSER
          </div>
          <div style={{ fontSize: '10px', color: '#2BA640', marginTop: '2px' }}>Full Regulatory Access</div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Double-Spend Interceptions</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#2BA640', marginTop: '2px' }}>
            0 Double-Spends
          </div>
          <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>100% Blocked by Notary</div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Active Canister Partitions</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#065FD4', marginTop: '2px' }}>
            10 Canisters
          </div>
          <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>Wasm Orthogonal Heap</div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Dual-Key State</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#7B1FA2', marginTop: '4px' }}>
            Blinded + Audit Proof
          </div>
          <div style={{ fontSize: '10px', color: '#2BA640', marginTop: '2px' }}>Zero Market Manipulation</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} color="#FF0000" /> Active Anonymous Flows (Unmasked for Regulator Only)
            </h3>
          </div>
          <span className="badge badge-active" style={{ fontSize: '10px' }}>Decrypted</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>On-Chain Anonymous Key</th>
                <th style={{ padding: '12px 16px' }}>Unmasked Legal Institution</th>
                <th style={{ padding: '12px 16px' }}>Net Cash Exposure (EUR)</th>
                <th style={{ padding: '12px 16px' }}>RWA Holdings</th>
                <th style={{ padding: '12px 16px' }}>Compliance Tier</th>
              </tr>
            </thead>
            <tbody>
              {data?.unmasked_active_flows.map((flow) => (
                <tr key={flow.anonymous_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={12} color="#888" />
                      <code style={{ fontSize: '11px' }}>{flow.anonymous_id.slice(0, 14)}...</code>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F0F0F' }}>
                    {flow.unmasked_legal_owner}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{flow.net_exposure_eur}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-red">{flow.rwa_gold_holdings_oz || flow.rwa_bond_holdings_usd}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={11} /> {flow.risk_tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
