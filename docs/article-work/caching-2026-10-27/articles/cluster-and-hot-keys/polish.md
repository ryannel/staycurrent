# Polish: Redis Cluster, sharding and hot keys

Applies the nine minor items in `review-final-2.md` and the length cuts it suggests. Nothing in `src/components/caching/shared/` was edited. Figure tests pass (13 of 13); every figure and every edited section was re-read in the rendered page (light and dark, 1280 px and 375 px). Not committed.

## Cuts (about 450 words)

- Resharding (M1): removed the 99th percentile latency row and the paragraph on why latency is weak evidence; replaced with one sentence saying the key-by-key time is only indicative (Python script on the same laptop). Updated "second and third rows" to "second row". Kept time, hits, redirections, errors and Redis's benchmark.
- Client tracking (M2): the `OPTIN`, `NOLOOP` and `REDIRECT` paragraphs became one. Kept: `OPTIN` tracks only the next command after `CLIENT CACHING YES` (or the following `MULTI` or script), so one `YES` followed by several cached reads leaves keys untracked; `NOLOOP` suppresses own-write invalidations; RESP2 needs a second redirected connection. Cut the test narrative and the "Redis forgot the key" detail. The library paragraph (RESP3, Redis 7.4 or later, redis-py enforcement, Valkey) is unchanged.
- Placing keys: removed the ring share-bound sentences ("within a fifth of an equal share", one point per server giving a tenth to three and a half times).

## Minor items

- M1, M2: as above.
- M3: `CLUSTER SLOT-STATS` now "names the slot, not the key"; on 8.6 or later `HOTKEYS START … SLOTS 1 <slot>` names the key.
- M4: (a) added a "✕ a node over its capacity" legend entry under Figures 6 and 8. (b) Figure 6 at 12 shards is 100,459 reads a second, so the prose now says "just over its limit" (also in the Figure 8 lead-in). (c) the average label shows one decimal when needed: "average 12.5k" at 48 shards for both skews. (d) the average label moved to the right-hand end. (e) the capacity line has a pale band under the dashes, so it shows across over-capacity columns. Changes in `columns.mjs`, `cluster.css`, `HotShardFigure.astro`, `RemediesFigure.astro`.
- M5: copies of hot keys must be on different nodes, not just different slots; check with `CLUSTER KEYSLOT`; four copies share a node about 40% of the time at twelve shards.
- M6: a minority-side primary "stops accepting writes ... and reads too unless `cluster-allow-reads-when-down` is on".
- M7: closing now says "without a single miss and in seconds rather than minutes".
- M8: `--hotkeys` bullet: after switching to LFU during an incident, give the counters traffic before trusting them; on 8.6 or later use `HOTKEYS`.
- M9: Figure 7 no longer clips at 375 px: the missing value shows "—" (the note under the chart still says "not listed" or "not in its top ten"). Figure 10: the level "invalidate" arrow's label moves to the side of the crossing the sloping reply does not pass through (past the crossing on 375 px, where there is not room beside it); label shortened from "invalidate (inv.)" to "invalidate", which the step text already explains. Changes in `slope-arrows.mjs`, `sequences.mjs`, `ToolsFigure.astro`.

## Not done

- The optional animation of columns between slider stops (review, question 1).
- The HOTKEYS CPU anomaly paragraph is unchanged.
