# Repair, round 1: Redis Cluster, sharding and hot keys

Reviews addressed: `review-teaching-1.md` (T) and `review-technical-1.md` (X), with the orchestrator's notes.
New evidence is in `evidence/cluster-and-hot-keys.txt`, sections C13–C17.

A new stepped figure (atomic slot migration) is now Figure 4, so the old Figures 4–9 are now 5–10. Below, figure
numbers are the new ones unless marked "old".

## Required

| Finding | What I did |
| --- | --- |
| T-R1 / X-R1: Figure 1's ring was skewed by FNV-1a | The ring now hashes points and keys with FNV-1a followed by murmur3's `fmix32` (`placement-model.mjs`). 4 → 5 servers now moves 18% (ideal 20%), and every server's share stays within 0.86–1.20 of an equal share at every slider stop (C13). New test: moved share within 0.04 of 1/(N + 1) and every share within 25% of equal, for N = 2..8. The pinned value changed from 30% to 18%. The prose and the text alternative now describe what the figure shows. "In this run" is gone. The variance point is now attributed to points per server, with measured numbers: 1 point gives shares from 0.09 to 3.59 of equal; 160 points give 0.86 to 1.20. The slots paragraph now says "about as many as with the ring". |
| X-R2: the resharding table mixed windows | I recomputed from the writers' per-request CSVs, which recorded the move's start and end epochs (C14). The table now compares like with like: reads, and the 99th percentile before and during the move, for the first 3.1 s of each move. Whole-run reads and redirections are kept in separate rows that state their windows. Redirections are labelled as counted on every node. For key by key they all came from 7195, the only node whose slots moved while the load ran. The prose explains why the latency rows are weak evidence. |
| X-R3: OPTIN | Rewritten. The client sends `CLIENT CACHING YES` immediately before each read it means to cache (or before the `MULTI` block or script). The prose says what goes wrong otherwise, using my own reproduction on port 7120 (C15). |
| X-R4 / note: split write-hot counter | The parts are left untagged. Reading needs one request per node, using `mget_nonatomic` or a pipeline. A tag would put every part on one node and relieve nothing. I checked the slots: `views:42:0..7` land in 8 slots on all 3 nodes, and `views:{42}:*` all land in slot 8000 (C16). I checked every other remedy: the copies `product:0:0..3` are untagged and fall in 4 slots on 4 of 12 nodes, and the near cache, replicas and slot moves don't involve tags. |
| X-R5: library near caches | Added the requirement for RESP3 and Redis 7.4 or later. redis-py 8.1 enforces it (checked in its source). Valkey is now confirmed from its own source at 8.0.0 and 9.0.0: `HELLO` reports `valkey`, or `redis` 7.2.4 in compatibility mode, so redis-py's cache refuses it in both modes. Also added: build the cache yourself on older servers. |
| T-R2: Figure 6 (old 5) prose and the opening | The opening now says "Adding servers cannot spread that one key's reads". The prose now says the tallest column falls from 250k to about 138k and then 100k, more slowly than the average, and levels off near 75k. That 75k is the hot key plus its neighbours. Adding shards removes other keys from its node, never the hot key. The figure now shows that floor as a solid block (see S1). |
| T-R3 / X-S13: Zipf exponent | The prose links to the introduction's `#skew` section. It cites Breslau et al. (0.64–0.83), says s = 1 is used for easy arithmetic and is not typical, and tells the reader to measure s from their own logs. Added the source. |

## Suggested, applied

- **T-S1.** In Figures 6 and 8, the hottest key's reads are drawn as a solid block at the foot of its column, with a legend line. Copies show it split across four nodes, replicas show it halved, and the near cache shows 40/s. The block uses the text colour, so the prose calls it a "solid block" rather than a "dark part", which would be wrong in dark mode. The readout's colour now matches the column. A new model field, `hotLoads`, is tested.
- **T-S2.** In Figure 10 (old 9), the late reply is drawn as a sloping arrow. It leaves Redis at the GET's row and crosses the invalidation. This is a local extension, `slope-arrows.mjs`, applied after the shared drawing because the shared toolkit was not to be edited. A test checks that a sloped reply leaves the lane where its request arrived.
- **T-S3.** New Figure 4 steps through atomic slot migration in 14 steps (`MigrationFigure.astro`, `asmSpec`). The dense paragraph it replaces is shorter.
- **T-S4.** "You can stop here" is now "skip the cluster sections", with a pointer to the hot-key sections, which also apply to one server.
- **T-S5.** Explained PFAIL and FAIL, and the gap between the 15 s timeout and the 17–20 s it took to agree.
- **T-S6 / X-S6.** The timeout advice now names what limits how low it can go: forks, slow commands, large `DEL`s and VM stalls. It also gives the replica validity window. Removed the unsourced "a few seconds is common".
- **T-S7.** Gave the reason for main-thread trimming, verified in `cluster_asm.c`: tracking cannot invalidate a whole slot, so Redis deletes key by key and sends invalidations.
- **T-S8.** Added one paragraph on the proxy alternative (Envoy, checked in its docs) and on connection fan-out (T-S10).
- **T-S9.** Added one paragraph on big keys, with `--bigkeys`/`--memkeys` and slot memory.
- **T-S11.** Cut "Why 16,384?" to two sentences. The odd-brace cases now live only in the preset. Shortened the `MULTI` bullet.
- **T-S12.** Fixed all four sentences, including the Figure 9 step that said "never more".
- **T-S13.** Renamed the headings to "Resharding and slot migration", "Cluster failover", "Hot keys and hot shards" and "Client-side caching with CLIENT TRACKING". The ids are unchanged, so existing links still work.
- **T-S14.** Figure 5's open-ended outages now read "from 20 s until repaired" and "from the kill until repaired". The caption explains the wobble between half-second buckets: the pairs sum to 1,200. The markers are shortened to "FAIL" and "promoted" so they no longer crowd the 375 px chart.
- **T-S15.** The average label now sits above its line.
- **T-S16.** Lane headings are now one line ("Node C", "App A"). "Near cache" moved into the state line ("cache: v1").
- **X-S1.** "Promises" is now "says you can expect".
- **X-S2.** Mentions `CLUSTER SHARDS` or the older `CLUSTER SLOTS`, in the prose and in the Figure 3 step.
- **X-S3.** `ASK` also covers keys that never existed, so cache misses also pay the extra round trip.
- **X-S4.** Fixed the `MIGRATE` order.
- **X-S5.** Added `--cluster-use-empty-masters`, checked in the source.
- **X-S7.** Added `CLUSTER FAILOVER` for planned restarts, and what a minority-side primary does. The "whole cluster stops" wording is now "unassigned or owned by a FAIL node".
- **X-S8.** `HOTKEYS` and `SLOT-STATS` work per node. The CPU and network statistics can be turned on at runtime. The managed-service caveat is noted.
- **X-S9.** Added Valkey 9.0's atomic slot migration, confirmed on Valkey's blog. I did not add the multi-database note: it changes a decision only for Valkey readers, and the "One database" bullet is about Redis.
- **X-S10.** "In seconds" now gives the sizes: 25 MB here, about 1.7 GB in the vendor's test. The prose notes that the time grows with the data moved.
- **X-S11.** The cause of the CPU outlier is now stated as not found, with its numbers (about 430 µs a call against under 1 µs), in the prose and in Figure 7.
- **X-S12.** The Facebook citation is now "a related idea", described accurately.
- **X-S14.** Added a sentence on pinging the invalidation connection.
- **X-S16.** `cluster-require-full-coverage no` now applies to every node, replicas included, in the prose and in the closing bullet.

## Suggested, skipped

- **X-S15.** Ping detail: absorbed into T-S5's rewrite. `ArticleRef slug=""` already resolves to the introduction (checked in `ArticleRef.astro`). I did not add the scale-in note, because no reader decision here depends on it.
- **T, "Beside the references": a live simulation of a hot node's queue.** Not built. The stepped migration figure (S3) and the hot-key block in Figure 6 (S1) close part of the gap. A live requests-to-shards simulation would be a substantial new figure, so I am leaving the decision to the orchestrator.

## Checks

- Model tests: 13 pass (`node --test src/components/caching/cluster-and-hot-keys/*.test.mjs`).
- `CACHING_DRAFT_PREVIEW=1 pnpm build` built this page. The site check passed every rule for it. Its only failure was 5 broken anchors on `designing-a-cache`, another agent's page.
- I screenshotted all 10 figures in light and dark, at 1280 px and 375 px (`screens/`), with no console errors and no overflow. I exercised every changed control: ring at 2/4/8 servers, all steps of Figure 4, the three failover scenarios, shards at 3/6/12/48 and s = 1.2, all remedies, and both race variants to the end.
- I read the whole article through once. Two long paragraphs in the tracking section were split.
- Port 7120 was shut down and its data deleted. The dev server on 4420 is stopped. Nothing is committed.
