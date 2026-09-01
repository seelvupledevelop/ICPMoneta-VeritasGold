use crate::primitives::PrincipalId;
use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct BlindedIdentity {
    pub anonymous_principal: PrincipalId,
    pub well_known_principal: PrincipalId,
    pub ownership_proof_signature: Vec<u8>,
    pub created_at: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct PrincipalProfile {
    pub principal: PrincipalId,
    pub legal_name: String,
    pub role: String,
    pub is_verified: bool,
    pub registered_at: u64,
}
