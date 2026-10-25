import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { copyStages, memberships, quorum, backlog } from '../src/components/relational-rebuild-cluster-change/model.mjs';

const source = await readFile(new URL('../src/articles/current/article.astro', import.meta.url),'utf8');
const literal = source.match(/code=\{`([^`]+)`\}/)[1];
const sql = literal.replace(/\\n/g,'\n');
const db = new PGlite();
let result;
try {
  await db.waitReady;
  const version = (await db.query('SELECT version() AS version')).rows[0].version;
  await db.exec(`
    CREATE TABLE customers(customer_id integer PRIMARY KEY, name text NOT NULL);
    CREATE TABLE products(product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0));
    CREATE TABLE orders(order_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers, placed_at timestamptz NOT NULL, status text NOT NULL CHECK(status IN ('pending','paid','cancelled')));
    CREATE TABLE order_items(order_id integer REFERENCES orders, line_no integer, product_id text NOT NULL REFERENCES products, quantity integer NOT NULL CHECK(quantity>0), unit_price numeric(8,2) NOT NULL, PRIMARY KEY(order_id,line_no));
    CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL CHECK(amount>0),method text NOT NULL);
    INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
    INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
    INSERT INTO orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
    INSERT INTO order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
    INSERT INTO payments VALUES(501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');
  `);
  const before = (await db.query('SELECT * FROM products ORDER BY product_id')).rows;
  assert.equal(before[1].price,'20.00');
  await db.exec(sql);
  const products = (await db.query('SELECT * FROM products ORDER BY product_id')).rows;
  const order = (await db.query(`SELECT status,(SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103) AS line_value,(SELECT count(*)::integer FROM payments WHERE order_id=103) AS payments FROM orders WHERE order_id=103`)).rows[0];
  assert.deepEqual(products.map(p=>[p.product_id,p.price,p.stock]),[['P3','4.50',10],['P7','22.00',0],['P9','35.00',4]]);
  assert.deepEqual(order,{status:'pending',line_value:'29.00',payments:0});
  const old = ['R1','R2','R3']; const next = ['R1','R2','R4'];
  const model = [];
  for(let mask=0;mask<16;mask++) {
    const available = ['R1','R2','R3','R4'].filter((_,n)=>mask&(1<<n));
    const expected = [old.filter(x=>available.includes(x)).length>=2, null, next.filter(x=>available.includes(x)).length>=2];
    expected[1]=expected[0]&&expected[2];
    const got = memberships.map((_,i)=>quorum(i,available).passes);
    assert.deepEqual(got,expected); model.push({available,passes:got});
  }
  assert.equal(quorum(0,['R2','R3']).passes,true);
  assert.equal(quorum(2,['R1','R4']).passes,true);
  assert.equal(quorum(1,['R2','R3']).passes,false);
  assert.equal(quorum(1,['R1','R4']).passes,false);
  assert.equal(quorum(1,['R1','R2']).passes,true);
  const backlogRows = [20,10,8].map(rate=>({rate,backlog:[0,30,60,90].map(t=>backlog(rate,t))}));
  assert.deepEqual(backlogRows.map(x=>x.backlog),[[600,300,0,0],[600,600,600,600],[600,660,720,780]]);
  assert.equal(copyStages[3].newPrice,'20.00');
  assert.equal(copyStages[4].later,'durable'); assert.equal(copyStages[4].newPrice,'20.00');
  assert.equal(copyStages[5].newPrice,'22.00');
  result = {runtime:'PGlite 0.5.8',version,sql,products,order,quorumTests:model,backlogRows,limits:'One owned in-memory PGlite database; no distributed cluster, replicated snapshot, Raft protocol or transfer speed executed. Quorum tests are set arithmetic, not a Raft implementation.'};
} finally { await db.close(); }
const files = ['src/articles/current/article.astro','src/articles/current/article.meta.json','src/components/relational-rebuild-cluster-change/Scene.astro','src/components/relational-rebuild-cluster-change/model.mjs','src/components/relational-rebuild-cluster-change/figures.css','evidence/verify.mjs'];
result.hashes = Object.fromEntries(await Promise.all(files.map(async path=>[path,createHash('sha256').update(await readFile(new URL('../'+path,import.meta.url))).digest('hex')])));
await writeFile(new URL('./verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({version:result.version,sql:'passed',shop:'unchanged apart from P7.price',quorumCases:16,backlog:'passed',closed:true}));
