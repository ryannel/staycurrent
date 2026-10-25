"""Run only inside a coordinator-created disposable PostgreSQL container.
Usage: python3 verify-native.py CONTAINER [DOCKER_BINARY]
Requires a container name beginning staycurrent-pg-vacuum-; no host database.
"""
import subprocess, sys, json, tempfile, pathlib, os, selectors, time
name = sys.argv[1]
assert name == 'staycurrent-relational-rebuild-pg-vacuum-20261025', 'Refusing a non-owned fixture name'
docker = sys.argv[2] if len(sys.argv)>2 else 'docker'
base = [docker, '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
info=json.loads(subprocess.check_output(base+['inspect',name]))[0]
assert info['HostConfig']['NetworkMode']=='none'
assert not info['HostConfig'].get('PortBindings')
assert info['Config']['Image']=='postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
assert info['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
assert info['Config']['Labels']['dev.staycurrent.article']=='pg-vacuum'
container_id=info['Id']
cmd=base+['exec','-i',container_id,'env','-i','PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin','PGAPPNAME=pg-vacuum-owned-verifier','psql','-X','-qAt','-v','ON_ERROR_STOP=1','-h','/var/run/postgresql','-U','sc_pg_vacuum_writer','-d','sc_pg_vacuum']
results={'container':name,'container_id':container_id,'image_id':info['Image'],'configured_image':info['Config']['Image'],'network':'none','observations':[]}
logs=[]
class Session:
 def __init__(self,role):
  self.role=role; self.err=tempfile.TemporaryFile(mode='w+t');self.p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=self.err,text=True,bufsize=1)
 def run(self,sql):
  marker='finished_'+str(len(logs));self.p.stdin.write(sql+'\n\\echo '+marker+'\n');self.p.stdin.flush();lines=[]
  sel=selectors.DefaultSelector();sel.register(self.p.stdout,selectors.EVENT_READ)
  # psql flushes at each newline. A background reader is avoided; per-command timeout is also set in SQL.
  while True:
   line=self.p.stdout.readline()
   if not line: raise RuntimeError('psql exited: '+self.error())
   if line.strip()==marker:break
   lines.append(line.rstrip())
  logs.append({'role':self.role,'sql':sql,'stdout':lines});return lines
 def error(self):
  self.err.flush();self.err.seek(0);return self.err.read()
 def close(self):
  if self.p.poll() is None:
   self.p.stdin.write('ROLLBACK;\n\\q\n');self.p.stdin.flush()
   try:self.p.wait(timeout=5)
   except subprocess.TimeoutExpired:self.p.kill();self.p.wait()
  logs.append({'role':self.role,'stderr':self.error()});self.err.close()
a=b=None
try:
 a=Session('maintainer');b=Session('report')
 guard="SELECT current_database(), current_user, current_setting('cluster_name'), current_setting('data_directory'), current_setting('server_version_num'), current_setting('listen_addresses');"
 expected='sc_pg_vacuum|sc_pg_vacuum_writer|staycurrent-pg-vacuum-20261025|/var/lib/postgresql/18/docker|180006|'
 for owned in [a,b]:
  actual=owned.run(guard)
  assert actual==[expected], {'guard_failed':owned.role,'actual':actual}
 results['guarded_sessions']=True
 results['version']=a.run("SELECT version(); SHOW data_directory; SHOW listen_addresses; SET statement_timeout='15s'; SET lock_timeout='2s';")
 a.run("CREATE SCHEMA vacuum_check; CREATE EXTENSION pg_visibility; CREATE EXTENSION pgstattuple; CREATE TABLE vacuum_check.products(product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL, stock integer NOT NULL) WITH (autovacuum_enabled=false); CREATE INDEX products_price ON vacuum_check.products(price); INSERT INTO vacuum_check.products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4); VACUUM (FREEZE) vacuum_check.products;")
 b.run("SET statement_timeout='15s'; SET application_name='vacuum-check-report'; BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; SELECT price FROM vacuum_check.products WHERE product_id='P7';")
 a.run("UPDATE vacuum_check.products SET price=22.00 WHERE product_id='P7'; VACUUM (VERBOSE, INDEX_CLEANUP ON) vacuum_check.products;")
 results['held']=a.run("SELECT dead_tuple_count FROM pgstattuple('vacuum_check.products'); SELECT all_visible, all_frozen FROM pg_visibility_map('vacuum_check.products'); SELECT state, backend_xid IS NULL AS no_xid, backend_xmin IS NOT NULL AS holds_xmin FROM pg_stat_activity WHERE application_name='vacuum-check-report'; SELECT price FROM vacuum_check.products WHERE product_id='P7';")
 results['report_after_vacuum']=b.run("SELECT price FROM vacuum_check.products WHERE product_id='P7'; COMMIT;")
 a.run("VACUUM (VERBOSE, INDEX_CLEANUP ON) vacuum_check.products;")
 results['released']=a.run("SELECT dead_tuple_count FROM pgstattuple('vacuum_check.products'); SELECT all_visible, all_frozen FROM pg_visibility_map('vacuum_check.products'); SELECT price FROM vacuum_check.products WHERE product_id='P7';")
 a.run("VACUUM (FREEZE, VERBOSE) vacuum_check.products;")
 results['frozen']=a.run("SELECT all_visible, all_frozen FROM pg_visibility_map('vacuum_check.products'); SELECT age(relfrozenxid),mxid_age(relminmxid) FROM pg_class WHERE oid='vacuum_check.products'::regclass;")
 assert results['held'][0]=='1',results['held']
 assert results['held'][-1]=='22.00'
 assert results['report_after_vacuum'][0]=='20.00'
 assert results['released'][0]=='0',results['released']
 assert results['frozen'][0]=='t|t',results['frozen']
 results['passed']=True
finally:
 for session in [b,a]:
  if session:session.close()
 results['transcript']=logs
 pathlib.Path(__file__).with_name('native-results.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps({k:v for k,v in results.items() if k!='transcript'},indent=2))
