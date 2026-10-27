# Teaching review, round 1: Cache invalidation and consistency

Reviewer: independent editor, fresh to this article and to all earlier reviews.
Date: 27 October 2026.

## How the article was reviewed

- Read the brief, the plan entries for articles 4 to 6 (including the map changes of 27 October), the article's own plan and the writer report.
- Re-read the full text of Gears and Load Balancing. In a browser I dragged three Gears demonstrations (canvases 2, 9 and 20, including the wrench) and played three Load Balancing simulations (1, 3 and 8). I also moved the speed slider on simulations 0, 4 and 9.
- Read the rendered draft at `http://localhost:4455/learn/databases/caching/invalidation/` from top to bottom.
- Used every figure:
  - Figure 1 at delays of 0, 400 and 3,000 ms, plus "Lose the next delete";
  - every option of Figures 2, 5, 6, 7 and 9, stepped to the end;
  - Figure 3 with each writes option, fill times of 10, 50, 200 and 300 ms, and each TTL;
  - Figure 4 at five delays, against both the primary and the replica;
  - Figure 8 in both modes for over 30 seconds.
- Screenshots were taken in light and dark themes, at desktop and 375 px. They are in `review-screens/`, with interaction captures in `review-screens/use/`.
- Reduced motion is respected: Figures 1 and 8 stay paused.
- No page overflow and no console errors at either width.

One note on the environment. Another session was editing `src/components/caching/shared/` (`sim.mjs`, `player.mjs`, `chart.mjs`, `sequence.mjs`, `figure.css`) during the review, so the dev server reloaded the page every minute or so. I re-ran each interaction until it finished without a reload, and every reading below comes from a run that was not interrupted. The Figure 6 step-7 text I first saw came from one of those reloads. It is not a bug.

## Verdict

**Publishable after required fixes.**

This is the strongest teaching in the collection so far on a subject that rewards depth:

- The opening situation (£39 an hour after a correct delete) is concrete.
- The three promises are named precisely.
- The w × δ derivation is shown and then checked by a simulation.
- The length-bias explanation for why delayed double delete misses so much is a real insight, earned by Figure 4.
- The lease is built from Redis 8.4 commands and was observed working.

Its problems sit in a few places:

- One figure misrepresents the quantity it is meant to teach.
- One owned subject is missing.
- A handful of claims are inaccurate.
- About a sixth of the length is consolidation, repetition and lab-notebook detail that does not change a decision.

Counts: **7 required**, **16 suggested**.

## Length: where it buys understanding and where it does not

The prose runs to about 7,000 words (word counts exclude code). This is how it splits by section:

| Section | Words |
| --- | --- |
| Opening | 330 |
| What a cache can promise | 600 |
| The race that puts an old value back | 420 |
| How often it happens | 750 |
| Delayed double delete | 550 |
| Leases | 770 |
| Out-of-order writers and versioned values | 630 |
| When the delete is never sent | 600 |
| One change, many keys | 780 |
| Read-your-writes | 445 |
| Choosing what to use | 560 |
| What you can now decide | 235 |

**Length that pays for itself.** Each of these changes what a practitioner decides:

- the promises;
- the race and its replica variant;
- the derivation, and the result that the TTL caps duration but not share;
- the length-bias argument;
- the three details that make a lease correct;
- the warning that eviction forgets versions;
- why deletes suit at-least-once pipelines;
- the trap in each fan-out scheme.

Gears spends about 11,000 words on a subject with fewer pitfalls. Most of this article earns its size.

**Length that does not pay.** About 1,000 to 1,300 words could go without losing anything a practitioner needs:

1. **Three consolidations in a row** (the table, six questions, then a seven-bullet "you can now" list), about 800 words in all. The table and the questions overlap heavily, and the bullet list restates both. Keep the table and the questions; replace the bullet list with two sentences and the forward link. The questions could also shrink to the four that add something beyond the table: replicas, lost deletes, fan-out and the writer.
2. **Seventeen inline "On Redis 8.10, …" observations.** Several paragraphs read like a lab notebook. Examples:
   - line 147: "on Redis 8.10 a lease written with `PX 200` refused a fill that arrived 400 ms later, which is the safe outcome. Everything here was run on Redis 8.10: …"
   - line 178;
   - line 182;
   - line 184.

   Keep only the observations that are themselves the lesson: `SET … IFEQ` dropping the TTL, `DEL` against `UNLINK`, `PUBLISH` returning 0, the lost generation counter. Move the remaining provenance to the Sources note, which already lists them. That saves about 250 words and makes the lease and versions sections much easier to read.
3. **The delete hold-off paragraph (line 114, about 140 words).** It introduces a second, different "tombstone" (`SET product:42 tombstone PX 2000` with `NX` fills), and nothing later uses it. The article then defines a different tombstone (a version with no value) in the versions section. Cut it to one sentence ("Facebook's memcache gets a similar effect with a two-second hold-off on deletes during cluster warm-up"), or drop it.
4. **Line 196: the mcsqueal mechanics and the 4% statistic** (about 80 words). The statistic is interesting but changes no decision.

**Length that is missing.** Monotonic reads (R2) and how to measure staleness in your own system (S9) need about 200 words between them.

## Required findings

### R1. Figure 3 draws every stale stretch the same length, so its central lesson is invisible, and at high write rates it looks as if keys are stale most of the time

**Where.** Figure 3, "A day of fifty keys", and the paragraph at line 94.

**Evidence.** A three-minute stretch on a 24-hour row is about 1.5 px wide, so every mark is drawn at the minimum width. With the TTL at 1 minute (104 marks, none longer than 60 s) and at 1 hour (73 marks, up to 2.9 min), the marks look identical; see `use/f3-ttl60.png` and `use/f3-default.png`. The section's earned surprise is "more, shorter marks for the same share", and the picture cannot show it. Only the readouts do.

Worse, at "every 6 seconds" the strip is mostly olive ink (`use/f3-w600.png`) while the readout says 0.745% of the time. The picture overstates the stale share by well over an order of magnitude.

**Fix.** Make mark area proportional to time stale. Two ways to do that:

- **Option 1: change the display.** Keep the rows but show total stale time per key as a bar beside each row, or switch to a zoomed one-hour window in which durations are visible.
- **Option 2: add a second panel.** Add a histogram of stale-stretch durations whose total area is the stale share. A 1-minute TTL then visibly gives many short bars, and a 1-hour TTL fewer, longer ones, with the same area.

Whichever you choose, the "every 6 seconds" view must not look stale-dominated.

### R2. Monotonic reads, assigned to this article, is not taught

**Where.** The promises section (line 32 onward). The term appears only in the Sources entry for Terry et al.

**Evidence.** In `plan.md`, "Map changes after research" says: "Article 5: owns monotonic reads as one of the consistency guarantees." The writer report lists it as unowned, but the plan assigns it here.

**Fix.** Add monotonic reads as a fourth promise in the list at line 34, in two or three sentences. A user who has seen £35 must not later see £39. With a cache this breaks when one request hits a refreshed copy and the next misses to a lagging replica, or when a stale set lands after a fresh read. Then add one sentence in the replica question at line 261 saying that keeping fills on the primary, or the recent-write marker, also gives that user monotonic reads.

### R3. The generation lookup cannot travel "in one round trip" with the page key

**Where.** Line 210: "Each read also costs an extra lookup to fetch the current generation, though it can be sent together with the page's key in one round trip." The table row "Generation number" also lists `MGET`.

**Evidence.** The page key `category:7:g3:cheap:p1` contains the generation, so the client must read `gen:category:7` before it can name the page. The two `GET`s are dependent and cannot be pipelined or combined in an `MGET`. Figure 8 correctly shows "Redis lookups per read: 2".

**Fix.** Say that it costs a second round trip, unless:

- the application caches the generation in-process for a second or two (this adds that much staleness); or
- both reads run in one server-side script (see the clients article).

In the table, replace `MGET` with `GET` (and keep `MGET` only if you explain that it fetches several generation counters at once).

### R4. The bounded-staleness proviso suggests a stale set escapes the TTL bound; it does not

**Where.** Line 35: "When an invalidation is lost, the TTL (time to live) is the bound, provided the copy was correct when it was stored. That proviso matters, as the next section shows."

**Evidence.** The next section shows the opposite: an old value stored by a race still lasts at most one TTL ("`EX 60` … one minute rather than an hour", line 70). The precise bound is the TTL plus the age of the data when it was stored, which is the fill time, or the replication lag for replica reads. The proviso as written teaches the reader that races break the bound. They lengthen it slightly; they do not break it.

**Fix.** Rewrite the sentence along these lines:

> When an invalidation is lost or a race stores an old value, the bound is the TTL plus however old the value already was when it was stored: usually the fill time, or the replica's lag.

### R5. One reference to another article bypasses ArticleRef

**Where.** Line 161: "That is the reason, given in both Facebook's paper and Caching patterns, that delete is the usual choice."

**Evidence.** The brief says to refer to other articles only through `shared/ArticleRef.astro`. Every other cross-reference does:

- caching-patterns three times;
- keys-and-values, expiration-and-eviction (twice), clients-and-pipelining, how-redis-works, cluster-and-hot-keys and stampedes (twice).

None of the figure components link to other articles, and no local copy of ArticleRef exists in `src/components/caching/invalidation/`.

**Fix.** Wrap "Caching patterns" in `<ArticleRef slug="caching-patterns">`.

### R6. The version-check script uses a tombstone three paragraphs before the reader learns what one is

**Where.** The Lua script at lines 165 to 176. Its comment says `("" for a tombstone)`, and its condition is `new == cur and dead and ARGV[2] ~= ""`. Tombstones are explained only at line 184 ("That is what the script's empty value does").

**Evidence.** On first reading the reader meets a `dead` variable and an equal-version branch that only makes sense after the eviction case and the tombstone have been taught. This is the one place in the article where something is used before it is defined, and it sits on the section's main artefact.

**Fix.** Either:

- show a five-line script first (refuse unless the new version is greater) and give the tombstone-aware version after line 184; or
- move the tombstone paragraph before the script.

### R7. The lease and versions sections teach by code and command transcript, with no figure for the second half of either

**Where.**

- **Leases.** After Figure 5 come about 500 words of code, three correctness details, `IFEQ` semantics, `DELEX` and the herd. None of it has a figure.
- **Versions.** After Figure 6 come the script, the `IFEQ` retry loop, the version source, eviction and tombstones, all in prose. The tombstone result is the most important one: version-checked tombstones also close the slow-reader race of Figure 2.

**Evidence.** The brief says the reader should follow the main ideas from the figures alone. Someone reading only the figures learns that a lease refuses a late fill and that eviction defeats a version check. They never see that a tombstone restores the check, or that it closes the Figure 2 race too.

**Fix.** Add a fourth option to Figure 6, "invalidates with a tombstone", showing the slow reader's version-7 fill refused against a version-8 tombstone and then the version-8 fill accepted. This costs one sequence spec in `sequences.mjs`. The lease's details can stay in prose, once R6 and the trimming in the length section have made that prose shorter.

## Suggested findings

### Teaching

- **S1. Define "fill" where the race is introduced.** The word first appears inside the Meta paraphrase at line 64 ("a cache fill for an old value is in flight"), and the reader is left to infer it until line 76. Add one clause at line 50:

  > the reader's database read and its `SET` (together, a **fill**) are two steps with a gap between them

- **S2. Make the derivation at line 82 explicit, and lay it out like Gears' three short steps.** "races happen about *w* × *w*δ times a second" hides the step "races a second = writes a second × chance each write races = *w* × *f*δ". Set out the two cases as displayed lines:

  > races a second ≈ *w* · *f* · δ
  >
  > duration ≈ time to the next write or expiry
  >
  > share ≈ rate × duration ≈ *w* · δ

  The sentence "Now put the two together and something tidy happens" can then go.

- **S3. Figure 4's square-root axis makes the tail look like most of the area.** It shows 41% left at 500 ms, but the olive area looks larger than the teal. Plot the cumulative "share removed" as a line over the histogram (the readout is a point on that curve). Alternatively, use a linear axis with the overflow bar labelled. Also relabel the y-axis "Old values stored" so that it is also true in replica mode, where these are not racing fills.

- **S4. Figure 4's lesson rests on the model's tail: one fill in fifty held up for 0.2 to 6 s.** The prose at line 108 presents "a surprisingly large share … arrive much later" and "a 2-second delay leaves about a fifth" as if general. Add one sentence saying that the share depends on how heavy your fill-time tail is, and that the length-bias effect holds whatever its size.

- **S5. Figure 8 puts product 42 on every page, which hides the generation number's other cost: it discards pages the change did not touch.** A tag on `product:42` deletes only the pages that show the kettle. Bumping `gen:category:7` discards the whole category. Put product 42 on, say, five of the twelve pages, so tags delete five and generations discard all twelve. Then name that cost in the prose at line 218.

- **S6. Figure 8's tag-mode grid reorders as pages refill**, so "watch a change flash through the pages" is hard to follow. Give each of the twelve pages a fixed slot and show empty slots as outlines.

- **S7. Figure 5's step 9 is labelled "GET, lease" and the second reader is drawn on the same Reader lane.** A newcomer may think the refused reader retried. Either label it "next reader: GET (miss), SET lease:r2 NX" or add a second reader lane.

- **S8. Figure 9's lane is "Editor", but the prose and steps are about Sam, a user editing their own profile.** Label the lane "Sam's request" or similar.

### Depth

- **S9. Say how a practitioner measures the promise in their own system.** Line 42 says Meta measures consistency as "how stale, how often, for how long". Add two sentences on doing the same:
  - sample a small fraction of cache hits, re-read the database (primary) and count mismatches older than the expected window;
  - alert on that rate.

  This is what Meta's Polaris does, and the plan allows one sentence for it.

- **S10. The `SET … IFEQ` read-compare-write loop (line 178) does not cover a missing key.** `IFEQ` never creates a key (the evidence, section D, confirms this), so the loop needs `SET … NX` when the `GET` returned nil. Say so in half a sentence.

- **S11. "Redis Cluster adds a constraint to both" (line 218) applies only to tag sets.** Generation numbers delete nothing. With generations, the constraint that matters is that the counter and the page are in different slots, which matters only if you read both in one script. Rewrite as "adds a constraint to tag sets: …".

- **S12. Lease section: name the cost when the lease holder is slow.** Every other reader goes to the database for up to the lease's expiry (10 s in the code). The link to Stampedes handles the herd, but one clause at line 151 should warn that `PX` should be a little above the slowest normal fill, not an arbitrary 10 s.

### Writing

- **S13. Aphorisms and flourishes.** Each states something the surrounding prose has already explained.

  | Line | Text | Fix |
  | --- | --- | --- |
  | 64 | "It is not a bug in any one line of code. It is what two-step writes do when they interleave." | Cut. The previous paragraph already says it. |
  | 82 | "Now put the two together and something tidy happens." | Cut, as part of S2. |
  | 98 | "The race is real; the figure shows its shape." | Replace with "The race happens with real commands; the figure's numbers come from the model." |
  | 112 | "It shrinks the window; it does not close it." | Cut. The next section's first sentence says it. |
  | 214 | "come back from the dead" | Replace with "are served again". |

- **S14. Use searchable terms in the headings.** "When the delete is never sent" could become "Lost deletes: transactional outbox and change data capture". "One change, many keys" could become "Invalidation fan-out: tag sets and generation numbers". "The race that puts an old value back" could become "The stale-set race". The brief asks for established terms in headings where they fit.

- **S15. Expand TTL at first use.** It first appears in the opening (line 18, "a short TTL"), but it is expanded only at line 35.

- **S16. The text alternative for Figure 3 says writing every 10 minutes "leaves a handful of races".** The figure and the prose (line 92) both say one. Make them agree.

## Figures as artefacts

- **Themes and widths.** Both themes are legible for all nine figures, and nothing overflows at 375 px.
  - Sequence figures stay readable on a phone with four lanes (`use/phone-f5-with.png`, `use/phone-f9-marker.png`).
  - Figure 3 drops its key labels on phones, which is fine.
- **Controls** are recognisable and labelled with what they change: "Delete arrives after", "The gap comes from", "Each key is written", "Second delete after", "Invalidate with".
- **Captions** say what is modelled and what is left out.
- **Text alternatives** convey the results, including numbers.
- **Readouts** match the prose:
  - Figure 3: 73 old values, 0.077% against a predicted 0.083%; every 6 s gives about 83 times as many races and 0.745%; 200 ms gives about 4 times the share; a 1-minute TTL keeps the same share with a longest stretch of 60 s.
  - Figure 4: 59% removed at 500 ms on the primary; 18% left at 2 s; 95% removed at 500 ms on the replica and 20% at 100 ms.
  - Figure 8: generations give one command per change and two lookups per read; after 45 s there were 39 page keys, 33 of them unreachable.
- **Figure 1** does its one job well. The stale shading between commit and delete is clear, and "Lose the next delete" gives the expected stretch that ends at expiry. The legend lists "Expiry" and "Error or dropped" even though neither usually appears until the reader presses the button. That is acceptable, but the legend is busier than the figure.
- **Figure 3** is the only figure that misleads (R1).

## Beside the references

Much of it would sit naturally beside them:

- The opening starts from a situation the reader recognises.
- Most sections pose a question the previous one raised.
- The derivation is shown and then checked against a simulation.
- Figure 4 shows a surprise before explaining it, as Load Balancing does with round robin's tail.
- The voice is plain and first-person.

It falls short of them in the middle third. From the lease onwards, demonstrations give way to code, transcripts and repeated "on Redis 8.10" observations. Gears never lets a page pass without something to move.

**The single biggest gap** is that the article's two most decision-changing results are carried by readouts and prose rather than by anything the reader can see:

- the TTL changes how long stale stretches last, not how much time is spent stale;
- versioned tombstones close the slow-reader race.

R1 and R7 fix that.

## Checks performed

- **Cross-references.** Every cross-reference except the one at line 161 uses `src/components/caching/shared/ArticleRef.astro`. The figure components contain no links to other articles and no local copy of ArticleRef.
- **Primary sources.** These claims were checked against the primary sources quoted in the writer report and the evidence file (`evidence/invalidation.txt`, sections D, E and G):
  - Facebook memcache: leases, the 10-second token rate, 17K/s to 1.3K/s, stale sets, the thundering-herd definition, the two-second hold-off, mcsqueal, read-after-write and remote markers;
  - Pub/Sub at-most-once delivery;
  - keyspace notifications off by default;
  - the semantics of `IFEQ` (no creation, TTL replaced) and `DELEX`.
- **Inaccuracies found.** No other inaccuracies were found beyond R3, R4, S10 and S11.
- **Clean-up.** The dev server on port 4455 was stopped after the review.
