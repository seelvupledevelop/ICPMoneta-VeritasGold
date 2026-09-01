import type { DemandDepositRecord, FungibleAssetHolding, PrincipalProfile, BlindedIdentity, MarketRate, RwaOffer, SupervisionData } from '../types';

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
