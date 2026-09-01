use thiserror::Error;

#[derive(Debug, Error, PartialEq, Eq, Clone)]
pub enum DomainError {
    #[error("invalid principal identifier: {0}")]
    InvalidPrincipal(String),

    #[error("amount must be strictly positive: {0}")]
    NonPositiveAmount(String),

    #[error("insufficient asset balance: available {available}, requested {requested}")]
    InsufficientBalance {
        available: String,
        requested: String,
    },

    #[error("currency / asset symbol mismatch: expected {expected}, got {actual}")]
    AssetMismatch { expected: String, actual: String },

    #[error("conservation of value violated: total input amount {inputs} does not equal total output amount {outputs}")]
    ConservationOfValueViolated { inputs: String, outputs: String },

    #[error("invalid account state transition: from {from} to {to}")]
    InvalidAccountTransition { from: String, to: String },

    #[error("account is inactive or suspended: {0}")]
    AccountInactive(String),

    #[error("overdraft limit exceeded: balance {balance}, limit {limit}, requested {requested}")]
    OverdraftExceeded {
        balance: String,
        limit: String,
        requested: String,
    },

    #[error("daily transaction limit exceeded: limit {limit}, accumulated {accumulated}, requested {requested}")]
    DailyLimitExceeded {
        limit: String,
        accumulated: String,
        requested: String,
    },

    #[error("record state invalid or already consumed: {0}")]
    RecordConsumed(String),

    #[error("missing required signature from principal: {0}")]
    MissingSignature(String),

    #[error("invalid cryptographic proof: {0}")]
    InvalidProof(String),

    #[error("validation error: {0}")]
    ValidationError(String),
}
