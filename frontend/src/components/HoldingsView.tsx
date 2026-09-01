import React, { useState } from 'react';
import type { FungibleAssetHolding } from '../types';
import { issueAsset, transferAsset } from '../services/api';
import { Coins, ArrowRightLeft, Plus } from 'lucide-react';

interface HoldingsViewProps {
  holdings: FungibleAssetHolding[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const HoldingsView: React.FC<HoldingsViewProps> = ({ holdings, onRefresh, onNotify }) => {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [issueCurrency, setIssueCurrency] = useState('USD');
  const [issueAmount, setIssueAmount] = useState('5000.00');

  const [transferCurrency, setTransferCurrency] = useState('USD');
  const [transferAmount, setTransferAmount] = useState('1000.00');

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await issueAsset({
        issuer: 'jsrcu-gibai-aaaaa-aaaaa-cai',
        holder: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        currency: issueCurrency,
        amount: Number(issueAmount).toFixed(2),
      });
      onNotify(`Issued ${issueAmount} ${issueCurrency} digital asset to Alice!`);
      setShowIssueModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await transferAsset({
        sender: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        recipient: 'h64fh-eybaq-aaaaa-aaaaa-cai',
        currency: transferCurrency,
        amount: Number(transferAmount).toFixed(2),
      });
      onNotify(`Asset Split & Transferred! Protocol: ${res.protocol_id}`);
      setShowTransferModal(false);
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
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Digital Asset Holdings (UTXO Model)</h2>
          <p style={{ fontSize: '13px', color: '#606060', marginTop: '4px' }}>
            Conserved-value digital asset records with split-and-merge mechanics and double-spend cryptographic finality.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => setShowIssueModal(true)}>
            <Plus size={16} /> Mint / Issue Asset
          </button>
          <button className="btn-accent" onClick={() => setShowTransferModal(true)}>
            <ArrowRightLeft size={16} /> Split & Transfer
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {holdings.map((h) => (
          <div key={h.holding_id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFEBEE', color: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Coins size={16} />
                </div>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{h.asset_symbol} Asset</span>
                  <div style={{ fontSize: '11px', color: '#606060' }}>UTXO State Output</div>
                </div>
              </div>
              <span className="badge badge-active">
                {h.status === 'Unconsumed' ? 'Unspent (Active)' : 'Consumed'}
              </span>
            </div>

            <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#606060' }}>Asset Holding Balance</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F0F0F', marginTop: '2px' }}>
                {h.amount.value_str} <span style={{ fontSize: '14px', fontWeight: 500, color: '#606060' }}>{h.asset_symbol}</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#606060', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Holding ID:</span>
                <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{h.holding_id}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Record Pointer:</span>
                <code style={{ fontFamily: 'var(--font-mono)' }}>{h.pointer.update_id.slice(0, 10)}...:{h.pointer.output_index}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Holder:</span>
                <code style={{ fontFamily: 'var(--font-mono)' }}>{h.holder.slice(0, 14)}...</code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showIssueModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Issue New Digital Asset</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Mint digital tokens directly into an authorized holder's UTXO position.
            </p>

            <form onSubmit={handleIssue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Asset Symbol</label>
                <select
                  value={issueCurrency}
                  onChange={(e) => setIssueCurrency(e.target.value)}
                  className="input-flat"
                >
                  <option value="USD">USD (Digital Dollar)</option>
                  <option value="EUR">EUR (Digital Euro)</option>
                  <option value="ICP">ICP (Internet Computer)</option>
                  <option value="GOLD">GOLD (Tokenized Ounces)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Issuance Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={issueAmount}
                  onChange={(e) => setIssueAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowIssueModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Minting...' : 'Mint & Sign Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Split & Transfer Digital Asset</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Selects unspent holdings, splits output, returns change, and notarizes on ICP.
            </p>

            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Asset Type</label>
                <select
                  value={transferCurrency}
                  onChange={(e) => setTransferCurrency(e.target.value)}
                  className="input-flat"
                >
                  <option value="USD">USD (Digital Dollar)</option>
                  <option value="EUR">EUR (Digital Euro)</option>
                  <option value="ICP">ICP (Internet Computer)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Transfer Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Transferring...' : 'Execute UTXO Move'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
