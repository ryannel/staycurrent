# Practitioner review · tree · Latency percentiles · LAT-TREE-r02

Inputs read: the complete frozen root (including embedded child), standalone child, canonical example and commission bound by [tree-r02-manifest.json](tree-r02-manifest.json); local AGENTS.md, README/site direction, review skill and practitioner perspective only. Manifest binding checked once: PASS. Embedded and standalone child parsed as equal. Earlier versions, reports, findings, decisions, planning records and other candidate outputs were withheld.

Control: fixed D-02. Scope: fresh full second tree assessment, not repair confirmation.
UTC review interval: 2026-10-22 02:00:34–02:02:07.
Highest severity: critical

## Checks

| Check | Result | Note |
| --- | --- | --- |
| P1 Correctness | finding | Constructed arithmetic, populations, event cutoffs, classic histogram operations and series identities agree; practitioner-2 identifies an unqualified native-interpolation claim. |
| P2 Evidence | pass | Every traffic/count/scrape/replay example is constructed or planned. Expected query results are not claimed as executed; eventual writer must provide versions and output. |
| P3 Coverage | pass | Full tree covers boundaries, logical requests/retries, eligibility, failed/deadline and pending work, cohorts, mix, pooling, resolution, sparse tails and defensible release judgement; child makes recording/query/test validity implementable. |
| P4 Depth, both ways | pass | No missing commissioned decision or unnecessary specialist branch found. Root reaches a decision without Prometheus; child supplies bounded implementation depth and leaves architecture, durable telemetry and resource diagnosis outside scope. |
| P5 Ownership | pass | Root owns interpretation and decisions; child owns recording/reduction, metric representations/querying, resolution configuration and offered-demand verification. Reminders and shared examples carry dependencies without a second full statistical treatment. No further child or unowned required subject found. |

## Whole-tree assessment and evidence

The root independently resolves the complete baseline/changed cohorts, then exposes three different ways evidence can mislead: pending work, failure outcomes and changed class mix. Pooling is established before the child link; the root also establishes loss of duration information before the child supplies interpolation. The final decision returns to these examples rather than requiring child implementation to finish the reasoning.

The child preserves the same eligibility and caller boundary in both paths. Its event reducer selects starts and retains their denominator; terminal histograms cannot recreate those starts. The later-completion extension supplies an older request only in its labelled variation and explicitly contrasts exact event selection with sampled-rate attribution. The newly specified observation/sample view reuses the isolated health-check fixture: one eligible 0.08-second observation updates seven cumulative buckets, count and sum, while three readings add samples to existing identities. The excluded terminal changes only the audit log. Caller-exporter identities are kept separate from history-server assignments and from the baseline pooling fixture.

Independent Python 3.14.5 arithmetic rechecked the expanded constructed core/failure values: means 97.4/101.4 ms; p50 80/80, p95 200/200, p99 200/600; timely counts 990/980; failure count 1,000, duration sum 97.56 seconds and timely successes 988 versus the invalid duration-only 990. Cumulative bucket counts match the example. Direct interpolation gives 918.181818, 457.894737 and 576.315789 ms as planned. This was arithmetic over supplied data, not recorder, service, scrape or PromQL execution. Reading the event and pause tables also confirms 80–90% pending bounds, later 9/10 and final raw p99 600 ms; the serial pause dispatch delivers two starts, four unsent requests and 460 ms lag.

Primary sources checked on 22 October 2026:

- [NIST percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm): ordering, median and differing estimators support declaring the teaching convention.
- [Prometheus data model](https://prometheus.io/docs/concepts/data_model/) and [jobs/instances](https://prometheus.io/docs/concepts/jobs_instances/): full identities, timestamped samples and target labels support the proposed observation/sample explanation.
- [Python Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/), [labels](https://prometheus.github.io/client_python/instrumenting/labels/) and [Summary](https://prometheus.github.io/client_python/instrumenting/summary/): cumulative bounds, observe/count/sum, label initialisation and absence of Python Summary quantiles.
- [Aggregation operators](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators) and [histograms/summaries](https://prometheus.io/docs/practices/histograms/): retained grouping and distribution pooling versus quantile averaging.
- [Query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/): rate before aggregation, reset/extrapolation limits, quantile/fraction interpolation and undefined empty results. [Native specification](https://prometheus.io/docs/specs/native_histograms/) and [scrape configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/): schema distinctions and stack-sensitive native ingestion.
- [Python monotonic clock](https://docs.python.org/3/library/time.html#time.monotonic): elapsed differences rather than epoch/remote-clock comparison.
- [k6 open/closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/): arrival scheduling, completion-dependent suppression and insufficient-worker limits.

## Findings

### practitioner-2 · critical · child, Keep the budget count more precise than the percentile

Problem: The standalone child at lines 169–170, mirrored in the embedded child at root lines 274–275, instructs a general contrast that native histograms “have different query syntax and interpolation”. Native storage alone does not imply a different interpolation rule: native custom-boundary histograms use linear interpolation, as do classic histograms; exponential interpolation applies to non-zero buckets of standard exponential native schemas.

Effect: The planned format-choice explanation would teach the wrong estimator distinction for a supported native representation, particularly a classic histogram converted to native custom buckets. That undermines the reader's practical interpretation of representation and error.

Suggestion: Scope the interpolation contrast to the relevant native schema, or state that interpolation depends on the schema. A brief qualification suffices; no native implementation or format survey is needed.

Evidence: Prometheus [histogram_quantile documentation](https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile) explicitly gives linear interpolation for classic, native custom boundaries and native zero buckets, versus exponential interpolation for standard native non-zero buckets. The [native schema specification](https://prometheus.io/docs/specs/native_histograms/#schema) identifies custom schema -53, including representation of classic histograms as native.

## Limits

This assesses plans and their complete proposed example, not finished prose, rendered figures, runnable recorders or actual stack compatibility. No browser, build, server, service, scrape, promtool or load generator was run. Exact PromQL precision, adversarial fixture execution, actual client/server versions and final native-format advice remain writing-stage verification. The two permitted root examples whose final numbers are not yet specified (the request timeline and separate 100-request illustration) require their planned complete inputs before final article review. No publication or implementation changes were made.
