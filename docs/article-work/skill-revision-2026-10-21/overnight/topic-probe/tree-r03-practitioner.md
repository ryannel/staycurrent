# Practitioner review · tree · latency-percentiles root and child · LAT-TREE-r03

Inputs read: complete frozen inputs in [tree-r03-manifest.json](tree-r03-manifest.json), including commission, root with its embedded child, standalone child and canonical example; local AGENTS.md, review skill and practitioner perspective, README and site direction. SHA-256 binding confirmed once: all four frozen inputs matched. Embedded child and standalone child also compare equal as parsed YAML.

Scope: fresh independent full third tree review under unchanged D-02 control, covering all five checks. No earlier drafts, findings, reports, approvals, decisions, planning records, other candidate cases or coordinator opinions were consulted. This is not a focused confirmation.

Highest severity: none

UTC intervals: input reading and full review began 2026-10-22 02:11:23 UTC; primary-source checks and independent arithmetic completed by 2026-10-22 02:13:28 UTC. Report prepared immediately afterwards.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Checked consequential percentile, Prometheus, clock and offered-demand claims against the primary sources below; recalculated every supplied numerical case. |
| 2. Evidence | pass | Core sets, extensions, scrape readings and counter replay are explicitly constructed. Expected outputs are specifications; eventual recorder and promtool runs must supply actual versions and output. No unrun service or query is presented as observed. |
| 3. Coverage | pass | Covers defined populations/boundaries/windows, pending work, failed outcomes, class mix, invalid percentile averaging, representation loss, sparse evidence and an implementable recording/query path with adversarial checks. |
| 4. Depth, both ways | pass | Root completes the performance judgement without Prometheus. Child gives sufficient recorder, reducer and metric detail to reproduce it, with brief native-format context and a bounded demand experiment; neither promises production telemetry architecture or causal diagnosis. |
| 5. Ownership | pass | Root owns statistical meaning and decisions; child owns recording, cohort reconstruction, exposition, aggregation/interpolation, execution evidence and generator validity. Shared examples connect these responsibilities without assigning incompatible populations to one result. |

## Technical and arithmetic evidence

Primary sources checked on 22 October 2026:

- [R sample quantiles](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html): the declared nearest-rank calculation is consistent with the inverse empirical-distribution convention for the positive probabilities used; alternative estimators exist.
- [Prometheus histograms and summaries](https://prometheus.io/docs/practices/histograms/) and [query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/): aggregate distributions before estimating quantiles; keep classic le grouping; apply rate before aggregation; distinguish exact bucket classification from interpolation and scrape-window estimation. The proposed linear/custom/zero-bucket versus exponential native interpolation distinction matches the current documentation.
- [Data model](https://prometheus.io/docs/concepts/data_model/), [metric types](https://prometheus.io/docs/concepts/metric_types/), [jobs and instances](https://prometheus.io/docs/concepts/jobs_instances/) and [aggregation operators](https://prometheus.io/docs/prometheus/latest/querying/operators/): metric plus complete labels identifies a series, timestamps identify successive samples, classic buckets are cumulative and inclusive, and grouping retains only specified dimensions. The exporter role is distinguished from the history-service instances.
- Python client [Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/), [labels](https://prometheus.github.io/client_python/instrumenting/labels/) and [Summary](https://prometheus.github.io/client_python/instrumenting/summary/): configurable buckets and observe API support the planned path; labelled children need initialisation; Python Summary does not calculate local quantiles.
- [Python monotonic clock](https://docs.python.org/3/library/time.html#time.monotonic): elapsed differences are appropriate; its undefined epoch cannot supply UTC membership or remote-clock subtraction.
- k6 [open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/): closed demand can fall as responses slow; arrival-rate execution still requires free workers and checks for unsent work.

Independent inline `python3` arithmetic, Python 3.14.5, expanded each supplied duration/count pair and used `sorted(xs)[ceil(p*len(xs))-1]`, sums and cumulative `x <= bound` counts. This was arithmetic verification, not execution of the planned recorder or queries.

| Case | Recomputed result |
| --- | --- |
| Core | Means 97.4/101.4 ms; p50 80/80; p95 200/200; p99 200/600; maximum 2,000/2,000; timely fractions 990/1,000 and 980/1,000. |
| Pooling and mix | Local p99 values 80/600; ordinary and weighted averages 340/132 versus pooled 200 ms. Mix A/B pooled p99 80/600 with unchanged within-class distributions. |
| Failures | 988 timely successes/1,000; duration-only count 990; all-outcome sum 97.56 s and success sum 97.24 s. All cumulative and outcome-sliced bucket totals reconcile. |
| Incomplete and later cohorts | Initial bounds 80–90%; completed subset p99 80 ms. Extended first terminal set p99 150 ms; settled original cohort 9/10, p99 600 ms; later terminal set 1/2, p99 600 ms. Empty later start cohort is undefined. |
| Resolution | Coarse interpolated p99 918.1818 ms in both sets; decision layout 200/457.8947 ms; finer changed estimate 576.3158 ms. None restores discarded raw values. |
| Eligibility and samples | One eligible 80 ms terminal gives count 1, sum 0.08 s and every listed bucket 1. Excluded 20 ms success changes audit entries only. Repeated 0,1,1 scrape readings are not three request observations. |
| Pause | Independent waits 560,460,360,260,160,80 ms give 3/6 timely. Serial path has two starts, four unsent requests and a pending age of 40 ms at 600; settled timely result 1/2 and second-dispatch lag 460 ms. |

The synthetic query replay applies the same counter-change multiplier to all selected non-zero series, so its expected ratios and proportional ranks are consistent on paper. Native evaluation remains future work.

## Findings

None. No finding number assigned; practitioner-3 remains the next available number.

The planned reader can reject a healthy-looking completion subset, an outcome-blind budget fraction or averaged p99, and can choose better evidence when duration detail or matched workload is missing. The child supplies each implementation hand-off while retaining the root's caller boundary and eligible-start objective. There is no missing commissioned subject or duplicate full owner.

## Limits

This judges plans and supplied constructed data, not finished prose, rendered controls, instrumentation coverage or production suitability. No browser, build, server, service, recorder, Prometheus query or load generator was run. No native-query result or stack support claim was verified by execution. The 100-request illustration and individual-request timeline still require explicit data before eventual calculation; their briefs already require that settlement. Future implementations must produce the prescribed execution evidence and validate their real client/server/storage configuration. No content, skill or publication state was edited; only this report was written.

