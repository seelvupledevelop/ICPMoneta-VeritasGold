use crate::errors::DomainError;
use crate::primitives::{
    AccountId, Amount, CurrencyCode, PrincipalId, RecordPointer, RecordStatus,
};
use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub enum AccountStatus {
    Active,
    Suspended {
        reason: String,
        by: PrincipalId,
        timestamp: u64,
    },
    Closed {
        by: PrincipalId,
        timestamp: u64,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct DemandDepositRecord {
    pub account_id: AccountId,
    pub custodian: PrincipalId,
    pub owner: PrincipalId,
    pub currency: CurrencyCode,
    pub balance: Amount,
    pub overdraft_limit: Amount,
    pub daily_withdrawal_limit: Amount,
    pub daily_transfer_limit: Amount,
    pub accumulated_daily_debit: Amount,
    pub status: AccountStatus,
    pub pointer: RecordPointer,
    pub record_status: RecordStatus,
    pub updated_at: u64,
}

impl DemandDepositRecord {
    pub fn ensure_active(&self) -> Result<(), DomainError> {
        match &self.status {
            AccountStatus::Active => Ok(()),
            AccountStatus::Suspended { reason, .. } => Err(DomainError::AccountInactive(format!(
                "Account suspended: {}",
                reason
            ))),
            AccountStatus::Closed { .. } => Err(DomainError::AccountInactive(
                "Account is closed".to_string(),
            )),
        }
    }

    pub fn can_debit(&self, amount: &Amount) -> Result<(), DomainError> {
        self.ensure_active()?;

        let balance_dec = self.balance.decimal();
        let overdraft_dec = self.overdraft_limit.decimal();
        let req_dec = amount.decimal();

        if balance_dec + overdraft_dec < req_dec {
            return Err(DomainError::OverdraftExceeded {
                balance: self.balance.to_string(),
                limit: self.overdraft_limit.to_string(),
                requested: amount.to_string(),
            });
        }

        let current_accum = self.accumulated_daily_debit.decimal();
        let transfer_limit = self.daily_transfer_limit.decimal();

        if current_accum + req_dec > transfer_limit {
            return Err(DomainError::DailyLimitExceeded {
                limit: self.daily_transfer_limit.to_string(),
                accumulated: self.accumulated_daily_debit.to_string(),
                requested: amount.to_string(),
            });
        }

        Ok(())
    }

    pub fn apply_debit(&mut self, amount: &Amount, timestamp: u64) -> Result<(), DomainError> {
        self.can_debit(amount)?;
        let new_bal = self.balance.decimal() - amount.decimal();
        let new_accum = self.accumulated_daily_debit.decimal() + amount.decimal();

        self.balance = Amount::from_decimal(new_bal).unwrap_or_else(|_| Amount::zero());
        self.accumulated_daily_debit =
            Amount::from_decimal(new_accum).unwrap_or_else(|_| Amount::zero());
        self.updated_at = timestamp;
        Ok(())
    }

    pub fn apply_credit(&mut self, amount: &Amount, timestamp: u64) -> Result<(), DomainError> {
        self.ensure_active()?;
        let new_bal = self.balance.decimal() + amount.decimal();
        self.balance = Amount::from_decimal(new_bal).unwrap_or_else(|_| Amount::zero());
        self.updated_at = timestamp;
        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct TermDepositRecord {
    pub account_id: AccountId,
    pub custodian: PrincipalId,
    pub owner: PrincipalId,
    pub currency: CurrencyCode,
    pub principal_amount: Amount,
    pub interest_rate_bps: u32,
    pub maturity_date: u64,
    pub is_liquidated: bool,
    pub pointer: RecordPointer,
    pub record_status: RecordStatus,
}
