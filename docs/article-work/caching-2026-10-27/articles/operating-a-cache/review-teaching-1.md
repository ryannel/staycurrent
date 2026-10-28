# Teaching review, round 1: Operating a cache: monitoring, capacity and failure

Reviewer: independent editor, fresh to this article. Date: 28 October 2026.

## How I reviewed it

- I read the brief, the plan entries for articles 9 to 12 and the map changes. Then I reread the full text of Gears and Load Balancing.
- I used these reference demonstrations in a browser:
  - Gears: three sliders, including the disc-ratio and traced-arc figures.
  - Load Balancing: three simulations, the single-server sim, the 3 rps sim and the shuffle-power sim. I played them and moved their controls.
- I read the rendered draft at `http://localhost:4461/learn/databases/caching/operating-a-cache/` (`CACHING_DRAFT_PREVIEW=1`) from top to bottom.
- I used every figure through Playwright:
  - Figure 1: every slider stop.
  - Figures 2 and 3: every option. I reset each, then stepped and skipped to 10, 20, 40, 45, 60, 100 and 150 s, and also played them live.
  - Figure 4: all four incidents.
  - Figure 5: all 15 combinations of size and reserve.
- I checked under reduced motion. Both live figures load paused at 0.0 s.
- I opened the text alternatives.
- No page reloaded during the session, and no page errors appeared.
- Screenshots in light and dark themes at 1280 px and 375 px are in `review-screens/`.
- I checked the SRE book quotations and the Bronson et al. passages against the sources. All four SRE quotations are verbatim. The paper's look-aside example and its "false economy" passage on reclaiming database capacity say what the article says. Figure 1's numbers (300 QPS database, 90% hit ratio, 3,000 QPS) are the paper's own example.
- I recomputed every number quoted in the prose against the figures. Each matches, with one exception: Figure 1's chart, which is wrong (R1).

## Verdict

**Publishable after required fixes.** There are 7 required findings and 13 suggested.

The article is well aimed. The latency/capacity framing, the outage simulation and the measured INFO recordings are strong. A practitioner would learn real things here: a cache that hangs is harder to survive than a dead one, a backlog keeps pages failing after the cache is back, windowed rates matter, and an ACL key pattern does not stop `FLUSHALL`.

Two things block publication:

- Figure 1, the article's foundation, draws the wrong picture.
- The explanatory sections run about one figure per 700 to 950 words, and their two most consequential decisions are asserted rather than shown: how big the database limit should be, and where memory goes outside `maxmemory`.

## Figure density

The caller asked for this judgement directly. Words of prose (excluding figure markup) and figures per section:

| Section | Words | Figures |
| --- | --- | --- |
| Opening | 270 | 0 |
| Latency cache or capacity cache | 684 | 1 |
| Finding out before an outage does | 344 | 0 |
| While the cache is down (lede, fail fast, limit, refused) | 1,111 | 1 |
| Bringing an empty cache into service | 952 | 1 |
| Is the cache healthy? (hit ratio, alerts) | 1,187 | 1 (plus a table) |
| How big it should be | 820 | 1 |
| Who can reach it | 533 | 0 |
| Running it yourself, or not | 573 | 0 |

The brief expects a figure every few hundred words in the explanatory parts. Reference material is different: security, managed services and the alert table are lists to consult, and tables suit them. I would not add figures there.

The density gap is in the five explanatory sections. Four places assert a mechanism that the reader would understand faster by seeing it. In order of value:

1. **Sizing the database limit** (`#limit`, after Figure 2). The prose says "Too low and the database idles while requests are refused; too high and admitted queries start to miss their deadline again." That is the decision an operator actually has to make, and nothing shows it. **Required**, see R6.
2. **Memory that `maxmemory` does not count** (`#capacity`, the paragraph beginning "The second is where most sizing goes wrong"). This is a 110-word sentence listing fragmentation, client buffers, replica and AOF buffers, and fork copy-on-write. A stacked bar of one node's memory would replace most of that sentence and teach it better. It could be the first step of Figure 5, with the reserve choice splitting the bar. **Required**, see R6.
3. **Circuit breaker states** (`#fail-fast`). Closed, open and half-open, the single trial call, and the reconnect storm the breaker prevents when Redis restarts and is still loading. This is a natural stepped figure (Play, Back, Next). Suggested, S1.
4. **Dead versus hung Redis** (`#testing`). The measurement is the best fact in the section (0.9 ms refusal; 50 ms with a timeout; the full 3 s without one), but it exists only in prose. A small timeline of three requests would make it stick. Suggested, S2.

**Less prose** works as a partner to the new figures, not as a substitute for them. These cuts lose nothing:

- **The `FLUSHALL` cost paragraph (`#warming`, "If you must flush…").** About 110 words of Redis internals: the 7.4 background free, `MULTI` behaviour and Valkey. Lazy freeing belongs to How Redis works. Keep two sentences: a plain `FLUSHALL` on 7.4+ blocks only its caller; inside `MULTI` it blocks everyone; prefer `FLUSHALL ASYNC`. Link the rest.
- **Figure 1's follow-up paragraphs.** The three paragraphs after the figure, about 530 words, restate the ranges several times. Once the chart is correct the reader sees the ranges, and the "Notice also…" paragraph can lose its middle.
- **The Valkey `lazyfree` defaults.** They appear in both the warming section and the services section. Say it once, in the services section.

## Required findings

### R1. Figure 1 draws both load lines with the wrong slope (Figures as artefacts, Teaching)

`capacity-model.mjs` `loadLines` returns two-point lines, (0, 0) to (6000, 6000) for the empty cache. The shared `lineChart` clamps each point's y to the domain top (`clampY` in `chart.mjs`), so the far end is drawn at (6000, 1200). That changes the slope; nothing clips the line. As drawn:

- **The empty-cache line has slope 0.2 at every hit ratio.** It crosses the 300 capacity line at 1,500 reads a second, not at 300. At the shop's marker (1,000 reads a second) it shows an empty-cache load of about 200, below capacity. The figure therefore says the shop survives an empty cache, while its own readout says "Survives an empty cache up to 300 a second", and the prose and text alternative say it would be overloaded more than three times over. (Screenshots: `review-screens/light-desktop-01.png`, and at 99% in the scratch captures.)
- **At 50% and 80% the warm line is also clamped.** At 50% it lies exactly on top of the empty-cache line, so the two appear identical (both slope 0.2).

The model tests pass because they test the model, not the rendered path.

**Fix.** Fix it locally; do not edit the toolkit. Add the point where each line reaches the y-domain top, or sample the line densely, so clamping only flattens it beyond the plot. For example: `cold: [[0,0],[1200,1200],[6000,1200]]`, and for warm the point at `1200/(1−h)` when that is below 6000.

Then check, at every stop, that the dashed line crosses capacity at 300 and the solid line at C ÷ (1 − h). Add a test on the generated `d` attribute, or on the point list after clamping. Report the clamping behaviour as a toolkit gap: it will mislead any chart whose lines leave the domain.

### R2. Figure 3's chart shows the database above its capacity at the moment the limit should hold it there (Figures, Teaching)

With "all at once", the first point after the switch is about 355 queries a second, above the dashed capacity rule. The series counts queries *admitted* each second (`current.queries` in `warmup`). The first second admits the 60 the limit allows to queue, plus 300 served.

The prose says the database "runs at its capacity", and the point of having the limit in place throughout is that it never exceeds capacity. A reader will conclude the limit leaked.

**Fix.** Plot completed queries a second, or label the series "queries admitted" and say in the caption why the first second overshoots. Plotting completions is the honest choice.

### R3. Figure 5's value markers cut through the value text (Figures)

At every setting, in both themes and at both widths, the coloured marker line is drawn over the number it marks. Examples: "256 |MB", "126,|026, 6% of the catalogue", "428,488,| 21%" (`f5-fork-1.png`, `dark-phone-05.png`).

**Fix.** Put the value text outside the bar's filled area, or give the text a background that sits above the marker. Alternatively, stop drawing the marker over the label's span.

### R4. The limit is given two different sizing rules, and the "too low" half is not what the model shows (Depth, accuracy)

`#limit` sizes the limit by Little's law: 300 a second × 0.2 s = 60 queries "waiting or running". The next paragraph tells the reader to set "a pool size, summed over all instances, close to the database's useful concurrency". That is a different quantity, typically a small multiple of the database's cores, which is how many queries can usefully *run* at once. A practitioner following both sentences gets two numbers for one setting.

The claim "too low and the database idles" is true of a real database with parallelism. It is not true of the model, whose database is a single first-in, first-out server: any limit from 1 to 300 gives the same 30% served there.

**Fix.** State one rule with two bounds:

- the limit must be at least the database's useful concurrency, or it idles;
- it must be at most capacity × the latency budget (Little's law), or admitted queries miss their deadline.

Choose within that range. Then say that the pool size is this limit when the pool refuses rather than waits. In the caption, say that the model's database has no parallelism, so the lower bound does not appear in it. Alternatively, give the model a concurrency so that it does (see R6).

### R5. Per-shard monitoring is promised by Redis Cluster, sharding and hot keys and not delivered (Depth, coverage)

The caller asked whether this should be covered. **Yes, briefly.** Redis Cluster, sharding and hot keys ends: "more nodes to watch… What to measure, how to size the cache and how to survive its loss are the subject of Operating a cache." This article never mentions more than one node, so the reader following that link finds nothing. Leaving it out would leave a broken promise in a published neighbour.

Coverage needs about 120 to 180 words, plus an alert-table note, not a section:

- `INFO` is per node. Collect it from every primary and replica.
- Alert on the **worst node** as well as the total. A cluster-wide hit ratio, memory figure or eviction rate averages away one shard that is full and evicting, or one hot shard whose main thread is saturated, while the others are idle.
- Add `cluster_state` and `cluster_slots_fail` from `CLUSTER INFO`.
- Size memory and throughput for the largest shard, with room for a reshard and for a replica taking over.
- Point to Redis Cluster, sharding and hot keys for `CLUSTER SLOT-STATS` (Redis 8.2) and `HOTKEYS` (8.6) as the tools for finding which slot or key is responsible, rather than teaching them here.

The pointer in `cluster-and-hot-keys.astro` line 269 can stay as it is once this exists.

### R6. Add the two demonstrations the explanatory sections lack (Teaching, density)

See "Figure density" above. Concretely:

- **Limit size.** Give Figure 2 (or a small Figure 2b) a limit control with stops such as 60, 150, 300 and 600, with "no limit" as a separate stop. Prose tells the reader what to notice: up to the Little's-law value, every admitted query is answered in time; past it, the admitted queries themselves start to miss the one-second timeout, and at 600 the outage looks like "no limit" again.

  To show the lower bound as well, give the model's database a fixed parallelism (for example 8 workers, each 26.7 ms, for the same 300 a second). Then a limit of 4 visibly halves throughput. If that is too much model change, show only the upper bound and qualify the "too low" sentence, as in R4.
- **Memory outside `maxmemory`.** A stacked bar for one node: `maxmemory` (data), fragmentation, client and replica buffers, and fork copy-on-write headroom during a save. The reserve choice in Figure 5 shows which slices it is sized for. This can be the first row of Figure 5 rather than a new figure. It then replaces most of the 110-word sentence in `#capacity` (R7).

### R7. Slogans and an undecodable sentence (Writing)

The house voice rules out slogans standing in for information, particularly as ledes. These fail:

- "The node you buy is not the cache you get." This is the opening of the managed-services paragraph. Replace it with the information: "On ElastiCache, `maxmemory` is about three quarters of the node's memory, and several defaults differ from Redis's."
- "The database is busy all the time and useful none of the time." This aphorism follows a paragraph that has already said it. Delete it, or say "every query it finishes is one nobody is waiting for".
- The heading "Finding out before an outage does" is a coined phrase. Use "Testing whether you depend on the cache" or "Failure testing", which is searchable and is the plan's term.
- The sentence beginning "Outside it are fragmentation (the difference between `used_memory` and what the operating system has given the process, …" runs about 110 words, with nested parentheses and four semicolon-separated items. Split it into a short list: one line per kind of memory and why `maxmemory` ignores it. It becomes much shorter once R6's bar carries it.

## Suggested findings

**S1. Circuit breaker figure (`#fail-fast`).** A stepped figure showing calls over time as Redis goes down and comes back:

- closed: calls pass;
- open: calls fail at once with no network;
- half-open: a single trial call;
- closed again.

Show it beside a "no breaker" row where every request pays the timeout and reconnects. This makes the strongest claim in the paragraph visible: the breaker stops thousands of threads reconnecting to a Redis that is still loading.

**S2. Dead versus hung Redis (`#testing`).** A small measured timeline of three `GET`s: Redis stopped (0.9 ms), paused with a 50 ms timeout (50 ms), and paused with no practical timeout (3 s). These numbers are measured (E4), so the figure would be a replay, like Figure 4.

**S3. Figure 2 pacing.** At the default 1×, the payoff (failures continuing until 144 s) arrives after about two and a half minutes of watching. The prose says "watch the chart" but never mentions Skip ahead. Either start at 2×, or have the prose say: "after Redis returns, press Skip ahead and watch the misses keep failing until about 144 s".

**S4. Figure 2 comparison.** Each run's chart replaces the other, so the reader must remember the no-limit curve when looking at the limit curve. Keep the previous mode's line as a faint ghost, or draw both, so the 30%-against-0% result is seen side by side. Load Balancing does this with its comparison charts.

**S5. Figure 3 shows only one of the two results the prose quotes.** The prose compares the three strategies on time to an 80% hit ratio (about 30 s, 70 s and 25 s). The chart plots only database load, and the hit ratio appears only as a last-second readout. Add the new cache's hit ratio as a second small chart, or as a second series on a right-hand axis, so the trade-off between time and load is visible. A ghost of the other strategies' lines (S4) would help here too.

**S6. Figure 4: smoothing artefact.** The maxmemory recording shows evictions at about 1,000 to 1,200 a second for ten seconds. The text alternative says about 10,000 keys were evicted within two seconds; the chart's shape comes from the 10-second rate window. Add one clause to the caption or prose saying so, so the reader does not read a sustained 1,200 a second.

**S7. Figure 4: since-start below the windowed ratio.** Before every incident the since-start ratio sits about 3 points below the windowed one, because each recording started empty. Say so in the caption ("each recording starts with an empty cache"). Otherwise the reader is puzzled before the incident even happens.

**S8. Figure 1 labelling.**
- The title says "without the cache", but the figure is about both. Use "Which traffic the database survives, with and without the cache".
- The left range (below 300) has no label, while the other two do. Add "Safe either way" so the three ranges named in the prose all appear.
- Say in the caption or prose that the numbers are Bronson and colleagues' own example. That is a nice link, since the next paragraph cites them.

**S9. Define "metastable failure" where it first appears (`#dependency`).** The first use is "their paper on metastable failures", but the term is only explained six paragraphs later, at "That is the metastable failure…". One clause at first use is enough: "a failure that keeps itself going after its cause has gone".

**S10. Missing monitoring a practitioner would expect.** The plan lists replication lag, but the alert table has only `master_link_status`. Add the replica lag:
- the `lag=` field of each `slaveN` line in `INFO replication`;
- or the primary's offset minus the replica's.

Also mention `INFO latencystats` (Redis 7+: per-command p50, p99 and p99.9 on the server). A server-side latency percentile is the natural companion to the application's 99th percentile.

**S11. Gutter.** The sources say the Facebook paper is cited for "Gutter", but the text never mentions it. Either remove it from the source note, or add one sentence in `#refused`: Facebook's small standby pool takes over a failed server's keys with short TTLs, so its misses do not reach the database. It is a classic, cache-specific form of degradation.

**S12. Vocabulary consistency.** Figure 5 says "Database reads a second", while Figure 1, Figure 3 and the alert table say "queries". Use "queries" throughout.

**S13. Phone-width axes.** At 375 px, Figures 2 and 3 print nine x-axis ticks ("0 20 40 … 160"), which crowd together but stay legible. The writer reported that `tickStep` cannot vary by width. Pass a coarser `tickStep` (40) on narrow layouts locally, or report it as a toolkit gap again.

## Other observations, not findings

- **Teaching order.** Each section answers a question the previous one raised, and terms arrive when needed (Little's law, protected mode, ACLs, TLS expanded). The opening's list of questions is a good map of the article.
- **Ownership.**
  - Timeouts and retries link to Redis clients rather than being re-taught.
  - The refill trap links to Caching patterns' Figure 4.
  - Cold-start mechanics link to Cache stampedes.
  - Restart cost and Sentinel link to Redis replication, persistence and failover.

  The only drift is the `FLUSHALL` internals paragraph (see density).
- **Honesty about the model.** This is good throughout. Figures 2, 3 and 5 say they are models, Figure 4 says it is measured, and the captions name what is left out ("No retries; a dead Redis is assumed to cost no time…").
- **Figures 2 to 5 in both themes and at phone width.** Legible, with no overflow. Controls are labelled with what they change, and the text alternatives convey the results.

## Beside the references

Once R1 to R4 are fixed, Figures 2 and 4 would sit comfortably beside Load Balancing:

- **Figure 2** isolates one variable, and its result (the outage lasting long after the cache is back) is earned, then explained, exactly as the brief's point 10 asks.
- **Figure 4** is better than anything in either reference at one thing: it is real measurement, and choosing between incidents is a genuine diagnostic exercise.

The article as a whole reads more like an excellent handbook chapter than an explorable essay. In the second half the reader reads for long stretches without anything to do, and the most consequential knob, the size of the limit, is described rather than handed to them.

**The single biggest gap:** the reader never gets to move the limit and watch both ways it fails. Fix Figure 1 first, because it is wrong, and add that control next.
