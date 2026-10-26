import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const source = await readFile(new URL('../src/articles/current/article.astro', import.meta.url), 'utf8');
const blocks = [...source.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)];
const db = new PGlite();
const results = [];
try {
  results.push({ version: (await db.query('SELECT version()')).rows });
  for (const [, label, sql] of blocks) {
    if (label.startsWith('Subscriber: connect')) { results.push({ label, skipped: 'Requires native two-server verification; retained separately.' }); continue; }
    const value = await db.exec(sql);
    results.push({ label, results: value.map(v => ({rows:v.rows,affectedRows:v.affectedRows})) });
  }
  assert.deepEqual((await db.query("SELECT price,stock FROM products WHERE product_id='P7'")).rows, [{price:'22.00',stock:0}]);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM products')).rows[0].n, 3);
  results.push({ assertion: 'P7 22.00, stock 0; three products preserved', passed:true });
} finally { await db.close(); }
await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log('Ordinary article SQL and monitoring queries passed in owned PGlite; instance closed.');
