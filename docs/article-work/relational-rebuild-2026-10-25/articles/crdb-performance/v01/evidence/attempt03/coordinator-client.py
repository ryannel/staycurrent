"""Run an inspected article client on its exact disposable native SQL fixture."""
from pathlib import Path
import hashlib,json,re,subprocess,sys,time,os
R=Path(__file__).resolve().parent
role=sys.argv[1];assert re.fullmatch('crdb-[a-z][a-z0-9-]{0,25}',role)
E=Path('/private/tmp/staycurrent-relational-rebuild-'+role+'-writer-20261025/evidence')
script=Path(sys.argv[2]).resolve();assert script.is_relative_to(E) and script.suffix=='.mjs'
prefix=sys.argv[3] if len(sys.argv)>3 else 'native';assert re.fullmatch('[a-z][a-z0-9-]{0,25}',prefix)
f=json.loads((R/(role+'-fixture.json')).read_text());D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock'];c=f['container_id']
i=json.loads(subprocess.check_output(D+['inspect',c]))[0]
assert i['Name']=='/'+f['name'] and i['Config']['Image']==f['pinned_image']
assert i['Config']['Labels']['dev.staycurrent.article']==role and i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
assert i['HostConfig']['NetworkMode']=='bridge' and i['NetworkSettings']['Ports']['26258/tcp']==f['published_ports']
marker='staycurrent-'+role+'-20261025';before=hashlib.sha256(script.read_bytes()).hexdigest()
config=dict(f['connection'],expectedClusterId=f['cluster_id'],expectedMarker=marker,clusterId=f['cluster_id'],marker=marker,markerSql='SELECT marker FROM public.fixture_guard')
configpath=E/('root-connection.json' if prefix=='native' else 'root-'+prefix+'-connection.json');configpath.write_text(json.dumps(config,indent=2)+'\n')
(E/('root-fixture.json' if prefix=='native' else 'root-'+prefix+'-fixture.json')).write_text(json.dumps(f,indent=2)+'\n')
snapshot=E/(prefix+'-verifier.mjs')
assert not snapshot.exists() or snapshot.read_bytes()==script.read_bytes(),'Do not replace a retained verifier snapshot'
snapshot.write_bytes(script.read_bytes())
sql="SET allow_unsafe_internals=true; DO $$ BEGIN IF current_database()<>'"+f['database']+"' OR current_user<>'"+f['user']+"' OR crdb_internal.cluster_id()::STRING<>'"+f['cluster_id']+"' THEN RAISE EXCEPTION 'Wrong owned fixture'; END IF; END $$; CREATE TABLE fixture_guard(marker STRING PRIMARY KEY); INSERT INTO fixture_guard VALUES ('"+marker+"');"
try:
 p=subprocess.run(D+['exec',c,'/cockroach/cockroach','sql','--insecure','--host=127.0.0.1:26258','--database='+f['database'],'--user='+f['user'],'--set=errexit=true','--execute='+sql],capture_output=True,timeout=30);assert p.returncode==0,p.stderr.decode()
 cmd=['node',str(script),str(configpath),str(E/(prefix+'-results.json'))];t=time.monotonic();p=subprocess.run(cmd,capture_output=True,timeout=180,cwd=E.parent,env=dict(os.environ,STAYCURRENT_PG_PACKAGE='/private/tmp/staycurrent-rebuild-client-runtime-20261025/package.json'))
 (E/(prefix+'-stdout.txt')).write_bytes(p.stdout);(E/(prefix+'-stderr.txt')).write_bytes(p.stderr)
 (E/(prefix+'-execution.json')).write_text(json.dumps({'command':cmd,'exit_code':p.returncode,'elapsed_seconds':round(time.monotonic()-t,2),'source_sha256_before':before,'source_sha256_after':hashlib.sha256(script.read_bytes()).hexdigest(),'container_id':c,'scope':f['scope']},indent=2)+'\n')
 print('Native verifier exit',p.returncode,p.stdout[-300:].decode(),p.stderr[-1500:].decode(),flush=True);assert p.returncode==0
finally:
 if 'p' in locals() and p.returncode!=0:
  jobs=subprocess.run(D+['exec',c,'/cockroach/cockroach','sql','--insecure','--host=127.0.0.1:26258','--database='+f['database'],'--user='+f['user'],'--format=csv','--set=errexit=true','--execute=SHOW JOBS'],capture_output=True,timeout=20);(E/(prefix+'-jobs.txt')).write_bytes(jobs.stdout+jobs.stderr)
 p=subprocess.run(D+['logs','--tail=150',c],capture_output=True,timeout=15);(E/(prefix+'-server-tail.txt')).write_bytes(p.stdout+p.stderr)
 p=subprocess.run(['python3',str(R/'crdb-fixture.py'),'stop',role],capture_output=True,timeout=40);(E/(prefix+'-cleanup.txt')).write_bytes(p.stdout+p.stderr);assert p.returncode==0,p.stderr
