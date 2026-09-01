import React, { useState } from 'react';
import type { BondAuction } from '../../types';
import { submitAuctionBid } from '../../services/api';
import { Gavel, CheckCircle2 } from 'lucide-react';

interface BondAuctionDeskProps {
  auctions: BondAuction[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const BondAuctionDesk: React.FC<BondAuctionDeskProps> = ({ auctions, onRefresh, onNotify }) => {
  const [selectedAuction, setSelectedAuction] = useState<BondAuction | null>(null);
  const [bidAmount, setBidAmount] = useState('500,000.00');
  const [bidYield, setBidYield] = useState('3.84');
  const [submitting, setSubmitting] = useState(false);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    setSubmitting(true);
    try {
      const res = await submitAuctionBid({
        auction_id: selectedAuction.auction_id,
        bidder_legal: 'Alice Trading Corp (Zurich)',
        amount_eur: bidAmount,
        bid_yield_pct: `${bidYield}%`,
      });

      onNotify(`Competitive Auction Bid Placed! Bid ID: ${res.bid_id} at ${res.bid_yield_pct}`);
      setSelectedAuction(null);
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
            Sovereign Primary Bond Auction Desk
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Primary market multi-price and Dutch auction bidding for sovereign debt and treasury bills.
          </p>
        </div>

        <span className="pill-valid">● sese.023 Primary Issuance</span>
      </div>

      {/* Yield Curve Preview Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'linear-gradient(135deg, #0e172a 0%, #070c14 100%)' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--cyan-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            SOVEREIGN BENCHMARK YIELD CURVE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
            US 3M: <span style={{ color: 'var(--cyan-primary)' }}>3.85%</span> | CH 2Y: <span style={{ color: 'var(--green-valid)' }}>1.25%</span> | EU 10Y: <span style={{ color: 'var(--amber-warning)' }}>2.45%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="pill-cyan">Competitive Auction</span>
          <span className="pill-valid">Instant DvP Allotment</span>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gavel size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              Live Sovereign Bond Auctions
            </h3>
          </div>
          <span className="pill-cyan">ACTUS PAM Standard</span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#09101f', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '10.5px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Auction ID</th>
                <th style={{ padding: '12px 18px' }}>Issuing Agency</th>
                <th style={{ padding: '12px 18px' }}>Debt Instrument</th>
                <th style={{ padding: '12px 18px' }}>Issuance Volume</th>
                <th style={{ padding: '12px 18px' }}>Target Yield</th>
                <th style={{ padding: '12px 18px' }}>Cutoff Yield</th>
                <th style={{ padding: '12px 18px' }}>Bids Count</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a) => {
                const isOpen = a.status === 'Open_Bidding';
                return (
                  <tr key={a.auction_id} style={{ borderBottom: '1px solid #131f36' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                      {a.auction_id}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {a.issuer_legal}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{a.bond_name}</div>
                      <code style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{a.bond_symbol} • Maturity: {a.maturity_date}</code>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#ffffff' }}>€{a.total_issuance_eur}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--cyan-primary)', fontWeight: 700 }}>{a.target_yield_pct}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--amber-warning)', fontWeight: 700 }}>{a.cutoff_yield_pct}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{a.bids_count} Bids</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`pill-${isOpen ? 'valid' : 'cyan'}`}>
                        {isOpen ? '● Bidding Open' : 'Allocated & Closed'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      {isOpen ? (
                        <button
                          className="btn-cyan"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={() => setSelectedAuction(a)}
                        >
                          <Gavel size={13} /> Submit Bid
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

      {/* Bid Modal */}
      {selectedAuction && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Submit Competitive Bid: {selectedAuction.bond_name}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Primary auction order allocation with atomic Delivery-versus-Payment (DvP) on the Internet Computer.
            </p>

            <form onSubmit={handleBidSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Bidding Legal Entity</label>
                <input className="input-dark" value="Alice Trading Corp (Zurich Clearing Principal)" readOnly />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Bid Amount (€ EUR)</label>
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Target Competitive Yield (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bidYield}
                  onChange={(e) => setBidYield(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div style={{ backgroundColor: '#09101f', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Benchmark Target Yield:</span>
                  <b style={{ color: 'var(--cyan-primary)' }}>{selectedAuction.target_yield_pct}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Allotment Cutoff Yield:</span>
                  <b style={{ color: 'var(--amber-warning)' }}>{selectedAuction.cutoff_yield_pct}</b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setSelectedAuction(null)}>Cancel</button>
                <button type="submit" className="btn-cyan" disabled={submitting}>
                  {submitting ? 'Submitting to Auction...' : 'Confirm & Submit Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
