import { PGlite } from '@electric-sql/pglite';
import { writeFileSync } from 'node:fs';
const db = new PGlite();
try {
 const version=(await db.query('select version()')).rows;
 await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20,0),('P9','Teapot',35,4); CREATE TABLE order_items(order_id integer,line_no integer,product_id text,quantity integer,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no)); INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.50);`);
 const before=(await db.query('select * from products order by product_id')).rows;
 await db.exec(`BEGIN; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;`);
 const after=(await db.query('select * from products order by product_id')).rows;
 const total=(await db.query('select sum(quantity*unit_price) as line_value from order_items where order_id=103')).rows;
 if(after[1].price!=='22.00'||total[0].line_value!=='29.00'||after.map(x=>x.stock).join()!=='10,0,4')throw Error('Shared facts failed');
 writeFileSync('evidence/sql-result.json',JSON.stringify({runtime:'@electric-sql/pglite 0.5.8; owned in-memory disposable instance',version,before,after,total,limits:'No concurrency, filesystem durability, native server, crash or power-loss observation.'},null,2));
} finally {await db.close();}
