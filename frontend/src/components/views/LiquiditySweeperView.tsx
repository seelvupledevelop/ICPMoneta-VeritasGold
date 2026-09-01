import React, { useState } from 'react';
import type { SweepingRule, DemandDepositRecord } from '../../types';
import { createSweepingRule } from '../../services/api';
import { Bot, Plus, CheckCircle2 } from 'lucide-react';

interface LiquiditySweeperViewProps {
  rules: SweepingRule[];
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const LiquiditySweeperView: React.FC<LiquiditySweeperViewProps> = ({ rules, accounts, onRefresh, onNotify }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sourceAccount, setSourceAccount] = useState(accounts[0]?.account_id || '');
  const [targetAsset, setTargetAsset] = useState('USTB');
  const [thresholdEur, setThresholdEur] = useState('1,000,000.00');
  const [frequency, setFrequency] = useState('Daily at 16:30 UTC (EOD Cash Sweep)');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createSweepingRule({
        source_account: sourceAccount,
        target_asset: targetAsset,
        threshold_eur: thresholdEur,
        frequency,
      });

      onNotify(`Automated Liquidity Sweeping Rule Active! Rule ID: ${res.rule_id}`);
      setShowCreateModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Programmable Liquidity Sweeping Engine
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automated corporate treasury rules to sweep idle cash above thresholds into yield-bearing US Treasuries or Gold.
          </p>
        </div>

        <button className="btn-cyan" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Create Sweeping Rule
        </button>
      </div>

      {/* Rules Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Active Smart Sweeping Rules
            </h3>
          </div>
          <span className="pill-valid">● Engine Running</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Rule ID</th>
                <th style={{ padding: '12px 18px' }}>Source Cash Account</th>
                <th style={{ padding: '12px 18px' }}>Target Asset</th>
                <th style={{ padding: '12px 18px' }}>Sweep Trigger Threshold</th>
                <th style={{ padding: '12px 18px' }}>Execution Frequency</th>
                <th style={{ padding: '12px 18px' }}>Total Swept to Date</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.rule_id} style={{ borderBottom: '1px solid #131f36' }}>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                    {r.rule_id}
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.source_account}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="pill-cyan">{r.target_asset}</span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff' }}>&gt; €{r.threshold_eur} EUR</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{r.frequency}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--green-valid)' }}>€{r.total_swept_eur} EUR</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <span className="pill-valid">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Configure Liquidity Sweeper Rule
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Automatically convert idle demand deposit balances above your threshold into tokenized sovereign debt.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Source Demand Deposit</label>
                <select value={sourceAccount} onChange={(e) => setSourceAccount(e.target.value)} className="input-dark">
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (€{a.balance.value_str} {a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Target Yield Asset</label>
                <select value={targetAsset} onChange={(e) => setTargetAsset(e.target.value)} className="input-dark">
                  <option value="USTB">US Treasury 3M Bill (AA+ Sovereign Debt - 3.85% Yield)</option>
                  <option value="GOLD">LBMA Physical Gold (1 oz Bar - Inflation Hedge)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Excess Cash Trigger Threshold (€ EUR)</label>
                <input
                  type="text"
                  value={thresholdEur}
                  onChange={(e) => setThresholdEur(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Sweep Frequency Schedule</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-dark">
                  <option value="Daily at 16:30 UTC (EOD Cash Sweep)">Daily at 16:30 UTC (EOD Cash Sweep)</option>
                  <option value="Realtime_Excess (Continuous Sweeping)">Realtime Excess (Continuous Sweeping)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Activating...' : 'Activate Sweeping Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
