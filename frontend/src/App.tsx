import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/smart/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { BankCardSurface } from './components/smart/BankCardSurface';
import { RwaMarketplace } from './components/smart/RwaMarketplace';
import { RwaOfferDesk } from './components/smart/RwaOfferDesk';
import { GoldFxExchange } from './components/smart/GoldFxExchange';
import { RfqTradeDesk } from './components/smart/RfqTradeDesk';
import { TreasuryAccountingView } from './components/institutional/TreasuryAccountingView';
import { CollateralManagementView } from './components/institutional/CollateralManagementView';
import { SupervisoryRadar } from './components/views/SupervisoryRadar';
import { OpsDashboard } from './components/views/OpsDashboard';
import { RegulatorDashboard } from './components/views/RegulatorDashboard';
import { AdminDashboard } from './components/views/AdminDashboard';
import { fetchAccounts, fetchHoldings, fetchIdentities, fetchMarketRates, fetchOffers, fetchTransactions, fetchCollateralPositions } from './services/api';
import type { Perspective, AppSection, DemandDepositRecord, FungibleAssetHolding, PrincipalProfile, ProtocolLog, MarketRate, RwaOffer, InstitutionalTxn, CollateralPosition } from './types';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('banking');
  const [perspective, setPerspective] = useState<Perspective>('trader');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);

  const [accounts, setAccounts] = useState<DemandDepositRecord[]>([]);
  const [holdings, setHoldings] = useState<FungibleAssetHolding[]>([]);
  const [identities, setIdentities] = useState<PrincipalProfile[]>([]);
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [offers, setOffers] = useState<RwaOffer[]>([]);
  const [transactions, setTransactions] = useState<InstitutionalTxn[]>([]);
  const [collateral, setCollateral] = useState<CollateralPosition[]>([]);
  const [logs] = useState<ProtocolLog[]>([
    {
      id: 'PROTO-9ac00fb0-f2b9-4b78-8ee4-062d8935044d',
      type: 'CashTransfer',
      sender: 'Alice Trading Corp',
      recipient: 'Bob Commodities LLC',
      amount: '150.00',
      currency: 'EUR',
      status: 'Finalized',
      step: 'ArchivedInSettlement',
      timestamp: 'Just now',
    },
    {
      id: 'PROTO-P2P-881',
      type: 'AtomicP2POfferExecution',
      sender: 'Alice Trading Corp',
      recipient: 'Bob Commodities LLC',
      amount: '2.00',
      currency: 'USTB',
      status: 'Finalized',
      step: 'NotarizedByFinalityAuthority',
      timestamp: '1 min ago',
    },
    {
      id: 'PROTO-RFQ-002',
      type: 'AtomicDvPTrade',
      sender: 'Alice Trading Corp',
      recipient: 'Swiss Gold Depository',
      amount: '0.50',
      currency: 'GOLD',
      status: 'Finalized',
      step: 'NotarizedByFinalityAuthority',
      timestamp: '3 mins ago',
    },
  ]);
  const [networkStatus, setNetworkStatus] = useState<'healthy' | 'connecting' | 'offline'>('healthy');
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const loadData = async () => {
    try {
      const [accs, holds, ids, rts, ofrs, txns, cols] = await Promise.all([
        fetchAccounts(),
        fetchHoldings(),
        fetchIdentities(),
        fetchMarketRates(),
        fetchOffers(),
        fetchTransactions(),
        fetchCollateralPositions(),
      ]);
      setAccounts(accs);
      setHoldings(holds);
      setIdentities(ids);
      setRates(rts);
      setOffers(ofrs);
      setTransactions(txns);
      setCollateral(cols);
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
    if (perspective === 'admin') {
      return <AdminDashboard identities={identities} onRefresh={loadData} onNotify={showToast} />;
    }
    switch (activeSection) {
      case 'banking':
        return <BankCardSurface accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
      case 'marketplace':
        return <RwaMarketplace rates={rates} accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
      case 'offers':
        return <RwaOfferDesk offers={offers} accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
      case 'accounting':
        return <TreasuryAccountingView transactions={transactions} onRefresh={loadData} />;
      case 'collateral':
        return <CollateralManagementView positions={collateral} onRefresh={loadData} onNotify={showToast} />;
      case 'exchange':
        return <GoldFxExchange rates={rates} />;
      case 'rfq':
        return <RfqTradeDesk rates={rates} accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
      case 'protocols':
        return <OpsDashboard logs={logs} onRefresh={loadData} />;
      case 'supervision':
        return <SupervisoryRadar />;
      case 'audit':
        return <RegulatorDashboard accounts={accounts} holdings={holdings} onNotify={showToast} />;
      default:
        return <BankCardSurface accounts={accounts} onRefresh={loadData} onNotify={showToast} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        networkStatus={networkStatus}
        accountCount={accounts.length}
        holdingCount={holdings.length}
        protocolCount={logs.length}
        identityCount={identities.length}
        phoneMode={phoneMode}
        setPhoneMode={setPhoneMode}
        onToggleMobileMenu={() => setIsMobileMenuOpen((p) => !p)}
      />

      <PersonaSwitcher perspective={perspective} setPerspective={setPerspective} />

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            backgroundColor: toast.isError ? '#FF0000' : '#0F0F0F',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 3000,
          }}
        >
          {toast.isError ? <AlertCircle size={16} /> : <CheckCircle size={16} color="#2BA640" />}
          {toast.message}
        </div>
      )}

      {phoneMode ? (
        <div style={{ flex: 1, padding: '20px 10px', display: 'flex', justifyContent: 'center', backgroundColor: '#EAEAEA' }}>
          <div className="smartphone-frame">
            <div className="smartphone-notch" />
            <div style={{ overflowY: 'auto', flex: 1, padding: '34px 16px 70px 16px', display: 'flex', flexDirection: 'column' }}>
              {renderContent()}
            </div>
            <MobileBottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            accountCount={accounts.length}
            rwaCount={rates.length}
            offerCount={offers.length}
            txnCount={transactions.length}
            collateralCount={collateral.length}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <main className="main-content-container" style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px 28px' }}>
            {renderContent()}
          </main>

          <MobileBottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      )}

      <footer style={{ borderTop: '1px solid #E5E5E5', backgroundColor: '#FFFFFF', padding: '12px 20px', textAlign: 'center', fontSize: '11px', color: '#606060' }}>
        Veritas Gold • Institutional Tokenized Deposits & RWA Market • Licensed to ICP Moneta
      </footer>
    </div>
  );
}

export default App;
