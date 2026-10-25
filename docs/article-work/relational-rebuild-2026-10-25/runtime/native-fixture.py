from pathlib import Path
import subprocess,json,time,secrets,sys,re
transport=sys.argv[3] if len(sys.argv)>3 else 'localhost-tcp';assert transport in ['localhost-tcp','network-none'];
mode,role=sys.argv[1:3];assert mode in ['create','stop'] and re.fullmatch('[a-z][a-z0-9-]{0,31}',role)
r=Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-rebuild-2026-10-25/runtime');base=Path('/private/tmp/staycurrent-rebuild-'+role+'-native-20261025');record=r/(role+'-fixture.json');cli=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock'];name='staycurrent-relational-rebuild-'+role+'-20261025';marker='staycurrent-'+role+'-20261025';db='sc_'+role.replace('-','_');user=db+'_writer'
def run(args,**kw):return subprocess.run(cli+args,text=True,capture_output=True,**kw)
def owned(cid):
 p=run(['inspect','--format','{{index .Config.Labels "dev.staycurrent.task"}} {{index .Config.Labels "dev.staycurrent.article"}} {{.Name}}',cid]);assert p.returncode==0 and p.stdout.strip()==f'relational-rebuild-2026-10-25 {role} /{name}',p.stderr
if mode=='stop':
 x=json.loads(record.read_text());cid=x['container_id'];owned(cid);p=run(['stop',cid]);assert p.returncode==0,p.stderr
 for _ in range(40):
  if run(['inspect',cid]).returncode!=0:break
  time.sleep(.1)
 else:raise RuntimeError('Owned stopped fixture was not removed')
 x['stopped_and_removed']=True;record.write_text(json.dumps(x,indent=2)+'\n')
 for f in ['connection.json','fixture.env']:(base/f).unlink(missing_ok=True)
 print('Stopped/removed owned fixture:',role);raise SystemExit()
existing=run(['inspect','--format','{{.Id}}',name])
if existing.returncode==0:
 owned(existing.stdout.strip());assert record.exists() and (json.loads(record.read_text()).get('transport','localhost-tcp')=='network-none' or (base/'connection.json').exists()),'Owned fixture exists without complete connection record; coordinator must inspect.';assert json.loads(record.read_text())['container_id']==existing.stdout.strip(),'Owned fixture record does not match the current container; coordinator must inspect.';print(record.read_text());raise SystemExit()
base.mkdir(exist_ok=True);base.chmod(0o700);password=secrets.token_urlsafe(28);envfile=base/'fixture.env';envfile.write_text(f'POSTGRES_USER={user}\nPOSTGRES_DB={db}\nPOSTGRES_PASSWORD={password}\n');envfile.chmod(0o600)
image='postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
p=run(['run','--rm','-d','--name',name,'--label','dev.staycurrent.task=relational-rebuild-2026-10-25','--label','dev.staycurrent.article='+role,'--memory','1g','--cpus','2','--shm-size','128m',*(['--network','none'] if transport=='network-none' else ['--publish','127.0.0.1::5432']),'--env-file',str(envfile),image,'-c','cluster_name='+marker,*(['-c','listen_addresses='] if transport=='network-none' else [])]);assert p.returncode==0,p.stderr;cid=p.stdout.strip();(base/'container-id').write_text(cid+'\n')
try:
 for i in range(40):
  if run(['exec',cid,'pg_isready',*(['-h','/var/run/postgresql'] if transport=='network-none' else ['-h','127.0.0.1']),'-U',user,'-d',db]).returncode==0:break
  time.sleep(.3)
 else:raise RuntimeError('owned fixture readiness timeout')
 port=None;file=None
 if transport=='localhost-tcp':
  p=run(['inspect','--format','{{json .NetworkSettings.Ports}}',cid]);assert p.returncode==0;ports=json.loads(p.stdout)['5432/tcp'];assert len(ports)==1 and ports[0]['HostIp']=='127.0.0.1';port=int(ports[0]['HostPort'])
  conn={'host':'127.0.0.1','port':port,'user':user,'database':db,'password':password,'ssl':False,'options':'','application_name':marker};file=base/'connection.json';file.write_text(json.dumps(conn,indent=2)+'\n');file.chmod(0o600)
 p=run(['exec','-i',cid,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U',user,'-d',db],input="SELECT version(); SHOW data_directory; SELECT current_database(),current_user,current_setting('cluster_name');");assert p.returncode==0,p.stderr
 x={'container_id':cid,'name':name,'article':role,'image':image,'host':'127.0.0.1','port':port,'database':db,'user':user,'cluster_name':marker,'transport':transport,'connection_file':str(file) if file else None,'runtime_probe':p.stdout,'scope':'Owned disposable native fixture; generated authentication remains only in private temporary files; root owns lifecycle/cleanup.'};record.write_text(json.dumps(x,indent=2)+'\n');print(json.dumps(x))
except BaseException:
 owned(cid);run(['stop',cid])
 for file in ['connection.json','fixture.env']:(base/file).unlink(missing_ok=True)
 raise
