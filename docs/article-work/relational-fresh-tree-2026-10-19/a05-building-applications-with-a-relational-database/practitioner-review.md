# Practitioner review: application engineering breakdown

Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md`, using the assigned practitioner perspective in breakdown mode. Scope: the parent article and topic/title/brief-only child stubs. No existing relational corpus or earlier plans were consulted.

## Findings

### P2 — Give pooled session state an explicit owner

**Location:** `breakdown.yaml`, lines 35–44, “Making bounded database calls”.

The stub gives transaction ownership, pool budgets and cleanup after cancellation or failure good coverage, but does not explicitly plan the ordinary session-state contract. A successful transaction can leave session settings, temporary objects or session locks behind; application correctness can also depend on a physical session persisting across transactions. Neither committing successfully nor returning a connection without an error establishes that the next borrower has a clean context. This belongs with the client lifetime protocol, rather than the operations article's ownership of tenant isolation and privilege policy.

**Repair:** Add session-state ownership and reset/initialisation responsibilities to this child brief, with a compact comparison of application connection pooling and external session/transaction pooling. Require the chosen driver/pooler configuration to be checked for stateful features such as prepared statements, session settings and advisory locks. Add a real-engine reuse test proving that one request's context cannot affect the next borrower. This needs no new child article and only a short reminder in the parent's return-to-pool contract.

**Primary-source checks:** PostgreSQL's [DISCARD reference](https://www.postgresql.org/docs/current/sql-discard.html) enumerates session state beyond transaction completion, including session authorisation, settings, prepared statements, temporary resources and advisory locks. [PgBouncer's feature map](https://www.pgbouncer.org/features.html) distinguishes session and transaction pooling and documents incompatible session features; protocol-level prepared-plan support is configuration-dependent. These are concrete examples of the application contract that the brief should own, not a request for a pooler product tutorial.

## Coverage and boundaries otherwise accepted

The plan covers the commission's major application responsibilities: drivers and value mapping; query budgets and overload; retry and ambiguous-result handling; durable work, deduplication and change capture; compatible migrations and concurrent backfills; database-resident behaviour; bulk movement and reconciliation; caches/read models; and tests using the actual engine and client path. The parent supplies a coherent request-to-delivery example and delegates working depth without requiring a separate testing branch.

Boundary ownership is clear: SQL owns statement semantics, transactions own isolation and concurrency correctness, execution owns diagnosis, operations owns service procedures, and distribution owns replicated routing guarantees. Schema backfills and external ingestion have separate owners. The external-coordination child appropriately limits its workflow coverage to the relational integration protocol.

The cancellation and uncertain-outcome planning is technically sound at this level: PostgreSQL's [cancellation documentation](https://www.postgresql.org/docs/current/libpq-cancel.html) explicitly says successful cancellation dispatch does not guarantee an effect. The plan also correctly avoids inferring a failed command from a missing response. No other practitioner findings.

## Recheck

Pending the single P2 repair above.

### Repair recheck — accepted

Re-read the saved `breakdown.yaml` directly after repair. The parent now requires a known session context before a connection returns to the next borrower. “Making bounded database calls” explicitly owns initialisation and cleanup after successful use and failure, request/tenant context, application versus external session/transaction pooling, and compatibility checks for prepared statements, settings, temporary objects and session locks. Its real-engine test must verify that context cannot leak between borrowers.

The P2 finding is **closed**. The repair stays within the existing child and preserves the agreed ownership boundaries. No remaining practitioner findings.
