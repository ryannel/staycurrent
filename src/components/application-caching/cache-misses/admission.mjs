import { bar, chip, makeScene, path, svg, text } from './ink.mjs';

function draw(t, variant, small) {
  const W = small ? 440 : 760, H = small ? 720 : 650;
  const outage = variant === 'outage', late = variant === 'late';
  const done = t >= .76, queued = t >= .36, refused = t >= .52;
  const sx = [W * .3, W * .7];
  let s = text(W / 2, 28, 'Server A · different missing cards', { size: small ? 21 : 24, weight: 600 });
  s += text(W / 2, 60, outage ? 'Redis timeout: 150 − 10 = 140 ms left' : 'P7, P8, P9 and P10 cannot share one answer', { size: small ? 18 : 21 });
  ['P7', 'P8', 'P9', 'P10'].forEach((key, i) => s += chip(W * (i + 1) / 5, 109, key, '--c0', { size: 19, opacity: t >= i * .13 ? 1 : .25 }));
  s += text(W / 2, 169, 'Admission stays before the connection pool', { size: small ? 18 : 21 });
  s += path(`M${W / 2} 126V145M${sx[0]} 205H${sx[1]}`, { colour: '--ink' });
  s += text(W / 2, 197, '2 executing places', { weight: 600 });
  s += chip(sx[0], 245, t < .05 ? 'free' : done ? (late ? 'free' : 'P9 running') : 'P7 running', '--db', { size: small ? 19 : 21 });
  s += chip(sx[1], 245, t < .18 ? 'free' : 'P8 running', '--db', { size: small ? 19 : 21 });
  s += text(W / 2, 290, done ? 'P7 returns a card; its place opens' : t < .18 ? 'A free place may admit one query' : 'Busy places cannot take another query', { size: small ? 19 : 21 });
  s += text(W / 2, 340, '1 waiting place', { weight: 600 });
  s += chip(W / 2, 379, queued && !done ? 'P9 waiting' : 'free', '--c1');
  if (queued) s += text(W / 2, 420, late ? 'P9: 8 ms left; a fill needs 20 ms' : 'P9: 100 ms left; a fill needs 20 ms', { size: small ? 18 : 21 });
  if (done) {
    if (!late) s += path(`M${W / 2 - 68} 379H28V245H${sx[0] - 70}m-7 -5l7 5l-7 5`, { colour: '--cache', width: 2 });
    s += text(W / 2, 457, late ? 'P9 is too late: refuse without a query' : 'P9 may start after the deadline check', { size: small ? 18 : 21, weight: 600 });
  }
  if (refused) {
    s += chip(70, 503, 'P10', '--miss');
    s += path(`M105 503H140`, { colour: '--miss', width: 2 });
    s += text(152, 510, 'queue full → fallback now', { size: small ? 18 : 21, anchor: 'start' });
  }
  s += text(24, 552, 'Use an older copy only inside its hard limit.', { size: small ? 18 : 21, anchor: 'start' });
  s += text(24, 582, 'Otherwise: available fields or HTTP 503.', { size: small ? 18 : 21, anchor: 'start' });
  s += text(24, 612, 'A fallback starts no extra source read.', { size: small ? 18 : 21, anchor: 'start' });
  if (outage) {
    s += text(24, 660, '20,000 requests/s across 20 servers', { size: small ? 19 : 22, weight: 600, anchor: 'start' });
    s += text(24, 693, '40 places ÷ 20 ms ≈ 2,000 fills/s', { size: small ? 18 : 21, anchor: 'start' });
    s += text(24, 726, 'Local sharing still leaves 17,700 loads/s.', { size: small ? 18 : 21, anchor: 'start' });
    s += bar(24, W - 24, 759, '--miss', 12) + bar(24, 24 + (W - 48) * .12, 759, '--cache', 12);
    s += text(24, 795, '12% full cards, incl. joined', { size: small ? 17 : 21, anchor: 'start' });
    s += text(W - 24, 795, '88% fallback', { size: small ? 18 : 21, anchor: 'end' });
  }
  return svg(s, small, W, outage ? 830 : H);
}

export const admission = makeScene({
  title: 'Admit only work that can finish', duration: 8000, defaultVariant: 'miss', draw,
  actions: [{ value: 'miss', label: 'Cache misses' }, { value: 'late', label: 'Too little time remains' }, { value: 'outage', label: 'Redis unavailable' }],
  alt: 'Each server allows two executing fills and one waiting request. P7 and P8 occupy the places, P9 waits and P10 receives a fallback immediately. When P7 finishes, P9 starts only if enough deadline remains. The same admission works after a Redis timeout.',
  textAlternative: 'P7 and P8 are different cards and occupy both source execution places on Server A. P9 takes the one waiting place. P10 arrives to a full queue and receives a fallback without querying the source. When P7 actually finishes, P9’s remaining time is checked: 100 ms permits an illustrative 20 ms fill; 8 ms does not. A valid older local copy, already available reduced fields, or HTTP 503 provides the fallback without further source work. In the outage view the Redis call has used 10 of 150 ms, leaving at most 140 ms. Across twenty servers the same two-place limits retain forty executing places. In the article’s outage simulation about 12% of requests receive full cards, including joined callers; the rest require fallback.',
  caption: 'Admission protects the source across different keys and through Redis failure. Demand, refresh, warming and retries share the allowance. Check a waiting caller’s remaining time, and release a place only when source work ends. Outage counts come from the shop’s 50,000-card simulation: popular keys let some callers join admitted fills.',
});
