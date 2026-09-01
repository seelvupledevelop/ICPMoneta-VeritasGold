import React, { useState } from 'react';
import type { MarketRate, DemandDepositRecord } from '../../types';
import { executeRfqTrade } from '../../services/api';
import { ShoppingBag } from 'lucide-react';

interface RwaMarketplaceProps {
  rates: MarketRate[];
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const RwaMarketplace: React.FC<RwaMarketplaceProps> = ({ rates, accounts, onRefresh, onNotify }) => {
  const [selectedAsset, setSelectedAsset] = useState<MarketRate | null>(null);
  const [buyAmount, setBuyAmount] = useState('1.00');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !selectedAccount) {
      onNotify('Please select payment account', true);
      return;
    }

    const pricePerUnit = parseFloat(selectedAsset.price_eur);
    const totalCost = (pricePerUnit * parseFloat(buyAmount)).toFixed(2);

    setSubmitting(true);
    try {
      await executeRfqTrade({
        account_id: selectedAccount,
        buyer_principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        asset_symbol: selectedAsset.symbol,
        asset_amount: Number(buyAmount).toFixed(2),
        cash_amount: totalCost,
      });

      onNotify(`RWA Purchased Successfully! Received ${buyAmount} ${selectedAsset.symbol} for €${totalCost}`);
      setSelectedAsset(null);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-active">RWA Institutional Catalog</span>
          <span style={{ fontSize: '12px', color: '#606060' }}>Tokenized Real-World Assets & Vault Collateral</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Common List of Buyable Assets</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {rates.map((asset) => {
          const isGold = asset.symbol === 'GOLD';
          return (
            <div
              key={asset.symbol}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                border: isGold ? '2px solid #FFD700' : '1px solid #E5E5E5',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: isGold ? '#FFF8E1' : '#F2F2F2',
                        color: isGold ? '#FFA000' : '#0F0F0F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                      }}
                    >
                      {asset.symbol === 'GOLD' ? '🏆' : asset.symbol === 'USTB' ? '🏛️' : asset.symbol === 'PROP_ZH' ? '🏢' : '🪙'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{asset.name}</h3>
                      <div style={{ fontSize: '11px', color: '#606060' }}>{asset.category}</div>
                    </div>
                  </div>
                  <span className="badge badge-active" style={{ fontSize: '10px' }}>
                    {asset.change_24h}
                  </span>
                </div>

                <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#606060' }}>Live Spot Price (EUR / USD)</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F0F0F', marginTop: '2px' }}>
                    €{asset.price_eur} <span style={{ fontSize: '14px', fontWeight: 500, color: '#606060' }}>/ ${asset.price_usd}</span>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#606060', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Collateral Backing:</span>
                    <span style={{ fontWeight: 600, color: '#0F0F0F', textAlign: 'right' }}>{asset.backing}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Available Liquidity:</span>
                    <span style={{ fontWeight: 600, color: '#2BA640' }}>{asset.liquidity_depth}</span>
                  </div>
                </div>
              </div>

              <button
                className={isGold ? 'btn-accent' : 'btn-primary'}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                onClick={() => {
                  setSelectedAsset(asset);
                  setSelectedAccount(accounts[0]?.account_id || '');
                }}
              >
                <ShoppingBag size={15} /> Buy Asset with Cash
              </button>
            </div>
          );
        })}
      </div>

      {selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
              Buy {selectedAsset.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Direct atomic Delivery-versus-Payment (DvP) on ICP: Debits cash account and issues verifiable RWA token.
            </p>

            <form onSubmit={handleBuy} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Payment Source (Debit Account)</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="input-flat"
                  required
                >
                  <option value="">Select Cash Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (Available: €{a.balance.value_str})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Quantity / Units</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ backgroundColor: '#F9F9F9', padding: '14px', borderRadius: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Price Per Unit:</span>
                  <b>€{selectedAsset.price_eur} EUR</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, borderTop: '1px solid #E5E5E5', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total Cost:</span>
                  <span style={{ color: '#FF0000' }}>
                    €{(parseFloat(selectedAsset.price_eur) * parseFloat(buyAmount || '0')).toFixed(2)} EUR
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedAsset(null)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Executing DvP...' : 'Confirm Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
