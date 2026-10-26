from pathlib import Path
import hashlib,json,subprocess,sys,os,signal,time
r=Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-rebuild-2026-10-25/runtime');e=Path('/private/tmp/staycurrent-relational-rebuild-crdb-backup-writer-20261025/evidence/native-history-supplement-01');f=json.loads((r/'crdb-backup-fixture.json').read_text());cid='fcf636d47d80ed30f166c028701bf65003a13f40ba0242aa57b4ee9f554f52e7';assert f['container_id']==cid and f['cluster_id']=='8c349890-5715-4138-bbd3-55d168d40441'
d=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock'];i=json.loads(subprocess.check_output(d+['inspect',cid]))[0];assert i['Id']==cid and i['Name']=='/'+f['name'] and i['Config']['Image']==f['pinned_image'];assert i['Config']['Labels']['dev.staycurrent.article']=='crdb-backup';assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings') and not i.get('Mounts')
b=(e/'verifier.py').read_bytes();h=hashlib.sha256(b).hexdigest();assert h=='a13486ead04fb8222e7e962805b71d3ed3c1299571abc1bc304c9341b6744906';p=e/'native-executed-verifier.py';assert not p.exists();p.write_bytes(b);(e/'native-root-fixture.json').write_text(json.dumps(f,indent=2)+'\n');(e/'root-executor.py').write_bytes(Path(__file__).read_bytes());started=time.monotonic();proc=None
try:
 proc=subprocess.Popen([sys.executable,str(p)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True);out,err=proc.communicate(timeout=300);code=proc.returncode
except subprocess.TimeoutExpired:
 os.killpg(proc.pid,signal.SIGKILL);out,err=proc.communicate();code=124
finally:
 (e/'native-root.stdout').write_bytes(out);(e/'native-root.stderr').write_bytes(err);clean=subprocess.run([sys.executable,str(r/'crdb-fixture.py'),'stop','crdb-backup'],capture_output=True,text=True,timeout=80);(e/'native-root-cleanup.json').write_text(json.dumps({'exit':clean.returncode,'stdout':clean.stdout,'stderr':clean.stderr},indent=2)+'\n')
 (e/'native-root-execution.json').write_text(json.dumps({'script_sha256':h,'exit':code,'elapsed_seconds':time.monotonic()-started,'source_unchanged':h==hashlib.sha256((e/'verifier.py').read_bytes()).hexdigest(),'cleanup_exit':clean.returncode},indent=2)+'\n')
print(json.dumps({'exit':code,'cleanup_exit':clean.returncode,'evidence':str(e)}));sys.exit(code)
