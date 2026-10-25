import {PGlite} from '@electric-sql/pglite';
import assert from 'node:assert/strict';
const db=new PGlite();
try{
  const version=(await db.query('SELECT version()')).rows[0].version;
  await db.exec(`
    CREATE TABLE products (product_id text PRIMARY KEY, stock integer NOT NULL CHECK(stock >= 0));
    CREATE TABLE orders (order_id integer PRIMARY KEY, status text NOT NULL);
    CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer, product_id text REFERENCES products, quantity integer, unit_price numeric(8,2), PRIMARY KEY(order_id,line_no));
    INSERT INTO products VALUES ('P3',12),('P7',1),('P9',4);
  `);
  const work=`UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2;
    UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1;
    INSERT INTO orders VALUES(103,'pending');
    INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`;
  await db.exec(`BEGIN;${work}ROLLBACK;`);
  const aborted={orders:(await db.query('SELECT * FROM orders')).rows,stock:(await db.query('SELECT * FROM products ORDER BY product_id')).rows};
  assert.equal(aborted.orders.length,0);assert.equal(aborted.stock[0].stock,12);assert.equal(aborted.stock[1].stock,1);
  await db.exec(`BEGIN;${work}COMMIT;`);
  const committed={orders:(await db.query('SELECT * FROM orders')).rows,lines:(await db.query('SELECT * FROM order_items ORDER BY line_no')).rows,stock:(await db.query('SELECT * FROM products ORDER BY product_id')).rows,total:(await db.query('SELECT sum(quantity*unit_price)::text AS total FROM order_items')).rows[0].total};
  assert.equal(committed.lines.length,2);assert.equal(committed.total,'29.00');assert.equal(committed.stock[0].stock,10);assert.equal(committed.stock[1].stock,0);assert.equal(committed.stock[2].stock,4);
  console.log(JSON.stringify({runtime:'@electric-sql/pglite 0.5.8, owned in-memory disposable instance',version,scope:'Ordinary local SQL and example arithmetic only; NOT distributed commit, crash recovery, replication, isolation or native server verification',aborted,committed},null,2));
}finally{await db.close();}
