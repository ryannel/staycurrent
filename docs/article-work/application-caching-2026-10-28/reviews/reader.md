# Independent reader review

28 October 2026. Audience: an intelligent engineer new to application caching, progressing towards practical design and operation. Scope in this first instalment: the seven finished articles listed below. Versioned fills, operations and the assembled collection route are pending a separate completion of this same review.

## First editorial reading

Read the finished prose before opening the plans or canonical example. No author work notes or previous quality verdicts were consulted. Read the live introductory rendering and the figure text throughout the seven-article sequence; exercised representative controls on the introduction, placement, key encoding, delayed fill and source-admission figures. Inspected supplied rendered captures for desktop and mobile, both themes, including the difficult freshness and memory diagrams. These are quality observations, not a substitute for the coordinator's exhaustive control checks.

**No critical or medium editorial/teaching findings in these seven articles.** Their headings identify concrete questions, terms arrive with examples, and the explanations develop the same card rather than introducing disconnected hypothetical systems. The paragraphs are connected and the qualifications generally sit where they affect the decision.

The root's wrong-shop hit explains identity before the keys article develops encoding. Freshness first distinguishes the public card, read-your-writes and checkout promises, then uses the twenty-second delayed insertion to make the TTL limitation calculable. Its late-fill figure follows that established distinction rather than making concurrency a surprise footnote. Misses separates the lifetime of a caller from the lifetime of work, then moves from one key to six keys before explaining source admission. Memory's replay gives recency, frequency and a reuse filter different, inspectable outcomes; it also carries source cost and bytes through to the decision. The Redis article gives code beside each branch, instead of presenting an unexplained complete defensive wrapper.

Calibration used the fixed references' relevant prose and drawings: Sequence diagrams' waiting and background-worker/outbox development; Indexes' entry, B-tree, selectivity and read-count progression; Storage and durability's buffer slots, version copies, dirty-page counterexample and log sequence. The caching explanations can sit beside those examples in progression and practical judgement. There is less spatial information in several static supporting caching figures, but the important changing states and counters remain visible in the interactive sequences. The controls compare meaningful alternatives; they are not decorative animation.

## Findings

### R1 — Low, optional: draw the overlap directly in the supporting miss timelines

Locations: `src/components/application-caching/misses/Waiting.astro` (Figure 2) and `Lease.astro` (Figure 3), with their surrounding sections in `cache-misses.astro`.

The reader currently reconstructs overlap from labelled intervals and the chronological text rows. For example, Figure 2 prints A's 0–50 ms wait and L1's 0–100 ms work in separate boxes; Figure 3 states A's 0–120 ms and B's 90–140 ms work. Both already explain the correct outcome completely. Aligned duration bars could make the continuing loader and the thirty milliseconds of overlapping source work immediately visible, as the fixed Sequence diagrams waiting example does. This is optional visual polish, not missing understanding or a delivery gate.

## Subsequent teaching and continuity check

After the blind reading, consulted the relevant root/child planning briefs and the canonical example. The delivered seven articles serve their stated decisions. No missing prerequisite emerged from that comparison. North/P7/en-GB/GBP, 2000→2200 pence, revision 1→2 and representation v1 remain consistent; south and restricted views are labelled variations. P99's absence remains distinct from a failed source call. Thirty seconds consistently means insertion TTL in the baseline and an explicitly different observation-age policy in the stronger freshness discussion. The source remains authoritative and checkout is not reduced to an unprotected product read.

The seven pages earn their separation: fit and placement, identity and representation, validity over time, bounded missing work, retention under a byte budget, and concrete client integration answer different practical questions. Short reminders about expiry, checkout and cache errors preserve standalone reading rather than duplicating whole lessons. A judgement on total route cost and the final two owners remains pending.

## Evidence and limits

- Preview: `http://127.0.0.1:4327/review/application-caching/` and the six named child routes, served from the coordinator's current-seven build.
- Reference captures: `/private/tmp/application-caching-references/`; current figure captures: `docs/article-work/application-caching-2026-10-28/screens/`.
- This is an editorial/teaching review. It does not independently establish native Redis execution, library semantics, numerical correctness across every model state, or complete browser accessibility. Those need the separate practitioner and mechanical evidence.
- The coordinator reported a subsequent proportional-bar change to `benefits/Cost.astro` while this review was underway. The inspected older figure already explained the hit/miss distribution; confirmation of the changed rendering belongs to the coordinator's bounded visual check. The article prose hash below remains the reviewed one.
- Article/source provenance is recorded below. No article or component was edited by this reviewer.

## Reviewed article SHA-256

| Source | SHA-256 |
| --- | --- |
| `src/articles/application-caching/index.astro` | `47393f81e655ae836cbf1721b33f2c9e2dcc98de062bbd9b558cfbb3d76d442b` |
| `src/articles/application-caching/cache-benefits.astro` | `839ebca592bedba475b57ef98fe0b73041464fa955b64d36d9f316319be3b8c9` |
| `src/articles/application-caching/cache-keys.astro` | `3fd02a36f617182dcbad30701e7ee5cb99a3c1f9660205db3b691458ef922c88` |
| `src/articles/application-caching/freshness.astro` | `67daf3aaa3d035adbd36a87dc2dce52ebedc9e19d93fe61f73657a206574c264` |
| `src/articles/application-caching/cache-misses.astro` | `4eb1d9156d632574759bad26360cb0c2cad2be18841a0007f4585a5a8395182f` |
| `src/articles/application-caching/cache-memory.astro` | `5ddf411c66a99f04c43b3fc5d1359095a35246374b54c1a76b9aef6c1e2475ed` |
| `src/articles/application-caching/redis.astro` | `2fc83bcea2c811a205d30f66cb160362c60ba252b8936a232a6c1f1e44be4f37` |

## Continuation: final two articles

Read the finished `versioned-fills.astro` and `operating-caches.astro` bodies first, without their plans, author notes or earlier verdicts. Then read the corresponding planning briefs and the commission/tree for the teaching and collection check. Reused the first seven article judgements.

Versioned fills defines the limited promise before introducing the mechanism. The remembered-revision failure makes the missing-state problem concrete; the three-state record and the two publication/deletion orders explain why the token changes that result. Lost reservations, restored reservations and unheard source changes remain distinct. Operating a cache develops observations into actions through the same service: server hits versus usable answers, equal total latency with different causes, a lost deletion after promotion, and a namespace rollback whose data is no longer safe. Neither article turns into a general Redis administration course.

### R2 — Medium: the versioned experiment has no reader entry point

Location: `src/articles/application-caching/versioned-fills.astro`, `#exercise`, “Exercise the competing orders”.

The section originally reported a controlled native experiment and asked the reader to retain its counterexamples when testing an implementation, but provided no download or command for reproducing it. `practice/versioned_lab.py` existed and the preview download endpoint included practice files, yet the reader could not reach the demonstrated protocol from this article. Link the exact runnable entry point and its required companion file(s), with a command or concise practice instructions. This was a practical teaching gap, not a request to add another experiment. Status: resolved; see bounded confirmation below.

No other critical or medium prose/teaching finding in these two articles at this stage. Rendered confirmation and actual navigation are pending the complete preview refresh.

### Continuation source provenance

- `src/articles/application-caching/versioned-fills.astro`: `a3f7625e9329a63175271658bbe1856a848596f8c53527b38fd847de7f90d1c6`.
- `src/articles/application-caching/operating-caches.astro`: `ef70873709d643651d7d6f6ad6d1f423414f240e6e49e5a127d4b5f359231a65`.

## Assembled collection check

Compared the finished collection with the commission and tree, reusing the article readings above. The main route contains eight pages: introduction → benefits → keys → freshness → misses → memory → Redis → operations. Versioned fills is a ninth, optional page below freshness. The actual metadata and navigation code preserve that distinction: Next from freshness goes to misses; its child is offered separately, and the child returns to freshness. The live versioned page confirmed its parent link. The root links directly to each practical subject at the point its question arises. The coordinator separately reports successful nine-route build/link checks.

The order develops reuse and identity before validity, then bounded rebuilding and retention before the implementation and operating decisions. The optional protocol depends on freshness but does not become a prerequisite for ordinary bounded cache-aside. Its link to misses supplies waiting policy without copying the scheduling lesson. Operations uses the established contracts and signals to choose actions; it does not require a general distributed-systems or Redis administration course.

For a newcomer, the complete foundation route costs eight openings. A focused question can use the introduction plus its owner: identity, freshness, source protection or retention each has a two-page route, with the protocol adding a third only when conditional publication is needed. Those focused routes are not substitutes for the full implementation requirements. No merge would remove an opening without combining distinct decisions or making a targeted route substantially longer.

No substantive coverage, ownership, duplication or prerequisite finding. Each page contributes something that cutting it would lose: the fit experiment; complete answer identity; time and revision contracts; bounded source work; byte/value retention; executable client control flow; diagnostic and recovery decisions; and, optionally, conditional publication under reordered work. The repeated price, hit/miss and source-authority facts are compact reminders needed for independent entry. Root previews and operations' reused 90%-hit example perform different jobs: orientation versus diagnosis and action.

## Bounded repair confirmations

- **R2 source repair confirmed.** The beginning of `#exercise` now links `versioned_lab.py` and `cache_lab.py`, states the Python/local-Redis requirements and absence of Python packages, gives the exact JSON-producing command, and explains the owned temporary instance and output. The neighbouring schedule table and counterexamples still follow naturally. The coordinator owns final rendered download checks and execution verification.
- **R1 source repair confirmed.** Waiting now aligns the 0–50, 20–100 and 0–100 ms durations. Lease now aligns 0–80, 0–120 and 90–140 ms, with the 90–120 ms overlap outlined. The surrounding reasoning and later source-accounting lessons are unchanged. Rendered confirmation awaits updated captures.
- Browser limitation in this continuation: IAB was unavailable; Chrome opened the completed versioned article and reached its token-deletion state (step 5/7), but subsequent operations repeatedly timed out. Further current visual confirmation will use coordinator-supplied captures rather than claiming those interactions completed.

Repaired versioned article SHA-256: `a3f7625e9329a63175271658bbe1856a848596f8c53527b38fd847de7f90d1c6`.

## Completion: final rendered confirmation

The editorial, teaching and assembled collection review is complete. **No unresolved critical or medium reader findings.** R2 is resolved by the source repair above and the coordinator's reported verification that all seven served downloads are byte-identical to their source files. R1 is resolved as optional visual improvement; it never constituted a gate.

Inspected the final supplied captures: versioned Figure 1 at 1280/light and 375/dark; operations Figure 1 at 375/dark, Figure 2 at 1280/light, Figure 3 at 1280/dark and Figure 4 at 375/light; misses Figure 2 at 1280/light and Figure 3 at 375/dark; benefits Figure 3 at 1280/dark. Labels, controls, captions and the represented relationships remain legible in those views. Versioned fills separates authoritative revision, cache state and publication result; operations' latency bands show where equal totals differ, its failover columns distinguish source and replicas, and its rollout figure makes traffic, space and admitted source work visible together. These reinforce the surrounding explanation rather than merely adding movement. The supplied screenshots establish initial-state layout, not every animation state; earlier source/control observations and the coordinator's separate mechanical checks retain their stated roles.

The two repaired miss figures now show the continuing work and overlapping source reads directly on aligned time scales, including the 90–120 ms interval on a narrow dark view. The benefits bars show the hit/miss latency difference on one common scale alongside the ordered requests used for p95. No further reader repair is needed.

Final capture provenance: `evidence/render-collection.json`, captured at `2026-10-28T09:40:37.290Z`, records the nine reviewed article hashes and the full 36 page/theme/width combinations. SHA-256: `b6b0fbaaa21353650f0ccd097fcfae751ca8bb369cb421d69c2493c1d933694c`. The final two article hashes remain those recorded above. Bounded component provenance:

- `misses/Waiting.astro`: `f9f19efaa0c26327e4deee3a9bf00bc6c8a6e5136cdd8f5dcc206865f3ec32eb`.
- `misses/Lease.astro`: `6a405cf404f735de1fa51626dd77b638d88d56b4706d1dde3758d1000b50a8f7`.
- `benefits/Cost.astro`: `215b1316e8ecba60704ed27f41d407c4a2cd8a7550de2aca3b038f14aba11da7`.

The independent source-reading and sampled visual perspective remains separate from technical review, native execution and exhaustive browser checks. No article/component changes were made by this reviewer, and no authors' work notes or verdicts were used to supply the first editorial judgement.
