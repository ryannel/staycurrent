# Teaching review · articles · r03/r05/r06/r07/r09/r13 · batch02-v01

Inputs read: the frozen [manifest](v01/manifest.json), commission, canonical example (including labelled extensions), six briefs and relevant parent, prerequisite, neighbouring and child plans from the frozen context. Read each complete rendered article at `http://127.0.0.1:4384/review/relational-collection/`, including all prose, examples, tables, captions, controls, figure alternatives/step text, optional explanations and the final Sources disclosure outside the article element. Inspected each article's rendered figures in its reading flow.

Calibration: read the complete fixed Sequence diagrams, Indexes and Storage and durability references through all 19 separate bounded deliveries (6/7/6), each requested with a 5,000-token output allowance and each ending with its END marker. Studied all 34 rendered drawings (13/11/10) at the reference preview, alongside their developing explanations. No viewport or theme changes. No frozen source, mechanical author records, earlier versions, other reviews, decisions or repair history inspected. This is independent first coverage; no coordinator-named additions were supplied.

Highest severity: none.

## r03 · Constraints and tenant boundaries

Declared entry: keys, NULL and introductory transactions, with the modelling and value articles as preparation.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Row checks, composite identities and parent/child references build on the entry; tenant and optional-pair meanings are introduced locally. |
| 2. Order | pass | One-row rules precede identities, references, shared scope and the boundary of declarations. The two-parent tenant problem receives the most explicit help. |
| 3. Examples | pass | The same numbered line carries quantity, identity and reference reasoning; the other shop's real P7 distinguishes a wrong parent from a nonexistent ID. |
| 4. Showing | pass | Quantity attempts, the overlapping insert schedule and the two separately followed tenant references make acceptance and refusal visible. |
| 5. Judgement | pass | The reader can select the declaration, reason about a deletion action, test the boundary and identify a rule requiring a concurrent protocol. |
| 6. Gradual exposure | pass | Access authority and multi-row protocols have useful local explanations before their hand-offs; policy mechanics and lock designs remain with their owners. |
| 7. Placement of additions | pass | Assessed the complete present explanation: deferral belongs beside reference actions; optional pairs follow complete tenant pairs; authority and protocols follow integrity. No passage reads as an attached addition. |

Whole learning: at its declared entry, the article supplies a coherent route from a forbidden stored state to a declaration and a test that would distinguish the intended rule. The distinction between data integrity and caller authority is earned by the tenant example. The concurrency boundary does not suggest that constraints cease to enforce their supported rules when writers overlap. No teaching finding.

## r05 · Joins and the meaning of a result row

Declared entry: introductory JOIN, GROUP BY and NULL, keys and value semantics.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Matching pairs and “one row per” precede grain; CTE and correlated subquery are explained where needed. |
| 2. Order | pass | A unique match establishes the baseline, then multiplication motivates separate totals, and preservation motivates predicate placement and absence tests. |
| 3. Examples | pass | Order 101 exposes two independent many sides; 102 supplies the deceptively easy case; 103 and Edda expose absence. |
| 4. Showing | pass | The four line–payment pairs, one pair of totals and both card-filter outputs show exactly where row meaning changes. |
| 5. Judgement | pass | The reader can distinguish a still-due calculation from an absence test and diagnose a plausible balance produced from duplicated contributions. |
| 6. Gradual exposure | pass | Grouping and missing-value behaviour are sufficient locally; deeper calculation and physical execution are handed off after the result is understood. |
| 7. Placement of additions | pass | In the complete explanation, DISTINCT, missing line totals and the non-card-only counterexample address the misconceptions created immediately around them. |

Whole learning: the question about one result row persists through every change to the SQL. The four-pair example makes the hardest error visible before presenting the longer corrected query. Its awkward cases include a correct balance for the wrong reason, equal-valued legitimate contributions, missing payments and an order with no established line total. The reader can build and check the promised report without having to supply its central reasoning. No teaching finding.

## r06 · Aggregates, windows and ordered results

Declared entry: correct joins and result grain.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Aggregate inputs and output grain precede windows; partition, peer and frame receive local definitions. |
| 2. Order | pass | Grouping, counting and filtering establish the input before rows are retained, ordered and framed. |
| 3. Examples | pass | The core receipt totals carry the calculation; the later tie rows have explicitly limited facts; the small score example exposes a rank gap. |
| 4. Showing | pass | Group/window alternatives retain or remove visible order IDs; frame membership makes the 4-versus-5 count at 105 inspectable. |
| 5. Judgement | pass | The reader can choose collapse versus retention, the averaging denominator, filter level, peer-sensitive ranking and a deterministic row frame. |
| 6. Gradual exposure | pass | The meaning of order and a stable selection is answered here before continuation and changing snapshots move to pagination. |
| 7. Placement of additions | pass | The present frame, LAST_VALUE and rank discussions follow the concepts that explain them; the after-a-tie scratch scores earn their separate illustration. |

Whole learning: the article keeps “what does an input/output row mean?” active while adding each new calculation. It gives substantial help to the two independent changes in the ROWS example—frame boundaries and unique ordering—rather than leaving their combined effect unexplained. The final latest-order query applies that distinction to a useful decision. No teaching finding.

## r07 · Pagination and consistent exports

Declared entry: ordered results and transaction snapshot basics.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | LIMIT/OFFSET, saved key and snapshot are distinguished before choosing a continuation or export mechanism. |
| 2. Order | pass | Changed positions motivate keysets; keysets' remaining omissions motivate a fixed view; a fixed view then motivates lifetime and delivery costs. |
| 3. Examples | pass | The five-order list carries cancellation, movement, a tied boundary and a separate export history, each explicitly reset or labelled. |
| 4. Showing | pass | All list-change/method combinations and both snapshot schedules show the actual returned IDs, rather than relying on generic duplication warnings. |
| 5. Judgement | pass | The reader can choose a live continuation contract or an exact export, preserve ties, construct the cursor from the delivered row and recognise restart limits. |
| 6. Gradual exposure | pass | Index work, version retention and connection ownership receive enough local explanation before deeper cost and distributed-snapshot hand-offs. |
| 7. Placement of additions | pass | Cursor contents, upper bounds, materialised fields and held cursors each sit beside the mechanism whose promise they qualify. |

Whole learning: the opening position-versus-view distinction remains useful throughout. The article demonstrates why keysets improve one kind of movement without promising an unchanged starting set, then gives a concrete fixed-view export and its connection/lifetime boundary. The nullable-key, precision, look-ahead-row and late-commit cases support the promised practical judgement without interrupting the central progression. No teaching finding.

## r09 · SQL at the application boundary

Declared entry: basic queries and transaction boundaries, with correct result rows and isolation as preparation.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Driver, value placeholder, result conversion, session, pool and ORM are introduced before they carry an argument. |
| 2. Order | pass | Command meaning precedes result meaning, transaction ownership, application refusal, cleanup and hidden generated work. |
| 3. Examples | pass | Shop lookups and the labelled purchase rewind cover hostile text, no row, partial work, cancellation and a broken connection. |
| 4. Showing | pass | The binding comparison preserves one SQL value position; all four lifecycle paths expose connection and transaction state through release or discard. |
| 5. Judgement | pass | The reader can distinguish values from structure, SQL success from business acceptance, and caller timeout from settled database cleanup. |
| 6. Gradual exposure | pass | Uncertain commit resolution and pool sizing have clear local boundaries before their specialist hand-offs. |
| 7. Placement of additions | pass | Identifier selection follows binding; implicit transactions precede explicit contexts; exception placement precedes cancellation and reuse. The complete sequence reads continuously. |

Whole learning: the article turns a broad application boundary into a connected set of responsibilities for one borrower. The context-manager explanation and no-stock branch expose the otherwise easy-to-miss point that catching an application refusal inside the block can commit earlier work. The cancellation path then extends the same ownership model. The reader has enough local understanding to use the promised contract while leaving full retry resolution and capacity design to their owners. No teaching finding.

## r13 · Transactions and isolation

Declared entry: the introduction's purchase and last-mug race.

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Invariant and atomicity arise from the purchase; snapshot and serial outcome are introduced as different promises before the instructor example uses them. |
| 2. Order | pass | The purchase boundary precedes its conditional update, stable observations, different-row write skew and the fresh Serializable decision. |
| 3. Examples | pass | The saved-value mug race exposes a non-negative but wrong result; the two named instructors supply the awkward multi-row case. |
| 4. Showing | pass | Stock arithmetic, both snapshot schedules and both instructor schedules expose reads and committed state separately, with full step alternatives. |
| 5. Judgement | pass | The reader can choose a one-row condition, a report snapshot or whole-decision protection, and knows when a complete retry changes the decision. |
| 6. Gradual exposure | pass | Lock coordination, physical versions and uncertain replies get local explanations of their role and limit before deeper articles take over. |
| 7. Placement of additions | pass | The complete text places row-recheck limits beside the conditional update and stale-snapshot limits beside the locking hand-off; both serve the current argument. |

Whole learning: the three opening promises become distinct practical choices, not merely isolation-level names. The instructor cycle is explained both through the schedule and through the incompatible requirements for a serial order. The fresh count of one makes whole-transaction retry meaningful. The locking hand-off retains its essential snapshot and participation conditions, so the local understanding does not depend on an unqualified promise that waiting fixes a decision. No teaching finding.

## Findings

None. No critical, medium or low reader problem was identified in these six pieces under the teaching checks. Finding numbers therefore remain unused separately for each article.

## Limits

This review judges teaching from the frozen rendered material and permitted planning context. It does not independently establish technical truth, native experiment outcomes, download behaviour, accessibility, responsive layouts or visual contrast. No source or mechanical author record was used as evidence. Rendered reference study covered the 34 drawings and their explanatory context, not exhaustive playback of every reference setting. Assigned-article alternatives and scripted explanations were read in full, using rendered disclosures where they supply the complete step text. This is six independent whole-article judgements at the declared entries, not complete-corpus route coverage or a publication approval.
