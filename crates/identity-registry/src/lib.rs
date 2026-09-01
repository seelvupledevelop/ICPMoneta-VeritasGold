use domain::errors::DomainError;
use domain::identities::{BlindedIdentity, PrincipalProfile};
use domain::primitives::PrincipalId;
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::sync::RwLock;

#[derive(Default)]
pub struct IdentityRegistry {
    profiles: RwLock<HashMap<PrincipalId, PrincipalProfile>>,
    blinded_identities: RwLock<HashMap<PrincipalId, BlindedIdentity>>,
}

impl IdentityRegistry {
    pub fn new() -> Self {
        Self {
            profiles: RwLock::new(HashMap::new()),
            blinded_identities: RwLock::new(HashMap::new()),
        }
    }

    pub fn register_profile(
        &self,
        principal: PrincipalId,
        legal_name: impl Into<String>,
        role: impl Into<String>,
        timestamp: u64,
    ) -> Result<PrincipalProfile, DomainError> {
        let name = legal_name.into().trim().to_string();
        if name.is_empty() {
            return Err(DomainError::ValidationError(
                "Legal name cannot be empty".to_string(),
            ));
        }

        let profile = PrincipalProfile {
            principal,
            legal_name: name,
            role: role.into(),
            is_verified: true,
            registered_at: timestamp,
        };

        let mut lock = self.profiles.write().unwrap();
        lock.insert(principal, profile.clone());
        Ok(profile)
    }

    pub fn get_profile(&self, principal: &PrincipalId) -> Option<PrincipalProfile> {
        let lock = self.profiles.read().unwrap();
        lock.get(principal).cloned()
    }

    pub fn issue_blinded_identity(
        &self,
        well_known_principal: PrincipalId,
        anonymous_principal: PrincipalId,
        timestamp: u64,
    ) -> Result<BlindedIdentity, DomainError> {
        let mut hasher = Sha256::new();
        hasher.update(b"BLINDED_PROOF_V1_");
        hasher.update(well_known_principal.to_string().as_bytes());
        hasher.update(anonymous_principal.to_string().as_bytes());
        hasher.update(timestamp.to_be_bytes());
        let signature = hasher.finalize().to_vec();

        let identity = BlindedIdentity {
            anonymous_principal,
            well_known_principal,
            ownership_proof_signature: signature,
            created_at: timestamp,
        };

        let mut lock = self.blinded_identities.write().unwrap();
        lock.insert(anonymous_principal, identity.clone());
        Ok(identity)
    }

    pub fn verify_blinded_ownership(
        &self,
        anonymous: &PrincipalId,
        declared_owner: &PrincipalId,
    ) -> Result<bool, DomainError> {
        let lock = self.blinded_identities.read().unwrap();
        if let Some(record) = lock.get(anonymous) {
            Ok(&record.well_known_principal == declared_owner)
        } else {
            Ok(false)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_identity_registry_profile_and_blinded_issuance() {
        let registry = IdentityRegistry::new();
        let legal_entity = PrincipalId::new_user(10);
        let anonymous_party = PrincipalId::new_user(11);

        let profile = registry
            .register_profile(
                legal_entity,
                "Swiss Liquidity Provider AG",
                "MarketMaker",
                5000,
            )
            .unwrap();

        assert_eq!(profile.legal_name, "Swiss Liquidity Provider AG");
        assert!(profile.is_verified);

        let blinded = registry
            .issue_blinded_identity(legal_entity, anonymous_party, 5001)
            .unwrap();

        assert_eq!(blinded.well_known_principal, legal_entity);
        assert_eq!(blinded.anonymous_principal, anonymous_party);

        assert!(registry
            .verify_blinded_ownership(&anonymous_party, &legal_entity)
            .unwrap());
    }
}
