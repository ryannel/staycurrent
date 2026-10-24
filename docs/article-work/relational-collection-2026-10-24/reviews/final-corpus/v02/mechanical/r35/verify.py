import os, pathlib, subprocess, tempfile, shutil, json, datetime
BIN='/opt/homebrew/opt/postgresql@18/bin'
base=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r35-native-',dir='/private/tmp'))
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGHOST=str(base),PGPORT='55435',PGUSER=os.environ['USER'],PGDATABASE='postgres',PGCONNECT_TIMEOUT='5',PGAPPNAME='staycurrent-r35')
data=base/'data'
def run(name,*args,sql=None):
 p=subprocess.run([BIN+'/'+name,*args],input=sql,text=True,env=env,capture_output=True,timeout=45)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout + p.stderr
started=False
try:
 run('initdb','-D',str(data),'--no-locale','--encoding=UTF8','--auth=trust')
 run('pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {base} -p 55435 -c listen_addresses=''",'-w','start'); started=True
 assert pathlib.Path(run('psql','-XAt','-c','show data_directory').strip()).resolve()==data.resolve()
 out=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=pathlib.Path('src/components/relational-collection/r35/downloads/json-boundaries.sql').read_text())
 out+=run('psql','-XAt','-c','select version(); show block_size;')
 pathlib.Path('evidence/native.txt').write_text(out)
 pathlib.Path('evidence/environment.json').write_text(json.dumps({'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':run('postgres','--version').strip(),'endpoint':'owned private Unix socket; TCP disabled','ownership':'SHOW data_directory matched generated private data path','fixture':'50000 anonymous JSONdocuments, optional attributes checks and stale-client replacement counterexample','cleanup':'fast stop and remove owned directory in finally'},indent=2))
 print(out)
finally:
 if started: run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
 shutil.rmtree(base)
