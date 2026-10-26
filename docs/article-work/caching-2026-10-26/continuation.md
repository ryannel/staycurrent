# Working state

Use /private/tmp/staycurrent-caching-20261026 explicitly for every command.
Branch codex/application-caching. Do not touch, switch or reset the primary
checkout /Users/ryannel/Workspace/staycurrent: it has unrelated user edits.

Active goal is NOT complete. Articles 1–8 published and verified. Article 7 commit
c3e84865c41e1d01120510f8063d7145fc97deff, deployment 40418654905 succeeded: 33 model tests pass, production build passes
all 13 site-check rules, native client lab and desktop/phone controls checked.
Five later articles plus final runnable reference application/load/failure lab
remain. Full plan/gates in plan.md. Both teaching references already read and
interacted with; observations in plan.md. Continue alone; no subagents requested.

Article 7 adds three figures, complete prose and a downloadable, pinned native
node-redis 6.3.0 / Redis 8.2.2 client lab. See article-07-plan.md,
article-07-review.md and evidence/clients.txt. Manifest is available and article 6
links to it. Live batch-six Next reply showed 1/6 at 22 ms, final reply 32 ms;
no console errors. Article 8 is now complete: four figures, prose, native lab,
39 model tests and all build checks pass; desktop dark/light and phone checked.
Native evidence in evidence/atomicity.txt, review in article-08-review.md.
Article 8 commit dcd369c4ccd6d0581065f94e577ae9d81e4d7c4d; deployment
40420037722 succeeded. Live WATCH conflict and retry to12 verified, no errors.
Article 9 now complete: four figures, native memory lab, prose and final desktop/
phone review; all43model tests and13site rules pass. See article-09-review.md.
Manifest and article8link updated. Commit/push/deploy article9 next.
Five later articles and final reference application remain. Next article10 is
Redis replication, persistence and failover: acknowledged-write loss, lag/promotion,
RDB/AOF recovery, restore freshness, Sentinel quorum and bounded cold recovery.

Serena manual read. Isolated checkout mutations use ordinary file tools because
Serena restricts them to the original root. Local Node 24.16 / pnpm 11.4 installed.
Dev server at 127.0.0.1:4341, session 47442. Checks: pnpm build and
node --test src/lib/caching/*.test.mjs. Primary checkout remains untouched.

Docker became unavailable after a host disk-space failure. Do not depend on its
old container or reset/prune Docker. Official Redis 8.2.2 source was downloaded and
compiled at /private/tmp/redis-8.2.2; redis-server and redis-cli are under src/.
Native client lab starts/stops an isolated Unix-socket server with persistence off:
REDIS_SERVER=/private/tmp/redis-8.2.2/src/redis-server node examples/caching/client-lab/run.mjs
Its temporary readiness peer binds only localhost. Scoped process/socket approvals
were granted. This is real Redis execution, not a model or throughput benchmark.

To recover space, only this isolated worktree's regenerable dist and checked-out
historical documents were removed. Sparse checkout retains .github, examples,
public, scripts, src, docs/article-work/caching-2026-10-26,
docs/article-work/indexes and docs/article-work/designing-data. The latter two are
needed by existing Astro imports. Do not change the primary checkout's sparsity.

Browser via cua_repl only. previewBrowser is iab browser3; productionTab tab4,
keysTab tab9 is local article9; productionTab tab4 is live article8. Old tab5 ended on an internal error page and was
replaced after restarting dev server. Viewport reset. For phone checks set viewport
in SAME tool call as tab.screenshot/evaluate; use emitImage. Capability appears
to target the most recently created/selected native tab: a dedicated fresh phone
tab10 worked while tab9 stayed1280wide. Phone tab10 is now closed. Restore browser docs
after compaction. Mark useful local/live tabs as handoff/deliverable before ending.

Before each publication: primary/native evidence, invariants, teaching review,
desktop light/dark and phone/keyboard controls, build; manifest and prior link;
fetch/reconcile main; stage intended files; commit/push HEAD:main; exact GH run and
live controls. Publication is explicitly authorised. Keep goal active until all
14 articles and final reference application are delivered.
