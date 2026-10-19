#!/usr/bin/env python3
"""Bounded index lifecycle supplement. Does not import or rewrite the earlier lab.
Run: python3 rl119-lifecycle.py
PostgreSQL18.6 at /opt/homebrew/bin; Python3 standard library; port56919.
Outputs rl119-lifecycle-observed.json. Stops owned server on failure; removes its
unique temporary directory only on success. No default-service commands.
"""
import subprocess as sp, pathlib, tempfile, time, json, shutil
B=pathlib.Path('/opt/homebrew/bin');HERE=pathlib.Path(__file__).resolve().parent
ROOT=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-rl119-lifecycle-',dir='/private/tmp'))
DATA=ROOT/'data';SOCKET=ROOT/'socket';SOCKET.mkdir();LOG=ROOT/'server.log';PORT=56919
D={'version':sp.check_output([str(B/'postgres'),'--version'],text=True).strip(),'root':str(ROOT),'events':[]}
assert '18.6' in D['version']
def command(args,sql=None,expected_error=False,timeout=60):
 p=sp.run([str(a) for a in args],input=sql,text=True,capture_output=True,timeout=timeout)
 D['events'].append({'command':[str(a) for a in args],'sql':sql,'rc':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
 if expected_error:assert p.returncode!=0,('Expected rejection',args,sql)
 elif p.returncode:raise RuntimeError(p.stdout+p.stderr)
 return p.stdout.strip()
def args():return [B/'psql','-X','-At','-h',SOCKET,'-p',PORT,'-U','lab','-d','postgres','-v','ON_ERROR_STOP=1']
def q(sql,error=False):return command(args(),sql,error)
def rows(sql):return json.loads(q('SELECT coalesce(json_agg(t),\'[]\'::json) FROM ('+sql+')t;'))
def scalar(sql):return q(sql)
def asyncq(sql,tag):
 p=sp.Popen([str(a) for a in args()],stdin=sp.PIPE,stdout=sp.PIPE,stderr=sp.PIPE,text=True)
 p.stdin.write(sql);p.stdin.close();D['events'].append({'async_tag':tag,'sql':sql});return p
def finish(p,tag):
 p.wait(timeout=20);out=p.stdout.read();err=p.stderr.read();D['events'].append({'async_result':tag,'rc':p.returncode,'stdout':out,'stderr':err});assert p.returncode==0,(tag,out,err)
def until(sql,target,timeout=10):
 end=time.monotonic()+timeout
 while time.monotonic()<end:
  if scalar(sql)==target:return
  time.sleep(.05)
 raise RuntimeError('Wait failed: '+sql)
def physical(index):return rows(f"SELECT '{index}' AS index_name,pg_relation_size('{index}') AS relation_bytes,* FROM pgstatindex('{index}')")[0]
def plan(sql):return json.loads(q('EXPLAIN(ANALYZE,BUFFERS,FORMAT JSON) '+sql))[0]
def activity():return rows("SELECT a.application_name,a.state,a.wait_event_type,a.wait_event,p.phase,p.index_relid::regclass::text,pg_blocking_pids(a.pid) AS blockers FROM pg_stat_activity a LEFT JOIN pg_stat_progress_create_index p USING(pid) WHERE a.application_name LIKE 'lifecycle-%' ORDER BY a.application_name")
def workload(tag,loops=100):
 text=f"SET application_name='{tag}';\n"
 for i in range(loops):
  text+=f"UPDATE lifecycle_orders SET note='changed-{tag}-{i}' WHERE tenant='t4' AND id=81; INSERT INTO caller_marks VALUES('{tag}',{i}); SELECT count(*) FROM lifecycle_orders WHERE tenant='t4' AND customer=42; SELECT pg_sleep(0.015);\n"
 return text
def with_callers(sql,tag):
 old=asyncq("SET application_name='lifecycle-old-reader'; BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT price FROM lifecycle_orders WHERE tenant='t4' AND id=81; SELECT pg_sleep(3); COMMIT;",tag+'-old-reader')
 until("SELECT count(*) FROM pg_stat_activity WHERE application_name='lifecycle-old-reader' AND wait_event='PgSleep'",'1')
 caller=asyncq(workload('lifecycle-'+tag),tag+'-caller')
 op=asyncq("SET application_name='lifecycle-"+tag+"-operation'; SET maintenance_work_mem='1MB'; SET max_parallel_maintenance_workers=0; SET statement_timeout='15s'; "+sql,tag+'-operation')
 samples=[]
 while op.poll() is None:
  samples.append({'activity':activity(),'committed_caller_marks':int(scalar(f"SELECT count(*) FROM caller_marks WHERE client='lifecycle-{tag}'"))})
  time.sleep(.1)
 finish(op,tag+'-operation');finish(caller,tag+'-caller');finish(old,tag+'-old-reader')
 D[tag+'_overlap']=samples
 assert any(x['committed_caller_marks']>0 and any(a['application_name']=='lifecycle-'+tag+'-operation' for a in x['activity']) for x in samples),'No observed caller progress while operation active'

ok=False
try:
 command([B/'initdb','-D',DATA,'-U','lab','-A','trust','--no-locale','--encoding=UTF8'])
 with (DATA/'postgresql.conf').open('a') as f:f.write(f"\nport={PORT}\nunix_socket_directories='{SOCKET}'\nlisten_addresses=''\nshared_buffers='32MB'\nmax_connections=16\nmax_wal_size='512MB'\ncheckpoint_timeout='30min'\nlog_temp_files=0\nlog_line_prefix='%m [%p] '\n")
 command([B/'pg_ctl','-D',DATA,'-l',LOG,'-w','start'])
 q("""CREATE EXTENSION pgstattuple; CREATE EXTENSION amcheck;
CREATE TABLE lifecycle_customers(tenant text,customer int,PRIMARY KEY(tenant,customer));
INSERT INTO lifecycle_customers SELECT 't4',n FROM generate_series(0,1008)n;
INSERT INTO lifecycle_customers VALUES('t5',42);
CREATE TABLE lifecycle_orders(tenant text NOT NULL,id bigint NOT NULL,request_id text NOT NULL,customer int NOT NULL,placed_at timestamp NOT NULL,price numeric(10,2) NOT NULL,status text NOT NULL,note text NOT NULL,PRIMARY KEY(tenant,id),UNIQUE(tenant,request_id),FOREIGN KEY(tenant,customer) REFERENCES lifecycle_customers) WITH(autovacuum_enabled=false);
INSERT INTO lifecycle_orders
SELECT 't4',n,'r'||n,CASE WHEN n=81 THEN 42 ELSE (n*7919)%1009 END,timestamp '2026-01-01'+n*interval '1 second',CASE WHEN n=81 THEN 20 ELSE 20+(n%100)/100.0 END,'paid',repeat(md5(n::text),3) FROM generate_series(1,250000)n;
INSERT INTO lifecycle_orders VALUES('t5',81,'r81',42,timestamp '2026-01-01',90,'paid','other tenant');
CREATE INDEX lifecycle_history ON lifecycle_orders(tenant,customer,placed_at DESC,id DESC) INCLUDE(price);
CREATE INDEX lifecycle_customer ON lifecycle_orders(tenant,customer);
CREATE INDEX lifecycle_unused_note ON lifecycle_orders(note text_pattern_ops);
CREATE TABLE caller_marks(client text,n int,PRIMARY KEY(client,n));
ANALYZE lifecycle_orders; VACUUM lifecycle_orders;
CREATE TABLE retention(id bigint PRIMARY KEY,note text) WITH(autovacuum_enabled=false);
INSERT INTO retention SELECT n,repeat('x',30) FROM generate_series(1,250000)n;
""")
 D['history_initial']=physical('lifecycle_history');D['retention_initial']=physical('retention_pkey')
 q("DELETE FROM lifecycle_orders WHERE tenant='t4' AND id%10<>0 AND id<>81; VACUUM(ANALYZE) lifecycle_orders;")
 D['survivors']=rows("SELECT tenant,count(*) AS rows,sum(price) AS total FROM lifecycle_orders GROUP BY tenant ORDER BY tenant")
 D['history_sparse']=physical('lifecycle_history')
 q("""CREATE TABLE lifecycle_baseline(LIKE lifecycle_orders INCLUDING DEFAULTS);
INSERT INTO lifecycle_baseline SELECT * FROM lifecycle_orders;
CREATE INDEX lifecycle_baseline_history ON lifecycle_baseline(tenant,customer,placed_at DESC,id DESC) INCLUDE(price);
VACUUM(ANALYZE) lifecycle_baseline;
DELETE FROM retention WHERE id<=225000; VACUUM retention;
""")
 D['history_baseline']=physical('lifecycle_baseline_history');D['retention_empty_pages']=physical('retention_pkey')
 # Allocate and finish another XID, then let vacuum publish pages safe for reuse.
 q("SELECT pg_current_xact_id();");q("VACUUM retention;")
 q("INSERT INTO retention SELECT n,repeat('y',30) FROM generate_series(250001,475000)n;")
 D['retention_refilled']=physical('retention_pkey')
 assert D['retention_refilled']['relation_bytes'] <= D['retention_initial']['relation_bytes']*1.1
 request="SELECT id,placed_at,price,status FROM lifecycle_orders WHERE tenant='t4' AND customer=42 ORDER BY placed_at DESC,id DESC LIMIT 10"
 scan="SELECT sum(price) FROM lifecycle_orders WHERE tenant='t4' AND customer BETWEEN 40 AND 49"
 D['request_before']=rows(request);D['scan_before']=plan(scan);D['scan_result_before']=rows(scan)
 q("CHECKPOINT;");wal_before=scalar("SELECT pg_current_wal_insert_lsn();")
 with_callers("REINDEX INDEX CONCURRENTLY lifecycle_history;",'reindex')
 D['reindex_interval_wal_bytes']=int(scalar(f"SELECT pg_wal_lsn_diff(pg_current_wal_insert_lsn(),'{wal_before}'::pg_lsn)::bigint;"))
 D['history_rebuilt']=physical('lifecycle_history');D['scan_rebuilt']=plan(scan);D['request_rebuilt']=rows(request);D['scan_result_rebuilt']=rows(scan)
 q("VACUUM lifecycle_orders;")
 D['scan_rebuilt_vacuumed']=plan(scan)
 assert D['scan_result_before']==D['scan_result_rebuilt']
 assert D['request_before']==D['request_rebuilt']
 assert D['history_rebuilt']['relation_bytes'] < D['history_sparse']['relation_bytes']/2
 D['validity_after_reindex']=rows("SELECT c.relname,i.indisvalid,i.indisready FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid WHERE i.indrelid='lifecycle_orders'::regclass ORDER BY c.relname")
 q("SELECT bt_index_check('lifecycle_history',heapallindexed=>true);")
 # A timed-out rebuild must leave the original authority intact and its failed copy removable.
 old=asyncq("SET application_name='lifecycle-failure-reader'; BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT price FROM lifecycle_orders WHERE tenant='t4' AND id=81; SELECT pg_sleep(3); COMMIT;",'failed-reindex-old-reader')
 until("SELECT count(*) FROM pg_stat_activity WHERE application_name='lifecycle-failure-reader' AND wait_event='PgSleep'",'1')
 q("SET statement_timeout='700ms'; REINDEX INDEX CONCURRENTLY lifecycle_history;",True)
 D['failed_reindex_catalogue']=rows("SELECT c.relname,i.indisvalid,i.indisready FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid WHERE c.relname LIKE 'lifecycle_history%' ORDER BY c.relname")
 assert any(x['relname']=='lifecycle_history' and x['indisvalid'] for x in D['failed_reindex_catalogue'])
 leftovers=[x['relname'] for x in D['failed_reindex_catalogue'] if not x['indisvalid']]
 assert leftovers and all(x.startswith('lifecycle_history_ccnew') for x in leftovers)
 finish(old,'failed-reindex-old-reader')
 for name in leftovers:q('DROP INDEX CONCURRENTLY "'+name.replace('"','""')+'";')
 D['failed_reindex_cleanup']=rows("SELECT c.relname,i.indisvalid,i.indisready FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid WHERE c.relname LIKE 'lifecycle_history%' ORDER BY c.relname")
 q("BEGIN; REINDEX INDEX CONCURRENTLY lifecycle_history;",True)
 # A separately built, wider candidate supports the new returned status column.
 q("CREATE INDEX CONCURRENTLY lifecycle_replacement ON lifecycle_orders(tenant,customer,placed_at DESC,id DESC) INCLUDE(price,status);")
 q("VACUUM(ANALYZE) lifecycle_orders; SELECT pg_stat_reset();")
 D['usage_interval_start']=rows("SELECT clock_timestamp() AS sampled_at,stats_reset FROM pg_stat_database WHERE datname=current_database()")
 for _ in range(5):
  D.setdefault('representative_requests',[]).append(rows(request))
 D['request_replacement_plan']=plan(request)
 # Reader backend statistics are flushed as each psql process exits. Poll for the known scans.
 until("SELECT (idx_scan>=5)::text FROM pg_stat_user_indexes WHERE indexrelname='lifecycle_replacement'",'true')
 D['usage_before_drop']=rows("SELECT indexrelname,idx_scan,last_idx_scan,pg_relation_size(indexrelid) AS bytes FROM pg_stat_user_indexes WHERE relname='lifecycle_orders' ORDER BY indexrelname")
 D['catalogue_before_drop']=rows("SELECT c.relname,i.indisunique,i.indisprimary,i.indisvalid,i.indisready,i.indnkeyatts,i.indnatts,i.indkey::text,i.indclass::text,i.indcollation::text,i.indoption::text,pg_get_expr(i.indpred,i.indrelid) AS predicate,pg_get_indexdef(i.indexrelid) AS definition,con.conname,con.contype FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid LEFT JOIN pg_constraint con ON con.conindid=i.indexrelid WHERE i.indrelid='lifecycle_orders'::regclass ORDER BY c.relname")
 D['foreign_keys']=rows("SELECT conname,conrelid::regclass::text AS child,confrelid::regclass::text AS parent,pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype='f' AND (conrelid='lifecycle_orders'::regclass OR confrelid='lifecycle_orders'::regclass)")
 q("DROP INDEX CONCURRENTLY lifecycle_orders_pkey;",True)
 assert next(x for x in D['usage_before_drop'] if x['indexrelname']=='lifecycle_unused_note')['idx_scan']==0
 with_callers("DROP INDEX CONCURRENTLY lifecycle_unused_note;",'drop')
 q("DROP INDEX CONCURRENTLY lifecycle_customer;")
 D['request_after_drop']=rows(request);D['request_after_drop_plan']=plan(request)
 assert D['request_before']==D['request_after_drop']
 D['foreign_key_lookup_plan']=plan("SELECT 1 FROM lifecycle_orders WHERE tenant='t4' AND customer=42 LIMIT 1")
 q("DELETE FROM lifecycle_customers WHERE tenant='t4' AND customer=42;",True)
 q("INSERT INTO lifecycle_orders VALUES('t4',999999,'r81',42,timestamp '2026-01-01',20,'paid','duplicate request');",True)
 q("INSERT INTO lifecycle_orders VALUES('t4',81,'different-request',42,timestamp '2026-01-01',20,'paid','duplicate order');",True)
 D['acceptance']=rows("SELECT tenant,id,request_id,customer,price,status FROM lifecycle_orders WHERE id=81 ORDER BY tenant")
 D['remaining_indexes']=rows("SELECT indexname,indexdef FROM pg_indexes WHERE tablename='lifecycle_orders' ORDER BY indexname")
 D['usage_interval_end']=rows("SELECT clock_timestamp() AS sampled_at,stats_reset FROM pg_stat_database WHERE datname=current_database()")
 assert D['usage_interval_start'][0]['stats_reset']==D['usage_interval_end'][0]['stats_reset']
 assert len(D['acceptance'])==2 and D['acceptance'][0]['price']==20 and D['acceptance'][1]['price']==90
 ok=True
finally:
 if (DATA/'postmaster.pid').exists():
  # Stop only the data directory created by this run.
  try:command([B/'pg_ctl','-D',DATA,'-m','fast','-w','stop'])
  except Exception as err:
   D['shutdown_error']=str(err);ok=False
 D['success']=ok;D['server_log']=LOG.read_text() if LOG.exists() else ''
 (HERE/'rl119-lifecycle-observed.json').write_text(json.dumps(D,indent=2))
 if ok:shutil.rmtree(ROOT)
 print(json.dumps({'success':ok,'observed':'rl119-lifecycle-observed.json','root':str(ROOT),'cleaned':ok}))
