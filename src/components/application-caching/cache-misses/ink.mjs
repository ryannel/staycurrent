// Ink-and-tokens helpers for the cache-misses figures (docs/figure-style.md).
// Shared role icons come from relational-motion/drawing.mjs; these helpers add the
// flat discs, value chips, bars and axes the timelines and charts need.
export const clamp = x => Math.max(0, Math.min(1, x));
export const phase = (t, a, b) => clamp((t - a) / (b - a));
export const ease = p => p * p * (3 - 2 * p);
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r1 = n => Math.round(n * 10) / 10;

// Labels carry a halo in the page colour so no path can cross their letters.
export function text(x, y, value, { size = 21, weight = 400, colour = '--ink', anchor = 'middle', opacity = 1 } = {}) {
  return `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" fill="var(${colour})"${opacity < 1 ? ` opacity="${r1(opacity)}"` : ''} style="font:${weight} ${size}px var(--font-sans);paint-order:stroke;stroke:var(--color-surface);stroke-width:5px;stroke-linejoin:round">${esc(value)}</text>`;
}

export function path(d, { colour = '--line', width = 1.8, dash = '', opacity = 1 } = {}) {
  return `<path d="${d}" fill="none" stroke="var(${colour})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${opacity < 1 ? ` opacity="${r1(opacity)}"` : ''}/>`;
}

// Tokens are flat discs: no highlight, gradient or shadow.
export const disc = (x, y, colour, r = 9, opacity = 1) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="var(${colour})"${opacity < 1 ? ` opacity="${r1(opacity)}"` : ''}/>`;

// A value the reader should read rides on a chip. Width is estimated from the label.
export const chipWidth = (label, size = 19) => Math.round(String(label).length * size * 0.56 + 18);
export function chip(x, y, label, colour = '--ink', { anchor = 'middle', size = 19, opacity = 1 } = {}) {
  const w = chipWidth(label, size), h = size + 11;
  const left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<g${opacity < 1 ? ` opacity="${r1(opacity)}"` : ''}><rect x="${r1(left)}" y="${r1(y - h / 2)}" width="${w}" height="${h}" rx="7" fill="var(--color-surface)" stroke="var(${colour})" stroke-width="1.8"/>`
    + `<text x="${r1(left + w / 2)}" y="${r1(y + size * 0.36)}" text-anchor="middle" fill="var(--ink)" style="font:600 ${size}px var(--font-sans)">${esc(label)}</text></g>`;
}

// A horizontal bar on a timeline, flat and rounded.
export function bar(x1, x2, y, colour, h = 12, opacity = 1) {
  if (x2 - x1 < 0.5) return '';
  return `<rect x="${r1(x1)}" y="${r1(y - h / 2)}" width="${r1(x2 - x1)}" height="${h}" rx="${h / 2}" fill="var(${colour})"${opacity < 1 ? ` opacity="${r1(opacity)}"` : ''}/>`;
}

// The only flourish: a short arrival pulse.
export function pulse(t, start, x, y, colour = '--cache', r = 12, span = 0.05) {
  const p = phase(t, start, start + span);
  return p > 0 && p < 1 ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r + 14 * p)}" fill="none" stroke="var(${colour})" stroke-width="1.6" opacity="${r1(1 - p)}"/>` : '';
}

export const svg = (body, small, width, height) => `<svg class="miss-${small ? 'portrait' : 'landscape'}" viewBox="0 0 ${width} ${height}" aria-hidden="true">${body}</svg>`;

// A time axis with labelled ticks.
export function axis(x0, x1, y, ticks, toX, label = v => v, { size = 18 } = {}) {
  let s = path(`M${x0} ${y}H${x1}`, { colour: '--muted', width: 1.2 });
  for (const v of ticks) {
    const x = toX(v);
    s += path(`M${r1(x)} ${y}V${y + 6}`, { colour: '--muted', width: 1.2 });
    s += text(x, y + 28, label(v), { size, colour: '--muted' });
  }
  return s;
}

// A scene renders both layouts; CSS shows the one drawn for the reader's width.
export function makeScene(def) {
  return { replayResetsVariant: false, visibilityThreshold: 0.35, ...def, render: (t, v) => def.draw(clamp(t), v ?? def.defaultVariant, false) + def.draw(clamp(t), v ?? def.defaultVariant, true) };
}
