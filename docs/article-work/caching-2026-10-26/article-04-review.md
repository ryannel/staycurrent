# Article 4 — Cache invalidation and consistency

Completed 26 October 2026. Sole-agent authorship and review; no independent review.

## Evidence and scope

Read Microsoft Cache-Aside, Redis Lua scripting and Pub/Sub delivery semantics,
AWS transactional outbox, and PostgreSQL 18 transaction/snapshot documentation.
Primary links appear in article; checked 26 October 2026. The generation protocol
is an explicitly analysed teaching example, not attributed to a Redis guarantee.

Native invalidation.sh ran against official Redis 8.2.2 in its own isolated,
disposable container. It demonstrates plain stale refill after deletion, atomic
read/initialisation, token rotation/deletion, conditional fill, guard loss,
reinitialisation discarding a survivor, and unique-token duplicate invalidation.
All assertions passed; output in evidence/invalidation.txt. Source price/held
snapshot are explicitly shell values, not a claimed database implementation.

Four new model tests cover both deletion races, serial success, all ten
interleavings of three reader/two writer actions, guard absence/reinitialisation,
and process-crash delivery with/without outbox plus duplicate deletion cost.
The guarded model never retains the old price after invalidation in any of those
ten schedules. This is not an exhaustive proof for a real distributed system.

Technical boundaries were checked in prose: commit-to-invalidation window;
in-flight response versus cached refill; source view relative to token capture;
all cache paths following the protocol; absent guard rejecting fills; new token
on every execution including retries; automatic replay reintroducing old tokens;
failover rolling history backwards; metadata memory cost; durable notification
not instantaneous consistency. Plain TTL and delayed double deletion are not
presented as unconditional freshness guarantees.

## Teaching judgement against reference articles

One concrete price is retained while the reader controls execution order, following
the reference articles' causal experiments. The held source value is visible
rather than hidden in an assumed request. Two schedules challenge a simple
post-commit deletion recipe. The second illustration preserves the geometry and
schedule, adding only the generation comparison. An empty cache after rejection
is visibly different from a refreshed response, preventing a misleading victory.

The third illustration isolates process failure from concurrent reads. It shows
which obligation survives a crash and the extra miss caused by duplicate deletion.
The consistency table gives concrete violating observations before advanced
protocol limitations. Prose connects the models to dependency coverage, other
writers, source snapshots and testing barriers. About eleven minutes of prose;
transactions/scripts/failover detail stays in the later specialist articles.

## Browser verification

Tested localhost:4341 in desktop light and 390×844 light/dark views. Document width
390 equals viewport width. All three figures fit; three price cards and generation
tokens remain legible, actor controls wrap, two-column chronological traces stay
readable. Source/outbox/cache flow fits on phone. No console errors.

- Manually advanced reader twice, writer twice, reader once (keyboard Enter):
  source £15, cached £12, held £12; log accurately records all five steps.
- Early-delete preset ends source £15/cache £12. Back one step restores source
  £12, confirming reversible state rather than just hiding a log line.
- Guarded same schedule ends cache empty, reader holds £12, g1 versus g2 and a
  rejected-fill explanation. Serial preset stores £15 successfully.
- Outbox enabled: commit/crash/restart/deliver/read yields £15 and one delivery.
  Replay deletion removes the refilled entry without writing an old price.
- Outbox disabled: same crash loses pending work, delivery is disabled, read
  returns £12. Explicit expiry then read repairs it to £15.
- Native checkbox/select/button controls, visible keyboard focus, live explanation.
  No time-dependent animation; the reader chooses every event.

Final verification: pnpm build passed all 13 site-check rules; all fifteen
collection model tests passed; git diff --check passed.
