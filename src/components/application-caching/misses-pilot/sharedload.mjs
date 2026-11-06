// Figure: three callers share one load of P7's card, each with its own deadline.
// Times follow the pilot's native run (evidence/go/wrapper-run.txt, no stale copy): A leaves
// with an error at 50 ms; with a detached load B and C receive the card at about 100 ms;
// with the load tied to A, all three receive an error at 50 ms.
import { axis, bar, chip, disc, makeScene, path, phase, pulse, svg, text } from './ink.mjs';

const T = 200;
const callers = [
  { id: 'A', at: 0, wait: 50, colour: '--c0' },
  { id: 'B', at: 20, wait: 150, colour: '--c1' },
  { id: 'C', at: 40, wait: 150, colour: '--c3' },
];

function draw(t, variant, small) {
  const attached = variant === 'attached';
  const loadEnd = attached ? 50 : 100;
  const W = small ? 440 : 760;
  const X0 = small ? 34 : 268, X1 = small ? 396 : 712;
  const x = ms => X0 + (X1 - X0) * ms / T;
  const gap = small ? 96 : 74, top = small ? 64 : 58;
  const now = t * T * 1.08;
  let s = '';
  const lanes = [...callers.map((c, i) => ({ ...c, y: top + i * gap })), { id: 'load', y: top + 3 * gap + (small ? 6 : 10) }];
  const H = lanes[3].y + (small ? 150 : 104);
  const label = (lane, main, sub) => small
    ? text(X0 - 6, lane.y - 26, `${main} · ${sub}`, { size: 19, anchor: 'start' })
    : text(30, lane.y - 3, main, { size: 21, anchor: 'start' }) + text(30, lane.y + 21, sub, { size: 18, colour: '--muted', anchor: 'start' });
  const chipY = lane => small ? lane.y + 30 : lane.y - 28;

  callers.forEach((c, i) => {
    const lane = lanes[i];
    s += label(lane, `Caller ${c.id}`, `waits ${c.wait} ms`);
    s += path(`M${x(c.at)} ${lane.y}H${x(c.at + c.wait)}`, { colour: '--muted', width: 1.4, dash: '3 5' });
    s += path(`M${x(c.at + c.wait)} ${lane.y - 9}V${lane.y + 9}`, { colour: '--muted', width: 1.4 });
    if (now < c.at) return;
    const end = c.id === 'A' ? 50 : loadEnd;
    s += bar(x(c.at), x(Math.min(now, end)), lane.y, c.colour, 8);
    s += disc(x(c.at), lane.y, c.colour, 8);
    if (now >= end) {
      // A missed, so it holds no older card and leaves with an error. With its own budget the
      // load serves B and C; tied to A, it is cancelled at 50 ms and all three receive an error.
      const failed = attached || c.id === 'A';
      const got = failed ? 'error' : 'GBP 20.00 card';
      const colour = failed ? '--miss' : '--cache';
      s += chip(x(end), chipY(lane), got, colour, { size: 18 }) + pulse(t, end / (T * 1.08), x(end), lane.y, colour, 8);
    }
  });

  const L = lanes[3];
  s += label(L, 'Shared load', attached ? 'tied to caller A' : 'own 120 ms budget');
  if (!attached) {
    s += path(`M${x(0)} ${L.y}H${x(120)}`, { colour: '--muted', width: 1.4, dash: '3 5' });
    s += path(`M${x(120)} ${L.y - 10}V${L.y + 10}`, { colour: '--muted', width: 1.4 });
  }
  s += bar(x(0), x(Math.min(now, loadEnd)), L.y, '--db', 14);
  if (now >= loadEnd) s += chip(x(loadEnd), chipY(L), attached ? 'cancelled' : 'filled', attached ? '--miss' : '--cache', { size: 18 });

  const axisY = L.y + (small ? 76 : 48);
  s += axis(X0, X1, axisY, small ? [0, 100, 200] : [0, 50, 100, 150, 200], x, v => v ? `${v} ms` : '0');
  if (t >= 1) s += text(X1, axisY + (small ? 64 : 58), attached ? '1 read, cancelled at 50 ms' : '1 source read, 2 cards', { size: small ? 20 : 21, weight: 600, anchor: 'end' });
  return svg(s, small, W, H);
}

export const sharedLoad = makeScene({
  title: 'Callers sharing one load',
  duration: 7000,
  defaultVariant: 'detached',
  actions: [{ value: 'detached', label: 'Load has its own budget' }, { value: 'attached', label: 'Load tied to caller A' }],
  draw,
  alt: 'Three callers share one load of P7’s card. Caller A can wait 50 ms, callers B and C 150 ms each.',
  altFor: v => v === 'attached'
    ? 'The load runs under caller A’s deadline. At 50 ms it is cancelled with A, and all three callers receive an error, although B and C could have waited until 170 and 190 ms.'
    : 'The load has its own 120 ms budget. At 50 ms caller A leaves with an error, since it found no card to fall back on. The load fills at 100 ms and callers B and C both receive the GBP 20.00 card: one source read, two fresh cards.',
  textAlternative: 'Caller A misses P7’s card at 0 ms and can wait 50 ms; B joins at 20 ms and C at 40 ms, each able to wait 150 ms. With its own 120 ms budget, the load fills at 100 ms, and B and C receive the card from one source read after A has left with an error. Tied to A’s deadline, the load is cancelled at 50 ms and all three receive an error.',
  caption: 'Three callers share one load of P7’s card, each waiting only until its own deadline. Switch whether the load has its own budget or runs under the first caller’s.',
});
