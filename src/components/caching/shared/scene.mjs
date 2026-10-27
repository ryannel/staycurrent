// Draws a caching system as SVG: nodes (clients, application servers, Redis,
// databases), edges between them, dots travelling along edges, small queues,
// labels and badges. The SVG is drawn at the container's real pixel width, so
// text stays the same size at 375 px as at 1280 px; a layout function places
// the nodes for each width.
import { dotShape } from './shapes.mjs';

const NS = 'http://www.w3.org/2000/svg';
export function svgEl(tag, attrs = {}, parent) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) node.setAttribute(k, String(v));
  if (parent) parent.appendChild(node);
  return node;
}

/** x positions for `count` items spread evenly across `width`, keeping `margin` at each side. */
export function spread(width, count, margin = 48) {
  if (count === 1) return [width / 2];
  return Array.from({ length: count }, (_, i) => margin + (i * (width - 2 * margin)) / (count - 1));
}

// Node outlines, centred on (0, 0) in a w × h box.
const SHAPES = {
  client(g, w, h, count = 1) {
    for (let i = Math.min(count, 3) - 1; i > 0; i--) svgEl('rect', { class: 'cache-shape cache-shadow', x: -w / 2 + i * 4, y: -h / 2 - i * 4, width: w, height: h, rx: 4 }, g);
    svgEl('rect', { class: 'cache-shape', x: -w / 2, y: -h / 2, width: w, height: h, rx: 4 }, g);
    svgEl('path', { class: 'cache-detail', d: `M${-w / 2} ${-h / 2 + 9}H${w / 2}` }, g);
    for (let i = 0; i < 3; i++) svgEl('circle', { class: 'cache-pip', cx: -w / 2 + 6 + i * 5, cy: -h / 2 + 4.5, r: 1.4 }, g);
  },
  app(g, w, h) {
    svgEl('rect', { class: 'cache-shape', x: -w / 2, y: -h / 2, width: w, height: h, rx: 4 }, g);
    const slot = (h - 12) / 2;
    for (let i = 0; i < 2; i++) {
      const y = -h / 2 + 4 + i * (slot + 4);
      svgEl('rect', { class: 'cache-detail', x: -w / 2 + 5, y, width: w - 10, height: slot, rx: 2 }, g);
      svgEl('circle', { class: 'cache-pip', cx: w / 2 - 11, cy: y + slot / 2, r: 1.8 }, g);
    }
  },
  redis(g, w, h) {
    // An in-memory store: a memory chip with pins on its long edges.
    const pins = Math.max(3, Math.round(w / 12));
    for (let i = 0; i < pins; i++) {
      const x = -w / 2 + ((i + 0.5) * w) / pins;
      svgEl('path', { class: 'cache-detail', d: `M${x} ${-h / 2 - 4}v4M${x} ${h / 2}v4` }, g);
    }
    svgEl('rect', { class: 'cache-shape', x: -w / 2, y: -h / 2, width: w, height: h, rx: 3 }, g);
    svgEl('rect', { class: 'cache-detail', x: -w / 2 + 8, y: -h / 2 + 8, width: w - 16, height: h - 16, rx: 2 }, g);
  },
  database(g, w, h) {
    const ry = Math.min(7, h / 6);
    svgEl('path', { class: 'cache-shape', d: `M${-w / 2} ${-h / 2 + ry}A${w / 2} ${ry} 0 0 1 ${w / 2} ${-h / 2 + ry}V${h / 2 - ry}A${w / 2} ${ry} 0 0 1 ${-w / 2} ${h / 2 - ry}Z` }, g);
    svgEl('path', { class: 'cache-detail', d: `M${-w / 2} ${-h / 2 + ry}A${w / 2} ${ry} 0 0 0 ${w / 2} ${-h / 2 + ry}` }, g);
  },
  neutral(g, w, h) { svgEl('rect', { class: 'cache-shape', x: -w / 2, y: -h / 2, width: w, height: h, rx: 6 }, g); },
};

/**
 * createScene(container, options)
 *   nodes:  [{ id, kind: 'client'|'app'|'redis'|'database'|'neutral', label, sublabel?, count? }]
 *   edges:  [{ id, from, to, label?, dashed? }]
 *   layout: width => ({ height, positions: { [nodeOrNoteId]: [x, y] } })
 *   label:  accessible name for the drawing
 * Returns a scene: node(id), dots(list), note(id, text), onLayout(fn), compact, width, height.
 */
export function createScene(container, { nodes = [], edges = [], layout, label = 'Simulation' }) {
  container.replaceChildren();
  const uid = `cache-scene-${++sceneCount}`;
  let positions = {};
  const svg = svgEl('svg', { class: 'cache-svg', role: 'img', 'aria-label': label }, container);
  const layers = Object.fromEntries(['edges', 'notes', 'nodes', 'dots'].map(name => [name, svgEl('g', { class: `cache-${name}` }, svg)]));
  const scene = { width: 0, height: 0, compact: false, svg, layers };
  const nodeMap = new Map();
  const edgeMap = new Map();
  const notes = new Map();
  const listeners = [];

  for (const def of nodes) {
    const g = svgEl('g', { class: 'cache-node', 'data-cache-kind': def.kind ?? 'neutral' }, layers.nodes);
    const body = svgEl('g', {}, g);
    const meterClip = svgEl('clipPath', { id: `${uid}-clip-${def.id}` }, g);
    const meter = svgEl('rect', { class: 'cache-meter', 'clip-path': `url(#${uid}-clip-${def.id})` }, g);
    const text = svgEl('text', { class: 'cache-node-label', 'text-anchor': 'middle' }, g);
    const sub = svgEl('text', { class: 'cache-node-sub', 'text-anchor': 'middle' }, g);
    const badge = svgEl('text', { class: 'cache-node-badge', 'text-anchor': 'middle' }, g);
    const queue = svgEl('g', { class: 'cache-queue' }, g);
    const node = {
      ...def, g, x: 0, y: 0, w: 0, h: 0, meterValue: 0,
      /** Sets any of: label, sublabel, badge, badgeKind, meter (0–1), meterKind, highlight, queue: [n, max]. */
      set(values) {
        if ('label' in values) { node.label = values.label; text.textContent = values.label ?? ''; }
        if ('sublabel' in values) { node.sublabel = values.sublabel; sub.textContent = values.sublabel ?? ''; }
        if ('badge' in values) badge.textContent = values.badge ?? '';
        if ('badgeKind' in values) badge.setAttribute('data-cache-kind', values.badgeKind ?? 'neutral');
        if ('meter' in values) { node.meterValue = Math.max(0, Math.min(1, values.meter ?? 0)); drawMeter(); }
        if ('meterKind' in values) meter.setAttribute('data-cache-kind', values.meterKind);
        if ('highlight' in values) g.classList.toggle('is-highlighted', !!values.highlight);
        if ('queue' in values) drawQueue(...values.queue);
        return node;
      },
    };
    const drawMeter = () => {
      const { w, h } = node;
      const filled = h * node.meterValue;
      meter.setAttribute('x', -w / 2); meter.setAttribute('width', w);
      meter.setAttribute('y', h / 2 - filled); meter.setAttribute('height', filled);
    };
    let queueState = [0, 0];
    const drawQueue = (n = 0, max = 4) => {
      queueState = [n, max];
      queue.replaceChildren();
      if (!max) return;
      const size = scene.compact ? 6 : 7, gap = 2;
      const x = node.w / 2 + 5;
      for (let i = 0; i < max; i++) {
        svgEl('rect', { class: i < n ? 'cache-slot is-full' : 'cache-slot', x, y: node.h / 2 - (i + 1) * (size + gap) + gap, width: size, height: size, rx: 1 }, queue);
      }
      if (n > max) svgEl('text', { class: 'cache-queue-more', x: x - 1, y: node.h / 2 - max * (size + gap) - 3 }, queue).textContent = `+${n - max}`;
    };
    node.draw = () => {
      body.replaceChildren(); meterClip.replaceChildren();
      const compact = scene.compact;
      node.w = compact ? 54 : 72; node.h = compact ? 40 : 50;
      if (def.kind === 'client') { node.w -= 6; node.h -= 4; }
      (SHAPES[def.kind] ?? SHAPES.neutral)(body, node.w, node.h, def.count);
      // The meter fills the shape's own outline.
      (SHAPES[def.kind] ?? SHAPES.neutral)(meterClip, node.w, node.h, 1);
      meterClip.querySelectorAll('.cache-detail, .cache-pip, .cache-shadow').forEach(n => n.remove());
      drawMeter();
      text.setAttribute('y', node.h / 2 + (def.kind === 'redis' ? 20 : 16));
      sub.setAttribute('y', node.h / 2 + (def.kind === 'redis' ? 34 : 30));
      badge.setAttribute('y', -node.h / 2 - (def.kind === 'redis' ? 10 : 7) - (def.kind === 'client' && (def.count ?? 1) > 1 ? 8 : 0));
      drawQueue(...queueState);
    };
    node.set({ label: def.label ?? '', sublabel: def.sublabel ?? '' });
    nodeMap.set(def.id, node);
  }

  for (const def of edges) {
    const line = svgEl('path', { class: def.dashed ? 'cache-edge is-dashed' : 'cache-edge' }, layers.edges);
    const text = def.label ? svgEl('text', { class: 'cache-edge-label', 'text-anchor': 'middle' }, layers.edges) : null;
    if (text) text.textContent = def.label;
    edgeMap.set(def.id, { ...def, line, text, a: [0, 0], b: [0, 0] });
  }

  const trim = (from, to) => {
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const halfW = from.w / 2 + 6, halfH = from.h / 2 + (from.kind === 'redis' ? 9 : 6);
    const k = Math.min(dx ? halfW / Math.abs(dx) : Infinity, dy ? halfH / Math.abs(dy) : Infinity);
    return [from.x + dx * Math.min(k, 0.45), from.y + dy * Math.min(k, 0.45), len];
  };

  function relayout() {
    const width = Math.round(container.clientWidth);
    if (!width || width === scene.width) return;
    scene.width = width;
    scene.compact = width < 480;
    const placed = layout(width, scene.compact);
    positions = placed.positions;
    scene.height = placed.height;
    const height = placed.height;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width); svg.setAttribute('height', height);
    for (const node of nodeMap.values()) {
      const [x, y] = positions[node.id] ?? [width / 2, height / 2];
      node.x = x; node.y = y;
      node.g.setAttribute('transform', `translate(${x} ${y})`);
      node.draw();
    }
    for (const edge of edgeMap.values()) {
      const from = nodeMap.get(edge.from), to = nodeMap.get(edge.to);
      const [ax, ay] = trim(from, to), [bx, by] = trim(to, from);
      edge.a = [ax, ay]; edge.b = [bx, by];
      edge.line.setAttribute('d', `M${ax} ${ay}L${bx} ${by}`);
      if (edge.text) {
        const nx = -(by - ay), ny = bx - ax, nl = Math.hypot(nx, ny) || 1;
        edge.text.setAttribute('x', (ax + bx) / 2 + (nx / nl) * 12);
        edge.text.setAttribute('y', (ay + by) / 2 + (ny / nl) * 12 + 4);
      }
    }
    for (const [id, note] of notes) {
      const [x, y] = positions[id] ?? [0, 0];
      note.setAttribute('x', x); note.setAttribute('y', y);
    }
    listeners.forEach(fn => fn(scene));
  }

  const pool = [];
  /** Draws travelling dots: [{ edge, t, kind, reverse }], e.g. Movers.active(). */
  scene.dots = list => {
    const r = scene.compact ? 4.5 : 5;
    list.forEach((dot, i) => {
      const edge = edgeMap.get(dot.edge);
      if (!edge) return;
      let path = pool[i];
      if (!path) { path = svgEl('path', { class: 'cache-dot' }, layers.dots); pool[i] = path; }
      if (path.dataset.shape !== `${dot.kind}:${r}`) {
        const { d, paint } = dotShape(dot.kind, r);
        path.setAttribute('d', d); path.setAttribute('data-paint', paint);
        path.setAttribute('data-cache-kind', dot.kind); path.dataset.shape = `${dot.kind}:${r}`;
      }
      const [sx, sy] = dot.reverse ? edge.b : edge.a, [ex, ey] = dot.reverse ? edge.a : edge.b;
      // Outbound and return trips run either side of the line, so they don't overlap.
      const nx = -(ey - sy), ny = ex - sx, nl = Math.hypot(nx, ny) || 1, lane = 4.5;
      const x = sx + (ex - sx) * dot.t + (nx / nl) * lane, y = sy + (ey - sy) * dot.t + (ny / nl) * lane;
      path.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      path.style.display = '';
    });
    for (let i = list.length; i < pool.length; i++) pool[i].style.display = 'none';
  };
  scene.node = id => nodeMap.get(id);
  scene.edge = id => edgeMap.get(id);
  /** A free text label placed by the layout's positions[id]; returns the <text> element. */
  scene.note = (id, text, { anchor = 'middle', kind } = {}) => {
    let note = notes.get(id);
    if (!note) {
      note = svgEl('text', { class: 'cache-note', 'text-anchor': anchor, 'data-cache-kind': kind }, layers.notes);
      notes.set(id, note);
      const [x, y] = positions[id] ?? [0, 0];
      note.setAttribute('x', x); note.setAttribute('y', y);
    }
    note.textContent = text;
    return note;
  };
  scene.onLayout = fn => { listeners.push(fn); };
  scene.relayout = () => { scene.width = 0; relayout(); };

  relayout();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(relayout).observe(container);
  return scene;
}

let sceneCount = 0;
