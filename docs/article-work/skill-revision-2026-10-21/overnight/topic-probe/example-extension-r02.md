# Proposed example additions · root r02

Status: proposal for central integration, accompanying [root-r02.yaml](root-r02.yaml). Extend the frozen canonical `docs/coverage/latency-percentiles-example.md`; do not replace its core counts, durations, derived values, instance split or teaching percentile convention. These additions are separate constructed variations of the same shop and caller boundary, not observed telemetry or explanations of the core changed dataset.

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

The ordinary Prometheus path records a caller duration when that logical request terminates, with bounded class/outcome labels and counts. Its query window selects histogram updates over time; it does not recover the requests' start timestamps. Keep that terminal-observation result labelled separately from the event-record start-cohort result, and demonstrate their difference during the cutoff variation. Never divide a completion-window success count by a start-window count as if they represented the same cohort. A service-only histogram also cannot manufacture the caller boundary. Request identifiers belong in the small event fixture, not in metric labels. Query correctness, scrape effects, supported metric formats and runnable instrumentation remain future child work, not verified results in this plan.

The permitted One history request timeline, Request count and window comparison, Raw requests to buckets, and Scheduled requests during a pause extensions remain separately scoped as in the canonical record. The new cutoff variation supplies the required root outstanding-work demonstration without assigning an arrival schedule to the core datasets or replacing the child's load-generator example.
