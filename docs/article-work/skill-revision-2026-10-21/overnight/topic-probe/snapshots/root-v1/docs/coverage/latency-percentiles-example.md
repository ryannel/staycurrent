# Proposed canonical example: the shop's order-history wait

Settled centrally as the canonical example for the D-02 bare-topic trial. Root and child plans remain subject to independent review; no observed telemetry or browser execution is claimed. Propose extensions to the coordinator.

The shop lets a customer request their latest orders. A caller sends one logical history request to an order-history service with instances `history-1` and `history-2`. The service can call a database, but no database schema, lock behaviour or query performance is needed for the percentile calculations. The caller can be a browser or test client; do not equate a count of requests with a count of distinct people.

The core measurement starts when the caller begins a logical request and ends when the caller receives its complete result or terminal failure. In the baseline and changed core datasets every request succeeds, none retries and none is unfinished. All durations below are invented exact values, measured in milliseconds in the teaching model. They are not captures from the relational examples, a hosted shop or a load test.

## Core datasets

Each dataset is a separate illustrative five-minute window containing 1,000 logical history requests. The aggregate counts specify no arrival ordering, concurrency, offered rate profile or causal relationship between windows.

| Duration | Baseline count | Changed count |
| --- | ---: | ---: |
| 80 ms | 900 | 900 |
| 200 ms | 90 | 80 |
| 600 ms | 9 | 19 |
| 2,000 ms | 1 | 1 |
| Total | 1,000 | 1,000 |

For the exact teaching calculation, sort ascending and choose the value at the one-based position `ceil(p × N)`. `p` is a fraction: p99 uses 0.99; `N` is the observation count. Introduce the rule before its notation. This is a declared convention; production tools may interpolate or estimate differently.

| Quantity | Baseline | Changed |
| --- | ---: | ---: |
| Mean | 97.4 ms | 101.4 ms |
| p50 | 80 ms | 80 ms |
| p95 | 200 ms | 200 ms |
| p99 | 200 ms | 600 ms |
| Maximum | 2,000 ms | 2,000 ms |
| Successful within 300 ms | 990 / 1,000 (99%) | 980 / 1,000 (98%) |

The illustrative objective is at least 99% of eligible logical requests succeeding within 300 ms. “Within” includes equality. Eligible means real history requests for the intended operation, excluding explicitly identified synthetic health checks; every such request belongs in the denominator, including failures. The core table contains no failures, so its counts also equal its timely-success counts. An error or timeout extension must add an explicit outcome column and update the denominator; never insert a timeout's unknown eventual completion as an invented successful duration.

This new objective is local to the teaching model. It does not replace the different illustrative workloads and budgets in the database collection.

## Two-instance view of the same baseline

`history-1` handles all 900 requests at 80 ms. `history-2` handles the remaining 100 requests: 90 at 200 ms, nine at 600 ms and one at 2,000 ms. This deliberately uneven placement isolates aggregation; it makes no routing or scaling recommendation.

Under the declared rank convention, instance p99 values are 80 ms and 600 ms. Their arithmetic average is 340 ms; weighting them by their counts gives 132 ms. The pooled p99 is 200 ms. The three calculations use the same requests; only pooling retains the information needed for the rank.

## Permitted extensions needing explicit state

- **One history request timeline:** give a request identifier and ordered caller, server and database intervals. State whose clock and boundary is drawn. It must not imply percentiles of stages add. No exact timing split is proposed yet.
- **Request count and window comparison:** a distinct 100-request dataset for showing rank sensitivity. Do not silently take the first 100 from the count table, which contains no arrival order. Supply its complete counts before calculation.
- **Raw requests to buckets:** use the core values and counts. State bucket inclusivity, units, representation and estimator. An exact raw rank and an interpolated bucket result need separate labels. Choose an explicit 300 ms threshold count when demonstrating exact compliance counting.
- **Scheduled requests during a pause:** keep history requests and the same caller/service roles, but create a separate labelled schedule with intended starts, actual starts, terminal outcomes and unfinished work. These times are illustrative; no stall, concurrency pattern or underlying cause can be inferred from the core distribution alone.

All extensions must preserve the correspondence to the core example or declare the changed condition. Root continuity: no prerequisite article; define latency, distribution, percentile/rank and median before histogram or objective notation. Use “logical request” and “attempt” consistently. Use p99 for request duration and “fraction within 300 ms” for threshold compliance. Writers should share one data module if figures are implemented; none is commissioned here.
