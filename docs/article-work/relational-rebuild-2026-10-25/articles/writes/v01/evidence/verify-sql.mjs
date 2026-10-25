import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { setupSQL, receiveSQL, validateSQL, chunkSQL, reportSQL, guardSQL, upsertSQL } from '../src/components/relational-rebuild-writes/sql.mjs';
import { sourceRows, batchStates, batchStatus } from '../src/components/relational-rebuild-writes/models.mjs';
const finalSQL = `SELECT product_id, name, price::text, stock FROM products ORDER BY product_id;
SELECT sum(quantity * unit_price)::text AS order_103_total FROM order_items WHERE order_id = 103;
SELECT b.expected_rows, count(r.row_no)::int AS received,
       count(d.row_no)::int AS validated,
       count(*) FILTER (WHERE d.reason IS NOT NULL)::int AS rejected,
       count(a.row_no)::int AS applied,
       count(*) FILTER (WHERE d.row_no IS NOT NULL AND d.reason IS NULL AND a.row_no IS NULL)::int AS pending
FROM catalogue_batches b
LEFT JOIN catalogue_raw r USING (batch_id)
LEFT JOIN catalogue_decisions d USING (batch_id, row_no)
LEFT JOIN catalogue_applied a USING (batch_id, row_no)
WHERE b.batch_id = 'B17' GROUP BY b.batch_id, b.expected_rows;`;
const download = `-- Catalogue import B17: PostgreSQL 18; checked in PGlite 0.5.8 / PostgreSQL 18.3 WASM.
-- Run only in a fresh disposable database. Creates writes_example and refuses to reuse it.
-- Literal source input, one designated importer; no client/server file transfer or concurrency test.
-- Source and decisions are fixed after receipt/validation; application permissions must enforce that in use.
-- This is a partial catalogue feed: existing stock and order-line agreements are preserved.
\n${setupSQL}\n\n-- Receive the complete four-record input. Keep its original file/manifest outside this example.\n${receiveSQL}\n\n-- Validate once, preserving raw values and rejection reasons.\n${validateSQL}\n\n-- First chunk: rows 1 and 2, target and progress together.\n${chunkSQL}\n\n-- Known interruption: stop here, before the next chunk begins.\n${reportSQL}\n\n-- Resume: pending row 4 only.\n${chunkSQL}\n\n-- Same batch replay: empty chunk, no writes.\n${chunkSQL}\n\n-- Reconcile identities, intended values and all four input records.\n${reportSQL}\n${finalSQL}\n`;
await writeFile(new URL('../public/relational-rebuild/writes/catalogue-import.sql',import.meta.url),download);
const evidence={ runtime:null, checks:[], hashes:{} };
async function fresh(name,fn) {
 const db=new PGlite();
 try {await db.waitReady; evidence.runtime??=(await db.query('SELECT version()')).rows[0].version;await db.exec(setupSQL);await fn(db);evidence.checks.push({name,pass:true});}
 finally {await db.close();}
}
const query=async(db,sql)=>(await db.query(sql)).rows;
async function error(db,sql,code) {
 let caught;try{await db.exec(sql);}catch(e){caught={code:e.code,message:e.message};}
 assert.equal(caught?.code,code,JSON.stringify(caught));return caught;
}
await fresh('guard, stale counterexample and broadened write',async db=>{
 assert.deepEqual(await query(db,guardSQL),[{product_id:'P7',price:'22.00'}]);
 assert.deepEqual(await query(db,guardSQL),[]);
 await db.exec("UPDATE products SET price=23 WHERE product_id='P7'");
 assert.deepEqual(await query(db,guardSQL),[]);
 await db.exec("UPDATE products SET price=22 WHERE product_id='P7'");
 assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'22.00');
 const noop=await db.query("UPDATE products SET price=22 WHERE product_id='P7'");assert.equal(noop.affectedRows,1);
 const broad=await db.query('UPDATE products SET price=22');assert.equal(broad.affectedRows,3);
 evidence.guard={noOpAffected:noop.affectedRows,unguardedAffected:broad.affectedRows};
});
await fresh('constraints refuse eligible writes',async db=>{
 evidence.negative=await error(db,"UPDATE products SET price=-4.50 WHERE product_id='P7'",'23514');
 evidence.referencedDelete=await error(db,"DELETE FROM products WHERE product_id='P7' RETURNING product_id",'23503');
 assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'20.00');
});
await fresh('RETURNING before rollback is not commit',async db=>{
 await db.exec('BEGIN');assert.equal((await query(db,guardSQL))[0].price,'22.00');await db.exec('ROLLBACK');
 assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'20.00');
});
await fresh('upsert field ownership; delta replay; DO NOTHING mismatch',async db=>{
 const ignored=await db.query("INSERT INTO products VALUES ('P7','Blue mug',22,0) ON CONFLICT(product_id) DO NOTHING RETURNING price");assert.equal(ignored.rows.length,0);
 assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'20.00');
 evidence.upsert=await query(db,upsertSQL);assert.equal(evidence.upsert.find(x=>x.product_id==='P7').stock,1);assert.equal(evidence.upsert.find(x=>x.product_id==='P11').stock,0);
 assert.equal((await query(db,'SELECT sum(quantity*unit_price)::text AS total FROM order_items'))[0].total,'29.00');
 await db.exec(upsertSQL);assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'22.00');
 await db.exec("UPDATE products SET stock=stock+2 WHERE product_id='P7'");assert.equal((await query(db,"SELECT stock FROM products WHERE product_id='P7'"))[0].stock,3);
 await db.exec("UPDATE products SET stock=stock+2 WHERE product_id='P7'");assert.equal((await query(db,"SELECT stock FROM products WHERE product_id='P7'"))[0].stock,5);
});
await fresh('duplicate upsert fails; UPDATE FROM does not resolve business conflicts',async db=>{
 evidence.duplicateUpsert=await error(db,"INSERT INTO products VALUES ('P7','Blue mug',22,0),('P7','Blue mug',23,0) ON CONFLICT(product_id) DO UPDATE SET price=EXCLUDED.price",'21000');
 const chosen=await query(db,"UPDATE products p SET price=s.price FROM (VALUES ('P7',22.00),('P7',23.00)) s(product_id,price) WHERE p.product_id=s.product_id RETURNING p.price::text");
 assert.ok(['22.00','23.00'].includes(chosen[0].price));evidence.updateFromObserved=chosen;
});
await fresh('B17 validation and durable chunk resume',async db=>{
 await db.exec(receiveSQL);await db.exec(validateSQL);
 assert.deepEqual(await query(db,"SELECT row_no,reason FROM catalogue_decisions WHERE reason IS NOT NULL"),[{row_no:3,reason:'negative price'}]);
 await db.exec(chunkSQL);evidence.interrupted=await query(db,reportSQL);
 assert.deepEqual(evidence.interrupted.map(x=>x.status),['applied','applied','rejected','pending']);
 const productsAfterFirst=await query(db,'SELECT product_id,price::text,stock FROM products ORDER BY product_id');
 assert.equal(productsAfterFirst.find(x=>x.product_id==='P9').price,'35.00');
 await db.exec(chunkSQL);await db.exec(chunkSQL);evidence.final=await query(db,reportSQL);
 assert.deepEqual(evidence.final.map(x=>x.status),['applied','applied','rejected','applied']);
 evidence.reconciliation=await db.exec(finalSQL);
});
await fresh('negative raw value retained; duplicate variant rejected before apply',async db=>{
 await db.exec(receiveSQL);await db.exec("UPDATE catalogue_raw SET product_id_raw='P7',name_raw='Blue mug',price_raw='23.00' WHERE batch_id='B17' AND row_no=2");
 await db.exec(validateSQL);assert.deepEqual((await query(db,"SELECT row_no,reason FROM catalogue_decisions WHERE product_id='P7' ORDER BY row_no")).map(x=>x.reason),['duplicate product key','duplicate product key']);
 await db.exec(chunkSQL);assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'20.00');
});
await fresh('conversion rejects malformed, excessive-scale and non-finite prices without losing rows',async db=>{
 await db.exec(receiveSQL);await db.exec("UPDATE catalogue_raw SET price_raw=CASE row_no WHEN 1 THEN 'x' WHEN 2 THEN '8.001' WHEN 3 THEN 'NaN' ELSE '1000000.00' END");await db.exec(validateSQL);
 assert.equal((await query(db,'SELECT count(*)::int n FROM catalogue_decisions WHERE reason IS NOT NULL'))[0].n,4);
});
await fresh('target and applied record rollback together on bookkeeping failure',async db=>{
 await db.exec(receiveSQL);await db.exec(validateSQL);
 await db.exec('ALTER TABLE catalogue_applied ADD CONSTRAINT injected_failure CHECK (row_no <> 2)');
 await error(db,chunkSQL,'23514');await db.exec('ROLLBACK');
 assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'20.00');
 assert.equal((await query(db,"SELECT count(*)::int n FROM products WHERE product_id='P11'"))[0].n,0);
 assert.equal((await query(db,'SELECT count(*)::int n FROM catalogue_applied'))[0].n,0);
});
await fresh('counterexample: separate commit loses atomic progress',async db=>{
 await db.exec(receiveSQL);await db.exec(validateSQL);await db.exec(upsertSQL);
 await db.exec('ALTER TABLE catalogue_applied ADD CONSTRAINT injected_failure CHECK (row_no <> 2)');
 await error(db,"INSERT INTO catalogue_applied VALUES ('B17',1),('B17',2)",'23514');
 assert.equal((await query(db,"SELECT price::text FROM products WHERE product_id='P7'"))[0].price,'22.00');
 assert.equal((await query(db,'SELECT count(*)::int n FROM catalogue_applied'))[0].n,0);
});
const downloaded=await readFile(new URL('../public/relational-rebuild/writes/catalogue-import.sql',import.meta.url),'utf8');
const db=new PGlite();try{await db.waitReady;const results=await db.exec(downloaded);const totals=results.at(-1).rows[0];assert.deepEqual(totals,{expected_rows:4,received:4,validated:4,rejected:1,applied:3,pending:0});evidence.downloadFinal=totals;}finally{await db.close();}
for(const state of batchStates){const statuses=sourceRows.map(x=>batchStatus(state,x.row));assert.equal(statuses.filter(x=>x==='Applied').length,state.applied.length);assert.equal(statuses.length,4);}
for (const file of ['src/articles/current/article.astro','src/articles/current/article.meta.json','src/components/relational-rebuild-writes/Figure.astro','src/components/relational-rebuild-writes/models.mjs','src/components/relational-rebuild-writes/sql.mjs','public/relational-rebuild/writes/catalogue-import.sql','evidence/verify-sql.mjs']) evidence.hashes[file]=createHash('sha256').update(await readFile(new URL('../'+file,import.meta.url))).digest('hex');
await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({runtime:evidence.runtime,checks:evidence.checks,downloadFinal:evidence.downloadFinal},null,2));
