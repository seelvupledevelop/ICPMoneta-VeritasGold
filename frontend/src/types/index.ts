export type PrincipalId = string;
export type AccountId = string;
export type HoldingId = string;
export type CurrencyCode = string;

export type Perspective = 'trader' | 'issuer' | 'ops' | 'regulator' | 'admin';
export type AppSection =
  | 'portfolio'
  | 'vault'
  | 'notaries'
  | 'trade'
  | 'collateral'
  | 'interoperability'
  | 'compliance'
  | 'logs'
  | 'support';

export interface Amount {
  value_str: string;
}

export interface DemandDepositRecord {
  account_id: string;
  custodian: string;
  owner: string;
  currency: string;
  balance: Amount;
  overdraft_limit: Amount;
  daily_withdrawal_limit: Amount;
  daily_transfer_limit: Amount;
  accumulated_daily_debit: Amount;
  status: 'Active' | { Suspended: { reason: string; by: string; timestamp: number } } | { Closed: { by: string; timestamp: number } };
  updated_at: number;
}

export interface FungibleAssetHolding {
  holding_id: string;
  asset_symbol: string;
  issuer: string;
  holder: string;
  amount: Amount;
  pointer: {
    update_id: string;
    output_index: number;
  };
  status: 'Unconsumed' | { Consumed: { consuming_update_id: string; consumed_at: number } };
}

export interface PrincipalProfile {
  principal: string;
  legal_name: string;
  role: string;
  is_verified: boolean;
  registered_at: number;
}

export interface BlindedIdentity {
  anonymous_principal: string;
  well_known_principal: string;
  ownership_proof_signature: number[];
  created_at: number;
}

export interface MarketRate {
  symbol: string;
  name: string;
  category: string;
  iso24165_dti?: string;
  price_usd: string;
  price_eur: string;
  change_24h: string;
  backing: string;
  liquidity_depth: string;
}

export interface RwaOffer {
  offer_id: string;
  seller_principal: string;
  seller_legal_name: string;
  asset_symbol: string;
  asset_name: string;
  asset_amount: string;
  price_per_unit_eur: string;
  total_price_eur: string;
  status: string;
  created_at: number;
}

export interface UnmaskedFlow {
  anonymous_id: string;
  unmasked_legal_owner: string;
  net_exposure_eur: string;
  rwa_gold_holdings_oz?: string;
  rwa_bond_holdings_usd?: string;
  risk_tier: string;
}

export interface SupervisionData {
  supervision_timestamp: number;
  radar_status: string;
  double_spend_attempts_intercepted: number;
  total_active_canister_partitions: number;
  regulatory_unmasking_authority: string;
  iso20022_compliance_mode?: string;
  unmasked_active_flows: UnmaskedFlow[];
}

export interface InstitutionalTxn {
  txn_id: string;
  booking_date: string;
  value_date: string;
  gl_code: string;
  txn_type: string;
  iso20022_msg?: string;
  iso24165_dti?: string;
  actus_contract_type?: string;
  swift_on_off_ramp_code?: string;
  canister_principal_id?: string;
  sender_legal: string;
  recipient_legal: string;
  amount: string;
  currency: string;
  debit_credit: string;
  memo: string;
  onchain_hash: string;
  finality_receipt: string;
  status: string;
}

export interface CollateralPosition {
  position_id: string;
  asset_symbol: string;
  asset_name: string;
  pledged_amount: string;
  market_value_eur: string;
  haircut_percent: string;
  borrowing_capacity_eur: string;
  custodian: string;
  pledgee: string;
  status: string;
}

export interface NotaryNode {
  id: string;
  name: string;
  latency_ms: number;
  status: 'online' | 'offline';
  is_leader?: boolean;
}

export interface DoubleSpendLog {
  timestamp: string;
  stateref: string;
  requesting_party: string;
  status: 'VALIDATED' | 'REJECTED';
  signatures: string;
}

export interface ProtocolLog {
  id: string;
  type: 'CashTransfer' | 'AssetTransfer' | 'BlindedSwap' | 'AssetIssue' | 'AtomicDvPTrade' | 'AtomicP2POfferExecution';
  sender: string;
  recipient: string;
  amount: string;
  currency: string;
  status: 'Finalized' | 'InputsLocked' | 'Validating' | 'Failed';
  step: string;
  timestamp: string;
}
