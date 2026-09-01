use icp_canister_suite::server::{create_app, RwaOffer, ServerState};
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
    alice_acc_init(&env, &alice_acc.account_id, Amount::from_str_strict("2500.00")?);

    let bob_acc = env.position_ledger.create_demand_deposit_account(
        central_bank,
        bob,
        eur.clone(),
        Amount::from_str_strict("500.00")?,
        Amount::from_str_strict("5000.00")?,
        1000,
    )?;
    alice_acc_init(&env, &bob_acc.account_id, Amount::from_str_strict("1200.00")?);

    env.asset_ledger.issue_fungible_asset(central_bank, alice, usd.clone(), Amount::from_str_strict("10000.00")?, 1000)?;
    env.asset_ledger.issue_fungible_asset(central_bank, bob, usd.clone(), Amount::from_str_strict("3500.00")?, 1000)?;

    let initial_offers = vec![
        RwaOffer {
            offer_id: "OFFER-USTB-901".to_string(),
            seller_principal: bob.to_string(),
            seller_legal_name: "Bob Commodities LLC".to_string(),
            asset_symbol: "USTB".to_string(),
            asset_name: "US Treasury 3M Bill (AA+)".to_string(),
            asset_amount: "50.00".to_string(),
            price_per_unit_eur: "914.10".to_string(),
            total_price_eur: "45705.00".to_string(),
            status: "Active".to_string(),
            created_at: chrono::Utc::now().timestamp_millis() as u64,
        },
        RwaOffer {
            offer_id: "OFFER-GOLD-442".to_string(),
            seller_principal: alice.to_string(),
            seller_legal_name: "Alice Trading Corp".to_string(),
            asset_symbol: "GOLD".to_string(),
            asset_name: "LBMA Physical Gold (1 oz Bar)".to_string(),
            asset_amount: "2.00".to_string(),
            price_per_unit_eur: "2540.00".to_string(),
            total_price_eur: "5080.00".to_string(),
            status: "Active".to_string(),
            created_at: chrono::Utc::now().timestamp_millis() as u64,
        },
    ];

    let state = ServerState {
        env,
        offers: Arc::new(RwLock::new(initial_offers)),
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
