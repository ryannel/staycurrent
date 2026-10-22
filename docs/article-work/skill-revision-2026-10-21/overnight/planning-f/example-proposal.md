# Proposed shared example: workshop booking-status requests

Provisional, for central settlement before child planning. This is not the canonical example record and does not mutate the published relational example.

The existing workshop service supplies the familiar setting. Tenant `t4` organises Repair basics, session `s7`; Ada is customer 42 and booking `b17` refers to that session. These are reminders from published RL76, not prerequisites. The latency collection reads booking status and does not consume seats or create orders. Its independent read-attempt identifiers `q001`–`q100` must not be confused with the published purchase identity `r81`.

A caller issues a booking-status request, the service may wait for a database connection, reads status and sends a reply. Core observations time caller start to complete reply, in milliseconds, using one elapsed-time clock. Other timers are explicitly named subsets or separate observers. No WAN topology or native engine speed is implied. Database row contents and available seat counts remain unchanged.

## Core W0: a finite invented window

W0 is the named observation interval from 12:00:00 inclusive to 12:05:00 exclusive on an illustrative day. Its 100 attempts all start and complete in the interval, succeed, and have no retries. There is no expiry before any observed completion. The frequency table does not specify arrival order, throughput bursts or causes.

| Read-attempt identities | Count | Caller duration |
| --- | ---: | ---: |
| q001–q090 | 90 | 40 ms |
| q091–q095 | 5 | 100 ms |
| q096–q099 | 4 | 400 ms |
| q100 | 1 | 2,000 ms |

For all exact sample figures, sort durations and select rank `ceil(p × N)`, one-based, with `0 < p <= 1`. Thus p50 = 40 ms, p95 = 100 ms, p99 = 400 ms; maximum = 2,000 ms and arithmetic mean = 77 ms. At or below 200 ms, 95/100 attempts qualify. The invented objective is 99% of eligible caller operations returning a successful response in at most 200 ms over the stated interval. All W0 attempts are eligible and one attempt equals one caller operation, so this window misses the target. Neither the objective nor timings are a production recommendation.

## Extensions using the same observations

- **Two-worker partition.** Worker A receives q001–q090; worker B receives q091–q100. They are disjoint and exhaustive, use the same observation boundary and window, and are artificially uneven to reveal aggregation. Their exact p99 values are 40 and 2,000 ms. Pooled exact p99 is 400 ms; the average is 1,020 ms and the count-weighted average is 236 ms. This is not an observed routing policy or a worker-performance comparison.
- **Bucket table.** Proposed inclusive cumulative upper bounds in ms are 50, 100, 200, 500, 1,000, 3,000 and +infinity; W0 cumulative counts are 90, 95, 95, 99, 99, 100 and 100. Keep cumulative counts distinct from non-overlapping range counts. The 200 ms boundary preserves the direct 95/100 threshold fraction; quantile interpolation may still differ from the exact ranked values. Express matching Prometheus bounds in seconds and use a new illustrative metric name, not an assertion about existing instrumentation. Both workers use identical boundaries. A cumulative counter's value is not automatically the W0 count: later examples must construct or query the relevant interval deltas explicitly.
- **Caller-and-service timeline.** The writer may decompose q100's 2,000 ms into named intervals, but must propose those values centrally first. Do not retrofit an unobserved queue, engine cause or network delay into the core table.

## Separate, clearly labelled counterfactual windows

These are not extra W0 observations and must never be merged into its counts.

- **W-timeout.** An observation-policy comparison introduces a 1,000 ms caller deadline for otherwise comparable work. Keep a caller timeout as a 1,000 ms observed failed duration and its successful-response completion time unknown; do not replace it with a fabricated completion or delete it from the eligible denominator. A matched artificial timeline may stipulate a service completion later, but only as separate service evidence. Do not claim merely changing a deadline reproduces the same production behaviour.
- **W-stages.** A separate 100-attempt paired table has 90 requests with stage A = 20 ms and B = 20 ms, five with A = 380 ms and B = 20 ms, and five with A = 20 ms and B = 380 ms. All stages run serially with no overlap or uncounted gap. Stage A and B each have exact p95 = 20 ms; whole-request p95 = 400 ms, not 40 ms. Here A is connection wait and B is remaining service work, wholly stipulated; this table supplies no observed cause. Its full-request values differ from W0 by design.
- **W-arrivals.** Reserve a scheduled-versus-completion-driven arrival timeline for the child. Its planner proposes times, generator capacity and completion/drain rule centrally before use. Its purpose is to expose missing offered work during a stall, not predict a real queue or assert that one test model fits every workload.
- **Sampling illustration.** An independent, stationary model in which each request has a 1% chance of belonging to a chosen slow category gives a probability `0.99^100`, about 36.6%, of seeing none in 100 draws. This is separate from W0's finite census, not a confidence interval for W0 p99, a minimum sample-size guarantee or a model of correlated production bursts.

Use the names caller operation, attempt, worker A/B, W0, W-timeout, W-stages and W-arrivals consistently. Introduce technical names before controls/captions use them. Any future figures sharing these values should import one data module after implementation is commissioned. No such module or executable model exists in this assignment.
