// Figure 1's drawing: the database's value and Redis's copy as bands over
// time, with reads, writes, deletes and expiries as marks. The newest moment is
// at the right edge. A local extension: the shared scene draws systems and the
// shared charts draw numbers, not a value's history.
import { svgEl } from '../shared/scene.mjs';
import { dotShape } from '../shared/shapes.mjs';

const at = (history, t) => { let v = history[0]; for (const h of history) { if (h.t <= t) v = h; else break; } return v; };

/** Splits [from, to] into runs with the same database version and cached version. Pure. */
export function runs(dbHistory, cacheHistory, from, to) {
  const cuts = new Set([from, to]);
  for (const h of [...dbHistory, ...cacheHistory]) if (h.t > from && h.t < to) cuts.add(h.t);
  const times = [...cuts].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < times.length - 1; i++) {
    const a = times[i], b = times[i + 1];
    if (b - a <= 0) continue;
    const db = at(dbHistory, a).version, cache = at(cacheHistory, a).version;
    const last = out.at(-1);
    if (last && last.db === db && last.cache === cache) last.to = b;
    else out.push({ from: a, to: b, db, cache });
  }
  return out;
}

export function valueTimeline(container, { label, priceOf, seconds = [20, 12] }) {
  container.replaceChildren();
  const svg = svgEl('svg', { class: 'cache-svg inv-timeline', role: 'img', 'aria-label': label }, container);
  let width = 0, last = null;
  const draw = model => {
    if (!width) return;
    const compact = width < 480;
    const lw = compact ? 66 : 92;
    const left = lw, right = width - 10;
    const span = seconds[compact ? 1 : 0] * 1000;
    const now = model.sim.now;
    const from = now - span;
    const x = t => left + ((t - from) / span) * (right - left);
    const rows = { db: 30, redis: 78, reads: 122 };
    const bandH = 30;
    const height = 172;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width); svg.setAttribute('height', height);
    svg.replaceChildren();
    const labels = [['db', 'Database'], ['redis', 'Redis copy'], ['reads', 'Reads']];
    for (const [id, text] of labels) svgEl('text', { class: 'inv-row-label', x: 2, y: rows[id] + 4 }, svg).textContent = compact && id === 'redis' ? 'Redis' : text;

    const segs = runs(model.dbHistory, model.cacheHistory, Math.max(0, from), now);
    // Database band.
    const dbRuns = [];
    for (const s of segs) { const lastRun = dbRuns.at(-1); if (lastRun && lastRun.v === s.db) lastRun.to = s.to; else dbRuns.push({ from: s.from, to: s.to, v: s.db }); }
    for (const r of dbRuns) {
      const a = x(r.from), b = x(r.to);
      const g = svgEl('g', { 'data-cache-kind': 'database' }, svg);
      svgEl('rect', { class: 'inv-band', x: a, y: rows.db - bandH / 2, width: Math.max(0, b - a), height: bandH }, g);
      if (b - a > 30) svgEl('text', { class: 'inv-band-text', x: (a + b) / 2, y: rows.db + 4, 'text-anchor': 'middle' }, g).textContent = priceOf(r.v);
    }
    // Redis band: fresh, stale or empty.
    const cacheRuns = [];
    for (const s of segs) {
      const state = s.cache === null ? 'empty' : s.cache < s.db ? 'stale' : 'fresh';
      const lastRun = cacheRuns.at(-1);
      if (lastRun && lastRun.state === state && lastRun.v === s.cache) lastRun.to = s.to;
      else cacheRuns.push({ from: s.from, to: s.to, state, v: s.cache });
    }
    for (const r of cacheRuns) {
      const a = x(r.from), b = x(r.to);
      const kind = r.state === 'stale' ? 'stale' : r.state === 'fresh' ? 'redis' : 'neutral';
      const g = svgEl('g', { 'data-cache-kind': kind }, svg);
      svgEl('rect', { class: r.state === 'empty' ? 'inv-band is-empty' : 'inv-band', x: a, y: rows.redis - bandH / 2, width: Math.max(0, b - a), height: bandH }, g);
      const text = r.state === 'empty' ? 'none' : r.state === 'stale' ? `${priceOf(r.v)} stale` : priceOf(r.v);
      if (b - a > text.length * 7.4 + 8) svgEl('text', { class: 'inv-band-text', x: (a + b) / 2, y: rows.redis + 4, 'text-anchor': 'middle' }, g).textContent = text;
      else if (b - a > 30 && r.state !== 'empty') svgEl('text', { class: 'inv-band-text', x: (a + b) / 2, y: rows.redis + 4, 'text-anchor': 'middle' }, g).textContent = priceOf(r.v);
    }
    svgEl('path', { class: 'inv-line', d: `M${left} ${rows.reads}H${right}` }, svg);
    for (const e of model.events) {
      if (e.t < from || e.t > now) continue;
      const y = e.row === 'reads' ? rows.reads : e.row === 'db' ? rows.db - bandH / 2 - 1 : rows.redis - bandH / 2 - 1;
      const { d, paint } = dotShape(e.kind, compact ? 4.4 : 5);
      svgEl('path', { class: 'cache-dot', d, 'data-paint': paint, 'data-cache-kind': e.kind, transform: `translate(${x(e.t).toFixed(1)} ${y})` }, svg);
    }
    const axisY = height - 22;
    svgEl('path', { class: 'inv-axis', d: `M${left} ${axisY}H${right}` }, svg);
    const step = 5000;
    for (let s = 0; s <= span; s += step) {
      const px = x(now - s);
      svgEl('path', { class: 'inv-axis', d: `M${px} ${axisY}v4` }, svg);
      svgEl('text', { class: 'cache-tick', x: px, y: axisY + 17, 'text-anchor': s === 0 ? 'end' : 'middle' }, svg).textContent = s === 0 ? 'now' : `${s / 1000} s ago`;
    }
  };
  const check = () => { const w = Math.round(container.clientWidth); if (w && w !== width) { width = w; if (last) draw(last); } };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(check).observe(container);
  check();
  return { render(model) { last = model; check(); draw(model); } };
}
