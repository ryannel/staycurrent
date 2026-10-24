import os
for k in list(os.environ):
 if k.startswith(('PG','COCKROACH')) or k in ('DATABASE_URL','SQL_URL'):os.environ.pop(k)
import psycopg,subprocess,pathlib,tempfile,uuid,socket,time,json,shutil,threading
B='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach'
out=pathlib.Path(__file__).parent; root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r51-owned-'));token=str(uuid.uuid4());(root/'OWNER').write_text(token);ext=root/'backups';ext.mkdir();logs=[];procs=[]
def port():
 s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p
def start(name):
 p=port();h=port();store=root/name
 f=open(root/(name+'.log'),'w');proc=subprocess.Popen([B,'start-single-node','--insecure','--listen-addr=127.0.0.1:'+str(p),'--http-addr=127.0.0.1:'+str(h),'--store=path='+str(store)+',size=1GiB','--external-io-dir='+str(ext),'--cache=64MiB','--max-sql-memory=256MiB'],stdout=f,stderr=f);procs.append(proc)
 deadline=time.time()+30
 while True:
  assert proc.poll() is None,(root/(name+'.log')).read_text()[-3000:]
  cmd=subprocess.check_output(['ps','-p',str(proc.pid),'-o','command='],text=True);assert str(store) in cmd
  try:c=psycopg.connect(host='127.0.0.1',port=p,user='root',dbname='defaultdb',sslmode='disable',connect_timeout=2,autocommit=True);break
  except psycopg.OperationalError:
   assert time.time()<deadline;time.sleep(.2)
 return c,p,proc
def q(c,s,args=None,ok=True):
 try:
  cur=c.execute(s,args);r=cur.fetchall() if cur.description else [];logs.append({'sql':s,'params':args,'rows':r});return r
 except Exception as e:
  logs.append({'sql':s,'error':str(e),'sqlstate':getattr(e,'sqlstate',None)})
  if ok:raise
  return None
def stop(c,p):
 c.close();p.terminate()
 try:p.wait(timeout=12)
 except subprocess.TimeoutExpired:p.kill();p.wait()
try:
 v=subprocess.check_output([B,'version'],text=True);assert 'v25.4.17' in v;logs.append({'version':v,'driver':psycopg.__version__})
 c,p,proc=start('schema');q(c,'SHOW CLUSTER SETTING enterprise.license');q(c,'CREATE DATABASE schema_drill');q(c,'USE schema_drill');q(c,'CREATE TABLE owner_marker(token STRING PRIMARY KEY)');q(c,'INSERT INTO owner_marker VALUES(%s)',(token,));assert q(c,'SELECT token FROM owner_marker')[0][0]==token
 core=json.loads((pathlib.Path(__file__).parent.parent/'src/lib/relational-collection/core.json').read_text())
 q(c,'CREATE TABLE order_items(order_id INT,line_no INT,quantity INT NOT NULL,unit_price DECIMAL(8,2) NOT NULL,PRIMARY KEY(order_id,line_no))')
 for row in core['order_items']:q(c,'INSERT INTO order_items VALUES(%s,%s,%s,%s)',tuple(row[k] for k in ['order_id','line_no','quantity','unit_price']))
 q(c,'ALTER TABLE order_items ADD COLUMN unit_price_minor INT8 AS ((unit_price*100)::INT8) STORED')
 assert q(c,'SELECT sum(quantity*unit_price_minor) FROM order_items WHERE order_id=103')==[(2900,)]
 assert q(c,'SELECT count(*) FROM order_items WHERE unit_price_minor IS DISTINCT FROM unit_price*100')==[(0,)]
 assert q(c,'UPDATE order_items SET unit_price_minor=7 WHERE order_id=103',ok=False) is None
 q(c,'CREATE TABLE schema_load(id INT PRIMARY KEY,quantity INT NOT NULL,unit_price DECIMAL(8,2) NOT NULL)')
 q(c,'INSERT INTO schema_load SELECT i,1, CASE i%3 WHEN 0 THEN 4.50 WHEN 1 THEN 20.00 ELSE 35.00 END FROM generate_series(1,50000) AS g(i)')
 writer=psycopg.connect(host='127.0.0.1',port=p,user='root',dbname='schema_drill',sslmode='disable',autocommit=True);done=threading.Event();writes=[];errors=[]
 def work():
  i=0
  while not done.is_set():
   try:writer.execute('UPDATE schema_load SET quantity=quantity+1 WHERE id=%s',(i%50000+1,));writes.append(i)
   except psycopg.errors.SerializationFailure:pass
   except Exception as e:errors.append(str(e));break
   i+=1
 t=threading.Thread(target=work);t.start();time.sleep(.2);before=len(writes)
 ddl=psycopg.connect(host='127.0.0.1',port=p,user='root',dbname='schema_drill',sslmode='disable',autocommit=True)
 start_time=time.monotonic();q(ddl,'ALTER TABLE schema_load ADD COLUMN unit_price_minor INT8 AS ((unit_price*100)::INT8) STORED');elapsed=time.monotonic()-start_time;during=len(writes)-before;done.set();t.join(10);writer.close();ddl.close();assert not errors and during>0
 logs.append({'ddl_elapsed_seconds':elapsed,'concurrent_committed_updates':during,'fixture':'50000 anonymous line-shaped rows, id1..50000, quantity1, prices selected by id modulo3; not shop history or a benchmark'})
 assert q(c,'SELECT count(*) FROM schema_load WHERE unit_price_minor IS NULL OR unit_price_minor IS DISTINCT FROM unit_price*100')==[(0,)]
 q(c,"SELECT job_id,status,fraction_completed,error,description FROM [SHOW JOBS] WHERE description LIKE '%schema_load%' ORDER BY created")
 q(c,'CREATE TABLE import_keys(row_no INT PRIMARY KEY,source_id STRING NOT NULL)');q(c,"INSERT INTO import_keys VALUES(1,'duplicate'),(2,'duplicate')")
 assert q(c,'CREATE UNIQUE INDEX source_once ON import_keys(source_id)',ok=False) is None
 q(c,"SELECT job_id,status,fraction_completed,error,description FROM [SHOW JOBS] WHERE description LIKE '%source_once%' ORDER BY created")
 deadline=time.time()+30
 while True:
  ix=q(c,'SHOW INDEXES FROM import_keys')
  if all('source_once' not in r for r in ix):break
  assert time.time()<deadline;time.sleep(.2)
 # Explicit duplicate resolution in this anonymous fixture only.
 q(c,'DELETE FROM import_keys WHERE row_no=2');q(c,'CREATE UNIQUE INDEX source_once ON import_keys(source_id)')
 assert q(c,"INSERT INTO import_keys VALUES(3,'duplicate')",ok=False) is None
 q(c,'INSERT INTO import_keys VALUES(4,%s)',('distinct',));assert q(c,'SELECT source_id,count(*) FROM import_keys GROUP BY source_id ORDER BY source_id')==[('distinct',1),('duplicate',1)]
 q(c,"SELECT job_id,status,fraction_completed,error,description FROM [SHOW JOBS] WHERE description LIKE '%source_once%' ORDER BY created")
 logs.append({'status':'passed','cleanup_scope':'failed index absent from SHOW INDEXES before retry; no physical-GC timing claim'})
 out.joinpath('result.json').write_text(json.dumps(logs,default=str,indent=2));print('PASS computed backfill under concurrent updates, equivalence and failed/successful unique index acceptance')
finally:
 for proc in procs:
  if proc.poll() is None:proc.terminate()
 for proc in procs:
  try:proc.wait(timeout=12)
  except subprocess.TimeoutExpired:proc.kill();proc.wait()
 if not (out/'result.json').exists():(out/'failure.json').write_text(json.dumps(logs,default=str,indent=2))
 assert (root/'OWNER').read_text()==token;shutil.rmtree(root);print('CLEANED owned test process and stores')
