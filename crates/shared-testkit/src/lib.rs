#[cfg(test)]
mod tests {
    use domain::accounts::AccountStatus;
    use domain::errors::DomainError;
    use domain::primitives::*;
    use icp_canister_suite::CanisterEnvironment;
    use protocol_coordinator::ProtocolState;

    #[test]
    fn test_exact_decimal_amount_operations() {
        let a1 = Amount::from_str_strict("123.456789").unwrap();
        let a2 = Amount::from_str_strict("76.543211").unwrap();
        let sum = a1.add(&a2);
        assert_eq!(sum.as_str(), "200.000000");

        let diff = sum.subtract(&a1).unwrap();
        assert_eq!(diff.as_str(), "76.543211");
    }

    #[test]
    fn test_position_account_creation_and_overdraft_policy() {
        let authority = PrincipalId::new_user(1);
        let env = CanisterEnvironment::bootstrap(authority);

        let bank = PrincipalId::new_user(2);
        let alice = PrincipalId::new_user(3);
        let bob = PrincipalId::new_user(4);

        let eur = CurrencyCode::eur();
        let overdraft = Amount::from_str_strict("500.00").unwrap();
        let daily_limit = Amount::from_str_strict("2000.00").unwrap();

        let alice_acc = env
            .position_ledger
            .create_demand_deposit_account(
                bank,
                alice,
                eur.clone(),
                overdraft,
                daily_limit.clone(),
                1000,
            )
            .unwrap();

        let bob_acc = env
            .position_ledger
            .create_demand_deposit_account(
                bank,
                bob,
                eur.clone(),
                Amount::zero(),
                daily_limit,
                1000,
            )
            .unwrap();

        assert_eq!(alice_acc.status, AccountStatus::Active);
        assert_eq!(alice_acc.balance.as_str(), "0");

        // Alice transfers €300 to Bob utilizing approved overdraft (€500 limit)
        let transfer_amount = Amount::from_str_strict("300.00").unwrap();
        let (proto_id, alice_updated, bob_updated) = env
            .transfer_cash(
                &alice_acc.account_id,
                &bob_acc.account_id,
                &transfer_amount,
                1001,
            )
            .unwrap();

        assert_eq!(alice_updated.balance.as_str(), "-300.00");
        assert_eq!(bob_updated.balance.as_str(), "300.00");

        let proto_state = env.query_protocol(&proto_id).unwrap();
        assert!(matches!(proto_state, ProtocolState::Finalized { .. }));

        // Attempt transfer exceeding remaining overdraft: €300 more when balance is -300 and limit is 500 (max 200 available)
        let excessive_amount = Amount::from_str_strict("300.00").unwrap();
        let err = env.transfer_cash(
            &alice_acc.account_id,
            &bob_acc.account_id,
            &excessive_amount,
            1002,
        );
        assert!(matches!(err, Err(DomainError::OverdraftExceeded { .. })));
    }

    #[test]
    fn test_asset_ledger_issuance_transfer_split_and_double_spend_prevention() {
        let authority = PrincipalId::new_user(1);
        let env = CanisterEnvironment::bootstrap(authority);

        let central_bank = PrincipalId::new_user(2);
        let alice = PrincipalId::new_user(3);
        let bob = PrincipalId::new_user(4);
        let usd = CurrencyCode::usd();

        // 1. Issue $1000 to Alice
        let initial_mint = Amount::from_str_strict("1000.00").unwrap();
        let (alice_holding, _issue_receipt) = env
            .asset_ledger
            .issue_fungible_asset(central_bank, alice, usd.clone(), initial_mint, 2000)
            .unwrap();

        assert_eq!(alice_holding.amount.as_str(), "1000.00");
        assert!(alice_holding.is_unconsumed());

        // 2. Alice transfers $350 to Bob (split $1000 -> $350 for Bob, $650 change for Alice)
        let payment = Amount::from_str_strict("350.00").unwrap();
        let (proto_id, bob_holding, change_holding, _receipt) = env
            .transfer_asset(alice, bob, usd.clone(), payment, 2001)
            .unwrap();

        assert_eq!(bob_holding.amount.as_str(), "350.00");
        assert_eq!(bob_holding.holder, bob);

        let alice_change = change_holding.unwrap();
        assert_eq!(alice_change.amount.as_str(), "650.00");
        assert_eq!(alice_change.holder, alice);

        // Verify protocol finished
        let status = env.query_protocol(&proto_id).unwrap();
        assert!(matches!(status, ProtocolState::Finalized { .. }));

        // 3. Alice attempts to transfer $500 to Bob (now using the $650 change token)
        let payment_2 = Amount::from_str_strict("500.00").unwrap();
        let (_, bob_holding_2, change_2, _) = env
            .transfer_asset(alice, bob, usd.clone(), payment_2, 2002)
            .unwrap();

        assert_eq!(bob_holding_2.amount.as_str(), "500.00");
        assert_eq!(change_2.unwrap().amount.as_str(), "150.00");

        // 4. Double spend attempt on the original consumed $1000 token is prevented by finality authority
        let double_spend_draft = domain::updates::LedgerUpdateDraft {
            consumed_inputs: vec![alice_holding.pointer.clone()],
            reference_inputs: vec![],
            produced_outputs: vec![alice_holding.holding_id.to_string().into_bytes()],
            intent: domain::updates::OperationIntent::TransferAsset {
                symbol: usd.to_string(),
                recipient: bob,
            },
            required_signers: vec![alice],
            signatures: vec![domain::updates::SignatureAssertion {
                signer: alice,
                signature: vec![1, 2, 3],
            }],
            timestamp: 2003,
        };

        let result = env.settlement_engine.apply_asset_transfer(
            vec![alice_holding.clone()],
            vec![alice_holding],
            double_spend_draft,
        );
        assert!(matches!(result, Err(DomainError::RecordConsumed(_))));
    }

    #[test]
    fn test_blinded_identity_assertion_and_ownership_verification() {
        let authority = PrincipalId::new_user(1);
        let env = CanisterEnvironment::bootstrap(authority);

        let well_known_corp = PrincipalId::new_user(2);
        let anonymous_trader = PrincipalId::new_user(3);
        let imposter = PrincipalId::new_user(4);

        env.identity_registry
            .register_profile(
                well_known_corp,
                "Global Hedge Fund LLC",
                "AssetManager",
                3000,
            )
            .unwrap();

        let (_proto_id, blinded_id) = env
            .swap_blinded_identity(well_known_corp, anonymous_trader, 3001)
            .unwrap();

        assert_eq!(blinded_id.well_known_principal, well_known_corp);
        assert_eq!(blinded_id.anonymous_principal, anonymous_trader);

        let is_valid = env
            .identity_registry
            .verify_blinded_ownership(&anonymous_trader, &well_known_corp)
            .unwrap();
        assert!(is_valid);

        let is_imposter_valid = env
            .identity_registry
            .verify_blinded_ownership(&anonymous_trader, &imposter)
            .unwrap();
        assert!(!is_imposter_valid);
    }
}
