import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
assert(cfg.host === '127.0.0.1' || cfg.host.startsWith('/private/tmp/'));
for (const key of ['database','user','cluster_name','data_directory','pg_module']) assert(cfg[key]);
assert(cfg.database.startsWith('sc_pg_schema_'));
const { Client } = require(cfg.pg_module);
const clients=[];const results={};
async function session(name) {
 const c=new Client({host:cfg.host,port:cfg.port,database:cfg.database,user:cfg.user,password:cfg.password,ssl:false,connectionTimeoutMillis:4000,application_name:'sc_pg_schema_'+name,options:'-c statement_timeout=8000 -c lock_timeout=3000 -c idle_in_transaction_session_timeout=15000'});
 await c.connect();clients.push(c);
 const row=(await c.query(`SELECT current_database() AS db, current_user AS usr, current_setting('cluster_name') AS cluster, current_setting('data_directory') AS dir, current_setting('server_version_num') AS version, pg_backend_pid() AS pid`)).rows[0];
 const sys=(await c.query('SELECT system_identifier::text AS id FROM pg_control_system()')).rows[0];assert.equal(sys.id,cfg.system_identifier);row.system_identifier=sys.id;
 assert.equal(row.db,cfg.database);assert.equal(row.usr,cfg.user);assert.equal(row.cluster,cfg.cluster_name);assert.equal(row.dir,cfg.data_directory);assert.equal(row.version,'180006');
 results[name+'_identity']=row;return c;
}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function waitFor(check) {const end=Date.now()+4000;while(Date.now()<end){const x=await check();if(x)return x;await delay(30)}throw Error('bounded barrier not reached')}
async function outcome(p){try{return {rows:(await p).rows}}catch(e){return {code:e.code,message:e.message}}}
try {
 const a=await session('holder'), b=await session('ddl'), c=await session('reader');
 await a.query(`CREATE SCHEMA proof; CREATE TABLE proof.products (product_id text PRIMARY KEY, price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL); INSERT INTO proof.products VALUES ('P3',4.50,10),('P7',20,0),('P9',35,4)`);
 await a.query('BEGIN');await a.query('SELECT * FROM proof.products');
 await b.query(`BEGIN; SET LOCAL lock_timeout='1400ms'`);
 const ddl=outcome(b.query('ALTER TABLE proof.products ADD COLUMN price_hundredths integer'));
 await waitFor(async()=> (await a.query('SELECT NOT granted AS waiting FROM pg_locks WHERE pid=$1 AND mode=$2',[results.ddl_identity.pid,'AccessExclusiveLock'])).rows.some(x=>x.waiting));
 const probe=outcome(c.query("SELECT price FROM proof.products WHERE product_id='P7'"));
 results.queue=await waitFor(async()=>{const rows=(await a.query(`SELECT pid,pg_blocking_pids(pid) AS blockers FROM pg_stat_activity WHERE pid=ANY($1::int[])`,[[results.ddl_identity.pid,results.reader_identity.pid]])).rows;return rows.some(x=>x.pid===results.reader_identity.pid&&x.blockers.includes(results.ddl_identity.pid))?rows:false});
 results.ddl_timeout=await ddl;assert.equal(results.ddl_timeout.code,'55P03');results.later_reader=await probe;assert.equal(results.later_reader.rows[0].price,'20.00');
 results.failed_transaction=await outcome(b.query('SELECT 1'));assert.equal(results.failed_transaction.code,'25P02');await b.query('ROLLBACK');await a.query('ROLLBACK');
 // Ordinary row update does not block an ordinary SELECT.
 await a.query('BEGIN');await a.query("UPDATE proof.products SET stock=stock WHERE product_id='P7'");results.row_lock_reader=(await c.query("SELECT price FROM proof.products WHERE product_id='P7'")).rows;await a.query('ROLLBACK');
 await a.query('ALTER TABLE proof.products ADD COLUMN price_hundredths integer');
 // Unguarded stale assignment is a counterexample; reset only the independent price race.
 await b.query("UPDATE proof.products SET price=22,price_hundredths=2200 WHERE product_id='P7'");await a.query("UPDATE proof.products SET price_hundredths=2000 WHERE product_id='P7'");results.stale=(await a.query("SELECT price,price_hundredths FROM proof.products WHERE product_id='P7'")).rows;
 assert.equal(results.stale[0].price_hundredths,2000);
 await a.query("UPDATE proof.products SET price=20,price_hundredths=NULL WHERE product_id='P7'");
 await b.query('BEGIN');await b.query("UPDATE proof.products SET price=22,price_hundredths=2200 WHERE product_id='P7'");
 const worker=outcome(a.query("UPDATE proof.products SET price_hundredths=(price*100)::integer WHERE product_id='P7' AND price_hundredths IS DISTINCT FROM (price*100)::integer RETURNING price,price_hundredths"));
 await waitFor(async()=> (await c.query('SELECT pg_blocking_pids($1) AS blockers',[results.holder_identity.pid])).rows[0].blockers.includes(results.ddl_identity.pid));
 await b.query('COMMIT');results.safe_worker=await worker;assert.deepEqual(results.safe_worker.rows,[]);
 results.safe_pair=(await a.query("SELECT price,price_hundredths FROM proof.products WHERE product_id='P7'")).rows;assert.equal(results.safe_pair[0].price_hundredths,2200);
 await a.query(`WITH batch AS (SELECT product_id FROM proof.products WHERE price_hundredths IS DISTINCT FROM (price*100)::integer ORDER BY product_id COLLATE "C" LIMIT 2 FOR UPDATE) UPDATE proof.products AS p SET price_hundredths=(p.price*100)::integer FROM batch AS b WHERE p.product_id=b.product_id RETURNING p.product_id,p.price,p.price_hundredths`);
 results.convergence=(await a.query('SELECT count(*) FILTER(WHERE price_hundredths IS NULL) AS missing,count(*) FILTER(WHERE price_hundredths IS DISTINCT FROM (price*100)::integer) AS different FROM proof.products')).rows;assert.deepEqual(results.convergence,[{missing:'0',different:'0'}]);
 await a.query(`ALTER TABLE proof.products ADD CONSTRAINT products_hundredths_nn NOT NULL price_hundredths NOT VALID, ADD CONSTRAINT products_hundredths_range CHECK(price_hundredths BETWEEN 0 AND 99999999) NOT VALID, ADD CONSTRAINT products_price_agrees CHECK(price_hundredths=price*100) NOT VALID`);
 results.before_validation=(await a.query("SELECT conname,convalidated FROM pg_constraint WHERE conrelid='proof.products'::regclass ORDER BY conname")).rows;
 results.rejected_stale=await outcome(a.query("UPDATE proof.products SET price_hundredths=2000 WHERE product_id='P7'"));assert.equal(results.rejected_stale.code,'23514');
 await a.query(`ALTER TABLE proof.products VALIDATE CONSTRAINT products_hundredths_nn; ALTER TABLE proof.products VALIDATE CONSTRAINT products_hundredths_range; ALTER TABLE proof.products VALIDATE CONSTRAINT products_price_agrees`);
 results.after_validation=(await a.query("SELECT conname,convalidated FROM pg_constraint WHERE conrelid='proof.products'::regclass ORDER BY conname")).rows;assert(results.after_validation.every(x=>x.convalidated));
 await a.query('CREATE INDEX CONCURRENTLY products_price ON proof.products(price)');
 await a.query('REINDEX INDEX CONCURRENTLY proof.products_price');
 results.index=(await a.query("SELECT indexrelid::regclass::text,indisready,indisvalid,indislive,pg_get_indexdef(indexrelid) FROM pg_index WHERE indrelid='proof.products'::regclass ORDER BY indexrelid")).rows;assert(results.index.every(x=>x.indisready&&x.indisvalid&&x.indislive));
 await a.query('CREATE TABLE proof.unique_probe(k integer);INSERT INTO proof.unique_probe VALUES(1),(1)');
 results.failed_unique=await outcome(a.query('CREATE UNIQUE INDEX CONCURRENTLY unique_probe_k ON proof.unique_probe(k)'));assert.equal(results.failed_unique.code,'23505');
 results.invalid_leftover=(await a.query("SELECT indisready,indisvalid,indislive FROM pg_index WHERE indexrelid='proof.unique_probe_k'::regclass")).rows;assert.equal(results.invalid_leftover[0].indisvalid,false);
 await a.query('DROP INDEX CONCURRENTLY proof.unique_probe_k');
 await a.query('DROP SCHEMA proof CASCADE');results.success=true;
} finally {
 for (const c of clients) {try{await c.query('ROLLBACK')}catch{}try{await c.end()}catch{}}
 fs.writeFileSync(new URL('native-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
}
