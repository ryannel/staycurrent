# Repair · trial a03 · d04

A test of [staycurrent-revise](../../../../.claude/skills/staycurrent-revise/SKILL.md) and [staycurrent-continuity](../../../../.claude/skills/staycurrent-continuity/SKILL.md) on the trial a03 at a31b275. The two passages that `results.md` and the revise skill name as reading like accumulated fixes were treated as findings. No earlier review perspective raised them; they come from the coordinator's reading after d03.

## Findings and what changed

### d04-1 · closing argument, the vendor import tool

Problem as the reader meets it: the closing paragraph of "Check the argument with competing sessions" sums up the booking argument, then stops for four sentences about a writer the example does not have. The sentences stack conditions: Serializable protects the tool only if it runs at Serializable; a level it sets itself overrides the default; if it cannot run at Serializable nothing covers it; if it cannot retry, rerun by hand.

What the reader needs: the decision about a program you cannot change belongs where the protection is chosen, not in the summary.

Change:
- **Moved** the case to "Coordinate decisions that span several rows", as a new paragraph after the one saying every writer must follow the locking protocol (line 127). It says: code you own can be changed to take the lock; a program you cannot change can still be run at Serializable through its role's default; every other staffing writer must then run at Serializable too, because conflicts are detected only between Serializable transactions; a program that can do neither must not change these rows. No sentence carries more than one condition.
- **Cut** the four sentences from the closing paragraph. Its reason for choosing the coordination row ("every staffing path is code the team controls") now carries the condition by itself.
- **Moved** "check that the program does not choose a level of its own" into the "Choosing a protection" table's Serializable row, under "What every writer must do", where the reader configures it.
- The "rerun by hand" point was already in the same table cell ("be retried or rerun after error 40001"), so it was not repeated.

### d04-2 · "Protect the decision, not just the write", the `FOR UPDATE` count

Problem: one paragraph introduced `FOR UPDATE`, set up a hypothetical without the counter, gave the run's capacity, explained the wait through statement start times ("a single statement that had started before the first booking committed … the wait refreshed only R7") before the article explains snapshots or the Read Committed recheck, then restated the result and ended with a signpost. Readers had to read it twice.

Change:
- **Split** it in two. The first paragraph says what a locking read covers: the first two kinds of predicate change, not a row that does not match yet.
- The second paragraph tells the run as a short story with people from the record: Mina and Edda each count class 22's bookings with `FOR UPDATE`; Edda's count waits for Mina's lock on R7; Mina's booking was not committed when Edda's count started, so the count could not see it; after the wait PostgreSQL looked again only at R7; Edda books too. It uses only what the article has taught by then (uncommitted changes are invisible, line 40; locks wait, line 41).
- **Reworded** the setup: "the harder case mentioned earlier", which points back to the counter paragraph after Figure 1, and states the capacity change as a change ("lowered to 2 for this run").
- **Cut** the closing signpost ("Keep those three kinds of change in mind …").
- Named `FOR UPDATE` a **locking read** where it is introduced; see the continuity pass.

## Passages restructured beyond the findings

The whole-article reread found one more passage reading as a patch, and the continuity pass found five terms used before their explanation. Rechecks should read each of these:

1. "Retrying one statement keeps a stale decision", third paragraph (line 156): the 23505 exception under Serializable. Before: "If the transaction ran at Serializable, read the table to choose a new key and then inserted that key, treat 23505 as you would 40001", three stacked conditions, plus a separate sentence on how the application recognises the case. After: the situation is described as what happens (two transactions choose the same new key; the loser's 23505 is really a serialisation failure), then that the application knows when its own code chose a key that way, then why Tariq's error is a real duplicate. The documented claim is unchanged.
2. Line 49: "old row versions" became "data that later changes have replaced" (row versions are explained at Figure 4).
3. Line 52: "constraints" named at the start of "Let the database refuse invalid states".
4. Line 71: "locking read" named; it was used at line 130 and in Figure 3 and 4 step text without being named.
5. Lines 170 and 174: "replicas" named; "promoted" became "takes over".
6. Figure 4 step text (`model.mjs`): "VACUUM" became "PostgreSQL's clean-up process, VACUUM".

## Checks

- Term list: [continuity.md](continuity.md).
- `verify.mjs` rerun on a disposable PostgreSQL 18.6 server (default settings): exit 0, every check passed, including "counting FOR UPDATE overbooks after a wait" (second session waited on a lock, then returned only R7; three bookings in class 22 at capacity 2). Only step text changed in `model.mjs`.
- `pnpm build`: passed; site check 143 pages, all 13 rules ok.
- Rendered page: the built page was served from `dist/` and read with headless Chromium. Each changed passage and the table cell render as written. The in-app browser pane refused localhost, as in the earlier rounds. The table change is a longer sentence in a stacked card (display: block), so it wraps rather than widening the page; not checked by screenshot at 375 px.
- Words: [comparison.md](comparison.md).

## Not changed

- The live drafts under `src/articles/relational-next/` and the published collection, which disagree with the example record in many places ([relational-example.md](../../../coverage/relational-example.md#where-existing-articles-disagree)).
- Figures and listings: no row, schedule or outcome changed.
