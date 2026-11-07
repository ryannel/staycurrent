# Scoped repair confirmation — P1–P4

Reviewed 7 November 2026 against the current source in
`/private/tmp/staycurrent-cache-misses-2026-11-07`, informed by
`practitioner-v1.md` and the coordinator's decisions in this work record's README.
This confirms the four accepted technical repairs, their surroundings and later uses;
it is not a fresh full-article review.

Reviewed source identities:

- `src/articles/application-caching/cache-misses.astro`: SHA-256 `b32ac56d936de34c64fbfbd9caf78272a3d77b458336f4f5a3da373aefc51edb`.
- `src/components/application-caching/cache-misses/recovery.mjs`: SHA-256 `b4d10a5e6fcd10bf330d74924d512048121726df58df54edd1abe8f862cc4912`.

## P1 — Confirmed: the prewarm assumption and provenance are explicit

Article lines 183–189 now distinguish the recorded demand simulation from the calculated
prewarm expectation. The prose states that catalogue order is independent of popularity
and qualifies the resulting request share as an average. The figure's source comment,
caption, alt text and text alternative repeat that distinction. The drawn linear curve
therefore has the stated interpretation rather than claiming to be a second simulation.

A fresh arithmetic check gives 50,000 / 2,000 = 25 seconds; five seconds fills 10,000
cards, or 20% of the catalogue. Under the stated independence assumption, each card has
the same 0.2 probability of inclusion, so expected covered request share is
`sum(popularity × 0.2) = 0.2`; it does not require uniform request popularity. The
20-second point is correspondingly 80%. In the supplied Zipf exponent-1 model, the top
2,000 cards carry 71.76% of demand, supporting the following paragraph's approximate
70% example. The top 1,000 carry 65.68%.

The preserved `evidence/sim/cold2.py` still runs demand mode only; its recorded output
supports the retained one-, two- and five-second demand figures and top-1,000 recovery
milestones. No new prewarming execution is implied. The later warning about omitting
expiry and sharing the source budget remains coherent. Rendering of the changed recovery
caption and text alternatives remains pending the final build.

## P2 — Confirmed: the stale-serving policy is separate from the native trace

The trace at article lines 43–47 no longer says B served an older list. Lines 104–106
introduce the older-list timeline as a supposition, which is the scenario Figure 3
illustrates. Line 108 explicitly says the experiment had no older list and that B waited
following the denied acquisition. This makes the transition from policy illustration to
recorded evidence clear.

The preserved `evidence/go/main.go` deletes the list and lease, attempts B's acquisition,
then sleeps; `lease-run.txt` records the denied acquisition at 11 ms, B's new lease at
212 ms, successful publication and release at 364 ms, A's rejected operations at 902 ms,
and B's final cached value. The condensed trace preserves those outcomes. The source
contains no stale read in this run, matching the corrected account. The separate wrapper
experiment still supports the earlier shared-load explanation, and the later source-timeout
and failure-rehearsal passages do not turn the hypothetical stale response back into an
observation. The valid ownership and timeout evidence is preserved.

## P3 — Confirmed: application and source populations are distinguishable

Article lines 216–218 now identify callers entering coalescing, loads started, source
attempts and successful cache fills as separate counts. Sixty entrants sharing one load
means 59 joined callers; a retry can make that one load issue two source attempts. This
is sufficient to distinguish saved loads from retry amplification without mistaking a
library's shared-result flag for a joined-caller counter. Redis lookups and the loader's
recheck are explicitly identified as a different population.

Queue delay, admission refusals and executing work are included, together with concrete
source-side views. PostgreSQL's [activity documentation](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)
identifies active backends and their current queries;
[pg_stat_statements](https://www.postgresql.org/docs/16/pgstatstatements.html) provides
accumulated execution counts. The existing `evidence/go/wrapper-run.txt` demonstrates why
these populations can differ: cancellation produces one started load, no completed query
and no remaining active query. The new passage preserves that distinction rather than
promising equality. It also fits the preceding retry, recovery and abandoned-work
arguments. The final useful-response categories retain the important distinction between
protecting the source and serving customers.

## P4 — Confirmed: both production alternatives now have a decision boundary

Article line 117 adds cache-native coordination after explaining the separate Redis
lease. The account of `N`, `W`, `Z`, CAS and `R` matches the memcached
[meta-protocol documentation](https://docs.memcached.org/protocols/meta/#atomic-stampeding-herd-handling):
miss placeholders, a recache winner, notification to later callers, conditional updates
and refresh selection while a value remains available. The practical decision is explicit:
check the cache's existing facilities before implementing a separate protocol. The
surrounding source-limit and freshness requirements still apply.

Article line 173 adds the failed-shard decision after whole-cache fallback and circuit
breaking. The hot-key risk from rehashing onto surviving servers and Gutter's reserve-pool
behaviour match §3.3 of [Scaling Memcache at Facebook](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf).
The distinction between a few failed servers and a widespread outage is retained. The
source-budget and serving-allowance sentences apply this article's existing constraints
to that alternative; they do not claim new Facebook measurements. The additions provide
the missing choices without requiring full implementations.

## Evidence and remaining limits

P1–P4 are confirmed with no remaining technical concern from these repairs. Existing
execution evidence was inspected and reused; no PostgreSQL, Redis or Go experiment was
rerun, and no benchmark was performed. Only the small arithmetic checks above were newly
executed. Primary-source checks were limited to the added metrics and production
alternatives. No browser or built output was used: those still represented v1 during
this check. No article or figure source was edited.

The changed recovery caption and text alternatives require rendered confirmation after
the final build. This report does not replace that check or the independent reader review,
and does not reopen unrelated findings or establish publication approval.

## Reader-repair follow-up — R1 and scoped teach-back

Reviewed 7 November 2026 from source only, against the exact reader findings supplied by
the coordinator. The article's SHA-256 is now
`edcd813101096c9b480becb9ebd520a7712371508821c2612bc0a20ff98a8bc2`;
`recovery.mjs` retains the identity recorded above. No browser or built output was used.

**R1 — Confirmed.** Article line 146 now permits the reduced card only when the page
already holds a name and picture that it may use. It explicitly prohibits another source
read for fallback and gives a quick error when no usable data exists. A permitted older
copy remains an option; the hard limit, unavailable-price label, prohibition on zero-price
or not-found fabrication, and authoritative checkout check are preserved. The preceding
admission refusal and the later outage, retry and rehearsal passages consistently use
this defined fallback; none promises a reduced card when the required data is absent.
The HTTP 503 example is appropriate to temporary overload under
[RFC 9110 §15.6.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.6.4).

**Low items — Confirmed.** The unexplained rough XFetch lead estimate has been removed;
lines 127–131 retain the algorithm, explanation and explicitly simulated results. The
preserved `evidence/sim/xfetch-run.txt` gives a mean lead of 0.701 seconds, mean count 2.77
and p99 count 11 for rate 400, duration 0.15 and beta 1, matching the rounded prose. The
fixed-jitter and empty-cache explanation still follows it coherently. The editorial-history
sentence is absent from the provenance section without losing the model/execution
boundary. The pool section now opens directly with 50 × 20 = 1,000 potential connections;
its later 24-to-240 work-in-progress argument and admission advice remain intact.

### Exit question 5 — Supported after repair

With beta 1, the first refresh started **about 0.7 seconds before expiry on average** in
the article's 2,000 simulated expiries. There were **about 2.8 refreshes per expiry**, with
**11 at the 99th percentile**. These are the list model's results, not universal XFetch
guarantees. A fixed refresh point with jitter and appropriate coalescing can suffice for
cheap fills such as P7: jitter spreads different keys but does not coordinate callers of
one popular key. Neither it nor XFetch solves an empty restart because no stored answer,
refresh point or previous computation time exists; source admission must bound the fills.
These answers are supplied by article lines 130–136. The deleted 0.6-second approximation
is unnecessary to answer the question.

### Exit question 6 — Supported after repair

Unrestricted fallback sends **20,000 attempted fills a second**, up from **1,200**, roughly
seventeen times the normal source demand. Per-process coalescing removes about **2,300
a second**, leaving **17,700**, nearly nine times the source allowance. With two executing
places and one deadline-checked waiting place per server, about **12%** receive full cards:
roughly 10% directly from admitted fills and two percentage points through joined callers.
These modelled outcomes remain explicit at article lines 167–169.

The other callers promptly receive a permitted older copy if available; otherwise a
reduced card **only if its name and picture are already available and still usable**, with
the price marked temporarily unavailable. Without usable data they receive an explicit
error. No fallback may start another source read, invent a price, or claim the product
does not exist. This follows the repaired paragraph at line 146 and resolves the prior
answer's unqualified assumption about the reduced card's data.

This is an informed, scoped answer check, not another blind teach-back. Retain the
independent v1 **Supported** marks for unaffected questions **1–4 and 7–10**, and the
P1–P4 confirmations above. No new execution was required; recorded XFetch evidence was
reused. The final recovery-caption rendering check remains pending.

## Final v2 rendering and prose confirmation

Reviewed 7 November 2026 at the reloaded local route
`http://127.0.0.1:4325/learn/databases/application-caching/cache-misses/`.
The article source, built HTML, extracted prose and both changed figure modules
independently match `evidence/v2-build.json`:

- Article: `60149b7292318a3230968e8c1c7941f2984a1e4ae08158ab31046421dd3b6aef`.
- HTML: `811bd8990fc8714abd6396701c326716f95440e4653f268d65666d56fe807400`.
- Prose: `5e8099dd366ea8798957389061e44feb64e21cdcb750f7a8ebc14aaeb8b95304`.
- Figure 1: `2b4202b9b31d965112f3ded41e84d4716fe88d9afbe682ac7488c3b2fe86424a`.
- Figure 5: `b4d10a5e6fcd10bf330d74924d512048121726df58df54edd1abe8f862cc4912`.

**R5 — Confirmed.** Figure 1's 600-millisecond marker now passes behind the capacity
label's paper halo, leaving the letters clear on desktop and phone in both themes. The
150-millisecond variant remains clear too. Both variants were observed from early
progress to their stable final frames in each combination below: 60 computations at
150 milliseconds and 240 at 600 milliseconds. The final frames retain the count, event
annotation and capacity comparison. No new collision or clipping was observed in this
scope.

| Layout and theme | Figure 1 | Figure 5 caption and expanded text alternative |
| --- | --- | --- |
| Desktop, 1488 × 973, light | Both variants and keyboard controls pass. [Slow final frame](../evidence/v2-stampede-desktop-light.jpg). | Readable, with the assumption and provenance visible. [Evidence](../evidence/v2-recovery-desktop-light.jpg). |
| Desktop, 1488 × 973, dark | Both variants and keyboard controls pass. [Slow final frame](../evidence/v2-stampede-desktop-dark.jpg). | Readable, with the assumption and provenance visible. [Evidence](../evidence/v2-recovery-desktop-dark.jpg). |
| Phone, 375 × 812, light | Both variants and keyboard controls pass. [Slow final frame](../evidence/v2-stampede-phone-light.jpg). | Wraps cleanly within the page. [Evidence](../evidence/v2-recovery-phone-light.jpg). |
| Phone, 375 × 812, dark | Both variants and keyboard controls pass. [Slow final frame](../evidence/v2-stampede-phone-dark.jpg). | Wraps cleanly within the page. [Evidence](../evidence/v2-recovery-phone-dark.jpg). |

Controls were activated with Enter/Space: scenario selection changed the picture and
pressed state; Replay restarted progress; Pause exposed Resume and stopped progress;
Resume continued it. Visible focus remained clear. At the phone width the controls
wrapped below the drawing, and measured document width remained 375 pixels. These are
observations of sampled initial, progressing, paused and completed states, not an audit
of every animation frame.

**P1 rendered confirmation — Complete.** Figure 5's caption visibly distinguishes the
simulated demand curve from the prewarm expectation in all four combinations. The
keyboard-opened text alternative explicitly says the prewarm curve is calculated and
explains independent catalogue order and the average request share. The updated image
alternative was also present in the rendered accessibility state. Caption, disclosure
and surrounding prose neither overlap nor clip. This completes the rendering check
marked pending in the earlier sections.

**Final prose refinements — Confirmed.** The XFetch sentence split preserves the
simulation's population and assumptions before giving the same 0.7-second mean lead,
2.8 mean refresh count and p99 of 11. It does not restore the unexplained rough formula.
The fallback's two paragraphs retain the prerequisite that the page already has a
usable name and picture, the explicit error when no usable data exists, and the ban on
another source read. The rendered text contains both refinements. R1 and R2 therefore
remain confirmed, and the scoped answers and Supported marks for exit questions 5 and
6 above still apply without a substantive change. All unaffected teach-back marks and
P1–P4 confirmations are retained.

**Limits and cleanup.** This was a targeted repair check, not a repeat review of all five
figures or the full article. The unchanged palette and contrast evidence in
`reader-informed-v1.md` is retained; contrast was not remeasured. Reduced-motion
emulation remains unavailable and reduced-motion behaviour remains untested. No
screen-reader software was run. The temporary viewport override was reset, the original
System theme restored, the text disclosure closed, and the browser released after its
completion summary. Only this report and screenshot evidence were written; no source
was edited. No accepted repair remains unconfirmed within the assigned scope.
