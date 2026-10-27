// Shapes that pair with the colour vocabulary, so meaning never depends on hue
// alone. Used for request dots (scene.mjs), legends and <Term mark>.

export const KINDS = ['client', 'app', 'redis', 'database', 'hit', 'miss', 'stale', 'write', 'error', 'expiry'];

/** Plain names for legends and text alternatives. */
export const KIND_LABELS = {
  client: 'Client request',
  app: 'Application server',
  redis: 'Redis cache',
  database: 'Database',
  hit: 'Cache hit',
  miss: 'Cache miss',
  stale: 'Stale value',
  write: 'Write or invalidation',
  error: 'Error or dropped',
  expiry: 'Expiry',
  neutral: 'Other',
};

const circle = r => `M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

/**
 * Path data centred on (0, 0) for a dot of radius r, and how it is painted:
 * 'fill' (solid), 'ring' (outline on the surface colour), 'cross' (two strokes),
 * 'dashed' (dashed outline).
 */
export function dotShape(kind, r = 5) {
  switch (kind) {
    case 'miss': return { d: circle(r - 0.5), paint: 'ring' };
    case 'stale': { const h = r * 1.15; return { d: `M0 ${-h}L${h} ${h * 0.75}L${-h} ${h * 0.75}z`, paint: 'fill' }; }
    case 'write': { const s = r * 0.9; return { d: `M${-s} ${-s}h${2 * s}v${2 * s}h${-2 * s}z`, paint: 'fill' }; }
    case 'error': { const s = r * 0.85; return { d: `M${-s} ${-s}L${s} ${s}M${s} ${-s}L${-s} ${s}`, paint: 'cross' }; }
    case 'expiry': return { d: circle(r - 0.5), paint: 'dashed' };
    default: return { d: circle(r), paint: 'fill' };
  }
}

/** A small inline SVG glyph for prose and legends, coloured by the surrounding kind. */
export function marker(kind, size = 10) {
  const r = 5;
  const { d, paint } = dotShape(kind, r);
  return `<svg class="cache-mark" data-paint="${paint}" viewBox="-7 -7 14 14" width="${size}" height="${size}" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}
