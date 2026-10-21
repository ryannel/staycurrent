# Proposed child additions to the shared example

Proposed for central settlement, 2026-10-21. The canonical record is
`/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles-example.md`.
No change to that record is made here. These additions support **Building trustworthy
latency measurements** and preserve every settled core duration, count, outcome,
class-mix variation and start-cohort rule. All values below are constructed.

## Caller record path

The deterministic replay uses one relative integer-millisecond clock per experiment,
with a named `experiment_id`. Its minimal event fields are:

| Field | Start event | Terminal event |
| --- | --- | --- |
| `experiment_id`, `request_id` | Required, together unique per logical request | Same pair |
| `event` | `start` | `terminal` |
| `at_ms` | Actual caller start | Actual caller terminal time |
| `recorded_at_ms` | When the recorder saved the event | When the recorder saved the event |
| `eligible` | Boolean; true for real history requests | Read from the joined start |
| `request_class` | `unclassified`, `small` or `large` | Read from the joined start |
| `outcome` | Absent | `success`, `error` or `deadline` |

No terminal event means outstanding in the reconstructed record; it does not prove a
live server request. Reject missing starts, conflicting starts/terminals, terminal
before start, collection before its own event, and unknown field values. Replaying
an identical saved event is idempotent; conflicting data for its unique key fails.
This validation cannot find starts that were never collected.

The fixture records every event immediately, so `recorded_at_ms = at_ms`. To replay
what was known at assessment `T`, use only events recorded at or before `T`, and
only terminal events whose own time is at or before `T`. Window selection still
uses the start event's `at_ms` with inclusive start and exclusive end. A later
terminal stored in the full input file must not change an earlier snapshot.
Historical event-time and as-known views differ if collection is delayed; label
that difference in any production adaptation. A complete-record assumption through
the cutoff is required for the fixture's exact assertions.

Real caller instrumentation uses a monotonic clock for duration differences and
records calendar start time separately for UTC cohort membership. A monotonic
reading is not an epoch timestamp and cannot be compared with a remote server
clock. Record clock/run identity, class and eligibility at the start. Place the
start outside attempts/retries, record a terminal once the complete useful result
or terminal failure reaches the caller, and observe that actual elapsed duration
once. No retry occurs in these datasets. Logging overhead, loss and non-atomic log
and metric writes are implementation limits, not evidence of negligible overhead
or durable exactly once delivery. The event fixture is the authoritative cohort
input; a histogram projection does not replace it.

## Later completions with an older start

This is a separately labelled extension of **Requests still waiting** for comparing
selection rules. Its original ten eligible starts and its state at `300000` are
unchanged. Only this extension supplies their later outcomes, and only this
extension adds `older-01`. The root's original variation still has no older request
and no specified later outcome. All rows are successes, eligible and unclassified;
there are no retries or health checks.

| Request identifiers | Count | Actual caller start, ms | Caller terminal, ms | Caller duration, ms |
| --- | ---: | ---: | ---: | ---: |
| `older-01` | 1 | -100 | 50 | 150 |
| `wait-01` through `wait-08` | 8 | 0 | 80 | 80 each |
| `wait-09` | 1 | 299600 | 300200 | 600 |
| `wait-10` | 1 | 299900 | 300150 | 250 |

Use all eleven start events and all eleven terminal events in the saved replay
input. The first assessment ignores the two terminals after its cutoff, even
though they appear later in the saved file.

| Selection and assessment | Eligible denominator | Timely successes | Outstanding | Duration result |
| --- | ---: | ---: | ---: | --- |
| Starts in `[0,300000)`, assessed at `300000` | 10 | 8 known; at most 9 eventual | 2; ages 400 and 100 ms | Completed subset p99 80 ms; final cohort p99 unknown |
| Terminals in `[0,300000)`, assessed at `300000` | 9 | 9 | Not a start-cohort outstanding count | Raw p99 150 ms |
| Starts in `[0,300000)`, assessed at `300300` | 10 | 9 | 0 | Raw p99 600 ms |
| Terminals in `[300000,600000)`, assessed at `600000` | 2 | 1 | Not a start-cohort outstanding count | Raw p99 600 ms |
| Starts in `[300000,600000)`, assessed at `600000` | 0 | 0 | 0 | No cohort; fraction and p99 undefined |

At the first assessment the start-cohort bounds are 80–90%, so its 99% objective
is already impossible. Its later settled value is 90%. The terminal-event fractions
are respectively 100% and 50%; they answer different questions. These are exact
event selections. They do not promise that a sampled rate query returns the same
edge attribution or integer counts. Terminal-event windows here are half-open;
assessment includes available terminal events at the assessment instant. There
are no terminal events exactly on the selected window edges in this fixture.

## Raw requests to buckets

These are projections of the unchanged settled core cohorts. They create no
arrival schedule or additional traffic. Values exported by the histogram are in
seconds; the raw source table stays in milliseconds. Buckets are cumulative and
include their upper bound, unlike the root's non-overlapping ranges.

| Classic upper bound, seconds | Baseline cumulative count | Changed cumulative count | Failure/deadline variation cumulative count, all outcomes |
| --- | ---: | ---: | ---: |
| `0.1` | 900 | 900 | 899 |
| `0.2` | 990 | 980 | 989 |
| `0.3` | 990 | 980 | 990 |
| `0.6` | 999 | 999 | 999 |
| `1.0` | 999 | 999 | 999 |
| `2.0` | 1000 | 1000 | 1000 |
| `+Inf` | 1000 | 1000 | 1000 |
| `_count` | 1000 | 1000 | 1000 |
| `_sum`, seconds | 97.4 | 101.4 | 97.56 |

`le` is the upper-bound label in exposition. A client may canonically spell an
integral bound `1.0` or `1`; keep the actual exposition consistent and use `0.3`
for the threshold selector. `_sum` is a sum of durations measured in seconds,
not a duration average and not a count.

For the failure/deadline variation retain these separate outcome projections:

| Outcome | Count | `le="0.1"` | `le="0.2"` | `le="0.3"` | `le="0.6"` | `le="1.0"` | `le="2.0"` / `+Inf` | `_sum`, seconds |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `success` | 998 | 898 | 988 | 988 | 997 | 997 | 998 | 97.24 |
| `error` | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0.02 |
| `deadline` | 1 | 0 | 0 | 1 | 1 | 1 | 1 | 0.3 |

The success numerator at `0.3` is 988, denominator all outcomes is 1000, so the
fraction is 98.8%. The all-outcome duration bucket at `0.3` counts 990, which
would wrongly conceal the failed outcomes if substituted for that numerator.
For baseline and changed the corresponding exact histogram-observation fractions
are 990/1000 and 980/1000. Pending requests have made no histogram observation.

The metric is `history_caller_duration_seconds`, with bounded `request_class` and
`outcome` labels, exposed at termination by caller exporters scraped under
`job="history-callers"`. `instance` names the scraped caller exporter, not a
history service instance. Core/failure data are `request_class="unclassified"`;
class labels from mix A/B are only attached to those separate variations. `small` maps to the canonical up-to-ten-orders class; `large` maps to eleven-to-one-hundred orders.
Initialise every permitted class/outcome label combination so zero successes are
represented. IDs remain in the event fixture.

To check pooling, the baseline query fixture partitions observations between two
constructed caller exporters: `caller-a` observes the 900 waits of 80 ms and
`caller-b` observes the remaining 100 waits. Their combined observations are the
root baseline; the partition deliberately parallels the root's 900/100 split,
without asserting that the caller exporters are the root's servers or describing
an actual deployment. For changed and failure fixtures a single exporter is
sufficient. All exporters in each query fixture have the same bucket layout.

### Resolution and estimator snapshots

For the **coarse** classic layout retain only `0.1`, `1.0` and `+Inf` buckets.
The cumulative counts are 900,999,1000 in both core cohorts. The selected p99
rank is 990. A linear interpolation inside the containing bucket gives:

`0.1 + ((990 - 900) / (999 - 900)) × (1.0 - 0.1)`
`= 0.918181818… seconds`, approximately **918.18 ms**, for both cohorts.

The root's exact raw p99 values remain 200 ms and 600 ms, and its retained-information
bound remains `(100,1000] ms`. The sum may differ between cohorts; retaining it
does not turn the percentile estimate into the raw rank or restore discarded values.

For the **decision** layout in the main table, the baseline selected position reaches
upper bound `0.2` and estimates **200 ms**. The changed containing bucket is
`(0.3,0.6]`, with previous count 980 and bucket count 19:

`0.3 + ((990 - 980) / 19) × (0.6 - 0.3)`
`= 0.457894736… seconds`, approximately **457.89 ms**.

Add just `0.55` to create the **narrower tail** layout. Its baseline and changed
cumulative counts are 990 and 980 respectively. The changed containing bucket is
now `(0.55,0.6]`, giving:

`0.55 + (10 / 19) × 0.05 = 0.576315789… seconds`, approximately **576.32 ms**.

This narrower bucket constrains duration error more tightly for this particular
fixed dataset. No layout proves future p99. No percentile interpolation is needed
for the decision-layout `0.3` threshold count; the numerator must still filter
success. Resolution changes must be deployed consistently before pooling.

## Synthetic query replay clock

This is a separate fabricated counter-sample schedule for testing PromQL, not a
new claim about when core requests arrived or terminated. Replay one batch from
one settled dataset into the counters once; run baseline, changed and failure
cases separately. Every initialized series has a synthetic sample every 15 seconds
from time 0 through 300 seconds inclusive. Samples at 0 through 105 seconds have
value zero. At time 120 seconds each cumulative bucket, count and sum jumps to its
full snapshot value above; those values stay constant through 300 seconds. The
baseline's two exporter partitions use the same jump time. Evaluate the five-minute
queries at 300 seconds. Units here are seconds on the replay clock.

All non-zero bucket/count series share the same scrape times and a single jump,
so the rate calculation applies the same positive multiplier to each snapshot
count. It cancels in the threshold ratio and in the quantile's proportional rank.
Expected decision-layout results are baseline p99 0.2 seconds and fraction 0.99;
changed p99 approximately 0.4578947368 seconds and fraction 0.98; failure fraction
0.988. Expected zero-success cases have an explicitly zero success series and a
positive denominator; empty-traffic cases have undefined ratios/quantiles and
must not be labelled healthy. The writer must execute the expression fixture and
record exact output precision and tool versions; these are planned expectations,
not execution evidence. Reset, missing-series and incompatible-layout checks are
additional adversarial cases, not newly invented request distributions.

## Scheduled requests during a pause

A separate six-request teaching experiment uses history requests, the same caller
boundary, one relative millisecond clock, no retries, all eligible/unclassified,
and a demand window `[0,600)`. Intended starts are 0,100,200,300,400,500. The
constructed service model is paused until 480 ms: a request actually started before
480 succeeds at 560 ms; a request actually started at or after 480 succeeds 80 ms
after its actual start. This asserts neither queue discipline nor a real stall cause.
The independent model has enough dispatch capacity; it does not impose serial
processing or simulate a database.

| Intended request | Intended start, ms | Independent actual start | Independent success | Independent caller duration | Serial actual start | Serial success |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `pause-01` | 0 | 0 | 560 | 560 | 0 | 560 |
| `pause-02` | 100 | 100 | 560 | 460 | 560 | 640 |
| `pause-03` | 200 | 200 | 560 | 360 | Unsent by 600 | — |
| `pause-04` | 300 | 300 | 560 | 260 | Unsent by 600 | — |
| `pause-05` | 400 | 400 | 560 | 160 | Unsent by 600 | — |
| `pause-06` | 500 | 500 | 580 | 80 | Unsent by 600 | — |

In the serial comparison one worker waits for each reply, dispatches the next
scheduled request immediately when available, and stops dispatching at 600 ms.
Its second dispatch is late by `560 - 100 = 460 ms`. At 600 ms:

| Recording | Intended | Actually started | Terminal successes | Outstanding | Unsent | Timely successes among actual starts |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Independent dispatch | 6 | 6 | 6 | 0 | 0 | 3/6 = 50% |
| Serial dispatch | 6 | 2 | 1 | 1, age 40 ms | 4 | 0 known; at most 1/2 eventual |

At 640 ms the serial pair has durations 560 and 80 ms, with 1/2 timely successes.
Its second intended-to-terminal delay is 540 ms, distinct from its actual caller
latency of 80 ms. Do not replace caller durations with intended-to-terminal delays,
or assign actual durations to unsent requests. The independent table supplies a
separate explicit model of what happened when demand was actually dispatched; it
is not a post-hoc correction to the serial measurement. Neither model's p99 is
advertised as predictively precise; the useful discrepancy is delivered demand,
missing waits and lag, even if a reported percentile happens to coincide.

A genuinely serial user can make the serial model appropriate. For the intended
six independent arrivals, it suppresses demand: coordinated omission. Open arrival
scheduling must still report insufficient workers, dropped requests and generator
lag. The root's objective denominator counts actual eligible starts; demand that
was never dispatched is a separate test-validity failure, not a fabricated start.
