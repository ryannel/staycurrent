# Child planning record

**Article:** Building trustworthy latency measurements. **Status:** draft breakdown
for coordinator-managed review; no article, implementation or publication produced.

Started **2026-10-21 22:18:07 UTC**. Source checks and arithmetic completed by
**2026-10-21 22:21:57 UTC**; final continuity/file checks completed at the UTC time
recorded below. Applied the frozen `staycurrent-breakdown` and
`staycurrent-continuity` instructions under
`/private/tmp/staycurrent-skills-night-topic/.agents/skills/`.

Inputs: [commission](commission.md), accepted root and shared example at
`/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles.yaml`
and `latency-percentiles-example.md`, plus repository README and current site
direction. No other experiments or historical review records were inputs.

Outputs: [child.yaml](child.yaml), [proposed shared snapshots](example-extension-child.md).
The proposal is for central integration; the canonical example was not edited.

## Practitioner outcomes and scope

The reader should implement and audit an actual-start cohort report, including
outstanding state and historical cutoff; recognise what an ordinary terminal
histogram measures; combine compatible observations across caller exporters;
choose duration resolution and exact outcome-aware threshold counting; and refuse
a capacity comparison when intended independent demand was suppressed. These are
the child's part of the commission's expertise goal, not a new observability
specialism. The root retains percentile meaning, basic population choices,
statistical evidence limits and the complete interpretation workflow.

Seven sections contain nine useful leaves. No further article is proposed. The
plan specifies complete runnable event and PromQL fixtures for the eventual
writer, with expected results and recording limits; they were not implemented or
executed during planning. No server, browser, build, commit or push was run.

## Primary-source checks

Read online on 2026-10-21 between 22:18 and 22:20 UTC. These are current official
sources; the eventual runnable files must record the actual pinned versions used.

- [Python clock API](https://docs.python.org/3/library/time.html#time.monotonic):
  monotonic time supports elapsed differences and has an undefined reference;
  integer nanosecond readings are available. Supports the separate duration and
  calendar-membership fields, not an assertion of synchronised caller clocks.
- [Python Prometheus histogram API](https://prometheus.github.io/client_python/instrumenting/histogram/):
  configurable classic bounds, cumulative inclusive `le` buckets, sum/count and
  observation API support the selected executable path.
- [Python label API](https://prometheus.github.io/client_python/instrumenting/labels/):
  labelled series are not created automatically; initialise known combinations
  before traffic. Supports the explicit zero-success case.
- [Prometheus naming guidance](https://prometheus.io/docs/practices/naming/):
  base units and avoiding uncontrolled label values support seconds and keeping
  identifiers out of metrics.
- [Prometheus histogram guidance](https://prometheus.io/docs/practices/histograms/):
  precomputed summary quantiles cannot be aggregated; histograms retain mergeable
  distribution information. Resolution and threshold alignment matter. Current
  guidance favours native histograms when available; classic use here is a concrete
  explicit-boundary implementation, not a universal recommendation.
- [PromQL functions](https://prometheus.io/docs/prometheus/latest/querying/functions/):
  classic quantiles retain `le`, pool rates before quantile calculation and use
  linear interpolation; rate handles counter resets and extrapolates, and should
  precede aggregation. This supports the query order and separation of snapshot
  threshold classification from approximate temporal attribution. Zero observations
  do not yield a healthy percentile.
- [Native histogram specification](https://prometheus.io/docs/specs/native_histograms/):
  native support spans the client, scrape/server and transmission paths. Current
  documentation identifies stable server support from 3.8, with explicit scrape
  configuration requirements. The plan requires stack/version checks and does not
  claim native support is universally experimental or absent in Python.
- [Promtool expression fixtures](https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/):
  input series, evaluation times and expected expression samples can test the
  planned arithmetic without a running service. No successful test is claimed here.
- [k6 open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/):
  completion-dependent scheduling reduces offered arrival rate as waits grow;
  independent arrival scheduling serves a different test question. This supports
  the pause example's distinction, not any prediction of a real service's timing.
- [k6 dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/):
  arrival-rate execution can still fail to start intended work when workers are
  unavailable. Supports reporting unsent work rather than trusting scheduler mode.

The event schema, fixture values, pause response rule, exporter partition and
accept/investigate/measure-again teaching choices are proposed design decisions,
not facts attributed to these sources. Scraped counters have no per-request start
key; the window mismatch follows directly from the specified observation point.

## Arithmetic and continuity audit

Checked the full planned reading order, including named tables/listings and their
step labels, against the canonical record. The child explicitly builds on the
root; logical request/attempt, start cohort, eligibility, p99/rank, histogram,
request class and outcome receive reminders before use. First introductions here
cover event records and join keys, monotonic clocks, reducer, counters/scrapes,
metric labels, cumulative `le`, PromQL operations, interpolation quantities,
offered demand and generator lag. Units change explicitly from raw milliseconds
to exported seconds. The metric is a caller metric; scrape instance names identify
caller exporters and cannot be confused with history-1/history-2 server instances.

A local arithmetic-only Python check confirmed cumulative tables and sums:
baseline 97.4 seconds, changed 101.4 seconds, failure variation 97.56 seconds;
threshold success counts 990,980,988; all-outcome failure threshold count 990.
Interpolation expectations are 918.181818… ms for both coarse layouts,
457.894736… ms for changed decision buckets and 576.315789… ms with the narrower
550–600 ms bucket. Baseline decision-layout estimate is 200 ms. These are computed
model expectations, not Prometheus execution outputs.

The extra older start is outside the selected ten-start cohort. At the original
cutoff the two later terminals remain invisible, preserving 80–90% bounds. The
separate extended terminal window has 9/9 timely successes; later the original
cohort settles at 9/10 and raw p99 600 ms. The separate later terminal window has
1/2 timely successes and the later start cohort has no requests. Final fractions
never mix different denominators. Pending ages never become completed durations.
The complete-record/inclusive-assessment convention is explicit at the 300 ms edge.

The pause model offers six independent starts, with three timely successes. Serial
dispatch offers two starts, four unsent requests and 460 ms lag on its second
start; at cutoff it has one terminal and one pending. The model does not promise
that every reported percentile falls: missing offered demand alone invalidates
the intended independent-capacity comparison. Unsent requests remain outside the
root's actual-start denominator. Different experiments use separate event identities.

A PyYAML structural read passed: exactly topic/title/brief/heading at article level,
singular recursive heading lists, seven top-level sections, nine leaves, zero
nested articles. No technical teaching claim depends on running the site. Planned
fixture execution, selected software versions, real collection completeness and
rendered figures remain future writing/implementation evidence.

Final continuity and structural check: **2026-10-21 22:22:39 UTC**. No unresolved
arithmetic or naming conflict found; proposed extensions await central settlement.
