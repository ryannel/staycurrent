# Practitioner review — b08, round 1

Reviewed a24–a27 and their supplied contexts against the original relational-practice goal. No other review report was read. Verdicts concern planned scope and decision coverage; technical demonstrations and captured measurements remain to be verified when written.

## a24 — How stored rows become physical work

**Pass. No required repair.** The investigation links physical mechanisms to evidence that can justify an intervention. Distinguishing retained, reclaimable, reusable and returned space prevents a large file from becoming an automatic rebuild diagnosis. Projection is not confused with shrinking existing pages, and local partitioning is tested by eliminated work rather than presented as a scaling prescription. Row locators, transaction visibility and operational commands have appropriately limited ownership. No storage-engine or partitioning child is necessary.

## a25 — Choosing indexes for a workload

**Pass. No required repair.** The plan goes beyond per-query recipes by requiring competing reads, change cost and constraint dependencies. Composite keys distinguish interval bounds from later tests, while actual engine paths can challenge the baseline model; coverage is not promised to eliminate all base-row visits. Parameterised partial-index eligibility, foreign-key lookup needs and apparent duplicate indexes are consequential practitioner checks. Other families remain a bounded candidate-identification contrast. Use an existing relevant destination for any specialised-search link; the contrast does not justify commissioning a new feature curriculum. No required coverage repair is identified.

## a26 — Following a query through its execution plan

**Pass. No required repair.** Safe collection, reporting units and evidence limits precede diagnosis. Inclusive reporting, loops, parallel overlap and early termination are addressed sufficiently to prevent plausible misreadings from driving changes. The sufficiently-consumed-input condition makes the estimate-mismatch hand-off useful rather than mechanically treating every row difference as bad statistics. Its shared case with a27 preserves a complete diagnostic route while keeping collection/operator interpretation separate from explaining planner choices. No deeper operator or instrumentation branch is needed.

## a27 — Explaining and correcting plan choices

**Pass. No required repair.** The plan distinguishes missing information, inaccurate costing, constrained alternatives and inherently large work; a statistics refresh is therefore a hypothesis rather than a universal remedy. Same-table extended-statistics limits, rare/common prepared parameters and planning overhead make the proposed remedies usable in real applications. The distinction between value dependence and physical correlation prevents two different explanations being collapsed. Scoped controls require an explicit removal condition. The shared case and parent measurement method keep this at diagnostic depth instead of creating an optimiser-specialist syllabus.

## Batch verdict

All four plans pass. No required repairs or additional articles are identified.
