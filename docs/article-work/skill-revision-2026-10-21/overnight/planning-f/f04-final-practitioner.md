# Practitioner review · complete tree · latency collection · F-TREE-r03

Review interval: 2026-10-22 02:06:23–02:08:16 UTC. Complete independent practitioner challenge under the supplied F-04 final-plan schedule; all five fixed practitioner checks applied to both articles and their boundary. This is not an informed repair confirmation.

Inputs read: the complete canonical `latency-flow.yaml`, standalone `latency-flow-child.yaml`, shared `latency-flow-example.md` and commission in `/private/tmp/staycurrent-skills-night-f`, bound to [tree-r03-manifest.json](tree-r03-manifest.json). All four SHA-256 values matched before and after assessment. Also read the assigned F-04 review skill and practitioner perspective, private AGENTS, README and current site direction. Earlier drafts, reviews, findings, decisions, planning records and other cases were withheld and not consulted.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Declared sample-rank arithmetic, aggregation counterexamples, histogram behaviour, window reconciliation, sampling model and dependency arithmetic withstand checking. Primary sources checked below. |
| 2. Evidence | pass | All fixture values and outcomes are identified as invented arithmetic; the query is a proposed shape, not an observed run. Native execution and rendering are explicitly future work. |
| 3. Coverage | finding | The decisions and awkward cases are broadly covered, but the measurement workflow does not retain the discriminator needed for its own final class-separated comparison: practitioner-1. |
| 4. Depth, both ways | finding | Practitioner-1 is missing measurement understanding. No other necessary mechanism is omitted at this planning level, and no substantive unnecessary depth was found. |
| 5. Ownership | pass | Root owns interpretation, mixture diagnosis, linked-record reasoning and percentile counterexamples; child owns collection, representation and audit. Reminders do not require duplicate full treatments. The omission in practitioner-1 belongs within the child's existing measurement ownership. |

## Findings

### practitioner-1 · medium · child “Keep groups useful and small”, “Choose what information to retain” and “Assemble a comparison you can defend”

Problem: The final worksheet requires matched distributions, counts and errors separated by the two predefined request classes (standalone child lines 143–145; integrated child has the same requirement). Yet the collection design specifies only operation, outcome and worker/deployment grouping; its raw-record option specifies duration/outcome without requiring request class. Both variants have `operation=booking_status`. The shared W-mix record explicitly proposes no new instrumentation label (line 154). No section chooses an alternative retained class field or explains how to obtain that final evidence from the proposed representation.

Effect: A reader can implement the specified aggregate histogram correctly and still be unable to distinguish changed mixture from changed timings within a class. Once the class discriminator has been discarded, adding a selector or regrouping those buckets cannot recover it. They must supply an unplanned collection change themselves before carrying out the promised comparison. The invented W-mix table supplies the answer for that fixture but does not teach how to produce its evidence.

Suggestion: Give the child one explicit collection choice: retain the predefined, bounded class in a suitable instrument, or retain it with complete duration/outcome records and derive the comparison there. Show which field survives collection and grouping, and how class counts reconcile to the pooled population. The W0 query may remain a separate fixture; no extra article or full product tutorial is needed.

Evidence: Canonical root “Compare the same work over the same interval”; standalone child lines 27–36, 57–69 and 138–150; shared example lines 130–154. Prometheus documents labels as the mechanism for preserving useful metric groups, while warning about their series cost: [Instrumentation, “Use labels” and “Do not overuse labels”](https://prometheus.io/docs/practices/instrumentation/). This finding concerns preservation of a required discriminator, not a demand for a particular label name or storage product.

## Technical challenge and sources checked

- Independently recomputed W0's 77 ms mean, raw p50/p95/p99, 95/100 good fraction, worker p99s and both invalid averages; W-stages' stage and whole-request p95s; W-mix's pooled rank 990 and unchanged class distributions; timeout and edge-window counts; arrival/drain reconciliation; and W-overlap's 140 ms sum versus 100 ms critical path. These are illustrative calculations, not executions. [NIST percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm) supports ordered observations and the need to declare the estimator.
- Checked classic/native query aggregation, inclusive `le`, interpolation, the highest-bucket fallback, zero-observation behaviour, rate extrapolation and rate-before-sum against [Prometheus query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/). W0's bucket arithmetic gives 500 ms rather than raw 400 ms; the truncated layout returns 200 ms without measuring the overflow durations. The planned cautions are correct. Checked representation, pooling and threshold-count distinctions against [Histograms and summaries](https://prometheus.io/docs/practices/histograms/).
- Checked shared trace identity and named timed intervals against [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/), and the separate server-duration boundary against [HTTP metric conventions](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/). W-overlap expressly uses one invented elapsed clock and stipulated dependencies; it does not claim cross-host clock synchronisation or prove an engine cause.
- Checked elapsed-clock versus CPU-time guidance against [Python time documentation](https://docs.python.org/3/library/time.html), successful/eligible objective framing against [Google's SLO guidance](https://sre.google/workbook/implementing-slos/), and the distinction between known failed duration and unobserved later completion against [NIST censoring](https://www.itl.nist.gov/div898/handbook/apr/section1/apr131.htm).
- Checked open/closed scheduling and finite generator capacity against [k6 open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/). The plan correctly distinguishes unscheduled arrivals, dropped scheduled work and started-request durations. Checked the independent fixed-probability sampling illustration against [NIST's binomial distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm): the zero-slow probability and expected counts are correct under the declared model.

## Limits

This is a complete plan assessment, not verification of unwritten article prose, live instrumentation, executable queries or rendered controls. No browser, build, server, native query, load generator, commit or push was used. Source documentation was read directly on the web on 22 October 2026; no actual product execution version is asserted. No source/evidence planning records were opened, as required by the assignment. Only this report was written.
