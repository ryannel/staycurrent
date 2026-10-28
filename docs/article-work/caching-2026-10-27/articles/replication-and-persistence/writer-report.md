# Writer report: article 9, Redis replication, persistence and failover

Draft: `src/articles/caching/replication-and-persistence.astro` (about 6,800 words of
prose, not counting figure captions and text alternatives). Components in
`src/components/caching/replication-and-persistence/`. Not committed.

## Figures (11)

1. Redis restarts empty (live chart; illustrative expected-value model, `restart-model.mjs`).
2. A snapshot and copy-on-write (live cell grid; illustrative, `cow-model.mjs`).
3. What a snapshot brings back (steps; every reply observed, evidence e1c).
4. Where an acknowledged write lives (live scene; illustrative, `aof-model.mjs`; crash vs power cut).
5. Asynchronous replication (live scene; illustrative, `lag-model.mjs`; measured 2/5,000 stale quoted).
6. The replication backlog (no clock; arithmetic ring; both outcomes observed, r4).
7. A Sentinel failover (live scene + chart, real time; post-detection delays measured, s1/s2).
8. Quorum and majority (no clock; rules from the Sentinel docs).
9. Lost delete at failover (steps; observed, r6).
10. A fast restart wipes the replica (steps with Choice; observed, r7/s3).
11. What each recovery costs the database (no clock; same model as Figure 1).

Screenshots of all 11 in light/dark at desktop and 375 px are in `screens/`: no console
errors and no horizontal overflow. Every control was exercised with Playwright. That
found and fixed one bug: under `appendfsync always`, a power cut counted unacknowledged
in-flight writes as lost acknowledged writes. A test now covers it (11 model tests pass).
`pnpm build` passes.

## Evidence

`docs/article-work/caching-2026-10-27/evidence/replication-and-persistence.txt`. All
runs used Redis 8.10.3 on ports 7109 and 7190–7194; every process is now stopped.

## Claims I could not verify by observation

- Copy-on-write memory growth. macOS gives no usable per-process measure of it, so
  Figure 2 is a model, and the "close to twice the memory" advice rests on the mechanism
  and the Redis docs.
- Fork, RDB load, fsync, WAIT/WAITAOF and FAILOVER timings. The laptop had a load
  average of 130–285, so these are quoted as noisy. The fork times per GB come from
  the Redis latency doc's table.
- Power-loss behaviour. `kill -9` tests only a process crash; the power-cut side comes
  from the docs and `aof.c`, including the 2-second postponement.
- ElastiCache behaviour comes from its documentation only. Other managed services were
  not researched.
- Valkey differences were not checked in detail. The article says only that the
  mechanisms are shared and defaults may differ.
- The `vm.overcommit_memory` advice: `server.c` calls `checkOvercommit`, but I did not
  read `syscheck.c` itself.

## Coverage notes

- Uses the cold-start ideas from article 6 (stampedes) without re-teaching them: links
  for why an overloaded database suffers more.
- Article 4 mentions replica expiry in one bullet; this article owns it with the
  measured detail.
- Warming and capacity alerts are left to article 11 and linked. Cluster failover and
  splitting are left to article 10 and linked forward.
- Article 7's mention of the fork (about 10 ms/GB, THP) is consistent with the treatment
  here.
- Article 5 relies on this article for lost deletes at failover; Figure 9 provides it.

## Toolkit gaps (worked around locally; shared/ untouched)

- `switch-sequence.mjs` is copied again (the fourth article to carry it).
- `lineChart` takes rules only at creation. It has no way to style one series solid
  among dashed ones except `dash: ''`.
- There is no ring or circular drawing helper; Figure 6 draws its own SVG arcs.
- Scenes have no per-node status list and no dynamic edges, so Figure 7 shows
  reconfiguration through sublabels.

## Environment note

The disk hit 100% full mid-session (477 MB free at one point; other work was writing
to it). My scratch files are small. I deleted nothing.
