import React, { useState } from 'react';
import type { MarketRate, DemandDepositRecord } from '../../types';
import { executeRfqTrade } from '../../services/api';
import { Zap } from 'lucide-react';

interface RwaMarketplaceProps {
  rates: MarketRate[];
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const RwaMarketplace: React.FC<RwaMarketplaceProps> = ({ rates, accounts, onRefresh, onNotify }) => {
  const [selectedAsset, setSelectedAsset] = useState<MarketRate | null>(null);
  const [quantity, setQuantity] = useState('1.00');
  const [buyerAccountId, setBuyerAccountId] = useState(accounts[0]?.account_id || '');
  const [submitting, setSubmitting] = useState(false);

  const handleQuickPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !buyerAccountId) {
      onNotify('Please select payment account', true);
      return;
    }

    const pricePerUnit = parseFloat(selectedAsset.price_eur);
    const qty = parseFloat(quantity);
    const totalCost = (pricePerUnit * qty).toFixed(2);

    setSubmitting(true);
    try {
      await executeRfqTrade({
        account_id: buyerAccountId,
        buyer_principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        asset_symbol: selectedAsset.symbol,
        asset_amount: Number(quantity).toFixed(2),
        cash_amount: totalCost,
      });

      onNotify(`DvP Settlement Finalized! Bought ${quantity} ${selectedAsset.symbol} for €${totalCost} EUR`);
      setSelectedAsset(null);
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
            Swiss Vault Bullion & RWA Market
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Allocated physical gold, sovereign US Treasury bonds, and real estate equity with instant DvP.
          </p>
        </div>

        <span className="pill-valid">● 100% Reserve Backed</span>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid-3col">
        {rates.map((rate) => {
          const isGold = rate.symbol === 'GOLD';
          const isBond = rate.symbol === 'USTB';
          return (
            <div key={rate.symbol} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#121d33',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {isGold ? '🏆' : isBond ? '🏛️' : '🏢'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>{rate.name}</div>
                      <code style={{ fontSize: '10px', color: 'var(--cyan-primary)' }}>{rate.iso24165_dti || rate.symbol}</code>
                    </div>
                  </div>
                  <span className="pill-cyan" style={{ fontSize: '10px' }}>{rate.change_24h}</span>
                </div>

                <div style={{ margin: '16px 0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Institutional Spot Rate</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
                    €{rate.price_eur} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>EUR</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>${rate.price_usd} USD</div>
                </div>

                <div style={{ backgroundColor: '#09101f', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '11.5px', marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '10px', textTransform: 'uppercase' }}>Vault Custody Backing:</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>{rate.backing}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Depth: {rate.liquidity_depth}</span>
                <button
                  className="btn-cyan"
                  style={{ padding: '6px 14px', fontSize: '11.5px' }}
                  onClick={() => {
                    setSelectedAsset(rate);
                    setQuantity('1.00');
                    setBuyerAccountId(accounts[0]?.account_id || '');
                  }}
                >
                  <Zap size={13} /> Buy on ICP
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Buy Modal */}
      {selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Instant DvP: {selectedAsset.name}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Execute Delivery-versus-Payment against Swiss Vault reserves with sub-second finality.
            </p>

            <form onSubmit={handleQuickPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Payment Source (Debit Account)</label>
                <select
                  value={buyerAccountId}
                  onChange={(e) => setBuyerAccountId(e.target.value)}
                  className="input-dark"
                  required
                >
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (€{a.balance.value_str} {a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Quantity to Acquire</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Settle Debit:</span>
                  <b style={{ color: 'var(--cyan-primary)', fontSize: '15px' }}>
                    €{(parseFloat(selectedAsset.price_eur) * parseFloat(quantity || '0')).toFixed(2)} EUR
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setSelectedAsset(null)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Executing DvP...' : 'Confirm Atomic Trade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
