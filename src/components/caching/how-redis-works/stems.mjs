// A stem chart: one vertical line per sample, from the axis up to its value, with
// no line joining one sample to the next. Used for PING round trips, where a
// closed-loop probe sends nothing while it waits, so joining samples would draw
// a slope that never happened. A local extension of the shared toolkit, whose
// line chart always joins its points.
import { svgEl } from '../shared/scene.mjs';
import { niceTicks } from '../shared/chart.mjs';

/**
 * stemChart(container, {
 *   label, height = 200, kind = 'client',
 *   x: { label, domain?: [a, b], window?, format },   a fixed domain, or the latest `window` units
 *   y: { label, domain: [0, max], format },            fixed, so heights can be compared between runs
 * })
 * Returns { push(x, y), set(points), clear(), render({ rules, shades, marks }) } where
 *   rules:  [{ y, label, kind }]          dashed horizontal lines with a label at the right
 *   shades: [{ from, to, label }]         shaded x ranges, labelled at the top
 *   marks:  [{ x, label }]                vertical lines, labelled at the top
 * Values above the domain are drawn at the top edge with an arrow-head cap.
 */
export function stemChart(container, { label, height = 200, kind = 'client', x = {}, y = {} }) {
  container.replaceChildren();
  container.classList.add('cache-chart', 'redis-stems');
  const svg = svgEl('svg', { class: 'cache-chart-svg', role: 'img', 'aria-label': label }, container);
  let width = 0;
  let points = [];
  let extras = {};
  const xFormat = x.format ?? (v => String(v));
  const yFormat = y.format ?? (v => String(v));

  const chart = {
    push(px, py) {
      points.push([px, py]);
      if (x.window && points.length > 1 && points[0][0] < px - x.window * 1.2) {
        let i = 0;
        while (i < points.length && points[i][0] < px - x.window * 1.1) i++;
        points.splice(0, i);
      }
    },
    set(list) { points = list.slice(); },
    clear() { points = []; },
    render(next) {
      if (next) extras = next;
      if (!width) return;
      const { rules = [], shades = [], marks = [] } = extras;
      const latest = points.length ? points[points.length - 1][0] : 0;
      const [x0, x1] = x.window ? [Math.max(0, latest - x.window), Math.max(x.window, latest)] : x.domain;
      const [y0, y1] = y.domain;
      const yTicks = niceTicks(y0, y1, 4);
      const margin = { top: 24, right: 14, bottom: x.label ? 40 : 26, left: 14 + 7.2 * Math.max(...yTicks.map(v => yFormat(v).length)) };
      const plotRight = width - margin.right, bottom = height - margin.bottom;
      const sx = v => margin.left + ((v - x0) / (x1 - x0 || 1)) * (plotRight - margin.left);
      const sy = v => bottom - ((Math.min(v, y1) - y0) / (y1 - y0 || 1)) * (bottom - margin.top);
      svg.replaceChildren();
      for (const s of shades) {
        const a = sx(Math.max(x0, s.from)), b = sx(Math.min(x1, s.to));
        if (b <= a) continue;
        svgEl('rect', { class: 'stem-shade', x: a, y: margin.top, width: b - a, height: bottom - margin.top }, svg);
        if (s.label && b - a > s.label.length * 6.6 + 8) svgEl('text', { class: 'stem-note', x: (a + b) / 2, y: margin.top + 13, 'text-anchor': 'middle' }, svg).textContent = s.label;
      }
      for (const v of yTicks) {
        svgEl('path', { class: 'cache-grid', d: `M${margin.left} ${sy(v)}H${plotRight}` }, svg);
        svgEl('text', { class: 'cache-tick', x: margin.left - 6, y: sy(v) + 4, 'text-anchor': 'end' }, svg).textContent = yFormat(v);
      }
      for (const v of niceTicks(x0, x1, width < 480 ? 4 : 7)) {
        svgEl('path', { class: 'cache-axis', d: `M${sx(v)} ${bottom}v4` }, svg);
        svgEl('text', { class: 'cache-tick', x: sx(v), y: bottom + 17, 'text-anchor': 'middle' }, svg).textContent = xFormat(v);
      }
      svgEl('path', { class: 'cache-axis', d: `M${margin.left} ${margin.top}V${bottom}H${plotRight}` }, svg);
      if (y.label) svgEl('text', { class: 'cache-axis-label', x: margin.left - 2, y: 12 }, svg).textContent = y.label;
      if (x.label) svgEl('text', { class: 'cache-axis-label', x: (margin.left + plotRight) / 2, y: height - 4, 'text-anchor': 'middle' }, svg).textContent = x.label;

      for (const m of marks) {
        if (m.x < x0 || m.x > x1) continue;
        svgEl('path', { class: 'stem-mark', d: `M${sx(m.x)} ${margin.top}V${bottom}` }, svg);
        if (m.label) {
          // Inside the plot, beside the line, so it never meets the axis label above.
          const anchor = sx(m.x) > plotRight - m.label.length * 6.6 - 8 ? 'end' : 'start';
          svgEl('text', { class: 'stem-note', x: sx(m.x) + (anchor === 'start' ? 5 : -5), y: margin.top + 13, 'text-anchor': anchor }, svg).textContent = m.label;
        }
      }
      // All stems in one path; a cap on each stem tall enough to stand out from the axis.
      const g = svgEl('g', { 'data-cache-kind': kind }, svg);
      let d = '';
      for (const [px, py] of points) {
        if (px < x0 || px > x1) continue;
        const top = sy(py);
        if (bottom - top < 0.4) continue;
        d += `M${sx(px).toFixed(1)} ${bottom}V${top.toFixed(1)}`;
      }
      svgEl('path', { class: 'stem-line', d }, g);
      for (const [px, py] of points) {
        if (px < x0 || px > x1 || bottom - sy(py) < 4) continue;
        if (py > y1) svgEl('path', { class: 'stem-cap', d: `M${sx(px) - 4} ${margin.top + 5}L${sx(px)} ${margin.top - 1}L${sx(px) + 4} ${margin.top + 5}z` }, g);
        else svgEl('circle', { class: 'stem-cap', cx: sx(px), cy: sy(py), r: 2.4 }, g);
      }
      for (const r of rules) {
        const ry = sy(r.y);
        const rg = svgEl('g', { 'data-cache-kind': r.kind ?? 'redis' }, svg);
        svgEl('path', { class: 'stem-rule', d: `M${margin.left} ${ry}H${plotRight}` }, rg);
        if (r.label) svgEl('text', { class: 'stem-rule-label', x: plotRight - 2, y: ry - 5, 'text-anchor': 'end' }, rg).textContent = r.label;
      }
    },
  };
  const check = () => {
    const w = Math.round(container.clientWidth);
    if (w && w !== width) {
      width = w;
      svg.setAttribute('viewBox', `0 0 ${w} ${height}`); svg.setAttribute('width', w); svg.setAttribute('height', height);
      chart.render();
    }
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return chart;
}
