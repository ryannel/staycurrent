import os
for k in list(os.environ):
 if k.startswith(('PG','COCKROACH')) or k in ('DATABASE_URL','SQL_URL'):os.environ.pop(k)
import psycopg,subprocess,pathlib,tempfile,uuid,socket,time,json,shutil,threading,decimal,datetime
from psycopg.types.json import Jsonb
B='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach'
PG='/opt/homebrew/opt/postgresql@18/bin/'
out=pathlib.Path(__file__).parent; root=pathlib.Path(tempfile.mkdtemp(prefix='r53-',dir='/private/tmp'));token=str(uuid.uuid4());(root/'OWNER').write_text(token);logs=[];procs=[];pg_started=False;conns=[]
def port():
 s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p
def q(c,s,args=None,ok=True):
 try:
  cur=c.execute(s,args);r=cur.fetchall() if cur.description else [];logs.append({'sql':s,'args':args,'rows':r});return r
 except Exception as e:
  logs.append({'sql':s,'error':str(e),'sqlstate':getattr(e,'sqlstate',None)})
  if ok:raise
  return None
def connect(kind,app='r53'):
 c=psycopg.connect(host=str(root/'socket') if kind=='pg' else '127.0.0.1',port=pgport if kind=='pg' else crport,user=os.environ.get('USER') if kind=='pg' else 'root',dbname='postgres' if kind=='pg' else 'migration',sslmode='disable',connect_timeout=3,autocommit=True,application_name=app);conns.append(c);return c
def owned(c):assert q(c,'SELECT token FROM owner_marker')==[(token,)]
cols={'customers':'customer_id,name','products':'product_id,name,price,stock','orders':'order_id,customer_id,placed_at,status','order_items':'order_id,line_no,product_id,quantity,unit_price','payments':'payment_id,order_id,amount,method','purchase_requests':'request_key,payload,order_id'}
keys={'order_items':'order_id,line_no','purchase_requests':'request_key'}
def snapshot(c):return {t:q(c,'SELECT '+v+' FROM '+t+' ORDER BY '+keys.get(t,v.split(',')[0])) for t,v in cols.items()}
def canonical(data):
 def val(x):
  if isinstance(x,decimal.Decimal):return format(x,'.2f')
  if isinstance(x,datetime.datetime):return x.astimezone(datetime.timezone.utc).isoformat()
  if isinstance(x,dict):return {k:val(v) for k,v in sorted(x.items())}
  if isinstance(x,(list,tuple)):return [val(v) for v in x]
  return x
 return val(data)
def insert_rows(c,table,rows):
 for row in rows:
  a=[Jsonb(x) if isinstance(x,dict) else x for x in row]
  q(c,'INSERT INTO '+table+' ('+cols[table]+') VALUES ('+','.join(['%s']*len(a))+')',a)
payload={'customer_id':1,'lines':[{'product_id':'P3','quantity':2,'unit_price':'4.50'},{'product_id':'P7','quantity':1,'unit_price':'20.00'}]}
def purchase(c,body=payload,controlled=False,fail_after_tea=False,claimed=None,release=None):
 for attempt in range(8):
  try:
   with c.transaction():
    if not controlled and not q(c,'UPDATE gate SET serial=serial+1 WHERE id=1 AND open RETURNING serial'):return 'fenced'
    found=q(c,'INSERT INTO purchase_requests(request_key,payload,order_id) VALUES(%s,%s,NULL) ON CONFLICT(request_key) DO NOTHING RETURNING request_key',('purchase-mina-103',Jsonb(body)))
    if not found:
     previous=q(c,'SELECT payload,order_id FROM purchase_requests WHERE request_key=%s',('purchase-mina-103',))
     assert previous and previous[0][1] is not None,'incomplete committed request'
     if previous[0][0]!=body:raise ValueError('conflicting payload')
     return previous[0][1]
    if claimed is not None:
     claimed.set();assert release.wait(10)
    for product,qty in [('P3',2),('P7',1)]:
     assert q(c,'UPDATE products SET stock=stock-%s WHERE product_id=%s AND stock>=%s RETURNING stock',(qty,product,qty)), 'no stock'
     if fail_after_tea:raise ValueError('deliberate refusal after tea')
    q(c,'INSERT INTO orders VALUES(103,1,%s,%s)',('2026-10-20T10:15:00Z','pending'))
    q(c,"INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50)")
    q(c,'UPDATE purchase_requests SET order_id=103 WHERE request_key=%s',('purchase-mina-103',))
    assert q(c,'SELECT count(*) FROM purchase_requests WHERE order_id IS NULL')==[(0,)]
   return 103
  except psycopg.errors.SerializationFailure:
   logs.append({'whole_transaction_retry':attempt+1})
 raise RuntimeError('retry budget exhausted')
def fence(c,kind):
 owned(c);other=connect(kind,'r53-fence-racer');answer=[];errors=[]
 def racer():
  try:answer.append(purchase(other))
  except Exception as e:errors.append(str(e))
 with c.transaction():
  q(c,'UPDATE gate SET open=false WHERE id=1');t=threading.Thread(target=racer);t.start();deadline=time.time()+10
  while True:
   if kind=='pg':r=q(c,"SELECT state,wait_event_type FROM pg_stat_activity WHERE application_name='r53-fence-racer'");waiting=any(x[1]=='Lock' for x in r)
   else:r=q(c,"SELECT query FROM [SHOW CLUSTER STATEMENTS] WHERE application_name='r53-fence-racer'");waiting=bool(r)
   if waiting:break
   assert time.time()<deadline;time.sleep(.1)
 t.join(15);assert not t.is_alive() and not errors and answer==['fenced'],(answer,errors)
 other.close();logs.append({'closed_history':kind,'racer':answer})
def report(c):
 r=q(c,"WITH totals AS (SELECT order_id,sum(quantity*unit_price) total FROM order_items GROUP BY order_id), paid AS (SELECT order_id,sum(amount) paid FROM payments GROUP BY order_id) SELECT o.order_id,t.total,coalesce(p.paid,0),t.total-coalesce(p.paid,0) due FROM orders o JOIN totals t USING(order_id) LEFT JOIN paid p USING(order_id) ORDER BY o.order_id")
 return [[x[0]]+[format(v,'.2f') for v in x[1:]] for x in r]
try:
 pv=subprocess.check_output([PG+'postgres','--version'],text=True);cv=subprocess.check_output([B,'version'],text=True);assert '18.6' in pv and 'v25.4.17' in cv;logs.append({'postgres':pv,'cockroach':cv,'driver':psycopg.__version__})
 (root/'socket').mkdir();subprocess.run([PG+'initdb','-D',str(root/'pg'),'-A','trust','--no-locale','-E','UTF8'],check=True,capture_output=True,text=True);pgport=port()
 subprocess.run([PG+'pg_ctl','-D',str(root/'pg'),'-l',str(root/'pg.log'),'-o',"-k "+str(root/'socket')+" -p "+str(pgport)+" -h '' -c shared_buffers=16MB -c max_connections=12",'-w','start'],check=True,capture_output=True,text=True);pg_started=True
 pid=int((root/'pg/postmaster.pid').read_text().splitlines()[0]);assert str(root/'pg') in subprocess.check_output(['ps','-p',str(pid),'-o','command='],text=True)
 source=connect('pg');assert pathlib.Path(q(source,'SHOW data_directory')[0][0]).resolve()==(root/'pg').resolve()
 crport=port();http=port();f=open(root/'cr.log','w');proc=subprocess.Popen([B,'start-single-node','--insecure','--listen-addr=127.0.0.1:'+str(crport),'--http-addr=127.0.0.1:'+str(http),'--store=path='+str(root/'cr')+',size=1GiB','--cache=64MiB','--max-sql-memory=256MiB'],stdout=f,stderr=f);procs.append(proc);deadline=time.time()+30
 while True:
  assert proc.poll() is None,(root/'cr.log').read_text()[-2000:]
  assert str(root/'cr') in subprocess.check_output(['ps','-p',str(proc.pid),'-o','command='],text=True)
  try:
   c=psycopg.connect(host='127.0.0.1',port=crport,user='root',dbname='defaultdb',sslmode='disable',connect_timeout=2,autocommit=True);q(c,'CREATE DATABASE migration');c.close();break
  except psycopg.OperationalError:assert time.time()<deadline;time.sleep(.2)
 target=connect('cr');q(target,'SHOW CLUSTER SETTING enterprise.license')
 ddl=["CREATE TABLE customers(customer_id INT4 PRIMARY KEY,name TEXT NOT NULL)","CREATE TABLE products(product_id TEXT PRIMARY KEY,name TEXT NOT NULL,price NUMERIC(8,2) NOT NULL CHECK(price>=0),stock INT4 NOT NULL CHECK(stock>=0))","CREATE TABLE orders(order_id INT4 PRIMARY KEY,customer_id INT4 NOT NULL REFERENCES customers,placed_at TIMESTAMPTZ NOT NULL,status TEXT NOT NULL CHECK(status IN ('pending','paid','cancelled')))","CREATE TABLE order_items(order_id INT4 REFERENCES orders,line_no INT4,product_id TEXT NOT NULL REFERENCES products,quantity INT4 NOT NULL CHECK(quantity>0),unit_price NUMERIC(8,2) NOT NULL,PRIMARY KEY(order_id,line_no))","CREATE TABLE payments(payment_id INT4 PRIMARY KEY,order_id INT4 NOT NULL REFERENCES orders,amount NUMERIC(8,2) NOT NULL CHECK(amount>0),method TEXT NOT NULL)","CREATE TABLE purchase_requests(request_key TEXT PRIMARY KEY,payload JSONB NOT NULL,order_id INT4 REFERENCES orders)"]
 for c in [source,target]:
  for s in ddl:q(c,s)
  q(c,'CREATE TABLE owner_marker(token TEXT PRIMARY KEY)');q(c,'INSERT INTO owner_marker VALUES(%s)',(token,));owned(c)
  q(c,'CREATE TABLE gate(id INT4 PRIMARY KEY,open BOOL NOT NULL,serial INT4 NOT NULL)');q(c,'INSERT INTO gate VALUES(1,%s,0)',(c is source,))
  q(c,'CREATE TABLE division_probe(n INT4 PRIMARY KEY)');q(c,'INSERT INTO division_probe VALUES(5)');logs.append({'division':q(c,'SELECT n/2 FROM division_probe'),'engine':'pg' if c is source else 'cr'})
 q(source,'CREATE TABLE deferred_probe(k INT PRIMARY KEY,order_id INT REFERENCES orders DEFERRABLE INITIALLY DEFERRED)')
 assert q(target,'CREATE TABLE deferred_probe(k INT PRIMARY KEY,order_id INT REFERENCES orders DEFERRABLE INITIALLY DEFERRED)',ok=False) is None
 core=json.loads((out.parent/'src/lib/relational-collection/core.json').read_text())
 for t in ['customers','products','orders','order_items','payments']:
  for row in core[t]:
   if t in ['orders','order_items'] and row['order_id']==103:continue
   values=[row['stock_before_103'] if k=='stock' else row[k] for k in cols[t].split(',')];insert_rows(source,t,[values])
 # Deliberate exception must roll back the request claim and first stock deduction.
 try:purchase(source,fail_after_tea=True);raise AssertionError('expected refusal')
 except ValueError:pass
 assert q(source,'SELECT stock FROM products WHERE product_id=%s',('P3',))==[(12,)] and q(source,'SELECT count(*) FROM purchase_requests')==[(0,)]
 fence(source,'pg')
 with source.transaction():
  q(source,'SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');base=snapshot(source)
 with target.transaction():
  for t,rows in base.items():insert_rows(target,t,rows)
 assert canonical(base)==canonical(snapshot(target));logs.append({'consistent_copy_equal':True,'table_counts':{t:len(r) for t,r in base.items()}})
 # Row-count equality alone misses this changed copied amount.
 with target.transaction():
  q(target,'UPDATE order_items SET unit_price=34.00 WHERE order_id=101 AND line_no=2');bad=snapshot(target);assert all(len(base[t])==len(bad[t]) for t in base) and canonical(base)!=canonical(bad)
  raise_rollback=False
  q(target,'UPDATE order_items SET unit_price=35.00 WHERE order_id=101 AND line_no=2')
 assert canonical(base)==canonical(snapshot(target));logs.append({'equal_count_wrong_price_detected':True})
 with target.transaction():
  assert q(target,"INSERT INTO order_items VALUES(999,1,'P3',1,4.50)",ok=False) is None
  # Psycopg transaction will fail on context exit after the expected error; rollback explicitly.
  target.execute('ROLLBACK')
 owned(target);q(target,'UPDATE gate SET open=true WHERE id=1')
 first=connect('cr','r53-first-purchase');second=connect('cr','r53-second-purchase');claimed=threading.Event();release=threading.Event();answers=[];errs=[]
 def overlap(conn,wait=False):
  try:answers.append(purchase(conn,claimed=claimed if wait else None,release=release if wait else None))
  except Exception as e:errs.append(str(e))
 a=threading.Thread(target=overlap,args=(first,True));a.start();assert claimed.wait(10);b=threading.Thread(target=overlap,args=(second,));b.start();deadline=time.time()+10
 while True:
  active=q(target,"SELECT query FROM [SHOW CLUSTER STATEMENTS] WHERE application_name='r53-second-purchase'")
  if active:break
  assert time.time()<deadline;time.sleep(.1)
 release.set();a.join(15);b.join(15);assert not a.is_alive() and not b.is_alive() and not errs and answers==[103,103],(answers,errs)
 logs.append({'overlapping_identical_requests':answers,'complete_transaction_retry_errors':sum('whole_transaction_retry' in r for r in logs)});first.close();second.close()
 after=snapshot(target);assert report(target)==[[r['order_id'],r['total'],r['paid'],r['due']] for r in core['report_totals']]
 assert purchase(target)==103 and canonical(snapshot(target))==canonical(after)
 try:purchase(target,{'customer_id':1,'lines':[]});raise AssertionError('expected conflicting reuse')
 except ValueError:pass
 assert canonical(snapshot(target))==canonical(after);logs.append({'missing_reply_injection':'caller acknowledgement deliberately withheld after actual successful purchase; repeat returns103 unchanged'})
 fence(target,'cr');closed=snapshot(target);assert q(source,'SELECT order_id FROM orders WHERE order_id=103')==[]
 # Reconciliation uses complete closed operation, not a route switch or individual row copy.
 owned(source);assert canonical(snapshot(source))==canonical(base);assert purchase(source,controlled=True)==103;once=snapshot(source);assert canonical(once)==canonical(closed)
 assert purchase(source,controlled=True)==103 and canonical(snapshot(source))==canonical(once)
 try:purchase(source,{'customer_id':1,'lines':[]},controlled=True);raise AssertionError('expected conflicting reuse')
 except ValueError:pass
 assert canonical(snapshot(source))==canonical(closed);assert q(source,'SELECT count(*) FROM purchase_requests WHERE order_id IS NULL')==[(0,)]
 assert q(source,'SELECT product_id,stock FROM products ORDER BY product_id')==[('P3',10),('P7',0),('P9',4)]
 assert report(source)==report(target);q(source,'UPDATE gate SET open=true WHERE id=1');assert purchase(source)==103;assert q(target,'SELECT open FROM gate')==[(False,)]
 logs.append({'status':'passed','authority':'PostgreSQL reopened only after equal closed operation history; Cockroach remains fenced','external_effects':'no provider calls, payments created or messages sent','scope':'paused-write mechanism test, not CDC or zero downtime; one host'})
 out.joinpath('result.json').write_text(json.dumps(logs,default=str,indent=2));print('PASS semantic probes, consistent copy, fenced cutover, request resolution and reconciled return')
finally:
 for c in conns:
  try:c.close()
  except Exception:pass
 for p in procs:
  if p.poll() is None:p.terminate()
 for p in procs:
  try:p.wait(timeout=15)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 if pg_started:
  assert (root/'OWNER').read_text()==token
  subprocess.run([PG+'pg_ctl','-D',str(root/'pg'),'-m','immediate','-w','stop'],capture_output=True,text=True,check=True)
 if not (out/'result.json').exists():out.joinpath('failure.json').write_text(json.dumps(logs,default=str,indent=2))
 assert (root/'OWNER').read_text()==token;shutil.rmtree(root);print('CLEANED owned PostgreSQL and CockroachDB processes and stores')
