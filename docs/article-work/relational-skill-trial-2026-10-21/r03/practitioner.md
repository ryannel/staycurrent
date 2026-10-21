# Practitioner review · article · a00 Relational databases and a03 Making concurrent changes correct · 6ca25b8

Inputs read: CLAUDE.md; the review skill and its practitioner perspective; `src/articles/relational-trial-2/a00.astro` and `a03.astro` with every file in `src/components/relational-trial-2/a00/` and `a03/` (models, scenes, figures, verify scripts); the root and the "Relational transactions and concurrency" nested article of `docs/coverage/relational-2026-10-19.yaml`; the a00 and a03 registry entries and the child list in `docs/article-work/relational-writing-2026-10-19/registry.json`; the root section briefs of `docs/coverage/relational-fanout-2026-10-19.yaml`; the commission; the trial brief `docs/article-work/relational-skill-trial-2026-10-21/brief.md`; the example record `docs/coverage/relational-example.md`; `a00/sources.md` and `a03/sources.md`; the headings and the overlapping sections of the child drafts a18, a19, a22, a23 and a32 in `src/articles/relational-next/`, plus anchor checks on every child section either article links to.
Withheld and not opened: both `writer.md` files; the r01 and r02 folders and every other review or decision; `src/articles/relational-next/a00.astro`, `a03.astro` and their component folders; everything under `relational-trial/`, `docs/article-work/relational-skill-trial-2026-10-20/` and `relational-introduction-review-2026-10-20/`; git history and diffs of these articles.
Verdict: a00 repairs required · a03 pass

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | a00 finding; a03 pass | a00 says replicas keep every committed change and offers a standby as the answer to machine loss, without saying a replica lags (practitioner-20). Every other claim I checked held. Details below. |
| 2. Evidence | pass, both | Figures say what is illustrative and what was run. I ran both verify scripts on a fresh PostgreSQL 18.6 instance: a00 290 checks passed, a03 301 checks passed, SQLite script passed on 3.54.0. MySQL entries are labelled "documented; not run". |
| 3. Coverage | a00 finding (optional); a03 pass | a00 gives the method for choosing a system but not the worked shortlist its brief asks for (practitioner-21). a03 covers every outcome in its brief, including the awkward cases. |
| 4. Depth, both ways | a00 finding (part of practitioner-20, plus optional practitioner-22); a03 optional finding | a00 says nothing about replica lag at any depth. a03 is long, but each section serves an outcome. Its SQLite cards assume a setting that is not the default (practitioner-25). |
| 5. Ownership | a03 optional finding | a03's lost-reply figure teaches the same arbitration as a22's Figure 4 (practitioner-24). The a00/a03 boundary is clean: a00 gives the race and one repair, and a03 owns the anomalies, the engine contracts and the protocols. |

### What I checked, and against what

Primary sources (PostgreSQL 18 pages fetched or already cited, cross-checked against observed runs):

- PostgreSQL 18 [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  - Read Committed rechecks the WHERE condition after a wait.
  - At Repeatable Read, the snapshot is taken at the first statement, and changing or locking a row that another transaction changed fails with 40001.
  - Serializable may fail at COMMIT, and its reads are not valid until commit.
  - Read Uncommitted maps to Read Committed.
- [Serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html), fetched 21 October 2026. It underlies practitioner-23.
- [Asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html): the window of three times `wal_writer_delay`.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html): the deadlock victim is not predictable; ACCESS EXCLUSIVE blocks plain reads.
- [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html): `SET NOT NULL` scans the table.
- [Client connection defaults](https://www.postgresql.org/docs/18/runtime-config-client.html): `lock_timeout`, and `idle_in_transaction_session_timeout` and `transaction_timeout` both default to 0.
- [Warm standby](https://www.postgresql.org/docs/18/warm-standby.html): streaming replication is asynchronous by default.
- MySQL 8.4 InnoDB [consistent reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html), [isolation levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) and [error handling](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html):
  - DML acts on the latest committed rows.
  - At Serializable with autocommit off, a plain SELECT becomes FOR SHARE.
  - A duplicate key or a lock-wait timeout rolls back only the statement, unless `innodb_rollback_on_timeout` is set; a deadlock rolls back the whole transaction.
- SQLite [isolation](https://www.sqlite.org/isolation.html) and [WAL](https://www.sqlite.org/wal.html).
- Berenson et al. (1995) and Ports and Grittner (2012), as the articles cite them.

Reproduced on a disposable PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0) at 127.0.0.1:57661 with `LC_ALL=C`, `initdb --auth=trust`, Unix sockets off. The instance was stopped and removed afterwards.

- `node src/components/relational-trial-2/a03/verify.mjs --host 127.0.0.1 --port 57661`: 301 ok, "All checks passed".
  - My load run accepted 398 of 400 read-then-write attempts, where the page reports all 400 "in the recorded run". It overbooked in all 20 rounds, and the two-client test overbooked 100 of 100. Both agree with the page.
- `A00_PG_PORT=57661 node src/components/relational-trial-2/a00/verify.mjs`: "PASS: 290 checks on PostgreSQL 18.6".
  - Observed: 199,003 orders; 1,268 table pages each for orders and order_items; index 230 pages; heap scan 3 pages = index 2 + table 1.
  - Log written by 10,000 inserts: 2,026,720 bytes without the index and 2,729,824 with it. The page gives 2.03 MB and 2.73 MB.
- `python3 -I a03/verify-sqlite.py`: 3 ok on SQLite 3.54.0.
  - My own variant set a 5 s busy timeout on Ravi's connection. His deferred write still failed with SQLITE_BUSY at once, so the card's result does not depend on the script's zero timeout.
- My own two-session psql check of a03's most surprising claim, the guard row at Repeatable Read:
  - With `SELECT … FOR UPDATE` as the guard, Ravi waited, got the lock with no error, still counted 2, and both committed, leaving 0 available.
  - With `UPDATE classes … WHERE class_id = 21` as the guard, Ravi waited, then failed with "could not serialize access due to concurrent update", leaving 1 available.
  - This matches the page exactly.

Every child anchor that a03 and a00 link to exists in the current child drafts.

## Findings

### practitioner-20 · required · a00 · "Running and recovering the database", the paragraph after Figure 6; "Choosing a database", third paragraph

Problem: The article never says that a replica lags behind the writer. Instead its prose says the opposite in two places:

- After Figure 6 it says "Crash recovery and replicas keep every committed change, mistakes included."
- In the choosing section it answers "What must survive the loss of a machine?" with "For most applications a standby replica answers that, promoted to be the new writer".

PostgreSQL's streaming replication is asynchronous by default. A promoted standby lacks any commits it had not yet received, including commits the application has already confirmed to customers. Until it applies a change, reads from it are stale.

The qualification appears only in Figure 6's non-default "Database machine is lost" state ("Order 103 survives only if its commit waited for the replica…"). The prose that readers carry away never states it. Both briefs ask for this:

- The fanout brief for this section asks that replicas be introduced "as mechanisms whose guarantees must be demonstrated for the chosen deployment".
- The 2026-10-19 root plan has a section on an order read reaching a replica before its latest change, and its copy-versus-ownership questions.

The article covers neither.

Effect: A newcomer leaves believing a standby both protects confirmed orders on machine loss and can serve reads as if it were the writer. That is a misstatement of the durability and visibility contract the root says the reader should be able to explain. The shop's own requirement, "No confirmed order is lost", is exactly the one an asynchronous failover breaks.

Suggestion: In the operations prose, state that a replica applies the writer's log shortly after the writer:

- Reads from it can miss the latest changes.
- Unless each commit waits for the replica (synchronous replication, which makes every commit slower), promoting it can lose commits the application already confirmed.

Correct the "replicas keep every committed change" sentence to say what a replica has received, and qualify the standby answer in the choosing section. Link the detail to Operating replicas and partitioned data (`#decide-what-an-acknowledgement-promises`). Two or three sentences are enough. This is a fact the root must state, not a mechanism to teach.

### practitioner-21 · optional · a00 · "Choosing a database, and what to read next"

Problem: The section gives the right method: write the requirements down, look for disqualifying limits, then run the same experiments on every candidate. But it never applies the method to the shop, and the root brief asks for "a worked system shortlist". The requirement-to-evidence table has five rows. Of the plan's six areas it omits specialist capabilities and ecosystem, and cost, portability and exit. Nothing separates a documented promise from a measured result or an assumption, although the article itself models that separation elsewhere ("documented; not run here").

Effect: The reader learns which questions to ask but never sees them produce a defensible shortlist. They do not learn to weigh a vendor's documented promise against their own measurement.

Suggestion: Add two or three sentences that reach a shortlist for the shop. For example: several application servers write, so an embedded SQLite file is out; one region and modest writes, so a single PostgreSQL service with a standby comes before a distributed SQL system. Name what evidence would overturn that choice. Add a short row or a clause for capabilities, cost and exit, and label each piece of evidence as documented, measured or assumed.

### practitioner-22 · optional · a00 · "Transactions and competing buyers", the durability paragraph; "Indexes and the work behind a query"

Problem: The article says a commit returns once its record is in the write-ahead log, and that the log is replayed after a crash. It never says that the changed table pages are written later. The 2026-10-19 plan's execution brief asks for that contrast: "a commit acknowledgement differs from writing a data page".

Effect: Without the contrast, the reader has no reason why crash recovery has to replay anything, and no model for why commit cost differs from page-writing cost. Both ideas return in a05 and a24.

Suggestion: Add one clause to the durability sentence: "the changed table pages stay in memory and reach disk later; after a crash the log is replayed to bring them up to date".

### practitioner-23 · optional · a03 · the outcomes table row "Unique or check violation (23505, 23514)" and the constraints paragraph "A constraint error is an answer about the data"

Problem: The row says "Repeating the same change gives the same answer", and the prose generalises that constraint errors are answers, never collisions. That is right for the booking example, where a duplicate (class, customer) pair is a business fact. But PostgreSQL's own guidance in section 13.5 says something different:

- A unique-key failure is "effectively a serialization failure" when the application chose the new key after inspecting stored keys.
- Its example is a key picked from earlier reads.
- Retrying the whole transaction, with fresh reads, is then appropriate.

The shop's next `line_no`, computed from the order's existing lines, is exactly that shape.

Effect: A reader applying the table as written will report "already exists" to a user whose request would have succeeded on a fresh attempt.

Suggestion: Qualify the row: a 23505 is a domain answer when the key states a business fact. When the key was derived from rows the transaction read, treat the error like 40001 and repeat the whole transaction. Cite section 13.5.

### practitioner-24 · optional · a03 · "A lost reply to COMMIT" and Figure 5

Problem: Figure 5's four options and the three paragraphs around it teach the full database-side resolution of an unknown commit:

- the lookup is inconclusive while an attempt is in flight;
- recording the request first makes the repeat wait on the primary key;
- the repeat's wait should be bounded with a server timeout.

The child a22 ("Recovering database requests safely", `#resolve-an-outcome-that-the-caller-did-not-receive` and its Figure 4) teaches the same two points, the empty lookup and the claim that waits for an attempt in flight, with K7 in place of R8. The 2026-10-19 plan hands "ambiguous commit outcomes" to application engineering. The registry's a03 brief does include "uncertain commit outcomes", so a03 has a claim to the database half.

Effect: A reader who follows the route meets the same mechanism twice, with different identifiers and tables. The topic risks having two full treatments.

Suggestion: Keep a03's database mechanism, that a unique key makes the repeat wait for the attempt in flight. Then either:

- drop the "Look up R8 first" option and leave the inconclusive lookup to a22; or
- tell the reader explicitly that a22 owns the request-level protocol.

Alternatively, record in the coordinator's decision that a03 owns this mechanism and that a22 should link to it rather than reteach it.

### practitioner-25 · optional · a03 · "How engines differ", the SQLite cards

Problem: The cards assume WAL mode, and the lead-in says WAL "lets readers carry on while one connection writes". It does not say that WAL is not SQLite's default. In the default rollback-journal mode, an open reader delays the writer's commit. The plan's engine table asks for exactly that contrast between rollback journal and WAL; a32 owns its detail.

Effect: A reader who uses SQLite with default settings expects the WAL behaviour on the cards. They will be surprised when a long read holds up every booking's commit.

Suggestion: Add one clause: "WAL must be switched on (`PRAGMA journal_mode = WAL`); in the default rollback-journal mode a reader also holds up a writer's commit". Link it to Checking an embedded choice with SQLite.

## Limits

- I did not run MySQL, so the InnoDB claims were checked against MySQL 8.4 documentation only. Both articles label them as not run.
- I did not run a replica promotion, which a00 also labels as not observed.
- I did not render the pages or play the figures. For figure content I relied on `model.mjs` and `scenes.mjs`, which both verify scripts compare against the database step by step. The visual and teaching perspectives own rendering.
- The two plans differ for a00. The article follows the registry's section list (from the fanout tree), which includes "Changing a live database". The 2026-10-19 root plan has a distribution section and puts compatible schema change under application engineering. I judged against both and raised only what fails the commission's goal under either.
- The trial pages link to the live `/review/relational-next/` drafts. I could not check that a00's link `transactions/#losing-the-reply-does-not-prove-rollback` resolves, because the live a03 is withheld. That is a routing question for the coordinator.
