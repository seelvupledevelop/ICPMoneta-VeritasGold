import React, { useState } from 'react';
import type { RwaOffer, DemandDepositRecord } from '../../types';
import { createOffer, acceptOffer } from '../../services/api';
import { Plus, CheckCircle2, ShoppingCart, Wallet, TrendingUp } from 'lucide-react';

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
  const [assetAmount, setAssetAmount] = useState('2.00');
  const [pricePerUnit, setPricePerUnit] = useState('914.10');

  const activeAccount = accounts.find((a) => a.account_id === buyerAccountId) || accounts[0];
  const balanceNum = activeAccount ? parseFloat(activeAccount.balance.value_str) : 0;
  const overdraftNum = activeAccount ? parseFloat(activeAccount.overdraft_limit.value_str) : 0;
  const availableBuyingPower = (balanceNum + overdraftNum).toFixed(2);

  const handleAssetSelect = (sym: string) => {
    setAssetSymbol(sym);
    if (sym === 'USTB') {
      setAssetName('US Treasury 3M Bill (AA+)');
      setPricePerUnit('914.10');
      setAssetAmount('2.00');
    } else if (sym === 'GOLD') {
      setAssetName('LBMA Physical Gold (1 oz Bar)');
      setPricePerUnit('2540.00');
      setAssetAmount('1.00');
    } else if (sym === 'PROP_ZH') {
      setAssetName('Prime Zurich Commercial Real Estate');
      setPricePerUnit('46.30');
      setAssetAmount('10.00');
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

    const offerCost = parseFloat(selectedOffer.total_price_eur);
    if (offerCost > parseFloat(availableBuyingPower)) {
      onNotify(`Insufficient spending power (€${availableBuyingPower} EUR) for this offer (€${selectedOffer.total_price_eur} EUR)`, true);
      return;
    }

    setSubmitting(true);
    try {
      await acceptOffer({
        offer_id: selectedOffer.offer_id,
        buyer_principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            P2P RWA Orderbook Desk
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Bilateral institutional orderbook with 1-click Atomic Delivery-versus-Payment (DvP).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#09101f', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px' }}>
            <Wallet size={14} color="var(--cyan-primary)" />
            <span style={{ color: 'var(--text-muted)' }}>Buying Power:</span>
            <b style={{ color: 'var(--green-valid)' }}>€{availableBuyingPower} EUR</b>
          </div>

          <button className="btn-cyan" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Post Sell Offer
          </button>
        </div>
      </div>

      {/* Offers Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Open Real-World Asset (RWA) Offers
            </h3>
          </div>
          <span className="pill-valid">● Zero Counterparty Risk</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Offer ID</th>
                <th style={{ padding: '12px 18px' }}>Seller Entity</th>
                <th style={{ padding: '12px 18px' }}>Asset Offering</th>
                <th style={{ padding: '12px 18px' }}>Quantity</th>
                <th style={{ padding: '12px 18px' }}>Unit Price</th>
                <th style={{ padding: '12px 18px' }}>Total Settle</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => {
                const isAffordable = parseFloat(o.total_price_eur) <= parseFloat(availableBuyingPower);
                return (
                  <tr key={o.offer_id} style={{ borderBottom: '1px solid #131f36' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                      {o.offer_id}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{o.seller_legal_name}</div>
                      <code style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{o.seller_principal.slice(0, 12)}...</code>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="pill-cyan">{o.asset_symbol}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{o.asset_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-main)' }}>{o.asset_amount} {o.asset_symbol}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>€{o.price_per_unit_eur}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff' }}>€{o.total_price_eur} EUR</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`pill-${o.status === 'Active' ? 'valid' : 'cyan'}`}>
                        {o.status === 'Active' ? '● Open Offer' : 'Settled DvP'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {o.status === 'Active' ? (
                        <button
                          className={isAffordable ? 'btn-cyan' : 'btn-outline'}
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={() => {
                            setSelectedOffer(o);
                            setBuyerAccountId(accounts[0]?.account_id || '');
                          }}
                        >
                          <ShoppingCart size={13} /> {isAffordable ? 'Buy & Settle' : 'Inspect'}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--green-valid)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Post Custom RWA Sell Offer
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Create an institutional offer to sell tokenized US Treasuries, Gold, or Real Estate.
            </p>

            <form onSubmit={handleCreateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '6px', display: 'block' }}>Select Asset Class</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => handleAssetSelect('USTB')} className={`pill-cyan`} style={{ cursor: 'pointer', opacity: assetSymbol === 'USTB' ? 1 : 0.5 }}>
                    🏛️ US Treasuries
                  </button>
                  <button type="button" onClick={() => handleAssetSelect('GOLD')} className={`pill-cyan`} style={{ cursor: 'pointer', opacity: assetSymbol === 'GOLD' ? 1 : 0.5 }}>
                    🏆 Physical Gold
                  </button>
                  <button type="button" onClick={() => handleAssetSelect('PROP_ZH')} className={`pill-cyan`} style={{ cursor: 'pointer', opacity: assetSymbol === 'PROP_ZH' ? 1 : 0.5 }}>
                    🏢 Real Estate
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Quantity to Sell</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={assetAmount}
                  onChange={(e) => setAssetAmount(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Asking Unit Price (€ EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Settle Value:</span>
                  <b style={{ color: 'var(--cyan-primary)', fontSize: '15px' }}>
                    €{(parseFloat(assetAmount || '0') * parseFloat(pricePerUnit || '0')).toFixed(2)} EUR
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish to Orderbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {selectedOffer && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Execute Atomic DvP: {selectedOffer.asset_name}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Simultaneously debit cash €{selectedOffer.total_price_eur} EUR and transfer {selectedOffer.asset_amount} {selectedOffer.asset_symbol} with zero counterparty default risk.
            </p>

            <form onSubmit={handleAcceptOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Payment Source (Debit Account)</label>
                <select
                  value={buyerAccountId}
                  onChange={(e) => setBuyerAccountId(e.target.value)}
                  className="input-dark"
                  required
                >
                  <option value="">Select Cash Account...</option>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (€{a.balance.value_str})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Required Settle Amount:</span>
                  <b style={{ color: '#ffffff' }}>€{selectedOffer.total_price_eur} EUR</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Available Buying Power:</span>
                  <b style={{ color: parseFloat(selectedOffer.total_price_eur) <= parseFloat(availableBuyingPower) ? 'var(--green-valid)' : 'var(--red-reject)' }}>
                    €{availableBuyingPower} EUR
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setSelectedOffer(null)}>Cancel</button>
                <button
                  type="submit"
                  className="btn-cyan"
                  disabled={submitting || parseFloat(selectedOffer.total_price_eur) > parseFloat(availableBuyingPower)}
                >
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
