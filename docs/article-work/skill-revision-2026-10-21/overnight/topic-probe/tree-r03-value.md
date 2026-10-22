# Value review · tree · Latency percentiles · LAT-TREE-r03

Inputs read: the complete current `latency-percentiles.yaml` tree, its complete standalone `latency-percentiles-child.yaml`, canonical `latency-percentiles-example.md`, and commission, bound by [tree-r03-manifest.json](tree-r03-manifest.json). LAT-TREE-r03 manifest binding confirmed once: all four SHA-256 values matched. Also read the archive AGENTS.md, README.md, site direction, review skill and value perspective only. No earlier versions, findings, reports, approvals, decisions, planning records, other candidate cases or agent inventories were consulted.

Scope: fresh complete third-round tree review under fixed D-02 control; all five value checks, rather than a focused confirmation. The nested and standalone child represent one proposed article, not two reader destinations.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Loss if cut | finding | Both articles and their substantive sections provide useful understanding; the child's native-schema teaching detour has little return for the commissioned worked path (value-1). Section losses are recorded below. |
| 2. Overlap | pass | Root owns interpretation, accounting and decision rules; child owns recorder, reconstruction, metric representation and executable query checks. Reused numbers demonstrate implementation rather than another conceptual course. |
| 3. Separate pages | pass | Child earns its page through the complete event/reducer and Prometheus fixture paths. Root finishes a useful release judgement independently. No thin child or further commissioned descendant. |
| 4. Route cost | pass | Typical interpretation/release task: one article, the root. Building or auditing the measurement path from this audience's starting point: two articles, root then child. A merge saves one opening for implementers but makes all interpretation readers encounter the implementation body; no merge recommended. |
| 5. Proportion | finding | The root gives distinct failure modes distinct demonstrations; the deeper child appropriately needs more work. Its detailed native interpolation taxonomy exceeds the value returned by a single classic-histogram implementation (value-1). |

## Loss if cut across the complete tree

Each row covers the named section and its subordinate headings.

| Article / section | Useful understanding lost if cut |
| --- | --- |
| Root as a whole | A newcomer cannot interpret a percentile or choose accept, investigate or measure again independently of tooling. |
| Find p99 among the requests | Rank calculation, mean/median contrast, and the distinction between a tail percentile and maximum or prediction. |
| Decide whose wait you are measuring | Caller versus server/attempt boundaries, eligibility, start versus terminal windows, outstanding work, and request versus user experience. The timeline earns its place by making these boundaries inspectable. |
| Count requests that meet the budget | Outcome-aware success fraction, inclusive threshold, failed/deadline attempts and a decision while durations remain incomplete. |
| When the work changes | A concrete reason pooled p99 can worsen with unchanged within-class performance. This is not supplied by the missing-outcome example. |
| Combine the requests before finding their percentile | Why neither ordinary nor count-weighted averages of p99 work; what distribution aggregation retains and coarse range counts discard. The same-counts counterexample earns its separate display. |
| Check what a tail estimate can support | Separation of exact recorded ranks, sparse evidence about future behaviour, incomplete populations and lost bucket detail; the window/count tradeoff. |
| Make the performance decision | An explicit resolution of the opening comparison and reusable evidence-to-action judgement. This applies preceding cases rather than introducing another curriculum. |
| Child as a whole | An implementable way to produce, reconstruct and inspect the evidence, rather than merely knowing what evidence should mean. |
| Record the whole caller request / Keep starts, outcomes and elapsed time together | The event contract, whole-request timing, eligibility carried from start, terminal validation and the limits of collection completeness. |
| Rebuild the cohort / Select starts / Keep later completions in their original cohort | A reproducible denominator, assessment-time reconstruction, pending bounds and an exact demonstration that later terminations keep their original cohort. The older-start row makes the alternative selection rule visible. |
| Observe terminal durations in Prometheus | The necessary bridge from one recorded request to cumulative metric series and successive scrape samples. Without it, rate and aggregation notation require knowledge the commission does not assume. |
| Export compatible buckets with bounded labels | Executable observation/population contract, bounded identities, aligned buckets and the adversarial health-check gate. The two-request fixture catches a defect a success fraction alone conceals. |
| Combine observations before asking for p99 | Correct query operation order, exporter pooling, per-class/outcome grouping and compatibility/reset conditions. Root arithmetic alone does not tell the reader how to express this path. |
| Keep the budget count more precise than the percentile | A concrete resolution decision, interpolation versus raw rank, an aligned exact threshold classification, and the distinction between terminal-observation ratios and start-cohort results. Retain these; the narrower native detour is value-1. |
| Check the query against a known recording | Expected query outputs and adverse cases, plus the boundary between proving expression arithmetic and proving instrumentation/scrape coverage. |
| Make sure the test offered the intended work | Why a serial generator can suppress intended independent demand; actual waits, lag and unsent work cannot substitute for each other. This supplies a measurement omission not covered by pending requests. |
| Decide whether the measurement supports the change | A measurement handover connecting each implementation defect to the evidence needed before the root's decision can be trusted. |

## Overlap and page boundaries

Root owns the exact rank, failed percentile averages, outcome-aware budget, mix effect, incomplete cohort and conceptual range-loss demonstrations. Child gives short reminders before implementing those rules. It owns cumulative exposition, stored series/sample identities, rate/grouping operations, interpolation, eligibility checks and the runnable evidence. Preserve that ownership: the brief already calls for reuse rather than reteaching. The two closing records have different useful work: root decides from evidence; child identifies what must be fixed to make evidence usable.

The repeated canonical tables are fixture contracts, not automatically repeated prose. The child extends the ten-request example with later outcomes and an older start to demonstrate actual predicates; it does not merely repeat the root's warning. The eligibility fixture and repeated-reading view reuse two requests for different necessary inspections. No cut or merge of these is justified by duplicate understanding. No page merge is proposed, so there is no opening saving to reconcile beyond the rejected one-opening merge described above.

## Findings

### value-1 · medium · Child, “Keep the budget count more precise than the percentile”, native-histogram passage

Problem: after the complete classic-histogram resolution and threshold demonstration, the brief requires teaching custom versus standard exponential bucket schemas, zero buckets and the differing interpolation assumptions. No native implementation or native comparison is commissioned. These extra concepts do not change the concrete query, its expected outputs or the action the reader should take in the worked case.

Effect: an engineer who began without statistical or Prometheus background must learn a second representation's schema taxonomy before reaching the query check, without using it to finish this measurement path. This spends attention beyond the practical return of the commissioned classic example.

Suggestion: retain a compact format boundary: this fixture uses classic histograms; native support depends on the complete stack, syntax differs, and an unaligned threshold can be estimated, requiring an exact outcome-aware counter when exact classification matters. Move the detailed native schema/interpolation taxonomy to an optional primary-source link rather than teach it in this path.

Effort saved: one additional conceptual detour and its schema/zero-bucket/exponential-interpolation definitions; zero page openings saved. Understanding lost: the precise distinctions between native schema interpolation assumptions. Those distinctions are useful when implementing native histograms, but no commissioned example uses them. The worked classic interpolation, compatibility checks, exact-threshold lesson and native format-choice caution remain.

Evidence: the same section explicitly specifies the runnable classic path and says “Avoid a second native implementation or a format survey”; the commission requests an implementable measurement path using Prometheus, not schema coverage. This is a value/proportion finding, not an assertion that the native description is technically false.

## Limits

This is a full value review of plans and their shared constructed example, not of written articles or their realised length. The amount of repetition in eventual prose and actual reading time remain unmeasured. No browser, build, server, service, recorder or query fixture was run. No native execution, real traffic or technical verification is claimed. Source/API accuracy, teaching order and rendered usability belong to their assigned checks; this report judges the planned return on reader effort against the commission. The report alone does not authorise writing or publication.

UTC interval recorded: 2026-10-22 02:14:31 UTC to report completion at 2026-10-22 02:16:08 UTC; manifest/check checkpoint 2026-10-22 02:15:08 UTC. Initial instruction and input reading began before the first clock checkpoint; its exact start was not recorded.
