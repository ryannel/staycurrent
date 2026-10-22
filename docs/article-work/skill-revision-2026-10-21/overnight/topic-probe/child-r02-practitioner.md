# Practitioner review · breakdown · latency measurement child · LAT-CHILD-r02

UTC start: 2026-10-21 22:32:14. UTC end: 2026-10-21 22:32:58.

Inputs read: unchanged D-02 `staycurrent-review/SKILL.md` and practitioner perspective; all four complete inputs in [child-r02-manifest.json](child-r02-manifest.json): canonical child, accepted parent, full shared example including Excluded health check, and commission. All four SHA-256 values match the manifest. No previous reports, decisions, planning records, repair history or other reviewers' opinions read. No sibling or further child is commissioned.

Highest severity: none

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Planned cohort predicates, outcome accounting, pooling, interpolation, clock choices and offered-demand distinction agree with the example and primary sources below. |
| 2. Evidence | pass | All traffic and counter samples are expressly constructed; expected fixture outputs are specifications. The plan requires eventual versions, execution and actual output without claiming that execution has happened. |
| 3. Coverage | pass | Covers complete caller recording, cutoff reconstruction, pending bounds, eligibility, failed outcomes, compatible histogram aggregation, representation loss, scrape/reset limits and suppressed demand, with actionable handover judgements. |
| 4. Depth, both ways | pass | No missing practitioner understanding or unnecessary specialist treatment identified against this implementation brief. The two fixtures and adversarial cases earn their place; durable collection architecture and resource diagnosis remain outside scope. |
| 5. Ownership | pass | Parent retains interpretation and the release decision. Child owns implementable recording, query arithmetic and test suitability, using reminders rather than a second statistics treatment; no further article is needed. |

## Evidence checked

- [Prometheus query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/) supports `rate` before aggregation, retained `le`, classic linear interpolation, native boundary estimation and extrapolated rates. The planned pooled expressions follow those rules. Independent arithmetic checks give coarse 918.18 ms, decision 200/457.89 ms and finer-tail 576.32 ms; threshold snapshots remain 99%, 98% and 98.8%.
- [Prometheus histograms and summaries](https://prometheus.io/docs/practices/histograms/) supports distribution pooling and the inability to combine precomputed quantiles. The plan appropriately makes format advice conditional on the stack.
- Python client [Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/), [Labels](https://prometheus.github.io/client_python/instrumenting/labels/) and [Summary](https://prometheus.github.io/client_python/instrumenting/summary/) documentation supports configurable cumulative inclusive buckets, explicit label initialisation and the warning that Python Summary supplies no local quantiles.
- [Python clocks](https://docs.python.org/3/library/time.html#time.monotonic_ns) supports integer monotonic elapsed differences and separate calendar membership. [Promtool expression tests](https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/) supports the proposed separate synthetic-series fixture.
- Grafana k6 [open/closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/) supports the planned scheduling distinction and worker-capacity checks. The six-request table is internally consistent with its explicitly invented response model.

The eligibility check tests the vulnerable recording operation itself: the excluded 20 ms success adds audit entries while leaving cohort counts, every bucket, count and sum unchanged. Its fresh-state variants avoid contaminating canonical traffic; checking count and sum catches a broken gate that the unchanged 100% ratio would conceal.

## Findings

None. Finding number `practitioner-2` remains unused.

## Limits

Full practitioner breakdown review, not verification of a written implementation. No recorder, service, Prometheus query fixture, browser, build or server was executed. The expected outputs and in-process uniqueness guarantee must still be demonstrated by the eventual implementation; production collection coverage and crash behaviour remain explicitly unproven.
