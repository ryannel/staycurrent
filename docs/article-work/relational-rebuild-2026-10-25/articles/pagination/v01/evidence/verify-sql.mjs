import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { startingRows, mutations, nextIds } from '../src/components/relational-rebuild-pagination/data.mjs';

const article = await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const queries=[...article.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)].map(m=>({label:m[1],sql:m[2]}));
assert.equal(queries.length,8);
const values=startingRows.map(r=>`(${r.id}, ${r.id>200?3:r.id===102?2:1}, '${r.at}', '${r.status}')`).join(',\n');
const setup=`BEGIN;
SET LOCAL TIME ZONE 'UTC';
CREATE TEMP TABLE orders (
  order_id integer PRIMARY KEY, customer_id integer NOT NULL,
  placed_at timestamptz NOT NULL, status text NOT NULL
) ON COMMIT DROP;
INSERT INTO orders VALUES\n${values};
-- Projected package weights: an independent example, in grams.
CREATE TEMP TABLE products (
  product_id text PRIMARY KEY, package_weight_g integer
) ON COMMIT DROP;
INSERT INTO products VALUES ('P3',65),('P7',NULL),('P9',820);`;
const mutationSql={
  insert:"INSERT INTO orders VALUES (203,3,'2026-10-21 09:00:00+00','pending');",
  delete:'DELETE FROM orders WHERE order_id = 202;',
  forward:"UPDATE orders SET placed_at='2026-10-21 08:00:00+00' WHERE order_id=103;",
  backward:"UPDATE orders SET placed_at='2026-10-19 12:00:00+00' WHERE order_id=202;",
};
const wrongTime=`SELECT order_id FROM orders
WHERE placed_at < timestamptz '2026-10-20 10:15:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 2;`;
const wrongInclusive=`SELECT order_id FROM orders
WHERE (placed_at, order_id) <= (timestamptz '2026-10-20 10:15:00+00',201)
ORDER BY placed_at DESC, order_id DESC LIMIT 2;`;
const nullBoundary=`SELECT product_id, package_weight_g FROM products
WHERE package_weight_g IS NULL AND product_id > 'P7'
ORDER BY package_weight_g ASC NULLS LAST, product_id ASC LIMIT 2;`;
const wrongNull=`SELECT product_id FROM products
WHERE (package_weight_g,product_id) > (820,'P9')
ORDER BY package_weight_g ASC NULLS LAST, product_id ASC LIMIT 2;`;
const expected=[[202,201],[103,102],[103,102],[103,102],[202,102],['P7'],[201,202]];
const db=new PGlite();
const results={runtime:'@electric-sql/pglite 0.5.8, WASM',sourceSha256:createHash('sha256').update(article).digest('hex'),cases:[]};
let download=`-- Pagination and consistent exports: ordinary SQL examples.
-- Run in a fresh PostgreSQL session. Temporary projected tables only.
-- The final ROLLBACK removes all test data; no existing table is changed.
-- Each mutation below is independent. All timestamps are UTC.
${setup}\n`;
async function check(label,sql,want,column='order_id') {
  const result=await db.query(sql);
  const actual=result.rows.map(r=>r[column]);
  assert.deepEqual(actual,want,label);
  results.cases.push({label,sql,rows:result.rows});
  download+=`\n-- ${label}\n${sql}\n`;
}
try {
  results.version=(await db.query('SELECT version()')).rows[0].version;
  await db.exec(setup);
  for(let i=0;i<7;i++) await check(queries[i].label,queries[i].sql,expected[i],i===5?'product_id':'order_id');
  await check('Wrong: timestamp alone loses 103',wrongTime,[102,101]);
  await check('Wrong: inclusive pair repeats 201',wrongInclusive,[201,103]);
  await check('Request one extra row, display only 202 and 201',queries[0].sql.replace('LIMIT 2','LIMIT 3'),[202,201,103]);
  await check('Continue inside the null group',nullBoundary,[],'product_id');
  await check('Wrong: nullable pair comparison loses P7',wrongNull,[],'product_id');
  for(const [key,sql] of Object.entries(mutationSql)) {
    await db.exec(`SAVEPOINT mutation; ${sql}`);
    download+=`\n-- Independent change: ${mutations[key].label}\nSAVEPOINT mutation;\n${sql}\n`;
    await check(`${key}: keyset`,queries[3].sql,nextIds(mutations[key].rows,'keyset'));
    if(key==='insert'||key==='delete')await check(`${key}: offset`,queries[1].sql,nextIds(mutations[key].rows,'offset'));
    await db.exec('ROLLBACK TO mutation; RELEASE mutation;');
    download+='ROLLBACK TO mutation;\nRELEASE mutation;\n';
  }
  // Precision counterexample uses two literals, not extra shared shop rows.
  const precisionSql=`SELECT
    timestamptz '2026-10-20 10:15:00.123456+00'::text AS exact_value,
    timestamptz '2026-10-20 10:15:00.123456+00'
      > timestamptz '2026-10-20 10:15:00.123+00' AS rounded_boundary_is_smaller;`;
  const precision=(await db.query(precisionSql)).rows;
  assert.equal(precision[0].rounded_boundary_is_smaller,true);
  results.precision={sql:precisionSql,rows:precision};
  download+=`\n-- Timestamp precision example\n${precisionSql}\n\nROLLBACK;\n`;
  await db.exec('ROLLBACK;');
  const path=new URL('../public/relational-rebuild/pagination/',import.meta.url);
  await mkdir(path,{recursive:true});
  await writeFile(new URL('pagination-queries.sql',path),download);
  // Execute the exact promised download too, in the same now-empty owned instance.
  const downloaded=await readFile(new URL('pagination-queries.sql',path),'utf8');
  const downloadResult=await db.exec(downloaded);
  results.download={sha256:createHash('sha256').update(downloaded).digest('hex'),resultSets:downloadResult.length,executed:true};
  await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify({version:results.version,cases:results.cases.length,download:results.download}));
} finally { await db.close(); }
