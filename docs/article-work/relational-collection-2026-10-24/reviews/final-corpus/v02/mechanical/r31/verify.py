import os, pathlib, subprocess, tempfile, shutil, json, datetime
BIN='/opt/homebrew/opt/postgresql@18/bin'
base=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r31-native-',dir='/private/tmp'))
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGHOST=str(base),PGPORT='55431',PGUSER=os.environ['USER'],PGDATABASE='postgres',PGCONNECT_TIMEOUT='5',PGAPPNAME='staycurrent-r31')
data=base/'data'
def run(name,*args,sql=None):
 p=subprocess.run([BIN+'/'+name,*args],input=sql,text=True,env=env,capture_output=True,timeout=45)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout
started=False
try:
 run('initdb','-D',str(data),'--no-locale','--encoding=UTF8','--auth=trust')
 run('pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {base} -p 55431 -c listen_addresses=''",'-w','start'); started=True
 assert pathlib.Path(run('psql','-XAt','-c','show data_directory').strip()).resolve()==data.resolve()
 setup="""CREATE EXTENSION pageinspect;
CREATE TABLE hot (product_id text PRIMARY KEY, price numeric NOT NULL, padding text) WITH (fillfactor=70, autovacuum_enabled=false);
ALTER TABLE hot ALTER COLUMN padding SET STORAGE PLAIN;
INSERT INTO hot VALUES ('P7',20.00,repeat('x',1800));
CREATE TABLE price_indexed (LIKE hot INCLUDING ALL); ALTER TABLE price_indexed ALTER COLUMN padding SET STORAGE PLAIN;
INSERT INTO price_indexed SELECT * FROM hot; CREATE INDEX ON price_indexed(price);
CREATE TABLE full_page (LIKE hot INCLUDING ALL); ALTER TABLE full_page ALTER COLUMN padding SET STORAGE PLAIN;
INSERT INTO full_page SELECT 'scratch-'||g,20.00,repeat('x',1800) FROM generate_series(1,4) g;
SELECT 'before',product_id,price,ctid,xmin,xmax FROM hot;
"""
 out=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=setup)
 # A read-only Repeatable Read snapshot survives while another backend updates.
 reader=subprocess.Popen([BIN+'/psql','-XAt','-v','ON_ERROR_STOP=1'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,env=env)
 def read_sql(sql):
  reader.stdin.write(sql+'\n\\echo END_R31\n'); reader.stdin.flush()
  lines=[]
  while True:
   line=reader.stdout.readline()
   if line.strip()=='END_R31': return ''.join(lines)
   if not line: raise RuntimeError('reader ended')
   lines.append(line)
 out+=read_sql("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; SELECT 'old-report-before',price,ctid FROM hot;")
 out+=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql="UPDATE hot SET price=25 WHERE product_id='P7'; SELECT 'new-reader',price,ctid FROM hot; UPDATE price_indexed SET price=25; UPDATE full_page SET price=25 WHERE product_id='scratch-1';")
 out+=read_sql("SELECT 'old-report-after',price,ctid FROM hot; COMMIT;")
 reader.stdin.close(); reader.wait(timeout=10)
 for table in ['hot','price_indexed','full_page']:
  out+=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=f"SELECT '{table}',lp,t_ctid,(t_infomask2 & 16384) <> 0 AS hot_updated,(t_infomask2 & 32768) <> 0 AS heap_only FROM heap_page_items(get_raw_page('{table}',0)); SELECT '{table}-current',product_id,ctid FROM {table};")
 out+=run('psql','-XAt','-c','select version(); show block_size;')
 pathlib.Path('evidence/native.txt').write_text(out)
 pathlib.Path('evidence/environment.json').write_text(json.dumps({'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':run('postgres','--version').strip(),'endpoint':'owned private Unix socket; TCP disabled','ownership':'SHOW data_directory matched generated private data path','fixture':'scratch P7 20→25; anonymous full-page rows','cleanup':'fast stop and remove owned directory in finally'},indent=2))
 print(out)
finally:
 if started: run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
 shutil.rmtree(base)
