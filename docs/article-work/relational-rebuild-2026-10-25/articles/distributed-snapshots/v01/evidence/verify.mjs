import {PGlite} from '@electric-sql/pglite';
import {snapshotCases,readiness,eligibility} from '../src/components/relational-rebuild-distributed-snapshots/model.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const source=readFileSync('src/articles/current/article.astro','utf8');
const sql=source.match(/code=\{`(UPDATE products[\s\S]*?RETURNING stock;)`\}/)[1];
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const result={runtime:'PGlite 0.5.8; PostgreSQL 18.3/WASM; owned in-memory instance',sql,sourceHashes:Object.fromEntries(['src/articles/current/article.astro','src/articles/current/article.meta.json','src/components/relational-rebuild-distributed-snapshots/HistoryFigure.astro','src/components/relational-rebuild-distributed-snapshots/model.mjs'].map(p=>[p,hash(p)])),models:[],observations:[]};
assert.equal(snapshotCases.mixed.a<40,true);assert.equal(snapshotCases.mixed.p>=40,true);
assert.equal(snapshotCases.before.stock,1);assert.equal(snapshotCases.after.stock,0);
for(const [i,s]of readiness.entries()){assert.equal(s.answer,s.closed>=45&&s.applied>=8);assert.ok(s.durable>=s.applied);result.models.push({step:i,...s});}
for(const late of [false,true])for(const t of [25,35,45,55]){const s=eligibility(t,late);assert.equal(s.valid,!late&&(t===35||t===45));result.models.push({t,late,...s});}
assert.equal(Math.max(48,eligibility(45).low)<=eligibility(45).high,true);
assert.equal(Math.max(55,eligibility(45).low)<=eligibility(45).high,false);
const db=new PGlite();try{
result.version=(await db.query('select version()')).rows;
await db.exec("CREATE TABLE products(product_id text PRIMARY KEY,stock integer NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES ('P7',0)");
let r=await db.query(sql);assert.equal(r.rows.length,0);result.observations.push({case:'after purchase: stock 0',rows:r.rows});
await db.exec("UPDATE products SET stock=1 WHERE product_id='P7'");
r=await db.query(sql);assert.deepEqual(r.rows,[{stock:0}]);result.observations.push({case:'before purchase: stock 1',rows:r.rows});
r=await db.query(sql);assert.deepEqual(r.rows,[]);result.observations.push({case:'repeat after successful decrement',rows:r.rows});
// Counterexample to using the historic value as a current allowance.
await db.exec("UPDATE products SET stock=1 WHERE product_id='P7'");
const historical=(await db.query("SELECT stock FROM products WHERE product_id='P7'")).rows[0].stock;
await db.query(sql);
const staleWrite=await db.query('UPDATE products SET stock=$1-1 WHERE product_id=$2 RETURNING stock',[historical,'P7']);
assert.deepEqual(staleWrite.rows,[{stock:0}]);result.observations.push({case:'unguarded absolute write from earlier 1 affects one row although stock is already 0',rows:staleWrite.rows});
}finally{await db.close();result.closed=true;}
writeFileSync('evidence/verification.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({version:result.version,observations:result.observations,closed:result.closed,modelCases:result.models.length},null,2));
