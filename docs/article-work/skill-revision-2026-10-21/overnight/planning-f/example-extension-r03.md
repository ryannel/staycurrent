# Proposed example extension: W-overlap

Status: delta for central settlement under F-02, addressing F-PLAN-02 / teaching-2 and F-PLAN-03 / teaching-3. Add this independent fixture beside W-stages in `docs/coverage/latency-flow-example.md`. The canonical example is unchanged. Every time and dependency below is stipulated teaching data, not an observed trace or execution result.

## One operation's records, then its dependency timeline

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
