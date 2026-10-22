# Whole-tree r02 proposed example delta: one observation, repeated readings

Proposed additive teaching view for central settlement; canonical inputs remain unchanged. All inputs and outputs here are constructed specifications. No recorder, scrape or Prometheus query was executed.

Place this view within **Observe terminal durations in Prometheus**, as part of the existing **One termination, two records** diagram, before the bounded-label configuration and aggregation. Reuse the canonical [example record](/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles-example.md), specifically its existing **Excluded health check** fixture, `experiment_id=eligibility-check`:

- `eligible-01`: caller start 0 ms, successful terminal 80 ms, eligible=true, unclassified.
- `check-01`: caller start 100 ms, successful terminal 120 ms, eligible=false, unclassified.

Use the same fresh, isolated event list and histogram state already required for this check. No additional request, arrival, outcome or duration is supplied. The caller exporter is shown with the already used fixture label `instance="caller-a"`, under `job="history-callers"`; that label is a constructed name in this isolated check, not a claim that its state belongs to the baseline's separate caller-a partition. It denotes the caller exporter, not history-1 or history-2. The illustrated scrape configuration supplies exactly these target labels, with no additional stored labels. In a real configuration, include any additional labels when identifying a series; the default instance label may instead be an address.

## Teaching order and stored identities

Explain a time series, metric name, label/value and sample before their notation. A series holds timestamped readings for one metric name and complete label set. Introduce the counter and scrape next: the exporter accumulates totals between resets; a scrape reads the current totals and supplies another timestamped sample. The reading timestamp is not a saved request timestamp.

Remind the reader of the root's histogram, then explain seconds (`80 ms = 0.08 s`), cumulative buckets, their inclusive upper-bound label `le`, observation count `_count` and duration total `_sum` before the update. Unlike the root's non-overlapping ranges, one observation belongs in every cumulative bucket whose upper bound includes it. The classic layout is unchanged: 0.1, 0.2, 0.3, 0.6, 1, 2 and +Inf seconds. Use actual consistent bound spelling in the eventual exposition.

Show these complete identities for the stored series in the table. The exporter supplies the measurement labels; the illustrated scrape configuration attaches job/instance. `_count` and `_sum` have no `le` label.

```text
history_caller_duration_seconds_bucket{job="history-callers",instance="caller-a",request_class="unclassified",outcome="success",le="0.1"}
history_caller_duration_seconds_count{job="history-callers",instance="caller-a",request_class="unclassified",outcome="success"}
history_caller_duration_seconds_sum{job="history-callers",instance="caller-a",request_class="unclassified",outcome="success"}
```

The other six bucket identities share the first line's labels, changing only `le` to 0.2, 0.3, 0.6, 1, 2 and +Inf. Changing outcome or request_class identifies a different series, even when its current value is zero. Neither request identifier nor experiment_id becomes a metric label. Retain the canonical initialisation of every permitted class/outcome combination.

## One observation, repeated readings

Follow `eligible-01`'s validated unique terminal through its audit entry and eligibility gate. One call to `observe(0.08)` changes the success/unclassified totals at the illustrated exporter. All configured upper bounds include 0.08, so each bucket increases by one, `_count` increases by one and `_sum` increases by 0.08 seconds. This is one duration observation updating several series.

For this view only, propose three fabricated successful scrape readings at 10, 90 and 130 ms on the eligibility-check clock. The first reads initialised totals while eligible-01 is pending; the second reads them after its terminal; the third reads them after check-01's excluded terminal. No other observation or reset occurs. This short explanatory schedule does not amend the existing **Synthetic query replay clock** or provide a five-minute rate fixture.

| Series, with the common labels above | Total before eligible-01 terminal | Total after eligible-01 terminal | Sample at 10 ms | Sample at 90 ms | Sample at 130 ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| `_bucket`, `le="0.1"` | 0 | 1 | 0 | 1 | 1 |
| `_bucket`, `le="0.2"` | 0 | 1 | 0 | 1 | 1 |
| `_bucket`, `le="0.3"` | 0 | 1 | 0 | 1 | 1 |
| `_bucket`, `le="0.6"` | 0 | 1 | 0 | 1 | 1 |
| `_bucket`, `le="1"` | 0 | 1 | 0 | 1 | 1 |
| `_bucket`, `le="2"` | 0 | 1 | 0 | 1 | 1 |
| `_bucket`, `le="+Inf"` | 0 | 1 | 0 | 1 | 1 |
| `_count` | 0 | 1 | 0 | 1 | 1 |
| `_sum`, seconds | 0 | 0.08 | 0 | 0.08 | 0.08 |

The stored `_count` series contains samples `(10 ms, 0)`, `(90 ms, 1)`, `(130 ms, 1)`; its final value records one eligible terminal observation. Adding the two readings of 1 would count the same accumulated observation twice. Each of the three example metric identities similarly acquires later samples without changing its identity. The sample interval only brackets the change; it does not preserve the exact 80 ms terminal time. Keep that time in the event record.

`check-01` adds its existing audit terminal entry at 120 ms and no histogram observation. Thus the sample at 130 ms repeats every success bucket/count/sum total; all other permitted class/outcome totals remain zero. Eligibility and outcome are separate: this excluded success must still be skipped. The pending request made no observation at the first scrape. These snapshots preserve the canonical eligible-only versus eligible-plus-excluded outputs, including count 1 and sum 0.08.

## Reuse in the query explanation

Return to these stored identities when introducing `rate` and `sum by (le)`. `rate` uses the sampled history within each selected bucket series first. At an evaluation time, `sum by (le)` then adds those results across selected exporter/class/outcome identities sharing the same upper-bound value; different bounds remain separate. Repeated scrape totals are not the values being summed across time. Keeping request_class in the grouping preserves a separate result for each class and bound; keeping outcome does the analogous diagnostic separation.

Use the existing baseline caller-a/caller-b partition to show cross-exporter pooling. Do not add caller-b observations to eligibility-check to demonstrate it. The existing query fixture, expected interpolation, threshold ratios, resets and window limitations remain unchanged.

## Primary foundations

The planned identity/sample explanation follows [Prometheus's data model](https://prometheus.io/docs/concepts/data_model/). The cumulative update follows its [classic histogram definition](https://prometheus.io/docs/concepts/metric_types/#histogram) and the [Python client's observe API](https://prometheus.github.io/client_python/instrumenting/histogram/). Target labels follow [Jobs and instances](https://prometheus.io/docs/concepts/jobs_instances/); retained grouping labels follow the [aggregation operators](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators). The three reading times are this proposal's invented display inputs, not source claims or execution evidence.
