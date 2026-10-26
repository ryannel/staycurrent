# Working state

Use /private/tmp/staycurrent-caching-20261026 explicitly for every command.
Branch codex/application-caching. Do not touch/switch/reset the primary checkout
/Users/ryannel/Workspace/staycurrent: it has unrelated user modelling edits.

Active goal is NOT complete. Articles1–5 published; article6 complete, checked and
being committed/pushed. Article5 commitfc04fb305da4845b0f9953fbcfe14317b5bb0f5a,
deployment40413919275 succeeded and live shared coalescing control verified.
Article6 has four interactive figures, complete prose, six model tests and native
Redis failure evidence. All27collection tests and all13build rules pass.

Eight later articles plus final runnable reference application/load/failure lab
remain. Full plan/gates in plan.md. Both Gears and Load Balancing references
already read and interacted with; observations recorded. No subagents requested;
continue alone. Completed reviews/evidence in article-01..06-review.md/evidence.

Next: Redis clients, latency and pipelining (article7). Cover round-trip vs server
execution, sequential vs bounded pipeline, response bytes and head-of-line waiting,
client connection/queue/deadline lifecycle and uncertain outcomes. Keep pipeline
separate from atomic transactions (article8). Needs primary docs, native execution,
meaningful causal figures, prose and full article gate. No work started on7yet.

Article6 source/numerical assumptions: failures.mjs fluid one-second homogeneous
load model, externally prescribed warming schedule; deadline strips share200ms;
retry tree counts attempts rather than retries; breaker five simultaneous calls,
one outstanding half-open probe, per-batch source allowance explicitly illustrative.
A later burst replaces visible rows but pending probe/source allowance remains.
Native failures.py runs isolated Redis8.2.2; Python communicate timeout leaves child
running, later GET/SET succeed. INFO command special raw output handled. Output in
evidence/failures.txt. Not a throughput benchmark or native client cancellation API.

Serena manual read previously. Absolute symbol overview works in isolated checkout
but mutation tools reject outside original root; ordinary file edits are used.
Local Node24/pnpm11.4 dependencies installed. Devserver127.0.0.1:4341 session31217.
pnpm build required; models node --test src/lib/caching/*.test.mjs.
Task-owned container staycurrent-cache-lab-20261026 remains available, no network,
ports or persistence. Worksheets independently create/remove isolated containers.
Scoped Docker/git/gh escalations approved by auto-review. Publishing each completed
article is explicitly authorised by user; no additional confirmation needed.

Browser via cua_repl only. previewBrowser is iab browser3; productionTab tab4,
keysTab tab5 localarticle6, failurePhone tab7 and narrowFailure temp tab (close or
allow cleanup). Viewport override reset. To perform phone checks use viewport.set
in SAME tool call as screenshot/evaluate; override appeared to revert across calls.
Use tab.screenshot plus emitImage for responsive captures, not nativegetScreenshot.
Current browserdocs and viewport docs read. Restore docs after compaction.

Before delivery: native evidence, model invariants, prose/teaching self-review,
desktop light/dark and phone controls/keyboard, build. Manifest flag and prior link;
fetch/reconcilemain; stage intended files only; commit/pushHEAD:main; check exact
GHrun and livecontrols. Keep goal active until all14articles and finalapp delivered.
