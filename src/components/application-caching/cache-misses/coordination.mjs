import { server } from '../../relational-motion/drawing.mjs';
import { bar, chip, makeScene, path, phase, svg, text } from './ink.mjs';

function draw(t, variant, small) {
  const leased = variant === 'lease';
  const W = small ? 440 : 760, H = small ? 680 : 640;
  const xs = small ? [76, 220, 364] : [130, 380, 630];
  const queryY = small ? 258 : 240, resultY = small ? 350 : 330;
  let s = text(W / 2, 26, 'One missing list · 20 servers', { weight: 600 });
  s += text(W / 2, 56, 'Each server shares only its own callers', { size: small ? 19 : 21 });
  xs.forEach((x, i) => {
    s += chip(x - 26, 94, 'list', '--c0', { size: 16 });
    s += chip(x + 26, 126, 'list', '--c0', { size: 16 });
    s += path(`M${x - 26} 109Q${x - 26} 155 ${x} 158M${x + 26} 141Q${x + 26} 155 ${x} 158`);
    s += server(x, 188, i === 2 ? '… Server 20' : `Server ${i ? 'B' : 'A'}`);
    const started = phase(t, .08 + i * .08, .48 + i * .08);
    if (!leased || i === 0) {
      s += bar(x - 45, x - 45 + 90 * started, queryY + 34, '--db', 14);
      s += text(x, queryY + 65, '1 query', { size: 19 });
    } else s += text(x, queryY + 42, 'lease held by A', { size: small ? 17 : 20 });
  });
  if (leased) s += path(`M${xs[0]} ${queryY + 74}V${resultY - 22}H${xs[2]}`, { colour: '--cache' });
  if (t >= .55) s += text(W / 2, resultY + 16, leased ? 'One owner fills; other servers reuse' : '20 servers can still start 20 copies', { size: small ? 20 : 23, weight: 600 });
  const y = resultY + 64;
  s += text(24, y, 'Cost before a fleet-wide lease', { size: 20, weight: 600, anchor: 'start' });
  s += text(24, y + 34, 'P7: 250 requests/s × 20 ms ≈ 5 copies', { size: small ? 18 : 21, anchor: 'start' });
  s += text(24, y + 64, '5 × 20 ms = 100 ms of source work', { size: small ? 19 : 21, anchor: 'start' });
  s += bar(24, 24 + (W - 48) / 30 * phase(t, .5, .75), y + 84, '--db', 10);
  s += text(24, y + 120, 'List: up to 20 × 150 ms = 3,000 ms', { size: small ? 19 : 21, anchor: 'start' });
  s += bar(24, 24 + (W - 48) * phase(t, .5, .9), y + 140, '--db', 10);
  s += text(24, y + 178, 'Coordinate where the saved work is worth it.', { size: small ? 18 : 21, anchor: 'start' });
  s += text(24, y + 208, 'Ownership alone does not make data current.', { size: small ? 18 : 21, anchor: 'start' });
  return svg(s, small, W, H);
}

export const coordination = makeScene({
  title: 'The scope of shared work', duration: 6500, defaultVariant: 'local', draw,
  actions: [{ value: 'local', label: 'Local sharing' }, { value: 'lease', label: 'Add a fleet lease' }],
  alt: 'Twenty separate server maps can start twenty computations for the same missing list. A fleet lease selects one owner while the other servers wait within their deadlines or use a permitted fallback. The list duplicates much more source work than the cheap P7 card.',
  textAlternative: 'Two list callers on each illustrated server join that server’s one query. Across twenty servers that can still mean twenty queries. With a fleet-wide lease, A alone starts the query; other servers can wait within their deadlines or return a permitted older value or fallback. With no expiry race, they reuse the owner’s fill. For P7, the arrival-rate estimate is only about five twenty-millisecond computations across the fleet, or 100 milliseconds of work. Twenty 150-millisecond list copies cost 3,000 milliseconds. These sums compare total work, not wall-clock time. The lease is justified by the work saved; freshness and ownership checks still determine whether a value can be published.',
  caption: 'Local sharing stops duplicate work inside one server. A lease can reduce the remaining duplication across servers, when that saving justifies coordination. Waiting servers keep their own deadlines and fallbacks; lease expiry can still allow overlap.',
});
