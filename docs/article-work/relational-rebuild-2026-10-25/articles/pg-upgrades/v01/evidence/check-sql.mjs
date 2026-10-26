import { PGlite } from '@electric-sql/pglite';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { scenes } from '../src/components/relational-rebuild-pg-upgrades/model.mjs';
const article = readFileSync(new URL('../src/articles/current/article.astro', import.meta.url), 'utf8');
const fixture = readFileSync(new URL('./shop.sql',import.meta.url),'utf8');
const sql = article.match(/code=\{`([\s\S]*?)`\} \/>/)[1];
const result = { runtime:'@electric-sql/pglite 0.5.8; WebAssembly PostgreSQL', source_sha256:createHash('sha256').update(article).digest('hex'), fixture_sha256:createHash('sha256').update(fixture).digest('hex') };
const db = new PGlite();
try {
  result.version = (await db.query('SELECT version()')).rows[0].version;
  await db.exec(fixture);
  const observed = await db.exec(sql);
  assert.deepEqual(observed[0].rows,[{order_id:103,status:'pending',agreed_total:'29.00',paid:'0.00'}]);
  assert.deepEqual(observed[1].rows,[{product_id:'P3',price:'4.50',stock:10},{product_id:'P7',price:'20.00',stock:0},{product_id:'P9',price:'35.00',stock:4}]);
  result.displayed_sql = observed.map(x=>x.rows);
  await db.exec("UPDATE products SET price=22 WHERE product_id='P7'");
  assert.equal((await db.query('SELECT sum(quantity*unit_price)::text AS total FROM order_items WHERE order_id=103')).rows[0].total,'29.00');
  await db.exec('BEGIN; UPDATE order_items SET unit_price=22 WHERE order_id=103 AND product_id=\'P7\'');
  assert.equal((await db.query('SELECT sum(quantity*unit_price)::text AS total FROM order_items WHERE order_id=103')).rows[0].total,'31.00');
  await db.exec('ROLLBACK');
  result.counterexample = 'Repricing agreed P7 line produces31.00; catalogue-only price change preserves29.00.';
  for(const [kind,scene] of Object.entries(scenes)) for(const [key,option] of Object.entries(scene.options)) {
    assert(option.steps.length>1);
    for(const step of option.steps) for(const name of ['source','transfer','target']) assert.equal(step[name].length,3);
  }
  assert.equal(scenes.handover.options.fenced.steps.at(-1).source[1],'P7 20.00');
  assert.equal(scenes.handover.options.fenced.steps.at(-1).target[1],'P7 22.00');
  assert.match(scenes.handover.options.address.steps.at(-1).result,/before proceeding/);
  result.model = 'All options have complete three-panel states; final good branch source20/target22; bad branch stops handover.';
  result.passed = true;
} finally { await db.close(); }
writeFileSync(new URL('./sql-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
