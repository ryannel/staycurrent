import { PGlite } from '@electric-sql/pglite';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { figures } from '../src/components/relational-rebuild-transactions/model.mjs';
const db = new PGlite();
const article = readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
const snippets = [...article.matchAll(/code=\{`([\s\S]*?)`\}/g)].map(m=>m[1]);
const result = {runtime:'PGlite 0.5.8; PostgreSQL WASM',sourceSha256:createHash('sha256').update(article).digest('hex'),checks:[]};
const q = async sql => (await db.query(sql)).rows;
try {
  result.version = await q('SELECT version()');
  await db.exec(`CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL);
CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL CHECK(status IN ('pending','paid','cancelled')));
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL REFERENCES products,quantity integer NOT NULL CHECK(quantity>0),unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL CHECK(amount>0),method text NOT NULL);
INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,12),('P7','Blue mug',20.00,1),('P9','Teapot',35.00,4);`);
  assert.equal(snippets.length,5);
  await db.exec('BEGIN');
  const mug = await q(snippets[1]);
  assert.deepEqual(mug,[{product_id:'P7',stock:0}]);
  await db.exec(`UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2;
INSERT INTO orders VALUES(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
COMMIT;`);
  assert.deepEqual(await q('SELECT product_id,stock FROM products ORDER BY product_id'),[{product_id:'P3',stock:10},{product_id:'P7',stock:0},{product_id:'P9',stock:4}]);
  assert.deepEqual(await q(snippets[3]),[{line_value:'29.00',paid:'0'}]);
  result.checks.push('Successful purchase: full lines and stock 10/0/4, line value29.00, paid0');
  await db.exec('BEGIN; UPDATE products SET stock=stock-2 WHERE product_id=\'P3\';');
  assert.deepEqual(await q(snippets[1]),[]);
  await db.exec('ROLLBACK');
  assert.equal((await q("SELECT stock FROM products WHERE product_id='P3'"))[0].stock,10);
  result.checks.push('Failed mug guard returns no row; whole rollback restores earlier tea change');
  await db.exec(snippets[2]);
  result.checks.push('Displayed read-only Repeatable Read block executes');
  await db.exec(snippets[4]);
  assert.deepEqual(await q(snippets[3]),[{line_value:'29.00',paid:'20.00'}]);
  result.checks.push('Serializable snippet executes in allowed branch; next20.00 fails20+20<=29');
  assert.equal(20+20<=29,false);
  await db.exec(snippets[0]);
  result.checks.push('Absolute stock=0 remains legal at stock0; non-negative check does not reject it');
  await db.exec('BEGIN; UPDATE products SET stock=1 WHERE product_id=\'P7\'; ROLLBACK;');
  assert.equal((await q("SELECT stock FROM products WHERE product_id='P7'"))[0].stock,0);
  for (const [kind,config] of Object.entries(figures)) for (const [key,variant] of Object.entries(config.variants)) {
    assert.ok(variant.steps.length>=4);
    for (const step of variant.steps) assert.ok(step.left.length && step.right.length && step.explanation && step.state);
    if(kind==='payments') assert.equal(variant.steps.at(-1).paid,key==='repeatable'?40:20);
  }
  result.checks.push('All eight figure variants have complete states; payment outcomes40/20 match arithmetic');
  result.limits='One owned disposable PGlite instance, closed below. No multi-session or native claims from this verifier; supplied native fixture corroborates concurrent schedules separately. Conditional payment branch is application logic, not executable SQL comments.';
} finally {
  await db.close();
  writeFileSync(new URL('sql-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
}
console.log(JSON.stringify(result,null,2));
