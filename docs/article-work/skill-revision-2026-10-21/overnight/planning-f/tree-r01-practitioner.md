# Practitioner review · tree · Latency percentiles · F-TREE-r01

UTC start: 2026-10-22 01:17:11 UTC  
UTC end: 2026-10-22 01:18:36 UTC

Inputs read: the complete frozen `latency-flow.yaml`, complete standalone `latency-flow-child.yaml`, complete `latency-flow-example.md` and settled commission under `/private/tmp/staycurrent-skills-night-f/`; [fixed manifest](tree-r01-manifest.json); F-02 review skill and practitioner perspective only. All four input hashes match the manifest. Node-planning records, earlier versions/reviews/decisions, candidate conclusions, other experiments and other reviewers' results were withheld. The pre-review authorisation wait is excluded.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Consequential measurement/query claims agree with current primary documentation below; fixture arithmetic and timing rules are internally consistent. |
| 2. Evidence | pass | Finite invented observations, conditional counterfactuals, bucket estimates and model-based inference remain distinct; no native execution is claimed. |
| 3. Coverage | pass | The tree covers every commissioned decision, including retries, timeout selection, cohort edges, lost workers, resets, empty populations, trace selection and generator feedback. |
| 4. Depth, both ways | pass | The reader gets the information needed to produce and challenge evidence without requiring monitoring/statistics knowledge; mathematical and product detail stays tied to a decision. No material missing or unnecessary subject identified. |
| 5. Ownership | pass | Root owns interpretation and causal next steps; child owns producing/auditing evidence. Root's histogram introduction and comparison judgement provide useful answers before the deeper workflow. No subject lacks an owner or receives two full treatments. |

## Assessment

The complete two-article plan can take the stated newcomer to the commissioned practitioner judgement. The root gives a usable dashboard interpretation, direct objective count and next-measurement decision. The child explicitly recalls its prerequisites, then supplies the previously unneeded instrumentation and query vocabulary before use. The paired-stage example stays in the root; query construction, collection loss, interval ownership and offered-work auditing stay in the child. Existing database continuations are optional diagnostic destinations, not prerequisites that conceal missing latency teaching.

Manual arithmetic checks: W0 mean is 77 ms; nearest-rank p95/p99 are 100/400 ms; the worker averages are 1,020/236 ms and neither is pooled p99. The classic pooled-bucket interpolation reaches 500 ms at rank 99, while the truncated layout returns its last finite 200 ms boundary. The threshold fraction remains 95/100. W-retry records one 140 ms operation versus two attempts; W-timeout preserves its known failed caller duration and 9/10 denominator. W-edge's opening/start/terminal/closing reconciliation is 1+2−2=1. W-stages has two stage p95 values of 20 ms but whole-request p95 of 400 ms. W-arrivals' stipulated completion rule gives the declared durations and counts; identical p99 values across its lanes correctly do not establish identical offered work. These are arithmetic checks, not execution receipts.

## Primary sources checked

Checked online on 2026-10-22:

- [Prometheus query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/): classic/native aggregation forms, inclusive `le`, interpolation and highest-bucket fallback; empty histogram output; reset handling, rate-before-sum and range extrapolation. These support the proposed query semantics and its separation from exact W0 deltas.
- [Prometheus histograms and summaries](https://prometheus.io/docs/practices/histograms/): summary quantiles cannot be pooled; classic and native representations; bucket-value error versus summary rank error. The child retains native compatibility and resolution checks rather than assuming renaming creates native data.
- [Prometheus metric and label naming](https://prometheus.io/docs/practices/naming/): seconds as the duration base unit and the cost of each distinct label combination.
- [OpenTelemetry HTTP metrics](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/): the HTTP server duration instrument measures server requests in seconds; it does not by itself supply the outer caller-operation boundary.
- [Python elapsed-time clocks](https://docs.python.org/3/library/time.html#time.monotonic): monotonic-clock differences, wall-clock-update independence and elapsed versus CPU time.
- [OpenTelemetry sampling](https://opentelemetry.io/docs/concepts/sampling/): probability selection differs from latency/error-dependent trace selection. The plan appropriately refuses an unweighted service percentile from selected diagnostic traces.
- [Grafana k6 open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/): completion-dependent arrivals and insufficient generator slots can change generated work. W-arrivals remains a bounded illustrative model, not a k6 result.
- [NIST binomial distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm): under the declared fixed-probability independent model, expected count is Np and zero-slow probability is 0.99^100 ≈ 36.6%; neither result establishes production independence or a sufficient sample size.

## Findings

None. Practitioner-1 remains unused.

## Limits

This is a complete plan review, not article, prose or rendered-media approval. No article, instrumentation, executable fixture, Prometheus query or load generator exists as executed evidence in the supplied inputs; none was run here. Implementation must still verify actual versions, resets/missing-series behaviour, timer terminal paths and rendered controls when commissioned. The root's generic caller/service timeline can be built without inventing a numerical decomposition of q100; any such later decomposition needs settlement as the canonical record requires.
