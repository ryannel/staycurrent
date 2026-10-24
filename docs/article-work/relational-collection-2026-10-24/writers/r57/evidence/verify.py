import os, pathlib, subprocess, tempfile, shutil, json, datetime
BIN='/opt/homebrew/opt/postgresql@18/bin'
base=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r57-native-',dir='/private/tmp'))
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGHOST=str(base),PGPORT='55457',PGUSER=os.environ['USER'],PGDATABASE='postgres',PGCONNECT_TIMEOUT='5',PGAPPNAME='staycurrent-r57')
data=base/'data'
def run(name,*args,sql=None):
 p=subprocess.run([BIN+'/'+name,*args],input=sql,text=True,env=env,capture_output=True,timeout=45)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout + p.stderr
started=False
try:
 run('initdb','-D',str(data),'--no-locale','--encoding=UTF8','--auth=trust')
 run('pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {base} -p 55457 -c listen_addresses=''",'-w','start'); started=True
 assert pathlib.Path(run('psql','-XAt','-c','show data_directory').strip()).resolve()==data.resolve()
 out=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=pathlib.Path('src/components/relational-collection/r57/downloads/ranges.sql').read_text())
 out+=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=pathlib.Path('src/components/relational-collection/r57/downloads/spatial.sql').read_text())
 # Exercise real overlapping transactions, not only a sequential refusal.
 out+=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql="CREATE TABLE concurrent_room(room text NOT NULL,during tstzrange NOT NULL,EXCLUDE USING gist(room WITH =,during WITH &&));")
 owner=subprocess.Popen([BIN+'/psql','-XAt','-v','ON_ERROR_STOP=1'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,env=env)
 def owner_sql(sql):
  owner.stdin.write(sql+'\n\\echo END_R57\n');owner.stdin.flush();lines=[]
  while True:
   line=owner.stdout.readline()
   if line.strip()=='END_R57':return ''.join(lines)
   if not line:raise RuntimeError('owner ended')
   lines.append(line)
 out+=owner_sql("BEGIN; INSERT INTO concurrent_room VALUES('R1','[2026-11-04 18:00Z,2026-11-04 19:00Z)');")
 otherenv=dict(env,PGAPPNAME='staycurrent-r57-contender')
 contender=subprocess.Popen([BIN+'/psql','-XAt','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose','-c',"INSERT INTO concurrent_room VALUES('R1','[2026-11-04 18:30Z,2026-11-04 19:30Z)');"],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,env=otherenv)
 import time
 waits=''
 for _ in range(40):
  waits=run('psql','-XAt','-c',"SELECT wait_event_type,wait_event FROM pg_stat_activity WHERE application_name='staycurrent-r57-contender';")
  if 'Lock|transactionid' in waits:break
  time.sleep(.05)
 assert 'Lock|transactionid' in waits,waits
 out+='contender-wait|'+waits
 out+=owner_sql('COMMIT;')
 owner.stdin.close();owner.wait(timeout=10)
 _,error=contender.communicate(timeout=10)
 assert contender.returncode!=0 and '23P01' in error,error
 out+=error
 out+=run('psql','-XAt','-c',"SELECT 'concurrent-survivors',count(*) FROM concurrent_room;")
 # A same-host logical restore must recreate extension objects before user data.
 run('pg_dump','-Fc','-f',str(base/'fixture.dump'))
 run('createdb','r57_restored')
 run('pg_restore','-d','r57_restored',str(base/'fixture.dump'))
 out+=run('psql','-XAt','-d','r57_restored','-c',"SELECT 'restored-spatial',count(*) FROM r57_spatial.points WHERE ST_DWithin(location,ST_Point(0,0),750);SELECT 'restored-room',count(*) FROM concurrent_room; DO $$ BEGIN BEGIN INSERT INTO concurrent_room VALUES('R1','[2026-11-04 18:30Z,2026-11-04 19:30Z)'); RAISE EXCEPTION 'restored rule missing'; EXCEPTION WHEN exclusion_violation THEN RAISE NOTICE 'restored overlap rejected: 23P01'; END; END $$; SELECT extname,extversion FROM pg_extension WHERE extname IN ('btree_gist','postgis') ORDER BY extname;")
 out+=run('psql','-XAt','-c',"SELECT name,default_version FROM pg_available_extensions WHERE name IN ('postgis','btree_gist'); select version(); show block_size;")
 pathlib.Path('evidence/native.txt').write_text(out)
 pathlib.Path('evidence/environment.json').write_text(json.dumps({'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':run('postgres','--version').strip(),'endpoint':'owned private Unix socket; TCP disabled','ownership':'SHOW data_directory matched generated private data path','fixture':'independent roomR1 reservation ranges on2026-11-04; protected/unprotected overlaps and extension dependencies','cleanup':'fast stop and remove owned directory in finally'},indent=2))
 print(out)
finally:
 if started: run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
 shutil.rmtree(base)
