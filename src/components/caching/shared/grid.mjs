// A grid of cells drawn as SVG: memory slots, cached keys, entries in a table.
// Each cell is a rectangle filled by a caching kind, with optional text or the
// kind's shape inside. The grid fills the container's width and wraps into rows.
import { svgEl } from './scene.mjs';
import { dotShape } from './shapes.mjs';

/**
 * Positions for `count` cells in rows that fit `width`. Fixed `columns` shrink
 * the cells if they would not otherwise fit. Pure; tested in node.
 * Returns { columns, rows, cellWidth, cellHeight, gap, width, height, at(i) -> [x, y] }.
 */
export function gridLayout(width, count, { cellWidth = 16, cellHeight, gap = 3, columns, minColumns = 1, maxColumns = Infinity, left = 0, top = 0 } = {}) {
  const room = Math.max(0, width - left);
  let w = cellWidth;
  let h = cellHeight ?? cellWidth;
  let cols;
  if (columns) {
    cols = columns;
    const fit = (room + gap) / cols - gap;
    // Square cells stay square; cells with their own height keep it.
    if (fit < w) { if (cellHeight === undefined) h = Math.max(4, fit); w = Math.max(4, fit); }
  } else {
    cols = Math.max(1, minColumns, Math.min(maxColumns, Math.floor((room + gap) / (w + gap))));
  }
  const rows = Math.max(1, Math.ceil(count / cols));
  return {
    columns: cols, rows, cellWidth: w, cellHeight: h, gap,
    width: left + cols * (w + gap) - gap,
    height: top + rows * (h + gap) - gap,
    at: i => [left + (i % cols) * (w + gap), top + Math.floor(i / cols) * (h + gap)],
  };
}

/**
 * cellGrid(container, {
 *   label,                                   accessible name
 *   cell: { width = 16, height = width, gap = 3 },
 *   columns?, minColumns?, maxColumns?,      fixed or bounded column count (default: as many as fit)
 *   rowLabel?(row, columns) -> text,         optional labels left of each row
 *   labelWidth = 64
 * })
 * Returns { render(cells) }, where each cell is
 *   { kind = 'neutral', fill = 'tint', text?, mark?, highlight? }
 *   fill: 'solid' | 'tint' | 'dashed' | 'empty'   (empty ignores kind: a free slot)
 *   text: drawn inside when it fits; mark: draws the kind's shape inside instead
 *   highlight: a heavier outline, e.g. the key just evicted
 */
export function cellGrid(container, { label, cell = {}, columns, minColumns, maxColumns, rowLabel, labelWidth = 64 }) {
  container.replaceChildren();
  container.classList.add('cache-cell-grid');
  const svg = svgEl('svg', { class: 'cache-svg', role: 'img', 'aria-label': label }, container);
  const { width: cw = 16, gap = 3 } = cell;
  let width = 0;
  let last = null;

  const draw = cells => {
    last = cells;
    if (!width) return;
    svg.replaceChildren();
    const left = rowLabel ? labelWidth : 0;
    const g = gridLayout(width, cells.length, { cellWidth: cw, cellHeight: cell.height, gap, columns, minColumns, maxColumns, left });
    const height = Math.max(1, g.height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    if (rowLabel) {
      for (let r = 0; r < g.rows; r++) {
        const t = svgEl('text', { class: 'cache-grid-row-label', x: left - 8, y: r * (g.cellHeight + gap) + g.cellHeight / 2 + 4, 'text-anchor': 'end' }, svg);
        t.textContent = rowLabel(r, g.columns) ?? '';
      }
    }
    cells.forEach((c, i) => {
      const [x, y] = g.at(i);
      const fill = c.fill ?? 'tint';
      const kind = fill === 'empty' ? 'neutral' : c.kind ?? 'neutral';
      svgEl('rect', { class: c.highlight ? 'cache-cell is-highlighted' : 'cache-cell', 'data-fill': fill, 'data-cache-kind': kind, x: x + 0.5, y: y + 0.5, width: Math.max(1, g.cellWidth - 1), height: Math.max(1, g.cellHeight - 1), rx: 2 }, svg);
      const cx = x + g.cellWidth / 2, cy = y + g.cellHeight / 2;
      if (c.mark && fill !== 'empty') {
        const { d, paint } = dotShape(kind, Math.min(5, Math.min(g.cellWidth, g.cellHeight) / 2 - 2.5));
        svgEl('path', { class: 'cache-dot cache-cell-mark', d, 'data-paint': paint, 'data-fill': fill, 'data-cache-kind': kind, transform: `translate(${cx.toFixed(1)} ${cy.toFixed(1)})` }, svg);
      } else if (c.text && String(c.text).length * 6.7 <= g.cellWidth - 4 && g.cellHeight >= 13) {
        svgEl('text', { class: 'cache-cell-text', 'data-fill': fill, x: cx, y: cy + 4, 'text-anchor': 'middle' }, svg).textContent = c.text;
      }
    });
  };

  const check = () => {
    const w = Math.round(container.clientWidth);
    if (w && w !== width) { width = w; if (last) draw(last); }
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return { render: draw };
}
