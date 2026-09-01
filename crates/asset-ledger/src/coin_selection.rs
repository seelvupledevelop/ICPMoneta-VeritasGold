use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::primitives::{Amount, CurrencyCode, PrincipalId};

pub struct CoinSelector;

impl CoinSelector {
    pub fn select_unconsumed_holdings(
        available: &[FungibleAssetHolding],
        required_amount: &Amount,
        currency: &CurrencyCode,
        holder: &PrincipalId,
    ) -> Result<Vec<FungibleAssetHolding>, DomainError> {
        let mut selected = Vec::new();
        let mut accumulated = rust_decimal::Decimal::ZERO;
        let target = required_amount.decimal();

        for holding in available {
            if &holding.holder == holder
                && &holding.asset_symbol == currency
                && holding.is_unconsumed()
            {
                selected.push(holding.clone());
                accumulated += holding.amount.decimal();
                if accumulated >= target {
                    return Ok(selected);
                }
            }
        }

        Err(DomainError::InsufficientBalance {
            available: accumulated.to_string(),
            requested: target.to_string(),
        })
    }
}
