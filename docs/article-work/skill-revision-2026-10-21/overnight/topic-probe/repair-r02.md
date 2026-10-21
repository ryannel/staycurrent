# Latency root breakdown repair · r02

Recorded working interval UTC: 2026-10-21 21:56:00–21:59:20. Fresh planner assignment; no article writing or independent review commissioned here.

Inputs: frozen breakdown and continuity skills, canonical root and example under `/private/tmp/staycurrent-skills-night-topic/`; local commission, accepted decision ledger, and the original practitioner/teaching reports; repository README and site direction. Outputs: [complete proposed root](root-r02.yaml) and [additive example proposal](example-extension-r02.md). Canonical archive inputs are unchanged.

## Accepted batch repaired

- **LAT-PLAN-01:** Select five-minute **start cohorts**, assess them at an explicit later cutoff, retain all eligible starts, and distinguish terminal-event windows. The root's ten-request Requests still waiting table has eight 80 ms successes plus outstanding ages 400/100 ms. Completed-only p99 is 80 ms and its success fraction 8/8, but cohort timely success can only be 8/10 or 9/10. The 99% target is already missed; final durations remain unknown. Carry the rule into the child through caller event records, not an unsupported claim about histogram queries selecting starts.
- **LAT-PLAN-02:** Replace two baseline 80 ms successes with a 20 ms failure and a 300 ms caller deadline in a separately labelled complete cohort. Explicit row accounting yields 988/1,000 timely successes (98.8%). A duration-only count gives 990/1,000 while concealing both failures. The caller deadline is a known terminal caller wait, not a successful server completion.
- **LAT-PLAN-03:** Add the local subsection When the work changes. Fixed class durations of 80/600 ms and counts 995/5 versus 980/20 move pooled rank 990 from 80 to 600 ms while both entire within-class distributions stay unchanged. Keep this separate from the core baseline/changed pair. No new page or child headings.

## Checks and primary foundations

Read online during this repair:

- [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) supports explicit acquisition boundaries, included requests and aggregation intervals. The chosen start-cohort rule and cutoff bounds are this example's declared design and arithmetic, not a universal rule prescribed by that source.
- [NIST: Percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm) supports ranked observations and estimator differences. Retain the canonical ceiling-rank convention; do not describe it as NIST's preferred estimator.
- [Prometheus: Histograms and summaries](https://prometheus.io/docs/practices/histograms/) supports pooling distributions before quantiles and distinguishes threshold bucket counts from estimates. The root still owns the conceptual result.
- [Prometheus: Query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile) documents histogram range queries, aggregation and interpolation. It supplies no request start timestamps; the child must not claim a normal duration-histogram range selects a start cohort.
- [Official Python client: Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/) documents explicit observations, accumulated counts and timed blocks. The child brief therefore separates event-record start-cohort accounting from durations observed on caller termination. Request identifiers stay outside metric labels.

Local Python expanded the invented counts and selected `ceil(p × N)`. Reconfirmed baseline mean 97.4 ms, p50/p95/p99 80/200/200 ms and budget 990/1,000; changed mean 101.4 ms, p50/p95/p99 80/200/600 ms and budget 980/1,000. Instance p99 values 80/600 ms, incorrect averages 340/132 ms, pooled p99 200 ms remain intact. Independently calculated the three new variations above. PyYAML parsed the proposed root: six top-level headings, one local mix subsection, exactly one child stub containing only topic/title/brief.

## Continuity pass

Audited the complete proposed root reading order and all named displays/stub instructions against the canonical [example](/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles-example.md) and the [proposed additions](example-extension-r02.md). No prerequisite reading. Latency/distribution → percentile/rank/median/tail/mean → logical request/attempt/retry → eligibility/start cohort/assessment/terminal event/deadline/outstanding → objective/budget bounds → class mix → histogram → evidence/decision. Tightened first-use instructions for mean, ceiling rank, eligibility and terminal events. The cutoff first shows incomplete durations; its budget consequence follows the budget definition. Labels, counts and caller boundary agree across plan and additions; pending age never becomes a completed duration. Existing core and instance arithmetic is preserved. No downstream child headings or implemented figures exist to repair; central settlement must pass the additions and attribution rule to the future child planner/writer.

## Limits

Proposed planning repair, not a second independent review. The child remains an unverified contextual implementation brief: no executable event fixture, Prometheus queries, pinned tool support or scrape behaviour has been tested. Existing unspecified timeline/small-sample/bucket/load-schedule extensions remain future work. No article, build, server, browser, rendered figure, service execution, commit, push or publication.
