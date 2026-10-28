# Teaching review 1: Redis clients: round trips, pipelining and atomic operations

Reviewer: independent editor, round 1. I read the brief, both reference essays in
full, and the plan entries for articles 7–9. On Load Balancing I played three
simulations and dragged their speed sliders. On Gears I dragged three sliders:
the disc ratio, the wrench and the torque. I then read the rendered article at
`http://localhost:4458/learn/databases/caching/clients-and-pipelining/` and used
every figure:

- Figures 1 and 2: played both, dragged the slider, and played each method in
  Figure 2.
- Figure 3: tried 1, 24 and 100 round trips, independent and in bursts.
- Figures 4, 5 and 8: stepped every choice to the end.
- Figures 6 and 7: stepped each policy or method to 60 s.

I checked reduced motion, which does not autoplay. Screenshots are in
`review-screens/`: 8 figures in light and dark, at 1280 px and 375 px. No
console errors appeared and nothing overflowed at 375 px.

I checked the library defaults against go-redis v9.23.0 `options.go`, and they
match the article. I spot-checked the evidence file for the 8.4 commands, the
pipeline interleaving, FIN against RST, and redis-py. I checked Valkey's command
pages for the 8.4-style commands.

## Verdict

**Publishable after required fixes.** It has 6 required and 14 suggested
findings.

The first half (sections 1–7, about round trips, pipelining, the tail,
connections, timeouts and retries) is close to the reference standard. Each
figure isolates one variable, the prose says what to notice, and the
derivations are shown.

The second half, on atomic operations, is sound but thinner as teaching:

- It has two figures for about 2,000 words.
- It relies on bulleted rules.
- Its worked example, compare-and-set for versioned values, has no code.
- That example is inconsistent with the value layout used in Figure 8 and in
  article 5.

## Required

**R1. Two references to other articles do not use `ArticleRef`.**
- Line 202, in prose: "which is why Cache keys and cached values recommended
  hashes for values with counters in them". **Fix:** wrap the title in
  `<ArticleRef slug="keys-and-values">`.
- Figure 1's caption (`ReadsFigure.astro`, line 12): "(the sizes article 7
  measured on a laptop)". This is a bare article number, which a reader cannot
  follow, inside a string prop that cannot hold the component. **Fix:** change
  it to "the sizes measured on a laptop in How Redis works" and add the link to
  the prose just before Figure 1. Alternatively, drop the attribution from the
  caption, since line 33 already credits the article through `ArticleRef`.

Every other reference I found (lines 33, 74, 114, 124, 150, 187, 197, 224, 253,
271, 293 and 310) uses `ArticleRef` with a valid slug.

**R2. The compare-and-set worked example is incomplete and inconsistent.**

The coverage map gives this article "a compare-and-set for versioned cache
values as the worked example, used by article 5". The reader gets a set of
mechanisms and a sequence figure, but no example they can copy:

- **There is no code for any conditional write.** Figure 8 shows the `WATCH`
  sequence as arrows. The `IFEQ` read-compare-write loop gets one sentence
  (line 273). The only script is the JSON sale counter. Article 5 describes its
  `IFEQ` route in prose only (invalidation.astro line 178), so neither article
  shows it as code.
- **The layouts do not match.** Figure 8 stores the version in a hash (`HGET v`,
  `HSET v 9`), and so does article 5's version script (`HGET … "version"`).
  Line 273 then says the `IFEQ` loop works "with the version stored in the
  string", and line 273 also says `IFEQ` on a hash returns `WRONGTYPE`. A reader
  who follows Figure 8's layout and then switches to `IFEQ` will hit
  `WRONGTYPE`. The article does not say that this route needs a different
  layout, such as `10|{json}`.
- **There is no equivalent for older versions.** Article 5 says the pre-8.4
  conditional fill "is a short Lua script" and defers to this article for
  scripts. This article never shows a compare-and-set script. Article 6 shows
  only compare-and-delete.

**Fix.** In "Compare-and-set commands in Redis 8.4", add one short code block
for "set only if newer", in about 12–15 lines:

1. The `IFEQ` loop in Python, with the version prefixed in the string value,
   which says that this differs from Figure 8's hash.
2. The same check as a five-line Lua script, for Redis before 8.4 or for
   services without `IFEQ`.

Then say in one sentence which to choose. With that block, a reader of this
article alone can write a correct conditional write on any version.

**R3. The 8.4 commands are recommended without saying where they exist.**

The decision table (line 284) and the closing list (line 307) put the 8.4
options second in preference, after single commands. Many readers will run a
managed service or Valkey, where the names and versions differ:

| Command | Valkey |
|---|---|
| `SET … IFEQ` | 8.1 |
| `DELIFEQ` | 9.0 |
| `MSETEX` | 9.1 |
| `DELEX` | 9.2 |
| `DIGEST` | No page on valkey.io |

These versions come from the valkey.io command pages. Code written from this
article fails there, and the brief asks for such differences when they matter
to a decision.

**Fix.** Add one sentence after the list on line 265: these are Redis 8.4+
commands; Valkey has added some of them under its own versions (give those
versions), and managed services lag behind, so check the server version first
and keep the script as a fallback. The fallback script is the one from R2.

**R4. Figure 3: the slow pages the prose points to cannot be seen.**

Line 128 says "Start at 24 round trips per page. About a fifth of the rows are
shaded". In both themes the shading of a slow row is almost the same as an
unshaded row (see `review-screens/light-desktop-03.png`, and the zoom of it at
24 round trips). What the reader actually sees is about 24 magenta cells in a
large grid. That reads as "1% is slow", which is the opposite of the lesson,
1% of cells against 21% of pages. The readouts carry the result, but the
picture does not.

**Fix.** Mark every slow page across its whole row:

- give the row a strong tint, using the error colour at about 25–30%, or
- add a marker column at the row's right-hand end, labelled "slow page".

Either way, 21 marked rows should stand out against 24 marked cells. Check the
result in both themes at 375 px, where the rows are 3–4 px tall.

**R5. Figure 6: the main result is hidden by overplotting, and the axis label
is wrong.**

- The prose says that with 3 retries "every reply is wasted"
  (`review-screens/` and the 60 s state in `retries up to 3 times`). After
  15 s, the magenta dashed "Replies nobody waited for" line lies exactly on the
  red dash-dot "Redis capacity" line at 100. The two are close in hue and dash,
  so the reader sees one line and cannot tell that all of Redis's capacity is
  going to waste. The same happens during the slowdown with no retries.
- The y-axis label reads "A second".

**Fix.**
- Draw "replies nobody waited for" as a filled area, or as a solid line drawn
  over a thin capacity line, so that "all capacity wasted" is visible.
- Relabel the axis "Requests a second".

**R6. A sentence on `MULTI` reads as if it contradicts "no rollback".**

Line 220: "What MULTI gives you is that other clients see all of the writes or
none of them, never half." It comes directly after the bullet "There is no
rollback". A newcomer will read "all or none" as atomic commit and lose the
distinction that this section has just drawn.

**Fix:** "What `MULTI` gives you is isolation: no other client's command runs
in the middle, so others see the state before `EXEC` or after it, never
between. If one command fails, the others still apply."

## Suggested

**S1. Length: about 600–800 words could go without losing understanding.**

The article is about 6,700 words of prose without the Sources section.

Where the length pays for itself:
- the measured tables;
- Figure 5 together with the measurement that redis-py silently counted a
  timed-out `INCR` twice, which is the article's most valuable practitioner
  fact;
- the `WATCH` details;
- `BUSY` and `UNKILLABLE`;
- functions vanishing on restart;
- the 8.4 semantics.

Where it does not:
- **Retries (809 words, the longest section).** Lines 172–173 make the same
  point twice: retries stretch a failing call to seconds. Merge them into one
  bullet. The SRE book's worked arithmetic (line 179, "almost three times …
  about 1.1 times") repeats what Figure 6 then shows. Keep the citation and
  cut the arithmetic.
- **The Facebook memcache paragraph (line 112, about 70 words).** It is "for a
  sense of scale" and changes no decision. Cut it to one sentence, or drop it.
- **Pipeline interleaving (line 82).** "saw 82 different values in between,
  rising in steps of about 1,780" is detail the reader cannot use. "saw the
  counter at dozens of values in between" is enough.
- **Request cost (line 33).** It gives two numbers for a `GET`'s execution,
  "about 0.2 µs" (from article 7) and "0.15 µs" (measured here). Keep one.
- **Timeouts (line 160).** The FIN/RST experiment can be one clause, for
  example "even closing the connection at once did not stop it".
- **Figure 4's caption** repeats the 0.10, 0.25 and 0.35 ms figures from
  line 140. Keep them in one place.
- **Serialisation (lines 291–293).** It sits between the decision table and
  the conclusion, after the atomicity thread has closed. Fold its two useful
  sentences into "What one request costs", where the client's cost e is
  introduced, and remove the section.

**S2. Give the atomic-operations half a demonstration for scripts.**

Lines 189–273 have Figures 7 and 8 for about 2,000 words, and `MULTI`, scripts,
functions and `IFEQ` have no figure. The cheapest strong addition is a fourth
choice in Figure 7, "Lua script". The prose already measures it (line 246:
0.10 s, the same as `INCR`, against 1.81 s for `WATCH`). The reader would then
see one round trip and no refusals for an arbitrary read-decide-write, which is
the case for scripts. One variable still changes: the method.

**S3. Join the two halves.**

Line 191, "The rest of this article is about a different problem", announces a
seam. Bridge it from idempotence instead. The reader has just learnt that
retried increments double-count. Two clients each doing a read and a write is
the same kind of problem: separate commands whose effects interleave. One
sentence makes the article build instead of restarting.

**S4. Practitioner gaps worth one or two sentences each.**
- **Why a client discards a connection after a timeout.** The late reply is
  still on its way, and a pooled connection reused at once would hand that
  reply to the next request. Figure 5 shows the close but never says why.
- **Pool exhaustion under a slow Redis.** When every connection is busy, pools
  either wait (go-redis `PoolTimeout`) or open more connections (redis-py's
  default pool has no practical cap). Under a stall, this is how pools reach
  `maxclients`. It joins the pool section to the timeout section.
- **redis-py's `pipeline()` wraps commands in `MULTI`/`EXEC` by default**
  (`transaction=True`). Lines 80–86 say "a pipeline does not make its commands
  a unit". That is true of the protocol, but a redis-py reader's default
  pipeline is a transaction. Say so, and name `transaction=False`.
- **Automatic pipelining** in multiplexed clients (node-redis, ioredis with
  `enableAutoPipelining`, Lettuce): one sentence at line 142.
- **Concurrency as an alternative.** "Why not send the 24 `GET`s concurrently
  on 24 pooled connections?" A reader will ask this. One sentence: it saves
  the time but costs 24 connections and 24 times the socket work.

**S5. Figure 2 rescales its time axis for each method.**

The caption says so ("The diagram's time axis fits the method chosen"), but it
means the ladder never shows the contrast. One GET at a time fills the axis,
and so does a pipeline. Only the bars below show the 22× difference. Consider
a fixed axis, or a "same scale" toggle, so that the pipeline appears as the
sliver it is beside 24 rungs.

**S6. Figure 1 labels.**
- The "GET" and "value" labels sit on the first rungs and collide with them
  ("vaLue").
- At 375 px, the end label is clipped: "page has every value: 12.3"
  (`ctl/ph-reads`, dark phone).

Move the labels clear of the rungs, and right-align the end label inside the
plot.

**S7. Figure 6 prose and model units.**

Line 181 says "Redis normally serves 100 requests a second", just after the
reader has learnt that a `GET` takes under a microsecond. Only the caption says
that the units are made up. Add "in the model's units" to the sentence, or
scale the labels, for example to thousands.

**S8. Figure 3 in bursts.**

The prose says "about 4 in 100 at 24 round trips". The default draw shows
"2 of 100". Say "a few in 100", or fix the seed so that the default draw
matches.

**S9. Figure 8 consistency.**
- The caption names the hash fields `v` and `data`, but article 5 uses
  `version` and `value`. Use the same names.
- The last step says "A sends UNWATCH", but no arrow is drawn for it.

**S10. Writing: sentences that fail the house voice.**
- "correlated slowness hits fewer pages, harder" (line 130, and repeated at
  line 303). This is a compressed coined phrase. Write it plainly: "when slow
  round trips come together, fewer pages are slow, but each of them is slower".
- "because the work it is doing creates the work it cannot finish" (line 187).
  This is an aphorism standing in for the mechanism. Write it plainly: "because
  every request now times out and is retried, so the queue never gets shorter
  than the timeout".
- "and it reads as what it is: 'these keys, please'" (line 76). A flourish:
  cut it.
- "That is a second benefit; the first, for the page, is the round trips."
  (line 74). Awkward: "This matters to the server; for the page, what matters
  is the round trips saved."
- "These are medians of 300 and 100 runs" (line 72). It does not say which
  number goes with which column. Name the columns.
- The opening's third paragraph (line 18) is one sentence of about 75 words
  listing seven outcomes. Split it into two or three sentences.
- "Read your library's retry settings as carefully as its timeouts, and set
  both deliberately." (line 177) This is a bare instruction. It is fine at the
  end of a paragraph, but it would read better with its reason attached: "…
  because together they set the longest a call can take".

**S11. Choosing a timeout has no figure.**

Brooker's rule (line 152) is the decision in that section. A small chart of a
latency distribution with a draggable timeout marker, showing the
false-timeout rate as it moves, would make "p99.9" concrete. This is optional:
the section works without it.

**S12. The decision table (lines 277–289) has no lede.**

It follows the `IFEQ` section with no introduction. Add one sentence saying
what the table is for, for example "Each row below is a job you will meet, in
order of preference."

**S13. Cross-article note for the orchestrator, not this file.**

Article 5, line 178, describes the `IFEQ` alternative to its version script
without saying that its hash layout must become a string. It needs the same
caveat as R2.

**S14. `SET … NX` used as a lock (line 162).**

"or not in the way you meant" is vague. Say what happens: a retried lock
acquisition whose first attempt succeeded is refused, so the client believes
someone else holds the lock and waits until its own lock expires.

## Figures as artefacts: summary

| # | Isolates one idea | Both themes, 375 px | Notes |
|---|---|---|---|
| 1 | Yes | Yes | Label collision; end label clipped at 375 px (S6) |
| 2 | Yes | Yes | Axis rescales per method (S5) |
| 3 | Yes | Grid is legible; slow-row shading invisible | R4 |
| 4 | Yes | Yes | Good; caption repeats the prose (S1) |
| 5 | Yes | Yes | Strong: the clearest figure in the article |
| 6 | Yes, three policies | Yes | Overplotting, axis label (R5); units (S7) |
| 7 | Yes | Yes | Readouts carry it; could add a script choice (S2) |
| 8 | Yes | Yes | Field names, missing `UNWATCH` (S9) |

Every figure has a caption that says what it models and what it leaves out,
and each has a text alternative that states the result. Under reduced motion
nothing autoplays, and every step figure can be reached by stepping.

## Beside the references

The first half would sit naturally beside Load Balancing:
- a situation the reader recognises (a slow product page);
- one-variable demonstrations (values, then method, then round trips per
  page);
- small derivations shown, then confirmed by a figure;
- a surprise that is earned: correlated slowness lands between the two models.

The second half reads more like careful reference documentation. It is
accurate and measured, but it is mostly bullet lists of behaviours, with no
demonstration for scripts, `MULTI` or `IFEQ`. Gears and Load Balancing never
hand the reader a list of rules without first letting them see the behaviour.

**Single biggest gap:** the atomic-operations half lacks a demonstrated,
copyable worked example. The "set only if newer" compare-and-set that this
article owns is split between a figure with no code and one sentence of prose,
and its value layout contradicts the `IFEQ` route (R2). Fix R2, add the script
choice to Figure 7 (S2) and trim the second half's lists, and the article
would meet the bar.
