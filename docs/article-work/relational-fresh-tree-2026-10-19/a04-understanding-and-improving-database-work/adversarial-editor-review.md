# Independent adversarial editor review

Status: repairs required. Perspective: reading effort, navigation, teaching flow and consolidation, in breakdown mode. Reviewed `breakdown.yaml` against `context.yaml` and `../commission.md`. Read all three fixed reference articles in full, including their figure declarations, captions and surrounding explanations. No existing relational corpus, coverage map or historical plan was used. This is a planning review; rendered behaviour and future prose remain unassessed.

The five child commissions have distinct practitioner jobs. I do not recommend forcing them into fewer pages: storage explains physical work, indexes choose access paths, execution explains the plan, investigation chooses and validates an intervention, and partitioning makes a lifecycle decision. The clearest avoidable cost is in the parent: a promised early diagnosis appears after three mechanism introductions, while its beginning and completion are spread across three sections. Two ownership seams also leave later workers free to reteach the same material.

## Required repairs

### E1 — Complete the first investigation before the mechanism tour

Location: parent brief lines 7–8; headings `Start with the work the user is waiting for` (15–23), `Diagnose a workload before choosing a fix` (112–120), and `Keep the improvement when the workload changes` (168–177).

The brief promises a first useful diagnosis before deeper mechanisms. The current linear reading introduces symptoms and metrics, then walks through pipeline, storage, indexes and plans before completing an investigation. Task links help a returning reader, but do not repair the newcomer's first reading. The final heading also repeats verification, acceptable effects and workload changes already assigned to diagnosis.

Required fix: put the compact diagnosis immediately after the statement timeline, before `Rows, memory and durable writes`. Carry one of the three symptoms through a complete evidence → hypothesis → change → verification sequence there. Keep the other two as brief contrasts and later return points. Fold the final heading's before/after table, assumptions, reassessment trigger and stopping rule into that same diagnostic arc, or make the final section an explicitly short return to that evidence rather than a second method. Keep its child attached to the early diagnosis.

Useful understanding lost by the fold: none if verification, workload assumptions and architectural stopping conditions are retained. What disappears is a separate navigation stop and repeated explanation of what counts as success. Do not delete the workload-level outcome in pursuit of brevity.

Acceptance condition: a newcomer reaches one completed, interpretable investigation without first learning storage, index and join mechanisms; the final evidence has one clear home.

### E2 — Assign one explanation owner for repeated physical/execution concepts

Location: storage child lines 48–57; index child 74–82; execution child 99–110; investigation child 127–139.

The broad ownership clauses distinguish neighbouring top-level branches, but not these siblings. Row/column layouts and compression appear in storage and execution; clustered organisation appears in storage and indexes; coarse skipping appears in indexes and execution; memory/spill and statistics evidence appears in execution and investigation. Each mention is relevant, but the current stubs can produce several introductions to the same mechanism and prerequisite chains that send readers back and forth.

Required fix: make the explanatory homes explicit in the stubs. Storage owns physical row/column layout, compression, caches, versions and log/cleanup mechanisms. Indexes owns key order, row locators, access eligibility and the cost of maintaining an index set. Execution owns estimates/statistics, operator memory and spill behaviour, batching/vectorisation, pruning/skipping in the plan and parallel coordination. Investigation consumes that evidence to discriminate hypotheses and compare workload outcomes; it should not reteach the operators, cache mechanisms or statistics model. The other siblings can give the minimum local consequence and a direct reference. For coarse skipping, pick one explanatory home and make the other reference explicit; the precise choice is less important than one home.

Useful understanding lost: no mechanism or judgement must be removed. Readers lose repeated introductions and duplicated product comparisons. Preserve short reminders necessary to read a child independently; the aim is to avoid repeat lessons, not to make every page require every sibling.

Acceptance condition: a future worker can tell which sibling teaches each repeated mechanism and which sibling only applies it, directly from the briefs.

## Section-by-section cost challenge

| Current parent section | Decision and concrete consolidation | Useful understanding lost |
| --- | --- | --- |
| Start with the work the user is waiting for | Keep as a short opening with three symptoms in the same orders system. Defer detailed measurement vocabulary and all comparison mechanics to the early diagnosis. An observation window and why averages mislead need only enough explanation to read that case. | No essential understanding; standalone measurement instruction moves to the case where it changes a decision. |
| Follow a statement from arrival to completion | Keep the single compact timeline. Fold it into the opening if the two sections otherwise repeat the same three symptoms. Its unique job is distinguishing elapsed time, work and waits, including deferred work. | A separate section anchor only; preserve the distinctions on the timeline. |
| Rows, memory and durable writes | Keep a bounded read/update trace and the cache-hit/commit/cleanup distinction. Do not reproduce the child's engine comparisons, storage tuning or recovery catalogue here. | Deep storage detail is deferred, not lost; enough remains to interpret the first case. |
| Find fewer rows without making every write too expensive | Keep the scan-versus-index contrast and carry its write cost through the same index. Fold general advice about verification into the earlier diagnosis, not another mini investigation. | No useful index judgement lost. |
| Turn a query into an executable flow of data | Keep one small report plan with one causal underestimate and its downstream work. Avoid teaching all join algorithms, execution styles and parallel caveats in this introduction. The child owns those. | Algorithm selection detail is deferred; the parent still teaches how rows and estimates relate to work. |
| Diagnose a workload before choosing a fix | Move early and use as the parent’s worked spine, as E1. Keep slow work, blocking and saturation as distinguishable explanations, not three full first investigations. | Two complete introductory cases are avoided; their mechanisms still receive worked depth in descendants. |
| Organise growing data around the work it must support | Keep the date-retention example and one non-pruning counterexample. Move generic capacity/cost benchmarking to investigation and version/index overhead explanations to their existing homes. | No partition judgement lost; repeated capacity method is removed. |
| Keep the improvement when the workload changes | Fold its outcome evidence into the diagnosis; alternatively retain a short closure that explicitly revisits that same table and changes only the assumptions. | Separate recap/navigation cost only, provided stopping conditions survive. |

## Child boundary challenge

| Child | Cut/merge/fold tested | Decision and loss assessment |
| --- | --- | --- |
| How relational engines store and change data | Fold into the parent's storage section; alternatively split buffers, versions and crash recovery into separate child pages. | Retain one substantial child at this stage. Folding would either overwhelm the first read or remove the causal connection from logical update to log, cleanup and physical work. Premature subdivision would force several navigation steps for that one causal chain. Keep bulk loading here to its physical/log/cleanup consequences; the experiment design belongs to investigation. |
| Choosing and maintaining indexes | Fold into execution or create separate children for index types and upkeep. | Retain one child. Index design is a reusable decision across many plans and must include its write costs. Merging with execution would add key-design material to a reader investigating an estimate error; splitting upkeep would hide the bill for an index from its selection. Alternative methods should be workload contrasts, not a product/type catalogue. |
| Reading plans and understanding execution | Merge with investigation. | Reject the merge. Understanding the rows/loops/estimates/resource account is a distinct prerequisite; workload diagnosis must also handle cheap plans, waits and resource contention. A combined page would make the case investigation harder to enter. Remove duplicated physical-layout lessons under E2 instead. Keep the report as the principal worked thread and lookup as a brief contrast. |
| Investigating database performance | Fold into the parent after moving the worked case early. | Retain the child: representative concurrency, skew, offered/completed load, repeated runs, tail/failure preservation and capacity/cost reasoning cannot all fit a short first investigation. Do not let the child repeat each mechanism lesson. Several complete cases are justified only when their evidence discriminates different causes. |
| Partitioning tables for access and maintenance | Fold into storage's maintenance section, or split partition selection from attach/detach mechanics. | Retain one child provisionally. Folding the current commission would add key/granularity, constraints, plan interactions and a measured retention lifecycle to an already broad storage article; removing those would lose practitioner depth. No further split is justified by this stub. Keep lock/validation/rollback mechanisms needed to judge the lifecycle here, with delivery sequencing and runbooks referred to their named owners. |

The smallest defensible proposal at this level is therefore the parent plus these five children, with a shorter parent reading path and explicit explanation ownership. This is a conclusion from the actual jobs, not a required page quota. Child expansion should challenge any proposed grandchildren afresh; the present broad lists do not themselves authorise one page per mechanism or engine.

## Teaching assessment against the examples

The common orders setting, bounded models and named-engine qualification follow the examples well. The strongest reference pattern is a question followed by a small visible change and a consequence: Sequence diagrams changes the booking one fact at a time; Indexes counts the same orders and pages before drawing a design rule; Storage follows P7 across memory, log, commit and failure. The parent can use that pattern by making its early investigation concrete and allowing its mechanism sections to explain evidence the reader has already wanted to understand.

The parent currently asks three symptoms to carry almost every section. Treat them as one setting, not three parallel tours: one primary investigation first, then the lookup/update/report only where each reveals a new mechanism. For later writing, a figure or control should resolve a stated question (for example, changing the plan estimate or adding the competing report), and the prose after it should state what changed and why. This is a teaching direction, not a request to design or implement figures during this planning commission.

## Unresolved findings and recheck

E1 and E2 remain open. Required repairs concern the parent sequence and sibling explanation homes; there is no required additional article, vendor branch or deletion of partitioning. Recheck the repaired YAML against the two acceptance conditions before approving this perspective. No claims about eventual article length, rendered controls or technical correctness are established by this review.

## Recheck of repaired breakdown — 19 October 2026

Decision: pass for the independent adversarial editor perspective. Checked the final saved `breakdown.yaml` directly, as well as `repair-record.md`.

- E1 closed. `Diagnose a workload before choosing a fix` now immediately follows the statement timeline and precedes storage, indexes and execution. The report-interference case has competing hypotheses, discriminating evidence, a controlled concurrency change and a comparison that accounts for queued reports and completion time. It owns the before/after table, correctness and resource consequences, assumptions, repetition, reassessment and stopping rule. The separate final recap was folded; the opening uses the other two symptoms as contrasts rather than parallel investigations. The first useful diagnosis therefore no longer requires the mechanism tour.
- E2 closed. The child briefs now name explanatory homes for physical layout/compression/caches/versions/logging, keys/locators/access eligibility/index-set costs, estimates/statistics/operator memory/spills/batching/skipping/parallel work, and workload experiment design. Investigation explicitly consumes sibling evidence without reteaching the models. The execution brief distinguishes its pruning explanation from partition key/granularity and lifecycle decisions. Short reminders preserve independent entry without commissioning repeated lessons.

No remaining required fixes or unresolved editorial findings in this breakdown. The parent now has seven headings and retains the five distinct child commissions. The earlier section and child challenges remain guidance for recursive expansion and writing, not additional open repairs. This pass does not establish future prose quality, rendered figure behaviour or technical correctness.
