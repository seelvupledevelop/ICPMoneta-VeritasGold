use domain::errors::DomainError;
use domain::primitives::{PrincipalId, RecordPointer, UpdateId};
use domain::updates::FinalityProof;
use sha2::{Digest, Sha256};
use std::collections::HashSet;
use std::sync::RwLock;

#[derive(Default)]
pub struct FinalityAuthority {
    authority_principal: PrincipalId,
    consumed_records: RwLock<HashSet<RecordPointer>>,
}

impl FinalityAuthority {
    pub fn new(authority_principal: PrincipalId) -> Self {
        Self {
            authority_principal,
            consumed_records: RwLock::new(HashSet::new()),
        }
    }

    pub fn is_consumed(&self, pointer: &RecordPointer) -> bool {
        let lock = self.consumed_records.read().unwrap();
        lock.contains(pointer)
    }

    pub fn assert_uniqueness_and_finalize(
        &self,
        inputs: &[RecordPointer],
        update_id: &UpdateId,
        timestamp: u64,
    ) -> Result<FinalityProof, DomainError> {
        let mut lock = self.consumed_records.write().unwrap();

        for input in inputs {
            if lock.contains(input) {
                return Err(DomainError::RecordConsumed(format!(
                    "Double-spend detected for input record: {}",
                    input
                )));
            }
        }

        for input in inputs {
            lock.insert(input.clone());
        }

        let mut hasher = Sha256::new();
        hasher.update(b"FINALITY_AUTHORITY_PROOF_V1_");
        hasher.update(update_id.to_string().as_bytes());
        hasher.update(self.authority_principal.to_string().as_bytes());
        hasher.update(timestamp.to_be_bytes());
        let signature = hasher.finalize().to_vec();

        Ok(FinalityProof {
            update_id: update_id.clone(),
            authority_principal: self.authority_principal,
            attestation_signature: signature,
            timestamp,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_finality_authority_double_spend_rejection() {
        let authority = FinalityAuthority::new(PrincipalId::new_user(1));
        let pointer = RecordPointer {
            update_id: UpdateId::new("GENESIS_TX"),
            output_index: 0,
        };

        assert!(!authority.is_consumed(&pointer));

        let update_1 = UpdateId::new("UPDATE_1");
        let proof = authority
            .assert_uniqueness_and_finalize(std::slice::from_ref(&pointer), &update_1, 1000)
            .unwrap();

        assert_eq!(proof.update_id, update_1);
        assert!(authority.is_consumed(&pointer));

        let update_2 = UpdateId::new("UPDATE_2");
        let second_attempt = authority.assert_uniqueness_and_finalize(&[pointer], &update_2, 1001);
        assert!(matches!(
            second_attempt,
            Err(DomainError::RecordConsumed(_))
        ));
    }
}
