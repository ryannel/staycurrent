import { axis, bar, chip, disc, makeScene, path, phase, svg, text } from './ink.mjs';

function draw(t, variant, small) {
  const W = small ? 440 : 760, H = small ? 590 : 530;
  const left = small ? 45 : 100, right = W - 38;
  let s = '';
  if (variant === 'jitter') {
    const x = sec => left + (right - left) * (sec - 22) / 8;
    s += text(W / 2, 30, 'Different keys · same 30 s hard limit', { size: small ? 20 : 23, weight: 600 });
    s += text(W / 2, 62, 'Spread their refresh points between 22–26 s', { size: small ? 18 : 21 });
    [['P7', 23], ['P8', 25], ['P9', 26]].forEach(([key, start], i) => {
      const y = 146 + i * 104;
      s += text(left, y - 58, key, { anchor: 'start', weight: 600 });
      s += bar(x(22), x(30), y, '--cache', 7);
      const at = 22 + 8 * t;
      if (at >= start) s += chip(x(start), y - 30, `${start} s`, '--db', { size: 18 });
      s += path(`M${x(start)} ${y - 12}V${y + 15}`, { colour: '--db', width: 2 });
    });
    s += path(`M${x(30)} 96V378`, { colour: '--miss', dash: '4 5' });
    s += axis(left, right, 395, [22, 24, 26, 28, 30], x, v => `${v} s`);
    s += text(24, 460, 'Each key waits for a request after its point.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(24, 491, 'Several callers of P7 can still trigger together.', { size: small ? 18 : 21, anchor: 'start' });
  } else if (variant === 'empty') {
    s += text(W / 2, 32, 'Redis has restarted empty', { weight: 600 });
    ['P7', 'P8', 'P9'].forEach((key, i) => {
      const x = (i + 1) * W / 4;
      s += chip(x, 104, key, '--ink');
      s += path(`M${x} 125V180`);
      s += text(x, 211, 'missing', { size: 20, colour: '--miss' });
    });
    s += text(W / 2, 275, 'No stored value or refresh time', { size: small ? 22 : 25, weight: 600 });
    s += text(W / 2, 311, 'Each requested key needs a fill', { size: 22 });
    s += path(`M${W / 2} 330V390`, { colour: '--db' });
    if (t > .4) s += chip(W / 2, 418, 'source admission', '--db');
    s += text(W / 2, 470, 'Jitter and early refresh cannot refill it.', { size: small ? 19 : 21 });
  } else {
    s += text(W / 2, 30, 'One popular list · expiry at 30 s', { weight: 600 });
    s += text(W / 2, 62, 'Each request draws its own refresh decision', { size: small ? 18 : 21 });
    const x = sec => left + (right - left) * (sec - 28) / 2;
    const y = p => 225 - p * 110;
    let curve = '';
    for (let i = 0; i <= 100 * t; i++) {
      const sec = 28 + i / 50;
      curve += `${i ? 'L' : 'M'}${x(sec)} ${y(Math.exp(-(30 - sec) / .15))}`;
    }
    s += text(left, 99, 'Chance of starting a refresh', { size: 18, anchor: 'start' });
    s += path(curve, { colour: '--db', width: 2.6 });
    s += text(x(29), 174, '0.13% at 29 s', { size: 18 });
    s += text(right - 28, 130, '100% at expiry', { size: 18, anchor: 'end' });
    s += axis(left, right, 240, [28, 29, 30], x, v => `${v} s`);
    const zx = sec => left + (right - left) * (sec - 29.2) / .4;
    s += text(left, 316, 'Two selected requests can overlap', { size: 20, weight: 600, anchor: 'start' });
    const now = 29.2 + .4 * phase(t, .3, 1);
    [[29.30, 'A', '--c0'], [29.35, 'B', '--c1']].forEach(([at, id, colour], i) => {
      const yy = 366 + i * 72;
      s += text(left, yy - 18, `Request ${id} · 150 ms fill`, { size: 18, anchor: 'start' });
      if (now >= at) {
        s += disc(zx(at), yy, colour, 6);
        s += bar(zx(at), zx(Math.min(now, at + .15)), yy, colour, 12);
      }
    });
    s += axis(left, right, 465, [29.2, 29.4, 29.6], zx, v => `${v.toFixed(1)} s`);
    s += text(W / 2, 537, 'Coalescing or a lease can reduce the overlap.', { size: small ? 18 : 21 });
  }
  return svg(s, small, W, variant === 'xfetch' ? 570 : H);
}

export const scheduling = makeScene({
  title: 'Choosing when to refresh', duration: 6500, defaultVariant: 'xfetch', draw,
  actions: [{ value: 'xfetch', label: 'One key: XFetch' }, { value: 'jitter', label: 'Many keys: jitter' }, { value: 'empty', label: 'Empty cache' }],
  alt: 'XFetch gives each request a growing chance of starting a refresh near expiry; two selected requests may still overlap. Jitter spreads refresh points across different keys. An empty cache has neither values nor refresh times and needs admitted source fills.',
  textAlternative: 'For the list’s 150 ms computation and beta 1, the XFetch chance on one request is exp(-remaining time / 0.15 seconds): about 0.13% one second before expiry, reaching 100% at expiry. In the illustrated selection, A starts at 29.30 s and B at 29.35 s, before A’s 150 ms fill completes. The separate jitter view spreads the request-triggered refresh points of P7, P8 and P9 to 23, 25 and 26 seconds, with all original hard limits at 30 seconds. It does not choose one caller per key. When Redis is empty, all three are misses and must go through source admission.',
  caption: 'XFetch makes busy keys likely to refresh early without refreshing unused keys. In the list simulation, the first attempt began about 0.7 seconds early and there were 2.8 attempts per expiry on average. Jitter is often enough for cheap keys: it spreads different keys’ refresh points. Neither policy removes the need to bound fills.',
});
