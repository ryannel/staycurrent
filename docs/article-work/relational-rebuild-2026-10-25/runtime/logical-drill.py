"""Execute inspected author SQL only on the exact owned two-cluster fixture."""
from pathlib import Path
import hashlib,json,subprocess,time
R=Path(__file__).resolve().parent
E=Path('/private/tmp/staycurrent-relational-rebuild-pg-logical-replication-writer-20261025/evidence')
f=json.loads((R/'pg-logical-replication-fixture.json').read_text());c=f['container_id']
D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
i=json.loads(subprocess.check_output(D+['inspect',c]))[0]
assert i['Name']=='/'+f['name'] and i['Config']['Image']==f['image']
assert i['Config']['Labels']['dev.staycurrent.article']=='pg-logical-replication' and i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings')
script=E/'native-verify.sh';before=hashlib.sha256(script.read_bytes()).hexdigest()
assert before=='45d0a709f2673285806133d514932f9440618fa7058304dba379ee213bd0c7ac'
(E/'root-fixture.json').write_text(json.dumps(f,indent=2)+'\n')
cmd=D+['exec','-i','--user=postgres',c,'env','-i','PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin','PUB_SYSID='+f['clusters']['publisher']['system_identifier'],'SUB_SYSID='+f['clusters']['subscriber']['system_identifier'],'bash','-s']
try:
 t=time.monotonic();p=subprocess.run(cmd,input=script.read_bytes(),capture_output=True,timeout=180)
 (E/'native-results.txt').write_bytes(p.stdout);(E/'native-stderr.txt').write_bytes(p.stderr)
 (E/'native-execution.json').write_text(json.dumps({'command':cmd,'exit_code':p.returncode,'elapsed_seconds':round(time.monotonic()-t,2),'source_sha256_before':before,'source_sha256_after':hashlib.sha256(script.read_bytes()).hexdigest(),'scope':f['scope']},indent=2)+'\n')
 print('Native verifier exit',p.returncode,p.stdout[-1800:].decode(),p.stderr[-1200:].decode(),flush=True)
 assert p.returncode==0
finally:
 for side in ['publisher','subscriber']:
  p=subprocess.run(D+['exec','--user=postgres',c,'cat',f['root']+'/logs/'+side+'.log'],capture_output=True,timeout=15)
  (E/('native-server-'+side+'.txt')).write_bytes(p.stdout);(E/('native-server-'+side+'-stderr.txt')).write_bytes(p.stderr)
 p=subprocess.run(['python3',str(R/'logical-fixture.py'),'stop'],capture_output=True,timeout=40)
 (E/'native-cleanup.txt').write_bytes(p.stdout+p.stderr);assert p.returncode==0,p.stderr
