import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const results = {};
try {
  results.version=(await db.query('select version()')).rows;
  const seed=await fs.readFile(new URL('./seed.sql',import.meta.url),'utf8');
  const repair=await fs.readFile(new URL('./reconcile.sql',import.meta.url),'utf8');
  await db.exec(seed);
  results.before=(await db.query(`select (select price from products where product_id='P7') as price, status, (select sum(quantity*unit_price) from order_items where order_id=103) as total, (select coalesce(sum(amount),0)::numeric(8,2) from payments where order_id=103) as paid from orders where order_id=103`)).rows;
  await db.exec(repair); await db.exec(repair);
  results.repeat=(await db.query('select * from payment_operations')).rows;
  assert.equal((await db.query('select count(*)::int as n from payments where payment_id=504')).rows[0].n,1);
  await db.exec("update payment_operations set amount=11 where operation_id='order-103-part-payment-1'");
  try { await db.exec(repair); throw new Error('accepted changed meaning'); } catch(e) { assert.match(e.message,/Operation meaning mismatch/); results.mismatch=e.message; }
  await db.exec("update payment_operations set amount=10; delete from payment_operations; delete from payments where payment_id=504;");
  await db.exec("alter table payment_operations add constraint reject_repair check(payment_id<>504)");
  try { await db.exec(repair); throw new Error('accepted rejected mapping'); } catch(e) { assert.match(e.message,/reject_repair/); results.atomicFailure=e.message; }
  assert.equal((await db.query('select count(*)::int as n from payments where payment_id=504')).rows[0].n,0);
  results.atomicPaymentAbsent=true;
  // Counterexample: a new ID on each blind replay duplicates the accepted charge locally.
  await db.exec("insert into payments values(504,103,10,'card'),(505,103,10,'card')");
  results.blindReplay=(await db.query('select sum(amount)::numeric(8,2) as paid from payments where order_id=103')).rows;
  assert.equal(results.blindReplay[0].paid,'20.00');
  results.limits='SQL only; no native WAL/archive/backup execution; no provider contacted.';
} finally { await db.close(); }
await fs.writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
