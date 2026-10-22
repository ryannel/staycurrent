import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { standaloneEditor } from './standalone.mjs';
const here = new URL('.', import.meta.url);
const paths = ['../example.mjs', '../geometry.mjs', './model.mjs', './handlers.mjs'];
const sources = paths.map(path => readFileSync(new URL(path, here), 'utf8'));
const connection = readFileSync(new URL('./connection.html', here), 'utf8');
const html = standaloneEditor(connection, sources);
const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
assert.doesNotThrow(() => new Script(script));
assert.equal((html.match(/<script/g) ?? []).length, 1);
assert.equal(/^(import|export) /m.test(script), false);
assert.equal(html.includes('/* SHARED MODULES */'), false);
for (const source of sources) {
  const embedded = source.replace(/^import .*?;\s*$/gm, '').replace(/^export /gm, '');
  assert.equal(script.includes(embedded), true);
}
const sha256 = value => createHash('sha256').update(value).digest('hex');
console.log(JSON.stringify({ status: 'pass', checks: 8, htmlBytes: Buffer.byteLength(html), htmlSha256: sha256(html),
  sources: Object.fromEntries([...paths.map((path, index) => [path, sha256(sources[index])]), ['./connection.html', sha256(connection)]]),
  scope: 'Current-source embedding and standalone script syntax; no browser or device claim.' }, null, 2));
