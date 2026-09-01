import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  BarChart2,
  FileCode2,
  Key,
  UserCheck,
  Bot,
  ArrowLeftRight,
  Coins,
  Landmark,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PulseBadge } from '../ui/motion/PulseBadge';

interface DocArticle {
  id: string;
  category: 'core' | 'markets' | 'issuance' | 'custody' | 'governance' | 'roles' | 'technical';
  title: string;
  icon: any;
  summary: string;
  targetAudience: string[];
  whatItDoes: string;
  howToUse: string[];
  securityAndLegal: string;
  preconditionsAndRisks: string[];
}

const DOC_ARTICLES: DocArticle[] = [
  {
    id: 'rwa_terminal',
    category: 'markets',
    title: 'RWA Terminal & Interactive Candlestick Charts',
    icon: BarChart2,
    summary: 'Institutional multi-asset market data, TradingView candlestick charts, and instant Delivery-versus-Payment (DvP) primary execution.',
    targetAudience: ['Commercial Bank Treasury', 'Asset Manager / Fund', 'Central Bank Operator', 'Broker / Dealer'],
    whatItDoes: 'Provides high-frequency real-time pricing for Physical Swiss Gold (XAU/EUR), US Treasury 10Y Benchmark Notes, and German Federal Bunds with OHLCV data, volume sub-panes, and direct execution tickets.',
    howToUse: [
      '1. Select your target asset (Gold, US Treasuries, Euro Bunds, or FX Corridors) using the category switcher.',
      '2. Switch chart rendering archetype (Candlestick, Area Gradient, Traditional OHLC Bars, or Baseline Relative mode).',
      '3. Hover or touch-drag across candles to view exact Open, High, Low, Close, and Volume readings in the crosshair inspector.',
      '4. Review the 3 depth cards below the chart for ISIN / DTI codes, yield calculations, and clean spot prices.',
      '5. Click "Buy on ICP DvP" to launch the atomic DvP purchase order ticket.',
    ],
    securityAndLegal: 'All trades execute via sub-second cryptographic Delivery-versus-Payment (DvP) across isolated position ledger partitions. Smart contracts guarantee simultaneous cash debit and asset transfer with zero counterparty settlement risk.',
    preconditionsAndRisks: [
      'Precondition: Origin account must have cleared cash balance or approved intraday overdraft facility.',
      'Risk: Volatility in underlying LBMA bullion spot prices may alter collateral margin requirements.',
    ],
  },
  {
    id: 'bond_factory',
    category: 'issuance',
    title: 'Sovereign Bond Canister Factory (ACTUS Standards)',
    icon: FileCode2,
    summary: 'Programmatic deployment of smart contract debt instruments including ACTUS PAM, Zero-Coupon, Green Climate Notes, and Dual-Asset Notes.',
    targetAudience: ['Central Bank Governor', 'Debt Management Office (DMO)', 'Issuer Lead', 'Platform Super Admin'],
    whatItDoes: 'Automates the entire lifecycle of sovereign debt issuance, generating ISO 6166 ISIN codes, ISO 24165 DTI identifiers, coupon schedules, and deploying dedicated WebAssembly canisters to the ICP fiduciary subnet.',
    howToUse: [
      '1. Open "Contract Maker" from the navigation sidebar.',
      '2. Enter bond parameters: Issuer Title, Notional Volume (€1,000,000,000.00), Coupon % (e.g. 4.25% p.a.), and Tenor maturity.',
      '3. Select Contract Archetype (ACTUS Principal At Maturity, Zero-Coupon Discount, Green ESG Note, or Gold-Linked Dual Note).',
      '4. Choose primary market placement method (Uniform-Price Dutch Auction or Syndicated Private Placement).',
      '5. Click "Deploy Sovereign Bond Canister" to instantiate the WASM canister with dedicated cycle balances.',
    ],
    securityAndLegal: 'Enforces strict ACTUS algorithmic financial contract specifications. Canister state is preserved across WASM upgrades via DFINITY stable structures (`ic-stable-structures`).',
    preconditionsAndRisks: [
      'Precondition: Must hold Level 4/5 Sovereign or DMO clearance with 2-of-2 maker-checker multi-sig authorization.',
      'Risk: Deployed bond canisters must maintain adequate WASM cycle balances for automated coupon execution.',
    ],
  },
  {
    id: 'dutch_auctions',
    category: 'markets',
    title: 'Primary Debt Dutch Auctions & Yield Bidding',
    icon: Coins,
    summary: 'Uniform-price clearing auction engine for primary dealers bidding on sovereign debt placements.',
    targetAudience: ['Primary Dealer Banks', 'Commercial Bank Treasury', 'Debt Management Office', 'Asset Managers'],
    whatItDoes: 'Enables institutional primary dealers to submit competitive yield bids during active auction windows. At the cutoff time, the uniform clearing price is calculated, and winning allocations settle instantly via DvP.',
    howToUse: [
      '1. Navigate to "Bond Auctions" from the sidebar.',
      '2. Inspect active auction status, total target volume, and the current consensus cut-off yield.',
      '3. Enter your bid amount (e.g. €50,000.00 EUR) and target clearing yield (e.g. 3.85%).',
      '4. Click "Submit Institutional Bid" to commit your cryptographically signed bid.',
    ],
    securityAndLegal: 'Bids are timestamped and committed to the consensus finality ledger to prevent front-running and bid tampering.',
    preconditionsAndRisks: [
      'Precondition: Participating entity must be a verified Primary Dealer with cleared settlement collateral.',
    ],
  },
  {
    id: 'vault_custody_por',
    category: 'custody',
    title: 'Vault Custody & Proof-of-Reserve (PoR) Telemetry',
    icon: Key,
    summary: 'Allocated physical bullion title management, ultrasonic IoT vault density telemetry, and real-time solvency attestations.',
    targetAudience: ['Qualified Custodian / Vault Notary', 'Central Bank Reserve Manager', 'Supervisory Auditor'],
    whatItDoes: 'Provides continuous cryptographic proof of physical Zurich gold vault reserves. Integrates live IoT telemetry (vault humidity, ultrasonic bullion density, door lock status) with on-chain holding registers.',
    howToUse: [
      '1. Navigate to "Vault Custody" or "PoR Telemetry".',
      '2. Inspect allocated bars, serial numbers, fine weight (999.9 pure), and Zurich duty-free vault certifications.',
      '3. View live IoT sensor readings verifying physical presence and tamper-proof custody status.',
      '4. Export cryptographic Proof-of-Reserve attestation receipts for external audit verification.',
    ],
    securityAndLegal: 'Combines physical LBMA-certified Good Delivery bar custody with zero-knowledge mathematical solvency proofs. IoT feeds are signed with Ed25519 hardware enclave keys.',
    preconditionsAndRisks: [
      'Precondition: Vault custodian must maintain 100% 1:1 allocated physical bullion backing without unencumbered rehypothecation.',
    ],
  },
  {
    id: 'maker_checker',
    category: 'governance',
    title: 'Maker-Checker Dual Custody Governance Desk',
    icon: UserCheck,
    summary: 'Cryptographic 2-of-2 dual-signer attestation workflow for high-value sovereign transfers and bond deployments.',
    targetAudience: ['Central Bank Governor', 'Executive Signer / Mobile Approver', 'Compliance Officer'],
    whatItDoes: 'Enforces separation of duties: any high-value cash movement (> €100,000.00 EUR), bond canister instantiation, or sanctions override requires independent secondary signer approval.',
    howToUse: [
      '1. Navigate to "Maker-Checker" in the sidebar.',
      '2. Review pending proposals: Originating Maker, Proposed Value, Target Entity, and Risk Screening score.',
      '3. Click "Approve & Notarize" to submit your secondary cryptographic signature.',
      '4. Once quorum is satisfied, the Finality Authority executes the transaction instantly.',
    ],
    securityAndLegal: 'Complies with BIS CPMI-IOSCO Principle 17 for operational risk management and segregation of duties.',
    preconditionsAndRisks: [
      'Precondition: Approver must be distinct from the initiating Maker (self-approval strictly prohibited).',
    ],
  },
  {
    id: 'liquidity_sweeper',
    category: 'governance',
    title: 'Automated Treasury Liquidity Sweeper',
    icon: Bot,
    summary: 'Configurable treasury threshold rules sweeping excess commercial bank fiat deposit yields into physical gold reserves.',
    targetAudience: ['Central Bank Treasury', 'Commercial Bank CFO Desk', 'Corporate Treasurer'],
    whatItDoes: 'Monitors deposit balances across multi-currency cash partitions. When cash exceeds a configured threshold, the sweeper autonomously buys allocated gold bars or short-term treasury bills to maximize yield.',
    howToUse: [
      '1. Navigate to "Liquidity Sweeper".',
      '2. Configure target cash threshold (e.g. Sweep excess above €10,000,000.00 EUR).',
      '3. Select destination reserve asset (Swiss LBMA Gold or US Treasury 3M Bills).',
      '4. Enable automated execution or require 1-tap manual confirmation.',
    ],
    securityAndLegal: 'Runs as an autonomous canister heartbeat timer (`ic_cdk::timer`) executing deterministic policy checks.',
    preconditionsAndRisks: [
      'Precondition: Destination vault custody account must be active and KYC-cleared.',
    ],
  },
  {
    id: 'harmonix_bridge',
    category: 'technical',
    title: 'Harmonix Chain-Key Multi-Chain Bridge',
    icon: ArrowLeftRight,
    summary: 'Threshold ECDSA cryptographic routing between Ethereum, Bitcoin, Solana, and ICP fiduciary subnets.',
    targetAudience: ['Institutional Fund Manager', 'Cross-Chain Trader', 'Treasury Architect'],
    whatItDoes: 'Enables cross-chain liquidity transfers without custodial bridges by utilizing ICP native threshold ECDSA signing (`tECDSA`) directly from WebAssembly smart contracts.',
    howToUse: [
      '1. Open "Harmonix Bridge" from the sidebar.',
      '2. Select source network (e.g. Ethereum Mainnet ERC-20) and destination (ICP Canister Suite).',
      '3. Specify asset symbol (EURD, USDD, or XAU) and amount.',
      '4. Click "Execute Chain-Key Bridge Transfer" to trigger atomic threshold signing.',
    ],
    securityAndLegal: 'Eliminates third-party bridge multi-sig vulnerabilities by utilizing native DFINITY subnet consensus cryptographic key generation.',
    preconditionsAndRisks: [
      'Precondition: Destination address must match valid chain format.',
    ],
  },
  {
    id: 'role_cb_governor',
    category: 'roles',
    title: 'Role Guide: Central Bank Operator & Governor',
    icon: Landmark,
    summary: 'Complete operational mandate for monetary authorities, sovereign bond issuance leads, and reserve managers.',
    targetAudience: ['Central Bank Governor', 'Monetary Policy Committee'],
    whatItDoes: 'Full root authority to deploy ACTUS sovereign bonds, set policy interest rates, manage bilateral FX corridors, enforce sovereign sanctions exemptions, and monitor BFT consensus health.',
    howToUse: [
      '1. Authenticate with FIPS 140-2 Level 5 Hardware HSM or WebAuthn Passkey.',
      '2. Monitor systemic AUM and interbank settlement liquidity.',
      '3. Deploy new debt issuances via the Sovereign Bond Factory.',
      '4. Review and approve high-value multi-sig governance queue items.',
    ],
    securityAndLegal: 'Sovereign root keys are held in dedicated hardware security modules with multi-party quorum requirements.',
    preconditionsAndRisks: ['Level 5 Sovereign Clearance required.'],
  },
  {
    id: 'role_comm_treasury',
    category: 'roles',
    title: 'Role Guide: Commercial Bank Treasury & Primary Dealer',
    icon: Building2,
    summary: 'Operational mandate for tier-1 commercial banks participating in primary auctions and wholesale markets.',
    targetAudience: ['Commercial Bank Treasury', 'JPMorgan Kinexys Desk', 'Goldman Sachs'],
    whatItDoes: 'Enables commercial banks to bid on sovereign bond auctions, trade on the RWA terminal, manage collateral margin positions, and execute sub-second pacs.008 interbank wire transfers.',
    howToUse: [
      '1. Authenticate via Internet Identity or mTLS X.509 PKI certificate.',
      '2. Execute wholesale DvP bond subscriptions and gold purchases.',
      '3. Provide liquidity to AMM pools to earn yield.',
      '4. Manage intraday overdraft facilities and collateral haircuts.',
    ],
    securityAndLegal: 'Operating within regulated sandbox and production limits defined by master clearing agreements.',
    preconditionsAndRisks: ['Primary Dealer Master Agreement required.'],
  },
];

export const SupportDocsPortalView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<DocArticle>(DOC_ARTICLES[0]);

  const filteredArticles = DOC_ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Search Bar */}
      <div
        style={{
          padding: '24px 28px',
          borderRadius: '14px',
          backgroundColor: '#0c0a10',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--border-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--red-primary)',
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Institutional Support & Knowledge Base
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Comprehensive operational manual, role guides, financial standards, and ICP canister specifications.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <PulseBadge label="Docs v2.4 (Live)" variant="green" />
            <PulseBadge label="ACTUS Certified" variant="gold" />
          </div>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by module (RWA Terminal, Bond Factory, DvP Trade, Proof of Reserve, Roles, APIs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark"
            style={{ padding: '12px 14px 12px 42px', fontSize: '13px', width: '100%' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'markets', label: 'RWA & Trading' },
            { id: 'issuance', label: 'Bond Issuance' },
            { id: 'custody', label: 'Vault & Custody' },
            { id: 'governance', label: 'Governance & Sweeper' },
            { id: 'roles', label: 'Persona Role Guides' },
            { id: 'technical', label: 'Bridge & Technical' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--border-red)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Docs Reader */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', minHeight: '600px' }}>
        {/* Left: Article Index List */}
        <div
          style={{
            backgroundColor: '#0c0a10',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '750px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', padding: '0 8px', marginBottom: '4px' }}>
            AVAILABLE GUIDES ({filteredArticles.length})
          </div>

          {filteredArticles.map((art) => {
            const isSelected = activeArticle.id === art.id;
            const Icon = art.icon;
            return (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="card-interactive"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#1c121a' : 'transparent',
                  border: isSelected ? '1px solid var(--border-red)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--red-primary)' : '#16101a',
                    color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#FFFFFF' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {art.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {art.targetAudience.join(', ')}
                  </div>
                </div>
                <ChevronRight size={14} color={isSelected ? 'var(--red-primary)' : 'var(--text-dim)'} />
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Article Reader */}
        <div
          style={{
            backgroundColor: '#0c0a10',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Article Header */}
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--red-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {React.createElement(activeArticle.icon, { size: 20 })}
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  {activeArticle.title}
                </h1>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {activeArticle.summary}
                </div>
              </div>
            </div>

            {/* Target Audience Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700 }}>PERMITTED PERSONAS:</span>
              {activeArticle.targetAudience.map((aud) => (
                <span
                  key={aud}
                  style={{
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid var(--border-red)',
                    color: 'var(--red-primary)',
                    fontWeight: 700,
                  }}
                >
                  {aud}
                </span>
              ))}
            </div>
          </div>

          {/* Section 1: What It Does */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--red-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              1. Functional Description & Purpose
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {activeArticle.whatItDoes}
            </p>
          </div>

          {/* Section 2: Step-by-Step Operational Instructions */}
          <div style={{ backgroundColor: '#120d16', padding: '18px', borderRadius: '10px', border: '1px solid #271f28' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--green-valid)" />
              2. How to Use & Execution Workflow
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeArticle.howToUse.map((step, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Security, Invariant Verification & Legal Basis */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--red-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--red-primary)" />
              3. Security Architecture & Invariant Enforcement
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {activeArticle.securityAndLegal}
            </p>
          </div>

          {/* Section 4: Preconditions, Risks & Failure Modes */}
          <div style={{ backgroundColor: '#180f12', padding: '16px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--red-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} color="var(--red-primary)" />
              4. Preconditions & Risk Controls
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeArticle.preconditionsAndRisks.map((risk, idx) => (
                <div key={idx} style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  • {risk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
