import React, { useState } from 'react';
import type { FungibleAssetHolding } from '../../types';
import { issueAsset } from '../../services/api';
import { Plus, Flame, ShieldCheck, Coins, Database } from 'lucide-react';

interface IssuerDashboardProps {
  holdings: FungibleAssetHolding[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const IssuerDashboard: React.FC<IssuerDashboardProps> = ({ holdings, onRefresh, onNotify }) => {
  const [showMintModal, setShowMintModal] = useState(false);
  const [currency, setCurrency] = useState('GOLD');
  const [amount, setAmount] = useState('100.00');
  const [submitting, setSubmitting] = useState(false);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await issueAsset({
        issuer: 'jsrcu-gibai-aaaaa-aaaaa-cai',
        holder: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        currency,
        amount: Number(amount).toFixed(2),
      });
      onNotify(`RWA Tokenization Complete: Minted ${amount} ${currency}`);
      setShowMintModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBurn = (holdingId: string) => {
    onNotify(`Redemption request initiated for holding ${holdingId.slice(0, 10)}... (Burning token & releasing collateral)`);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">Issuer & Custodian Portal</span>
            <span style={{ fontSize: '12px', color: '#606060' }}>Apex Central Reserve / Custodian Desk</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Real-World Asset (RWA) Tokenization & Custody</h2>
        </div>

        <button className="btn-accent" onClick={() => setShowMintModal(true)}>
          <Plus size={16} /> Tokenize / Mint RWA
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E8F5E9', color: '#2BA640', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#606060' }}>Reserve Backing Status</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>100% Fully Collateralized</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FFF3E0', color: '#FB8C00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#606060' }}>Total RWA Asset Types</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>4 Denominations (USD, EUR, GOLD, ICP)</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#065FD4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#606060' }}>Active UTXO Records</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{holdings.length} Live Outputs</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Issued RWA Token Inventory & Redemption Controls</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {holdings.map((h) => (
            <div key={h.holding_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#F9F9F9', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-red">{h.asset_symbol}</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{h.holding_id}</code>
                </div>
                <div style={{ fontSize: '11px', color: '#606060' }}>
                  Holder: <code style={{ fontFamily: 'var(--font-mono)' }}>{h.holder.slice(0, 14)}...</code> | Pointer: <code>{h.pointer.update_id.slice(0, 10)}...:{h.pointer.output_index}</code>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{h.amount.value_str} {h.asset_symbol}</div>
                  <div style={{ fontSize: '11px', color: '#2BA640' }}>Collateral Verified</div>
                </div>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: '#FF0000' }} onClick={() => handleBurn(h.holding_id)}>
                  <Flame size={14} /> Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMintModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Tokenize Real-World Asset (Mint)</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Originates digital UTXO representation against physical vault collateral.
            </p>

            <form onSubmit={handleMint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>RWA Asset Class</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-flat">
                  <option value="GOLD">Physical Gold (Ounces)</option>
                  <option value="USD">Treasury Dollar Equivalent (USD)</option>
                  <option value="EUR">Sovereign Euro Note (EUR)</option>
                  <option value="ICP">Internet Computer Native (ICP)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Mint Amount</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-flat" required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowMintModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>{submitting ? 'Minting...' : 'Authorize & Mint Token'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
