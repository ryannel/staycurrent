# Bare-topic planning record

- Input version: frozen D-02 archive at `/private/tmp/staycurrent-skills-night-topic/`.
- Topic supplied: Latency percentiles. No preferred treatment or solution supplied.
- Start: 2026-10-21 21:46:22 UTC.
- End: 2026-10-21 21:49:03 UTC.
- Stage: inferred commission, root breakdown, example proposal. Drafts for coordinator-managed review.
- Outputs: [commission.md](commission.md), [root.yaml](root.yaml), [example-proposal.md](example-proposal.md).

## Inputs and scope decisions

Read archive `AGENTS.md`, `README.md`, `docs/site-direction.md` and installed orchestration, breakdown and continuity skills. Read the existing relational performance article `src/articles/relational-next/a05.astro`, concurrent-load article `a28.astro`, and object-storage `performance-and-cost.md`; used them for neighbouring scope, not a prescribed treatment. Initial filename guesses for `src/articles/relational/a05.astro`, `a27.astro` and a performance route did not exist; located the actual archive sources before use. No historical skills, experiment reports, candidate plans or review opinions were read.

Infer the job as interpreting and producing latency evidence for service-performance decisions. Existing articles use percentiles but concentrate on database work, contention or storage choices. Keep those diagnoses there. A root on interpretation plus a child on measurement is proposed because an implementable data path needs more detail than a dashboard reader needs at first. The two-article limit is not a quota. Do not extend into a field launch or the shared distributed-systems programme. No child headings were planned.

## Primary-source checks (21 October 2026)

- [NIST/SEMATECH, Percentiles](https://www.itl.nist.gov/div898/handbook/prc/section2/prc262.htm): checked sorted observations and ranks, and the existence of differing sample estimators. Therefore the example declares a simple nearest-rank convention rather than claiming all software returns the same number.
- [Google SRE, Service Level Objectives](https://sre.google/sre-book/service-level-objectives/): checked measurement boundaries, populations/windows and the limitation of averages. Used for root judgement, not for universal numerical targets.
- [Google SRE, Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/): checked separating successful and failed latency and treating slow responses as symptoms. The commission retains errors rather than filtering them into invisibility.
- [Prometheus, Histograms and summaries](https://prometheus.io/docs/practices/histograms/): checked combining distributions rather than precomputed quantiles and the distinction between duration resolution and exact threshold counts. Current guidance prefers native histograms where supported; child planning must check the actual client/server path rather than copy obsolete blanket recommendations.
- [Prometheus, Query functions: histogram_quantile](https://prometheus.io/docs/prometheus/latest/querying/functions/#histogram_quantile): checked rate/window use, aggregation order, classic `le` grouping and interpolation. These belong to the child's implementation, with explicit units and approximation labels.
- [wrk2 author documentation](https://github.com/giltene/wrk2#readme): checked the distinction between actual send time and intended send time in latency measurement. Use its coordinated-omission explanation with an explicit workload assumption; it does not make a closed-loop workload intrinsically invalid or turn generator delay into observed server execution.

Search-result mirrors and third-party summaries were not evidence. Checked official pages directly. URLs above identify mutable documentation; no tested tool versions or operational measurements exist at this planning stage.

## Continuity and verification

Audited root order and briefs against [example-proposal.md](example-proposal.md). No prior reading is required. Latency/distribution precede percentile/rank; population/window and logical request/attempt precede objective and histogram. Outcome classification precedes counting budget compliance. Proposed timeline and sampling extensions must declare their own data rather than invent arrival order from aggregate counts. The child explicitly builds on the root and shares its entities, units and objective.

The baseline and changed counts, exact rank results, means, budget fractions, and both wrong instance averages were independently recalculated in Python and matched the example record. PyYAML parsed the root successfully: six root headings, one child stub, with exactly topic/title/brief and no child headings. All four requested files exist. All core measurements are invented. The objective includes failed eligible requests even though the core fixture happens to have none. Existing database budgets remain separate illustrative scenarios.

Limitations: the coordinator has not accepted the example, commissioned child headings or arranged independent review. No prose draft, implementation, query fixture, article build, server, browser verification, live telemetry, commit, push or publication was performed. No claim is made that this plan is reviewed or sufficient without subsequent review. Final root/example settlement and child planning belong to the coordinator.
