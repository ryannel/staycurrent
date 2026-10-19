# Practitioner review — b07, round 1

Reviewed a21–a23 and their supplied contexts against the original relational-practice goal. No other review report was read. These verdicts assess planned capability and boundaries; library behaviour and failure demonstrations still require implementation-specific evidence when written.

## a21 — Controlling the queries your application performs

**Pass. No required repair.** The plan makes abstraction cost observable without confusing statement count, round trips, transferred rows and retained objects. The warm identity-map case, joined-collection multiplication and parent-page-before-children decision address failures that a simple N+1 example would miss. Implicit flushes and stale tracked objects connect query convenience to correctness. Authorisation survives separate loads and composition, while integration tests include response serialisation and variable parent counts. SQL semantics, cleanup and physical tuning have clear owners. This provides the necessary practitioner depth without an ORM-specific curriculum or further child article.

## a22 — Recovering database requests safely

**Pass. No required repair.** The plan preserves operation identity and intent while allowing each transaction attempt to recompute state-dependent decisions. The atomic claim/business-change/result contract covers concurrent duplicates, fingerprints, retention and late requests; it does not mistake a key or an expired caller for a complete recovery design. “Resolve an outcome that the caller did not receive” correctly requires authoritative evidence and treats an absent record as inconclusive while earlier work can remain active. Deadline budgets, one retry-owning layer and bounded unresolved work make this operationally usable. Connection cleanup and external outcomes retain separate owners. No additional retry or idempotency branch is needed.

## a23 — Connecting transactions to background work and events

**Pass. No required repair.** The plan closes the database-to-external-work gap without claiming that an outbox, claim lease or completion row makes an external effect atomic or unique. Attempt identity is distinct from stable operation identity, obsolete completion is rejected, and a still-running old worker remains part of the failure argument. Event meaning under delayed publication and replay retention are bounded by the application's actual recovery contract. Polling/CDC comparison retains initial-capture boundaries, restart duplication and retained source evidence while excluding connector administration and messaging internals. The final recovery cases make incomplete work discoverable rather than relying on eventual success. This is necessary relational integration depth; no additional messaging branch is justified.

## Batch verdict

All three plans pass. No required repair or additional article is identified.
