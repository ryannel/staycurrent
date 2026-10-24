import os, pathlib, subprocess, tempfile, shutil, json, datetime
BIN='/opt/homebrew/opt/postgresql@18/bin'
base=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r32-native-',dir='/private/tmp'))
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGHOST=str(base),PGPORT='55432',PGUSER=os.environ['USER'],PGDATABASE='postgres',PGCONNECT_TIMEOUT='5',PGAPPNAME='staycurrent-r32')
data=base/'data'
def run(name,*args,sql=None):
 p=subprocess.run([BIN+'/'+name,*args],input=sql,text=True,env=env,capture_output=True,timeout=45)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout
started=False
try:
 run('initdb','-D',str(data),'--no-locale','--encoding=UTF8','--auth=trust')
 run('pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {base} -p 55432 -c listen_addresses=''",'-w','start'); started=True
 assert pathlib.Path(run('psql','-XAt','-c','show data_directory').strip()).resolve()==data.resolve()
 setup="""CREATE EXTENSION pgstattuple; CREATE EXTENSION pg_visibility;
CREATE TABLE products (product_id text PRIMARY KEY, price numeric NOT NULL) WITH (autovacuum_enabled=false);
INSERT INTO products VALUES ('P7',20.00);
CREATE INDEX products_cover ON products(product_id) INCLUDE(price);
VACUUM (FREEZE) products;
SELECT 'initial',tuple_count,dead_tuple_count FROM pgstattuple('products');
SELECT 'initial-map',* FROM pg_visibility_map_summary('products');
"""
 out=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql=setup)
 reader=subprocess.Popen([BIN+'/psql','-XAt','-v','ON_ERROR_STOP=1'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,env=env)
 def read_sql(sql):
  reader.stdin.write(sql+'\n\\echo END_R32\n'); reader.stdin.flush()
  lines=[]
  while True:
   line=reader.stdout.readline()
   if line.strip()=='END_R32': return ''.join(lines)
   if not line: raise RuntimeError('reader ended')
   lines.append(line)
 out+=read_sql("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; SELECT 'report-before',price FROM products;")
 out+=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql="UPDATE products SET price=25 WHERE product_id='P7'; VACUUM (VERBOSE, TRUNCATE OFF) products; SELECT 'held',tuple_count,dead_tuple_count FROM pgstattuple('products'); SELECT 'held-map',* FROM pg_visibility_map_summary('products'); SET enable_seqscan=off; EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) SELECT price FROM products WHERE product_id='P7';")
 out+=read_sql("SELECT 'report-after-vacuum',price FROM products; COMMIT;")
 reader.stdin.close(); reader.wait(timeout=10)
 out+=run('psql','-XAt','-v','ON_ERROR_STOP=1',sql="VACUUM (FREEZE, VERBOSE, TRUNCATE OFF) products; SELECT 'released',tuple_count,dead_tuple_count FROM pgstattuple('products'); SELECT 'released-map',* FROM pg_visibility_map_summary('products'); SELECT 'xid-age',age(relfrozenxid) FROM pg_class WHERE oid='products'::regclass; SET enable_seqscan=off; EXPLAIN (ANALYZE, BUFFERS, TIMING OFF) SELECT price FROM products WHERE product_id='P7';")
 out+=run('psql','-XAt','-c','select version(); show block_size;')
 pathlib.Path('evidence/native.txt').write_text(out)
 pathlib.Path('evidence/environment.json').write_text(json.dumps({'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':run('postgres','--version').strip(),'endpoint':'owned private Unix socket; TCP disabled','ownership':'SHOW data_directory matched generated private data path','fixture':'scratch P7 20→25; Repeatable Read report retains old version during first vacuum; freeze and visibility inspected','cleanup':'fast stop and remove owned directory in finally'},indent=2))
 print(out)
finally:
 if started: run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
 shutil.rmtree(base)
