# Repair round 1: Application caching with Redis (introduction)

Sources revised: `src/articles/caching/introduction.astro`; in
`src/components/caching/introduction/`: `RepeatedWork`, `ReadPath`, `HitRatio`,
`LatencySpread`, `Popularity`, `SmallCache`, `StaleCopy`, `CacheOutage`, `model.mjs`,
`model.test.mjs` (7/7 pass). Nothing in `shared/` was edited. Evidence was appended to
`evidence/introduction.txt` under "Repair round 1". Screens are in `screens/`: every
figure in both themes at desktop and 375 px, plus `interact-*` captures of the changed
controls. No console or page errors, and no horizontal overflow. The dev server reloaded
several times because other articles' files changed. That came from the parallel work,
not from this page.

**Figure numbers changed.** I moved "What Redis is" and "Where Redis sits" forward
(teaching S1), so the figures are now numbered as follows: 1 repeated work, 2 cache
layers, 3 read path, 4 hit ratio (was 3), 5 misses and load (was 4), 6 latency
spread (was 5), 7 popularity (was 6), 8 small cache (was 7), 9 stale copy, 10 outage.
Below, "Figure N (was M)" refers to the old numbers used in the reviews.

## Orchestrator notes

| Note | What I did |
| --- | --- |
| ArticleRef for every in-text reference | All 16 body references now use `ArticleRef`, and so do the three in the captions of Figures 9 and 10 (moved from the `caption` prop into the `caption` slot). No `href="#collection"` remains. The end map stays plain text. |
| Licensing to one sentence | One sentence: Valkey forked from 7.2 in 2024 after the licence change, behaves the same here, and article 11 covers the licences. The licensing source bullet is gone; I kept a Valkey link. |
| Eviction comparison | I re-measured at a realistic pace on port 7111, at about 650 requests a second, so the cache turns over in seconds. At 1%, Redis hit 49.1% against 50.4% for exact LRU; it held 909 keys, not 1,000. At 10%, it hit 73.8% against 73.7%. The paragraph now gives those numbers and the ideal (62%, 81%). It says Redis came within about a point of exact LRU at this pace, and it points to article 4 for the mechanism and for when the approximation falls short. The wrong "sampling" explanation is gone, and so is all teaching of eviction mechanics. |
| Staleness bound and code | Staleness: "A copy stored before a change can outlive the change by at most its TTL". The TTL is called a rough bound, with one sentence on the miss that stores an old value after the change and a reference to article 5. Figure 9's last step and text alternative match. Code: the client is created with `socket_timeout=0.05` and `socket_connect_timeout=0.05`, and `GET`/`SET` are wrapped in `except redis.RedisError`, which treats an unreachable Redis as a miss. `decode_responses=True` is added. A new paragraph explains failing open and links to Figure 10. |
| Figure 3 (now 4) steady state | Added a **Skip ahead 5 minutes** button, which advances 300 s in one press. Step 10 s stays for the early climb. Checked: after one press, the "last 100" readout shows 73% and the clock 300 s. The prose names the button. |
| Captions and figures agree | Figure 7 (now 8) and Figure 10 were fixed (R3 and R6 below). I checked all other figures against their readouts. |

## Teaching review

**Required**
- R1, links to `#collection`: fixed with `ArticleRef` (see above).
- R2, licensing: fixed (see above).
- R3, Figure 7 (now 8) overstated what is held: fixed. The model holds 41–45 of the top 50 and 112–128 of the top 250. The prose and text alternative now say "most of the 50 most popular products, but only about half of the 250 inside the outline". The reviewer's suggested "nearly all of the most popular hundred" would also be wrong: only about 70 of the top 100 are held.
- R4, 30 clicks: fixed with the Skip button (see above).
- R5, colour vocabulary: the legends of Figures 2, 3 and 9 (old numbering) now read "Write to Redis". In Figure 9, the Staff lane is `neutral` and the UPDATE arrow is `database`, so teal appears only on `SET … EX 60`.
- R6, Figure 10 arrival state: fixed in the model. A new option, `warm: 'staggered'`, gives each warmed key a random remaining TTL, so expiries are spread out and the 40 s of history is level, not a wave. The seed is now 5. The readouts average the last 2 s (four samples), relabelled "Hit ratio, last 2 seconds". On arrival they show 95–96% and 5 reads. Over the next 20 s they stay within 91–97% and 3–9. Down shows about 100 reads needed and about 60 failed. The caption ("near 95%"), the prose ("about 5") and the 20× jump are now true as shown. The text alternative mentions the 3–9 range. Tests assert all of this.

**Suggested**
- S1, move Redis forward: done. Order is now: repeated work, What Redis is (trimmed), Where Redis sits, cache-aside, hit ratio, what it buys, tail, skew, costs, map. The benchmark paragraph moved to "What the hit ratio buys", next to L<sub>c</sub>. The `maxmemory`/`noeviction` paragraph moved into "Memory is not free".
- S2, Figure 6 (now 7) hides the top 1–10%: I gave it a local log x-axis from 0.01% to 100%, with labelled ticks at each decade, and replaced the diagonal with the s = 0 curve. At s = 1 the curve is a near-straight line, so each tenfold increase adds the same share. I added one sentence of prose on this, because it also prepares the reader for Figure 8's diminishing returns. The axis label is shortened so it fits at 375 px.
- S3, derive break-even: done, in three lines.
- S4, many-lookups arithmetic: done. 0.99<sup>20</sup> ≈ 82%, so 18% of such pages include a miss; at 95%, 64% do. Also notes that one round trip (article 8) does not remove misses.
- S5, trim metastable: cut to one sentence naming the risk, plus the article 6 and 11 references.
- S6, second TTL fact: cut.
- S7, define eviction: done, in the Figure 8 paragraph.
- S8, Figure 1: the prose now points at the queries-a-second label and says the shop sells only 50 products. The bar-chart height is left as is: label-beside-bar is a layout of the shared `barChart`. Toolkit gap.
- S9, Figure 9: added the missing `SELECT …` step after the miss. Skipped the timeline: the staleness paragraph now carries the bound, and a second figure would add length for little return.
- S10, mark the outage: added a shaded "Redis down" band. The shared `lineChart` has no bands, so I drew it locally from the chart's own capacity-rule geometry, and it redraws on resize. Toolkit gap: x-range bands in `lineChart`.
- S11, Figure 7 (now 8) legend: replaced with a local legend that uses square swatches in the grid's colours and a dashed-line entry for the outline.
- S12, phone details: the Figure 3 note "next visitor" is shortened to "visitor 2". The "Application" lane box filling its width at 375 px belongs to the shared `sequence.mjs`. Toolkit gap, not changed.
- S13, `toLocaleString`: done.
- S14, flourishes: all applied. The costs lede is now an informational sentence, and "it was a hit, it was fast, and it was wrong" is that section's one flourish.
- S15, headings: "Tail latency: the mean hides the misses" and "Popularity skew and the working set".
- S16, render the map from data: not done, per the orchestrator ("the map stays plain text").

## Technical review

**Required**
- R1, LRU shortfall cause: fixed by re-measuring (see above).
- R2, staleness bound: fixed (see above).
- R3, code fails in an outage: fixed (see above). Correction to the review: in redis-py 8.1.0 (current), the default `socket_timeout` is 5 s (`redis/_defaults.py`), not `None`. The article says "waits up to five seconds by default", which is still long enough to stall every page.

**Suggested**
- S1, top-1% share depends on catalogue size: the prose now says "of these 100,000 products". It adds one parenthesis saying that Breslau's traces were of different sizes, so the shapes should be compared rather than the exact numbers.
- S2, Figure 5 (now 6) mean of 2.2 against 2.0: the caption now says the costs are medians, that the mean miss is about 23 ms, and that this is why the readout is 2.2 ms rather than 2.0. The prose says "a mean of about 2 ms".
- S3, overlapping markers at 99.5%: when p99 − p50 < 5 ms, the mean marker is left off the chart (the readout still shows it). The text alternative says so. This was needed because the shared histogram alternates only two label rows. Toolkit gap.
- S4, Figure 1 seed: changed from 7 to 6. product:1 is now computed about 42 times in a minute, close to the expected 40, against 28 before. The prose and text alternative say "about 40", and the "barely moves" wording is explained by the 50-product catalogue.
- S5, Figure 10 readouts: done (2 s average, plus the staggered warm-up).
- S6, many lookups: done (as teaching S4).
- S7, `keyspace_hits` wording: now "every read of a key, by any command from any client", with `TYPE` added to the list.
- S8, managed-service defaults: one sentence. ElastiCache and Azure both default to `volatile-lru`, which evicts only keys with a TTL. Both are cited in Sources, and verified in their docs.
- S9, name the 7.4 licences: moot, since the licensing paragraph is gone.
- S10, small points: "four times as much memory again" → "four times as much memory". The Figure 8 caption notes independent requests and burstier real traffic. `decode_responses=True` is in the code.

## Toolkit gaps to report
- `lineChart`: no shaded x-range bands. Worked around locally in `CacheOutage.astro`.
- `histogram`: marker labels alternate two rows, so three close markers overlap.
- `lineChart`: no log axis. Done locally by plotting log10 values with a custom tick format.
- `barChart`: labels sit above the bars, which makes six bars tall.
- `sequence.mjs`: lane label boxes are tight at 375 px.

## Still open
- The shared `KIND_LABELS.write` is still "Write or invalidation". Figures that use the default label keep it. A collection-wide decision on whether teal means only "write to Redis" belongs with the toolkit owner.
