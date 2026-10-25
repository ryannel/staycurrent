import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { cuts, paymentState, paymentSteps, shop } from '../src/components/relational-rebuild-backups/model.mjs';
const source = await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const query = source.match(/const checkFacts = `([\s\S]+?)`;/)[1];
const fixture = await readFile(new URL('../public/relational-rebuild/backups/reconciliation.sql',import.meta.url),'utf8');
const checks = [];
const db = new PGlite();
try {
 await db.exec(fixture.split('-- Demonstration.')[0]);
 const before = (await db.query(query)).rows[0];
 assert.deepEqual(before,{p7_price:'20.00',status:'pending',line_total:'29.00',paid:'0.00'});
 checks.push({check:'exact displayed SQL at pre-mistake cut',result:before});
 await db.exec("UPDATE products SET price=2.20 WHERE product_id='P7'");
 const bad = (await db.query(query)).rows[0];
 assert.equal(bad.p7_price,cuts[1].price); assert.equal(bad.paid,cuts[1].paid);
 checks.push({check:'through-mistake model agrees with query',result:bad});
 await db.query("SELECT pg_temp.reconcile_payment($1,103,504,10,'card')",[shop.operation]);
 const latest = (await db.query(query)).rows[0];
 assert.equal(latest.p7_price,cuts[2].price); assert.equal(latest.paid,cuts[2].paid);
 checks.push({check:'through-payment model agrees with query',result:latest});
 await db.exec("UPDATE products SET price=20.00 WHERE product_id='P7'");
 const repaired = (await db.query(query)).rows[0];
 assert.deepEqual(repaired,{p7_price:'20.00',status:'pending',line_total:'29.00',paid:'10.00'});
 checks.push({check:'exact displayed SQL after accepted repair',result:repaired});
 assert.equal(cuts[0].retained,1); assert.equal(cuts[1].retained,2); assert.equal(cuts[2].retained,3);
 for(const outcome of ['unknown','mismatch']) {
  for(let step=0;step<3;step++) {
   const state=paymentState(step,outcome);
   assert.equal(state.local,'No payment 504');
  }
  assert.equal(paymentState(2,outcome).action,'No new charge; no payment repair');
 }
 assert.equal(paymentState(4,'accepted').local,'504 · 10.00 by card');
 assert.equal(paymentState(5,'accepted').local,'504 · 10.00 by card');
 assert.equal(paymentSteps.length,6);
 checks.push({check:'payment state model: six accepted steps; unknown/mismatch stop at third state',passed:true});
} finally { await db.close(); }
const sha = text => createHash('sha256').update(text).digest('hex');
await writeFile(new URL('./model-results.json',import.meta.url),JSON.stringify({passed:true,article_sha256:sha(source),fixture_sha256:sha(fixture),checks,limits:'Checks SQL and conceptual state arithmetic; not engine recovery, provider behaviour or handover.'},null,2)+'\n');
console.log(JSON.stringify({passed:true,checks:checks.length}));
