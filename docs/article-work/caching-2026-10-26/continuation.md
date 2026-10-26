# Working state

Use `/private/tmp/staycurrent-caching-20261026` explicitly for all commands.
Branch codex/application-caching; do not touch/switch/reset the user's primary
checkout, which contains unrelated modelling edits. Article5 complete and checked;
publication commit/push in progress. Article4 delivery was 4407397d, run40411784554.

Active goal is NOT complete. Articles1–4 published; article5 ready; nine later
articles remain plus the final runnable reference application/load/failure lab.
Full scope/gates in plan.md. Both teaching references already read and interacted
with; notes in plan.md. No subagents requested; continue alone.

Article5 has four working figures (burst coalescing, jitter, leases, stale refresh),
complete prose, six invariant tests and an executed native Redis worksheet.
See article-05-review.md. Final build passes all13rules and21collection tests.
Next article: Cache failures and graceful degradation. Develop a causal model of
source capacity under lost cache hits, bounded fallback/admission, deadlines and
retry amplification, circuit opening and recovery. Primary sources and executable
failure evidence are required. Keep cache circuit state separate from permission
to load the source; per-process limits do not impose a fleet-wide budget.

Prior reviews/evidence are in article-01..05-review.md and evidence/.

Serena initial instructions read previously. Absolute symbol overview works in
this worktree but mutation tools reject outside original root; use ordinary file
edits here. Dependencies installed locally with pnpm. Dev server localhost:4341,
original exec session 31217, still serving last browser test. pnpm build required;
models node --test src/lib/caching/*.test.mjs.

Task-owned Redis container staycurrent-cache-lab-20261026 remains available, no
ports/network/persistence; worksheets create/remove independent containers. Scoped
Docker/git/gh escalations have been approved by auto-review. User authorised
publication of each finished article; no additional permission question needed.

Browser through cua_repl only. previewBrowser = iab browser3; viewport capability
is persistent. productionTab tab4 live article4 (deliverable), keysTab tab5 local
article5 (handoff). Temporary narrow tabs may be gone. Viewport reset after phone
checks. CUA documentation restored this turn; use rewriteDocumentation after
compaction. Prefer scoped DOM text reads; whole article AX output is huge.

Before publication: native evidence, meaningful model invariants, prose/teaching
self-review against both references, desktop light/dark and phone controls, keyboard,
normal build. Flip manifest flag; update previous article's next link; fetch main
and reconcile; stage intended files only; commit then push HEAD:main. Check gh run
and actual live controls. Keep goal active until all fourteen articles and the
final runnable application/load/failure lab are delivered and verified.
