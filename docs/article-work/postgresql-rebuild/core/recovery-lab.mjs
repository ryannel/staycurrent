import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import {execFileSync} from 'node:child_process';import {mkdtempSync,mkdirSync,appendFileSync,readFileSync,writeFileSync,rmSync} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
// This script owns a new disposable cluster. It never addresses the shared authoring server.
const root=mkdtempSync('/private/tmp/staycurrent-core-crash-'),data=root+'/data',socket=root+'/socket',log=root+'/server.log',bin='/opt/homebrew/opt/postgresql@18/bin/';mkdirSync(socket);
const run=(name,args)=>execFileSync(bin+name,args,{encoding:'utf8'});let running=false;const clients=[];const out={};
const connect=async()=>{const c=new pg.Client({host:socket,port:55449,user:process.env.USER,database:'postgres'});c.on('error',()=>{});await c.connect();clients.push(c);return c;};
const hash=b=>createHash('sha256').update(b).digest('hex');
try{
run('initdb',['-D',data,'-A','trust','--no-locale']);appendFileSync(data+'/postgresql.conf',`\nlisten_addresses=''\nunix_socket_directories='${socket}'\nport=55449\nshared_buffers='16MB'\ncheckpoint_timeout='1h'\nautovacuum=off\nfsync=on\nsynchronous_commit=on\nfull_page_writes=on\n`);
run('pg_ctl',['-D',data,'-l',log,'-w','start']);running=true;
let c=await connect();await c.query('CREATE EXTENSION pageinspect;CREATE TABLE crash_stock(id integer PRIMARY KEY,available integer NOT NULL);INSERT INTO crash_stock VALUES(1,3),(2,3);CREATE TABLE crash_marker(n integer);INSERT INTO crash_marker VALUES(0);CHECKPOINT;');
const path=(await c.query("SELECT pg_relation_filepath('crash_stock') AS path")).rows[0].path;out.storedBefore=hash(readFileSync(data+'/'+path));
await c.query('BEGIN');out.update=(await c.query('EXPLAIN(ANALYZE,WAL,BUFFERS,FORMAT JSON) UPDATE crash_stock SET available=1 WHERE id=1')).rows[0]['QUERY PLAN'][0];out.positionsBeforeCommit=(await c.query('SELECT pg_current_wal_insert_lsn() AS inserted,pg_current_wal_lsn() AS written,pg_current_wal_flush_lsn() AS flushed')).rows[0];await c.query('COMMIT');
out.positionsAfterCommit=(await c.query('SELECT pg_current_wal_insert_lsn() AS inserted,pg_current_wal_lsn() AS written,pg_current_wal_flush_lsn() AS flushed')).rows[0];out.bufferHeader=(await c.query("SELECT lsn FROM page_header(get_raw_page('crash_stock',0))")).rows[0];out.storedAfterCommit=hash(readFileSync(data+'/'+path));out.sameStoredFile=out.storedBefore===out.storedAfterCommit;assert(out.sameStoredFile);
await c.query('BEGIN');await c.query('UPDATE crash_stock SET available=0 WHERE id=2');out.beforeCrash=(await c.query('SELECT * FROM crash_stock ORDER BY id')).rows;
const pendingEnd=(await c.query('SELECT pg_current_wal_insert_lsn() AS lsn')).rows[0].lsn;const other=await connect();await other.query('UPDATE crash_marker SET n=n+1');out.pendingWalDurable=(await other.query('SELECT pg_wal_lsn_diff(pg_current_wal_flush_lsn(),$1::pg_lsn)>=0 AS covered',[pendingEnd])).rows[0].covered;assert(out.pendingWalDurable);out.sameStoredBeforeCrash=hash(readFileSync(data+'/'+path))===out.storedBefore;assert(out.sameStoredBeforeCrash);
// Immediate shutdown deliberately omits a clean shutdown checkpoint in this disposable cluster.
run('pg_ctl',['-D',data,'-m','immediate','-w','stop']);running=false;await c.end().catch(()=>{});
run('pg_ctl',['-D',data,'-l',log,'-w','start']);running=true;c=await connect();out.afterRecovery=(await c.query('SELECT * FROM crash_stock ORDER BY id')).rows;assert.deepEqual(out.afterRecovery,[{id:1,available:1},{id:2,available:3}]);
out.recoveryLog=readFileSync(log,'utf8').split('\n').filter(l=>/interrupted|redo|recovery|shutdown request/.test(l));assert(out.recoveryLog.some(l=>l.includes('redo starts')));
writeFileSync(new URL('recovery-observed.json',import.meta.url),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
}finally{for(const c of clients)await c.end().catch(()=>{});if(running)run('pg_ctl',['-D',data,'-m','fast','-w','stop']);rmSync(root,{recursive:true,force:true});}
