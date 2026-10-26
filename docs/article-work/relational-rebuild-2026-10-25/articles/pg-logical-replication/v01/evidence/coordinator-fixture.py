"""Two independent, owned Unixsocket clusters for bounded logical-replication checks."""
from pathlib import Path
import json,subprocess,sys
R=Path(__file__).resolve().parent;record=R/'pg-logical-replication-fixture.json'
D=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
I='postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
N='staycurrent-relational-rebuild-pg-logical-replication-20261025';P='/tmp/sc-pg-logical-20261025';U='sc_pg_logical_replication_writer'
def docker(a,**kw):return subprocess.run(D+a,capture_output=True,text=True,timeout=45,**kw)
def owned(c):
 i=json.loads(docker(['inspect',c]).stdout)[0]
 assert i['Name']=='/'+N and i['Config']['Image']==I
 assert i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25' and i['Config']['Labels']['dev.staycurrent.article']=='pg-logical-replication'
 assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings')
def execute(c,args,user='postgres',stdin=None):
 owned(c);p=docker(['exec','-i','--user='+user,c,'env','-i','PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin']+args,input=stdin)
 assert p.returncode==0,(args,p.stderr[-2000:]);return p.stdout
if sys.argv[1]=='stop':
 f=json.loads(record.read_text());c=f['container_id'];owned(c)
 p=docker(['stop','--time=10',c]);assert p.returncode==0,p.stderr
 p=docker(['rm','--volumes',c]);assert p.returncode==0,p.stderr
 f['stopped_and_removed']=True;record.write_text(json.dumps(f,indent=2)+'\n');print('Owned logical-replication fixture removed');raise SystemExit()
assert sys.argv[1]=='create' and docker(['inspect',N]).returncode!=0
p=docker(['run','-d','--name',N,'--network','none','--memory','1536m','--cpus','2','--shm-size','128m','--label','dev.staycurrent.task=relational-rebuild-2026-10-25','--label','dev.staycurrent.article=pg-logical-replication',I,'sleep','infinity']);assert p.returncode==0,p.stderr
c=p.stdout.strip();clusters={}
try:
 execute(c,['mkdir','-p',P+'/publisher',P+'/subscriber',P+'/sockets/publisher',P+'/sockets/subscriber',P+'/logs',P+'/evidence'],'root');execute(c,['chown','-R','postgres:postgres',P],'root')
 for name,port,db in [('publisher',5432,'sc_pg_logical_pub'),('subscriber',55432,'sc_pg_logical_sub')]:
  data=P+'/'+name;socket=P+'/sockets/'+name;cluster='staycurrent-pg-logical-'+name+'-20261025'
  execute(c,['initdb','-D',data,'-U',U,'--auth-local=trust','--auth-host=reject','--encoding=UTF8','--no-instructions'])
  config="\nlisten_addresses=''\nport="+str(port)+"\nunix_socket_directories='"+socket+"'\ncluster_name='"+cluster+"'\nwal_level=logical\nmax_wal_senders=8\nmax_replication_slots=8\nmax_logical_replication_workers=6\nmax_worker_processes=16\nshared_buffers='32MB'\nmax_connections=30\nfsync=on\nfull_page_writes=on\n"
  execute(c,['tee','-a',data+'/postgresql.conf'],stdin=config)
  execute(c,['pg_ctl','-D',data,'-l',P+'/logs/'+name+'.log','-w','-t','30','start'])
  sql=['psql','-X','-qAt','-v','ON_ERROR_STOP=1','-h',socket,'-p',str(port),'-U',U,'-d','postgres']
  identity=execute(c,sql+['-c','SELECT version();SELECT system_identifier FROM pg_control_system();SHOW data_directory;SHOW cluster_name;SHOW listen_addresses;'])
  assert 'PostgreSQL 18.6' in identity and data in identity
  execute(c,sql+['-c','CREATE DATABASE '+db+';'])
  clusters[name]={'system_identifier':identity.splitlines()[1],'database':db,'user':U,'socket':socket,'port':port,'data_directory':data,'cluster_name':cluster,'identity':identity}
 assert clusters['publisher']['system_identifier']!=clusters['subscriber']['system_identifier']
 f={'container_id':c,'name':N,'image':I,'root':P,'clusters':clusters,'transport':'network-none; distinct clusters and Unixsockets','scope':'Same-container native replication/SQL mechanics only, not independent failure, production privileges or storage survival.'};record.write_text(json.dumps(f,indent=2)+'\n');print(json.dumps(f))
except BaseException:
 owned(c);docker(['stop','--time=5',c]);docker(['rm','--volumes',c]);raise
