import React, { useState } from 'react';
import type { LiquidityPool } from '../../types';
import { Droplet, Plus } from 'lucide-react';

interface WholesaleLiquidityViewProps {
  pools: LiquidityPool[];
  onNotify?: (msg: string, isError?: boolean) => void;
}

export const WholesaleLiquidityView: React.FC<WholesaleLiquidityViewProps> = ({ pools, onNotify }) => {
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | null>(null);
  const [amountA, setAmountA] = useState('100,000.00');
  const [amountB, setAmountB] = useState('39.33');
  const [submitting, setSubmitting] = useState(false);

  const handleAddLiquidity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPool) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (onNotify) {
        onNotify(`Liquidity Provision Confirmed! Minted 500.00 LP Tokens for ${selectedPool.pair_name}.`);
      }
      setSelectedPool(null);
    }, 600);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Wholesale Institutional Liquidity Pools
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Deep RWA automated market maker (AMM) pools with fixed interbank fee tiers and yield generation.
          </p>
        </div>

        <span className="pill-valid">● AMM Constant Product Active</span>
      </div>

      {/* Pools Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Active Institutional Liquidity Pairs
            </h3>
          </div>
          <span className="pill-cyan">Low Slippage Order Routing</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Pool ID</th>
                <th style={{ padding: '12px 18px' }}>Trading Pair</th>
                <th style={{ padding: '12px 18px' }}>Reserve Token A</th>
                <th style={{ padding: '12px 18px' }}>Reserve Token B</th>
                <th style={{ padding: '12px 18px' }}>Total Liquidity (TVL)</th>
                <th style={{ padding: '12px 18px' }}>24h Volume</th>
                <th style={{ padding: '12px 18px' }}>LP APY</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pools.map((p) => (
                <tr key={p.pool_id} style={{ borderBottom: '1px solid #131f36' }}>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                    {p.pool_id}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#ffffff' }}>
                    {p.pair_name}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{p.reserve_a}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{p.reserve_b}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff' }}>{p.total_liquidity_eur}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--cyan-primary)', fontWeight: 600 }}>{p.volume_24h_eur}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--green-valid)', fontWeight: 800 }}>{p.apy_pct}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      className="btn-cyan"
                      style={{ padding: '6px 14px', fontSize: '11px' }}
                      onClick={() => setSelectedPool(p)}
                    >
                      <Plus size={13} /> Provide LP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LP Modal */}
      {selectedPool && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Provide Liquidity: {selectedPool.pair_name}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Deposit balanced liquidity into the smart contract pool to earn {selectedPool.apy_pct} APY fee share.
            </p>

            <form onSubmit={handleAddLiquidity} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Deposit {selectedPool.token_a_symbol}</label>
                <input
                  type="text"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Deposit {selectedPool.token_b_symbol}</label>
                <input
                  type="text"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setSelectedPool(null)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Depositing LP...' : 'Confirm Liquidity Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
