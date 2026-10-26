import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const article = readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const sourceHash = createHash('sha256').update(article).digest('hex');
const query = article.match(/label="Verify the promoted server's shop facts" code=\{`([\s\S]*?)`\}/)[1];
const readinessQuery = article.match(/label="Check replay on the exact future read connection" code=\{`([\s\S]*?)`\}/)[1];
const db = new PGlite();
try {
  const version = (await db.query('SELECT version()')).rows[0].version;
  const packageVersion = JSON.parse(readFileSync(new URL('../node_modules/@electric-sql/pglite/package.json',import.meta.url),'utf8')).version;
  await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY,name text,price numeric(8,2),stock integer);
CREATE TABLE orders(order_id integer PRIMARY KEY,status text);
CREATE TABLE order_items(order_id integer,line_no integer,product_id text,quantity integer,unit_price numeric(8,2));
CREATE TABLE payments(payment_id integer,order_id integer,amount numeric(8,2));
INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES(103,'pending');
INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`);
  const before = (await db.query(query)).rows;
  assert.equal(before[0].catalogue_price,'20.00');
  await db.exec("BEGIN; SET LOCAL synchronous_commit=on; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;");
  const after = (await db.query(query)).rows;
  assert.equal(after[0].catalogue_price,'22.00');
  for (const row of [...before,...after]) {
    assert.equal(row.mug_stock,0); assert.equal(row.status,'pending');
    assert.equal(row.line_total,'29.00'); assert.equal(Number(row.payment_count),0);
  }
  const stocks = (await db.query('SELECT product_id,stock FROM products ORDER BY product_id')).rows;
  assert.deepEqual(stocks.map(r=>r.stock),[10,0,4]);
  const lsnArithmetic = (await db.query("SELECT pg_wal_lsn_diff('0/1600040'::pg_lsn,'0/1600000'::pg_lsn) AS bytes")).rows;
  assert.equal(Number(lsnArithmetic[0].bytes),64);
  const primaryNotReady = (await db.query(readinessQuery,['0/1600000'])).rows;
  assert.equal(primaryNotReady[0].ready,false);
  console.log(JSON.stringify({runtime:'PGlite/WASM; disposable in-memory instance',packageVersion,version,sourceHash,before,after,stocks,lsnArithmetic,primaryNotReady,limits:'SQL and constructed row states only; no physical replication, fencing, native server or failure observation.'},null,2));
} finally { await db.close(); }
