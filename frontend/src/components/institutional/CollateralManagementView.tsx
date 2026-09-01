import React, { useState } from 'react';
import type { CollateralPosition } from '../../types';
import { postCollateral } from '../../services/api';
import { Plus, Layers } from 'lucide-react';

interface CollateralManagementViewProps {
  positions: CollateralPosition[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const CollateralManagementView: React.FC<CollateralManagementViewProps> = ({ positions, onRefresh, onNotify }) => {
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [assetSymbol, setAssetSymbol] = useState('USTB');
  const [assetName, setAssetName] = useState('US Treasury 3M Bill (AA+)');
  const [amount, setAmount] = useState('50.00 Units');
  const [marketValue, setMarketValue] = useState('45705.00');
  const [haircut, setHaircut] = useState('2.0');
  const [pledgee, setPledgee] = useState('Apex Central Reserve');
  const [submitting, setSubmitting] = useState(false);

  const handleAssetChange = (sym: string) => {
    setAssetSymbol(sym);
    if (sym === 'USTB') {
      setAssetName('US Treasury 3M Bill (AA+)');
      setMarketValue('45705.00');
      setHaircut('2.0');
    } else if (sym === 'GOLD') {
      setAssetName('LBMA Physical Gold (1 oz Bar)');
      setMarketValue('25421.00');
      setHaircut('5.0');
    } else if (sym === 'PROP_ZH') {
      setAssetName('Prime Zurich Commercial Real Estate');
      setMarketValue('23150.00');
      setHaircut('10.0');
    }
  };

  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await postCollateral({
        asset_symbol: assetSymbol,
        asset_name: assetName,
        amount,
        market_value_eur: marketValue,
        haircut_percent: haircut,
        pledgee,
      });

      onNotify(`Collateral Pledged On-Chain! Position ID: ${res.position_id}`);
      setShowPledgeModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const totalMarketVal = positions.reduce((acc, p) => acc + parseFloat(p.market_value_eur || '0'), 0).toFixed(2);
  const totalCapacity = positions.reduce((acc, p) => acc + parseFloat(p.borrowing_capacity_eur || '0'), 0).toFixed(2);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Collateral Positions & Intraday Repo Desk
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tokenized Treasury & Gold margin positions with risk-adjusted borrowing capacity.
          </p>
        </div>

        <button className="btn-cyan" onClick={() => setShowPledgeModal(true)}>
          <Plus size={16} /> Pledge Collateral
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-2col">
        <div className="card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Encumbered Collateral Market Value</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
            €{totalMarketVal} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>EUR</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--green-valid)', marginTop: '4px' }}>● 100% Locked in Swiss Vault Custody Escrow</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Effective Intraday Repo Borrowing Capacity</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--cyan-primary)', letterSpacing: '-0.02em', marginTop: '2px' }}>
            €{totalCapacity} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>EUR</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Calculated with 2.0% - 5.0% Haircut Schedules</div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Active Collateral Escrow Positions
            </h3>
          </div>
          <span className="pill-valid">● BFT Verified</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '12px 18px' }}>Position ID</th>
                <th style={{ padding: '12px 18px' }}>Asset Class</th>
                <th style={{ padding: '12px 18px' }}>Pledged Quantity</th>
                <th style={{ padding: '12px 18px' }}>Market Value (EUR)</th>
                <th style={{ padding: '12px 18px' }}>Haircut</th>
                <th style={{ padding: '12px 18px' }}>Borrowing Capacity</th>
                <th style={{ padding: '12px 18px' }}>Pledgee (Lender)</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.position_id} style={{ borderBottom: '1px solid #131f36' }}>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>{p.position_id}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="pill-cyan">{p.asset_symbol}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.asset_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-main)' }}>{p.pledged_amount}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>€{p.market_value_eur}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--amber-warning)' }}>{p.haircut_percent}%</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--cyan-primary)' }}>€{p.borrowing_capacity_eur} EUR</td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{p.pledgee}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <span className="pill-valid">● Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pledge Modal */}
      {showPledgeModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>Pledge Tokenized Collateral</h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Lock tokenized Treasuries or Gold on-chain to unlock instant intraday liquidity & repo credit.
            </p>

            <form onSubmit={handlePledge} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Collateral Asset</label>
                <select value={assetSymbol} onChange={(e) => handleAssetChange(e.target.value)} className="input-dark">
                  <option value="USTB">US Treasury 3M Bill (AA+ Sovereign Bond)</option>
                  <option value="GOLD">LBMA Physical Gold (1 oz Bar)</option>
                  <option value="PROP_ZH">Prime Zurich Commercial Real Estate</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Quantity to Pledge</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Market Value (€ EUR)</label>
                  <input
                    type="number"
                    value={marketValue}
                    onChange={(e) => setMarketValue(e.target.value)}
                    className="input-dark"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Haircut (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={haircut}
                    onChange={(e) => setHaircut(e.target.value)}
                    className="input-dark"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Pledgee Counterparty (Lender)</label>
                <input
                  type="text"
                  value={pledgee}
                  onChange={(e) => setPledgee(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowPledgeModal(false)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Encumbering on ICP...' : 'Pledge On-Chain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
