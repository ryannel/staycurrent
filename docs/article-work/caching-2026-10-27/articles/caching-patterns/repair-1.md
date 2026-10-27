# Repair, round 1: Caching patterns

Article: `src/articles/caching/caching-patterns.astro`; figures in
`src/components/caching/caching-patterns/`. Reviews: `review-teaching-1.md`,
`review-technical-1.md`. New evidence is appended to
`evidence/caching-patterns.txt` under "Repair round 1" (Redis 8.10.3 on port 7112,
`--save ''`, shut down afterwards). Model tests pass (6). Preview on port 4412
with `CACHING_DRAFT_PREVIEW=1`. Figure screens are in `screens/`. Controls I
changed are exercised in `screens/states-repair-1/`. There were no console
errors and no horizontal overflow at 1280 px or 375 px. Not committed.

## The read-through overload argument (teaching R2 and R6, technical R3 and S6)

I fixed this once, around the variable that actually decides the outcome.
Figure 4 no longer offers "cache-aside or read-through". Its new title is "What
happens to a query nobody is waiting for". A query the application has given up
on now has three options:

- it runs, and the answer is discarded;
- it runs, and the answer is cached;
- it is never run.

`overload-model.mjs` gains an `abandoned` parameter (`discard`, `cache`, `drop`).
The tests now cover all three options and the headroom cases. Seeds 1 to 3 give
the same picture.

| Option | Behaviour after the restart (seed 1) |
| --- | --- |
| Discard | Stuck at about 55%, holding 102 keys |
| Cache | Every request answered in time by 25 s |
| Drop | Every request answered in time by 16 s |

The prose now:

- says the trap needs two conditions: the database spends its capacity on
  abandoned work, and nobody keeps the answers;
- adds the headroom sentence: 150 queries a second, or a 5 s timeout, recovers;
- attributes the priority argument to Bronson and colleagues;
- says a read-through layer does not guarantee late fills, citing HybridCache's
  documented cancellation once every caller has cancelled;
- says the third option (deadlines) is open to either pattern;
- refers back to the introduction's metastable failure instead of defining it
  again.

These parts now say the same thing:

- the failure table: both refill rows are conditional;
- the summary table: read-through's "Use for" no longer claims overload refilling;
- Choosing: both ways out are given, with "check that yours does";
- the closing list.

Orchestrator action for R6: record in `plan.md` that article 2 owns the
comparison of what happens to abandoned loads (Figure 4), and that article 11
refers back to it.

## Teaching review: required

- **R1, "stays empty":** fixed. The prose and the text alternative now say "a
  hundred or so" keys. The figure shows 102.
- **R2:** see above.
- **R3, Figure 2 at one read per write:** fixed both the figure and the prose.
  - I changed the seed from 5 to 29. Of seeds 1 to 400, it had the smallest
    worst gap over k = 1 to 20 at 20 to 120 s.
  - At 60 s the delete row reads 50%, 63%, 79% and 95% for k = 1, 2, 4 and 19.
  - The prose now says "within a minute or so, the hit ratio settles near half".
  - A new test checks the seeded run at 30, 60 and 120 s.
- **R4, the failed write drawn as an arrow:** the failed write is now a note on
  the Database lane, "UPDATE £35 fails". It has the same form as the "fails" note
  in the other order.
- **R5, queue badge clipped at 375 px:** the phone layout moves the database 84
  px in from the edge. "+2560" now fits.
- **R6:** the clause is fixed here; `plan.md` is for the orchestrator.
- **R7, "never stale" qualification:** merged with technical S5. It now reads:
  "only while one process writes the key at a time, both of its writes succeed,
  and no reader fills the key from an older read".

## Technical review: required

- **R1, k ÷ (k + 1) is not a ceiling:** it is now called the expected hit ratio
  for random, independent traffic. I added the true floor, 1 − 1 ÷ k, with a
  one-line derivation (misses ≤ writes). The added paragraph says:
  - the floor is reached when a read follows every write;
  - bursts of writes do better than the formula.

  I replaced "at most", "ceiling" and "the most a key can hit" in the prose, in
  Choosing and in the closing list. The reviewer's example of 70% at k = 4 is
  below the floor, so I used 77%.
- **R2, connect timeouts:** I re-measured both cases.
  - Stopped server: refused in 0.005 s.
  - Non-routable address: still waiting after 30 s without a timeout, and gave
    up after about 4 s with `-t 2`.

  The paragraph now separates refused from unanswered, says an outage of either
  kind can hold requests, and tells the reader to set both a connect timeout and
  a command timeout.
- **R3:** see above.

## Suggested: applied

| Finding | What I did |
| --- | --- |
| Teaching S1 | Rewrote the opening sentence |
| Teaching S2 | Refer back to the introduction for cache-aside, TTL and the plain `SET` behaviour. Kept only what is new here. |
| Teaching S3 | Rewrote the derivation step |
| Teaching S4 | Figure 1's prose and text alternative now quote what a reader sees at any time: "roughly a quarter to two-fifths" stale, and hit ratios of about 88%, 85% and 91%. I checked these from 15 to 600 s; the order never changes. |
| Teaching S5 | Added a "Redis emptied" line to the chart, drawn as a two-point series because the shared chart has only horizontal rules |
| Teaching S7 | Added a paragraph on writing after the commit, citing Django's `on_commit` (checked in the Django docs) |
| Teaching S8 | Added Spring `@Cacheable` and .NET `HybridCache.GetOrCreateAsync` as read-through, both checked in their docs |
| Teaching S9 | Added the write penalty, worded as Amazon frames it |
| Teaching S10 | Added Coherence's cluster copies, against a single Redis with persistence off |
| Teaching S11 | Trimmed the processor-cache history to clauses |
| Teaching S12 | Fixed all five sentences |
| Teaching S13 | The code is introduced as "caching the product record as JSON rather than the whole page" |
| Teaching S14 | Partly applied: Figure 2 uses wider marker spacing on phones (22 px/s) |
| Teaching S15 | Options stack full width below 480 px, through local CSS in `patterns.css` |
| Teaching S16 | Figure 5's phone layout is now a Z shape; the badge no longer sits on the INCR edge |
| Teaching S17 | Unlinked titles render in `<cite>`; the introduction reference stays plain |
| Technical S1 | Re-ran with the flusher on one persistent connection: about half was still lost (99,409 and 98,614). I replaced the "exaggerated" caveat with the reviewer's wording and quote the new numbers. |
| Technical S2 | Named the `SPOP`/`GETDEL` crash window in one sentence |
| Technical S3 | Added to the failure table |
| Technical S4 | Added failover to the exposure sentence |
| Technical S5 | Merged with teaching R7 |
| Technical S6 | Folded into the overload rewrite |
| Technical S7 | Added the `PTTL` pipelining clause |
| Technical S8 | Linked the final URL, with a note that the page is headed "Memcached" |
| Technical S9 | Now "Facebook's rule for failed cache reads" |

## Suggested: skipped

- **Teaching S6, refresh-ahead figure:** skipped. Article 6 owns the refresh
  rule and will need its own figure, so one here would duplicate it.
  - The new third option in Figure 4 adds a demonstrated result to the second
    half.
  - The failure section was only lightly tightened. The R2 timeout paragraph
    added necessary content there.
- **Teaching S14, overlapping markers on product:1 in Figure 1:** skipped. It
  needs a shared marker change or event jitter. Figure 2 is where "one miss after
  each write" is taught, and its spacing is fixed.

## Open

- The `plan.md` ownership note (R6) is for the orchestrator.
- The breadcrumb risk the teaching review raised: publish the introduction
  before this article.
- I did not run `astro build`; other drafts may break it. I relied on the dev
  preview.
