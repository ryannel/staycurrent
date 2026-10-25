// Coordinator runs this against the explicitly owned fixture only.
import { readFile, writeFile } from 'node:fs/promises';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
const schema='pa_arch_20261025_01';
const config=JSON.parse(await readFile(process.argv[2],'utf8'));
const out={scope:'Owned disposable PostgreSQL 18.6. Three independent price-update replays; all page addresses are observed only in this fixture.',guards:[],runs:{}};
const clients=[];
let created=false;
async function connect(name){
 const c=new pg.Client({...config,application_name:`pg_architecture_verify_${name}`});
 await c.connect();clients.push(c);
 const {rows:[g]}=await c.query(`SELECT current_database() AS database,current_user AS role,current_setting('cluster_name') AS cluster,current_setting('data_directory') AS data_directory,version() AS version`);
 if(g.database!=='sc_pg_architecture'||g.role!=='sc_pg_architecture_writer'||g.cluster!=='staycurrent-pg-architecture-20261025'||g.data_directory!=='/var/lib/postgresql/18/docker'||!g.version.startsWith('PostgreSQL 18.6 '))throw Error('Owned-fixture guard failed');
 out.guards.push({connection:name,...g});
 await c.query(`SET statement_timeout='10s'; SET lock_timeout='2s'; SET idle_in_transaction_session_timeout='60s'; SET search_path=${schema},public;`);
 return c;
}
async function page(c,table,block=0){return (await c.query(`SELECT lp,lp_flags,lp_off,lp_len,t_xmin::text,t_xmax::text,t_ctid::text,heap_tuple_infomask_flags(t_infomask,t_infomask2) AS flags FROM heap_page_items(get_raw_page($1,$2))`,[`${schema}.${table}`,block])).rows;}
async function index(c,index){
 const meta=(await c.query(`SELECT * FROM bt_metap($1)`,[`${schema}.${index}`])).rows[0];
 const blocks=(await c.query(`SELECT pg_relation_size($1::regclass)/current_setting('block_size')::int AS blocks`,[`${schema}.${index}`])).rows[0].blocks;
 const leaves=[];
 for(let b=1;b<Number(blocks);b++){
  const st=(await c.query(`SELECT * FROM bt_page_stats($1,$2)`,[`${schema}.${index}`,b])).rows[0];
  if(st.type==='l') leaves.push({block:b,stats:st,items:(await c.query(`SELECT itemoffset,ctid::text,dead,htid::text,tids::text FROM bt_page_items($1,$2)`,[`${schema}.${index}`,b])).rows});
 }
 return {meta,leaves};
}
function assert(ok,message){if(!ok)throw Error(message);}
try{
 const a=await connect('report'),b=await connect('writer'),i=await connect('inspect');
 out.pageinspect=(await i.query(`SELECT name,installed_version,default_version FROM pg_available_extensions WHERE name='pageinspect'`)).rows;
 assert(out.pageinspect.length===1,'pageinspect unavailable');
 await i.query('CREATE EXTENSION IF NOT EXISTS pageinspect');
 await i.query(`CREATE SCHEMA ${schema}`);created=true;
 const create=table=>`CREATE TABLE ${schema}.${table}(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0)) WITH(autovacuum_enabled=false); INSERT INTO ${schema}.${table} VALUES('P3','Green tea, 50 g',4.50,10),('P9','Teapot',35.00,4),('P7','Blue mug',20.00,0);`;
 await i.query(create('products_hot'));
 await a.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 const first=(await a.query('SELECT product_id,price,ctid::text,xmin::text,xmax::text FROM products_hot WHERE product_id=\'P7\'')).rows;
 out.runs.hot={reportBefore:first,heapBefore:await page(i,'products_hot'),indexBefore:await index(i,'products_hot_pkey')};
 await b.query('BEGIN');
 const newRow=(await b.query(`UPDATE products_hot SET price=22.00 WHERE product_id='P7' RETURNING price,ctid::text,xmin::text,xmax::text`)).rows;
 out.runs.hot.writerUncommitted=newRow;
 out.runs.hot.ordinaryDuringUpdate=(await i.query(`SELECT price FROM products_hot WHERE product_id='P7'`)).rows;
 await b.query('COMMIT');
 out.runs.hot.reportAfterCommit=(await a.query(`SELECT price,ctid::text FROM products_hot WHERE product_id='P7'`)).rows;
 out.runs.hot.laterSnapshot=(await i.query(`SELECT price,ctid::text FROM products_hot WHERE product_id='P7'`)).rows;
 out.runs.hot.heapAfter=await page(i,'products_hot');out.runs.hot.indexAfter=await index(i,'products_hot_pkey');
 assert(first[0].price==='20.00'&&out.runs.hot.reportAfterCommit[0].price==='20.00'&&out.runs.hot.laterSnapshot[0].price==='22.00','Snapshot prices differ from expected');
 assert(JSON.stringify(out.runs.hot.heapAfter).includes('HEAP_HOT_UPDATED')&&JSON.stringify(out.runs.hot.heapAfter).includes('HEAP_ONLY_TUPLE'),'HOT flags absent');
 await a.query('COMMIT');
 // Vacuum can perform the pruning after the retained snapshot ends.
 await i.query('VACUUM products_hot');
 out.runs.hot.heapAfterVacuum=await page(i,'products_hot');out.runs.hot.indexAfterVacuum=await index(i,'products_hot_pkey');
 // Countercase 1: the same logical update with an index referencing price.
 await i.query(create('products_indexed'));await i.query('CREATE INDEX products_indexed_price ON products_indexed(price)');
 await a.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');await a.query('SELECT * FROM products_indexed');
 out.runs.indexed={before:await page(i,'products_indexed'),keyBefore:await index(i,'products_indexed_pkey'),priceBefore:await index(i,'products_indexed_price')};
 await b.query(`UPDATE products_indexed SET price=22.00 WHERE product_id='P7'`);
 out.runs.indexed.after=await page(i,'products_indexed');out.runs.indexed.keyAfter=await index(i,'products_indexed_pkey');out.runs.indexed.priceAfter=await index(i,'products_indexed_price');
 assert(!JSON.stringify(out.runs.indexed.after).includes('HEAP_ONLY_TUPLE'),'Price-index countercase unexpectedly HOT');
 await a.query('COMMIT');
 // Countercase 2: PLAIN wide tuples fill the original page. This is a separate
 // physical test table, not generated shop products or shared business facts.
 await i.query(`CREATE TABLE products_full(product_id text PRIMARY KEY,price numeric(8,2) NOT NULL,pad text NOT NULL) WITH(fillfactor=100,autovacuum_enabled=false); ALTER TABLE products_full ALTER COLUMN pad SET STORAGE PLAIN; INSERT INTO products_full SELECT CASE WHEN n=1 THEN 'P7' ELSE 'fixture-'||n END,20.00,repeat('x',1900) FROM generate_series(1,4) AS g(n);`);
 await a.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 out.runs.full={beforeRows:(await a.query('SELECT product_id,ctid::text FROM products_full ORDER BY product_id')).rows,before:await page(i,'products_full'),keyBefore:await index(i,'products_full_pkey')};
 const fullNew=(await b.query(`UPDATE products_full SET price=22.00 WHERE product_id='P7' RETURNING ctid::text`)).rows;
 out.runs.full.new=fullNew;out.runs.full.afterPage0=await page(i,'products_full');out.runs.full.afterPage1=await page(i,'products_full',1);out.runs.full.keyAfter=await index(i,'products_full_pkey');
 assert(fullNew[0].ctid.startsWith('(1,'),'Full-page case did not move to block 1');
 assert(!JSON.stringify(out.runs.full.afterPage1).includes('HEAP_ONLY_TUPLE'),'Full-page case unexpectedly HOT');
 await a.query('COMMIT');
 // Aborted new tuple must not replace the committed price in ordinary reads.
 await b.query('BEGIN');await b.query(`UPDATE products_hot SET price=24.00 WHERE product_id='P7'`);await b.query('ROLLBACK');
 out.abortedAttempt=(await i.query(`SELECT price FROM products_hot WHERE product_id='P7'`)).rows;assert(out.abortedAttempt[0].price==='22.00','Aborted price visible');
 out.status='passed';
}catch(error){out.status='failed';out.error=error.message;process.exitCode=1;}
finally{
 for(const c of clients){try{await c.query('ROLLBACK');}catch{}}
 if(created&&clients.length){try{await clients.at(-1).query(`DROP SCHEMA ${schema} CASCADE`);out.schemaDropped=true;}catch(e){out.cleanupError=e.message;process.exitCode=1;}}
 for(const c of clients){try{await c.end();}catch{}}
 await writeFile(new URL('./native-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify({status:out.status,schemaDropped:out.schemaDropped,connectionsClosed:clients.length}));
}
