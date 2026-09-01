import React, { useState } from 'react';
import type { RwaOffer, DemandDepositRecord } from '../../types';
import { createOffer, acceptOffer } from '../../services/api';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';

interface RwaOfferDeskProps {
  offers: RwaOffer[];
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const RwaOfferDesk: React.FC<RwaOfferDeskProps> = ({ offers, accounts, onRefresh, onNotify }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RwaOffer | null>(null);
  const [buyerAccountId, setBuyerAccountId] = useState(accounts[0]?.account_id || '');
  const [submitting, setSubmitting] = useState(false);

  // New Offer Form
  const [assetSymbol, setAssetSymbol] = useState('USTB');
  const [assetName, setAssetName] = useState('US Treasury 3M Bill (AA+)');
  const [assetAmount, setAssetAmount] = useState('100.00');
  const [pricePerUnit, setPricePerUnit] = useState('914.10');

  const handleAssetSelect = (sym: string) => {
    setAssetSymbol(sym);
    if (sym === 'USTB') {
      setAssetName('US Treasury 3M Bill (AA+)');
      setPricePerUnit('914.10');
    } else if (sym === 'GOLD') {
      setAssetName('LBMA Physical Gold (1 oz Bar)');
      setPricePerUnit('2540.00');
    } else if (sym === 'PROP_ZH') {
      setAssetName('Prime Zurich Commercial Real Estate');
      setPricePerUnit('46.30');
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createOffer({
        seller_principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        seller_legal_name: 'Alice Trading Corp',
        asset_symbol: assetSymbol,
        asset_name: assetName,
        asset_amount: Number(assetAmount).toFixed(2),
        price_per_unit_eur: Number(pricePerUnit).toFixed(2),
      });

      onNotify(`RWA Offer Created! Offer ID: ${res.offer_id}`);
      setShowCreateModal(false);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer || !buyerAccountId) {
      onNotify('Please select payment account', true);
      return;
    }

    setSubmitting(true);
    try {
      await acceptOffer({
        offer_id: selectedOffer.offer_id,
        buyer_principal: 'h64fh-eybaq-aaaaa-aaaaa-cai',
        buyer_account_id: buyerAccountId,
      });

      onNotify(`Atomic DvP Trade Finalized for Offer ${selectedOffer.offer_id}!`);
      setSelectedOffer(null);
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
            <span className="badge badge-active">Institutional P2P Trade Desk</span>
            <span style={{ fontSize: '12px', color: '#606060' }}>Atomic Delivery-versus-Payment (DvP) Orderbook</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>Peer-to-Peer RWA Trade Book</h2>
        </div>

        <button className="btn-accent" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Post RWA Offer (Sell/Offer)
        </button>
      </div>

      {/* Offers Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>Offer ID</th>
              <th style={{ padding: '14px 20px' }}>Offering Entity</th>
              <th style={{ padding: '14px 20px' }}>Asset Offering</th>
              <th style={{ padding: '14px 20px' }}>Quantity</th>
              <th style={{ padding: '14px 20px' }}>Unit Price (EUR)</th>
              <th style={{ padding: '14px 20px' }}>Total Settle Value</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.offer_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{o.offer_id}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 600 }}>{o.seller_legal_name}</div>
                  <code style={{ fontSize: '10px', color: '#888' }}>{o.seller_principal.slice(0, 12)}...</code>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-red">{o.asset_symbol}</span>
                    <span style={{ fontWeight: 600 }}>{o.asset_name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{o.asset_amount} {o.asset_symbol}</td>
                <td style={{ padding: '14px 20px' }}>€{o.price_per_unit_eur}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FF0000' }}>€{o.total_price_eur} EUR</td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${o.status === 'Active' ? 'badge-active' : 'badge-blue'}`}>
                    {o.status === 'Active' ? 'Open Offer' : 'Filled (Settled)'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {o.status === 'Active' ? (
                    <button
                      className="btn-accent"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => {
                        setSelectedOffer(o);
                        setBuyerAccountId(accounts[0]?.account_id || '');
                      }}
                    >
                      <Tag size={13} /> Buy & Settle
                    </button>
                  ) : (
                    <span style={{ color: '#2BA640', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> Settled DvP
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Post Real-World Asset (RWA) Offer</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Create an institutional offer to sell tokenized Government Bonds, Gold, or Real Estate.
            </p>

            <form onSubmit={handleCreateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>RWA Asset Class</label>
                <select value={assetSymbol} onChange={(e) => handleAssetSelect(e.target.value)} className="input-flat">
                  <option value="USTB">US Treasury 3M Bill (AA+ Bond)</option>
                  <option value="GOLD">LBMA Physical Gold (1 oz Bar)</option>
                  <option value="PROP_ZH">Prime Zurich Commercial Real Estate</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Quantity Offering to Sell</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={assetAmount}
                  onChange={(e) => setAssetAmount(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Asking Unit Price (€ EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="input-flat"
                  required
                />
              </div>

              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Gross Settle Value:</span>
                  <b style={{ color: '#FF0000', fontSize: '15px' }}>
                    €{(parseFloat(assetAmount || '0') * parseFloat(pricePerUnit || '0')).toFixed(2)} EUR
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Offer to Orderbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Offer Modal */}
      {selectedOffer && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
              Accept Offer: {selectedOffer.asset_name}
            </h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '20px' }}>
              Execute atomic Delivery-versus-Payment (DvP): Your cash account will be debited €{selectedOffer.total_price_eur} EUR, and {selectedOffer.asset_amount} {selectedOffer.asset_symbol} will be transferred to your portfolio.
            </p>

            <form onSubmit={handleAcceptOffer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Payment Source (Debit Account)</label>
                <select
                  value={buyerAccountId}
                  onChange={(e) => setBuyerAccountId(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedOffer(null)}>Cancel</button>
                <button type="submit" className="btn-accent" disabled={submitting}>
                  {submitting ? 'Settling on ICP...' : 'Confirm Atomic DvP Settlement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
