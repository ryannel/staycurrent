# Writer return · relational introduction · 20 October 2026

## Draft and ownership

Staged fragment: `article.astro` in this folder. Imports resolve from the eventual
`src/articles/relational-next/a00.astro` location. The article remains titled
**Relational databases**. The route wrapper continues to supply its h1, metadata
and bottom child reading tree.

Owned component changes are confined to `src/components/relational-next/a00/`:

- Added `DecisionFigure.astro`, with four compact comparisons: uncertain commit
  outcome, scan versus indexed lookup, required-field compatibility, and current
  copies versus retained earlier state after two different failures.
- Updated `RowsFigure.astro` and `OrderFigure.astro` so endpoint buttons remain
  focusable with aria-disabled state and inert endpoint actions. They no longer
  move focus to another button at the endpoint.
- All playback budgets now count the entire figure's rendered text. OrderFigure
  selector changes retain the step, matching the other comparisons.
- Existing SQL, fixture, native verifier and deterministic original models are
  unchanged. No edits to other articles, shared files, skills or the tree.

## Complete-piece revision

Rewrote the opening and all nine sections, contents labels, contextual entrances,
figure prompts and route table. Kept the shop as a single running case and put
concrete consequences before general advice: the extra joined row, order without
stock, missing commit confirmation, small answer with a large read, old writer
without the new fact, and deletion present on both copies.

The introduction still gives a useful first answer about data design, SQL,
transaction protection, integration, execution work, live change, operation and
selection. The direct children retain their detailed schemas, query techniques,
concurrency protocols, driver procedures, diagnosis methods, rollout runbooks,
restore/failover procedures and candidate acceptance work. The first-application
route and conditional SQLite/CockroachDB routes are preserved.

Reread the complete staged piece, including contents, source note, captions,
controls, alternative text and every new model's narrative. The illustrations
explicitly describe their assumptions. The scan model counts only table pages
and calls out uncounted index work. The rollout model does not invent historical
values. The failure models separate stored state from caller knowledge and
replication from recoverable history.

## Reader-facing section wording for central integration

All existing anchors are retained. Update any shared registry/plan display labels
centrally to these revised headings; this is wording polish within the same plan,
not a proposal to change scope or destinations.

| Existing anchor | Revised visible heading |
| --- | --- |
| one-action-changes-several-facts | One order, several changes |
| tables-describe-facts-and-relationships | Tables, keys and relationships |
| ask-for-a-result-then-check-what-it-means | Asking questions with SQL |
| a-transaction-protects-a-change-within-a-stated-contract | Transactions and competing buyers |
| the-application-is-part-of-the-database-system | From a request to a committed order |
| correct-sql-still-has-to-do-physical-work | The work behind a query |
| data-and-applications-change-at-different-speeds | Changing a live database |
| operate-for-the-failure-you-must-recover-from | Keeping the service and its data |
| choose-a-system-by-testing-the-contract-you-need | Choosing a database and a reading route |

No structural tree changes are proposed.

## Verification and limits

See `sources.md` for primary-source checks and retained native evidence. No new
engine execution is claimed. The previous native runtime is stopped and removed.

On the review preview, exercised both alternatives in each new model, checked
join/LEFT JOIN grouping and rollback/commit outcomes, and confirmed endpoint
Next retained focus with aria-disabled=true in the original figures. At phone
width, checked document and all figure widths and visually inspected lookup and
recovery. No horizontal overflow was present. All models initialise without
autoplay. The writer did not run a build, Git operation or nested review.

Return this staged article and stable components for the orchestrator-managed
practitioner, editorial, teaching and interaction reviews. The orchestrator owns
integration, the full build, publication state and any delivery.

## b01 repair return

Applied the combined decision in `b01/repairs.md`, including all five accepted
findings from the completed editorial and interaction reviews. These reports
were inputs to this repair pass; the original drafting pass used no prior
verdicts.

- **E1:** The request section now defines purchase-attempt identifier R103,
  distinguishes it from customer and order identifiers, and says to reuse it
  for every retry and store its result with the order under uniqueness. Figure
  3's initial state, caption and inspected outcomes use the same noun and R103.
  The payment request has its own stable payment-request identifier. The
  overlapping-attempt qualification and provider duplicate-prevention limit
  remain explicit.
- **E2:** Removed the compressed driver-boundary sentence, stated that the
  database rejects a change violating a constraint, and attached the live-change
  steps to the optional delivery-instruction column and older writers.
- **E3:** The sources note now describes the final six figures and verification
  dates without figure-addition history.
- **I1:** Figure 5 names the delivery instruction in its title, selector, states,
  initial explanation, later explanations and text alternative. Its historical
  value and writer-compatibility caveats are unchanged.
- **I2:** At Find candidates, Figure 4 now reveals the index entry `9 → page 3`
  and a candidate-location card, before any table page is visited. The scan
  shows that it has no candidate location before reading. Initial and candidate
  table-work notes explicitly say no table page has been visited; “All rows
  tested” appears only after the scan's read. No B-tree mechanism was added.

Own narrow checks used the promoted port-4337 development preview in Chrome
(the in-app browser was unavailable during this repair pass). Read both Figure
3 final explanations and Figure 5's initial/optional/old-writer/final states.
Stepped Figure 4 from Start through Find candidates in both modes, then checked
both final results. Both still return order 9; scan still tests twelve rows on
three pages; index still visits one table page plus its explicitly uncounted
index search. Enter activation of Next retained endpoint focus.

At 390 × 844, visually inspected the revealed index entry and candidate-location
card. The document remained 390 px wide; both changed Figures 4 and 5 had equal
client/scroll widths of 356 px. Exercised Figure 5's optional-column, old-writer
and strengthened-rule states at that width. Read the final rendered sources
note. Reset the viewport and closed the temporary tab.

The nine headings, anchors, links, family scope, six model count, invented data,
engine-evidence boundaries and original native fixture are unchanged. No build,
Git operation, nested review or fresh engine execution was performed. Staged
article and owned components are stable for the orchestrator's b02 snapshot and
narrow independent rechecks.
