import React, { useState, useEffect } from 'react';
import type { DemandDepositRecord, MarketRate } from '../../types';
import { executeRfqTrade } from '../../services/api';
import { Zap, Clock } from 'lucide-react';

interface RfqTradeDeskProps {
  rates: MarketRate[];
  accounts: DemandDepositRecord[];
  onRefresh: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const RfqTradeDesk: React.FC<RfqTradeDeskProps> = ({ rates, accounts, onRefresh, onNotify }) => {
  const [targetAsset, setTargetAsset] = useState('GOLD');
  const [quantity, setQuantity] = useState('2.5');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.account_id || '');
  const [activeQuote, setActiveQuote] = useState<{
    quoteId: string;
    rateEur: string;
    totalEur: string;
    spread: string;
    expiresIn: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedRate = rates.find((r) => r.symbol === targetAsset) || rates[0];

  useEffect(() => {
    let timer: any;
    if (activeQuote && activeQuote.expiresIn > 0) {
      timer = setInterval(() => {
        setActiveQuote((prev) => (prev && prev.expiresIn > 1 ? { ...prev, expiresIn: prev.expiresIn - 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuote]);

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRate) return;

    const rate = parseFloat(selectedRate.price_eur);
    const qty = parseFloat(quantity || '1');
    const total = (rate * qty).toFixed(2);

    setActiveQuote({
      quoteId: `RFQ-${Math.floor(100000 + Math.random() * 900000)}`,
      rateEur: rate.toFixed(2),
      totalEur: total,
      spread: '0.015% (Institutional Tight)',
      expiresIn: 15,
    });
    onNotify(`Generated Executable Quote for ${quantity} ${targetAsset}!`);
  };

  const handleExecuteQuote = async () => {
    if (!activeQuote || !selectedAccount) {
      onNotify('Please select payment account', true);
      return;
    }

    setSubmitting(true);
    try {
      await executeRfqTrade({
        account_id: selectedAccount,
        buyer_principal: 'lpmt4-wqbam-aaaaa-aaaaa-cai',
        asset_symbol: targetAsset,
        asset_amount: Number(quantity).toFixed(2),
        cash_amount: activeQuote.totalEur,
      });

      onNotify(`DvP Trade Finalized! Bought ${quantity} ${targetAsset} for €${activeQuote.totalEur}`);
      setActiveQuote(null);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-red">Institutional RFQ Desk</span>
          <span style={{ fontSize: '11px', color: '#606060' }}>Automated Request-for-Quote</span>
        </div>
        <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, marginTop: '4px' }}>Request for Quote (RFQ) Trade Desk</h2>
      </div>

      <div className="grid-2col">
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#FF0000" /> Create Instant RFQ Order
          </h3>

          <form onSubmit={handleRequestQuote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Target Real-World Asset</label>
              <select
                value={targetAsset}
                onChange={(e) => {
                  setTargetAsset(e.target.value);
                  setActiveQuote(null);
                }}
                className="input-flat"
              >
                {rates.map((r) => (
                  <option key={r.symbol} value={r.symbol}>
                    {r.name} ({r.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Quantity to Purchase</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setActiveQuote(null);
                }}
                className="input-flat"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Settlement Cash Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="input-flat"
                required
              >
                {accounts.map((a) => (
                  <option key={a.account_id} value={a.account_id}>
                    {a.account_id} (€{a.balance.value_str})
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-accent" style={{ justifyContent: 'center', marginTop: '6px' }}>
              <Zap size={16} /> Request Guaranteed Quote
            </button>
          </form>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: activeQuote ? '2px solid #2BA640' : '1px solid #E5E5E5' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Executable Quote Status</h3>
              {activeQuote ? (
                <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Valid for {activeQuote.expiresIn}s
                </span>
              ) : (
                <span className="badge" style={{ backgroundColor: '#F2F2F2', color: '#606060' }}>Awaiting Request</span>
              )}
            </div>

            {activeQuote ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#606060' }}>Quote Reference ID</div>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}>{activeQuote.quoteId}</code>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#606060' }}>Unit Rate:</span>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>€{activeQuote.rateEur} EUR</div>
                  </div>
                  <div>
                    <span style={{ color: '#606060' }}>Spread:</span>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#2BA640', marginTop: '2px' }}>{activeQuote.spread}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#FF0000', fontWeight: 600 }}>Total Cash Debit</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#FF0000' }}>€{activeQuote.totalEur} EUR</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#606060' }}>You Receive</div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{quantity} {targetAsset}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: '#888' }}>
                <Clock size={32} style={{ margin: '0 auto 10px', color: '#CCC' }} />
                <p style={{ fontSize: '12px' }}>Select an asset and submit the form to receive an atomic guaranteed price quote.</p>
              </div>
            )}
          </div>

          {activeQuote && (
            <button
              className="btn-accent"
              style={{ width: '100%', justifyContent: 'center', marginTop: '14px', backgroundColor: '#2BA640' }}
              onClick={handleExecuteQuote}
              disabled={submitting}
            >
              {submitting ? 'Executing DvP...' : 'Accept Quote & Settle on ICP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
