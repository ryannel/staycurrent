"""Bounded lifecycle for the already-created, exact owned process fixture."""
from pathlib import Path
import hashlib,json,subprocess,time
R=Path(__file__).resolve().parent
E=Path('/private/tmp/staycurrent-relational-rebuild-pg-replication-writer-20261025/evidence')
F=json.loads((R/'pg-replication-fixture.json').read_text());C=F['container_id'];P=F['root'];U=F['user']
D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
events=[];author=E/'native-phases.sh';start_hash=hashlib.sha256(author.read_bytes()).hexdigest()
def owned():
 i=json.loads(subprocess.check_output(D+['inspect',C]))[0]
 assert i['Name']=='/'+F['name'] and i['Config']['Image']==F['image']
 assert i['Config']['Labels']['dev.staycurrent.article']=='pg-replication'
 assert i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
 assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings')
def run(label,args,stdin=None,timeout=60):
 owned();cmd=D+['exec','-i','--user=postgres',C,'env','-i','PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin','VERIFY_PG_BIN=/usr/lib/postgresql/18/bin','VERIFY_SYSTEM_ID='+F['system_identifier']]+args
 t=time.monotonic();p=subprocess.run(cmd,input=stdin,capture_output=True,text=True,timeout=timeout)
 (E/(label+'.txt')).write_text(p.stdout);(E/(label+'-stderr.txt')).write_text(p.stderr)
 events.append({'label':label,'command':cmd,'exit_code':p.returncode,'elapsed_seconds':round(time.monotonic()-t,2)})
 (E/'native-lifecycle.json').write_text(json.dumps({'fixture':F,'author_sha256_before':start_hash,'events':events},indent=2)+'\n')
 print(label,p.returncode,p.stdout[-220:],p.stderr[-350:],flush=True)
 assert p.returncode==0,(label,p.stderr);return p.stdout
def phase(name):return run('native-'+name,['bash',P+'/native-phases.sh',name])
def clone(name,upstream,upstream_port,slot,port):
 run('clone-'+name,['pg_basebackup','--dbname=host='+P+'/sockets/'+upstream+' port='+str(upstream_port)+' user='+U+' application_name='+slot,'-D',P+'/'+name,'-R','-C','-S',slot,'-X','stream','--checkpoint=fast'])
 config="\ncluster_name='staycurrent-pg-replication-"+name+"-20261025'\nlisten_addresses=''\nport="+str(port)+"\nunix_socket_directories='"+P+'/sockets/'+name+"'\nwal_receiver_status_interval='100ms'\n"
 run('configure-'+name,['tee','-a',P+'/'+name+'/postgresql.auto.conf'],stdin=config)
 run('chmod-'+name,['chmod','700',P+'/'+name])
 run('start-'+name,['pg_ctl','-D',P+'/'+name,'-l',P+'/logs/'+name+'.log','-w','-t','30','start'])
try:
 owned();p=subprocess.run(D+['cp',str(author),C+':'+P+'/native-phases.sh'],capture_output=True,text=True,timeout=20);assert p.returncode==0,p.stderr
 assert run('author-file-hash',['sha256sum',P+'/native-phases.sh']).split()[0]==start_hash
 phase('seed')
 clone('a','primary',5432,'shop_a',55432);clone('b','primary',5432,'shop_b',55433)
 phase('streaming')
 run('stop-b',['pg_ctl','-D',P+'/b','-w','-t','20','stop','-m','fast'])
 phase('durable-gap');phase('remote-apply');phase('ready-to-stop')
 run('stop-primary',['pg_ctl','-D',P+'/primary','-w','-t','20','stop','-m','fast'])
 run('promote-a',['pg_ctl','-D',P+'/a','-w','-t','20','promote'])
 phase('promoted')
 run('preserve-former-primary',['mv',P+'/primary',P+'/former-primary'])
 clone('primary','a',55432,'shop_returned',5432)
 phase('returned')
 for n in ['primary','a','b']:run('native-server-log-'+n,['cat',P+'/logs/'+n+'.log'])
 run('native-returned-control',['pg_controldata',P+'/primary'])
 assert hashlib.sha256(author.read_bytes()).hexdigest()==start_hash
 (E/'native-lifecycle.json').write_text(json.dumps({'ok':True,'fixture':F,'author_sha256_before':start_hash,'author_sha256_after':start_hash,'coordinator_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'events':events,'scope':'Same-container process drill, no independent storage/power failure or production fencing.'},indent=2)+'\n')
finally:
 p=subprocess.run(['python3',str(R/'replication-fixture.py'),'stop'],capture_output=True,text=True,timeout=40)
 (E/'native-cleanup.txt').write_text(p.stdout+p.stderr);assert p.returncode==0,p.stderr
