# b08 — adversarial editor, round 1

Reviewed a24–a27 and their supplied contexts against the original relational-practice commission. No context-linked or other review report was read. All four plans pass and need no further descendants.

## a24 — How stored rows become physical work

**Pass.** Page traffic, working-set growth and unreclaimed space are diagnoses a relational practitioner must understand. The sections connect mechanisms to observations or interventions rather than teach storage-engine construction.

- Reuse one page map for the opening and heap/clustered-locality comparison. Fold the locator explanation into that map; do not reconstruct the detailed secondary-index access path owned by a25. Keep engine comparisons only where they change the diagnosis.
- Wide values and retained versions earn their space because visible rows/columns do not explain all physical work. Leave visibility guarantees, cleanup commands and service memory sizing to their owners.
- Keep the reorganisation subsection as a short cost/benefit decision under diagnosis. A second maintenance walkthrough would add procedure without another physical explanation.
- Retain one selective-versus-all-partitions contrast. Pruning is the relevant physical intervention; partition-key taxonomies and lifecycle/distributed placement procedures would exceed this task. Cutting those loses specialist breadth, not the ability to test whether partitioning removes work.
- The ending should resolve the same investigation using the parent's comparison method, not introduce another benchmark design lesson.

## a25 — Choosing indexes for a workload

**Pass.** Each main section changes candidate selection or evaluation. The workload's competing reads and writes prevent a single successful lookup from becoming a universal recipe.

- Keep traversal, key order and coverage on the same order-history access path. Related-row probes and alternate optional filters should be compact competing requirements, not independent query tutorials.
- Eligibility deserves separate attention from hypothetical key usefulness. Partial/expression cases should reuse the actual lookup and active subset; omit unrelated transformed-query examples.
- Make the other-family contrast optional and use at most one. If no current access requirement needs it, omit it entirely. The lost understanding is an additional access-method example; the reader still knows to seek a supported candidate when B-trees cannot meet the need. Do not create a family catalogue or specialised-search branch.
- Keep index obligations and the final retain/revise/remove decision. Reuse plan-reporting conventions from a26, statistics diagnosis from a27 and the common measurement method. Live construction/removal remains a linked procedure, not an extra lesson here.

## a26 — Following a query through its execution plan

**Pass.** The expanded plan still serves a distinct reader task: establishing what the plan and its reported measurements actually show. Access paths, join work, accumulation/spills, reporting units and incomplete/parallel execution are common sources of incorrect diagnosis.

- The shared case should be defined once in its case record. In this article, give the minimum context needed to read it; a27 must resume that record rather than rebuild the query.
- Operator fragments should explain the evidence needed for the investigation. Keep only small contrasts for the three join methods, and Materialize/Memoize only where the captured plan or necessary alternative uses them. A node catalogue would add reading without another decision.
- Reuse one annotated numeric legend for loops, inclusive figures and timing/buffer limits across the later fragments. The parallel variant needs only the additional reporting/overlap distinctions; avoid a second full walkthrough. Early termination should explain why an apparent row mismatch may be inconclusive, not begin the statistics lesson.
- The final evidence ledger should hand consequential estimate discrepancies to a27. It can complete one observed-work intervention locally, preserving value even for a reader who does not need optimiser diagnosis. No additional collection/runbook or indexing curriculum belongs here.

## a27 — Explaining and correcting plan choices

**Pass.** This is now a genuinely different task from a26: identify why the chosen route was based on inadequate information or an unsuitable planning assumption, then test the corresponding correction.

- The opening appropriately resumes the first consequential mismatch. Keep the numerical estimation model compact and attached to that mismatch; do not reproduce operator definitions, plan notation or a general cardinality-estimation syllabus.
- “Find which information is missing” and “Match the remedy” should use the same statistics inspection and changed estimate. Present stale data, missing skew and supported dependencies as discriminating hypotheses, not three complete independent tutorials.
- The rare/common parameter comparison earns its section because it tests the application's preparation path. Reuse the same query, and leave driver APIs/session lifetime to integration. No plan-cache or optimiser sub-branch is justified.
- Keep bounded-search/cost limitations as the final decision boundary. A scoped control is an experiment with a removal condition, not a hints catalogue or an invitation to inspect search algorithms. Reuse the parent's workload acceptance criteria rather than repeat benchmarking instructions.

## Plan-reading/plan-choice consolidation decision

**Retain a26 and a27 separately.** A reader investigating a spill, repeated work or misleading inclusive timings needs a26's evidence interpretation without necessarily needing a statistics intervention. A reader who already has a trustworthy plan discrepancy needs a27's targeted hypothesis and remedy. Their shared case, one notation owner and explicit hand-off make those separate entry points useful. Merging would combine two substantial investigations and make either task harder to find; removing either would lose a practical capability. There is no justification to split them further by operator, statistics feature or engine.
