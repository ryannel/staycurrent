# Writer report: Caching patterns (article 2)

Article: `src/articles/caching/caching-patterns.astro` (draft; preview with
`CACHING_DRAFT_PREVIEW=1 pnpm dev`). About 5,240 rendered words without figure
text, roughly 21 minutes. Plan: `plan.md` alongside this report.

## Shape

Opening (the £39 kettle copy left in Redis after a price cut, and the two
questions the four pattern names answer), then: the cache-aside write path;
why delete is usual and what it costs (the k ÷ (k + 1) ceiling); write-through
(two meanings, TTL loss, write order); read-through (where the code lives, and
metastable failure); write-behind (coalescing, exposure r × T ÷ 2, `GETDEL`,
reordering, other writers); write-around and refresh-ahead; a failure table;
six questions for choosing, with a summary table; what you can now decide;
sources.

## Figures (six, all in `src/components/caching/caching-patterns/`)

1. `WritePolicyFigure`: leave, delete or update the cached copy. The same
   seeded reads and writes in each case, with per-product event strips.
2. `CeilingFigure`: reads per write from 1 to 20. Delete versus update on one
   key, checking the k ÷ (k + 1) ceiling and the 1 ÷ (k + 1) unread updates.
3. `WriteOrderFigure`: steps through a failure between the two writes, with
   the database first or Redis first.
4. `OverloadFigure`: Redis is emptied under load. Cache-aside stays stuck at
   about 57% with a 62 s queue. Read-through recovers within about 15 s.
5. `WriteBehindFigure`: flush interval, Restart Redis button, lost-views count.
6. `FlushConflictFigure`: steps through a flush overwriting a pricing job's
   committed change.

The pure models are in `.mjs` files with five passing node tests
(`patterns.test.mjs`). Every control was exercised at 1280 px light and 375 px
dark: readouts match the prose and text alternatives, there is no overflow and
no console errors. Screens are in `screens/`, `screens/states/` and
`screens/states-phone-dark/`. `pnpm build` passes with every site-check rule ok.

## Evidence (`evidence/caching-patterns.txt`, Redis 8.10.3 on port 7102, `--save ''`)

These numbers were observed on a real server and are stated as observed in the
article:

- `DEL` returns 1, then 0.
- A plain `SET` drops the TTL to -1; `KEEPTTL` keeps 300.
- `SET … XX` on an absent key returns nil.
- `PTTL`.
- `INCRBY`, then `GETDEL` returns 8, then nil.
- Flush race:
  - Atomic `GETDEL`: 200,000 of 200,000 increments flushed, in two runs.
  - Split `GET` and `DEL`: 99,660 and 100,042 increments lost in two runs.
- Restart without persistence: `DBSIZE` 0.
- Redis stopped: "Connection refused".

All figure numbers are from the illustrative models, and the captions say so.

## Claims not verified, or caveated

- That open-source Redis never loads from or writes to a database itself. This
  is stated from documentation and general knowledge; no single primary
  statement was cited.
- The size of the split `GET`/`DEL` loss is exaggerated, because each command
  was a separate `redis-cli` process. The article says this.
- Redisson's write-behind defaults (1,000 ms delay, batches of 50) are taken
  from the redisson.pro documentation, not checked in the source.
- Bronson et al. (HotOS 2021): the article paraphrases the look-aside example
  (section 2.2) and the argument that fills should take priority (section 3).
  The model is simplified, and the article says so.
- macOS libc malloc caveat: no memory figures were used.

## Coverage-map overlaps and gaps

- Figure 4 uses metastable failure to show the read-through difference. How a
  system recovers (shedding load, warming) is left to Operating a cache.
- Delete versus update touches invalidation (article 5). Races are named and
  deferred, and read-your-writes is mentioned briefly.
- The TTL-drop trap with plain `SET` is shown with one observation. Article 4
  should own the full table of commands that drop or keep TTLs.
- Refresh-ahead with `PTTL` overlaps article 6, which owns the refresh rule.
- `SET IFEQ` (Redis 8.4) is not used here. Article 5 might want it for
  compare-and-set invalidation.
- Cross-references use full article titles, not numbers. They render as plain
  text until the target is published.

## Toolkit gaps (worked around locally; `shared/` was not edited)

- `sequenceFigure` cannot switch specs from a Choice. Worked around with
  `switch-sequence.mjs`.
- There is no per-key event-timeline renderer. Built `strips.mjs` and
  `patterns.css`.
- There is no slot or helper for a one-off action button such as a restart.
  Built ad hoc in `WriteBehindFigure`.
- There is no cross-article link that is safe for unpublished articles. Built
  `ArticleRef.astro`; the collection probably wants a shared version.
- `lineChart` has no vertical event markers, for example "Redis emptied".
- For test scripts: Playwright treats `aria-disabled` Next buttons as disabled,
  so they need `click({ force: true })`.

Nothing has been committed or pushed. The dev server and Redis 7102 are stopped.
