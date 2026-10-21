# Teaching review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · b5586b8

Inputs read: `src/articles/relational-trial-2/a00.astro` and `a03.astro`, with their component folders (`src/components/relational-trial-2/a00/`, `a03/`), read in source and on the rendered pages `/review/relational-trial-2/` and `/review/relational-trial-2/transactions/` (dev server on port 4522, figures stepped and screenshotted in headless Chromium at 1100 px and 1440 px, step text read from each figure's text alternative); the three reference articles in full, including their figure captions and text (`src/reference-articles/sequences.astro`, `indexes.astro`, `storage.astro`); the root plan and section briefs and a03's nested plan with its children a18 and a19 in `docs/coverage/relational-fanout-2026-10-19.yaml`; the transactions branch of `docs/coverage/relational-2026-10-19.yaml`; `docs/article-work/relational-writing-2026-10-19/registry.json`; `docs/article-work/relational-writing-2026-10-19/commission.md`.
Withheld and not opened: the writers' work records; `src/articles/relational-next/a00.astro`, `a03.astro` and their component folders; everything under `src/articles/relational-trial/`, `src/components/relational-trial/`, `docs/article-work/relational-skill-trial-2026-10-20/` and `docs/article-work/relational-introduction-review-2026-10-20/`; every other review report, including the `editorial.md` already in this folder.
Verdict: repairs required (a00: repairs required; a03: repairs required)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point, a00 | pass | Table, row, keys, constraint, SQLSTATE, NULL, transaction, session, lock, isolation, driver, pool, page, plan, index, replica and backup are each explained at or before first use; the one forward reference (`BEGIN` in the SQL section) says where it is explained. |
| 2. Order, a00 | finding | The sequence builds well and the race gets the most help, but the paragraph that explains the race gives a cause the figure contradicts (teaching-1). |
| 3. Examples, a00 | pass | One shop and one order carry every section, and reach the awkward cases: the fan-out report, the over-broad cancellation, the oversold mug, the reply lost after `COMMIT`, the failed one-step migration and the committed mistaken delete. |
| 4. Showing, a00 | finding | Six figures cover every changing-state idea, but Figure 3 never shows the query it says looks reasonable (teaching-2), and the plan output in the physical-work section is not read for the reader (teaching-3). |
| 5. Judgement, a00 | pass | The requirement-to-evidence table, the "database does / you still decide" table and the route table leave the reader able to choose a next step and know which engine differences to test. |
| 6. Gradual exposure, a00 | pass | Every section gives a usable answer, then names the child and the exact sections that take it further; the entrance box sends task readers to the right section first. Its Figure 4 already carries much of a03's first race (see teaching-7). |
| 7. Placement of additions, a00 | not applicable | First round. |
| 1. Starting point, a03 | finding | Invariant, autocommit, savepoint, ACID, history, serial order, snapshot, write skew, guard row and MVCC are explained well; locks, waiting, sessions and error codes are used before a03 explains them, with no pointer for a reader who enters here (teaching-8). |
| 2. Order, a03 | pass | Rule first, then boundary, constraints, the race, the protections, the contract behind them, aborts, durability and a test procedure; each step uses what the one before established. |
| 3. Examples, a03 | finding | The classes example is concrete, tied back to the shop, and reaches the hard cases; but the counting variation changes the data and reuses request R11 for a different customer (teaching-4). |
| 4. Showing, a03 | finding | Figures 1 to 4 show the double click, the lost update and its repairs, write skew with four repairs, and the lost reply, each replaying a recorded run. The counting variation (teaching-4) and the deadlock (teaching-6) are told only. Visual note: in Figures 1, 2 and 4 the `classes` table overflows its column and the `remaining` column is cut off at the right edge at desktop width; the rule box still states it. |
| 5. Judgement, a03 | pass | The rule-shape table, the engine contract cards, the outcome table and the closing checklist let the reader choose a protection and an abort response, and say when to recheck. The anomaly table's "Phantom" row can mislead that choice (teaching-5). |
| 6. Gradual exposure, a03 | finding | Hands locking protocols, isolation testing, request recovery, outbox delivery and hot rows to their owners at the point each question arises. It re-runs the parent's race instead of building on it (teaching-7). |
| 7. Placement of additions, a03 | not applicable | First round. |

## First reading

Not applicable: teaching perspective.

## Findings

### teaching-1 · required · a00, "Transactions and competing buyers", the paragraph after Figure 4 that begins "The race turns on isolation"

Problem: The paragraph explains the oversold mug as a visibility problem: "Tariq's read could not see Mina's uncommitted change, so it saw 1." In Figure 4's *Read, then write* schedule, Tariq reads at step 3, before Mina has written anything at step 4, so there was no change to see, committed or not. The paragraph just before it gives the right cause ("It lived in the gap between the application's read and its write"); this one replaces it with a different one at the hardest point of the article.
Effect: A newcomer builds the model "the race happened because Tariq could not see Mina's work", which suggests that more visibility would fix it. The next paragraph then shows Repeatable Read, which sees even less, fixing it, and the reader is left with two explanations that contradict each other. a03 later depends on the right model (the gap between read and write, and conflict detection at the write).
Suggestion: Keep isolation's definition, but say what it decided in this schedule: Read Committed lets Tariq's write go ahead on a row that changed after he read it, while Repeatable Read refuses that write. Tie the sentence to the figure's step order.

### teaching-2 · optional · a00, "Ask for a result, then check what it means", Figure 3 and the paragraph and listing after it

Problem: The prose says "Figure 3 shows two queries that both look reasonable", but neither the figure nor the article shows the first query's SQL; the reader sees only the row flow and the corrected query. The corrected listing uses `WITH`, `GROUP BY` and `sum`, which the article never names, although the section's plan asks for a walk through aggregation.
Effect: The habit the section teaches is recognising a join-then-sum shape in your own SQL. Without the wrong query beside the right one, the reader must take "looks reasonable" on trust and cannot match the shape to code they would write.
Suggestion: Show the join-then-sum query, in the figure or as a listing before it, and say in a sentence what `GROUP BY` and the `WITH` parts of the corrected query do.

### teaching-3 · optional · a00, "Correct SQL still has to do physical work", the two plan outputs and the measurement table

Problem: The plans are printed raw. The second contains `Bitmap Heap Scan`, `Bitmap Index Scan` and `Recheck Cond`, none of which is explained, while the table below calls the same run "Index scan, 6 pages". The reader is not told that `Buffers: shared hit` counts pages, or why the prose says 1,268 pages in one sentence and 1,271 in the next.
Effect: A newcomer can follow the headline (1,271 pages became 6) but cannot read the evidence that supports it, and the mismatch between the plan and the table invites doubt about which is right. The Indexes reference shows the alternative: it tells the reader to read from the most indented line outwards and names the four parts that matter.
Suggestion: Add a sentence on how to read the two plans (innermost line first, `Buffers` as pages touched, the sort's three pages in the total), and either name the bitmap scan or leave its detail to the performance child while making the table use the same name.

### teaching-4 · required · a03, "Coordinate decisions that span several rows", the paragraph beginning "Locking the rows you counted is not the same thing"

Problem: This paragraph carries the section's key comparison, why locking the rows you counted fails where a guard row works, and it is told in four dense sentences about a two-session run. It also changes the data: class 22 now has two places, `remaining` is not used, and R11 is now Edda's request, when Figure 1 and the constraint section made R10 and R11 Mina's double click. The reader has to hold who locked which row, who waited on R7, what Edda's statement returned after Mina's commit and why, with no figure or table, in a variation that contradicts what they already know about R11.
Effect: The plan asks this section to make the coverage argument concrete before handing lock design to a18. As written, a reader can accept "Row locks protect rows that exist. They do not stop new ones appearing" only as an assertion, which is exactly the mechanism a03 says decides between the guard row, locking counted rows and Serializable.
Suggestion: Show this run in the article's own schedule form (a Figure 3-style option, or a small two-lane table with the rows after each step), and give the variation request IDs and data that do not collide with Figure 1's.

### teaching-5 · optional · a03, "Understand the isolation contract behind the choice", the anomaly table's "Phantom" row

Problem: Every other row in the table points to a figure; "Phantom" is defined as rerunning a query and seeing new rows, and is marked "No" at Repeatable Read. The article's one new-row failure, the counting variation, is a different thing: two transactions each insert after counting, which Repeatable Read does not stop. The article never says which row of the table that case belongs to.
Effect: A reader choosing a protection from this table can conclude that Repeatable Read stops new rows breaking a count rule, the opposite of what the counting variation showed.
Suggestion: Tie the counting variation to the "Write skew" row (two decisions from the same rows, here by inserting new ones), and say that "Phantom: No" means a reread is stable, not that new rows cannot break a rule.

### teaching-6 · optional · a03, "An aborted transaction must be reconsidered as a whole", the deadlock paragraphs

Problem: The deadlock and its fix by lock order are described in prose: which move holds which class, which waits, and how a fixed order turns the cycle into a queue. The worksheet ran both moves, and the article already has a schedule figure that shows waiting.
Effect: The reader must picture two transactions, two class rows and a cycle of waits, then the same pair with the cycle gone. It is manageable, but it is the one abort in this section the reader does not get to watch, and the fix ("lock in ascending order") is easier to trust once the reader has seen the cycle form.
Suggestion: Add the two moves as options of a schedule figure (opposite order, then ascending order), or a two-lane table of the recorded steps, keeping the full protocol with a18 as now.

### teaching-7 · optional · a03, "Two correct-looking transactions can make an incorrect result" and Figure 2 (with a00 Figure 4)

Problem: a00's Figure 4 already runs read-then-write, the conditional update and Repeatable Read as two sessions, with the wait, the recheck and the 40001 retry. a03's Figure 2 runs the same three options again on class 21, adding only "Subtract one, no condition", and asks the reader to predict an outcome they saw in the introduction. Apart from a link in the opening, the section does not acknowledge what the reader already knows or say what this version adds.
Effect: A reader on the recommended route meets the same race twice in near-identical form, and the prediction prompt loses its point. A task entrant gains from the repetition; a sequential reader spends time relearning it.
Suggestion: Open the section by naming what the shop race showed and what the class version adds (the unconditioned subtract, the reservation insert, the rule check), so the figure reads as the next step; or let the parent keep only the first two options and leave Repeatable Read to a03.

### teaching-8 · optional · a03, opening and first two figures

Problem: a03 uses "session", row locks and waiting (Figure 1's caption, Figure 2's steps, "an update that reaches a row another transaction has changed waits") before it explains locks, which happens in "Coordinate decisions that span several rows" and fully in "Versions and locks answer different questions". Error codes appear in Figure 1 (23505) before the parenthesis that says what they are. The opening links to the introduction's race but does not say that it assumes that section.
Effect: A reader coming from a00 is fine. A reader who enters a03 directly for a task, as the root brief expects some will, meets waiting and codes as unexplained behaviour in the first two figures.
Suggestion: Say in the opening which section of the introduction this article assumes, or give locks and waiting one sentence before Figure 1, and move the error-code parenthesis to the first code's appearance.

## Limits

- The figures were read from their step text and from screenshots of selected steps in headless Chromium at 1100 px and 1440 px; not every step of every option was played visually, and no phone-width or dark-theme check was made. The clipped `remaining` column noted under check 4 is the visual reviewer's ground and is not filed as a teaching finding.
- Technical claims were judged only for how they shape the reader's model (teaching-1, teaching-5), not checked against PostgreSQL, MySQL or SQLite sources or rerun; that is the practitioner review's ground.
- Child articles a18 and a19 and the other sibling articles are planned, not written, so gradual exposure was judged against their plans in the fan-out tree.
