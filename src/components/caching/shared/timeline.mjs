// A thread timeline drawn as SVG: one horizontal lane per thread (or client,
// worker or connection), with a block for each busy interval, optional labelled
// spans above the lanes, a "now" line and a time axis. Time is in the caller's
// unit; `format` turns it into tick text.
import { svgEl } from './scene.mjs';
import { niceTicks, stepTicks, placeLabels } from './chart.mjs';

/** The part of [start, end] inside [from, to], or null if none. Pure; tested in node. */
export function clipInterval(start, end, from, to) {
  const a = Math.max(start, from), b = Math.min(end, to);
  return b > a || (b === a && start === end && a >= from && a <= to) ? [a, b] : null;
}

/** Width of the lane-label column: fits the longest label (or `short` label when compact). Pure. */
export function laneLabelWidth(lanes, compact, charWidth = 7) {
  const longest = Math.max(1, ...lanes.map(l => String((compact && l.short) || l.label || '').length));
  return Math.ceil(longest * charWidth + 16);
}

/**
 * threadTimeline(container, {
 *   label,                               accessible name
 *   lanes: [{ id, label, short? }],      top to bottom; `short` is used below 480 px
 *   laneHeight = 28,
 *   labelWidth?,                         default: fits the labels
 *   format?(t) -> text,                  tick text, in the caller's time unit
 *   axisLabel?, tickStep?,               axis title; a tick at every multiple of tickStep
 * })
 * Returns { render({ from, to, blocks, spans?, now? }) } where
 *   blocks: [{ lane, start, end, kind, label?, thin? }]   busy intervals; thin draws a slim bar (waiting)
 *   spans:  [{ start, end, label, kind? }]                 brackets above the lanes, labels never overlapping
 *   now:    a dashed "now" line at this time
 */
export function threadTimeline(container, { label, lanes, laneHeight = 28, labelWidth, format = v => String(v), axisLabel, tickStep }) {
  container.replaceChildren();
  container.classList.add('cache-thread-timeline');
  const svg = svgEl('svg', { class: 'cache-svg', role: 'img', 'aria-label': label }, container);
  let width = 0;
  let last = null;

  const draw = data => {
    last = data;
    if (!width) return;
    const { from, to, blocks = [], spans = [], now } = data;
    const compact = width < 480;
    const left = labelWidth ?? laneLabelWidth(lanes, compact);
    const right = width - 10;
    const x = t => left + ((t - from) / (to - from || 1)) * (right - left);
    const shownSpans = spans.map(s => ({ ...s, range: clipInterval(s.start, s.end, from, to) })).filter(s => s.range);
    const placed = placeLabels(shownSpans.map(s => ({ x: (x(s.range[0]) + x(s.range[1])) / 2, text: s.label ?? '', span: s })), { left, right: width, charWidth: 7, gap: 10 });
    const spanRows = placed.length ? Math.max(...placed.map(p => p.row)) + 1 : 0;
    const top = spanRows ? spanRows * 18 + 10 : 6;
    const pitch = laneHeight + 8;
    const lanesH = lanes.length * pitch;
    const height = top + lanesH + (axisLabel ? 44 : 26);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.replaceChildren();
    const laneY = id => top + Math.max(0, lanes.findIndex(l => l.id === id)) * pitch;

    for (const lane of lanes) {
      const y = laneY(lane.id);
      svgEl('rect', { class: 'cache-tl-track', x: left, y, width: right - left, height: laneHeight, rx: 2 }, svg);
      svgEl('text', { class: 'cache-tl-lane', x: left - 8, y: y + laneHeight / 2 + 4, 'text-anchor': 'end' }, svg).textContent = (compact && lane.short) || lane.label;
    }

    // Busy intervals; very short ones stay at least 1 px wide so they remain visible.
    for (const b of blocks) {
      const range = clipInterval(b.start, b.end, from, to);
      if (!range) continue;
      const x0 = x(range[0]), x1 = x(range[1]);
      const y = laneY(b.lane);
      const h = b.thin ? 4 : laneHeight - 4;
      svgEl('rect', { class: 'cache-tl-block', 'data-cache-kind': b.kind ?? 'neutral', x: x0, y: b.thin ? y + laneHeight - 6 : y + 2, width: Math.max(1, x1 - x0), height: h, rx: b.thin ? 2 : 1 }, svg);
      if (b.label && !b.thin && x1 - x0 > String(b.label).length * 7.4 + 10) {
        svgEl('text', { class: 'cache-tl-block-label', x: (x0 + x1) / 2, y: y + laneHeight / 2 + 4, 'text-anchor': 'middle' }, svg).textContent = b.label;
      }
    }

    for (const p of placed) {
      const s = p.span;
      const x0 = x(s.range[0]), x1 = x(s.range[1]);
      const g = svgEl('g', { class: 'cache-tl-span', 'data-cache-kind': s.kind ?? 'neutral' }, svg);
      const base = top - 4;
      const labelY = 13 + p.row * 18;
      svgEl('path', { d: `M${x0} ${base}V${labelY + 4}H${Math.max(x0 + 1, x1)}V${base}` }, g);
      svgEl('text', { x: p.x, y: labelY, 'text-anchor': p.anchor }, g).textContent = p.text;
    }

    if (now !== undefined && now >= from && now <= to) {
      svgEl('path', { class: 'cache-tl-now', d: `M${x(now)} ${top - 4}V${top + lanesH - 4}` }, svg);
    }

    const axisY = top + lanesH;
    svgEl('path', { class: 'cache-axis', d: `M${left} ${axisY}H${right}` }, svg);
    for (const v of tickStep > 0 ? stepTicks(from, to, tickStep) : niceTicks(from, to, compact ? 3 : 6)) {
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
