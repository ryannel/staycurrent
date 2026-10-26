# Working state

Work in `/private/tmp/staycurrent-caching-20261026` explicitly for all commands.
Branch `codex/application-caching`; do not switch/reset the primary checkout, which
contains unrelated modelling edits. HEAD 83a5c0a2 was pushed to origin/main;
deployment 40410103863 succeeded and live article controls were verified.

Goal active, NOT complete. Full scope/gates in plan.md. Articles 1–3 published;
article 4 complete and publishing now; ten remain after it. Next: cache stampedes.
Article 4 native evidence, schedule tests and browser review are recorded in
article-04-review.md. No subagents requested; continue alone. Do not re-read
historical skills. References Gears and Load Balancing already read and explored;
observations in plan.md. Judge each article against them without repeating study.

Article reviews 01–03 record native/model/browser evidence. publication.md records
commits/deployments. Latest article 3 record and article 4 plan are uncommitted;
include them in the next relevant delivery. Source work is clean at delivery.

Serena initial instructions already read. Absolute symbol overview can read this
worktree, but mutation tools reject paths outside primary root; use ordinary
file editing here. Dependencies installed locally via pnpm. Dev server available
at http://127.0.0.1:4341, exec session 31217 (check if needed).
Required build: pnpm build. Models: node --test src/lib/caching/*.test.mjs.
Eleven tests passed at article 3 delivery; all 13 site-check rules passed.

Task-owned Redis 8.2.2 container staycurrent-cache-lab-20261026 remains available,
network none, no ports/persistent data. Public worksheets create/remove their own
containers. Docker, git and gh calls generally require escalation; auto-review
has approved scoped operations. User explicitly authorised each finished article
to be committed/pushed/deployed. No extra approval question needed.

Browser via cua_repl only. Persistent handles if available: previewBrowser browser
3 (iab); articleTab tab3 article1 preview; productionTab tab4 live article3;
keysTab tab5 local article3 (handoff mark); narrowTab tab6 temporary narrow preview.
viewport is browser capability. It appears to apply to last selected/opened tab,
not necessarily the handle last acted upon; create a separate test tab if needed.
Narrow preview and production viewport overrides were reset. Call
cua.rewriteDocumentation() after context compaction before continuing browser work.
Use scoped DOM reads instead of dumping whole article AX trees.

Publish workflow: finish native evidence, models, prose/teaching self-review,
keyboard, light/dark/narrow checks; flip manifest published flag; build; fetch
origin/main and reconcile; stage intended files only; commit/push HEAD:main;
check gh run and live page. Don't mark goal complete until all 14 articles and
the runnable final reference application/load/failure lab are delivered.
