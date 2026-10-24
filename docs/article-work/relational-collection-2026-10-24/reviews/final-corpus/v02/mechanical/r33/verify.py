import os, pathlib, subprocess, tempfile, shutil, json, datetime
BIN='/opt/homebrew/opt/postgresql@18/bin'
base=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r33-native-',dir='/private/tmp'))
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGHOST=str(base),PGPORT='55433',PGUSER=os.environ['USER'],PGDATABASE='postgres',PGCONNECT_TIMEOUT='5',PGAPPNAME='staycurrent-r33')
data=base/'data'
def run(name,*args,sql=None):
 p=subprocess.run([BIN+'/'+name,*args],input=sql,text=True,env=env,capture_output=True,timeout=45)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout
started=False
try:
 run('initdb','-D',str(data),'--no-locale','--encoding=UTF8','--auth=trust')
 run('pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {base} -p 55433 -c listen_addresses=''",'-w','start'); started=True
 assert pathlib.Path(run('psql','-XAt','-c','show data_directory').strip()).resolve()==data.resolve()
 out=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=pathlib.Path('src/components/relational-collection/r33/downloads/index-methods.sql').read_text())
 out+=run('psql','-XAt','-c','select version(); show block_size;')
 pathlib.Path('evidence/native.txt').write_text(out)
 pathlib.Path('evidence/environment.json').write_text(json.dumps({'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':run('postgres','--version').strip(),'endpoint':'owned private Unix socket; TCP disabled','ownership':'SHOW data_directory matched generated private data path','fixture':'50000 deterministic anonymous rows; each100th has gift tag; time ordered and modulo-shuffled copies','cleanup':'fast stop and remove owned directory in finally'},indent=2))
 print(out)
finally:
 if started: run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
 shutil.rmtree(base)
