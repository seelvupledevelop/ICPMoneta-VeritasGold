use domain::accounts::DemandDepositRecord;
use domain::assets::FungibleAssetHolding;
use domain::errors::DomainError;
use domain::primitives::{AccountId, HoldingId, PrincipalId, RecordPointer};
use domain::updates::{LedgerUpdateDraft, UpdateReceipt};
use finality_authority::FinalityAuthority;
use policy_engine::PolicyEngine;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

#[derive(Default)]
pub struct SettlementEngine {
    holdings: RwLock<HashMap<HoldingId, FungibleAssetHolding>>,
    accounts: RwLock<HashMap<AccountId, DemandDepositRecord>>,
    pointer_to_holding: RwLock<HashMap<RecordPointer, HoldingId>>,
    finality_authority: Arc<FinalityAuthority>,
}

impl SettlementEngine {
    pub fn new(finality_authority: Arc<FinalityAuthority>) -> Self {
        Self {
            holdings: RwLock::new(HashMap::new()),
            accounts: RwLock::new(HashMap::new()),
            pointer_to_holding: RwLock::new(HashMap::new()),
            finality_authority,
        }
    }

    pub fn register_holding(&self, holding: FungibleAssetHolding) {
        let mut h_lock = self.holdings.write().unwrap();
        let mut p_lock = self.pointer_to_holding.write().unwrap();
        p_lock.insert(holding.pointer.clone(), holding.holding_id.clone());
        h_lock.insert(holding.holding_id.clone(), holding);
    }

    pub fn register_account(&self, account: DemandDepositRecord) {
        let mut a_lock = self.accounts.write().unwrap();
        a_lock.insert(account.account_id.clone(), account);
    }

    pub fn get_holding(&self, id: &HoldingId) -> Option<FungibleAssetHolding> {
        let lock = self.holdings.read().unwrap();
        lock.get(id).cloned()
    }

    pub fn get_account(&self, id: &AccountId) -> Option<DemandDepositRecord> {
        let lock = self.accounts.read().unwrap();
        lock.get(id).cloned()
    }

    pub fn get_participant_holdings(&self, participant: &PrincipalId) -> Vec<FungibleAssetHolding> {
        let lock = self.holdings.read().unwrap();
        lock.values()
            .filter(|h| &h.holder == participant && h.is_unconsumed())
            .cloned()
            .collect()
    }

    pub fn get_participant_accounts(&self, participant: &PrincipalId) -> Vec<DemandDepositRecord> {
        let lock = self.accounts.read().unwrap();
        lock.values()
            .filter(|a| &a.owner == participant)
            .cloned()
            .collect()
    }

    pub fn apply_asset_transfer(
        &self,
        input_holdings: Vec<FungibleAssetHolding>,
        output_holdings: Vec<FungibleAssetHolding>,
        draft: LedgerUpdateDraft,
    ) -> Result<UpdateReceipt, DomainError> {
        PolicyEngine::validate_update(&input_holdings, &output_holdings, &draft)?;

        let update_id = draft.calculate_hash();
        let finality_proof = self.finality_authority.assert_uniqueness_and_finalize(
            &draft.consumed_inputs,
            &update_id,
            draft.timestamp,
        )?;

        let mut h_lock = self.holdings.write().unwrap();
        let mut p_lock = self.pointer_to_holding.write().unwrap();

        for mut input in input_holdings {
            input.consume(update_id.clone(), draft.timestamp)?;
            h_lock.insert(input.holding_id.clone(), input);
        }

        for output in output_holdings {
            p_lock.insert(output.pointer.clone(), output.holding_id.clone());
            h_lock.insert(output.holding_id.clone(), output);
        }

        Ok(UpdateReceipt {
            update_id,
            finality_proof,
            timestamp: draft.timestamp,
        })
    }
}
