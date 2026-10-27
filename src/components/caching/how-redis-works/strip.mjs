// A thread timeline drawn as SVG: one horizontal lane per thread, with a block
// for each stretch of work, marks for requests that had to wait, highlighted
// spans with labels, and a time axis. Used by every main-thread figure in the
// "How Redis works" article. A local extension of the shared toolkit, which
// draws systems and charts but not what a thread does over time.
import { svgEl } from '../shared/scene.mjs';
import { niceTicks } from '../shared/chart.mjs';

/**
 * threadStrip(container, {
 *   label,                          accessible name
 *   lanes: [{ id, label }],         top to bottom
 *   labelWidth = [118, 76],         desktop and compact (< 480 px)
 *   laneHeight = 30,
 *   format(t) -> axis tick text,    t in the caller's units
 *   axisLabel,
 *   minWidth = 1,                   the narrowest block in px
 * })
 * Returns { render({ from, to, blocks, waits, spans, now }) } where
 *   blocks: [{ lane, start, end, kind, label?, opacity? }]   kind is a caching kind or 'socket';
 *                                                       opacity draws a share of the time as a paler fill
 *   waits:  [{ lane, start, end, kind? }]               a thin bar: a request waiting
 *   spans:  [{ start, end, label, kind? }]              a bracket above the lanes with a label
 *   now:    draw a 'now' line at this time (optional)
 */
export function threadStrip(container, { label, lanes, labelWidth = [118, 76], laneHeight = 30, format = String, axisLabel, minWidth = 1 }) {
  container.replaceChildren();
  container.classList.add('thread-strip');
  const svg = svgEl('svg', { class: 'cache-svg', role: 'img', 'aria-label': label }, container);
  let width = 0;
  let last = null;
  const spanRow = 34;

  const draw = data => {
    last = data;
    if (!width) return;
    const { from, to, blocks = [], waits = [], spans = [], now } = data;
    const compact = width < 480;
    const left = compact ? labelWidth[1] : labelWidth[0];
    const right = width - 10;
    const top = spans.length || data.reserveSpans ? spanRow : 6;
    const lanesH = lanes.length * (laneHeight + 8);
    const height = top + lanesH + (axisLabel ? 44 : 26);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.replaceChildren();
    const x = t => left + ((t - from) / (to - from || 1)) * (right - left);
    const laneY = id => top + lanes.findIndex(l => l.id === id) * (laneHeight + 8);

    // Lanes: a label and an empty track (the thread is idle where nothing is drawn).
    for (const lane of lanes) {
      const y = laneY(lane.id);
      svgEl('rect', { class: 'strip-track', x: left, y, width: right - left, height: laneHeight, rx: 2 }, svg);
      const text = svgEl('text', { class: 'strip-lane', x: left - 8, y: y + laneHeight / 2 + 4, 'text-anchor': 'end' }, svg);
      text.textContent = compact && lane.short ? lane.short : lane.label;
    }

    // Blocks of work. Very short blocks are drawn at least `minWidth` px wide so they stay
    // visible; a figure that must show time to scale passes minWidth 0.
    for (const b of blocks) {
      if (b.end < from || b.start > to) continue;
      const x0 = Math.max(left, x(b.start));
      const x1 = Math.min(right, x(b.end));
      const y = laneY(b.lane);
      const socket = b.kind === 'socket';
      svgEl('rect', {
        class: socket ? 'strip-block strip-socket' : 'strip-block',
        'data-cache-kind': socket ? 'neutral' : b.kind,
        x: x0, y: y + (socket ? 6 : 2), width: Math.max(minWidth, x1 - x0), height: laneHeight - (socket ? 12 : 4),
        'fill-opacity': b.opacity,
      }, svg);
      if (b.label && x1 - x0 > b.label.length * 7.4 + 12) {
        const t = svgEl('text', { class: 'strip-block-label', x: (x0 + x1) / 2, y: y + laneHeight / 2 + 4, 'text-anchor': 'middle' }, svg);
        t.textContent = b.label;
      }
    }

    // Waiting requests: a thin bar along the bottom of the lane with a dot where the wait began.
    for (const w of waits) {
      if (w.end < from || w.start > to) continue;
      const x0 = Math.max(left, x(w.start));
      const x1 = Math.min(right, x(w.end));
      const y = laneY(w.lane) + laneHeight - 3;
      const g = svgEl('g', { class: 'strip-wait', 'data-cache-kind': w.kind ?? 'client' }, svg);
      svgEl('path', { d: `M${x0} ${y}H${Math.max(x0 + 1, x1)}` }, g);
      if (w.start >= from) svgEl('circle', { cx: x0, cy: y, r: 2.6 }, g);
    }

    // Labelled spans above the lanes.
    for (const s of spans) {
      const x0 = Math.max(left, x(s.start));
      const x1 = Math.min(right, x(s.end));
      const g = svgEl('g', { class: 'strip-span', 'data-cache-kind': s.kind ?? 'neutral' }, svg);
      svgEl('path', { d: `M${x0} ${spanRow - 6}v-6H${Math.max(x0 + 1, x1)}v6` }, g);
      const t = svgEl('text', { x: Math.min(Math.max((x0 + x1) / 2, left + 60), right - 60), y: spanRow - 16, 'text-anchor': 'middle' }, g);
      t.textContent = s.label;
    }

    if (now !== undefined && now >= from && now <= to) {
      svgEl('path', { class: 'strip-now', d: `M${x(now)} ${top - 4}V${top + lanesH - 4}` }, svg);
    }

    // Time axis.
    const axisY = top + lanesH;
    svgEl('path', { class: 'cache-axis', d: `M${left} ${axisY}H${right}` }, svg);
    for (const v of niceTicks(from, to, compact ? 3 : 6)) {
      const tx = x(v);
      svgEl('path', { class: 'cache-axis', d: `M${tx} ${axisY}v4` }, svg);
      svgEl('text', { class: 'cache-tick', x: tx, y: axisY + 17, 'text-anchor': 'middle' }, svg).textContent = format(v);
    }
    if (axisLabel) svgEl('text', { class: 'cache-axis-label', x: (left + right) / 2, y: height - 4, 'text-anchor': 'middle' }, svg).textContent = axisLabel;
  };

  const check = () => {
    const w = Math.round(container.clientWidth);
    if (w && w !== width) { width = w; if (last) draw(last); }
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return { render: draw };
}

/**
 * Wraps a model whose clock runs in microseconds so that mountSim(), which
 * advances by wall-clock milliseconds, runs it at `perMs` microseconds of Redis
 * time for each millisecond on screen.
 */
export function scaled(model, perMs) {
  const inner = model.sim;
  return {
    ...model,
    inner: model,
    sim: {
      advance: ms => inner.advance(ms * perMs),
      get now() { return inner.now; },
    },
  };
}
