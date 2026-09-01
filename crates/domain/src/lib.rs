pub mod accounts;
pub mod assets;
pub mod errors;
pub mod identities;
pub mod primitives;
pub mod updates;

pub use accounts::*;
pub use assets::*;
pub use errors::DomainError;
pub use identities::*;
pub use primitives::*;
pub use updates::*;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_demand_deposit_limits_and_debit() {
        let mut account = DemandDepositRecord {
            account_id: AccountId::random(),
            custodian: PrincipalId::new_user(1),
            owner: PrincipalId::new_user(2),
            currency: CurrencyCode::eur(),
            balance: Amount::from_str_strict("500.00").unwrap(),
            overdraft_limit: Amount::from_str_strict("100.00").unwrap(),
            daily_withdrawal_limit: Amount::from_str_strict("1000.00").unwrap(),
            daily_transfer_limit: Amount::from_str_strict("1000.00").unwrap(),
            accumulated_daily_debit: Amount::zero(),
            status: AccountStatus::Active,
            pointer: RecordPointer {
                update_id: UpdateId::new("TX_0"),
                output_index: 0,
            },
            record_status: RecordStatus::Unconsumed,
            updated_at: 1000,
        };

        let debit_amount = Amount::from_str_strict("200.00").unwrap();
        account.apply_debit(&debit_amount, 1001).unwrap();
        assert_eq!(account.balance.as_str(), "300.00");
        assert_eq!(account.accumulated_daily_debit.as_str(), "200.00");

        // Attempt debit exceeding balance + overdraft (300 + 100 = 400 available)
        let too_much = Amount::from_str_strict("450.00").unwrap();
        assert!(matches!(
            account.apply_debit(&too_much, 1002),
            Err(DomainError::OverdraftExceeded { .. })
        ));
    }
}
