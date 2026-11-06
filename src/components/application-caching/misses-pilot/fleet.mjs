// Figure: per-Server fill limits add up across the fleet. The source allowance is 2,000
// card fills a second; at a 20 ms median that is 40 fills in flight (Little's law).
// The load test found checkout missing its objective at about 2,500 fills a second.
import { server } from '../../relational-motion/drawing.mjs';
import { chip, makeScene, phase, svg, text } from './ink.mjs';

const variants = {
  twenty: { servers: 20, slots: 2, line: '40 fills in flight: 2,000 a second', verdict: 'the allowance', colour: '--cache' },
  thirty: { servers: 30, slots: 2, line: '60 fills in flight: 3,000 a second', verdict: 'past 2,500', colour: '--miss' },
  recomputed: { servers: 30, slots: 1, line: '30 fills in flight: 1,500 a second', verdict: 'within 2,000', colour: '--cache' },
};

function draw(t, variant, small) {
  const v = variants[variant];
  const cols = small ? 5 : 10, rows = Math.ceil(v.servers / cols);
  const W = small ? 440 : 760, cw = small ? 80 : 70, ch = small ? 92 : 96;
  const left = (W - cols * cw) / 2 + cw / 2, top = 74;
  const H = top + rows * ch + (small ? 112 : 92);
  let s = '';
  for (let i = 0; i < v.servers; i++) {
    const cx = left + (i % cols) * cw, cy = top + Math.floor(i / cols) * ch;
    s += `<g transform="translate(${cx} ${cy}) scale(.62)">${server(0, 0, '')}</g>`;
    // Executing slots, then one waiting place.
    for (let k = 0; k < v.slots; k++) {
      const x = cx - 6 - v.slots * 15 + 15 + k * 15, y = cy + 30;
      const on = t >= 0.08 + 0.6 * (i * v.slots + k) / (v.servers * v.slots);
      s += `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${on ? 'var(--db)' : 'var(--color-surface)'}" stroke="var(--db)" stroke-width="1.5"/>`;
    }
    s += `<rect x="${cx + 13}" y="${cy + 30}" width="12" height="12" rx="3" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="2 3"/>`;
  }
  // A key for the two kinds of place.
  const kx = W / 2 - (small ? 150 : 160);
  s += `<rect x="${kx}" y="12" width="12" height="12" rx="3" fill="var(--db)" stroke="var(--db)" stroke-width="1.5"/>` + text(kx + 20, 24, 'executing fill', { size: 17, colour: '--muted', anchor: 'start' });
  s += `<rect x="${kx + (small ? 168 : 178)}" y="12" width="12" height="12" rx="3" fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="2 3"/>` + text(kx + (small ? 188 : 198), 24, 'waiting place', { size: 17, colour: '--muted', anchor: 'start' });
  const done = phase(t, 0.68, 0.78);
  const yLine = top + rows * ch + (small ? 4 : 10);
  s += text(W / 2, yLine, `${v.servers} Servers × ${v.slots} executing slot${v.slots > 1 ? 's' : ''}`, { size: small ? 19 : 20, colour: '--muted' });
  if (done > 0) {
    s += text(W / 2, yLine + 34, v.line, { size: small ? 20 : 22, weight: 600, opacity: done });
    s += chip(W / 2, yLine + (small ? 70 : 70), v.verdict, v.colour, { size: 18, opacity: done });
  }
  return svg(s, small, W, H);
}

export const fleet = makeScene({
  title: 'Fill slots across the fleet',
  duration: 4200,
  defaultVariant: 'twenty',
  actions: [{ value: 'twenty', label: '20 Servers' }, { value: 'thirty', label: '30 Servers, same limits' }, { value: 'recomputed', label: '30 Servers, 1 slot each' }],
  draw,
  alt: 'A grid of Servers, each with two places for executing card fills and one waiting place.',
  altFor: v => ({
    twenty: '20 Servers with 2 executing fill slots each admit 40 fills in flight: 2,000 a second at a 20 ms median, the source allowance.',
    thirty: '30 Servers with the same 2 slots each admit 60 fills in flight: 3,000 a second at 20 ms, past the 2,500 at which checkout missed its objective in the load test.',
    recomputed: '30 Servers with 1 slot each admit 30 fills in flight: 1,500 a second at 20 ms, within the 2,000 allowance.',
  })[v],
  textAlternative: 'Each Server has two executing fill slots and one waiting place. With 20 Servers the fleet admits 40 fills in flight, 2,000 a second at a 20 ms median, which is the source allowance. Scaling to 30 Servers with the same limits admits 60 fills in flight, 3,000 a second, past the 2,500 a second at which checkout missed its latency objective in the load test. Recomputing the limit to 1 slot per Server admits 30 in flight, 1,500 a second.',
  caption: 'Card-fill slots across the fleet, with one waiting place per Server. Per-Server limits add up; scale the fleet and the total moves with it.',
});
