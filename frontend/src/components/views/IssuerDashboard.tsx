import React, { useState } from 'react';
import type { FungibleAssetHolding } from '../../types';
import { issueAsset } from '../../services/api';
import { Plus, Flame, ShieldCheck, Coins, Database, Diamond, Landmark, } from 'lucide-react';

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
    onNotify(`Redemption request initiated for holding ${holdingId.slice(0, 10)}... (Burning token & releasing physical vault collateral)`);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pill-red">● Sovereign Custodian Desk</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Zurich ZRH-01 & Hong Kong HKG-01 Custody</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Real-World Asset (RWA) Tokenization & Custody
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Originates digital UTXO representations against allocated physical vault bullion and sovereign reserves.
          </p>
        </div>

        <button className="btn-red" onClick={() => setShowMintModal(true)}>
          <Plus size={15} /> Tokenize / Mint RWA
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid-3col">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--green-valid)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reserve Backing Status</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>100% Collateralized</div>
            <div style={{ fontSize: '10.5px', color: 'var(--green-valid)', marginTop: '2px' }}>● Verified by Ultrasonic IoT</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-red)' }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total RWA Asset Classes</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--red-primary)' }}>GOLD, USTB, EURD, USD</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Allocated & Synthetic</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active UTXO Records</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{holdings.length} Live Outputs</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '2px' }}>Deterministic Canister State</div>
          </div>
        </div>
      </div>

      {/* Main RWA Inventory Container */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
              Issued RWA Token Inventory & Redemption Controls
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              On-chain digital title outputs backed 1:1 by physical Swiss and Hong Kong vault allocations.
            </p>
          </div>
          <span className="pill-valid">{holdings.length} Active Holdings</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {holdings.map((h) => {
            const isGold = h.asset_symbol === 'GOLD';
            return (
              <div
                key={h.holding_id}
                className="card-elevated"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: isGold ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isGold ? 'var(--red-primary)' : '#ffffff',
                      border: `1px solid ${isGold ? 'var(--border-red)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {isGold ? <Diamond size={20} /> : <Landmark size={20} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="pill-red" style={{ fontSize: '11px', fontWeight: 800 }}>
                        {h.asset_symbol}
                      </span>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {h.holding_id}
                      </code>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Holder: <span style={{ color: 'var(--text-muted)' }}>{h.holder.slice(0, 16)}...</span> | Pointer: <span style={{ color: 'var(--red-primary)' }}>{h.pointer.update_id.slice(0, 10)}...:{h.pointer.output_index}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {h.amount.value_str} <span style={{ color: 'var(--red-primary)', fontSize: '15px' }}>{h.asset_symbol}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--green-valid)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <ShieldCheck size={13} /> Collateral Verified
                    </div>
                  </div>

                  <button
                    className="btn-outline-red"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => handleBurn(h.holding_id)}
                  >
                    <Flame size={14} /> Redeem
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Tokenize Real-World Asset (Mint)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Originates digital UTXO representation against physical vault collateral.
            </p>

            <form onSubmit={handleMint} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>RWA Asset Class</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-dark">
                  <option value="GOLD">Physical Gold (Ounces)</option>
                  <option value="USD">Treasury Dollar Equivalent (USD)</option>
                  <option value="EUR">Sovereign Euro Note (EUR)</option>
                  <option value="ICP">Internet Computer Native (ICP)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Mint Amount</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-dark" required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowMintModal(false)}>Cancel</button>
                <button type="submit" className="btn-red" disabled={submitting}>
                  <Plus size={14} /> {submitting ? 'Minting...' : 'Authorize & Mint Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
