# b13 teaching, style and interaction review

## Verdict by article

**a15 — Composing larger SQL queries: PASS.** No required findings. One optional interaction improvement, T15-O1, below.

Reviewed the frozen candidate at `http://127.0.0.1:4438/review/relational-next/query-composition/` against the b13 manifest and original relational-practice commission. This is the independent teaching/style perspective under `.agents/skills/staycurrent-review/SKILL.md`; no practitioner report was used.

## Reading and boundaries

Retained the complete reading of the three fixed reference articles, including their source and rendered figures: Sequence diagrams, Indexes, and Storage and durability. For this article I read the complete assigned prose, `CompositionFigure.astro`, `model.mjs`, `queries.mjs`, context, source notes and writer report. Family judgement uses the actual a02 parent and a14 sibling, with the already-read a13 expression owner.

The article earns its place as the composition owner. It extends a02's January order-and-receipt fixture and explicitly preserves the parent result: order 101 has €15 due and a payment; 102 has €20 due and no payment; 106 has an unknown balance and no payment. Receipts belong to orders here, avoiding accidental transfer of a14's different customer-payment fixture. It leaves join construction and repair with a14, and general expression/NULL semantics with a13. Readers get useful local explanations before those links become relevant.

## Teaching and reference style

The progression follows the references' concrete-example, changed-condition, visible-consequence approach. The prose introduces a precise question, the figure exposes the mechanism, and the surrounding explanation makes the practical choice. The figures are logical teaching models; PostgreSQL 18.6 observations and executable checks are identified separately. Neither the correlation animation nor the recursion rounds imply an observed physical execution plan.

All five figures carry useful explanations:

- **Scalar subqueries:** zero rows, one value, multiple rows and one NULL are distinguishable cases. The multiple-row error exposes the cardinality promise rather than concealing it with arbitrary `LIMIT 1`. Declared keys, aggregation and meaningful ordering explain different ways to satisfy that promise.
- **Correlation:** orders 101 and 102 make the dependence visible. Removing the link produces the global €65/true answer for both orders; the raw join repeats 101 and drops 102. The prose distinguishes logical dependence from the number of physical executions, and directs join repairs to their owner.
- **Membership:** the intermediate truth table records `IN`, `NOT IN`, `EXISTS` and `NOT EXISTS` before `WHERE` discards unknown. Repeated 1s, nullable inputs, an empty inner result and the separate NULL-safe question expose causality, rather than merely asserting that `NOT IN` is risky.
- **Set operations:** unequal copy counts and a NULL duplicate class explain all six operators. The prose also supplies the non-visual requirements—corresponding column meanings and types, final ordering, and the distinction between ordering a result and limiting a branch—without turning into a dialect catalogue.
- **Recursion:** anchor, working set, accepted next rows and final path order are visible. The normal tree, guarded cycle, depth cap, missing root and leaf root make stopping, truncation and an empty descendant result different outcomes. The explanation of node versus path multiplicity and why whole-row `UNION` is not general cycle protection is sufficient for this commission's scope.

The view section is adequately taught by the complete parent query, consuming query and observed receipt insertion/rollback sequence (€15 → €10 → €15). It explains the January placement/current-receipt semantics and reuse boundary. Another figure is not required. Deployment, security and performance details have appropriate owners. The optional recursive section remains bounded rather than becoming a graph course. The final counterexample checklist usefully separates values, multiplicity, types and order; it does not equate a correct answer with good performance.

## Interaction and playback evidence

Inspected all **22 selector paths and 73 logical states**: scalar 4 paths/12 states, correlation 3/9, membership 4/12, sets 6/18, recursion 5/22. Compared intermediate values and final answers with the model and prose, including scalar errors, unknown truth values, repeated set rows, rejected cycle revisits and the bounded result's truncation flag.

For every selector path, exercised slider Home/End, bounded Back/Next with keyboard Enter, Play/Pause, playback interrupted by slider movement, and Reset. Next retained focus at the final state and did not advance beyond it; Back stayed at the first state. Reset restored the scene's default choice and first state. For each of the five scenes, also checked replay from the final state, manual Next interrupting playback, and a selector change stopping playback and returning to the first state. Recursion's changing state counts remained valid. Native selectors, buttons and range controls were usable by keyboard.

The timing implementation counts the state title, SQL, narration, panel titles, column headers and cells, with a reading allowance plus an allowance per row. I timed the dense membership truth-table state: 76 words and three rows receive **26.2 seconds**. Actual playback advanced correctly after that hold and remained playing while holding the final state; I then paused it. Source inspection confirms that the final state receives its own hold before playback stops. This checks the shared mechanic and a dense real case; I did not wait through every complete autoplay sequence. Fixed figure captions and controls are outside the changing-state word count and can be read before starting playback.

## Phone and themes

Inspected the five comparisons at **390 × 844**, in both dark and light themes, including the dense membership table, multiple-row scalar error, raw-join repetitions, `EXCEPT ALL` copies and bounded recursion's final paths. Also inspected desktop presentation at 1488 px. Values, column headings, NULL/unknown distinctions, error text and wrapped paths were readable. The phone uses vertical scrolling for taller tables; scrolling reveals their rows above the sticky narration/controls. No page overflow or clipped result values were observed. Desktop set inputs remain useful side-by-side comparisons. Theme contrast and keyboard focus were visible.

No download was clicked and no download event wait was registered. No native execution or build was performed by this review. Those checks are outside this teaching report.

## Findings

### Required

None.

### Optional — T15-O1: preserve the comparison stage when changing a choice

**Location:** `src/components/relational-next/a15/CompositionFigure.astro`, selector-change handler, first four scenes.

Changing a choice currently stops playback and returns to step 1. This is coherent and fully usable, but readers comparing final scalar, correlation, membership or set outcomes must repeatedly advance again. Preserving the current comparable step for those fixed three-state scenes would make changes in the answer easier to compare, as in the reference figures. The variable-length recursion paths can retain the current reset behaviour or clamp a preserved stage. This is a convenience improvement, not a barrier to understanding or a condition of approval.

## Cleanup

Restored System theme and the normal viewport, then closed the owned Chrome tab. No article/component mutations, shared builds, nested review team or Git operations were made. The only saved change is this review report.
