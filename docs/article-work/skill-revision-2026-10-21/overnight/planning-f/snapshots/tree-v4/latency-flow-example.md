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


## W-mix: the same class timings, a different mixture

Keep the workshop booking-status read, tenant `t4`, customer 42/Ada, booking `b17` and session `s7`. Define two request classes by what is requested before timing them: **status only** and **status with session details**. Both are read variants of the same booking-status operation. They do not change a booking, consume seats or create orders. These are not classes selected from fast or slow observations, worker groups, new metric labels or explanations of an engine cause.

Use two adjacent five-minute windows on an independent relative fixture clock: **W-mix-before** `[0, 300,000)` ms and **W-mix-after** `[300,000, 600,000)` ms. Each contains 1,000 caller operations, each with exactly one attempt, all starting and completing successfully inside its own window. No retries, errors, timeouts, opening/closing in-flight work or missing observations are stipulated. Caller start to complete reply is timed on one elapsed-time clock in milliseconds in both windows. No arrival order or queue behaviour is specified.

Identities are `mix-before-op0001`–`mix-before-op1000` and `mix-after-op0001`–`mix-after-op1000`. In the before window, identities 0001–0990 request status only and 0991–1000 request status with session details. In the after window, identities 0001–0900 request status only and 0901–1000 request status with session details. They are not W0's `q` identities or additional W0 observations.

The named **W-mix before-and-after class table** must show counts and within-class results beside the pooled result. Each status-only observation is exactly 40 ms in both windows; each status-with-session-details observation is exactly 400 ms in both windows. These stipulated values are not inferred from the class name.

| Request class | Every caller duration, both windows | Before count | Before exact p99 | After count | After exact p99 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Status only | 40 ms | 990 | 40 ms | 900 | 40 ms |
| Status with session details | 400 ms | 10 | 400 ms | 100 | 400 ms |
| Pooled booking-status reads | Both class values above | 1,000 | 40 ms | 1,000 | 400 ms |

Use the root's declared exact nearest-rank rule throughout. Pooled rank is `ceil(0.99 × 1,000) = 990` in both windows. Before, ordered positions 1–990 are 40 ms and 991–1,000 are 400 ms, so p99 is 40 ms. After, positions 1–900 are 40 ms and 901–1,000 are 400 ms, so p99 is 400 ms. The second class's share changes from `10/1,000 = 1%` to `100/1,000 = 10%`; each window has the same total operation count and five-minute window length. Within-class p99s remain 40 and 400 ms because all of each class's values are unchanged. The before window still contains ten 400 ms reads: p99 does not mean none took longer.

The worked judgement asks whether either read variant became slower. In this finite invented fixture neither did: only the mixture changed, and more requests now receive the slower variant. A pooled rise alone cannot establish a within-class slowdown. It still describes a changed overall request experience; do not dismiss that change or treat a request-weighted result as every user's experience. The next dashboard view to inspect is **duration distributions, counts and errors separated by these predefined request classes over matched windows**. In real evidence, use that view to check whether class timings also changed before investigating their causes; matching class p99s alone would not establish unchanged full distributions. The stipulated fixed values here support no future guarantee or claim that the changed mix cannot affect a real service's timings.

### Placement and continuity

The root owns this worked table and decision in “Compare the same work over the same interval”, after the distinct W0 worker-pooling demonstration and before histogram retention. Explain request class before the table or any selector uses it; use the same class names in prose, caption and any later controls. No new term from the child, such as cohort or terminal-event policy, is needed here. The child reminds and links the root comparison, retains its predefined class in complete caller duration/outcome records, works selection and pooled reconciliation in its representation section, and uses that evidence in its final worksheet.

W0, worker A/B, W-retry, W-timeout, W-edge, W-stages, W-arrivals, the sampling illustration and the metric/audit worksheet remain unchanged. No histogram, query, new instrumentation label, third article or executable shared data module is proposed. A later commissioned implementation should retain these fixture values in the same centrally owned shared data module as the other examples.


## W-overlap: linked records and overlapping work


Keep the workshop booking-status read for tenant `t4`, customer 42/Ada, booking `b17` and session `s7`. This single read also requests session details. It changes no rows, seats or orders. The independent fixture **W-overlap** contains one successful caller operation **overlap-op01**, with one attempt and no retry, timeout or missing records. Its identity belongs to neither W0 nor W-mix and contributes to none of their counts. No q100 decomposition is proposed.

All records below carry caller-operation identity `overlap-op01`. Explain that common identity before asking the reader to pair stage records: it selects work belonging to this caller operation; the distinct interval names tell the stages apart. Introduce a **trace** as linked records of an operation's work and **trace ID** as the common identifier of that trace. The table is a readable teaching representation, not a tracing-product format. Named start/end offsets locate elapsed intervals, rather than supplying just a list of unrelated durations. The general tracing concept is supported by [OpenTelemetry's trace and span documentation](https://opentelemetry.io/docs/concepts/signals/traces/); the fixture values are invented.

Use one stipulated elapsed-time clock, with caller start at 0 ms and complete reply at 100 ms. Preparation precedes both reads; the two reads can run independently without contention, and reply assembly requires both results. There are no additional transport intervals or uncounted gaps. These dependency and timing assumptions apply only to this fixture.

The named **W-overlap linked-record table and dependency timeline** must show the common identity in each record, all four stage lanes, the enclosing caller lane and the join:

| Caller operation | Named interval | Start (ms) | End (ms) | Duration (ms) | Dependency |
| --- | --- | ---: | ---: | ---: | --- |
| overlap-op01 | Caller start to complete reply | 0 | 100 | 100 | Encloses the operation |
| overlap-op01 | Preparation | 0 | 10 | 10 | Starts with caller |
| overlap-op01 | Booking-status read | 10 | 90 | 80 | After preparation |
| overlap-op01 | Session-details read | 10 | 50 | 40 | After preparation; overlaps booking-status read |
| overlap-op01 | Reply assembly | 90 | 100 | 10 | After both reads finish |

Show a split at 10 ms and a **join** at 90 ms, explaining join as waiting for both required results before continuing. The caller waits for the complete reply until 100 ms. At 50 ms the session-details result is ready, but the join still waits for booking status until 90 ms; mark that 50–90 ms wait without adding it as another work stage. Caption and any step text use these same names and offsets.

Work the arithmetic beside the timeline. The sum of the four stage durations is `10 + 80 + 40 + 10 = 140 ms`; elapsed caller time is `100 - 0 = 100 ms`. The read intervals overlap by 40 ms, so their sum double-counts that elapsed interval. Do not add the enclosing caller lane or the join's wait to the four-stage sum. Define **critical path** here as the required dependency chain that determines completion: preparation → booking-status read → reply assembly, `10 + 80 + 10 = 100 ms`. Ask whether shortening only the session-details read from 40 to 20 ms changes caller completion. With all other timings and dependencies stipulated unchanged, that result is ready at 30 ms, but the join remains at 90 ms and caller completion at 100 ms. This arithmetic chooses the next interval to investigate; it does not establish what caused the booking-status interval's duration or predict a real optimisation.

## Placement and ownership

The root owns this introduction and worked timeline in “Follow the slow requests to a cause”, before using paired causal records or tracing vocabulary. Its order is identity → linked intervals/trace → overlap and join → elapsed time versus sum → critical-path judgement → aggregate stage metrics. Retain the separate W-stages serial counterexample unchanged: each request's two serial stages sum with no overlap or gap, but stage p95s of 20 and 20 ms do not recover the whole-request p95 of 400 ms. W-overlap teaches one operation's dependencies; W-stages teaches what aggregate percentiles discard.

The child “Keep groups useful and small” reminds and links the root's trace introduction before discussing trace IDs in diagnostic records; it still owns labels, instrumentation and selection policy. No new metric label, instrument, third article or executable module is proposed. W0, worker A/B, W-mix, W-retry, W-timeout, W-edge, W-stages, W-arrivals, the sampling model and the metric/audit worksheet retain their values and ownership. If later implementation is commissioned, keep W-overlap in the same centrally owned data module as the other reused fixtures.


## W-mix retained records and reconciliation

Settled centrally for F-TREE-r04. This extends record retention only; all existing fixture values and metric labels remain unchanged.


Use complete caller duration/outcome records to produce the W-mix class comparison. The class is a **record field**, not a new metric label. Keep W0's metric labels, six possible worker/outcome groups, histogram tables and proposed classic/native queries unchanged. W0 never specifies which read variant each q identity requested: do not assign W0 a class, use its durations to guess one or claim its class-free buckets can recover one.

Remind and link the root's request-class definition before this choice. **Request metadata** means the options known when the caller starts. Capture the caller's requested variant before timing its outcome: requesting status alone maps to `request_class=status_only`; also requesting session details maps to `request_class=status_with_session_details`. These are the existing two variants, with machine-readable field values corresponding to the existing reader-facing names **status only** and **status with session details**. Both keep `operation=booking_status`. Preserve the captured value when writing the terminal record, including on an error or timeout; duration never determines the class.

Show one compact logical record-field table in the child's existing representation decision, without choosing a storage product or log format:

| Retained field | Meaning and use |
| --- | --- |
| Caller-operation identity | Existing `mix-before-op…` or `mix-after-op…` identity; one caller operation, one terminal record; detect duplicates and reconcile membership |
| `operation` | `booking_status`, selecting the operation independently of its variant |
| `request_class` | One of the two values captured from request metadata at caller start; preserve through export and retention |
| Terminal-event time | Time of caller success, error or timeout, used to select the stated half-open interval; for W-mix use its existing relative fixture clock |
| Caller duration | Caller start to complete reply, or the observed failed caller duration; elapsed time measured on the chosen elapsed-time clock, in ms |
| `outcome` | `success`, `error` or `timeout`, exactly once for the chosen caller observer |

The original fixture stipulates each operation's window membership but gives no individual arrival/terminal offsets. This proposal adds no offsets or replacement clock: a later instrument must retain terminal-event time, while the teaching projection below uses the existing known membership. Duration remains a subtraction on the elapsed-time clock, not a subtraction of timestamps from different observers.

## Selection and completeness

Retain one terminal duration/outcome record for **every** eligible caller operation, through each success, error and timeout path, including both classes. Keep the full windows available until the comparison is made. The chosen records are not sampled diagnostic traces: do not select them by latency, outcome or a trace-retention decision. OpenTelemetry documents trace selection by errors and overall latency, which is why a diagnostic trace collection cannot be assumed complete. [OpenTelemetry sampling](https://opentelemetry.io/docs/concepts/sampling/) was checked on 22 October 2026.

Follow records through instrumentation, export, retention and selection. Compare their unique caller identities and outcome totals to the independent caller ledger for the same interval; report missing/duplicate records and unavailable retention. Validate that captured class values survive too. Keep missing or invalid class metadata visible as **unclassified**, include those records in the eligible pooled totals and do not infer their classes from duration. Matching the total count alone does not establish that each class was captured correctly. If capture or retention is incomplete, the class comparison remains unresolved; obtaining a new matched interval with the required field is the next action. No selective trace set or class selector repairs the old information loss.

## Field to grouped evidence to pooled reconciliation

In the named **W-mix retained-record reconciliation table**, first select `operation=booking_status`, all eligible outcomes and terminal-event times in W-mix-before `[0,300000)` ms or W-mix-after `[300000,600000)` ms. Both windows already stipulate that every caller starts and completes inside its own interval; selecting by the terminal event introduces no membership change. Group by `request_class` and `outcome`. Form duration frequency tables from the retained caller durations; count successes, errors and timeouts separately before calculating ranks. The existing identity ranges supply the following compact projection of complete records, rather than a sample:

| Window and caller identities | Captured class value | Caller duration in every record | Outcome in every record | Record count |
| --- | --- | ---: | --- | ---: |
| Before: 0001–0990 | `status_only` | 40 ms | success | 990 |
| Before: 0991–1000 | `status_with_session_details` | 400 ms | success | 10 |
| After: 0001–0900 | `status_only` | 40 ms | success | 900 |
| After: 0901–1000 | `status_with_session_details` | 400 ms | success | 100 |

The abbreviated identities use their existing `mix-before-op` or `mix-after-op` prefix. Each row represents every identity in its range once. W-mix explicitly stipulates complete all-success windows, so zero errors and timeouts below are known fixture values, not an interpretation of absent outcome series.

| Window | Request class | Duration frequency | Total | Successes | Errors | Timeouts | Exact p99 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| Before | Status only | 990 × 40 ms | 990 | 990 | 0 | 0 | 40 ms |
| Before | Status with session details | 10 × 400 ms | 10 | 10 | 0 | 0 | 400 ms |
| Before | Pooled booking-status reads | 990 × 40 ms; 10 × 400 ms | 1,000 | 1,000 | 0 | 0 | 40 ms |
| After | Status only | 900 × 40 ms | 900 | 900 | 0 | 0 | 40 ms |
| After | Status with session details | 100 × 400 ms | 100 | 100 | 0 | 0 | 400 ms |
| After | Pooled booking-status reads | 900 × 40 ms; 100 × 400 ms | 1,000 | 1,000 | 0 | 0 | 400 ms |

Reconcile before `990 + 10 + 0 unclassified = 1000` and after `900 + 100 + 0 unclassified = 1000`. Class success counts sum to the pooled 1,000 successes in each window; class errors and timeouts each sum to zero. Each total matches its independent eligible caller ledger, with 1,000 starts, 1,000 terminal successes and zero opening/closing in-flight work, duplicates, missing records or unknown classes. This is the fixture's completeness stipulation, not an observed operational audit.

Recombine the class frequency counts before ranking pooled durations. Rank 990 is 40 ms before and 400 ms after. Neither averaging class p99s nor assigning classes using 40/400 ms performs this reconstruction. The class durations are the source of the distributions; the pre-captured request option is the source of class membership. Their conjunction yields the unchanged class distributions and changed mixture already taught by the root.

