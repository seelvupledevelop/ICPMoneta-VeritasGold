use domain::accounts::DemandDepositRecord;
use domain::errors::DomainError;
use domain::primitives::Amount;

pub struct AccountRuleSet;

impl AccountRuleSet {
    pub fn verify_debit(
        account: &DemandDepositRecord,
        debit_amount: &Amount,
    ) -> Result<(), DomainError> {
        account.can_debit(debit_amount)
    }
}
