# Practitioner review · breakdown · Building trustworthy latency measurements · LAT-CHILD-r01

UTC start: 2026-10-21 22:23:50  
UTC end: 2026-10-21 22:24:56

Inputs read: unchanged D-02 review skill and its practitioner perspective; complete child plan, accepted parent plan and full shared example named in [child-r01-manifest.json](child-r01-manifest.json); commission. All four input hashes match the manifest. No other reports, decisions, planning/repair history, candidate conclusions or author opinions read.

Highest severity: medium

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | finding | Cohort bounds, outcome arithmetic, cumulative bucket counts/sums, interpolation and pause schedule are consistent; the histogram eligibility gate is unspecified (practitioner-1). |
| 2. Evidence | pass | Constructed records, counter replay and pause model are explicitly distinguished from observed service execution; future fixture versions/output must be recorded. |
| 3. Coverage | finding | Strong coverage of pending work, collection cutoffs, errors, resets, absent data, empty traffic, incompatible layouts and suppressed demand; ineligible traffic is not carried through the metric implementation (practitioner-1). |
| 4. Depth, both ways | pass | Two complete runnable paths are appropriate to the implementation promise; native formats and load scheduling stay at useful decision depth. No additional missing understanding or unnecessary mechanism identified. |
| 5. Ownership | pass | Root owns interpretation; child owns recording, representation, query execution and generator validity. Compact reminders use the settled examples without claiming the root already executes them. No further child is needed. |

## Findings

### practitioner-1 · medium · child: Observe terminal durations in Prometheus / Export compatible buckets with bounded labels / budget query

Problem: Eligibility is implemented explicitly in the event reducer but has no specified implementation in the histogram path. The plan connects each unique terminal event to a duration observation (lines 84–88), shares that terminal handler with the recorder (104–105), and retains only class/outcome metric labels (92–94). Neither the recording brief nor the query selector (140–141) excludes `eligible=false` events. Matching service/environment does not exclude a synthetic health check made against that same operation. The final instruction to fix eligibility predicates identifies the concern without teaching the required gate.

Effect: To implement the promised compatible paths, the reader has to supply this population rule themselves. Following the all-terminal observation path can include fast ineligible checks in both the metric numerator and denominator while the event cohort correctly excludes them, making the two results differ for a reason beyond their deliberately different time attribution. The supplied all-eligible datasets cannot expose that mistake.

Suggestion: Specify that the history histogram observes only eligible logical history requests, while the event log may retain excluded requests for audit; alternatively retain a bounded eligibility dimension and filter both query populations consistently. Include one explicitly separate ineligible-event check showing that its terminal record changes neither histogram objective population nor eligible cohort result.

Evidence: The accepted parent budget excludes identified synthetic health checks; the shared event schema permits Boolean eligibility and the child reducer filters it. The histogram projection drops this field. The [Python histogram API](https://prometheus.github.io/client_python/instrumenting/histogram/) counts supplied observations; it cannot later recover an eligibility attribute that was neither filtered nor retained.

## Primary-source checks

- [Prometheus query functions](https://prometheus.io/docs/prometheus/latest/querying/functions/): checked cumulative inclusive classic buckets, aggregation retaining `le`, linear classic interpolation, native interpolation/fractions, empty-histogram `NaN`, extrapolation and rate-before-sum reset handling. The planned query forms and numerical estimates agree.
- [Prometheus histograms and summaries](https://prometheus.io/docs/practices/histograms/): checked threshold counting, duration resolution and why precomputed summary quantiles cannot be pooled.
- Python client [Histogram](https://prometheus.github.io/client_python/instrumenting/histogram/), [Labels](https://prometheus.github.io/client_python/instrumenting/labels/) and [Summary](https://prometheus.github.io/client_python/instrumenting/summary/): checked configurable cumulative buckets, count/sum, explicit label initialisation and the absence of locally computed Python Summary quantiles.
- [Native histogram specification](https://prometheus.io/docs/specs/native_histograms/): current support/configuration is stack dependent; the plan correctly commissions a current compatibility check instead of a universal support claim.
- [Promtool unit-test format](https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/): explicit series, intervals, evaluation times and expression expectations can implement the proposed synthetic replay and missing-sample checks.
- [Python clocks](https://docs.python.org/3/library/time.html#time.monotonic): elapsed differences and integer monotonic readings support the proposed real-clock substitution; calendar membership remains separate.
- k6 [open/closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) and [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/): independent scheduling, closed-loop demand suppression and unavailable-worker limits support the commissioned practical judgement.

## Limits

This is a full practitioner breakdown review of commissioned outcomes and implementation feasibility, not prose or rendered-media review. No article, recorder or Promtool fixture exists to execute. Arithmetic was inspected against the complete specified inputs and documented algorithms; no planned command, scrape, native query output or service behaviour is reported as observed. No source edit, build, server, commit or push was performed; only this report was created.
