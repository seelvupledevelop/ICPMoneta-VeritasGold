import type { DemandDepositRecord, FungibleAssetHolding, PrincipalProfile, BlindedIdentity, MarketRate, RwaOffer, SupervisionData, InstitutionalTxn, CollateralPosition, BondAuction, AuctionBid, CorporateAction, PendingApproval, VaultSensorTelemetry, SweepingRule } from '../types';

const API_BASE = 'http://localhost:8080/api/v1';

export async function fetchMarketRates(): Promise<MarketRate[]> {
  const res = await fetch(`${API_BASE}/rates`);
  if (!res.ok) throw new Error('Failed to fetch market rates');
  const data = await res.json();
  return data.rates;
}

export async function fetchAccounts(): Promise<DemandDepositRecord[]> {
  const res = await fetch(`${API_BASE}/accounts`);
  if (!res.ok) throw new Error('Failed to fetch accounts');
  return res.json();
}

export async function createAccount(data: {
  custodian: string;
  owner: string;
  currency: string;
  overdraft_limit: string;
  daily_transfer_limit: string;
}): Promise<DemandDepositRecord> {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create account');
  }
  return res.json();
}

export async function transferCash(data: {
  sender_id: string;
  recipient_id: string;
  amount: string;
  memo?: string;
  gl_code?: string;
}) {
  const res = await fetch(`${API_BASE}/accounts/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to execute cash transfer');
  }
  return res.json();
}

export async function fetchHoldings(): Promise<FungibleAssetHolding[]> {
  const res = await fetch(`${API_BASE}/holdings`);
  if (!res.ok) throw new Error('Failed to fetch digital assets');
  return res.json();
}

export async function issueAsset(data: {
  issuer: string;
  holder: string;
  currency: string;
  amount: string;
}): Promise<FungibleAssetHolding> {
  const res = await fetch(`${API_BASE}/assets/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to issue asset');
  }
  return res.json();
}

export async function transferAsset(data: {
  sender: string;
  recipient: string;
  currency: string;
  amount: string;
}) {
  const res = await fetch(`${API_BASE}/assets/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to transfer asset');
  }
  return res.json();
}

export async function fetchIdentities(): Promise<PrincipalProfile[]> {
  const res = await fetch(`${API_BASE}/identities`);
  if (!res.ok) throw new Error('Failed to fetch verified identities');
  return res.json();
}

export async function registerIdentity(data: {
  principal: string;
  legal_name: string;
  role: string;
}): Promise<PrincipalProfile> {
  const res = await fetch(`${API_BASE}/identities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to register identity');
  }
  return res.json();
}

export async function issueBlindedIdentity(data: {
  well_known: string;
  anonymous: string;
}): Promise<BlindedIdentity> {
  const res = await fetch(`${API_BASE}/identities/blind`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to swap blinded identity');
  }
  return res.json();
}

export async function executeRfqTrade(data: {
  account_id: string;
  buyer_principal: string;
  asset_symbol: string;
  asset_amount: string;
  cash_amount: string;
}) {
  const res = await fetch(`${API_BASE}/rfq/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to execute RFQ atomic trade');
  }
  return res.json();
}

export async function fetchOffers(): Promise<RwaOffer[]> {
  const res = await fetch(`${API_BASE}/offers`);
  if (!res.ok) throw new Error('Failed to fetch RWA offers');
  return res.json();
}

export async function createOffer(data: {
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
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create offer');
  }
  return res.json();
}

export async function acceptOffer(data: {
  offer_id: string;
  buyer_principal: string;
  buyer_account_id: string;
}) {
  const res = await fetch(`${API_BASE}/offers/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to accept offer');
  }
  return res.json();
}

export async function fetchSupervisionData(): Promise<SupervisionData> {
  const res = await fetch(`${API_BASE}/admin/supervision`);
  if (!res.ok) throw new Error('Failed to fetch supervision data');
  return res.json();
}

export async function fetchTransactions(): Promise<InstitutionalTxn[]> {
  const res = await fetch(`${API_BASE}/reporting/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transaction history');
  return res.json();
}

export function getCsvExportUrl(): string {
  return `${API_BASE}/reporting/export/csv`;
}

export async function fetchCollateralPositions(): Promise<CollateralPosition[]> {
  const res = await fetch(`${API_BASE}/collateral/positions`);
  if (!res.ok) throw new Error('Failed to fetch collateral positions');
  return res.json();
}

export async function postCollateral(data: {
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
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to post collateral');
  }
  return res.json();
}

export function getJsonExportUrl(): string {
  return `${API_BASE}/reporting/export/json`;
}

export async function fetchStandardsMapping() {
  const res = await fetch(`${API_BASE}/standards/mapping`);
  if (!res.ok) throw new Error('Failed to fetch standards mapping');
  return res.json();
}

export async function fetchAuctions(): Promise<BondAuction[]> {
  const res = await fetch(`${API_BASE}/api/v1/auctions`);
  if (!res.ok) throw new Error('Failed to fetch auctions');
  return res.json();
}

export async function submitAuctionBid(payload: {
  auction_id: string;
  bidder_legal: string;
  amount_eur: string;
  bid_yield_pct: string;
}): Promise<AuctionBid> {
  const res = await fetch(`${API_BASE}/api/v1/auctions/bid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit auction bid');
  }
  return res.json();
}

export async function fetchCorporateActions(): Promise<CorporateAction[]> {
  const res = await fetch(`${API_BASE}/api/v1/corporate-actions`);
  if (!res.ok) throw new Error('Failed to fetch corporate actions');
  return res.json();
}

export async function executeCorporateAction(action_id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/corporate-actions/distribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action_id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to execute corporate action');
  }
  return res.json();
}

export async function fetchApprovals(): Promise<PendingApproval[]> {
  const res = await fetch(`${API_BASE}/api/v1/governance/approvals`);
  if (!res.ok) throw new Error('Failed to fetch approvals');
  return res.json();
}

export async function approveGovernanceItem(approval_id: string, checker_signer: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/governance/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approval_id, checker_signer }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to approve item');
  }
  return res.json();
}

export async function fetchVaultTelemetry(): Promise<VaultSensorTelemetry> {
  const res = await fetch(`${API_BASE}/api/v1/vault/telemetry`);
  if (!res.ok) throw new Error('Failed to fetch vault telemetry');
  return res.json();
}

export async function fetchSweepingRules(): Promise<SweepingRule[]> {
  const res = await fetch(`${API_BASE}/api/v1/treasury/sweeper`);
  if (!res.ok) throw new Error('Failed to fetch sweeping rules');
  return res.json();
}

export async function createSweepingRule(payload: {
  source_account: string;
  target_asset: string;
  threshold_eur: string;
  frequency: string;
}): Promise<SweepingRule> {
  const res = await fetch(`${API_BASE}/api/v1/treasury/sweeper`, {
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
