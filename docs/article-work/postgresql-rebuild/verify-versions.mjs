// Isolated PostgreSQL server required. Default socket belongs to this authoring run.
import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const config={host:process.env.PG_LAB_SOCKET||'/private/tmp/staycurrent-pg-rebuild/socket',port:Number(process.env.PG_LAB_PORT||55438),user:process.env.PG_LAB_USER||'ryannel',database:'postgres'};
const admin=new pg.Client(config);await admin.connect();
if(!(await admin.query("SELECT 1 FROM pg_database WHERE datname='pg_versions_lab'")).rowCount)await admin.query('CREATE DATABASE pg_versions_lab');await admin.end();
const clients=await Promise.all(['version_report','version_writer','version_observer'].map(async application_name=>{const c=new pg.Client({...config,database:'pg_versions_lab',application_name});await c.connect();return c;}));
const [a,b,c]=clients;const trace=[];
async function record(label,client,sql){const r=await client.query(sql);const value=Array.isArray(r)?r.map(x=>({command:x.command,rows:x.rows})):r.rows;trace.push({label,sql,result:value});return r;}
const heap=`SELECT lp,lp_flags,t_xmin::text,t_xmax::text,t_ctid::text,
(heap_tuple_infomask_flags(t_infomask,t_infomask2)).raw_flags AS flags
FROM heap_page_items(get_raw_page('version_demo',0)) ORDER BY lp;`;
try {
 await record('runtime',c,'SELECT version();');
 await c.query('CREATE EXTENSION IF NOT EXISTS pageinspect; CREATE EXTENSION IF NOT EXISTS pg_visibility; DROP TABLE IF EXISTS version_demo; CREATE TABLE version_demo (product_id integer PRIMARY KEY, available integer NOT NULL) WITH (fillfactor=70,autovacuum_enabled=false); INSERT INTO version_demo VALUES (1,3);');
 await record('initial_heap',c,heap);
 await b.query('BEGIN');const tx=(await record('writer_id',b,'SELECT pg_current_xact_id()::text AS xid')).rows[0].xid;
 await record('uncommitted_update',b,'UPDATE version_demo SET available=1 WHERE product_id=1 RETURNING product_id,available,ctid::text,xmin::text');
 await record('later_allocated_transaction',c,'SELECT pg_current_xact_id()::text AS xid');
 await a.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
 assert.equal((await record('old_reader_before_commit',a,'SELECT available FROM version_demo WHERE product_id=1')).rows[0].available,3);
 const snap=(await record('snapshot',a,'SELECT pg_current_snapshot()::text AS snapshot')).rows[0].snapshot;
 await record('snapshot_members',a,'SELECT pg_snapshot_xmin(pg_current_snapshot())::text AS lower_bound,pg_snapshot_xmax(pg_current_snapshot())::text AS upper_bound,ARRAY(SELECT pg_snapshot_xip(pg_current_snapshot())::text) AS active');
 await b.query('COMMIT');
 assert.equal((await record('old_reader_after_commit',a,'SELECT available FROM version_demo WHERE product_id=1')).rows[0].available,3);
 assert.equal((await record('new_reader_after_commit',c,'SELECT available FROM version_demo WHERE product_id=1')).rows[0].available,1);
 trace.push({label:'snapshot_membership_after_commit',result:(await c.query('SELECT pg_visible_in_snapshot($1::xid8,$2::pg_snapshot) AS visible_to_old_snapshot',[tx,snap])).rows});
 await record('heap_after_update',c,heap);
 await record('index_root_before_cleanup',c,"SELECT itemoffset,ctid::text FROM bt_page_items('version_demo_pkey',1)");
 await record('retained_snapshot',c,"SELECT application_name, state, backend_xmin::text, wait_event_type,wait_event FROM pg_stat_activity WHERE application_name='version_report'");
 const notices=[];c.on('notice',n=>notices.push(n.message));
 await record('vacuum_with_reader',c,'VACUUM (VERBOSE) version_demo');trace.push({label:'vacuum_with_reader_notices',notices:[...notices]});notices.length=0;
 const retained=await record('heap_with_reader',c,heap);assert.equal(retained.rows.filter(r=>r.lp_flags===1).length,2);
 await record('map_with_reader',c,"SELECT * FROM pg_visibility_map('version_demo')");
 await a.query('COMMIT');await record('vacuum_without_reader',c,'VACUUM (VERBOSE) version_demo');trace.push({label:'vacuum_without_reader_notices',notices:[...notices]});
 const cleaned=await record('heap_without_reader',c,heap);assert.equal(cleaned.rows.filter(r=>r.lp_flags===1).length,1);
 await record('index_root_after_cleanup',c,"SELECT itemoffset,ctid::text FROM bt_page_items('version_demo_pkey',1)");
 await record('map_without_reader',c,"SELECT * FROM pg_visibility_map('version_demo')");
 await record('freeze',c,'VACUUM (FREEZE) version_demo');await record('frozen_heap',c,heap);await record('frozen_map',c,"SELECT * FROM pg_visibility_map('version_demo')");
 // Covering-index contrast: same page room, but included value prevents HOT.
 await c.query('DROP TABLE IF EXISTS version_cover; CREATE TABLE version_cover (product_id integer PRIMARY KEY, available integer NOT NULL) WITH(fillfactor=70,autovacuum_enabled=false); INSERT INTO version_cover VALUES(1,3); CREATE INDEX version_cover_available ON version_cover(product_id) INCLUDE(available);');
 await record('covered_update',c,'UPDATE version_cover SET available=1 WHERE product_id=1 RETURNING ctid::text,xmin::text');
 await record('covered_heap',c,heap.replace("'version_demo'","'version_cover'"));
 const cover=await record('covered_index',c,"SELECT itemoffset,ctid::text FROM bt_page_items('version_cover_available',1)");assert.equal(cover.rows.length,2);
 // Locking sets xmax metadata without removing the row.
 await b.query('BEGIN');await b.query('SELECT * FROM version_cover WHERE product_id=1 FOR KEY SHARE');
 await record('locked_visible_row',c,'SELECT product_id,available,xmin::text,xmax::text FROM version_cover');
 await record('locked_tuple_flags',c,heap.replace("'version_demo'","'version_cover'"));await b.query('ROLLBACK');
 // Repeatable Read and Serializable distinguish stable snapshots from invariants.
 await c.query('DROP TABLE IF EXISTS version_duty; CREATE TABLE version_duty (doctor text PRIMARY KEY,on_call boolean NOT NULL); INSERT INTO version_duty VALUES (\'Ada\',true),(\'Bo\',true)');
 for(const isolation of ['REPEATABLE READ','SERIALIZABLE']){
  await c.query('UPDATE version_duty SET on_call=true');await a.query('BEGIN ISOLATION LEVEL '+isolation);await b.query('BEGIN ISOLATION LEVEL '+isolation);
  await a.query('SELECT count(*) FROM version_duty WHERE on_call');await b.query('SELECT count(*) FROM version_duty WHERE on_call');
  await a.query("UPDATE version_duty SET on_call=false WHERE doctor='Ada'");await b.query("UPDATE version_duty SET on_call=false WHERE doctor='Bo'");await a.query('COMMIT');
  let code=null;try{await b.query('COMMIT');}catch(e){code=e.code;await b.query('ROLLBACK');}
  const left=(await c.query('SELECT count(*)::int AS remaining FROM version_duty WHERE on_call')).rows[0].remaining;
  assert.equal(left,isolation==='SERIALIZABLE'?1:0);trace.push({label:'write_skew_'+isolation,serializationFailure:code,remaining:left});
 }
 await writeFile('docs/article-work/postgresql-rebuild/versions-observed.json',JSON.stringify(trace,null,2));console.log('Snapshot, HOT, retained vacuum, visibility map, freezing, row-lock metadata and isolation contrasts passed.');
} finally {for(const client of clients){await client.query('ROLLBACK').catch(()=>{});await client.end();}}
