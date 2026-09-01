import React, { useState } from 'react';
import type {
  AppSection,
  DemandDepositRecord,
  FungibleAssetHolding,
  PrincipalProfile,
  MarketRate,
  InstitutionalTxn,
  RwaOffer,
  CollateralPosition,
  BondAuction,
  CorporateAction,
  PendingApproval,
  SweepingRule,
  BridgeRoute,
  CanisterStatusInfo,
  LiquidityPool,
  SovereignBondContract,
} from './types';
import {
  transferCash,
  submitAuctionBid,
  executeCorporateAction,
  approveGovernanceItem,
  topUpCanister,
  executeBridgeTransfer,
  createBondContract,
} from './services/api';
import {
  ShieldCheck,
  Fingerprint,
  TrendingUp,
  Landmark,
  ArrowUpRight,
  FileText,
  Download,
  Diamond,
  Zap,
  Radio,
  Gavel,
  Coins,
  UserCheck,
  Activity,
  Bot,
  ArrowLeftRight,
  Cpu,
  Droplets,
  Scale,
  Menu,
  X,
  BatteryCharging,
  BarChart2,
  FileCode2,
} from 'lucide-react';

interface MobileAppPrototypeProps {
  accounts: DemandDepositRecord[];
  holdings: FungibleAssetHolding[];
  identities: PrincipalProfile[];
  rates: MarketRate[];
  transactions: InstitutionalTxn[];
  offers: RwaOffer[];
  collateral: CollateralPosition[];
  auctions: BondAuction[];
  corporateActions: CorporateAction[];
  approvals: PendingApproval[];
  sweepingRules: SweepingRule[];
  bridgeRoutes: BridgeRoute[];
  canisters: CanisterStatusInfo[];
  liquidityPools: LiquidityPool[];
  bondContracts?: SovereignBondContract[];
  onNotify: (msg: string, isError?: boolean) => void;
  onRefresh: () => void;
}

export const MobileAppPrototype: React.FC<MobileAppPrototypeProps> = ({
  accounts,
  holdings: _holdings,
  identities: _identities,
  rates: _rates,
  transactions,
  offers: _offers,
  collateral: _collateral,
  auctions,
  corporateActions,
  approvals,
  sweepingRules,
  bridgeRoutes: _bridgeRoutes,
  canisters,
  liquidityPools,
  bondContracts = [],
  onNotify,
  onRefresh,
}) => {
  const [activeSection, setActiveSection] = useState<AppSection>('portfolio');
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeRange, setActiveRange] = useState<'1H' | '1D' | '1W'>('1D');

  // Transfer state
  const [senderAcc, setSenderAcc] = useState(accounts[0]?.account_id || 'ACC-EUR-ALICE-01');
  const [recipientAcc, setRecipientAcc] = useState(accounts[1]?.account_id || 'ACC-EUR-BOB-02');
  const [transferAmt, setTransferAmt] = useState('250.00');
  const [memo] = useState('Mobile Wire Transfer');
  const [submittingWire, setSubmittingWire] = useState(false);

  // Auction bid state
  const [bidAmount, setBidAmount] = useState('50,000.00');
  const [bidYield, setBidYield] = useState('3.85%');

  // Bridge state
  const [bridgeAmt, setBridgeAmt] = useState('5,000.00');

  // Mobile Bond Maker State
  const [mIsin, setMIsin] = useState('TRT150836T12');
  const [mVolume, setMVolume] = useState('1,000,000,000.00');
  const [mCoupon, setMCoupon] = useState('4.25%');
  const [deployingBond, setDeployingBond] = useState(false);

  const menuSections: { id: AppSection; label: string; icon: any }[] = [
    { id: 'portfolio', label: 'Global AUM', icon: Landmark },
    { id: 'terminal', label: 'RWA Charts', icon: BarChart2 },
    { id: 'contract_maker', label: 'Bond Factory', icon: FileCode2 },
    { id: 'vault', label: 'Markets', icon: Diamond },
    { id: 'trade', label: 'Trade & DvP', icon: TrendingUp },
    { id: 'notaries', label: 'Consensus', icon: ShieldCheck },
    { id: 'auctions', label: 'Auctions', icon: Gavel },
    { id: 'corporate_actions', label: 'Coupons', icon: Coins },
    { id: 'governance', label: 'Multi-Sig', icon: UserCheck },
    { id: 'vault_telemetry', label: 'PoR IoT', icon: Activity },
    { id: 'sweeper', label: 'Sweeper', icon: Bot },
    { id: 'bridge', label: 'Bridge', icon: ArrowLeftRight },
    { id: 'canister_mgmt', label: 'Contracts', icon: Cpu },
    { id: 'liquidity_pools', label: 'AMM Pools', icon: Droplets },
    { id: 'interoperability', label: 'Gold & FX Desk', icon: Coins },
    { id: 'compliance', label: 'Compliance', icon: Scale },
    { id: 'logs', label: 'Audit Logs', icon: FileText },
  ];

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

  const handlePlaceBid = async (auction_id: string) => {
    try {
      const res = await submitAuctionBid({
        auction_id,
        bidder_legal: 'Alice Trading Corp',
        amount_eur: bidAmount,
        bid_yield_pct: bidYield,
      });
      onNotify(`Primary Debt Bid Placed! BidID: ${res.bid_id}`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    }
  };

  const handleDistributeCoupon = async (action_id: string) => {
    try {
      const res = await executeCorporateAction(action_id);
      onNotify(`ACTUS Coupon Payout Settled! €${res.distributed_eur}`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    }
  };

  const handleApproveMultiSig = async (approval_id: string) => {
    try {
      const res = await approveGovernanceItem(approval_id, 'Alice Trading Corp (Senior Treasury)');
      onNotify(`Multi-Sig Signature Verified! Status: ${res.status} (${res.current_signatures}/${res.required_signatures})`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    }
  };

  const handleTopUpCanister = async (canister_id: string) => {
    try {
      const res = await topUpCanister(canister_id, '2.0');
      onNotify(`Canister Top-Up Succeeded! New Balance: ${res.new_cycles_balance}`);
      onRefresh();
    } catch (err: any) {
      onNotify(err.message, true);
    }
  };

  const handleBridgeTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await executeBridgeTransfer({
        source_network: 'Ethereum Mainnet (ERC-20)',
        target_network: 'Internet Computer (Canister UTXO)',
        asset_symbol: 'EURD',
        amount: bridgeAmt,
        recipient_address: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
      });
      onNotify(`Bridge Notarized! TxID: ${res.bridge_tx_id} via Threshold ECDSA`);
    } catch (err: any) {
      onNotify(err.message, true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#060608', color: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      {/* Mobile Safe Area & Notch Clearance Status Bar */}
      <div className="mobile-safe-area-top">
        <span>09:41</span>
        <div style={{ width: '120px' }}>{/* Safe cutout spacing under camera island */}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '9px' }}>5G</span>
          <span style={{ fontSize: '10px' }}>100%</span>
        </div>
      </div>

      {/* Mobile Top App Bar (Clear of Notch/Camera) */}
      <header
        style={{
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#0c0b0e',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }}
          >
            {showDrawer ? <X size={20} color="var(--red-primary)" /> : <Menu size={20} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="var(--red-primary)" />
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              VERITAS <span style={{ color: 'var(--red-primary)', textShadow: '0 0 10px var(--red-glow)' }}>GOLD</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pill-valid" style={{ fontSize: '9px', padding: '2px 6px' }}>● 1,245 TPS</span>
          <button
            onClick={() => onNotify('Biometric Identity Verified (Key: Ed25519-Canister-Master)')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <Fingerprint size={20} />
          </button>
        </div>
      </header>

      {/* Upper 2-Row Responsive Pill Navigation Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(2, 32px)',
          gridAutoFlow: 'column',
          gridAutoColumns: 'max-content',
          gap: '6px',
          padding: '8px 12px',
          backgroundColor: '#0e0c12',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          zIndex: 30,
        }}
      >
        {menuSections.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setShowDrawer(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                height: '30px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: isActive ? 800 : 500,
                backgroundColor: isActive ? 'rgba(239, 68, 68, 0.22)' : '#16121a',
                color: isActive ? 'var(--red-primary)' : 'var(--text-muted)',
                border: `1px solid ${isActive ? 'var(--border-red)' : '#271f28'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={12} color={isActive ? 'var(--red-primary)' : 'var(--text-dim)'} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Slide-out Mobile Menu Drawer */}
      {showDrawer && (
        <div
          className="fade-in"
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            right: 0,
            bottom: '60px',
            backgroundColor: 'rgba(6, 4, 8, 0.96)',
            backdropFilter: 'blur(10px)',
            zIndex: 60,
            padding: '16px 14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--red-primary)', textTransform: 'uppercase', marginBottom: '8px', padding: '0 4px', letterSpacing: '0.05em' }}>
            VERITAS GOLD • CENTRAL DESK MODULES
          </div>

          {menuSections.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setShowDrawer(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#2d0f16' : 'rgba(255,255,255,0.02)',
                  color: isActive ? 'var(--red-primary)' : 'var(--text-main)',
                  border: isActive ? '1px solid var(--border-red)' : '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--red-primary)' : 'var(--text-dim)'} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 74px 12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. GLOBAL AUM */}
        {activeSection === 'portfolio' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="card card-red-accent" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Total Assets Under Management
                </span>
                <span className="pill-valid" style={{ fontSize: '9px' }}>+1.24%</span>
              </div>

              <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                $14,245,680,000.00
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>Physical Gold (ZRH)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--red-primary)' }}>$8.42B</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>US Treasury Bills</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>$4.10B</div>
                </div>
              </div>
            </div>

            {/* Swiss Physical Gold Chart */}
            <div className="card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--red-primary)' }}>Swiss Physical Gold (XAU/EUR)</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['1H', '1D', '1W'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setActiveRange(r)}
                      style={{
                        padding: '2px 6px',
                        fontSize: '9px',
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

              <div style={{ height: '100px', position: 'relative' }}>
                <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="mRedChart2" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
                      <stop offset="100%" stopColor="rgba(239, 68, 68, 0.0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20 L100,100 L0,100 Z" fill="url(#mRedChart2)" />
                  <path d="M0,80 Q10,70 20,75 T40,60 T60,65 T80,40 T100,20" fill="none" stroke="#ef4444" strokeWidth="2" />
                </svg>
                <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--red-primary)' }}>
                  €2,542.10 / oz
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ASSET MARKET & VAULT */}
        {activeSection === 'vault' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>RWA Asset Custody</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>DVP READY</span>
            </div>

            <div className="card" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Diamond size={18} color="var(--red-primary)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>Swiss Physical Gold</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>DTI-GOLD-8821</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--red-primary)' }}>10.00 oz</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>Allocated Zurich Vault</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Landmark size={18} color="var(--text-main)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>US Treasury 3M Bill</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)' }}>DTI-USTB-3312</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>100.00 Units</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>$98,725.00 Value</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TRADE & DVP */}
        {activeSection === 'trade' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Atomic Settlement Desk</h3>
              <span className="pill-red" style={{ fontSize: '9px' }}>pacs.008</span>
            </div>

            <form onSubmit={handleExecuteWire} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>Origin Account</label>
                <select value={senderAcc} onChange={(e) => setSenderAcc(e.target.value)} className="input-dark" style={{ padding: '7px 10px', fontSize: '12px' }}>
                  {accounts.map((a) => (
                    <option key={a.account_id} value={a.account_id}>
                      {a.account_id} (€{a.balance.value_str})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>Destination Account</label>
                <input
                  type="text"
                  value={recipientAcc}
                  onChange={(e) => setRecipientAcc(e.target.value)}
                  className="input-dark"
                  style={{ padding: '7px 10px', fontSize: '12px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>Amount (EUR)</label>
                <input
                  type="text"
                  value={transferAmt}
                  onChange={(e) => setTransferAmt(e.target.value)}
                  className="input-dark"
                  style={{ padding: '7px 10px', fontSize: '12px' }}
                  required
                />
              </div>

              <button type="submit" className="btn-red" style={{ marginTop: '4px', justifyContent: 'center' }} disabled={submittingWire}>
                <Zap size={13} /> {submittingWire ? 'Notarizing...' : 'Execute pacs.008 Wire'}
              </button>
            </form>
          </div>
        )}

        {/* 4. BOND AUCTIONS */}
        {activeSection === 'auctions' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Primary Debt Auctions</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>DUTCH AUCTION</span>
            </div>

            {auctions.map((a) => (
              <div key={a.auction_id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>{a.bond_name}</span>
                  <span className="pill-red" style={{ fontSize: '9px' }}>{a.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Target: <b style={{ color: 'var(--red-primary)' }}>{a.target_yield_pct}</b></span>
                  <span>Issuance: <b>€{a.total_issuance_eur}</b></span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '6px', marginTop: '4px' }}>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="input-dark"
                    placeholder="Amount"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  />
                  <input
                    type="text"
                    value={bidYield}
                    onChange={(e) => setBidYield(e.target.value)}
                    className="input-dark"
                    placeholder="Yield %"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  />
                  <button onClick={() => handlePlaceBid(a.auction_id)} className="btn-red" style={{ padding: '4px 10px', fontSize: '10.5px' }}>
                    Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. COUPON ENGINE */}
        {activeSection === 'corporate_actions' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>ACTUS Coupon Distributions</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>PAM / LAX</span>
            </div>

            {corporateActions.map((ca) => (
              <div key={ca.action_id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>{ca.asset_name}</span>
                  <span className="pill-red" style={{ fontSize: '9px' }}>{ca.status}</span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Payout: <b style={{ color: 'var(--red-primary)' }}>€{ca.total_distributed_eur}</b> ({ca.rate_or_amount_per_unit})
                </div>

                <button
                  onClick={() => handleDistributeCoupon(ca.action_id)}
                  className="btn-red"
                  style={{ marginTop: '4px', padding: '5px', fontSize: '11px', justifyContent: 'center' }}
                  disabled={ca.status === 'Settled'}
                >
                  <Coins size={13} /> {ca.status === 'Settled' ? 'Settled' : 'Execute Auto-Credit Payout'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 6. MAKER-CHECKER MULTI-SIG */}
        {activeSection === 'governance' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Multi-Sig Governance Queue</h3>
              <span className="pill-red" style={{ fontSize: '9px' }}>2-OF-3 QUORUM</span>
            </div>

            {approvals.map((ap) => (
              <div key={ap.approval_id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>{ap.action_type}</span>
                  <span className="pill-red" style={{ fontSize: '9px' }}>{ap.current_signatures}/{ap.required_signatures} Keys</span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Amount: <b style={{ color: 'var(--red-primary)' }}>€{ap.amount_eur}</b>
                </div>

                <button
                  onClick={() => handleApproveMultiSig(ap.approval_id)}
                  className="btn-red"
                  style={{ marginTop: '4px', padding: '5px', fontSize: '11px', justifyContent: 'center' }}
                  disabled={ap.status === 'Approved'}
                >
                  <UserCheck size={13} /> {ap.status === 'Approved' ? 'Approved' : 'Sign as Checker Officer'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 7. DUAL-CUSTODY POR TELEMETRY (ZURICH & HONG KONG) */}
        {activeSection === 'vault_telemetry' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Dual-Custody Bullion Corridors</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>2 VAULTS SYNCED</span>
            </div>

            {/* Vault 1: Zurich */}
            <div className="card card-red-accent" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🇨🇭</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--red-primary)' }}>Zurich Duty-Free Vault (ZRH-01)</span>
                </div>
                <span className="pill-valid" style={{ fontSize: '8.5px' }}>WESTERN HUB</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>15,551.75 kg</div>
                <div style={{ fontSize: '11px', color: 'var(--green-valid)', fontFamily: 'var(--font-mono)' }}>99.992% Density</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '10px', color: 'var(--text-dim)' }}>
                <div>Temp: 18.4 °C (Nominal)</div>
                <div>Merkle: 0x98f4...0f12</div>
              </div>
            </div>

            {/* Vault 2: Hong Kong */}
            <div className="card card-red-accent" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🇭🇰</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>Hong Kong Depository (HKG-01)</span>
                </div>
                <span className="pill-gold" style={{ fontSize: '8.5px' }}>EASTERN HUB</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>12,400.00 kg</div>
                <div style={{ fontSize: '11px', color: 'var(--green-valid)', fontFamily: 'var(--font-mono)' }}>99.995% Density</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '10px', color: 'var(--text-dim)' }}>
                <div>Temp: 19.1 °C (Nominal)</div>
                <div>Merkle: 0x7c3a...e4b1</div>
              </div>
            </div>

            {/* Atomic Cross-Vault Swap Button */}
            <button
              onClick={() => onNotify('Atomic Cross-Vault Swap Succeeded! Rebalanced 200 oz Gold between Zurich and Hong Kong in 380ms!')}
              className="btn-red"
              style={{ justifyContent: 'center', padding: '10px', fontSize: '12px' }}
            >
              <Zap size={14} /> Atomic Cross-Vault Swap (Zurich ⇄ HK)
            </button>
          </div>
        )}

        {/* 8. LIQUIDITY SWEEPER */}
        {activeSection === 'sweeper' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Liquidity Sweeping Rules</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>ACTIVE</span>
            </div>

            {sweepingRules.map((r) => (
              <div key={r.rule_id} className="card" style={{ padding: '12px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>Sweep Excess to {r.target_asset}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Threshold: €{r.threshold_eur}</div>
                <div style={{ fontSize: '10px', color: 'var(--red-primary)', marginTop: '4px' }}>Total Swept: €{r.total_swept_eur}</div>
              </div>
            ))}
          </div>
        )}

        {/* 9. HARMONIX BRIDGE */}
        {activeSection === 'bridge' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Harmonix Chain-Key Bridge</h3>
              <span className="pill-red" style={{ fontSize: '9px' }}>ECDSA</span>
            </div>

            <form onSubmit={handleBridgeTransfer} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>Route</label>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                  Ethereum Mainnet ➔ ICP Canister Suite
                </div>
              </div>

              <div>
                <label style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>Amount (EURD)</label>
                <input
                  type="text"
                  value={bridgeAmt}
                  onChange={(e) => setBridgeAmt(e.target.value)}
                  className="input-dark"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                />
              </div>

              <button type="submit" className="btn-red" style={{ marginTop: '4px', justifyContent: 'center' }}>
                <Zap size={13} /> Notarize Bridge Transfer
              </button>
            </form>
          </div>
        )}

        {/* 10. SMART CONTRACT CANISTERS */}
        {activeSection === 'canister_mgmt' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Canister Orchestration</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>WASM OK</span>
            </div>

            {canisters.map((c) => (
              <div key={c.canister_id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>{c.canister_name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--green-valid)' }}>{c.cycles_balance_tc}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <code style={{ fontSize: '10px', color: 'var(--red-primary)' }}>{c.canister_id.slice(0, 16)}...</code>
                  <button onClick={() => handleTopUpCanister(c.canister_id)} className="btn-red" style={{ padding: '3px 8px', fontSize: '9.5px' }}>
                    <BatteryCharging size={11} /> +2 TC
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 11. WHOLESALE LIQUIDITY POOLS */}
        {activeSection === 'liquidity_pools' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Wholesale AMM Pools</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>€116M+ TVL</span>
            </div>

            {liquidityPools.map((p) => (
              <div key={p.pool_id} className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)' }}>{p.pair_name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--green-valid)' }}>{p.apy_pct} APY</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  <span>TVL: <b>{p.total_liquidity_eur}</b></span>
                  <span>24h Vol: <b style={{ color: 'var(--red-primary)' }}>{p.volume_24h_eur}</b></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RWA CHARTS TERMINAL */}
        {activeSection === 'terminal' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} color="var(--red-primary)" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>RWA Market Charts</h3>
              </div>
              <span className="pill-valid" style={{ fontSize: '8.5px' }}>LIVE TRADINGVIEW</span>
            </div>

            <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Swiss Allocated Gold (1 oz)</div>
                  <div style={{ fontSize: '10px', color: 'var(--red-primary)', fontFamily: 'var(--font-mono)' }}>XAU/EUR • DTI-9B2X-GOLD</div>
                </div>
                <span className="pill-valid" style={{ fontSize: '9px' }}>+1.45%</span>
              </div>

              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                €2,542.10 <span style={{ fontSize: '12px', color: 'var(--red-primary)' }}>EUR</span>
              </div>

              {/* Mobile Interactive Mini-Chart Visualization */}
              <div style={{ height: '70px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                {[35, 45, 40, 60, 55, 75, 88, 70, 95, 100].map((h, i) => (
                  <div
                    key={i}
                    onClick={() => onNotify(`Candle #${i + 1}: €${(2480 + h * 0.62).toFixed(2)} EUR`)}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      backgroundColor: i === 9 ? 'var(--red-primary)' : 'rgba(239, 68, 68, 0.45)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => onNotify('Instant Mobile DvP Trade Initiated on ICP Canister!')}
                className="btn-red"
                style={{ marginTop: '6px', justifyContent: 'center', padding: '8px', fontSize: '11.5px' }}
              >
                <Zap size={13} /> Buy 1 oz Gold on ICP DvP
              </button>
            </div>

            <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>US Treasury 10Y Benchmark</div>
                  <div style={{ fontSize: '10px', color: 'var(--red-primary)', fontFamily: 'var(--font-mono)' }}>USTB-10Y • US91282CDJ71</div>
                </div>
                <span className="pill-valid" style={{ fontSize: '9px' }}>3.85% APY</span>
              </div>

              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                €98.42 <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>EUR</span>
              </div>

              <button
                onClick={() => onNotify('Placed Instant Primary Bid for US Treasury Note!')}
                className="btn-outline"
                style={{ justifyContent: 'center', padding: '7px', fontSize: '11px' }}
              >
                Place Sovereign Bid
              </button>
            </div>
          </div>
        )}

        {/* SOVEREIGN BOND MAKER FACTORY */}
        {activeSection === 'contract_maker' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode2 size={16} color="var(--red-primary)" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Sovereign Bond Maker</h3>
              </div>
              <span className="pill-valid" style={{ fontSize: '8.5px' }}>ACTUS PAM</span>
            </div>

            <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '9.5px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  ISIN Code
                </label>
                <input
                  type="text"
                  value={mIsin}
                  onChange={(e) => setMIsin(e.target.value)}
                  className="input-dark"
                  style={{ width: '100%', padding: '6px 8px', fontSize: '11.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '9.5px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Notional Volume
                  </label>
                  <input
                    type="text"
                    value={mVolume}
                    onChange={(e) => setMVolume(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '6px 8px', fontSize: '11.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '9.5px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Coupon %
                  </label>
                  <input
                    type="text"
                    value={mCoupon}
                    onChange={(e) => setMCoupon(e.target.value)}
                    className="input-dark"
                    style={{ width: '100%', padding: '6px 8px', fontSize: '11.5px' }}
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  setDeployingBond(true);
                  try {
                    await createBondContract({
                      issuer_name: 'Central Bank of the Republic of Turkey (CBRT)',
                      issuer_principal: 'cbrt1-gibai-aaaaa-aaaaa-cai',
                      isin_code: mIsin,
                      dti_code: 'DTI-TRY-BOND-10Y',
                      currency: 'EURD',
                      notional_volume_eur: mVolume,
                      coupon_rate_pct: mCoupon,
                      coupon_frequency: 'Semi-Annual',
                      actus_contract_type: 'Principal At Maturity (PAM)',
                      maturity_date: '2036-08-15',
                      auction_mechanism: 'Uniform-Price Dutch Auction',
                      collateral_backing: 'Dual Sovereign Guarantee + LBMA Gold',
                    });
                    onNotify(`Mobile Bond Canister Deployed! ISIN: ${mIsin}`);
                    onRefresh();
                  } catch (err: any) {
                    onNotify(err.message, true);
                  } finally {
                    setDeployingBond(false);
                  }
                }}
                className="btn-red"
                style={{ marginTop: '4px', justifyContent: 'center', padding: '8px', fontSize: '11.5px' }}
                disabled={deployingBond}
              >
                <Zap size={13} /> {deployingBond ? 'Deploying...' : 'Deploy Bond Canister'}
              </button>
            </div>

            {/* Existing Bond Contracts on Mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Active Bond Canisters ({bondContracts.length})
              </div>
              {bondContracts.map((b) => (
                <div key={b.contract_id} className="card" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#FFFFFF' }}>{b.contract_id}</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      ISIN: {b.isin_code} • {b.coupon_rate_pct}
                    </div>
                  </div>
                  <span className="pill-valid" style={{ fontSize: '8.5px' }}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. GOLD & FX CORRIDOR RATES DESK */}
        {activeSection === 'interoperability' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Coins size={16} color="var(--red-primary)" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Gold & FX Corridor Desk</h3>
              </div>
              <span className="pill-valid" style={{ fontSize: '8.5px' }}>ECB / LBMA FEED</span>
            </div>

            {/* Central Bank Corridor Switchers */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {[
                { name: 'Turkey (CBRT)', flag: '🇹🇷', rate: '€2,542.10 / oz' },
                { name: 'Swiss (SNB)', flag: '🇨🇭', rate: '0.9620 CHF/EUR' },
                { name: 'Hong Kong (HKMA)', flag: '🇭🇰', rate: '8.45 HKD/EUR' },
                { name: 'Federal Reserve', flag: '🇺🇸', rate: '1.0955 USD/EUR' },
              ].map((cb, idx) => (
                <div
                  key={idx}
                  onClick={() => onNotify(`Active Sovereign Corridor: ${cb.name} (${cb.rate})`)}
                  className="card"
                  style={{
                    padding: '8px 12px',
                    minWidth: '130px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>{cb.flag} {cb.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--red-primary)', fontFamily: 'var(--font-mono)' }}>{cb.rate}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>Instant FX Settlement Request</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Pair: <b>EURD / USDD</b></span>
                <span>Rate: <b style={{ color: 'var(--green-valid)' }}>1.0955</b></span>
              </div>
              <button
                onClick={() => onNotify('Instant FX Corridor DvP Transfer executed on ICP!')}
                className="btn-red"
                style={{ marginTop: '4px', justifyContent: 'center', padding: '8px', fontSize: '11.5px' }}
              >
                <Zap size={13} /> Settle Corridor Swap
              </button>
            </div>
          </div>
        )}

        {/* 13. AUDIT LOGS */}
        {activeSection === 'logs' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Audit & General Ledger</h3>
              <a href="/api/v1/reporting/export/csv" className="btn-outline-red" style={{ padding: '3px 8px', fontSize: '10px' }}>
                <Download size={11} /> CSV
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.map((t) => (
                <div key={t.txn_id} className="card" style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '11px', fontWeight: 700, color: 'var(--red-primary)' }}>{t.txn_id}</code>
                    <span className="pill-valid" style={{ fontSize: '9px' }}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#fff', marginTop: '3px' }}>
                    {t.amount} {t.currency} • {t.txn_type}
                  </div>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', marginTop: '2px' }}>{t.booking_date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. CONSENSUS NOTARIES */}
        {activeSection === 'notaries' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>Consensus Telemetry</h3>
              <span className="pill-valid" style={{ fontSize: '9px' }}>4/5 NODES</span>
            </div>

            <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
              <Radio size={22} color="var(--red-primary)" className="pulse-glow" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--red-primary)' }}>0.4s Finality</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Throughput: 1,245 TPS • Leader: Node Zurich Alpha</div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Quick Navigation Tabs */}
      <nav
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
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
          onClick={() => setActiveSection('portfolio')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeSection === 'portfolio' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <Landmark size={15} color={activeSection === 'portfolio' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '8.5px', fontWeight: activeSection === 'portfolio' ? 800 : 500 }}>AUM</span>
        </button>

        <button
          onClick={() => setActiveSection('terminal')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeSection === 'terminal' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <BarChart2 size={15} color={activeSection === 'terminal' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '8.5px', fontWeight: activeSection === 'terminal' ? 800 : 500 }}>Charts</span>
        </button>

        <button
          onClick={() => setActiveSection('contract_maker')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeSection === 'contract_maker' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <FileCode2 size={15} color={activeSection === 'contract_maker' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '8.5px', fontWeight: activeSection === 'contract_maker' ? 800 : 500 }}>Factory</span>
        </button>

        <button
          onClick={() => setActiveSection('trade')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeSection === 'trade' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <ArrowUpRight size={15} color={activeSection === 'trade' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '8.5px', fontWeight: activeSection === 'trade' ? 800 : 500 }}>DvP Trade</span>
        </button>

        <button
          onClick={() => setActiveSection('auctions')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: activeSection === 'auctions' ? 'var(--red-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <Gavel size={15} color={activeSection === 'auctions' ? 'var(--red-primary)' : 'var(--text-dim)'} />
          <span style={{ fontSize: '8.5px', fontWeight: activeSection === 'auctions' ? 800 : 500 }}>Auctions</span>
        </button>
      </nav>
    </div>
  );
};
