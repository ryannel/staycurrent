# Scaffold and figure toolkit report, 27 October 2026

Nothing is committed. Every collection entry is `planned`, so the normal build
contains no caching pages.

## What exists

### Publishing scaffold

- `src/lib/caching-collection.ts` holds the twelve entries in reading order, as
  `{ slug, title, description, status, type }`. `type` drives the title line:
  Introduction, Deep dive, or Worked example for article 12. The module also
  exports `cachingHome`, `cachingTitle`, `cachingHref(slug)`,
  `publishedCaching()` and `cachingListTitle(entry)`.
- `src/layouts/CachingArticle.astro` contains:
  - the eyebrow "Application caching with Redis";
  - a `TitleLine` showing the entry's type;
  - an `ArticleBody` with its contents list;
  - a closed collection switcher. Published entries are linked. Planned entries
    are plain text marked "planned". Under preview, planned entries that have a
    draft file are linked and marked "draft".
  - a previous/next pager among published entries only;
  - the final "Sources and further reading" `<h2>` in a closed `<details>` at
    the foot. It reuses the relational splitter in
    `src/lib/relational-rebuild-sources.ts`.
  - for drafts, a "Draft, not yet published" line, `noindex, nofollow` and
    `data-pagefind-ignore="all"`.
- `src/pages/learn/databases/caching/[...slug].astro` renders
  `src/articles/caching/<slug>.astro`, or `introduction.astro` for slug `''`,
  through a lazy `import.meta.glob`.
  - Normal builds generate only `published` entries. The build fails if a
    published entry has no file.
  - With `CACHING_DRAFT_PREVIEW=1`, planned entries that have a file render as
    drafts at their real URL. The toolkit bench renders at `/learn/databases/caching/toolkit/`.
- `src/lib/reading.ts` adds published entries to the reading list, with group
  "Application caching with Redis" and keywords including Redis and cache. That
  gives them the directory, Pagefind indexing and search subject. Breadcrumbs
  read Home / Databases and storage / Application caching with Redis / article.
  The collection does not use `collection-order.ts`, because the layout renders
  its own pager.

I tested this with a temporary `introduction.astro` and then deleted it:

- As a draft under preview, it showed the draft line and noindex, and the
  switcher marked it "draft".
- Marked published in a normal build, it produced one page. All 13 site-check
  rules passed: title line, contents list, sources, figure labels and the rest.
  It joined `/articles/`, had `data-pagefind-body` and the correct subject, and
  showed breadcrumbs.

### Where links go when the introduction publishes

None of these files was edited.

- **Field guide:** in `src/pages/learn/databases/choosing.astro`, section
  `#caches`, add a "deeper" link after `<StorageSketch kind="caches" />`. Follow
  the pattern of other sections, e.g. `<p class="deeper"><a href="/learn/databases/caching/">…→</a></p>`.
- **Homepage:** in `src/pages/index.astro`, add the collection to the list
  around line 21, beside Relational and Object storage.
- **Search panel (optional):** add an "Explore a collection" card in
  `src/components/editorial/SearchPanel.astro`.

### Figure toolkit (`src/components/caching/shared/`)

The full API with examples is in `README.md` in that folder.

- **`tokens.css`:** `--cache-<kind>` and `--cache-<kind>-tint` for client, app,
  redis, database, hit, miss, stale, write, error and expiry. It uses the light
  theme, `data-theme="dark"` and a media-query fallback, as `global.css` does.
  Any element with `data-cache-kind` also gets `--kind`.
  - Every colour has at least 4.5:1 contrast on both surfaces in both themes:
    4.6 at worst in light, 5.3 in dark.
  - Outcomes also differ in shape: hit is a filled circle, miss a ring, stale a
    triangle, write a square, error a cross, expiry a dashed ring. Nodes differ
    by outline: browser windows, a server, a memory chip, a cylinder.
- **`shapes.mjs`:** the shapes, plus legend glyphs and labels.
- **Components:** `Term.astro` (with optional `mark` shape glyph),
  `SimFigure.astro`, `Slider.astro`, `Choice.astro`, `Readout.astro` and
  `Legend.astro`.
- **`SimFigure` modes:** `controls="live"` gives Play/Pause, Reset, an optional
  Step, Speed (0.25× to 4×) and a simulated clock. `controls="steps"` gives
  Play, Back, Next, Reset and a counter. `controls="none"` has no controls bar.
  Every mode has a closed "What this shows, as text" slot.
- **`sim.mjs`** is pure and runs in node. It provides:
  - `seededRandom`
  - a discrete-event `Simulation` (`at`, `after`, `every`, `cancel`, `advance`)
  - `poissonArrivals`, with a live rate
  - `zipf`, with `sample`, `probability` and `topShare`
  - `Movers`, for dots in flight
  - `LruCache`, with TTL
  - `Window` and `RecentRatio`
  - `quantile`, `logNormal` and `formatValue`
- **`player.mjs`:** `mountSim()` runs the requestAnimationFrame loop, the speed
  multiplier, play, pause, reset, step and parameter changes. It uses
  IntersectionObserver to pause off screen, pauses when the tab is hidden, and
  does not autoplay under reduced motion. `bindParams()` serves clockless
  figures and `setReadouts()` updates counters.
- **`scene.mjs`:** `createScene()` draws SVG at the container's real pixel
  width, so text is the same size at 375 px. It takes a layout function per
  width. Nodes support badges, load meters and queues; edges carry moving dots,
  with outbound and return trips offset to either side of the line.
- **`chart.mjs`:**
  - `lineChart`: sliding window, reference rules, dashed series;
  - `barChart`: horizontal;
  - `histogram`: stacked series, square-root count axis, percentile markers;
  - `niceTicks`.
- **`sequence.mjs`:** `sequenceFigure()` has lanes, arrows, notes, per-lane
  state values, an intro step and stepping. It wraps `src/components/figures/stepper.mjs`.
- **`demo/`:** the test bench (`ToolkitBench.astro`) and four example figures:
  - live cache-aside with a capacity slider and readouts;
  - a live warm-up chart;
  - a latency histogram with a bar comparison;
  - a stepped stale-write race.

  Their model is `cache-aside-model.mjs`. The numbers quoted in the bench's text
  alternatives were computed from that model.

## Checks

- `pnpm build` passes with 105 pages and all 13 rules OK. It produces no
  `dist/learn/databases/caching/`. `pnpm test` passes 23 tests.
- `node --test src/components/caching/shared/*.test.mjs` passes 14 tests. They
  cover:
  - seeded determinism;
  - the same model run in one call or in 3,600 frames;
  - Zipf probabilities and sampling against expected counts;
  - Poisson rate;
  - event order;
  - LRU eviction and expiry;
  - windows and quantiles;
  - ticks;
  - sequence state.
- `shot.cjs` ran at 1280 and 375 px in both themes and reported no console
  errors and no horizontal overflow. I looked at every screenshot. From them I
  fixed:
  - a class-name collision with relational figure CSS (prefix changed from
    `cf-` to `cache-`);
  - speed-label alignment;
  - the step-hold bar;
  - histogram ticks and marker labels;
  - sequence notes on phones;
  - a stray space after `<Term>`.
- A Playwright control script passes 33 checks. It covers:
  - autoplay;
  - pause holding the clock;
  - Step adding exactly 1,000 ms;
  - 4× and 0.25× speeds;
  - Reset returning to zero and clearing counters;
  - Space and Enter on Play;
  - the slider updating its output and the Redis badge;
  - pausing off screen and resuming;
  - the chart drawing, stepping and resetting;
  - clockless redraw;
  - sequence Next, Back, Reset, Play and the end state;
  - no autoplay under reduced motion, with Play still working.

  The dev server was stopped afterwards.

## Known limitations and decisions for the orchestrator

1. **Orphan client chunks.** Normal builds still emit unreferenced `_astro/*.js`
   and CSS for the test bench, and would do the same for draft articles'
   `<script>`s and styles. The cause is that the route imports them lazily, and
   `src/reference-articles` already does the same. No HTML links them and they
   are not indexed, but strings inside a draft figure's script are fetchable if
   someone guesses the hashed filename. Draft prose stays in the server bundle
   and does not ship.
   - A build-time guard (`import.meta.env`) did not prevent it.
   - Two fixes are possible: a filename convention with a negative glob, or a
     small Vite plugin. The orchestrator should decide whether that is worth it.
2. **Toolkit tests outside `pnpm test`.** `pnpm test` runs only the site check's
   tests. I did not change `package.json`; adding the toolkit tests there is
   optional.
3. **Ten colours under colour-vision deficiency.** Ten colours cannot all stay
   distinct: miss and stale are close under protanopia, app and database under
   deuteranopia. Shapes and labels carry those distinctions, and writers should
   keep them.
4. **What the model leaves out.** `LruCache` counts keys, not bytes. Scenes have
   no built-in network jitter or server queueing model; articles add these in
   their own models.
5. **Phone layout.** Sequence labels should stay at about 12 characters for
   four lanes at 375 px.

## Files created or changed

Created:
- `src/lib/caching-collection.ts`
- `src/layouts/CachingArticle.astro`
- `src/pages/learn/databases/caching/[...slug].astro`
- `src/components/caching/shared/`: `README.md`, `tokens.css`, `figure.css`,
  `shapes.mjs`, `sim.mjs`, `player.mjs`, `scene.mjs`, `chart.mjs`,
  `sequence.mjs`, `sim.test.mjs`, `SimFigure.astro`, `Term.astro`,
  `Slider.astro`, `Choice.astro`, `Readout.astro`, `Legend.astro`
- `src/components/caching/shared/demo/`: `ToolkitBench.astro`,
  `CacheAsideDemo.astro`, `LoadChartDemo.astro`, `LatencyDemo.astro`,
  `RaceDemo.astro`, `cache-aside-model.mjs`
- `docs/article-work/caching-2026-10-27/toolkit-report.md` (this file)

Changed:
- `src/lib/reading.ts`: published caching entries and breadcrumbs.

The user's uncommitted relational changes are untouched.

## Toolkit additions, 27 October 2026 (second round)

These close the gaps the writers reported. All of them are additive: existing
calls keep their signatures and defaults. Nothing is committed. Full examples are in
`src/components/caching/shared/README.md`, and figures 5 to 9 on the test bench
demonstrate each addition.

### New APIs

- **`lineChart`** (`chart.mjs`)
  - `bands: [{ id?, x0, x1, label?, kind? }]` and `chart.band(id, x0, x1, label, kind)`
    (`band(id, null)` removes one): translucent shaded x ranges.
  - `markers: [{ id?, x, label?, kind? }]` and `chart.mark(id, x, label, kind)`
    (`mark(id, null)` removes one): dashed vertical event lines.
  - Band and marker labels sit in non-overlapping rows above the plot.
  - `x.scale` / `y.scale: 'log'`, with `logTicks`, `logFloor`, `logCeil` and
    `logFormat`.
  - `ticks: [values]` and `tickStep: n` on either axis (`stepTicks`).
- **`histogram`**: marker labels never overlap. Each takes the first free row, and
  a third or later row lowers the plot. A label below the first row has a halo,
  so a marker line that crosses it does not obscure it. `placeLabels()` is the
  pure layout.
- **`barChart`**: `labels: 'beside' | 'inside'` (default `'above'`), and
  `labelWidth`. `'beside'` falls back to `'above'` when the label column would
  take more than 45% of the width.
- **`sequenceFigure`**: lanes take `short` (used below 480 px). A heading wider
  than its box wraps at its middle space, or shrinks to no less than 9 px.
  `splitLabel()` is the pure split.
- **`Slider`**: `labels` (value → text, also given as `aria-valuetext`) and
  `stops` (uneven values; `params[name]` is the stop). `paramText()` in `sim.mjs`.
- **Time units**
  - `SimFigure timeUnit="us" | "ms" | "s"` labels Step and the clock.
  - `mountSim({ timeScale, formatClock })`.
  - `poissonArrivals(sim, rate, fn, { unitsPerSecond })` and
    `exponentialGap(random, perSecond, unitsPerSecond)`.
  - `formatDuration()` and `clockText()`.
- **`timeline.mjs`**: `threadTimeline(container, { label, lanes, laneHeight,
  labelWidth, format, axisLabel, tickStep })`. Its `.render({ from, to, blocks,
  spans, now })` draws blocks (with `thin` for waiting bars) and spans whose
  labels do not overlap. It also exports `clipInterval` and `laneLabelWidth`.
- **`grid.mjs`**: `cellGrid(container, { label, cell, columns, minColumns,
  maxColumns, rowLabel, labelWidth })`. Its `.render(cells)` takes cells of the
  form `{ kind, fill: 'tint' | 'solid' | 'dashed' | 'empty', text, mark,
  highlight }`. `gridLayout()` is the pure layout.
- **`ActionButton.astro`** with `<SimFigure slot="actions">` adds buttons to the
  controls bar of live or steps figures.
  - `advance={ms}`: `mountSim` pauses and skips that much time.
  - `name="…"`: calls `mountSim({ actions: { name(model, api) } })`.

### Effect on existing figures

I took screenshots of the bench and all six drafts before and after the change,
at 1280 and 375 px in both themes. No page had console errors or horizontal
overflow, apart from a 500 error that came from an in-progress
`how-redis-works/ScanFigure.astro` import, not from the toolkit. Other agents
were editing the drafts during the comparison, so some figures differ for that
reason. I checked every figure that runs through a changed code path.

The only visible changes are the intended fixes:

- Lane headings that overflowed at phone width now fit:
  - "Application" in the introduction's stale-copy figure shrinks to 11.2 px.
  - "Pricing job" in the caching-patterns flush figure wraps onto two lines.
  - "Database" on the bench shrinks slightly.
- The introduction's latency histogram gives its second-row "mean" label a halo.

Two local overlays still work:

- `chartBand` in expiration-and-eviction inserts before `svg.children[1]`. The
  line chart keeps grid and rules as its first two children, so that band draws
  where it did before.
- The CacheOutage band reads the rule geometry, which is unchanged.

Checks run:

- A Playwright script (`scratchpad/pw/tk2-controls.cjs`) exercised Skip, the
  named action, the µs clock and Step label, slider stops and labels, the three
  bar modes, histogram rows and the existing race figure: 16 checks, all pass.
- `node --test src/components/caching/shared/*.test.mjs` passes 24 tests, 10 of
  them new (`extras.test.mjs`).
- The dev server is stopped.

### Not done

- I did not replace the local stand-ins (`strip.mjs`, `draw.mjs` `cellGrid` and
  `chartBand`, the outage band, the intro Skip button). Writers can move to the
  shared versions when convenient.
- `lineChart` still has no point markers or direct line labels.
- A `window` x axis cannot be logarithmic.
