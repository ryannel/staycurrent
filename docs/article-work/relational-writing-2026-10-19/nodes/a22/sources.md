# a22 evidence and sources

Written 20 October 2026. Scope: recovering relational requests, outcome evidence,
bounded retries and retained idempotent operation results. Connection cleanup
belongs to a20; external fulfilment and pending-worker takeover belong to a23.

## Teaching references and family context

Read the original Sequence diagrams, Indexes, and Storage and durability articles
in full, including their figure descriptions, controls, worked comparisons and
qualifications. Used the progression of one concrete case, named observer state,
instructed comparisons and a separation between models and executions. Read the
actual a04 parent and a20 sibling, the a22 context, registry and runtime record.
The five new figures keep the comparison at the current step, provide End, retain
a readable text fallback, and count the complete visible scene for playback holds.

## Primary sources checked

- [PostgreSQL 18 client connection defaults](https://www.postgresql.org/docs/18/runtime-config-client.html): server statement, lock, transaction and idle timeout scopes. The article does not turn these settings into an end-to-end deadline guarantee.
- [PostgreSQL 18 cancelling queries](https://www.postgresql.org/docs/18/libpq-cancel.html): cancellation dispatch is distinct from observing command termination. libpq APIs are not represented as pg methods.
- [PostgreSQL 18 message flow](https://www.postgresql.org/docs/18/protocol-flow.html): command completion and transaction outcomes; the lab proxy parses real frontend Query and backend CommandComplete messages.
- [PostgreSQL 18 error codes](https://www.postgresql.org/docs/18/errcodes-appendix.html): 23505, 23514, 40001, 40P01, 55P03, 57014, 25P02 and 25P04 classifications. A code alone is not the business policy.
- [PostgreSQL 18 serialisation failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html): repeat the complete transaction including decision logic; failures that may justify retry need application judgement.
- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): READ COMMITTED per-statement snapshots, and ON CONFLICT DO NOTHING conflicts involving rows not visible in the command snapshot.
- [PostgreSQL 18 INSERT](https://www.postgresql.org/docs/18/sql-insert.html): conflict target, returning only rows actually inserted, uniqueness arbitration.
- [PostgreSQL 18 uniqueness checks](https://www.postgresql.org/docs/18/index-unique-checks.html): wait for an uncommitted conflicting entry, then recheck.
- [node-postgres Client API](https://node-postgres.com/apis/client) and [Pool API](https://node-postgres.com/apis/pool): timeout, acquisition, release and error configuration. Native observations below take precedence over inferences from parameter names.

## Executed native rehearsal

Downloadable source: `src/components/relational-next/a22/rehearse.mjs`.
Successful raw results: `native-results-run2.jsonl`.

Actual runtime: Node 24.16.0, pg 8.23.1 supplied by the root's pinned temporary
dependency, PostgreSQL 18.6 Homebrew, Apple silicon. Direct, non-pipelined, plain
loopback TCP. Fresh database `rel3_a22_run2`, removed at completion. No roles,
shared configuration, restart or existing data changed. At most a small number
of simultaneous clients, below the shared 12-connection limit.

Executed with `PG_ADMIN_URL` set to the supplied disposable server,
`PG_TEST_DATABASE=rel3_a22_run2`, and the runtime's `PG_DRIVER_MODULE` override.
The reader script instead supports an ordinary `npm install pg@8.23.1` and
`PG_ADMIN_URL` configuration; it does not require the writer's temporary path.

Session-only defaults in the harness: statement_timeout 3 seconds, lock_timeout
1 second, idle_in_transaction_session_timeout 5 seconds. Individual cases use
statement_timeout 40 ms, lock_timeout 40 ms, transaction_timeout 60 ms, driver
query_timeout 40 ms and pool connectionTimeoutMillis 40 ms. All values are lab
limits, not production recommendations. Polls are bounded to 100 × 10 ms.

Observed:

- One-slot acquisition timeout removed its waiter; no transaction started.
- Server statement timeout and controlled cancellation each gave 57014, then
  25P02 in the failed explicit transaction; rollback left no probe effect.
- Driver read timeout had no SQLSTATE; independent observation found its backend
  active in PgSleep. The rehearsal closed the client; a20 owns safe reuse.
- Transaction timeout gave 25P04 and no committed probe row.
- A deferred trigger sleeping 300 ms made COMMIT return success after 305 ms
  despite SET LOCAL statement_timeout 40 ms. The probe row existed. This is one
  observed completion path, not an analysis of every commit wait or storage fault.
- Two SERIALIZABLE transactions read 0; A committed 1, B received 40001. B's
  complete retry read 1 and committed 2. Two B attempts, final value 2.
- Matching and conflicting duplicate inputs saw no record while A was open,
  then waited on the unique key. After A committed, matching B returned A's ID;
  conflicting B was classified as a fingerprint mismatch, with no second order.
- A bounded duplicate-claim wait gave 55P03. A then committed; same-key recovery
  returned A's result without a new business effect.
- The first request's 20 ms caller wait ended while a bounded owner continued
  through a 120 ms sleep and commit. The interim lookup was empty; recovery
  returned the same order after completion.
- Real TCP proxy cut before COMMIT forwarding: client connection error, no
  authoritative retained record, same-key recovery became claimant.
- Real TCP proxy cut after observing backend CommandComplete COMMIT but before
  delivering it to the client: identical client connection error, retained result
  present, same-key recovery returned the original ID. The harness knows its
  injection point; the failed client does not know it.
- Application-level response suppression after known commit returned the same
  ID on repetition. This is a fault model, not an HTTP implementation.
- A repeat before deleting retention returned the same ID. After explicit
  deletion a new ID and second order were committed. Deletion stands for a
  retention boundary; no production expiry scheduler was tested.
- Final fixture: 9 order rows, 8 retained operations; exactly one extra effect
  comes from the deliberate retention deletion. Cleanup observed zero sessions
  in its test database before dropping it.

## First run retained

`native-results.jsonl` records the initial `rel3_a22_run1` run. It stopped when an
incorrect expectation that COMMIT's deferred-trigger sleep would be cancelled by
the local statement timeout failed: COMMIT returned success. The finally block
closed its sessions and removed its database (zero sessions observed). The
repaired rehearsal asserts and records the actual successful commit instead.
Run 2 completed all cases; no evidence is presented as a cancelled COMMIT.

## Boundaries

The executable business fixture deliberately contains minimal orders and operation
records. It does not execute full stock reservation, item insertion, authorisation,
retained rejection or HTTP delivery. Those paths require application acceptance
tests. The table sketch's rejection-retention discussion is design reasoning, not
a measured fixture outcome. The stale-value figure branch is illustrative; only
the correct complete retry was executed. Deadlock code semantics are documented;
the native retry case uses a serialisation failure. There is no failover, crash,
replica, arbitrary network scheduler or distributed exactly-once claim.
