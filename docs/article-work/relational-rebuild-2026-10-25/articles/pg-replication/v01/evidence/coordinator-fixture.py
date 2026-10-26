"""Owned PostgreSQL process fixture; no host ports or mounted data."""
from pathlib import Path
import json, subprocess, sys, time
R=Path(__file__).resolve().parent
record=R/'pg-replication-fixture.json'
D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
I='postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
N='staycurrent-relational-rebuild-pg-replication-20261025'
P='/tmp/sc-pg-replication-20261025'
U='sc_pg_replication_writer'
def docker(args,**kw):return subprocess.run(D+args,capture_output=True,text=True,timeout=45,**kw)
def owned(cid):
 i=json.loads(docker(['inspect',cid]).stdout)[0]
 assert i['Name']=='/'+N and i['Config']['Image']==I
 assert i['Config']['Labels']['dev.staycurrent.article']=='pg-replication'
 assert i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
 assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings')
 return i
def command(cid,args,user='postgres'):
 owned(cid)
 p=docker(['exec','--user='+user,cid,'env','-i','PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin']+args)
 assert p.returncode==0,(args,p.stderr[-2000:]);return p.stdout
if sys.argv[1]=='stop':
 f=json.loads(record.read_text());c=f['container_id'];owned(c)
 p=docker(['stop','--time=10',c]);assert p.returncode==0,p.stderr
 p=docker(['rm','--volumes',c]);assert p.returncode==0,p.stderr
 f['stopped_and_removed']=True;record.write_text(json.dumps(f,indent=2)+'\n');print('Owned replication fixture removed');raise SystemExit()
assert sys.argv[1]=='create' and docker(['inspect',N]).returncode!=0
p=docker(['run','-d','--name',N,'--network','none','--memory','1536m','--cpus','2','--shm-size','128m','--label','dev.staycurrent.task=relational-rebuild-2026-10-25','--label','dev.staycurrent.article=pg-replication',I,'sleep','infinity'])
assert p.returncode==0,p.stderr
c=p.stdout.strip()
try:
 command(c,['mkdir','-p',P+'/primary',P+'/a',P+'/b',P+'/sockets/primary',P+'/sockets/a',P+'/sockets/b',P+'/logs'],'root')
 command(c,['chown','-R','postgres:postgres',P],'root')
 command(c,['initdb','-D',P+'/primary','-U',U,'--auth-local=trust','--auth-host=reject','--encoding=UTF8','--no-instructions'])
 config="\nlisten_addresses=''\nport=5432\nunix_socket_directories='"+P+"/sockets/primary'\ncluster_name='staycurrent-pg-replication-primary-20261025'\nwal_level=replica\nmax_wal_senders=10\nmax_replication_slots=10\nhot_standby=on\nfsync=on\nfull_page_writes=on\n"
 # Append only to this freshly initialised exact fixture path.
 p=docker(['exec','-i','--user=postgres',c,'tee','-a',P+'/primary/postgresql.conf'],input=config);assert p.returncode==0,p.stderr
 command(c,['pg_ctl','-D',P+'/primary','-l',P+'/logs/primary.log','-w','-t','30','start'])
 sql=['psql','-X','-qAt','-v','ON_ERROR_STOP=1','-h',P+'/sockets/primary','-p','5432','-U',U,'-d','postgres']
 identity=command(c,sql+['-c',"SELECT version();SELECT system_identifier FROM pg_control_system();SHOW data_directory;SHOW cluster_name;SHOW listen_addresses;"])
 assert 'PostgreSQL 18.6' in identity and P+'/primary' in identity
 command(c,sql+['-c','CREATE DATABASE sc_pg_replication;'])
 f={'container_id':c,'name':N,'image':I,'database':'sc_pg_replication','user':U,'root':P,'system_identifier':identity.splitlines()[1],'identity':identity,'transport':'network-none; three separately controlled Unixsocket processes','scope':'Same-container/same-host process and WAL-state drill only; no independent storage/power failure, regional latency or production fencing claim.'}
 record.write_text(json.dumps(f,indent=2)+'\n');print(json.dumps(f))
except BaseException:
 owned(c);docker(['stop','--time=5',c]);docker(['rm','--volumes',c]);raise
