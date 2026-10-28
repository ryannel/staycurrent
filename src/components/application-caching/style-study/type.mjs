const clamp = n => Math.max(0, Math.min(1, n));
const phase = (t, a, b) => clamp((t - a) / (b - a));
const ease = n => n * n * (3 - 2 * n);
const text = (x, y, value, { size = 25, family = 'sans', colour = 'ink', anchor = 'start', weight = 400, opacity = 1 } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="var(--study-${colour})" opacity="${opacity}" style="font-family:var(--font-${family});font-size:${size}px;font-weight:${weight};letter-spacing:-.025em">${value}</text>`;
const rule = (x1, y1, x2, y2, colour = 'line', width = 1) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="var(--study-${colour})" stroke-width="${width}"/>`;

function render(t = 1) {
  t = clamp(t);
  const read = t >= .28, built = t >= .43, saved = t >= .58, hit = t >= .83;
  const values = ['miss', 'read', 'build', 'save'];
  const starts = [.08, .19, .34, .47], ends = [.19, .34, .47, .60];
  const positions = [30, 155, 280, 405];
  let body = text(28, 35, 'App A', { family: 'mono', size: 23 }) + text(612, 35, 'P7', { family: 'mono', size: 23, anchor: 'end', colour: 'muted' });
  body += rule(28, 52, 612, 52);
  body += text(28, 89, 'First request', { family: 'serif', size: 30 });
  body += text(612, 89, read ? '1 source read' : 'empty cache', { size: 23, anchor: 'end', colour: 'muted' });
  for (let i = 0; i < values.length; i++) {
    const done = t >= ends[i], active = t >= starts[i] && !done;
    body += text(positions[i], 139, values[i], { size: 30, colour: active ? 'accent' : done ? 'ink' : 'muted', weight: active ? 600 : 400 });
    if (i < 3) {
      body += rule(positions[i] + 82, 130, positions[i] + 109, 130);
      if (active) {
        const p = ease(phase(t, starts[i], ends[i]));
        body += `<circle cx="${positions[i] + 82 + 27 * p}" cy="130" r="3" fill="var(--study-accent)"/>`;
      }
    }
    if (active) body += rule(positions[i], 148, positions[i] + 66, 148, 'accent', 2);
  }
  body += text(155, 172, 'source', { size: 23, colour: 'muted' });
  body += text(612, 144, built ? '£20' : '—', { family: 'serif', size: 47, anchor: 'end', colour: built ? 'ink' : 'muted' });

  // A second piece of the same type is deposited as the saved answer. It remains
  // in place while a copy returns to the next request, rather than being consumed.
  const depositing = t >= .48 && t < .58;
  if (depositing) {
    const p = ease(phase(t, .48, .58));
    body += text(584 - 164 * p, 144 + 72 * p, '£20', { family: 'serif', size: 30, anchor: 'middle', colour: 'accent' });
  }
  body += rule(225, 191, 454, 191);
  body += text(239, 220, 'saved copy', { size: 23, colour: 'muted' });
  body += text(439, 222, saved ? '£20' : '—', { family: 'serif', size: 32, anchor: 'end', colour: saved ? 'ink' : 'muted' });
  body += rule(225, 235, 454, 235);

  body += text(28, 281, 'Next request', { family: 'serif', size: 30 });
  body += text(612, 281, '0 source reads', { size: 23, anchor: 'end', colour: 'muted' });
  const nextActive = t >= .67;
  body += text(30, 333, 'hit', { size: 30, colour: nextActive ? 'ink' : 'muted' });
  body += rule(83, 324, 140, 324, nextActive ? 'accent' : 'line');
  body += text(155, 333, 'reuse', { size: 30, colour: nextActive ? 'accent' : 'muted' });
  body += rule(245, 324, 502, 324, nextActive ? 'accent' : 'line');
  body += text(612, 338, hit ? '£20' : '—', { family: 'serif', size: 47, anchor: 'end', colour: hit ? 'ink' : 'muted' });
  if (t >= .70 && t < .83) {
    const leaving = t < .77;
    const p = ease(phase(t, leaving ? .70 : .77, leaving ? .77 : .83));
    const x = leaving ? 420 - 140 * p : 280 + 304 * p;
    const y = leaving ? 222 + 102 * p : 324 + 14 * p;
    body += text(x, y, '£20', { family: 'serif', size: 32, anchor: 'middle', colour: 'accent' });
  }
  body += rule(28, 365, 612, 365);
  body += text(28, 390, 'Same answer.', { family: 'serif', size: 25 });
  body += text(612, 390, 'Less work.', { family: 'serif', size: 25, anchor: 'end' });
  return `<svg viewBox="0 0 640 400" aria-hidden="true" style="display:block;width:100%;height:auto"><rect width="640" height="400" fill="var(--study-paper)"/>${body}</svg>`;
}

export const scene = {
  title: 'Type in motion',
  duration: 10000,
  alt: 'App A misses the empty cache, reads the source, builds a £20 card and saves a copy. The next request hits that saved copy and returns the same £20 answer with no source read.',
  caption: 'App A performs the reads, builds the card and saves the copy. A later hit reuses it: the same £20 answer, with no second source read. The key P7 is shortened for north’s English card in GBP; timing is illustrative.',
  render
};
