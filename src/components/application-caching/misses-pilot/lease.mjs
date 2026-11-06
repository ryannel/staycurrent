// Figure: a slow lease owner. Times follow the pilot's native run on Redis 7.0.15 and
// PostgreSQL 16.15 (query durations modelled with pg_sleep): A's 200 ms lease expires while
// its query runs to 900 ms; B takes a new lease at 210 ms and publishes at 360 ms. With
// statement_timeout = 180 ms on A's fill, PostgreSQL cancels A's query at 181 ms.
import { axis, bar, chip, makeScene, path, pulse, svg, text } from './ink.mjs';

const T = 1000;

function draw(t, variant, small) {
  const timeout = variant === 'timeout';
  const aEnd = timeout ? 181 : 900;
  const W = small ? 440 : 760;
  const X0 = small ? 30 : 150, X1 = small ? 396 : 712;
  const x = ms => X0 + (X1 - X0) * ms / T;
  const now = t * T * 1.05;
  // Rows: lane name, lease chip, lease bar, query bar, notes.
  const L = small
    ? { aName: 30, aChip: 62, aLease: 86, aQuery: 108, aEnd: 172, both: 140, bName: 212, bChip: 244, bLease: 268, bQuery: 290, older: 320, cName: 362, cBar: 392, cChip: 426, axis: 458, H: 514 }
    : { aName: 98, aChip: 50, aLease: 74, aQuery: 98, aEnd: 132, both: 154, bName: 222, bChip: 174, bLease: 198, bQuery: 222, older: 254, cName: 312, cBar: 312, cChip: 312, axis: 360, H: 412 };
  let s = '';
  const name = (y, label) => small ? text(X0, y, label, { size: 20, anchor: 'start' }) : text(30, y + 7, label, { size: 21, anchor: 'start' });
  const upto = (a, b) => Math.max(a, Math.min(now, b));

  // Two computations at once: the slow owner's query and its replacement's.
  if (!timeout && now >= 210) {
    const right = x(Math.min(now, 360));
    const w = Math.max(0, right - x(210));
    s += `<rect x="${x(210)}" y="${L.aQuery - 14}" width="${w}" height="28" rx="6" fill="var(--miss)" opacity=".14"/>`;
    s += `<rect x="${x(210)}" y="${L.bLease - 12}" width="${w}" height="${L.bQuery - L.bLease + 26}" rx="6" fill="var(--miss)" opacity=".14"/>`;
    if (now >= 360) s += text(x(360) + 10, L.both, '2 computations', { size: small ? 18 : 19, weight: 600, anchor: 'start' });
  }

  // Server A
  s += name(L.aName, 'Server A');
  s += bar(x(0), x(upto(0, 200)), L.aLease, '--c0', 8);
  s += chip(x(100), L.aChip, 'lease tokA', '--c0', { size: 17 });
  s += bar(x(0), x(upto(0, aEnd)), L.aQuery, '--db', 14);
  if (now >= aEnd) {
    s += pulse(t, aEnd / (T * 1.05), x(aEnd), L.aQuery, '--miss', 8);
    if (timeout) s += chip(x(aEnd) + 8, L.aQuery, 'timeout, release 1', '--miss', { size: 17, anchor: 'start' });
    else s += chip(W - 6, L.aEnd, 'publish 0, release 0', '--miss', { size: 17, anchor: 'end' });
  }

  // Server B
  s += name(L.bName, 'Server B');
  if (now >= 10) {
    s += path(`M${x(10)} ${L.bQuery}H${x(upto(10, 210))}`, { colour: '--c1', width: 1.8, dash: '2 5' });
    s += text(x(110), L.older, small ? 'older list' : 'serves older list', { size: 18, colour: '--muted' });
  }
  if (now >= 210) {
    s += bar(x(210), x(upto(210, 360)), L.bLease, '--c1', 8);
    s += chip(x(285), L.bChip, 'tokB', '--c1', { size: 17 });
    s += bar(x(210), x(upto(210, 360)), L.bQuery, '--db', 14);
  }
  if (now >= 360) s += chip(x(360) + 10, L.bQuery, 'publish 1, release 1', '--cache', { size: 17, anchor: 'start' }) + pulse(t, 360 / (T * 1.05), x(360), L.bQuery, '--cache', 8);

  // The cached list
  s += name(L.cName, 'Cached list');
  s += bar(x(0), x(upto(0, 360)), L.cBar, '--muted', 10, 0.75);
  s += chip(x(small ? 120 : 130), L.cChip, 'older list', '--muted', { size: 17 });
  if (now >= 360) {
    s += bar(x(360), x(upto(360, T)), L.cBar, '--cache', 10);
    s += chip(x(680), L.cChip, 'B’s list', '--cache', { size: 17 });
  }

  s += axis(X0, X1, L.axis, small ? [0, 500, 1000] : [0, 200, 400, 600, 800, 1000], x, v => v ? `${v} ms` : '0');
  return svg(s, small, W, L.H);
}

export const lease = makeScene({
  title: 'A lease outlived by its owner',
  duration: 9000,
  defaultVariant: 'lease',
  actions: [{ value: 'lease', label: 'Lease only' }, { value: 'timeout', label: 'With a source timeout' }],
  draw,
  alt: 'Server A takes a 200 ms lease to compute the under-£21 list. Server B waits and serves the older list, then takes its own lease when A’s expires.',
  altFor: v => v === 'timeout'
    ? 'With a 180 ms statement timeout on A’s fill, PostgreSQL cancels A’s query at 181 ms and A releases its own lease. Server B takes a new lease at 210 ms, computes the list alone and publishes it at 360 ms.'
    : 'Server A’s query stalls until 900 ms, but its lease expires at 200 ms. Server B takes a new lease at 210 ms, so both computations run until B publishes at 360 ms. At 900 ms A’s owner-checked publish and release both return 0, and the cache keeps B’s list.',
  textAlternative: 'Server A takes a 200 ms lease on the under-£21 list with token tokA and starts its query. Server B finds the lease taken at 10 ms and serves the older list. A’s query stalls until 900 ms, but the lease expires at 200 ms; at 210 ms B takes a new lease with token tokB, computes the list in 150 ms, and publishes and releases at 360 ms. Between 210 and 360 ms two computations run. At 900 ms A’s owner-checked publish and release both return 0, so the cache keeps B’s list. With a 180 ms statement timeout on A’s fill, PostgreSQL cancels A’s query at 181 ms, A releases its own lease, and B’s computation runs alone.',
  caption: 'Server A’s lease on the under-£21 list expires while its query is still running. The lease bounds A’s permission; add a source-side timeout to bound its work.',
});
