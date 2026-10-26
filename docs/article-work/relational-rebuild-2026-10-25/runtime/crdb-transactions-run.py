from pathlib import Path
import hashlib,json,subprocess,time
R=Path(__file__).resolve().parent
E=Path('/private/tmp/staycurrent-relational-rebuild-crdb-transactions-writer-20261025/evidence')
f=json.loads((R/'crdb-transactions-fixture.json').read_text())
D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
cid=f['container_id']; i=json.loads(subprocess.check_output(D+['inspect',cid]))[0]
assert i['Name']=='/'+f['name'] and i['Config']['Image']==f['pinned_image']
assert i['Config']['Labels']['dev.staycurrent.article']=='crdb-transactions'
assert i['HostConfig']['NetworkMode']=='bridge'
assert i['NetworkSettings']['Ports']['26258/tcp']==f['published_ports']
script=E/'native-verify.mjs'; before=hashlib.sha256(script.read_bytes()).hexdigest()
config=dict(f['connection'],expectedClusterId=f['cluster_id'],expectedMarker='staycurrent-crdb-transactions-20261025')
configpath=E/'root-fixture.json';configpath.write_text(json.dumps(config,indent=2)+'\n')
(E/'root-runtime.json').write_text(json.dumps(f,indent=2)+'\n')
sql="""SET allow_unsafe_internals=true;
DO $$ BEGIN IF current_database()<>'sc_crdb_transactions' OR current_user<>'sc_crdb_transactions_writer' OR crdb_internal.cluster_id()::STRING<>'806df612-25ba-4db2-8356-7044303e957a' THEN RAISE EXCEPTION 'Wrong owned fixture'; END IF; END $$;
CREATE TABLE fixture_guard(marker STRING PRIMARY KEY);
INSERT INTO fixture_guard VALUES ('staycurrent-crdb-transactions-20261025');"""
try:
    p=subprocess.run(D+['exec',cid,'/cockroach/cockroach','sql','--insecure','--host=127.0.0.1:26258','--database='+f['database'],'--user='+f['user'],'--set=errexit=true','--execute='+sql],capture_output=True,timeout=30)
    assert p.returncode==0,p.stderr.decode()
    t=time.monotonic();cmd=['node',str(script),str(configpath),str(E/'native-results.json')]
    p=subprocess.run(cmd,capture_output=True,timeout=120)
    (E/'native-stdout.txt').write_bytes(p.stdout);(E/'native-stderr.txt').write_bytes(p.stderr)
    (E/'native-execution.json').write_text(json.dumps({'command':cmd,'exit_code':p.returncode,'elapsed_seconds':round(time.monotonic()-t,2),'source_sha256_before':before,'source_sha256_after':hashlib.sha256(script.read_bytes()).hexdigest(),'container_id':cid},indent=2)+'\n')
    print('Native client exit',p.returncode,p.stdout[-500:].decode(),p.stderr[-1000:].decode())
    assert p.returncode==0
finally:
    p=subprocess.run(['python3',str(R/'crdb-fixture.py'),'stop','crdb-transactions'],capture_output=True,timeout=40)
    (E/'native-cleanup.txt').write_bytes(p.stdout+p.stderr);assert p.returncode==0,p.stderr
