---
name: icpskills
description: >-
  Official Internet Computer (ICP) Skills & Canister Security Suite: Provides verified DFINITY
  canister architecture, Rust/Motoko smart contract patterns, native HTTPS Outcalls for real-world
  oracles/APIs, BFT consensus verification, stable memory persistence (ic-stable-structures),
  reentrancy prevention (CallerGuard), and anonymous principal access control.
---

# 🌐 Official Internet Computer (ICP) Canister Skills & Security Protocol

This skill provides direct access to the official DFINITY Foundation skill library (`https://skills.internetcomputer.org/`) and enforces best practices for building secure, high-throughput Rust canisters.

## 📡 Live Skill Fetching Protocol:
- **Skill Index**: `https://skills.internetcomputer.org/.well-known/skills/index.json`
- **Security Guide**: `https://skills.internetcomputer.org/.well-known/skills/canister-security/SKILL.md`
- **Certified Variables**: `https://skills.internetcomputer.org/.well-known/skills/certified-variables/SKILL.md`
- **Chain-Key Bitcoin (ckBTC)**: `https://skills.internetcomputer.org/.well-known/skills/ckbtc/SKILL.md`

## 🛡️ Mandatory Canister Security Invariants:

1. **Reject Anonymous Principal**:
   Every state-modifying update method must check that the caller is authenticated:
   ```rust
   if ic_cdk::caller() == candid::Principal::anonymous() {
       return Err("Anonymous principal rejected".to_string());
   }
   ```

2. **CallerGuard & TOCTOU Reentrancy Prevention**:
   When making inter-canister or HTTPS outcalls, guard against state interleaving:
   ```rust
   // Lock caller before await
   let _guard = CallerGuard::acquire(ic_cdk::caller())?;
   // Perform async outcall
   let response = make_outcall().await;
   ```

3. **Deterministic HTTPS Outcall Transformations**:
   All external API requests must include a `transform` query method to strip volatile headers (Date, Cookies, Ray-IDs) so subnet validator nodes reach 2/3+ BFT consensus.

4. **Zero-Panic Policy & Bounded Resources**:
   - `unwrap()` and `expect()` are strictly prohibited in production canister code.
   - Always bound `max_response_bytes: Some(N)` on HTTP outcalls to avoid memory exhaustion.

5. **Stable Memory State Persistence**:
   Use `ic-stable-structures` (e.g. `StableBTreeMap`, `StableVec`) for persistence across canister WASM upgrades without serialization traps.
