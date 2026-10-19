# Practitioner review — b22

## a22 — Recovering database requests safely

**Verdict: technical PASS; overall acceptance pending the repaired rendered snapshot.** No required prose, SQL, native-harness or model-semantic repairs. No optional changes requested. The rendering requirements below remain for the separately scheduled narrow b24 check.

### Scope and practical judgement

Read the complete frozen article, original relational-practice commission, supplied context and sibling plans, actual a04 recovery/ordinary-request explanation and recently reviewed a20 sibling, source ledger, writer report, both retained native runs, complete rehearsal and all five models. The parent teaches a useful first response to known abort versus unknown completion. This article supplies the separate decisions needed to implement recovery: one operation across requests and transaction attempts; a shared deadline and retry owner; outcome evidence; an atomic scoped claim with request equivalence; retained results and expiry; and discoverable unresolved work. It leaves stock concurrency, connection cleanup, external effects and pending-worker takeover with their owners. The depth is appropriate for relational practice, without requiring a general distributed workflow system.

The prose does not infer an abort from a driver timeout, sending cancellation, an empty preliminary lookup or losing a COMMIT reply. Permanent constraints require application classification. Complete retries preserve intent and recompute database-dependent decisions. A new key is explicitly a new operation. Rejection retention, authorisation, complete business changes, response reconstruction and canonicalisation are bounded design obligations rather than falsely reported native executions. The fixed ordered SHA-256 fixture is not represented as a general canonicalisation implementation. Retained identity and tombstones have different replay capabilities; deleting the sole evidence removes the corresponding guarantee. The no-deletion-during-supported-retry-window assumption is explicit.

### Independent execution

Ran the inspected rehearsal with a temporary change only to its accepted database-name prefix, pinned pg 8.23.1, Node 24.16.0 and PostgreSQL 18.6. Fresh reviewer database: `rel3_prac_a22_1792460101`. Full own output: `/private/tmp/rel3-prac-a22-native.jsonl`. All assertions passed. The raw output includes eighteen records including runtime, final invariants and cleanup.

The controlled loopback proxy has meaningful injection points: it parses the frontend simple Query COMMIT before forwarding, or the backend CommandComplete COMMIT before delivery. Its ephemeral sockets and server are closed in `finally`. Independent observation waits for the test backend to disappear before querying the durable record. This distinguishes database evidence from the failed client's knowledge. Both cuts produced exactly `Connection terminated unexpectedly`, with no SQLSTATE; the authoritative record counts were respectively 0 and 1. Same-key recovery was a fresh claimant only in the former case and returned the retained identity in the latter. The controlled injector knows the histories; the connection error alone cannot choose between them.

The run also reproduced acquisition exhaustion with a removed waiter; cancellation and statement timeout yielding 57014 then 25P02 and no committed probe; driver read timeout while PgSleep remained active; transaction timeout 25P04; complete serialisation retry reading 0 then 1 and committing counter 2; matching versus changed-fingerprint overlap; claim-wait timeout without cancelling A; an attempt outliving its caller; known-commit response suppression; and deliberate retention deletion admitting a second order. Final counts were nine orders and eight retained operations, the deliberate expiry reuse accounting for the extra order.

The deferred-trigger COMMIT completed successfully in 306 ms with local statement_timeout 40 ms, and its row existed. This reproduces the revised bounded observation. The first retained run stopped on its incorrect timeout expectation; it is not presented as evidence that COMMIT was cancelled. Neither the rehearsal nor the article generalises this one path into a guarantee about every commit-time timeout interaction.

Added three independently written bounded cases using the article's exact `order_operations` schema in a second fresh database, `rel3_prac_a22_bound1792460101`. Source and output: `/private/tmp/rel3-prac-a22-boundaries.mjs` and `/private/tmp/rel3-prac-a22-boundaries.json`.

- A's rollback released the waiting unique-key claim to B; B inserted and committed its own order, with no A order surviving.
- A single data-modifying CTE combining claim INSERT and fallback SELECT waited for A's commit, inserted nothing and returned no row. A separate next statement returned A's retained order. This directly confirms the consequential fresh-statement requirement.
- An inserted claim referencing a nonexistent order failed at COMMIT with 23503 and left no retained operation. The deferred reference permits claim-before-business-row ordering while still enforcing the commit invariant.

Both reviewer databases were dropped after all owned clients closed. Main cleanup observed zero sessions. No shared configuration, roles, dependencies or evidence were changed. Only the main rehearsal's documented session limits were used; supplement statements and lock waits were bounded to 3 seconds and 1 second respectively.

### Primary sources and source models

Checked [PostgreSQL timeout scopes](https://www.postgresql.org/docs/18/runtime-config-client.html), [Read Committed and conflict visibility](https://www.postgresql.org/docs/18/transaction-iso.html), [unique-index waiting](https://www.postgresql.org/docs/18/index-unique-checks.html), [complete transaction retry](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), [protocol completion](https://www.postgresql.org/docs/18/protocol-flow.html) and [SQLSTATE meanings](https://www.postgresql.org/docs/18/errcodes-appendix.html), with the driver timeout/pool contracts retained from the a20 checks. The article preserves the important implementation boundaries. Savepoint qualifications and higher-isolation conflict handling avoid treating this Read Committed protocol as universal.

Independently enumerated all thirteen choices and 63 frames. Checked every observer panel, event, result and note against the prose and actual native histories. Executable assertions covered complete frame structure, all model initials, retry/claim/expiry endpoints and all budget identities. Every budget frame sums elapsed and remaining to 800 ms; the long acquisition leaves only 100 ms beyond the 150 ms reserve, while the short path permits at most two database attempts. The stale-decision and tombstone discussions are correctly distinguished from what the fixture executed.

### Required rendered follow-up

Do not treat this report as a rendered pass. Source inspection of the b22 player confirms the two announced implementation problems independently: the initial visible outcome selector defaults to its first option while frames use `committed`; and dynamically created lane descendants lack Astro scope attributes required by their original scoped selectors. The separately planned repair must align the visible selection and model at initialisation/reset and preserve the intended lane styling after every redraw. Recheck actual displayed state agreement and all working comparisons in the repaired immutable preview.

At final source audit, article snapshot/rendered bytes and the model/rehearsal hashes still matched b22. `RecoveryFigure.astro` had already received the orchestrator's planned selector/global-descendant CSS repair and therefore no longer matched its old b22 hash. That expected source advance does not invalidate the unchanged technical review, but the new renderer needs its own manifest and browser check. No browser tab was opened during this source/native stage; port 4438 is released.
