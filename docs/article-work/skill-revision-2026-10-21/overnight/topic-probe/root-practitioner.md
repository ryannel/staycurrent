# Practitioner review · breakdown · latency root and contextual child stub · latency-root-v1

UTC start: 2026-10-21 21:49:53. UTC end: 2026-10-21 21:50:28.

Inputs read: [root-manifest.json](root-manifest.json), [commission.md](commission.md), and all three immutable files under `snapshots/root-v1`: `docs/coverage/latency-percentiles.yaml` (all six root headings and contextual child stub), `docs/coverage/latency-percentiles-example.md` (complete canonical example), and `docs/article-work/latency-skill-trial/registry.json`. All three SHA-256 values match the manifest. Read the assigned frozen review skill and only `perspectives/practitioner.md`. No planner records, earlier reports, other subjects/candidates or coordinator opinions were read.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Core arithmetic independently recalculated; primary sources support estimator variation, pooling before quantiles, histogram approximation, explicit measurement boundaries and the proposed load-model distinction. |
| 2. Evidence | pass | Constructed windows and future extensions are explicitly illustrative. No deployed service, observed telemetry, executed query or causal release regression is claimed. |
| 3. Coverage | finding | The inferred commission usefully turns the bare topic into practical interpretation and measurement decisions; the root lacks explicit treatment of requests unfinished at a window cutoff (practitioner-1). |
| 4. Depth, both ways | finding | Otherwise appropriate depth: no general statistics, monitoring or tuning detour. The unfinished-request case is necessary missing understanding, rather than another specialist topic (practitioner-1). |
| 5. Ownership | pass | Root owns meaning, budget compliance, aggregation principles and the evidence-based decision; child owns instrumentation, queries, representation error and load-generator mechanics. Reusing the aggregation principle in its implementation is justified. No duplicate full treatment is planned. |

## Findings

### practitioner-1 · medium · root: “Decide whose wait you are measuring”, “Count requests that meet the budget”, and “Make the performance decision”

Problem: The plan requires a five-minute population and every eligible request in the objective denominator, but does not require an attribution rule for requests that cross the window boundary or remain unfinished at its end. The core example explicitly has no unfinished work. The child's uncompleted-work requirement belongs to the scheduled-load example, so it does not give the root's reader this missing interpretation rule.

Effect: During a stall, the reader can inspect a completion-only percentile and timely-success ratio while the slowest requests have not yet entered either count. They must supply their own rule for whether the window describes requests started or requests terminated, and when its budget result is ready to judge. Comparing useful completions and offered demand is helpful, but does not itself settle that denominator. This weakens the promised independent accept/investigate/measure-again workflow in an awkward, ordinary service-owner case.

Suggestion: Require one compact boundary case in the root and carry the same rule into the child. State whether observations belong to a start cohort or terminal-event window, expose outstanding work, and explain the consequence for comparison. For a start cohort, an unfinished request already older than 300 ms cannot become a timely success; a younger pending request may still be unresolved. Do not invent its eventual duration or silently remove it. A terminal-event window can be valid, but the reader must understand its delayed visibility during a stall. No full censoring/statistics lesson is needed.

Evidence: The root headings above, the example's “none is unfinished” restriction, and the child stub's separately scoped pause schedule. This is an inference from the planned population/window rules, not an observed telemetry fault. Google's [Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) supports specifying acquisition boundaries, included requests and aggregation intervals; it does not prescribe one universal cohort rule.

## Grounding and arithmetic

- [NIST: Percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm): ordered ranks, median and differing practical percentile estimators support declaring the teaching convention rather than presenting it as universal.
- [Prometheus: Histograms and summaries](https://prometheus.io/docs/practices/histograms/): confirms why summary quantiles cannot reconstruct a pooled percentile, why histograms can be aggregated, and why a threshold at a bucket boundary differs from an interpolated estimate. Current guidance also supports checking native-histogram/library support rather than prescribing one format universally.
- [Prometheus: histogram_quantile](https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile): confirms aggregation before quantile calculation and representation-dependent interpolation. No query has yet been supplied, so syntax/runtime correctness remains a later check.
- [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/): supports client versus server measurement, distributions over means, explicit indicator definitions, workload classes and user-driven targets. [Implementing SLOs](https://sre.google/workbook/implementing-slos/) supports the commission's practical decision focus; this is not a requirement to add a full reliability-policy course.
- [Grafana k6: Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/): confirms that waiting for prior work couples offered rate to response time, and that suitability depends on the test aim. The child appropriately distinguishes a genuine closed-loop workload from unsuitable independent-demand simulation. The HdrHistogram repository overview was also inspected, but its returned text did not establish the omission claim; it was not used as supporting evidence.

Independent local verification used Python 3.14.5, expanding the frozen counts and selecting sorted position `ceil(p * N)` for p = 0.5, 0.95 and 0.99. Baseline: N=1,000, mean 97.4 ms, percentiles 80/200/200 ms, maximum 2,000 ms, 990 within budget. Changed: N=1,000, mean 101.4 ms, percentiles 80/200/600 ms, maximum 2,000 ms, 980 within budget. Instance results: counts 900/100, p99 80/600 ms, arithmetic average 340 ms, count-weighted average 132 ms, pooled p99 200 ms. The same read-only `python3 - <<'PY'` calculation checked snapshot hashes. These are checks of invented arithmetic, not service execution.

## Limits

This is a complete five-check practitioner review of the fixed root breakdown plus contextual child stub, not a completed tree or article review. The child has no commissioned headings yet; implementability is assessed as a credible brief, not verified instrumentation. No page, rendered figure, controls, live service, load generator or Prometheus fixture was available or run. The timeline, smaller sample, bucket fixture and pause schedule remain explicitly unspecified extensions; their later correctness needs checking when concrete. Sources were checked online during this review and are current documentation, not a frozen Prometheus implementation/version receipt. No build, server, commit, push or publication was performed.
