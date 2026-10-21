# Practitioner review · breakdown · latency root and contextual child stub · latency-root-v3

Started UTC: 2026-10-21 22:09:34  
Completed UTC: 2026-10-21 22:10:20  
Candidate: frozen D-02  
Highest severity: none

Inputs read: [root-r03-manifest.json](root-r03-manifest.json), [commission.md](commission.md), and all three named immutable files under [snapshots/root-v3](snapshots/root-v3/): the complete root breakdown and child stub in `docs/coverage/latency-percentiles.yaml`, the complete canonical example in `docs/coverage/latency-percentiles-example.md`, and `docs/article-work/latency-skill-trial/registry.json`. Independently verified all three SHA-256 values against the manifest. Read only the assigned practitioner perspective and review skill. No earlier reports, findings, decisions, planner or repair records were consulted.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Independently recalculated every specified dataset; checked rank conventions, histogram pooling/loss, success-sensitive objectives, boundaries, deadlines and planned omission example against primary sources below. |
| 2. Evidence | pass | Core cohorts and variations are explicitly constructed; no arrival order, service execution, query result or deployed measurement is claimed. The coarse view specifies non-cumulative ranges and only an information bound. Future fixtures are requirements, not observed results. |
| 3. Coverage | pass | Covers all commissioned decisions: boundary/population/window choice, ranks and budgets, failures/deadlines, outstanding work, mix, pooling, duration detail, request counts and release judgement. The child stub supplies an implementable measurement route without pretending it exists. |
| 4. Depth, both ways | pass | Root examples provide the understanding needed to reject plausible misleading evidence. No missing practitioner concept or unnecessary mechanism warrants a finding at this planning stage; tool algorithms, configuration and load-generator mechanics remain appropriately deeper work. |
| 5. Ownership | pass | Root independently resolves interpretation and decision-making, including coarse-range loss. Child owns event fixtures, Prometheus representation/query operations, estimator arithmetic, resolution and coordinated-omission implementation. Reusing the canonical cases supports that hand-off without commissioning duplicate full root treatments. |

## Primary-source checks

- [R stats: Sample Quantiles](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html), Types: the declared ascending order statistic at `ceil(p × N)` agrees with the inverse empirical-distribution convention for the probabilities used; alternatives interpolate or select differently. The plan correctly declares its convention.
- [Prometheus: Histograms and summaries](https://prometheus.io/docs/practices/histograms/), aggregation and quantile-estimation sections: supports combining compatible distribution representations before calculating a quantile, rejecting averaged summary quantiles, and distinguishing bucket-resolution loss from an exact raw rank. The root's three ranges are explicitly conceptual rather than a universal metric format.
- [Google SRE: Implementing SLOs](https://sre.google/workbook/implementing-slos/), good/total-event examples and implementation sections: supports a target based on successful requests within a threshold and choosing measurements close to the relevant experience. The invented target and eligibility rule are declared local choices.
- [Prometheus: Instrumentation](https://prometheus.io/docs/practices/instrumentation/), online-serving systems and labels: supports keeping errors/in-progress work visible, distinguishing client/server measurements, consistent start/end counting and bounded label cardinality.
- [Prometheus Go client Timer.ObserveDuration](https://pkg.go.dev/github.com/prometheus/client_golang/prometheus#Timer.ObserveDuration), documentation displayed for v1.25.0: duration is recorded when observation occurs. A termination-updated histogram therefore does not retain start-cohort membership; this is also a direct consequence of the proposed event schema, not a claim that a query fixture was run.
- [gRPC: Deadlines](https://grpc.io/docs/guides/deadlines/), client/server sections: client deadline expiry fails the call, while stopping spawned server activity remains an application responsibility. The plan correctly avoids inventing the eventual server result.
- [wrk2 README](https://github.com/giltene/wrk2#readme), latency-measurement technique: supports the child's planned distinction between actual and intended starts when reply-gated generation suppresses independent demand. No wrk2 execution or universal workload prescription is inferred.

## Independent arithmetic

Executed a disposable inline Python calculation with Python 3.14.5 (`python3 - <<'PY'`): expanded the listed counts into arrays; sorted and selected index `ceil(p*N)-1`; summed durations, outcome contributions and disjoint ranges. This verifies constructed arithmetic only.

| Case | Independently reproduced result |
| --- | --- |
| Baseline | N=1,000; mean 97.4 ms; p50/p95/p99 80/200/200 ms; maximum 2,000 ms; 990 timely successes. |
| Changed | N=1,000; mean 101.4 ms; p50/p95/p99 80/200/600 ms; maximum 2,000 ms; 980 timely successes. |
| Instance split | Local p99 80/600 ms; arithmetic average 340 ms; count-weighted average 132 ms; pooled p99 200 ms. |
| Failure/deadline variation | 1,000 eligible; 998 successes; 988 timely successes = 98.8%; counting all terminal durations within 300 ms gives the misleading 99%. |
| Cutoff variation | Ages 400/100 ms; 8 known timely successes and at most 9 out of 10, hence final 80% or 90%; completed subset p99 80 ms. |
| Mix A/B | Pooled rank 990 gives 80/600 ms; fixed within-class distributions give unchanged class p99. |
| Coarse view | Both cohorts give 900/99/1 range counts; rank 990 lies in positions 901–999, implying only 100 ms < p99 ≤ 1,000 ms. The 300 ms success count is not recoverable from these counts. |
| Smaller-window requirement | N=100 selects ranks 50/95/99. Its full duration counts are still explicitly future illustration work. |

The coarse-view and incomplete-cohort examples establish different limitations: complete but grouped observations lose duration detail; pending observations leave final durations unknown. Neither is conflated with uncertainty about future requests.

## Findings

None. The supplied next identifier `practitioner-2` remains unused.

## Limits

This is a complete practitioner review of a breakdown, not article acceptance. The child remains an unplanned stub under the commission; executable fixtures, selected implementation versions, query correctness/scrape effects and detailed child headings cannot yet be verified. Timeline splits and the separate 100-request distribution are intentionally not specified yet and require checking when supplied. No article, figure, control, service, load generator or Prometheus query was executed; no build, server, browser, source edit, commit or push was performed. External primary documents were read through the web tool. Planned measurements are not observed execution.

