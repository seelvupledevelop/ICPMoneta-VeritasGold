import React, { useState } from 'react';
import type { DemandDepositRecord, FungibleAssetHolding, MarketRate } from '../../types';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Landmark, Download, FileText, ChevronRight } from 'lucide-react';

interface StitchExecutiveDashboardProps {
  accounts: DemandDepositRecord[];
  holdings: FungibleAssetHolding[];
  rates: MarketRate[];
  onOpenTransfer?: () => void;
  onOpenAudit?: () => void;
  onNotify?: (msg: string, isError?: boolean) => void;
}

export const StitchExecutiveDashboard: React.FC<StitchExecutiveDashboardProps> = ({
  accounts,
  holdings,
  rates: _rates,
  onOpenTransfer,
  onOpenAudit,
  onNotify,
}) => {
  const [activeRange, setActiveRange] = useState<'1H' | '1D' | '1W'>('1D');

  const totalCashEur = accounts.reduce((acc, a) => acc + parseFloat(a.balance.value_str || '0'), 0);
  const goldHolding = holdings.find((h) => h.asset_symbol === 'GOLD');
  const goldOz = goldHolding ? parseFloat(goldHolding.amount.value_str) : 10.0;
  const goldRateEur = 2542.10;
  const ustbRateEur = 914.10;
  const totalAumCalculated = (totalCashEur + goldOz * goldRateEur + 100 * ustbRateEur + 14245680000);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Matching Stitch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Landmark size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              SOVEREIGN WEALTH & CENTRAL DESK
            </h1>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pill-valid" style={{ fontSize: '10px' }}>● Verified Sovereign Node</span>
              <span>ISO 20022 Verified • ICP Canister Suite</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Settlement Finality</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--red-primary)', fontWeight: 700 }}>
            {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
          </div>
        </div>
      </div>

      {/* Top Row: Total AUM & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Total AUM Card */}
        <div className="card card-red-accent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Total Assets Under Management (AUM)
              </span>
              <span className="pill-valid" style={{ fontSize: '10.5px' }}>
                +1.24% 24h
              </span>
            </div>

            <div style={{ fontSize: '40px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em', marginTop: '8px' }}>
              {formatCurrency(totalAumCalculated)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '24px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Physical Gold (ZRH)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: 'var(--red-primary)' }}>$8.42B</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>US Treasury Bills</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>$4.10B</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Digital Assets (ICP)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>$1.20B</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Demand Cash</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>$545.6M</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              if (onOpenTransfer) onOpenTransfer();
              else if (onNotify) onNotify('Navigating to Cross-Border Wire Settlement');
            }}
            className="card card-elevated"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-red)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)' }}>
                <ArrowUpRight size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Initiate Settlement</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ISO 20022 pacs.008 Wire</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--red-primary)" />
          </button>

          <button
            onClick={() => {
              if (onOpenAudit) onOpenAudit();
              else if (onNotify) onNotify('Generating Certified Q3 General Ledger Export');
            }}
            className="card card-elevated"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', textAlign: 'left', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#18141d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Audit Report</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Generate Q3 Ledger Record</div>
              </div>
            </div>
            <Download size={18} color="var(--text-dim)" />
          </button>
        </div>
      </div>

      {/* Middle Row: Gold Price Chart & Live Ledger Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Physical Gold Chart */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d0b10' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--red-primary)' }}>Swiss Physical Gold (XAU / EUR)</h3>
              <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Real-time Feed • Secured Vault ZRH-01</div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {(['1H', '1D', '1W'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '4px',
                    border: activeRange === r ? '1px solid var(--border-red)' : '1px solid var(--border-subtle)',
                    backgroundColor: activeRange === r ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                    color: activeRange === r ? 'var(--red-primary)' : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px', position: 'relative', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {/* SVG Chart Graphic */}
            <svg style={{ width: '100%', height: '180px' }} preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="redChartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.0)" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20 L100,100 L0,100 Z" fill="url(#redChartGrad)" />
              <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="100" cy="20" r="3" fill="#ef4444" />
            </svg>

            <div style={{ position: 'absolute', top: '30px', right: '30px', backgroundColor: '#180d12', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-red)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--red-primary)' }}>
              €2,542.10 / oz
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
              <span>09:00 UTC</span>
              <span>11:00 UTC</span>
              <span>13:00 UTC</span>
              <span>15:00 UTC</span>
              <span>17:00 UTC</span>
            </div>
          </div>
        </div>

        {/* Live Ledger Transactions Feed */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#0d0b10' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Live Settlement Ledger</h3>
          </div>

          <div style={{ padding: '10px 14px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#0e0c12', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowDownLeft size={16} color="var(--green-valid)" />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>IN-XAU-992</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Deposit • Zurich Vault B</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--green-valid)' }}>+500 oz</div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>14:02:11 UTC</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#0e0c12', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpRight size={16} color="var(--red-reject)" />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>OUT-USD-441</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Settlement • FedWire pacs.008</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--red-reject)' }}>-$2,400,000</div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>13:45:00 UTC</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#0e0c12', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} color="var(--red-primary)" />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>INT-BAL-001</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Rebalance • Treasury Sweep</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>€250,000.00</div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>12:30:44 UTC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
