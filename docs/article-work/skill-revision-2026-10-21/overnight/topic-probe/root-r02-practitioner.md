# Practitioner review · breakdown · root and contextual child stub · latency-root-v2

Candidate: D-02. Full independent practitioner perspective.

Started UTC: 2026-10-21 22:01:13. Completed UTC: 2026-10-21 22:02:13.

Inputs read: [fixed manifest](root-r02-manifest.json), [commission](commission.md), and every file in `snapshots/root-v2`: complete `docs/coverage/latency-percentiles.yaml` (root and contextual child stub), `docs/coverage/latency-percentiles-example.md` (canonical example and all settled extensions), and `docs/article-work/latency-skill-trial/registry.json`. All three SHA-256 hashes match the manifest. Read the assigned review skill and only its practitioner perspective. No previous reports, findings, planning/repair records or coordinator opinions were consulted. The manifest's administrative stage text was not treated as quality evidence.

Highest severity: none.

## Checks

| Check | Result | Note |
| --- | --- | --- |
| 1. Correctness | pass | Recomputed every supplied core, instance, outcome, mix and cutoff result; checked consequential percentile, histogram, label and load-generation claims against primary sources below. |
| 2. Evidence | pass | Constructed cohorts and variations are labelled; exact finite-set arithmetic, incomplete observations, future-traffic uncertainty and histogram approximation remain separate. Planned fixtures are not reported as observed service measurements. |
| 3. Coverage | pass | Covers the commission's interpretation and release-decision workflow, including unfinished work, failed outcomes, caller deadlines, changing mix, pooling, sparse tails and changed measurement boundaries. The child stub provides an implementable route without substituting a completion window for a start cohort. |
| 4. Depth, both ways | pass | The root supplies the practical distinctions needed to use the evidence without requiring statistical background. Query mechanics, scrape effects and load-generator implementation appropriately remain child work; no substantive missing or unnecessary depth identified at breakdown stage. |
| 5. Ownership | pass | Root owns meaning and decisions; the single child owns producing and verifying the measurement path. Shared examples support this hand-off without commissioning two full treatments of the same mechanism. Resource diagnosis remains outside the commission. |

## Technical and implementability evidence

The declared nearest-rank convention produces baseline/changed means 97.4/101.4 ms, p50 80/80 ms, p95 200/200 ms and p99 200/600 ms. The instance p99 values 80 and 600 ms yield arithmetic/count-weighted averages 340 and 132 ms; neither equals the pooled 200 ms. The failure variation yields 988/1,000 timely successes; duration-only counting yields the misleading 990/1,000. The incomplete ten-start cohort permits only 80% or 90% eventual timely success. Mix A/B pooled p99 values are 80/600 ms with unchanged class distributions. Reproduction: Python 3.14.5, disposable `python3 - <<'PY'` calculation using expanded count arrays, `sorted(a)[ceil(p*len(a))-1]`, sums and explicit outcome counts; no service, Prometheus or load generator was executed.

The root's start-cohort rule is operationally precise: caller starts determine membership, a later assessment determines known outcomes, and pending ages do not become terminal observations. The child hand-off specifies the fields and historical-cutoff filtering necessary to reproduce that rule. Its ordinary histogram path is explicitly a separate terminal-observation population. A successful implementation must still prove its scrape/query behaviour; the plan does not claim that proof already exists.

Primary sources checked on 2026-10-21 UTC:

- [NIST, Percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm): ranks, median and differing sample-percentile estimators. The plan declares its convention rather than claiming every tool uses it.
- [Prometheus, Histograms and summaries](https://prometheus.io/docs/practices/histograms/): pooling compatible distribution information, non-aggregatable precomputed quantiles, bucket/resolution error, threshold counting and outcome exclusions. The child defers metric-format choice to verified tool support.
- [Prometheus, Metric and label naming](https://prometheus.io/docs/practices/naming/): units and unbounded label cardinality; the stub correctly retains request identifiers in event records rather than metric labels.
- [wrk2 author's README, latency measurement technique](https://github.com/giltene/wrk2#readme): response-dependent sending can omit independent offered demand; intended starts and actual starts are relevant distinct records. The stub also requires distinguishing a legitimate closed-loop workload from an unsuitable test.

## Findings

None. No finding number consumed; the next available practitioner identifier remains `practitioner-2`.

## Limits

This is a complete breakdown review of the fixed root, canonical example, registry and contextual child stub, not a review of a written article or a fully planned child. The remaining timeline split, 100-request comparison, bucket estimator and scheduled pause are explicitly future constructed extensions: their eventual data, calculations, queries, instrumentation and rendered controls cannot yet be verified. No browser, build, server, telemetry capture or native query fixture was run. No earlier quality verdict was reused. Primary documentation checks establish the plan's technical direction, not execution evidence or permission to publish.
