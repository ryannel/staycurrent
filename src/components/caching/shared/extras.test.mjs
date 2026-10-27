// Tests for the toolkit additions of 27 October 2026 (second round): label layout,
// log and stepped ticks, time units, parameter text, grid layout, timeline clipping
// and lane-label splitting. Run: node --test src/components/caching/shared/
import test from 'node:test';
import assert from 'node:assert/strict';
import { placeLabels, logTicks, stepTicks, logFloor, logCeil, logFormat } from './chart.mjs';
import { exponentialGap, poissonArrivals, Simulation, seededRandom, paramText, formatDuration, clockText } from './sim.mjs';
import { splitLabel } from './sequence.mjs';
import { gridLayout } from './grid.mjs';
import { clipInterval, laneLabelWidth } from './timeline.mjs';
import { dotShape, CLIENT_DOT_SCALE } from './shapes.mjs';

test('labels that fit stay on one row; close labels take new rows without overlapping', () => {
  const apart = placeLabels([{ x: 100, text: 'p50' }, { x: 300, text: 'p99' }], { left: 0, right: 500 });
  assert.deepEqual(apart.map(l => l.row), [0, 0]);
  // Three markers within a few pixels: the old two-row alternation put the third on the first.
  const close = placeLabels([{ x: 200, text: 'p50 1.0 ms' }, { x: 210, text: 'mean 2.0 ms' }, { x: 220, text: 'p99 14 ms' }], { left: 0, right: 500 });
  assert.deepEqual(close.map(l => l.row), [0, 1, 2]);
  for (let i = 0; i < close.length; i++) {
    for (let j = i + 1; j < close.length; j++) {
      if (close[i].row === close[j].row) assert.ok(close[j].start >= close[i].end, 'same-row labels overlap');
    }
  }
  // A third label clear of the first returns to row 0.
  const reuse = placeLabels([{ x: 100, text: 'aaaa' }, { x: 110, text: 'bbbb' }, { x: 200, text: 'cccc' }], { left: 0, right: 500 });
  assert.deepEqual(reuse.map(l => l.row), [0, 1, 0]);
});

test('labels near the edges anchor inwards', () => {
  const [l, r] = placeLabels([{ x: 2, text: 'start label' }, { x: 498, text: 'end label' }], { left: 0, right: 500 });
  assert.equal(l.anchor, 'start');
  assert.equal(r.anchor, 'end');
  assert.ok(r.end <= 500);
});

test('log ticks', () => {
  assert.deepEqual(logTicks(1, 1e6), [1, 10, 100, 1000, 10000, 100000, 1000000]);
  assert.deepEqual(logTicks(1, 100), [1, 2, 5, 10, 20, 50, 100]);
  assert.deepEqual(logTicks(0.01, 1), [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1]);
  assert.deepEqual(logTicks(1, 1e10), [1, 100, 10000, 1000000, 100000000, 10000000000]);
  assert.equal(logFloor(37), 10);
  assert.equal(logCeil(37), 100);
  assert.equal(logCeil(100), 100);
  assert.equal(logFormat(0.05), '0.05');
  assert.equal(logFormat(20000), '20k');
  assert.equal(logFormat(3e6), '3M');
});

test('ticks at a chosen step', () => {
  assert.deepEqual(stepTicks(0, 300, 60), [0, 60, 120, 180, 240, 300]);
  assert.deepEqual(stepTicks(25, 130, 50), [50, 100]);
  assert.deepEqual(stepTicks(0, 1, 0.1).length, 11);
  assert.deepEqual(stepTicks(10, 40, 15, 5), [20, 35]);
});

test('Poisson arrivals in a microsecond model', () => {
  const r = seededRandom(4);
  let total = 0;
  for (let i = 0; i < 20000; i++) total += exponentialGap(r, 5000, 1e6);
  assert.ok(Math.abs(total / 20000 - 200) < 6, `mean gap ${total / 20000} µs`);
  const sim = new Simulation({ seed: 8 });
  let count = 0;
  poissonArrivals(sim, 10000, () => count++, { unitsPerSecond: 1e6 });
  sim.advance(1e6); // one second of microseconds
  assert.ok(Math.abs(count - 10000) < 400, `count ${count}`);
  // The default still counts milliseconds.
  const ms = new Simulation({ seed: 8 });
  let n = 0;
  poissonArrivals(ms, 100, () => n++);
  ms.advance(10000);
  assert.ok(Math.abs(n - 1000) < 100, `count ${n}`);
});

test('durations and clocks in other units', () => {
  assert.equal(formatDuration(50, 'us'), '50 µs');
  assert.equal(formatDuration(1500, 'us'), '1.5 ms');
  assert.equal(formatDuration(300000), '300 s');
  assert.equal(formatDuration(250), '250 ms');
  assert.equal(formatDuration(2, 's'), '2 s');
  assert.equal(formatDuration(0, 'us'), '0 µs');
  assert.equal(formatDuration(0), '0 ms');
  assert.equal(clockText(450, 'us'), '450 µs');
  assert.equal(clockText(4500, 'us'), '4.50 ms');
  assert.equal(clockText(45000, 'us'), '45.0 ms');
  assert.equal(clockText(2.5e6, 'us'), '2.5 s');
  assert.equal(clockText(12300, 'ms'), '12.3 s');
  assert.equal(clockText(12.3, 's'), '12.3 s');
});

test('parameter text uses custom labels before the format', () => {
  const labels = { 0: 'off', 1: 'one replica', 0.5: 'half' };
  assert.equal(paramText(0, { labels }), 'off');
  assert.equal(paramText('1', { labels }), 'one replica');
  assert.equal(paramText('0.50', { labels }), 'half');
  assert.equal(paramText(3, { labels, unit: 'replicas' }), '3 replicas');
  assert.equal(paramText(0.8, { format: 'percent' }), '80%');
});

test('lane labels split at the space nearest the middle', () => {
  assert.deepEqual(splitLabel('Application server'), ['Application', 'server']);
  assert.deepEqual(splitLabel('Lazy free thread'), ['Lazy free', 'thread']);
  assert.deepEqual(splitLabel('Database'), ['Database']);
});

test('grid layout fills the width and wraps', () => {
  const g = gridLayout(100, 30, { cellWidth: 16, gap: 4 });
  assert.equal(g.columns, 5); // 5 × 16 + 4 × 4 = 96
  assert.equal(g.rows, 6);
  assert.deepEqual(g.at(6), [20, 20]);
  assert.equal(g.height, 6 * 20 - 4);
  const fixed = gridLayout(100, 10, { cellWidth: 30, gap: 2, columns: 5 });
  assert.ok(fixed.width <= 100.001, `width ${fixed.width}`);
  assert.ok(fixed.cellWidth < 30);
  const bounded = gridLayout(1000, 100, { cellWidth: 10, maxColumns: 20 });
  assert.equal(bounded.columns, 20);
  const labelled = gridLayout(100, 4, { cellWidth: 10, gap: 0, left: 60 });
  assert.equal(labelled.columns, 4);
  assert.deepEqual(labelled.at(1), [70, 0]);
});

test('timeline intervals clip to the window', () => {
  assert.deepEqual(clipInterval(5, 15, 10, 20), [10, 15]);
  assert.equal(clipInterval(0, 10, 10, 20), null);
  assert.equal(clipInterval(25, 30, 10, 20), null);
  assert.deepEqual(clipInterval(12, 12, 10, 20), [12, 12]);
  assert.equal(laneLabelWidth([{ label: 'Main thread', short: 'Main' }], false), 11 * 7 + 16);
  assert.equal(laneLabelWidth([{ label: 'Main thread', short: 'Main' }], true), 4 * 7 + 16);
});

test('a pending request is a smaller filled dot than a hit, so the two differ without hue', () => {
  const radius = d => Number(/^M(-?[\d.]+) /.exec(d)[1]) * -1;
  const request = dotShape('client', 5), hit = dotShape('hit', 5);
  assert.equal(request.paint, 'fill');
  assert.equal(hit.paint, 'fill');
  assert.equal(radius(hit.d), 5);
  assert.equal(radius(request.d), 5 * CLIENT_DOT_SCALE);
  assert.ok(CLIENT_DOT_SCALE <= 0.7);
});
