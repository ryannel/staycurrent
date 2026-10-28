// A ladder diagram (a time-sequence diagram on its side): time runs left to
// right, the application's lane is above Redis's, and every request is a line
// slanting down to Redis and every reply a line slanting back up. Lines are
// drawn up to the current time, so the page's reads unfold as the clock runs.
// A local extension of the shared toolkit, whose sequence diagrams show order
// but not time; reported as a toolkit gap.
import { svgEl } from '../shared/scene.mjs';
import { niceTicks } from '../shared/chart.mjs';
import { CLIENT_DOT_SCALE } from '../shared/shapes.mjs';

const fmtMs = us => {
  const ms = Math.round(us) / 1000;
  if (ms === 0 || (ms >= 1 && Number.isInteger(ms))) return `${ms} ms`;
  return `${ms >= 100 ? ms.toFixed(0) : ms.toFixed(ms >= 1 ? 1 : 2)} ms`;
};

/**
 * ladder(container, { label })
 * Returns { render({ sched, span, now, done }) } where
 *   sched: a schedule() result (messages and work, times in µs)
 *   span:  µs shown across the width
 *   now:   µs; nothing after it is drawn
 */
export function ladder(container, { label }) {
  container.replaceChildren();
  container.classList.add('ladder');
  const svg = svgEl('svg', { class: 'cache-svg', role: 'img', 'aria-label': label }, container);
  let width = 0;
  let last = null;

  const draw = data => {
    last = data;
    if (!width) return;
    const { sched, span, now } = data;
    const compact = width < 480;
    const left = compact ? 52 : 98, right = width - 14;
    const appY = 28, redisY = compact ? 128 : 138, laneH = 14;
    const axisY = redisY + laneH + 10;
    const height = axisY + 40;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.replaceChildren();
    const x = t => left + (Math.min(t, span) / span) * (right - left);

    // Lanes
    for (const [y, text, short, kind] of [[appY, 'Application', 'App', 'app'], [redisY, 'Redis', 'Redis', 'redis']]) {
      svgEl('rect', { class: 'ladder-track', 'data-cache-kind': kind, x: left, y: y - laneH / 2, width: right - left, height: laneH, rx: 2 }, svg);
      svgEl('text', { class: 'ladder-lane', x: left - 8, y: y + 4, 'text-anchor': 'end' }, svg).textContent = compact ? short : text;
    }

    // Axis
    const ticks = niceTicks(0, span / 1000, compact ? 4 : 6).filter(v => v * 1000 <= span * 1.001);
    svgEl('path', { class: 'ladder-axis', d: `M${left} ${axisY}H${right}` }, svg);
    for (const v of ticks) {
      const tx = x(v * 1000);
      svgEl('path', { class: 'ladder-axis', d: `M${tx} ${axisY}v5` }, svg);
      svgEl('text', { class: 'ladder-tick', x: tx, y: axisY + 18, 'text-anchor': 'middle' }, svg).textContent = fmtMs(v * 1000);
    }
    svgEl('text', { class: 'ladder-axis-label', x: right, y: axisY + 35, 'text-anchor': 'end' }, svg).textContent = 'Time since the page asked for its first value';

    // Work on each lane: the application writing commands and reading replies, Redis serving them.
    for (const w of sched.work) {
      if (w.t0 > now) continue;
      const y = w.lane === 'app' ? appY : redisY;
      const x0 = x(w.t0), x1 = x(Math.min(w.t1, now));
      svgEl('rect', { class: 'ladder-work', 'data-cache-kind': w.lane === 'app' ? 'app' : 'redis', x: x0, y: y - laneH / 2 + 2, width: Math.max(2, x1 - x0), height: laneH - 4, rx: 1 }, svg);
    }

    // Requests and replies. Labels are collected and drawn after every line, so
    // their halo sits over any later line that crosses them.
    const labelled = new Set();
    const labels = [];
    const many = sched.messages.length > 2;
    for (const m of sched.messages) {
      if (m.t0 > now) continue;
      const out = m.dir === 'out';
      const y0 = out ? appY + laneH / 2 : redisY - laneH / 2;
      const y1 = out ? redisY - laneH / 2 : appY + laneH / 2;
      const f = Math.min(1, (now - m.t0) / (m.t1 - m.t0 || 1));
      const x0 = x(m.t0), x1 = x(m.t1);
      const ex = x0 + (x1 - x0) * f, ey = y0 + (y1 - y0) * f;
      svgEl('path', { class: m.count > 1 ? 'ladder-msg is-heavy' : 'ladder-msg', 'data-cache-kind': out ? 'client' : 'hit', d: `M${x0} ${y0}L${ex} ${ey}` }, svg);
      // A request's dot is smaller than a reply's, as in the shared toolkit's scenes.
      const r = (m.count > 1 ? 3.2 : 2.6) * (out ? CLIENT_DOT_SCALE : 1);
      if (f >= 1) svgEl('circle', { class: 'ladder-end', 'data-cache-kind': out ? 'client' : 'hit', cx: x1, cy: y1, r }, svg);
      // Label the first request and the first reply only, beside their line.
      if (!labelled.has(m.dir) && f > 0.4) {
        labelled.add(m.dir);
        const text = many && sched.trips === 1 ? `${sched.messages.length / 2} × ${m.label}` : m.label;
        const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        labels.push({ text, kind: out ? 'client' : 'hit', x: out ? mx - 6 : mx + 6, y: my + 4, anchor: out ? 'end' : 'start' });
      }
    }

    // The clock, and the moment the page has all its values.
    if (now < sched.total) svgEl('path', { class: 'ladder-now', d: `M${x(now)} ${appY - laneH}V${redisY + laneH / 2}` }, svg);
    else {
      const tx = x(sched.total);
      svgEl('path', { class: 'ladder-done', d: `M${tx} ${appY - laneH / 2 - 6}V${redisY + laneH / 2}` }, svg);
      // Keep the label inside the plot: run it right of the line if it fits, otherwise left.
      const text = `${compact ? 'all values' : 'page has every value'}: ${fmtMs(sched.total)}`;
      const fits = tx + text.length * 6.6 <= right;
      const t = svgEl('text', { class: 'ladder-done-label', x: fits ? tx : Math.min(tx, right), y: appY - laneH / 2 - 9, 'text-anchor': fits ? 'start' : 'end' }, svg);
      t.textContent = text;
    }
    for (const l of labels) svgEl('text', { class: 'ladder-label', 'data-cache-kind': l.kind, x: l.x, y: l.y, 'text-anchor': l.anchor }, svg).textContent = l.text;
  };

  const resize = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; if (last) draw(last); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(container);
  resize();
  return { render: draw };
}

export { fmtMs };
