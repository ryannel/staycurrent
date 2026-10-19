// Run with Node, using the already-installed native driver. No dependency mutation.
import assert from 'node:assert/strict';
import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/esm/index.mjs';
import { scenes } from './scenes.mjs';
const admin = new pg.Client({connectionString:'postgresql://staycurrent@127.0.0.1:57319/postgres'});
await admin.connect();
const database = process.env.A04_DATABASE || 'rel3_a04_run2';
assert.match(database, /^rel3_a04_run[0-9]+$/);
await admin.query(`CREATE DATABASE ${database}`);
await admin.end();
const pool = new pg.Pool({connectionString:`postgresql://staycurrent@127.0.0.1:57319/${database}`,max:1,connectionTimeoutMillis:100});
const client = await pool.connect();
const record = {database, processZone:Intl.DateTimeFormat().resolvedOptions().timeZone, node:process.version, driver:'pg 8.23.1'};
try {
 record.runtime = (await client.query('SELECT version()')).rows[0].version;
 record.timezone = (await client.query('SHOW timezone')).rows[0].TimeZone;
 await client.query(`CREATE TABLE boundary_values(id bigint, amount numeric(20,2), missing text, day date, wall timestamp, instant timestamptz, label text)`);
 const values = ['9007199254740993','123456789012345678.90',null,'2026-10-19','2026-10-19 12:34:56.123456','2026-10-19 12:34:56.123456+02',"Mina'); DROP TABLE boundary_values; --"];
 await client.query('INSERT INTO boundary_values VALUES ($1,$2,$3,$4,$5,$6,$7)',values);
 const row = (await client.query('SELECT * FROM boundary_values')).rows[0];
 assert.equal(row.id,values[0]); assert.equal(row.amount,values[1]); assert.equal(row.missing,null); assert.equal(row.label,values[6]);
 assert(row.day instanceof Date); assert(row.wall instanceof Date); assert(row.instant instanceof Date);
 assert.equal(row.instant.toISOString(),'2026-10-19T10:34:56.123Z');
 record.roundtrip = {id:row.id,amount:row.amount,missing:row.missing,day:row.day.toISOString(),wall:row.wall.toISOString(),instant:row.instant.toISOString(),label:row.label};
 record.precise = (await client.query('SELECT day::text,wall::text,instant::text FROM boundary_values')).rows[0];
 record.rounded = (await client.query('SELECT $1::bigint AS id',[Number(values[0])])).rows[0].id;
 assert.equal(record.rounded,'9007199254740992');
 record.undefined = (await client.query('SELECT $1::text IS NULL AS missing',[undefined])).rows[0].missing;
 assert.equal(record.undefined,true);
 await client.query('BEGIN');
 await client.query('CREATE TABLE orders (tenant_id integer, order_id integer, customer_id integer, PRIMARY KEY(tenant_id,order_id))');
 await client.query('INSERT INTO orders VALUES (7,103,1),(8,104,2)');
 await client.query('COMMIT');
 const scoped = await client.query('SELECT order_id FROM orders WHERE tenant_id=$1 AND order_id=$2',[7,104]);
 assert.equal(scoped.rows.length,0);
 record.crossTenant = scoped.rows;
 await client.query('BEGIN'); await client.query('INSERT INTO orders VALUES (7,105,1)'); await client.query('ROLLBACK');
 assert.equal((await client.query('SELECT * FROM orders WHERE order_id=105')).rows.length,0);
 record.rollback = 'No order 105';
 await assert.rejects(pool.connect(),/timeout exceeded/);
 record.exhaustion = 'Second acquisition timed out while the only client was held';
} finally { client.release(); }
const next = await pool.connect();
assert.equal((await next.query('SELECT 1 AS ready')).rows[0].ready,1); next.release();
record.reuse = 'Next borrower executes SELECT 1';
await pool.end();
for (const [name,scene] of Object.entries(scenes)) {
 assert.equal(scene.choices.length,scene.variants.length);
 assert.equal(scene.variants[0].length,scene.variants[1].length);
 for (const variant of scene.variants) for (const row of variant) assert.equal(row.length,5,name);
}
record.models = 'All five scenes have matching variant lengths and complete state tuples';
console.log(JSON.stringify(record,null,2));
