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

    /// Pre-built smart contract DvP condition evaluator:
    /// IF:
    ///   settlementInstruction is approved
    ///   AND buyer is eligible
    ///   AND seller is eligible
    ///   AND cash is reserved
    ///   AND bonds are reserved
    ///   AND instruction has not expired
    ///   AND instruction has not settled
    ///   AND required authorisations are valid
    /// THEN:
    ///   transfer cash to seller
    ///   transfer bonds to buyer
    ///   mark instruction settled
    ///   emit finality event
    /// ELSE:
    ///   transfer nothing
    pub fn evaluate_and_execute_conditional_dvp(
        &self,
        mut instruction: ConditionalSettlementInstruction,
        current_time: u64,
    ) -> SettlementExecutionResult {
        if instruction.is_approved
            && instruction.is_buyer_eligible
            && instruction.is_seller_eligible
            && instruction.is_cash_reserved
            && instruction.is_bonds_reserved
            && current_time <= instruction.expiry_timestamp
            && !instruction.is_settled
            && instruction.required_authorisations_valid
        {
            instruction.is_settled = true;
            SettlementExecutionResult::Settled {
                instruction_id: instruction.instruction_id.clone(),
                cash_transferred_to_seller: instruction.cash_amount,
                bonds_transferred_to_buyer: instruction.bond_amount,
                finality_event: format!("FINALITY_DVP_ATOMIC_{}", instruction.instruction_id),
            }
        } else {
            let mut reasons = Vec::new();
            if !instruction.is_approved { reasons.push("settlementInstruction is not approved"); }
            if !instruction.is_buyer_eligible { reasons.push("buyer is not eligible"); }
            if !instruction.is_seller_eligible { reasons.push("seller is not eligible"); }
            if !instruction.is_cash_reserved { reasons.push("cash is not reserved"); }
            if !instruction.is_bonds_reserved { reasons.push("bonds are not reserved"); }
            if current_time > instruction.expiry_timestamp { reasons.push("instruction has expired"); }
            if instruction.is_settled { reasons.push("instruction has already settled"); }
            if !instruction.required_authorisations_valid { reasons.push("required authorisations are invalid"); }

            SettlementExecutionResult::TransferredNothing {
                reason: reasons.join("; "),
            }
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ConditionalSettlementInstruction {
    pub instruction_id: String,
    pub is_approved: bool,
    pub is_buyer_eligible: bool,
    pub is_seller_eligible: bool,
    pub is_cash_reserved: bool,
    pub is_bonds_reserved: bool,
    pub expiry_timestamp: u64,
    pub is_settled: bool,
    pub required_authorisations_valid: bool,
    pub buyer_account_id: AccountId,
    pub seller_account_id: AccountId,
    pub cash_amount: String,
    pub bond_amount: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SettlementExecutionResult {
    Settled {
        instruction_id: String,
        cash_transferred_to_seller: String,
        bonds_transferred_to_buyer: String,
        finality_event: String,
    },
    TransferredNothing {
        reason: String,
    },
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_conditional_settlement_all_conditions_met() {
        let authority = Arc::new(FinalityAuthority::default());
        let engine = SettlementEngine::new(authority);

        let instruction = ConditionalSettlementInstruction {
            instruction_id: "INST-2026-XAU-001".to_string(),
            is_approved: true,
            is_buyer_eligible: true,
            is_seller_eligible: true,
            is_cash_reserved: true,
            is_bonds_reserved: true,
            expiry_timestamp: 2000,
            is_settled: false,
            required_authorisations_valid: true,
            buyer_account_id: AccountId::new("ACC-BUYER-01".to_string()),
            seller_account_id: AccountId::new("ACC-SELLER-01".to_string()),
            cash_amount: "500000.00 EUR".to_string(),
            bond_amount: "5000 UNITS".to_string(),
        };

        let result = engine.evaluate_and_execute_conditional_dvp(instruction, 1000);
        match result {
            SettlementExecutionResult::Settled {
                instruction_id,
                cash_transferred_to_seller,
                bonds_transferred_to_buyer,
                finality_event,
            } => {
                assert_eq!(instruction_id, "INST-2026-XAU-001");
                assert_eq!(cash_transferred_to_seller, "500000.00 EUR");
                assert_eq!(bonds_transferred_to_buyer, "5000 UNITS");
                assert_eq!(finality_event, "FINALITY_DVP_ATOMIC_INST-2026-XAU-001");
            }
            SettlementExecutionResult::TransferredNothing { reason } => {
                panic!("Expected settlement to succeed, got: {}", reason);
            }
        }
    }

    #[test]
    fn test_conditional_settlement_condition_failed_transfers_nothing() {
        let authority = Arc::new(FinalityAuthority::default());
        let engine = SettlementEngine::new(authority);

        let instruction = ConditionalSettlementInstruction {
            instruction_id: "INST-2026-XAU-FAIL".to_string(),
            is_approved: true,
            is_buyer_eligible: true,
            is_seller_eligible: false, // Seller not eligible!
            is_cash_reserved: true,
            is_bonds_reserved: false, // Bonds not reserved!
            expiry_timestamp: 2000,
            is_settled: false,
            required_authorisations_valid: true,
            buyer_account_id: AccountId::new("ACC-BUYER-01".to_string()),
            seller_account_id: AccountId::new("ACC-SELLER-01".to_string()),
            cash_amount: "500000.00 EUR".to_string(),
            bond_amount: "5000 UNITS".to_string(),
        };

        let result = engine.evaluate_and_execute_conditional_dvp(instruction, 1000);
        match result {
            SettlementExecutionResult::Settled { .. } => {
                panic!("Expected TransferredNothing, but got Settled");
            }
            SettlementExecutionResult::TransferredNothing { reason } => {
                assert!(reason.contains("seller is not eligible"));
                assert!(reason.contains("bonds are not reserved"));
            }
        }
    }
}


