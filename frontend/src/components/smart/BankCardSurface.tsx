import React, { useState } from 'react';
import type { DemandDepositRecord } from '../../types';
import { transferCash } from '../../services/api';
import { Send, ArrowUpRight, Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BankCardSurfaceProps {
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const BankCardSurface: React.FC<BankCardSurfaceProps> = ({ accounts, onRefresh, onNotify }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [senderId, setSenderId] = useState(accounts[0]?.account_id || '');
  const [recipientId, setRecipientId] = useState(accounts[1]?.account_id || '');
  const [amount, setAmount] = useState('150.00');
  const [memo, setMemo] = useState('Cross-border liquidity settlement');
  const [submitting, setSubmitting] = useState(false);

  const selectedAccount = accounts.find((a) => a.account_id === senderId) || accounts[0];
  const balanceNum = selectedAccount ? parseFloat(selectedAccount.balance.value_str) : 0;
  const overdraftNum = selectedAccount ? parseFloat(selectedAccount.overdraft_limit.value_str) : 0;
  const totalAvailable = (balanceNum + overdraftNum).toFixed(2);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId || !recipientId) {
      onNotify('Please select valid sender and recipient accounts', true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await transferCash({
        sender_id: senderId,
        recipient_id: recipientId,
        amount: Number(amount).toFixed(2),
        memo,
        gl_code: '1010-01',
      });
      onNotify(`Transfer Executed! TxID: ${res.txn_id || res.protocol_id} via pacs.008`);
      setShowTransferModal(false);
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
            Portfolio & Tokenized Deposits
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-currency demand deposit partitions with sub-second ICP settlement.
          </p>
        </div>

        <button className="btn-cyan" onClick={() => setShowTransferModal(true)}>
          <Send size={15} /> Initiate On-Chain Wire
        </button>
      </div>

      {/* Grid: Titanium Card & Quick Pay */}
      <div className="grid-banking">
        {/* Virtual Titanium Corporate Card */}
        <div className="titanium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--cyan-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                CENTRAL CLEARING CARD
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.01em', marginTop: '2px' }}>
                Node Alpha-1 Corporate
              </div>
            </div>
            <span className="pill-cyan" style={{ fontSize: '10px' }}>JPMD / EURD</span>
          </div>

          <div style={{ margin: '26px 0 16px 0' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Total Spending Power (Balance + Overdraft)</div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
              €{totalAvailable} <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--cyan-primary)' }}>EUR</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Account Identifier</div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                {selectedAccount?.account_id || 'ACC-EUR-ALICE-01'}
              </code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--green-valid)' }}>
              <ShieldCheck size={14} /> Active
            </div>
          </div>
        </div>

        {/* Quick Transfer & Velocity Limits */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Velocity & Account Limits</h3>
              <span className="pill-valid">● RTGS Interoperable</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="card-elevated">
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Transfer Limit</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  €{selectedAccount?.daily_transfer_limit?.value_str || '5,000.00'}
                </div>
              </div>

              <div className="card-elevated">
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Approved Overdraft Facility</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--cyan-primary)', marginTop: '2px' }}>
                  €{selectedAccount?.overdraft_limit?.value_str || '1,000.00'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Pay Buttons */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
              1-Tap Quick Pay Counterparties:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '11.5px' }}
                onClick={() => {
                  setRecipientId(accounts[1]?.account_id || 'ACC-EUR-BOB-02');
                  setAmount('250.00');
                  setShowTransferModal(true);
                }}
              >
                <ArrowUpRight size={13} color="var(--cyan-primary)" /> Bob Commodities (€250)
              </button>

              <button
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '11.5px' }}
                onClick={() => {
                  setRecipientId('ACC-VAULT-ZURICH-01');
                  setAmount('500.00');
                  setShowTransferModal(true);
                }}
              >
                <ArrowUpRight size={13} color="var(--green-valid)" /> Swiss Vault (€500)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demand Deposit Accounts Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Active Demand Deposit Partitions
            </h3>
          </div>
          <span className="pill-cyan">ISO 20022 camt.053</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Account ID</th>
                <th style={{ padding: '12px 18px' }}>Currency</th>
                <th style={{ padding: '12px 18px' }}>Settled Balance</th>
                <th style={{ padding: '12px 18px' }}>Overdraft Limit</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.account_id} style={{ borderBottom: '1px solid #131f36' }}>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                    {acc.account_id}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="pill-cyan">{acc.currency}</span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff' }}>
                    €{acc.balance.value_str} {acc.currency}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                    €{acc.overdraft_limit.value_str}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="pill-valid">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      className="btn-outline"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => {
                        setSenderId(acc.account_id);
                        setShowTransferModal(true);
                      }}
                    >
                      <Send size={12} /> Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Initiate On-Chain Wire Transfer
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Real-time pacs.008 atomic settlement via the Internet Computer Canister Suite.
            </p>

            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Debit Account</label>
                <select value={senderId} onChange={(e) => setSenderId(e.target.value)} className="input-dark">
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (€{a.balance.value_str} {a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Recipient Account</label>
                <input
                  type="text"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Amount (€ EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Commercial Memo / GL Tag</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowTransferModal(false)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Executing on ICP...' : 'Confirm & Settle Wire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
