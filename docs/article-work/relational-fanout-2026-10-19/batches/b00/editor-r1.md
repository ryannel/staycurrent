# Breakdown review — adversarial editor, round 1

Review scope: `round-1/manifest.yaml`, containing **a00** only. Reviewed the original commission and the assigned plan. No other review report was read. This judges planned scope and boundaries, not unwritten prose or figures.

## a00 — Relational databases

**Verdict: accept the root breakdown; keep two consolidation boundaries explicit as descendants are planned.** No blocking change to this plan is required. The eight child stubs each contribute a distinct part of the original relational-practice goal. This is a useful first division of work, not a reason to presume eight eventual articles or a fixed curriculum.

The running order example gives the root a coherent route from shared facts to correctness, execution, change and recovery. Its nine headings are justified if this remains an orientation: each should give the reader one useful working distinction and a reason to enter the linked branch. Trying to fulfil every child brief in the root would make it expensive without making it sufficient for practice.

### Concrete consolidation findings

1. **Keep one owner for application failure handling.** Locations: “A transaction protects a change within a stated contract” and “The application is part of the database system”; transaction child brief (“retries and uncertain commit outcomes”) and integration child brief (“retries and idempotency…including ambiguous outcomes”). The root currently revisits the payment boundary, retries and outcome uncertainty across these adjacent sections. Keep the transaction section's local-versus-external boundary and commit/rollback contract; put the request's broken-connection example and the decisions about deadlines, idempotency and reconciliation in the application section. In descendants, the transaction branch should establish why an abort and an unknown commit outcome demand different responses, then link to the integration branch for the recovery procedure. Do not commission separate retry or external-effects explanations under both parents. **Understanding lost by this consolidation: none**, provided the transaction explanation retains the distinction and the application procedure links back to its guarantee.

2. **Give performance and operations different ownership of capacity and maintenance.** Locations: “Correct SQL still has to do physical work” / performance child (“maintenance and resource contention…throughput and capacity”) and “Operate for the failure you must recover from” / operations child (“capacity planning, maintenance…incident diagnosis”). The overlap is necessary context, but can easily become two parallel tuning and incident courses. Let performance own diagnosis of the work a query/workload performs and validation of interventions. Let operations own service signals, resource budgets, routine procedures and incident/recovery decisions, linking into performance when query work explains a symptom. In particular, fold a repeated explanation of index/version maintenance into the performance owner and retain only its operational trigger, procedure and verification under operations. **Understanding lost: none**; each branch still teaches the distinct decision the practitioner must make.

These are boundary notes for recursive planning, not requests for additional root sections or children.

### Contribution and cut/merge test for each contextual child

| Child stub | Contribution to the commissioned expertise | Consolidation judgement |
| --- | --- | --- |
| Designing relational data | Establishes the facts and invariants the system must preserve; includes the cost of redundancy and change. | Retain. Folding this into SQL would hide schema decisions behind syntax. Avoid a separate theory curriculum; the brief already supplies the correct stopping rule. |
| Working with SQL | Develops result reasoning and safe data changes, including plausible but incorrect answers. | Retain. This cannot be replaced by snippets embedded in the other branches. Treat windows and recursion as problem-driven options, rather than compulsory introductory stops. |
| Making concurrent changes correct | Connects application invariants to concurrent execution and database guarantees. | Retain. Merging with integration would bury the concurrency reasoning among driver and request details. Apply finding 1 to its operational edge. |
| Building applications around a relational database | Covers the part of correctness and resource use that SQL and isolation alone cannot provide. | Retain. It owns request and background-work behaviour around the database. Reuse the transaction reasoning instead of reproducing it. |
| Understanding and improving database performance | Gives a method for connecting observed workload behaviour to measured changes. | Retain. Storage and optimiser mechanisms earn space through a diagnosis or intervention, as the brief requires. Do not grow a parallel engine-internals syllabus. Apply finding 2. |
| Changing a live database | Adds compatibility across versions, partial progress and reconciliation, none of which follows from designing the initial schema. | Retain. Folding it into data design loses the temporal deployment problem; folding it into operations weakens application compatibility. Give this branch ownership of migration/cutover procedures, with operations supplying existing recovery contracts. |
| Running a relational service | Completes the goal with security, maintenance, availability and demonstrated recovery. | Retain. Replication, partitioning and topology should remain means of meeting service requirements. Their presence does not justify independent general distributed-systems prerequisites. Apply finding 2. |
| Choosing a relational database | Converts the preceding contracts into a defensible adoption decision and a representative evaluation. | Retain. A brief product comparison in the root would not teach validation. Reuse guarantee and mechanism explanations from their owners; compare differences and tests here. Do not repeat the full curriculum once for each vendor. |

### Root reading cost and navigation

Keep the root's small concrete demonstrations: separate facts joined into a result, two buyers competing for stock, an old application encountering a schema change, and server loss versus accidental deletion. They explain why the branches exist. Cut extended syntax instruction, full anomaly catalogues, plan walkthroughs, migration checklists and restore procedures from this orientation if they appear during writing; their contextual children already own them. The loss is detail immediately available through a purposeful link, not a missing working distinction.

The final selection section is a sensible synthesis, but should not imply that a newcomer must finish the entire collection before choosing a disposable system or beginning SQL practice. Offer task-based entry links in the root's route guidance: initial hands-on work, a live application's correctness problem, slow queries, a risky change, and recovery responsibility. This is navigation within the existing structure, not another article.

No child should be deleted or folded into the root at this stage: each proposed deletion would remove one of the commission's explicit practical capabilities. The meaningful reduction opportunity is to prevent repeated cross-cutting explanations during the next level of breakdown, then challenge individual proposed descendants against the decisions they enable.
