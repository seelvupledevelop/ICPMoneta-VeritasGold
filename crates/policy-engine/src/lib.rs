pub mod account_policy;
pub mod asset_policy;
pub mod signature_policy;

pub use account_policy::AccountRuleSet;
pub use asset_policy::AssetConservationPolicy;
pub use signature_policy::SignaturePolicy;

use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::updates::LedgerUpdateDraft;

pub struct PolicyEngine;

impl PolicyEngine {
    pub fn validate_update(
        inputs: &[FungibleAssetHolding],
        outputs: &[FungibleAssetHolding],
        draft: &LedgerUpdateDraft,
    ) -> Result<(), DomainError> {
        SignaturePolicy::verify_signatures(draft)?;
        AssetConservationPolicy::verify(inputs, outputs, draft)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use domain::assets::FungibleAssetHolding;
    use domain::primitives::*;
    use domain::updates::*;

    #[test]
    fn test_signature_policy_missing_signer() {
        let alice = PrincipalId::new_user(1);
        let bob = PrincipalId::new_user(2);

        let draft = LedgerUpdateDraft {
            consumed_inputs: vec![],
            reference_inputs: vec![],
            produced_outputs: vec![],
            intent: OperationIntent::TransferAsset {
                symbol: "USD".to_string(),
                recipient: bob,
            },
            required_signers: vec![alice, bob],
            signatures: vec![SignatureAssertion {
                signer: alice,
                signature: vec![1, 2, 3],
            }],
            timestamp: 1000,
        };

        let result = SignaturePolicy::verify_signatures(&draft);
        assert!(matches!(result, Err(DomainError::MissingSignature(_))));
    }

    #[test]
    fn test_asset_conservation_policy_mismatch() {
        let issuer = PrincipalId::new_user(1);
        let alice = PrincipalId::new_user(2);
        let usd = CurrencyCode::usd();
        let eur = CurrencyCode::eur();

        let input = FungibleAssetHolding {
            holding_id: HoldingId::random(),
            asset_symbol: usd,
            issuer,
            holder: alice,
            amount: Amount::from_str_strict("100.00").unwrap(),
            pointer: RecordPointer {
                update_id: UpdateId::new("TX_1"),
                output_index: 0,
            },
            status: RecordStatus::Unconsumed,
        };

        let output = FungibleAssetHolding {
            holding_id: HoldingId::random(),
            asset_symbol: eur,
            issuer,
            holder: alice,
            amount: Amount::from_str_strict("100.00").unwrap(),
            pointer: RecordPointer {
                update_id: UpdateId::new("TX_2"),
                output_index: 0,
            },
            status: RecordStatus::Unconsumed,
        };

        let draft = LedgerUpdateDraft {
            consumed_inputs: vec![],
            reference_inputs: vec![],
            produced_outputs: vec![],
            intent: OperationIntent::RedeemAsset {
                symbol: "USD".to_string(),
            },
            required_signers: vec![],
            signatures: vec![],
            timestamp: 1000,
        };

        let result = AssetConservationPolicy::verify(&[input], &[output], &draft);
        assert!(matches!(result, Err(DomainError::AssetMismatch { .. })));
    }
}
