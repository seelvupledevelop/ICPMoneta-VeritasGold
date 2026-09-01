use asset_ledger::AssetLedger;
use domain::accounts::DemandDepositRecord;
use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::identities::BlindedIdentity;
use domain::primitives::{AccountId, Amount, CurrencyCode, PrincipalId, ProtocolId, UpdateId};
use domain::updates::UpdateReceipt;
use identity_registry::IdentityRegistry;
use position_ledger::PositionLedger;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ProtocolState {
    Initiated,
    SignaturesCollected { signers: Vec<PrincipalId> },
    Finalized { update_receipt: UpdateReceipt },
    Failed { reason: String },
}

pub struct ProtocolCoordinator {
    position_ledger: Arc<PositionLedger>,
    asset_ledger: Arc<AssetLedger>,
    identity_registry: Arc<IdentityRegistry>,
    protocols: RwLock<HashMap<ProtocolId, ProtocolState>>,
}

impl ProtocolCoordinator {
    pub fn new(
        position_ledger: Arc<PositionLedger>,
        asset_ledger: Arc<AssetLedger>,
        identity_registry: Arc<IdentityRegistry>,
    ) -> Self {
        Self {
            position_ledger,
            asset_ledger,
            identity_registry,
            protocols: RwLock::new(HashMap::new()),
        }
    }

    pub fn execute_cash_transfer_protocol(
        &self,
        sender_id: &AccountId,
        recipient_id: &AccountId,
        amount: &Amount,
        timestamp: u64,
    ) -> Result<(ProtocolId, DemandDepositRecord, DemandDepositRecord), DomainError> {
        let protocol_id = ProtocolId::random();
        {
            let mut lock = self.protocols.write().unwrap();
            lock.insert(protocol_id.clone(), ProtocolState::Initiated);
        }

        let (sender_updated, recipient_updated) = self.position_ledger.execute_direct_transfer(
            sender_id,
            recipient_id,
            amount,
            timestamp,
        )?;

        let mut lock = self.protocols.write().unwrap();
        lock.insert(
            protocol_id.clone(),
            ProtocolState::Finalized {
                update_receipt: UpdateReceipt {
                    update_id: UpdateId::new(format!("CASH_TX_{}", protocol_id)),
                    finality_proof: domain::updates::FinalityProof {
                        update_id: UpdateId::new(format!("CASH_TX_{}", protocol_id)),
                        authority_principal: PrincipalId::anonymous(),
                        attestation_signature: vec![1, 1, 1],
                        timestamp,
                    },
                    timestamp,
                },
            },
        );

        Ok((protocol_id, sender_updated, recipient_updated))
    }

    pub fn execute_asset_transfer_protocol(
        &self,
        sender: PrincipalId,
        recipient: PrincipalId,
        currency: CurrencyCode,
        amount: Amount,
        timestamp: u64,
    ) -> Result<
        (
            ProtocolId,
            FungibleAssetHolding,
            Option<FungibleAssetHolding>,
            UpdateReceipt,
        ),
        DomainError,
    > {
        let protocol_id = ProtocolId::random();
        {
            let mut lock = self.protocols.write().unwrap();
            lock.insert(protocol_id.clone(), ProtocolState::Initiated);
        }

        let (transferred, change, receipt) = self
            .asset_ledger
            .transfer_asset(sender, recipient, currency, amount, timestamp)?;

        let mut lock = self.protocols.write().unwrap();
        lock.insert(
            protocol_id.clone(),
            ProtocolState::Finalized {
                update_receipt: receipt.clone(),
            },
        );

        Ok((protocol_id, transferred, change, receipt))
    }

    pub fn execute_blinded_identity_exchange_protocol(
        &self,
        well_known_a: PrincipalId,
        anonymous_a: PrincipalId,
        timestamp: u64,
    ) -> Result<(ProtocolId, BlindedIdentity), DomainError> {
        let protocol_id = ProtocolId::random();
        let identity =
            self.identity_registry
                .issue_blinded_identity(well_known_a, anonymous_a, timestamp)?;

        let mut lock = self.protocols.write().unwrap();
        lock.insert(
            protocol_id.clone(),
            ProtocolState::Finalized {
                update_receipt: UpdateReceipt {
                    update_id: UpdateId::new(format!("ID_SWAP_{}", protocol_id)),
                    finality_proof: domain::updates::FinalityProof {
                        update_id: UpdateId::new(format!("ID_SWAP_{}", protocol_id)),
                        authority_principal: PrincipalId::anonymous(),
                        attestation_signature: vec![2, 2, 2],
                        timestamp,
                    },
                    timestamp,
                },
            },
        );

        Ok((protocol_id, identity))
    }

    pub fn get_protocol_state(&self, protocol_id: &ProtocolId) -> Option<ProtocolState> {
        let lock = self.protocols.read().unwrap();
        lock.get(protocol_id).cloned()
    }
}
