import React, { useState } from 'react';
import type { RwaOffer, DemandDepositRecord } from '../../types';
import { createOffer, acceptOffer } from '../../services/api';
import { Plus, CheckCircle2, ShoppingCart, Wallet } from 'lucide-react';

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
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">Institutional P2P Trade Desk</span>
            <span style={{ fontSize: '11px', color: '#606060' }}>Atomic Delivery-versus-Payment (DvP) Orderbook</span>
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, marginTop: '4px' }}>Peer-to-Peer RWA Trade Book</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px' }}>
            <Wallet size={14} color="#065FD4" />
            <span style={{ color: '#606060' }}>Your Buying Power:</span>
            <b style={{ color: '#2BA640' }}>€{availableBuyingPower} EUR</b>
          </div>

          <button className="btn-accent" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Post Custom Sell Offer
          </button>
        </div>
      </div>

      {/* Visual Summary Cards */}
      <div className="grid-4col" style={{ marginBottom: '20px' }}>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Active Open Offers</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F0F0F', marginTop: '2px' }}>
            {offers.filter((o) => o.status === 'Active').length} Offers
          </div>
          <div style={{ fontSize: '10px', color: '#2BA640', marginTop: '2px' }}>Live Orderbook Depth</div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Physical Gold Offers</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFA000', marginTop: '2px' }}>
            €2,540.00 <span style={{ fontSize: '12px', fontWeight: 500 }}>/ oz</span>
          </div>
          <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>Swiss Vault Backed</div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>US Treasury 3M Bills</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#065FD4', marginTop: '2px' }}>
            €914.10 <span style={{ fontSize: '12px', fontWeight: 500 }}>/ unit</span>
          </div>
          <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>AA+ Sovereign Yield</div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#606060' }}>Settlement Guarantee</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#2BA640', marginTop: '4px' }}>
            Atomic DvP on ICP
          </div>
          <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>Zero Counterparty Risk</div>
        </div>
      </div>

      {/* Offers Orderbook Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Open Real-World Asset (RWA) Offers</h3>
          <span className="badge badge-active" style={{ fontSize: '10px' }}>Instant Settlement</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E5E5', color: '#606060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Offer ID</th>
                <th style={{ padding: '12px 16px' }}>Offering Entity</th>
                <th style={{ padding: '12px 16px' }}>Asset Offering</th>
                <th style={{ padding: '12px 16px' }}>Quantity</th>
                <th style={{ padding: '12px 16px' }}>Unit Price</th>
                <th style={{ padding: '12px 16px' }}>Total Settle Value</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => {
                const isAffordable = parseFloat(o.total_price_eur) <= parseFloat(availableBuyingPower);
                return (
                  <tr key={o.offer_id} style={{ borderBottom: '1px solid #EAEAEA' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{o.offer_id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{o.seller_legal_name}</div>
                      <code style={{ fontSize: '10px', color: '#888' }}>{o.seller_principal.slice(0, 12)}...</code>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-red">{o.asset_symbol}</span>
                        <span style={{ fontWeight: 600 }}>{o.asset_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.asset_amount} {o.asset_symbol}</td>
                    <td style={{ padding: '12px 16px' }}>€{o.price_per_unit_eur}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#FF0000' }}>€{o.total_price_eur} EUR</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${o.status === 'Active' ? 'badge-active' : 'badge-blue'}`}>
                        {o.status === 'Active' ? 'Open Offer' : 'Filled (Settled)'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {o.status === 'Active' ? (
                        <button
                          className={isAffordable ? 'btn-accent' : 'btn-secondary'}
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={() => {
                            setSelectedOffer(o);
                            setBuyerAccountId(accounts[0]?.account_id || '');
                          }}
                        >
                          <ShoppingCart size={13} /> {isAffordable ? 'Buy & Settle' : 'Inspect Offer'}
                        </button>
                      ) : (
                        <span style={{ color: '#2BA640', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Settled DvP
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

      {/* Create Custom Sell Offer Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Post Real-World Asset (RWA) Offer</h3>
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '16px' }}>
              Create a custom institutional offer to sell tokenized Government Bonds, Gold, or Real Estate.
            </p>

            <form onSubmit={handleCreateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Select Asset Class</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button type="button" onClick={() => handleAssetSelect('USTB')} className={`chip ${assetSymbol === 'USTB' ? 'active' : ''}`}>
                    🏛️ US Treasuries (USTB)
                  </button>
                  <button type="button" onClick={() => handleAssetSelect('GOLD')} className={`chip ${assetSymbol === 'GOLD' ? 'active' : ''}`}>
                    🏆 Physical Gold (GOLD)
                  </button>
                  <button type="button" onClick={() => handleAssetSelect('PROP_ZH')} className={`chip ${assetSymbol === 'PROP_ZH' ? 'active' : ''}`}>
                    🏢 Real Estate (PROP_ZH)
                  </button>
                </div>
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
                  <b style={{ color: '#FF0000', fontSize: '14px' }}>
                    €{(parseFloat(assetAmount || '0') * parseFloat(pricePerUnit || '0')).toFixed(2)} EUR
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
            <p style={{ fontSize: '13px', color: '#606060', marginBottom: '16px' }}>
              Execute atomic Delivery-versus-Payment (DvP): Your cash account will be debited €{selectedOffer.total_price_eur} EUR, and {selectedOffer.asset_amount} {selectedOffer.asset_symbol} transferred to your portfolio.
            </p>

            <form onSubmit={handleAcceptOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                      {a.account_id} (€{a.balance.value_str})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Required Settle Amount:</span>
                  <b style={{ color: '#FF0000' }}>€{selectedOffer.total_price_eur} EUR</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E5E5', paddingTop: '6px', marginTop: '4px' }}>
                  <span>Your Available Spending Power:</span>
                  <b style={{ color: parseFloat(selectedOffer.total_price_eur) <= parseFloat(availableBuyingPower) ? '#2BA640' : '#FF0000' }}>
                    €{availableBuyingPower} EUR
                  </b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedOffer(null)}>Cancel</button>
                <button
                  type="submit"
                  className="btn-accent"
                  disabled={submitting || parseFloat(selectedOffer.total_price_eur) > parseFloat(availableBuyingPower)}
                >
                  {submitting ? 'Settling...' : 'Confirm Atomic DvP Settlement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
