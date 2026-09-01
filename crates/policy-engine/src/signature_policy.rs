use domain::errors::DomainError;
use domain::updates::LedgerUpdateDraft;

pub struct SignaturePolicy;

impl SignaturePolicy {
    pub fn verify_signatures(draft: &LedgerUpdateDraft) -> Result<(), DomainError> {
        for required in &draft.required_signers {
            let has_sig = draft.signatures.iter().any(|s| &s.signer == required);
            if !has_sig {
                return Err(DomainError::MissingSignature(required.to_string()));
            }
        }
        Ok(())
    }
}
