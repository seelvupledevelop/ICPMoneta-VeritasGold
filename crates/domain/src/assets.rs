use crate::errors::DomainError;
use crate::primitives::{
    Amount, CurrencyCode, HoldingId, PrincipalId, RecordPointer, RecordStatus, UpdateId,
};
use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct FungibleAssetHolding {
    pub holding_id: HoldingId,
    pub asset_symbol: CurrencyCode,
    pub issuer: PrincipalId,
    pub holder: PrincipalId,
    pub amount: Amount,
    pub pointer: RecordPointer,
    pub status: RecordStatus,
}

impl FungibleAssetHolding {
    pub fn is_unconsumed(&self) -> bool {
        self.status == RecordStatus::Unconsumed
    }

    pub fn consume(&mut self, update_id: UpdateId, timestamp: u64) -> Result<(), DomainError> {
        if !self.is_unconsumed() {
            return Err(DomainError::RecordConsumed(self.holding_id.to_string()));
        }
        self.status = RecordStatus::Consumed {
            consuming_update_id: update_id,
            consumed_at: timestamp,
        };
        Ok(())
    }

    pub fn split(
        &mut self,
        transfer_amount: Amount,
        new_holder: PrincipalId,
        update_id: UpdateId,
        timestamp: u64,
    ) -> Result<(FungibleAssetHolding, Option<FungibleAssetHolding>), DomainError> {
        self.consume(update_id.clone(), timestamp)?;

        let remainder = self.amount.subtract(&transfer_amount)?;

        let transferred = FungibleAssetHolding {
            holding_id: HoldingId::random(),
            asset_symbol: self.asset_symbol.clone(),
            issuer: self.issuer,
            holder: new_holder,
            amount: transfer_amount,
            pointer: RecordPointer {
                update_id: update_id.clone(),
                output_index: 0,
            },
            status: RecordStatus::Unconsumed,
        };

        let change = if remainder.decimal() > rust_decimal::Decimal::ZERO {
            Some(FungibleAssetHolding {
                holding_id: HoldingId::random(),
                asset_symbol: self.asset_symbol.clone(),
                issuer: self.issuer,
                holder: self.holder,
                amount: remainder,
                pointer: RecordPointer {
                    update_id,
                    output_index: 1,
                },
                status: RecordStatus::Unconsumed,
            })
        } else {
            None
        };

        Ok((transferred, change))
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct DiscreteAssetHolding {
    pub holding_id: HoldingId,
    pub asset_class: String,
    pub unique_identifier: String,
    pub issuer: PrincipalId,
    pub holder: PrincipalId,
    pub metadata_uri: String,
    pub pointer: RecordPointer,
    pub status: RecordStatus,
}
