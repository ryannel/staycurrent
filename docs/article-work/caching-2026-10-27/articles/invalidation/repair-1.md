# Repair, round 1: Cache invalidation and consistency

Reviews addressed: `review-teaching-1.md` (teaching, T) and `review-technical-1.md`
(technical, X). New Redis evidence is in `evidence/invalidation.txt` under
"Repair round 1" (Redis 8.10.3, port 7115, temporary directory, `--save ''`,
shut down afterwards). Screens are in `screens/` (every figure, both themes,
desktop and 375 px) and `screens/use/` (controls exercised).

Prose length: 6,713 words before, 6,013 after (code and Sources
excluded). About 1,300 words of the original were cut, as T identified; about
600 were added for required content (monotonic reads, the failover paragraph,
the tag-set race, the generation round trip, the tombstone figure, measuring
staleness).

## Required findings

| Finding | What I did |
| --- | --- |
| T-R1 Figure 3 misrepresents stretch length and stale share | Replaced the 50-row strip with a bar chart of stale time by stretch length (six buckets, up to 1 s … over 10 min). Bar height is stale minutes summed over the fifty keys for the day, so the bars' total is the stale share; the number above a bar counts the stretches; a dashed outline shows the default settings. The 1-minute TTL now visibly gives more, shorter stretches with the same total (104 against 73, 0.077% both); every 6 s gives bars holding about ten times the outline's stale time, not a page of ink. I chose the reviewer's option 2 without the rows: no row-based drawing can show 0.077% honestly at 24 hours per row (true-width marks are sub-pixel and vanish, minimum-width marks overstate). Prose, caption and text alternative rewritten to match. |
| T-R2 Monotonic reads not taught | Added as the fourth promise, with how a cache breaks it; one sentence in the replica question saying primary fills or the marker also give that user monotonic reads. |
| T-R3 / X-R2 Generation lookup cannot share a round trip | Fixed once: a generation costs a second, dependent round trip, avoidable with one script (verified on 8.10.3, evidence R6) or by caching the generation briefly (adds that much staleness). Table: `GET`, with `MGET` "for several counters". |
| T-R4 Bounded-staleness proviso | Rewritten: the bound is the TTL plus however old the value was when stored (fill time or replica lag). |
| T-R5 ArticleRef bypassed | "Caching patterns" in the versions section now uses `ArticleRef`. All article references use `shared/ArticleRef.astro`. |
| T-R6 Tombstone used before defined | Restructured the versions section: eviction case, then the tombstone definition, then the script (variable renamed `tombstone`, comment explains the equal-version branch). |
| T-R7 No figure for the tombstone result | Added a fourth option to Figure 6, "only if newer, with a tombstone": the slow reader's version-7 fill refused against a version-8 tombstone, then the next reader's version-8 fill accepted. New spec `versionSpecs.tombstone`; test added. Figure retitled "Version checks on cache writes". The lease's second half stays in prose, now shorter. |
| X-R1 Failover loses acknowledged deletes | New paragraph at the end of "Lost deletes": asynchronous replication can lose an acknowledged `DEL`, the delete that cancels a lease, a tombstone or an `INCR`; an outbox cannot catch it; a restart from an older snapshot does the same; the TTL is the bound that still holds; `WAIT 1 100` makes loss less likely but the WAIT page says a replicated write can still be lost; the remedy is replaying the last few minutes of invalidations after a failover. Links to `replication-and-persistence` via ArticleRef. Table rows (TTL, outbox) and the lost-delete question updated. Figure 7 text alternative softened. WAIT returning 0 with no replica observed; a failover itself could not be observed on one port, and Sources says so. |
| X-R3 Tag-set race | Recipe now invalidates with one script that reads the members and unlinks them and the set (batches of 500), and fills `SADD` before `SET`. Reproduced the race and checked the script and the fill order on 8.10.3 (evidence R1–R4). Figure 8 model and text alternative updated (one script per change). |
| X-R4 Arithmetic | "about a hundred thousand stale prices a month, a few thousand every day". |
| X-R5 Replica claim | "Most writes now produce an old value (about two in three in this model … nearly all for a busy key)". Figure 4's text alternative says the same. |

## Suggested findings

Applied:

- T-S1 "fill" defined where the race is introduced.
- T-S2 derivation laid out as displayed steps; "something tidy happens" cut.
- T-S3 partly: Figure 4's y-axis now reads "Old values stored (square-root scale)", and the caption warns that the scale enlarges far bars and to read shares from the counters. A cumulative line would need a change to the shared histogram, which I may not edit.
- T-S4 one sentence: the late share depends on your fill-time tail; the length bias holds whatever its size.
- T-S5 Figure 8 now has product 42 on three of twelve pages (one per sort order, which is where a product actually appears). Tags delete about 2.9 pages a change; a generation discards about 10.7. New readout "Pages discarded per change"; prose names the cost.
- T-S6 Figure 8 now draws each page in a fixed slot (rows by sort order, outlines for pages not cached); unreachable generation pages sit in their own row.
- T-S7 Figure 5's lane is "Readers"; the second reader's steps are labelled "r2: GET" and "r2: SET lease", with an explanation that it is a different request.
- T-S8 Figure 9's lane is "Sam's requests" (short "Sam").
- T-S9 two sentences on measuring staleness by sampling hits against the primary.
- T-S10 / X-S7 `IFEQ` loop: a missing key is written with `SET … NX`. Verified (evidence R9).
- T-S11 / X-S11-related Cluster sentence now applies to multi-key commands and scripts (tag script, counter-and-page script).
- T-S12 / X-S3 lease expiry: "a little longer than a slow fill, not generous", with the reason. Code and Figure 5 now use `PX 2000` instead of 10 s.
- T-S13 aphorisms cut or replaced as listed ("come back from the dead" → "served again").
- T-S14 headings: "The stale-set race", "Lost deletes: transactional outbox and change data capture", "Invalidation fan-out: tag sets and generation numbers".
- T-S15 TTL expanded at first use in the opening.
- T-S16 / X-S19a Figure 3 text alternative says one race.
- X-S2 the lease's database read must start after the lease, not in an earlier transaction or snapshot.
- X-S4 `KEEPTTL` inside the lease keeps the lease's expiry; text says pass `EX` (verified, evidence R8).
- X-S6 tombstones also refuse fills from a lagging replica while they live: version section, table, replica question.
- X-S8 one comment line in the script: keep versions below 2^53.
- X-S9 Rails' `updated_at` is an application timestamp; one clause.
- X-S10 a Redis stream only on an instance with persistence and no eviction.
- X-S11 the invalidation must follow the slowest replica (replica question).
- X-S12 a generation is immune to the stale-set race; one sentence.
- X-S13 restart the counter from Redis's `TIME`, not the application clock.
- X-S14 tag set TTL at least the page TTL, extended with `EXPIRE … GT` (verified, evidence R5).
- X-S15 "three or four times as many page keys" (median 3.6 in the updated model).
- X-S16 `DEL` timing now "tens of milliseconds for a million names on a laptop", without a precise range.
- X-S17 Facebook's remote marker is per key, affecting every reader of that key in the region.
- X-S19b the hold-off: one parenthesis saying Facebook uses it only while warming a cold cluster, because reads go to the database meanwhile. The second "tombstone" (`SET … tombstone PX 2000`) is gone (T length point 3).
- X-S19c replica lag: "often milliseconds … and seconds under load".

Skipped, with reasons:

- X-S1 the three lease differences from memcache (token returned with the miss, `SET … NX GET`, stale value for non-holders). Accurate and interesting, but it would add 80–120 words to a section the teaching review asked to shorten, and none changes the reader's decision about whether or how to use the lease here. Article 6 (stampedes) is the natural home for serving a stale value to non-holders.
- X-S5 Valkey. The reviewer could confirm `SET … IFEQ` in Valkey 8.1 only from secondary sources and could not confirm a `DELEX` equivalent; I did not want to state an unverified version. The Lua fallback already covers servers without `IFEQ`.
- X-S18 hot keys' race counts. The advice already uses the share, which is the robust quantity; the count difference changes no decision.
- T Figure 1's busy legend: acceptable per the reviewer.

## Length cuts (teaching review, "Length that does not pay")

1. The seven-bullet "What you can now decide" list and its heading are gone. The questions are kept but shortened: the TTL and fill-time questions are folded into one opening paragraph, followed by the four the reviewer named (replicas, lost deletes, fan-out, the writer), then the forward link to Stampedes.
2. Most inline "On Redis 8.10" observations removed; kept those that change a decision (`IFEQ` dropping the expiry, `PUBLISH` returning 0, `DEL` against `UNLINK`). The rest are listed once in the Sources note, which now names every measured behaviour the text relies on.
3. The delete hold-off paragraph is one parenthesis, with no second "tombstone".
4. The mcsqueal mechanics and the 4% statistic are cut.
5. General tightening throughout (lease, outbox, change data capture, Rails, read-your-writes, table cells).

## Conflicts between reviews

None of substance. Both reviews flagged the generation round trip; fixed once. The teaching review asked for shorter lease prose while the technical review offered several lease additions; I took the ones that prevent a wrong implementation (read inside an earlier snapshot, expiry length, `KEEPTTL`) and skipped the comparative ones (X-S1).

## Checks

- `node --test src/components/caching/invalidation/models.test.mjs`: 8 pass (tombstone sequence and fan-out discard counts added).
- Dev preview on port 4415 with `CACHING_DRAFT_PREVIEW=1` (stopped afterwards); no page or console errors, no overflow at 375 px; every figure screenshotted (replacing the earlier `screens/` set) in both themes at desktop and 375 px; Figures 3, 5, 6, 8 and 9 exercised (see `screens/use/`).
- Redis 8.10.3 evidence appended; server shut down and its directory removed.
- Not committed.
