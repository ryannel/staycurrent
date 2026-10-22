# Proposed child r02 delta: eligibility before histogram observation

Proposal for central integration only. Canonical source: `/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles-example.md`. This delta neither edits nor supersedes the accepted record. All previous root and child contributions remain in force.

## Shared eligibility contract

The start record already carries Boolean `eligible`, copied unchanged to its terminal event. Give it the root's existing meaning: a real logical history request for the intended operation, excluding explicitly identified synthetic health checks. A real request remains eligible when it ends in error or deadline. Establish the value at start; do not infer it from elapsed time or successful completion.

Validate and deduplicate each terminal event, then retain its event-log entry, including excluded events for audit. Only when the joined start has `eligible=true` call `history_caller_duration_seconds.labels(request_class=..., outcome=...).observe(elapsed_seconds)`. If it has `eligible=false`, skip that observation entirely. The in-process guarantee becomes at most one observation per unique eligible terminal event and zero per excluded terminal. Existing loss, crash and non-atomic-write limitations still apply.

The event reducer filters the same recorded eligibility value before selecting the start window. The metric's population is therefore eligible logical history requests, using only its existing bounded class/outcome labels. No eligibility label or new metric is needed. Both budget-query numerator and denominator inherit this recording contract; the success selector narrows only the numerator. This aligns eligibility while preserving different start-cohort and terminal-observation attribution. All-outcome continues to include eligible errors and deadlines. Scrape selectors must still select the intended service/environment; they cannot repair an omitted eligibility gate.

Amend **Caller record path**, **Measurement-child hand-off** and **Raw requests to buckets** with this contract when integrated. Preserve their values and query forms. The existing instruction to observe a terminal duration once means once for each eligible terminal; excluded audit records make no observation. In **One termination, two records**, show the eligibility branch before the observation, so its name does not imply every audit record updates the histogram.

## Excluded health check

This is a new, separately labelled, two-request adversarial fixture, `experiment_id=eligibility-check`. Use a fresh event list and histogram registry (a separate container for this check's metric objects). It is not extra traffic in baseline, changed, Failure and deadline variation, Requests still waiting, Later completions with an older start, mix A/B, Synthetic query replay clock or Scheduled requests during a pause. It assigns no arrival times to their requests and changes none of their snapshots.

Use one relative integer-millisecond caller clock, prompt complete recording (`recorded_at_ms=at_ms`), no retries, and the same operation, service/environment and caller exporter for both requests. The caller marks the synthetic health check explicitly at start. Both are `request_class=unclassified`; this does not make the health check eligible.

| Request ID | Caller start, ms | Caller terminal, ms | Elapsed, ms | Outcome | eligible |
| --- | ---: | ---: | ---: | --- | --- |
| `eligible-01` | 0 | 80 | 80 | success | true |
| `check-01` | 100 | 120 | 20 | success | false |

Evaluate starts in `[0,300000)` at inclusive assessment `300000`. First run the input with only the `eligible-01` start/terminal pair; then repeat from fresh state with both pairs. These are two input variants of this check, not revisions to any canonical dataset. Both logs use the existing complete event schema and validation rules.

| Expected output | Eligible pair only | Eligible pair plus excluded pair |
| --- | ---: | ---: |
| Audit starts / terminal entries | 1 / 1 | 2 / 2 |
| Eligible cohort starts | 1 | 1 |
| Eligible known successes / errors / deadlines | 1 / 0 / 0 | 1 / 0 / 0 |
| Eligible outstanding | 0 | 0 |
| Eligible timely successes / denominator | 1 / 1 | 1 / 1 |
| Eligible timely-success lower / upper bounds | 100% / 100% | 100% / 100% |
| Eligible duration status | Complete | Complete |
| Histogram `success,unclassified` cumulative buckets at 0.1,0.2,0.3,0.6,1,2,+Inf seconds | 1,1,1,1,1,1,1 | 1,1,1,1,1,1,1 |
| Histogram `_count`, pooled over class/outcome | 1 | 1 |
| Histogram `_sum`, seconds, pooled over class/outcome | 0.08 | 0.08 |

Initialise all permitted label combinations as already required; their other bucket/count/sum values remain zero. Compare every bucket, count and sum as well as the eligible reducer output. The extra excluded terminal must add one audit entry and no observation. Comparing only the 100% fraction would miss a broken gate: wrongly observing the 20 ms health check would produce count 2, sum 0.10 seconds and two observations in every listed bucket while still displaying 100% timely successes. This check targets population accounting; it establishes no future percentile precision.

The eventual writer must execute the recording check and show actual output as evidence. These numbers specify expected outputs only; this repair executes no recorder, service, scrape or query fixture. The existing Synthetic query replay clock and its baseline/changed/failure expectations remain untouched.
