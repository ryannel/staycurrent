# Value review · tree · latency-flow root and child · F-TREE-r01

UTC start: 2026-10-22 01:19:00  
UTC end: 2026-10-22 01:20:10

Inputs read: frozen F-02 review skill and its value perspective; `tree-r01-manifest.json`; the complete archived `docs/coverage/latency-flow.yaml`, `latency-flow-child.yaml`, `latency-flow-example.md` and settled `docs/article-work/latency-flow-trial/commission.md`. All four input hashes match the manifest. The expanded child embedded in the root and the standalone child file describe one continuation, not two pages. Withheld: planning records, prior versions/reviews/decisions, other trials, candidate conclusions and other reviewers' work.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Loss if cut | pass | Each section supplies a distinct commissioned judgement; losses are identified below. No cut proposed. |
| 2. Overlap | pass | Shared concepts have interpretation/reminder and implementation/audit roles, with identifiable owners below. |
| 3. Separate pages | pass | The child has a substantial measurement workflow and distinct practical output; it earns its page. |
| 4. Route cost | pass | One page for dashboard interpretation; two for producing and defending the evidence. No necessary third page. |
| 5. Proportion | pass | The root's six sections cover interpretation and diagnosis; the child's seven main sections and four subsections give the deeper workflow appropriate space without additional articles. |

## Understanding lost if cut

Root:

| Section | Useful understanding lost |
| --- | --- |
| One request has several possible clocks | Identifying what a duration includes, whose experience it measures and which population is summarised. |
| Put the requests in order | Calculating and interpreting a declared percentile, including ties and the slowest work it leaves unseen. |
| Ask how many requests finished in time | Judging the explicit successful-within-threshold objective rather than treating a percentile as an exact compliance count. |
| Compare the same work over the same interval | Detecting mix/window changes and rejecting averages of already computed percentiles. |
| Keep enough information to calculate the answer | Understanding why retained counts support pooling and why histogram estimates differ from exact ranks and boundary counts. |
| Follow the slow requests to a cause | Rejecting summed stage percentiles, distinguishing a symptom from a cause and selecting paired evidence before accepting a change. |

Child:

| Section | Useful understanding lost |
| --- | --- |
| Put the timer around the caller's operation | Auditing actual start/stop paths and distinguishing retry attempts from the complete interaction. |
| Keep groups useful and small | Choosing usable metric groups without unbounded identity labels or assuming absent combinations are observed zeros. |
| Record failures and work that has not finished | Keeping failed durations and eligible failures visible while preserving the unknown successful-completion time. |
| Decide which window owns the work | Reconciling starts, terminal events and pending work instead of silently changing cohorts at the cutoff. |
| Choose what information to retain | Selecting a representation by the questions it must answer and recognising its retention costs. |
| Put resolution where the decision is | Choosing threshold boundaries and sufficient upper range, rather than trusting display precision or overflow fallback. |
| Combine the counts before calculating the percentile | Constructing the concrete compatible aggregation and understanding units, resets and interval estimates. |
| Follow every denominator through the pipeline | Detecting lost workers, selective filters and collection gaps using evidence independent of the histogram. |
| Check how much evidence supports the tail | Separating an exact finite census from inference, and recognising correlated traffic and selected traces. |
| Keep the offered traffic visible during a stall | Auditing missing offered work, generator capacity, drops and drain under the intended arrival model. |
| Assemble a comparison you can defend | Applying the workflow to specific acceptance decisions and naming the evidence still required. |

## Overlap and ownership

The root owns the meaning of observation boundaries, percentiles, objective fractions, pooled distributions and diagnostic limits. The child's opening reminders should remain reminders: W-retry adds timer placement; W-timeout adds an outcome ledger; W-edge adds interval accounting. These are additional decisions rather than repeated definitions.

The root owns the introductory histogram and worker-percentile counterexample. The child owns representation selection, boundary/range choices, the Prometheus aggregation and collection reconciliation. Reusing W0 saves the reader learning another data set while changing the question being answered.

The root owns the qualitative window/count warning and using paired records to investigate a cause. The child owns the sampling calculation, trace-selection audit and offered-traffic accounting. Its last section applies the assembled audit to two concrete defects; the root's final comparison establishes what an existing chart can justify. Keeping those respective roles avoids two complete endings that reteach the same workflow. The briefs already specify these boundaries, so this is an ownership judgement, not a repair finding.

## Complete route and article boundary

| Typical task from the commission | Required route | Page cost |
| --- | --- | ---: |
| Interpret a booking-status chart, check the stated objective and choose the next diagnostic observation | Complete root | 1 |
| Produce and audit trustworthy latency evidence, including aggregation and load-test omissions | Root, then child | 2 |
| Decide whether an improvement claim is defensible with collection, sampling and offered-load evidence | Root, then child | 2 |

The root has a useful independent outcome: the newcomer can question a dashboard and choose evidence without first learning a monitoring query language. The child has its own substantial outcome: produce and defend the evidence. It intentionally builds on the root, and supplies reminders/links rather than requiring previous database articles. Its standalone contribution is therefore substantive, although it is not promised as a prerequisite-free newcomer introduction.

The database continuations are optional diagnosis depth, not missing pages needed to complete the commissioned latency decisions. Returning to the root's cause section from the child is a reference to already taught material, not another required page opening on the sequential route.

Merging the child into the root would save one opening for the full workflow, with no necessary loss of understanding, but would put all timer, representation, query, sampling and generator work into the interpretation page. That makes the one-page interpretation task appreciably harder to navigate. The saved opening does not justify that cost. No thinner child or further split is warranted; no cut or merge is recommended.

## Limits

This is a judgement of plausible plan value against the newcomer-to-practitioner commission. There is no prose, rendered media or measured reading time: actual repetition, pace, section length and successful teaching remain unverified. No technical execution or source audit is claimed by this value review. The allocation does not itself prove eventual expert competence; the planned worked decisions must still be delivered coherently.
