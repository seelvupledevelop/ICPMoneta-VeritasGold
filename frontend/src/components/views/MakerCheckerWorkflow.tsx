import React, { useState } from 'react';
import type { PendingApproval } from '../../types';
import { approveGovernanceItem } from '../../services/api';
import { UserCheck, CheckCircle2, Key } from 'lucide-react';

interface MakerCheckerWorkflowProps {
  approvals: PendingApproval[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const MakerCheckerWorkflow: React.FC<MakerCheckerWorkflowProps> = ({ approvals, onRefresh, onNotify }) => {
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleApprove = async (approval: PendingApproval) => {
    setSubmittingId(approval.approval_id);
    try {
      await approveGovernanceItem(approval.approval_id, 'Senior Treasury Officer (Zurich Central Clearing)');
      onNotify(`Maker-Checker Multi-Sig Authorized for ${approval.approval_id}!`);
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
            Maker-Checker Multi-Sig Approval Queue
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Dual-authorization governance for high-value transactions (&gt; €100,000 EUR), asset minting, and collateral releases.
          </p>
        </div>

        <span className="pill-valid">● 2-of-3 Quorum Enforced</span>
      </div>

      {/* Approvals Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Pending Authorization Queue
            </h3>
          </div>
          <span className="pill-cyan">Institutional Threshold</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Approval ID</th>
                <th style={{ padding: '12px 18px' }}>Maker Officer</th>
                <th style={{ padding: '12px 18px' }}>Operation / Action</th>
                <th style={{ padding: '12px 18px' }}>Amount (€ EUR)</th>
                <th style={{ padding: '12px 18px' }}>Details / GL Leg</th>
                <th style={{ padding: '12px 18px' }}>Quorum</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Senior Checker Sign-Off</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((appr) => {
                const isPending = appr.status === 'Pending_Checker';
                return (
                  <tr key={appr.approval_id} style={{ borderBottom: '1px solid #131f36' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                      {appr.approval_id}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{appr.maker_legal}</div>
                      <code style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{appr.maker_principal.slice(0, 14)}...</code>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 700 }}>{appr.action_type}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--green-valid)' }}>€{appr.amount_eur} EUR</td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{appr.details}</td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isPending ? 'var(--amber-warning)' : 'var(--green-valid)' }}>
                      {appr.current_signatures} / {appr.required_signatures} Sigs
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`pill-${isPending ? 'cyan' : 'valid'}`}>
                        {isPending ? '● Awaiting Checker' : 'Fully Approved'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {isPending ? (
                        <button
                          className="btn-cyan"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={() => handleApprove(appr)}
                          disabled={submittingId === appr.approval_id}
                        >
                          <Key size={13} /> {submittingId === appr.approval_id ? 'Signing...' : 'Sign & Authorize'}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--green-valid)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Authorized
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
