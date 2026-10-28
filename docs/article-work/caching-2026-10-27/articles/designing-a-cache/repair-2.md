# Repair 2: Designing a cache: a worked example

Review addressed: `review-final-2.md`, with the orchestrator's notes (pre-publication round).
New evidence is in `evidence/designing-a-cache.txt` under "Repair round 2" (E6 maxmemory units on
8.10.3, E7 model numbers). Model tests: 9/9 pass (one new test). `pnpm build` (with and without the
draft preview) passes the site check; `pnpm test` 23/23. Screens in `screens/` (12 standard shots plus
`r2-*` states). Not committed.

## Blocking

- **B1. Figure 2's need was fixed at 92.5%.** `budget()` now returns `need = 1 − (capacity × alert −
  checkout queries) ÷ (2 × page views)`, plus `overAlert` and `overCapacity`. The hit readout reads
  "96.9%; need 92.5%" and turns to the error colour with ", not met" when the need is not met. Driven in
  the browser: today 92.5%; checkout from Redis 90.5%; twice the peak 97.8% (97.75%), met at 4 GB (97.9%,
  204) and **not met at 3.5 GB (95.9%, 284)**. New test "the hit ratio needed follows the budget"
  checks those values and that "need met" equals "under the alert line" across several settings. The
  text alternative table gained a "Needed" column; the caption defines the need; the budget section
  says the 92.5% holds only at today's traffic with checkout reading the database; the walk-through
  uses the need's movement (checkout from Redis; twice the traffic).
- **B2. Pacing broke the price target; "charge whatever the page showed".** The sale paragraph now
  says the last products paced show the old price for up to about seven minutes, past the one-minute
  target, and that the shop accepts this for a sale that must start at peak and otherwise schedules
  repricing off-peak. Checkout: the basket keeps the price the page showed and checkout, which reads
  the database, shows the new price and asks the shopper to confirm when they differ. Carried into
  "Keeping copies fresh", the design table ("What not to cache", "Freshness") and checklist item 3.

## Decision: memory 4 GB

Adopted. `maxmemory 4gb` (verified on 8.10.3: `4gb` accepted, `3.5gb` rejected by `CONFIG SET` and in a
config file, E6). Updated consistently: model default (`budget()` maxmemory 4), Figure 2's text table
(design rows at 4 GB; 3.5 GB kept as walk-through rows), walk-through (ends at 4 GB, "5 GB changes
nothing"), design paragraph (87 below the alert line), memory section (nothing evicted at peak; 1.83
million present, 3.8 GB), eviction paragraphs (memory does not bind today), sale headroom 87,
sharding ("fits in 4 GB"), alert "about 98%", design table Memory and Eviction rows, "What would change"
(0.8: 123 → 124; twice: 204, need just met), and the key-version rollback note. `recovery-model.mjs`
defaults now 1,831,000 keys and 0.979 steady hit; the key-version numbers moved (room 199: about 50
minutes, 404,000 pages; ramp of 1.25 h needed; 370,000 products carry 80%), and the prose uses them.
The empty-restart numbers are unchanged. Figure 2's default stays at 2 GB, deliberately: it is the
walk-through's starting point. The slider keeps a 3.5 GB stop for the walk-through.

## Length

8,212 → 7,247 words of body by my count (tables and code blocks included); prose alone 6,579. Made
all eleven of the reviewer's cuts, in substance: LFU paragraph to two sentences and the key-count
aside dropped; LRU check to its result; allocator aside to one clause; regions and listing pages to
one sentence each; "Stuck" walk-through dropped (its one point, the stuck state, kept as a sentence in
"Without the limit", so the Metastable Failures source still has a referent); ramp and paced-fill
numbers to a clause each; freshness opening and lease narrative trimmed; ACL test report shortened;
sessions paragraph to settings, the accepted loss and a link; retries paragraph without the 3.6 s and
`WATCH` sentences; Che paragraph without the simulation sentence; checklist reasons to one clause and
closing to two sentences; opening preview and the 1999 comparison shortened; currency and sharding
trimmed. Further trims to stock, sessions, jitter, trending, the failure opening and the Figure 3
lede. Every decision and its link kept. The fixes added roughly 250 words, so the body lands a little
above the 7,000 target with tables counted, inside it for prose.

## Minor

1. Figure 1 label clipped at 375 px: below 480 px the band label is "Read less than once per TTL";
   it switches on resize (checked by script and screenshot, `r2-phone-fig1-1h.png`).
2. Figure 1 at one hour: prose now quotes the readout, "only 392,713 products, a fifth of the
   catalogue, clear the line, and the other four-fifths still get 19% of the reads".
3. "Stuck" instruction: paragraph cut, so the issue goes.
4. Rollback after conversion: one sentence says a rollback to v3 finds popular products missing, 4 GB
   has no room for both copies, so rollbacks are planned off-peak with the limit covering the rest.
5. `masteruser`/`masterauth` now "Both servers set …", with the reason.
6. Bulk deletes paced "in a queue of its own so that stock deletes are never held up behind it";
   also in the design table.
7. Partitions: the replay window must reach back past `down-after-milliseconds` plus the failover,
   because a partitioned primary accepts deletes and discards them on rejoining.
8. Figure 2 load readout: ", over the alert line" and the error colour above 210; ", overloaded"
   above 300.
9. ACL: "test the file with your own client library in Sentinel mode too", naming `ROLE`/`INFO`.
10. Expiry bound: "and the stock keys as many again".
11. Trending: the lock holder "checks that the copy is still stale" before rebuilding.
12. Dev toolbar over Figure 3: noted, nothing changed.
13. Sources: nothing to add with 4 GB; the units check is in the evidence file.

## Not changed

- Figure 3's model keeps its 14,000-of-20,000 cache (about 92% hit). Its caption already says it is
  illustrative and the article quotes the shop's numbers from the full-size model; resizing it would
  change every playground test for no change in what the figure teaches.
