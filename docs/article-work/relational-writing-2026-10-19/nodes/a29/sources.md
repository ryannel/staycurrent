# a29 source and observation ledger

Checked 20 October 2026. The shared server timestamps are UTC, so the final run's timestamps fall on 19 October UTC. No existing database, shared configuration or statistics were changed.

## Reading and ownership

Read AGENTS.md, README.md, docs/site-direction.md, current commission and runtime, own full eight-heading context, actual a06, sibling a30/a31 plans and relevant a25/a37 source. Read all three fixed reference articles in full, including figures: sequences.astro, indexes.astro and storage.astro. They govern prose and teaching style. The parent owns compatibility and writer authority; a30 owns resumable backfill; a31 owns moves; a25 owns index choice; a37 owns the general resource budget. No proposed tree changes.

## Primary contracts

- PostgreSQL 18 [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html): default strongest lock, metadata/default distinctions, integer-to-bigint rewrite, index rebuild, validation, new-row enforcement, PostgreSQL 18 staged not-null support, unique-index attachment restrictions and ownership.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html), [blocking information](https://www.postgresql.org/docs/18/functions-info.html), [activity views](https://www.postgresql.org/docs/18/monitoring-stats.html), [client settings](https://www.postgresql.org/docs/18/runtime-config-client.html): retained locks, conflicts, soft blockers, acquisition and execution limits.
- [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html), [DROP INDEX](https://www.postgresql.org/docs/18/sql-dropindex.html), [progress reporting](https://www.postgresql.org/docs/18/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING): concurrent transactions/scans/waits, invalid leftovers, uniqueness effects, one concurrent build per table, partition restrictions and cleanup.
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): check NULL semantics and differing integrity forms.
- [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html): replacement output contract cannot change existing column types.
- [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html): schema changes not logically replicated; physical replication comparison is documented, not rehearsed here.
- node-pg-migrate [v9.0.0](https://github.com/salsita/node-pg-migrate/releases/tag/v9.0.0), [migrations](https://salsita.github.io/node-pg-migrate/migrations/), [CLI](https://salsita.github.io/node-pg-migrate/cli): transactions, noTransaction, advisory lock, history and invocation. Website is current, so concrete boundaries also checked against installed 9.0.0 source/package and actual runner execution.

## Reproducible native observations

Portable worksheet: src/components/relational-next/a29/rehearse.mjs. Requires Node >=22, pg 8.23.1, node-pg-migrate 9.0.0, explicit PG_URL and CREATEDB; fresh evidence path. Uses dynamic package imports; PG_MODULE and MIGRATE_MODULE optionally select separately installed package file URLs. No local path is required by the downloadable default. It creates its own rel3_a29_run* database, temporary migration directory and three sessions, closes sessions, drops its own database and removes migration files. Evidence is retained with overwrite refusal.

Installed runner/driver temporarily in /private/tmp/rel3-a29-runner with lifecycle scripts disabled, without repository dependency changes. Actual engine: PostgreSQL 18.6 Homebrew, server_version_num 180006, aarch64-apple-darwin25.6.0. Runtime settings remain as runtime.md; DDL runner session explicitly uses lock_timeout 250ms, statement_timeout 5s, captured inside runner-created runner_settings. Queue demonstration temporarily uses lock_timeout 3s so the operator can observe and cancel; no shared setting overrides.

Final raw result: evidence/evidence-final.json, completed=true, cleanedDatabase=true. Earlier attempts are retained transparently:

- evidence-run1.json: all SQL scenarios passed but the final client-response interception assertion failed because its matcher expected a semicolon. Database cleaned.
- evidence-run2.json: over-specific expected index progress phase timed out. Database cleaned. This run does not establish that phase.
- evidence-run3.json: corrected complete success. Database cleaned.
- evidence-final.json: final worksheet includes SQL parameters in raw logs, runner timeout capture and PostgreSQL 18 staged not-null proof. Complete success and cleanup.

Final checks:

- Three sessions: A retains ACCESS SHARE in an open read transaction; B queues ADD COLUMN; C's SELECT queues behind B. pg_blocking_pids captures A→B→C blocker chain. Cancel B = 57014; C completes before A ends; B receives 25P02 until rollback. Column absent.
- CHECK NOT VALID: invalid historical -1 remains; concurrent invalid new -2 rejected 23514. Validation fails 23514, convalidated=false/conenforced=true. Repair to 100 then validation succeeds.
- Drill-only sleeping check makes validation execution cancellable. ShareUpdateExclusiveLock observed. Concurrent valid insert accepted and invalid insert rejected. Cancellation 57014 leaves false validation; repeated invocation succeeds.
- PostgreSQL 18 named NOT NULL n NOT VALID installs with old NULL, rejects new NULL 23502; repairing then validating succeeds.
- Interrupted concurrent unique index after initial catalogue registration leaves live=true/ready=false/valid=false. Observed progress label was initializing; article does not claim another label was observed. Duplicate failure 23505 also leaves those flags. Separately dropped each leftover. Success after duplicate correction is valid/ready and becomes constraint-owned through conindid. Concurrent build in BEGIN rejected 25001.
- Direct 20,000-row integer→bigint rewrite initially blocked by dependent view 0A000. Removing only the disposable view allows rewrite. Heap filenode changes, AccessExclusiveLock observed before commit. Total relation allocation 1,687,552→2,162,688 bytes. Final recorded statement ~29ms; not representative latency. Cluster-wide surrounding WAL window 2,270,616 bytes includes potential other-worker activity and is explicitly not an isolated per-statement WAL measurement. Peak filesystem allocation not measured.
- Failed text→bigint conversion of 'twelve' returns 22P02. Staged column, conversion, check/validation and concurrent index commands complete. Two column renames leave stored view referring to amount_old; deliberate view recreation selects bigint and returns expected rows 100,200,300.
- node-pg-migrate default transaction: failed second statement rolls back added column and success record. noTransaction failure retains valid concurrently built index without that history entry. Concurrent second cooperating runner refused by advisory lock. Actual id/name/run_on history retained.
- Lost acknowledgement is a deliberately simulated client boundary: wrapper waits for real COMMIT, withholds its reply and closes connection. Fresh observer finds both column and history row. This is not an actual network packet-loss test; article says so.

## Bounds and unperformed acceptance

No representative sustained workload, latency distribution, replica topology/delay, peak free-space measurement, isolated WAL production benchmark, hosted-service privilege test or real network-fault injection. No production readiness claim. Amount FK/trigger/generated-value dependencies absent from fixture; remain explicit deployment inventory gates. Writer protocol and data-job concurrency tests belong to parent/a30 and are not reimplemented here. Every figure is an illustrative deterministic mechanism, not replay of production timings. Resource gates are invented examples to replace through representative rehearsal.
