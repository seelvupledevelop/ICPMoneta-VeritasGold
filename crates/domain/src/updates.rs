use crate::primitives::{PrincipalId, RecordPointer, UpdateId};
use candid::CandidType;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub enum OperationIntent {
    IssueAsset {
        symbol: String,
        recipient: PrincipalId,
    },
    TransferAsset {
        symbol: String,
        recipient: PrincipalId,
    },
    RedeemAsset {
        symbol: String,
    },
    CreateAccount {
        owner: PrincipalId,
    },
    DebitAccount {
        amount: String,
    },
    CreditAccount {
        amount: String,
    },
    TruncateHistory {
        root_pointer: RecordPointer,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct SignatureAssertion {
    pub signer: PrincipalId,
    pub signature: Vec<u8>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct LedgerUpdateDraft {
    pub consumed_inputs: Vec<RecordPointer>,
    pub reference_inputs: Vec<RecordPointer>,
    pub produced_outputs: Vec<Vec<u8>>,
    pub intent: OperationIntent,
    pub required_signers: Vec<PrincipalId>,
    pub signatures: Vec<SignatureAssertion>,
    pub timestamp: u64,
}

impl LedgerUpdateDraft {
    pub fn calculate_hash(&self) -> UpdateId {
        let mut hasher = Sha256::new();
        hasher.update(format!("{:?}", self.intent).as_bytes());
        for input in &self.consumed_inputs {
            hasher.update(input.to_string().as_bytes());
        }
        for ref_input in &self.reference_inputs {
            hasher.update(ref_input.to_string().as_bytes());
        }
        for output in &self.produced_outputs {
            hasher.update(output);
        }
        hasher.update(self.timestamp.to_be_bytes());

        let hash_hex = hex::encode(hasher.finalize());
        UpdateId::new(format!("0x{}", hash_hex))
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct FinalityProof {
    pub update_id: UpdateId,
    pub authority_principal: PrincipalId,
    pub attestation_signature: Vec<u8>,
    pub timestamp: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct UpdateReceipt {
    pub update_id: UpdateId,
    pub finality_proof: FinalityProof,
    pub timestamp: u64,
}
