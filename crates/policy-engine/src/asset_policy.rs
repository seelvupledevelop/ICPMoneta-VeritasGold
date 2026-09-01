use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::updates::LedgerUpdateDraft;

pub struct AssetConservationPolicy;

impl AssetConservationPolicy {
    pub fn verify(
        inputs: &[FungibleAssetHolding],
        outputs: &[FungibleAssetHolding],
        _draft: &LedgerUpdateDraft,
    ) -> Result<(), DomainError> {
        if inputs.is_empty() && outputs.is_empty() {
            return Ok(());
        }

        let mut total_in = rust_decimal::Decimal::ZERO;
        let mut total_out = rust_decimal::Decimal::ZERO;

        let input_symbol = if let Some(first_in) = inputs.first() {
            let symbol = &first_in.asset_symbol;
            for input in inputs {
                if &input.asset_symbol != symbol {
                    return Err(DomainError::AssetMismatch {
                        expected: symbol.to_string(),
                        actual: input.asset_symbol.to_string(),
                    });
                }
                total_in += input.amount.decimal();
            }
            Some(symbol)
        } else {
            None
        };

        let output_symbol = if let Some(first_out) = outputs.first() {
            let symbol = &first_out.asset_symbol;
            for output in outputs {
                if &output.asset_symbol != symbol {
                    return Err(DomainError::AssetMismatch {
                        expected: symbol.to_string(),
                        actual: output.asset_symbol.to_string(),
                    });
                }
                total_out += output.amount.decimal();
            }
            Some(symbol)
        } else {
            None
        };

        if let (Some(in_sym), Some(out_sym)) = (input_symbol, output_symbol) {
            if in_sym != out_sym {
                return Err(DomainError::AssetMismatch {
                    expected: in_sym.to_string(),
                    actual: out_sym.to_string(),
                });
            }
        }

        if !inputs.is_empty() && total_in != total_out {
            return Err(DomainError::ConservationOfValueViolated {
                inputs: total_in.to_string(),
                outputs: total_out.to_string(),
            });
        }

        Ok(())
    }
}
