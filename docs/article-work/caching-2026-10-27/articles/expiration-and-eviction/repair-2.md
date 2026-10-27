# Repair 2: Cache expiration and eviction

Review addressed: `review-final-2.md` (pre-publication). Evidence appended to
`evidence/expiration-and-eviction.txt` under "Repair round 2". Screens refreshed in
`screens/` (all nine figures, light/dark, 1280/375). Two more: `x-fig1-ttl3-6s.png` and
`x-fig1-ttl3-30s.png` show the prose sequence at 1×. Dev server on 4414 stopped. Nothing committed.

## Blocking

| Finding | What I did |
| --- | --- |
| B1 Figure 1 carry-over | Two changes. First, a TTL change now drops the cached copy (`setTtl` in `ttl-model.mjs`), so the next read is a miss that stores the first copy with the new TTL. The "so far" counts start at that miss, and the reads-a-minute readout uses the same start. The dropped bar ends without an expiry ring. The caption says this is a modelling convenience: "in Redis a stored copy would keep its old TTL". I chose dropping over waiting for the old copy to expire because a 30 s copy can take up to 30 s to expire, which would leave "–" on screen for half a minute. That fails the "within a few seconds" aim. Second, with the carry-over gone, the old seed (12) still had three database changes close together in its first minute. That put the 3 s stale readout above 25% in 15% of simulated readings, so a reader could still see the wrong lesson. I searched seeds 1–800 against the prose sequence across start times and holds and chose 685, where this happens in 2% of readings. The prose now says to let 30 s run for half a minute. It also says the stale readout jumps whenever a change lands and takes a while to settle. A new unit test checks that a TTL change drops the copy and that the next read is a miss. It also checks that the counts after a change converge to the formulas. |
| B1 check at 1× | Playwright, real time, 10 → 30 (held 30 s) → 3. At 30 s: +10 s 83% / 97% (stale 0% / 37%); +30 s 96% / 97% (stale 55% / 37%). At 3 s: +6 s 75% / 75% (stale 0% / 5%); +10 s 77%; +30 s 79% / 75% (stale 0% / 5%). A second run starting at 45 s reached 75% / 75% and 0% / 5% by +10 s. The same sequence with reduced motion (Step 5 s only) gives the same result. Limitation: at 30 s the stale readout stays at 0% if no database change falls in the half minute, which happens for about a third of start times. The bars and the long-run 37% still show the point. |
| B2 model reported as Redis | "Approximated LRU" now reads: "In this article's model of Redis's eviction, run on the workload of the next section at a steady 5,000 requests a second, 5 samples came within 0.1 points of an exact LRU's hit ratio at the smallest cache size (about 15 requests a minute for each cached key) …". The benchmark-speed support is also labelled as the model. The reviewer called M8's 80,000/s row "measured", but the evidence marks all of M8 as model. I swept for anything like it. Changes: "5,000 requests a second, which only the model shows at this size"; "in the model, … LFU leads at every size again"; the 1.6-point gap is now "against an exact LRU simulated on the same requests". The clock claim and the closing advice now say "in the model" and give the pace. Figure captions already separated model from measurement, so they are unchanged. |

## Minor

| # | What I did |
| --- | --- |
| 1 Paced check | I rewrote the paragraph. It gives the pace as "about 5 to 6½ a minute per cached key". It describes the full-speed run as "about 18,000 requests a second, roughly 240 a minute per cached key". It says LRU's 17.7% was measured with a smaller cache (about 3,800 keys, against 4,400–5,000 for the LFU runs under the same `maxmemory`). At equal size the model puts LRU about 3 points behind LFU (P1: 22.7 against 19.6 at C = 5,029), against 10 points at full speed. It mentions the 48 s lag, and the model at that run's size agrees with it to within 0.2 points. |
| 2 Pace overclaims | "as most production caches' do" is gone. The text now says the coarse clock stops mattering once each cached key is read no more often than every few seconds, and that the model's LRU came within a quarter of a point of exact at every size at 5,000/s (M6: maximum gap 0.22). The closing is bounded the same way and says "in the model". |
| 3 "Up to a tenth" | Para 47 now says to treat the tenth as the steady state of a busy server, not a limit. After a burst, or on a quiet server, a fifth or more can be held for minutes (E1: about 17% still held after 40 s at 350 a second). The memory bullet and the closing were changed to match. |
| 4 Length, paras 45–46 | Cut from about 255 words to about 145. Kept: the cycle rule, about 200 keys examined a second once the expired share is low, and that only a busy server clears a burst quickly (a fifth of the keys: nearly all within 20 s busy, most still held after 40 s idle). Cut: the trigger rules for fast cycles and the 4.8% run (both are in the evidence). The keys ÷ 200 s pass time stays in para 47. |
| 5 `expired_time_cap_reached_count` | Changed to "How often an expiry cycle ran out of its time budget and stopped". Checked in `expire.c` 8.10.3, lines 485–486: one code path serves both cycle types. |
| 6 `dynamic-hz` | Added: "(With many clients connected, Redis raises `hz` on its own, which makes each slice shorter but keeps the share of time the same.)" Checked in `server.c`, lines 1575–1579, and `expire.c`, line 347 (the time limit is 25% of 1/hz). |
| 7 Size-curve steps | Changed to "climbs by roughly 5 to 20 points at each step of the axis". Checked against X10: LRU steps are 5.2 to 20 points and LFU steps 4.4 to 15.8. |
| 8 LRM framing | Added: "despite the documentation's framing of them for read-heavy workloads, a key that is read constantly but never rewritten is the first to go". I checked this against the redis.io eviction page fetched today. |

## Read-through

I read the article from top to bottom after the changes. The Figure 1 paragraph,
the shortened expiry section and the rewritten P1 paragraph read smoothly into
their neighbours. No section now repeats the pass-time rule. Not run:
`pnpm build`, because it would have built into the shared `dist/` while other
work was running in the repository. The dev server compiled without errors, and
none of the screenshot runs logged a console error, a page error or horizontal
overflow.

Note for the orchestrator: other work in the repository kept triggering dev-server
reloads, which reset live figures every few seconds. My Playwright scripts replace
Vite's HMR socket with an inert stand-in (`scratchpad/pw/ee2-*.cjs`) so that a
real-time run is not interrupted.
