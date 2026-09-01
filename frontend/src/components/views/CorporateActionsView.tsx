import React, { useState } from 'react';
import type { CorporateAction } from '../../types';
import { executeCorporateAction } from '../../services/api';
import { CheckCircle2, Play, Coins } from 'lucide-react';

interface CorporateActionsViewProps {
  actions: CorporateAction[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const CorporateActionsView: React.FC<CorporateActionsViewProps> = ({ actions, onRefresh, onNotify }) => {
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleExecute = async (action: CorporateAction) => {
    setSubmittingId(action.action_id);
    try {
      const res = await executeCorporateAction(action.action_id);
      onNotify(`ACTUS Distribution Executed! €${res.distributed_eur} EUR credited to token holders. Proof: ${res.attestation}`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Corporate Actions & Coupon Engine (ACTUS)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Algorithmic distribution of Treasury coupon cash flows and Real Estate rental dividends directly into demand deposits.
          </p>
        </div>

        <span className="pill-valid">● ACTUS PAM / LAX Standard</span>
      </div>

      {/* Corporate Actions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Scheduled Cash-Flow Distributions
            </h3>
          </div>
          <span className="pill-cyan">Auto-Credit Enabled</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Action ID</th>
                <th style={{ padding: '12px 18px' }}>Target Asset</th>
                <th style={{ padding: '12px 18px' }}>Action Type</th>
                <th style={{ padding: '12px 18px' }}>ACTUS Contract</th>
                <th style={{ padding: '12px 18px' }}>Rate / Yield</th>
                <th style={{ padding: '12px 18px' }}>Record Date</th>
                <th style={{ padding: '12px 18px' }}>Total Payout</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Execute</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((act) => {
                const isScheduled = act.status === 'Scheduled';
                return (
                  <tr key={act.action_id} style={{ borderBottom: '1px solid #131f36' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                      {act.action_id}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{act.asset_name}</div>
                      <code style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{act.asset_symbol}</code>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-main)', fontWeight: 600 }}>{act.action_type}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="pill-cyan" style={{ fontSize: '10px' }}>{act.actus_contract}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--green-valid)', fontWeight: 700 }}>{act.rate_or_amount_per_unit}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{act.record_date}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff' }}>€{act.total_distributed_eur} EUR</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`pill-${isScheduled ? 'cyan' : 'valid'}`}>
                        {isScheduled ? '● Scheduled' : 'Settled & Distributed'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {isScheduled ? (
                        <button
                          className="btn-cyan"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={() => handleExecute(act)}
                          disabled={submittingId === act.action_id}
                        >
                          <Play size={13} /> {submittingId === act.action_id ? 'Distributing...' : 'Execute Payout'}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--green-valid)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Distributed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
