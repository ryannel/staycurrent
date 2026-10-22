# Latency whole-tree planning repair · r02

Status: complete proposed planning repair of accepted **LAT-TREE-01 / teaching-4 · medium**, pending central integration and fresh independent review. The D-02 control and review policy are unchanged.

## Inputs and UTC record

Read the frozen local AGENTS.md, README.md, site direction, breakdown skill and continuity skill; then the complete current commission, root with embedded child, standalone child and shared example before reading the accepted first whole-tree teaching report. The accepted issue is [teaching-4](tree-teaching.md): a time series was unexplained at the first label definition and remained implicit through aggregation.

Preparatory reading began before the first captured clock reading. Captured substantive-work interval: **2026-10-22T01:51:50Z–2026-10-22T01:54:26Z**; delivery/report finalisation captured at **2026-10-22T01:55:24Z**. Complete-input reading preceded the finding/source checks; source checks, proposal writing and structural/arithmetic validation were complete by the captured end. This report records that interval; it does not infer an earlier timestamp.

The local source files are those bound by [tree-r01-manifest.json](tree-r01-manifest.json). All four hashes still matched at the final validation. The embedded input child and standalone input child were semantically identical. Historical root repair reports remain at their existing paths; this report uses a tree-prefixed name to avoid overwriting `repair-r02.md`.

## Outputs and semantic diff

- [Complete proposed tree](proposed-tree-r02.yaml): full root and embedded child, with exactly three existing child briefs changed.
- [Proposed example delta](tree-example-delta-r02.md): the concrete additive teaching view for central settlement. It reuses the existing eligibility-check inputs; only its explanatory scrape readings are newly specified.

One existing section, **Observe terminal durations in Prometheus**, continues to own the entire repair. Its introduction now teaches the missing data model before bounded-label choices, follows the existing eligible-01 terminal through the recording gate and multiple cumulative totals, then shows successive samples of those same totals. It introduces the bucket/count/sum notation where the display first needs it. The existing **Export compatible buckets with bounded labels** brief refers back to this model instead of defining those meanings later. The existing **Combine observations before asking for p99** brief reuses the series identities to explain per-series rate inputs and grouping at evaluation time.

The named **One observation, repeated readings** table is part of the existing **One termination, two records** teaching display. With fresh isolated state, eligible-01's 80 ms success contributes one 0.08-second observation: seven cumulative buckets each gain one, `_count` gains one and `_sum` gains 0.08. Fabricated readings at 10, 90 and 130 ms show zero, then those totals, then the same totals after the existing excluded check-01 terminal. The display explicitly separates request observation, cumulative metric value and timestamped scrape sample. Complete stored identities include the configured target labels; the new view does not add IDs as metric labels. It reuses caller-a as an isolated display label and does not attach the eligibility-check state to the baseline exporter partition.

In the query brief, rate reads each selected bucket series' sampled history first; `sum by (le)` then combines rates across selected label identities with the same bound. Retaining request_class keeps separate class/bound groups. This makes the inputs and grouping visible without adding scrape totals across time or combining different cumulative bounds.

No topic, title, article brief, heading, article boundary or query expression changed. All six root headings and their briefs remain identical, including the child commission. The child's seven top-level headings and both existing Prometheus subsections remain in place. No further article is proposed.

## Continuity audit

Repeated the complete planned reading-order audit, including every named display and fixture brief, against the canonical [example record](/private/tmp/staycurrent-skills-night-topic/docs/coverage/latency-percentiles-example.md) plus the proposed delta. There is no implemented article, caption, control or step text in this assignment; this is a plan-level audit.

**Root:** the order remains durations/distribution, ranked percentiles and mean, caller boundary and cohorts, outcome-aware budget, class mix, pooling and retained duration detail, evidence limits, then the release decision. No new prerequisite is imposed on the root. Its raw core values, range-count loss, pending bounds and decision results remain intact.

**Child:** it explicitly continues the root's definitions, then teaches event records, joined starts/terminals, cutoff reconstruction and the Prometheus projection. At the repaired point, time series/metric name/label/value now precede bounded labels and grouping; sample/counter/scrape precede repeated readings; seconds and cumulative bucket/count/sum meanings precede the observation update. The export subsection expands that already visible model into the existing complete layout and eligibility check. PromQL/rate/sum/grouping follow it, with downstream class/outcome grouping, threshold ratios and the synthetic query replay still referring to the same identities. Resolution and offered-demand cases keep their previous places and meanings. The delta explicitly identifies any target labels supplied by scrape configuration and keeps a complete label set distinct from display abbreviations.

**State and names:** eligibility-check retains eligible-01 (start 0 ms, success 80 ms, eligible=true) and check-01 (start 100 ms, success 120 ms, eligible=false), both unclassified. No request or terminal is added. The samples are a proposed independent view of that same fixture; they do not replace the separate five-minute Synthetic query replay clock. The baseline/changed core, failure/deadline replacement, 900/100 caller partition, mix A/B, original pending case, labelled later-completion extension and pause experiment retain all their existing identities, values, window membership and assessment semantics. The illustrative display changes none of their totals. No pending age becomes a duration; an excluded success contributes no metric observation; a later scrape does not create another request. The subsequent budget and handover results need no adjustment.

## Verification and primary foundations

PyYAML 6.0.3 parsed the complete proposed tree. A recursive comparison found exactly these changed leaf fields:

```text
/heading/3/nested_article/heading/2/brief
/heading/3/nested_article/heading/2/heading/0/brief
/heading/3/nested_article/heading/2/heading/1/brief
```

Independent arithmetic checked the proposed 0.08-second contribution against all seven unchanged bounds and reconfirmed the baseline partition's cumulative vector `900,990,990,999,999,1000,1000`. These checks validate planned arithmetic and structure, not a recorder or Prometheus execution. All original LAT-TREE-r01 manifest inputs remain byte-identical and the original manifest stays valid until central merge.

Primary sources read during this repair:

- [Prometheus data model](https://prometheus.io/docs/concepts/data_model/): identity and timestamped samples.
- [Metric types: classic histogram](https://prometheus.io/docs/concepts/metric_types/#histogram): constituent cumulative bucket/count/sum series and inclusive bounds.
- [Python client Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/): explicit single observations and exposed totals.
- [Jobs and instances](https://prometheus.io/docs/concepts/jobs_instances/): target labels supplied when scraping.
- [Aggregation operators](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators): sum and retained grouping labels.

The request rows are already accepted constructed inputs. Their new explanatory reading times and expected values are planned fixture/display specifications, not observations of service, recorder, scrape or query behaviour. No native implementation or version-support claim is added.

## Central hand-off and remaining gate

Integrate the example delta centrally, then synchronise the complete proposed embedded child with the standalone child. This worker has not changed any canonical input. After integration, freeze a new complete-tree manifest and commission a **fresh full practitioner, value and teaching round 2** under the unchanged D-02 control. This repair report is not an independent approval and does not reduce that review to the repaired section.

No article prose, team dispatch, browser, build, development server, instrumentation/query execution, commit, push or publication was performed.
