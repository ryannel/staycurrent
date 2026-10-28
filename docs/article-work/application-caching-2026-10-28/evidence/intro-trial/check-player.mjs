// Controlled player audit. Browser appearance/keyboard checks are recorded separately.
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync('src/components/application-caching/intro/Watching.astro', 'utf8');
const code = stripTypeScriptTypes(source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import .*?;/, ''));
function harness(reduce = false) {
  const listeners = new Map(), mediaListeners = new Map(), frames = new Map();
  const element = () => ({ hidden: false, style: {}, textContent: '', addEventListener(n, f) { this[n] = f; }, setAttribute() {} });
  const drawing = { innerHTML: '', getBoundingClientRect: () => ({ height: 500 }) };
  const player = element(), pause = element(), replay = element(), progress = element();
  const nodes = { '.watch-drawing': drawing, '.watch-player': player, '[data-pause]': pause, '[data-replay]': replay, '.watch-progress i': progress, '.watch-title strong': { textContent: 'Test' } };
  const root = { dataset: { watch: 'read', duration: '300' }, querySelector: s => nodes[s] };
  const events = { addEventListener(n, f) { listeners.set(n, f); }, removeEventListener(n) { listeners.delete(n); } };
  const document = { ...events, hidden: false, querySelectorAll: () => [root] };
  const reduced = { matches: reduce, addEventListener(n, f) { mediaListeners.set(n, f); }, removeEventListener(n) { mediaListeners.delete(n); } };
  let observer, counter = 0;
  runInNewContext(code, { document, window: events, innerHeight: 720, matchMedia: () => reduced,
    scene: (kind, t) => `${kind}:${t}`, requestAnimationFrame: f => { frames.set(++counter, f); return counter; }, cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class { constructor(fn, options) { observer = { fn, options }; } observe() {} disconnect() {} }
  });
  return { root, drawing, player, pause, replay, frames, listeners, reduced, mediaListeners, document,
    intersect: ratio => observer.fn([{ intersectionRatio: ratio }]),
    tick: now => { const queued = [...frames.values()]; frames.clear(); queued.forEach(f => f(now)); },
    threshold: () => observer.options.threshold[1]
  };
}
const reduced = harness(true);
assert.equal(reduced.drawing.innerHTML, 'read:1');
assert.equal(reduced.player.hidden, true);
reduced.intersect(1);
assert.equal(reduced.frames.size, 0);

const normal = harness();
assert.equal(normal.root.dataset.progress, '0');
normal.intersect(.5); assert.equal(normal.frames.size, 0);
normal.intersect(.9); normal.tick(100); normal.tick(200);
assert.equal(normal.root.dataset.progress, String(1 / 3));
normal.pause.click(); assert.equal(normal.frames.size, 0);
normal.intersect(0); normal.intersect(1); assert.equal(normal.frames.size, 0);
normal.pause.click(); assert.equal(normal.frames.size, 1);
normal.document.hidden = true; normal.listeners.get('visibilitychange')(); assert.equal(normal.frames.size, 0);
normal.document.hidden = false; normal.listeners.get('visibilitychange')();
normal.tick(300); normal.tick(400); normal.tick(500);
assert.equal(normal.root.dataset.progress, '1'); assert.equal(normal.pause.hidden, true);
normal.replay.click(); assert.equal(normal.root.dataset.progress, '0'); assert.equal(normal.pause.hidden, false);
normal.intersect(0); assert.equal(normal.frames.size, 0);
normal.reduced.matches = true; normal.mediaListeners.get('change')();
assert.equal(normal.drawing.innerHTML, 'read:1'); assert.equal(normal.player.hidden, true);
normal.listeners.get('astro:before-swap')();
assert.equal(normal.frames.size, 0); assert.equal(normal.mediaListeners.size, 0);
assert.equal(normal.listeners.has('resize'), false); assert.equal(normal.listeners.has('visibilitychange'), false);
console.log('PASS: reduced motion, visibility threshold, pause/resume, background suspension, completion, replay, preference changes and cleanup.');
