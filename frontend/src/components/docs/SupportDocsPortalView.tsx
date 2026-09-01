import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  BarChart2,
  FileCode2,
  Key,
  UserCheck,
  Coins,
  Landmark,
  ChevronRight,
  CheckCircle2,
  Monitor,
  Cpu,
  Lock,
} from 'lucide-react';
import { PulseBadge } from '../ui/motion/PulseBadge';

interface DocArticle {
  id: string;
  chapter: string;
  category: 'core' | 'markets' | 'issuance' | 'custody' | 'governance' | 'privacy' | 'technical';
  title: string;
  icon: any;
  summary: string;
  targetAudience: string[];
  uiMockupDescription: string;
  forFinancialProfessionals: string;
  forSoftwareEngineers: string;
  tenYearRetentionPolicy: string;
  howToUse: string[];
  preconditionsAndRisks: string[];
}

const COMPREHENSIVE_DOC_ARTICLES: DocArticle[] = [
  {
    id: 'dashboard_1_1',
    chapter: '1.1',
    category: 'core',
    title: 'Master Dashboard & Sovereign Command Radar',
    icon: Monitor,
    summary: 'Executive real-time command terminal displaying network-wide aggregate AUM, BFT Quorum health, live transactions, and systemic liquidity status.',
    targetAudience: ['Central Bank Governor', 'Chief Risk Officer', 'Treasury Operations Head', 'Supervisory Auditor'],
    uiMockupDescription: 'Screen displays 4 top metric cards: Global AUM ($14.24B) with rolling numbers and gold shimmer, BFT Quorum (4/5 Notaries Validated), Canister Fleet Health (7 Live WASMs on Fiduciary Subnet), and 24h pacs.008 Clearing Volume. Below sits the Interactive Participant Matrix and real-time ledger activity stream.',
    forFinancialProfessionals: 'Provides C-level central bankers and bank treasurers with holistic visibility over systemic liquidity, intraday settlement velocity, and capital utilization. Guarantees zero uncollateralized credit risk through continuous atomic balance verification.',
    forSoftwareEngineers: 'Projections are fed via low-latency JSON-RPC subscriptions from the Rust backend and ICP certified variables. System status aggregates metrics from `position-ledger` and `identity-registry` canisters without blocking state-machine consensus.',
    tenYearRetentionPolicy: 'Aggregate operational metrics are preserved indefinitely. Underlying transaction logs are stored off-chain in encrypted PostgreSQL for exactly 10 years per MiFID II Art. 16(6), anchored to immutable SHA-256 on-chain state hashes.',
    howToUse: [
      '1. Open Master Dashboard to inspect global systemic liquidity and node health.',
      '2. Monitor BFT Quorum indicator for zero-double-spend confirmations.',
      '3. Review pending multi-sig action items requiring executive approval.',
      '4. Click "Sync Network State" for an instant cryptographically certified state audit.',
    ],
    preconditionsAndRisks: [
      'Precondition: Valid institutional credentials with FIPS 140-2 Level 4/5 clearance.',
      'Risk: Temporary subnet latency may cause telemetry lag (< 400ms).',
    ],
  },
  {
    id: 'portfolio_1_2',
    chapter: '1.2',
    category: 'core',
    title: 'Accounts & Multi-Currency Cash Partitions',
    icon: Landmark,
    summary: 'Institutional multi-currency cash account management supporting sEURD, sUSDD, CHF, GBP, and physical gold bullion balances.',
    targetAudience: ['Commercial Bank Treasury', 'Cash Manager', 'Settlement Officer'],
    uiMockupDescription: 'Displays individual Demand Deposit cards (e.g. `ACC-EUR-JPMC`, `ACC-CHF-SNB`), showing settled balance (€2,450,000.00), available spending power, intraday overdraft headroom, and live ISO 20022 pacs.008 wire transfer forms.',
    forFinancialProfessionals: 'Enables precise intraday liquidity optimization and real-time interbank cash settlement without correspondent banking friction or multi-day settlement delays.',
    forSoftwareEngineers: 'Managed by the `account-ledger` Rust canister. Balances use exact integer micro-units (`u128` / minor units) to avoid IEEE-754 floating point rounding drift. Transfers update state via ACID atomic journal entries.',
    tenYearRetentionPolicy: 'All journal entries and pacs.008 transaction payloads are stored in off-chain encrypted audit vaults for 10 years under AMLD5 and Swiss BankG, referencing on-chain immutable transaction nonces.',
    howToUse: [
      '1. Select origin demand deposit account from the dropdown list.',
      '2. Enter recipient institutional account and transfer amount.',
      '3. Attach ISO 20022 pacs.008 remittance memo.',
      '4. Complete hardware key authentication to dispatch atomic transfer.',
    ],
    preconditionsAndRisks: [
      'Precondition: Origin account must have sufficient cleared funds or authorized overdraft buffer.',
      'Risk: Account freeze by compliance radar will reject transfer instructions.',
    ],
  },
  {
    id: 'terminal_1_3',
    chapter: '1.3',
    category: 'markets',
    title: 'RWA Terminal & Japanese Candlestick Charts',
    icon: BarChart2,
    summary: 'Institutional multi-asset market data workstation with TradingView v5 candlestick charts, OHLCV crosshair inspection, and instant atomic DvP order entry.',
    targetAudience: ['Primary Dealer Desk', 'Asset Manager / Fund', 'Market Maker', 'FX Trader'],
    uiMockupDescription: 'High-density market screen featuring a full TradingView chart with 4 render modes (Candlesticks, Area Gradient, Traditional Bars, and Baseline). Features crosshair OHLCV hover inspect, volume histogram sub-pane, and 3 market depth cards (Gold XAU, US 10Y Note, Euro Bund).',
    forFinancialProfessionals: 'Delivers transparent price discovery and instant Delivery-versus-Payment (DvP) execution on sovereign securities and physical bullion with zero slippage and sub-400ms finality.',
    forSoftwareEngineers: 'Chart engine is built with TradingView `lightweight-charts` v5. Data feeds stream via WebSockets from high-frequency Rust endpoints. Order execution invokes `settlement-engine::execute_dvp_trade` canister update method.',
    tenYearRetentionPolicy: 'Executed trade tickets, fills, and price snapshots are archived off-chain for 10 years. Only cryptographic trade execution nonces and finality receipts are held on-chain.',
    howToUse: [
      '1. Select asset category (Gold, US Treasuries, Bunds, FX).',
      '2. Switch chart mode (Candlesticks, Area, Bars, Baseline) and interval.',
      '3. Hover across candles to inspect open, high, low, close, and volume.',
      '4. Click "Buy on ICP DvP" to launch the atomic purchase modal.',
    ],
    preconditionsAndRisks: [
      'Precondition: Cleared cash balance in respective settlement currency.',
      'Risk: Volatility in spot commodity markets may trigger margin calls.',
    ],
  },
  {
    id: 'bond_factory_1_4',
    chapter: '1.4',
    category: 'issuance',
    title: 'Sovereign Bond Canister Factory (ACTUS Standards)',
    icon: FileCode2,
    summary: 'Algorithmic sovereign debt instrument deployment using standardized ACTUS financial contracts, automated ISIN/DTI allocation, and dedicated WASM canisters.',
    targetAudience: ['Central Bank Governor', 'Debt Management Office (DMO)', 'Sovereign Issuer Lead'],
    uiMockupDescription: 'Form-driven instrument architect wizard. Allows configuring Issuer Name, Notional Volume (€1B), Coupon Rate (4.25% p.a.), Maturity Tenor (5 Years), and placement method. Automatically displays generated ISO 6166 ISIN and ISO 24165 DTI codes.',
    forFinancialProfessionals: 'Standardizes sovereign bond issuance according to ACTUS (Algorithmic Contract Types Unified Standard), eliminating contractual ambiguity, automating coupon cash flows, and reducing underwriting overhead.',
    forSoftwareEngineers: 'Factory invokes `ic_cdk::api::management_canister::main::create_canister` and installs compiled Rust WASM bytecodes. State persistence uses `ic-stable-structures` `StableBTreeMap` to survive canister upgrades.',
    tenYearRetentionPolicy: 'Bond prospectus PDFs, offering memorandums, and allocation sheets are stored off-chain in encrypted PostgreSQL with mandatory 10-year statutory retention. Canister stores only the SHA-256 hash of legal documents.',
    howToUse: [
      '1. Navigate to Contract Maker.',
      '2. Enter bond issuance parameters and select ACTUS PAM archetype.',
      '3. Review generated ISIN and DTI identifiers.',
      '4. Authorize deployment via 2-of-2 maker-checker signature.',
      '5. Monitor live canister deployment and cycle balances.',
    ],
    preconditionsAndRisks: [
      'Precondition: Level 4/5 Sovereign or DMO clearance.',
      'Risk: Deployed bond canisters require adequate cycle allocation for coupon processing.',
    ],
  },
  {
    id: 'auctions_1_5',
    chapter: '1.5',
    category: 'markets',
    title: 'Primary Debt Dutch Auctions & Yield Bidding',
    icon: Coins,
    summary: 'Uniform-price clearing auction engine for sovereign debt syndication and primary dealer yield allocation.',
    targetAudience: ['Primary Dealer Banks', 'Commercial Bank Treasury', 'Debt Management Office'],
    uiMockupDescription: 'Live auction dashboard showing target issuance volume (€500M), remaining time window, and bid submission slip. Primary dealers enter volume and yield (e.g. 3.85%) to participate in the uniform clearing book.',
    forFinancialProfessionals: 'Maximizes sovereign debt pricing efficiency through competitive Dutch auction mechanics. Winning bids clear at a single uniform yield, ensuring equitable market distribution.',
    forSoftwareEngineers: 'The `auction-engine` canister maintains a deterministic sorted order book. At the cut-off timestamp, the clearing yield is computed using binary search over the demand curve, settling allocations atomically via DvP.',
    tenYearRetentionPolicy: 'Bid timestamps, bidder LEI codes, and allocation histories are archived for 10 years for market surveillance compliance under EU Market Abuse Regulation (MAR).',
    howToUse: [
      '1. Navigate to Bond Auctions.',
      '2. Review active auction details and consensus yield.',
      '3. Submit bid volume and target yield.',
      '4. Await auction cut-off for automated DvP allotment.',
    ],
    preconditionsAndRisks: [
      'Precondition: Verified Primary Dealer status with pledged settlement collateral.',
    ],
  },
  {
    id: 'vault_por_1_6',
    chapter: '1.6',
    category: 'custody',
    title: 'Vault Custody & Ultrasonic IoT Proof-of-Reserve',
    icon: Key,
    summary: 'Allocated physical bullion title management, continuous ultrasonic vault sensor telemetry, and zero-knowledge solvency verification.',
    targetAudience: ['Qualified Custodian / Vault Notary', 'Reserve Auditor', 'Central Bank Risk Officer'],
    uiMockupDescription: 'Displays individual allocated LBMA Good Delivery gold bars with serial numbers, bar assay certificates, and live IoT telemetry widgets (ultrasonic metal density, vault temperature, humidity, and biometric lock logs).',
    forFinancialProfessionals: 'Guarantees 100% 1:1 physical bullion backing with continuous real-time mathematical proof, eliminating unallocated fractional-reserve risks.',
    forSoftwareEngineers: 'IoT telemetry is ingested via authenticated HTTPS Outcalls signed with Ed25519 secure enclave keys. Proof-of-Reserve logic cross-references physical bar weights against on-chain token supply.',
    tenYearRetentionPolicy: 'Vault assay certificates and physical custody ledgers are archived off-chain for 10 years. Real-time sensor readings are hashed into immutable state commitments.',
    howToUse: [
      '1. Navigate to Vault Custody or PoR Telemetry.',
      '2. Verify individual allocated gold bar serial numbers and purity.',
      '3. Inspect live IoT ultrasonic density readings.',
      '4. Export cryptographically signed Proof-of-Reserve certificate.',
    ],
    preconditionsAndRisks: [
      'Precondition: Physical custody agreement with Zurich Duty-Free Vault.',
    ],
  },
  {
    id: 'maker_checker_1_7',
    chapter: '1.7',
    category: 'governance',
    title: 'Maker-Checker 2-of-2 Dual-Custody Governance Desk',
    icon: UserCheck,
    summary: 'Cryptographic multi-sig authorization desk enforcing separation of duties for all high-value transfers, bond deployments, and policy overrides.',
    targetAudience: ['Central Bank Governor', 'Executive Signer', 'Chief Compliance Officer'],
    uiMockupDescription: 'Queue of pending institutional actions. Each proposal card displays Maker Identity, Proposed Action, Amount (€), Sanctions Screening Score, and "Approve & Notarize" button.',
    forFinancialProfessionals: 'Prevents rogue trader risk, unauthorized capital flight, and operational error by enforcing dual independent executive sign-off on transactions exceeding threshold limits.',
    forSoftwareEngineers: 'Implemented in the `policy-engine` canister using cryptographic multi-party threshold verification. State changes remain in `PendingQuorum` state until requisite threshold signatures are collected.',
    tenYearRetentionPolicy: 'All approval timestamps, signer identities, and cryptographic signatures are retained for 10 years in the immutable audit registry under BIS CPMI-IOSCO Principle 17.',
    howToUse: [
      '1. Open Maker-Checker desk.',
      '2. Inspect pending transaction details and risk analysis.',
      '3. Click "Approve & Notarize" to apply secondary signature.',
      '4. Once dual-sign is achieved, transaction executes with instant finality.',
    ],
    preconditionsAndRisks: [
      'Precondition: Signer must be distinct from initiating Maker (self-approval strictly blocked).',
    ],
  },
  {
    id: 'privacy_gdpr_2_0',
    chapter: '2.0',
    category: 'privacy',
    title: 'Data Privacy, 10-Year Statutory Retention & GDPR On-Chain Hashing',
    icon: Lock,
    summary: 'Dual-layer storage architecture balancing 10-year statutory regulatory retention (MiFID II / 5AMLD) with GDPR Right to Erasure via salted on-chain hashing.',
    targetAudience: ['Data Protection Officer (DPO)', 'Compliance Officer', 'Legal Counsel', 'Software Architect'],
    uiMockupDescription: 'Visual architectural diagram and policy table displaying the boundary between On-Chain Immutable Hashes (zero PII) and Off-Chain PostgreSQL Encrypted Vaults (10-year retention with automated cryptographic shredding).',
    forFinancialProfessionals: 'Ensures absolute regulatory compliance with conflicting legal requirements: preserves mandatory 10-year audit records for financial regulators while enabling GDPR Article 17 deletion requests upon statutory expiration.',
    forSoftwareEngineers: 'On-chain canisters store ONLY `[u8; 32]` salted SHA-256 hashes of client dossiers. Off-chain databases store AES-256-GCM encrypted PII. When a customer exercises Right to Erasure post-10-years, off-chain keys are shredded, leaving the irreversible on-chain hash completely anonymous.',
    tenYearRetentionPolicy: 'MANDATORY 10-YEAR STATUTORY ARCHIVE: Overrides GDPR deletion requests during the initial 10 years per GDPR Art. 17(3)(b). Upon year 10 + 1 day, off-chain PII is permanently shredded upon request.',
    howToUse: [
      '1. Review on-chain hash attestations in the Compliance Radar.',
      '2. Confirm that no raw customer names or passport scans are transmitted on-chain.',
      '3. Verify 10-year retention countdowns on off-chain identity records.',
    ],
    preconditionsAndRisks: [
      'Precondition: Enterprise AES-256-GCM key management module.',
    ],
  },
  {
    id: 'developer_guide_2_1',
    chapter: '2.1',
    category: 'technical',
    title: 'ICP Rust Canister Suite & Developer Engineering Guide',
    icon: Cpu,
    summary: 'Technical developer documentation for building, testing, and deploying Rust canisters on the DFINITY Internet Computer.',
    targetAudience: ['Smart Contract Engineers', 'Rust Backend Developers', 'Systems Architects'],
    uiMockupDescription: 'Code snippets, Candid interface definitions (`.did`), WASM cycle metrics, stable memory layout diagrams, and CLI deployment guides using `dfx`.',
    forFinancialProfessionals: 'Provides technical assurance that the underlying smart contract infrastructure is formally verified, memory-safe, zero-panic, and auditable by third-party security firms.',
    forSoftwareEngineers: 'Enforces `ic-cdk`, `candid`, and `ic-stable-structures` best practices. Strictly rejects anonymous callers, enforces `CallerGuard` reentrancy prevention on HTTPS outcalls, and eliminates all `unwrap()` / `expect()` calls in production paths.',
    tenYearRetentionPolicy: 'Smart contract code versions, WASM module hashes, and deployment proposals are recorded immutably in the governance canister.',
    howToUse: [
      '1. Compile Rust canisters via `cargo build --target wasm32-unknown-unknown --release`.',
      '2. Inspect Candid service signatures in `.did` files.',
      '3. Deploy to local replica or mainnet via `dfx deploy`.',
      '4. Monitor stable memory growth and cycles burn rate.',
    ],
    preconditionsAndRisks: [
      'Precondition: Rust 1.80+ and dfx CLI installed.',
    ],
  },
];

export const SupportDocsPortalView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<DocArticle>(COMPREHENSIVE_DOC_ARTICLES[0]);

  const filteredArticles = COMPREHENSIVE_DOC_ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.forFinancialProfessionals.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.forSoftwareEngineers.toLowerCase().includes(searchQuery.toLowerCase());
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
                Institutional Documentation & Engineering Manual
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Detailed UI walkthroughs, financial specifications, smart contract architecture, and 10-year GDPR privacy policies.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <PulseBadge label="Docs v2.4 (Live)" variant="green" />
            <PulseBadge label="ACTUS & MiFID II Compliant" variant="gold" />
          </div>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search documentation (e.g., Candlestick charts, ACTUS Bond Factory, 10-Year GDPR, Rust Canisters)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark"
            style={{ padding: '12px 14px 12px 42px', fontSize: '13px', width: '100%' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Chapters' },
            { id: 'core', label: '1.1-1.2 Core & Accounts' },
            { id: 'markets', label: '1.3-1.5 Markets & Auctions' },
            { id: 'issuance', label: '1.4 Bond Factory' },
            { id: 'custody', label: '1.6 Vault & PoR' },
            { id: 'governance', label: '1.7 Governance' },
            { id: 'privacy', label: '2.0 GDPR & 10-Yr Retention' },
            { id: 'technical', label: '2.1 Rust & ICP Canisters' },
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
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', minHeight: '650px' }}>
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
            maxHeight: '850px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', padding: '0 8px', marginBottom: '4px' }}>
            MANUAL CHAPTERS ({filteredArticles.length})
          </div>

          {filteredArticles.map((art) => {
            const isSelected = activeArticle.id === art.id;
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
                    fontWeight: 800,
                    fontSize: '11px',
                  }}
                >
                  {art.chapter}
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
            gap: '24px',
          }}
        >
          {/* Article Header */}
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--red-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {React.createElement(activeArticle.icon, { size: 22 })}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--red-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Chapter {activeArticle.chapter}
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  {activeArticle.title}
                </h1>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              {activeArticle.summary}
            </p>

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

          {/* Section 1: UI Layout & Screenshot Walkthrough */}
          <div style={{ backgroundColor: '#130d17', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-red)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--red-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Monitor size={16} />
              1. Visual UI Layout & Screenshot Breakdown
            </h3>
            <p style={{ fontSize: '13px', color: '#FFFFFF', lineHeight: 1.6 }}>
              {activeArticle.uiMockupDescription}
            </p>
          </div>

          {/* Section 2: For Financial Professionals */}
          <div style={{ backgroundColor: '#0f1416', padding: '18px', borderRadius: '10px', border: '1px solid #1c2e2e' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--green-valid)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Coins size={16} />
              2. For Financial Professionals: Capital & Risk Value
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {activeArticle.forFinancialProfessionals}
            </p>
          </div>

          {/* Section 3: For Software Engineers & Smart Contract Developers */}
          <div style={{ backgroundColor: '#141018', padding: '18px', borderRadius: '10px', border: '1px solid #2d1d36' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} />
              3. For Engineers: Rust Canister Architecture & Data Flow
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {activeArticle.forSoftwareEngineers}
            </p>
          </div>

          {/* Section 4: 10-Year Statutory Retention & GDPR On-Chain Hashing */}
          <div style={{ backgroundColor: '#170e12', padding: '18px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} />
              4. Data Privacy: 10-Year Legal Retention & GDPR On-Chain Hashing
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {activeArticle.tenYearRetentionPolicy}
            </p>
          </div>

          {/* Section 5: Step-by-Step How-To Instructions */}
          <div style={{ backgroundColor: '#120d16', padding: '18px', borderRadius: '10px', border: '1px solid #271f28' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--green-valid)" />
              5. Step-by-Step Operational Instructions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeArticle.howToUse.map((step, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
