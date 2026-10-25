from pathlib import Path
import subprocess,json,time
out=Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-rebuild-2026-10-25/runtime');out.mkdir(exist_ok=True)
cli=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
image='postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6';name='staycurrent-relational-rebuild-pg18-probe-20261025'
run=cli+['run','--rm','-d','--name',name,'--label','dev.staycurrent.task=relational-rebuild-2026-10-25','--network','none','--memory','1g','--cpus','2','--shm-size','128m','-e','POSTGRES_HOST_AUTH_METHOD=trust',image,'-c','listen_addresses=']
x=subprocess.run(run,text=True,capture_output=True);assert x.returncode==0,x.stderr
cid=x.stdout.strip();results={'image':image,'container_id':cid,'run_command':run,'official_source':'https://hub.docker.com/_/postgres','scope':'Owned disposable native PostgreSQL Linux container; no network/host ports; probe only, not article verification.'}
try:
 for i in range(30):
  p=subprocess.run(cli+['exec',cid,'pg_isready','-U','postgres'],text=True,capture_output=True)
  if p.returncode==0:break
  time.sleep(.4)
 else:raise RuntimeError('owned probe did not become ready')
 sql="SELECT version(); SHOW data_directory; SHOW listen_addresses; CREATE TABLE probe(id integer PRIMARY KEY); INSERT INTO probe VALUES(1); SELECT count(*) FROM probe;"
 p=subprocess.run(cli+['exec','-i',cid,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','postgres','-d','postgres'],input=sql,text=True,capture_output=True);assert p.returncode==0,p.stderr
 results['sql']=sql;results['result']=p.stdout;results['exit_code']=p.returncode
 print(p.stdout)
finally:
 stop=subprocess.run(cli+['stop',cid],text=True,capture_output=True);results['stopped_and_removed']=stop.returncode==0
 (out/'native-pg18-probe.json').write_text(json.dumps(results,indent=2)+'\n')
