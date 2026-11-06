// Figure: computations of the under-£21 list started after its entry expires.
// Arrivals every 2.5 ms (400 a second); each miss starts a computation until the
// first fill lands. Counts follow rate × fill time; the pilot's native run gave 61 and 242.
import { axis, disc, makeScene, path, pulse, svg, text } from './ink.mjs';

const T = 700, MAX = 250, GAP = 2.5;

function draw(t, variant, small) {
  const fill = variant === 'slow' ? 600 : 150;
  const total = fill / GAP;
  const W = small ? 440 : 760, H = small ? 440 : 400;
  const X0 = small ? 66 : 112, X1 = small ? 414 : 724, Y0 = small ? 350 : 318, Y1 = small ? 86 : 62;
  const x = ms => X0 + (X1 - X0) * ms / T, y = n => Y0 - (Y0 - Y1) * n / MAX;
  const now = t * T;
  let s = '';
  for (const n of [100, 200]) {
    s += path(`M${X0} ${y(n)}H${X1}`, { colour: '--line', width: 1 });
    s += text(X0 - 12, y(n) + 6, String(n), { size: 18, colour: '--muted', anchor: 'end' });
  }
  s += text(X0 - 12, Y0 + 6, '0', { size: 18, colour: '--muted', anchor: 'end' });
  s += text(X0 - (small ? 50 : 96), Y1 - (small ? 46 : 30), 'List computations started', { size: small ? 19 : 20, colour: '--muted', anchor: 'start' });
  s += axis(X0, X1, Y0, small ? [0, 200, 400, 600] : [0, 100, 200, 300, 400, 500, 600, 700], x, v => v ? `${v} ms` : '0');
  // The whole fleet's card-fill concurrency: 2,000 fills a second at 20 ms.
  s += path(`M${X0} ${y(40)}H${X1}`, { colour: '--ink', width: 1.4, dash: '6 6' });
  s += text(X1, y(40) + 26, small ? '40 fill slots, fleet' : '40 fill slots across the fleet', { size: 19, colour: '--ink', anchor: 'end' });
  // Staircase of starts, drawn up to the present moment.
  const until = Math.min(now, T);
  let d = `M${x(0)} ${y(1)}`;
  for (let ms = GAP; ms <= until; ms += GAP) {
    const n = Math.min(Math.floor(ms / GAP) + 1, total);
    d += `H${x(ms).toFixed(1)}V${y(n).toFixed(1)}`;
  }
  d += `H${x(until).toFixed(1)}`;
  s += path(d, { colour: '--db', width: 2.6 });
  const shown = Math.min(Math.floor(until / GAP) + 1, total);
  if (now < fill) s += disc(x(until), y(shown), '--db', 6);
  if (now >= fill) {
    s += path(`M${x(fill)} ${Y0}V${y(total) + 14}`, { colour: '--cache', width: 1.6, dash: '2 5' });
    s += disc(x(fill), y(total), '--cache', 7) + pulse(t, fill / T, x(fill), y(total), '--cache', 8, .06);
    const label = `${total} computations`;
    if (variant === 'slow') s += text(x(fill) - 12, y(total) - 16, label, { size: small ? 21 : 23, weight: 600, anchor: 'end' });
    else s += text(x(fill) + 16, y(total) - 12, label, { size: small ? 21 : 23, weight: 600, anchor: 'start' });
    const note = `first fill lands, ${fill} ms`;
    s += small && variant === 'slow'
      ? text(X1, Y0 + 60, note, { size: 19, colour: '--cache', anchor: 'end' })
      : text(x(fill), Y0 + 60, note, { size: 19, colour: '--cache' });
  }
  return svg(s, small, W, H);
}

export const stampede = makeScene({
  title: 'Computations after one expiry',
  duration: 6500,
  defaultVariant: 'base',
  actions: [{ value: 'base', label: '150 ms computation' }, { value: 'slow', label: 'Source slows to 600 ms' }],
  draw,
  alt: 'A chart of list computations started against time after the under-£21 list expires, with a request every 2.5 ms and no protection. A dashed line marks the 40 fill slots of the whole fleet.',
  altFor: v => v === 'slow'
    ? 'With a 600 ms computation, the count climbs by one every 2.5 ms until the first fill lands at 600 ms: 240 computations, six times the dashed line at 40 fill slots across the fleet.'
    : 'With a 150 ms computation, the count climbs by one every 2.5 ms until the first fill lands at 150 ms: 60 computations, above the dashed line at 40 fill slots across the fleet.',
  textAlternative: 'A chart of list computations started against time after the under-£21 list expires, at 400 requests a second with no protection. Every request that arrives before the first fill lands starts its own computation, so the count climbs by one every 2.5 ms. With a 150 ms computation it reaches 60 when the first fill lands at 150 ms. With a 600 ms computation it reaches 240 at 600 ms. A dashed line at 40 marks the fill slots of the whole fleet; both counts pass it.',
  caption: 'Computations of the under-£21 list started after its entry expires, at 400 requests a second with no protection. The count is the arrival rate times the time to the first fill.',
});
