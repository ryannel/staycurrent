"""Configure monitoring only inside the exact already-created operations fixture."""
from pathlib import Path
import json,subprocess,time
R=Path(__file__).resolve().parent;record=R/'pg-operations-fixture.json';f=json.loads(record.read_text());c=f['container_id'];D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
E=Path('/private/tmp/staycurrent-relational-rebuild-pg-operations-writer-20261025/evidence')
def owned():
 i=json.loads(subprocess.check_output(D+['inspect',c]))[0]
 assert i['Name']=='/'+f['name'] and i['Config']['Image']==f['image'] and i['Config']['Labels']['dev.staycurrent.article']=='pg-operations'
 assert i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
 assert i['HostConfig']['PortBindings']['5432/tcp'][0]['HostIp']=='127.0.0.1'
 return i
def sql(text,guard=None):
 owned();cmd=D+['exec','-i',c,'env','-i','PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin','psql','-X','-qAt','-v','ON_ERROR_STOP=1','-h','/var/run/postgresql','-p','5432','-U',f['user'],'-d',f['database']]
 if guard:cmd+=['-c',guard]
 p=subprocess.run(cmd+['-c',text],capture_output=True,text=True,timeout=20);assert p.returncode==0,p.stderr;return p.stdout
sid=sql('SELECT system_identifier FROM pg_control_system()').strip();assert sid.isdigit()
guard="DO $g$ BEGIN IF current_database()<>'sc_pg_operations' OR session_user<>'sc_pg_operations_writer' OR current_setting('server_version_num')<>'180006' OR current_setting('cluster_name')<>'staycurrent-pg-operations-20261025' OR current_setting('data_directory')<>'/var/lib/postgresql/18/docker' OR (SELECT system_identifier::text FROM pg_control_system())<>'"+sid+"' THEN RAISE EXCEPTION 'Wrong owned operations fixture'; END IF; END $g$;"
sql("ALTER SYSTEM SET shared_preload_libraries='pg_stat_statements'",guard)
owned();p=subprocess.run(D+['restart','--time=10',c],capture_output=True,text=True,timeout=30);assert p.returncode==0,p.stderr
for _ in range(40):
 p=subprocess.run(D+['exec',c,'pg_isready','-h','/var/run/postgresql','-p','5432','-U',f['user'],'-d',f['database']],capture_output=True,timeout=5)
 if p.returncode==0:break
 time.sleep(.25)
else:raise RuntimeError('Owned operations fixture restart readiness failed')
sql('CREATE EXTENSION pg_stat_statements',guard)
probe=sql("SELECT system_identifier FROM pg_control_system();SHOW shared_preload_libraries;SELECT extname,extversion FROM pg_extension WHERE extname='pg_stat_statements';SELECT current_database(),current_user,rolsuper FROM pg_roles WHERE rolname=current_user;",guard)
assert 'pg_stat_statements' in probe and sid in probe
binding=owned()['NetworkSettings']['Ports']['5432/tcp'];assert len(binding)==1 and binding[0]['HostIp']=='127.0.0.1';f['port']=int(binding[0]['HostPort'])
cf=Path(f['connection_file']);cfg=json.loads(cf.read_text());cfg['port']=f['port'];cf.write_text(json.dumps(cfg,indent=2)+'\n');cf.chmod(0o600)
f.update(system_identifier=sid,data_directory='/var/lib/postgresql/18/docker',client_superuser=True,preload='pg_stat_statements');record.write_text(json.dumps(f,indent=2)+'\n');(E/'root-fixture.json').write_text(json.dumps(f,indent=2)+'\n');(E/'coordinator-provision.txt').write_text(probe);print(json.dumps({k:f[k] for k in ['container_id','system_identifier','host','port','database','user','preload','connection_file']}))
