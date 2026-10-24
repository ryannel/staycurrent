# Editorial review · article mode · r04, r08, r10, r11, r12 · batch03-v01

Fresh independent initial editorial assignment. Highest severity: **medium** (r10). No coordinator additions were supplied.

## Inputs and calibration

- Assignment: `reviews/batches03-04-editorial-assignment.txt`; current `staycurrent-review/SKILL.md` and only `perspectives/editorial.md`.
- Fixed identity: `reviews/batch03/v01/manifest.json`, version `batch03-v01`, frozen 24 October 2026 at 01:26:18 UTC; finished routes at **4398**, listed separately below. Used manifest identity metadata, not the contents of the listed source/context/mechanical files.
- Audience: `reviews/batch03/v01/audience.md`. An intelligent engineer familiar with application requests and stored data; piece-specific starting knowledge is recorded below.
- All three fixed references read in full through all **19 separate bounded deliveries**, each requested with a 5,000-token output budget and received through its END marker: sequences 1–6, indexes 1–7, storage 1–6. All **34 rendered reference drawings** studied with their explanations at `http://localhost:4350/review/examples/`: sequences 13, indexes 11, storage 10. Incomplete screenshot clips were recovered. This complete calibration also serves the three pieces in the companion `batch04/editorial-v01.md` report, as one assignment.
- Read every finished article below, its tables, code, captions, controls, scripted-state text and final Sources disclosure. Sources are outside the main article DOM and were read separately. Rendered collection navigation was exposed with the pages; no linked plan, plan brief or other article was followed.
- Withheld: source files, context/plans, mechanical receipts, author notes, approvals, decisions, other reviews, earlier versions and repair history. Did not read live4368 or later source. No builds, source edits, downloads or publication.

## r04 · History, correction and deletion

Input: [frozen rendered article](http://localhost:4398/review/relational-collection/data-lifecycle/). Starting knowledge: keys, references, agreed prices and typed time. Read all six combinations of the two effective instants and three recorded views in Figure 1, and the static cascade figure; read the Sources disclosure.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title states the connected subject; headings name the concrete question being answered, from agreement to copies. |
| 2. Plain sentences | pass | The different meanings of a price are expressed directly and carried into the queries. Dense constraint prose explains each operator rather than asking the reader to decode the SQL alone. |
| 3. Terms | pass | Effective/valid time, recorded time, bitemporal, half-open periods, containment and overlap are introduced before they do explanatory work. |
| 4. Openings | pass | The opening supplies the two conflicting-looking catalogue answers and the independent 20.00 agreement before introducing the two-time model. |
| 5. Reader-facing text only | pass | Scope and experiment limits are relevant to what the example establishes; no editing or repair history appears. |
| 6. Captions and labels | pass | The time controls state which argument changes. The caption distinguishes cells from stored assertions, and the cascade caption names its boundary. |
| 7. One piece | pass | Agreement, historical assertion and deletion policy remain distinct throughout. Qualifications about timestamp labels, physical versions and independent policy drills occur where they change the reasoning. |

### Whole-piece judgement

This can sit beside the references in selection, development and prose. “Changing the effective-time row from 25.00 to 24.00 preserves the first answer and destroys the second” supplies a clear need for the additional axis. The later four-row assertion table then explains how those answers survive in storage, rather than merely naming bitemporality. The retirement-filter counterexample carries the earlier agreement distinction into an actual reading error: adding the current-catalogue condition removes the old mug line. Cancellation and copies extend the lifecycle question without pretending that SQL can undo an external refund or erase a backup. The qualifications earn their space and do not read as detached objections.

### Findings

None.

### Limits

Editorial assessment only. I did not verify the exclusion constraint, concurrency protocol, native outcomes, downloads or erasure policy against sources or a running database. Control text was read in every displayed combination; this is not visual or mechanical certification.

## r08 · Updates, upserts and bulk imports

Input: [frozen rendered article](http://localhost:4398/review/relational-collection/updates-and-imports/). Starting knowledge: keys, constraints, transaction atomicity and the mug update. Read both five-state policies in Figure 1, including the delayed repeat and contradictory old version, its text alternative and Sources disclosure.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title names its three scales of writing; headings turn the import into answerable steps. |
| 2. Plain sentences | pass | The recurring distinctions—changed row, observed source version, current winner and completed batch—are precise and connected. |
| 3. Terms | pass | Upsert, conflict target, `excluded`, staging, seen-version ledger and receipt are explained as they enter the example. |
| 4. Openings | pass | Stock, concurrent edits and imported versions establish why a write needs a precondition before syntax is introduced. |
| 5. Reader-facing text only | pass | Implementation scope and experiment disclosures tell the reader what the supplied protocol actually demonstrates. |
| 6. Captions and labels | pass | Arrival wins and Source versions expose the governing policy, and each state says why the input is applied, stale or refused. |
| 7. One piece | pass | The single-edit precondition develops into identity, staging, reconciliation and atomic publication; later caveats change that same protocol rather than adding unrelated warnings. |

### Whole-piece judgement

This meets the reference standard. In particular, “A version 2 claiming 26.00 is something worse: the source has used the same identity for two different payloads” makes the seen-version ledger necessary before presenting it. The four input rows and the four-class receipt then let the reader account for the batch, rather than equating loaded rows with changed products. “The source-version key answers a different question from the batch ID” is followed by a concrete batch-b example, so the two identities do not collapse into interchangeable retry tokens. The final sections keep omissions, rejection policy and publication granularity connected to the same import contract. The detail is substantial, but each part changes a decision the importer must make.

### Findings

None.

### Limits

I did not verify native concurrent upsert behaviour, numeric validation, ledger contents, scripts or observed schedules. All scripted text was read; no timing, layout, accessibility or throughput claim is certified.

## r10 · Indexes and access paths

Input: [frozen rendered article](http://localhost:4398/review/relational-collection/indexes/). Starting knowledge: keys, result semantics and ordered queries. Read all four entry-construction states and all customer-only (four), history-key (three) and date-first (four) states, their text alternative and Sources disclosure.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | Clear title and economical headings link each structure to saved work. |
| 2. Plain sentences | finding | The equal-timestamp explanation does not fit the selected customer's result; see r10 editorial-1. The remaining prose is direct. |
| 3. Terms | pass | Page, heap, sequential scan, TID, B-tree, selectivity, bitmap and covering are introduced in useful order. |
| 4. Openings | pass | The first two paragraphs establish both the read saving and the ongoing write/memory cost. |
| 5. Reader-facing text only | pass | The conceptual/native distinction is relevant disclosure rather than editing history. |
| 6. Captions and labels | pass | The two drawings state what is invented and what each control changes; measurements are labelled buffer accesses. |
| 7. One piece | finding | One local example dependency fails to connect: the claimed result tie is between customers while the query fixes one customer. |

### Whole-piece judgement

The overall selection and prose can sit beside the references after the local example issue is repaired. “After finding a matching entry, what work is still needed to obtain the requested row?” is a useful continuing question across heap, clustered lookup and covering. The 984/62/13/4 buffer comparison is explained in terms of rejected rows, sorting and heap visits, rather than treating a smaller number as self-explanatory. The closing advice to “name the avoided work” follows from that development. The tie-breaker setup is the exception: it promises a dependency the worked result cannot show.

### Findings

#### editorial-1 · medium · r10 · Put the query in the key

Problem: The setup adds order 105 for Mina and 106 for Edda at the same instant, then says, “Equal timestamps make the tie-breaker necessary. Ordering by time alone would leave their relative order unspecified.” The displayed query immediately fixes `customer_id = 1`. Figure 2 explicitly passes Edda's 106 because it belongs to customer 3. Mina's qualifying result is 105 on 21 October and 103 on 20 October, so these result rows do not tie.

Effect: A reader following the promised reason for `order_id DESC` must reconcile the tie explanation with the subsequent exclusion of one tied row. The example supports global index ordering, but does not demonstrate the claimed ambiguity in this customer's answer. This interrupts the otherwise concrete derivation of the key.

Suggestion: Either show a time tie among rows qualifying for the worked customer query, or explain separately that the ID makes the result deterministic when that customer's orders tie, while the existing cross-customer tie concerns the date-first index's global order. Keep any changed example coherent through its states and explanation.

Evidence: [Put the query in the key](http://localhost:4398/review/relational-collection/indexes/#design-from-the-query), its customer-qualified SQL, and Figure 2's final date-first caption: “Pass 106 because it belongs to customer 3. Then 105 and 103 complete the answer.” This is an editorial example/argument concern; any changed data or ordering should also receive the relevant teaching and specialist checks.

### Limits

No independent verification of index rules, buffer measurements, native plans or generated data. I read every scripted state but did not certify geometry, colour, keyboard use or native correspondence.

## r11 · Query execution and bad plans

Input: [frozen rendered article](http://localhost:4398/review/relational-collection/query-execution/). Starting knowledge: correct joins, aggregation and access paths. Read both figures, all scanning-loop (seven), indexed-loop (three) and hash-join (six) states, the text alternative and final Sources disclosure. Inspected the rendered branch arrangement of Figure 1 to distinguish its two inputs from linear DOM text order.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title is plain; headings name useful plan-reading questions rather than a catalogue of operator names. |
| 2. Plain sentences | pass | Relative costs, actual counts, repeated work and inclusive measurements are carefully distinguished. |
| 3. Terms | pass | Operators, nested loop, hash build/probe, merge join, statistics, custom/generic plans and spill are explained before their practical consequences. |
| 4. Openings | pass | The route/answer distinction and early estimate error establish what plan reading is for. |
| 5. Reader-facing text only | pass | The synthetic workload and deliberately forced comparisons have explicit reader-relevant limits. |
| 6. Captions and labels | pass | Labels name what each route counts and warn against treating unlike operation counters as timings. Figure 1's caption states that the join algorithm remains open. |
| 7. One piece | pass | The article moves from row meaning to repeated work, estimates, parameter skew and memory, then returns to a causal test. Qualifications appear with the claims they constrain. |

### Whole-piece judgement

This meets the reference standard. The receipt establishes row meaning before algorithm choices; “A node estimating one row and returning one row may still sit above a huge scan” connects that opening to aggregate plan reading. The correlation arithmetic and the two measured estimates develop a specific reason for being wrong, while “The estimate improved without changing … the chosen index-scan algorithm” prevents a false shortcut from better statistics to proven speed. The final example hypotheses—too many inner lookups versus wide rows discarded after fetching—show what an actionable explanation sounds like. Scope expands to distributed work without claiming local evidence for remote performance.

### Findings

None.

### Limits

No technical or visual certification of algorithms, statistics, plans, memory figures or distributed-engine descriptions. No native execution, mechanical receipt, source inspection or download was used.

## r12 · Table partitioning and data lifecycle

Input: [frozen rendered article](http://localhost:4398/review/relational-collection/partitioning/). Starting knowledge: typed time, indexes and history requirements. Read all five states for each of four pruning queries, all four lifecycle states, text alternative and final Sources disclosure.

### Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Titles and headings | pass | The title connects the physical boundary to its lifecycle purpose; headings state the important decisions. |
| 2. Plain sentences | pass | Pruning, surviving-partition work and removal are expressed as separate concrete operations. |
| 3. Terms | pass | Parent, range/list/hash partition, half-open bounds, pruning, detach and default partition are explained in context. |
| 4. Openings | pass | Skipping data and removing an expired unit establish the two benefits and their prerequisites before schema syntax. |
| 5. Reader-facing text only | pass | The four-row fixture, policy cutoff and native limits state what the reader may infer. |
| 6. Captions and labels | pass | Query choices expose their time conditions; pruning states distinguish candidate selection from row filtering. Lifecycle states distinguish attached, detached and dropped storage. |
| 7. One piece | pass | Key scope, references, retention and late writes develop the consequences of the same boundary. The final choice criteria follow from the examples. |

### Whole-piece judgement

This can sit beside the references. The opening's “A retention operation needs a whole partition whose contents may all leave together” becomes an actual removal gate later, rather than a passing caveat. The E2 duplicate at another instant makes the weakened uniqueness rule concrete; the blocked detach and unconstrained surviving note then show why references participate in retention. “Detach changes membership of the parent; it does not erase the table” is demonstrated through the lifecycle states. The late-arrival section follows naturally from removing that route, and closes the argument without adding unrelated operational advice.

### Findings

None.

### Limits

I did not verify native routing, pruning, key restrictions, detach locking/reference behaviour or the worksheet. This is editorial coverage of the complete fixed text and all displayed states, not certification of visual or technical behaviour.

## Assignment limits and delivery

No article-wide editorial failure was found. The one substantive finding is local to r10's derivation of its tie-breaker; its final severity and acceptance remain the coordinator's decision. A technical or teaching reviewer should assess any resulting example change. Reports do not approve publication or replace other commissioned perspectives. The sole temporary browser tab used for this assignment was closed on completion; user tabs were untouched.
