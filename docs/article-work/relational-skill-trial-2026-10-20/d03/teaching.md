# Teaching review · article (narrow recheck) · a00 "Relational databases" and a03 "Making concurrent changes correct" (trial versions) · commit 5a49e8c, round d03

Inputs read: the word-level diff of both trial articles from f786105 to 5a49e8c; the repaired passages of a03 in full, namely the predicate paragraphs, the coordination bullets, the "Choosing a protection" table, the deadlock prose, the retry paragraph, the closing argument and the shop paragraph; the protection labels in `src/components/relational-trial/a03/model.mjs`; the rebuilt pages in `dist/review/relational-trial/`, checked to confirm they carry the repairs; the d02 repair decisions (`docs/article-work/relational-skill-trial-2026-10-20/d02/repair-decisions.md`); my d02 report. Withheld as instructed: the writers' notes and the live a03.
Verdict: a00, pass; a03, pass

## d02 findings

| Finding | Status | Note |
| --- | --- | --- |
| teaching-9 · a00, "the last column" | Fixed | The text now reads "The last row carries a second lesson", which matches the transposed table. |
| teaching-10 · a03, Serializable for writers you cannot change | Fixed | The table row is narrowed to "Several rows, when every writer can be run at Serializable". It now says the detection works "between Serializable transactions only", and that each writer must be retried or rerun after 40001, with `default_transaction_isolation` for a program you cannot edit. The closing argument says both conditions are needed and what to do if they cannot be met. One wording slip remains (teaching-12). |
| teaching-11 · a03, `available` instead of `stock` | Fixed | The shop paragraph uses `stock` and "order lines", as a00 does. |

## Checks

Only the checks the d02 repairs touched were rechecked; the rest stand as in d02.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | a00: pass; a03: pass | a00 now explains "pages" and "replication lag" at first use. a03's split predicate paragraph introduces `SELECT … FOR UPDATE` before using it. |
| 2. Order | a00: pass; a03: finding (optional) | The new observed overbooking case says the waiting count "rechecked only R7". The reader needs one clause on why the wait did not let it see the new row (teaching-13). |
| 3. Examples | a03: pass | The shop paragraph uses a00's names. The overbooking case runs in class 22 with its capacity changed to 2, and the text says so. |
| 4. Showing | a03: pass | The overbooking case changes little state (two bookings becoming three) and is clear in two sentences. Figure 5's options and prose now share one name each. |
| 5. Judgement | a03: finding (optional) | The Serializable row and the closing argument now give a usable rule. Two small mismatches remain: "If neither can be arranged" (teaching-12), and the "Lock the rows you counted" row still promises "a fresh count" (teaching-14). |
| 6. Gradual exposure | a03: pass | The overbooking case gives the failure only, and the fix stays with Designing changes that coordinate with locks. |
| 7. Placement of additions | a00: pass; a03: pass | See below. |

### Placement of each addition

**a00**
- **Definitions of pages and replication lag:** belong here, at the first use of each term.

**a03**
- **Observed `FOR UPDATE` overbooking case:** belongs here. The a03 brief requires it to show that the locked rows must cover new rows. One observed counterexample is the concrete form of that argument. a18 still owns building a protocol for counting without the counter, and the paragraph does not attempt it.
- **Narrowed Serializable row and the `default_transaction_isolation` note:** belong here. They are the minimum needed for the decision this table exists to support. Engine contracts stay with a19.
- **How to recognise a retryable 23505:** belongs here, beside the retry rule it qualifies. Retry machinery stays with Recovering database requests safely.
- **Softened deadlock claim in the shop paragraph:** belongs here, as a correction in place.

## Findings

### teaching-12 · optional · a03, closing argument

Problem: The argument says Serializable protects a writer "only if two things can be arranged", then continues "If neither can be arranged, no protection in the table covers that tool". The decision record intended "if either cannot".
Effect: A reader whose import tool can be run at Serializable but cannot retry its refused runs may read the sentence as saying the tool is still covered. The previous sentence's "only if two things" makes the intended meaning recoverable.
Repair: "If either cannot be arranged, …"

### teaching-13 · optional · a03, "Protect the decision, not just the write", the `FOR UPDATE` overbooking case

Problem: "Once the first committed, the second rechecked only R7, missed the new row" gives the result but not the reason. a03's own definitions of the isolation levels come in the next subsection. Its explanation of the recheck after a lock wait comes later still, in "Put the condition in the change".
Effect: A newcomer may expect that waiting for the first booking means seeing its result, and is left puzzled about why the count stayed at one. The reason has to be assembled from a00's definition of Read Committed.
Repair: Add one clause: "the count was a single statement that began before the first booking committed, so it could not see the new row; the wait only refreshed R7, the row it had been waiting for."

### teaching-14 · optional · a03, "Choosing a protection" table, row "Lock the rows you counted"

Problem: The "What the losing request sees" cell reads "Waits, then a fresh count", the same wording as the coordination-row row. The overbooking case added in this round shows that after the wait this protection's count is not fresh for rows that start matching. It rechecks only the rows it locked.
Effect: The table is where the reader settles the choice. Identical wording for these two protections hides the difference the paragraph just demonstrated, although the row's rule shape, "existing ones only", limits the harm.
Repair: "Waits, then a recount of the locked rows only".

## Limits

This narrow round covered only the passages the d02 repairs changed. I did not reread the unchanged parts of either article or play the figures. Whether the stacked layout of the "Choosing a protection" table at 375 px keeps the column names legible is left to the visual recheck.
