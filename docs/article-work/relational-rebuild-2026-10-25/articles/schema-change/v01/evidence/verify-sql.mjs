import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const article = await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const snippets = [...article.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)].map(m=>({label:m[1],sql:m[2]}));
const db = new PGlite();
const results={runtime:{package:'@electric-sql/pglite',packageVersion:'0.5.8',kind:'WebAssembly, one owned disposable in-memory instance'},articleSHA256:createHash('sha256').update(article).digest('hex'),snippets,checks:[]};
const reset = async()=>{
 await db.exec(`DROP TABLE IF EXISTS products; CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price >= 0),stock integer NOT NULL CHECK(stock >= 0),price_hundredths integer); INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10,NULL),('P7','Blue mug',20.00,0,NULL),('P9','Teapot',35.00,4,NULL);`);
};
const query=async sql=>(await db.query(sql)).rows;
const add=(name,observed)=>results.checks.push({name,observed});
const p7=async()=>query(`SELECT price::text, price_hundredths FROM products WHERE product_id='P7'`);
try {
 results.runtime.postgresql=(await query('SELECT version()'))[0].version;
 await reset();
 await db.exec(snippets[0].sql);
 assert.deepEqual(await p7(),[{price:'22.00',price_hundredths:2200}]);
 await db.exec(`UPDATE products SET price_hundredths=2000 WHERE product_id='P7'`);
 assert.deepEqual(await query(snippets[3].sql),[{missing:2,different:3}]);
 add('Unprotected stale assignment after bridge commit',await p7());
 await reset(); await db.exec(snippets[0].sql);
 const guarded=await query(snippets[2].sql);
 assert.deepEqual(guarded,[]);assert.deepEqual(await p7(),[{price:'22.00',price_hundredths:2200}]);
 add('Expected-source guard returns no row after source changes',{returned:guarded,p7:await p7()});
 await db.exec(`UPDATE products SET price_hundredths=2000 WHERE product_id='P7'`);
 const repair=await query(snippets[1].sql);
 assert.equal(repair[0].price_hundredths,2200);assert.deepEqual(await query(snippets[1].sql),[]);
 add('Current-row transform repairs stale field, repeat is empty',{repair,replay:await query(snippets[1].sql)});
 await reset();
 const guardedFirst=await query(snippets[2].sql);assert.equal(guardedFirst[0].price_hundredths,2000);
 await db.exec(snippets[0].sql);assert.deepEqual(await p7(),[{price:'22.00',price_hundredths:2200}]);
 add('Backfill-before-bridge alternative ordering',await p7());
 for(const bridge of [true,false]) {
  await reset();
  await db.exec(`UPDATE products SET price_hundredths=(price*100)::integer WHERE product_id='P3'; INSERT INTO products VALUES ('P11','Tea strainer',8.00,0,${bridge?'800':'NULL'}); UPDATE products SET price_hundredths=(price*100)::integer WHERE product_id COLLATE "C" > 'P3' COLLATE "C";`);
  const counts=await query(snippets[3].sql);
  assert.deepEqual(counts,[{missing:bridge?0:1,different:bridge?0:1}]);
  add(bridge?'Late bridge insert is complete without scan visit':'Late old-only insert is missing after last cursor',{order:await query(`SELECT product_id,price::text,price_hundredths FROM products ORDER BY product_id COLLATE "C"`),counts});
 }
 await reset();
 await db.exec(`BEGIN; UPDATE products SET price_hundredths=450 WHERE product_id='P3'; ROLLBACK;`);
 assert.equal((await query(`SELECT price_hundredths FROM products WHERE product_id='P3'`))[0].price_hundredths,null);
 add('Rolled-back work cannot justify advanced checkpoint',{p3:await query(`SELECT price_hundredths FROM products WHERE product_id='P3'`)});
 await db.exec(`UPDATE products SET price_hundredths=(price*100)::integer;`);
 assert.deepEqual(await query(snippets[3].sql),[{missing:0,different:0}]);
 const exact=await query(`SELECT price::text,(price*100)::integer AS hundredths FROM products ORDER BY product_id`);
 assert.deepEqual(exact.map(x=>x.hundredths),[450,2000,3500]);
 const range=await query(`SELECT (999999.99::numeric(8,2)*100)::integer AS maximum`);assert.equal(range[0].maximum,99999999);
 add('Initial conversion, equality and original finite maximum',{exact,range});
 await db.exec(`UPDATE products SET price='NaN'::numeric WHERE product_id='P7'`);
 let nanError;try{await query(snippets[1].sql);}catch(e){nanError=e.code;}assert.equal(nanError,'0A000');
 add('Existing nonnegative check admits NaN, which cannot convert',{nan:await p7(),errorCode:nanError});
 await reset();
 let insertError;try{await db.exec(`INSERT INTO products(product_id,name,stock,price_hundredths) VALUES ('P11','Tea strainer',0,800)`);}catch(e){insertError=e.code;}
 assert.equal(insertError,'23502');
 await db.exec(`ALTER TABLE products ALTER COLUMN price DROP NOT NULL; INSERT INTO products(product_id,name,stock,price_hundredths) VALUES ('P11','Tea strainer',0,800);`);
 add('Old required column blocks new-only insert until requirement changes',{errorBefore:insertError,after:await query(`SELECT product_id,price::text,price_hundredths FROM products WHERE product_id='P11'`)});
 results.limits='Sequential committed orderings, not observed concurrent clients, lock waits, native DDL workload, timings or capacity. No order, payment or line data modified. No reader download supplied.';
} finally { await db.close(); await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n'); }
console.log(JSON.stringify({runtime:results.runtime,checks:results.checks.length,articleSHA256:results.articleSHA256}));
