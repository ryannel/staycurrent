import { PGlite } from '@electric-sql/pglite';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const db = new PGlite();
const checks = [];
try {
 const version = (await db.query('SELECT version() AS version')).rows[0].version;
 await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY, price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0));
 CREATE TABLE orders(order_id integer PRIMARY KEY,status text NOT NULL);
 CREATE TABLE order_items(order_id integer REFERENCES orders, line_no integer, product_id text REFERENCES products, quantity integer NOT NULL, unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
 CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer REFERENCES orders,amount numeric(8,2));
 INSERT INTO products VALUES ('P3',4.50,10),('P7',20.00,0),('P9',35.00,4);
 INSERT INTO orders VALUES(103,'pending');
 INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`);
 const article = readFileSync('src/articles/current/article.astro','utf8');
 const query = article.match(/code=\{`(SELECT p\.price[\s\S]*?;)\n-- A/)[1];
 const initial = (await db.query(query)).rows;
 checks.push({state:'Constructed earlier-prefix state (B without C)',result:initial});
 if (String(initial[0].catalogue_price)!=='20.00'||String(initial[0].line_total)!=='29.00'||initial[0].status!=='pending')throw Error('earlier state mismatch');
 await db.exec("BEGIN; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;");
 const after = (await db.query(query)).rows;
 checks.push({state:'Constructed state after price commit (A after C)',result:after});
 if (String(after[0].catalogue_price)!=='22.00'||String(after[0].line_total)!=='29.00'||after[0].status!=='pending')throw Error('later state mismatch');
 checks.push({stock:(await db.query('SELECT product_id,stock FROM products ORDER BY product_id')).rows,paymentsFor103:(await db.query('SELECT count(*)::int AS n FROM payments WHERE order_id=103')).rows[0].n});
 writeFileSync('evidence/sql-results.json',JSON.stringify({runtime:'PGlite 0.5.8, WebAssembly PostgreSQL; one in-memory owned instance',version,query,checks,articleSha256:createHash('sha256').update(article).digest('hex'),limits:'Constructed SQL states only; no physical replication, concurrent clients, real failover, fencing, power failure or recovery-rate observation.'},null,2)+'\n');
 console.log(JSON.stringify({version,checks},null,2));
} finally { await db.close(); }
