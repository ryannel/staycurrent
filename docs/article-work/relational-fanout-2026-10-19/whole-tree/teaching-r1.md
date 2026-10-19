# Whole-tree review: teaching and flow, round 1

**Verdict: revise the prerequisite and reading-path contract before writing.** The planned scope can support the commissioned progression from intelligent newcomer to expert relational practitioner. No additional article or specialist branch is required by this review. Two small planning repairs are required below; the remaining suggestions are optional ways to strengthen teaching.

## Scope and standard

Reviewed the original `commission.md`, the complete `whole-tree/round-1/tree.yaml`, and all 39 active article identities in `round-1/manifest.yaml`. Read the three fixed reference articles in full: Sequence diagrams, Indexes, and Storage and durability, including their figure explanations, controls, captions and evidence boundaries. Also inspected representative rendered figures in their local reference previews: waiting and activation bars, composite-index order, and the WAL commit sequence. This is a review of planned teaching and flow, not a verdict on unwritten prose or unimplemented figures. No previous run, existing relational article corpus or other review report was used. No plan was changed.

The examples establish a useful standard: introduce a concrete question, show the simplest case, retain recognisable entities while changing one condition, tell the reader what to watch, and explain the observed difference immediately afterwards. Their figures expose mechanisms through visible state, counters or ordered events; they do not merely decorate a technical list. Their compact models and actual measurements are explicitly different kinds of evidence. Companion articles deepen a question after the current explanation has supplied a usable answer.

The tree usually plans exactly that progression. Parent articles provide basic joins, changes, protection choices, request lifetimes and recovery distinctions before offering focused depth. The SQL branch repeatedly requires expected rows before syntax. The concurrency branch derives anomalies from broken rules instead of beginning with an isolation-level catalogue. The operations branch starts from named failures and service promises. SQLite and CockroachDB are conditional candidate checks, keeping vendor specialism outside the compulsory learning path.

## Required findings

### T1 — Establish a parent-first spine and distinguish contextual entry points from prerequisites

**Locations:** a00 article brief and its contextual entrances; a05 “Give the query a useful route to its rows” / a25 article brief and “Keep the candidate only if its benefit survives the workload”; a05 “Change one explanation into a measured improvement”; a07 “Recover the incident without destroying the evidence”; a35 “Revoke compromised access and verify the boundary again”.

**Problem:** The tree places children at useful conceptual locations, but it does not state whether a newcomer should finish the parent or descend immediately. That distinction matters because several children explicitly reuse parent material taught after their entry point. For example, a25 reuses the parent's common comparison method, whose full procedure appears at the end of a05; it also reuses reporting conventions owned by the later a26. The security child invokes the parent’s incident method, which appears at the end of a07. A depth-first interpretation turns these links into forward prerequisite trips. A parent-first interpretation is coherent, but currently remains an editorial assumption.

**Required repair:** Make the intended reading contract explicit in the plan. In a00, specify a short newcomer spine through the complete parent articles and explain that children are contextual deepening, selected when their question matters. At affected child entrances or child briefs, identify the precise prerequisite section where it is genuinely needed. In a05, either introduce the reusable comparison method before its children or explicitly instruct readers to complete the parent before those investigations. Give a25 a compact local plan-reading legend, or a precise a26 prerequisite, rather than an unspecified requirement to know its reporting conventions. For a35, a brief prerequisite to a07's incident sequence is sufficient; do not duplicate the runbook.

**Acceptance:** A reader following the stated newcomer path can reach every child's first worked task without discovering a required technique later in an unfinished parent or being sent around a sibling loop. A reader following a contextual link can see the short prerequisite before committing to the article. This needs navigation and brief clarification, not extra destinations.

### T2 — Resolve the joins child's specific forward prerequisite

**Locations:** a02 “Combine related facts without changing the question” → a14; a14 “Combine independent totals without multiplying them”; a02 “Express a larger question in checkable stages”.

**Problem:** a14 requires the repair to “use only the derived-table or CTE notation already introduced by the parent”. The parent's first planned introduction of that notation occurs in the following section, after the a14 entrance. This is a concrete mismatch between the child’s assumed knowledge and its contextual location. The double-counting repair is central to useful SQL competence; readers should not meet an unexplained query shape at the moment they are trying to understand cardinality.

**Required repair:** Choose and state one path: introduce the small grouped derived-result notation in a02 before the a14 entrance; require completion of the relevant a02 staging section before a14; or let a14 introduce just the notation needed for its repair and adjust its claimed assumptions. Keep the more substantial composition and existence lesson in its present owner. Do not solve this by requiring a15, whose brief already assumes the parent's staging lesson.

**Acceptance:** a14 can take its reader from the multiplied rows to two one-row-per-customer subtotals and their final join using notation already explained on the stated path. Preserve the visible intermediate rows and equal-valued legitimate-payment counterexample.

## Article-by-article assessment

The following groups account for every manifest article. “Sound” means the planned contribution and progression are coherent at this stage; it does not certify prose, figures or future execution evidence.

| Article IDs | Teaching and flow assessment |
| --- | --- |
| a00 | Sound orientation from shared facts to design, SQL, correctness, integration, physical work, change, operations and selection. Required T1 supplies the missing explicit use of that hierarchy as a learning path. |
| a01, a09, a10 | Sound progression from facts and row identity to representation and enforcement. Specific values, invalid changes and a final invariant inventory make these teachable without a type or constraint catalogue. |
| a11, a12 | Sound contextual depth: dependency anomalies motivate decomposition; historical questions motivate snapshots and versions. The selected BCNF and independent-set cases have stated practical purposes. Preserve the simple current-state exit in a12. |
| a02, a14 | Strong result-contract spine and visible multiplicity; required T2 fixes the staging assumption at the child entrance. |
| a13, a15, a16, a17 | Sound deeper SQL progression with bounded fixtures, expected results and explicit edge cases. Recursion is appropriately optional. Window frames follow retained-row meaning; data changes follow target sets and postconditions. |
| a03, a18, a19 | Sound progression from invariant to broken schedule to protection, then implementation and failure handling. Lock protocols and engine-contract comparisons are justified depth. Keep the parent’s simple atomic-change answer complete before either child. |
| a04, a20, a21 | Sound movement from one request to ownership, stateful resources and generated work. The resource-state diagram and varying parent counts give clear opportunities for explanation through visible change. |
| a22, a23 | Sound separation of request, logical operation, transaction attempt and external effect. Stable identities and retained evidence connect the cases. Start with the minimal successful protocol before the variations on expiry and uncertain outcomes. |
| a05, a24, a25 | Sound physical model and workload-led index decisions; T1 addresses method and evidence prerequisites. a24's boundary between visible rows, retained versions and reusable space is especially useful. |
| a26, a27 | Strong planned handoff: one shared report, evidence-reading ownership, then one consequential estimate mismatch. This avoids restarting both articles or teaching two independent optimisation methods. |
| a28 | Sound move from isolated executions to a changing population of work. The stable-boundary calculation and independent-arrival comparison are justified by the overload decisions they enable. |
| a06, a29, a30, a31 | Sound staged-change progression. Compatibility and authority precede physical procedures; resumable data work and cutover each have a distinct completion argument. The pause path remains a complete option. |
| a07, a35, a36, a37 | Sound requirements-first operational depth. Security boundaries, capacity budgets and maintenance gates have observable outcomes. T1 clarifies when the common incident method is assumed. |
| a38, a39 | Sound distinction between replica progress, read freshness, write authority and recoverable history. The isolated restore and later selective-repair decision preserve an important teaching boundary. |
| a08, a32, a34 | Sound conditional selection path using common evidence and candidate-specific checks. Keeping PostgreSQL's candidate record in the parent avoids a compulsory second vendor course. SQLite and CockroachDB deepen deployment decisions rather than resetting the expertise target. |

## Optional improvements

### O1 — Give the whole tree a small shared story vocabulary

**Locations:** a00 opening order example; a01 booking introduction; a02 order-and-payment fixture; a03 reservation; a04 order placement.

A single domain is unnecessary, and the current domains are intelligible. A brief teaching note could nevertheless explain the relationship between orders, bookings and capacity reservations, and keep stable entity names within each linked parent/child pair. a13's booking-and-charge fixture inside the order-and-payment SQL branch is a particular place to decide whether the change earns the reader's setup effort. Reuse the parent's fixtures where it does not. The references change examples when a new shape benefits from it, after their original running case has established the method.

### O2 — Commit the highest-value visual contrasts to the relevant briefs

The plans already contain enough mechanism to support effective figures. These are suggested treatments, not a requirement for an interaction in every article:

| Locations | Useful contrast and reader action |
| --- | --- |
| a14 “Combine independent totals…” | Show the two detail sets and paired join rows, then switch to independent aggregation. Let the reader predict each total; preserve equal-valued payments. |
| a16 “Make running and moving frames explicit” | Keep output rows fixed while selecting a row highlights its contributing frame. Toggle a tied timestamp or missing period; separate calculation order from display order. |
| a03 concurrent reservation / a18 coordination row | Step two sessions against a visible capacity invariant. Change one protection choice or insert path and show the allowed wait, abort or final state. Label it as a model. |
| a20 resource-state diagram | Follow a lease through success, cancellation and cleanup failure; keep “business outcome unresolved” distinct from “connection discarded”. A static state diagram may be sufficient. |
| a22 lost response / a23 external success | Hold one operation identity constant while moving a failure marker across commit, external acceptance and completion recording. Show what each observer can establish. |
| a24 physical work / a25 composite keys | Reuse a small table and page map; change row width or key order and count pages, entries and base-row visits separately. Pair the model with clearly separate captured evidence. |
| a29 waiting schema change / a31 cutover | Step the blocking chain or writer-authority timeline. Ask which gate permits the next action; reveal the evidence needed before advancing. |
| a38 replica timeline / a39 recovery boundary | Move transport and replay independently, or choose a restore boundary around a bad change. Show which acknowledged writes or legitimate later changes the choice preserves or loses. |

For each chosen figure, add the question, the state the reader watches, and the conclusion the changed condition supports. Playback alone is not the learning objective. Use a static labelled figure or small table where there is no useful variable to change. Preserve the references' immediate explanation after the figure and their distinction between teaching models and actual runs.

### O3 — Protect the first answer from the verification inventory

**Locations:** a09 numeric/text/time headings; a10 “Make reservation conflicts…”; a26 plan-number interpretation; a34 topology and compatibility checks.

These briefs appropriately demand consequential edge cases and evidence. When allocating the eventual article space, give the ordinary correct case and one revealing failure first; group the remaining boundary checks into a compact table or optional reproducible worksheet after the mechanism is understood. The references do this with the tiny visible index/table model followed by measured scale results and a separate account of where the numbers came from. This suggestion does not remove the planned tests or technical distinctions.

## Recheck boundary

Recheck the amended reading/prerequisite statements and the a02/a14 handoff. Unchanged branches need not repeat this whole-tree review. Figure implementations, accessible controls, rendered layouts, prose economy and the truth of future execution claims belong to the subsequent writing and article-review stages.
