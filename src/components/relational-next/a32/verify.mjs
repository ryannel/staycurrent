import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { scenes, holdMilliseconds } from './model.mjs';

const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const { transform } = astroRequire('@astrojs/compiler');
const root = process.cwd();
const staged = 'docs/article-work/relational-writing-2026-10-19/nodes/a32/article.astro';
const component = 'src/components/relational-next/a32/AcceptanceFigure.astro';
for (const file of [staged, component]) {
 const result = await transform(fs.readFileSync(file, 'utf8'), { filename: file });
 assert.equal(result.diagnostics.filter(d => d.severity === 1).length, 0, file);
}
const article = fs.readFileSync(staged, 'utf8');
const registry = JSON.parse(fs.readFileSync('docs/article-work/relational-writing-2026-10-19/registry.json', 'utf8'));
const ids = [...article.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'unique IDs');
const expected = registry.find(n => n.id === 'a32').sections;
for (const section of expected) assert(ids.includes(section.anchor), section.anchor);
for (const [, href] of article.matchAll(/href="([^"]+)"/g)) {
 if (href.startsWith('/review/')) assert(registry.some(n => n.href === href.split('#')[0]), href);
 if (href.startsWith('#')) assert(ids.includes(href.slice(1)), href);
}
for (const [, file] of article.matchAll(/from '([^']+)'/g)) {
 const resolved = path.resolve(root, 'src/articles/relational-next', file.split('?')[0]);
 assert(fs.existsSync(resolved), resolved);
}
assert(article.includes('?url&no-inline'), 'worksheet must be a served asset');
for (const [name, scene] of Object.entries(scenes)) {
 for (const variant of [0, 1]) {
  const frames = scene.frames(variant);
  assert(frames.length >= 3, name);
  assert(frames.every(f => f.lanes.length === 3 && f.lanes.every(l => l.name && l.state)), name);
 }
}
assert.match(scenes.writer.frames(1).at(-1).event, /upgrade/);
assert.match(scenes.writer.frames(1).at(-1).lanes[0].state, /BUSY_SNAPSHOT/);
assert.match(scenes.contract.frames(0).at(-1).lanes[0].chips[0], /6/);
assert.match(scenes.contract.frames(1).at(-1).lanes[0].chips[0], /5/);
assert.match(scenes.checkpoint.frames(0).at(-1).lanes[2].state, /Cannot advance/);
assert.match(scenes.checkpoint.frames(1).at(-1).lanes[1].state, /Reusable/);
assert.match(scenes.durability.frames(1).at(-1).lanes[2].state, /absent/);
assert(holdMilliseconds('word '.repeat(300)) >= 103000, 'budget grows with every visible word');
assert.equal(holdMilliseconds('One short step'), 12000);
const evidence = JSON.parse(fs.readFileSync('docs/article-work/relational-writing-2026-10-19/nodes/a32/evidence.json', 'utf8'));
assert.equal(evidence.new_connection_fk_rejection.code, 787);
assert.equal(evidence.two_connections_busy.code, 5);
assert.equal(evidence.two_processes_busy.code, 5);
assert.equal(evidence.stale_snapshot_write.code, 517);
assert.equal(evidence.after_duplicate_before_rollback, 5);
assert.equal(evidence.after_duplicate_rollback, 6);
assert.deepEqual(evidence.checkpoint_reader_open, [0,8,0]);
assert.equal(evidence.wal_bytes_reader_closed, 0);
assert.equal(evidence.page_budget_full.code, 13);
assert.equal(evidence.full_recovery.rows, 0);
assert.equal(evidence.schema_after_reopen.user_version, 1);
for (const dir of ['src/components/relational-next/a32', 'docs/article-work/relational-writing-2026-10-19/nodes/a32']) {
 for (const name of fs.readdirSync(dir)) {
  const file = path.join(dir, name);
  if (!fs.statSync(file).isFile()) continue;
  const text = fs.readFileSync(file, 'utf8');
  assert(!/[ \t]+$/m.test(text), `trailing whitespace: ${file}`);
 }
}
console.log('a32: two Astro transforms, model contrasts, evidence assertions, links, imports, headings and whitespace passed.');
