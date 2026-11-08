# Focused technical confirmation

8 November 2026. Reviewed the uncommitted figure repairs on
`codex/cache-miss-visual-repair`, based on `0c0b831ddd08a1a70cecd402c0fe22eeebd28159`.
Scope: the five added scenes, changed material in the four existing scenes, their
captions and alternatives, and consistency with the unchanged article. This is an
informed practitioner check, not an independent visual reading or a whole-article
review.

**Result:** no critical or medium technical finding in the changed material. The
new calculations are correct under the stated illustrative assumptions. Two low
wording qualifications remain for the coordinator to consider.

## Findings

- **Low — `scheduling.mjs:32`, empty-cache view.** “Every key needs a fill now” can
  be read as requiring immediate population of the whole catalogue after restart.
  The scene needs the narrower understanding that every *requested* missing key
  needs an admitted fill. The article's recovery section expressly prioritises
  current demand and gives warming only a share of the allowance. The three shown
  keys make this a bounded ambiguity rather than a wrong algorithm.
- **Low — `limits.mjs:31`, normal and slow views.** “24 → 240 executing fills” is
  correct as an unconstrained constant-duration calculation, but the visible
  annotation omits that qualification. The actual PostgreSQL example ordinarily
  refuses connections before 240 simultaneous fills can execute. The alternative
  text already qualifies the pool total as potential connections before the
  database cap; carry that understanding into the visible calculation. Preserve
  the valid lesson that the individual pools are much larger than the intended
  source allowance. PostgreSQL 16 documents a usual total limit of 100, with three
  superuser slots by default. [Connection settings](https://www.postgresql.org/docs/16/runtime-config-connection.html)

## Checks and strengths to preserve

- **Coordination:** the local maps can leave up to twenty list computations.
  `5 × 20 = 100 ms` and `20 × 150 = 3,000 ms` compare summed work, explicitly
  distinguished from wall-clock time in the alternative. The lease view retains
  caller deadlines, fallbacks, possible expiry overlap and the distinction between
  ownership and freshness.
- **Lease:** the added owner check correctly rejects `tokA` when the lease is
  absent at A's late completion. Owner-checked release matches Redis's documented
  mechanism; the existing atomic publication script applies that condition to
  the write. The recorded `lease-run.txt` rejects both late operations, while
  `lease-run-stmt.txt` ends A at 181 ms before B begins. A source timeout is kept
  distinct from lease expiry. [Redis lock ownership](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- **Scheduling:** deriving the probability from XFetch gives
  `exp(-remaining / (Δ × β))`; with Δ = 0.15 seconds and β = 1, one second remaining
  gives **0.127263%**, correctly rounded to 0.13%. The overlapping selections are
  an illustration, not an asserted trace. Jitter changes the refresh points of
  different keys without moving their original hard limits or choosing one caller.
  The caption's 0.7-second lead and 2.8 attempts agree with `xfetch-run.txt`
  (0.701 seconds and 2.77). [XFetch, Figure 3 and §5](https://www.vldb.org/pvldb/vol8/p886-vattani.pdf)
- **Admission and limits:** two executing places plus one queued caller, a fresh
  deadline check, and fallbacks without additional source reads match the prose.
  Places are released on actual completion. Checked 150 − 10 = 140 ms;
  40 / 0.02 = 2,000 fills/s; 40 / 0.2 = 200; 2,000 × 0.2 = 400;
  1,200 × 0.02 = 24; 1,200 × 0.2 = 240; and 20 × 1 + 10 × 2 = 40.
  Constant durations are explicit, so the figure does not turn the example median
  into a measured mean. The outage percentages round the recorded 12.1128% full
  and 87.8175% refused, and 17,700 rounds 17,689 loads/s.
  [Little's law and concurrency](https://github.com/Netflix/concurrency-limits),
  [deadline checks](https://sre.google/sre-book/addressing-cascading-failures/)
- **Recovery:** 1,000 / 50,000 = 2%; the Zipf-1 request share is 65.6793%, reasonably
  described as about two thirds. The 20% catalogue-order result at five seconds
  is an expectation, clearly separated from the existing demand simulation.
  Both policies share the allowance; targeted warming is not dismissed.
- **Failed recovery:** the causal loop matches the cache example in the metastable
  failures paper. Three attempts at each of three layers yield at most 27; this is
  explicitly separate from the invented incident's mean of 2.7. The source-work
  bar correctly permits a query to outlive its client. PostgreSQL's default
  connection checks are disabled; the existing killed-client evidence confirms
  the possibility. The relief view requires observed latency and actual work
  before increasing traffic, rather than promising recovery from a hit ratio.
  [Metastable failures, §2.2](https://sigops.org/s/conferences/hotos/2021/papers/hotos21-s11-bronson.pdf),
  [retry multiplication](https://sre.google/sre-book/addressing-cascading-failures/),
  [PostgreSQL cancellation settings](https://www.postgresql.org/docs/16/runtime-config-client.html),
  [connection checks](https://www.postgresql.org/docs/16/runtime-config-connection.html)
- The stampede caption now distinguishes an intended capacity comparison from an
  enforced cap. “Budget” in the shared-load figure correctly separates available
  waiting time from elapsed waiting.

## Verification limits

Read the source diff and scene bodies, article prose, shared example, coverage map
and relevant original experiment outputs. Recomputed arithmetic with Python 3;
checked the linked primary sources on 8 November. No native experiment or
simulation was rerun: their code and reused results were unchanged. The shop's
capacity, incident numbers and selected timings remain illustrative, not new
observations or production guarantees. No browser, CUA, rendered layout or control
check was performed. No new visual-reader report was read. This report establishes
neither independent figure comprehension nor approval to publish.

## Version receipt

The assigned frozen HTML artefacts are recorded in `../evidence/frozen-v1.json`.
The figures-only HTML SHA-256 is
`d9e6219cde4ce09c780391a5788a70b320b23dea63859aaaa94524babdd7bcdb`.
The article HTML SHA-256 is
`e60448914912313dd1e8b5adc1703d3918e0c2ee6b2fcf3d81cfc5606920b304`.
This check inspected source rather than the rendered preview. The article source
SHA-256 at confirmation was
`db62b9c6376c4f039b34426aab7045a7308b06683208c8b1f6c878962d7b2930`.
The source-set SHA-256 was
`f342c06f4853735a9d4ba67430c8accae4c92047ffe1376587435f384947443f`:
sort the repository-relative paths of `src/articles/application-caching/cache-misses.astro`
and every `.mjs` in `src/components/application-caching/cache-misses/`, then hash
each UTF-8 path, a NUL, its bytes and another NUL in that order. HTML and Astro source
hashes identify separate artefacts. Only this review report was written by the
confirmer.

## Bounded wording repair confirmation

8 November 2026, subsequent working-tree check. Both low findings above are
**repaired and confirmed technically**; the original observations remain as the
record of the earlier version.

- `scheduling.mjs:32` now says “Each requested key needs a fill”. This removes the
  implication that restarting an empty cache requires immediate whole-catalogue
  warming, while retaining the need for admission on requested misses.
- `limits.mjs:31` now describes 24 → 240 fills as the number needed if no database
  limit intervened as fills slow. The added 12-per-server comparison is correct
  (`240 / 20 = 12`) and shows why a 50-connection pool does not enforce the intended
  allowance. The figure no longer presents 240 executing fills as an attainable
  result under the example database's default connection cap.
- `coordination.mjs:23` replaces the visible “maps” with “servers”. The added
  `250 requests/s × 20 ms ≈ 5 copies` supplies the arrival-rate estimate before
  `5 × 20 ms = 100 ms of source work`. Its units and approximation are sound, and
  the alternative still distinguishes total work from elapsed time. The existing
  lease and freshness qualifications remain intact.
- `admission.mjs:37` now explicitly includes joined callers in the 12% receiving
  full cards. Its caption identifies the outage counts as the shop's 50,000-card
  simulation and explains why callers can join fills. “Too little time remains”
  correctly names the case with 8 ms left for an illustrative 20 ms fill; it no
  longer implies that the deadline has already expired.

No new technical finding. This confirmation covers the changed labels, caption,
alternatives and their surrounding source only. It does not repeat the unchanged
source checks or establish rendering or visual comprehension. No browser was
used, and no article or figure source was edited by the confirmer.

The new source-set SHA-256, computed by the same recipe above, is
`5f8e14e0a22fb019c529791371ed6264c39b404c15b35fcd863c6d168078d576`.
The Astro article source hash remains
`db62b9c6376c4f039b34426aab7045a7308b06683208c8b1f6c878962d7b2930`.
`frozen-v1.json` still records the original two HTML hashes above; this is a
confirmation of later working-tree source, not a claim that the frozen visual
reader received these wording repairs.
