# Practitioner review · article · a00 and a03 · candidate A repaired / r02

Inputs read: frozen `/private/tmp/staycurrent-skills-night-a-repair`, [fixed manifest](../repaired-manifest.json) (all seven hashes independently matched); both complete article sources and rendered pages at port 4341; current figure models/components and SQL/verifier; trial-3 commission/brief; `docs/coverage/relational-2026-10-19.yaml` (root and concurrency branch), canonical `relational-example.md`, registry parent/sibling/child briefs. Candidate-A review skill and practitioner perspective applied unchanged. Prior reports, decisions, repair narratives, proposal and author verdicts withheld and not read.

Review window: approximately 20:51–20:56 UTC, 21 October 2026; completion timestamp below. Full review, not a repair-only check. Finding sequence begins at practitioner-3.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | pass | No incorrect booking, query, snapshot, locking, retry or recovery recipe found within its stated conditions; the requested scope qualification below is missing. |
| Evidence | pass | Current download is byte-identical to reviewed sources; applicable native receipts support the claimed outcomes and observed waits; models and untested deployment claims are labelled. |
| Coverage | finding | Root outcomes and the main concurrency decisions are covered; commissioned sequence/transactional-schema boundary flags are absent (practitioner-3). |
| Depth, both ways | finding | Missing a short transaction-boundary qualification; no excessive mechanism treatment found. The count-after-wait example earns its depth because otherwise the suggested coordination approach is unsafe. |
| Ownership | pass | Root supplies a usable walkthrough and shortlist; a03 supplies a complete fixed-set Serializable repair, while full counted-set protocols, driver recovery, migration, storage and operations remain with their named owners. |

## Findings

### practitioner-3 · medium · a03, “Keep ownership and the counter together” and engine comparison

Problem: The planned “What a transaction promises” scope explicitly asks for flags that sequence behaviour and transactional DDL are engine-specific. Neither appears. The article gives the ordinary all-or-nothing model and an engine comparison focused entirely on isolation, but does not identify these limits of applying that model to other database work.

Effect: When moving from the fixed identifiers used here to generated identifiers or schema changes, the reader must discover the missing boundary themselves. A PostgreSQL sequence allocation is not restored by rollback, and MySQL schema statements such as `ALTER TABLE` can commit preceding work implicitly. These are practical transaction-boundary decisions, not deeper isolation internals. This is medium coverage loss: the presented booking recipes use ordinary table changes and literal identifiers and are not themselves broken.

Suggestion: Add a short, placed qualification that the illustrated rollback concerns transactional table changes, flag generated sequence values and schema-changing commands as requiring their engine-specific contract, and hand full identity and migration details to their owners. No new tutorial is needed.

Evidence: `relational-2026-10-19.yaml`, concurrency branch / “What a transaction promises” expressly includes both flags. Current a03 lines 30, 44–48 and the entire engine-comparison section contain neither. [PostgreSQL 18 sequence functions](https://www.postgresql.org/docs/18/functions-sequence.html) documents non-reclaimed `nextval` allocations and non-rollbackable `setval`; [PostgreSQL isolation](https://www.postgresql.org/docs/18/transaction-iso.html) explicitly flags sequence behaviour. [MySQL 8.4 implicit commits](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html) identifies schema commands that end an active transaction.

## Evidence and source coverage

- **a00 reused native evidence:** frozen `docs/article-work/relational-skill-trial-3/a00-evidence/native-56131.json`, PostgreSQL 18.6; command `node src/components/relational-trial-3/a00/verify.mjs 56131`. Independently confirmed `verify.mjs`, `model.mjs`, shared fixture and `Race.astro` unchanged from original frozen A. Read the transcript/checks for required quantity, composite identity and reference rejections; complete order 103, `29.00` summary, wrong `79.00` totals versus repaired `39.50`, unsafe two-order result, guarded refusal and insufficient-tea rollback. Receipt records durable settings and server stop.
- **a03 reused native evidence:** [native-56700.json](../a03-evidence/native-56700.json), inspected against current verifier and model. PostgreSQL 18.6, Read Committed default, `fsync`, `synchronous_commit` and `full_page_writes` on. Entries 37/72 show real lock waits; 119/121 show Serializable abort and fresh count 1; 145–146 show waiting command count 1 then separate-command count 2; 157–160 show rollback alternative and successful R14; 167/169 show deadlock and failed transaction state. Also checked split/whole atomicity, forced error, stable-read variants and the 20-client one-winner final invariant. The script's assertions match these limited observations.
- **Download and resource ownership:** fetched the rendered page's `/_astro/worksheet.CW3K4e1O.zip` at 20:54:09 UTC. SHA-256 `999df629019728c9bbd84f64bdeb2854072bc562c7f52dddd7dcbab05de29281`; all three members (`example.mjs`, `a03/model.mjs`, `a03/verify.py`) byte-match frozen source. Shared import layout resolves. Read current environment scrubbing, private socket and identity check before database creation, and `finally` cleanup. [Adversarial receipt](../a03-evidence/adversarial.json) records no trap connections; [identity failure](../a03-evidence/identity-failure.json) and its native transcript establish refusal before fixture mutation, server stop and temporary-root removal. [Bundle receipt](../a03-evidence/bundle.json) agrees with independent byte checks. No native rerun was necessary and none was started by this reviewer.
- **Rendered reading:** read both full page accessibility trees, including SQL and count-wait table; exercised a03 “One transaction” through its final state, which correctly retains R7/R10, remaining 1 and capacity 3. All figure branches were also read directly from their current models. This is practitioner verification, not a substitute for the separately assigned visual review.
- **Primary sources independently opened 21 October:** PostgreSQL 18 [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [table expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html), [aggregates](https://www.postgresql.org/docs/18/functions-aggregate.html), [isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [locking](https://www.postgresql.org/docs/18/explicit-locking.html), [complete retries](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), [WAL](https://www.postgresql.org/docs/18/wal-intro.html), [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html), [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), [PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), [standbys](https://www.postgresql.org/docs/18/warm-standby.html); MySQL 8.4 [InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html); SQLite [isolation](https://www.sqlite.org/isolation.html) and [WAL](https://www.sqlite.org/wal.html). These support the stated ordinary-query/update distinction, lock lifetime, named-engine contrasts, commit/log boundary, restore distinction and same-host SQLite WAL restriction.

## Limits

Native observations were reused after applicability checks, not independently rerun. They establish selected schedules, not universal writer participation, crash survival, power-cut durability, throughput or deployment fitness. Other engines, replicas and restores were not run; the pages correctly say so. Child ownership was assessed from supplied plans/registry scopes, not a fresh corpus review. No build/server, article edits, commit, push or team was created by this reviewer.

Completed UTC: 2026-10-21T20:56:03.619065+00:00
