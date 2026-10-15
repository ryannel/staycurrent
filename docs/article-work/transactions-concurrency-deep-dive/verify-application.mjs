import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
import { checkoutAttempt } from './checkout-attempt.mjs';
const purchase = { orderId:'O14', customerId:'C4', productId:'P7', quantity:2, unitPrice:'20.00', placedAt:'2026-10-15T11:00:00Z' };
const schema=readFileSync('docs/article-work/designing-data/schema.sql','utf8');
const page=readFileSync('src/pages/learn/databases/relational/transaction-boundaries.astro','utf8');
const stock=page.match(/const stockSetup = `([\s\S]*?)`;/)[1];
// Only our adapter's confirmed PG error responses enter this classifier.
const known=e=>e.confirmedServerResponse === true && ['40001','40P01'].includes(e.code);
async function fixture(mode='normal') {
  const db=new PGlite(); await db.exec(schema); await db.exec(stock);
  const calls=[]; let releases=[];
  const client={
    async query(text, values=[]) {
      calls.push(text);
      if(text==='COMMIT' && ['40001','40P01','08007','40003'].includes(mode)) {
        if(['40001','40P01'].includes(mode)) await db.exec('ROLLBACK');
        throw Object.assign(new Error(mode), { code:mode, confirmedServerResponse:true });
      }
      if(text==='COMMIT' && mode==='lost-after-commit') { await db.exec('COMMIT'); throw new Error('socket lost'); }
      if(text==='COMMIT' && mode==='lost-before-commit') throw new Error('socket lost');
      if(text==='ROLLBACK' && mode==='cleanup-failure') throw new Error('socket lost during cleanup');
      if(text.includes('INSERT INTO order_lines') && ['bad-line','cleanup-failure'].includes(mode)) values=[...values.slice(0,2),0,values[3]];
      try { return await db.query(text, values); }
      catch(e) { e.confirmedServerResponse=true; throw e; }
    },
    release(discard) { releases.push(discard); }
  };
  return { db,calls,releases,pool:{ async connect(){return client;} }, async end(){await db.exec('ROLLBACK');await db.close();} };
}
const counts=async db=>(await db.query("SELECT (SELECT available FROM stock WHERE product_id='P7') AS stock, (SELECT count(*)::int FROM orders WHERE order_id='O14') AS orders")).rows[0];
let f=await fixture();
assert.deepEqual(await checkoutAttempt(f.pool,purchase,known), {status:'purchased',orderId:'O14'});
assert.deepEqual(await counts(f.db),{stock:1,orders:1});assert.deepEqual(f.releases,[false]);await f.end();
f=await fixture();await f.db.exec("UPDATE stock SET available=1 WHERE product_id='P7'");
assert.deepEqual(await checkoutAttempt(f.pool,purchase,known),{status:'unavailable'});
assert.ok(!f.calls.some(s=>s.includes('INSERT INTO')));assert.deepEqual(f.releases,[false]);await f.end();
f=await fixture('bad-line');await assert.rejects(checkoutAttempt(f.pool,purchase,known),e=>e.code==='23514');
assert.ok(!f.calls.includes('COMMIT'));assert.equal(f.calls.at(-1),'ROLLBACK');
assert.deepEqual(await counts(f.db),{stock:3,orders:0});assert.deepEqual(f.releases,[false]);await f.end();
f=await fixture('cleanup-failure');await assert.rejects(checkoutAttempt(f.pool,purchase,known),e=>e.code==='23514');
assert.deepEqual(f.releases,[true]);await f.end();
for(const mode of ['40001','40P01','08007','40003','lost-before-commit','lost-after-commit']) {
  f=await fixture(mode);
  const uncertain=!['40001','40P01'].includes(mode);
  await assert.rejects(checkoutAttempt(f.pool,purchase,known),e=>uncertain ? e.outcome==='unknown' : e.code===mode);
  assert.deepEqual(f.releases,[uncertain]);
  if(uncertain) assert.equal(f.calls.at(-1),'COMMIT','uncertain commit must not be called a rollback');
  if(mode==='lost-after-commit') assert.deepEqual(await counts(f.db),{stock:1,orders:1});
  await f.end();
}
console.log('Application paths pass: purchase, unavailable, CHECK rejection skips COMMIT, cleanup failure discards, known commit rejections, server-reported unknown outcomes and both lost-reply histories.');
console.log('PGlite executes SQL; injected adapter faults verify control flow, not actual network or multi-session behaviour.');
