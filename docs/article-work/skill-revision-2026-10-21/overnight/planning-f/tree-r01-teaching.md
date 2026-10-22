# Teaching review · tree · latency collection · F-TREE-r01

UTC start: 2026-10-22 01:17:18. UTC end: 2026-10-22 01:19:58.

Inputs read: frozen F-02 review skill and teaching perspective; [manifest](tree-r01-manifest.json); complete frozen `docs/coverage/latency-flow.yaml` (root and embedded child), `latency-flow-child.yaml`, `latency-flow-example.md`, and settled `docs/article-work/latency-flow-trial/commission.md`. All four content hashes match the manifest. Read the three complete reference-article sources (Sequence diagrams, Indexes, Storage and durability), including their figure descriptions, tables and listings, with supporting figure/component text. No planning records, prior versions, reviews, decisions, experiment/audit conclusions, other reviewers' results or coordinator opinions were consulted.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Starting point | pass | Named timing events precede observations and populations; ordered durations precede quantiles; the child introduces instruments, labels, counters, scrapes and query vocabulary before their use. No earlier database reading is required. |
| 2. Order | pass | Boundary → ranks → objective → compatible populations → retained information → causes is a sound root route. The child moves from recording an operation to retaining, combining, auditing and judging its evidence. |
| 3. Examples | finding | W0 carries ranks, objectives, worker pooling and buckets; independent retry, timeout, edge, stage and arrival fixtures preserve awkward cases. Changing workload mix has no comparably worked case: teaching-1. |
| 4. Showing | finding | The hard rank/bucket distinctions, serial-stage counterexample and child accounting steps have specified figures or worked tables. The population selector lacks a specified changing-mix demonstration: teaching-1. |
| 5. Judgement | finding | Most decisions terminate in usable questions and next evidence. Distinguishing a change within an operation from a change in its mixture remains an instruction rather than a worked judgement: teaching-1. |
| 6. Gradual exposure | pass | The root teaches how to question a chart before offering the measurement workflow. The child explicitly recalls the root's boundary, percentile convention, histogram and objective; it owns instrumentation and query depth. Root diagnosis remains in the root, with optional database continuations. |
| 7. Placement of additions | pass | Every named device has a useful owner and a motivated place in the route; individual assessments follow. |

## Whole learning journey and outcomes

The root stands alone as an introduction to interpreting an existing dashboard. It specifies a request timeline, exact ranked sample and threshold decision before aggregation or diagnosis. It does not require the reader to learn Prometheus to understand p99. The continuation's opening reminder is sufficient for a reader arriving from that root, and its return to the root's cause section avoids making database internals a prerequisite.

The collection plans all commissioned outcomes: observation/population definition; sample percentiles and hidden extremes; threshold objectives alongside errors and counts; worker/window and stage aggregation traps; representation, grouping, resolution and a concrete query; missing/unfinished/selected work; sample support and generator feedback; and a conditional performance comparison with next observations. One outcome needs a concrete planned demonstration: changed mixture versus changed constituent work (teaching-1).

The references' relevant teaching pattern is maintained: introduce an ordinary operation, change one condition, show the resulting state or count, then use that change to support a decision. W-arrivals is particularly useful despite its equal lane p99 values: its point is the different offered populations, and the fixture explicitly prevents the reader from assuming coordinated omission must always lower the displayed p99.

## Placement of named devices

| Device | Assessment |
| --- | --- |
| Root rank strip and frequency table | Improves the explanation; belongs in “Put the requests in order”. Ordered positions, ties and the unreported maximum are available before estimator qualifications. |
| Root bucket table | Improves the explanation; belongs after the fixed-population pooling problem. It supplies the information that percentile scalars have discarded. Exact ranks, estimated quantiles and exact boundary counts are explicitly separated. |
| Root W-stages paired table | Improves the explanation; belongs in the root's cause section. It makes different slow requests visible instead of asking readers to accept a prohibition on adding p95s. The single-request sequential/concurrent explanation is correctly required before aggregate interpretation. |
| W-retry timeline | Improves the explanation; belongs at the child's start. One operation around two attempts and backoff prepares the reader to choose an observer and denominator. |
| Outcome ledger | Improves the explanation; belongs immediately after timer placement. Known failed duration and unknown successful completion are distinguished before discussing unfinished work. |
| W-edge timeline and reconciliation | Improves the explanation; belongs with outcomes before retention/query decisions. It shows why equal counts need not mean equal cohorts and gives pending work a visible place. |
| Boundary-and-range table | Improves the explanation; belongs under representation choice. It ties resolution to the 200 ms decision, then exposes unresolved overflow rather than treating displayed precision as knowledge. |
| Worker bucket worksheet and query | Improves the explanation; belongs after representation and boundary choices. The worksheet supplies mergeable counts before the inside-out query explanation; rate extrapolation and illustrative arithmetic stay distinct. |
| Collection audit | Improves the explanation; belongs directly after aggregation. The independent caller total exposes missing B even when retained buckets reconcile internally. This is the natural point to revisit the objective denominator. |
| Tail-support and sampling-policy tables | Improve the explanation; belong after establishing what was collected. They separate a finite census, representation error and inference about later traffic without requiring a statistics detour. |
| W-arrivals three-lane timeline | Improves the explanation; belongs after cohort/drain and evidence-support teaching and before the final test comparison. Scheduled, started, dropped, terminal and pending work have already acquired meanings. |
| Final evidence worksheet | Improves the explanation; belongs at the end. It gathers previously taught choices and tests two misleading improvements, then asks for the next evidence. It is an application of the route rather than an attached checklist. |

## Findings

### teaching-1 · medium · root, “Compare the same work over the same interval”

Problem: The brief asks the writer to show how operation mix changes a population, but the named demonstration is W0's fixed two-worker partition plus a window/group selector sketch. The canonical fixtures specify no before/after mixture with unchanged constituent timings. The worker arithmetic demonstrates that averaging percentiles loses information; it does not demonstrate how the pooled percentile can change solely because the proportions of different work change. The child later mentions changing mix in a sampling-policy table and lists representative mix in its final worksheet, without supplying that missing comparison.

Effect: An intelligent newcomer can learn to reject averaged p99s yet still has to construct the decisive comparison themselves when deciding whether an operation became slower or the service handled more slow kinds of work. This weakens the root's independent dashboard-reading task and the commission's explicit changed-workload-versus-changed-operation outcome.

Suggestion: Give the existing selector sketch a small, separately labelled worked mixture case: two request classes retain the same within-class timings across two intervals, their counts change, and the pooled percentile changes. Show the class counts and within-class comparison beside the pooled result, then choose the next view to inspect. Keep this with the root's population explanation and let the child's final worksheet refer back to it; no new article or change to W0 is needed.

Evidence: Frozen `latency-flow.yaml` lines 41–49 specifies the fixed worker partition and selector; the canonical example's W0 extensions fix one successful booking-status population and its worker/bucket representations. `latency-flow-child.yaml` lines 110–123 and 137–150 add sampling-policy and final-comparison requirements but no changing-mixture fixture. Commission outcome 3 explicitly requires distinguishing changed workload mix or measurement boundary from a changed operation.

## Limits

This is a complete teaching review of planned progression and proposed media, not an assessment of finished prose or rendered controls. Reference figures were read through source descriptions, tables/listings and supporting component text; no browser, server, build or control playback was used. No native query, instrumentation or load-generator execution is claimed or assessed. Technical verification belongs to the separately commissioned practitioner perspective. Only this report was written; plan and example inputs were not edited.
