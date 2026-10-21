# Teaching review · article · relational trial 3 introduction and transactions · initial 80276a4

Started: 2026-10-21 20:37:28 UTC. Finished: 2026-10-21 20:42:00 UTC.

Inputs read: frozen archive `/private/tmp/staycurrent-skills-night-a`; its baseline review skill and seven-check teaching perspective; both complete rendered target articles, all figure descriptions and SQL disclosures; all steps and both options of the introduction's race and the transaction article's three figures; Sequence diagrams, Indexes, and Storage and durability in full, including rendered figure text; commission, parent/sibling ownership briefs and the transaction subtree in `docs/coverage/relational-2026-10-19.yaml`; README and site direction. Read the transaction worksheet source to check whether the testing explanation was supplied there. Prior versions, earlier reports, decisions, proposals and overnight work were withheld. An unnecessary initial routing read opened the historical general review skill; the coordinator clarified that it was not the baseline, and it was not used as the review rubric.

Highest severity: medium. No critical teaching finding. The introduction meets its compact mental-model and next-question outcome. The transaction article teaches the principal protections well, with two local gaps in transferring that understanding to new schedules.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Tables, keys, result grain, transaction boundaries, snapshots and the named protections receive explanations before consequential use. The class-booking variation is introduced explicitly. |
| 2. Order | finding | The single-row repair precedes its visibility model, and write skew precedes its repair; the subtle post-lock snapshot rule needs more help at its point of introduction (teaching-1). |
| 3. Examples | pass | The shop carries the introduction; classes carry transactions. Duplicate clicks, lost updates, absent-row protection, write skew, aborts and uncertain replies supply consequential awkward cases. |
| 4. Showing | finding | Joined rows and booking/instructor state changes are shown. The coordination-row timing and deterministic observer/release method still require the reader to construct their own histories (teaching-1–2). |
| 5. Judgement | finding | The reader can distinguish atomicity from isolation and justify conditional changes, uniqueness and serialisable restart. Designing an independently controlled concurrency test needs a small demonstrated example (teaching-2). |
| 6. Gradual exposure | pass | The root answers its broad questions before handing off depth. Transactions keeps complete serialisable decision/restart reasoning and hands detailed locks, request recovery and external delivery to their owners. |
| 7. Placement of additions | not applicable | No repair additions were identified to this initial-version reviewer. The whole pieces were still assessed for placement. |

## Findings

### teaching-1 · medium · transactions · “Lock the fact on which every writer can meet”

Problem: The paragraph moves from the concrete R7/R13/R14 overbooking to the crucial instruction to lock the class row and count in a **separate next command**. It says a combined locking/counting command can retain a count from before the wait, but neither a schedule nor a worked result shows that distinction. The three interactive figures do not cover this case, and the worksheet result table reports only the successful fresh-command outcome.

Effect: A newcomer must supply the hardest timing relationship: which transaction took its snapshot before waiting, which reservation committed during that wait, and why owning the class row afterwards does not refresh an already established read. They can repeat the prescribed order without being able to explain why merging the commands changes the argument. This matters because the paragraph offers a specific protection protocol, rather than merely naming its child.

Suggestion: Show a compact two-session history with the waiting command's snapshot, the first holder's insertion and commit, then the second holder's separate count and refusal. Contrast the stale count with the fresh count using the same rows; a short static table is sufficient. The full counted-reservation recipe and lock catalogue can remain in the child. Repair outcome: the reader can explain the separate-command requirement and predict what changes if the first holder rolls back.

### teaching-2 · medium · transactions · “Test the schedule that could break the rule”

Problem: The section gives a good testing checklist, a bundle-running command and observed outcomes, but never walks through one observer-controlled execution. “Pause both sessions” and “use an independent observer to establish a real server lock wait before releasing its holder” leave the concrete sequence to the reader. The downloadable Python contains the needed three connections, asynchronous submission, `pg_stat_activity` polling and assertions, but obtaining the teaching requires reverse-engineering that harness.

Effect: Running the supplied suite is supported; the commissioned ability to **design a deterministic concurrency test** is less well supported. A newcomer must work out which connection stays blocked, how another connection can inspect it, what evidence permits releasing the holder, and which result would expose a test that accidentally ran serially. The final outcomes alone cannot teach that distinction.

Suggestion: Explain one small A/B/observer transcript for the already familiar conditional booking: A changes without committing; B submits and blocks; the observer verifies B's lock wait; A commits; B returns no reservation; an independent final query checks the invariant. Mark the barriers and expected observations. Reuse the existing SQL and link the remaining cases to the bundle. Repair outcome: the reader can adapt the method to an altered reservation rule and explain why a sleep or an ordinary sequential pass is weaker evidence.

## Coverage and limits

The root's four figures, transaction figures' full text and options, fixture disclosure, code listings, evidence tables and end matter were included. The tested figure controls advanced through the displayed states; no interactive behaviour was inferred from source. In particular, the instructor figure shows the rejected commit and the fresh count of one, so its restart lesson is a strength, not a request for another anomaly example. The introduction's preaggregated join repair also gives enough structure to predict multiplication with a third payment.

These are local material gaps, not requests for more terminology, more engine coverage, more failure scenarios, a complete locking tutorial or a request-idempotency implementation. Extra exercises would be optional. No separate low-severity finding is needed.

This was a teaching review, not a fresh primary-source correctness audit, a visual/accessibility certification, or a native-engine rerun. Linked articles were not exhaustively reviewed. Reference figures were read as rendered text and explanations, not exhaustively operated. The supplied archive has no Git metadata, so the version identity relies on the coordinator's frozen archive assignment. No article edits, builds, commits or pushes were performed.
