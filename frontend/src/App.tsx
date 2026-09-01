import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/smart/Sidebar';
import { MobileAppPrototype } from './MobileAppPrototype';
import { StitchExecutiveDashboard } from './components/views/StitchExecutiveDashboard';
import { ConsensusHealthView } from './components/views/ConsensusHealthView';
import { BankCardSurface } from './components/smart/BankCardSurface';
import { RwaMarketplace } from './components/smart/RwaMarketplace';
import { RwaOfferDesk } from './components/smart/RwaOfferDesk';
import { GoldFxExchange } from './components/smart/GoldFxExchange';
import { SignalEncryptedChatView } from './components/views/SignalEncryptedChatView';
import { RwaTerminalView } from './components/views/RwaTerminalView';
import { SmartContractMakerView } from './components/views/SmartContractMakerView';
import { RfqTradeDesk } from './components/smart/RfqTradeDesk';
import { TreasuryAccountingView } from './components/institutional/TreasuryAccountingView';
import { CollateralManagementView } from './components/institutional/CollateralManagementView';
import { SupervisoryRadar } from './components/views/SupervisoryRadar';
import { OpsDashboard } from './components/views/OpsDashboard';
import { RegulatorDashboard } from './components/views/RegulatorDashboard';
import { EnterpriseAdminDashboard } from './components/views/EnterpriseAdminDashboard';
import { INSTITUTION_PROFILES, type InstitutionProfile } from './components/institutional/InstitutionalAuthSurface';
import { IssuerDashboard } from './components/views/IssuerDashboard';
import { BondAuctionDesk } from './components/views/BondAuctionDesk';
import { CorporateActionsView } from './components/views/CorporateActionsView';
import { MakerCheckerWorkflow } from './components/views/MakerCheckerWorkflow';
import { ProofOfReserveTelemetry } from './components/views/ProofOfReserveTelemetry';
import { LiquiditySweeperView } from './components/views/LiquiditySweeperView';
import { CrossChainBridgeView } from './components/views/CrossChainBridgeView';
import { CanisterManagementView } from './components/views/CanisterManagementView';
import { WholesaleLiquidityView } from './components/views/WholesaleLiquidityView';
import {
  fetchAccounts,
  fetchHoldings,
  fetchIdentities,
  fetchMarketRates,
  fetchOffers,
  fetchTransactions,
  fetchCollateralPositions,
  fetchAuctions,
  fetchCorporateActions,
  fetchApprovals,
  fetchSweepingRules,
  fetchBridgeRoutes,
  fetchCanisters,
  fetchLiquidityPools,
  fetchBondContracts,
} from './services/api';
import type {
  AppSection,
  DemandDepositRecord,
  FungibleAssetHolding,
  PrincipalProfile,
  ProtocolLog,
  MarketRate,
  RwaOffer,
  InstitutionalTxn,
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
import { AlertCircle, CheckCircle } from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('notaries');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionProfile>(INSTITUTION_PROFILES[0]);

  const [accounts, setAccounts] = useState<DemandDepositRecord[]>([]);
  const [holdings, setHoldings] = useState<FungibleAssetHolding[]>([]);
  const [identities, setIdentities] = useState<PrincipalProfile[]>([]);
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [offers, setOffers] = useState<RwaOffer[]>([]);
  const [transactions, setTransactions] = useState<InstitutionalTxn[]>([]);
  const [collateral, setCollateral] = useState<CollateralPosition[]>([]);
  const [auctions, setAuctions] = useState<BondAuction[]>([]);
  const [corporateActions, setCorporateActions] = useState<CorporateAction[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [sweepingRules, setSweepingRules] = useState<SweepingRule[]>([]);
  const [bridgeRoutes, setBridgeRoutes] = useState<BridgeRoute[]>([]);
  const [canisters, setCanisters] = useState<CanisterStatusInfo[]>([]);
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [bondContracts, setBondContracts] = useState<SovereignBondContract[]>([]);

  const [logs] = useState<ProtocolLog[]>([
    {
      id: 'STATEREF-E8F1A2...C9:0',
      type: 'CashTransfer',
      sender: 'O=Bank A, L=NY',
      recipient: 'O=Bank B, L=LN',
      amount: '500,000.00',
      currency: 'EUR',
      status: 'Finalized',
      step: 'ArchivedInSettlement',
      timestamp: '14:22:01.405',
    },
    {
      id: 'STATEREF-7B4D99...1F:1',
      type: 'AtomicDvPTrade',
      sender: 'O=Broker B, L=LN',
      recipient: 'Swiss Gold Vault',
      amount: '50.00',
      currency: 'GOLD',
      status: 'Finalized',
      step: 'NotarizedByFinalityAuthority',
      timestamp: '14:22:01.102',
    },
    {
      id: 'STATEREF-4A1F02...E3:0',
      type: 'AtomicP2POfferExecution',
      sender: 'O=Exchange C, L=HK',
      recipient: 'Double Spend Attempter',
      amount: '1,000,000.00',
      currency: 'USDD',
      status: 'Failed',
      step: 'RejectedByPolicyEngine',
      timestamp: '14:21:59.880',
    },
  ]);

  const [networkStatus, setNetworkStatus] = useState<'healthy' | 'connecting' | 'offline'>('healthy');
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const loadData = async () => {
    try {
      const [accs, holds, ids, rts, ofrs, txns, cols, aucs, acts, apprs, sweeps, brgs, cans, pools, bonds] = await Promise.all([
        fetchAccounts(),
        fetchHoldings(),
        fetchIdentities(),
        fetchMarketRates(),
        fetchOffers(),
        fetchTransactions(),
        fetchCollateralPositions(),
        fetchAuctions(),
        fetchCorporateActions(),
        fetchApprovals(),
        fetchSweepingRules(),
        fetchBridgeRoutes(),
        fetchCanisters(),
        fetchLiquidityPools(),
        fetchBondContracts(),
      ]);
      setAccounts(accs);
      setHoldings(holds);
      setIdentities(ids);
      setRates(rts);
      setOffers(ofrs);
      setTransactions(txns);
      setCollateral(cols);
      setAuctions(aucs);
      setCorporateActions(acts);
      setApprovals(apprs);
      setSweepingRules(sweeps);
      setBridgeRoutes(brgs);
      setCanisters(cans);
      setLiquidityPools(pools);
      setBondContracts(bonds);
      setNetworkStatus('healthy');
    } catch {
      setNetworkStatus('offline');
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    if (!isError) {
      loadData();
    }
    setTimeout(() => setToast(null), 4000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'notaries':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <StitchExecutiveDashboard
              accounts={accounts}
              holdings={holdings}
              rates={rates}
              onOpenTransfer={() => setActiveSection('portfolio')}
              onOpenAudit={() => setActiveSection('logs')}
              onNotify={showToast}
            />
            <ConsensusHealthView onNotify={showToast} />
          </div>
        );
      case 'portfolio':
        return <BankCardSurface accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
      case 'terminal':
        return <RwaTerminalView accounts={accounts} rates={rates} onRefresh={loadData} onNotify={showToast} />;
      case 'contract_maker':
        return <SmartContractMakerView contracts={bondContracts} onRefresh={loadData} onNotify={showToast} />;
      case 'vault':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <IssuerDashboard holdings={holdings} onRefresh={loadData} onNotify={showToast} />
            <RwaMarketplace rates={rates} accounts={accounts} onRefresh={loadData} onNotify={showToast} />
          </div>
        );
      case 'trade':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <RwaOfferDesk offers={offers} accounts={accounts} onRefresh={loadData} onNotify={showToast} />
            <RfqTradeDesk rates={rates} accounts={accounts} onRefresh={loadData} onNotify={showToast} />
          </div>
        );
      case 'collateral':
        return <CollateralManagementView positions={collateral} onRefresh={loadData} onNotify={showToast} />;
      case 'auctions':
        return <BondAuctionDesk auctions={auctions} onRefresh={loadData} onNotify={showToast} />;
      case 'corporate_actions':
        return <CorporateActionsView actions={corporateActions} onRefresh={loadData} onNotify={showToast} />;
      case 'governance':
        return <MakerCheckerWorkflow approvals={approvals} onRefresh={loadData} onNotify={showToast} />;
      case 'vault_telemetry':
        return <ProofOfReserveTelemetry onNotify={showToast} />;
      case 'sweeper':
        return <LiquiditySweeperView rules={sweepingRules} accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
      case 'bridge':
        return <CrossChainBridgeView routes={bridgeRoutes} onNotify={showToast} />;
      case 'canister_mgmt':
        return <CanisterManagementView canisters={canisters} onRefresh={loadData} onNotify={showToast} />;
      case 'liquidity_pools':
        return <WholesaleLiquidityView pools={liquidityPools} onNotify={showToast} />;
      case 'interoperability':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SignalEncryptedChatView onNotify={showToast} onRefresh={loadData} />
            <GoldFxExchange rates={rates} />
            <OpsDashboard logs={logs} onRefresh={loadData} />
          </div>
        );
      case 'compliance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SupervisoryRadar />
            <RegulatorDashboard accounts={accounts} holdings={holdings} onNotify={showToast} />
          </div>
        );
      case 'logs':
        return <TreasuryAccountingView transactions={transactions} onRefresh={loadData} />;
      case 'support':
        return <EnterpriseAdminDashboard identities={identities} accounts={accounts} holdings={holdings} onRefresh={loadData} onNotify={showToast} />;
      default:
        return <ConsensusHealthView onNotify={showToast} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        networkStatus={networkStatus}
        accountCount={accounts.length}
        holdingCount={holdings.length}
        protocolCount={logs.length}
        identityCount={identities.length}
        phoneMode={phoneMode}
        setPhoneMode={setPhoneMode}
        onToggleMobileMenu={() => setIsMobileMenuOpen((p) => !p)}
        accounts={accounts}
        onNotify={showToast}
        currentInstitution={currentInstitution}
        onSelectInstitution={setCurrentInstitution}
      />

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            backgroundColor: toast.isError ? '#ef4444' : '#140c11',
            border: `1px solid ${toast.isError ? '#dc2626' : 'var(--red-primary)'}`,
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 24px rgba(239, 68, 68, 0.35)',
            zIndex: 3000,
          }}
        >
          {toast.isError ? <AlertCircle size={16} /> : <CheckCircle size={16} color="var(--green-valid)" />}
          {toast.message}
        </div>
      )}

      {phoneMode ? (
        <div style={{ flex: 1, padding: '20px 10px', display: 'flex', justifyContent: 'center', backgroundColor: '#060608' }}>
          <div className="smartphone-frame">
            <div className="smartphone-notch" />
            <MobileAppPrototype
              accounts={accounts}
              holdings={holdings}
              rates={rates}
              transactions={transactions}
              offers={offers} collateral={collateral} auctions={auctions} corporateActions={corporateActions} approvals={approvals} sweepingRules={sweepingRules} bridgeRoutes={bridgeRoutes} canisters={canisters} liquidityPools={liquidityPools} identities={identities}
              onNotify={showToast}
              onRefresh={loadData}
            />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            accountCount={accounts.length}
            holdingCount={holdings.length}
            offerCount={offers.length}
            collateralCount={collateral.length}
            auctionCount={auctions.length}
            approvalCount={approvals.length}
            canisterCount={canisters.length}
            poolCount={liquidityPools.length}
          />

          <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '28px 32px' }}>
            {renderContent()}
          </main>
        </div>
      )}

      <footer style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-navbar)', padding: '12px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-dim)' }}>
        Veritas Gold • Sovereign Institutional Ledger • Verified Sub-Second Finality on ICP
      </footer>
    </div>
  );
}

export default App;
