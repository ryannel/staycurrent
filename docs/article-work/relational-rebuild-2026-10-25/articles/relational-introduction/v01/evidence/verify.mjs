import { PGlite } from '@electric-sql/pglite';
import { readFile,writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const results = {};
const setup = await readFile(new URL('./setup.sql',import.meta.url),'utf8');
const query = async source => (await db.query(source)).rows;
try {
  results.version=await query('SELECT version()');
  results.limits='Owned in-memory PGlite; sequential SQL outcomes only. No concurrent sessions, lock waiting, crash or distributed execution observed. Figure race is an illustrative PostgreSQL Read Committed schedule checked against primary documentation.';
  await db.exec(setup);
  results.success=await db.exec(`BEGIN;
UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING product_id,stock;
INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending');
UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING product_id,stock;
INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
COMMIT;`);
  results.select=await query('SELECT order_id,status FROM orders WHERE customer_id=1 ORDER BY order_id');
  assert.deepEqual(results.select,[{order_id:101,status:'paid'},{order_id:103,status:'pending'}]);
  results.join=await query('SELECT i.order_id,i.line_no,p.name,i.quantity,i.unit_price FROM order_items i JOIN products p ON p.product_id=i.product_id WHERE i.order_id=103 ORDER BY i.line_no');
  assert.deepEqual(results.join,[{order_id:103,line_no:1,name:'Blue mug',quantity:1,unit_price:'20.00'},{order_id:103,line_no:2,name:'Green tea, 50 g',quantity:2,unit_price:'4.50'}]);
  results.total=await query('SELECT sum(quantity*unit_price) AS total FROM order_items WHERE order_id=103');
  assert.equal(results.total[0].total,'29.00');
  results.payments=await query('SELECT count(*) AS n FROM payments WHERE order_id=103');
  assert.equal(results.payments[0].n,0);
  results.stock=await query('SELECT product_id,stock FROM products ORDER BY product_id');
  assert.deepEqual(results.stock,[{product_id:'P3',stock:10},{product_id:'P7',stock:0},{product_id:'P9',stock:4}]);
  results.constraints={};
  for(const [name,source,code] of [
    ['duplicate_order',"INSERT INTO orders VALUES(103,1,'2026-10-20 10:15+00','pending')",'23505'],
    ['unknown_customer',"INSERT INTO orders VALUES(105,99,'2026-10-20 10:15+00','pending')",'23503'],
    ['negative_stock',"UPDATE products SET stock=-1 WHERE product_id='P7'",'23514']
  ]) {
    let rejected=false;
    try { await db.exec(source); } catch(e) { assert.equal(e.code,code); results.constraints[name]={code:e.code,message:e.message}; rejected=true; }
    assert.ok(rejected,name);
  }
  results.valid_price=await db.exec("BEGIN; UPDATE products SET price=22 WHERE product_id='P7' RETURNING price; ROLLBACK;");
  assert.equal(results.valid_price[1].rows[0].price,'22.00');
  await db.exec('CREATE TABLE loose_orders(order_id integer,customer_id integer); INSERT INTO loose_orders VALUES(103,1),(103,99); CREATE TABLE loose_stock(stock integer); INSERT INTO loose_stock VALUES(-1);');
  results.without_constraints={orders:await query('SELECT * FROM loose_orders'),stock:await query('SELECT * FROM loose_stock')};
  assert.equal(results.without_constraints.orders.length,2);assert.equal(results.without_constraints.stock[0].stock,-1);
  await db.exec(setup);
  await db.exec("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1; ROLLBACK;");
  results.rollback={stock:await query("SELECT stock FROM products WHERE product_id='P7'"),orders:await query('SELECT count(*) AS n FROM orders WHERE order_id=103')};
  assert.equal(results.rollback.stock[0].stock,1);assert.equal(results.rollback.orders[0].n,0);
  await db.exec("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1;");
  results.without_transaction={stock:await query("SELECT stock FROM products WHERE product_id='P7'"),orders:await query('SELECT count(*) AS n FROM orders WHERE order_id=103')};
  assert.equal(results.without_transaction.stock[0].stock,0);assert.equal(results.without_transaction.orders[0].n,0);
  await db.exec(setup);
  results.first_guard=await db.query("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock");
  results.second_guard=await db.query("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock");
  assert.equal(results.first_guard.affectedRows,1);assert.equal(results.second_guard.affectedRows,0);
  await db.exec(setup);
  results.unguarded_first=await db.query("UPDATE products SET stock=0 WHERE product_id='P7' RETURNING stock");
  results.unguarded_second=await db.query("UPDATE products SET stock=0 WHERE product_id='P7' RETURNING stock");
  assert.equal(results.unguarded_first.affectedRows,1);assert.equal(results.unguarded_second.affectedRows,1);
  await writeFile(new URL('./database-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
  console.log(results.version[0].version);
  console.log('Passed: displayed SELECT/JOIN, stock/total, three rejections and unconstrained counterexamples, rollback/autocommit counterexample, guarded 1/0 and unguarded 1/1 sequential changes.');
} finally { await db.close(); }
