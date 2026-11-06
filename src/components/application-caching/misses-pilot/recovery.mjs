// Figure: share of card requests served from cache after Redis restarts empty at peak.
// Demand fills: the pilot's simulation (50,000 cards, Zipf exponent 1, 20,000 requests a
// second over 20 Servers, 2 slots and a queue of 1 per Server, 20 ms fills; quarter-second
// buckets, plotted at their midpoints). Prewarm: all 50,000 cards in catalogue order at
// 2,000 fills a second while demand misses wait, so the share grows by 1/25 each second.
import { axis, disc, makeScene, path, svg, text } from './ink.mjs';

const demand = [[0, 0], [0.125, 0.343], [0.375, 0.506], [0.625, 0.579], [0.875, 0.603], [1.125, 0.611], [1.375, 0.659], [1.625, 0.674], [1.875, 0.683], [2.125, 0.698], [2.375, 0.714], [2.625, 0.725], [2.875, 0.742], [3.5, 0.75], [4.5, 0.784], [5.5, 0.79], [6.5, 0.826], [7.5, 0.841], [8.5, 0.851], [9.5, 0.867], [10.5, 0.877], [11.5, 0.895], [12.5, 0.902], [13.5, 0.905], [14.5, 0.916], [15.5, 0.913], [16.5, 0.922], [17.5, 0.927], [18.5, 0.933], [19.5, 0.942], [20, 0.945]];
const T = 20;

function draw(t, variant, small) {
  const W = small ? 440 : 760, H = small ? 440 : 400;
  const X0 = small ? 66 : 96, X1 = small ? 414 : 724, Y0 = small ? 350 : 318, Y1 = small ? 70 : 52;
  const x = sec => X0 + (X1 - X0) * sec / T, y = f => Y0 - (Y0 - Y1) * f;
  const now = t * T;
  let s = '';
  s += path(`M${X0} ${y(0.5)}H${X1}`, { colour: '--line', width: 1 });
  for (const f of [0.5, 1]) s += text(X0 - 12, y(f) + 6, `${f * 100}%`, { size: 18, colour: '--muted', anchor: 'end' });
  s += text(X0 - 12, Y0 + 6, '0', { size: 18, colour: '--muted', anchor: 'end' });
  s += axis(X0, X1, Y0, small ? [0, 5, 10, 15, 20] : [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], x, v => `${v} s`);
  s += path(`M${X0} ${y(0.94)}H${X1}`, { colour: '--ink', width: 1.3, dash: '6 6' });
  s += text(X1, y(0.94) - 12, 'normal hit ratio, 94%', { size: 18, colour: '--muted', anchor: 'end' });
  s += text(X0 - (small ? 50 : 80), Y1 - 26, 'Requests served from cache', { size: small ? 19 : 20, colour: '--muted', anchor: 'start' });

  // Prewarming everything in catalogue order: popularity returns at 1/25 a second.
  const pre = Math.min(now, T);
  s += path(`M${x(0)} ${y(0)}L${x(pre)} ${y(pre / 25)}`, { colour: '--db', width: 2.6 });
  // Demand fills under admission.
  let d = '';
  for (const [sec, f] of demand) {
    if (sec > now) break;
    d += `${d ? 'L' : 'M'}${x(sec).toFixed(1)} ${y(f).toFixed(1)}`;
  }
  if (d) s += path(d, { colour: '--cache', width: 2.8 });
  if (now >= 1) {
    s += disc(x(1.125), y(0.611), '--cache', 6);
    s += text(x(1.125) + 14, y(0.611) + 32, '61% after 1 s', { size: 19, anchor: 'start' });
  }
  if (now >= 5) s += text(x(small ? 6 : 7), y(0.7), 'demand fills', { size: 19, weight: 600, anchor: 'start' });
  if (now >= 5) {
    s += disc(x(5), y(0.2), '--db', 6);
    s += text(x(5) + 14, y(0.2) + 26, '20% after 5 s', { size: 19, anchor: 'start' });
  }
  if (now >= 14) s += text(x(small ? 13 : 13.6), y(0.54) + 34, small ? 'prewarm all' : 'prewarm all 50,000', { size: 19, weight: 600, anchor: 'start' });
  return svg(s, small, W, H);
}

export const recovery = makeScene({
  title: 'Recovering from an empty cache',
  duration: 7000,
  defaultVariant: 'story',
  draw,
  alt: 'A chart of the share of card requests served from cache in the 20 seconds after Redis restarts empty at peak, with source fills held at 2,000 a second. Demand fills reach 61% after one second, about 80% after five and the normal 94% after about 20. Prewarming all 50,000 cards in catalogue order first reaches only 20% after five seconds and 80% after twenty.',
  textAlternative: 'The share of card requests served from cache after Redis restarts empty at peak, with fills held at 2,000 a second. With demand fills, the most requested cards come back first: 34% in the first quarter-second, 61% after one second, about 80% after five seconds and the normal 94% after about 20 seconds. Prewarming all 50,000 cards in catalogue order before serving demand restores popularity evenly, 4% a second: 20% after five seconds and 80% after twenty. Simulated, not measured.',
  caption: 'Requests served from cache after Redis restarts empty at peak, with source fills held at 2,000 a second. Demand fills restore the most requested cards first.',
});
