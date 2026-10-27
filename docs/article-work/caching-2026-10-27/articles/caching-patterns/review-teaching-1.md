# Teaching review, round 1: Caching patterns

Article: `src/articles/caching/caching-patterns.astro`, figures in
`src/components/caching/caching-patterns/`. Read rendered at
`http://localhost:4452/learn/databases/caching/caching-patterns/` with
`CACHING_DRAFT_PREVIEW=1`, 27 October 2026.

Before reading I re-read the brief, the plan entries for articles 1–3, 5, 6 and
11, and the full text of Gears and Load Balancing. I also used their
demonstrations: I played three Load Balancing simulations (one server, five
servers, and the queues with the reset button) and dragged three Gears canvases
(transmission, spool and torque).

I then used every figure in this article. For each simulation I paused it, reset
it, chose every option, stepped through it and recorded the readouts. I ran the
stepped figures to the end in each order and used Restart Redis at two
intervals. I checked reduced motion: all four simulations stay paused at 0 s. I
checked keyboard use of the choice controls. Screens are in `review-screens/`
(light and dark, 1280 px and 375 px, as loaded) and `review-screens/states/`
(the states quoted below). Readouts from a full pass are in
`review-screens/states/readouts-light-1280.txt`. There were no console errors
and no horizontal page overflow.

## Verdict

**Publishable after required fixes.** The article is clear, honest about its
models and well sourced. It teaches its central ideas well:

- the k ÷ (k + 1) ceiling, derived and then checked in Figure 2;
- why delete is the default;
- why the database goes first;
- write-behind's exposure, r × T ÷ 2, with a restart button that makes the
  exposure real.

The required fixes fall into three groups. Two places where the prose and the
figure disagree. One place where the read-through argument overstates its case
and contradicts the introduction. A few figure defects that hide the point at
the moment it matters.

Required: 7. Suggested: 17.

## Required

### R1. Figure 4's prose says Redis "stays empty"; the figure shows 102 keys

Line 106: "Redis is up and empty, and it stays empty." The figure shows Redis at
**102 keys**, the hit ratio at 54–57% and the database wait at 26 s by 30 s
(`states/light-1280-f4-aside-30000.png`). The same paragraph has just explained
why: the first hundred or so queries refill the most popular keys.

The text alternative disagrees with the prose too. It says "the first few
hundred queries return in time". The model answers 100 queries a second with a
1 s timeout, so about 100 return in time, which matches the 102 keys.

**Fix:** "Redis is up, holding only the hundred or so keys that refilled in the
first second, and it gets no more." In the text alternative, change "few
hundred" to "hundred or so".

### R2. The read-through argument implies one remedy, and contradicts the introduction

Line 110 says filling the cache first is something "a look-aside cache cannot
arrange and a read-through cache can". Line 112 then says: "A database that
cancels abandoned queries never builds the queue in the first place, but then no
late answer is cached by either pattern."

That last sentence is literally true, but it leaves the reader thinking that
cancelling does not help. It does help. If the database drops queries the
application has abandoned, every answer it does produce arrives in time. Cache-aside
stores each one and recovers. The introduction's own figure shows this. Its text
at line 136 says the model "recovers quickly because the database here fails fast".

The trap needs two conditions together:

- the database spends its capacity on answers nobody is waiting for;
- nobody stores those answers.

Removing either condition gets the system out. The Choosing section (line 199)
and the summary table ("Use for: … refilling under overload") give only the
read-through half. A practitioner would leave thinking read-through is the fix,
when deadlines and cancelling are the more common one.

**Fix:**

- In line 112, say that cancelling abandoned queries, or bounding the database
  queue, also lets cache-aside recover. Every answer the database then produces
  is in time and is stored, as in the introduction's figure. Keep the pointer to
  article 11 for load shedding.
- In line 199, give both options: make fills outlive requests, or make sure the
  database does not spend its time on abandoned requests.
- Reconcile line 110's "cannot arrange" with the next paragraph's "A cache-aside
  application can do the same thing". Attribute the claim to Bronson and
  colleagues, then qualify it, or drop "cannot".

### R3. Figure 2 contradicts the prose at one read per write for the first minute

Line 66 says: "Drag the slider down to one read per write and half the reads
miss." Moving the slider restarts the run from 0 s. With the figure's seed (5)
at k = 1, the delete row's hit ratio is:

| Simulated time | 5 s | 10 s | 20 s | 30 s | 60 s | 120 s |
| --- | --- | --- | --- | --- | --- | --- |
| Hit ratio | 64% | 68% | 69% | 67% | 61% | 53% |

A reader who does what the prose asks sees about a third of reads miss, not
half, for over a minute. The expected value is shown right beside it ("Delete:
expected … 50%"), so the gap looks like an error. I ran seeds 1–10 at 30 s with
k = 1. The hit ratio ranged from 37% to 67%. Seed 5 is one of the worst.

The k = 4 and k = 19 settings, which the text alternative also quotes, behave
well.

**Fix:**

- Pick a seed whose early path at k = 1, 2, 4 and 19 lies close to the expected
  value. Seeds 2, 3, 4 and 6 were within 4 points at 30 s for k = 1; check them
  at the other settings.
- Soften the prose, for example "within a minute it settles near half", and
  consider defaulting to 2× speed.

### R4. Figure 3's failed database write is drawn as a delivered arrow

In the "Redis first" order, step 2 draws `UPDATE £35` from the writer to the
**Database** lane with a full arrowhead (`states/light-1280-f3-redis-s2.png`).
It differs from a successful write only in its magenta colour. The only other
signs of failure are the explanation box and the £39 still under the Database
label.

The "database first" order marks its failure with a separate "fails" note
(`states/light-1280-f3-database-s3.png`). Failure is the subject of this figure,
so a reader following the arrows alone will read step 2 as a success.

**Fix:** Mark the failed write on the diagram itself: stop the arrow short of
the lane with a cross, or add an error note "rejected" at the Database lane. Use
the same visual form as the "fails" note in the other order.

### R5. Figure 4's database queue badge is clipped at 375 px

At phone width the queue count above the database's queue bar runs off the
figure's right edge. "+2560" shows as "+256"
(`states/dark-375-f4-aside-30000.png`). The queue is the figure's evidence that
the system is stuck, so the number must be readable.

**Fix:** Give the compact layout more right padding, or place the badge to the
left of the queue bar or under the node.

### R6. Metastable failure and cold-start recovery overlap articles 1, 6 and 11

The plan gives these subjects elsewhere:

- article 11 owns "metastable failure (a cold cache keeping the database
  overloaded) and recovery";
- article 6 owns the stampede mechanics of a cold start.

The introduction already names metastable failure (line 136) and points to
article 11 for it. This article re-defines it as new at line 110 ("Bronson and
colleagues call the stuck state a metastable failure"). Figure 4, its largest
figure, is a cold start under load.

The figure does earn its place here, because it shows a difference between
patterns. The ownership needs settling before article 11 is written.

**Fix:**

- The orchestrator records in `plan.md` that article 2 owns the "fills outlive
  requests" comparison (Figure 4), and that article 11 refers back to it rather
  than rebuilding it.
- In this article, refer back to the introduction's naming of metastable failure
  in a clause ("the metastable failure the introduction described") instead of
  defining it again.

### R7. "Never stale … holds only while there is one writer at a time" is incomplete

Line 82 qualifies Amazon's claim: "that holds only while there is one writer at a
time." Figure 3, four paragraphs later, shows a single writer leaving a stale
copy when its second write fails.

**Fix:** "That holds only while there is one writer at a time and both writes
succeed."

## Suggested

### Teaching and structure

**S1. The opening's logic.** Line 13 says: "Every cache has to answer two
questions that the read path leaves open." The first question, who fills the
cache on a miss, is a read-path question, and the introduction's read path
answers it. Rewrite as: "Every caching pattern answers two questions: who fills
the cache when data is missing, and what a write does to the cached copy and to
the database, and in which order."

**S2. Repeats the introduction as if new.** Four places re-teach what the
introduction already taught:

- line 19 introduces cache-aside and lazy loading, which introduction line 29
  already defines;
- line 40 re-expands TTL;
- line 84 re-demonstrates that a plain `SET` drops the TTL, which introduction
  line 48 already shows on a test server;
- line 110 re-defines metastable failure (see R6).

Refer back in a clause ("The introduction's read path is cache-aside"; "as the
introduction showed, a plain `SET` removes the TTL"). Keep only what is new here:
why this matters more for write-through, plus `KEEPTTL` and `XX`. This saves
about 80 words and avoids a déjà-vu stretch for readers coming from article 1.

**S3. The derivation's key step is unclear.** Line 58 says: "Looking at the
events around any one read, the next event after the previous read is a write
with probability w ÷ (r + w)." A newcomer cannot see why. Say: "Because reads and
writes arrive at random and independently, each event is a write with
probability w ÷ (r + w), whatever came before it. A read misses exactly when the
event just before it was a write." This is the same three-step clarity Gears
gives its ratio.

**S4. Figure 1's quoted numbers are out of reach.** The prose and text
alternative quote numbers from ten simulated minutes: 28% stale, and hit ratios
of 87%, 83% and 90%. To see them the reader needs 2.5 minutes at 4× or 120
presses of Step 5 s. At 30 s they see 39% stale and hit ratios of 89%, 84% and
91%. Either quote what the reader will see in the first minute, or add a "Run 10
minutes" step. Even better, show the three outcomes side by side after a run.
The reader is currently asked to remember three numbers from three separate runs
to make the comparison the figure exists for.

**S5. Figure 4 has no marker for the restart.** Add a vertical rule labelled
"Redis emptied" at 10 s on the chart. The "restarted" sublabel shows for only 3
s, and the drop is the event the reader is told to watch. The writer reported
this as a toolkit gap; a local overlay would do.

**S6. Long figure-free stretches.** After Figure 6 come 1,508 words with no
demonstration: the two variations, the failure table, the questions for choosing
and the summary table. The gap between Figures 2 and 3 is 724 words.
Refresh-ahead is behaviour over time, and a small figure would teach it better
than the Coherence paraphrase. For example, one hot key and one cold key with
the refresh window shaded, and reads inside the window starting one background
reload. The failure table mostly restates earlier sections; the three paragraphs
after it could shrink to the new facts (connection refused versus slow,
Facebook's skip-the-fill rule, and the 1 ÷ (1 − h) reminder).

### Depth

**S7. Commit before you touch the cache.** "Write the database first" (line 92)
should say *after the transaction commits*. Applications usually write the
cache from inside an ORM transaction block. There, a `DEL` or `SET` runs before
the commit, and two things can go wrong:

- a reader can refill the old row before the commit lands;
- the cache can hold a value that is then rolled back.

This is the most common real-world form of Figure 3's Redis-first failure. Add
one sentence, and name the after-commit hook idea; Django's
`transaction.on_commit` is one example.

**S8. Read-through in the reader's own stack.** Only Redisson is named, which
is Java-specific. Practitioners will meet read-through mostly as framework
features, for example Spring's `@Cacheable` over a Redis cache manager and
.NET's `HybridCache.GetOrCreateAsync`. One sentence naming these would let the
reader recognise the pattern in code they already have. Verify each against its
documentation before citing it.

**S9. Write-through's write latency.** The article does not mention that
write-through adds a second sequential write to every user-facing write. Amazon
lists this as the "write penalty". One clause in the costs paragraph (line 82)
covers it.

**S10. Coherence's "system of record" omits Coherence's backups.** Line 141
paraphrases Coherence: write-behind makes the cache the system of record until
the queue is flushed. Coherence's own sentence adds that this means
"cluster-durable (rather than disk-durable)" storage: Coherence keeps backup
copies on other cluster members. A single Redis with persistence off is weaker
than that. Add half a sentence so the reader does not carry Coherence's
guarantee over to Redis.

**S11. Possible cuts.** These cuts lose nothing a practitioner needs:

- The GET-then-DEL experiment (line 143) can lose its caveat sentence if it says
  "even with this exaggeration" once. The point is that any gap loses
  increments, which one sentence makes.
- The processor-cache history of write-through and write-around (lines 72 and
  157) can become a clause each.

Together these save about 100 words.

### Writing

**S12. Quoted sentences that fail the house voice:**

- "That loss is not a figure of speech." (line 141) is a flourish. Try "I
  checked this on a real server."
- "Two things keep this honest." (line 112) is a mild flourish. Try "Two
  qualifications."
- "Their point about caching is that filling the cache should take priority over
  answering the client in that state, which a look-aside cache cannot arrange
  and a read-through cache can, by giving its database queries a more generous
  timeout than the client's." (line 110) needs splitting into two sentences, and
  see R2.
- "What it costs is the three reasons from the previous section turned around."
  (line 82) is compressed. Try "The costs are the three reasons for deleting,
  seen from the other side."
- "the readout on the right counts a different waste" (line 66) is wrong at
  phone width, where the readouts stack. Name it instead: "the readout 'Update:
  cache writes never read'".

**S13. Continuity with the introduction.** In the introduction, `product:42` is
a desk lamp cached as a whole page with `ex=60`. Here, `product:42` is a kettle
cached as product JSON with `ex=300`. Neither is wrong, but a reader moving
straight between the articles may stumble. Use another id for the kettle, or say
the cached value is now the product record.

### Figures as artefacts

**S14. Crowded event strips.** In Figures 1 and 2, markers overlap on the
popular rows at 1×. On product:1 in Figure 1, the miss right after a write sits
under the write square. At 375 px, Figure 2's strip shows about 12 s in 170 px,
and its point, one miss after each write, can no longer be seen
(`states/dark-375-f2-k4-20s.png`). Options: lower the event rate or widen the
marker spacing in the compact layout, or default to 0.5×.

**S15. Choice controls wrap unevenly at 375 px.** "updates the key" sits alone on
a second row in Figure 1, and Figure 4's two options stack with empty space
beside them. Stack all options full width in the compact layout.

**S16. The Figure 5 badge overlaps the INCR edge at 375 px.** The "13 waiting"
badge is drawn over the INCR edge and its moving squares in the compact layout
(`states/dark-375-f5-iv5-12s.png`). Raise the badge or shift the edge.

### Links

**S17. Unlinked titles read as bare text.** The article had no link to an
unpublished article in any state I checked (see the link check below). When
`ArticleRef` renders without a link, the title still appears bare in the
sentence: "…are the subject of Cache invalidation and consistency." Wrap the
unlinked form in `<cite>` (italic) so the reader sees it is an article title.

## Link check: unpublished articles

I checked the rendered preview HTML and read the code that decides when a
reference becomes a link.

**In the preview build** (`CACHING_DRAFT_PREVIEW=1`), the only links into the
collection are to planned entries that have a draft file:

- the introduction (`/learn/databases/caching/`);
- `keys-and-values/` and `expiration-and-eviction/`. Both draft files appeared
  in the working tree while I was reviewing, and the article switcher labels
  them "draft".

These ArticleRef targets render as plain text, with no `<a>`:

- `invalidation` (twice);
- `stampedes` (three times);
- `operating-a-cache` (twice);
- `clients-and-pipelining`;
- `replication-and-persistence`.

The planned entries in the article switcher are also plain text.

**In a normal build**, `ArticleRef.astro` links only when the target's status is
`published`. The preview exception applies only when `CACHING_DRAFT_PREVIEW=1`.
The layout's pager and switcher also use only published entries, or drafts under
preview. No body link is hard-coded: the only collection `href`s are made by
`ArticleRef` and the layout.

I could not confirm this with a real normal build. `astro build` currently fails
because another draft, `src/articles/caching/expiration-and-eviction.astro`,
imports a component that does not exist yet
(`components/caching/expiration-and-eviction/SizeCurve.astro`).

**One risk at publication.** The breadcrumb (`ReadingNavigation`, through
`breadcrumbs()` in `src/lib/reading.ts`) always links "Application caching with
Redis" to `/learn/databases/caching/`. If this article were published before the
introduction, that link would point to a page that is not built. Publish the
introduction first, or make the breadcrumb plain text while the introduction is
planned.

## Accuracy spot checks

These claims were checked against primary sources:

- **Bronson et al., HotOS 2021.** Section 2.2 describes the look-aside example:
  the cache "will remain empty since the web application is responsible for
  populating the cache". Section 3 has the passage that "prioritization is
  unenforceable with a look-aside cache but trivial with a read-through cache".
  Both are paraphrased correctly. The paper's "remains empty" is about the ideal
  case; the article's model rightly shows a partial refill, so R1 is a fix to the
  prose only.
- **Coherence 14.1.1.** "may re-order database updates", "handled heuristically
  or escalated", the 60-second refresh-ahead example with a factor of 0.5, and
  the system-of-record sentence (see S10) are all accurate.
- **Amazon ElastiCache.** "Data in the cache is never stale", cache churn with
  TTL, and missing data on a new node fixed by adding lazy loading are all
  accurate.
- **Redis measurements.** The figures quoted in the article (`DEL` returning 1
  then 0, TTL -1 after a plain `SET`, `XX` returning nil, `GETDEL` 200,000/200,000
  against splits that lost 99,660 and 100,042, `DBSIZE` 0, connection refused)
  match `evidence/caching-patterns.txt`.

## Beside Gears and Load Balancing

It comes close. The voice is plain and first-person and keeps its momentum. The
prose tells the reader what to watch ("Watch the top row…", "Step through it and
notice…"). Each figure varies one thing. The surprises are earned:

- leaving the copy alone has a *higher* hit ratio than deleting it, while one
  read in four is wrong;
- cache-aside stays stuck while Redis is healthy.

Captions say what each model leaves out, as Load Balancing does.

**The single biggest gap is density in the second half.** Load Balancing never
asks the reader to take a trade-off on trust: it shows the chart, then explains
it. This article's last 1,500 words, where the reader actually chooses a
pattern, are tables and prose with no demonstration. Its six figures over about
5,200 words are well below the references' rhythm. With R1–R7 fixed it is
publishable. A refresh-ahead figure and a shorter failure section (S6) would
bring the ending up to the standard of the first two-thirds.
