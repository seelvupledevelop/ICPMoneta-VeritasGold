use crate::CanisterEnvironment;
use axum::{
    extract::State,
    http::{header, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use domain::accounts::DemandDepositRecord;
use domain::assets::FungibleAssetHolding;
use domain::identities::{BlindedIdentity, PrincipalProfile};
use domain::primitives::{AccountId, Amount, CurrencyCode, PrincipalId};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::{Arc, RwLock};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

#[derive(Clone, Serialize, Deserialize)]
pub struct RwaOffer {
    pub offer_id: String,
    pub seller_principal: String,
    pub seller_legal_name: String,
    pub asset_symbol: String,
    pub asset_name: String,
    pub asset_amount: String,
    pub price_per_unit_eur: String,
    pub total_price_eur: String,
    pub status: String,
    pub created_at: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct InstitutionalTxn {
    pub txn_id: String,
    pub booking_date: String,
    pub value_date: String,
    pub gl_code: String,
    pub txn_type: String,
    pub iso20022_msg: String,
    pub iso24165_dti: String,
    pub actus_contract_type: String,
    pub swift_on_off_ramp_code: String,
    pub canister_principal_id: String,
    pub sender_legal: String,
    pub recipient_legal: String,
    pub amount: String,
    pub currency: String,
    pub debit_credit: String,
    pub memo: String,
    pub onchain_hash: String,
    pub finality_receipt: String,
    pub status: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct CollateralPosition {
    pub position_id: String,
    pub asset_symbol: String,
    pub asset_name: String,
    pub pledged_amount: String,
    pub market_value_eur: String,
    pub haircut_percent: String,
    pub borrowing_capacity_eur: String,
    pub custodian: String,
    pub pledgee: String,
    pub status: String,
}

#[derive(Clone)]
pub struct ServerState {
    pub env: Arc<CanisterEnvironment>,
    pub offers: Arc<RwLock<Vec<RwaOffer>>>,
    pub transactions: Arc<RwLock<Vec<InstitutionalTxn>>>,
    pub collateral: Arc<RwLock<Vec<CollateralPosition>>>,
}

#[derive(Deserialize)]
pub struct CreateAccountRequest {
    pub custodian: String,
    pub owner: String,
    pub currency: String,
    pub overdraft_limit: String,
    pub daily_transfer_limit: String,
}

#[derive(Deserialize)]
pub struct CashTransferRequest {
    pub sender_id: String,
    pub recipient_id: String,
    pub amount: String,
    pub memo: Option<String>,
    pub gl_code: Option<String>,
}

#[derive(Deserialize)]
pub struct IssueAssetRequest {
    pub issuer: String,
    pub holder: String,
    pub currency: String,
    pub amount: String,
}

#[derive(Deserialize)]
pub struct AssetTransferRequest {
    pub sender: String,
    pub recipient: String,
    pub currency: String,
    pub amount: String,
}

#[derive(Deserialize)]
pub struct RegisterIdentityRequest {
    pub principal: String,
    pub legal_name: String,
    pub role: String,
}

#[derive(Deserialize)]
pub struct BlindIdentityRequest {
    pub well_known: String,
    pub anonymous: String,
}

#[derive(Deserialize)]
pub struct RfqExecuteRequest {
    pub account_id: String,
    pub buyer_principal: String,
    pub asset_symbol: String,
    pub asset_amount: String,
    pub cash_amount: String,
}

#[derive(Deserialize)]
pub struct CreateOfferRequest {
    pub seller_principal: String,
    pub seller_legal_name: String,
    pub asset_symbol: String,
    pub asset_name: String,
    pub asset_amount: String,
    pub price_per_unit_eur: String,
}

#[derive(Deserialize)]
pub struct AcceptOfferRequest {
    pub offer_id: String,
    pub buyer_principal: String,
    pub buyer_account_id: String,
}

#[derive(Deserialize)]
pub struct PostCollateralRequest {
    pub asset_symbol: String,
    pub asset_name: String,
    pub amount: String,
    pub market_value_eur: String,
    pub haircut_percent: String,
    pub pledgee: String,
}

pub fn create_app(state: ServerState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/health", get(health_check))
        .route("/api/v1/rates", get(get_market_rates))
        .route("/api/v1/accounts", get(list_accounts).post(create_account))
        .route("/api/v1/accounts/transfer", post(transfer_cash))
        .route("/api/v1/holdings", get(list_holdings))
        .route("/api/v1/assets/issue", post(issue_asset))
        .route("/api/v1/assets/transfer", post(transfer_asset))
        .route("/api/v1/identities", get(list_identities).post(register_identity))
        .route("/api/v1/identities/blind", post(issue_blinded_identity))
        .route("/api/v1/rfq/execute", post(execute_rfq_trade))
        .route("/api/v1/offers", get(list_offers).post(create_rwa_offer))
        .route("/api/v1/offers/accept", post(accept_rwa_offer))
        .route("/api/v1/admin/supervision", get(get_admin_supervision))
        .route("/api/v1/reporting/transactions", get(list_transactions))
        .route("/api/v1/reporting/export/csv", get(export_transactions_csv))
        .route("/api/v1/reporting/export/json", get(export_transactions_json))
        .route("/api/v1/standards/mapping", get(get_standards_mapping))
        .route("/api/v1/collateral/positions", get(list_collateral).post(post_collateral))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, Json(json!({ "status": "healthy", "chain": "icp-canister-suite", "version": "0.1.0" })))
}

async fn get_market_rates() -> impl IntoResponse {
    (StatusCode::OK, Json(json!({
        "timestamp": chrono::Utc::now().timestamp_millis(),
        "rates": [
            {
                "symbol": "GOLD",
                "name": "LBMA Physical Gold (1 oz)",
                "category": "Precious Metal",
                "iso24165_dti": "DTI-GOLD-8821",
                "price_usd": "2745.50",
                "price_eur": "2542.10",
                "change_24h": "+1.35%",
                "backing": "Allocated Physical Bar in Zurich Vault",
                "liquidity_depth": "5,000 oz"
            },
            {
                "symbol": "USTB",
                "name": "US Treasury 3M Bill (AA+)",
                "category": "Sovereign Debt Bond",
                "iso24165_dti": "DTI-USTB-3312",
                "price_usd": "987.25",
                "price_eur": "914.10",
                "change_24h": "+0.04%",
                "backing": "Direct US Sovereign Guarantee",
                "liquidity_depth": "$50,000,000"
            },
            {
                "symbol": "EURD",
                "name": "Tokenized Deposit Euro (EURD)",
                "category": "Tokenized Bank Deposit",
                "iso24165_dti": "DTI-EURD-9941",
                "price_usd": "1.08",
                "price_eur": "1.00",
                "change_24h": "0.00%",
                "backing": "Central Bank Settlement Reserve",
                "liquidity_depth": "€100,000,000"
            },
            {
                "symbol": "USDD",
                "name": "Tokenized Deposit Dollar (USDD)",
                "category": "Tokenized Bank Deposit",
                "iso24165_dti": "DTI-USDD-1024",
                "price_usd": "1.00",
                "price_eur": "0.925",
                "change_24h": "0.00%",
                "backing": "Tier-1 Depository Bank",
                "liquidity_depth": "$100,000,000"
            },
            {
                "symbol": "PROP_ZH",
                "name": "Prime Zurich Commercial RE",
                "category": "Real Estate Equity",
                "iso24165_dti": "DTI-PROP-ZH44",
                "price_usd": "50.00",
                "price_eur": "46.30",
                "change_24h": "+0.85%",
                "backing": "Title Deed Notarized in Canton Zurich",
                "liquidity_depth": "10,000 Units"
            },
            {
                "symbol": "ICP",
                "name": "Internet Computer Utility Token",
                "category": "Native Blockchain Compute",
                "iso24165_dti": "DTI-ICP-0001",
                "price_usd": "8.45",
                "price_eur": "7.82",
                "change_24h": "+3.12%",
                "backing": "Decentralized Network Cycles",
                "liquidity_depth": "250,000 ICP"
            }
        ]
    })))
}

async fn list_accounts(State(state): State<ServerState>) -> impl IntoResponse {
    let alice = PrincipalId::new_user(3);
    let bob = PrincipalId::new_user(4);
    let mut all = state.env.settlement_engine.get_participant_accounts(&alice);
    all.extend(state.env.settlement_engine.get_participant_accounts(&bob));
    (StatusCode::OK, Json(all))
}

async fn create_account(
    State(state): State<ServerState>,
    Json(payload): Json<CreateAccountRequest>,
) -> Result<(StatusCode, Json<DemandDepositRecord>), (StatusCode, Json<serde_json::Value>)> {
    let custodian = PrincipalId::from_text(&payload.custodian).unwrap_or_else(|_| PrincipalId::new_user(2));
    let owner = PrincipalId::from_text(&payload.owner).unwrap_or_else(|_| PrincipalId::new_user(3));
    let currency = CurrencyCode::new(&payload.currency).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let overdraft = Amount::from_str_strict(&payload.overdraft_limit).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let daily_limit = Amount::from_str_strict(&payload.daily_transfer_limit).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    let account = state
        .env
        .position_ledger
        .create_demand_deposit_account(custodian, owner, currency, overdraft, daily_limit, chrono::Utc::now().timestamp_millis() as u64)
        .map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    Ok((StatusCode::CREATED, Json(account)))
}

async fn transfer_cash(
    State(state): State<ServerState>,
    Json(payload): Json<CashTransferRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let now = chrono::Utc::now();
    let sender = AccountId::new(&payload.sender_id);
    let recipient = AccountId::new(&payload.recipient_id);
    let amount = Amount::from_str_strict(&payload.amount).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    let (proto_id, s_acc, r_acc) = state
        .env
        .transfer_cash(&sender, &recipient, &amount, now.timestamp_millis() as u64)
        .map_err(|e| (StatusCode::UNPROCESSABLE_ENTITY, Json(json!({ "error": e.to_string() }))))?;

    let txn = InstitutionalTxn {
        txn_id: format!("TXN-{}-{}", now.format("%Y%m%d"), &uuid::Uuid::new_v4().to_string()[..6].to_uppercase()),
        booking_date: now.format("%Y-%m-%d %H:%M:%S UTC").to_string(),
        value_date: now.format("%Y-%m-%d").to_string(),
        gl_code: payload.gl_code.unwrap_or_else(|| "1010-01".to_string()),
        txn_type: "CrossBorderTokenizedWire".to_string(),
        iso20022_msg: "pacs.008.001.10".to_string(),
        iso24165_dti: "DTI-EURD-9941".to_string(),
        actus_contract_type: "PAM".to_string(),
        swift_on_off_ramp_code: "SWIFT-ONRAMP-CH93-UBSWCHZH".to_string(),
        canister_principal_id: "rrkah-fqaaa-aaaaa-aaaaq-cai".to_string(),
        sender_legal: "Alice Trading Corp (Zurich)".to_string(),
        recipient_legal: "Bob Commodities LLC (Frankfurt)".to_string(),
        amount: payload.amount.clone(),
        currency: s_acc.currency.to_string(),
        debit_credit: "Debit".to_string(),
        memo: payload.memo.unwrap_or_else(|| "Corporate Treasury Transfer".to_string()),
        onchain_hash: format!("0x{:x}", md5::compute(proto_id.to_string())),
        finality_receipt: proto_id.to_string(),
        status: "Finalized".to_string(),
    };

    let mut lock = state.transactions.write().unwrap();
    lock.insert(0, txn.clone());

    Ok(Json(json!({
        "protocol_id": proto_id.to_string(),
        "txn_id": txn.txn_id,
        "iso20022_msg": txn.iso20022_msg,
        "iso24165_dti": txn.iso24165_dti,
        "swift_on_off_ramp_code": txn.swift_on_off_ramp_code,
        "canister_principal_id": txn.canister_principal_id,
        "sender": s_acc,
        "recipient": r_acc,
        "status": "Finalized"
    })))
}

async fn list_holdings(State(state): State<ServerState>) -> impl IntoResponse {
    let alice = PrincipalId::new_user(3);
    let bob = PrincipalId::new_user(4);
    let mut all = state.env.settlement_engine.get_participant_holdings(&alice);
    all.extend(state.env.settlement_engine.get_participant_holdings(&bob));
    (StatusCode::OK, Json(all))
}

async fn issue_asset(
    State(state): State<ServerState>,
    Json(payload): Json<IssueAssetRequest>,
) -> Result<(StatusCode, Json<FungibleAssetHolding>), (StatusCode, Json<serde_json::Value>)> {
    let issuer = PrincipalId::from_text(&payload.issuer).unwrap_or_else(|_| PrincipalId::new_user(2));
    let holder = PrincipalId::from_text(&payload.holder).unwrap_or_else(|_| PrincipalId::new_user(3));
    let currency = CurrencyCode::new(&payload.currency).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let amount = Amount::from_str_strict(&payload.amount).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    let (holding, _receipt) = state
        .env
        .asset_ledger
        .issue_fungible_asset(issuer, holder, currency, amount, chrono::Utc::now().timestamp_millis() as u64)
        .map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    Ok((StatusCode::CREATED, Json(holding)))
}

async fn transfer_asset(
    State(state): State<ServerState>,
    Json(payload): Json<AssetTransferRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let sender = PrincipalId::from_text(&payload.sender).unwrap_or_else(|_| PrincipalId::new_user(3));
    let recipient = PrincipalId::from_text(&payload.recipient).unwrap_or_else(|_| PrincipalId::new_user(4));
    let currency = CurrencyCode::new(&payload.currency).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let amount = Amount::from_str_strict(&payload.amount).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    let (proto_id, transferred, change, receipt) = state
        .env
        .transfer_asset(sender, recipient, currency, amount, chrono::Utc::now().timestamp_millis() as u64)
        .map_err(|e| (StatusCode::UNPROCESSABLE_ENTITY, Json(json!({ "error": e.to_string() }))))?;

    Ok(Json(json!({
        "protocol_id": proto_id.to_string(),
        "transferred": transferred,
        "change": change,
        "receipt": receipt,
        "status": "Finalized"
    })))
}

async fn list_identities(State(state): State<ServerState>) -> impl IntoResponse {
    let alice = PrincipalId::new_user(3);
    let bob = PrincipalId::new_user(4);
    let bank = PrincipalId::new_user(2);
    let mut profiles = Vec::new();
    if let Some(p) = state.env.identity_registry.get_profile(&alice) { profiles.push(p); }
    if let Some(p) = state.env.identity_registry.get_profile(&bob) { profiles.push(p); }
    if let Some(p) = state.env.identity_registry.get_profile(&bank) { profiles.push(p); }
    (StatusCode::OK, Json(profiles))
}

async fn register_identity(
    State(state): State<ServerState>,
    Json(payload): Json<RegisterIdentityRequest>,
) -> Result<(StatusCode, Json<PrincipalProfile>), (StatusCode, Json<serde_json::Value>)> {
    let principal = PrincipalId::from_text(&payload.principal).unwrap_or_else(|_| PrincipalId::new_user(3));
    let profile = state
        .env
        .identity_registry
        .register_profile(principal, payload.legal_name, payload.role, chrono::Utc::now().timestamp_millis() as u64)
        .map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    Ok((StatusCode::CREATED, Json(profile)))
}

async fn issue_blinded_identity(
    State(state): State<ServerState>,
    Json(payload): Json<BlindIdentityRequest>,
) -> Result<(StatusCode, Json<BlindedIdentity>), (StatusCode, Json<serde_json::Value>)> {
    let well_known = PrincipalId::from_text(&payload.well_known).unwrap_or_else(|_| PrincipalId::new_user(3));
    let anonymous = PrincipalId::from_text(&payload.anonymous).unwrap_or_else(|_| PrincipalId::new_user(5));

    let (_proto_id, identity) = state
        .env
        .swap_blinded_identity(well_known, anonymous, chrono::Utc::now().timestamp_millis() as u64)
        .map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    Ok((StatusCode::CREATED, Json(identity)))
}

async fn execute_rfq_trade(
    State(state): State<ServerState>,
    Json(payload): Json<RfqExecuteRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let now = chrono::Utc::now();
    let acc_id = AccountId::new(&payload.account_id);
    let cash_amt = Amount::from_str_strict(&payload.cash_amount).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let asset_symbol = CurrencyCode::new(&payload.asset_symbol).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let asset_amt = Amount::from_str_strict(&payload.asset_amount).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let buyer = PrincipalId::from_text(&payload.buyer_principal).unwrap_or_else(|_| PrincipalId::new_user(3));
    let vault_custodian = PrincipalId::new_user(2);

    let mut account = state
        .env
        .settlement_engine
        .get_account(&acc_id)
        .ok_or_else(|| (StatusCode::NOT_FOUND, Json(json!({ "error": "Account not found" }))))?;

    account.apply_debit(&cash_amt, now.timestamp_millis() as u64).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    state.env.settlement_engine.register_account(account.clone());

    let (holding, receipt) = state
        .env
        .asset_ledger
        .issue_fungible_asset(vault_custodian, buyer, asset_symbol, asset_amt, now.timestamp_millis() as u64)
        .map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    let txn = InstitutionalTxn {
        txn_id: format!("TXN-{}-{}", now.format("%Y%m%d"), &uuid::Uuid::new_v4().to_string()[..6].to_uppercase()),
        booking_date: now.format("%Y-%m-%d %H:%M:%S UTC").to_string(),
        value_date: now.format("%Y-%m-%d").to_string(),
        gl_code: "1520-03".to_string(),
        txn_type: "AtomicDvPRfqSettlement".to_string(),
        iso20022_msg: "sese.023.001.09".to_string(),
        iso24165_dti: "DTI-GOLD-8821".to_string(),
        actus_contract_type: "PAM".to_string(),
        swift_on_off_ramp_code: "SWIFT-DVP-ZURICH-VAULT".to_string(),
        canister_principal_id: "rrkah-fqaaa-aaaaa-aaaaq-cai".to_string(),
        sender_legal: "Alice Trading Corp (Zurich)".to_string(),
        recipient_legal: "Swiss Vault Depository".to_string(),
        amount: payload.cash_amount,
        currency: "EUR".to_string(),
        debit_credit: "Debit_Cash_Credit_RWA".to_string(),
        memo: format!("Guaranteed RFQ Purchase {} {}", payload.asset_amount, payload.asset_symbol),
        onchain_hash: receipt.update_id.to_string(),
        finality_receipt: receipt.update_id.to_string(),
        status: "Finalized".to_string(),
    };

    let mut lock = state.transactions.write().unwrap();
    lock.insert(0, txn.clone());

    Ok(Json(json!({
        "status": "Finalized",
        "trade_type": "AtomicDvPSettlement",
        "txn_id": txn.txn_id,
        "iso20022_msg": txn.iso20022_msg,
        "iso24165_dti": txn.iso24165_dti,
        "canister_principal_id": txn.canister_principal_id,
        "debited_account": account,
        "issued_rwa_holding": holding,
        "receipt": receipt,
        "timestamp": now.timestamp_millis() as u64
    })))
}

async fn list_offers(State(state): State<ServerState>) -> impl IntoResponse {
    let offers = state.offers.read().unwrap().clone();
    (StatusCode::OK, Json(offers))
}

async fn create_rwa_offer(
    State(state): State<ServerState>,
    Json(payload): Json<CreateOfferRequest>,
) -> Result<(StatusCode, Json<RwaOffer>), (StatusCode, Json<serde_json::Value>)> {
    let now = chrono::Utc::now().timestamp_millis() as u64;
    let qty = payload.asset_amount.parse::<f64>().map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid quantity" }))))?;
    let rate = payload.price_per_unit_eur.parse::<f64>().map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid unit rate" }))))?;
    let total = format!("{:.2}", qty * rate);

    let offer = RwaOffer {
        offer_id: format!("OFFER-{}", &uuid::Uuid::new_v4().to_string()[..8].to_uppercase()),
        seller_principal: payload.seller_principal,
        seller_legal_name: payload.seller_legal_name,
        asset_symbol: payload.asset_symbol,
        asset_name: payload.asset_name,
        asset_amount: payload.asset_amount,
        price_per_unit_eur: payload.price_per_unit_eur,
        total_price_eur: total,
        status: "Active".to_string(),
        created_at: now,
    };

    let mut lock = state.offers.write().unwrap();
    lock.insert(0, offer.clone());

    Ok((StatusCode::CREATED, Json(offer)))
}

async fn accept_rwa_offer(
    State(state): State<ServerState>,
    Json(payload): Json<AcceptOfferRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let now = chrono::Utc::now();
    let mut lock = state.offers.write().unwrap();
    let offer = lock
        .iter_mut()
        .find(|o| o.offer_id == payload.offer_id && o.status == "Active")
        .ok_or_else(|| (StatusCode::NOT_FOUND, Json(json!({ "error": "Active offer not found" }))))?;

    let acc_id = AccountId::new(&payload.buyer_account_id);
    let cash_amt = Amount::from_str_strict(&offer.total_price_eur).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let asset_symbol = CurrencyCode::new(&offer.asset_symbol).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let asset_amt = Amount::from_str_strict(&offer.asset_amount).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    let buyer = PrincipalId::from_text(&payload.buyer_principal).unwrap_or_else(|_| PrincipalId::new_user(3));
    let seller = PrincipalId::from_text(&offer.seller_principal).unwrap_or_else(|_| PrincipalId::new_user(4));

    let mut buyer_acc = state
        .env
        .settlement_engine
        .get_account(&acc_id)
        .ok_or_else(|| (StatusCode::NOT_FOUND, Json(json!({ "error": "Buyer cash account not found" }))))?;

    buyer_acc.apply_debit(&cash_amt, now.timestamp_millis() as u64).map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;
    state.env.settlement_engine.register_account(buyer_acc.clone());

    let (holding, receipt) = state
        .env
        .asset_ledger
        .issue_fungible_asset(seller, buyer, asset_symbol, asset_amt, now.timestamp_millis() as u64)
        .map_err(|e| (StatusCode::BAD_REQUEST, Json(json!({ "error": e.to_string() }))))?;

    offer.status = "Filled".to_string();

    let txn = InstitutionalTxn {
        txn_id: format!("TXN-{}-{}", now.format("%Y%m%d"), &uuid::Uuid::new_v4().to_string()[..6].to_uppercase()),
        booking_date: now.format("%Y-%m-%d %H:%M:%S UTC").to_string(),
        value_date: now.format("%Y-%m-%d").to_string(),
        gl_code: "1530-01".to_string(),
        txn_type: "AtomicP2PDvPTrade".to_string(),
        iso20022_msg: "setr.016.001.04".to_string(),
        iso24165_dti: "DTI-USTB-3312".to_string(),
        actus_contract_type: "PAM".to_string(),
        swift_on_off_ramp_code: "SWIFT-OFFRAMP-FRANKFURT-CLEARING".to_string(),
        canister_principal_id: "rrkah-fqaaa-aaaaa-aaaaq-cai".to_string(),
        sender_legal: "Alice Trading Corp".to_string(),
        recipient_legal: offer.seller_legal_name.clone(),
        amount: offer.total_price_eur.clone(),
        currency: "EUR".to_string(),
        debit_credit: "Debit_Cash_Credit_RWA".to_string(),
        memo: format!("P2P Settlement Offer {} ({} {})", offer.offer_id, offer.asset_amount, offer.asset_symbol),
        onchain_hash: receipt.update_id.to_string(),
        finality_receipt: receipt.update_id.to_string(),
        status: "Finalized".to_string(),
    };

    let mut t_lock = state.transactions.write().unwrap();
    t_lock.insert(0, txn.clone());

    Ok(Json(json!({
        "status": "Finalized",
        "trade_type": "AtomicP2POfferExecution",
        "txn_id": txn.txn_id,
        "offer_id": offer.offer_id,
        "iso20022_msg": txn.iso20022_msg,
        "iso24165_dti": txn.iso24165_dti,
        "canister_principal_id": txn.canister_principal_id,
        "buyer_account": buyer_acc,
        "transferred_holding": holding,
        "receipt": receipt,
        "timestamp": now.timestamp_millis() as u64
    })))
}

async fn get_admin_supervision(State(_state): State<ServerState>) -> impl IntoResponse {
    let now = chrono::Utc::now().timestamp_millis() as u64;
    (StatusCode::OK, Json(json!({
        "supervision_timestamp": now,
        "radar_status": "Active_Consensus_Audit",
        "double_spend_attempts_intercepted": 0,
        "total_active_canister_partitions": 10,
        "regulatory_unmasking_authority": "CENTRAL_BANK_AUDIT_SUPERUSER",
        "iso20022_compliance_mode": "STRICT_CAMT_PACS_ENFORCED",
        "unmasked_active_flows": [
            {
                "anonymous_id": "ryjl3-hexae-mc6xm-gopwt-x5jg7-2a",
                "unmasked_legal_owner": "Alice Trading Corp (Zurich)",
                "net_exposure_eur": "€24,500.00",
                "rwa_gold_holdings_oz": "5.50 oz",
                "risk_tier": "Low_Compliant"
            },
            {
                "anonymous_id": "h64fh-eybaq-aaaaa-aaaaa-cai",
                "unmasked_legal_owner": "Bob Commodities LLC (Frankfurt)",
                "net_exposure_eur": "€18,200.00",
                "rwa_bond_holdings_usd": "$50,000 USTB",
                "risk_tier": "Low_Compliant"
            }
        ]
    })))
}

async fn list_transactions(State(state): State<ServerState>) -> impl IntoResponse {
    let txns = state.transactions.read().unwrap().clone();
    (StatusCode::OK, Json(txns))
}

async fn export_transactions_csv(State(state): State<ServerState>) -> impl IntoResponse {
    let txns = state.transactions.read().unwrap().clone();
    let mut csv = String::from("Transaction_ID,Booking_Date,Value_Date,GL_Account_Code,ISO20022_Message,ISO24165_DTI,ACTUS_Contract,SWIFT_Ramp_Code,ICP_Canister_Principal,Transaction_Type,Sender_Legal_Entity,Recipient_Legal_Entity,Amount,Currency,Debit_Credit,Memo_Description,OnChain_Notary_Hash,Finality_Proof_ID,Settlement_Status\n");

    for t in txns {
        csv.push_str(&format!(
            "\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\"\n",
            t.txn_id, t.booking_date, t.value_date, t.gl_code, t.iso20022_msg, t.iso24165_dti, t.actus_contract_type, t.swift_on_off_ramp_code, t.canister_principal_id, t.txn_type, t.sender_legal, t.recipient_legal, t.amount, t.currency, t.debit_credit, t.memo, t.onchain_hash, t.finality_receipt, t.status
        ));
    }

    ([(header::CONTENT_TYPE, "text/csv; charset=utf-8"),
      (header::CONTENT_DISPOSITION, "attachment; filename=\"veritas_gold_general_ledger_export.csv\"")],
     csv)
}

async fn export_transactions_json(State(state): State<ServerState>) -> impl IntoResponse {
    let txns = state.transactions.read().unwrap().clone();
    (
        [(header::CONTENT_TYPE, "application/json; charset=utf-8"),
         (header::CONTENT_DISPOSITION, "attachment; filename=\"veritas_gold_iso_accounting_export.json\"")],
        Json(json!({
            "export_schema": "ISO_20022_CAMT053_ACTUS_ERP_INTEGRATION",
            "version": "1.0",
            "licensed_to": "ICP Moneta",
            "timestamp": chrono::Utc::now().timestamp_millis(),
            "records": txns
        }))
    )
}

async fn get_standards_mapping() -> impl IntoResponse {
    (StatusCode::OK, Json(json!({
        "standards_version": "1.0",
        "iso20022_coverage": ["pain.001.001.11", "pain.002.001.12", "pacs.008.001.10", "camt.053.001.10", "sese.023.001.09", "setr.016.001.04", "coll.001.001.04", "coll.002.001.04"],
        "iso24165_dti_registry": {
            "EURD": "DTI-EURD-9941",
            "USDD": "DTI-USDD-1024",
            "GOLD": "DTI-GOLD-8821",
            "USTB": "DTI-USTB-3312",
            "PROP_ZH": "DTI-PROP-ZH44"
        },
        "actus_contract_types": ["PAM", "LAX", "SWAPS"],
        "fix_protocol_coverage": ["NewOrderSingle (D)", "ExecutionReport (8)"],
        "swift_interop_layer": {
            "onramp_gateway": "SWIFT-ONRAMP-CH93-UBSWCHZH",
            "offramp_gateway": "SWIFT-OFFRAMP-FRANKFURT-CLEARING",
            "notary_verification": "ICP_CANISTER_ATT_SHA256"
        }
    })))
}

async fn list_collateral(State(state): State<ServerState>) -> impl IntoResponse {
    let list = state.collateral.read().unwrap().clone();
    (StatusCode::OK, Json(list))
}

async fn post_collateral(
    State(state): State<ServerState>,
    Json(payload): Json<PostCollateralRequest>,
) -> Result<(StatusCode, Json<CollateralPosition>), (StatusCode, Json<serde_json::Value>)> {
    let val = payload.market_value_eur.parse::<f64>().map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid market value" }))))?;
    let haircut = payload.haircut_percent.parse::<f64>().map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({ "error": "Invalid haircut" }))))?;
    let capacity = format!("{:.2}", val * (1.0 - haircut / 100.0));

    let pos = CollateralPosition {
        position_id: format!("COL-{}", &uuid::Uuid::new_v4().to_string()[..8].to_uppercase()),
        asset_symbol: payload.asset_symbol,
        asset_name: payload.asset_name,
        pledged_amount: payload.amount,
        market_value_eur: payload.market_value_eur,
        haircut_percent: payload.haircut_percent,
        borrowing_capacity_eur: capacity,
        custodian: "Swiss Vault Depository".to_string(),
        pledgee: payload.pledgee,
        status: "Active_Pledged".to_string(),
    };

    let mut lock = state.collateral.write().unwrap();
    lock.insert(0, pos.clone());

    Ok((StatusCode::CREATED, Json(pos)))
}
