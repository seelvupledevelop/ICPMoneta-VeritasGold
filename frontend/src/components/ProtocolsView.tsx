import React from 'react';
import type { ProtocolLog } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ProtocolsViewProps {
  logs: ProtocolLog[];
}

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({ logs }) => {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Protocol Coordinator Live Log</h2>
        <p style={{ fontSize: '13px', color: '#606060', marginTop: '4px' }}>
          Durable asynchronous state machines orchestrating multi-party signatures, policy validation, and consensus finality.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '14px 20px' }}>Protocol ID</th>
              <th style={{ padding: '14px 20px' }}>Type</th>
              <th style={{ padding: '14px 20px' }}>Counterparties</th>
              <th style={{ padding: '14px 20px' }}>Settled Value</th>
              <th style={{ padding: '14px 20px' }}>State Machine Status</th>
              <th style={{ padding: '14px 20px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {log.id}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="badge badge-blue">{log.type}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{log.sender}</code>
                    <ArrowRight size={12} color="#888" />
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{log.recipient}</code>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                  {log.amount} {log.currency}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> {log.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: '#888', fontSize: '12px' }}>
                  {log.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
