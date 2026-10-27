# Polish after final review, round 2: Caching patterns

Minor fixes from `review-final-2.md`, applied to
`src/articles/caching/caching-patterns.astro` and
`src/components/caching/caching-patterns/OverloadFigure.astro`.

1. **Introduction back-reference.** Removed "As the introduction showed". The
   sentence now reads "That TTL is easy to lose: a plain `SET` replaces the
   key's expiry along with its value." The introduction does not show this, so
   the measured -1 that follows carries it.
2. **Figure 4 database load.** Prose: "about half busy" is now "less than half
   busy". Figure text alternative: "about 50 queries a second, half of what it
   can answer" is now "about 40 queries a second, well under half of what it
   can answer". The model gives 39-40 a second before the restart.
3. **Read-through "same commands".** Now "Redis sees the same work either way:
   a read that misses, then a write that fills the key."
4. **Azure attribution.** Now says Azure gives the same advice for
   security-sensitive data, for a different reason: a shared cache can expose
   it.
5. **ArticleRef import.** `caching-patterns.astro` now imports
   `components/caching/shared/ArticleRef.astro`. The local
   `caching-patterns/ArticleRef.astro` is not deleted: `expiration-and-eviction.astro`
   still imports it, and the brief bars editing other articles. Delete it once
   that article moves over.
6. **Read-through, Redis unreachable cell.** Now says some layers treat a Redis
   error as a miss and call the loader, and others rethrow it (Spring's default
   error handler does), so the read fails unless configured to fall through.
7. **Figure 4 cliff.** Added "A little less does not help: at 140 queries a
   second the model stays stuck." after the recovery sentence.
8. **Repetition (about 80 words cut; 6,447 to 6,368 words in the file).**
   - The 1 / (1 - h) paragraph is one sentence linking back to the introduction.
   - The write-through restart paragraph is folded into its table cell, with
     the Amazon attribution kept.
   - "What happens when Redis restarts?" now points to Figure 4 and articles 6
     and 11 instead of restating the three options.

## Checks

- Dev server on port 4482 with `CACHING_DRAFT_PREVIEW=1`, now stopped.
- Screens in `screens/` (light and dark, desktop and phone, six figures): no
  console errors, no horizontal overflow.
- Figure 4 model re-run: about 40 queries a second before the restart;
  abandoned-and-discarded hit ratio 54-58%, wait 62 s at 60 s; cached recovers
  by about 26 s. These match the prose.
- `node --test src/components/caching/caching-patterns/patterns.test.mjs`: 6
  pass, 0 fail. (Running `node --test` on the bare folder path fails with
  "test failed" and no detail; this is a runner quirk, not a test failure.)
