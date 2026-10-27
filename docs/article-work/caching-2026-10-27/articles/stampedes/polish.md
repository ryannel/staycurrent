# Polish: Cache stampedes and the thundering herd

Applied from review-final-2.md (10 minor fixes and 3 cuts). Article file: `src/articles/caching/stampedes.astro` (7,705 to 7,638 words of source including markup).

## Minor fixes

1. Write-marks-stale: `PEXPIRE trending 5000 LT`, with a sentence on the `LT` option (Redis 7.0+, only shortens). Checked on a local Redis (a 15 s key took 5000 to 4991; a longer value returned 0).
2. Lock section: added a paragraph before the waiting-strategy list saying the waiters' 1 s bound and the holder's 2 s query timeout must agree, or the gap is covered by serving stale.
3. Quoted the paper's bound as "e − 1/e ≈ 2.35 (the paper rounds to 2.4)", matching Figure 9.
4. Figure 2 prose: "already queued" became "already sent".
5. Closing summary: "readers never wait" became "readers do not wait while a copy exists".
6. Figure 5: legend item for the square now reads "Write, including the lock" (LockFigure.astro).
7. Figure 6 label overlap at 375 px: not fixed locally. It is in shared sequence code; report as a toolkit gap.
8. Figure 2: marker labels shorten below 480 px ("stored", "other query", "gets connection"), redrawn on resize (PoolFigure.astro).
9. Figure 4: arrow labels now carry replies (GET → nil, SET NX → OK, SET NX → nil, SET EX 60 → OK, DELEX IFEQ → 1, GET → hit) (sequences.mjs).
10. Sources: the first item now says Figure 9's values are sampled exactly from the Poisson model.

## Cuts

- Theorem 7 / Lemma 16 paragraph reduced to three sentences (the bound undercounts; simulation gives e^(1/β); plan for about three at β = 1). The Lemma 16 proof detail was removed from the Vattani source note, which keeps the Theorem 7 reference.
- Real-Redis XFetch paragraph: kept that the code works, the 1,028 / 1,036 ms head start against 1,036 predicted, and no request missed; the noise discussion is reduced to one sentence.
- Redlock / fencing-token aside removed; the lock section ends with "such as charging a card" plus a pointer to the Redis distributed locks page and Kleppmann's article. Both Sources entries kept.

## Checks

- `node --test src/components/caching/stampedes/*.test.mjs`: 10 pass.
- Rendered at 1280 and 375 px; Figures 2, 4 (stepped to the end) and 5 checked; no console or page errors. Edited prose confirmed in the rendered page. Dev server stopped; polish-screens deleted. Nothing committed.
