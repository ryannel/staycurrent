import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
const sqlPath = new URL('../public/relational-rebuild/backups/reconciliation.sql', import.meta.url);
const sql = await readFile(sqlPath, 'utf8');
const results = { runtime: null, fixture_sha256: createHash('sha256').update(sql).digest('hex'), observations: [] };
const db = new PGlite();
const call = (amount = 10) => db.query("SELECT pg_temp.reconcile_payment('order-103-part-payment-1',103,504,$1,'card') AS outcome", [amount]);
const snapshot = async () => (await db.query(`SELECT
 (SELECT price::text FROM products WHERE product_id='P7') AS price,
 (SELECT status FROM orders WHERE order_id=103) AS status,
 (SELECT sum(quantity*unit_price)::text FROM order_items WHERE order_id=103) AS total,
 (SELECT coalesce(sum(amount),0)::numeric(8,2)::text FROM payments WHERE order_id=103) AS paid,
 (SELECT count(*)::int FROM payments WHERE payment_id=504) AS payment_count,
 (SELECT count(*)::int FROM recovered_operations) AS mapping_count,
 (SELECT string_agg(product_id||':'||stock,',' ORDER BY product_id) FROM products) AS stock;`)).rows[0];
const rejected = async (label, operation, message) => {
 try { await operation(); assert.fail(`${label} unexpectedly succeeded`); }
 catch (e) { assert.match(e.message, message); results.observations.push({ check: label, error: e.message }); }
};
try {
 results.runtime = (await db.query('SELECT version() AS version')).rows[0].version;
 const demo = await db.exec(sql);
 results.observations.push({ check: 'reader download executed unchanged', outputs: demo.filter(x => x.rows?.length).map(x => x.rows) });
 assert.deepEqual(await snapshot(), {price:'20.00',status:'pending',total:'29.00',paid:'10.00',payment_count:1,mapping_count:1,stock:'P3:10,P7:0,P9:4'});
 await call(); assert.equal((await snapshot()).payment_count, 1);
 results.observations.push({check:'third repeat adds no payment',state:await snapshot()});
 await rejected('changed amount under original identity',()=>call(11),/meaning disagrees/);
 await db.exec("UPDATE recovered_operations SET amount=9 WHERE operation_id='order-103-part-payment-1'");
 await rejected('existing mapping mismatch',()=>call(),/mapping disagrees/);
 await db.exec("UPDATE recovered_operations SET amount=10 WHERE operation_id='order-103-part-payment-1'; UPDATE payments SET amount=9 WHERE payment_id=504");
 await rejected('existing result mismatch',()=>call(),/payment disagrees/);
 await db.exec('DELETE FROM recovered_operations; DELETE FROM payments WHERE payment_id=504');
 await db.exec("UPDATE provider_evidence SET outcome='unresolved'");
 await rejected('unknown provider outcome',()=>call(),/outcome unresolved/);
 assert.equal((await snapshot()).payment_count,0);
 await db.exec("UPDATE provider_evidence SET outcome='accepted'");
 await db.exec(`CREATE FUNCTION pg_temp.reject_mapping() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'injected mapping failure'; END; $$;
 CREATE TRIGGER reject_mapping BEFORE INSERT ON recovered_operations FOR EACH ROW EXECUTE FUNCTION pg_temp.reject_mapping();`);
 await rejected('failure after payment insert rolls payment back',()=>call(),/injected mapping failure/);
 assert.equal((await snapshot()).payment_count,0); assert.equal((await snapshot()).mapping_count,0);
 results.observations.push({check:'atomic failure leaves neither record',state:await snapshot()});
 await db.exec('DROP TRIGGER reject_mapping ON recovered_operations');
 // Fault injection only: move an existing payment to the recovered order.
 // This changes no shared scenario and is reverted before completion.
 await db.exec('BEGIN; UPDATE payments SET order_id=103 WHERE payment_id=503; SAVEPOINT attempt');
 await rejected('business-rule conflict',()=>call(),/violate the recovered agreement/);
 await db.exec('ROLLBACK TO attempt; ROLLBACK');
 // Counterexample: splitting the two writes leaves a payment without its identity.
 await db.exec("INSERT INTO payments VALUES (504,103,10.00,'card')");
 assert.equal((await snapshot()).mapping_count,0);
 results.observations.push({check:'unprotected split write counterexample',state:await snapshot()});
 await rejected('unmapped payment requires investigation',()=>call(),/without this operation mapping/);
 await db.exec('DELETE FROM payments WHERE payment_id=504');
 assert.equal((await call()).rows[0].outcome,'recorded known provider payment');
 results.observations.push({check:'final clean accepted recovery',state:await snapshot()});
 results.limits = ['PostgreSQL 18.3 WASM in PGlite 0.5.8; no native server, backup, WAL archive or restore tested.', 'Provider evidence is a temporary assumed input; no network requests or provider observations.', 'Sequential controlled fixture; no concurrent-worker or authority-handover proof.', 'Fault injections alter only this disposable fixture; no new shared shop facts.'];
 results.passed = true;
} finally {
 await db.close();
 await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
}
console.log(JSON.stringify({passed:results.passed,runtime:results.runtime,checks:results.observations.length}));
