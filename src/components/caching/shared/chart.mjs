// Small live SVG charts: a time-series line chart, a horizontal bar comparison
// and a histogram with percentile markers. Each draws at the container's pixel
// width, labels its axes, and colours series with the caching kinds.
import { svgEl } from './scene.mjs';

/** Up to about `count` round tick values covering [min, max]. Pure; tested in node. */
export function niceTicks(min, max, count = 5) {
  if (!(max > min)) return [min];
  const raw = (max - min) / Math.max(1, count);
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * power).find(s => s >= raw) ?? 10 * power;
  const first = Math.ceil(min / step - 1e-9) * step;
  const ticks = [];
  for (let v = first; v <= max + step * 1e-9; v += step) ticks.push(Math.round(v / step) * step);
  return ticks.map(v => Number(v.toPrecision(12)));
}

/** A round upper bound at or above `value`, for auto-scaled axes. */
export const niceMax = value => {
  if (!(value > 0)) return 1;
  const ticks = niceTicks(0, value * 1.05, 4);
  const step = ticks[1] - ticks[0] || value;
  return ticks.at(-1) >= value ? ticks.at(-1) : ticks.at(-1) + step;
};

/** Ticks at every multiple of `step` (offset by `origin`) within [min, max]. Pure; tested in node. */
export function stepTicks(min, max, step, origin = 0) {
  if (!(step > 0) || !(max >= min)) return [min];
  const ticks = [];
  for (let k = Math.ceil((min - origin) / step - 1e-9); origin + k * step <= max + step * 1e-9; k++) ticks.push(Number((origin + k * step).toPrecision(12)));
  return ticks;
}

/**
 * Ticks for a logarithmic axis over [min, max] (both above zero): each power of
 * ten, with 2 and 5 between them when the range spans two decades or fewer, and
 * every other power when it spans more than eight. Pure; tested in node.
 */
export function logTicks(min, max) {
  if (!(min > 0) || !(max > min)) return [min];
  const lo = Math.floor(Math.log10(min) + 1e-9), hi = Math.ceil(Math.log10(max) - 1e-9);
  const decades = hi - lo;
  const multiples = decades <= 2 ? [1, 2, 5] : [1];
  const every = decades > 8 ? 2 : 1;
  const ticks = [];
  for (let p = lo; p <= hi; p += every) for (const m of multiples) ticks.push(Number((m * Math.pow(10, p)).toPrecision(12)));
  return ticks.filter(v => v >= min * (1 - 1e-9) && v <= max * (1 + 1e-9));
}

/** The power of ten at or below (logFloor) or at or above (logCeil) a positive value. */
export const logFloor = v => (v > 0 ? Math.pow(10, Math.floor(Math.log10(v) + 1e-9)) : 1);
export const logCeil = v => (v > 0 ? Math.pow(10, Math.ceil(Math.log10(v) - 1e-9)) : 10);

/**
 * Lays out text labels anchored at x positions so that none overlap: each label
 * is centred on its x (or anchored at its start or end near the edges) and takes
 * the first row where it clears the previous label by `gap` pixels.
 * items: [{ x, text, ... }]. Returns copies sorted by x with { anchor, start, end, row }.
 * Pure; tested in node.
 */
export function placeLabels(items, { left = 0, right = Infinity, charWidth = 7.3, gap = 14 } = {}) {
  const rowEnds = [];
  return [...items].sort((p, q) => p.x - q.x).map(item => {
    const w = String(item.text ?? '').length * charWidth;
    const anchor = item.x + w / 2 > right ? 'end' : item.x - w / 2 < left ? 'start' : 'middle';
    const start = anchor === 'end' ? item.x - w : anchor === 'start' ? item.x : item.x - w / 2;
    let row = rowEnds.findIndex(end => start >= end + gap);
    if (row < 0) { row = rowEnds.length; rowEnds.push(-Infinity); }
    rowEnds[row] = start + w;
    return { ...item, anchor, start, end: start + w, row };
  });
}

/** The ticks an axis asks for: explicit `ticks`, a `tickStep`, log ticks, or round values. */
function axisTicks(axis, min, max, count) {
  if (Array.isArray(axis.ticks)) return axis.ticks.filter(v => v >= min - 1e-9 && v <= max + 1e-9);
  if (axis.tickStep > 0) return stepTicks(min, max, axis.tickStep);
  if (axis.scale === 'log') return logTicks(min, max);
  return niceTicks(min, max, count);
}

/** A scale from data [d0, d1] to pixels [r0, r1], linear or logarithmic. Log scales clamp at d0. */
function scaleFor(kind, d0, d1, r0, r1) {
  if (kind === 'log') {
    const l0 = Math.log10(d0), span = Math.log10(d1) - l0 || 1;
    return v => r0 + ((Math.log10(Math.max(v, d0)) - l0) / span) * (r1 - r0);
  }
  return v => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);
}

const DASHES = ['', '6 4', '2 3', '10 3 2 3'];
const defaultFormat = v => (Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}k` : String(Math.round(v * 100) / 100));
/** Tick text for log axes, which span small and large values. */
export const logFormat = v => (v >= 1e6 ? `${Number((v / 1e6).toPrecision(3))}M` : v >= 1e3 ? `${Number((v / 1e3).toPrecision(3))}k` : String(Number(v.toPrecision(3))));

function frame(container, { label, legend }) {
  container.replaceChildren();
  container.classList.add('cache-chart');
  let legendList;
  if (legend?.length) {
    legendList = document.createElement('ul');
    legendList.className = 'cache-chart-legend';
    for (const item of legend) {
      const li = document.createElement('li');
      li.dataset.cacheKind = item.kind ?? 'neutral';
      const swatch = svgEl('svg', { width: 22, height: 10, 'aria-hidden': 'true', class: 'cache-swatch' }, li);
      if (item.bar) svgEl('rect', item.hollow ? { x: 4.5, y: 1.5, width: 13, height: 7, class: 'cache-bar is-hollow' } : { x: 4, y: 1, width: 14, height: 8, class: 'cache-bar' }, swatch);
      else svgEl('path', { d: 'M1 5H21', class: 'cache-line', 'stroke-dasharray': item.dash || undefined }, swatch);
      li.append(item.label);
      legendList.append(li);
    }
    container.append(legendList);
  }
  const svg = svgEl('svg', { class: 'cache-chart-svg', role: 'img', 'aria-label': label }, container);
  return svg;
}

function observe(container, fn) {
  let width = 0;
  const check = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; fn(w); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  return check;
}

function axes(g, { width, height, margin, xTicks, yTicks, xScale, yScale, xFormat, yFormat, xLabel, yLabel }) {
  g.replaceChildren();
  const bottom = height - margin.bottom;
  for (const v of yTicks) {
    const y = yScale(v);
    svgEl('path', { class: 'cache-grid', d: `M${margin.left} ${y}H${width - margin.right}` }, g);
    svgEl('text', { class: 'cache-tick', x: margin.left - 6, y: y + 4, 'text-anchor': 'end' }, g).textContent = yFormat(v);
  }
  for (const v of xTicks) {
    const x = xScale(v);
    svgEl('path', { class: 'cache-axis', d: `M${x} ${bottom}v4` }, g);
    svgEl('text', { class: 'cache-tick', x, y: bottom + 17, 'text-anchor': 'middle' }, g).textContent = xFormat(v);
  }
  svgEl('path', { class: 'cache-axis', d: `M${margin.left} ${margin.top}V${bottom}H${width - margin.right}` }, g);
  if (yLabel) svgEl('text', { class: 'cache-axis-label', x: margin.left - 2, y: 12 }, g).textContent = yLabel;
  if (xLabel) svgEl('text', { class: 'cache-axis-label', x: (margin.left + width - margin.right) / 2, y: height - 4, 'text-anchor': 'middle' }, g).textContent = xLabel;
}

/**
 * lineChart(container, {
 *   label, height = 200,
 *   x: { label, window?, domain?: [min, max], format? },   window: show the latest `window` x units
 *   y: { label, domain?: [min, max | 'auto'], format? },
 *   series: [{ id, label, kind, dash? }],
 *   rules?: [{ y, label, kind }]                            horizontal reference lines, e.g. database capacity
 *   bands?: [{ id?, x0, x1, label?, kind? }]                shaded x ranges, e.g. an outage
 *   markers?: [{ id?, x, label?, kind? }]                   vertical event lines, e.g. "Redis emptied"
 * })
 * Axis options also take scale: 'log' (domain above zero), ticks: [values] and
 * tickStep: n (a tick at every multiple of n). Band and marker labels sit in
 * rows above the plot and never overlap.
 * Returns { push(id, x, y), set(id, points), clear(), render(),
 *           band(id, x0, x1, label?, kind?) or band(id, null), mark(id, x, label?, kind?) or mark(id, null) }.
 */
export function lineChart(container, { label, height = 200, x = {}, y = {}, series = [], rules = [], bands = [], markers = [] }) {
  const legend = series.length > 1 || rules.length ? [...series.map((s, i) => ({ ...s, dash: s.dash ?? DASHES[i % DASHES.length] })), ...rules.map(r => ({ label: r.label, kind: r.kind, dash: '3 3' }))] : null;
  const svg = frame(container, { label, legend });
  // Child order matters to local overlays that insert before svg.children[1] (the rules):
  // keep grid and rules first, then the translucent bands and markers, then lines.
  const grid = svgEl('g', {}, svg);
  const ruleLayer = svgEl('g', {}, svg);
  const bandLayer = svgEl('g', {}, svg);
  const markLayer = svgEl('g', {}, svg);
  const lines = new Map(series.map((s, i) => [s.id, { ...s, points: [], path: svgEl('path', { class: 'cache-line', 'data-cache-kind': s.kind ?? 'neutral', 'stroke-dasharray': s.dash ?? (DASHES[i % DASHES.length] || undefined) }, svg) }]));
  const bandMap = new Map(bands.map((b, i) => [b.id ?? `band-${i}`, b]));
  const markMap = new Map(markers.map((m, i) => [m.id ?? `marker-${i}`, m]));
  let width = 0;
  const xLog = x.scale === 'log', yLog = y.scale === 'log';
  const xFormat = x.format ?? (xLog ? logFormat : defaultFormat), yFormat = y.format ?? (yLog ? logFormat : defaultFormat);
  const chart = {
    push(id, px, py) {
      const line = lines.get(id);
      line.points.push([px, py]);
      if (x.window && line.points.length > 2 && line.points[1][0] < px - x.window * 1.5) line.points.shift();
    },
    set(id, points) { lines.get(id).points = points.slice(); },
    clear() { for (const line of lines.values()) line.points = []; },
    band(id, x0, x1, text, kind) { if (x0 === null) bandMap.delete(id); else bandMap.set(id, { x0, x1, label: text, kind }); chart.render(); },
    mark(id, px, text, kind) { if (px === null) markMap.delete(id); else markMap.set(id, { x: px, label: text, kind }); chart.render(); },
    render() {
      if (!width) return;
      const all = [...lines.values()].flatMap(l => l.points);
      const latest = all.length ? Math.max(...all.map(p => p[0])) : 0;
      let [x0, x1] = x.window ? [Math.max(0, latest - x.window), Math.max(x.window, latest)] : x.domain ?? [Math.min(0, ...all.map(p => p[0])), Math.max(1, latest)];
      if (xLog) {
        const positive = all.map(p => p[0]).filter(v => v > 0);
        if (!(x0 > 0)) x0 = logFloor(positive.length ? Math.min(...positive) : 1);
        if (!(x1 > x0)) x1 = logCeil(Math.max(x0 * 10, ...positive));
      }
      const yMaxData = Math.max(0, ...all.map(p => p[1]), ...rules.map(r => r.y));
      let [y0, yTop] = y.domain ?? [0, 'auto'];
      let y1 = yTop === 'auto' ? (yLog ? logCeil(yMaxData) : niceMax(yMaxData)) : yTop;
      if (yLog) {
        const positive = all.map(p => p[1]).filter(v => v > 0);
        if (!(y0 > 0)) y0 = logFloor(positive.length ? Math.min(...positive) : y1 / 100);
        if (!(y1 > y0)) y1 = y0 * 10;
      }
      const yTicks = axisTicks(y, y0, y1, 4);
      const margin = { top: 22, right: 12, bottom: x.label ? 40 : 26, left: 12 + 7.2 * Math.max(1, ...yTicks.map(v => yFormat(v).length)) };
      const xScale = scaleFor(x.scale, x0, x1, margin.left, width - margin.right);
      // Band and marker labels take rows above the plot, so they never cover the lines or each other.
      const inX = v => v >= x0 - 1e-9 && v <= x1 + 1e-9;
      const shownBands = [...bandMap.values()].map(b => ({ ...b, a: Math.max(margin.left, xScale(Math.max(b.x0, x0))), b: Math.min(width - margin.right, xScale(Math.min(b.x1, x1))) })).filter(b => b.b > b.a);
      const shownMarks = [...markMap.values()].filter(m => inX(m.x)).map(m => ({ ...m, px: xScale(m.x) }));
      const labels = placeLabels([
        ...shownBands.filter(b => b.label).map(b => ({ x: (b.a + b.b) / 2, text: b.label, kind: b.kind, ref: b })),
        ...shownMarks.filter(m => m.label).map(m => ({ x: m.px, text: m.label, kind: m.kind, ref: m })),
      ], { left: margin.left, right: width, gap: 10 });
      const rows = labels.length ? Math.max(...labels.map(l => l.row)) + 1 : 0;
      margin.top += rows * 15;
      const yScale = scaleFor(y.scale, y0, y1, height - margin.bottom, margin.top);
      axes(grid, { width, height, margin, xTicks: axisTicks(x, x0, x1, width < 480 ? 4 : 7), yTicks, xScale, yScale, xFormat, yFormat, xLabel: x.label, yLabel: y.label });
      ruleLayer.replaceChildren();
      for (const r of rules) {
        svgEl('path', { class: 'cache-rule', 'data-cache-kind': r.kind ?? 'neutral', d: `M${margin.left} ${yScale(r.y)}H${width - margin.right}` }, ruleLayer);
      }
      bandLayer.replaceChildren();
      for (const b of shownBands) svgEl('rect', { class: 'cache-band', 'data-cache-kind': b.kind ?? 'neutral', x: b.a, y: margin.top, width: b.b - b.a, height: height - margin.bottom - margin.top }, bandLayer);
      markLayer.replaceChildren();
      for (const m of shownMarks) {
        const placed = labels.find(l => l.ref === m);
        const top = placed ? 22 + placed.row * 15 + 12 : margin.top;
        svgEl('path', { class: 'cache-marker', 'data-cache-kind': m.kind, d: `M${m.px} ${top}V${height - margin.bottom}` }, markLayer);
      }
      for (const l of labels) {
        svgEl('text', { class: 'cache-marker-label is-haloed', 'data-cache-kind': l.kind, x: l.x, y: 22 + l.row * 15 + 8, 'text-anchor': l.anchor }, markLayer).textContent = l.text;
      }
      for (const line of lines.values()) {
        const visible = line.points.filter(p => p[0] >= x0 - (x1 - x0) * 0.02 && (!xLog || p[0] > 0));
        const clampY = v => yScale(Math.max(y0, Math.min(y1, v)));
        line.path.setAttribute('d', visible.map((p, i) => `${i ? 'L' : 'M'}${xScale(p[0]).toFixed(1)} ${clampY(p[1]).toFixed(1)}`).join(''));
      }
    },
  };
  observe(container, w => { width = w; svg.setAttribute('viewBox', `0 0 ${w} ${height}`); svg.setAttribute('width', w); svg.setAttribute('height', height); chart.render(); })();
  return chart;
}

/**
 * barChart(container, {
 *   label, bars: [{ id, label, kind }], x: { label, domain?: [0, max | 'auto'], format? },
 *   labels?: 'above' | 'beside' | 'inside',   where each bar's label goes (default 'above')
 *   labelWidth?,                              width of the 'beside' label column (default: fits the longest label)
 * })
 * Horizontal bars with each value at the end. 'beside' puts labels in a column to
 * the left (shorter rows); it falls back to 'above' when that column would take
 * more than 45% of the width. 'inside' writes the label over the start of the bar.
 * Returns { set({ id: value }), render() }.
 */
export function barChart(container, { label, bars = [], x = {}, labels = 'above', labelWidth }) {
  const svg = frame(container, { label });
  const values = Object.fromEntries(bars.map(b => [b.id, 0]));
  const row = 42;
  const height = bars.length * row + (x.label ? 26 : 8);
  const format = x.format ?? defaultFormat;
  let width = 0;
  const chart = {
    set(next) { Object.assign(values, next); chart.render(); },
    render() {
      if (!width) return;
      svg.replaceChildren();
      const [, top] = x.domain ?? [0, 'auto'];
      const max = top === 'auto' ? niceMax(Math.max(...Object.values(values))) : top;
      const column = labelWidth ?? Math.ceil(Math.max(0, ...bars.map(b => String(b.label).length)) * 7 + 12);
      const mode = labels === 'beside' && column > width * 0.45 ? 'above' : labels;
      if (mode !== 'above') {
        // Compact rows: the label beside the bar or written over its start.
        const compactRow = mode === 'inside' ? 30 : 28;
        const barH = mode === 'inside' ? 22 : 14;
        const h = bars.length * compactRow + (x.label ? 26 : 8);
        svg.setAttribute('viewBox', `0 0 ${width} ${h}`); svg.setAttribute('height', h);
        const left = 4 + (mode === 'beside' ? column : 0), right = 64, span = width - left - right;
        bars.forEach((bar, i) => {
          const y = i * compactRow + (compactRow - barH) / 2;
          const v = values[bar.id] ?? 0;
          svgEl('rect', { class: 'cache-bar-track', x: left, y, width: span, height: barH, rx: 2 }, svg);
          svgEl('rect', { class: 'cache-bar', 'data-cache-kind': bar.kind ?? 'neutral', x: left, y, width: Math.max(0, Math.min(1, v / max)) * span, height: barH, rx: 2 }, svg);
          if (mode === 'beside') svgEl('text', { class: 'cache-bar-label', x: left - 8, y: y + barH / 2 + 4.5, 'text-anchor': 'end' }, svg).textContent = bar.label;
          else svgEl('text', { class: 'cache-bar-label is-inside', x: left + 7, y: y + barH / 2 + 4.5 }, svg).textContent = bar.label;
          svgEl('text', { class: 'cache-bar-value', x: left + span + 6, y: y + barH / 2 + 4 }, svg).textContent = format(v);
        });
        if (x.label) svgEl('text', { class: 'cache-axis-label', x: 4, y: h - 6 }, svg).textContent = x.label;
        return;
      }
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`); svg.setAttribute('height', height);
      const left = 4, right = 64, span = width - left - right;
      bars.forEach((bar, i) => {
        const y = i * row;
        const v = values[bar.id] ?? 0;
        svgEl('text', { class: 'cache-bar-label', x: left, y: y + 14 }, svg).textContent = bar.label;
        svgEl('rect', { class: 'cache-bar-track', x: left, y: y + 20, width: span, height: 14, rx: 2 }, svg);
        svgEl('rect', { class: 'cache-bar', 'data-cache-kind': bar.kind ?? 'neutral', x: left, y: y + 20, width: Math.max(0, Math.min(1, v / max)) * span, height: 14, rx: 2 }, svg);
        svgEl('text', { class: 'cache-bar-value', x: left + span + 6, y: y + 31 }, svg).textContent = format(v);
      });
      if (x.label) svgEl('text', { class: 'cache-axis-label', x: left, y: height - 6 }, svg).textContent = x.label;
    },
  };
  observe(container, w => { width = w; svg.setAttribute('viewBox', `0 0 ${w} ${height}`); svg.setAttribute('width', w); svg.setAttribute('height', height); chart.render(); })();
  return chart;
}

/**
 * histogram(container, {
 *   label, height = 200,
 *   bins: { min, max, count },
 *   kind?,                              colour of a single series
 *   series?: [{ id, label, kind }],     or several series, stacked in this order (with a legend);
 *                                       the second (and fourth) is drawn hollow: pale fill, coloured outline
 *   x: { label, format? },
 *   y: { label, format?, scale?: 'linear' | 'sqrt' },   sqrt keeps a small hump visible beside a tall peak
 * })
 * set(values) for one series, or set({ [seriesId]: values }) for several. Values
 * outside the bins are counted in the first or last bin.
 * Returns { set(values), mark(id, value, label), render() }.
 */
export function histogram(container, { label, height = 200, kind = 'neutral', series, bins, x = {}, y = {} }) {
  const layers = series ?? [{ id: 'values', kind }];
  // Stacked series alternate solid and hollow (pale fill, coloured outline), so
  // neighbouring layers differ in lightness as well as hue.
  const hollow = i => i % 2 === 1;
  const svg = frame(container, { label, legend: series?.length > 1 ? series.map((s, i) => ({ ...s, bar: true, hollow: hollow(i) })) : null });
  const grid = svgEl('g', {}, svg);
  const barLayer = svgEl('g', {}, svg);
  const markLayer = svgEl('g', {}, svg);
  const counts = Object.fromEntries(layers.map(l => [l.id, new Array(bins.count).fill(0)]));
  const marks = new Map();
  const binWidth = (bins.max - bins.min) / bins.count;
  const xFormat = x.format ?? defaultFormat, yFormat = y.format ?? defaultFormat;
  const curve = y.scale === 'sqrt' ? Math.sqrt : v => v;
  let width = 0;
  const chart = {
    set(values) {
      const bySeries = Array.isArray(values) ? { [layers[0].id]: values } : values;
      for (const l of layers) {
        counts[l.id].fill(0);
        for (const v of bySeries[l.id] ?? []) counts[l.id][Math.max(0, Math.min(bins.count - 1, Math.floor((v - bins.min) / binWidth)))]++;
      }
      chart.render();
    },
    mark(id, value, text) { if (value === null) marks.delete(id); else marks.set(id, { value, text }); chart.render(); },
    render() {
      if (!width) return;
      const totals = Array.from({ length: bins.count }, (_, i) => layers.reduce((sum, l) => sum + counts[l.id][i], 0));
      const y1 = niceMax(Math.max(...totals));
      // A square-root axis also gets ticks among the small counts, kept at least 22 px apart.
      const candidates = y.scale === 'sqrt' ? [...new Set([...niceTicks(0, y1, 4), ...niceTicks(0, y1 / 10, 2)])].sort((p, q) => p - q) : niceTicks(0, y1, 4);
      // Marker labels take as many rows as they need not to overlap (see placeLabels). The
      // first two rows sit inside the usual top margin; any further row lowers the plot.
      const layoutMarks = left => placeLabels([...marks.values()].map(m => ({ ...m, x: left + ((Math.min(bins.max, m.value) - bins.min) / (bins.max - bins.min)) * (width - left - 14) })), { left, right: width, gap: 14 });
      const extraRows = left => Math.max(0, ...layoutMarks(left).map(l => l.row - 1));
      const top = l => 34 + 14 * extraRows(l);
      const tickRows = plotTop => {
        const plotHeight = height - plotTop - (x.label ? 40 : 26);
        const ticks = [];
        for (const v of [...candidates].reverse()) if (!ticks.length || plotHeight * (curve(ticks.at(-1)) - curve(v)) / curve(y1) >= 22 || v === 0) ticks.push(v);
        return ticks.reverse();
      };
      const leftFor = ticks => 12 + 7.2 * Math.max(...ticks.map(v => yFormat(v).length));
      let yTicks = tickRows(34);
      let plotTop = top(leftFor(yTicks));
      if (plotTop !== 34) yTicks = tickRows(plotTop);
      const margin = { top: plotTop, right: 14, bottom: x.label ? 40 : 26, left: leftFor(yTicks) };
      const xScale = v => margin.left + ((v - bins.min) / (bins.max - bins.min)) * (width - margin.left - margin.right);
      const yScale = v => height - margin.bottom - (curve(v) / curve(y1)) * (height - margin.top - margin.bottom);
      axes(grid, { width, height, margin, xTicks: niceTicks(bins.min, bins.max, width < 480 ? 4 : 8), yTicks, xScale, yScale, xFormat, yFormat, xLabel: x.label, yLabel: y.label });
      barLayer.replaceChildren();
      for (let i = 0; i < bins.count; i++) {
        const a = xScale(bins.min + i * binWidth), b = xScale(bins.min + (i + 1) * binWidth);
        let below = 0;
        layers.forEach((l, li) => {
          const c = counts[l.id][i];
          if (!c) return;
          const top = yScale(below + c), bottom = yScale(below);
          svgEl('rect', { class: hollow(li) ? 'cache-bar is-hollow' : 'cache-bar', 'data-cache-kind': l.kind ?? 'neutral', x: a + 0.5, y: top, width: Math.max(1, b - a - 1), height: Math.max(0.5, bottom - top) }, barLayer);
          below += c;
        });
      }
      markLayer.replaceChildren();
      // Labels sit at the top of each marker; a label that would collide with an
      // earlier one drops to the first row where it fits.
      placeLabels([...marks.values()].map(m => ({ ...m, x: xScale(Math.min(bins.max, m.value)) })), { left: margin.left, right: width, gap: 14 }).forEach(m => {
        const y = 36 + m.row * 14;
        svgEl('path', { class: 'cache-marker', d: `M${m.x} ${y + 4}V${height - margin.bottom}` }, markLayer);
        svgEl('text', { class: m.row ? 'cache-marker-label is-haloed' : 'cache-marker-label', x: m.x, y, 'text-anchor': m.anchor }, markLayer).textContent = m.text;
      });
    },
  };
  observe(container, w => { width = w; svg.setAttribute('viewBox', `0 0 ${w} ${height}`); svg.setAttribute('width', w); svg.setAttribute('height', height); chart.render(); })();
  return chart;
}
