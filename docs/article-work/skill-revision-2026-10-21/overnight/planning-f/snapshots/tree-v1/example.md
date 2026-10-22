# Canonical shared example: workshop booking-status requests

Settled centrally for provisional child planning under F-02. This canonical record does not mutate the published relational example; all values remain illustrative and subject to complete-tree review.

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


# Settled child fixtures

Status: centrally settled provisional-tree fixtures for F-02 complete-tree review. Canonical source: `/private/tmp/staycurrent-skills-night-f/docs/coverage/latency-flow-example.md`. These extend the current canonical record without changing W0. Every value below is invented. Tables state arithmetic or planned fixture expectations, not execution results.

The workshop booking-status read remains the operation. Tenant `t4`, customer 42/Ada, booking `b17` and session `s7` are unchanged; no seats, orders or rows change. Preserve W0, q001–q100, worker A/B, caller start to complete reply, milliseconds in explanation and seconds in the proposed metric. Independent fixtures use their own identities and relative elapsed offsets; none are additional W0 observations. No q100 decomposition is proposed.

## W-retry: one caller operation, two attempts

Independent fixture `retry-op01` starts at 0 ms and succeeds at 140 ms. Attempt `retry-a01` runs from 0 to 80 ms and ends in an error. Backoff occupies 80–100 ms; attempt `retry-a02` runs from 100 to 140 ms and succeeds. There are no uncounted gaps, expiry or concurrent attempts. These timings stipulate behaviour, not a recommended retry policy.

The operation timer records one successful 140 ms observation; attempt timers record one 80 ms error and one 40 ms success. One eligible caller operation is good under the illustrative successful-within-200-ms rule. Two attempts are a different denominator; counting fast errors as good is invalid. The named two-level timeline has separate lanes for caller operation, attempt 1, backoff and attempt 2.

## W-timeout: proposed concrete population

This instantiates the canonical counterfactual timeout window rather than modifying W0. Ten independent caller operations `timeout-op01`–`timeout-op10` start at relative 0 ms in an interval `[0, 2,000)` ms. Each has one attempt. Nine succeed at 40 ms; `timeout-op10` has an observed caller timeout at its 1,000 ms deadline. All caller operations therefore reach a terminal event inside the interval. No service completion is stipulated for the timed-out operation; whether and when its work stopped is unknown.

For the declared nearest-rank convention: success-only p99 = 40 ms on nine observations; all-terminal caller-duration p99 = 1,000 ms on ten. The good fraction is 9/10, including the failed operation in the eligible denominator. The latter duration is a known failed caller duration, not a successful-completion latency. Do not describe the 1,000 ms deadline as the 200 ms objective or treat this population as a re-execution of W0.

## W-edge: interval membership and in-flight work

Independent fixture, elapsed offsets in ms, observation interval `[0, 5,000)`. No retries, deadlines, errors or new starts after 5,000 ms. Continue observing existing work to a drain cutoff of 6,000 ms.

| Caller operation | Start | Terminal success | Caller duration | Relation to the interval |
| --- | ---: | ---: | ---: | --- |
| edge-op00 | -50 | 50 | 100 | In flight at opening; terminal event inside |
| edge-op01 | 4,900 | 4,940 | 40 | Starts and finishes inside |
| edge-op02 | 4,990 | 5,190 | 200 | Starts inside; still in flight at closing |

Opening in-flight = 1; interval starts = 2; interval terminal events = 2; closing in-flight = `1 + 2 - 2 = 1`. The terminal-event cohort has durations 100 and 40 ms. The started cohort has one 40 ms completion and one pending operation at closing; after the specified drain its durations are 40 and 200 ms. Matching count totals of two do not make these cohorts identical. At the closing instant `edge-op02` has age 10 ms, not a completed duration of 10 ms. It cannot be inserted into the completed histogram yet. Cohort membership must be explicit in the named timeline and reconciliation table.

## W0 metric and audit worksheet

New illustrative caller-operation histogram name: `workshop_operation_duration_seconds`. It is not an existing instrument or the OpenTelemetry HTTP server instrument. Bounded labels: `operation="booking_status"`, `outcome="success"|"error"|"timeout"`; worker A/B distinguishes the partition for the aggregation example. An attempt instrument, if shown, needs a separate name and boundary. Request, booking, customer and trace identities stay in diagnostic records. Two workers × three possible outcomes gives six possible label groups for one operation, before classic bucket/count/sum series; W0 populates only success groups. An absent group is not automatically a measured zero.

For W0's stated interval, the stipulated inclusive cumulative bucket increments are:

| Upper bound (seconds) | A delta | B delta | Pooled delta |
| --- | ---: | ---: | ---: |
| 0.05 | 90 | 0 | 90 |
| 0.1 | 90 | 5 | 95 |
| 0.2 | 90 | 5 | 95 |
| 0.5 | 90 | 9 | 99 |
| 1 | 90 | 9 | 99 |
| 3 | 90 | 10 | 100 |
| +Inf | 90 | 10 | 100 |

Each worker's count increment equals its +Inf increment. These are known invented interval increments; a live cumulative counter value is not an interval count. Real collection must derive the window with known boundaries and account for resets, unavailable samples and extrapolation. The proposed source-backed query shape, to be explained and later version-checked before any execution claim, is:

```promql
histogram_quantile(
  0.99,
  sum by (operation, outcome, le) (
    rate(workshop_operation_duration_seconds_bucket{
      operation="booking_status"
    }[5m])
  )
)
```

The illustrative native equivalent uses the base metric without `_bucket` and `sum by (operation, outcome)` around `rate(...)`; it requires native instrumentation and a supported compatible schema, not reuse of classic float series by renaming them. Define those terms before displaying either expression. Keep the seconds result distinct from its displayed milliseconds. W0 contains only successes; for mixed populations, retain outcome distributions and use all eligible outcomes for the objective denominator.

Arithmetic on the exact pooled delta table gives classic linear-interpolation p99 = 0.5 s (500 ms), while ranked raw W0 p99 is 400 ms. This is not an executed PromQL result and does not claim a real five-minute rate query recovers exactly those deltas. A direct 0.2 s boundary count gives 95/100. Omitting that boundary leaves only 95 at 0.1 and 99 at 0.5, so the fraction at 0.2 is unresolved between 95% and 99%. A deliberately insufficient classic layout `[0.05, 0.1, 0.2, +Inf]` retains all 100 counts, five in the non-overlapping overflow range above 0.2 s; the documented quantile fallback is the last finite boundary, 0.2 s, not the actual p99 duration. This is a separate representation of the same W0 data, not new data or a changed percentile convention.

Collection-audit exercise: if worker B's data are absent or excluded, raw retained observations are only A's 90 values at 40 ms (raw p99 40 ms). Keep this distinct from the classic histogram's interpolation of A's buckets. Compare caller terminal count 100, recorded count 100 when complete, selected count 90 when B is omitted and missing contribution 10. No actual scrape failure is asserted. An independent caller count is necessary to expose a loss that an internally consistent histogram cannot reveal. A zero-traffic view has no percentile or established good fraction.

## W-arrivals: generation and drain are different intervals

Independent counterfactual lanes use read attempts `arrival-S01`–`arrival-S05` (scheduled), `arrival-C01` (completion-driven) and `arrival-D01`–`arrival-D05` (capacity-limited scheduled). Every started attempt is one caller operation with no retry or deadline. All offsets and durations are ms. New-start interval is `[0, 500)`; observation drains existing work to 800 ms, with no new starts at or after 500 ms.

Stipulated service rule, deliberately not a queue model: a started request at offset `s` completes successfully at `max(s,600) + 100`. The service does no useful request work before 600 ms, then can process all five started requests concurrently for 100 ms without contention. Start-to-completion includes this wait. This rule is a teaching assumption, not a prediction of a real service under different loads.

| Lane | Arrival rule and generator capacity | Scheduled | Started by 500 | Dropped | Terminal by 500 | In flight at 500 | Terminal by drain 800 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Scheduled | Start at 0, 100, 200, 300, 400; five generator slots | 5 | 5 | 0 | 0 | 5 | 5 |
| Completion-driven | One slot; start at 0, then next only after completion while generation remains open | 1 | 1 | 0 | 0 | 1 | 1 |
| Capacity-limited scheduled | Same five scheduled offsets; one slot, drop if occupied | 5 | 1 | 4 | 0 | 1 | 1 |

All started requests complete at 700 ms. Scheduled-lane caller durations are 700, 600, 500, 400 and 300 ms. Each other lane's one started duration is 700 ms. There are no service rejections or caller failures. Unstarted scheduled arrivals D02–D05 have no observed request durations; drops belong in the generator report. For the completion-driven lane, four would-be arrivals in the independent schedule were never scheduled, so they are not four measured drops. Its single caller was busy until 700 ms, after generation closed.

At 500 ms every lane has zero terminal observations; display that absence rather than a zero or a successful latency distribution. After drain, started counts reconcile to terminal counts with no pending work. The schedule-driven offered demand is five operations; the completion-driven demand is one for this interval. This demonstrates omitted offered work, not a promise that the closed lane must report a lower percentile (here each lane's exact p99 is 700 ms). No generator dispatch delay is stipulated; real tests must report start lateness as well as drops and capacity. Do not invent durations for missing arrivals or assume that replacing a closed test with an open executor removes every bias.

## Sampling illustration retained without change

The canonical independent stationary 1% slow-category model remains separate from every finite fixture. Expected slow counts `N × 0.01` for N = 100, 1,000 and 10,000 are 1, 10 and 100; they are not guaranteed counts. Probability of seeing no slow category in 100 draws is `0.99^100 ≈ 0.366032`, about 36.6%. This is neither a W0 confidence interval nor evidence that production requests are independent.

## Proposed integration and later checks

Add the independent fixtures and metric/audit worksheet centrally, keeping W0 and existing W-stages unchanged. The child never depends on SQL keys beyond the established entity reminders and does not mutate relational rows. W-stages remains owned by the root's cause explanation. A later shared data module should hold all reused values; no module is created here. Figures/controls should use the fixture names and explicit generation, observation and drain labels above. Source-checked Prometheus behaviour is documented in the planning record; actual tool versions, counter-reset cases, missing-series behaviour, rendered controls and native execution remain later commissioned work.
