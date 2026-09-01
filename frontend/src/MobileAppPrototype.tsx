import React, { useState } from 'react';
import type {
  DemandDepositRecord,
  FungibleAssetHolding,
  MarketRate,
  InstitutionalTxn,
  RwaOffer,
} from './types';
import { transferCash } from './services/api';
import {
  ShieldCheck,
  Fingerprint,
  TrendingUp,
  Landmark,
  ArrowUpRight,
  FileText,
  Download,
  Diamond,
  Building,
  Zap,
  Radio,
} from 'lucide-react';

interface MobileAppPrototypeProps {
  accounts: DemandDepositRecord[];
  holdings: FungibleAssetHolding[];
  rates: MarketRate[];
  transactions: InstitutionalTxn[];
  offers: RwaOffer[];
  onNotify: (msg: string, isError?: boolean) => void;
  onRefresh: () => void;
}

export const MobileAppPrototype: React.FC<MobileAppPrototypeProps> = ({
  accounts,
  holdings: _holdings,
  rates: _rates,
  transactions,
  offers: _offers,
  onNotify,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'aum' | 'markets' | 'settlement' | 'reporting' | 'consensus'>('aum');
  const [activeRange, setActiveRange] = useState<'1H' | '1D' | '1W'>('1D');

  // Transfer state
  const [senderAcc, setSenderAcc] = useState(accounts[0]?.account_id || 'ACC-EUR-ALICE-01');
  const [recipientAcc, setRecipientAcc] = useState(accounts[1]?.account_id || 'ACC-EUR-BOB-02');
  const [transferAmt, setTransferAmt] = useState('250.00');
  const [memo, setMemo] = useState('Mobile Sovereign Settlement');
  const [submittingWire, setSubmittingWire] = useState(false);

  const handleExecuteWire = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingWire(true);
    try {
      const res = await transferCash({
        sender_id: senderAcc,
        recipient_id: recipientAcc,
        amount: transferAmt,
        memo,
        gl_code: '1010-01',
      });
      onNotify(`Settlement Finalized! TxID: ${res.txn_id} (pacs.008 on-chain)`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    } finally {
      setSubmittingWire(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#060608', color: '#f8fafc', position: 'relative' }}>
      {/* Mobile Top App Bar */}
      <header
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#0c0b0e',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--red-primary)" />
          <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--red-primary)', letterSpacing: '-0.02em' }}>
            SOVEREIGN
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill-valid" style={{ fontSize: '9px', padding: '2px 6px' }}>● LIVE</span>
          <button
            onClick={() => onNotify('Biometric Identity Verified (Key: Ed25519-Canister-Master)')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <Fingerprint size={20} />
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 74px 14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* TAB 1: GLOBAL AUM DASHBOARD */}
        {activeTab === 'aum' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Total AUM Card */}
            <div className="card card-red-accent" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total Assets Under Management
                </span>
                <span className="pill-valid" style={{ fontSize: '9.5px' }}>+1.24%</span>
              </div>

              <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px', letterSpacing: '-0.02em' }}>
                $14,245,680,000.00
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>Physical Gold (ZRH)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--red-primary)' }}>$8.42B</div>
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>US Treasury Bills</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>$4.10B</div>
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>Digital Assets (ICP)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>$1.20B</div>
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>Demand Cash</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>$545.6M</div>
                </div>
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('settlement')}
                className="card card-elevated"
                style={{ padding: '14px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-red)' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)', marginBottom: '8px' }}>
                  <ArrowUpRight size={16} />
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>Initiate Settlement</div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>pacs.008 Wire</div>
              </button>

              <button
                onClick={() => setActiveTab('reporting')}
                className="card card-elevated"
                style={{ padding: '14px', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#16121a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <FileText size={16} />
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>Audit Report</div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>Q3 Export</div>
              </button>
            </div>

            {/* Swiss Physical Gold Chart */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--red-primary)' }}>Swiss Physical Gold</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>ZRH-01 Vault • Real-time</div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['1H', '1D', '1W'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setActiveRange(r)}
                      style={{
                        padding: '2px 6px',
                        fontSize: '9.5px',
                        borderRadius: '3px',
                        backgroundColor: activeRange === r ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                        color: activeRange === r ? 'var(--red-primary)' : 'var(--text-dim)',
                        border: 'none',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: '110px', position: 'relative' }}>
                <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="mRedChart" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
                      <stop offset="100%" stopColor="rgba(239, 68, 68, 0.0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20 L100,100 L0,100 Z" fill="url(#mRedChart)" />
                  <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20" fill="none" stroke="#ef4444" strokeWidth="2" />
                </svg>
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--red-primary)' }}>
                  €2,542.10 / oz
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MARKETS (Stitch Screen: bb61b9e027954c92b3b906d9fe9384aa) */}
        {activeTab === 'markets' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>Institutional Asset Market</h2>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>RWA TOKENIZATION TERMINAL</div>
              </div>
              <span className="pill-valid" style={{ fontSize: '9px' }}>DVP ACTIVE</span>
            </div>

            {/* Asset Card 1: Gold */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Diamond size={18} color="var(--red-primary)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>Allocated Swiss Gold</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TICKER: XAU-CH</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--red-primary)' }}>$64,230.50</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--green-valid)' }}>+1.24%</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '12px', fontSize: '11px' }}>
                <span>BID: <b style={{ fontFamily: 'var(--font-mono)' }}>$64,228.00</b></span>
                <span>ASK: <b style={{ fontFamily: 'var(--font-mono)' }}>$64,232.00</b></span>
                <button
                  onClick={() => {
                    setActiveTab('settlement');
                    onNotify('Selected XAU-CH for DvP Settlement');
                  }}
                  className="btn-red"
                  style={{ padding: '3px 10px', fontSize: '10px' }}
                >
                  TRADE
                </button>
              </div>
            </div>

            {/* Asset Card 2: US Treasury */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Landmark size={18} color="var(--text-main)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>US Treasury 3M Bill</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>ISIN: US912797JN32</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>5.32%</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--red-primary)' }}>-0.02 bps</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '12px', fontSize: '11px' }}>
                <span>BID: <b style={{ fontFamily: 'var(--font-mono)' }}>5.33%</b></span>
                <span>ASK: <b style={{ fontFamily: 'var(--font-mono)' }}>5.31%</b></span>
                <button
                  onClick={() => {
                    setActiveTab('settlement');
                    onNotify('Selected UST-3M for DvP Settlement');
                  }}
                  className="btn-outline-red"
                  style={{ padding: '3px 10px', fontSize: '10px' }}
                >
                  TRADE
                </button>
              </div>
            </div>

            {/* Asset Card 3: Real Estate */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>Prime Zurich RE Fund</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TICKER: PROP-ZH</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>$104.20</div>
                  <div style={{ fontSize: '9.5px', color: 'var(--green-valid)' }}>+0.15%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTLEMENT (Stitch Screen: 6518f733fdba44d5b2b99367ee373edc) */}
        {activeTab === 'settlement' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>P2P Settlement Desk</h2>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>ISO 20022 pacs.008 Wire Form</div>
              </div>
              <span className="pill-red">● Canister Notary</span>
            </div>

            <form onSubmit={handleExecuteWire} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Origin Account</label>
                <select value={senderAcc} onChange={(e) => setSenderAcc(e.target.value)} className="input-dark">
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (€{a.balance.value_str} {a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Destination Account</label>
                <input
                  type="text"
                  value={recipientAcc}
                  onChange={(e) => setRecipientAcc(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Settlement Amount (EUR)</label>
                <input
                  type="text"
                  value={transferAmt}
                  onChange={(e) => setTransferAmt(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Payment Memo / pacs.008 Reason</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="input-dark"
                />
              </div>

              <button type="submit" className="btn-red" style={{ marginTop: '6px', justifyContent: 'center' }} disabled={submittingWire}>
                <Zap size={14} /> {submittingWire ? 'Notarizing via Raft...' : 'Execute pacs.008 Wire'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: REPORTING & AUDIT (Stitch Screen: 0ea6a597cf764b03a0c990ecf4fd960c) */}
        {activeTab === 'reporting' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>Audit & General Ledger</h2>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>Double-Entry Journal & ERP Sync</div>
              </div>
              <a href="/api/v1/reporting/export/csv" className="btn-outline-red" style={{ padding: '4px 8px', fontSize: '10.5px' }}>
                <Download size={12} /> CSV Export
              </a>
            </div>

            <div className="card" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.map((t) => (
                <div key={t.txn_id} style={{ padding: '10px', backgroundColor: '#0e0c12', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red-primary)' }}>{t.txn_id}</code>
                    <span className="pill-valid" style={{ fontSize: '9px' }}>● {t.status}</span>
                  </div>

                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                    {t.amount} {t.currency} • {t.txn_type}
                  </div>

                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {t.booking_date} | GL: {t.gl_code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONSENSUS */}
        {activeTab === 'consensus' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>Consensus Telemetry</h2>
              <span className="pill-valid" style={{ fontSize: '9px' }}>4/5 NODES ACTIVE</span>
            </div>

            <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
              <Radio size={24} color="var(--red-primary)" className="pulse-glow" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--red-primary)' }}>0.4s Finality</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Throughput: 1,245 TPS • Leader: Node Zurich Alpha</div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Stitch Mobile Bottom Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#0c0b0e',
          borderTop: '1px solid var(--border-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 50,
          padding: '0 4px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.9)',
        }}
      >
        <button
          onClick={() => setActiveTab('aum')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'aum' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <TrendingUp size={16} color={activeTab === 'aum' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '9px', fontWeight: activeTab === 'aum' ? 800 : 500 }}>Global AUM</span>
        </button>

        <button
          onClick={() => setActiveTab('markets')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'markets' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <Diamond size={16} color={activeTab === 'markets' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '9px', fontWeight: activeTab === 'markets' ? 800 : 500 }}>Markets</span>
        </button>

        <button
          onClick={() => setActiveTab('settlement')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'settlement' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <ArrowUpRight size={16} color={activeTab === 'settlement' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '9px', fontWeight: activeTab === 'settlement' ? 800 : 500 }}>Settlement</span>
        </button>

        <button
          onClick={() => setActiveTab('reporting')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'reporting' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <FileText size={16} color={activeTab === 'reporting' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '9px', fontWeight: activeTab === 'reporting' ? 800 : 500 }}>Reporting</span>
        </button>

        <button
          onClick={() => setActiveTab('consensus')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeTab === 'consensus' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <Radio size={16} color={activeTab === 'consensus' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '9px', fontWeight: activeTab === 'consensus' ? 800 : 500 }}>Consensus</span>
        </button>
      </nav>
    </div>
  );
};
