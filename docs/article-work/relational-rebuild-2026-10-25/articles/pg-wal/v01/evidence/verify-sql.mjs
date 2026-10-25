import {PGlite} from '@electric-sql/pglite';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const article=readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const hash=createHash('sha256').update(article).digest('hex');
const db=new PGlite();
const results=[];
try {
  results.push({version:(await db.query('SELECT version()')).rows});
  await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY,price numeric(8,2),stock integer);
  INSERT INTO products VALUES('P3',4.50,10),('P7',20.00,0),('P9',35.00,4);`);
  const blocks=[...article.matchAll(/code=\{`([\s\S]*?)`\}/g)].map(x=>x[1]);
  for(let i=0;i<blocks.length;i++){
    const sql=blocks[i];
    const out=await db.exec(sql);
    results.push({block:i+1,sql,results:out});
    if(sql.includes('pg_wal_lsn_diff')) assert.equal(Number(out[0].rows[0].bytes),64);
    if(sql.includes('Keep this transaction open')) {
      assert.equal((await db.query("SELECT price::text FROM products WHERE product_id='P9'")).rows[0].price,'36.00');
      await db.exec('ROLLBACK');
      assert.equal((await db.query("SELECT price::text FROM products WHERE product_id='P9'")).rows[0].price,'35.00');
    }
  }
  assert.equal((await db.query("SELECT price::text FROM products WHERE product_id='P7'")).rows[0].price,'22.00');
  await db.exec('BEGIN; SET LOCAL synchronous_commit=off; UPDATE products SET price=20 WHERE product_id=\'P7\'; ROLLBACK;');
  assert.equal((await db.query("SHOW synchronous_commit")).rows[0].synchronous_commit,'on');
  results.push({status:'PASS',limits:'PGlite 0.5.8 / PostgreSQL 18.3 WASM, owned memory-only instance; ordinary SQL syntax/results and setting scope only. No native crash or storage contract established.'});
} finally {
  await db.close();
  writeFileSync(new URL('./sql-results.json',import.meta.url),JSON.stringify({article_sha256:hash,results},null,2)+'\n');
}
