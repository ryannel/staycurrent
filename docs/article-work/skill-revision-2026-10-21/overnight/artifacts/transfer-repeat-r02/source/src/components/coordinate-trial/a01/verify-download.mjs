import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { makeDownload } from './make-download.mjs';
import { presets, snapshot } from './model.mjs';
import { traceBounds } from './runtime.mjs';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const modules = Object.fromEntries(['../example.mjs','../geometry.mjs','./model.mjs','./gesture.mjs','./runtime.mjs'].map(name => [name.split('/').at(-1), read(name)]));
const html = makeDownload(read('./GestureComparison.astro'), modules);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new Script(script); // The actual reader-delivered classic script must parse without a bundler.
assert(!/<(?:script|link)\b[^>]*(?:src|href)=/.test(html), 'No external runtime or stylesheet');
assert(!/^import |^export /m.test(script), 'No unresolved module statements');
assert(html.includes("document.querySelectorAll('[data-gesture-comparison]').forEach(mount)"));
const required = [...modules['runtime.mjs'].matchAll(/find\('([^']+)'\)/g)].map(m=>m[1]);
for (const role of required) assert(html.includes(`data-${role}`), `Missing DOM role: ${role}`);
for (const [name, source] of Object.entries(modules)) {
  const body = source.replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
  assert(script.includes(body), `Changed delivered source: ${name}`);
}
let boundsChecks = 0;
for (const preset of presets) {
  const [x,y,w,h] = traceBounds(preset).split(' ').map(Number);
  assert.equal(w, h); assert.equal(w, Number(traceBounds(presets[0]).split(' ')[2]));
  for (const mode of ['Card','Pan']) for (const wrong of [false,true]) for (const stale of [false,...(preset.resized ? [true] : [])]) {
    const s = snapshot(preset,mode,wrong,stale);
    for (const p of [...s.corners,s.fromC,s.beforeC,s.targetC,s.landedC]) {
      assert(p.x >= x+12 && p.x <= x+w-12 && p.y >= y+12 && p.y <= y+h-12, `Clipped point in ${preset.id}`);
      boundsChecks++;
    }
  }
}
const output = process.argv[2];
if (output) writeFileSync(output, html);
console.log(JSON.stringify({result:'pass', requiredDomRoles: new Set(required).size, modules: Object.keys(modules), boundsChecks, bytes: Buffer.byteLength(html), output: output ?? null}, null, 2));
