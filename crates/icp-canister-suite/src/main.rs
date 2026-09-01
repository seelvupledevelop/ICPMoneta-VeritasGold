use icp_canister_suite::server::{create_app, CollateralPosition, InstitutionalTxn, RwaOffer, ServerState};
use icp_canister_suite::CanisterEnvironment;
use domain::primitives::{Amount, CurrencyCode, PrincipalId};
use std::net::SocketAddr;
use std::sync::{Arc, RwLock};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "icp_canister_suite=info,tower_http=info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let authority = PrincipalId::new_user(1);
    let env = Arc::new(CanisterEnvironment::bootstrap(authority));

    let central_bank = PrincipalId::new_user(2);
    let alice = PrincipalId::new_user(3);
    let bob = PrincipalId::new_user(4);

    env.identity_registry.register_profile(central_bank, "Apex Central Reserve", "CentralBank", 1000)?;
    env.identity_registry.register_profile(alice, "Alice Trading Corp", "Trader", 1000)?;
    env.identity_registry.register_profile(bob, "Bob Commodities LLC", "Counterparty", 1000)?;

    let eur = CurrencyCode::eur();
    let usd = CurrencyCode::usd();

    let alice_acc = env.position_ledger.create_demand_deposit_account(
        central_bank,
        alice,
        eur.clone(),
        Amount::from_str_strict("1000.00")?,
        Amount::from_str_strict("5000.00")?,
        1000,
    )?;
    alice_acc_init(&env, &alice_acc.account_id, Amount::from_str_strict("3500.00")?);

    let bob_acc = env.position_ledger.create_demand_deposit_account(
        central_bank,
        bob,
        eur.clone(),
        Amount::from_str_strict("1000.00")?,
        Amount::from_str_strict("5000.00")?,
        1000,
    )?;
    alice_acc_init(&env, &bob_acc.account_id, Amount::from_str_strict("2500.00")?);

    env.asset_ledger.issue_fungible_asset(central_bank, alice, usd.clone(), Amount::from_str_strict("10000.00")?, 1000)?;
    env.asset_ledger.issue_fungible_asset(central_bank, bob, usd.clone(), Amount::from_str_strict("3500.00")?, 1000)?;

    let initial_offers = vec![
        RwaOffer {
            offer_id: "OFFER-USTB-101".to_string(),
            seller_principal: bob.to_string(),
            seller_legal_name: "Bob Commodities LLC".to_string(),
            asset_symbol: "USTB".to_string(),
            asset_name: "US Treasury 3M Bill (AA+)".to_string(),
            asset_amount: "2.00".to_string(),
            price_per_unit_eur: "914.10".to_string(),
            total_price_eur: "1828.20".to_string(),
            status: "Active".to_string(),
            created_at: chrono::Utc::now().timestamp_millis() as u64,
        },
        RwaOffer {
            offer_id: "OFFER-GOLD-202".to_string(),
            seller_principal: bob.to_string(),
            seller_legal_name: "Bob Commodities LLC".to_string(),
            asset_symbol: "GOLD".to_string(),
            asset_name: "LBMA Physical Gold (1 oz Bar)".to_string(),
            asset_amount: "1.00".to_string(),
            price_per_unit_eur: "2540.00".to_string(),
            total_price_eur: "2540.00".to_string(),
            status: "Active".to_string(),
            created_at: chrono::Utc::now().timestamp_millis() as u64,
        },
        RwaOffer {
            offer_id: "OFFER-PROP-303".to_string(),
            seller_principal: bob.to_string(),
            seller_legal_name: "Bob Commodities LLC".to_string(),
            asset_symbol: "PROP_ZH".to_string(),
            asset_name: "Prime Zurich Commercial Real Estate".to_string(),
            asset_amount: "10.00".to_string(),
            price_per_unit_eur: "46.30".to_string(),
            total_price_eur: "463.00".to_string(),
            status: "Active".to_string(),
            created_at: chrono::Utc::now().timestamp_millis() as u64,
        },
        RwaOffer {
            offer_id: "OFFER-USTB-901".to_string(),
            seller_principal: bob.to_string(),
            seller_legal_name: "Bob Commodities LLC".to_string(),
            asset_symbol: "USTB".to_string(),
            asset_name: "US Treasury 3M Bill (Institutional Block)".to_string(),
            asset_amount: "50.00".to_string(),
            price_per_unit_eur: "914.10".to_string(),
            total_price_eur: "45705.00".to_string(),
            status: "Active".to_string(),
            created_at: chrono::Utc::now().timestamp_millis() as u64,
        },
    ];

    let now_str = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S UTC").to_string();
    let initial_txns = vec![
        InstitutionalTxn {
            txn_id: "TXN-20260901-8841".to_string(),
            booking_date: now_str.clone(),
            value_date: "2026-09-01".to_string(),
            gl_code: "1520-03".to_string(),
            txn_type: "AtomicDvPRfqSettlement".to_string(),
            iso20022_msg: "sese.023.001.09".to_string(),
            iso24165_dti: "DTI-GOLD-8821".to_string(),
            actus_contract_type: "PAM".to_string(),
            swift_on_off_ramp_code: "SWIFT-DVP-ZURICH-VAULT".to_string(),
            canister_principal_id: "rrkah-fqaaa-aaaaa-aaaaq-cai".to_string(),
            sender_legal: "Alice Trading Corp (Zurich)".to_string(),
            recipient_legal: "Swiss Vault Depository".to_string(),
            amount: "1271.05".to_string(),
            currency: "EUR".to_string(),
            debit_credit: "Debit_Cash_Credit_RWA".to_string(),
            memo: "Spot Purchase 0.50 oz LBMA Physical Gold (Bar #ZH-9941)".to_string(),
            onchain_hash: "0xc709b69547d556482fb1a6e633258c8db8ac417b868b6cbf7d228773628a6a63".to_string(),
            finality_receipt: "0xc709b69547d556482fb1a6e633258c8db8ac417b868b6cbf7d228773628a6a63".to_string(),
            status: "Finalized".to_string(),
        },
        InstitutionalTxn {
            txn_id: "TXN-20260901-7102".to_string(),
            booking_date: now_str.clone(),
            value_date: "2026-09-01".to_string(),
            gl_code: "1530-01".to_string(),
            txn_type: "AtomicP2PDvPTrade".to_string(),
            iso20022_msg: "setr.016.001.04".to_string(),
            iso24165_dti: "DTI-USTB-3312".to_string(),
            actus_contract_type: "PAM".to_string(),
            swift_on_off_ramp_code: "SWIFT-OFFRAMP-FRANKFURT-CLEARING".to_string(),
            canister_principal_id: "rrkah-fqaaa-aaaaa-aaaaq-cai".to_string(),
            sender_legal: "Alice Trading Corp (Zurich)".to_string(),
            recipient_legal: "Bob Commodities LLC (Frankfurt)".to_string(),
            amount: "1828.20".to_string(),
            currency: "EUR".to_string(),
            debit_credit: "Debit_Cash_Credit_RWA".to_string(),
            memo: "Bilateral Delivery-vs-Payment 2.00 US Treasury 3M Bills".to_string(),
            onchain_hash: "0x00ace7e7a0f1887c996ac303412177bc7e41af435aed18790e61114c0b4e1f17".to_string(),
            finality_receipt: "0x00ace7e7a0f1887c996ac303412177bc7e41af435aed18790e61114c0b4e1f17".to_string(),
            status: "Finalized".to_string(),
        },
        InstitutionalTxn {
            txn_id: "TXN-20260901-5501".to_string(),
            booking_date: now_str,
            value_date: "2026-09-01".to_string(),
            gl_code: "1010-01".to_string(),
            txn_type: "CrossBorderTokenizedWire".to_string(),
            iso20022_msg: "pacs.008.001.10".to_string(),
            iso24165_dti: "DTI-EURD-9941".to_string(),
            actus_contract_type: "PAM".to_string(),
            swift_on_off_ramp_code: "SWIFT-ONRAMP-CH93-UBSWCHZH".to_string(),
            canister_principal_id: "rrkah-fqaaa-aaaaa-aaaaq-cai".to_string(),
            sender_legal: "Alice Trading Corp (Zurich)".to_string(),
            recipient_legal: "Bob Commodities LLC (Frankfurt)".to_string(),
            amount: "150.00".to_string(),
            currency: "EUR".to_string(),
            debit_credit: "Debit".to_string(),
            memo: "Intraday Liquidity Optimization Settlement".to_string(),
            onchain_hash: "0x4b788ee4062d8935044d9ac00fb0f2b9".to_string(),
            finality_receipt: "PROTO-9ac00fb0-f2b9-4b78-8ee4-062d8935044d".to_string(),
            status: "Finalized".to_string(),
        },
    ];

    let initial_collateral = vec![
        CollateralPosition {
            position_id: "COL-USTB-001".to_string(),
            asset_symbol: "USTB".to_string(),
            asset_name: "US Treasury 3M Bill (AA+)".to_string(),
            pledged_amount: "100.00 Units".to_string(),
            market_value_eur: "91410.00".to_string(),
            haircut_percent: "2.0".to_string(),
            borrowing_capacity_eur: "89581.80".to_string(),
            custodian: "Swiss Vault Depository".to_string(),
            pledgee: "Apex Central Reserve".to_string(),
            status: "Active_Pledged".to_string(),
        },
        CollateralPosition {
            position_id: "COL-GOLD-002".to_string(),
            asset_symbol: "GOLD".to_string(),
            asset_name: "LBMA Physical Gold (1 oz Bar)".to_string(),
            pledged_amount: "10.00 oz".to_string(),
            market_value_eur: "25421.00".to_string(),
            haircut_percent: "5.0".to_string(),
            borrowing_capacity_eur: "24149.95".to_string(),
            custodian: "Swiss Vault Depository".to_string(),
            pledgee: "Apex Central Reserve".to_string(),
            status: "Active_Pledged".to_string(),
        },
    ];

    let state = ServerState {
        env,
        offers: Arc::new(RwLock::new(initial_offers)),
        transactions: Arc::new(RwLock::new(initial_txns)),
        collateral: Arc::new(RwLock::new(initial_collateral)),
    };
    let app = create_app(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("🚀 ICP Backend Server running at http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

fn alice_acc_init(env: &CanisterEnvironment, acc_id: &domain::primitives::AccountId, amt: Amount) {
    if let Some(mut acc) = env.settlement_engine.get_account(acc_id) {
        let _ = acc.apply_credit(&amt, 1001);
        env.settlement_engine.register_account(acc);
    }
}
