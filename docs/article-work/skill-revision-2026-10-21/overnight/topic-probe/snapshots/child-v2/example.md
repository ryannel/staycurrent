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


# Settled root r02 extensions

These are separately labelled constructed variations; the core counts, durations and instance split remain unchanged.

## Make window membership and assessment explicit

For the root, a **start cohort** is the set of eligible logical history requests whose caller starts are at or after the start of a stated five-minute window and strictly before its end. Once a request joins, retain its membership when it finishes later or remains outstanding. The denominator is the number of eligible starts in this cohort, not the number of terminal events observed so far. A **terminal event** is the caller receiving its complete result or a terminal failure, including expiry of its caller deadline. **Outstanding** means no caller terminal event has yet been recorded.

Clarify the existing core datasets as two separate start cohorts, each assessed after every request has terminated. Their established aggregate counts still specify no arrival order, concurrent schedule or offered rate profile. This settles the previously unspecified attribution rule without inventing times for the 1,000 requests. Report both the membership window and assessment time; a window can end before its requests finish. Eligibility and the 300 ms inclusive budget remain as settled in the canonical record.

A terminal-event window instead selects caller terminations within that window: it may include requests started earlier and omits work still outstanding. This is an explicitly different population. It is useful when labelled, but cannot silently substitute for the chosen start cohort. Pending ages are elapsed waits so far, not completed durations. No eventual server completion time is supplied by a caller deadline.

## Requests still waiting

This is a separate ten-request start cohort during an illustrative stall. It is not a sample drawn from either core count table. All requests are eligible real history requests with no retries or synthetic checks. Use one illustrative caller clock, with times in milliseconds relative to this experiment's window start. The start window is `[0, 300000)`; assess it at `300000`, including all terminal events recorded through that instant. No earlier requests or other requests are present in this variation.

| Requests | Count | Caller start | Caller terminal event by assessment | Age if outstanding | Timely success known now |
| --- | ---: | ---: | --- | ---: | ---: |
| `wait-01` to `wait-08` | 8 | 0 ms | Success at 80 ms, each | — | 8 |
| `wait-09` | 1 | 299600 ms | None | 400 ms | 0; can no longer succeed within 300 ms |
| `wait-10` | 1 | 299900 ms | None | 100 ms | Unresolved; could still succeed within 300 ms |
| Total | 10 | — | 8 successes, 2 outstanding | — | 8 known, at most 9 eventual |

The completed subset contains eight 80 ms waits: its exact p99 is 80 ms and every completed request succeeded within 300 ms, giving 8/8 if one uses only completed requests. These statements describe that subset, not the full cohort's objective.

Keep all ten starts in the objective denominator. There are eight known timely successes. `wait-09` has already passed its budget; `wait-10` could still add one timely success. Thus the cohort's eventual timely-success fraction is either 8/10 (80%) or 9/10 (90%). Its exact final fraction is provisional, but the at-least-99% target is already impossible. Investigate the stall; a healthy completed-only result does not justify accepting performance. The eventual caller durations and outcomes of the two outstanding requests remain unspecified, so do not report a final all-request duration percentile or turn their ages into observations.

Generally, a pending request older than 300 ms cannot later become a timely success. At exactly 300 ms the inclusive threshold and any terminal event recorded at that instant must be handled consistently. Once the opportunity for every pending request's timely success has passed, the budget fraction can be settled without knowing every final duration. An incomplete duration distribution can remain after a budget decision is settled. The small cohort demonstrates accounting, not precision for future p99.

## Failure and deadline variation

Create a separate complete 1,000-request start cohort by replacing **two** baseline 80 ms successes with one 20 ms terminal failure and one caller deadline at 300 ms. Other baseline counts are unchanged. There are no retries, outstanding caller requests or synthetic checks; assess after every caller terminal event. This is not an extra 1,002-request cohort or a change to the settled baseline.

| Caller terminal outcome | Caller elapsed duration | Count | Eligible denominator contribution | Timely-success numerator contribution |
| --- | ---: | ---: | ---: | ---: |
| Success | 80 ms | 898 | 898 | 898 |
| Success | 200 ms | 90 | 90 | 90 |
| Success | 600 ms | 9 | 9 | 0 |
| Success | 2,000 ms | 1 | 1 | 0 |
| Terminal failure | 20 ms | 1 | 1 | 0 |
| Caller deadline; no complete successful result | 300 ms | 1 | 1 | 0 |
| Total | — | 1,000 | 1,000 | 988 |

The objective result is `(898 + 90) / 1000 = 988/1000 = 98.8%`. Each failure remains eligible; neither contributes a timely success. There are 998 successful logical requests in total, but using 998 as this objective's denominator would omit two eligible requests. Counting every terminal elapsed duration at most 300 ms would instead produce `(898 + 90 + 1 + 1) / 1000 = 99%`, concealing the failed work. Equality at 300 ms satisfies the duration test but cannot turn a failed result into a success.

The 300 ms deadline is a known caller terminal failure with a known 300 ms caller wait. Whether and when its server work later succeeds is unknown and unnecessary for this caller objective; do not invent a 300 ms successful service duration. Keep terminal-failure and success duration distributions distinguishable for diagnosis. This table establishes outcome accounting, not an error-handling policy or a statistical improvement claim.

## Same class speeds, different mix

These are two further separate complete five-minute start cohorts, **mix A** and **mix B**, each with 1,000 eligible successful logical history requests, no retries or outstanding requests, and assessment after all terminal events. A class is a meaningful subset of the same operation: **small histories** request up to ten orders; **large histories** request eleven to one hundred orders. The requested limit is known at the caller start. These labels are neither service instances nor claims about a database execution path.

For this constructed demonstration, every small-history request takes 80 ms and every large-history request takes 600 ms, in both cohorts. Only the class counts change; no cause for the changed demand is assigned.

| Request class | Fixed duration of every request in both cohorts | mix A count | mix B count | Class p99 in A | Class p99 in B |
| --- | ---: | ---: | ---: | ---: | ---: |
| Small histories | 80 ms | 995 | 980 | 80 ms | 80 ms |
| Large histories | 600 ms | 5 | 20 | 600 ms | 600 ms |
| All history requests | Mixed | 1,000 | 1,000 | 80 ms pooled | 600 ms pooled |

The declared teaching rank is `ceil(0.99 × 1000) = 990` for each pooled cohort. In mix A, positions 1–995 contain 80 ms, so rank 990 is 80 ms. In mix B, positions 1–980 contain 80 ms and 981–1,000 contain 600 ms, so rank 990 is 600 ms. The complete within-class distributions are unchanged, not just their reported p99 values. This demonstrates why comparable per-class evidence is needed before attributing a pooled rise to slower class performance. The pooled slower experience still matters; explaining it by mix does not make it disappear. Tiny class counts here illustrate exact constructed ranks, not reliable forecasts of class tails.

Do not relabel the original baseline or changed requests with these classes: their class membership remains unspecified. The separate variations must remain labelled wherever used in prose, tables or later figures.

## Measurement-child hand-off

The root's cohort semantics need caller start records and outstanding state. The child should implement a small event-record fixture with request identifier, caller start, optional terminal timestamp, terminal outcome when present, and an assessment cutoff. Filter on start to select the cohort; exclude post-assessment terminal events when recreating a historical cutoff; then calculate the numerator and pending bounds against the selected starts. Incomplete or lost event records cannot justify a complete-population claim.

The ordinary Prometheus path records a caller duration only for an eligible logical history request when it terminates, with bounded class/outcome labels and counts. Its query window selects histogram updates over time; it does not recover the requests' start timestamps. Keep that terminal-observation result labelled separately from the event-record start-cohort result, and demonstrate their difference during the cutoff variation. Never divide a completion-window success count by a start-window count as if they represented the same cohort. A service-only histogram also cannot manufacture the caller boundary. Request identifiers belong in the small event fixture, not in metric labels. Query correctness, scrape effects, supported metric formats and runnable instrumentation remain future child work, not verified results in this plan.

The permitted One history request timeline, Request count and window comparison, Raw requests to buckets, and Scheduled requests during a pause extensions remain separately scoped as in the canonical record. The new cutoff variation supplies the required root outstanding-work demonstration without assigning an arrival schedule to the core datasets or replacing the child's load-generator example.


# Settled root r03 range-count demonstration

This represents the unchanged complete core cohorts; it introduces no new workload.

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



# Child implementation snapshots · centrally settled 2026-10-21

The following originally proposed extensions are accepted for child breakdown review. They preserve the root snapshots and label new independent experiments explicitly. They specify planned fixtures, not executed instrumentation/query evidence.

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
or terminal failure reaches the caller. After validation and deduplication, observe that actual elapsed duration
once only for an eligible logical request; excluded terminals remain in the audit log without a metric observation. No retry occurs in these datasets. Logging overhead, loss and non-atomic log
and metric writes are implementation limits, not evidence of negligible overhead
or durable exactly once delivery. The event fixture is the authoritative cohort
input; a histogram projection does not replace it.

## Excluded health check

This is a separately labelled, two-request adversarial fixture, `experiment_id=eligibility-check`. Use a fresh event list and histogram registry (a separate container for this check's metric objects). It is not extra traffic in baseline, changed, Failure and deadline variation, Requests still waiting, Later completions with an older start, mix A/B, Synthetic query replay clock or Scheduled requests during a pause. It assigns no arrival times to their requests and changes none of their snapshots.

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

Only validated, unique eligible terminal events enter these histogram projections; real failures remain eligible. The Excluded health check below verifies that recording gate.

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
