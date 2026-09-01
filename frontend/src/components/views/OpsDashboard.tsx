import React, { useState } from 'react';
import type { ProtocolLog } from '../../types';
import { CheckCircle2, ArrowRight, RefreshCw, Cpu, Server, HardDrive } from 'lucide-react';

interface OpsDashboardProps {
  logs: ProtocolLog[];
  onRefresh: () => void;
}

export const OpsDashboard: React.FC<OpsDashboardProps> = ({ logs, onRefresh }) => {
  const [filterType, setFilterType] = useState('ALL');

  const filteredLogs = filterType === 'ALL' ? logs : logs.filter((l) => l.type === filterType);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-blue">Operations & Telemetry</span>
            <span style={{ fontSize: '12px', color: '#606060' }}>Protocol Coordinator • ICP Subnet Node</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Protocol Coordinator & Canister Metrics</h2>
        </div>

        <button className="btn-secondary" onClick={onRefresh}>
          <RefreshCw size={15} /> Refresh State
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E8F5E9', color: '#2BA640', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Server size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#606060' }}>Canister Architecture</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>10 Wasm Modular Crates</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#065FD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#606060' }}>Consensus Finality Latency</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>&lt; 18ms (Atomic Notary)</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F3E5F5', color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HardDrive size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#606060' }}>Orthogonal Memory</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>ICP Stable Memory Heap</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>State Machine Lifecycle Stages</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #065FD4' }}>
            <div style={{ fontSize: '11px', color: '#606060' }}>Stage 1</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Input Record Lock</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Locks UTXO pointers atomically</div>
          </div>
          <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #FB8C00' }}>
            <div style={{ fontSize: '11px', color: '#606060' }}>Stage 2</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Policy Engine Check</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Conservation & signature verify</div>
          </div>
          <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #7B1FA2' }}>
            <div style={{ fontSize: '11px', color: '#606060' }}>Stage 3</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Finality Proof</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>SHA-256 Notary attestation</div>
          </div>
          <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #2BA640' }}>
            <div style={{ fontSize: '11px', color: '#606060' }}>Stage 4</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Settled & Archived</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Updated in SettlementEngine</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Protocol Machine Execution Stream</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'CashTransfer', 'AssetTransfer', 'BlindedSwap'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`chip ${filterType === t ? 'active' : ''}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px' }}>Protocol ID</th>
              <th style={{ padding: '12px 20px' }}>Type</th>
              <th style={{ padding: '12px 20px' }}>Participants</th>
              <th style={{ padding: '12px 20px' }}>Amount</th>
              <th style={{ padding: '12px 20px' }}>Status</th>
              <th style={{ padding: '12px 20px' }}>Execution Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                <td style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{log.id}</td>
                <td style={{ padding: '12px 20px' }}><span className="badge badge-blue">{log.type}</span></td>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code style={{ fontSize: '11px' }}>{log.sender}</code>
                    <ArrowRight size={12} color="#888" />
                    <code style={{ fontSize: '11px' }}>{log.recipient}</code>
                  </div>
                </td>
                <td style={{ padding: '12px 20px', fontWeight: 600 }}>{log.amount} {log.currency}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span className="badge badge-active"><CheckCircle2 size={11} style={{ display: 'inline', marginRight: '3px' }} /> {log.status}</span>
                </td>
                <td style={{ padding: '12px 20px', color: '#888', fontSize: '11px' }}>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
