# Working state

Use /private/tmp/staycurrent-caching-20261026 explicitly for every command.
Branch codex/application-caching. Do not touch, switch or reset the primary
checkout /Users/ryannel/Workspace/staycurrent: it has unrelated user edits.

Active goal is NOT complete. Articles1–9 published and verified. Article9 commit
5a7dda3ae66a9e5b41dfc91b3c649b27ff7135be, deployment40421786805 succeeded; live
encoding513/37,008 verified with no errors. Article10 now complete and publishing:
four models, four native recovery cases, prose, desktopdark/light and phone390px
review, 47modeltests andall13sitecheckrulespass. See article-10-plan.md and
article-10-review.md. Manifest10true and article9nextlink updated. Commit/push,
verify exact deployment and live controls, then record publication.

Articles11–14 remain plus final runnable reference application/load/failure lab.
Next article11: Redis Cluster and hot keys — hashslots, hashtag/multi-key
constraints, MOVED/ASK and resharding, clients/topology, skew/hotkeys, replica
failover and cluster availability boundaries. Native isolated cluster lab needed.
Do not mark goal complete until all14articles and final application delivered.
Both teaching references already read and interacted with; observations in plan.md.
Continue alone; no subagents requested. Publication explicitly authorised.

Serena manual read. Isolated checkout mutations use ordinary file tools because
Serena restricts them to the original root. Node24.16 / pnpm11.4 installed.
Dev server127.0.0.1:4341, session47442. Checks: pnpm build and
node --test src/lib/caching/*.test.mjs. Primary checkout remains untouched.

Docker unavailable after host disk-space failure. Do not reset/prune Docker.
Official Redis8.2.2 source compiled at /private/tmp/redis-8.2.2; binaries under
src/. Native labs use owned temporary directories/processes and private Unix
sockets. Recovery lab additionally uses localhost ephemeral TCP for replication
and Sentinel. Run REDIS_SERVER=/private/tmp/redis-8.2.2/src/redis-server node
examples/caching/recovery-lab/run.mjs. Scoped process/socket approval granted.
All four cases pass including actual Sentinel promotion. Process-only crashes,
not host/storage-failure proof. examples/caching/{client,atomicity,memory}-lab
also contain prior pinned native labs. Public downloads in caching/examples.

Sparse checkout retains .github, examples, public, scripts, src,
docs/article-work/caching-2026-10-26, docs/article-work/indexes and
docs/article-work/designing-data (lasttwo neededbyexistingAstroimports).
Do not change primary checkout's sparsity. dist is regenerable.

Browser via cua_repl only; restore documentation after compaction.
previewBrowser=iab browser3. productionTab tab4 currently live article9.
keysTab tab9 local article10; recoveryDesktop is a newer local article10tab.
Viewport often only changes newest/selectedtab; afterset check actualinnerWidth
and readable screenshot. A first screenshot sometimes scaled old1280into390;
nextsnapshot correctly390. Model selectors in component source are known.
Theme controls radio names Light/Dark/System. Mark useful tabs before ending.

Before publication: primary/native evidence, invariants, teaching self-review,
desktop light/dark and phone/keyboard controls, build; manifest/priorlink;
fetch/reconcilemain; stageonlyintendedfiles; commit/push HEAD:main; exactGHrun and
live controls. Do not infer deployment success from push acceptance.
