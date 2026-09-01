import type {
  DemandDepositRecord,
  FungibleAssetHolding,
  PrincipalProfile,
  BlindedIdentity,
  MarketRate,
  RwaOffer,
  SupervisionData,
  InstitutionalTxn,
  CollateralPosition,
  BondAuction,
  AuctionBid,
  CorporateAction,
  PendingApproval,
  VaultSensorTelemetry,
  SweepingRule,
  BridgeRoute,
  CanisterStatusInfo,
  LiquidityPool,
} from '../types';

const API_BASE = typeof window !== 'undefined' && (window.location.port === '8080' || window.location.host.includes(':8080'))
  ? '/api/v1'
  : 'http://localhost:8080/api/v1';

export async function fetchMarketRates(): Promise<MarketRate[]> {
  try {
    const res = await fetch(`${API_BASE}/rates`);
    if (res.ok) {
      const data = await res.json();
      return data.rates;
    }
  } catch (err) {
    console.warn('Backend rate fetch fallback to live ECB and Frankfurter API:', err);
  }

  // Live Free ECB Reference Rates via Frankfurter API (https://api.frankfurter.dev)
  try {
    const ecbRes = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR');
    if (ecbRes.ok) {
      const ecbData = await ecbRes.json();
      const usdRate = ecbData.rates?.USD || 1.0850;
      const chfRate = ecbData.rates?.CHF || 0.9580;
      const gbpRate = ecbData.rates?.GBP || 0.8540;

      return [
        {
          symbol: 'XAU/EUR',
          name: 'Swiss Allocated 999.9 Gold Bullion',
          category: 'Physical Commodity',
          iso24165_dti: 'DTI-GOLD-9999',
          price_usd: '2,912.40',
          price_eur: '84.50',
          change_24h: '+0.85%',
          backing: '100% 1:1 Physical Zurich Vault ZRH-01',
          liquidity_depth: '€450,000,000.00 EUR',
        },
        {
          symbol: 'sBOND/5Y',
          name: 'Swiss 5Y Sovereign Gold-Linked Bond',
          category: 'Sovereign Debt',
          iso24165_dti: 'DTI-BOND-8821',
          price_usd: (100 * usdRate).toFixed(2),
          price_eur: '100.00',
          change_24h: '+0.12%',
          backing: 'Swiss National Bank Fiduciary Backing',
          liquidity_depth: '€2,500,000,000.00 EUR',
        },
        {
          symbol: 'EUR/USD',
          name: 'Euro / US Dollar Fiduciary Corridor',
          category: 'FX Rail',
          price_usd: usdRate.toFixed(4),
          price_eur: '1.0000',
          change_24h: '+0.24%',
          backing: 'Official European Central Bank (ECB) Reference Rate',
          liquidity_depth: '€10,000,000,000.00 EUR',
        },
        {
          symbol: 'EUR/CHF',
          name: 'Euro / Swiss Franc Fiduciary Corridor',
          category: 'FX Rail',
          price_usd: (usdRate / chfRate).toFixed(4),
          price_eur: chfRate.toFixed(4),
          change_24h: '-0.08%',
          backing: 'Official European Central Bank (ECB) Reference Rate',
          liquidity_depth: '€8,000,000,000.00 EUR',
        },
        {
          symbol: 'EUR/GBP',
          name: 'Euro / British Pound Sterling',
          category: 'FX Rail',
          price_usd: (usdRate / gbpRate).toFixed(4),
          price_eur: gbpRate.toFixed(4),
          change_24h: '+0.15%',
          backing: 'Official European Central Bank (ECB) Reference Rate',
          liquidity_depth: '€5,000,000,000.00 EUR',
        },
      ];
    }
  } catch (e) {
    console.error('Failed to fetch from live Frankfurter API:', e);
  }

  // Fallback defaults
  return [
    {
      symbol: 'XAU/EUR',
      name: 'Swiss Allocated 999.9 Gold Bullion',
      category: 'Physical Commodity',
      iso24165_dti: 'DTI-GOLD-9999',
      price_usd: '2,912.40',
      price_eur: '84.50',
      change_24h: '+0.85%',
      backing: '100% 1:1 Physical Zurich Vault ZRH-01',
      liquidity_depth: '€450,000,000.00 EUR',
    },
    {
      symbol: 'sBOND/5Y',
      name: 'Swiss 5Y Sovereign Gold-Linked Bond',
      category: 'Sovereign Debt',
      iso24165_dti: 'DTI-BOND-8821',
      price_usd: '108.50',
      price_eur: '100.00',
      change_24h: '+0.12%',
      backing: 'Swiss National Bank Fiduciary Backing',
      liquidity_depth: '€2,500,000,000.00 EUR',
    },
  ];
}

export async function fetchAccounts(): Promise<DemandDepositRecord[]> {
  const res = await fetch(`${API_BASE}/accounts`);
  if (!res.ok) throw new Error('Failed to fetch accounts');
  return res.json();
}

export async function createAccount(payload: {
  custodian: string;
  owner: string;
  currency: string;
  overdraft_limit: string;
  daily_transfer_limit: string;
}): Promise<DemandDepositRecord> {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create account');
  }
  return res.json();
}

export async function transferCash(payload: {
  sender_id: string;
  recipient_id: string;
  amount: string;
  memo?: string;
  gl_code?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/accounts/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to transfer cash');
  }
  return res.json();
}

export async function fetchHoldings(): Promise<FungibleAssetHolding[]> {
  const res = await fetch(`${API_BASE}/holdings`);
  if (!res.ok) throw new Error('Failed to fetch holdings');
  return res.json();
}

export async function issueAsset(payload: {
  issuer: string;
  holder: string;
  currency: string;
  amount: string;
}): Promise<FungibleAssetHolding> {
  const res = await fetch(`${API_BASE}/assets/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to issue asset');
  }
  return res.json();
}

export async function transferAsset(payload: {
  sender: string;
  recipient: string;
  currency: string;
  amount: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/assets/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to transfer asset');
  }
  return res.json();
}

export async function fetchIdentities(): Promise<PrincipalProfile[]> {
  const res = await fetch(`${API_BASE}/identities`);
  if (!res.ok) throw new Error('Failed to fetch identities');
  return res.json();
}

export async function registerIdentity(payload: {
  principal: string;
  legal_name: string;
  role: string;
}): Promise<PrincipalProfile> {
  const res = await fetch(`${API_BASE}/identities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to register identity');
  }
  return res.json();
}

export async function blindIdentity(payload: {
  well_known: string;
  anonymous: string;
}): Promise<BlindedIdentity> {
  const res = await fetch(`${API_BASE}/identities/blind`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to swap blinded identity');
  }
  return res.json();
}

export async function executeRfqTrade(payload: {
  account_id: string;
  buyer_principal: string;
  asset_symbol: string;
  asset_amount: string;
  cash_amount: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/rfq/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'RFQ Trade Execution Failed');
  }
  return res.json();
}

export async function fetchOffers(): Promise<RwaOffer[]> {
  const res = await fetch(`${API_BASE}/offers`);
  if (!res.ok) throw new Error('Failed to fetch RWA offers');
  return res.json();
}

export async function createOffer(payload: {
  seller_principal: string;
  seller_legal_name: string;
  asset_symbol: string;
  asset_name: string;
  asset_amount: string;
  price_per_unit_eur: string;
}): Promise<RwaOffer> {
  const res = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create RWA offer');
  }
  return res.json();
}

export async function acceptOffer(payload: {
  offer_id: string;
  buyer_principal: string;
  buyer_account_id: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/offers/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to accept offer');
  }
  return res.json();
}

export async function fetchSupervision(): Promise<SupervisionData> {
  const res = await fetch(`${API_BASE}/admin/supervision`);
  if (!res.ok) throw new Error('Failed to fetch supervisory data');
  return res.json();
}

export async function fetchTransactions(): Promise<InstitutionalTxn[]> {
  const res = await fetch(`${API_BASE}/reporting/transactions`);
  if (!res.ok) throw new Error('Failed to fetch institutional transactions');
  return res.json();
}

export async function fetchStandardsMapping(): Promise<any> {
  const res = await fetch(`${API_BASE}/standards/mapping`);
  if (!res.ok) throw new Error('Failed to fetch standards mapping');
  return res.json();
}

export async function fetchCollateralPositions(): Promise<CollateralPosition[]> {
  const res = await fetch(`${API_BASE}/collateral/positions`);
  if (!res.ok) throw new Error('Failed to fetch collateral positions');
  return res.json();
}

export async function postCollateral(payload: {
  asset_symbol: string;
  asset_name: string;
  amount: string;
  market_value_eur: string;
  haircut_percent: string;
  pledgee: string;
}): Promise<CollateralPosition> {
  const res = await fetch(`${API_BASE}/collateral/positions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to post collateral');
  }
  return res.json();
}

export async function fetchAuctions(): Promise<BondAuction[]> {
  const res = await fetch(`${API_BASE}/auctions`);
  if (!res.ok) throw new Error('Failed to fetch bond auctions');
  return res.json();
}

export async function submitAuctionBid(payload: {
  auction_id: string;
  bidder_legal: string;
  amount_eur: string;
  bid_yield_pct: string;
}): Promise<AuctionBid> {
  const res = await fetch(`${API_BASE}/auctions/bid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit bid');
  }
  return res.json();
}

export async function fetchCorporateActions(): Promise<CorporateAction[]> {
  const res = await fetch(`${API_BASE}/corporate-actions`);
  if (!res.ok) throw new Error('Failed to fetch corporate actions');
  return res.json();
}

export async function executeCorporateAction(action_id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/corporate-actions/distribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action_id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Corporate action payout failed');
  }
  return res.json();
}

export async function fetchApprovals(): Promise<PendingApproval[]> {
  const res = await fetch(`${API_BASE}/governance/approvals`);
  if (!res.ok) throw new Error('Failed to fetch approval queue');
  return res.json();
}

export async function approveGovernanceItem(approval_id: string, checker_signer: string): Promise<any> {
  const res = await fetch(`${API_BASE}/governance/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approval_id, checker_signer }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Governance signature rejected');
  }
  return res.json();
}

export async function fetchVaultTelemetry(): Promise<VaultSensorTelemetry> {
  const res = await fetch(`${API_BASE}/vault/telemetry`);
  if (!res.ok) throw new Error('Failed to fetch vault telemetry');
  return res.json();
}

export async function fetchSweepingRules(): Promise<SweepingRule[]> {
  const res = await fetch(`${API_BASE}/treasury/sweeper`);
  if (!res.ok) throw new Error('Failed to fetch sweeping rules');
  return res.json();
}

export async function createSweepingRule(payload: {
  source_account: string;
  target_asset: string;
  threshold_eur: string;
  frequency: string;
}): Promise<SweepingRule> {
  const res = await fetch(`${API_BASE}/treasury/sweeper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create sweeping rule');
  }
  return res.json();
}

export async function fetchBridgeRoutes(): Promise<BridgeRoute[]> {
  const res = await fetch(`${API_BASE}/bridge/routes`);
  if (!res.ok) throw new Error('Failed to fetch bridge routes');
  return res.json();
}

export async function executeBridgeTransfer(payload: {
  source_network: string;
  target_network: string;
  asset_symbol: string;
  amount: string;
  recipient_address: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/bridge/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Bridge transfer failed');
  }
  return res.json();
}

export async function fetchCanisters(): Promise<CanisterStatusInfo[]> {
  const res = await fetch(`${API_BASE}/canisters`);
  if (!res.ok) throw new Error('Failed to fetch canisters');
  return res.json();
}

export async function topUpCanister(canister_id: string, cycles_to_add_tc: string): Promise<any> {
  const res = await fetch(`${API_BASE}/canisters/topup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ canister_id, cycles_to_add_tc }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Top-up failed');
  }
  return res.json();
}

export async function fetchLiquidityPools(): Promise<LiquidityPool[]> {
  const res = await fetch(`${API_BASE}/liquidity/pools`);
  if (!res.ok) throw new Error('Failed to fetch liquidity pools');
  return res.json();
}

export async function fetchBondContracts(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/factory/bonds`);
  if (!res.ok) throw new Error('Failed to fetch sovereign bond contracts');
  return res.json();
}

export async function createBondContract(payload: {
  issuer_name: string;
  issuer_principal: string;
  isin_code: string;
  dti_code: string;
  currency: string;
  notional_volume_eur: string;
  coupon_rate_pct: string;
  coupon_frequency: string;
  actus_contract_type: string;
  maturity_date: string;
  auction_mechanism: string;
  collateral_backing: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/factory/bonds/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to deploy sovereign bond canister');
  }
  return res.json();
}

export const issueBlindedIdentity = blindIdentity;
export const fetchSupervisionData = fetchSupervision;

export function getCsvExportUrl(): string {
  return `${API_BASE}/reporting/export/csv`;
}

export function getJsonExportUrl(): string {
  return `${API_BASE}/reporting/export/json`;
}
