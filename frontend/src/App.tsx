import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/smart/Sidebar';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { BankCardSurface } from './components/smart/BankCardSurface';
import { RwaMarketplace } from './components/smart/RwaMarketplace';
import { RwaOfferDesk } from './components/smart/RwaOfferDesk';
import { GoldFxExchange } from './components/smart/GoldFxExchange';
import { RfqTradeDesk } from './components/smart/RfqTradeDesk';
import { SupervisoryRadar } from './components/views/SupervisoryRadar';
import { OpsDashboard } from './components/views/OpsDashboard';
import { RegulatorDashboard } from './components/views/RegulatorDashboard';
import { AdminDashboard } from './components/views/AdminDashboard';
import { fetchAccounts, fetchHoldings, fetchIdentities, fetchMarketRates, fetchOffers } from './services/api';
import type { Perspective, AppSection, DemandDepositRecord, FungibleAssetHolding, PrincipalProfile, ProtocolLog, MarketRate, RwaOffer } from './types';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('banking');
  const [perspective, setPerspective] = useState<Perspective>('trader');
  const [accounts, setAccounts] = useState<DemandDepositRecord[]>([]);
  const [holdings, setHoldings] = useState<FungibleAssetHolding[]>([]);
  const [identities, setIdentities] = useState<PrincipalProfile[]>([]);
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [offers, setOffers] = useState<RwaOffer[]>([]);
  const [logs, setLogs] = useState<ProtocolLog[]>([
    {
      id: 'PROTO-9ac00fb0-f2b9-4b78-8ee4-062d8935044d',
      type: 'CashTransfer',
      sender: 'Alice Trading Corp',
      recipient: 'Bob Commodities LLC',
      amount: '100.00',
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
      amount: '50.00',
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
      amount: '2.50',
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
      const [accs, holds, ids, rts, ofrs] = await Promise.all([
        fetchAccounts(),
        fetchHoldings(),
        fetchIdentities(),
        fetchMarketRates(),
        fetchOffers(),
      ]);
      setAccounts(accs);
      setHoldings(holds);
      setIdentities(ids);
      setRates(rts);
      setOffers(ofrs);
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
      setLogs((prev) => [
        {
          id: `PROTO-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
          type: 'AtomicP2POfferExecution',
          sender: 'Alice Trading Corp',
          recipient: 'Bob Commodities LLC',
          amount: 'RWA Move',
          currency: 'USTB/GOLD',
          status: 'Finalized',
          step: 'FinalityProofGenerated',
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    }
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        networkStatus={networkStatus}
        accountCount={accounts.length}
        holdingCount={holdings.length}
        protocolCount={logs.length}
        identityCount={identities.length}
      />

      <PersonaSwitcher perspective={perspective} setPerspective={setPerspective} />

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toast.isError ? '#FF0000' : '#0F0F0F',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 2000,
          }}
        >
          {toast.isError ? <AlertCircle size={16} /> : <CheckCircle size={16} color="#2BA640" />}
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          accountCount={accounts.length}
          rwaCount={rates.length}
          offerCount={offers.length}
        />

        <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '28px 32px' }}>
          {perspective === 'admin' && (
            <AdminDashboard identities={identities} onRefresh={loadData} onNotify={showToast} />
          )}

          {perspective !== 'admin' && activeSection === 'banking' && (
            <BankCardSurface accounts={accounts} onRefresh={loadData} onNotify={showToast} />
          )}

          {perspective !== 'admin' && activeSection === 'marketplace' && (
            <RwaMarketplace rates={rates} accounts={accounts} onRefresh={loadData} onNotify={showToast} />
          )}

          {perspective !== 'admin' && activeSection === 'offers' && (
            <RwaOfferDesk offers={offers} accounts={accounts} onRefresh={loadData} onNotify={showToast} />
          )}

          {perspective !== 'admin' && activeSection === 'exchange' && (
            <GoldFxExchange rates={rates} />
          )}

          {perspective !== 'admin' && activeSection === 'rfq' && (
            <RfqTradeDesk rates={rates} accounts={accounts} onRefresh={loadData} onNotify={showToast} />
          )}

          {perspective !== 'admin' && activeSection === 'protocols' && (
            <OpsDashboard logs={logs} onRefresh={loadData} />
          )}

          {perspective !== 'admin' && activeSection === 'supervision' && (
            <SupervisoryRadar />
          )}

          {perspective !== 'admin' && activeSection === 'audit' && (
            <RegulatorDashboard accounts={accounts} holdings={holdings} onNotify={showToast} />
          )}
        </main>
      </div>

      <footer style={{ borderTop: '1px solid #E5E5E5', backgroundColor: '#FFFFFF', padding: '14px 24px', textAlign: 'center', fontSize: '12px', color: '#606060' }}>
        Red Broadcast Smart Financial Application • Enterprise RWA & Banking on Internet Computer • Rust + TypeScript
      </footer>
    </div>
  );
}

export default App;
