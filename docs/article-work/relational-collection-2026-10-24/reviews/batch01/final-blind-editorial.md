# Final blind editorial review · articles · r00/r01/r02 · batch01-v02

Inputs read: the intended audience in `reviews/batch01/v02/audience.md`; the complete current rendered r00, r01 and r02 at `http://127.0.0.1:4372/review/relational-collection/`, `/modelling/` and `/values/`; and the editorial perspective and review skill. No plans, manifest, source, earlier versions, findings, decisions, repair history, mechanical receipts or writer notes were read.

Reference exposure: all 19 bounded parts were read separately through `python3 scripts/read-writing-reference.py` (sequences 1–6, indexes 1–7, storage 1–6), with every END marker present and no clipped reference part. All 34 numbered rendered reference drawings were inspected with their developing explanations at the reference preview on port 4350: 13 in Sequence diagrams, 11 in Indexes and 10 in Storage and durability. Background tabs were used; the viewport and theme were not changed.

Article exposure includes all prose, tables, code captions, labels, control choices, sources disclosures and the full scripted step/alternative text. The customer and anomaly comparisons were also read in their alternative states. The verdict below is a new complete reading, not a repair confirmation.

Highest severity: none

## r00 · Relational databases

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Concrete questions and subjects organise the progression from tables to concurrent purchases. |
| 2. Plain sentences | pass | The prose explains operations and consequences in connected, ordinary language. |
| 3. Terms | pass | Keys, schema, query, join, aggregation, constraints and transaction properties receive usable explanations before their developed use. |
| 4. Openings | pass | The shop establishes both combining related facts and preserving related changes, with an explicit illustrative scope. |
| 5. Reader-facing text only | pass | Draft navigation and evidence notes are appropriate to this review surface; the article contains no editing instructions or repair narrative. |
| 6. Captions and labels | pass | Figures say what is followed, how alternatives differ and where chosen schedules replace observed execution. |
| 7. One piece | pass | The receipt, purchase and last-mug race develop the same shop without interrupting the argument with detached qualifications. |

The article fulfils its introductory promise. “Tables and keys” supplies identities before the receipt needs them; “What an order contains” establishes line grain and agreed prices before the join and sum use them. The explanation of two lines paired with two payments earns the warning about multiplied totals without pretending to finish the later reporting lesson here. The move from a half-written purchase to two complete but incompatible purchases makes atomicity and concurrency distinct problems the reader can recognise.

The qualifications have a reason where they occur. The card-provider boundary follows the transaction's scope; the lost commit reply follows the durability promise; the limits of a stock check are subsequently demonstrated by the race. The conditional update is explained through its condition, current-row calculation, returned row and the caller's rollback obligation. The final choice of relational storage follows from these worked needs and includes costs. This can sit beside the references as an introduction: its breadth is controlled through one example, and it gives useful initial judgement while marking the work that belongs to companions.

## r01 · Relations, keys and normalisation

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Headings trace the actual design decisions, then name the formal checks. |
| 2. Plain sentences | pass | Even the formal material is attached to concrete rows and changes. |
| 3. Terms | pass | Grain, candidate key, superkey, dependency and decomposition are introduced through their jobs. |
| 4. Openings | pass | The receipt's repeated current name and missing place for Edda make the modelling question tangible. |
| 5. Reader-facing text only | pass | The worksheet and sources describe evidence and use, with no production history. |
| 6. Captions and labels | pass | The determinant map, three independent changes and price comparison each state their meaning and limits. |
| 7. One piece | pass | Row meaning, identity, dependencies, anomalies and reconstruction form one sustained argument. |

This article earns its practical advice. It establishes what a key promises for future valid states before asking what that key determines. The name-change, customer-without-orders and final-order deletion cases show three distinct costs of the sales sheet. The reconstruction query then checks that separation preserves associations, rather than presenting “more tables” as its own success criterion. Normal-form names arrive after those reasons are understood; the optional precise definitions do not interrupt the main explanation.

“When a copy is a different fact” is a necessary extension of that reasoning. The agreed price and current catalogue price supply an actual case where equality today does not imply one fact. The derived-total discussion then distinguishes a stored calculation and gives its freshness and maintenance obligations. The closing design tests are actions the preceding examples have taught the reader to perform. The selection and development meet the reference standard, with no substantive patch-like passage or missing prerequisite identified.

## r02 · Values, missing data and equality

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Names distinguish amounts, instants, text comparison and absence economically. |
| 2. Plain sentences | pass | Representation choices are explained by what they change for the application. |
| 3. Terms | pass | Precision, casts, instants, zones, collation, predicates and missing-value operators have sufficient local explanation. |
| 4. Openings | pass | Prices, order times and product codes establish the consequences of type and comparison choices. |
| 5. Reader-facing text only | pass | Experiment scope and reproducibility notes support the reader without exposing editorial work. |
| 6. Captions and labels | pass | The instant diagram identifies stored and displayed values; the condition tool identifies each predicate, outcome and retained row. |
| 7. One piece | pass | The article repeatedly connects representation and absence to the rule the application intends to express. |

The examples make the decisions usable. Exact arithmetic precedes rounding policy, so “exact” is not allowed to stand in for a charging rule. The instant and zone-free reading are distinguished before local-day boundaries and the daylight-saving example require them. Text comparison moves from visible case differences to visually identical Unicode representations before asking lookups and uniqueness to share a rule.

The delivery-note section establishes known non-empty, known empty and missing before comparing their predicate results. Its progression from equality to inequality, absence tests, explicit inclusion and `IS DISTINCT FROM` makes the policy choice visible. The empty payment sum subsequently gives a reason to substitute zero while preserving the distinction from an unknown payment amount. Checks and uniqueness close the argument by showing that absence is treated differently by different operations. The final decision order is supported by the examples. It meets the references' standard of explaining consequences before recommending a choice.

## Findings

None. No substantive technical or visual concern arose from this reader evidence that needs referral to a specialist. No finding identifiers were consumed.

## Whole reading and limits

The three pieces agree about the shop's identities, five order lines, order 103's 29.00 amount, current versus agreed prices and the role of missing payments. r01 and r02 use the introductory knowledge they were assigned, and briefly restate the parts needed for their own argument. Their new hypothetical changes are labelled as such. Across this complete reading, the reader can tell what each decision protects and which later subject develops it.

This is editorial and whole-article teaching judgement. I did not execute the downloadable SQL, verify technical claims independently against external primary sources, inspect implementation source or conduct a visual accessibility/control matrix. Scripted transaction and predicate text was read in full as permitted; reading it does not establish native execution or exhaustive control correctness. This report supplies no practitioner or visual sign-off and does not authorise publication.
