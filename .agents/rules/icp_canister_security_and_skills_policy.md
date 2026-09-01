# Internet Computer (ICP) Canister Security & DFINITY Skills Policy

1. **Official Skills Integration**:
   When developing, modifying, or auditing ICP smart contracts, canisters, or HTTPS outcalls, always adhere to the official DFINITY skills standards at `https://skills.internetcomputer.org/`.

2. **Canister Security Mandates**:
   - **Anonymous Principal Rejection**: Authenticate all update endpoints (`caller != Principal::anonymous()`).
   - **Reentrancy Protection (CallerGuard Pattern)**: Prevent TOCTOU exploits during async `await` inter-canister and HTTP outcalls.
   - **Deterministic Transformation**: Supply a `transform` function for all HTTPS outcalls to ensure 2/3+ BFT subnet consensus.
   - **Bounded Memory & Cycles**: Specify `max_response_bytes` on all outcalls and monitor `freezing_threshold`.
   - **Stable Memory Direct Access**: Implement `ic-stable-structures` for zero-trap canister upgrades.
   - **Zero-Panic Policy**: Return explicit typed `Result<T, CanisterError>`; never call `unwrap()` or `expect()`.
