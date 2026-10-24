# Practitioner review · article · r14, r16, r17 · batch04-v01

Inputs read: [frozen manifest](v01/manifest.json), the batch04 commission, briefs, running example and relevant parent/sibling/child plans in `v01/context/`; the three complete frozen article sources, figure implementations and downloadable verifiers; their scoped mechanical records; complete rendered pieces at port 4408, including opened Sources and further reading disclosures and the AI disclosure text. Current review skill and practitioner perspective only. No other reviews, author notes, feedback or repair history were read. This is initial article coverage, not a corpus review.

Highest severity: critical

## Checks · r14 Locks, contention and deadlocks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | The guard, isolation and snapshot conditions form a sound PostgreSQL protocol; the stale lock-only Repeatable Read case is correctly distinguished from a changed-guard conflict. |
| 2. Evidence | pass | Chosen figure schedules are labelled. The unchanged verifier and its receipt support the claimed local functional observations; source, environment and served bytes were traced. |
| 3. Coverage | pass | Covers empty children, all participating writers, fresh count placement, complete retries, contention budgets, lock ordering and wait diagnosis. |
| 4. Depth, both ways | pass | The declared entry already supplies snapshots and capacity. Enough lock-mode and operational detail supports decisions; no consequential missing prerequisite or unnecessary full mechanism was found. |
| 5. Ownership | pass | Owns complete guard and ordering protocols; refers full isolation, connection ownership, queue capacity and incident tooling to their neighbours. |

Practical challenge: an existing guard is insufficient if the booking count predates the wait. The piece handles both a count made too early and a count inside the same statement, and explicitly covers cancellation, moves between sessions and capacity changes. Its lock-only Repeatable Read counterexample does not confuse row waiting with refreshing the booking snapshot. The Serializable alternative correctly requires all participating transactions and retries. Sorting products is not oversold as protection against cross-table, trigger or foreign-key cycles.

Primary sources checked: PostgreSQL 18 [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [Explicit Locking](https://www.postgresql.org/docs/18/explicit-locking.html), [Serialization Failure Handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), [SELECT locking clause](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE), [Client Connection Defaults](https://www.postgresql.org/docs/18/runtime-config-client.html) and [System Information Functions](https://www.postgresql.org/docs/18/functions-info.html). These support the row-lock conflicts, snapshot distinction, wait/retry contracts, timeout scopes and blocker identification used here.

Evidence applicability: `v01/mechanical/r14/native.json` reports empty child locking admitting two bookings; fresh Read Committed count 1; lock-only Repeatable Read count admitting two; changed-guard 40001 and retry count 1; Serializable 40001; a deadlock and 55P03. I read the complete verifier and confirmed that its actual two-session barriers inspect `pg_blocking_pids`, that it selects a newly created private socket/data directory and checks `SHOW data_directory`, clears inherited PG variables, and cleans up. The frozen source hashes match. Current installed PostgreSQL is 18.6 and Python is 3.14.5. Reuse is restricted to those unchanged functional observations; no ceremonial rerun was made. Fresh control use reached the lock-only Repeatable Read overbooking result and the updated-guard retry/refusal result. A batched automation click reported a deadline at the last transition; a subsequent state read confirmed the intended 5/5 result, so this is not treated as a reader defect.

Findings: none for r14.

## Checks · r16 Retries when a commit reply is missing

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Distinguishes known abort from ambiguous commit and uses an immediate unique identity plus a subsequent Read Committed lookup correctly. |
| 2. Evidence | pass | Reply withholding and precommit client termination are accurately limited; stock, order, line and request counts match the exact verifier/data. |
| 3. Coverage | pass | Handles overlapping submissions, payload mismatch, stale replicas, absent lookups, retries, caller retention, expiry, refusals and restored history. |
| 4. Depth, both ways | pass | The concrete protocol supplies usable judgement without taking over driver or provider implementation. No substantive depth gap was found at its declared entry. |
| 5. Ownership | pass | Keeps purchase identity here and delegates external effects to r17 and engine-specific CockroachDB retry mechanics to its owner. |

Practical challenge: an unsuccessful stock reservation after the lost reply must not overwrite an earlier successful logical purchase. The piece resolves the request before rerunning stock work, rejects changed payloads, and explains why absence before the unique insertion is not ownership. It states the no-concurrent-deletion assumption and the successful-outcome-only contract. Retention and recovery can invalidate deduplication, and the article does not present a key as protection against discarded history. Bounded retry exhaustion preserves uncertainty rather than reporting a false refusal.

Primary sources checked: PostgreSQL 18 [Message Flow](https://www.postgresql.org/docs/18/protocol-flow.html), [Index Uniqueness Checks](https://www.postgresql.org/docs/18/index-unique-checks.html), [INSERT](https://www.postgresql.org/docs/18/sql-insert.html), [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED), [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) and [Serialization Failure Handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html). In particular, a conflicting insert can affect `DO NOTHING` without being in that statement's visible snapshot; the subsequent lookup is consequential.

Evidence applicability: `v01/mechanical/r16/native.json` and the complete unchanged `run-retries.py`/`shop.json` agree. The verifier consumes a real successful commit response at the harness boundary, separately terminates a precommit client, checks P3/P7/P9 as 10/0/4 and 1/2/1 order/line/request counts, compares payloads before additional work, and observes a blocked same-key insertion. The private-cluster/environment/cleanup provisions match r14. Fresh browser use changed the selected history and inspected the new-request/uncommitted intermediate state, whose committed stock correctly stays 12/1 until commit. Both figure branches were also checked in the frozen model implementation. No real network, driver retry, power-loss or provider result is inferred.

Findings: none for r16.

## Checks · r17 Outboxes and database-backed jobs

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | finding | The proposed resolution of an unknown claim commit can mistake another worker's claim for its own: practitioner-1 below. |
| 2. Evidence | pass | Existing local observations are supported by the exact unchanged verifier. A fresh native challenge exposes the additional untested claim-resolution failure; see separate raw evidence. |
| 3. Coverage | finding | Receiver deduplication, inbox atomicity, expiry, fencing scope, ordering, retention and operations are covered, but the ambiguous claim boundary gives an unsafe ownership decision. |
| 4. Depth, both ways | pass | The receiver and worker detail earns its place at the stated entry. Repair needs a complete ownership distinction, not a broader broker or provider survey. |
| 5. Ownership | pass | The article appropriately owns outbox/consumer/lease boundaries and delegates change streams and primary fencing. |

Practical challenge: the article correctly rejects the inference that an expired lease stops a process, distinguishes an effect ID from an ownership generation, and limits per-event fencing. It covers uncertain providers, retention, ordering and stranded work rather than claiming exactly-once delivery. The remaining problem is earlier: it treats a returned but uncommitted generation as sufficient identity when resolving a lost claim commit reply.

### practitioner-1 · critical · r17, Claim work briefly, paragraph immediately after the claim SQL

Problem: at [frozen r17 source line 46](v01/source/src/articles/relational-collection/r17.astro), the worker is told that a fresh Read Committed transaction can lock the event, wait for the earlier attempt, and establish ownership by matching its returned token against an unexpired claim. But `claim_token = o.claim_token + 1` is an ordinary transactional row update. An aborted attempt does not consume that generation. Another worker can obtain the same returned token.

The native counterexample used these exact boundaries:

1. The event starts unclaimed at token 0. A begins Read Committed and executes the article's candidate/update claim. `RETURNING` gives A `order-103-created|1` while A's transaction is still open.
2. A's client disconnects without committing. PostgreSQL rolls back the open transaction. An authoritative observer reads token 0 and a NULL lease. This is the aborted first-attempt history an uncertain-commit resolver must distinguish; the challenge controls that history rather than measuring a real lost COMMIT packet.
3. B, on a new connection, begins Read Committed, executes the same claim and commits. B also receives `order-103-created|1`; its lease is active.
4. A's proposed resolver begins a new Read Committed transaction and locks the event with `SELECT event_id, claim_token, claim_token = 1 AND lease_until > clock_timestamp() AS proposed_owner_test FROM outbox WHERE event_id = 'order-103-created' FOR UPDATE;`. It commits after reading. The result is `order-103-created|1|t`.

The matching token now belongs to B's committed claim. It does not identify A's original attempt, whose update was discarded. Waiting and a fresh snapshot make B's state visible; neither removes this identity collision.

Effect: the reader can authorise A to act under B's current lease. The claim no longer establishes the stated worker ownership. As a direct consequence of the same alias, token-only renewal/completion predicates cannot distinguish these two workers either; that latter consequence is a deduction from the shown predicates, not an additional observed native call. Receiver deduplication may contain a duplicate effect, but it does not make this ownership test true, and the article explicitly promises recovery and ownership reasoning separately.

Suggestion: give each claim attempt an independently unique identity that is retained across its uncertain result and stored with the lease, and require that identity when resolving, renewing and completing it; alternatively, use a token allocation protocol that cannot reuse a returned attempt identity after rollback. Preserve the event identity for deduplication and the appropriate ordered generation for fencing. Another valid bounded contract is to abandon an uncertain claim and wait for recoverable expiry rather than asserting it was acquired. Verify both aborted-then-reclaimed and committed-but-reply-lost histories, including the false-match case above.

Evidence: [native observation](practitioner-v01-r17-claim-aba.json), [exact challenge script](practitioner-v01-r17-claim-aba.py). Executed as `python3 /private/tmp/staycurrent-r17-claim-aba.py` against `/opt/homebrew/opt/postgresql@18/bin`, PostgreSQL 18.6, Python 3.14.5. The script creates a private owned cluster, clears inherited PG variables, checks the actual data directory, socket and role, disables TCP listening, and verifies removal after stopping it. PostgreSQL's [Message Flow termination contract](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-TERMINATION) and [ROLLBACK](https://www.postgresql.org/docs/18/sql-rollback.html) explain the discarded open transaction.

Primary sources checked for the remaining mechanisms: PostgreSQL 18 [SELECT](https://www.postgresql.org/docs/18/sql-select.html), [Current Date/Time](https://www.postgresql.org/docs/18/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT), [INSERT](https://www.postgresql.org/docs/18/sql-insert.html), [Index Uniqueness Checks](https://www.postgresql.org/docs/18/index-unique-checks.html), and Stripe's [Idempotent requests](https://docs.stripe.com/api/idempotent_requests). Stripe's base page was abbreviated by the fetcher; official indexed reference text supplied the payload/retention example. No claim about a particular production endpoint or current v2 behaviour was accepted from that abbreviated fetch, and no provider was called.

Evidence applicability: `v01/mechanical/r17/native.json` supports separate writes, combined rollback/commit, skipped locked claims, active leases, injected expiry, stale token 1 versus committed token 2, receipt/effect atomicity and the local receiver stand-in. I read its complete unchanged verifier and checked source hashes/environment. It does not exercise the alias after an aborted claim, so its successful stale-completion check does not close practitioner-1. The native challenge above was necessary for that missing branch; the unchanged experiments were not repeated.

## Limits

All 83 files in the frozen manifest matched. All four actual rendered download hrefs at port 4408 returned HTTP 200 and exact frozen source bytes; [raw scoped hash/download observations](practitioner-v01-observations.json) are separate from this report. Mechanical receipts' historical `metadata.json` hashes have no corresponding frozen file; I did not reuse them. The article, component, script and data hashes needed for the reused observations do match.

This review certifies neither visual/accessibility quality nor production throughput, independent failure domains, authentication, provider behaviour or a browser file-save action. No viewport or theme was changed. No browser download-event/save/path waits were used. Local HTTP initially encountered sandbox restrictions; the authorised bounded read succeeded after escalation. The one temporary browser tab was closed. No article/source repair, build or publication was performed.
