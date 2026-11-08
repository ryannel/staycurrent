import { bar, makeScene, path, phase, svg, text } from './ink.mjs';

function draw(t, variant, small) {
  const W = small ? 440 : 760, H = 660;
  const slow = variant === 'slow', scale = variant === 'scale';
  const left = 26, right = W - 32, width = right - left;
  let s = text(W / 2, 30, scale ? 'More servers, the same source allowance' : `Constant fill duration: ${slow ? 200 : 20} ms`, { size: small ? 21 : 24, weight: 600 });
  const rows = scale ? [
    ['20 servers × 2 places', 40, '40 executing fills', '--cache'],
    ['30 servers × 2 places', 60, '60: exceeds the intended 40', '--miss'],
    ['30 servers, redistributed places', 40, '20 × 1 + 10 × 2 = 40', '--cache'],
  ] : [
    ['Concurrency limit: 40 executing', 40, `${slow ? '200' : '2,000'} fills/s can complete`, '--cache'],
    ['Rate limit alone: 2,000 starts/s', slow ? 400 : 40, `${slow ? '400' : '40'} fills in progress`, slow ? '--miss' : '--db'],
    ['20 pools × 50 connections', 1000, '1,000 potential connections', '--muted'],
  ];
  const max = scale ? 60 : 1000;
  rows.forEach(([label, amount, result, colour], i) => {
    const y = 104 + i * 120;
    s += text(left, y, label, { size: small ? 19 : 22, anchor: 'start' });
    s += path(`M${left} ${y + 28}H${right}`, { width: 1 });
    s += bar(left, left + width * amount / max * phase(t, .05 + i * .12, .55 + i * .12), y + 28, colour, 15);
    s += text(left, y + 66, result, { size: small ? 20 : 23, weight: 600, anchor: 'start' });
  });
  if (scale) {
    s += text(left, 481, 'Or enforce the 40-place limit at the source.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(left, 515, 'Adding servers does not add database capacity.', { size: small ? 18 : 21, anchor: 'start' });
  } else {
    s += text(left, 481, 'Slower fills hold each place for longer.', { size: small ? 19 : 21, anchor: 'start' });
    s += text(left, 515, 'The pool alone does not enforce the 40 places.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(left, 559, 'At 1,200 misses/s: 24 → 240 fills needed', { size: small ? 18 : 21, anchor: 'start' });
    s += text(left, 591, 'if no database limit intervened as fills slow.', { size: small ? 18 : 21, anchor: 'start' });
    s += text(left, 623, 'At 240: 12 per server still fits a pool of 50.', { size: small ? 18 : 21, anchor: 'start' });
  }
  return svg(s, small, W, H);
}

export const limits = makeScene({
  title: 'Concurrency, rate and connection limits', duration: 5500, defaultVariant: 'normal', draw,
  actions: [{ value: 'normal', label: '20 ms fills' }, { value: 'slow', label: '200 ms fills' }, { value: 'scale', label: 'Scale to 30 servers' }],
  alt: 'A forty-place concurrency limit permits fewer starts when fills take longer. A rate limit of two thousand starts per second permits four hundred concurrent fills at two hundred milliseconds. Twenty fifty-connection pools permit a thousand connections. Scaling the application requires redistributing the forty-place allowance.',
  textAlternative: 'These are constant-duration calculations. Forty concurrent fills at twenty milliseconds permit two thousand completions per second; at two hundred milliseconds, two hundred. A rate limit admitting two thousand starts per second needs forty concurrent fills at twenty milliseconds and four hundred at two hundred milliseconds. Twenty pools of fifty allow a thousand potential connections, before the database’s own connection limit intervenes. Thirty servers with two places each permit sixty executing fills; twenty servers with one and ten with two preserve forty. Admission must precede pool acquisition and count actual work, including abandoned queries.',
  caption: 'Limits count different things. Concurrency bounds work still executing; a rate limit bounds starts over time; a pool bounds connections. The calculations hold fill duration constant to expose the difference. Choose the real allowance from measured source capacity and preserve it as the application fleet changes.',
});
