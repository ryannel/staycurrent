# Teaching review · article · a00 Relational databases · c01

Inputs read: the c01 piece as rendered (`c01-site/review/relational-next/index.html`, read as extracted page text), with its source `c01/article.astro` and figure components `c01/components/` (RowsFigure, OrderFigure, DecisionFigure, models.mjs, queries.mjs) for figure states and controls; the Sequence diagrams, Indexes and Storage and durability reference articles in full from `src/reference-articles/`, with a sample of their figure components (`storage/StepFigure.astro`, `indexes/ScanFigure.astro`, the `order` scene in `sequences/sequence-model.ts`); a00's brief, heading briefs and the a01–a08 child plans in `docs/article-work/relational-introduction-polish-2026-10-20/context.yaml` (a00 is the root, so there are no parent or sibling plans); the commission `docs/article-work/relational-fanout-2026-10-19/commission.md`. Withheld and not read: earlier review reports, repair records and writer notes (b01/, b02/, trial.md, writer.md, repairs.md), the `before/` directory and `manifest.json`.
Verdict: repairs required

## Checks

| Check | Result | Note |
| --- | --- | --- |
| Starting point | finding | Terms are mostly explained at first use. "Index" and "pages" appear in section 2, four sections before they are defined, and the first UPDATE uses `SET` and `RETURNING` without explanation (teaching-2, teaching-5). |
| Order | finding | The sections build in a sensible order, but the hardest idea, two buyers competing for the last mug, gets one paragraph of prose and no figure, while easier contrasts get figures (teaching-1). |
| Examples | finding | The shop carries the whole article and reaches the awkward cases: duplicate join rows, the empty order, a lost commit reply, an old writer and a mistaken deletion. The two-buyer race is only told (teaching-1), and the payment-failure thread opened in section 1 never reaches a concrete outcome (teaching-3). |
| Showing | finding | Six figures show changing state well, each with a prompt to predict or compare. The two-transaction interleaving is left for the reader to picture. The full transaction is never shown as SQL. Figure 3 stops before the retry it argues for (teaching-1, teaching-2, teaching-4). |
| Judgement | pass | The reader finishes able to frame relational fit as a selection brief with rejection tests, to name the evidence behind a slow query, a live change and a recovery choice, and to pick a reading route. Only the payment-recovery decision is left unnamed (teaching-3). |
| Gradual exposure | pass | Each section gives a usable answer before linking its child at the point of need. The parent-first reading contract is stated at the start and again at the end. The route table matches the brief's routes. |

## Findings

### teaching-1 · required · a00, "Transactions and competing buyers", from "Now Mina and Arun both try to buy the mug" to the Read Committed paragraph

Problem: The race between two buyers and its fix are carried in prose alone. The reader must keep two overlapping transactions in their head: each reads one mug, each computes zero in application memory, both write and both commit. They then have to follow the fix: the conditional update locks the row, the second updater waits, the condition is rechecked against the committed zero, no row is returned and the order is rolled back. Figure 2 explicitly excludes this case ("No payment call, elapsed time or competing transaction is simulated"). The brief names this as the example that must show why a transaction boundary alone does not settle concurrency.
Effect: The article's hardest idea gets the least visual help. Simpler contrasts, such as the scan against the index lookup and the schema rollout, each get a figure. A newcomer can come away thinking atomicity was enough, or accept the conditional update without seeing why waiting and rechecking prevents the second sale. The figures then teach a weaker lesson than the prose claims.
Repair: Add a compact two-session schedule, either as a stepped figure or a static table. Give it a lane for Mina's transaction, a lane for Arun's and a row for stored stock, with two variants:
- Read, then write the value computed in the application. Both read 1, both write 0, both commit, and two orders are accepted against one mug.
- The conditional `UPDATE … WHERE available >= 1`. Mina's update takes the row to 0. Arun's update waits for her commit, rechecks against 0 and returns no row, and his application rolls back order 104.

Label the schedule as illustrative. The sources note says the two-buyer conditional update was checked on PostgreSQL 18.6, so the second path's caption can state that. A "Competing buyer" option on Figure 2, or a two-lifeline drawing in the style of Sequences Figure 6, would fit. Leave comparisons between isolation levels to a03.

### teaching-2 · optional · a00, "Asking questions with SQL", second-last paragraph, and "Transactions and competing buyers", first paragraph and the reserve listing

Problem: The article names data-changing SQL ("The same applies to INSERT, UPDATE and DELETE") but never shows it. The transaction is described rather than listed: "Put the order insertion, item insertion and stock reduction between BEGIN and COMMIT". The first UPDATE the reader meets uses `SET` and `RETURNING` without explanation, and "the second gets no returned row" depends on `RETURNING`. The step "commit the order and item only when one unit was reserved" is left for the reader to place in sequence.
Effect: The reader has to assemble the transaction in their head and infer what `RETURNING` does. The brief's point that a successful statement can still make the wrong change stays an assertion. The reference articles put the SQL being executed beside each figure: Storage opens with its BEGIN, UPDATE and COMMIT listing, and the Indexes figures show their query.
Repair: Add one listing for order 103: `BEGIN`, the two `INSERT`s, the reserve `UPDATE … RETURNING`, then `COMMIT`, with `ROLLBACK` when no row comes back. Add a sentence on `SET` and `RETURNING`. The read-then-write version from teaching-1 (`SET available = 0`) is a ready example of a successful statement making the wrong change, and could replace the abstract sentence in the SQL section.

### teaching-3 · optional · a00, "Transactions and competing buyers", last paragraph, and "From a request to a committed order", last paragraph

Problem: Section 1 promises payment states ("waiting for payment, paid and cancelled, with a next action for an interrupted or declined attempt") and says the article will return to that boundary. The return is a one-sentence design: commit a durable instruction and let a worker act on it. It then says that "a provider's declined payment or lost reply still needs a recovery decision" without naming the decision. The order states are never mentioned again.
Effect: The running example's awkward case is a declined or lost payment. It ends without the reader knowing what happens to order 103 and its reserved mug. The reader holds an open question until a04.
Repair: Close the thread in two or three sentences, or a small state table. Order 103 commits as `pending_payment` with the mug reserved and a payment request carrying a stable identifier. If the provider declines, one transaction marks the order cancelled and returns the mug to stock. If the reply is lost, the worker asks the provider about that payment-request identifier before retrying. Leave the outbox mechanics and duplicate handling to a04's "Make work beyond the transaction recoverable".

### teaching-4 · optional · a00, "From a request to a committed order", Figure 3 and the paragraph after it

Problem: Figure 3 ends at "Inspect stored state". The action the section recommends appears only in prose: retry with the same purchase-attempt identifier, R103, and let the uniqueness rule prevent a second order. The next sentence then warns that "a lookup that finds nothing must also account for an overlapping attempt still able to commit". That case is neither shown nor made concrete, and it undercuts the figure's tidy "finds no order from this attempt" ending.
Effect: The reader learns what not to do, but has to work out alone how reusing R103 under a uniqueness rule makes a retry safe. The overlap case gives them no situation to picture.
Repair: Add a final "Retry with R103" step to the figure. On the after-commit path, the retried insert conflicts with the stored R103 and the application returns order 103. On the before-commit path, the insert succeeds once. Then either name the overlap case concretely, for example a second application instance still retrying R103 where the uniqueness rule lets only one commit, or leave it to a04's "Recovering database requests safely".

### teaching-5 · optional · a00, "Tables, keys and relationships", paragraph beginning "These are logical choices about facts"

Problem: "Files, pages and indexes" and "Changing an index can make an order cheaper to find" arrive in section 2. Index and page are first defined in "The work behind a query", four sections later.
Effect: A small stall. A newcomer meets the physical vocabulary with nothing to picture, so the logical/physical distinction lands less firmly.
Repair: Gloss index in a clause, for example "an index, a lookup structure explained in The work behind a query". Alternatively, keep only the logical/physical point and link forward to that section.

## Limits

I read the rendered HTML as extracted text and the figure components' source. I did not operate the controls in a browser. Each figure's states, prompts and toggles were judged from its script and its model text, so timing, playback and how the drawn states look in use were not observed. The DecisionFigure pictures are drawn by script at load, so the static HTML holds only their captions and text alternatives. I read the reference articles in full from source with a sample of their figure components, not every reference figure in operation. In the child plans, I read each article brief in full but section briefs only in part. Technical correctness, wording and visual design belong to the practitioner, editorial and visual perspectives and were not assessed here.
