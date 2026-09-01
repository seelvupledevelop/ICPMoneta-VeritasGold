import React, { useState } from 'react';
import type { DemandDepositRecord } from '../../types';
import { transferCash } from '../../services/api';
import { Send, CreditCard, Wifi } from 'lucide-react';

interface BankCardSurfaceProps {
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const BankCardSurface: React.FC<BankCardSurfaceProps> = ({ accounts, onRefresh, onNotify }) => {
  const [selectedAccIndex, setSelectedAccIndex] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('150.00');
  const [submitting, setSubmitting] = useState(false);

  const activeAccount = accounts[selectedAccIndex] || accounts[0];

  const quickContacts = [
    { name: 'Bob Commodities', principal: 'h64fh-eybaq-aaaaa-aaaaa-cai', accountId: accounts[1]?.account_id || '' },
    { name: 'Swiss Gold Depository', principal: 'jsrcu-gibai-aaaaa-aaaaa-cai', accountId: accounts[0]?.account_id || '' },
    { name: 'Zurich Liquidity Desk', principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai', accountId: accounts[0]?.account_id || '' },
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount || !recipientId || !amount) {
      onNotify('Please select destination account and amount', true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await transferCash({
        sender_id: activeAccount.account_id,
        recipient_id: recipientId,
        amount: Number(amount).toFixed(2),
      });
      onNotify(`Money Sent Instantly! Protocol ID: ${res.protocol_id}`);
      setShowSendModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickPay = (destAccId: string) => {
    setRecipientId(destAccId);
    setShowSendModal(true);
  };

  const balanceNum = activeAccount ? parseFloat(activeAccount.balance.value_str) : 0;
  const overdraftNum = activeAccount ? parseFloat(activeAccount.overdraft_limit.value_str) : 0;
  const spendingPower = (balanceNum + overdraftNum).toFixed(2);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">Digital Banking Surface</span>
            <span style={{ fontSize: '12px', color: '#606060' }}>Instant Blockchain Wire Network</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Bank Accounts, Cards & Payments</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-accent" onClick={() => setShowSendModal(true)}>
            <Send size={16} /> Send Money
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px', marginBottom: '32px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
            borderRadius: '20px',
            padding: '26px',
            color: '#FFFFFF',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '230px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255,0,0,0.25)', filter: 'blur(40px)' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#FF0000', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                ⚡
              </div>
              <span style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '14px' }}>RED BROADCAST</span>
            </div>
            <Wifi size={20} color="rgba(255,255,255,0.7)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
            <div style={{ width: '42px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', border: '1px solid rgba(0,0,0,0.3)' }}></div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>ICP ON-CHAIN ACCOUNT</span>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Available Spending Power</div>
            <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '2px' }}>
              €{spendingPower} <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>EUR</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
            <div>
              <div>ACCOUNT ID</div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, marginTop: '2px' }}>{activeAccount?.account_id.slice(0, 16)}...</div>
            </div>
            <div>
              <div>STATUS</div>
              <div style={{ color: '#2BA640', fontWeight: 700, marginTop: '2px' }}>ACTIVE</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#606060', marginBottom: '8px' }}>Select Account Partition</div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {accounts.map((acc, idx) => (
                <button
                  key={acc.account_id}
                  onClick={() => setSelectedAccIndex(idx)}
                  className={`chip ${selectedAccIndex === idx ? 'active' : ''}`}
                >
                  <CreditCard size={14} />
                  {acc.account_id.slice(0, 14)}... (Bal: €{acc.balance.value_str})
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Quick Send to Approved Counterparties</div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {quickContacts.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleQuickPay(c.accountId)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F9F9F9',
                    border: '1px solid #EAEAEA',
                    minWidth: '110px',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#FFEBEE', color: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {c.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSendModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Send Money via Blockchain Wire</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Instant finality atomic cash wire on the Internet Computer settlement engine.
            </p>

            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>From Account (Sender)</label>
                <input
                  type="text"
                  value={`${activeAccount?.account_id} (Available: €${spendingPower})`}
                  disabled
                  className="input-flat"
                  style={{ backgroundColor: '#EFEFEF', color: '#606060' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>To Account (Recipient)</label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="input-flat"
                  required
                >
                  <option value="">Select Destination Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (Owner: {a.owner.slice(0, 12)}...)
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowSendModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Sending on-chain...' : 'Send Wire Instantly'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
