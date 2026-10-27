# Final review, round 2: Cache stampedes and the thundering herd

Reviewer: independent, fresh to the article. Read on 28 October 2026 from the
rendered draft preview (`CACHING_DRAFT_PREVIEW=1 pnpm dev --port 4476`), after
re-reading the brief, the plan entries for articles 5–7 and 10–11 with "Map
changes after research", and the full text of Gears and Load Balancing (three
demonstrations of each used). Earlier reviews and the repair note were skimmed
only after this judgement was formed.

## Verdict

**Publish.** No blocking problems. 0 blocking, 10 minor.

The article is at the standard of Gears and Load Balancing for this subject. It
starts from a situation every reader recognises: a once-a-minute spike for a
key with a 99.7% hit ratio. It derives the size of the stampede (r × δ) and
then the less obvious cost: the pool stays busy for r × δ² / c, which is why a
slower rebuild hurts twice. Each defence has its own figure, isolating one
variable or one toggle. Every defence is given with its cost and its failure
mode. The XFetch section is the strongest teaching on the subject I know of: it
derives e^(1/β) and shows that traffic drops out, then checks the result in
Figure 9 and on a real Redis. It ends with a decision procedure a practitioner
can apply key by key.

## What I checked

**Figures, all ten, used as a reader would** (desktop light, 375 px dark;
captures in `final-screens/`, each figure in both themes at 1280 and 375 px,
plus interaction captures in the session scratchpad):

- Fig 1: at rates 5, 15 and 40 there were 7, 16 and 46 queries per expiry. That
  is consistent with 1 + r × δ and the random arrivals the caption describes.
  Mid-stampede (t ≈ 3.6 s) misses visibly stream to the database and the
  "queries running" count climbs.
- Fig 2: at 100, 500 and 1,000 a second the pool was busy until 0.40, 1.2 and
  2.2 s, and the other page waited 0, 0.32 and 0.90 s. All match the prose and
  the r × δ² / c arithmetic.
- Fig 3: mid-stampede, the waiting slots beside each process are visible and the
  latest expiry shows 4 queries. Switching to "every request queries" gives 16.
- Fig 4: stepped 1–11. The commands match the code and the replies match my own
  run (below).
- Fig 5: with the lock there was 1 query per expiry and the slowest response was
  1.4–1.5 s. Single-flight gave 4 queries and 1.1 s. Both match the prose.
- Fig 6: stepped through to the end with DEL (10 steps, C takes a third lock)
  and with DELEX (A's release replies 0). On a phone the steps can still be
  followed.
- Fig 7: serving stale gave a slowest response of 0.2 s with 9–19 stale
  responses per expiry. Waiting for the lock gave 1.5 s. Both match the prose.
- Fig 8: I watched about 14 s of frames. Head starts that reach the expiry turn
  brown, numbered rebuild bars appear in the lanes, and "New copy stored: N
  rebuilds for this expiry" holds for a moment. β = 0.5 and β = 2 behave as the
  prose says.
- Fig 9: β = 2 at 100 gives 1.65 against 1.65. β = 1 at 10 and at 10,000 gives
  2.72 and 2.73. β = 0.5 at 10 falls to 5.60 with 51% of expiries reached, which
  the prose and the text alternative both acknowledge.
- Fig 10: capacity 60 gives 21 s against 10 s, and 150 gives 6 s against 6 s.
  At the default, 37% of queries are duplicates and the queue peaks at 4.4 s
  against 1.5 s. All match the prose.

All ten text alternatives convey the same results as the figures. There were no
console or page errors and no horizontal overflow at 375 px in either theme.

**Primary sources:**

- **XFetch paper (PVLDB 8(8)).** Definition 3 counts the regenerations in
  [Z, Z+1). Theorem 7 states (e^λ − 1)(1/λ + 1/e) as an effectiveness bound.
  Lemma 16 is an upper bound. The text gives "e − 1/e ≈ 2.4". Figure 7
  (Goodreads, 10 s regeneration) shows about 3 at β = 1. The cascading-failure
  remark and the background-process objection are both in the paper. My own
  Monte Carlo of Definition 3 under Poisson arrivals gave 2.71 / 2.69 at β = 1
  (e = 2.72), 4.17 / 4.11 at β = 0.7, and 1.67 / 1.64 at β = 2, for n = 100 /
  1,000. So the article's e^(1/β), and its claim that the rate drops out, are
  right.
- **redis.io distributed locks page.** Both quotations are verbatim: "where a
  race condition from time to time is acceptable" and "Redis is not using
  monotonic clock for TTL expiration mechanism". The failover race is
  attributed to asynchronous replication.
- **valkey.io.** `DELIFEQ key value`, since 9.0.0, replies 1 or 0.
- **Facebook memcache paper.** Section 3.2.1 (leases, the narrower meaning of
  thundering herd, stale values after a delete) matches the article.
- **Other sources.** RFC 5861, Go `singleflight.Do`, PostgreSQL
  `statement_timeout` and MySQL `MAX_EXECUTION_TIME` (SELECT only, so "for
  reads" is right) are all described correctly.

**Redis 8.10.3** (port 7176, temporary directory, `--save ''`, shut down):

- `SET lock:trending tokA NX PX 5000` replied `OK`; a second `NX` replied nil.
- `DELEX … IFEQ tokB` replied 0; `DELEX … IFEQ tokA` replied 1, and the key was
  gone.
- `COMMAND DOCS DELEX` gives since 8.4.0.
- `PTTL` gives −2 for a missing key and −1 for a key without a TTL.
- `PEXPIRE trending 5000` on a 15 s key left 4995.
- `DELIFEQ` is an unknown command on Redis. This supports the article's warning
  to check which release command your server has.

**Code:** both Python listings are correct as written. In the lock version, the
re-read happens after the lock is taken, the release is in `finally` and checks
the token, and waiting is bounded. In the XFetch version, `1 − random()` avoids
`log(0)`, the test is `head_start < ttl_ms` (equivalent to "now + head start ≥
expiry"), and the write is in MULTI/EXEC. `float()` accepts the bytes that
redis-py returns.

**Measured numbers** in the prose (114/115/92, exactly 4, exactly 1, 206–230
ms, 535/523, 236/35 ms, 2.75 and 2.14, and 1,028/1,036 against 1,036 ms) all
match `evidence/stampedes.txt`.

## Blocking

None.

## Length

The article is about 6,500 words of prose plus two code listings and ten
figures. That is long, but the subject is deep. It has five defences, each with
a failure mode that changes what a practitioner builds, plus the delete-on-write
and cold-start cases that defeat some of them. Almost every section changes a
decision: whether a key can stampede, which defence, the lock expiry, the
waiting strategy, soft and hard expiries, β, and whether writes should delete or
mark stale. **The length is earned overall.** Three passages spend the reader's
time without changing what they would decide; together they come to about 350
words:

1. **"The paper's line, dotted, needs a word…"** (the Theorem 7 / Lemma 16
   paragraph in the XFetch section), together with the Lemma 16 detail in the
   Vattani source note. The decision content is one sentence: plan for about
   e^(1/β), about three rebuilds at β = 1, not the 2.4 often quoted from the
   paper. The proof-step diagnosis and "I have not confirmed this with the
   authors" are scholarship, not practice. Cut the paragraph to two sentences
   and move the proof argument to the evidence file. The dotted Theorem 7
   series in Figure 9 can stay as long as the caption explains it.
2. **The real-Redis XFetch paragraph** ("I ran the same logic… no request ever
   found the key missing"). About half of it explains why 2.75 and 2.14 are too
   noisy to confirm e. Keep only what the reader can use: the code works on
   Redis, the first rebuild began about 1.03 s before expiry as predicted, and
   no request missed.
3. **The Redlock and fencing-token tail** of the lock-limits list. The
   parenthetical definition of a fencing token defines something the reader is
   then told they do not need. End at "Never use it to guard something that must
   happen at most once, such as charging a card", and leave Redlock and
   Kleppmann to the Sources section.

The γ (Euler–Mascheroni) step in the derivation is borderline, but it is marked
as optional reading and is what the Figure 9 readout and the real-run check
use, so I would keep it.

## Minor

1. **Write marks the copy stale.** `PEXPIRE trending 5000` lengthens the life of
   a copy that already has less than 5 s left. That is harmless, but it
   contradicts "at most those 5 seconds". Suggest `PEXPIRE trending 5000 LT`
   (Redis 7.0+), which only ever shortens the TTL, or add a sentence saying
   why it does not matter.
2. **Lock code: the waiter's bound and the query timeout.** Waiters give up
   after 1 s, but the holder's query may run for up to 2 s. So a rebuild that
   is slow but succeeds still fails every waiter in the gap. Add one sentence
   saying that either the waiting bound should cover the query timeout, or the
   gap is accepted because serving stale covers it (as the closing
   recommendation does).
3. **"e − 1/e ≈ 2.4" against "2.35".** The prose quotes the paper's 2.4, while
   Figure 9's caption and text alternative say 2.35. Write "≈ 2.35 (the paper
   rounds to 2.4)" once.
4. **Figure 2 prose:** "the other 99 queries are already queued". At 200 ms,
   19 are running and 80 are waiting. Say "already sent".
5. **Closing summary:** "so readers never wait" overstates the case. Say "so
   readers do not wait while a copy exists". The very next clause covers delete
   and cold start, but the sentence on its own over-promises.
6. **Figure 5 glyphs:** the square means "Write or invalidation" in the shared
   legend, and here it also stands for `SET … NX`. The caption explains this,
   but a legend item in this figure ("square: write, including the lock") would
   let the figure stand alone.
7. **Figure 6 at 375 px:** the "slow query" and "query fails" notes cover the
   step numbers 2 and 6 on lane A. This is known, and it is in shared sequence
   code. Report it as a toolkit gap rather than fixing it locally.
8. **Figure 2 at 375 px:** the three marker labels ("Other page's query
   arrives", "New copy stored", "and gets a connection") crowd one another above
   the chart. Shorter phone labels ("other query", "stored", "gets
   connection"), or staggering them, would help.
9. **Fig 4 diagram:** the arrows carry commands but not replies (OK, nil, 1).
   The replies are the point of steps 3, 5 and 10. A short return label on the
   lane would let the diagram tell the story without the explanation box.
10. **Sources, first item:** this lists which figures are models and which are
    observed, which is good. It should also say that Figure 9's "simulated"
    values are exact samples from the Poisson model, as the caption does, so
    that the two descriptions agree.

## Earlier rounds

After forming this judgement I skimmed `repair-1.md`. Every required item it
lists is present in the rendered page:

- the 99.7% hit ratio
- the definition of H(y) and the reason H averages 1 at the first start
- the Theorem 7 framing
- the serve-stale re-check, with its measurement
- the write-delete section, the table column and the closing update
- Figure 8's one-cycle, numbered lanes and held result
- Figure 9's labels

The repair note asked that the stale, XFetch, write-delete, many-keys and
choosing sections be read rendered. I read them rendered, and they display
correctly in both themes and at 375 px.
