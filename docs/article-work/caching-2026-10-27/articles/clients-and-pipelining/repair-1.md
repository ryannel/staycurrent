# Repair, round 1: Redis clients: round trips, pipelining and atomic operations

Files changed:
- `src/articles/caching/clients-and-pipelining.astro`
- `src/components/caching/clients-and-pipelining/`:
  - `ladder.mjs`, `ReadsFigure.astro`
  - `TailFigure.astro`, `RetryFigure.astro`, `clients.css`
  - `sequences.mjs`, `TimeoutFigure.astro`, `WatchFigure.astro`, `ConnectFigure.astro`
  - `counter-model.mjs`, `CounterFigure.astro`, `models.test.mjs`

`src/components/caching/shared/` is unchanged.

New measurements were made on Redis 8.10.3, port 7118, with redis-py 8.1.0 and go-redis v9.23.0. They are appended to `evidence/clients-and-pipelining.txt` under "Repair round 1". Screenshots are in `screens/repair1/`: 8 figures × 2 themes × 2 widths, plus `controls/` with the end state of each changed control. The model tests pass (6 of 6).

Length: about 6,980 words of prose and tables, against about 7,000 before. The repair adds the required content and still comes out slightly shorter. The added content is the retry table, the pool-exhaustion paragraph, the SET race, two code listings with their results, and the Valkey note. Retries is about 750 words, against 809 before.

## Orchestrator notes

- **Retry advice (most consequential).** I rewrote Retries around a measured table. Its rows are `INCR`, a pipeline, `MULTI`…`EXEC` and a script; its columns are redis-py 8.1 and go-redis v9.23. One prose paragraph after it explains:
  - that the library, not your choice of commands, decides what is repeated;
  - how to turn retries off: `retry=Retry(NoBackoff(), 0)` in redis-py, `MaxRetries: -1` in go-redis, where 0 means the default of 3;
  - the alternative of a second client with retries off;
  - how to make writes idempotent, with a version check or a request id.

  My go-redis runs differ from the note on one point. go-redis re-sent single commands (4 times), plain pipelines (2–3 times) and scripts (4 times), but its `TxPipelined` (`MULTI` block) ran once and returned a timeout, in all 4 runs. The table says so rather than "re-sends MULTI blocks". redis-py re-sends all four.
- **Retried SET overwrites a newer write.** Figure 5 has a third choice, "SET price 35, while B writes", a 4-lane sequence ending with the stale price. I measured it: 35 every time with default retries, 36 with retries off. The prose explains why idempotence is not enough and points to the guarded fills.
- **Pool exhaustion.** There is a new paragraph in the pool section:
  - rate × timeout = 200 connections during a stall;
  - go-redis `PoolTimeout` defaults to 6 s and running out counts as retryable;
  - redis-py's default pool fails at once; its `BlockingConnectionPool` waits up to 20 s;
  - set the wait to a few ms and treat running out as a miss.

  I also added redis-py's default pool size of 100.
- **Compare-and-set code.** Reconciled with article 5, as follows:
  - Figure 8 and the Lua script use article 5's hash layout (`version`, `value`). The script is a 5-line set-if-newer, and the text says article 5 extends it with tombstones.
  - The 8.4 section has a 12-line redis-py `set_if_newer` loop on a `version|json` string. The text says plainly that this layout differs because `IFEQ` works only on strings.
  - Both listings were run, including 8 clients writing 2,000 versions in random order. Both ended at 2,000.
  - The listing notes that redis-py marks `ifeq` as experimental and warns.
  - The text covers which to choose, and the nil-after-retry oddity.
- **cjson.** It is no longer the scripts example. One paragraph keeps the measured result and names the two corruptions: `[]` becomes `{}`, and a 17-digit id becomes a float, which I re-ran. It recommends `HINCRBY`.
- **Figure 3.** Every slow page is now marked in a right-hand "slow page" column, and its row has a stronger tint (error colour at 30%). The seed is now 8, so the first drawing shows 21 slow pages (4 in bursts), matching the text. I checked both themes and 375 px.
- **Figure 6.** Two changes:
  - "Replies nobody waited for" is now a shaded area under a solid line, a local overlay. The capacity line is thin, dashed and drawn on top, so "all capacity wasted" shows as the area filling up to the line.
  - The axis is labelled "Requests a second", and the prose says "in the model's units".
- **ArticleRef.** Figure 1's caption no longer names article 7, and the `HINCRBY` sentence uses `ArticleRef`. Figure 8's caption had a plain-text title, which I removed. A grep finds no bare titles left in the prose or the components.
- **ladder.mjs dots.** A request's end dot is scaled by the shared `CLIENT_DOT_SCALE` (0.65), imported from `shared/shapes.mjs`, so it is smaller than a reply's.
- **Valkey and managed services.** One sentence in "Which to choose": Valkey has `IFEQ` since 8.1, its own `DELIFEQ` since 9.0, `MSETEX` and `IFNE`/`DELEX` from 9.1 and 9.2, and no `DIGEST`. Managed services often lag, so the script is the fallback. Versions are from the valkey.io command pages and are cited in Sources.
- **Atomic half: lists and figures.**
  - The lists for single commands, transactions, scripts and 8.4 options are now prose.
  - Figure 7 gains "a Lua script" (teaching S2).
  - Figure 8 now shows the round trips, `UNWATCH` and the field names.

## Teaching review

| Finding | Action |
|---|---|
| R1 ArticleRef | Fixed (see above). |
| R2 compare-and-set example | Fixed: two runnable listings, layout reconciled with Figure 8 and article 5. |
| R3 8.4 availability | Fixed: Valkey versions, managed services, script as fallback; table "check the server version". |
| R4 Figure 3 slow rows | Fixed. |
| R5 Figure 6 overplotting and axis | Fixed. |
| R6 `MULTI` wording | Fixed: "isolation … never between", and that a failing command leaves the others applied. |
| S1 length | Applied: Retries list and SRE arithmetic cut; Facebook paragraph and its source dropped; interleaving detail cut; one execution number kept; FIN/RST reduced to a clause; Figure 4's caption no longer repeats the timings; Serialisation section folded into "What one request costs". |
| S2 script in Figure 7 | Applied. |
| S3 bridge the halves | Applied: "Lost updates" now opens from Figure 5's double count. |
| S4 practitioner gaps | Applied: why a client closes after a timeout; pool exhaustion; redis-py `pipeline()` defaults to a transaction; concurrent connections as an alternative (one clause). Automatic pipelining skipped: it changes no decision this article asks for, and length was tight. |
| S5 Figure 2 fixed axis | Skipped. A shared scale would shrink the pipeline to a sliver and hide its mechanism. The bars below already give the 22× contrast on one scale. |
| S6 Figure 1 labels | Fixed: labels are drawn last, so their halo covers crossing lines. The end label stays inside the plot, with a shorter label below 480 px. Checked at 375 px. |
| S7 model units | Fixed. |
| S8 bursts count | Fixed: seed 8 shows 4; the prose says "a few in 100". |
| S9 Figure 8 | Fixed: fields `version`/`value`; `UNWATCH` arrow and reply; WATCH and HGET shown as one round trip. |
| S10 voice | All applied: the coined "fewer pages, harder" phrase (both places), the aphorism, the flourish, the "second benefit" sentence, the medians, the opening split into three sentences, and the bare instruction given its reason. |
| S11 timeout figure | Skipped: optional, and it would add length; the section works without it. |
| S12 table lede | Added. |
| S13 article 5 caveat | Already present in article 5 ("keeping the version inside the value"); no change needed. |
| S14 lock retry | Fixed: the retry is refused, and the client waits for its own lock to expire. |

## Technical review

| Finding | Action |
|---|---|
| R1 retries re-send scripts, transactions, pipelines | Fixed, with my own measurement (see above). The table rows carry the warning; the scripts section says a repeat runs again. |
| R2 retried SET overwrites newer write | Fixed: Figure 5's third choice and its prose; "mostly idempotent, which is lucky" removed. The `IFEQ` nil-after-retry case is noted. |
| R3 pool exhaustion | Fixed; added to the closing list. |
| R4 cjson | Fixed. `JSON.NUMINCRBY` not mentioned: this build has no JSON type to verify against. |
| S1 WATCH round trips | Fixed: 2 uncontested and 4 contested (measured), table "2". The `IFEQ` loop is framed by "no state on the connection", not by fewer round trips. |
| S2 go-redis timings | Applied: dials 5 times; 1.7 s to fail. |
| S3 Lettuce reconnect | Skipped: the reviewer asked for Lettuce's documentation to be checked first, and the table already shows that defaults differ. |
| S4 socket buffer | Fixed in the prose and in Figure 5's steps and text; it now explains the reset result. |
| S5 Figure 3 text and render | Fixed (seed). |
| S6 `MULTI` wording | Fixed. The AOF crash nuance is skipped: it belongs to article 9. |
| S7 `NOSCRIPT` in a pipeline | Applied. |
| S8 `lua-time-limit` | Applied. |
| S9 `DEL`/`EXPIRE` replies | Applied, in a parenthesis. |
| S10 URLs | Updated the four redis.io links; added Jedis and Lettuce source links. All checked with curl. |
| S11 metastable source | Added Bronson et al., HotOS 2021, and named it in the prose. |
| S12 redis-py pool default | Applied. |

## Conflicts and choices

- **Length against new content.** The teaching review asked for 600–800 fewer words; the technical review and the notes required new material. I cut hard elsewhere so that the total stayed level (about −20 words) and Retries got shorter. I did not cut further: the remaining candidates are the measured tables and the `WATCH`/script details, which the teaching reviewer said earn their place.
- The "set only if newer" logic appears in two layouts. This is deliberate and stated in the text: hash plus script (the same as article 5), or string plus `IFEQ` loop (8.4+).

## Still open

- Figure 5 at 375 px: the note box "timeout: gives up" partly covers step number 4 in the left margin. This comes from the shared sequence layout; the earlier choices had the same overlap. It is cosmetic.
- I did not run a full `pnpm build`, because other agents were using the dev server and the disk. The page rendered in the dev preview with no page errors.
