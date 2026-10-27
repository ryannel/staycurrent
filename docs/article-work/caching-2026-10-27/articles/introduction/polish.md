# Polish after final review round 2: introduction

Date: 27 October 2026. Source review: `review-final-2.md`. Nothing committed.

## B1 (blocking): fail-open code retried ten times

Verified first, then changed the prose. redis-py 8.1.0 in a Python 3.14 venv
(`scratchpad/venv-intro`), Redis 8.10.3 on port 7121 (temporary directory,
`--save ''`), script `scratchpad/b1/failopen_intro.py` running the article's
`product_page()` verbatim. Commands, source lines and timings are appended to
`evidence/introduction.txt` under "B1 fix".

| Case | Corrected code (`retry=Retry(NoBackoff(), 0)`) | Previous code (default retry) |
|---|---|---|
| Redis up | 9.5 ms first (miss + connect), then 0.3–0.6 ms | — |
| Redis stopped (refused) | 0.1–0.2 ms (21 ms first call, warm-up) | 7.8–8.8 s a page |
| Unroutable 10.255.255.1 | 104–140 ms (50 ms GET + 50 ms SET) | 9.4–10.9 s a page |

Changes in `introduction.astro`:

- The client now imports `NoBackoff` and `Retry` and passes
  `retry=Retry(NoBackoff(), 0)` with the comment "no retries on the cache path".
- The third detail explains the default (five seconds an attempt, ten retries
  with pauses), gives the measured 8–9 s without the `retry` line, and the
  measured fail-open times (under 1 ms stopped, about 100 ms unanswered). It
  says why the cache path does not retry and links to article 8
  (`clients-and-pipelining`) for where retries help.
- Sources: the redis-py bullet now cites `_defaults.py` (timeouts, retry count,
  base and cap), `client.py` (the constructor's default `retry`), `retry.py`
  (errors retried) and `exceptions.py`. The measurements paragraph lists the
  fail-open timings and the retry policy's source.

## Minor fixes

1. Valkey: applied, using the reviewer's wording, shortened.
2. Figure 6: applied. "Almost no request does", "low orange band of misses".
   The text alternative now describes misses as a low band from about 10 to 45
   ms (checked against the model: miss p5 about 10–11 ms, p95 about 44–46 ms) and
   says the mean at 95% sits among the slowest hits.
3. Figure 4 text alternative: applied. The 78% is gone; it now says the last-100
   ratio wanders between about 65% and 80%.
4. Figure 10: applied both. The chart plots one-second averages (pairs of
   half-second samples) and the y domain is 0–150. Checked: the outage line now
   sits at about 90–125, clear of the top. Readouts and model unchanged.
5. Figure 7 caption: applied. Caption moved to the caption slot so
   `1/k<sup>s</sup>` renders as a superscript (confirmed in the DOM).
6. Momentum: applied the cheap version. "Where Redis sits among other caches"
   now follows the read-path section, so the reader sees a cache work straight
   after "What Redis is". The read path becomes Figure 2 and the cache layers
   Figure 3; the three prose references were renumbered, and the moved
   section's opening sentence now reads naturally after the read path.
7. TTL: applied in the prose ("treats it as gone and removes it") and in
   Figure 2's step text and text alternative, which also said "delete".
8. Figure 2: applied. A `nil` reply arrow (orange, miss) now follows the first
   `GET`; both `GET` requests are drawn grey (unanswered request), and the
   outcome is carried by the reply, so the two lookups read as the same shape.
   The sequence has nine positions instead of eight.
9. Figure 1: applied. The queries-a-second window is now 10 seconds
   (`model.mjs`, `repeatedWork`); the prose says the readout doubles "within ten
   seconds" so a reader does not judge it the moment they move the slider.

None skipped.

## Checks

- `node --test model.test.mjs`: 7 of 7 pass.
- Preview `CACHING_DRAFT_PREVIEW=1 pnpm dev --port 4481`; `shot.cjs` with
  `figure` into `screens/` (light and dark, 1280 and 375 px): 10 figures each,
  no console errors, no page errors, no horizontal overflow. The earlier
  contents of `screens/` were replaced.
- Extra state captures in `screens/state-*`: Figure 2 at the `nil` step and at
  the end, Figure 10 down and recovered. Figure 10 down read 0% / 103–115 / 63–76.
  The only console error seen was the Astro dev toolbar's audit fetch, which is
  dev-only. Vite hot-reloaded the page once during capture because another
  article's CSS changed; one capture was retaken for that reason.
- Dev server and Redis stopped; ports 4481 and 7121 free.
- Not run: `pnpm build` / `pnpm check`.
