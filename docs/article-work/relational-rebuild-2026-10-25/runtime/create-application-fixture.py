from pathlib import Path
import subprocess,json,time,secrets,os
base=Path('/private/tmp/staycurrent-rebuild-app-native-20261025');base.mkdir(exist_ok=True);base.chmod(0o700)
cli=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
name='staycurrent-relational-rebuild-application-sql-20261025';marker='staycurrent-app-sql-20261025';password=secrets.token_urlsafe(28);envfile=base/'fixture.env';envfile.write_text('POSTGRES_USER=sc_app_writer\nPOSTGRES_DB=sc_app\nPOSTGRES_PASSWORD='+password+'\n');envfile.chmod(0o600)
image='postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
x=subprocess.run(cli+['run','--rm','-d','--name',name,'--label','dev.staycurrent.task=relational-rebuild-2026-10-25','--memory','1g','--cpus','2','--shm-size','128m','--publish','127.0.0.1::5432','--env-file',str(envfile),image,'-c','cluster_name='+marker],text=True,capture_output=True);assert x.returncode==0,x.stderr
cid=x.stdout.strip();(base/'container-id').write_text(cid+'\n')
for i in range(40):
 x=subprocess.run(cli+['exec',cid,'pg_isready','-U','sc_app_writer','-d','sc_app'],capture_output=True,text=True)
 if x.returncode==0:break
 time.sleep(.3)
else:raise RuntimeError('owned fixture readiness timeout')
x=subprocess.run(cli+['inspect','--format','{{json .NetworkSettings.Ports}}',cid],check=True,capture_output=True,text=True);ports=json.loads(x.stdout)['5432/tcp'];assert len(ports)==1 and ports[0]['HostIp']=='127.0.0.1';port=int(ports[0]['HostPort'])
conn={'host':'127.0.0.1','port':port,'user':'sc_app_writer','database':'sc_app','password':password,'ssl':False,'options':'','application_name':marker}
p=base/'connection.json';p.write_text(json.dumps(conn,indent=2)+'\n');p.chmod(0o600)
sql="SELECT version(); SHOW data_directory; SELECT current_database(),current_user,current_setting('cluster_name');"
x=subprocess.run(cli+['exec','-i',cid,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','sc_app_writer','-d','sc_app'],input=sql,text=True,capture_output=True);assert x.returncode==0,x.stderr
record={'container_id':cid,'name':name,'image':image,'host':'127.0.0.1','port':port,'database':'sc_app','user':'sc_app_writer','cluster_name':marker,'connection_file':str(p),'runtime_probe':x.stdout,'scope':'Owned disposable app article fixture. Generated credentials remain in private temp files, not evidence. Writer must verify cluster marker/database/user before changes; root stops/removes on completion.'}
r=Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-rebuild-2026-10-25/runtime');(r/'application-fixture.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps(record))
