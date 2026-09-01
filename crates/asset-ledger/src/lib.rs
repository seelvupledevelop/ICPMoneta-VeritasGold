pub mod coin_selection;

pub use coin_selection::CoinSelector;

use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::primitives::{
    Amount, CurrencyCode, HoldingId, PrincipalId, RecordPointer, RecordStatus, UpdateId,
};
use domain::updates::{LedgerUpdateDraft, OperationIntent, SignatureAssertion, UpdateReceipt};
use settlement_engine::SettlementEngine;
use std::sync::Arc;

pub struct AssetLedger {
    settlement_engine: Arc<SettlementEngine>,
}

impl AssetLedger {
    pub fn new(settlement_engine: Arc<SettlementEngine>) -> Self {
        Self { settlement_engine }
    }

    pub fn issue_fungible_asset(
        &self,
        issuer: PrincipalId,
        holder: PrincipalId,
        currency: CurrencyCode,
        amount: Amount,
        timestamp: u64,
    ) -> Result<(FungibleAssetHolding, UpdateReceipt), DomainError> {
        let update_id = UpdateId::new(format!("ISSUE_{}", HoldingId::random()));

        let holding = FungibleAssetHolding {
            holding_id: HoldingId::random(),
            asset_symbol: currency.clone(),
            issuer,
            holder,
            amount: amount.clone(),
            pointer: RecordPointer {
                update_id: update_id.clone(),
                output_index: 0,
            },
            status: RecordStatus::Unconsumed,
        };

        let draft = LedgerUpdateDraft {
            consumed_inputs: vec![],
            reference_inputs: vec![],
            produced_outputs: vec![holding.holding_id.to_string().into_bytes()],
            intent: OperationIntent::IssueAsset {
                symbol: currency.to_string(),
                recipient: holder,
            },
            required_signers: vec![issuer],
            signatures: vec![SignatureAssertion {
                signer: issuer,
                signature: vec![1, 2, 3],
            }],
            timestamp,
        };

        let receipt =
            self.settlement_engine
                .apply_asset_transfer(vec![], vec![holding.clone()], draft)?;

        Ok((holding, receipt))
    }

    pub fn transfer_asset(
        &self,
        sender: PrincipalId,
        recipient: PrincipalId,
        currency: CurrencyCode,
        amount: Amount,
        timestamp: u64,
    ) -> Result<
        (
            FungibleAssetHolding,
            Option<FungibleAssetHolding>,
            UpdateReceipt,
        ),
        DomainError,
    > {
        let available = self.settlement_engine.get_participant_holdings(&sender);
        let selected =
            CoinSelector::select_unconsumed_holdings(&available, &amount, &currency, &sender)?;

        let mut total_selected = rust_decimal::Decimal::ZERO;
        for s in &selected {
            total_selected += s.amount.decimal();
        }

        let change_amount = total_selected - amount.decimal();
        let update_id = UpdateId::new(format!("TX_{}", HoldingId::random()));

        let transferred = FungibleAssetHolding {
            holding_id: HoldingId::random(),
            asset_symbol: currency.clone(),
            issuer: selected[0].issuer,
            holder: recipient,
            amount: amount.clone(),
            pointer: RecordPointer {
                update_id: update_id.clone(),
                output_index: 0,
            },
            status: RecordStatus::Unconsumed,
        };

        let change = if change_amount > rust_decimal::Decimal::ZERO {
            Some(FungibleAssetHolding {
                holding_id: HoldingId::random(),
                asset_symbol: currency.clone(),
                issuer: selected[0].issuer,
                holder: sender,
                amount: Amount::from_decimal(change_amount)?,
                pointer: RecordPointer {
                    update_id: update_id.clone(),
                    output_index: 1,
                },
                status: RecordStatus::Unconsumed,
            })
        } else {
            None
        };

        let consumed_pointers: Vec<RecordPointer> =
            selected.iter().map(|s| s.pointer.clone()).collect();
        let mut produced = vec![transferred.clone()];
        if let Some(ref c) = change {
            produced.push(c.clone());
        }

        let draft = LedgerUpdateDraft {
            consumed_inputs: consumed_pointers,
            reference_inputs: vec![],
            produced_outputs: produced
                .iter()
                .map(|p| p.holding_id.to_string().into_bytes())
                .collect(),
            intent: OperationIntent::TransferAsset {
                symbol: currency.to_string(),
                recipient,
            },
            required_signers: vec![sender],
            signatures: vec![SignatureAssertion {
                signer: sender,
                signature: vec![1, 2, 3],
            }],
            timestamp,
        };

        let receipt = self
            .settlement_engine
            .apply_asset_transfer(selected, produced, draft)?;

        Ok((transferred, change, receipt))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use finality_authority::FinalityAuthority;

    #[test]
    fn test_asset_ledger_coin_selection_insufficient_balance() {
        let authority = Arc::new(FinalityAuthority::new(PrincipalId::new_user(1)));
        let engine = Arc::new(SettlementEngine::new(authority));
        let ledger = AssetLedger::new(engine);

        let issuer = PrincipalId::new_user(2);
        let alice = PrincipalId::new_user(3);
        let bob = PrincipalId::new_user(4);
        let usd = CurrencyCode::usd();

        // Mint $50 to Alice
        ledger
            .issue_fungible_asset(
                issuer,
                alice,
                usd.clone(),
                Amount::from_str_strict("50.00").unwrap(),
                1000,
            )
            .unwrap();

        // Alice tries to transfer $100 to Bob (insufficient balance)
        let result = ledger.transfer_asset(
            alice,
            bob,
            usd,
            Amount::from_str_strict("100.00").unwrap(),
            1001,
        );
        assert!(matches!(
            result,
            Err(DomainError::InsufficientBalance { .. })
        ));
    }
}
