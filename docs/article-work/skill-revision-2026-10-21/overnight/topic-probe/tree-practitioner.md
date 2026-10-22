# Practitioner review · tree · latency-percentiles root and child · LAT-TREE-r01

Inputs read: the complete frozen canonical root (including its complete embedded child), the complete standalone child, the shared example, and the commission bound below. Read the frozen checkout's `AGENTS.md`, `README.md`, `docs/site-direction.md`, local `staycurrent-review/SKILL.md` and only its practitioner perspective. This is a fresh independent first reading of the complete two-article tree, not confirmation of any earlier node judgement. No earlier version, report, decision, planning record, other candidate output or agent inventory was consulted.

Highest severity: none

## UTC interval and input bindings

Recorded substantive review interval: **2026-10-22 01:37:53–01:39:04 UTC** (reading, primary-source verification, ownership assessment and arithmetic checks). Report preparation interval: **2026-10-22 01:39:04–01:39:57 UTC**; final source/report verification followed. The supplied manifest is `tree-r01-manifest.json`, version `LAT-TREE-r01`, frozen `2026-10-21T22:36:34.572080+00:00`, candidate `D-02 unchanged`, source root `/private/tmp/staycurrent-skills-night-topic`.

I recomputed SHA-256 for every manifest input; all four matched:

| Input | SHA-256 |
| --- | --- |
| Frozen `docs/coverage/latency-percentiles.yaml` | `a7f880cb0b3c3925401170a458060c0ac3fa48baec66f51e0201ccbdeb34510f` |
| Frozen `docs/coverage/latency-percentiles-child.yaml` | `4d856f85b57327759e6b7e46746937a1be481bf98704b2079bcc2fda53431986` |
| Frozen `docs/coverage/latency-percentiles-example.md` | `d20e9978b57f80bdde9d7cff54b9ede27d0a05d4d7bc8d31d6d9db132af43381` |
| Commission in this report's directory | `5373a45e612794c3b0ed735fa310609468f3a4f8193d59d69a85f14a3b7064be` |

The frozen root has six top-level headings and exactly one embedded article. A read-only Python/PyYAML parse confirmed that this embedded article and the standalone child are semantically equal; the child has seven top-level headings. This checks the current inputs themselves, without relying on prior approval.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Declared raw ranks, pooling, outcome-aware budget arithmetic, pending bounds, event selection and histogram calculations agree; consequential implementation claims checked against the primary sources below. |
| 2. Evidence | pass | Constructed request sets, event fixtures and counter-sample schedules are explicitly separate. Expected outputs are specifications; eventual execution and version records remain required. |
| 3. Coverage | pass | The complete tree covers interpretation, measurement selection, practical release decisions and the awkward accounting, representation and offered-demand cases in the commission. |
| 4. Depth, both ways | pass | Root reasoning is sufficient for the decision; the child supplies the implementation and its limitations. No necessary practitioner subject is ownerless and no unnecessary specialist branch is commissioned. |
| 5. Ownership | pass | The parent owns statistical meaning and evidence judgement; the child owns producing/auditing that evidence. Shared concepts are carried forward as reminders and implementation checks, rather than duplicate full lessons. |

## Complete-tree ownership and dependencies

| Needed subject | Owning contribution | Boundary and downstream check |
| --- | --- | --- |
| Latency boundary, percentile/rank, mean, median, tail and request/user distinction | Root: first two headings | Child uses these definitions to put its timer around the logical caller request, rather than substituting server time. |
| Population, eligibility, start cohort, terminal events and assessment cutoff | Root: whose wait and budget sections | Child implements these exact predicates with start/terminal joins, collection-time assumptions and historical replay. |
| Failure/deadline treatment and pending lower/upper bounds | Root: budget section | Child reproduces 988/1,000 and the cutoff case, retaining every eligible start and excluding failures from timely successes. |
| Pooling across instances or time | Root: combination section | Child retains compatible bucket information and applies `rate` before aggregation; it does not average reported quantiles. |
| Loss of duration detail despite complete observation | Root: same-range-count counterexample | Child owns cumulative representation, interpolation arithmetic, the explicit threshold boundary, resolution and format choice. |
| Request counts, window trade-offs, future uncertainty and changing class mix | Root: mix and tail-evidence sections | Child preserves independent variations and offers class/outcome query slices without assigning unspecified classes to the core data. |
| Caller recording, validation, deduplication and coverage limits | Child: recording and replay sections | Complete-record assumptions and crash/non-atomic-write limits prevent fixture correctness becoming a claim of durable production completeness. |
| Prometheus recording, query populations, scrape/reset/missing-series behaviour and expression fixtures | Child: terminal observation, precision and query sections | Terminal-observation ratios remain distinct from the root's chosen start-cohort objective; the child does not claim that scraping reconstructs exact event windows. |
| Offered demand, generator lag and coordinated omission | Child: test suitability section | Root asks for comparable demand; child explains how to audit it. Unsent work stays a test-validity issue, outside the actual-start denominator. |
| Accept, investigate or collect better evidence | Root: final section; child supplies measurement handover | Both resolve their own task. Diagnosis of resources/queues, a monitoring architecture and long-term reliability policy remain outside the commission. |

The root completes both its failed-percentile-average example and its information-loss example before linking to the child. Its final decision remains possible without PromQL. Conversely, the child's recorder and query fixtures have distinct jobs: the event path answers the selected cohort question; the metric path answers a labelled terminal-observation question. Neither path is presented as a replacement for the other. No second child is needed to complete the promised contribution.

## Primary sources and numerical verification

Sources checked during the interval above:

- [NIST, Percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm): ordered observations, ranks, median and the existence of differing practical percentile estimators support explicitly declaring the teaching convention instead of attributing it to every tool.
- [Google SRE, Implementing SLOs](https://sre.google/workbook/implementing-slos/): target reliability and good-event/total-event reasoning support choosing a useful operation-level objective. The plan's five-minute start cohort, 300 ms inclusive threshold and 99% target remain its invented local choices.
- [Prometheus, Histograms and summaries](https://prometheus.io/docs/practices/histograms/): aggregation needs retained distributions; precomputed summary quantiles cannot be pooled. The current documentation also supports checking the actual instrumentation path before advising native histograms.
- [Prometheus, Query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/): checked `histogram_quantile`, `histogram_fraction`, `rate` and `increase`. Classic buckets require `le` through aggregation and use linear interpolation; unaligned fraction thresholds can require estimation. Reset handling requires rate before aggregation, and extrapolation means sampled rates/increases are not exact event selections or necessarily integer counts. These support the child's explicit distinctions and query structures.
- [Python client, Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/), [Labels](https://prometheus.github.io/client_python/instrumenting/labels/) and [Summary](https://prometheus.github.io/client_python/instrumenting/summary/): checked configurable cumulative upper-bound buckets, `observe`, count/sum, label initialisation and the absence of locally computed quantiles in Python Summary.
- [Python, time](https://docs.python.org/3/library/time.html#time.monotonic): the monotonic reference point is undefined; elapsed differences are valid. This supports separate calendar start time and integer monotonic duration readings.
- [Prometheus, Unit testing for rules](https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/): supplied input series, evaluation times and `promql_expr_test` expected samples support the proposed expression fixture, without needing live scraping.
- [Grafana k6, Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [Dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/): completion-dependent starts can suppress intended independent arrivals; arrival-rate executors can still drop iterations when workers are unavailable. The plan correctly keeps this distinct from genuinely serial user behaviour.

Independent arithmetic from the supplied constructed inputs, including a small calculation-only JavaScript check, confirms:

- Baseline/changed means 97.4/101.4 ms, p50 80/80 ms, p95 200/200 ms and declared-rank p99 200/600 ms; timely successes 990/980 of 1,000.
- The instance p99 arithmetic average is 340 ms, weighted average 132 ms and pooled p99 200 ms.
- Failure/deadline projections total 1,000 terminal observations and 97.56 seconds; 988 timely successes differ from the duration-only count of 990.
- Identical coarse range counts locate rank 990 in `(100,1000]` ms; they cannot order the two raw p99 values. The child estimates are approximately 918.18 ms for either coarse view, 457.89 ms for changed decision buckets and 576.32 ms after adding 550 ms.
- The ten-start cutoff has 8–9 possible timely successes; the extended event rows settle at 9/10. The older-start row produces the different 9/9 terminal-event result, followed by 1/2 in the next terminal window; the empty later start cohort is undefined.
- The independent pause schedule gives six durations 560/460/360/260/160/80 ms and three timely successes; the serial version starts only two requests, with the second 460 ms late. Excluded health-check recording changes audit entries without changing eligible outputs or metric projections.

These are checks of the specified mathematics and model, not observed shop, recorder, Prometheus or load-generator results.

## Findings

None. No `practitioner-2` finding was needed; that supplied next number remains unused.

## Limits

This is complete-tree planning review, not article or executable-fixture approval. The 100-request example and caller/server/database timeline still require concrete writer-supplied states within their explicit boundaries; no unsupplied timing decomposition or arrival order was inferred here. The child still must implement and run its recorder, reducer, exclusion check, query fixture and adversarial cases, record versions/outputs and expose any unexecuted parts. No live Prometheus, service, scrape, load test, browser, build or rendered-control verification occurred. No publication, commit or push was performed. Only this assigned report was written; the frozen plans and shared example were not edited.

The review establishes no result for future traffic or causal release regression. Native-histogram compatibility remains a check against the eventual chosen stack. Other required perspectives and the coordinator's full-tree judgement remain independent requirements.
