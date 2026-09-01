import React, { useState } from 'react';
import type { CollateralPosition } from '../../types';
import { postCollateral } from '../../services/api';
import { Plus } from 'lucide-react';

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

      onNotify(`Collateral Position Pledged Successfully! Position ID: ${res.position_id}`);
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
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">JPMorgan Kinexys Standard</span>
            <span style={{ fontSize: '11px', color: '#606060' }}>Tokenized Repo & Collateral Management</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, marginTop: '4px' }}>
            Collateral Positions & Repo Lending
          </h2>
        </div>

        <button className="btn-accent" onClick={() => setShowPledgeModal(true)}>
          <Plus size={16} /> Pledge Tokenized Collateral
        </button>
      </div>

      <div className="grid-2col" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div style={{ fontSize: '11px', color: '#606060' }}>Total Pledged Collateral Market Value</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F0F0F', marginTop: '2px' }}>
            €{totalMarketVal} <span style={{ fontSize: '14px', fontWeight: 500, color: '#606060' }}>EUR</span>
          </div>
          <div style={{ fontSize: '11px', color: '#2BA640', marginTop: '4px' }}>● 100% Encumbered in Sovereign Swiss Vault</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', color: '#606060' }}>Effective Intraday Repo Borrowing Capacity</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#2BA640', marginTop: '2px' }}>
            €{totalCapacity} <span style={{ fontSize: '14px', fontWeight: 500, color: '#606060' }}>EUR</span>
          </div>
          <div style={{ fontSize: '11px', color: '#606060', marginTop: '4px' }}>Risk-Adjusted Haircuts (2% - 5%)</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Position ID</th>
                <th style={{ padding: '12px 16px' }}>Asset Class</th>
                <th style={{ padding: '12px 16px' }}>Pledged Quantity</th>
                <th style={{ padding: '12px 16px' }}>Market Value (EUR)</th>
                <th style={{ padding: '12px 16px' }}>Haircut</th>
                <th style={{ padding: '12px 16px' }}>Borrowing Capacity</th>
                <th style={{ padding: '12px 16px' }}>Pledgee (Lender)</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.position_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.position_id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-red">{p.asset_symbol}</span>
                      <span style={{ fontWeight: 600 }}>{p.asset_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.pledged_amount}</td>
                  <td style={{ padding: '12px 16px' }}>€{p.market_value_eur}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#FF0000' }}>{p.haircut_percent}%</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#2BA640' }}>€{p.borrowing_capacity_eur} EUR</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px' }}>{p.pledgee}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-active">{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPledgeModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Pledge Tokenized Collateral</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '16px' }}>
              Lock tokenized Treasuries or Gold on-chain to unlock instant intraday liquidity & repo credit.
            </p>

            <form onSubmit={handlePledge} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Collateral Asset</label>
                <select value={assetSymbol} onChange={(e) => handleAssetChange(e.target.value)} className="input-flat">
                  <option value="USTB">US Treasury 3M Bill (AA+ Bond)</option>
                  <option value="GOLD">LBMA Physical Gold (1 oz Bar)</option>
                  <option value="PROP_ZH">Prime Zurich Commercial Real Estate</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Quantity to Pledge</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Market Value (€ EUR)</label>
                  <input
                    type="number"
                    value={marketValue}
                    onChange={(e) => setMarketValue(e.target.value)}
                    className="input-flat"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Haircut (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={haircut}
                    onChange={(e) => setHaircut(e.target.value)}
                    className="input-flat"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Pledgee Counterparty (Lender)</label>
                <input
                  type="text"
                  value={pledgee}
                  onChange={(e) => setPledgee(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowPledgeModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Encumbering...' : 'Pledge On-Chain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
