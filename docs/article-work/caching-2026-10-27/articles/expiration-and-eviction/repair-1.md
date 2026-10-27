# Repair round 1: Cache expiration and eviction

Article: `src/articles/caching/expiration-and-eviction.astro`; figures in `src/components/caching/expiration-and-eviction/`.
Reviews: `review-teaching-1.md`, `review-technical-1.md` (this folder).
New evidence: appended to `docs/article-work/caching-2026-10-27/evidence/expiration-and-eviction.txt` as section "Repair round 1" (E1, E1b, E2, P1, M5–M8, with scripts). Redis 8.10.3 on port 7114, temporary directory, `--save ''`, shut down afterwards.
Screens: `screens/` (first paint, both themes, 1280 and 375 px) and `screens/use/` (each changed control after use).

## The central problem: measurements at a benchmark's pace

The eviction comparisons (old X10, X11) ran at about 80,000 requests a second for about a minute. Both of Redis's approximations keep time on the wall clock, so that pace hid LFU decay and exaggerated the LRU clock's ties.

What I did:

- **Model sweep (M5, M6, M8).** I ran the article's own Redis-like cache (`sampled-cache.mjs`) on the X10 workload at 80,000 a second (X10's conditions) and at 5,000 a second after an hour of simulated warm-up, for all five sizes and for random, LRU, exact LRU, LFU and LFU with `lfu-decay-time 10`. At 80,000 a second the model reproduces every X10 measurement to within 0.6 points (it runs 0.1–0.6 high throughout), so it is a fair stand-in at other paces. A further sweep by pace at two sizes (M5) shows the same shape from 240 down to 0.1 requests a minute per cached key.
- **Real-server check at a slower pace (P1).** A scaled-down copy (800,000 keys, cache of about 4,500, same 0.5% share) on Redis 8.10.3, first at full speed (about 18,000 a second) and then at 400 a second (about 5 requests a minute per cached key) for 10 minutes unmeasured and 10 measured, with the model run on the identical procedure. Results and comparison: see "P1 outcome" below.
- **Figure 8 rebuilt** as "Hit ratio against cache size, fast and steady": one control, *Traffic*, with 80,000 a second (model lines with the X10 measurements as circles), 5,000 a second (model), and 5,000 with `lfu-decay-time 10` (model; only the LFU line changes). Readouts show requests a minute per cached key and LFU's lead over LRU at the smallest and largest sizes. The text alternative tabulates every measured and modelled value.
- **Figure 9** gained two one-variable controls: requests a minute per cached key (36, the original compressed model, or 1, the same run 36 times slower, plotted in minutes) and `lfu-decay-time` (1 or 10). At 1 a minute with the default decay, LFU falls from 43% to 34% during the job, nearly as far as LRU (42% to 30%); with decay 10 it holds 50% to 49% (M7, five seeds; now tested in `models.test.mjs`).
- **Prose.** The LRU-or-LFU section now states each measurement's conditions, explains the two clocks (LRU's one-second clock, LFU's per-minute decay) in two short paragraphs after Figure 8 (this also does S1), reports the P1 check, and qualifies the advice. The closing advice now reads: `allkeys-lru` is the safe default and matches exact LRU at a production pace; `allkeys-lfu` can do better when popularity is stable, but only with an `lfu-decay-time` long enough that wanted keys are read at least once per period; judge either at your real pace; keep batch jobs out of the cache. The reader's takeaway about choosing a policy survives, with the LFU recommendation made conditional on the decay time.

## Teaching review

| Finding | What I did |
| --- | --- |
| R1 ArticleRef import | Fixed: imports `shared/ArticleRef.astro`. |
| R2 Fig 1 stale readout | Each readout now shows "so far / long run", the long-run value from the derived formulas (91% / 15% at 10 s; 97% / 37% at 30 s). Prose hedge removed; the caption says what each number is. |
| R3 Fig 5 glyph reuse | Keys with a TTL are now solid pale-red squares, as live keys in Fig 3; keys without a TTL are solid grey (`--cache-muted`), legend "Key without a TTL (never expires)". Dashed expiry squares are now used only for expired keys. `client` grey no longer used. |
| R4 Fig 4 readout and ticks | Readouts say "all 10,000 at once" when jitter is 0, otherwise "N a second" labelled "busiest 10 s". The y axis stops at 200 a second (±5% peaks at 173), with a label "10,000 at once, off the scale" on the first spike. The x axis is now in minutes, so ticks fall at 0, 10, 20, 30, 40. Text alternative corrected (90 in the busiest 10 s, 56 by the fourth wave, 33 at ±30%). |
| R5 three measures in approximated LRU | One measure throughout: evictions from the oldest tenth (formula and Figure 6 readout, with one sentence saying the pool lifts the figure a little above the formula). The X8 table and its 84% are cut from the article (kept in evidence). The section now ends on hit ratio: at 5,000 a second the default 5 samples come within 0.1 points of exact LRU at the smallest size, and 10 or 64 samples gain less (M8). |
| S1 clock subsection placement | Done: the clock is explained after Figure 8, where the reader has seen the gap. |
| S2 pool on/off | Skipped the extra control; took the reviewer's second option (one sentence linking formula and figure). A toggle would add a control and model change for a few points of difference that changes no decision. |
| S3 Poisson step | Added one clause. |
| S4 expand LRU, LFU | Expanded in the policy table. |
| S5 searchable headings | "Synchronised expiry and TTL jitter"; "Approximated LFU: a logarithmic counter with decay". Figure titles kept plain. |
| S6 Fig 3 readout, flash square | Readout relabelled "Keys in memory, live and expired" in neutral; the unexplained just-deleted square removed (deleted keys are no longer drawn). |
| S7 Fig 7 dotted join | Measured values are now circles (local overlay `chartPoints` in `draw.mjs`) with a key "Measured on Redis 8.10.3". Fig 8 uses the same circles for measurements, so circles mean measured and dotted means calculated across the article. |
| S8 Fig 9 colours | LRU is `redis` with a dash, LFU `hit` solid; readouts coloured to match; the batch band is neutral grey. |
| S9 Fig 6 phone pool, readout colour | Pool wraps to two rows of eight with idle seconds beneath each; readout neutral. |
| S10 samples table on phones | Moot: table removed (R5). |
| S11 opening paragraph 3 | Cut to one sentence. |
| S12 latency-page paragraph | Moved into the Sources entry. |
| S13 split cycle paragraph, fast-cycle condition | Rewritten as the rule, then what it means on a real server; fast cycles now stated with both conditions. |
| S14 TTL table | Dropped RENAME, SET NX, INCR/APPEND and EXPIRETIME; added the `GT` note (technical S4). |
| S15 second scan measurement | Cut. One sentence of the interleaved X11b result remains, labelled as benchmark speed. |
| S16 INFO table | Dropped hits/misses and memory rows; kept expired, evicted, stale estimate, keyspace, OOM. |
| S17 cycle-falling-behind counter | Added `expired_time_cap_reached_count`. |
| S18 big values freed on main thread | One sentence after the oversized value, linking to `how-redis-works#freeing`. Defaults checked locally (`lazyfree-lazy-expire no`, `lazyfree-lazy-eviction no`). |
| S19 Azure default | Skipped: not verified in this round (no primary source in the research files), and ElastiCache alone makes the decision point. |
| Fig 8 "roughly threefold" | Caption now says "uneven steps"; the prose no longer claims a step ratio. |
| Writing notes | "Only the memory tells" → "Only the memory figures show it"; "slope rather than a cliff" → "arrives over two minutes instead of in one instant"; the hard-to-parse delete sentence split; DEBUG command now carries "disabled by default and has no place in production". |
| Cut 600–800 words, second half | See "Length" below. |

## Technical review

| Finding | What I did |
| --- | --- |
| R1 reclamation speed | Replicated and extended (E1, E1b): at 4.8% of keys with a TTL, about 10 reclaimed a second, idle or busy; at 20%, about 350 a second on an idle server, but a busy server's fast cycles cleared them within 20 s and then stopped once the estimate fell under 10%, leaving the last ~180 to the slow walk. Prose now explains the rule, the half-second X4 drain as the best case, the 10/s case, and the planning consequence (up to about a tenth of keys with a TTL held; a single key can wait a full pass, roughly keys-with-TTL / 200 s at hz 10). Fig 3 caption and text alternative now say the model is tiny so its samples cover most keys. Closing and notifications bullet now say minutes or hours. |
| R2 X10 clock attribution and ranges | The "1 to 4 points" claim is gone. Prose gives the benchmark's pace, the 1.6-point LRU-to-exact gap at the smallest size, attributes it to the clock, and says more samples recover none of it (model: 64 samples 0.1797 against 0.1793). |
| R3 LFU depends on rate | Addressed as the central problem above (Figs 8 and 9, prose, closing advice). |
| R4 pool misdescribed | Rewritten: every sampled key enters if there is room or if it is idler than the least idle candidate, which then drops out. |
| R5 "two older descriptions" | Now one, and moved to Sources with the source function named. |
| R6 Facebook attribution | Rewritten to the paper's sequence: the structure, then a short expiration time on one key family, 6% → 0.3% without affecting hit rate. |
| S1 cycle timing | "at hz 10" added to the 26 ms pause; "at the default hz" added to the pass-time rule. Elapsed-time detail left out: no decision depends on it. |
| S2 DEBUG SET-ACTIVE-EXPIRE | Now "disabled by default and has no place in production". |
| S3 noeviction scope | Now "refused every command that may need more memory, including INCR on a new key and a plain SET that overwrites an existing one" (checked: E2). |
| S4 GT on a key without a TTL | Added to the table; checked locally (E2: `EXPIRE k 600 GT` → 0, TTL −1; `LT` → 1). |
| S5 jitter needs rounding | Snippet now `round(600 × (0.9 + 0.2 × random()))` with a note that `EX` takes whole seconds. |
| S6 X7 arithmetic | 2,367. |
| S7 X11a pause sentence | Moot: X11a cut (teaching S15). |
| S8 Valkey LRM | "absent from Valkey", with Valkey's `config.c` in Sources. |
| S9 cursor wording | "walks on through the keys that have a TTL, 20 at a time"; Sources notes the EXPIRE page's "at random" describes the older algorithm. |

## Length

Prose (excluding figures and sources): about 6,000 words before, about [WORDS] after. In the second half I removed the X8 table and its paragraph, the X11a/X11b narration, two INFO rows, the second policy measurement, the separate-pools aside, the LFU source dispute (to Sources), the OBJECT commands paragraph (to one sentence) and much of the closing. The rate explanation the technical findings required (about 400 words, two clocks, the P1 check and the qualified advice) went in, so the second half is net [NET] words shorter than before. In the first half the cut TTL-table rows and shorter precision and DEBUG paragraphs pay for most of the new reclamation explanation.

## P1 outcome

[P1]

## Still needs a decision

- [DECISIONS]
