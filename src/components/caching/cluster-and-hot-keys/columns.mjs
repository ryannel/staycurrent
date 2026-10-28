// A vertical column chart: one column per node, with the capacity of one node as a
// line across it and the average load as a dotted line. The shared chart.mjs has only
// horizontal bars, so this is a local extension (reported as a toolkit gap).
import { svgEl } from '../shared/scene.mjs';

const thousands = v => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v)));
// One decimal place only when it matters, so 12,500 reads "12.5k" at every stop.
const tenths = v => (v >= 1000 ? `${String(Math.round(v / 100) / 10)}k` : String(Math.round(v)));

/** columnChart(container, { label, capacity, top }) → { set({ loads, labels, mean, hotLoads? }) }
 *  hotLoads, if given, is drawn as a solid segment at the foot of each column. */
export function columnChart(container, { label, capacity, top }) {
  const svg = svgEl('svg', { class: 'cache-svg cluster-columns', role: 'img', 'aria-label': label }, container);
  let width = 0, data = null;
  const draw = () => {
    if (!width || !data) return;
    const height = 230, margin = { top: 14, right: 8, bottom: 24, left: 40 };
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`); svg.setAttribute('width', String(width)); svg.setAttribute('height', String(height));
    svg.replaceChildren();
    const plotH = height - margin.top - margin.bottom, plotW = width - margin.left - margin.right;
    const max = Math.max(top, ...data.loads);
    const y = v => margin.top + plotH - (Math.min(v, max) / max) * plotH;
    for (let v = 0; v <= max; v += max > 200000 ? 100000 : 50000) {
      svgEl('path', { class: 'cache-grid', d: `M${margin.left} ${y(v)}H${width - margin.right}` }, svg);
      svgEl('text', { class: 'cache-tick', x: margin.left - 6, y: y(v) + 4, 'text-anchor': 'end' }, svg).textContent = thousands(v);
    }
    const n = data.loads.length, slot = plotW / n, gap = Math.min(4, slot * 0.25), colW = slot - gap;
    // Label every column when they fit, otherwise every few.
    const every = Math.max(1, Math.ceil(26 / slot));
    data.loads.forEach((v, i) => {
      const x = margin.left + i * slot + gap / 2;
      const over = v > capacity;
      svgEl('rect', { class: `cluster-col${over ? ' is-over' : ''}`, 'data-cache-kind': over ? 'error' : 'redis', x, y: y(v), width: Math.max(1, colW), height: Math.max(0.5, y(0) - y(v)) }, svg);
      const hotV = data.hotLoads?.[i] ?? 0;
      if (hotV > 0) svgEl('rect', { class: 'cluster-hot', x, y: y(Math.min(v, hotV)), width: Math.max(1, colW), height: Math.max(0.5, y(0) - y(Math.min(v, hotV))) }, svg);
      if (over && colW >= 7) svgEl('text', { class: 'cluster-over-mark', x: x + colW / 2, y: y(v) - 3, 'text-anchor': 'middle' }, svg).textContent = '✕';
      if (i % every === 0) svgEl('text', { class: 'cluster-col-label', x: x + colW / 2, y: height - 8, 'text-anchor': 'middle' }, svg).textContent = data.labels[i];
    });
    svgEl('path', { class: 'cluster-mean', d: `M${margin.left} ${y(data.mean)}H${width - margin.right}` }, svg);
    // Above the line, so it never meets the column labels under the axis when the average is low;
    // at the right-hand end, where it does not sit over the tall first column.
    svgEl('text', { class: 'cluster-mean-label', x: width - margin.right - 2, y: Math.max(margin.top + 10, y(data.mean) - 5), 'text-anchor': 'end' }, svg).textContent = `average ${tenths(data.mean)}`;
    // A pale band under the dashed line keeps it visible across columns drawn in the same colour.
    svgEl('path', { class: 'cluster-capacity-halo', d: `M${margin.left} ${y(capacity)}H${width - margin.right}` }, svg);
    svgEl('path', { class: 'cluster-capacity', d: `M${margin.left} ${y(capacity)}H${width - margin.right}` }, svg);
    svgEl('text', { class: 'cluster-capacity-label', x: width - margin.right - 2, y: y(capacity) - 5, 'text-anchor': 'end' }, svg).textContent = `one node’s capacity, ${thousands(capacity)}`;
  };
  const check = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; draw(); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return { set(next) { data = next; check(); draw(); } };
}
