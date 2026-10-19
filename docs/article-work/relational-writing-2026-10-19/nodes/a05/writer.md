# a05 — writer handoff

Status: B04 figure repairs ready for orchestrator promotion and narrow browser/teaching recheck. Initial native/practitioner pass retained. No publication, commit or shared build was performed.

## Owned deliverables

- Staged Astro fragment: `docs/article-work/relational-writing-2026-10-19/nodes/a05/article.astro`.
- Figure component: `src/components/relational-next/a05/PerformanceFigure.astro`.
- Source/evidence ledger: `docs/article-work/relational-writing-2026-10-19/nodes/a05/sources.md`.
- This writer report.

Imports in the staged fragment resolve from final `src/articles/relational-next/a05.astro`. The fragment has opening prose, explicit parent-completion contract, contents, all seven assigned anchors and sources. The shared wrapper owns h1 and bottom child reading. No shared files or final-src fragment were changed.

## Teaching and scope

Follows customer history, a regional report and concurrent order changes. Teaches boundaries, row/page/locality and version-retention working model, useful index routes, compact plan units, joins/aggregation/sorting, a consequential stale-estimate hypothesis, targeted statistics refresh, concurrent costs and full comparison method. The ordinary report loop closes here; readers need no child to accept its limited conclusion.

Optional contextual destinations follow actual plans: a24 for unexplained page/space work; a25 for designing/comparing routes with local legend; a26 for deeper plan and prepared-parameter diagnosis; a28 for arrivals, competition and admission. Operations, integration, transactions and live-change guidance remain with their owners. No tree changes proposed.

Five figures use native buttons, Back/Next, optional Play cases (complete visible text at 180 words/minute plus six seconds for comparison, with a six-second minimum; pause/manual control), no autoplay, no movement-heavy transitions, and complete text alternatives. Layout uses theme variables and mobile-stacked controls/metrics. Figures 1/2/4 are explicit models; 3/5 use captured evidence. Read all three fixed example articles and examined representative rendered figures on the fixed preview; followed their causal example/compare/result style.

## Native verification

Own disposable database `rel3_a05_run1` on the assigned PostgreSQL 18.6 runtime. No server changes. Only the fixture customer table temporarily suppressed autovacuum to preserve stale statistics; restored after captures. All sessions closed.

- Customer north estimate 18 vs observed 8,000 after known distribution change.
- Captured before: nested loop, 8,000 order probes, external sort, 96,104 shared hits, 187 temporary blocks read.
- After `ANALYZE customers`: estimate 8,000, hash join + hash aggregation, 745 shared hits, no temporary reads.
- Ordered exact report results match byte-for-byte.
- Five-customer correctness fixture checks multiple orders, ties, missing orders, region and date boundary; returns customer 2 then 3 at 20.00; non-null total rejects NULL.
- Three before and three after mixed runs; 3 clients × 200 transactions, fixed seed and weighted scripts. Each run: 364 lookups, 176 revision changes, 60 reports, zero failures.
- Nearest-rank per-script p95 ranges: reports 55.12–56.61 → 15.73–16.30 ms; lookup 0.148–0.169 → 0.134–0.156 ms; change 0.258–0.305 → 0.221–0.266 ms. Total completion rates 532–587 → 1,408–1,623/s.
- Explicit limits: small warm shared instance, closed-loop short runs, all before runs precede all after runs, revision counters preserve query meaning but create update churn, no full application path or sustained/open-loop capacity claim, no CPU/device-I/O/WAL comparison. Acceptance is only of fixture-supported stale-statistics explanation.

## Local checks and remaining review

- Astro compiler 2.13.1 transformed staged article and component without diagnostics, after final edits.
- Every assigned a05 section anchor exists.
- Every explicit family href matches the registry.
- No nested review agents; no full build, as fixed preview remains in use.
- Orchestrator still owns promotion, rendered mobile/light/dark figure/control review, shared build and independent prose/technical reviews. In browser checking, exercise all cases and Play/Pause, check no horizontal body overflow at phone width, and verify selected control state and all-cases disclosure.

Source ledger retains all SQL, exact JSON plans, per-run medians/p95 and all 3,600 latency samples for recalculation. Temporary intermediates remain only under `/private/tmp/rel3-a05`; no artifact depends on them.

## B04 required repairs

Repaired all three final teaching findings locally, preserving prose, native timings, units, three-run meanings and observed/model boundaries:

1. `show` checks both endpoint transitions before disabling a transport button. If focused Next becomes the final disabled Next, or focused Back becomes the first disabled Back, it moves focus to Play first. Other focus stays with its chosen control.
2. Replaced the fixed interval with a separately scheduled timeout for each visible case. The hold reads the selected panel's rendered text plus the persistent comparison table where present, at 180 words per minute, then adds six seconds for comparison. It retains a six-second minimum. Pause and every manual selection clear the pending timeout; no autoplay was introduced. `data-hold-ms` exposes the current hold for a narrow browser check.
3. Figure 5 now retains a semantic three-column table for all four measurements: Before and After ANALYZE remain together while phase selection highlights the selected column and changes only the explanatory panel. Caption says ranges across three runs per phase. Milliseconds and completions/second occupy labelled row units; all numbers are unchanged. Fixed table layout and compact scoped padding allow the two phases to stay beside each other on a phone without hiding either baseline.

Normalised the single trailing space in the retained correctness-output table header in sources.md; observed values are unchanged.

Narrow local verification after repairs:

- Astro compiler transformation: no diagnostics.
- Executed the actual transpiled production player against a focused DOM fixture for all five scenes: all ten endpoint transitions retained focus on Play, with the correct endpoint disabled.
- The same fixture verified narration-based scheduling and cancellation by manual Next for all five scenes. Initial holds, with all authored panel fields in that fixture, were 16.334 s, 14.667 s, 18 s, 20.334 s and 25.334 s. Actual browser holds use rendered visible text, so the narrow recheck should inspect its `data-hold-ms`, not treat those fixture values as browser measurements.
- No trailing whitespace remains in article.astro, sources.md or writer.md.
- Native SQL/workload observations were unchanged and were not rerun. No shared build, nested reviewers or commits.

Remaining narrow recheck: promote component, operate both endpoint transitions in each scene; inspect reading holds including Figure 3's longer paths and Figure 5's persistent table; inspect Figure 5 at 390px in both themes and confirm all eight range values remain simultaneously readable. Root owns that rendered check. No new scope or tree proposals.
