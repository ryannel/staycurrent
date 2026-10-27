# Writer report: article 5, Cache invalidation and consistency

Draft: `src/articles/caching/invalidation.astro` (status in `caching-collection.ts` left as `planned`; nothing committed).

## Length

About 7,000 words of prose, plus 37 lines of code across four blocks (a Redis
trace, the lease read path in Python, the version-check Lua script). There are
nine figures and one choosing table.

## Figures

All live in `src/components/caching/invalidation/`. Pure logic is in `.mjs`
files with 8 passing tests (`node --test src/components/caching/invalidation/*.test.mjs`).

| # | Component | Kind | What it isolates |
|---|---|---|---|
| 1 | WindowFigure | live sim, delete-delay slider, "Lose the next delete" | staleness = delete delay; a lost delete lasts until TTL |
| 2 | RaceFigure | sequence, slow reader / lagging replica | the stale-set race |
| 3 | DayFigure | 50 keys × 24 h; write rate, fill time, TTL | share stale ≈ w·δ; the TTL caps duration, not share |
| 4 | DoubleDeleteFigure | histogram; delay slider, primary/replica | what a second delete catches (length bias, replica lag) |
| 5 | LeaseFigure | sequence, without/with lease | SET NX PX placeholder + SET IFEQ fill refused after DEL |
| 6 | VersionFigure | sequence, plain / newer-only / after eviction | out-of-order writers; eviction forgets versions |
| 7 | OutboxFigure | sequence, writer / outbox relay | lost delete vs outbox |
| 8 | FanoutFigure | live sim, tags / generations | exact deletes vs one INCR and orphaned keys |
| 9 | MarkerFigure | sequence, plain / marker | read-your-writes for the writer |

Every figure was screenshotted in light, dark, desktop and phone
(`screens/`). Every control was also exercised with Playwright: each choice
was stepped to the end, and readouts were checked against the prose. Fixes
made after the screenshots:

- Figures 1 and 8 now open with 20 seconds of history.
- Figure 4 had two legends; one was removed. Its axis label was clipped on phones and has been shortened.
- Figure 5 now shows the refused fill's `nil` reply.
- Two code blocks were narrowed.

## Evidence

Evidence is in `evidence/invalidation.txt` (sections A–Q) and
`evidence/invalidation-scripts/`. It was gathered on Redis 8.10.3, port 7105, in a
temporary directory with `--save ''`. The server is now shut down.

Measured and quoted in the article:

- the race traces;
- `SET … IFEQ` refusing a missing key and dropping the TTL;
- `DELEX IFEQ`;
- the lease (late fill refused, expired lease);
- the version script and tombstones;
- the IFEQ retry loop;
- the double-delete timings at 150 and 650 ms;
- the NX hold-off;
- a tag set outliving its keys;
- loss of the generation counter;
- `DEL` against `UNLINK` (100k members: about 3 ms against 0.2 ms; 1M members: about 40–70 ms against 0.2 ms);
- `PUBLISH` returning 0;
- a 60 s real race run (2–4 stale fills).

Figures 1, 3, 4 and 8 are illustrative models, and the article and the captions both say so.

## Claims checked against primary sources

- Nishtala et al. 2013, checked against saved text:
  - leases (64-bit token, at most one every 10 s, 17K/s to 1.3K/s over one week);
  - stale sets;
  - mcsqueal, and only 4% of deletes taking effect;
  - read-after-write for a single user;
  - the 2-second hold-off;
  - remote markers and why evicting them is unsafe.
- Meta's "Cache made consistent" post, cited through the dossier: TAO going from six nines to ten nines within five minutes.
- Debezium: at-least-once delivery.
- Redis documentation: SET, DELEX, Pub/Sub at-most-once, and keyspace notifications off by default.
- The Rails guide, re-checked during revision. Fragment caching stores the version beside the entry, while `cache_key_with_version` puts it in the key. The prose was corrected to say this.

## Unverified or softer claims

- "Replicas are usually a few milliseconds behind, sometimes seconds." This is general knowledge and is not sourced.
- "Many teams do both", meaning an immediate delete plus a change-stream delete. This is practice, not a source.
- The six-to-ten-nines figure was not re-fetched during drafting.
- The `DEL` and `UNLINK` timings come from one laptop.

## Coverage map

- Overlaps, all deliberate:
  - Caching patterns covers delete versus update. This article only recalls it and adds the race.
  - Expiration covers the TTL as a safety net and λT/2. This article derives a different share, w·δ, for races.
- Leases are covered here. The herd side of leases is handed to Stampedes.
- Scripts and WATCH are handed to article 8. Evidence section H (WATCH) is unused.
- CROSSSLOT is handed to article 10.
- Gaps that no article in the plan clearly owns:
  - monotonic reads across replicas;
  - Redis client-side caching (`CLIENT TRACKING`) as another invalidation channel;
  - multi-region invalidation beyond the marker.

## Toolkit gaps

- A Choice-driven sequence switcher (`switch-sequence.mjs`). This is a local copy, duplicated with caching-patterns, and belongs in shared.
- No drawing for a value's history over time (the timeline), a strip of many keys over a day, or a grid of keys. All three are local.
- No log axis. Figure 4 uses a square-root scale instead.
- No overflow-bin label for histograms.
- No warm-up option in `mountSim`. Figures 1 and 8 advance the model inside `create`.

## Compared with the reference essays

- Figure density is one figure per ~750 words. That is closer to Gears than to Load Balancing, and lower than the brief's "every few hundred words".
- The sections on lost deletes and on choosing are prose and table heavy. The version section leans on a code block.
- Each figure isolates one variable, and the prose says what to look for.
- The derivation of w·δ is shown, then checked by Figure 3, and the TTL result is the earned surprise.
- A reviewer may want the choosing section trimmed, since it partly restates the table.

## Checks

- Tests pass.
- `pnpm build` passed, and the site check reported 13 rules ok.
- The normal build excludes this draft, so the site check did not cover this page. The preview showed no page errors and no page overflow on phone width.
- The dev server and Redis are stopped. Nothing was committed or pushed.
