import { bar, chip, disc, makeScene, path, phase, svg, text } from './ink.mjs';

function draw(t, variant, small) {
  const W = small ? 440 : 760, H = small ? 730 : 650;
  const relief = variant === 'relief';
  let s = '';
  if (variant === 'retries') {
    s += text(W / 2, 30, 'One request · up to 3 attempts at each layer', { size: small ? 18 : 23, weight: 600 });
    const rows = [['Proxy', 3, 'loader calls'], ['Loader', 9, 'database-client calls'], ['Database client', 27, 'source attempts']];
    rows.forEach(([label, count, unit], i) => {
      const y = 114 + i * 138;
      s += text(24, y - 36, label, { size: 21, anchor: 'start' });
      const gap = (W - 70) / 27;
      for (let j = 0; j < count * phase(t, i * .16, .45 + i * .16); j++) s += disc(30 + j * gap, y, '--miss', small ? 4.5 : 7);
      s += text(W - 24, y + 40, `${count} ${unit}`, { size: small ? 18 : 21, anchor: 'end' });
      if (i < 2) s += text(30, y + 67, '× 3', { size: 20, anchor: 'start' });
    });
    s += text(24, 485, 'Retry in one layer; disable the other retries.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(24, 519, 'Every attempt uses the same source places.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(24, 553, 'Stop at the deadline or shared retry budget.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(24, 587, 'An overload refusal gets no automatic retry.', { size: small ? 18 : 21, anchor: 'start' });
    return svg(s, small, W, 630);
  }
  s += text(W / 2, 30, relief ? 'Let admitted fills finish' : 'Redis is back, but the cache stays cold', { size: small ? 20 : 24, weight: 600 });
  const x = W / 2, y = [108, 270, 430];
  const labels = relief
    ? [['Shed excess traffic; bound retries', 'Keep actual work within 40 places'], ['End abandoned queries at the source', 'Free a place only when its work ends'], ['Completed fills restore useful keys', 'More hits → fewer requests reach the source']]
    : [['31% hits → most requests still miss', '2.7 attempts per request add more work'], ['90 active queries; source overloaded', 'Slow queries outlive 1 s request deadlines'], ['Few fills complete; cache stays cold', 'Old traffic levels still produce too many misses']];
  labels.forEach(([main, detail], i) => {
    s += text(x, y[i] - 16, main, { size: small ? 18 : 23, weight: 600 });
    s += text(x, y[i] + 16, detail, { size: small ? 17 : 20 });
    if (i < 2) {
      s += path(`M${x} ${y[i] + 35}V${y[i + 1] - 47}m-6 -8l6 8l6 -8`, { colour: relief ? '--cache' : '--miss', width: 2 });
      const p = phase(t, .12 + i * .24, .4 + i * .24);
      if (p > 0 && p < 1) s += disc(x, y[i] + 35 + p * (y[i + 1] - y[i] - 82), relief ? '--cache' : '--miss', 7);
    }
  });
  if (!relief) {
    s += path(`M${x - 35} 472H12V60H${x}V72m-6 -8l6 8l6 -8`, { colour: '--miss', width: 2, dash: t > .7 ? '' : '4 6' });
    const left = small ? 55 : 155, right = W - 45, yy = 545;
    const tx = sec => left + (right - left) * sec / 5;
    s += text(left, yy - 32, 'One abandoned query', { size: 20, anchor: 'start' });
    s += bar(tx(0), tx(4.8 * phase(t, .15, .9)), yy, '--db', 12);
    s += path(`M${tx(1)} ${yy - 14}V${yy + 15}`, { colour: '--miss', width: 2 });
    s += text(tx(1), yy + 43, 'caller left at 1 s', { size: 17 });
    s += text(right, yy - 12, 'still running at 4.8 s', { size: 18, anchor: 'end' });
    s += text(x, 635, 'A client timeout did not release this capacity.', { size: small ? 18 : 21 });
  } else {
    s += text(24, 508, 'Increase traffic in steps; check both:', { size: 21, weight: 600, anchor: 'start' });
    s += chip(small ? 110 : 190, 553, 'fill latency', '--cache');
    s += chip(small ? 324 : 555, 553, 'work in progress', '--db', { size: small ? 17 : 19 });
    s += text(small ? 110 : 190, 593, 'near 20 / 60 ms', { size: 18 });
    s += text(small ? 324 : 555, 593, 'within 40 places', { size: 18 });
    s += text(24, 634, 'Rising latency or persistent refusals: hold or cut.', { size: small ? 17 : 21, anchor: 'start' });
    s += text(24, 665, '20 / 60 ms = example median / 99th percentile.', { size: small ? 17 : 20, anchor: 'start' });
  }
  return svg(s, small, W, relief ? 700 : H);
}

export const feedback = makeScene({
  title: 'Breaking failed recovery', duration: 7500, defaultVariant: 'loop', draw,
  actions: [{ value: 'loop', label: 'Stuck recovery' }, { value: 'relief', label: 'Break the loop' }, { value: 'retries', label: 'Retry multiplication' }],
  alt: 'Misses, retries and slow unfinished queries keep the cache cold even after Redis returns. Shedding excess traffic, bounding retries and stopping abandoned queries let admitted fills finish. Recovery is increased only while source latency and actual executing work permit it.',
  textAlternative: 'The illustrative incident has 31% hits, 90 active source queries, 2.7 attempts per request and few successful cache fills. A query still running at 4.8 seconds has outlived its caller’s one-second timeout. Few completed fills leave most future requests missing, feeding the same overload. The repair reduces demand, limits actual source work to forty places, bounds retries in one layer and ends abandoned queries at the source. Completed fills restore hits and reduce source demand. Increase traffic gradually while fill latency remains near the example’s 20 ms median and 60 ms p99 and work remains within the allowance; hold or reduce when latency rises or refusals persist. The retry view shows three attempts in each of three layers multiplying to at most twenty-seven, distinct from the incident’s average of 2.7.',
  caption: 'Restoring Redis does not end a failure sustained by overload. Give fills enough capacity to finish, and verify that abandoned queries stop. Retry counts, successful fills, source latency and actual executing work reveal whether recovery is progressing; a rising hit ratio alone is insufficient.',
});
