// Figure: an early refresh of the list of products under GBP 21.00 against its hard limit.
// The list was observed at 0 s and may be served until 30 s. The refresh reads the source at
// 29.3 s and takes 150 ms, so a new list may be served until 59.3 s: its allowance counts from
// the read, not from when it was stored. The figure appears before XFetch, so it states no lead time.
import { axis, bar, chip, disc, makeScene, path, pulse, svg, text } from './ink.mjs';

const A = 28.4, B = 30.6, START = 29.3, LAND = 29.45, LIMIT = 30;

function draw(t, variant, small) {
  const fails = variant === 'fails';
  const W = small ? 440 : 760;
  const X0 = small ? 30 : 196, X1 = small ? 412 : 730;
  const x = s => X0 + (X1 - X0) * (s - A) / (B - A);
  const now = A + t * (B - A) * 1.04;
  const yR = small ? 90 : 76, yF = small ? 216 : 168, yO = small ? 334 : 258, yN = small ? 400 : 312;
  const H = yN + (small ? 116 : 96);
  let s = '';
  const name = (y, label) => small ? text(X0, y - 34, label, { size: 19, anchor: 'start' }) : text(30, y + 7, label, { size: 20, anchor: 'start' });

  // Requests, one disc for every tenth of a second, coloured by what they receive.
  s += name(yR, 'Requests');
  for (let k = 0; ; k++) {
    const at = A + 0.05 + k * 0.1;
    if (at > B - 0.02) break;
    if (at > now) continue;
    const got = at < LAND || (fails && at < LIMIT) ? '--cache' : fails ? '--miss' : '--c1';
    s += disc(x(at), yR, got, small ? 6 : 7);
  }
  // Each label sits under the run of dots it names.
  const oldEnd = fails ? LIMIT : LAND;
  if (now >= LAND + 0.1) s += text(x((A + 0.05 + oldEnd - 0.05) / 2), yR + 36, 'older list', { size: 18, colour: '--muted' });
  if (now >= B - 0.05) s += text(x((oldEnd + B - 0.05) / 2), yR + 36, fails ? 'miss' : 'new list', { size: 18, colour: '--muted' });

  // The refresh itself.
  s += name(yF, 'Refresh');
  if (now >= START) {
    s += bar(x(START), x(Math.min(now, LAND)), yF, '--db', 14);
    s += small
      ? chip(x(START) - 10, yF, 'reads at 29.3 s', '--db', { size: 17, anchor: 'end' })
      : chip(x(START), yF - 32, 'refresh reads at 29.3 s', '--db', { size: 17, anchor: 'end' });
  }
  if (now >= LAND) s += chip(x(LIMIT) - 10, yF + (small ? 36 : 34), fails ? 'failed' : 'new list stored', fails ? '--miss' : '--cache', { size: 17, anchor: 'end' }) + pulse(t, (LAND - A) / ((B - A) * 1.04), x(LAND), yF, fails ? '--miss' : '--cache', 8);

  // What may be served, and until when.
  s += name(yO, small ? 'Older list may be served' : 'Older list');
  s += bar(x(A), x(LIMIT), yO, '--cache', 8, 0.9);
  // The hard limit marks the older list's rows only, below the request labels.
  s += path(`M${x(LIMIT)} ${yR + 52}V${yO + 16}`, { colour: '--ink', width: 1.4, dash: '4 5' });
  s += text(x(LIMIT) + 8, yO + 7, small ? 'until 30 s' : 'hard limit, 30 s', { size: 18, anchor: 'start' });
  if (!fails && now >= LAND) {
    s += name(yN, small ? 'New list may be served' : 'New list');
    s += bar(x(LAND), x(Math.min(now, B)), yN, '--c1', 8);
    if (now >= B - 0.2) s += text(x(LAND) + 4, yN + 32, 'until 59.3 s', { size: 18, colour: '--muted', anchor: 'start' });
  }

  const axisY = yN + (small ? 56 : 46);
  s += axis(X0, X1, axisY, small ? [28.5, 29.5, 30.5] : [28.5, 29, 29.5, 30, 30.5], x, v => `${v} s`);
  return svg(s, small, W, H);
}

export const refresh = makeScene({
  title: 'Refreshing before the limit',
  duration: 8000,
  defaultVariant: 'succeeds',
  actions: [{ value: 'succeeds', label: 'Refresh succeeds' }, { value: 'fails', label: 'Refresh fails' }],
  draw,
  alt: 'A timeline of the last two seconds of the list of products under GBP 21.00. It was observed at 0 s and may be served until its hard limit at 30 s. A refresh reads the source at 29.3 s and ends at 29.45 s.',
  altFor: v => v === 'fails'
    ? 'The refresh reads at 29.3 s and fails at 29.45 s. Requests keep receiving the older list until its hard limit at 30 s; after that they miss.'
    : 'The refresh reads at 29.3 s and stores a new list at 29.45 s. Requests before then receive the older list, later ones the new list, which may be served until 59.3 s, 30 s after its read. No request waits.',
  textAlternative: 'The list was read at 0 s and may be served until its hard limit at 30 s. A refresh reads the source at 29.3 s and takes 150 ms. If it succeeds, later requests receive the new list, which may be served until 59.3 s, and no request waits. If it fails, requests receive the older list until 30 s and then miss.',
  caption: 'An early refresh of the list against the older list’s hard limit. A failed refresh leaves that limit where it was.',
});
