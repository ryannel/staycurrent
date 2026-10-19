# Practitioner review — b03, round 1

Reviewed the original relational-practice commission, this batch's manifest, and the assigned a06–a08 plans and contexts. No other report or earlier coverage map was read. Findings concern planned decisions and boundaries, not unwritten explanations or unverified execution.

## a06 — Changing a live database

**Verdict: pass. No required repair.**

The plan closes an important practitioner gap between writing valid changes and completing a safe transition. In particular, “Keep old and new applications compatible” requires an authoritative representation and an argument covering concurrent writes; “Switch traffic only when the destination is ready” requires an arrived change boundary and exclusive write authority. These prevent compatibility and cutover from becoming checklists without correctness conditions.

Depth is appropriate to the global goal. The schema, data-job and database-move children enable distinct procedures. Recovery distinctions, measurable completion and retirement remain part of the parent, so the essential judgement does not disappear into those procedures. The explicit allowance for a coordinated maintenance window also avoids making elaborate online machinery the default.

Preserve the promised treatment of delayed jobs, uncertain batch outcomes and valid writes made after a chosen restore point. These are already covered; no extra child is necessary.

## a07 — Running a relational service

**Verdict: pass. No required repair.**

“Define what the service must survive” correctly makes named failures and recovery requirements the basis of operational choices. Dependencies, independent recovery copies, recoverable keys, application validation and measured restoration provide the coverage needed for actual recovery rather than apparent availability.

The topology child is broad, but its boundary is justified by relational operating decisions. It distinguishes local partitioning from distributed ownership and promises promotion, exclusion of the former writer and rejoining procedures; these connect topology to safe action. General consensus expertise is explicitly outside scope. Future recursive breakdown must preserve that limit rather than expanding every mechanism into an independent curriculum.

The incident child earns its place by selecting among prepared recovery tools and setting go/no-go criteria, rather than reteaching their mechanics. Query diagnosis, client recovery and live schema procedures have explicit external owners. No necessary service-operation responsibility is missing at this level.

## a08 — Choosing a relational database

**Verdict: pass. No required repair.**

The selection process contributes practical judgement through testable rejection gates, production-shaped acceptance evidence and an exit requirement. It separates engine, topology and hosting choices, avoiding a common source of misleading comparisons. Cost includes operating effort and recovery obligations, not just a quoted service price.

The three named implementation children are defensible representative checks rather than a mandated vendor syllabus: each is tied to a process/failure boundary and an adoption decision, and the parent permits another candidate when requirements warrant one. Their promised use of common transaction, integration and operational methods keeps the expertise target relational practice.

Retain dated service-tier evidence and the distinction between illustrative models and observed acceptance results. Both are already required. No additional vendor or neighbouring-storage branch is needed for the commission.

## Batch verdict

All three plans pass. No required repair or additional branch is identified.
