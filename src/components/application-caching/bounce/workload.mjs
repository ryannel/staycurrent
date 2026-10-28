// A small, deterministic teaching workload, not a performance simulation.
export const products = [
  { key: 'P7', colour: '--coral' },
  { key: 'P8', colour: '--purple' },
  { key: 'P9', colour: '--teal' },
];

export const readRequests = [
  { at: .6, key: 0, miss: true, speed: 1 },
  { at: 10, key: 0, miss: false, speed: 1 },
  { at: 13, key: 1, miss: true, speed: 1.8 },
  { at: 19, key: 1, miss: false, speed: 1 },
  { at: 22, key: 2, miss: true, speed: 1.8 },
  { at: 28, key: 2, miss: false, speed: 1 },
  { at: 30, key: 0, miss: false, speed: 1 },
  { at: 31.5, key: 1, miss: false, speed: 1 },
  { at: 33, key: 2, miss: false, speed: 1 },
];

const panel = () => ({ caches: [new Set(), new Set()], misses: [0, 0], lookups: 0, reads: 0 });
export function createWorkload() {
  return { now: 0, requests: [], panels: [panel(), panel()], intro: 0 };
}
function request(at, index, key, target, scale = 1) {
  return { at, index, key, target, scale, outcomes: [{ hit: null, filled: false, read: false }, { hit: null, filled: false, read: false }] };
}
export function arrive(state, at, index) {
  // Let each new key's fill finish before asking for it on the other server.
  // The intervening requests reuse keys already taught; even Busy preserves this order.
  let key = 0, target = index % 2;
  if (index === 0 || index === 8) { key = 1; target = index === 0 ? 0 : 1; }
  else if (index === 16 || index === 24) { key = 2; target = index === 16 ? 0 : 1; }
  else if (index > 16 && index < 32) key = index % 2;
  else if (index >= 32) key = Math.floor((index - 32) / 2) % 3;
  state.requests.push(request(at, index, key, target));
}
export function advance(state, now) {
  state.now = now;
  while (state.intro < 2 && now >= [400, 9000][state.intro]) {
    const i = state.intro++;
    state.requests.push(request([400, 9000][i], -2 + i, 0, i, 1.7));
  }
  // Process by event time, so frame size cannot change whether a fill precedes a lookup.
  const events = [];
  for (const r of state.requests) for (let p = 0; p < 2; p++) {
    const o = r.outcomes[p];
    for (const [kind, seconds] of [['lookup', .9], ['read', 1.8], ['fill', 3.2]]) {
      const time = r.at + seconds * 1000 * r.scale;
      if (time <= now && (kind === 'lookup' ? o.hit === null : !o[kind === 'fill' ? 'filled' : 'read'])) events.push({ kind, time, r, p });
    }
  }
  events.sort((a, b) => a.time - b.time || (a.kind === 'fill' ? -1 : 1));
  for (const { kind, r, p } of events) {
    const panel = state.panels[p], slot = p ? 0 : r.target, o = r.outcomes[p];
    if (kind === 'lookup') {
      o.hit = panel.caches[slot].has(r.key);
      panel.lookups++;
      if (!o.hit) panel.misses[slot]++;
    } else if (kind === 'read') {
      o.read = true;
      if (o.hit === false) panel.reads++;
    } else {
      o.filled = true;
      if (o.hit === false) panel.caches[slot].add(r.key);
    }
  }
  state.requests = state.requests.filter(r => now - r.at < 4100 * r.scale);
}
export function finalWorkload() {
  const state = createWorkload();
  advance(state, 19000);
  for (let i = 0; i < 36; i++) {
    const now = 19000 + i * 800;
    advance(state, now);
    arrive(state, now, i);
  }
  advance(state, 52000);
  return state;
}
