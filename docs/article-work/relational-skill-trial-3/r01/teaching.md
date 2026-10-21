# Teaching review · article · a00 Relational databases and a03 Making concurrent changes correct · 80276a4

Inputs read: both complete article sources at fixed commit `80276a4` (the coordinator's `versions/draft02.json` version), their rendered text at `http://127.0.0.1:4333/review/relational-trial-3/` and `/transactions/`, and their figure components, SQL and complete scene step text. A scoped diff against that commit was empty. Read `src/reference-articles/sequences.astro`, `indexes.astro` and `storage.astro` in full, including their figures through rendered figure text and source where needed. Read the root and transactions plans in `docs/coverage/relational-2026-10-19.yaml`, and the parent, sibling and child outlines in `docs/article-work/relational-writing-2026-10-19/registry.json` (a00–a08, a18 and a19). Applied `.agents/skills/staycurrent-review/SKILL.md` and its teaching perspective, supplied as version `005ab6f`. Commission: take an intelligent newcomer towards expert practice with minimum reader time and effort; regenerate two planned articles as a skill trial without publication. Withheld: writer notes, the example record, trial brief/run record, earlier versions, earlier reports, decisions, results and other perspectives.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | finding | a00's complete transaction introduces a positional insert against a schema the reader has not seen in full: teaching-1. Otherwise the conceptual terms have useful first explanations. |
| 2. Order | pass | Facts and keys precede querying; the unsafe race precedes its repair; a03 establishes one-row protection before snapshots, locks and the multirow counterexample. |
| 3. Examples | pass | The shop carries both pieces. Duplicate clicks, insufficient capacity, stale writes, instructor write skew and uncertain completion reach the awkward cases rather than stopping at success. |
| 4. Showing | finding | The changing snapshots and the snapshot retained across a lock wait remain for the reader to reconstruct: teaching-2. The join fan-out, stock race, atomicity and instructor figures provide concrete support elsewhere. |
| 5. Judgement | pass | a00 supports a conditional shortlist and next question; a03 distinguishes constraints, conditional changes, coordination and serialisable retries, with all-writer and engine assumptions. The local comprehension gap in teaching-2 should be repaired. |
| 6. Gradual exposure | pass | The root supplies an initial answer before handing schema, SQL, concurrency, integration, performance and recovery depth on. a03 gives the multirow serialisable repair before linking to the fuller locking and isolation work. |
| 7. Placement of additions | not applicable | The coordinator named no repair additions for this version. |

## Findings

### teaching-1 · medium · a00, “Reserve the last mug”, complete order transaction (`a00.astro:69–70`; `a00/model.mjs:60–62`)

Problem: The listing says `INSERT INTO orders VALUES (103, 1, '2026-10-20 10:15+00', 'pending')`, without naming its columns. The reader's only displayed `orders` table has three columns: `order_id`, `customer_id` and `status`. The figure caption says dates are omitted, but neither that caption nor the listing supplies the missing column's name and position. The order-line insert likewise relies on remembering a table's column order. This arrives as Mina's “complete database path”, after the parent has explained query clauses but before it has taught positional insertion.

Effect: A newcomer must reconstruct an undisplayed schema to relate the statement to the rows already shown. The fourth value looks like a mismatch with the table they have just learned to read, interrupting the otherwise concrete path from stock change to recorded ownership.

Suggestion: Give both inserts explicit column lists, including `placed_at` for the order, so each value visibly names the fact it records. This keeps the complete transaction intelligible without adding a schema tutorial to the introduction.

### teaching-2 · medium · a03, “A view is not ownership” and “Lock the fact on which every writer can meet” (`a03.astro:76–84`)

Problem: The section introduces successive Read Committed snapshots, a transaction-wide Repeatable Read snapshot, ordinary reads continuing beside a writer, and a count that can remain stale after a locking command waits. Its report example is narrated once; the coordination example then changes the representation to a counted set and gives the separate-next-command rule in prose. No figure or worked schedule records which command took which snapshot, which count it sees, or what changes while the command waits. The three figures cover atomicity, same-row conditional updates and instructor write skew; their complete step text does not supply this missing comparison. The native-results table reports the coordination outcome but does not show its causal sequence.

Effect: At the point where a snapshot must become a usable mental model, the reader has to animate the reader, competing writer, committed reservations and lock wait themselves. In particular, they can repeat “use a fresh next command” without being able to explain why acquiring the lock did not refresh a count taken by the same command. That is the subtle distinction needed to assess the proposed protection.

Suggestion: Use a compact worked history with explicit snapshot/observed-count columns. Start from the class and reservation rows already introduced, show the writer committing while the other command waits, then contrast the retained count with the next command's fresh count. A small preceding or shared comparison can show which of the report's two reads refreshes under Read Committed and which stays on the original view under Repeatable Read. Leave the complete counted-reservation protocol and lock-mode details with the locking child.

## Limits

This is an independent teaching review, not a native-engine reproduction or a visual/accessibility audit. I read the three references in full and inspected all their rendered figure text, but did not exhaustively play every reference control combination. For the reviewed pieces I read all model steps and SQL, and checked rendered text; I did not run the downloadable worksheet or validate its recorded outcomes. Browser work stayed in background panes, with no visibility option after the subagent rejected that option. Both temporary panes were closed. No server or database process was started, and no article was edited, committed or pushed.

Review started: 2026-10-21 19:24:15 UTC.
Review ended: 2026-10-21 19:29:02 UTC.
Duration: 00:04:47 (287 seconds).
