# Final review, round 2: Caching patterns

Article: `src/articles/caching/caching-patterns.astro`, figures in
`src/components/caching/caching-patterns/`. Read rendered at
`http://localhost:4472/learn/databases/caching/caching-patterns/` with
`CACHING_DRAFT_PREVIEW=1`, 27 October 2026. Screens of every figure as loaded,
light and dark, 1280 px and 375 px: `final-screens/`.

## Verdict

**Publish.** I found no blocking problems. Counts: **0 blocking, 8 minor.**

This sits comfortably beside Load Balancing. It opens from a situation the
reader knows: a kettle repriced from £39 to £35 while Redis still holds £39. It
reduces four vendor terms to two questions, then answers them in order. Each
section raises the question the next one answers. The figures isolate one
variable each:

- Figure 1: what the write does to the copy.
- Figure 2: reads per write.
- Figure 3: the order of the two writes.
- Figure 4: what happens to an abandoned query.
- Figure 5: the flush interval.

The prose says what to watch in each one. The derivations are short, correct
and then checked by a figure:

- k ÷ (k + 1) for independent random reads and writes;
- the hard floor 1 − 1 ÷ k;
- r × T ÷ 2 exposure for write-behind.

The figures are honest about being models. The measured Redis behaviour is
labelled as measured.

The strongest parts are the corrected framing of k ÷ (k + 1), which is now an
expectation and not a ceiling, and Figure 4. Figure 4 separates "late answers
cached" from "late queries never run", so the reader learns the mechanism
instead of a slogan about read-through. The article then pushes back on Bronson
et al.'s "unenforceable with a look-aside cache", using HybridCache's
cancellation rule. It does this fairly and with sources.

The article is long for its figure count. It is about 6,300 words with six
figures, and the last 1,400 words (failures and choosing) are tables and prose.
That is synthesis, though, not unexplained mechanism, and it does not mislead.
It is listed as minor.

## What I did

- **Before reading:** I re-read `brief.md`, including today's revision, and the
  plan entries for articles 1–3 and 5, 6, 11, with "Map changes after research".
  I read the full text of Gears and Load Balancing. In Gears I dragged three
  sliders (the fan, the linear-velocity disc and the ratio of radii). In Load
  Balancing I played two simulations.
- **The figures:** I used every figure in Playwright, at 1280 px light and
  375 px dark. In the four simulations I chose every option and stepped through
  time. I stepped both stepped figures to the end, in both orders for Figure 3.
  In Figure 5 I used Restart Redis and moved the interval to 30 s. With reduced
  motion, all four simulations load paused.
- **Page checks:** no console errors and no horizontal overflow at 375 px. The
  two tables scroll inside their regions.
- **Interruptions:** other sessions were editing files during my run, which
  caused hot reloads. One Figure 2 reading was disturbed by a reload, and I
  re-ran it on a page that did not reload.

Readouts (seeded, so they match on every load):

| Figure | Setting | Readout | Article says |
|---|---|---|---|
| 1 | leave | stale 40% → 35% → 39% → 27% at 10/20/30/60 s; hit 89% | "a quarter to two-fifths"; ~88% |
| 1 | delete / update | hit 85% / 91%, 0 stale | ~85% / ~91% |
| 2 | k = 1, 2, 4, 19 | 49%, 66%, 78%, 95–96% (2–4 min) | 50%, 67%, 80%, 95% |
| 2 | k = 4, update | 14 of 66 cache writes unread (21%) | 1 ÷ (k + 1) = 20% |
| 4 | discarded | hit 54–58%, 102 keys, wait 62 s at 60 s | ~55%, "hundred or so keys", passes a minute |
| 4 | cached | 100% answered from 25 s | "about fifteen seconds after" |
| 4 | never run | 100% answered from 16 s | "about six seconds after" |
| 5 | 5 s interval | 23 lost on restart at 9 s | mean 20 |

I also ran the Figure 4 model directly. At 150 queries a second, cache-aside
recovers by 13 s, and with a 5 s timeout it recovers by 12 s, which confirms "half
as much database capacity again, or a five-second timeout". At 140 queries a
second it stays stuck at about 70%. Before the restart the database receives
39–42 queries a second.

**Redis 8.10.3**, port 7172, temporary directory, `--save ''`, shut down
afterwards:

- `SET … EX 300` gives `TTL` 300. A plain `SET` then gives -1, and `KEEPTTL`
  keeps 300.
- `SET … XX EX 300` on an absent key returns nil and creates nothing. On a
  present key it replaces the value with TTL 300.
- `DEL` returns 1, then 0. `GETDEL` returns 2, then nil. `PTTL` is in
  milliseconds.
- **Flush race:** `redis-benchmark -c 20 -n 200000 INCR views:x` ran against a
  single-connection flusher. With `GETDEL`, the flushed total was exactly
  200,000 in two runs. With `GET` then `DEL`, it was 100,068. This reproduces
  "about half … vanished".
- **Restart:** two `INCR`s and an `RPUSH`, then `SHUTDOWN NOSAVE` and a restart:
  `DBSIZE` 0.
- **Stopped server:** `redis-cli GET` printed "Connection refused" in 5.1 ms.
- **Unroutable host:** with `-t 2` against an unroutable address, `redis-cli`
  gave up at 4.0 s ("within a few seconds").

Primary sources checked against the article's wording:

- **Nishtala et al.:** §2, the demand-filled look-aside cache and "deletes are
  idempotent"; §3.1, get errors treated as misses with no insert.
- **Bronson et al.:** §2.2, the look-aside cache example; §3, "unenforceable
  with a look-aside cache but trivial with a read-through cache".
- **Coherence 14.1.1:** "may re-order database updates"; "handled heuristically
  or escalated"; the cache as "system-of-record (until the write-behind queue
  has been written to disk)"; the refresh-ahead factor 0.5 example.
- **Azure:** update the store before removing the cached item, because of the
  reader race.
- **AWS:** "never stale", the write penalty, missing data and cache churn.
- **Redisson:** `writeBehindDelay` defaults to 1000 ms.
- **HybridCache:** the factory's token is cancelled when all callers awaiting it
  have cancelled.
- **Spring:** `SimpleCacheErrorHandler` rethrows (used in minor 6).

All of these hold.

I skimmed the round-1 reviews and repair only after forming this judgement. All
round-1 required items are resolved in the text.

## Blocking

None.

## Minor

### 1. A back-reference to something the introduction does not show

"That TTL is easy to lose. As the introduction showed, a plain `SET` replaces
the key's expiry along with its value." The introduction, as it stands, shows
`SET … EX 60` and warns against a separate `SET` then `EXPIRE`. It never shows a
plain `SET` clearing a TTL. A reader who goes back to look will not find it.

**Fix:** drop the back-reference: "That TTL is easy to lose: a plain `SET`
replaces the key's expiry along with its value." The measured -1 that follows
already supports it.

### 2. Figure 4's database load before the restart is overstated

The prose says "the database is about half busy". The text alternative says it
"receives about 50 queries a second, half of what it can answer". The model
sends it 39–42 queries a second.

**Fix:** in the text alternative, write "about 40 queries a second, well under
half of what it can answer". In the prose, write "the database is less than half
busy". The point, that the database had headroom before the restart, survives.

### 3. "Redis sees the same commands either way" is not true of the example just named

The read-through section names Redisson's `MapLoader`, then says "Redis sees the
same commands either way: a `GET` that returns nil, then a `SET` with an
expiry." Redisson stores a map as a Redis hash and drives it with hash commands
and Lua scripts, not `GET` and `SET`.

**Fix:** "Redis sees the same work either way: a read that misses, then a write
that fills it." Or limit the claim to a loader over plain string keys, such as
Spring's Redis cache.

### 4. The Azure attribution on sensitive data uses a different reason

"If no staleness is acceptable … read that value from the database, not the
cache. Azure's guidance says the same of sensitive data." Azure says to read
security-sensitive data from the primary source, because a shared cache may
expose it. That is not about staleness. A reader could take "sensitive" to mean
"staleness-sensitive".

**Fix:** "Azure's guidance gives the same advice for security-sensitive data,
for a different reason: a shared cache can expose it." Or drop the sentence.

### 5. The article uses the local `ArticleRef`, not the shared one

`caching-patterns.astro` imports `caching-patterns/ArticleRef.astro`. That
file's own comment says it is "now superseded by shared/ArticleRef.astro". The
brief says to refer to other articles only through the shared component.

The two components behave differently. The local one renders an unpublished
article's title in `<cite>`, which is italic. The shared one renders plain text,
as the introduction and invalidation do. Once this article is published, its
references to unpublished neighbours will look different from the
introduction's.

**Fix:** import `../../components/caching/shared/ArticleRef.astro`. Other
drafts also import the local file (`expiration-and-eviction`,
`keys-and-values`), so move them over before deleting it.

### 6. The read-through cell under "Redis unreachable" answers a different question

The cell reads "Depends on the layer. If the loader is unavailable, so is the
data…". The column is about Redis being unreachable, but the sentence is about
the loader layer failing. The concrete, decision-changing fact is missing.
Spring's default `SimpleCacheErrorHandler` rethrows cache errors, so with
`@Cacheable` over Redis an unreachable Redis fails the read rather than falling
through to the method. Failing open needs a custom `CacheErrorHandler`.

**Fix:** "Depends on the layer: some treat a Redis error as a miss and call the
loader; others rethrow it (Spring's default error handler does), so the read
fails unless you configure it to fall through." The loader point can stay in
"Read-through has a price too".

### 7. Figure 4's recovery threshold is sharp; one sentence would show it

"In this model, half as much database capacity again, or a five-second timeout
instead of one, lets even the first option recover." That is true: 150 queries
a second recovers by 13 s. But 140 a second stays stuck at about 70% hit
indefinitely. That cliff is the characteristic of a metastable failure, and it
is a useful warning: a little more headroom may not help at all.

**Fix (optional):** add "and a little less does not: at 140 queries a second
the model stays stuck." A capacity control on the figure would make this
observable, but a sentence is enough here; article 11 owns capacity.

### 8. Figure density in the second half, and some repetition

The final third has no figure:

- "How each pattern fails";
- "Choosing a pattern";
- "What you can now decide".

These sections partly restate earlier text:

- the paragraph on treating errors as misses restates the introduction's
  1 ÷ (1 − h);
- "Write-through on its own has a gap after a restart" restates the table row
  above it;
- the "What happens when Redis restarts?" question restates Figure 4's three
  options.

**Fix:** trim the restatements so the tables carry the comparison. Cut the
1 ÷ (1 − h) paragraph to one sentence with a link back. Fold the write-through
restart sentence into its table cell. Reduce the restart question to a pointer
to Figure 4 and articles 6 and 11. Roughly 200–300 words can go, at no cost to
what the reader can decide.

## Rendering notes (no action needed)

- Both themes render correctly. Stale, write, miss, hit and expiry colours are
  consistent across figures and with the inline terms, and options stack full
  width at 375 px.
- At 375 px, Figure 1's event strip covers about seven seconds, and product:1's
  markers crowd together while playing. The round-1 repair deferred this
  deliberately. It stays readable, and Figure 2 teaches the one-miss-per-write
  pattern with clear spacing.
- The Astro dev toolbar overlaps some phone screenshots. It is not part of the
  page.
