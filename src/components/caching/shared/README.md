# Caching figure toolkit

Shared pieces for the figures in the application caching collection. Build each
article's figures in `src/components/caching/<slug>/` from these parts. Do not
edit this folder from an article; if something is missing, extend it locally
and report the gap.

The test bench at `/learn/databases/caching/toolkit/` uses every part. Run
`CACHING_DRAFT_PREVIEW=1 pnpm dev --port <n>` to see it, and read its source in
`demo/` as worked examples.

| File | What it gives you |
| --- | --- |
| `tokens.css` | The colour vocabulary, for light and dark themes |
| `shapes.mjs` | The shape that goes with each colour; legend glyphs |
| `Term.astro` | Coloured nouns in prose that match the figures |
| `SimFigure.astro` | The figure frame: number, title, controls, caption, text alternative |
| `Slider.astro`, `Choice.astro`, `Readout.astro`, `Legend.astro` | Parameter controls, live counters, a standalone legend |
| `ActionButton.astro` | A one-off action in the controls bar ("Skip ahead 5 minutes", "Restart Redis") |
| `sim.mjs` | Pure simulation: clock, seeded randomness, arrivals, popularity, a small LRU cache |
| `player.mjs` | Connects a model to the figure's controls in the browser |
| `scene.mjs` | SVG drawing of clients, servers, Redis and databases, with moving dots |
| `chart.mjs` | Live line chart, bar comparison and histogram |
| `sequence.mjs` | Stepped sequence diagrams for ordered interactions |
| `timeline.mjs` | Thread timelines: lanes with busy intervals over time |
| `grid.mjs` | Grids of cells: memory slots, cached keys, table entries |

## The colour vocabulary

Every figure and every `<Term>` uses the same meanings, so a reader who learns
them once can read any figure in the collection.

| Kind | Meaning | Dot shape |
| --- | --- | --- |
| `client` | A client, or a request not yet answered | small filled circle, grey |
| `app` | Application server | (node: a server with two slots) |
| `redis` | Redis | (node: a memory chip) |
| `database` | The database | (node: a cylinder) |
| `hit` | Cache hit | filled circle, full size |
| `miss` | Cache miss | ring |
| `stale` | Stale value | triangle |
| `write` | Write or invalidation | square |
| `error` | Error or dropped request | cross |
| `expiry` | Expiry | dashed ring |

Colours are in CSS custom properties: `--cache-<kind>` for lines, dots and text,
and `--cache-<kind>-tint` for pale fills. Any element with
`data-cache-kind="<kind>"` also gets `--kind` and `--kind-tint`, which is how
the scripts colour things. All ten colours have at least 4.5:1 contrast on both
page surfaces in both themes.

Ten colours cannot all stay distinct for readers with colour-vision deficiency
(miss and stale are close under protanopia; app and database are close under
deuteranopia; a grey request and a green hit are close under both). That is why
each outcome also has a shape, and nodes differ in outline and label. A pending
request and a hit are both filled dots, so they differ in two other ways: the
request is a small dot (`CLIENT_DOT_SCALE`, 0.65 of a hit's radius, from
`dotShape`), and the hit is the stronger colour, darker than the grey in the
light theme and lighter in the dark one. Draw dots with `dotShape` or `marker`
rather than your own circles so they keep these sizes, and call a request "a
small grey dot" in prose. Do not invent new colours or reuse one for another
meaning. When a figure needs a kind not listed, use `neutral` and a label.

## Prose: `Term`

```astro
---
import Term from '../../components/caching/shared/Term.astro';
---
<p>A <Term kind="hit" mark>hit</Term> returns from <Term kind="redis">Redis</Term>;
a <Term kind="miss" mark>miss</Term> goes on to the <Term kind="database">database</Term>.</p>
```

`mark` adds the kind's shape before the word. Use it the first time an outcome
appears in an article, so the link to the figure does not depend on colour.

## The figure frame: `SimFigure`

```astro
<SimFigure number={2} id="hit-ratio" title="Hit ratio and database load"
  legend={['hit', 'miss']} advance={1000}
  caption="Illustrative model: … What it leaves out: …">
  <Slider slot="params" name="capacity" label="Redis holds" min={0} max={100} step={5} value={20} unit="keys" />
  <Fragment slot="stats">
    <Readout name="ratio" label="Hit ratio" kind="hit" />
    <Readout name="reads" label="Database reads a second" kind="database" />
  </Fragment>
  <Fragment slot="text"><p>The same result in words …</p></Fragment>
</SimFigure>
<script>
  import { mountSim, setReadouts } from '../shared/player.mjs';
  document.querySelectorAll('[data-figure-id="hit-ratio"]').forEach(root => { /* … */ });
</script>
```

Props:

- `number`, `title`, `id` (required). Numbers run 1, 2, 3 in page order; the site
  check enforces this. `id` is how your script finds the figure.
- `controls`: `'live'` (Play/Pause, Reset, Speed, a simulated clock), `'steps'`
  (Play, Back, Next, Reset, step counter) or `'none'`.
- `autoplay` (live, default `true`): starts when first on screen. It never
  autoplays when the reader prefers reduced motion.
- `advance`: milliseconds of simulated time for a "Step" button. Give every live
  figure one, so a reader who will not press Play can still reach each result.
- `speed`, `clock` (default `true`), `legend` (kinds or `{ kind, label }`),
  `size` (`'wide'`, the default, or `'text'`), `caption`.
- `timeUnit` (`'ms'`, the default, `'us'` or `'s'`): the unit your model's clock
  counts. It labels `advance` (`advance={50} timeUnit="us"` gives "Step 50 µs")
  and the clock ("450 µs", "4.50 ms", then seconds). See "Other time units".

Slots: default (inside `[data-scene]`, usually empty; your script draws into
it), `params`, `stats`, `after` (below the scene, for a second chart), `actions`
(one-off buttons in the controls bar), `caption` and `text`. The `text` slot is required: it is the closed "What this shows, as
text" alternative and must convey the same result as the figure.

## A live simulation

Keep the model pure (no DOM), in its own `.mjs` file, so it can be tested with
node. The model reacts only to scheduled events; never read frame timing in it.
That way the same seed gives the same run however the browser slices time.

```js
// model.mjs
import { Simulation, Movers, poissonArrivals, zipf, LruCache, Window } from '../shared/sim.mjs';

export function create(params, seed) {
  const sim = new Simulation({ seed });
  const keys = zipf(1000, 1);           // rank 0 is the most popular key
  const cache = new LruCache(params.capacity);
  const movers = new Movers(sim);       // dots for the scene
  const reads = new Window(5000);       // database reads in the last 5 s
  const model = { sim, params, cache, movers, reads };
  poissonArrivals(sim, () => model.params.rate, () => {
    const key = keys.sample(sim.random);
    movers.add({ edge: 'app-redis', duration: 300, kind: 'client', onArrive: () => {
      const hit = !!cache.get(key, sim.now);
      if (!hit) { reads.add(sim.now); cache.set(key, 'v', { now: sim.now, ttl: 30000 }); }
      movers.add({ edge: 'app-redis', reverse: true, duration: 300, kind: hit ? 'hit' : 'miss' });
    } });
  });
  return model;
}
```

```js
// in the figure's <script>
import { mountSim, setReadouts } from '../shared/player.mjs';
import { createScene, spread } from '../shared/scene.mjs';
import { create } from './model.mjs';

const scene = createScene(root.querySelector('[data-scene]'), {
  label: 'An application reading from Redis',
  nodes: [{ id: 'app', kind: 'app', label: 'Application' }, { id: 'redis', kind: 'redis', label: 'Redis' }],
  edges: [{ id: 'app-redis', from: 'app', to: 'redis' }],
  layout: (width, compact) => {
    const [a, b] = spread(width, 2, compact ? 50 : 120);
    return { height: 160, positions: { app: [a, 80], redis: [b, 80] } };
  },
});
mountSim(root, {
  seed: 7,
  create,
  update: (model, params) => { model.params = params; model.cache.resize(params.capacity); },
  render(model) {
    scene.dots(model.movers.active());
    scene.node('redis').set({ badge: `${model.cache.size} keys` });
    setReadouts(root, { reads: model.reads.rate(model.sim.now).toFixed(1) });
  },
});
```

`mountSim` calls `create(params, seed)` at the start and on Reset. When a
parameter changes it calls `update(model, params)`; return `false` (or omit
`update`) to rebuild the model instead. It pauses the animation while the figure
is off screen or the tab is hidden, and sets `data-sim-time` on the figure for
tests.

### Action buttons

`ActionButton` puts a one-off action in the controls bar of a live or steps
figure. With `advance`, `mountSim` pauses and skips that much model time. With
`name`, it calls your handler from `mountSim({ actions })` and redraws.

```astro
<SimFigure number={3} id="warm-up" title="…" advance={10000}>
  <ActionButton slot="actions" advance={300000}>Skip ahead 5 minutes</ActionButton>
  <ActionButton slot="actions" name="restart">Restart Redis</ActionButton>
  …
</SimFigure>
<script>
  mountSim(root, { create, render, actions: { restart: model => model.restartRedis() } });
</script>
```

In a steps figure (no `mountSim`), bind the click yourself:
`root.querySelector('[data-cache-action="restart"]')`.

### `sim.mjs`

- `seededRandom(seed)`: a function returning [0, 1), with `.int(n)`,
  `.range(a, b)`, `.pick(list)`, `.chance(p)`.
- `Simulation({ seed })`: `now`, `random`, `at(t, fn)`, `after(ms, fn)`,
  `every(ms, fn)` (returns a stop function), `cancel(id)`, `advance(ms)`,
  `runUntil(predicate)`.
- `poissonArrivals(sim, rate, fn, { unitsPerSecond = 1000 })`: random arrivals
  averaging `rate` a second; `rate` may be a function so a slider can change it
  live. Pass `unitsPerSecond: 1e6` when the model's clock counts microseconds.
- `exponentialGap(random, perSecond, unitsPerSecond = 1000)`, `normal`,
  `logNormal(random, median, spread)`.
- `zipf(n, s)`: `.sample(random)`, `.probability(k)`, `.topShare(count)` (the
  hit ratio of an ideal cache holding the `count` most popular keys).
- `Movers(sim)`: `.add({ edge, duration, kind, reverse, onArrive })`,
  `.active()` for `scene.dots()`.
- `LruCache(capacity)`: `get(key, now)`, `peek`, `has`, `set(key, value,
  { now, ttl })`, `delete`, `resize`, `keys()`, counters `evictions` and
  `expirations`. It counts keys, not bytes. Note that an LRU cache hits less
  often than `topShare` suggests (about 57% against an ideal 69% for 20 of 100
  keys at s = 1), because it also holds recently requested unpopular keys.
- `Window(span)`: `.add(t)`, `.count(now)`, `.rate(now)` per second.
- `RecentRatio(size)`: `.add(bool)`, `.value` over the last `size` outcomes.
- `quantile(values, q)`, `formatValue(value, format, unit)`.
- `paramText(value, { format, unit, labels })`: a slider's text, using `labels`
  first.
- `formatDuration(value, unit)` ("50 µs", "1.5 ms", "300 s") and
  `clockText(now, unit)`, for models in other time units.

### Other time units

A model may count microseconds (or seconds) instead of milliseconds. Tell the
three places that care:

```astro
<SimFigure … timeUnit="us" advance={100}>          <!-- "Step 100 µs", clock in µs -->
```

```js
poissonArrivals(sim, () => rate, onArrival, { unitsPerSecond: 1e6 });  // rate is still per second
mountSim(root, { create, render, timeScale: 0.1 });  // 0.1 µs of model time per screen millisecond at 1×
```

`timeScale` (default 1) is how much model time passes per screen millisecond at
1× speed; a microsecond model usually wants a value well below 1 so the reader
can see individual commands. `formatClock(now)` replaces the clock's text
entirely, for example to show time since a warm-up ended.

### `scene.mjs`

`createScene(container, { nodes, edges, layout, label })` draws at the
container's pixel width, so text stays the same size on a phone. The layout
function receives `(width, compact)` (`compact` is below 480 px) and returns
`{ height, positions }`; use `spread(width, count, margin)` for evenly spaced
columns. Check every scene at 375 px.

- Nodes: `{ id, kind, label, sublabel?, count? }`; `kind` is `client`, `app`,
  `redis`, `database` or `neutral`; `count` stacks clients. Update with
  `scene.node(id).set({ label, sublabel, badge, badgeKind, meter, meterKind,
  highlight, queue: [n, max] })`. `meter` (0 to 1) fills the shape, for load;
  `queue` draws waiting slots beside the node.
- Edges: `{ id, from, to, label?, dashed? }`. Dots travel `from` → `to`, or back
  with `reverse: true`; outbound and return trips run either side of the line.
- `scene.dots(list)` draws `{ edge, t, kind, reverse }` items.
- `scene.note(id, text, { anchor, kind })` places a label at `positions[id]`.

## Charts: `chart.mjs`

```js
const chart = lineChart(el, {
  label: 'Database reads per second', height: 220,
  x: { label: 'Simulated time (s)', window: 60 },
  y: { label: 'Database reads a second', domain: [0, 'auto'] },
  series: [{ id: 'reads', label: 'Database reads', kind: 'database' }],
  rules: [{ y: 120, label: 'Assumed database capacity', kind: 'error' }],
});
chart.push('reads', t, value); chart.render(); chart.clear();

const bars = barChart(el, { label, bars: [{ id: 'hit', label: 'Mean of hits', kind: 'hit' }], x: { label: 'Milliseconds', format } });
bars.set({ hit: 0.7 });

const hist = histogram(el, {
  label, bins: { min: 0, max: 30, count: 60 },
  series: [{ id: 'hit', label: 'Hits', kind: 'hit' }, { id: 'miss', label: 'Misses', kind: 'miss' }],
  x: { label: 'Latency (ms)' }, y: { label: 'Requests', scale: 'sqrt' },
});
hist.set({ hit: hitLatencies, miss: missLatencies });
hist.mark('p99', value, 'p99 14 ms');
```

Several line series get different dash patterns as well as colours, and a legend
appears above the chart. In a histogram with several series, the second is drawn
hollow (pale fill, coloured outline), so stacked layers such as hits and misses
differ in lightness as well as hue; list the series whose dots are filled first. Feed a chart from a model's samples in `render`, and
clear it when Reset gives you a new model (see `demo/LoadChartDemo.astro`).

For a figure with parameters but no clock, use `controls="none"` and
`bindParams(root, params => …)` from `player.mjs`.

### Bands, event markers, log axes and chosen ticks

```js
const chart = lineChart(el, {
  label: 'Database reads through an outage', height: 220,
  x: { label: 'Time (s)', domain: [0, 300], tickStep: 60 },       // a tick every 60 s
  y: { label: 'Reads a second (log scale)', scale: 'log', domain: [10, 1000] },
  series: [{ id: 'reads', label: 'Database reads', kind: 'database' }],
  bands: [{ id: 'outage', x0: 50, x1: 110, label: 'Redis down', kind: 'error' }],
  markers: [{ id: 'back', x: 110, label: 'Redis back, empty', kind: 'redis' }],
});
chart.band('outage', 50, 170, 'Redis down', 'error');   // move it; chart.band('outage', null) removes it
chart.mark('flush', 200, 'FLUSHALL', 'write');           // chart.mark('flush', null) removes it
```

- Bands shade an x range across the plot; markers draw a dashed vertical line.
  Their labels sit in rows above the plot, as many as they need not to overlap,
  so the plot gets shorter by 15 px for each row.
- `scale: 'log'` works on either axis. The domain must be above zero; a lower
  bound of 0 or `'auto'` becomes the power of ten below the smallest value.
  Ticks fall on powers of ten (with 2 and 5 between them over two decades or
  fewer). Values at or below zero are drawn at the bottom of a log y axis and
  left out on a log x axis. `window` is for linear x axes only.
- `ticks: [0, 60, 120]` sets ticks exactly; `tickStep: n` puts one at every
  multiple of n. Both work on either axis of `lineChart`.

### Bar label positions

```js
barChart(el, { label, bars, x, labels: 'beside' });   // or 'inside'; default 'above'
```

`'beside'` puts labels in a column to the left, so each bar takes 28 px rather
than 42; it falls back to `'above'` when the column would take more than 45% of
the width (set `labelWidth` to fix the column). `'inside'` writes the label over
the start of a taller bar with a halo, 30 px a bar.

### Histogram markers

Marker labels never overlap: each takes the first row where it fits. The first
two rows sit in the usual top margin; a third or later row lowers the plot by
14 px. `placeLabels(items, { left, right, gap })` is the pure layout, if your
own drawing needs it.

## Stepped sequences: `sequence.mjs`

```js
sequenceFigure(root, {
  label: 'A reader and a writer racing on one key',
  intro: 'Redis has no copy of user:42. The database holds v1.',
  lanes: [{ id: 'reader', label: 'Reader', kind: 'client' }, { id: 'redis', label: 'Redis', kind: 'redis' }, { id: 'db', label: 'Database', kind: 'database' }],
  initial: { redis: 'empty', db: 'v1' },
  steps: [
    { from: 'reader', to: 'redis', label: 'GET', kind: 'miss', explanation: 'The reader misses.' },
    { at: 'reader', note: 'paused', explanation: 'The reader pauses.' },
    { from: 'reader', to: 'redis', label: 'SET v1', kind: 'stale', state: { redis: 'v1 stale' }, explanation: '…' },
  ],
});
```

Use it inside `<SimFigure controls="steps">`. Steps are arrows (`from`, `to`) or
notes on one lane (`at`, `note`). `state` changes the value shown under a lane
heading; the changed value is shown in bold. Play advances at reading pace using
`src/components/figures/stepper.mjs`. Keep labels short (about 12 characters);
four lanes fit at 375 px.

A lane may have a `short` label, used below 480 px:
`{ id: 'app', label: 'Application server', short: 'App', kind: 'app' }`. A lane
heading still wider than its box wraps onto two lines at its middle space, or,
for a single word, shrinks (to 9 px at the least). Headings that fit are drawn
exactly as before.

## Thread timelines: `timeline.mjs`

For what threads, workers or connections do over time: one lane each, a block
for each busy interval.

```js
import { threadTimeline } from '../shared/timeline.mjs';
const timeline = threadTimeline(el, {
  label: 'The Redis main thread and waiting clients',
  lanes: [{ id: 'main', label: 'Main thread', short: 'Main' }, { id: 'clients', label: 'Clients waiting', short: 'Waiting' }],
  format: t => formatDuration(t, 'us'), axisLabel: 'Simulated time', tickStep: 100,
});
timeline.render({
  from: now - 400, to: now, now,
  blocks: [{ lane: 'main', start: 120, end: 420, kind: 'error', label: 'KEYS *' },
           { lane: 'clients', start: 130, end: 420, kind: 'client', thin: true }],   // thin: a slim waiting bar
  spans: [{ start: 120, end: 420, label: 'one slow command', kind: 'error' }],   // brackets above the lanes
});
```

Time is in your model's unit. Blocks are clipped to `[from, to]` and drawn at
least 1 px wide; a block's label shows only when it fits. The label column fits
the longest label (or `short` label on phones) unless you set `labelWidth`.
Call `render` from your `mountSim` render function.

## Grids of cells: `grid.mjs`

For memory slots, cached keys or table entries.

```js
import { cellGrid } from '../shared/grid.mjs';
const grid = cellGrid(el, {
  label: 'Grid of 24 cache slots',
  cell: { width: 64, height: 26, gap: 4 }, maxColumns: 6,
  rowLabel: (row, columns) => `slots ${row * columns + 1}–${row * columns + columns}`, labelWidth: 84,
});
grid.render([
  { kind: 'redis', fill: 'tint', text: 'user:1' },
  { kind: 'expiry', fill: 'dashed', mark: true },     // the kind's shape instead of text
  { kind: 'redis', fill: 'tint', text: 'user:3', highlight: true },
  { fill: 'empty' },
]);
```

- `fill`: `'tint'` (default), `'solid'`, `'dashed'` or `'empty'` (a free slot).
- Text shows only when it fits the cell. `mark: true` draws the kind's shape
  (hit circle, miss ring, expiry dashed ring …) so the cell does not rely on
  colour alone.
- Columns: as many as fit, bounded by `minColumns` and `maxColumns`, or a fixed
  `columns` count, which narrows the cells if needed. Square cells (no `height`)
  stay square.
- `gridLayout(width, count, options)` is the pure layout, if you draw cells
  yourself.

## Slider labels and uneven stops

```astro
<Slider slot="params" name="outage" label="Redis is down for" value={60}
  stops={[10, 30, 60, 120]} labels={{ 10: '10 seconds', 60: 'a minute', 120: 'two minutes' }} />
<Slider slot="params" name="replicas" label="Replicas" min={0} max={3} value={1} unit="replicas" labels={{ 0: 'none' }} />
```

- `labels` maps values to the text shown in the output; other values use
  `format` and `unit`. Screen readers hear the same text (`aria-valuetext`).
- `stops` makes the slider step through uneven values; `params[name]` is the
  stop itself, not its position. `value` must be one of the stops.

## Testing

```bash
node --test src/components/caching/shared/*.test.mjs
```

Add tests for your own model beside it (`src/components/caching/<slug>/*.test.mjs`):
check that the numbers your prose quotes come out of the model with its seed.

## Known limitations

- Figures carry no sizes in bytes, no network jitter and no server queues
  beyond `queue` drawing; models add these themselves when an article needs them.
- The histogram's x axis is linear (its count axis may be square-root); only
  `lineChart` offers log axes.
- Very long sequence arrow labels can still overlap at phone width; keep them
  short.
- `lineChart` has no point markers or direct line labels.
- Normal builds still emit unreferenced client scripts for draft articles and
  the test bench into `dist/_astro/`, as they do for `src/reference-articles/`.
  No page links them and they are not indexed, but strings inside a draft
  figure's `<script>` are technically fetchable.

## ArticleRef: references to other articles

Every mention of another article in the collection goes through
`ArticleRef.astro`, so it is a link only when that article can be read
(published, or a draft under `CACHING_DRAFT_PREVIEW=1`) and plain text otherwise.
Once an article is published, every reference to it becomes a link on the next
build without editing the articles that mention it.

```astro
import ArticleRef from '../../components/caching/shared/ArticleRef.astro';
<ArticleRef slug="invalidation">Article 5</ArticleRef> covers the races.
<ArticleRef slug="expiration-and-eviction" hash="eviction-policies">eviction policies</ArticleRef>
```

Never hand-write `href`s to other caching articles.
