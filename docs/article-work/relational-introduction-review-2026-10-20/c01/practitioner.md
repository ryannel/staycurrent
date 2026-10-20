# Practitioner review · article · a00 Relational databases · c01

Inputs read: the frozen piece at c01 (`c01/article.astro`; `c01/components/` DecisionFigure.astro, OrderFigure.astro, RowsFigure.astro, models.mjs, queries.mjs, verify.mjs), checked against `c01/manifest.json`. The SHA-256 of all seven files and the rendered HTML (`scratchpad/c01-site/review/relational-next/index.html`) match the manifest. I also read the brief, headings, intended outcomes and the full plans of the eight direct children (`relational-introduction-polish-2026-10-20/context.yaml`), both source and evidence records (`relational-introduction-polish-2026-10-20/sources.md`, `relational-writing-2026-10-19/nodes/a00/sources.md`) and both commissions (`relational-fanout-2026-10-19/commission.md`, `relational-writing-2026-10-19/commission.md`). For ownership only, I searched the finished child articles in `src/articles/relational-next/` for specific terms; I did not read them in full. Withheld and not read: earlier review reports, repair records, writer notes, trial records (b01/, b02/, trial.md, writer.md, repairs.md). The b01 repair paragraph inside the supplied sources.md was read as part of that evidence record.

Primary sources checked (opened 20 October 2026):
- PostgreSQL 18: Message flow (Termination), Transaction isolation (Read Committed), Asynchronous commit, EXPLAIN, ALTER TABLE, Client connection defaults (`idle_in_transaction_session_timeout`, `lock_timeout`) and libpq Connection status (`PQTRANS_UNKNOWN`).
- MySQL 8.4 Reference Manual: InnoDB transaction isolation levels (default level).
- The article's remaining sources (Constraints, Numeric types, Table expressions, Aggregate functions, Comparison functions, Sorting rows, Transactions tutorial, Parameterised execution, Indexes, Using EXPLAIN, PITR, Log-shipping standby, SQLite Serverless) were checked against the claims as cited in the evidence record. They are standard contracts that I know, and I did not reopen each one.

Native execution in this review: I ran a fresh, isolated PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0) cluster in the session scratchpad on 127.0.0.1:57423 with default settings. I ran an unmodified copy of `verify.mjs` with only its port changed, using database `rel3_a00_run9`. All assertions passed and the output matched the recorded evidence: inner join `101, Mina, 36`; left join adds `102, Arun, NULL`; empty-order counts `1,0`; `= NULL` matches 0 rows and `IS NULL` matches 2; separate commits, rollback and commit states matched; in the two-buyer conditional update, A returned `0`, B returned no row and final stock was 0. Further probes on the same cluster are cited in the findings. The cluster was stopped afterwards.

Verdict: pass

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | Every consequential claim I checked is right, including Read Committed wait-and-recheck, synchronous and asynchronous commit, FK refusal, the failing `ADD COLUMN … NOT NULL`, NULL and aggregate behaviour and replica/PITR limits. Figure 3 presents rollback after connection loss as immediate (practitioner-1). |
| Evidence | pass | All six figures are labelled illustrative. The Sources note separates them from the 18.6 native checks and limits those checks to the SQL results, rollback and the two-buyer conditional update. A fresh rerun reproduced every recorded observation. Waiting is stated as documented behaviour, not as an observation; I separately observed B wait 1.22 s and then update 0 rows. |
| Coverage | finding | All nine heading outcomes are taught, and the route table matches the brief exactly: setup in a02 then a01→a04, a05→a26 or a28, a07→a36, a06, and a08 with conditional SQLite and CockroachDB routes. Two thin outcomes: engine differences in isolation have no concrete contrast (practitioner-2), and maintenance is named but not explained (practitioner-4). "More hardware as a hypothesis" is covered only implicitly, by the general predict-and-compare method; that is acceptable. |
| Depth, both ways | finding | Nothing is taught more deeply than the introduction needs. The R103 request-identity treatment is the deepest part, and it is the useful answer the H5 brief asks for. One missing practical hazard: a fast schema change can still block traffic while it queues for its lock (practitioner-3). |
| Ownership | pass | Each section gives a working answer and hands off: a01 to a08 are linked once each at their point of use, deeper procedures stay with the children, and no subject gets two full treatments. All 38 linked destinations exist in the c01 build. The conditional UPDATE is one worked case. The full protection choice stays with a03 and locking. |

## Findings

### practitioner-1 · optional · a00 "From a request to a committed order", Figure 3 before-COMMIT path (step 3 message and text alternative), and the pool paragraph

Problem: In the "Before COMMIT arrives" path, Figure 3 says "The connection fails before COMMIT reaches the database. The open transaction rolls back." The text alternative says connection loss "leaves the open transaction to roll back". PostgreSQL does roll back an open transaction on termination (Message flow, Termination). But the server can only do that once it detects the closure. A stalled client or a silently broken network path leaves the session idle in transaction. In this article's design, that session holds the row lock on the mug taken by the reservation inside the transaction. Both `idle_in_transaction_session_timeout` and `lock_timeout` default to 0 (disabled). Observed on 18.6: a paused client held order 104 and the mug reservation in an open transaction, and a second buyer's conditional UPDATE failed at a 1 s `lock_timeout`. After the client process was killed, order 104 was absent and stock was back to 1.
Effect: The reader learns that rollback is prompt and misses a common production failure: one stranded checkout blocks every later buyer of that product until the server notices. The pool paragraph's advice to keep unrelated network calls outside the transaction loses its strongest reason.
Repair: Change the step 3 wording to say that when the server learns the session has ended it rolls back the open transaction, and that until then the transaction keeps its locks. Add one clause to the pool paragraph: a server-side limit on idle open transactions bounds how long an abandoned one can block others. Link the mechanics to Managing connections and transaction lifetimes. The R103 decision logic is unaffected.

### practitioner-2 · optional · a00 "Transactions and competing buyers", Read Committed paragraph

Problem: The brief asks for isolation questions "with engine and configuration differences made explicit". Configuration is made concrete through asynchronous commit. For engines, the article names only PostgreSQL's default and repeats that engines "differ in details that matter", with no concrete contrast. MySQL InnoDB, for example, defaults to REPEATABLE READ (MySQL 8.4 manual).
Effect: A newcomer may carry "Read Committed is the default, and a waiting updater rechecks the condition" into another engine as a general rule. That undermines the article's own closing advice to check the contract per engine.
Repair: Add one clause after the Read Committed sentence. For example: defaults differ (InnoDB starts at Repeatable Read), so check the chosen engine's documented behaviour for this statement before relying on it. Making concurrent changes correct and Choosing a relational database already own the detailed comparison.

### practitioner-3 · optional · a00 "Changing a live database", paragraph beginning "The database has physical work to do as well"

Problem: The paragraph ties risk to scanning, rewriting and holding locks, and recommends rehearsal on representative data. In PostgreSQL most ALTER TABLE forms take an ACCESS EXCLUSIVE lock (ALTER TABLE, PostgreSQL 18). Even the fast, metadata-only optional column this section recommends must wait for open transactions, and while it waits, ordinary requests queue behind it. Observed on 18.6: with one reader holding an open transaction for 3 s, a queued `ALTER TABLE orders ADD COLUMN delivery_instruction text` made a plain `SELECT count(*) FROM orders` fail at a 1 s `lock_timeout`. A rehearsal on representative data without the live overlapping transactions would not show this.
Effect: A reader who follows the recommended first step can still stall the shop and believe the change was safe because it is "only metadata".
Repair: Add one sentence. For example: even a quick change must wait for a strong lock, and requests queue behind it, so set a short lock-wait limit and retry instead of waiting indefinitely. Link to Changing schemas without breaking applications; a06 already teaches separate lock-wait limits.

### practitioner-4 · optional · a00 "Keeping the service and its data", first paragraph

Problem: The H8 brief lists maintenance among the service concerns. The article only names "the people responsible for maintenance" and leaves capacity room for an index build. It does not say why routine upkeep exists or how it fails. Changed and deleted rows leave old versions to reclaim, statistics need refreshing, and a long open transaction prevents cleanup: PostgreSQL 18 documents that an open transaction "prevents vacuuming away recently-dead tuples" and can contribute to bloat.
Effect: The reader has no model of the slow failure that a practitioner meets: neglected upkeep or a forgotten transaction grows storage and degrades plans until it becomes an outage. "Watch … storage growth" then has no explanation behind it.
Repair: Add one or two sentences. Ordinary writes create upkeep, such as reclaiming old row versions and refreshing statistics, and long transactions or neglected maintenance can turn that upkeep into growth and slow plans. Then hand off to Maintaining and upgrading a relational service. This pairs naturally with practitioner-1's idle-transaction point.

## Limits

- Rendered figures were not exercised in a browser. I used the rendered HTML only to confirm the hash and link destinations. Control behaviour, all-state rendering and layout belong to the visual perspective. Figure state logic was read in source and compared with `models.mjs`, and that file's join and transaction states are asserted against native SQL by `verify.mjs`.
- MySQL behaviour was checked against its documentation only, not executed.
- No crash, asynchronous-commit loss, failover, replica promotion, PITR restore, payment-provider duplicate prevention, managed-service term or production-load claim was executed. The article does not present any of these as observed, and they rest on documentation or design reasoning.
- The lock and stranded-transaction probes ran on a single local cluster with default settings and short artificial timings. They show the mechanism, not production timings. A paused client stood in for a silent network failure, and keepalive-based detection was not tested.
- I checked child ownership with targeted searches, not full readings of a01 to a08 and their descendants.
