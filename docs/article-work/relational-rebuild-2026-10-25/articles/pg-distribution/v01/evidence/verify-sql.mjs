import { PGlite } from '@electric-sql/pglite';
import { writeFileSync } from 'node:fs';
const db=new PGlite();
const log=[];
const q=async(sql)=>{const r=await db.query(sql);log.push({sql,rows:r.rows});return r.rows;};
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
try{
 await q('SELECT version()');
 await db.exec(`CREATE TABLE key_orders(customer_id int,order_id int,PRIMARY KEY(customer_id,order_id));
 CREATE TABLE key_lines(customer_id int,order_id int,line_no int,PRIMARY KEY(customer_id,order_id,line_no),FOREIGN KEY(customer_id,order_id) REFERENCES key_orders);
 INSERT INTO key_orders VALUES(1,103),(2,103);`);
 assert((await q('SELECT * FROM key_orders ORDER BY customer_id')).length===2,'pair permits repeated order ID');
 for(const [label,sql,code] of [
 ['same pair',"INSERT INTO key_orders VALUES(1,103)",'23505'],
 ['wrong customer reference',"INSERT INTO key_lines VALUES(3,103,1)",'23503'],
 ['ID-only reference',"CREATE TABLE wrong_ref(order_id int REFERENCES key_orders(order_id))",'42830']]){
  try{await db.exec(sql);throw Error('not refused '+label);}catch(e){assert(e.code===code,label+': '+e.message);log.push({label,sql,code:e.code});}
 }
 await db.exec(`CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int,placed_at timestamptz,status text);
 CREATE TABLE order_items(order_id int,line_no int,product_id text,quantity int,unit_price numeric(8,2));
 INSERT INTO orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
 INSERT INTO order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);`);
 await db.exec(`CREATE TABLE orders_dist AS SELECT * FROM orders;
 CREATE TABLE order_items_dist AS SELECT o.customer_id,i.* FROM order_items i JOIN orders o USING(order_id);`);
 const local=await q(`SELECT o.order_id, SUM(i.quantity * i.unit_price) AS line_value FROM orders_dist AS o JOIN order_items_dist AS i ON i.customer_id = o.customer_id AND i.order_id = o.order_id WHERE o.customer_id = 1 GROUP BY o.order_id`);
 assert(local.length===2&&local.find(r=>r.order_id===101).line_value==='39.50'&&local.find(r=>r.order_id===103).line_value==='29.00','candidate ordinary join only');
 const report=`SELECT o.customer_id,SUM(i.quantity*i.unit_price) AS line_value FROM orders o JOIN order_items i USING(order_id) WHERE o.status='paid' AND o.placed_at>=timestamptz '2026-10-01 00:00+00' AND o.placed_at<timestamptz '2026-11-01 00:00+00' GROUP BY o.customer_id ORDER BY line_value DESC,o.customer_id`;
 const rows=await q(report);assert(JSON.stringify(rows)===JSON.stringify([{customer_id:2,line_value:'40.00'},{customer_id:1,line_value:'39.50'}]),'core report');
 const counts=await q(`WITH generated AS (SELECT CASE WHEN n%10<7 THEN 1001 ELSE 1002+(17*n+20261025)%999 END AS customer_id FROM generate_series(0,119999) n) SELECT count(*) AS total,count(*) FILTER(WHERE customer_id=1001) AS hot FROM generated`);
 assert(counts[0].total===120000&&counts[0].hot===84000,'generated skew');
 log.push({passed:true,limits:'Ordinary SQL only. No Citus extension, FDW, native sessions, movement, workload traffic or timings.'});
}finally{await db.close();writeFileSync(new URL('./sql-results.json',import.meta.url),JSON.stringify(log,null,2)+'\n');}
