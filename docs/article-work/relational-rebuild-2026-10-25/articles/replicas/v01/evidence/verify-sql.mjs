import { PGlite } from '@electric-sql/pglite';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Owned in-memory database. This does not model replication or durable storage.
const db = new PGlite();
try {
  const version = (await db.query('SELECT version()')).rows[0].version;
  await db.exec(`
    CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
      price numeric(8,2) NOT NULL CHECK(price >= 0), stock integer NOT NULL CHECK(stock >= 0));
    CREATE TABLE orders (order_id integer PRIMARY KEY, status text NOT NULL);
    CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer,
      product_id text REFERENCES products, quantity integer NOT NULL CHECK(quantity > 0),
      unit_price numeric(8,2) NOT NULL, PRIMARY KEY(order_id,line_no));
    CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer REFERENCES orders,amount numeric(8,2));
    INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
    INSERT INTO orders VALUES (103,'pending');
    INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
  `);
  const before = (await db.query("SELECT product_id,price::text,stock FROM products ORDER BY product_id")).rows;
  const article = readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
  const match = article.match(/code=\{`(BEGIN;[\s\S]*?COMMIT;)`\}/);
  if (!match) throw new Error('Displayed SQL not found');
  await db.exec(match[1]);
  const after = (await db.query("SELECT product_id,price::text,stock FROM products ORDER BY product_id")).rows;
  const order = (await db.query(`SELECT o.order_id,o.status,
    (SELECT sum(quantity*unit_price)::text FROM order_items WHERE order_id=o.order_id) AS line_total,
    (SELECT count(*)::int FROM payments WHERE order_id=o.order_id) AS payments,
    (SELECT unit_price::text FROM order_items WHERE order_id=o.order_id AND product_id='P7') AS agreed_mug_price
    FROM orders o`)).rows;
  const expect = (condition,message) => { if(!condition) throw new Error(message); };
  expect(before[1].price === '20.00' && after[1].price === '22.00','Catalogue price change');
  expect(JSON.stringify(before.map(x=>x.stock)) === JSON.stringify(after.map(x=>x.stock)),'Stock unchanged');
  expect(order[0].status === 'pending' && order[0].line_total === '29.00' && order[0].payments === 0 && order[0].agreed_mug_price === '20.00','Order facts unchanged');
  const result = { runtime:'@electric-sql/pglite 0.5.8; PostgreSQL 18.3/WASM',version,before,sql:match[1],after,order,
    displayed_sql_sha256:createHash('sha256').update(match[1]).digest('hex'), limits:'One owned in-memory SQL instance; no replication, network, concurrent sessions, native flush or crash-survival test.' };
  writeFileSync(new URL('./sql-result.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally { await db.close(); }
