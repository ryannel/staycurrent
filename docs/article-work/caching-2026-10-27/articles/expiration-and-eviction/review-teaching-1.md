# Teaching review, round 1: Cache expiration and eviction

Reviewer: independent editor. I did not write this article and have not seen any earlier review.
Article: `src/articles/caching/expiration-and-eviction.astro`, figures in `src/components/caching/expiration-and-eviction/`.
Rendered at `/learn/databases/caching/expiration-and-eviction/` with `CACHING_DRAFT_PREVIEW=1` on port 4454 (since stopped).

## How I read it

- I read the brief, the collection plan (articles 3, 4, 5 and 6 and the map changes), the article plan and the writer's report.
- I read the full text of Gears and Load Balancing, and used their demonstrations in Playwright. In Gears I dragged the friction-disc and wrench figures. In Load Balancing I played the round-robin and dynamic-weight simulations and moved the speed slider to its maximum.
- I read the rendered article from top to bottom and used every figure. Fig 1: TTL at 3, 10 and 30 s, stepped up to 240 s each. Fig 2: all three read rates. Fig 3: cycle on, then off for 60 s. Fig 4: jitter 0, 10% and 30%. Fig 5: each policy for 70 s. Fig 6: 1, 5 and 20 samples, 40 evictions each. Fig 7: each log factor. Fig 9: stepped to 15, 25, 40 and 60 s.
- Screenshots are in `review-screens/`. The files named `light|dark-desktop|phone-NN.png` show first paint. The files in `review-screens/use/` show each figure after I used it, in light and dark at 1280 px and at 375 px.
- With reduced motion, all five live figures stayed paused. The page does not scroll sideways at 375 px. Three elements scroll inside themselves at 375 px: the OOM `<pre>`, the samples table and the command table.
- I found no console errors. The dev server reloaded twice while I worked because other files in the repository were being edited. These reloads are not faults in the article.
- Prose length, excluding figures and sources: opening 230 words; TTL 885; how Redis expires 1,090; jitter 532; memory 912; approximated LRU 658; LFU 540; LRU or LFU 690; observing 247; closing 222. Total about 6,000.

## Verdict

**Publishable after required fixes.** The first third is the best teaching in the collection so far. The TTL derivation is short and clear. Figures 1 and 2 then show the reader that the stale curve does not depend on read rate, and the prose follows up with an order for choosing a TTL. The measurements give real numbers where others would assert: 39 MB held by expired keys, 26 ms stalls from synchronised expiry, a single 8 MB value emptying the cache, and LRU against LFU under a scan. The volatile-against-allkeys explanation and the ElastiCache default are worth a great deal to a practitioner.

The problems are of two kinds. Four figure defects mislead or contradict the vocabulary, and one import breaks the collection's link rule. Beyond those, the second half carries about 600–800 words of measurement narration and reference tables that do not change a decision.

Counts: **5 required**, **19 suggested**.

## Required

**R1. Every reference to another article must import `shared/ArticleRef.astro`. This one does not.**
Line 3 imports `../../components/caching/caching-patterns/ArticleRef.astro`. That file is the caching-patterns writer's local helper, and its own comment says it is "superseded by shared/ArticleRef.astro". It renders the same output today, but the brief requires the shared component. A local copy could also drift from the publication gating. All 13 `<ArticleRef>` uses are otherwise correct: no figure component holds a hard-coded internal link, and every other link is external and in Sources. (`keys-and-values.astro` has the same wrong import. That is outside this review, but the orchestrator should know.)
*Fix:* `import ArticleRef from '../../components/caching/shared/ArticleRef.astro';`

**R2. In Figure 1, the stale readout contradicts the lesson for the first minute or two after each TTL change.**
The figure's main claim is that a longer TTL means more of the hits are stale. The readouts count from the last change of TTL, and with one change every 30 seconds the stale share is too noisy to show this at reading pace. My steps of 60 s each, after setting the TTL:
- TTL 3 s: 11%, 10%, 7%, 6%.
- TTL 10 s: **0%, 0%**, 10%, 11%.
- TTL 30 s: 9%, 14%, 29%, 29%.

A reader who follows the prose ("Drag the TTL up to 30 seconds … more of the hits are stale") will see about 9% at 30 s and 11% at 3 s, which is the wrong way round. The prose's hedge, "press Step a few dozen times", asks the reader to do work that the figure should do for them.
*Fix:* add a readout beside the observed one for the long-run expected value from the formula just derived: "Expected stale share: 15%" at 10 s and 37% at 30 s. Then the reader sees the target at once and watches the observed value converge on it. Alternatively, warm the model for 10 simulated minutes on each TTL change before counting starts. The prose can then drop the hedge.

**R3. Figure 5's "key with a TTL" uses Figure 3's "expired, still in memory" glyph.**
Figure 3 teaches that a dashed square in the expiry colour (`is-held`) is a key that has expired but still holds memory. Two figures later, Figure 5 draws every live cache key with a TTL as a dashed square in the same expiry colour (`is-ttl`). Its legend reuses the `expiry` kind with a new label. A reader who has just learned the Figure 3 glyph will read Figure 5's memory as full of expired keys. The toolkit README says not to reuse a kind for another meaning. Figure 5 also uses `client` grey for "key without a TTL", which is a second reuse.
*Fix:* draw keys with a TTL in Figure 5 the way Figure 3 draws live keys: a solid `redis`-tint square, with a small clock or hourglass tick if a mark is wanted. Draw keys without a TTL as solid squares in `neutral` with a heavier outline, labelled "Key without a TTL (never expires)". Reserve dashed expiry squares for expired keys only.

**R4. Figure 4's first readout states a false number when there is no jitter, and its time axis hides the 10-minute period.**
At 0% jitter the readout says "Peak refills a second, first wave: **1,000**", and the y axis tops out at "1k". In the model, all 10,000 keys expire in the same millisecond. The figure 1,000 comes from dividing 10,000 by the 10-second bin; it does not describe the event. The text alternative admits this in brackets, but the visible readout is what the reader takes away. It also makes the ±10% case (83 a second) look like a 12-fold improvement, when the real ratio is far larger.

The x-axis ticks are also 0, 8, 17, 25, 33 and 42 minutes, and only 0, 17 and 33 at 375 px. The waves fall at 10, 20, 30 and 40, which are the numbers the prose uses, so no wave lines up with a tick.
*Fix:*
- When jitter is 0, show the first readout as "All 10,000 in the same instant". Otherwise label it "Peak refills a second (10-second average)".
- Clip the y axis at about 150 and draw the no-jitter spikes running off the top with a label of "10,000 at once".
- Put the ticks at 0, 10, 20, 30 and 40 minutes.

**R5. The approximated-LRU section gives three different numbers for how well the default of 5 samples works, and never connects them to hit ratio.**
- The formula gives 41%: the evicted key is from the oldest tenth, with no pool.
- Figure 6's readout gives about 45%: the oldest tenth, with the pool. The text alternative says "about half".
- The measured table gives 84%: the evicted key is among the oldest ~26,000 of 50,000, roughly the oldest half.

Each number is correct for its own definition. A newcomer, though, sees "41%", "45%" and "84%" for one setting within three paragraphs, and the table's metric is defined only in the sentence before it.

The section then ends with "The default of 5 is a sound choice" on the strength of the documentation. Meanwhile, the article's own best evidence for that decision sits two sections later and goes unused. Figure 8's alternative text shows Redis's sampled LRU within 0.4–1.7 points of exact LRU at every size, and LRU only 0.5–4 points above random. That is the measurement a practitioner needs: on skewed traffic, more samples cannot buy much hit ratio.
*Fix:*
- Cut the measured precision table to one sentence ("in a deliberately hard test, 84% of the keys Redis evicted at the default setting were ones an exact LRU would also have evicted, and 92% at 10").
- State in one sentence that Figure 6's readout and the formula measure the oldest tenth.
- End the section, or the closing advice, on the hit-ratio result from Figure 8: "on the skewed workload measured below, Redis's sampled LRU came within two points of an exact LRU at every cache size, so raising `maxmemory-samples` rarely buys hits".

## Suggested

### Teaching and structure

**S1. Move the "clock that ticks once a second" subsection after Figure 8.**
It cites "the measurements of the next section" (17.8% against 19.5%) before the reader has seen that section or its figure. It reads naturally as a short paragraph after the three findings under Figure 8. There it explains the small-cache gap that the reader has just seen.

**S2. Isolate what the eviction pool adds in Figure 6, or drop the pre-pool formula.**
The prose derives the no-pool success rate. The figure then runs sampling plus the pool, so the reader cannot see what the pool contributes, which goes against the brief's "one variable" rule. Two options:
- Add a "Pool of 16: on / off" choice. This is cheap in `sampling-model.mjs`, and the reader then watches the pool lift the readout above the formula.
- Keep the figure as it is and cut "Before the pool existed …" and the formula to one sentence.

**S3. Show the probability step in the stale-share derivation.**
"…has probability 1 − e^(−λa)" is asserted. A reader who has never met a Poisson process will not know where the exponential comes from. One clause would do: "changes arriving at random and independently (a Poisson process), the chance of none in *a* seconds is e^(−λa)".

**S4. Expand LRU and LFU at first use as abbreviations.**
The opening writes the phrases in quotes. The acronyms first appear unexpanded in `allkeys-lru` and in "Choosing between LRU and LFU". Expand at the policy table's first rows: "least recently used (LRU)", "least frequently used (LFU)".

**S5. Use searchable headings.**
The brief asks for established terms.
- "Counting accesses in eight bits" → "Approximated LFU: a logarithmic counter with decay".
- "Keys cached together expire together" → "Synchronised expiry and TTL jitter".

The figure titles can keep the plainer phrasing.

**S6. Figure 3's "Keys in memory" readout is coloured as live keys but counts live and expired keys together.**
With the cycle off it shows a red 264, beside a red chart line of about 30 and a legend that says red means "TTL not reached". Either relabel it "Keys in memory (live + expired)" in `neutral`, or show "Live keys" in red and keep "Expired but still held" separate. Also, one filled tan square (`is-flash`, a key just deleted) appears in the grid with no legend entry. Add it to the legend or drop it.

**S7. Figure 7 joins five measured points with a dotted line, which reads as measurement between them.**
Between 100,000 and 1,000,000 accesses, the straight join cuts well below the expected curve. A reader sees a gap between theory and measurement that does not exist. Draw five point markers instead. The writer reported this as a toolkit gap; a local marker overlay can be built the way `chartBand` was. In Figure 8, "dotted" means calculated, while in Figure 7 it means measured. Pick one encoding for "measured" across the article.

**S8. In Figure 9, the two policies are told apart only by dash, and the batch band uses the write colour.**
Both lines and both readouts are `hit` green. The band uses `write`-tint. A reader at a glance cannot tell which readout belongs to which line. Use `neutral` with a dash for LRU and `hit` for LFU, or label each line at its right-hand end. Put the band in a neutral grey.

**S9. Figure 6 on a phone drops the pool's idle times.**
At 375 px the pool collapses to a strip of 16 unlabelled grey squares (`use/light-375-f6-s5.png`), so the reader loses "best candidate first" and the numbers that explain why the evicted key was not one of the outlined ones. Wrap the pool to two rows of eight with the seconds shown. The readout's `redis` red is also arbitrary for "evictions from the oldest tenth"; use `neutral`.

**S10. Transpose the samples table for phones.**
Its eight columns scroll sideways by about 100 px at 375 px. If R5 cuts it to a sentence, this goes away.

### Depth: where the length buys understanding and where it does not

The writer's 6,000 words are spent unevenly.

**Length that earns its place:**
- The TTL derivation and Figures 1–2: the article's central decision.
- The expired-but-held measurement: a number the reader would not otherwise believe.
- The synchronised-expiry latency measurement: it makes jitter a Redis concern as well as a database one.
- The volatile/allkeys contrast with the ElastiCache default: the most consequential practical point in the article.
- The LFU counter derivation: it explains what `lfu-log-factor` is for.
- The scan-pollution figure.

**Length that does not change a decision.** Cutting these costs nothing and would bring the article to about 5,300 words:

**S11. Opening paragraph 3 (about 70 words, one sentence).** It is a list of outcomes that the first figure and the section headings already promise. Cut it to one sentence, as the writer also suggests: "By the end you can choose a TTL, a memory limit and an eviction policy, and tell from Redis's counters which kind of removal is costing you hits."

**S12. The latency-page paragraph (about 40 words).** "The Redis documentation's latency page describes an older version of this cycle…" is a note about a source. Move it into the Sources entry, where the same point is already half made.

**S13. Split the active-cycle paragraph and correct one condition.**
That paragraph packs seven facts into one block: `hz`, 20 keys, each database, 10%, the 25% CPU cap, fast cycles and `active-expire-effort`. Split it in two: the rule, then the tuning.

In `expire.c` the fast cycle runs when the previous cycle hit its time limit **or** when the stale estimate is above the acceptable level. The text gives only the first condition. Either add "or when the estimated share of expired keys is still high", or drop the fast-cycle sentence, since no decision depends on it.

**S14. The TTL command table.**
Article 2 already teaches plain `SET`, `KEEPTTL` and `XX` with measurements. Keep these rows: the `EXPIRE` family with `NX`/`GT`, `TTL` with -1 and -2, plain `SET`, `KEEPTTL`, and `GETEX`. Drop `RENAME`, `SET NX` on an existing key, and "`INCR`, `APPEND` keep it". Those are reference material, and a practitioner looks them up when needed.

**S15. The second scan measurement (about 90 words).**
"In a harsher test, where 1,000 popular keys were read 50 times each…" repeats the first measurement's conclusion under more contrived conditions. Its one new idea, the one-second clock, belongs in S1's paragraph if anywhere. Cut it, as the writer offers.

**S16. The `INFO` table.**
Article 11 owns monitoring and alerts. Keep `expired_keys`, `evicted_keys`, `keys=/expires=` and `errorstat_OOM`, which are the ones tied to this article's failure modes. Drop the hits/misses and memory rows, which the introduction and article 11 cover. Then add the field below, which this article is uniquely placed to explain.

**What a practitioner still lacks.** Each of these is a sentence or two:

**S17. `expired_time_cap_reached_count` and `expire_cycle_cpu_milliseconds`.**
These are the counters that show the active cycle falling behind, which is the exact condition the "how Redis expires keys" section describes. Research group B recorded them in the synchronised-expiry runs (`expired_time_cap_reached_count:436`). One row in the `INFO` table, linked back to the 25% cap, tells the reader how to spot the problem on a live server.

**S18. Big values are freed on the main thread when they expire or are evicted.**
The article measures the cost of many small expiries but says nothing about one large one. Redis 8.0–8.10 default `lazyfree-lazy-expire` and `lazyfree-lazy-eviction` to `no` (research group D, 7.C5), so evicting or expiring a big hash or set blocks the server. Article 7 already teaches this with a table. One sentence after the oversized-value paragraph, linking to it with `<ArticleRef slug="how-redis-works">`, closes the gap without teaching it twice.

**S19. Managed-service defaults.**
The introduction's sources say Azure Cache for Redis also defaults to `volatile-lru`. Naming it beside ElastiCache ("ElastiCache and Azure Cache for Redis") makes "managed services often default to `volatile-lru`" a pattern rather than one vendor's quirk.

**Overlap check.** The article stays inside its coverage map:
- Stampedes: one paragraph and a link.
- Replicas: one bullet and a link.
- Hash-field expiry: one sentence. The claim about volatile policies matches research B5.4.
- Sizing and alerts: deferred to article 11.

The command table (S14) and the `INFO` table (S16) are the only places where it leans into another article's ground.

### Writing

The voice is mostly plain, first-person and well paced. These sentences fail the house style:

- "Nothing a client can see has changed: every read still gets the right answer. **Only the memory tells.**" The last three words are an aphorism. Use "Only the memory figures show it."
- "That is still five times the long-run average …, but **it is a slope rather than a cliff**." This is a flourish standing in for the statement the figure already makes. Use "but it arrives over two minutes instead of in one instant."
- "Here we assume nothing does, **which is also what happens whenever such a delete is lost**;" This is hard to parse. Use "Here we assume nothing deletes it. That is also the situation whenever such a delete goes missing."
- "…and so far nothing chose it except habit." This is acceptable as the opening's one flourish. Keep it, but do not add more.
- The opening's third paragraph is a single 70-word sentence (see S11).
- "Redis lets you switch the cycle off with a debugging command, `DEBUG SET-ACTIVE-EXPIRE 0`, which is how I measured the real effect." Fine. Add "(do not use it in production)", because a newcomer may try it.

Terms are otherwise defined at first use, including TTL, passive and active expiry, eviction policy, eviction pool, Morris counter and scan pollution. British spelling is consistent.

## Figures as artefacts

- **Figure 1** is legible in both themes and at 375 px, and its lanes are an excellent picture of fills, hits and stale hits. At TTL 30 s on a phone, the read dots overlap into a band, which is acceptable. The readout problem is R2.
- **Figure 2** is the clearest figure in the article. One control and two readouts make the point instantly. Optional: draw a marker on the hit curve at the "TTL for 90% hits" point.
- **Figure 3** works and makes its point. See S6 for the readout colour and the unexplained square.
- **Figure 4**: see R4 for the readout and the ticks. Otherwise the waves widening each cycle come through very clearly.
- **Figure 5** shows the volatile-lru starvation well: at 70 s the memory is all keys without a TTL and refusals have started. See R3 for the glyph.
- **Figure 6**: the "stronger shade" wording works in both themes. See S2 and S9.
- **Figure 7**: see S7.
- **Figure 8**: a clean static chart. Its caption is honest about the oracle being calculated and the uneven steps. The first step is twofold (0.5% to 1%), not "roughly threefold", so say "two- to threefold".
- **Figure 9** gives a clear result that matches its text alternative (LRU 41% → 29% → 41%; LFU 49% → 48%). See S8.

Every figure has a number, a title, a caption saying whether it is a model or a measurement, and a text alternative that gives the result in numbers. The text alternatives are good, in places better than the readouts.

## Beside the references

The first three sections would sit comfortably beside Load Balancing. They start from a command the reader has typed, ask a plain question, derive a short formula, and hand the reader a figure with one control and a sentence saying what to notice. Figure 2, where the stale line does not move as the read rate changes, is the kind of earned surprise the brief asks for.

From "When memory runs out" onwards, the rhythm changes. Each idea now gets a figure, then a measurement paragraph, then often a table, then a second measurement. The figures still teach, but the prose around them is doing the job of an evidence file. Both reference essays let one demonstration land and move on, and keep the bench notes out of the reader's path.

**Single biggest gap:** momentum in the second half. Make R5 and S11–S16 work together: about 600–800 words of measurement narration and reference tables move to the evidence file or Sources, and each remaining measurement is tied to the decision it supports. The article would then hold the reader's attention through to the end, where it currently relies on their persistence.
