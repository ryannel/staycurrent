# Practitioner repair confirmation · r16, r17 · batch04-v02

Inputs read: [exact manifest](v02/manifest.json), assigned current r16/r17 source, r17 download, relevant briefs/commission/shared example/tree/parent-child boundaries, current mechanical native output/provenance/sources and qualified unchanged-media identities. Rendered pieces were read at `http://127.0.0.1:4456/review/relational-collection/`, the exact immutable4448 output alias. All159 packet manifest entries matched their SHA-256 hashes. The current review skill and practitioner perspective governed the assignment. No peer reports, author quality notes, earlier source or repair history were read. Accepted problem descriptions were supplied: this is informed repair confirmation, not independent complete/corpus review.

Highest severity: **critical**. The original uncertain-token alias repair passes its histories and affected uncertainty paths. A separate strict-expiry assertion fails when an otherwise unchanged row is locked across expiry.

## Checks

| Piece | Check | Result | Note |
| --- | --- | --- | --- |
| r16 | Correctness | pass | The ordinary purchase_requests introduction preserves the immediate request identity and deferred order reference. |
| r16 | Evidence | pass | No schema, fixture or observed protocol claim changed; exact unchanged evidence remains applicable. |
| r16 | Coverage | pass | The introduced table still records one payload and committed purchase outcome. |
| r16 | Depth, both ways | pass | The introduction explains its meaning directly without production-process terminology. |
| r16 | Ownership | pass | Logical purchase resolution stays distinct from r17's external work. |
| r17 | Correctness | finding | Provisional-token retirement fixes aliasing; the claim that follow-up writes act only under an unexpired lease is too strong. |
| r17 | Evidence | pass | Current exact verifier supports the declared controlled histories; independent widened native probe establishes the separate expiry counterexample. |
| r17 | Coverage | finding | Renewal/completion/release need a time-of-authorisation contract that includes row-lock waits. |
| r17 | Depth, both ways | pass | Token scope, stable effect identity and uncertainty remain proportionate; no global attempt identity is implied. |
| r17 | Ownership | pass | The protocol keeps event claims, receiver deduplication, inbox transactions and resource fencing distinct. |

## Accepted-problem results

### r16/r17 table introductions: pass

The rendered r16 introduction says what one purchase_requests row records, then the unchanged declaration shows its immediate primary key and deferred required order reference. r17 introduces its outbox table and five scheduling/ownership fields in ordinary application terms. Neither introduction uses “explanation-owned”. Schema authority and meaning are unchanged: a request record identifies a logical purchase, an event identifies committed intended work, and claim_token is a per-event generation. No unchanged full native rerun was needed for those wording replacements.

### r17 transactional token reuse and uncertain ownership: pass

The rendered claim section now makes RETURNING provisional until successful COMMIT acknowledgement. Uncertain claim outcomes permanently retire that returned claim: no external call, renewal, completion or release is authorised under it. The broken connection is disposed of and cleanup finished before normal eligible claiming resumes. A later matching token lookup is explicitly rejected as ownership recovery.

The exact current verifier and native records show both required histories:

| History | Native result and repaired protocol |
| --- | --- |
| A receives1 and disconnects before COMMIT; B later commits1 | A's update rolls back to0; B commits1; a fresh locking equality test returns true. Token-only renewal and completion can mutate B's row in the deliberately rolled-back counterexample. Retired A sends none of receiver/renew/complete/release; acknowledged B completes. |
| A commits1 but its successful reply is withheld from the simulated worker | A retires despite the stored token matching. Normal polling obtains no claim during the lease. Injected expiry permits a new acknowledged token2 and completion. |

This is a sound chosen application contract: neither a fresh snapshot nor locking converts the number into an identity of A's attempt. Only committed claims of this event form the increasing generation sequence. It is not a global or non-reusing identity of every attempted claim.

Checked every affected uncertainty path in prose and exact `Worker` verifier: renewal, completion and release each have both disconnect-before-COMMIT and committed-but-reply-withheld native cases. All six retire the simulated worker and block later receiver/renew/complete/release operations. A committed completion remains excluded from polling; other unfinished states recover by ordinary claiming, with expiry where appropriate. `Worker.perform` clears its token on uncertain outcome, missing affected row, completion or release. The synchronous harness does not have a receiver call in flight when renewal starts. The article independently warns that abandoning a claim cannot recall a request already sent.

Surrounding and downstream reasoning remains coherent: event ID and effect ID remain stable across claims; tokens must not create new effects; provider acceptance is distinct from end-user receipt; receiver payload comparison and retention matter; an inbox receipt and its local effect commit together. The receiver stand-in's one keyed versus two unprotected effects remains a controlled local demonstration. Per-event fencing does not become a resource-wide fence across different events, and accepting ordered generations does not itself deduplicate an intention. Queue selection does not promise business completion order. No new provider contract or network-failure measurement is inferred.

The separate expiry finding below does not reopen the original token-alias cause. It qualifies a different strengthened assertion about when follow-up writes may succeed.

## Finding

### r17 practitioner-2 · critical · strict-expiry claim in renewal, completion and rescheduling

Problem: “renew only … while … its lease is unexpired” (`r17.astro:50`), the SQL label “Complete only the current, unexpired generation” (line53) and the corresponding release condition (line91) imply that these mutations cannot take effect after lease expiry. A `WHERE lease_until > clock_timestamp()` condition on an ordinary UPDATE does not establish that property when the UPDATE waits behind a row lock held without a row change. Qualification and target expressions can be evaluated before that wait, then used after the deadline passes.

Effect: a reader can treat a successful reply as proof that renewal/completion/release took place within the declared lease permission, when the displayed predicate has only established an earlier time check. In the observed completion case, even stored completed_at was computed before waiting. This contradicts the stated strict-expiry rule and leaves a practitioner without the actual authorisation boundary under contention.

Suggestion: make the intended expiry/authorisation moment explicit and ensure the follow-up protocol checks time at that moment despite lock waits, or qualify the contract to what the SQL actually establishes. Apply the chosen rule consistently to renewal, completion and release and verify the waiting case. The writer owns the implementation choice.

Evidence: an independent bounded PostgreSQL18.6 challenge used the displayed completion predicate and the exact download's renewal/release predicates. The locker only executed `SELECT … FOR UPDATE`; it did not replace the row, advance the token or acquire a newer claim. In each run, the UPDATE began while the lease was valid, was observed waiting on a Lock, and was allowed to proceed only after the observer's database clock was beyond the stored deadline. All three returned `order-103-created`. Thus this probe establishes expiry after a lock wait; it does **not** establish broken token-generation fencing, two concurrent committed claims, or repeated external effects.

The small controlled fixture was:

```sql
CREATE TABLE outbox (
  event_id text PRIMARY KEY,
  claim_token bigint NOT NULL,
  lease_until timestamptz,
  completed_at timestamptz,
  available_at timestamptz
);
INSERT INTO outbox VALUES
 ('order-103-created', 1,
  clock_timestamp() + interval '2 seconds', NULL, clock_timestamp());
```

For each independently reset case, session L began and locked the row with `SELECT * FROM outbox FOR UPDATE`. Session W then executed the applicable exact mutation body (bound `$1/$2` were the displayed event and1):

```sql
-- Completion, displayed listing:
UPDATE outbox
SET completed_at = clock_timestamp(), lease_until = NULL
WHERE event_id = 'order-103-created'
  AND claim_token = 1
  AND lease_until > clock_timestamp()
  AND completed_at IS NULL
RETURNING event_id;

-- Renewal, current downloadable verifier:
UPDATE outbox
SET lease_until = clock_timestamp() + interval '5 minutes'
WHERE event_id = 'order-103-created'
  AND claim_token = 1
  AND lease_until > clock_timestamp()
  AND completed_at IS NULL
RETURNING event_id;

-- Release/rescheduling, current downloadable verifier:
UPDATE outbox
SET available_at = clock_timestamp(), lease_until = NULL
WHERE event_id = 'order-103-created'
  AND claim_token = 1
  AND lease_until > clock_timestamp()
  AND completed_at IS NULL
RETURNING event_id;
```

An observer verified `wait_event_type='Lock'` for W through `pg_stat_activity`, then checked `clock_timestamp() > old_lease_until` before L's COMMIT. Both native challenges ran through `/private/tmp/staycurrent-b03-v02-runtime/bin/python` with Psycopg3.2.12; all PG-prefixed values were deleted from the actual process environment before connecting. Each connection verified its exact owned data_directory, current_user and empty listen_addresses. Only the independently created private fixture was changed; no original source was edited.

Raw native proof from completion/renewal challenge, preserved:

```json
{
  "environment": {
    "version": "PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit",
    "data_directory": "/private/tmp/sc-r17-confirm-x5zrua9z/data",
    "socket": "/tmp/sc-r17-confirm-x5zrua9z/sock",
    "port": 55468,
    "role": "practitioner",
    "PG_cleared_in_process": true,
    "tcp_disabled": true,
    "all_connections_identity_checked": true
  },
  "complete": {
    "row_lock_only_wait_observed": true,
    "expired_before_locker_commit": true,
    "returned": [["order-103-created"]],
    "old_lease_until": "2026-10-24T05:30:54.344830+02:00",
    "completed_at": "2026-10-24T05:30:52.346745+02:00",
    "lease_until": null
  },
  "renew": {
    "row_lock_only_wait_observed": true,
    "expired_before_locker_commit": true,
    "returned": [["order-103-created"]],
    "old_lease_until": "2026-10-24T05:30:56.355315+02:00",
    "completed_at": null,
    "lease_until": "2026-10-24T05:35:54.358656+02:00"
  },
  "cleanup_verified": true
}
```

Raw native proof from the release-path extension, preserved:

```json
{
  "version": "PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit",
  "owned_data": "/private/tmp/sc-r17-release-s_xsu03v/data",
  "socket": "/tmp/sc-r17-release-s_xsu03v/sock",
  "port": 55469,
  "role": "practitioner",
  "all_connections_verified": true,
  "PG_removed_in_process": true,
  "tcp_disabled": true,
  "old_lease_until": "2026-10-24T03:32:15.488065+00:00",
  "time_before_unlock": "2026-10-24T03:32:15.501312+00:00",
  "lock_wait_observed": true,
  "returned": [["order-103-created"]],
  "state": "(None, None)",
  "cleanup_verified": true
}
```

The PostgreSQL18 [row-lock documentation](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS) explains why these updates can wait. The official PostgreSQL18 implementation separately distinguishes an unchanged locked tuple from a concurrently updated one: [heapam.c](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/heapam.c) can continue with TM_Ok after waiting on a locker, while [nodeModifyTable.c](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/executor/nodeModifyTable.c) takes its EvalPlanQual re-evaluation branch for TM_Updated. That supports the observed distinction; an ordinary lock wait does not promise a new wall-clock evaluation of the SQL predicate.

## Primary sources, provenance, reuse and limits

Checked PostgreSQL18 [Message Flow](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-TERMINATION), [Read Committed](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED), [row locking](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS) and [SELECT locking clauses](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE) directly for provisional rows, transaction termination, waiting/current rows and SKIP LOCKED. Abandonment is the application's chosen rule, not a native ownership-recovery feature. The current controlled histories accord with those sources.

Reviewed `v02/mechanical/current-r16-r17/native-provenance.json`, `native-v02.json`, `qualified-reuse.json`, `unchanged-media-identity.json`, source hashes and sources alongside the complete exact final verifier. Its SHA-256 is `2db363eeeefff8b709f13165a25c9d1ae9dbf6338a7f3ea6a6f0c39f59f72a14`. The final4456 rendered href `/review/relational-collection/evidence/r17/run-outbox.py` was freshly checked through a bounded HTTP read: status200, 17,597 bytes, exact frozen hash. No browser save/download-event/path wait was used; actual saving is unverified.

The current r17 native record entirely replaces obsolete ownership evidence. Its endpoint was private, every session checked, inherited PG settings cleared, TCP disabled and cleanup verified. Exact fixture/source/verifier/environment match the current claims. It already reruns unchanged inbox, receiver, fencing and transaction-boundary mechanics, so those were not repeated ceremonially. r16's unchanged schema/fixture/verifier and component hashes justify its narrower reuse. Inline-media identity records apply only to unchanged figure/style/SQL internals, not to a new independent visual judgement.

The alias histories kill an owned client before COMMIT or deliberately withhold a real successful COMMIT response from a simulated synchronous worker. They are controlled faults, not observed network/provider failures. The new expiry probe uses a chosen two-second lease and deliberately held lock; it measures no production duration/throughput and calls no receiver. Receiver/inbox/fence native cases remain local stand-ins, including a second database on the same server. An in-flight external request cannot be recalled by retirement. No global non-reusing attempt identity is inferred from per-event committed generations.

No source editing, delegation, site builds, viewport/theme changes or production actions were performed. Full visual/accessibility certification and independent final/corpus readings are outside this informed confirmation. Own temporary browser tab was closed on return.
