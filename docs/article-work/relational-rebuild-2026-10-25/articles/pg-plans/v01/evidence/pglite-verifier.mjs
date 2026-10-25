import {PGlite} from '@electric-sql/pglite';
import {readFile,writeFile} from 'node:fs/promises';
const db = new PGlite();
try {
 const version=await db.query('SELECT version()');
 if (!version.rows[0].version.includes('18.3')) throw Error('Unexpected WASM runtime');
 await db.exec('CREATE SCHEMA sc_pg_plans_wasm; SET search_path=sc_pg_plans_wasm,pg_catalog; SET timezone=UTC;');
 await db.exec(await readFile(new URL('../input/generated-shop-fixture.sql',import.meta.url),'utf8'));
 const counts=await db.query("SELECT (SELECT count(*) FROM orders) AS orders,(SELECT count(*) FROM order_items) AS lines,(SELECT count(*) FROM orders WHERE status='paid' AND placed_at>='2026-10-01+00' AND placed_at<'2026-11-01+00') AS paid_oct");
 const core=await db.query("SELECT o.customer_id,sum(i.quantity*i.unit_price) AS value FROM orders o JOIN order_items i USING(order_id) WHERE o.order_id<100000 AND o.status='paid' GROUP BY o.customer_id ORDER BY value DESC");
 if(counts.rows[0].orders!==120003||counts.rows[0].lines!==360005||core.rows[0].value!=='40.00'||core.rows[1].value!=='39.50')throw Error('Fact mismatch');
 const query=(kind)=>`SELECT o.customer_id,sum(${kind==='direct'?'i.quantity*i.unit_price':'v.order_value'}) AS v FROM orders o ${kind==='direct'?'JOIN order_items i USING(order_id)':`CROSS JOIN LATERAL (SELECT sum(i.quantity*i.unit_price) AS order_value FROM order_items i WHERE i.order_id=o.order_id ${kind==='guarded'?'HAVING count(*)>0':''}) v`} WHERE o.status='paid' AND o.placed_at>='2026-10-01+00' AND o.placed_at<'2026-11-01+00' GROUP BY o.customer_id`;
 const diff=async(a,b)=>(await db.query(`WITH a AS (${query(a)}),b AS (${query(b)}) SELECT count(*) AS n FROM ((SELECT * FROM a EXCEPT ALL SELECT * FROM b) UNION ALL (SELECT * FROM b EXCEPT ALL SELECT * FROM a)) d`)).rows[0].n;
 await db.exec('BEGIN; DELETE FROM order_items WHERE order_id=101;');
 const emptyOrder={guardedDifference:await diff('direct','guarded'),unguardedDifference:await diff('direct','unguarded')};
 await db.exec("ROLLBACK; BEGIN; DELETE FROM order_items WHERE order_id=102; INSERT INTO order_items VALUES (102,1,'P7',1,20),(102,2,'P7',1,20);");
 const equalLines=(await db.query('SELECT sum(quantity*unit_price) AS correct,sum(DISTINCT quantity*unit_price) AS incorrect FROM order_items WHERE order_id=102')).rows;
 await db.exec('ROLLBACK');
 if(emptyOrder.guardedDifference!==0||emptyOrder.unguardedDifference!==1||equalLines[0].correct!=='40.00'||equalLines[0].incorrect!=='20.00')throw Error('Semantic counterexample failed');
 await writeFile(new URL('./pglite-results.json',import.meta.url),JSON.stringify({runtime:version.rows,counts:counts.rows,core:core.rows,emptyOrder,equalLines,limit:'Ordinary SQL/facts only. Native plans are independently observed in PostgreSQL 18.6.'},null,2));
} finally {await db.close();}
