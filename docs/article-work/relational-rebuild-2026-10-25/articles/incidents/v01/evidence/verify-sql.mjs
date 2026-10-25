import { PGlite } from '@electric-sql/pglite';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const db = new PGlite();
try {
  const version = (await db.query('SELECT version() AS version')).rows[0].version;
  await db.exec(`
    SET TIME ZONE 'UTC';
    CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
    CREATE TABLE orders (
      order_id integer PRIMARY KEY,
      customer_id integer NOT NULL REFERENCES customers,
      placed_at timestamptz NOT NULL,
      status text NOT NULL CHECK (status IN ('pending','paid','cancelled'))
    );
    CREATE TABLE order_items (
      order_id integer REFERENCES orders, line_no integer,
      product_id text NOT NULL, quantity integer NOT NULL CHECK (quantity > 0),
      unit_price numeric(8,2) NOT NULL, PRIMARY KEY(order_id,line_no)
    );
    INSERT INTO customers VALUES (1,'Mina Shah'), (2,'Tariq Aziz'), (3,'Edda Berg');
    INSERT INTO orders VALUES
      (101,1,'2026-10-12 09:30+00','paid'),
      (102,2,'2026-10-14 16:05+00','paid'),
      (103,1,'2026-10-20 10:15+00','pending');
    INSERT INTO order_items VALUES
      (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),
      (102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
  `);
  const source = await readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
  const history = source.match(/const history = `([\s\S]+?)`;/)[1];
  const result = (await db.query(history)).rows;
  assert.deepEqual(result.map(({order_id,status})=>({order_id,status})),[
    {order_id:103,status:'pending'},{order_id:101,status:'paid'}
  ]);
  const report = (await db.query(`SELECT o.customer_id, SUM(i.quantity*i.unit_price) AS line_value
    FROM orders o JOIN order_items i ON i.order_id=o.order_id
    WHERE o.status='paid' AND o.placed_at >= timestamptz '2026-10-01 00:00+00'
      AND o.placed_at < timestamptz '2026-11-01 00:00+00'
    GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id`)).rows;
  assert.deepEqual(report,[{customer_id:2,line_value:'40.00'},{customer_id:1,line_value:'39.50'}]);
  assert.equal((await db.query('SELECT sum(quantity * unit_price) AS value FROM order_items WHERE order_id=103')).rows[0].value,'29.00');
  assert.equal(600+300+100,1000);
  assert.equal((12-4)/10,0.8);
  assert.equal(4/0.8,5);
  await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify({runtime:'@electric-sql/pglite 0.5.8',version,limits:'Single disposable in-memory WASM database. No timing, client pool, concurrent session, storage or lock observations are claimed.',historySQL:history,result,report,arithmetic:{requestMs:1000,spaceGiBPerMinute:0.8,remainingMinutesIfUnchanged:5}},null,2)+'\n');
  console.log('SQL result and illustration arithmetic checks passed.');
} finally { await db.close(); }
