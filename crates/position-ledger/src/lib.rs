use domain::accounts::{AccountStatus, DemandDepositRecord};
use domain::errors::DomainError;
use domain::primitives::{
    AccountId, Amount, CurrencyCode, PrincipalId, RecordPointer, RecordStatus, UpdateId,
};
use settlement_engine::SettlementEngine;
use std::sync::Arc;

pub struct PositionLedger {
    settlement_engine: Arc<SettlementEngine>,
}

impl PositionLedger {
    pub fn new(settlement_engine: Arc<SettlementEngine>) -> Self {
        Self { settlement_engine }
    }

    pub fn create_demand_deposit_account(
        &self,
        custodian: PrincipalId,
        owner: PrincipalId,
        currency: CurrencyCode,
        overdraft_limit: Amount,
        daily_transfer_limit: Amount,
        timestamp: u64,
    ) -> Result<DemandDepositRecord, DomainError> {
        let account = DemandDepositRecord {
            account_id: AccountId::random(),
            custodian,
            owner,
            currency,
            balance: Amount::zero(),
            overdraft_limit,
            daily_withdrawal_limit: daily_transfer_limit.clone(),
            daily_transfer_limit,
            accumulated_daily_debit: Amount::zero(),
            status: AccountStatus::Active,
            pointer: RecordPointer {
                update_id: UpdateId::new("GENESIS_ACCOUNT"),
                output_index: 0,
            },
            record_status: RecordStatus::Unconsumed,
            updated_at: timestamp,
        };

        self.settlement_engine.register_account(account.clone());
        Ok(account)
    }

    pub fn execute_direct_transfer(
        &self,
        sender_id: &AccountId,
        recipient_id: &AccountId,
        amount: &Amount,
        timestamp: u64,
    ) -> Result<(DemandDepositRecord, DemandDepositRecord), DomainError> {
        let mut sender = self
            .settlement_engine
            .get_account(sender_id)
            .ok_or_else(|| {
                DomainError::ValidationError(format!("Sender account not found: {}", sender_id))
            })?;

        let mut recipient = self
            .settlement_engine
            .get_account(recipient_id)
            .ok_or_else(|| {
                DomainError::ValidationError(format!(
                    "Recipient account not found: {}",
                    recipient_id
                ))
            })?;

        if sender.currency != recipient.currency {
            return Err(DomainError::AssetMismatch {
                expected: sender.currency.to_string(),
                actual: recipient.currency.to_string(),
            });
        }

        sender.apply_debit(amount, timestamp)?;
        recipient.apply_credit(amount, timestamp)?;

        self.settlement_engine.register_account(sender.clone());
        self.settlement_engine.register_account(recipient.clone());

        Ok((sender, recipient))
    }
}
