"""Bounded native client execution with private authentication and owned cleanup."""
from pathlib import Path
import hashlib,json,re,subprocess,sys,time
R=Path(__file__).resolve().parent;role=sys.argv[1];assert re.fullmatch('pg-[a-z][a-z0-9-]{0,25}',role)
E=Path('/private/tmp/staycurrent-relational-rebuild-'+role+'-writer-20261025/evidence');script=Path(sys.argv[2]).resolve();assert script.is_relative_to(E) and script.suffix=='.mjs'
f=json.loads((E/'root-fixture.json').read_text());base=json.loads((R/(role+'-fixture.json')).read_text());assert f['container_id']==base['container_id']
D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock'];c=f['container_id'];i=json.loads(subprocess.check_output(D+['inspect',c]))[0]
assert i['Name']=='/'+f['name'] and i['Config']['Image']==f['image'] and i['Config']['Labels']['dev.staycurrent.article']==role
assert i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
assert i['NetworkSettings']['Ports']['5432/tcp']==[{'HostIp':'127.0.0.1','HostPort':str(f['port'])}]
connection=Path(f['connection_file']);cfg=json.loads(connection.read_text());assert cfg['host']=='127.0.0.1' and cfg['port']==f['port'] and cfg['database']==f['database'] and cfg['user']==f['user']
cfg.update(cluster_name=f['cluster_name'],data_directory=f['data_directory'],system_identifier=f['system_identifier'],pg_module='/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js')
cfg['connection']={k:cfg[k] for k in ['host','port','database','user','password','ssl'] if k in cfg}
cfg['expected']={'database':f['database'],'user':f['user'],'dataDirectory':f['data_directory'],'systemIdentifier':f['system_identifier'],'versionNum':'180006','clusterName':f['cluster_name']}
private=connection.with_name('run-client.json');private.write_text(json.dumps(cfg,indent=2)+'\n');private.chmod(0o600)
before=hashlib.sha256(script.read_bytes()).hexdigest();snapshot=E/'native-executed-verifier.mjs';assert not snapshot.exists() or snapshot.read_bytes()==script.read_bytes();snapshot.write_bytes(script.read_bytes())
try:
 t=time.monotonic();cmd=['node',str(script),str(private)];p=subprocess.run(cmd,capture_output=True,timeout=120)
 (E/'native-stdout.txt').write_bytes(p.stdout);(E/'native-stderr.txt').write_bytes(p.stderr)
 (E/'native-execution.json').write_text(json.dumps({'command':cmd,'exit_code':p.returncode,'elapsed_seconds':round(time.monotonic()-t,2),'source_sha256_before':before,'source_sha256_after':hashlib.sha256(script.read_bytes()).hexdigest(),'container_id':c,'client_superuser':f.get('client_superuser'),'scope':'Owned disposable native SQL/concurrency drill; no workload capacity claim.'},indent=2)+'\n')
 print('Native verifier exit',p.returncode,p.stdout[-300:].decode(),p.stderr[-1400:].decode(),flush=True);assert p.returncode==0
finally:
 p=subprocess.run(D+['logs','--tail=150',c],capture_output=True,timeout=15);(E/'native-server-tail.txt').write_bytes(p.stdout+p.stderr)
 p=subprocess.run(['python3',str(R/'native-fixture.py'),'stop',role],capture_output=True,timeout=40);(E/'native-cleanup.txt').write_bytes(p.stdout+p.stderr)
 private.unlink(missing_ok=True);connection.unlink(missing_ok=True);assert p.returncode==0,p.stderr
