# a30 source and observation record

Checked 20 October 2026. Scope: one resumable address backfill under concurrent
writes, with short import/correction/deletion adaptations. Physical DDL belongs
to a29; application compatibility and read-switch gates remain with a06; database
moves with a31; ongoing cleanup with a37.

## Primary documentation

- PostgreSQL 18 [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  Read Committed statement snapshots and rechecking an UPDATE condition after a
  competing updater commits; Repeatable Read's consistent transaction snapshot.
  Supports the version guard and short final reconciliation snapshot. It does
  not establish the publication's complete job protocol; that is an explicit
  design composed here from those guarantees.
- [Sequence manipulation](https://www.postgresql.org/docs/18/functions-sequence.html):
  identifier allocation is independent of a commit boundary. The ordering
  counterexample was also reproduced natively.
- [UPDATE](https://www.postgresql.org/docs/18/sql-update.html): actual updated-row
  count, RETURNING, suppressed before-row effects and assignment semantics.
- [Trigger behaviour](https://www.postgresql.org/docs/18/trigger-definition.html):
  row versus statement triggers, suppression, transaction membership, deferred
  constraint triggers and cascading effects. In particular a zero-row statement
  may still invoke statement triggers. The worksheet's no-effect replay assertion
  concerns its installed row-level audit trigger only.
- [Generated columns](https://www.postgresql.org/docs/18/ddl-generated-columns.html):
  generated results must be considered alongside trigger-modified stored values.
- [COPY](https://www.postgresql.org/docs/18/sql-copy.html): staging and error-handling
  options do not define business duplicate/conflict policy or prove input coverage.
- [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html): ANALYZE actually
  executes work, BUFFERS and WAL expose resource work; rollback is not a resource
  undo. No production work or timings were measured here.
- [Client connection defaults](https://www.postgresql.org/docs/18/runtime-config-client.html):
  session/transaction-local lock and statement timeouts. Fixture choices of
  200 ms and 2 s are laboratory limits, not operational recommendations.

## Native run

`evidence/rehearse.mjs` is portable with Node 24 and pg 8.23.1. DATABASE_URL must
select an administrative database on a disposable PostgreSQL 18 server; optional
PG_DRIVER accepts an installed driver ESM entry. It creates a fresh uniquely
named `rel3_a30_*` database, uses at most three server connections, closes its
sessions and drops only that database in finally. The local TCP proxy needs
plaintext loopback access. No server changes, global counter resets, restarts,
replicas or benchmarks occur.

Final complete run: `evidence/native-2026-10-20.jsonl`. The exact runtime is
PostgreSQL 18.6 Homebrew / aarch64 Darwin, role staycurrent, Read Committed,
synchronous_commit on. Shared endpoint 127.0.0.1:57319, driver pg 8.23.1 from
the runtime's isolated temporary dependency directory. Worker batch overrides:
lock_timeout 200ms and statement_timeout 2s via SET LOCAL only.

The retained assertions establish:

1. Committed ID 2 is visible while allocated ID 1 is not; ID 1 becomes visible
   after its transaction commits. This is a deliberately pre-protocol
   counterexample, followed by draining before initial work enumeration.
2. Six enumerated `(job,id,rev)` work items persist. A real UPDATE waits on an
   application row lock; pg_stat_activity observes Lock wait; it returns zero
   after the application commits a newer source version.
3. A worker killed before COMMIT leaves target, ledger and progress unchanged.
   A real SQLSTATE 23505 error after provisional row work aborts the entire batch.
4. The final batch updates a valid target, records its accepted disposition and
   advances progress. A TCP proxy sees backend CommandComplete COMMIT and drops
   the reply before the driver sees it. The driver reports connection termination;
   a fresh connection observes all three durable effects.
5. Completed work is excluded on replay. The row-level audit trigger sees no
   replayed row effects. Final dispositions are accepted 2, deleted 1, invalid 1,
   review 1, superseded 1. A bridge-maintained new insert requires no pending
   catch-up item. Invalid/review outcomes retain source versions and reasons.
6. Version/non-null checks miss an injected wrong town. Comparing values with
   the fixture grammar finds order 2. This is not real address validation.
7. Equal totals can conceal missing ID 2 and unexpected ID 999; anti-joins find
   both. Duplicate staged ID 1 is detected; an orphan label fails with 23503.
8. A concurrent new hold/revision prevents a previously eligible deletion.
9. Cleanup drops the exact own database; no own process or database remains.

An initial validation-fixture attempt used a temporary foreign-key table pointing
to a permanent table; PostgreSQL rejected that harness definition (42P16). The
fixture was corrected to a regular table inside the disposable database and the
whole final run passed. This does not change an article claim.

## Illustration boundaries

All six figures are deterministic illustrative schedules and decisions, not a
running engine. Figure 5's row and dependent-write counts are invented. No
throughput, latency, scan-page, logging or replica-lag capacity figure is claimed.
The parser accepts a deliberately small comma-separated GB-like fixture grammar;
its output makes no deliverability or full-postcode-validity claim. The job
protocol requires all old writers and transactions drained before trusted initial
enumeration; the late pending-row branch deliberately violates that prerequisite
to show why the catch-up check must investigate it.
