# Polish: Cache keys and cached values (from review-final-2.md)

Changes made (not committed):

1. Figure 8 encoding (`NegativeCache.astro`, article prose). Lookups for missing ids are now a
   crossed-out circle (∅) in the client grey, not a ring, so a ring means a miss throughout.
   Dots set `d` and paint each frame (the scene reuses elements); legend glyph matches. Text
   alternative, caption-adjacent prose and the article's two mentions now say "crossed-out
   circles (∅)" and "watch what each ∅ becomes at Redis: a green dot answered there, or an
   orange ring sent on to the database".
2. Figure 8 at 375 px: compact layout now stages Shoppers higher than the application and
   gives the first edge about 165 px (was about 40 px); dots no longer bunch.
3. Figure 4 (`Deploy.astro`): the simulation auto-pauses at 60 s, the chart's right edge.
4. Figure 2 (`MissingInput.astro`): added a SELECT arrow before the "rows" reply; text
   alternative updated.
5. Granularity prose: the "sorted by price" id list "can change whenever a price does, so it
   must be deleted on every price change unless you compare the order first".
6. One sentence after the key-parts list: later examples leave the `shop:` prefix off for brevity.
7. Rounded measured sizes: "about 75 bytes" and "about 115,000 bytes". The 115/233-byte hash
   figures are left as they are (the evidence file records the exact runs).
8. Figure 3 (`normalise-model.mjs`): from the "Fill defaults, lower-case" step the key is shown
   in house form, `shop:listing:v3:shoes:popular:GBP:1`. Counts are unchanged.
9. Figure 8 text alternative: "about one in a hundred".

Skipped: nothing; the collection-wide hit-dot colour finding is for the toolkit owner, as
the review says.

Checks: the 14 model tests in `models.test.mjs` pass; screenshots re-taken in
`screens/` (8 figures, light/dark, desktop/375 px) with no console errors (apart from
Astro's dev-toolbar audit message) and no horizontal overflow. Dev server stopped.
