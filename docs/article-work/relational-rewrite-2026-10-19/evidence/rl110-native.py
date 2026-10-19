#!/usr/bin/env python3
"""Disposable PostgreSQL 18.6 lab. Runs no default-service commands.
Run: python3 rl110-native.py [core|recovery|replication|migration|all]
Requires /opt/homebrew/bin PostgreSQL18.6, Python3 standard library.
Stops every owned server in finally. Removes temporary data only after success.
Keeps stdout/SQL/stderr/version in rl110-native-observed.json beside this file.
"""
import subprocess as sp, tempfile, pathlib, json, time, os, sys, shutil, hashlib
B=pathlib.Path('/opt/homebrew/bin'); HERE=pathlib.Path(__file__).resolve().parent
ROOT=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-rl110-',dir='/private/tmp'))
OUT={"root":str(ROOT),"version":sp.check_output([str(B/'postgres'),'--version'],text=True).strip(),"mode":sys.argv[1] if len(sys.argv)>1 else 'all',"events":[]}
assert '18.6' in OUT['version'],OUT['version']
SERVERS=[]
def run(args,check=True,timeout=60,input=None):
 p=sp.run([str(a) for a in args],input=input,text=True,capture_output=True,timeout=timeout)
 OUT['events'].append({'command':[str(a) for a in args],'sql':input,'rc':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
 if check and p.returncode: raise RuntimeError(str(args)+'\n'+p.stdout+p.stderr)
 return p
class Server:
 def __init__(self,name,port,initialize=True):
  self.name=name; self.port=port; self.data=ROOT/name; self.socket=ROOT/(name+'-socket'); self.socket.mkdir(); self.log=ROOT/(name+'.log'); SERVERS.append(self)
  if initialize: run([B/'initdb','-D',self.data,'-U','lab','-A','trust','--no-locale','--encoding=UTF8'])
 def config(self,extra=''):
  with (self.data/'postgresql.conf').open('a') as f: f.write(f"\nport={self.port}\nunix_socket_directories='{self.socket}'\nlisten_addresses='127.0.0.1'\nshared_buffers='32MB'\nmax_connections=20\nmax_wal_senders=10\nmax_replication_slots=10\nwal_level=logical\nlogging_collector=off\nlog_line_prefix='%m [%p] '\nlog_checkpoints=on\n"+extra+'\n')
 def start(self): return run([B/'pg_ctl','-D',self.data,'-l',self.log,'-w','start'])
 def stop(self,mode='fast'): return run([B/'pg_ctl','-D',self.data,'-m',mode,'-w','stop'],False)
 def args(self,user='lab',db='postgres'): return [B/'psql','-X','-h',self.socket,'-p',self.port,'-U',user,'-d',db,'-v','ON_ERROR_STOP=1','-At']
 def q(self,sql,check=True,user='lab',db='postgres'):
  p=run(self.args(user,db),check,input=sql)
  if not check: assert p.returncode != 0, 'Expected rejection unexpectedly succeeded: '+sql
  return p.stdout.strip()
 def asyncq(self,sql,tag):
  p=sp.Popen([str(a) for a in self.args()],stdin=sp.PIPE,stdout=sp.PIPE,stderr=sp.PIPE,text=True)
  p.stdin.write(sql);p.stdin.close(); OUT['events'].append({'async_sql':sql,'tag':tag,'server':self.name});return p
 def result(self,p,tag,expect=0):
  p.wait(timeout=30); out=p.stdout.read();err=p.stderr.read(); OUT['events'].append({'async_result':tag,'rc':p.returncode,'stdout':out,'stderr':err});assert p.returncode==expect,(out,err);return out
 def until(self,sql,wanted,timeout=20):
  end=time.time()+timeout
  while time.time()<end:
   v=self.q(sql)
   if v==wanted:return v
   time.sleep(.1)
  raise RuntimeError(f'Poll timed out: {sql}: {v} != {wanted}')
def core(s):
 s.q("""CREATE EXTENSION pageinspect; CREATE EXTENSION pgstattuple; CREATE EXTENSION pg_visibility;
CREATE SCHEMA workshop;
CREATE TABLE workshop.customers(tenant_id text,customer_id int,name text,PRIMARY KEY(tenant_id,customer_id));
INSERT INTO workshop.customers VALUES('t4',42,'Mina'),('t5',42,'Leon');
CREATE TABLE workshop.sessions(tenant_id text,session_id text,capacity int CHECK(capacity>=0),PRIMARY KEY(tenant_id,session_id));
INSERT INTO workshop.sessions VALUES('t4','s7',2);
CREATE TABLE workshop.orders(tenant_id text,order_id text,request_id text,customer_id int,session_id text,agreed_price numeric(10,2),status text,note text,PRIMARY KEY(tenant_id,order_id),UNIQUE(tenant_id,request_id),FOREIGN KEY(tenant_id,customer_id) REFERENCES workshop.customers,FOREIGN KEY(tenant_id,session_id) REFERENCES workshop.sessions) WITH(fillfactor=70,autovacuum_enabled=false);
INSERT INTO workshop.orders VALUES('t4','o81','r81',42,'s7',20,'paid','original');
SELECT pg_backend_pid(),current_user,current_database(),version();
SELECT ctid,xmin,xmax,* FROM workshop.orders; SELECT itemoffset,ctid FROM bt_page_items('workshop.orders_pkey',1);
SELECT lp,t_xmin,t_xmax,t_ctid,heap_tuple_infomask_flags(t_infomask,t_infomask2) FROM heap_page_items(get_raw_page('workshop.orders',0));""")
 reader=s.asyncq("SET application_name='old-reader'; BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT note FROM workshop.orders; SELECT pg_sleep(2); SELECT note FROM workshop.orders; COMMIT;",'old-snapshot')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='old-reader' AND wait_event='PgSleep'",'1')
 s.q("UPDATE workshop.orders SET note='amended' WHERE tenant_id='t4' AND order_id='o81'; SELECT ctid,agreed_price FROM workshop.orders; SELECT itemoffset,ctid FROM bt_page_items('workshop.orders_pkey',1); SELECT lp,t_xmin,t_xmax,t_ctid,heap_tuple_infomask_flags(t_infomask,t_infomask2) FROM heap_page_items(get_raw_page('workshop.orders',0));")
 s.q("CREATE INDEX orders_note ON workshop.orders(note); UPDATE workshop.orders SET note='indexed' WHERE tenant_id='t4' AND order_id='o81'; SELECT itemoffset,ctid FROM bt_page_items('workshop.orders_pkey',1); SELECT lp,t_xmin,t_xmax,t_ctid,heap_tuple_infomask_flags(t_infomask,t_infomask2) FROM heap_page_items(get_raw_page('workshop.orders',0));")
 s.result(reader,'old-snapshot')
 s.q("CREATE TABLE vacuum_lab(id int PRIMARY KEY,note text) WITH(autovacuum_enabled=false); INSERT INTO vacuum_lab SELECT n,repeat('x',180) FROM generate_series(1,10000)n; VACUUM vacuum_lab;")
 hold=s.asyncq("SET application_name='vacuum-horizon'; BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT count(*) FROM vacuum_lab; SELECT pg_sleep(3); SELECT count(*) FROM vacuum_lab; COMMIT;",'vacuum-horizon')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='vacuum-horizon' AND wait_event='PgSleep'",'1')
 s.q("DELETE FROM vacuum_lab WHERE id%2=0; VACUUM (VERBOSE) vacuum_lab; SELECT tuple_count,dead_tuple_count,free_space FROM pgstattuple('vacuum_lab'); SELECT application_name,backend_xmin,age(backend_xmin) FROM pg_stat_activity WHERE application_name='vacuum-horizon'; SELECT relname,age(relfrozenxid),mxid_age(relminmxid) FROM pg_class WHERE oid='vacuum_lab'::regclass;")
 s.result(hold,'vacuum-horizon')
 s.q("VACUUM (VERBOSE) vacuum_lab; SELECT pg_relation_size('vacuum_lab'),tuple_count,dead_tuple_count,free_space FROM pgstattuple('vacuum_lab'); INSERT INTO vacuum_lab SELECT n,repeat('y',180) FROM generate_series(10001,15000)n; SELECT pg_relation_size('vacuum_lab'); VACUUM (FREEZE,VERBOSE) vacuum_lab; SELECT relname,age(relfrozenxid) FROM pg_class WHERE oid='vacuum_lab'::regclass;")
 s.q("DELETE FROM vacuum_lab WHERE id>10000; VACUUM vacuum_lab; SELECT pg_relation_size('vacuum_lab');")
 rewrite_reader=s.asyncq("SET application_name='rewrite-reader'; BEGIN; SELECT count(*) FROM vacuum_lab; SELECT pg_sleep(1); COMMIT;",'rewrite-reader')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='rewrite-reader' AND wait_event='PgSleep'",'1')
 s.q("SET lock_timeout='150ms'; VACUUM FULL vacuum_lab;",False)
 s.result(rewrite_reader,'rewrite-reader')
 s.q("VACUUM FULL vacuum_lab; SELECT pg_relation_size('vacuum_lab'),count(*) FROM vacuum_lab;")
 s.q("""CREATE TABLE access_lab(id int PRIMARY KEY,tenant text,created_at timestamp,tags text[],slot int4range,note text) WITH(autovacuum_enabled=false);
INSERT INTO access_lab SELECT n,CASE WHEN n<=45000 THEN 't4' ELSE 't'||(n%100+5) END,timestamp '2026-01-01'+n*interval '1 second',ARRAY['web',CASE WHEN n%100=0 THEN 'audit' ELSE 'ordinary' END,CASE WHEN n%250=0 THEN 'urgent' ELSE 'routine' END],int4range(n,n+2,'[)'),repeat(md5(n::text),5) FROM generate_series(1,50000)n;
CREATE INDEX access_tenant ON access_lab(tenant); CREATE INDEX access_cover ON access_lab(tenant,id) INCLUDE(created_at);
CREATE INDEX access_tags ON access_lab USING gin(tags);
CREATE INDEX access_slot ON access_lab USING gist(slot);
CREATE INDEX access_time ON access_lab USING brin(created_at) WITH(pages_per_range=4);
CREATE TABLE scattered AS SELECT * FROM access_lab ORDER BY (id*7919)%50000;
CREATE INDEX scattered_time ON scattered USING brin(created_at) WITH(pages_per_range=4);
ANALYZE access_lab; ANALYZE scattered; SET max_parallel_workers_per_gather=0;
EXPLAIN (ANALYZE,BUFFERS) SELECT id FROM access_lab WHERE tags @> ARRAY['audit','urgent'];
EXPLAIN (ANALYZE,BUFFERS) SELECT id FROM access_lab WHERE slot && int4range(700,705,'[)');
EXPLAIN (ANALYZE,BUFFERS) SELECT count(*) FROM access_lab WHERE created_at>=timestamp '2026-01-01 00:30' AND created_at<timestamp '2026-01-01 00:31';
EXPLAIN (ANALYZE,BUFFERS) SELECT count(*) FROM scattered WHERE created_at>=timestamp '2026-01-01 00:30' AND created_at<timestamp '2026-01-01 00:31';
VACUUM access_lab;
EXPLAIN (ANALYZE,BUFFERS) SELECT id,created_at FROM access_lab WHERE tenant='t5' ORDER BY id LIMIT 10;
UPDATE access_lab SET note='changed' WHERE id=45100;
EXPLAIN (ANALYZE,BUFFERS) SELECT id,created_at FROM access_lab WHERE tenant='t5' ORDER BY id LIMIT 10;
""")
 s.q("""SET max_parallel_workers_per_gather=0; PREPARE tenant_lookup(text) AS SELECT * FROM access_lab WHERE tenant=$1;
SET plan_cache_mode=force_custom_plan; EXPLAIN(ANALYZE,BUFFERS) EXECUTE tenant_lookup('t5'); EXPLAIN(ANALYZE,BUFFERS) EXECUTE tenant_lookup('t4');
SET plan_cache_mode=force_generic_plan; EXPLAIN(ANALYZE,BUFFERS) EXECUTE tenant_lookup('t5'); EXPLAIN(ANALYZE,BUFFERS) EXECUTE tenant_lookup('t4');
CREATE TABLE correlated(tenant text,status text);
INSERT INTO correlated SELECT CASE WHEN n<=9000 THEN 't4' ELSE 't5' END,CASE WHEN n<=9000 THEN 'paid' ELSE 'pending' END FROM generate_series(1,10000)n;
ANALYZE correlated; EXPLAIN(ANALYZE) SELECT * FROM correlated WHERE tenant='t5' AND status='pending';
CREATE STATISTICS tenant_status(mcv,dependencies) ON tenant,status FROM correlated; ANALYZE correlated;
EXPLAIN(ANALYZE) SELECT * FROM correlated WHERE tenant='t5' AND status='pending';
SET work_mem='64kB'; EXPLAIN(ANALYZE,BUFFERS) SELECT * FROM access_lab ORDER BY note;
SET work_mem='32MB'; EXPLAIN(ANALYZE,BUFFERS) SELECT * FROM access_lab ORDER BY note;
""")
 s.q("""SELECT '{"seat":"A1","seat":"B2","n":1.00}'::json, '{"seat":"A1","seat":"B2","n":1.00}'::jsonb;
SELECT ('{"x":null}'::jsonb->'x') IS NULL AS sql_null, '{"x":null}'::jsonb->>'x' IS NULL AS text_null, '{}'::jsonb ? 'x' AS key_exists;
CREATE TABLE payloads(id int PRIMARY KEY,payload jsonb) WITH(autovacuum_enabled=false);
INSERT INTO payloads SELECT n,jsonb_build_object('level',CASE WHEN n%100=0 THEN 'advanced' ELSE 'intro' END,'notes',(SELECT string_agg(md5(g::text||n::text),'') FROM generate_series(1,100)g)) FROM generate_series(1,10000)n;
CREATE INDEX payload_gin ON payloads USING gin(payload jsonb_path_ops); ANALYZE payloads;
EXPLAIN(ANALYZE,BUFFERS) SELECT id FROM payloads WHERE payload @> '{"level":"advanced"}';
EXPLAIN(ANALYZE,BUFFERS) SELECT id FROM payloads WHERE payload->>'level'='advanced';
CREATE INDEX payload_level ON payloads((payload->>'level')); ANALYZE payloads;
EXPLAIN(ANALYZE,BUFFERS) SELECT id FROM payloads WHERE payload->>'level'='advanced';
SELECT pg_column_size(payload),pg_total_relation_size(reltoastrelid) FROM payloads,pg_class WHERE payloads.id=1 AND pg_class.oid='payloads'::regclass;
SELECT pg_current_wal_insert_lsn() AS before_json_update;
UPDATE payloads SET payload=jsonb_set(payload,'{level}','"advanced"') WHERE id=1;
SELECT pg_current_wal_insert_lsn() AS after_json_update;
""")
 s.q("""WITH offer_examples(id,payload) AS(VALUES
 (1,'{"offers":[{"seller":"A","price":12},{"seller":"B","price":18}]}'::jsonb),
 (2,'{"offers":[{"seller":"A","price":18},{"seller":"B","price":12}]}'::jsonb))
 SELECT id,payload @? '$.offers[*] ? (@.seller == "A" && @.price < 15)' AS same_offer,
 (payload @? '$.offers[*] ? (@.seller == "A")') AND (payload @? '$.offers[*] ? (@.price < 15)') AS separate_tests FROM offer_examples;
 ALTER TABLE payloads ADD CONSTRAINT level_type CHECK(payload ? 'level' AND jsonb_typeof(payload->'level')='string');
 """)
 s.q("INSERT INTO payloads VALUES(10001,'{\"level\":42}');",False)
 # Two live sessions: table-lock timeout and failed concurrent unique index.
 hold=s.asyncq("SET application_name='old-client'; BEGIN; SELECT * FROM workshop.orders; SELECT pg_sleep(2); COMMIT;",'blocked-ddl-reader')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='old-client' AND wait_event='PgSleep'",'1')
 s.q("SET lock_timeout='150ms'; ALTER TABLE workshop.orders ADD COLUMN currency text DEFAULT 'SEK';",False)
 s.result(hold,'blocked-ddl-reader')
 s.q("ALTER TABLE workshop.orders ADD COLUMN currency text DEFAULT 'SEK'; ALTER TABLE workshop.orders ADD CONSTRAINT currency_required CHECK(currency IS NOT NULL) NOT VALID; ALTER TABLE workshop.orders VALIDATE CONSTRAINT currency_required;")
 s.q("CREATE TABLE change_lab(id int PRIMARY KEY,code int); INSERT INTO change_lab VALUES(1,7),(2,7);")
 s.q("CREATE UNIQUE INDEX CONCURRENTLY change_code ON change_lab(code);",False)
 s.q("SELECT indexrelid::regclass,indisvalid,indisready FROM pg_index WHERE indexrelid='change_code'::regclass; DROP INDEX CONCURRENTLY change_code; UPDATE change_lab SET code=8 WHERE id=2; CREATE UNIQUE INDEX CONCURRENTLY change_code ON change_lab(code); SELECT indexrelid::regclass,indisvalid,indisready FROM pg_index WHERE indexrelid='change_code'::regclass;")
 # bounded backfill under old/new writers; compatibility trigger owns canonical default
 s.q("""ALTER TABLE change_lab ADD COLUMN code_text text;
CREATE FUNCTION fill_code() RETURNS trigger LANGUAGE plpgsql AS $$BEGIN NEW.code_text:=NEW.code::text; RETURN NEW; END$$;
CREATE TRIGGER compatibility BEFORE INSERT OR UPDATE ON change_lab FOR EACH ROW EXECUTE FUNCTION fill_code();
INSERT INTO change_lab(id,code) VALUES(3,9); INSERT INTO change_lab VALUES(4,10,'10');
WITH batch AS(SELECT id FROM change_lab WHERE code_text IS DISTINCT FROM code::text ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED) UPDATE change_lab c SET code_text=c.code::text FROM batch b WHERE c.id=b.id;
SELECT count(*) AS mismatches FROM change_lab WHERE code_text IS DISTINCT FROM code::text;
ALTER TABLE change_lab ADD CONSTRAINT backfill_equal CHECK(code_text IS NOT NULL AND code_text=code::text) NOT VALID;
ALTER TABLE change_lab VALIDATE CONSTRAINT backfill_equal;
""")
 legacy=s.asyncq("SET application_name='legacy-writer'; SELECT pg_sleep(1); INSERT INTO change_lab(id,code) VALUES(5,11);",'legacy-writer')
 modern=s.asyncq("SET application_name='modern-writer'; SELECT pg_sleep(1); INSERT INTO change_lab(id,code,code_text) VALUES(6,12,'12');",'modern-writer')
 s.q("SELECT count(*) FROM change_lab WHERE code_text IS DISTINCT FROM code::text;")
 s.result(legacy,'legacy-writer');s.result(modern,'modern-writer')
 s.q("SELECT id,code,code_text FROM change_lab ORDER BY id; SELECT count(*) FROM change_lab WHERE code_text IS DISTINCT FROM code::text;")
 hold=s.asyncq("SET application_name='blocker'; BEGIN; UPDATE workshop.orders SET status='held' WHERE tenant_id='t4' AND order_id='o81'; SELECT pg_sleep(3); ROLLBACK;",'blocker')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='blocker' AND wait_event='PgSleep'",'1')
 waiter=s.asyncq("SET application_name='waiter'; UPDATE workshop.orders SET status='refunded' WHERE tenant_id='t4' AND order_id='o81';",'waiter')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='waiter' AND wait_event_type='Lock'",'1')
 s.q("SELECT application_name,state,wait_event_type,wait_event,pg_blocking_pids(pid) FROM pg_stat_activity WHERE application_name IN ('blocker','waiter'); SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE application_name='waiter';")
 s.result(waiter,'waiter',3);s.result(hold,'blocker')
 pressure=[s.asyncq("SET application_name='pressure'; SELECT pg_sleep(2);",f'pressure-{i}') for i in range(6)]
 s.q("SELECT current_setting('max_connections'),count(*) FILTER(WHERE backend_type='client backend'),count(*) FILTER(WHERE application_name='pressure') FROM pg_stat_activity;")
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='pressure' AND wait_event='PgSleep'",'6')
 s.q("SELECT pg_cancel_backend((SELECT min(pid) FROM pg_stat_activity WHERE application_name='pressure'));")
 for i,p in enumerate(pressure):
  p.wait(timeout=10); out=p.stdout.read(); err=p.stderr.read(); OUT['events'].append({'pressure_result':i,'rc':p.returncode,'stdout':out,'stderr':err})
 s.q("SELECT count(*) FROM pg_stat_activity WHERE application_name='pressure';")
 security(s)
 durability(s)
def security(s):
 s.q("""CREATE ROLE migrator NOLOGIN; CREATE ROLE app LOGIN; CREATE ROLE tenant4 LOGIN; CREATE ROLE elevated LOGIN BYPASSRLS;
CREATE SCHEMA secure AUTHORIZATION migrator; REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SET ROLE migrator;
CREATE TABLE secure.orders(tenant_id text,order_id text,agreed_price numeric,PRIMARY KEY(tenant_id,order_id));
INSERT INTO secure.orders VALUES('t4','o81',20),('t5','o81',90);
GRANT USAGE ON SCHEMA secure TO app,tenant4,elevated;
GRANT SELECT,INSERT,UPDATE ON secure.orders TO app,tenant4,elevated;
ALTER TABLE secure.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_boundary ON secure.orders TO app USING(tenant_id=current_setting('workshop.tenant',true)) WITH CHECK(tenant_id=current_setting('workshop.tenant',true));
CREATE POLICY tenant4_fixed ON secure.orders TO tenant4 USING(tenant_id='t4') WITH CHECK(tenant_id='t4');
RESET ROLE;
""")
 s.q("SET workshop.tenant='t4'; SELECT * FROM secure.orders;",user='app')
 s.q("SET workshop.tenant='t5'; SELECT * FROM secure.orders;",user='app')
 s.q("SET workshop.tenant='t5'; SELECT * FROM secure.orders;",user='tenant4')
 s.q("INSERT INTO secure.orders VALUES('t5','evil',1);",False,user='tenant4')
 s.q("SET workshop.tenant='t4'; INSERT INTO secure.orders VALUES('t5','evil',1);",False,user='app')
 s.q("DELETE FROM secure.orders;",False,user='app')
 s.q("ALTER TABLE secure.orders DISABLE ROW LEVEL SECURITY;",False,user='app')
 s.q("SET ROLE migrator; SELECT count(*) AS owner_bypass FROM secure.orders; ALTER TABLE secure.orders FORCE ROW LEVEL SECURITY; SELECT count(*) AS owner_forced FROM secure.orders; RESET ROLE; SELECT count(*) AS elevated_bypass FROM secure.orders;",user='lab')
 s.q("SELECT count(*) FROM secure.orders;",user='elevated')
 # Security-definer relation lookup: unsafe temp schema precedes named schemas unless explicit pg_temp last.
 s.q("""SET ROLE migrator;
CREATE TABLE secure.config(label text); INSERT INTO secure.config VALUES('trusted');
CREATE FUNCTION secure.unsafe() RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=secure AS $$DECLARE result text; BEGIN SELECT label INTO result FROM config LIMIT 1; RETURN result; END$$;
CREATE FUNCTION secure.safe() RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,secure,pg_temp AS $$DECLARE result text; BEGIN SELECT label INTO result FROM config LIMIT 1; RETURN result; END$$;
REVOKE ALL ON FUNCTION secure.unsafe(),secure.safe() FROM PUBLIC; GRANT EXECUTE ON FUNCTION secure.unsafe(),secure.safe() TO app;
RESET ROLE;""")
 s.q("CREATE TEMP TABLE config(label text); INSERT INTO config VALUES('attacker'); GRANT SELECT ON config TO migrator; SELECT secure.unsafe(),secure.safe();",user='app')
def durability(s):
 s.q("CREATE TABLE durable(id int PRIMARY KEY,v int); INSERT INTO durable VALUES(1,20),(2,20); CREATE UNLOGGED TABLE scratch(id int); INSERT INTO scratch VALUES(1); CHECKPOINT; SELECT pg_current_wal_insert_lsn(),pg_current_wal_lsn(),pg_current_wal_flush_lsn();")
 table_path=s.data/s.q("SELECT pg_relation_filepath('durable');")
 initial_hash=hashlib.sha256(table_path.read_bytes()).hexdigest()
 pending=s.asyncq("SET application_name='pending-crash'; BEGIN; UPDATE durable SET v=99 WHERE id=2; SELECT pg_sleep(30);",'pending-crash')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='pending-crash' AND wait_event='PgSleep'",'1')
 pending_lsn=s.q("SELECT pg_current_wal_insert_lsn();")
 s.q("UPDATE durable SET v=22 WHERE id=1; SELECT pg_current_wal_insert_lsn(),pg_current_wal_lsn(),pg_current_wal_flush_lsn(); SELECT wal_records,wal_fpi,wal_bytes FROM pg_stat_wal; SELECT num_timed,num_requested,buffers_written FROM pg_stat_checkpointer; SHOW fsync; SHOW full_page_writes; SHOW synchronous_commit; SHOW wal_sync_method;")
 final_hash=hashlib.sha256(table_path.read_bytes()).hexdigest()
 OUT['durable_heap_hash']={'initial':initial_hash,'after_updates':final_hash,'unchanged':initial_hash==final_hash}
 assert initial_hash==final_hash,'Expected the lab heap file still to reflect its checkpointed state'
 s.q(f"SELECT pg_current_wal_flush_lsn() >= '{pending_lsn}'::pg_lsn AS pending_wal_covered;")
 s.stop('immediate');pending.wait(timeout=10);OUT['events'].append({'crashed_client_stderr':pending.stderr.read()});s.start()
 s.q("SELECT * FROM durable ORDER BY id; SELECT count(*) FROM scratch; SELECT pg_is_in_recovery();")
 OUT['durability_log']=s.log.read_text()

def recovery(s):
 archive=ROOT/'archive';archive.mkdir(exist_ok=True)
 # archive_mode needs restart; already enabled on initial main config.
 s.q("CREATE TABLE recovery_orders(tenant text,order_id text,request_id text,price numeric,PRIMARY KEY(tenant,order_id),UNIQUE(tenant,request_id)); INSERT INTO recovery_orders VALUES('t4','o81','r81',20);")
 base=ROOT/'base';run([B/'pg_basebackup','-h',s.socket,'-p',s.port,'-U','lab','-D',base,'-X','stream','-c','fast'])
 run([B/'pg_verifybackup',base])
 s.q("SELECT pg_create_restore_point('before_bad_delete');")
 s.q("DELETE FROM recovery_orders WHERE tenant='t4'; INSERT INTO recovery_orders VALUES('t4','o82','r82',25);")
 later=s.q("SELECT row_to_json(r) FROM recovery_orders r ORDER BY order_id")
 OUT['later_valid_orders']=later
 end_lsn=s.q("SELECT pg_current_wal_lsn();")
 s.q("SELECT pg_switch_wal();")
 s.until("SELECT count(*) FROM pg_stat_archiver WHERE failed_count=0 AND archived_count>=3",'1')
 restored=Server('restored',56813,False);shutil.copytree(base,restored.data)
 restored.config(f"archive_mode=off\nrestore_command='cp {archive}/%f %p'\nrecovery_target_name='before_bad_delete'\nrecovery_target_action='pause'")
 (restored.data/'recovery.signal').touch();restored.start()
 restored.until("SELECT pg_get_wal_replay_pause_state()",'paused')
 restored.q("SELECT pg_is_in_recovery(),pg_get_wal_replay_pause_state(); SELECT * FROM recovery_orders;")
 restored.q("SELECT pg_wal_replay_resume();")
 restored.until("SELECT pg_is_in_recovery()",'f')
 # Reconcile external later-state evidence. Exact tuple comparison detects identity conflicts.
 restored.q("CREATE TABLE recovered_later(LIKE recovery_orders INCLUDING ALL); INSERT INTO recovered_later VALUES('t4','o82','r82',25); SELECT l.* FROM recovered_later l JOIN recovery_orders r USING(tenant,request_id) WHERE (l.order_id,l.price) IS DISTINCT FROM (r.order_id,r.price); INSERT INTO recovery_orders SELECT * FROM recovered_later ON CONFLICT(tenant,request_id) DO NOTHING; SELECT * FROM recovery_orders ORDER BY order_id;")
 OUT['restored_log']=restored.log.read_text();restored.stop()
 broken=Server('broken',56814,False);shutil.copytree(base,broken.data)
 empty=ROOT/'empty-archive';empty.mkdir()
 # Remove copied local WAL so archive dependency is real, do not alter the good archive.
 for p in (broken.data/'pg_wal').iterdir():
  if p.is_file():p.unlink()
 broken.config(f"archive_mode=off\nrestore_command='cp {empty}/%f %p'\nrecovery_target_lsn='{end_lsn}'\nrecovery_target_action='pause'")
 (broken.data/'recovery.signal').touch()
 run([B/'pg_ctl','-D',broken.data,'-l',broken.log,'-w','-t','8','start'],False)
 OUT['missing_wal_log']=broken.log.read_text()
 assert 'could not locate required checkpoint record' in OUT['missing_wal_log'] or 'recovery ended before' in OUT['missing_wal_log'] or 'could not restore file' in OUT['missing_wal_log']

def replication(s):
 s.q("CREATE TABLE physical_orders(tenant text,order_id text,PRIMARY KEY(tenant,order_id)); INSERT INTO physical_orders VALUES('t4','o81'); SELECT * FROM pg_create_physical_replication_slot('physical_lab',true);")
 standby=Server('standby',56811,False)
 run([B/'pg_basebackup','-h',s.socket,'-p',s.port,'-U','lab','-D',standby.data,'-X','stream','-R','-S','physical_lab','-c','fast'])
 standby.config("archive_mode=off\nprimary_conninfo='host=127.0.0.1 port=56810 user=lab application_name=standby_lab'\nprimary_slot_name='physical_lab'")
 with (standby.data/'postgresql.auto.conf').open('a') as f: f.write("\nprimary_conninfo = 'host=127.0.0.1 port=56810 user=lab application_name=standby_lab'\n")
 standby.start();standby.until("SELECT count(*) FROM physical_orders",'1')
 standby.q("SELECT pg_wal_replay_pause();")
 standby.until("SELECT pg_get_wal_replay_pause_state()",'paused')
 s.q("INSERT INTO physical_orders VALUES('t4','o82');")
 s.q("SELECT application_name,state,sync_state,sent_lsn,write_lsn,flush_lsn,replay_lsn FROM pg_stat_replication;")
 standby.q("SELECT pg_last_wal_receive_lsn(),pg_last_wal_replay_lsn(); SELECT * FROM physical_orders ORDER BY order_id;")
 standby.q("SELECT pg_wal_replay_resume();");standby.until("SELECT count(*) FROM physical_orders",'2')
 s.q("ALTER SYSTEM SET synchronous_standby_names='FIRST 1 (standby_lab)'; SELECT pg_reload_conf();")
 time.sleep(.2)
 standby.stop()
 sync=s.asyncq("SET application_name='sync-waiter'; INSERT INTO physical_orders VALUES('t4','o83');",'sync-waiter')
 s.until("SELECT count(*) FROM pg_stat_activity WHERE application_name='sync-waiter' AND wait_event='SyncRep'",'1')
 s.q("SELECT application_name,wait_event_type,wait_event FROM pg_stat_activity WHERE application_name='sync-waiter'; SELECT slot_name,active,pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn) FROM pg_replication_slots WHERE slot_name='physical_lab';")
 standby.start();s.result(sync,'sync-waiter');standby.until("SELECT count(*) FROM physical_orders",'3')
 s.q("ALTER SYSTEM RESET synchronous_standby_names; SELECT pg_reload_conf();")
 time.sleep(.2)
 # Explicit lab fence is stop of old writer; no fiction that promotion supplies this.
 s.stop();run([B/'pg_ctl','-D',standby.data,'-w','promote'])
 standby.q("CHECKPOINT; SELECT pg_is_in_recovery(); INSERT INTO physical_orders VALUES('t4','o84'); SELECT * FROM physical_orders ORDER BY order_id; SELECT timeline_id FROM pg_control_checkpoint();")
 standby.stop();s.start()
 logical(s)
def logical(s):
 sub=Server('subscriber',56812);sub.config();sub.start()
 schema="CREATE TABLE feed_orders(tenant text,order_id text,request_id text,price numeric,status text DEFAULT 'pending',serial_id bigint GENERATED BY DEFAULT AS IDENTITY,PRIMARY KEY(tenant,order_id),UNIQUE(tenant,request_id));"
 s.q(schema);sub.q(schema)
 s.q("INSERT INTO feed_orders(tenant,order_id,request_id,price) VALUES('t4','o81','r81',20),('t5','o90','r90',90); CREATE PUBLICATION workshop_feed FOR TABLE feed_orders WHERE(tenant='t4');")
 sub.q("CREATE SUBSCRIPTION workshop_sub CONNECTION 'host=127.0.0.1 port=56810 dbname=postgres user=lab' PUBLICATION workshop_feed;")
 sub.until("SELECT count(*) FROM feed_orders",'1')
 s.q("UPDATE feed_orders SET status='confirmed' WHERE order_id='o81';")
 sub.until("SELECT status FROM feed_orders WHERE order_id='o81'",'confirmed')
 sub.stop()
 s.q("INSERT INTO feed_orders(tenant,order_id,request_id,price) VALUES('t4','o82','r82',25); SELECT slot_name,active,pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn) FROM pg_replication_slots WHERE slot_type='logical';")
 sub.start();sub.until("SELECT count(*) FROM feed_orders",'2')
 s.q("ALTER TABLE feed_orders ADD COLUMN note text; UPDATE feed_orders SET note='new-schema' WHERE order_id='o82';")
 time.sleep(1)
 sub.q("SELECT column_name FROM information_schema.columns WHERE table_name='feed_orders';")
 sub.q("ALTER TABLE feed_orders ADD COLUMN note text;")
 sub.until("SELECT note FROM feed_orders WHERE order_id='o82'",'new-schema',timeout=20)
 s.q("DELETE FROM feed_orders WHERE order_id='o82';")
 sub.until("SELECT count(*) FROM feed_orders",'1')
 sub.q("SELECT serial_id FROM feed_orders; SELECT last_value,is_called FROM feed_orders_serial_id_seq; SELECT srrelid::regclass,srsubstate FROM pg_subscription_rel;")
 s.q("CREATE TABLE no_identity(tenant text,order_id text); INSERT INTO no_identity VALUES('t4','x'); ALTER PUBLICATION workshop_feed ADD TABLE no_identity;")
 s.q("UPDATE no_identity SET order_id='y';",False)
 s.q("ALTER TABLE no_identity ADD PRIMARY KEY(tenant,order_id); UPDATE no_identity SET order_id='y'; SELECT * FROM no_identity;")
 OUT['subscriber_log']=sub.log.read_text()
 sub.q("DROP SUBSCRIPTION workshop_sub;")

def migration(s):
 # This is a real 18.6->18.6 dump/restore migration, never described as major upgrade.
 target=Server('migration',56815);target.config();target.start()
 s.q("CREATE DATABASE migration_source;")
 s.q("CREATE EXTENSION btree_gist; CREATE TABLE orders(tenant text,order_id text,request_id text,price numeric(10,2) CHECK(price>=0),seq bigint GENERATED BY DEFAULT AS IDENTITY,PRIMARY KEY(tenant,order_id),UNIQUE(tenant,request_id)); INSERT INTO orders(tenant,order_id,request_id,price) VALUES('t4','o81','r81',20),('t4','o82','r82',25);",db='migration_source')
 # Fenced application database connection before snapshot. Lab superuser keeps maintenance access.
 s.q("CREATE ROLE migration_app LOGIN; GRANT CONNECT ON DATABASE migration_source TO migration_app; ALTER DATABASE migration_source CONNECTION LIMIT 0;")
 s.q("SELECT 1",False,user="migration_app",db="migration_source")
 dump=ROOT/'migration.dump';run([B/'pg_dump','-h',s.socket,'-p',s.port,'-U','lab','-d','migration_source','-Fc','-f',dump])
 target.q("CREATE DATABASE migration_target;")
 run([B/'pg_restore','-h',target.socket,'-p',target.port,'-U','lab','-d','migration_target','--exit-on-error',dump])
 target.q("SELECT extname,extversion FROM pg_extension; SELECT * FROM orders ORDER BY order_id; SELECT last_value,is_called FROM orders_seq_seq; SELECT datcollate,datctype,datcollversion FROM pg_database WHERE datname=current_database(); INSERT INTO orders(tenant,order_id,request_id,price) VALUES('t4','o83','r83',30) RETURNING seq; SELECT sum(price),count(*) FROM orders;",db='migration_target')
 target.q("INSERT INTO orders(tenant,order_id,request_id,price) VALUES('t4','other','r81',99);",False,db='migration_target')
 target.q("INSERT INTO orders(tenant,order_id,request_id,price) VALUES('t4','bad','bad',-1);",False,db='migration_target')
 s.q("SELECT * FROM orders ORDER BY order_id;",db='migration_source')
 OUT['migration_scope']='PostgreSQL18.6 to PostgreSQL18.6 dump/restore, btree_gist extension. Major-version binary upgrade not executed: only 18.6 installed.'

ok=False
try:
 archive=ROOT/'archive';archive.mkdir(exist_ok=True)
 main=Server('main',56810);main.config(f"archive_mode=on\narchive_command='test ! -f {archive}/%f && cp %p {archive}/%f'\nmax_wal_size='256MB'\ncheckpoint_timeout='30min'");main.start()
 mode=OUT['mode']
 if mode in ('all','core'):core(main)
 if mode in ('all','recovery'):recovery(main)
 if mode in ('all','replication'):replication(main)
 if mode in ('all','migration'):migration(main)
 ok=True
finally:
 for server in reversed(SERVERS):
  if (server.data/'postmaster.pid').exists():server.stop()
 OUT['success']=ok
 OUT['logs']={x.name:x.log.read_text() for x in SERVERS if x.log.exists()}
 (HERE/f'rl110-native-{OUT["mode"]}-observed.json').write_text(json.dumps(OUT,indent=2))
 if ok:shutil.rmtree(ROOT)
 print(json.dumps({'success':ok,'evidence':f'rl110-native-{OUT["mode"]}-observed.json','root':str(ROOT),'cleaned':ok}))
