# Proposed root r03 extension: same range counts, different p99

Status: proposed for central integration; this file does not alter the settled canonical record. It adds a representation of the two existing complete core cohorts, not another workload or a change to any duration, count, outcome, class or window. Use the canonical [example record](/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles-example.md), including its settled r02 extensions.

## Local root teaching state

**Same range counts, different p99** follows **Two instances, one service** in the root's pooling section. A histogram has already been explained as counts grouped by duration ranges; call each range a bucket at that point. The compact display places this grouped view beside the already taught exact baseline p99 of 200 ms and changed p99 of 600 ms. Both cohorts retain their caller boundary, start-cohort membership and assessment after every caller termination. All requests succeed, with no retries or outstanding requests.

For this conceptual display only, retain three non-overlapping duration ranges. Units are milliseconds; lower bounds are exclusive and upper bounds inclusive where stated. Counts are per range, not cumulative metric buckets. Do not present this display as a particular telemetry format or implemented query.

| Caller duration range retained | Baseline count | Changed count | Sorted positions in each cohort |
| --- | ---: | ---: | --- |
| At most 100 ms | 900 | 900 | 1–900 |
| Greater than 100 ms and at most 1,000 ms | 99 | 99 | 901–999 |
| Greater than 1,000 ms | 1 | 1 | 1,000 |
| Total | 1,000 | 1,000 | — |

Mark rank `ceil(0.99 × 1000) = 990` inside the middle row in both columns. This row combines the baseline's 90 at 200 ms and nine at 600 ms, or the changed cohort's 80 at 200 ms and nineteen at 600 ms. The grouped counts are identical even though the exact raw p99 changes from 200 ms to 600 ms. Once only these range counts remain, they tell the reader that each p99 is **greater than 100 ms and at most 1,000 ms**; they cannot recover either exact selected duration, nor order the two p99 values. The bound is a statement of retained information, not a confidence interval or a computed percentile estimate.

The practical judgement is to withhold an improvement or unchanged-p99 conclusion when only this coarse representation is available. Retrieve raw durations if retained, or collect finer duration detail suitable for the comparison. Choosing an estimator cannot restore the discarded duration positions. This root case needs no interpolated value, tool algorithm, configuration or additional dataset.

The earlier raw core table still supports its exact 990/1,000 and 980/1,000 timely-success results. This coarse display does not alter or contradict those results; it illustrates what would be unavailable from only the grouped view. Do not silently claim its middle row establishes the count within the 300 ms budget. The child's existing explicit 300 ms boundary and outcome-aware counting remain child work.

## Connection to the next section and the child

Return to the same display in **Check what a tail estimate can support**. All requests in both displayed cohorts are settled and counted; no small-sample forecast is needed to demonstrate this fixed-record loss. Restoring raw durations would recover each recorded p99 under the declared rank convention, but would not settle what future traffic will do. More observations can change the evidence about future behaviour, while neither more observations nor a longer window recovers detail already discarded from these particular recorded requests. Contrast this with the separate 100-request illustration and the separately incomplete ten-request cutoff variation. Do not conflate a bucket's duration range with uncertainty about future p99.

The measurement child builds its full **Raw requests to buckets** table from this root case, then owns representation details, estimator choice and arithmetic, metric format/support, resolution configuration, query operations, the 300 ms boundary and executable fixtures. It must preserve the root's conceptual limit even if its eventual implementation retains additional fields such as a duration sum. No root claim says every production histogram consists only of these three counts.

## Central integration requested

Accept these three display ranges, their inclusivity, per-range counts, rank positions and display name into the shared example record. No other shared state is proposed. Keep all canonical core, instance, cutoff, failure/deadline and class-mix values unchanged. The writer should implement a compact static table or equivalent annotated grouped strip using the existing article components; there is no separate page, interactive control or general statistics lesson to commission here.
