# Teaching review · article · a00 Relational databases and a03 Making concurrent changes correct (trial 2) · a6e6a33

Inputs read: `src/articles/relational-trial-2/a00.astro` and `a03.astro` in full, with their component folders (`src/components/relational-trial-2/a00/`, `a03/`), and both pages rendered at `/review/relational-trial-2/` and `/review/relational-trial-2/transactions/` on a local dev server, with figures stepped in headless Chromium (a00 Figures 3, 4, 5 and 6; a03 Figures 4 and 5 and both card grids; every other figure read from its step text). The three reference articles in `src/reference-articles/` in full, with one reference figure (Storage Figure 8) rendered for calibration. The parent, sibling and child plans in `docs/coverage/relational-2026-10-19.yaml`, `docs/coverage/relational-fanout-2026-10-19.yaml` and `docs/article-work/relational-writing-2026-10-19/registry.json` (a00, a02, a03, a04, a05, a06, a08, a18, a19, a22). The commission, `docs/article-work/relational-writing-2026-10-19/commission.md`, and the trial brief.
Withheld and not opened: the writers' work records, every review report and decision including `r01/`, git history and diffs of these articles, `src/articles/relational-next/` a00 and a03 and their components, everything under `relational-trial/`, and the two 2026-10-20 work folders.

Verdict: repairs required (a00); pass (a03)

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | a00: finding (optional); a03: finding (optional) | a00 uses “serializably” and names bitmap scans before either is introduced (teaching-10, teaching-11). a03 introduces waits through R10 and R11 overlapping, which Figure 1 drew as one session (teaching-14). Otherwise every term is explained at first use in both pieces. |
| 2. Order | a00: pass; a03: finding (optional) | a00 builds each section on the one before, and its hardest sections (the race, the lost reply, recovery) each get a figure. In a03 an InnoDB aside sits between the outcomes table and the deadlock it refers to (teaching-16). |
| 3. Examples | a00: pass; a03: pass | The shop and order 103 carry a00 through the awkward cases: the missing order in the report, the wrong cancellation, the oversold mug, the lost reply and the committed delete. a03's class bookings reach lost update, write skew, deadlock and the in-flight commit. |
| 4. Showing | a00: finding (required); a03: pass | a00 asks the reader to picture a first attempt still running after its connection broke, a repeat waiting on its key and a late commit, with no figure (teaching-9). a03 shows every changing state it relies on, including the same in-flight case. |
| 5. Judgement | a00: finding (optional); a03: pass | a00's closing tables let a newcomer state the contract and pick the next question; the distributed-database sentence names no cost to weigh (teaching-13). a03 ends with the protection table, the outcome table and the checklist, and says when the choice changes (engine, level, new writers). |
| 6. Gradual exposure | a00: finding (required, same as teaching-9); a03: pass | a00 gives high-level answers and hands on, except that the lost-reply passage teaches the child's full insert-first mechanism in compressed prose. a03 hands lock protocols, isolation testing and request recovery to a18, a19 and a22 at the points they arise. |
| 7. Placement of additions | a00: one finding (teaching-9), two optional (teaching-10, teaching-12); a03: pass, two optional (teaching-15, teaching-16) | Each addition is judged below. |

### Placement of each named addition

**a00**

- *Figure 3's steps showing dropped rows and the missing total; the explanations of sum, GROUP BY and WITH.* Belong here: the a00 plan asks for missing matches, nulls and a plausible wrong summary. The explanation of `sum` and `GROUP BY` comes before the figure, where the reader needs it to read either query. `WITH`, the left join and `coalesce` are explained at the step where each acts, and the struck-through 103 rows and the “missing, should be 29.00” check show the dropped order rather than describing it. The paragraph after the figure repeats the step text, which serves readers who did not step through it. In the argument; no finding.
- *The paragraph on engine defaults in “Transactions and competing buyers”.* Belongs: the a00 plan asks for engine and configuration differences to be explicit, and this paragraph gives concrete evidence for the sentence before it (the name alone does not tell you what your engine prevents). In the argument. One undefined word (teaching-10).
- *Figure 5 and the explanation of what a lookup after a lost reply can conclude.* Figure 5 and the first paragraph after it belong and sit where they are needed: an error and an unknown outcome look the same, and an identity chosen in advance lets the application look the order up. The second paragraph, on an attempt still running and the insert-first repeat, is the child's mechanism (a03's “A lost reply to COMMIT”, with its own Figure 5) taught here in prose without a figure (teaching-9).
- *How to read a plan.* Belongs (the plan asks for plans, estimates and measured execution as evidence), and it sits immediately after the first plan, where the reader needs it. The sentence introducing the plans names details the reader has not met yet (teaching-11).
- *The locks a schema change takes.* Belongs: it explains why the final stage can stall checkout, which the closing evidence table relies on (“timing every lock”). It is attached after the note about stage 3 rather than next to the stage 1 and 5 rows it explains (teaching-12).
- *When a distributed database is worth it.* Belongs (the plan asks for distribution only when its constraints matter) and sits in the argument, under disqualifying limits. It leaves the cost unnamed (teaching-13).

**a03**

- *The section on losing the reply to COMMIT, with its figure.* Belongs: the a03 plan owns “Losing the reply does not prove rollback”, and the primary-key wait is a database guarantee this article has already taught. It follows the section on retrying, which is where a reader asks when a repeat is safe, and it hands bounded waits and identity choice to a22. The figure shows every state, including the attempt still open on the server. One optional note on the prose (teaching-15).
- *The deadlock figure and its paragraphs.* Belong (the plan asks for a deadlock followed to rollback and consistent lock order), placed after the outcomes table and before retrying, which uses 40P01. The lanes' “holds locks on” lines show the cycle forming. No finding.
- *“Where the results come from”.* Belongs, following the reference articles' “Where the numbers come from”, and the introduction points to it. It also carries the evidence behind the in-flight claim and the load-test numbers that “Testing a protection” cites. No finding.
- *The anomaly and visibility cards.* Belong. The anomaly cards come after the reader has seen lost update and write skew, so they name what has been shown and add three short definitions. The visibility cards come straight after the paragraph on per-statement and per-transaction snapshots, and they show the state the reader would otherwise have to hold in their head. No finding.
- *The constraints section's introduction of waits and row locks.* Belongs and sits at the first point a wait matters, before Figure 2 needs it, and Figure 5 later refers back to it. One continuity wrinkle (teaching-14).
- *The order of the section on aborted transactions.* The intro, then the outcomes table, then the worked deadlock gives the reader an overview to come back to, and each row explains itself. The order works, apart from the InnoDB aside (teaching-16).

## Findings

### teaching-9 · required · a00, “From a request to a committed order”, the second paragraph after Figure 5

Problem: The paragraph teaches the in-flight case: a lookup finds nothing, yet the first attempt “could still be running”; a repeat “begins by claiming order 103’s primary key”, waits for that attempt, and fails with a duplicate key if it commits. Figure 5 never shows this. Its options are reply arrives, breaks before COMMIT (where the database rolls back) and breaks after COMMIT, so the only figure the reader has just played says that a break before COMMIT means rollback. The paragraph also relies on an insert waiting for another transaction's uncommitted key, but a00 only taught that a transaction waits to change a row another transaction has changed. How an attempt can still be running after its connection broke is not explained.
Effect: The newcomer has to imagine a sequence with four changing states across two attempts (open attempt, failed lookup, waiting repeat, late commit) on the strength of a rule they were never given. This is the hardest idea in the section and it gets the least help. A reader who cannot follow it is left with an instruction (insert the identity first) and no reason for it. a03 teaches the same mechanism properly, with a figure, so the root is spending its reader's effort on the child's subject without the child's means of showing it.
Suggestion: Keep the root's answer at the level the reader can see: look the order up by the identity chosen in advance, a missing row is not yet proof, and the repeat must meet the first attempt through that identity. Hand the in-flight mechanism to a03's “A lost reply to COMMIT” at this point. Alternatively, keep the mechanism and give Figure 5 an option that shows it, with a sentence before it saying that a second insert of the same key waits for the transaction holding it.

### teaching-10 · optional · a00, “Transactions and competing buyers”, the engine-defaults paragraph

Problem: “SQLite runs every transaction serializably” uses a term a00 never introduces. Stricter levels are mentioned but not named, and serial order is not explained.
Effect: The reader takes the meaning from “by letting only one writer in at a time”, which works, but the word reads as jargon in a paragraph otherwise written for a newcomer.
Suggestion: Say what SQLite does without the term (it avoids the race by letting one writer in at a time), or name the strictest level when “stricter levels” first comes up.

### teaching-11 · optional · a00, “Indexes and the work behind a query”, the sentence before the first plan

Problem: Before the reader has seen a plan, the sentence lists what was trimmed from it: “the sort’s method and its own page count, two detail lines of the bitmap scans, and the planning summary”. Bitmap scans are introduced two paragraphs later.
Effect: A newcomer meets an unexplained term while getting ready to read their first plan, and it is a disclosure they cannot use yet.
Suggestion: Move the list of trimmed details after the second plan or into a note under it, and keep only “trimmed for reading” before the first.

### teaching-12 · optional · a00, “Changing a live database”, the ACCESS EXCLUSIVE paragraph

Problem: The paragraph explains the lock notes in stages 1 and 5 of the table, but it comes after the paragraph about the stage 3 backfill. The reader goes back from stage 3 to stages 1 and 5, and the table rows already said part of it (“holding a lock on the whole table for a moment”).
Effect: The lock explanation reads as an aside, and the contrast with the earlier lesson that plain reads take no lock is left for the reader to draw.
Suggestion: Put it directly after the table, before the backfill note, and add half a sentence linking it to “Reading a row takes no such lock” from the transactions section.

### teaching-13 · optional · a00, “Choosing a database, and what to read next”, the distributed-database sentences

Problem: “It brings its own costs, so choose it only after comparing it with a simpler service” names no cost.
Effect: The reader learns when a distributed database is needed, but not what they would pay for it, so they cannot weigh the comparison the sentence asks for. The route table repeats only the requirement.
Suggestion: Name one or two costs a newcomer can picture, such as writes that wait for agreement between machines and a larger operating burden, and leave the rest to Choosing a relational database.

### teaching-14 · optional · a03, “Constraints”, the paragraph introducing waits and row locks

Problem: The wait is taught by supposing that R10 has inserted but not committed when R11 tries the same pair. Figure 1 drew R10 and R11 one after the other in a single lane, and its caption says “One session”, while the introduction says each request runs in its own session.
Effect: An attentive reader may wonder how R11 could run while R10 is still open if the two share a session, and has to settle that before taking in the new idea of waiting.
Suggestion: Say in a clause that the two clicks can arrive on separate sessions and overlap. Then make Figure 1's caption and lane agree with the introduction's one session per request.

### teaching-15 · optional · a03, “A lost reply to COMMIT”, the prose before and after Figure 5

Problem: The complete-booking section promised that Figure 5 would explain why the booking records R8 first. The figure's first two options use the opposite order, taking the place first, and only the caption says so. The prose asks the reader to play “Book again” and “Look up R8 first” without mentioning the change.
Effect: A reader who skips the caption sees the figure contradict the listing they were just given, and may take the first two options for the listing's behaviour.
Suggestion: Add a clause before “Play Book again” saying that the first two options use a booking that takes the place first, as many applications would.

### teaching-16 · optional · a03, “Aborts and deadlocks”, the InnoDB paragraph after the outcomes table

Problem: Between the outcomes table and the deadlock it introduces, a paragraph explains how much InnoDB undoes for a deadlock and for a lock-wait timeout. Deadlock is worked through only in the next paragraph.
Effect: The step from the overview to the worked case is interrupted by an engine detail about the case the reader is about to meet.
Suggestion: Move the paragraph after the deadlock and its listing, or next to the “Retrying a transaction” advice to send ROLLBACK, where its conclusion is used.

## Limits

- I played a00 Figures 3, 4, 5 and 6 and a03 Figures 4 and 5 in headless Chromium at 1280 px, and rendered both card grids. I read every other figure's steps from `scenes.mjs` and `model.mjs` and from the built page, as the skill allows. I did not check figures at phone width or in dark mode; that is the visual perspective's ground.
- Of the reference figures, I rendered only Storage Figure 8 and read the rest through the articles' prose and captions.
- I did not check technical claims against primary sources or rerun the verification scripts. Where a judgement depends on engine behaviour (for example, that a duplicate-key insert waits for an uncommitted insert of the same key), I relied on the article's own stated evidence.
- I judged scope against the fanout tree and registry the commission names. The older `relational-2026-10-19.yaml` root plan differs in places (it defers engine labels to the child), and I treated the fanout plan as governing.
