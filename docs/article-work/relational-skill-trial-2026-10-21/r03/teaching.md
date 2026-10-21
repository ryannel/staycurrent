# Teaching review · article · a00 "Relational databases" and a03 "Making concurrent changes correct" · 6ca25b8

Inputs read: `src/articles/relational-trial-2/a00.astro` and `a03.astro` in full; their component folders (`src/components/relational-trial-2/a00/` scenes, render, model strings and `ShopFigure.astro`; `a03/ScheduleFigure.astro`, the model's schedules and visibility cards, and the overlapping-click checks in `verify.mjs`); both rendered pages at `/review/relational-trial-2/` and `/review/relational-trial-2/transactions/` on `pnpm astro dev --port 4562`, with every figure's text alternative read from the built page and Figures 1, 3, 4 and 5 (a00) and 2, 3 and 5 (a03) stepped and screenshotted mid-play in headless Chromium; the three reference articles (`src/reference-articles/sequences.astro`, `indexes.astro`, `storage.astro`) in full, with the storage StepFigure layout read and Figures 5 (Storage), 3 (Indexes) and 2 (Sequences) rendered on the reference preview; the parent, sibling and child plans in `docs/coverage/relational-2026-10-19.yaml` and `docs/coverage/relational-fanout-2026-10-19.yaml` (a00's section briefs, the a03 plan with its a18 and a19 children, and the a04, a05 and a06 headings that own neighbouring material); `docs/article-work/relational-writing-2026-10-19/registry.json`; `docs/article-work/relational-writing-2026-10-19/commission.md`.
Withheld and not opened: the writers' work records, every review report and decision (including r01 and r02), the trial brief and the `a00/` and `a03/` work folders under `relational-skill-trial-2026-10-21/`, git history and diffs of these articles, `src/articles/relational-next/` a00 and a03 and their component folders, and everything under `src/articles/relational-trial/`, `src/components/relational-trial/`, `docs/article-work/relational-skill-trial-2026-10-20/` and `docs/article-work/relational-introduction-review-2026-10-20/`.

Verdict: a00 pass · a03 repairs required

## Checks

### a00 · Relational databases

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Every term is explained at first use, from SQLSTATE and NULL through session, lock, isolation level, plan, heap, ACCESS EXCLUSIVE lock, base backup and RPO. |
| 2. Order | pass | Each section builds on the one before; the race (Figure 4) and the lost reply (Figure 5), the two hardest ideas, get stepped figures and the most prose. |
| 3. Examples | pass | Mina's order 103 and the last blue mug carry every section, and each reaches its awkward case: the over-matching cancel, the oversell, the reply lost after COMMIT, the refused required column, the committed delete. |
| 4. Showing | pass | Changing state is shown in stepped figures and the staged-change table; the lock queue after the table is told in prose, adequately for an introduction (see teaching-18). |
| 5. Judgement | pass | The requirements-to-evidence table and the "database does / you still decide" table leave the reader able to name the contract and choose the next question. |
| 6. Gradual exposure | pass | Each section gives a usable answer and names its child at the point of need; the reading route matches the plan. |
| 7. Placement of additions | pass | All six named additions belong here and sit where the reader needs them; two could be sharpened (teaching-18, teaching-19). |

### a03 · Making concurrent changes correct

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass, one optional finding | Terms are introduced as they arrive; `BEGIN`, `COMMIT` and `ROLLBACK` are defined only after Figure 1 has used them (teaching-20). |
| 2. Order | pass | Invariants, then lost update, then write skew, then protections, then contracts, then aborts and lost replies; Figure 3 is introduced early and revisited as each repair arrives. |
| 3. Examples | pass | Classes 21 and 22 carry the whole article, including the rollback prediction, the deadlocking swap and the in-flight COMMIT. |
| 4. Showing | finding | Every hard history is shown by a recorded schedule, but the overlapping double-click is described for a statement order that Figure 1 does not use (teaching-17). |
| 5. Judgement | pass | The shape-of-the-rule table, the outcome table and the written-argument checklist leave the reader able to pick and test a protection. |
| 6. Gradual exposure | pass | Lock protocols, isolation testing, request recovery and the outbox are handed to a18, a19, a22 and a23 at the point they come up. |
| 7. Placement of additions | finding | Three of the four additions belong and sit well; the overlapping-clicks sentence belongs in the constraints section but is attached to Figure 1 in a way that contradicts Figure 5's lesson (teaching-17). |

### Placement of each named addition

**a00**

- *Experiment set-up before the first plan, and the two paragraphs on reading a plan* (Indexes and the work behind a query). They belong: a00's brief for this section asks it to introduce plans, estimates and measured execution as evidence, and a05 and a26 take the diagnosis further. They sit exactly where the reader first meets a plan: the set-up says what was measured, the first paragraph walks the plan's lines in the order they run, and the second explains the two row counts and the planner's statistics. The note that the plans are edited and relabelled ("estimated rows") is honest and lands before the reader would try to match a real plan.
- *Sentence after Figure 5 handing the unfinished-attempt case to a03.* It belongs: a00 owns the difference between an error and an unknown outcome, and a03's lost-reply section owns the mechanism. It sits where the reader concludes "not found means failed", which is the moment the qualification is needed. See teaching-19 for one clause that would turn it into a complete high-level answer.
- *Paragraph on the locks a schema change takes, after the stage table.* It belongs: the table itself says stages 1 and 5 hold a lock on the whole table, so the reader needs to know what that lock blocks, and the queueing behind a long report is the practical hazard an expert must know before running any stage. The procedure for keeping the locks short stays with Changing a live database, which the section links. It sits in the argument, directly after the table it explains; it does put stages 1 and 5 before the backfill paragraph about stage 3, which reads acceptably. See teaching-18 on one sentence.
- *Paragraph on undoing each stage.* It belongs: the plan asks this section to distinguish reversing a schema edit from recovering lost data, and this paragraph is where that happens. It closes the section in the right place.
- *Sentence naming the costs of a distributed database.* It belongs: the plan asks a00 to send readers to CockroachDB only once a distributed requirement survives comparison with a simpler service, and naming the costs is what makes that comparison possible. It sits inside the disqualifying-limits paragraph where the option is raised.
- *Step explanations of Figures 1, 3, 4 and 5, above their controls.* The board, then the step's title and explanation, then Play, Back and Next now read in the same order as the reference StepFigure (Storage Figure 5 checked). At 1280 px the board, explanation and controls of Figure 1's fullest step fit in about 900 px, so the reader can see the change and read why it happened without scrolling.

**a03**

- *Paragraph in "Rules that span several rows" on why the guard row depends on Read Committed.* It belongs: the protocol is one a03 hands the reader to use, and its safety condition is part of that answer, as the conditional update's three assumptions are. Repeatable Read, snapshots and 40001 have all been taught by this point. It sits directly after the listing whose comment it explains. The last sentence (make the first statement an `UPDATE` at Repeatable Read) reaches towards a18's "Give the invariant a stable coordination row", but one sentence of high-level answer is proportionate.
- *Sentence in the lost-reply section on an abandoned first attempt and server time limits.* It belongs: it is the direct cost of the record-first repair just shown, since the repeat now waits, and it names the server settings without explaining them, leaving what each timeout limits to Recovering database requests safely, which the next paragraph links. It sits in the argument as the first of the "two limits".
- *Figure 1's caption that each request has its own session.* It belongs and is placed well: it states the figure's modelling assumption where the figure is described.
- *Sentence in the constraints section on overlapping clicks.* The subject belongs here, because the constraints section is where insert races are settled and Figure 5 later relies on the wait it describes. But the passage is tied to Figure 1's booking, which takes the place before inserting, and with that order the second click never reaches its insert while the first is open. See teaching-17.
- *Text before Figure 5 on which options take the place first.* It belongs and is needed exactly there: the listing just before has taught the record-first order, so without this sentence a reader would assume Figure 5's first two options use it. The caption repeats it, which helps a reader who comes to the figure by scrolling.

## Findings

### teaching-17 · required · a03, "Constraints", the paragraph beginning "A constraint also settles races between inserts"

Problem: The passage says that in Figure 1 "two quick clicks can overlap", then supposes that R10 has inserted Mina's booking and not committed "when R11 tries to insert the same pair", so R11 waits on the key. But Figure 1's booking takes a place in class 22 first and inserts second. With that order, R11's first statement, the update of class 22, waits on R10's lock on the class row, and R11 never reaches its insert while R10 is open. When R10 commits, R11 takes a place, then its insert fails with 23505 and the transaction rolls back. The verification script records exactly this ("The second waits on class 22's row, then its insert is refused") and checks the insert-first case separately. The article then builds on the passage: Figure 5's text says the repeat's insert of R8 waits "just as R11 waited for R10 in the section on constraints".
Effect: The end result the passage states (R11 fails with 23505) is right, but the history behind it is wrong for the article's own example. Figure 5's whole lesson is that the order of the statements decides where the second attempt waits: take-first waits at class 21's row and gets the wrong answer, record-first waits at the key and gets the right one. A reader who has absorbed the constraints passage has been told the take-first double-click waits at the key, which contradicts Figure 5. Either they miss the contradiction and carry a wrong model of where waits happen, or they notice it and have to work out which account is right. Reading histories correctly is the skill this article exists to teach.
Suggestion: Keep the insert-race explanation in this section, but attach it to a booking that inserts first, for example "if the booking recorded the request before taking a place, as the listing below does", or describe what Figure 1's order actually does: R11 waits at class 22's row, then takes a place, then its insert is refused. Then make Figure 5's "just as R11 waited for R10" point to whichever case is described. This passage is also where a03 first defines a row lock and a wait, which Figure 2 then depends on, so whatever repair is made should keep those definitions ahead of Figure 2.

### teaching-18 · optional · a00, "Changing a live database", the paragraph after the stage table

Problem: The paragraph says correctly that every read and write arriving behind the waiting `ALTER TABLE` queues behind it. It then summarises the observed run as "both the column change and a later lookup of order 103 waited for the report."
Effect: The surprising point is lost in the summary. A plain lookup would never wait for the report on its own, since both only read, and it waited only because it was queued behind the column change. Read quickly, "waited for the report" suggests that readers wait for readers, which contradicts what the transactions section said.
Suggestion: Say in the run sentence that the lookup, which would not have waited for the report alone, queued behind the column change.

### teaching-19 · optional · a00, "From a request to a committed order", the paragraph after Figure 5

Problem: The added sentence tells the reader that "not there" is not quite proof of failure, and that the transactions article shows how a repeat that starts by inserting the same order number waits for an unfinished attempt. It does not point out that the listing just above already starts by inserting order 103.
Effect: The reader is left unsure whether a00's recovery (look up 103, and if it is absent repeat with the same number) is safe. The reassurance is there to be found, but the reader has to connect the listing's first statement with a description of another article.
Suggestion: Add a clause saying that order 103's transaction already begins with that insert, so the repeat with the same number is the safe one, and keep the link for the mechanism.

### teaching-20 · optional · a03, "Transactions, autocommit and ACID"

Problem: Figure 1's second option and the paragraph after it use `BEGIN`, a failed transaction and a `COMMIT` reported as `ROLLBACK`. The paragraph that defines the three commands ("The three commands are short") comes after them.
Effect: The article invites readers to start here. Such a reader meets the commands in a figure before the paragraph that defines them. The "In short" opening defines a transaction, so they can follow the figure, but they have to infer what `COMMIT` and `ROLLBACK` do.
Suggestion: Move the two-sentence definition of the three commands ahead of Figure 1, next to the autocommit paragraph that first mentions `BEGIN`.

## Limits

- Links from both pages point to `/review/relational-next/…`, whose a00, a03 and child articles are withheld or unwritten, so I could not follow any hand-off to its target section. I judged hand-offs against the plans only. Whether the trial pages should link to the trial route is a route-integration question for the coordinator.
- I read the text alternative of every figure option from the built page and stepped seven option paths in headless Chromium at 1280 px. I did not play every step of every option, and did not check narrow widths or dark mode, which belong to the visual review.
- I checked the technical claims inside the additions only where they bear on teaching (teaching-17 against the verification script's own checks). I did not run either verification script. Correctness is the practitioner review's ground.
