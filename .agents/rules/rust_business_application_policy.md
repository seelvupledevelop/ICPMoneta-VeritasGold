---
trigger: always_on
description: Core Rust Business Application AI Rules Library & Backend Engineering Standards
---

# Rust Business Application AI Rules

- **Design Priorities**: Correctness before cleverness, clear domain naming, explicit typed errors, bounded resources, no-panic policy (`unwrap()` / `expect()` strictly prohibited in production paths).
- **Workspace Architecture**: Hexagonal / Clean layered architecture (`domain`, `application`, `infrastructure`, `api`, `worker`, `shared-testkit`).
- **Domain Modeling**: Rich value objects with validated constructors, newtypes, exhaustive enums for state machines, exact decimal/integer minor units for financial money.
- **Java/Kotlin to Rust Transition**: Convert nullable to `Option<T>`, exceptions to `Result<T, E>`, interfaces/classes to traits and composition, DTOs separate from domain and persistence models.
- **Data Access & Concurrency**: Parameterized SQL (SQLx), transactional outbox pattern, idempotent state transitions, Tokio async with structured observability via `tracing`.
