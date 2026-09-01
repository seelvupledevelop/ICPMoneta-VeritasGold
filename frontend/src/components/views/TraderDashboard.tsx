import React, { useState } from 'react';
import type { DemandDepositRecord, FungibleAssetHolding } from '../../types';
import { transferCash, transferAsset, issueBlindedIdentity } from '../../services/api';
import { Send, ArrowRightLeft, EyeOff, Coins, Landmark, Split } from 'lucide-react';

interface TraderDashboardProps {
  accounts: DemandDepositRecord[];
  holdings: FungibleAssetHolding[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const TraderDashboard: React.FC<TraderDashboardProps> = ({ accounts, holdings, onRefresh, onNotify }) => {
  const [showCashModal, setShowCashModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showBlindModal, setShowBlindModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cash Transfer State
  const [senderAccount, setSenderAccount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [cashAmount, setCashAmount] = useState('250.00');

  // Asset Split & Move State
  const [assetCurrency, setAssetCurrency] = useState('USD');
  const [assetAmount, setAssetAmount] = useState('500.00');

  const handleCashTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderAccount || !recipientAccount || !cashAmount) {
      onNotify('Please fill in all cash transfer fields', true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await transferCash({
        sender_id: senderAccount,
        recipient_id: recipientAccount,
        amount: Number(cashAmount).toFixed(2),
      });
      onNotify(`Cash Transfer Finalized! Protocol ID: ${res.protocol_id}`);
      setShowCashModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssetTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await transferAsset({
        sender: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        recipient: 'h64fh-eybaq-aaaaa-aaaaa-cai',
        currency: assetCurrency,
        amount: Number(assetAmount).toFixed(2),
      });
      onNotify(`Asset Split & Moved! Protocol: ${res.protocol_id}`);
      setShowAssetModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlindSwap = async () => {
    setSubmitting(true);
    try {
      const res = await issueBlindedIdentity({
        well_known: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        anonymous: 'ryjl3-hexae-mc6xm-gopwt-x5jg7-2a',
      });
      onNotify(`Blinded Anonymous Key Generated: ${res.anonymous_principal.slice(0, 14)}...`);
      setShowBlindModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-blue">Trader Execution View</span>
            <span style={{ fontSize: '12px', color: '#606060' }}>Alice Trading Corp</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Trading Desk & Asset Portfolio</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => setShowBlindModal(true)}>
            <EyeOff size={16} /> Anonymous Key
          </button>
          <button className="btn-secondary" onClick={() => setShowAssetModal(true)}>
            <ArrowRightLeft size={16} /> Split & Move RWA
          </button>
          <button className="btn-accent" onClick={() => setShowCashModal(true)}>
            <Send size={16} /> Instant Wire Transfer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#065FD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Landmark size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Demand Deposit Cash Sub-Ledgers</h3>
                <div style={{ fontSize: '12px', color: '#606060' }}>Multi-currency accounts & limits</div>
              </div>
            </div>
            <span className="badge badge-active">{accounts.length} Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {accounts.map((acc) => (
              <div key={acc.account_id} style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>{acc.account_id}</code>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F0F0F' }}>
                    {acc.currency === 'EUR' ? '€' : '$'}{acc.balance.value_str} {acc.currency}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#606060' }}>
                  <span>Overdraft Limit: €{acc.overdraft_limit.value_str}</span>
                  <span>Daily Cap: €{acc.daily_transfer_limit.value_str}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFEBEE', color: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coins size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>UTXO Digital Asset Holdings</h3>
                <div style={{ fontSize: '12px', color: '#606060' }}>Conserved-value token state records</div>
              </div>
            </div>
            <span className="badge badge-active">{holdings.length} Holdings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {holdings.map((h) => (
              <div key={h.holding_id} style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-red">{h.asset_symbol}</span>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{h.holding_id}</code>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>{h.amount.value_str} {h.asset_symbol}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pointer: {h.pointer.update_id.slice(0, 12)}...:{h.pointer.output_index}</span>
                  <span style={{ color: '#2BA640', fontWeight: 600 }}>Unconsumed (Spendable)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1px dashed #D0D0D0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Split size={18} color="#065FD4" />
          <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Autonomous Coin Selection & Change Engine</h4>
        </div>
        <p style={{ fontSize: '12px', color: '#606060', lineHeight: 1.5 }}>
          When executing an asset transfer, the Rust <code>CoinSelector</code> algorithm automatically picks the smallest sufficient set of unconsumed holdings, calculates required change, constructs an atomic update draft, and submits it to the <code>FinalityAuthority</code> for instant double-spend protection.
        </p>
      </div>

      {showCashModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Instant Cash Wire Transfer</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Direct atomic debit/credit between demand deposit partitions.
            </p>

            <form onSubmit={handleCashTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Debit Account (Sender)</label>
                <select value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} className="input-flat" required>
                  <option value="">Select Origin Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>{a.account_id} (Bal: €{a.balance.value_str})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Credit Account (Recipient)</label>
                <select value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} className="input-flat" required>
                  <option value="">Select Destination Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>{a.account_id} (Owner: {a.owner.slice(0, 12)}...)</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Amount (€ EUR)</label>
                <input type="number" step="0.01" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} className="input-flat" required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCashModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>{submitting ? 'Executing...' : 'Authorize & Send'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssetModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Split & Move Digital Asset (UTXO)</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Consumes unspent tokens, splits output, and returns change.
            </p>

            <form onSubmit={handleAssetTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Asset Currency</label>
                <select value={assetCurrency} onChange={(e) => setAssetCurrency(e.target.value)} className="input-flat">
                  <option value="USD">USD (Digital Dollar)</option>
                  <option value="EUR">EUR (Digital Euro)</option>
                  <option value="ICP">ICP (Internet Computer)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Transfer Amount</label>
                <input type="number" step="0.01" value={assetAmount} onChange={(e) => setAssetAmount(e.target.value)} className="input-flat" required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAssetModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>{submitting ? 'Splitting...' : 'Confirm UTXO Move'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlindModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Generate Anonymous Blinded Key</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Creates an ephemeral anonymous address for confidential trading on ICP.
            </p>

            <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
              <div>Well-Known Entity: <b>Alice Trading Corp</b></div>
              <div style={{ marginTop: '4px' }}>Proof Scheme: <b>SHA256_BLINDED_IDENTITY_PROOF</b></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowBlindModal(false)}>Cancel</button>
              <button type="button" className="btn-accent" onClick={handleBlindSwap} disabled={submitting}>{submitting ? 'Generating...' : 'Issue Blinded Key'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
