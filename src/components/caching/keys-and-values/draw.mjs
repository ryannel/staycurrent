// Local drawing helpers for the keys-and-values figures (browser only). They
// extend the shared toolkit, which has no grid of cache entries, no row of
// application instances and no field-by-field view of a hash.
import { svgEl } from '../shared/scene.mjs';
import { dotShape } from '../shared/shapes.mjs';

/** Redraws `build(svg, width)` whenever the container's width changes. */
export function responsiveSvg(container, label, build) {
  container.replaceChildren();
  const svg = svgEl('svg', { class: 'cache-svg kv-svg', role: 'img', 'aria-label': label }, container);
  let width = 0;
  const api = { svg, width: 0, compact: false, onDraw: null };
  const check = () => {
    const w = Math.round(container.clientWidth);
    if (!w || w === width) return;
    width = w;
    svg.replaceChildren();
    api.width = w; api.compact = w < 560;
    const height = build(svg, w, api.compact);
    svg.setAttribute('viewBox', `0 0 ${w} ${height}`);
    svg.setAttribute('width', w); svg.setAttribute('height', height);
    api.onDraw?.();
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  api.check = check;
  check();
  return api;
}

/**
 * A grid of cache entries inside `svg` at (x, y). Returns the cells so a
 * renderer can set each one's state ('full' or 'empty') and a flash kind.
 */
export function entryGrid(svg, { x, y, rows, cols, cell, gap = 3, rowLabels = [], colLabels = [], colGroups = [], labelWidth = 0, title, subtitle }) {
  const g = svgEl('g', { class: 'kv-grid', transform: `translate(${x} ${y})` }, svg);
  let top = 0;
  if (title) { svgEl('text', { class: 'kv-grid-title', x: 0, y: 13 }, g).textContent = title; top += 20; }
  if (subtitle) { svgEl('text', { class: 'kv-grid-sub', x: 0, y: top + 11 }, g).textContent = subtitle; top += 18; }
  if (colGroups.length) {
    // Group labels over runs of columns, e.g. a sort order over its currencies.
    let c0 = 0;
    colGroups.forEach(({ label, span }) => {
      const mid = labelWidth + c0 * (cell + gap) + (span * (cell + gap) - gap) / 2;
      svgEl('text', { class: 'kv-grid-col kv-grid-group', x: mid, y: top + 10, 'text-anchor': 'middle' }, g).textContent = label;
      c0 += span;
    });
    top += 15;
  }
  if (colLabels.length) {
    colLabels.forEach((label, c) => {
      svgEl('text', { class: 'kv-grid-col', x: labelWidth + c * (cell + gap) + cell / 2, y: top + 10, 'text-anchor': 'middle' }, g).textContent = label;
    });
    top += 16;
  }
  const cells = [];
  for (let r = 0; r < rows; r++) {
    if (rowLabels[r]) svgEl('text', { class: 'kv-grid-row', x: labelWidth - 6, y: top + r * (cell + gap) + cell / 2 + 4, 'text-anchor': 'end' }, g).textContent = rowLabels[r];
    for (let c = 0; c < cols; c++) {
      const cx = labelWidth + c * (cell + gap), cy = top + r * (cell + gap);
      const rect = svgEl('rect', { class: 'kv-cell', x: cx, y: cy, width: cell, height: cell, rx: 2, 'data-state': 'full' }, g);
      const mark = svgEl('path', { class: 'cache-dot kv-flash', transform: `translate(${cx + cell / 2} ${cy + cell / 2})`, style: 'display:none' }, g);
      cells.push({ rect, mark, kind: '' });
    }
  }
  const height = top + rows * (cell + gap) - gap;
  return { cells, height, width: labelWidth + cols * (cell + gap) - gap };
}

/** Sets a cell's stored state and, while `kind` is set, a coloured shape over it. */
export function setCell(cell, full, kind, size = 5) {
  const state = full ? 'full' : 'empty';
  if (cell.rect.getAttribute('data-state') !== state) cell.rect.setAttribute('data-state', state);
  if (cell.kind === (kind || '')) return;
  cell.kind = kind || '';
  if (!kind) { cell.mark.style.display = 'none'; cell.rect.removeAttribute('data-cache-kind'); cell.rect.classList.remove('is-flash'); return; }
  const { d, paint } = dotShape(kind, size);
  cell.mark.setAttribute('d', d); cell.mark.setAttribute('data-paint', paint); cell.mark.setAttribute('data-cache-kind', kind);
  cell.mark.style.display = '';
  cell.rect.setAttribute('data-cache-kind', kind); cell.rect.classList.add('is-flash');
}

/** Kind of a recent flash { kind, at } still visible at `now`, or ''. */
export const flashKind = (flash, now, duration = 700) => (flash && now - flash.at < duration ? flash.kind : '');

/**
 * Horizontal stacked bars (the shared barChart draws single bars only).
 * stackedBars(container, { label, rows: [{ id, label }], segments: [{ id, label, kind }], format })
 * set({ [rowId]: { [segmentId]: value } }) draws each row's segments in order,
 * with the row's total at the end. A legend of segments sits above.
 */
export function stackedBars(container, { label, rows, segments, format = v => String(v), axisLabel }) {
  container.replaceChildren();
  container.classList.add('cache-chart');
  const legend = document.createElement('ul');
  legend.className = 'cache-chart-legend';
  for (const s of segments) {
    const li = document.createElement('li');
    li.dataset.cacheKind = s.kind ?? 'neutral';
    const sw = svgEl('svg', { width: 22, height: 10, 'aria-hidden': 'true', class: 'cache-swatch' }, li);
    svgEl('rect', { x: 4, y: 1, width: 14, height: 8, class: 'cache-bar' }, sw);
    li.append(s.label);
    legend.append(li);
  }
  container.append(legend);
  const svg = svgEl('svg', { class: 'cache-chart-svg', role: 'img', 'aria-label': label }, container);
  const row = 46;
  const height = rows.length * row + (axisLabel ? 24 : 6);
  let width = 0;
  let values = {};
  const render = () => {
    if (!width) return;
    svg.replaceChildren();
    const totals = rows.map(r => segments.reduce((sum, s) => sum + (values[r.id]?.[s.id] ?? 0), 0));
    const max = Math.max(1e-9, ...totals);
    const left = 4, right = 78, span = width - left - right;
    rows.forEach((r, i) => {
      const y = i * row;
      svgEl('text', { class: 'cache-bar-label', x: left, y: y + 14 }, svg).textContent = r.label;
      svgEl('rect', { class: 'cache-bar-track', x: left, y: y + 20, width: span, height: 16, rx: 2 }, svg);
      let x = left;
      for (const s of segments) {
        const v = values[r.id]?.[s.id] ?? 0;
        if (!(v > 0)) continue;
        const w = (v / max) * span;
        svgEl('rect', { class: 'cache-bar kv-stack', 'data-cache-kind': s.kind ?? 'neutral', x, y: y + 20, width: Math.max(0.5, w), height: 16 }, svg);
        x += w;
      }
      svgEl('text', { class: 'cache-bar-value', x: left + span + 6, y: y + 32 }, svg).textContent = format(totals[i]);
    });
    if (axisLabel) svgEl('text', { class: 'cache-axis-label', x: left, y: height - 6 }, svg).textContent = axisLabel;
  };
  const check = () => {
    const w = Math.round(container.clientWidth);
    if (!w || w === width) return;
    width = w;
    svg.setAttribute('viewBox', `0 0 ${w} ${height}`); svg.setAttribute('width', w); svg.setAttribute('height', height);
    render();
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return { set(next) { values = next; render(); } };
}
