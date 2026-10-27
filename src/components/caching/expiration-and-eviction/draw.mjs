// Drawing helpers for this article's figures, built on the shared toolkit's
// svgEl and dot shapes. Local extensions (reported as toolkit gaps): a grid of
// key cells, a scrolling timeline, and shaded x ranges and labels on a
// lineChart from chart.mjs.
import { svgEl } from '../shared/scene.mjs';
import { dotShape } from '../shared/shapes.mjs';

/** Calls fn(width) now and whenever the container's width changes. */
export function onWidth(container, fn) {
  let width = 0;
  const check = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; fn(w); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return () => width;
}

/** A responsive SVG filling the container's width. */
export function svgIn(container, label, height) {
  container.replaceChildren();
  const svg = svgEl('svg', { class: 'cache-svg ee-svg', role: 'img', 'aria-label': label }, container);
  const size = (w, h = height) => { svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('width', w); svg.setAttribute('height', h); };
  return { svg, size };
}

/** A dot of the collection's vocabulary at (x, y). */
export function dot(parent, kind, x, y, r = 5) {
  const { d, paint } = dotShape(kind, r);
  return svgEl('path', { class: 'cache-dot', d, 'data-paint': paint, 'data-cache-kind': kind, transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, parent);
}

/**
 * The plot area of a rendered lineChart, read from its axis path
 * ("M left top V bottom H right"), so overlays line up with the chart.
 */
export function plotArea(chartContainer) {
  const axes = chartContainer.querySelectorAll('path.cache-axis');
  const frame = [...axes].find(p => (p.getAttribute('d') ?? '').includes('V') && (p.getAttribute('d') ?? '').includes('H'));
  const m = frame?.getAttribute('d')?.match(/M([\d.]+) ([\d.]+)V([\d.]+)H([\d.]+)/);
  if (!m) return null;
  const [left, top, bottom, right] = m.slice(1).map(Number);
  return { left, top, bottom, right };
}

/**
 * Draws a shaded band between x0 and x1 (data units) behind the lines of a
 * lineChart whose x domain is [domain0, domain1], with a label at its top.
 */
export function chartBand(chartContainer, { id, x0, x1, domain, label }) {
  const svg = chartContainer.querySelector('svg.cache-chart-svg');
  const area = plotArea(chartContainer);
  if (!svg || !area) return;
  let g = svg.querySelector(`g[data-band="${id}"]`);
  if (!g) {
    g = svgEl('g', { 'data-band': id, class: 'ee-band' });
    svg.insertBefore(g, svg.children[1] ?? null);
  }
  g.replaceChildren();
  const [d0, d1] = domain;
  const xs = v => area.left + ((v - d0) / (d1 - d0)) * (area.right - area.left);
  const a = Math.max(area.left, xs(x0)), b = Math.min(area.right, xs(x1));
  if (b <= a) return;
  svgEl('rect', { class: 'ee-band-fill', x: a, y: area.top, width: b - a, height: area.bottom - area.top }, g);
  if (label) svgEl('text', { class: 'ee-band-label', x: (a + b) / 2, y: area.top + 13, 'text-anchor': 'middle' }, g).textContent = label;
}

/** Positions for `count` cells in rows that fit `width`; returns { cols, size, gap, height, at(i) }. */
export function cellGrid(width, count, { size = 14, gap = 3, minCols = 8, maxCols = 40, top = 0, left = 0 } = {}) {
  const cols = Math.max(minCols, Math.min(maxCols, Math.floor((width - left + gap) / (size + gap))));
  const rows = Math.max(1, Math.ceil(count / cols));
  return {
    cols, rows, size, gap,
    height: top + rows * (size + gap) - gap,
    at: i => [left + (i % cols) * (size + gap), top + Math.floor(i / cols) * (size + gap)],
  };
}

/**
 * Draws measured points as rings over a rendered lineChart (the shared chart
 * joins points with lines, which would suggest values between measurements).
 * `sets` is [{ kind, points: [[x, y], ...] }]; domains are the chart's, in data units.
 * Draws a small key ("○ label") in the top-left corner of the plot when `key` is given.
 */
export function chartPoints(chartContainer, { id, sets, xDomain, yDomain, key, r = 4 }) {
  const svg = chartContainer.querySelector('svg.cache-chart-svg');
  const area = plotArea(chartContainer);
  if (!svg || !area) return;
  let g = svg.querySelector(`g[data-points="${id}"]`);
  if (!g) g = svgEl('g', { 'data-points': id }, svg);
  g.replaceChildren();
  const [x0, x1] = xDomain, [y0, y1] = yDomain;
  const px = v => area.left + ((v - x0) / (x1 - x0)) * (area.right - area.left);
  const py = v => area.bottom - ((v - y0) / (y1 - y0)) * (area.bottom - area.top);
  for (const set of sets) {
    for (const [x, y] of set.points) {
      if (x < x0 || x > x1 || y < y0 || y > y1) continue;
      svgEl('circle', { class: 'ee-measured', 'data-cache-kind': set.kind ?? 'neutral', cx: px(x).toFixed(1), cy: py(y).toFixed(1), r }, g);
    }
  }
  if (key) {
    svgEl('circle', { class: 'ee-measured', 'data-cache-kind': 'neutral', cx: area.left + 12, cy: area.top + 10, r }, g);
    svgEl('text', { class: 'ee-band-label', x: area.left + 21, y: area.top + 14 }, g).textContent = key;
  }
}
