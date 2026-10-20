# Practitioner review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · 03f972f, round d01

Inputs read: src/articles/relational-trial/a00.astro and a03.astro; every file in src/components/relational-trial/a00/ (model.mjs, verify.mjs, observed.txt, the four figures) and a03/ (model.mjs, verify.mjs, schedule-view.mjs, the three figures); built pages dist/review/relational-trial/index.html and transactions/index.html (figure captions and text alternatives); the a00 and a03 entries in docs/article-work/relational-writing-2026-10-19/registry.json; the top brief and the a00 heading briefs, the a03 nested brief and its heading briefs in docs/coverage/relational-fanout-2026-10-19.yaml; docs/article-work/relational-skill-trial-2026-10-20/brief.md, a00/sources.md, a03/sources.md and the writers' notes; finished children in src/articles/relational-next/ (heading lists, and the a18 lock-order section in full, to check ownership); the PostgreSQL 18.6 HTML documentation installed with Homebrew (transaction-iso, mvcc-serialization-failure-handling). Withheld as instructed: the live a03 (src/articles/relational-next/a03.astro and its components) and earlier review folders. I grepped the live tree only for links into /transactions/#… to confirm that every anchor they use exists in the trial a03.

Reproduction: PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0) in a disposable cluster in my scratchpad (`initdb --locale=C -U staycurrent -A trust`; `pg_ctl -o "-p 57511 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''"`, with `LC_ALL=C`), stopped afterwards. Defaults: Read Committed, `synchronous_commit = on`, `fsync = on`, `deadlock_timeout = 1s`.
- a00: copied the component folder to scratch, so that verify.mjs could not overwrite the work's observed.txt, then ran `node verify.mjs 127.0.0.1 57511 staycurrent`. It exited 0 with "All checks passed". Apart from timestamps, file nodes, encoding (SQL_ASCII here, UTF8 in the writer's run) and buffer-hit counts on one diagnostic line, the output matched the committed observed.txt. The published page counts (3/3/4, 8/736/7,353, 3/102/1,004) reproduced exactly.
- a03: copied the folder, then ran `PGPORT=57511 A03_DB=prac_a03 node verify.mjs`. It exited 0, and every schedule, level table, deadlock, retry and lost-reply case passed.
- Own experiment for practitioner-4: the a03 fixture with class 21 set to capacity 3 and 0 remaining, holding R8 (Mina), R20 and R21. I ran the printed `moveListing` in two concurrent sessions (the first paused with `pg_sleep(2)` before COMMIT), then ran the article's invariant query.

Verdict: repairs required (a00: repairs required; a03: repairs required)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | a00: section 4 refers to a fourth row of a three-row table (practitioner-1); the deadline row of the section 5 table is imprecise (practitioner-2). a03: the recommended move listing breaks the capacity rule when the same move runs twice (practitioner-4, reproduced); the retry rule contradicts the PostgreSQL documentation on 23505 (practitioner-5). Everything else I checked held, against the PG 18 documentation or a reproduction. |
| Evidence | pass | Both pieces label their models (a00 first table and Figure 4; a03 schedules "illustrative, replayed"; Figure 4 "illustrative model of row versions"). Every observed claim reproduced on 18.6. Untested claims (MySQL, the durability table) are marked as untested. |
| Coverage | finding | a00 covers each heading brief. a03 covers its brief, with one gap: it does not say which protections cover a newly matching row (practitioner-6). The a00 NOT VALID advice leaves out one precondition (practitioner-3). |
| Depth, both ways | pass | a00 stays at orientation depth and gives each section a usable answer. a03's depth matches its brief, and nothing is taught that the goal does not need; the overlap with a18 is recorded under Ownership. |
| Ownership | finding | a00 hands each mechanism to its child. a03 repeats a18's deadlock demonstration step for step (practitioner-7). Every incoming /transactions/#… anchor used by the live tree exists in the trial a03. |

## Findings

### practitioner-1 · required · a00, "Transactions and competing buyers", second paragraph after the order listing

Problem: The text says a transaction "solves the first three rows of the table in section 1. It does not, by itself, solve the fourth: two complete, correct-looking transactions running at once." The section 1 table has three rows. The concurrency problem is its third (last) row, which section 1 itself calls "the harder problem".
Effect: The sentence that separates atomicity from isolation, the article's central distinction, points at a row that does not exist and says atomicity solves the concurrency row. A reader who goes back to the table finds the claims do not match it, and is left unsure which problem a transaction solves.
Repair: "That solves the first two rows of the table in section 1. It does not, by itself, solve the last one: two complete, correct-looking transactions running at once."

### practitioner-2 · optional · a00, "From a request to a committed order", failure table, deadline row

Problem: "The request's deadline expires during the transaction — Nothing, unless the cancellation is confirmed." This merges two different cases. If the deadline fires before `COMMIT` was sent, the outcome is known: the transaction cannot commit, provided the application closes the connection or rolls back. If `COMMIT` was in flight, the outcome is unknown, as in the row above. The row also misses the practical trap in the first case: returning a connection to the pool with its transaction still open, where the next borrower's `COMMIT` commits it.
Effect: The reader learns to treat every timeout as unknown, which is safe but costly, and does not learn the pool-hygiene rule that makes the known case known.
Repair: Split the row: "deadline before COMMIT was sent → not committed, once the connection is rolled back or discarded (never return it to the pool mid-transaction)"; "deadline while COMMIT was in flight → unknown; look the order up".

### practitioner-3 · optional · a00, "Changing a live database", paragraph after the outcomes table

Problem: "PostgreSQL 18 can also add the requirement as `NOT VALID` first, which … refuses new empty values straight away and is then validated after the backfill." The word "first" invites the reader to add it before the backfill, but the sentence does not say that `NOT VALID` refuses old code's inserts just as the final requirement does, as the table's last row shows. The verification script added it with no old code running.
Effect: A reader can add the `NOT VALID` constraint during the rollout, while old instances still insert orders without a tax country, and break them.
Repair: Add "once no old code is running" to the sentence, for example: "Once no old code remains, PostgreSQL 18 can add the requirement as NOT VALID before the backfill finishes …".

### practitioner-4 · required · a03, "Retry an aborted transaction as a whole", the move listing and its use in the closing argument

Problem: The listing presented as the correct pattern ("Move Mina's booking, locking both classes in ascending order") locks the two class rows, then adds a place to class 21, takes one from class 22 and sets R8's class. It never checks that R8 is still in class 21 when the locks are granted. That is a decision read before the transaction, and the article's own thesis says to protect it. I reproduced the failure on 18.6. Class 21 had capacity 3 and 0 remaining, holding R8, R20 and R21; class 22 had 2 remaining and R7. Two concurrent runs of the printed listing for the same move (a double click, or a retry after a lost reply) both returned `UPDATE 1, UPDATE 1, UPDATE 1, COMMIT`. The invariant query then returned `21|3|2|2|f` and `22|3|0|2|f`: the capacity rule was broken in both classes and no statement failed. The fixture's capacities of 1 and 3 hide this, because the CHECK constraint happens to refuse the second move there. The closing section then states "Moves lock classes in ascending order" as part of the argument that the design is correct.
Effect: A practitioner copying the article's one complete multi-row listing gets a counter-drift bug under the exact writers the article tells them to list (repeated requests, cancellations, other moves). The final correctness argument is wrong for the move path.
Repair: After locking both class rows, lock and recheck the reservation, for example `SELECT class_id FROM reservations WHERE request_id = 'R8' AND owner_id = 1 FOR UPDATE`, and roll back unless it returns 21. Alternatively, make the reservation change conditional (`… WHERE request_id = 'R8' AND class_id = 21`) and roll back on `UPDATE 0` before touching the counters. Add a repeated move, or a cancel racing a move, to verify.mjs. Amend the closing argument to say that moves recheck the booking's current class under the locks.

### practitioner-5 · optional · a03, "Retrying one statement keeps a stale decision", last paragraph, and the lost-reply table

Problem: "Retry only errors that the engine documents as safe to retry, here serialisation failures and deadlocks … A constraint error or an empty result is an answer, not a reason to try again." The PostgreSQL 18 page the article cites (Serialization Failure Handling) says it is "in some cases also appropriate to retry unique-key failures" (23505) and exclusion failures (23P01). Its example is two transactions that chose the same new key concurrently, which the server cannot detect as a serialisation failure. For Mina's duplicate booking, 23505 is a real answer. The general rule as written contradicts the source.
Effect: A reader applying the rule under Serializable treats a race on a generated key as a permanent refusal.
Repair: Qualify the sentence: "A constraint error is usually an answer. Under Serializable, PostgreSQL documents that 23505 and 23P01 can stand in for a serialisation failure when the key was chosen from data another transaction was changing, so retry those only in that case."

### practitioner-6 · optional · a03, "Protect the decision, not just the write" and "Coordinate decisions that span several rows"

Problem: The article lists three ways a predicate's answer can change, then says locking returned rows "does nothing about a row that did not exist yet". It never says which of the offered protections do cover a newly matching row: the coordination row, if every inserting or moving writer takes it, and Serializable, through its predicate tracking. It also narrows "starts matching" to new rows. An existing row that is updated to match is equally unprotected, and moving a booking into a class, which this article introduces, is exactly such a writer. The brief for "Coordinate decisions" asks for coverage of new rows, and the check procedure lists "an insert of a row the decision did not see" without the article ever showing the protection that passes it.
Effect: The reader knows FOR UPDATE on the counted rows is insufficient, but has to infer why the coordination row is the usual choice for count-based rules. They may not recognise an UPDATE into the predicate as the same hazard.
Repair: Add one sentence to each of the coordination-row and Serializable bullets saying that it also covers a booking inserted into, or moved into, the class, because every such writer must take the class row or run at Serializable. Change "a row that did not exist yet" to "a row that did not match yet, whether newly inserted or changed to match". Leave the protocol itself to a18.

### practitioner-7 · optional · a03, "Retry an aborted transaction as a whole", deadlock paragraphs and move listing

Problem: a03 demonstrates the deadlock with the same example that its child a18 uses in "Acquire several resources in a consistent order": moving reservations between classes 21 and 22 in opposite orders, a 40P01 victim whose next statement gets 25P02, then ascending order turning the cycle into a queue. Both articles do this with observed runs. a03's brief does ask for deadlocks and lock order, but a18 owns the acquisition-order procedure, including the reservation recheck that practitioner-4 finds missing from a03's listing.
Effect: Two full treatments of one demonstration, with the parent's version the weaker of the two. A reader who goes on to a18 meets the same scenario again.
Repair: Keep in a03 the principle, the observed 40P01/25P02 result and the rule that any victim retries the whole transaction. Drop the listing, or reduce it to the lock order, and point to a18 for the complete move protocol. If the coordinator keeps the listing, practitioner-4 applies.

## Limits

- I did not read the live a03 or earlier reviews, by instruction, so I cannot say whether these problems are new in the trial.
- The durability table in a03 and the MySQL statements in both pieces were checked against documentation from memory and the installed PostgreSQL docs only. I did not run replicas, `synchronous_commit = off`, `fsync = off` or MySQL.
- My reproduction used a SQL_ASCII cluster (`--locale=C`, no `--encoding`), unlike the writer's UTF8 cluster. No checked result depends on the encoding.
- I judged the interactive figures from their model data, captions and text alternatives in the built HTML, not by playing them in a browser. Their visual behaviour belongs to the visual perspective.
- I checked the finished children (a01–a08, a18, a19) only for ownership boundaries and anchors, not for their own correctness.
