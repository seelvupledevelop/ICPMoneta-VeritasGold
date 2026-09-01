import React, { useState } from 'react';
import type { DemandDepositRecord } from '../types';
import { transferCash, createAccount } from '../services/api';
import { Send, PlusCircle, ArrowUpRight, AlertCircle } from 'lucide-react';

interface AccountsViewProps {
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onRefresh, onNotify }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [senderId, setSenderId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newCurrency, setNewCurrency] = useState('EUR');
  const [newOverdraft, setNewOverdraft] = useState('500.00');
  const [newDailyLimit, setNewDailyLimit] = useState('5000.00');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId || !recipientId || !amount) {
      onNotify('Please fill all transfer fields', true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await transferCash({
        sender_id: senderId,
        recipient_id: recipientId,
        amount: Number(amount).toFixed(2),
      });
      onNotify(`Cash Transfer Finalized! Protocol ID: ${res.protocol_id}`);
      setShowTransferModal(false);
      setAmount('');
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAccount({
        custodian: 'jsrcu-gibai-aaaaa-aaaaa-cai',
        owner: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        currency: newCurrency,
        overdraft_limit: Number(newOverdraft).toFixed(2),
        daily_transfer_limit: Number(newDailyLimit).toFixed(2),
      });
      onNotify('Position Account Created Successfully!');
      setShowCreateModal(false);
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
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Position Accounts & Balances</h2>
          <p style={{ fontSize: '13px', color: '#606060', marginTop: '4px' }}>
            Multi-tenant demand deposit sub-ledgers with overdraft facilities and real-time velocity limits.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => setShowCreateModal(true)}>
            <PlusCircle size={16} /> Open Account
          </button>
          <button className="btn-accent" onClick={() => setShowTransferModal(true)}>
            <Send size={16} /> Instant Transfer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {accounts.map((acc) => {
          const balanceNum = parseFloat(acc.balance.value_str);
          const isNegative = balanceNum < 0;
          return (
            <div key={acc.account_id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-active" style={{ marginBottom: '6px' }}>
                    {acc.status === 'Active' ? 'Active Account' : 'Suspended'}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {acc.account_id}
                  </h3>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={16} color="#606060" />
                </div>
              </div>

              <div style={{ backgroundColor: '#F9F9F9', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#606060', marginBottom: '4px' }}>Settled Balance</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: isNegative ? '#FF0000' : '#0F0F0F' }}>
                  {balanceNum >= 0 ? `€${acc.balance.value_str}` : `-€${Math.abs(balanceNum).toFixed(2)}`}
                </div>
                {isNegative && (
                  <div style={{ fontSize: '11px', color: '#FF0000', fontWeight: 500, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> Overdraft In Use
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div style={{ borderLeft: '3px solid #065FD4', paddingLeft: '8px' }}>
                  <div style={{ color: '#606060' }}>Overdraft Limit</div>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>€{acc.overdraft_limit.value_str}</div>
                </div>
                <div style={{ borderLeft: '3px solid #2BA640', paddingLeft: '8px' }}>
                  <div style={{ color: '#606060' }}>Daily Transfer Cap</div>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>€{acc.daily_transfer_limit.value_str}</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#888', borderTop: '1px solid #E5E5E5', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Owner: <code style={{ fontFamily: 'var(--font-mono)' }}>{acc.owner.slice(0, 14)}...</code></span>
                <span>Currency: <b>{acc.currency}</b></span>
              </div>
            </div>
          );
        })}
      </div>

      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Execute Cash Transfer Protocol</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Multi-party atomic balance transfer with policy validation and finality authority notarization.
            </p>

            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Debit Account (Sender)</label>
                <select
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="input-flat"
                  required
                >
                  <option value="">Select Origin Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (Bal: €{a.balance.value_str})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Credit Account (Recipient)</label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="input-flat"
                  required
                >
                  <option value="">Select Destination Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (Owner: {a.owner.slice(0, 10)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Transfer Amount (€ EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 250.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Notarizing on ICP...' : 'Authorize & Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Open New Position Account</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Create a new client demand deposit partition on the ICP settlement engine.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Denomination Currency</label>
                <select
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  className="input-flat"
                >
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="ICP">ICP (Internet Computer)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Approved Overdraft Facility</label>
                <input
                  type="number"
                  step="0.01"
                  value={newOverdraft}
                  onChange={(e) => setNewOverdraft(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Daily Velocity Transfer Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={newDailyLimit}
                  onChange={(e) => setNewDailyLimit(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Open Position Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
