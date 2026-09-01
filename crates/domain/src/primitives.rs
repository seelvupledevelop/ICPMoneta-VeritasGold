use crate::errors::DomainError;
use candid::{CandidType, Principal};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::fmt;
use std::str::FromStr;
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct PrincipalId(pub Principal);

impl PrincipalId {
    pub fn anonymous() -> Self {
        Self(Principal::anonymous())
    }

    pub fn from_text(text: &str) -> Result<Self, DomainError> {
        Principal::from_text(text)
            .map(Self)
            .map_err(|e| DomainError::InvalidPrincipal(e.to_string()))
    }

    pub fn from_slice(slice: &[u8]) -> Self {
        Self(Principal::from_slice(slice))
    }

    pub fn from_uuid(uuid: &Uuid) -> Self {
        Self(Principal::from_slice(uuid.as_bytes()))
    }

    pub fn new_user(index: u8) -> Self {
        Self(Principal::from_slice(&[
            0x01, index, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01,
        ]))
    }

    pub fn as_principal(&self) -> &Principal {
        &self.0
    }
}

impl Default for PrincipalId {
    fn default() -> Self {
        Self::anonymous()
    }
}

impl fmt::Display for PrincipalId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0.to_text())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct AccountId(String);

impl AccountId {
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    pub fn random() -> Self {
        Self(format!("ACC-{}", Uuid::new_v4()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for AccountId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct HoldingId(String);

impl HoldingId {
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    pub fn random() -> Self {
        Self(format!("HLD-{}", Uuid::new_v4()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for HoldingId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct UpdateId(String);

impl UpdateId {
    pub fn new(hash: impl Into<String>) -> Self {
        Self(hash.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for UpdateId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct ProtocolId(String);

impl ProtocolId {
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    pub fn random() -> Self {
        Self(format!("PROTO-{}", Uuid::new_v4()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for ProtocolId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct CurrencyCode(String);

impl CurrencyCode {
    pub fn new(code: impl Into<String>) -> Result<Self, DomainError> {
        let s = code.into().trim().to_ascii_uppercase();
        if s.len() < 2 || s.len() > 12 {
            return Err(DomainError::ValidationError(format!(
                "Invalid currency symbol: {}",
                s
            )));
        }
        Ok(Self(s))
    }

    pub fn usd() -> Self {
        Self("USD".to_string())
    }

    pub fn eur() -> Self {
        Self("EUR".to_string())
    }

    pub fn icp() -> Self {
        Self("ICP".to_string())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for CurrencyCode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, CandidType)]
pub struct RecordPointer {
    pub update_id: UpdateId,
    pub output_index: u32,
}

impl fmt::Display for RecordPointer {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}:{}", self.update_id, self.output_index)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub enum RecordStatus {
    Unconsumed,
    Consumed {
        consuming_update_id: UpdateId,
        consumed_at: u64,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, CandidType)]
pub struct Amount {
    value_str: String,
}

impl Amount {
    pub fn from_decimal(dec: Decimal) -> Result<Self, DomainError> {
        Ok(Self {
            value_str: dec.to_string(),
        })
    }

    pub fn from_str_strict(s: &str) -> Result<Self, DomainError> {
        let dec = Decimal::from_str(s).map_err(|e| DomainError::ValidationError(e.to_string()))?;
        Self::from_decimal(dec)
    }

    pub fn zero() -> Self {
        Self {
            value_str: "0".to_string(),
        }
    }

    pub fn decimal(&self) -> Decimal {
        Decimal::from_str(&self.value_str).unwrap_or(Decimal::ZERO)
    }

    pub fn as_str(&self) -> &str {
        &self.value_str
    }

    pub fn add(&self, other: &Amount) -> Amount {
        let res = self.decimal() + other.decimal();
        Amount {
            value_str: res.to_string(),
        }
    }

    pub fn subtract(&self, other: &Amount) -> Result<Amount, DomainError> {
        let diff = self.decimal() - other.decimal();
        if diff < Decimal::ZERO {
            return Err(DomainError::InsufficientBalance {
                available: self.value_str.clone(),
                requested: other.value_str.clone(),
            });
        }
        Ok(Amount {
            value_str: diff.to_string(),
        })
    }
}

impl fmt::Display for Amount {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.value_str)
    }
}
