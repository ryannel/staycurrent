# Practitioner review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · f786105, round d02 (recheck)

Inputs read: the repaired src/articles/relational-trial/a00.astro and a03.astro in full; the changed parts of both component folders (a00 model.mjs, a03 model.mjs, verify.mjs, the move scenario for Figure 5); `git diff 03f972f f786105`; d01/repair-decisions.md; the "d01 repairs" sections of a00/writer.md and a03/writer.md, and both sources.md files; the a18 lock-order section and heading list in src/articles/relational-next/a18.astro, for ownership; the PostgreSQL 18.6 HTML documentation installed with Homebrew. The same briefs and commission as d01. Withheld as before: the live a03 and earlier review folders other than d01's decisions.

Reproduction: PostgreSQL 18.6 (Homebrew, aarch64-apple-darwin25.6.0), in a fresh disposable cluster in my scratchpad (`initdb --locale=C -U staycurrent -A trust`; port 57511, `listen_addresses=127.0.0.1`, `unix_socket_directories=''`, `LC_ALL=C`). It was stopped afterwards. Defaults: Read Committed, `synchronous_commit = on`, `fsync = on`, `deadlock_timeout = 1s`.
- a03, on a scratch copy: `PGPORT=57511 A03_DB=prac_a03 node verify.mjs`. It exited 0 and passed every check, including Figure 5's opposite-order and ordered schedules and the new repeated-move case. Repeated move without the recheck: the second run returned `UPDATE 1 ×3, COMMIT`, and the invariant query returned `21|3|2|2|f` and `22|3|0|2|f`, the same numbers as my d01 experiment. With the recheck: the second run returned `UPDATE 0, ROLLBACK`, and the query returned `21|3|1|2|t` and `22|3|1|2|t`.
- a00, on a scratch copy: `node verify.mjs 127.0.0.1 57511 staycurrent`. It exited 0 with 51 PASS lines and "All checks passed". Apart from timestamps, file nodes, encoding, buffer hits and the observer's polling lines, the output matched the committed observed.txt.
- Own experiment for practitioner-9: the a03 fixture with class 22 at capacity 2, holding R7, with 1 place left. Session A ran `SELECT request_id FROM reservations WHERE class_id = 22 FOR UPDATE`, inserted R30 and paused 2 s before COMMIT. Session B ran the same locking read 0.5 s later. `pg_stat_activity` showed B waiting (`Lock / transactionid`). After A committed, B's read returned only R7, and B inserted R31 and committed. The class ended with 3 bookings for capacity 2.

Verdict: repairs required (a00: pass; a03: repairs required)

## d01 findings

| Finding | Piece | Status | Note |
| --- | --- | --- | --- |
| practitioner-1 | a00 | fixed | The section 1 table now has four rows, and Transactions says the first two rows (work stopped part-way) are solved, but not the last row (concurrent orders). |
| practitioner-2 | a00 | fixed | The deadline row is split into before and during COMMIT. The connection paragraph warns against returning a connection to the pool mid-transaction. |
| practitioner-3 | a00 | fixed | The NOT VALID paragraph opens "Once no old code is running". The verified behaviour is unchanged. |
| practitioner-4 | a03 | fixed | The listing locks 21 then 22, then guards with `UPDATE reservations … WHERE request_id = 'R8' AND class_id = 21`, rolling back on UPDATE 0. Reproduced: the repeated move is now refused, and the old listing still breaks both classes. The closing argument is amended. |
| practitioner-5 | a03 | fixed | The retry paragraph and the lost-reply table give the documented 23505/23P01 exception under Serializable, and Sources cites the page. |
| practitioner-6 | a03 | fixed | "Starts matching" now includes rows changed to match, and the coordination-row and Serializable bullets say they cover such rows. A new sentence in the same paragraph introduces practitioner-9. |
| practitioner-7 | a03 | fixed in a03 as decided; residual overlap recorded as practitioner-12 | a03 now hands the full ordering procedure to a18. The repair turned the deadlock into Figure 5, which matches a18's Figure 4 option for option. |

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Correctness | finding | a03: the "Choosing a protection" table and the closing argument recommend Serializable for writers that cannot be changed, which contradicts the article's own condition that every writer runs at Serializable (practitioner-8). The new FOR UPDATE example says neither transaction waits, but one does (practitioner-9, reproduced). The shop paragraph's deadlock claim does not match a00's listing (practitioner-10). a00: "the last column" now refers to a table that was transposed (practitioner-11). Every other repaired claim checked out: WAL and `synchronous_commit = off`, isolation and lock definitions, deadline rows, the pool warning, replica and backup definitions, the move recheck and Figure 5. |
| Evidence | pass | Both scripts rerun green on 18.6 and the observed values reproduce. Figure 4 is labelled "a model; its waits and results were observed". The schedules are labelled as timings that were run. The durability table and MySQL statements are still marked as untested. |
| Coverage | pass | The decision criteria are now gathered in one place, and the repeated-request and row-starts-matching cases appear in the test procedure. The shop application that a04 expects is supplied, subject to practitioner-10. |
| Depth, both ways | pass | The repairs add no depth beyond the brief. The table is a summary of choices already taught, not a new mechanism. |
| Ownership | finding | The "Choosing a protection" table is a03's own subject (its brief asks for practical choices among statements, conditions, locks and isolation) and does not duplicate a18. Figure 5 does duplicate a18's deadlock figure (practitioner-12). |

## Findings

### practitioner-8 · required · a03, "Coordinate decisions that span several rows", "Choosing a protection" table (last row) and the closing argument

Problem: The table's last row offers Serializable for "Any, including writers you cannot change", and in the same row says every writer must "Run at Serializable and retry on 40001". The closing argument repeats the advice: "A writer that cannot be made to take the lock, such as a vendor's import tool, would point to Serializable instead." Three paragraphs earlier, the article says correctly, as the PostgreSQL documentation does, that Serializable protects "only between transactions that all run at Serializable". A vendor tool left at its default level (Read Committed) gets no protection from the other transactions running at Serializable. A practitioner can make such a tool run at Serializable without changing its code, with `ALTER ROLE … SET default_transaction_isolation = 'serializable'`, or the same setting for the database. The tool must then survive 40001 aborts, which an unmodified tool may not retry.
Effect: This is the article's summary of how to choose. A reader with an unmodifiable writer picks Serializable expecting it to cover that writer, and nothing protects the rule.
Repair: Change the row to something like "Rules spanning rows, when every writer can be run at Serializable". Under "What every writer must do", write: "Run at Serializable (for a tool you cannot change, by setting `default_transaction_isolation` for its role or database) and be retried, or at least fail safely, on 40001". In the closing argument, say that a vendor tool points to Serializable only if its role can be set to Serializable and an aborted run is acceptable. Otherwise the tool needs the lock, or must be kept away from those tables.

### practitioner-9 · optional · a03, "Protect the decision, not just the write", new example sentence

Problem: "If capacity were checked by counting class 21's reservations with `FOR UPDATE`, a second booking's new reservation row would not be among the locked rows, so neither transaction would wait." That is true only when the count finds no rows. When existing reservations match, the second transaction waits for the first one's locks on them. After the first commits, the second rechecks only the rows it had locked, so its count misses the new row, and it books anyway. I reproduced this on 18.6 (class 22, capacity 2, R7 already booked): session B waited (`Lock / transactionid`), then saw only R7, inserted, and the class ended with 3 bookings for capacity 2.
Effect: The reader learns that the failure shows up as no waiting. In practice the transaction usually waits, which looks like protection, and still overbooks. That is the awkward case a practitioner will meet.
Repair: "…the second transaction may even wait for the first one's locks on the existing reservations, but once it resumes it rechecks only those rows. The first booking's new row is not among them, so its count is stale and it books anyway."

### practitioner-10 · optional · a03, "Check the argument with competing sessions", paragraph on the shop's order (with a00's order listing)

Problem: The paragraph says the shop reduces "the mug's `available` count", but a00's column, which this paragraph is applying, is `stock`. It also says "When an order reserves several products, it updates their stock rows in product order so that two orders cannot deadlock on each other." a00's order transaction, the listing this paragraph refers to, updates P7 before P3, which is not product order. And "cannot deadlock" claims more than a03's own earlier warning, which says lock order removes only the deadlocks you designed for, while foreign-key checks and other paths can still deadlock.
Effect: A reader who checks the claim against a00's listing finds the shop does not do what a03 says it does. The absolute "cannot deadlock" contradicts the earlier warning.
Repair: Use `stock`. Either reorder a00's listing to update P3 before P7, adding a one-line comment ("in product order"), or say "should update". Weaken "cannot deadlock on each other" to "cannot deadlock on each other's stock rows".

### practitioner-11 · optional · a00, "The work behind a query", paragraph after the page-count table

Problem: The table was transposed for phones and now has one column per table size. The text still says "The last column carries a second lesson", meaning the with-an-index measure, which is now the last row. The last column is the 1,000,000-row column.
Effect: A reader looks in the wrong place. It is the same class of slip as practitioner-1, and the repair introduced it.
Repair: "The last row carries a second lesson", or name it: "The row for the indexed lookup carries a second lesson".

### practitioner-12 · optional · a03 Figure 5, against a18 "Acquire several resources in a consistent order" (ownership)

Problem: The accepted repair for practitioner-7 made the deadlock a stepped figure: moving reservations between classes 21 and 22, an opposite-order run (40P01 victim, 25P02, rollback) and a run where both lock 21 first. a18's Figure 4 is the same scenario with the same two options. a03 also now teaches the recheck of the reservation under the locks, which is the next step in a18's procedure. The a03 version is correct and verified, and as the parent it is the right owner of the demonstration. The repeat is now on a18's side.
Effect: A reader who takes the route from a03 to a18 steps through the same deadlock twice.
Repair: This is a coordinator decision outside these two pieces. Have a18 point to a03 Figure 5 for the cycle and its cure, and keep a18's own figure only for what a03 does not show (cancellations, capacity changes, a lower-numbered class discovered late). The "Choosing a protection" table needs no change for ownership. It summarises a03's own choices; correct its Serializable row as practitioner-8 asks.

## Limits

- I did not read the live a03 or earlier review reports beyond d01's decisions and my own d01 report.
- I judged Figure 5 from its model data and the verified schedule, not by stepping through it in a browser.
- The durability table, MySQL statements and the `ALTER ROLE … SET default_transaction_isolation` remedy in practitioner-8 are checked against documentation, not run.
- Outside this perspective, for the editorial reviewer: a00's live-change section opens a new `<p>` inside an unclosed one ("…require the column. <p>PostgreSQL 18 offers…"). Browsers close the first paragraph, so the page renders, but the source is malformed.
- My cluster was SQL_ASCII (`--locale=C`). No checked result depends on the encoding.
