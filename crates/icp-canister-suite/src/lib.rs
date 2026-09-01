pub mod server;

use asset_ledger::AssetLedger;
use domain::accounts::DemandDepositRecord;
use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::identities::BlindedIdentity;
use domain::primitives::{AccountId, Amount, CurrencyCode, PrincipalId, ProtocolId};
use domain::updates::UpdateReceipt;
use finality_authority::FinalityAuthority;
use identity_registry::IdentityRegistry;
use position_ledger::PositionLedger;
use protocol_coordinator::{ProtocolCoordinator, ProtocolState};
use settlement_engine::SettlementEngine;
use std::sync::Arc;

pub struct CanisterEnvironment {
    pub settlement_engine: Arc<SettlementEngine>,
    pub finality_authority: Arc<FinalityAuthority>,
    pub identity_registry: Arc<IdentityRegistry>,
    pub position_ledger: Arc<PositionLedger>,
    pub asset_ledger: Arc<AssetLedger>,
    pub protocol_coordinator: Arc<ProtocolCoordinator>,
}

impl CanisterEnvironment {
    pub fn bootstrap(authority_principal: PrincipalId) -> Self {
        let finality_authority = Arc::new(FinalityAuthority::new(authority_principal));
        let settlement_engine = Arc::new(SettlementEngine::new(finality_authority.clone()));
        let identity_registry = Arc::new(IdentityRegistry::new());
        let position_ledger = Arc::new(PositionLedger::new(settlement_engine.clone()));
        let asset_ledger = Arc::new(AssetLedger::new(settlement_engine.clone()));
        let protocol_coordinator = Arc::new(ProtocolCoordinator::new(
            position_ledger.clone(),
            asset_ledger.clone(),
            identity_registry.clone(),
        ));

        Self {
            settlement_engine,
            finality_authority,
            identity_registry,
            position_ledger,
            asset_ledger,
            protocol_coordinator,
        }
    }

    pub fn transfer_cash(
        &self,
        sender_id: &AccountId,
        recipient_id: &AccountId,
        amount: &Amount,
        timestamp: u64,
    ) -> Result<(ProtocolId, DemandDepositRecord, DemandDepositRecord), DomainError> {
        self.protocol_coordinator
            .execute_cash_transfer_protocol(sender_id, recipient_id, amount, timestamp)
    }

    pub fn transfer_asset(
        &self,
        sender: PrincipalId,
        recipient: PrincipalId,
        currency: CurrencyCode,
        amount: Amount,
        timestamp: u64,
    ) -> Result<(ProtocolId, FungibleAssetHolding, Option<FungibleAssetHolding>, UpdateReceipt), DomainError> {
        self.protocol_coordinator
            .execute_asset_transfer_protocol(sender, recipient, currency, amount, timestamp)
    }

    pub fn swap_blinded_identity(
        &self,
        well_known: PrincipalId,
        anonymous: PrincipalId,
        timestamp: u64,
    ) -> Result<(ProtocolId, BlindedIdentity), DomainError> {
        self.protocol_coordinator
            .execute_blinded_identity_exchange_protocol(well_known, anonymous, timestamp)
    }

    pub fn query_protocol(&self, protocol_id: &ProtocolId) -> Option<ProtocolState> {
        self.protocol_coordinator.get_protocol_state(protocol_id)
    }
}
