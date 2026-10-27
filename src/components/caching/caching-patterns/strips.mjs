// Rows of event timelines, drawn as SVG: a label, a few value cells, then a strip
// where each event (hit, miss, stale read, write, expiry) is a marker that slides
// left as simulated time passes, the newest at the right edge ("now"). Used by
// figures 1 and 2 of the caching-patterns article. A local extension of the
// shared toolkit: scene.mjs draws systems, not per-key histories.
import { svgEl } from '../shared/scene.mjs';
import { dotShape } from '../shared/shapes.mjs';

/**
 * eventStrips(container, {
 *   label,                                 accessible name
 *   rows:  [{ id, label }],
 *   cells: [{ id, label, width, compactWidth? }],   value columns between label and strip
 *   labelWidth: [desktop, compact],
 *   pxPerSecond = [24, 14],                strip scale on wide and narrow screens
 * })
 * Returns { render(now, data) } where data[rowId] = { cells: { [cellId]: { text, kind, bar?, barKind? } }, events: [{ t, kind }] }.
 */
export function eventStrips(container, { label, rows, cells = [], labelWidth = [110, 84], pxPerSecond = [24, 14] }) {
  container.replaceChildren();
  const svg = svgEl('svg', { class: 'cache-svg pattern-strips', role: 'img', 'aria-label': label }, container);
  const head = 26, rowH = 40, axisH = 26;
  let width = 0, last = null;
  const layout = () => {
    const compact = width < 480;
    const lw = compact ? labelWidth[1] : labelWidth[0];
    let x = lw;
    const cellX = {};
    for (const c of cells) { const w = compact ? (c.compactWidth ?? c.width) : c.width; cellX[c.id] = [x, w]; x += w; }
    const stripLeft = x + 10, stripRight = width - 8;
    return { compact, lw, cellX, stripLeft, stripRight, window: ((stripRight - stripLeft) / pxPerSecond[compact ? 1 : 0]) * 1000 };
  };
  const draw = (now, data) => {
    if (!width) return;
    const L = layout();
    const height = head + rows.length * rowH + axisH;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width); svg.setAttribute('height', height);
    svg.replaceChildren();
    for (const c of cells) {
      const [x, w] = L.cellX[c.id];
      svgEl('text', { class: 'strip-head', x: x + w / 2, y: 16, 'text-anchor': 'middle' }, svg).textContent = c.label;
    }
    svgEl('text', { class: 'strip-head', x: L.stripLeft, y: 16 }, svg).textContent = L.compact ? 'Recent events' : 'Recent events, newest on the right';
    rows.forEach((row, i) => {
      const y = head + i * rowH + rowH / 2;
      const d = data[row.id] ?? { cells: {}, events: [] };
      svgEl('path', { class: 'strip-rule', d: `M0 ${head + i * rowH}H${width}` }, svg);
      svgEl('text', { class: 'strip-label', x: 2, y: y + 4 }, svg).textContent = row.label;
      for (const c of cells) {
        const [x, w] = L.cellX[c.id];
        const v = d.cells[c.id] ?? { text: '' };
        const g = svgEl('g', { 'data-cache-kind': v.kind ?? 'neutral', class: 'strip-cell' }, svg);
        svgEl('rect', { class: v.kind && v.kind !== 'neutral' ? 'strip-box is-filled' : 'strip-box', x: x + 3, y: y - 13, width: w - 6, height: 26, rx: 3 }, g);
        svgEl('text', { class: 'strip-value', x: x + w / 2, y: y + 4, 'text-anchor': 'middle' }, g).textContent = v.text;
        if (v.bar !== undefined) {
          const bg = svgEl('g', { 'data-cache-kind': v.barKind ?? 'expiry' }, svg);
          svgEl('rect', { class: 'strip-bar', x: x + 6, y: y + 9, width: Math.max(0, (w - 12) * Math.min(1, v.bar)), height: 2.5, rx: 1 }, bg);
        }
      }
      svgEl('path', { class: 'strip-line', d: `M${L.stripLeft} ${y}H${L.stripRight}` }, svg);
      for (const e of d.events) {
        const age = now - e.t;
        if (age < 0 || age > L.window) continue;
        const x = L.stripRight - (age / L.window) * (L.stripRight - L.stripLeft);
        const { d: path, paint } = dotShape(e.kind, L.compact ? 4.6 : 5.2);
        svgEl('path', { class: 'cache-dot', d: path, 'data-paint': paint, 'data-cache-kind': e.kind, transform: `translate(${x.toFixed(1)} ${y})` }, svg);
      }
    });
    const axisY = head + rows.length * rowH;
    svgEl('path', { class: 'strip-rule', d: `M0 ${axisY}H${width}` }, svg);
    const seconds = Math.floor(L.window / 1000);
    const step = seconds > 20 ? 10 : 5;
    for (let s = 0; s <= seconds; s += step) {
      const x = L.stripRight - (s * 1000 / L.window) * (L.stripRight - L.stripLeft);
      svgEl('path', { class: 'strip-tick', d: `M${x} ${axisY}v4` }, svg);
      svgEl('text', { class: 'cache-tick', x, y: axisY + 17, 'text-anchor': s === 0 ? 'end' : 'middle' }, svg).textContent = s === 0 ? 'now' : `${s} s ago`;
    }
  };
  const check = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; if (last) draw(...last); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return {
    render(now, data) { last = [now, data]; check(); draw(now, data); },
  };
}
