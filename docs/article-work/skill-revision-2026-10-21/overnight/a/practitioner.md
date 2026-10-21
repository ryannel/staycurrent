# Practitioner review · article · a00 and a03 · INITIAL 80276a4

Start: 2026-10-21 20:35:42 UTC. End: 2026-10-21 20:39:38 UTC.

Inputs read: frozen `/private/tmp/staycurrent-skills-night-a` sources and rendered articles at port 4340 (`/review/relational-trial-3/` and `/transactions/`); article models/components/verifiers and worksheet; README and site direction; root and transactions briefs/outcomes and neighbouring/child scopes in `docs/coverage/relational-2026-10-19.yaml`; registry scopes for a00–a08, a18–a20 and a23; canonical `docs/coverage/relational-example.md`; INITIAL a00/a03 writing records and final native transcripts. Applied the archive's baseline review skill and practitioner perspective. Withheld: previous reviews, decisions/results, candidate skills, proposal and coordinator findings. No team arranged; no article edits, build, commit or push.

Highest severity: critical

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | finding | Core schema, joins, conditional changes, snapshots, multirow repair and failure boundaries agree with primary manuals and retained native observations. The worksheet's unconditional isolation promise is false under inherited connection settings (1). |
| 2. Evidence | finding | Models are labelled; selected PostgreSQL observations match transcripts. Worksheet instructions omit its exact patch-version prerequisite (2). Evidence reuse and its limits are recorded below. |
| 3. Coverage | pass | Both articles supply their commissioned decisions and failure cases; coverage detailed below. |
| 4. Depth, both ways | pass | No material missing depth or excessive mechanism treatment found. The root gives useful answers before delegation; a03 completes the fixed-instructor repair while leaving changing-set locking, driver recovery and physical recovery to their owners. |
| 5. Ownership | pass | Root/transaction overlap is a brief introduction followed by deeper reasoning. Counted-set protocols belong to a18; engine histories to a19; connection/request/external-work procedures to applications. No duplicate full treatment within the reviewed pair. |

## Coverage

**a00:** task entrances; facts, composite identity and references; current versus agreed price; enforceable quantity; result grain and independent-detail multiplication/repair; complete two-product reservation with returned-row decisions and rollback; engine-specific race; scan/index/page/log mental model; missing replies and stable operation identity; compatible schema change; crash/failover/PITR distinction and later valid orders; recovery ownership/targets; replica freshness versus divided write ownership; bounded deployment shortlist, disqualification evidence, costs/exit and complementary stores. The planned distribution branch is absent from the registry; the root nevertheless teaches its high-level answer and points to existing contextual material. That inherited planning discrepancy does not make its explanation incorrect.

**a03:** invariant and all relevant writers; atomicity/constraints/savepoints; stale overwrite versus guarded update and version comparison; zero-row/error interpretation; uniqueness; command/transaction snapshots and own writes; ordinary versus locking reads; empty/future-row problem and fresh-command coordination; write skew and a complete Serializable restart; PostgreSQL/MySQL/SQLite differences; waits, deadlocks, ordering, timeout/domain rejection, bounded retries; uncertain commit and external effects as boundaries; durable acknowledgement; deterministic unsafe/repaired schedules, forced failure, independent wait observation and bounded load. The canonical class/instructor substitution preserves the planned multirow dependency. Detailed lock modes and changing-set protocols remain appropriately with a18.

## Findings

### practitioner-1 · critical · a03, “Test the schedule that could break the rule”, worksheet isolation promise

Problem: The page says the worksheet creates its own disposable cluster and “never connects to an existing application database”. Its `verify.py` inherits libpq environment variables for `createdb` and every `psql`. Explicit `-h 127.0.0.1` does not override an inherited `PGHOSTADDR`. The actual destination can therefore be a server outside the cluster it created. The worksheet then creates its test database there if allowed. The blanket assurance on the reader's execution environment is unsupported and the destination error is reproducible.

Effect: A reader with existing PostgreSQL connection settings can direct worksheet work at an unintended existing server while believing the disposable cluster isolates it. In the safe reproduction, the worksheet failed at the wrong endpoint before any database was created there; it is not evidence of actual application-data modification.

Evidence/source: `practitioner-hostaddr.py` ran the unchanged worksheet with `PGHOSTADDR=::1`, owning a non-database listener at `[::1]:56600`; its newly created PostgreSQL cluster listened at `127.0.0.1:56600`. The listener received the connection, and `createdb` reported `connection to server at "::1", port 56600 ... timeout expired`. `practitioner-hostaddr.json` records cluster start and successful fast shutdown. No existing database was contacted. [libpq environment defaults](https://www.postgresql.org/docs/18/libpq-envars.html) and [hostaddr precedence](https://www.postgresql.org/docs/18/libpq-connect.html#LIBPQ-CONNECT-HOSTADDR) document why.

Suggestion: Give every client subprocess an explicitly controlled connection environment, including host-address/service settings, and address the owned socket or explicit endpoint. Verify the connected cluster before executing fixture changes; keep the downloadable bundle consistent with the repaired verifier.

### practitioner-2 · medium · a03, worksheet prerequisites and `verify.py` version assertion

Problem: Instructions require “PostgreSQL 18 tools”, but the downloaded verifier asserts that `SELECT version()` contains the literal `18.6`. A different PostgreSQL 18 patch release stops before the exercises with an assertion failure. The bundle is byte-identical to the source, so the mismatch affects the reader's actual download.

Effect: Readers satisfying the stated prerequisite can stall before testing the article's argument and must discover an unstated version requirement themselves.

Evidence/source: `verify.py`, line 42, contains `assert '18.6' in version`; static inspection establishes the rejection without rerunning unchanged experiments or installing another engine. The source record and native transcript correctly identify the observed version as 18.6; the defect is the broader run instruction.

Suggestion: State the exact required patch release, or deliberately accept the supported major release while recording the actual version and keeping the published observations pinned to their original run.

## Evidence applicability and provenance

Reused a00 `native-56131.json`: PostgreSQL 18.6/Homebrew/arm64, Read Committed, `fsync`, `synchronous_commit` and `full_page_writes` on; 22 recorded checks and successful shutdown. Commands and outputs support the current fixture's constraint refusals, 29.00 summary, 79.00/39.50 join contrast, unsafe/protected race and rollback/refusal counterexamples.

Reused a03 `native-56142.json`: same engine/platform and durable settings, deadlock timeout 1s; 235 entries include real wait observations, 23505/25P02/40001/40P01 outcomes, snapshot contrast, instructor restart, counted-row counterexample/guarded count and one accepted/nineteen declined under load. The logged setup/seed/guarded/optimistic/depart exports match the frozen model exactly; every worksheet member matches its source byte-for-byte. The transcripts and current verifier were inspected together, rather than treating a PASS label as sufficient. Earlier attempts are not substituted for these final runs.

`practitioner-provenance.json` records hashes of the articles, shared fixture, models, verifiers, ZIP and final transcripts. The archive lacks `.git`; 80276a4 is the coordinator-supplied provenance, not an independently resolved archive HEAD.

New native work was limited to the suspicious endpoint-isolation claim. The final reproduction used assigned port 56600 and an owned IPv6 listener; its only PostgreSQL cluster stopped successfully and its temporary directory was removed. Two earlier listener setup attempts failed before starting a server (sandbox bind refusal; then unavailable 127.0.0.2 alias). No unchanged concurrency experiment was repeated.

## Primary sources checked and limits

Checked PostgreSQL 18 [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), [table expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html), [aggregates](https://www.postgresql.org/docs/18/functions-aggregate.html), [transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html), [isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [locking](https://www.postgresql.org/docs/18/explicit-locking.html), [whole-transaction retries](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html), [WAL](https://www.postgresql.org/docs/18/wal-intro.html), [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html), [PITR](https://www.postgresql.org/docs/18/continuous-archiving.html), and [standbys](https://www.postgresql.org/docs/18/warm-standby.html); [MySQL 8.4 InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html); SQLite [isolation](https://www.sqlite.org/isolation.html) and [WAL](https://www.sqlite.org/wal.html).

Retained evidence supports selected schedules and fixture results, not all interleavings, deployment capacity, crashes, power loss, real restores, replicas or other engines. Those limits are honestly stated in the articles. Rendered text and initial figure states were read in the hidden browser; the complete model states were read from their source. This is a practitioner review, not an independent animation/layout or full control audit. No review assertion depends on foreground visibility.
