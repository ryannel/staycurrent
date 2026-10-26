from pathlib import Path
import hashlib,json,subprocess,sys,os,signal,time
r=Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-rebuild-2026-10-25/runtime');e=Path('/private/tmp/staycurrent-relational-rebuild-crdb-upgrades-writer-20261025/evidence/native-rehearsal-02');f=json.loads((r/'crdb-upgrades-fixture.json').read_text());cid='63a16ce85ef860dfd572636c33cb6182ed046299227d99503a4dbf58ca91a593';assert f['container_id']==cid and f['cluster_id']=='c32cc5dd-a303-423d-9923-ff35d4f23f5e'
d=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock'];i=json.loads(subprocess.check_output(d+['inspect',cid]))[0];assert i['Id']==cid and i['Name']=='/'+f['name'] and i['Config']['Image']==f['pinned_image'];assert i['Config']['Labels']['dev.staycurrent.article']=='crdb-upgrades' and i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25';assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings') and not i.get('Mounts')
b=(e/'verify-upgrade.py').read_bytes();h=hashlib.sha256(b).hexdigest();assert h=='ac854a0ba2b669c25ec58cc5ea8efdcf5c983722b8f082a52f0beb3980f2b306';p=e/'native-executed-verifier.py';assert not p.exists();p.write_bytes(b);(e/'root-executor.py').write_bytes(Path(__file__).read_bytes());(e/'native-root-fixture.json').write_text(json.dumps(f,indent=2)+'\n');started=time.monotonic();proc=None
try:
 proc=subprocess.Popen([sys.executable,str(p)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True);out,err=proc.communicate(timeout=480);code=proc.returncode
except subprocess.TimeoutExpired:
 os.killpg(proc.pid,signal.SIGKILL);out,err=proc.communicate();code=124
finally:
 (e/'native-root.stdout').write_bytes(out);(e/'native-root.stderr').write_bytes(err);clean=subprocess.run([sys.executable,str(r/'crdb-upgrade-fixture.py'),'stop','crdb-upgrades','3'],capture_output=True,text=True,timeout=100);(e/'native-root-cleanup.json').write_text(json.dumps({'exit':clean.returncode,'stdout':clean.stdout,'stderr':clean.stderr},indent=2)+'\n')
 (e/'native-root-execution.json').write_text(json.dumps({'script_sha256':h,'exit':code,'elapsed_seconds':time.monotonic()-started,'source_unchanged':h==hashlib.sha256((e/'verify-upgrade.py').read_bytes()).hexdigest(),'cleanup_exit':clean.returncode},indent=2)+'\n')
print(json.dumps({'exit':code,'cleanup_exit':clean.returncode,'evidence':str(e)}));sys.exit(code)
