#!/usr/bin/env python3
"""Owned local CockroachDB purchase drill. Python 3 + psycopg[binary]==3.3.6.
Run: python purchase.py --cockroach /absolute/path/to/cockroach
Never accepts an existing database URL. No payment provider is contacted.
"""
import argparse, json, os, pathlib, random, shutil, socket, subprocess, tempfile, time
import psycopg
from psycopg.types.json import Jsonb

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--cockroach',required=True);args=parser.parse_args()
 binary=str(pathlib.Path(args.cockroach).resolve())
 for key in list(os.environ):
  if key.startswith(('PG','COCKROACH')): del os.environ[key]
 os.environ['COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING']='true'
 def port():
  with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
 root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r45-owned-'));marker=root/'owner';marker.write_text('r45-purchase')
 sql_port=port();http_port=port();proc=None;conns=[]
 report={'started':time.time(),'version':subprocess.check_output([binary,'version'],text=True),'psycopg':psycopg.__version__,'tests':{}}
 url=f'postgresql://root@127.0.0.1:{sql_port}/defaultdb?sslmode=disable&connect_timeout=2'
 def connect():
  c=psycopg.connect(url,autocommit=True);conns.append(c)
  if 'cluster_id' in report:assert str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0])==report['cluster_id']
  c.execute("SET statement_timeout='15s'")
  return c
 def reset(c):
  c.execute('TRUNCATE purchase_requests, order_items, orders, products')
  c.execute("INSERT INTO products VALUES ('P3',12),('P7',1),('P9',4)")
 payload={'customer_id':1,'lines':[['P3',2,'4.50'],['P7',1,'20.00']]}
 def state(c):
  return {'stock':c.execute('SELECT product_id,stock FROM products ORDER BY product_id').fetchall(),'orders':c.execute('SELECT order_id,customer_id,status FROM orders ORDER BY order_id').fetchall(),'lines':[(a,b,d,e,str(f)) for a,b,d,e,f in c.execute('SELECT order_id,line_no,product_id,quantity,unit_price FROM order_items ORDER BY order_id,line_no').fetchall()],'requests':c.execute('SELECT request_key,order_id FROM purchase_requests ORDER BY request_key').fetchall()}
 def reserve(c,pid,qty):
  if not c.execute('UPDATE products SET stock=stock-%s WHERE product_id=%s AND stock >= %s RETURNING product_id',(qty,pid,qty)).fetchone():raise ValueError('insufficient stock')
 def body(c,key,body_payload,order=103,customer=1,inject=False):
  claimed=c.execute('INSERT INTO purchase_requests VALUES (%s,%s,%s) ON CONFLICT (request_key) DO NOTHING RETURNING request_key',(key,Jsonb(body_payload),order)).fetchone()
  if not claimed:
   row=c.execute('SELECT payload,order_id FROM purchase_requests WHERE request_key=%s',(key,)).fetchone()
   if row is None:raise RuntimeError('unresolved request; do not reserve stock')
   if row[0]!=body_payload:raise ValueError('conflicting payload')
   return row[1]
  reserve(c,'P3',2)
  if inject:c.execute("SELECT crdb_internal.force_retry('1h')")
  reserve(c,'P7',1)
  c.execute("INSERT INTO orders VALUES (%s,%s,'pending')",(order,customer))
  c.execute('INSERT INTO order_items VALUES (%s,1,\'P7\',1,20.00),(%s,2,\'P3\',2,4.50)',(order,order))
  return order
 def purchase(c,key='purchase-mina-103',body_payload=None,inject_first=False):
  body_payload=payload if body_payload is None else body_payload;errors=[]
  deadline=time.monotonic()+15
  for attempt in range(5):
   try:
    c.execute('BEGIN ISOLATION LEVEL SERIALIZABLE')
    result=body(c,key,body_payload,inject=inject_first and attempt==0)
    c.execute('COMMIT')
    return result,errors
   except psycopg.Error as error:
    c.execute('ROLLBACK')
    if error.sqlstate!='40001':raise
    errors.append(error.sqlstate)
    if attempt==4 or time.monotonic()>=deadline:raise
    time.sleep(random.uniform(.01,.03)*(2**attempt))
   except BaseException:
    c.execute('ROLLBACK');raise
  raise AssertionError('unreachable')
 try:
  log=open(root/'server.log','w')
  proc=subprocess.Popen([binary,'start-single-node','--insecure','--listen-addr',f'127.0.0.1:{sql_port}','--http-addr',f'127.0.0.1:{http_port}','--store',f'path={root}/store,size=1GiB','--cache=128MiB','--max-sql-memory=128MiB'],stdout=log,stderr=subprocess.STDOUT)
  for _ in range(100):
   if proc.poll() is not None:raise RuntimeError((root/'server.log').read_text())
   try:c=connect();break
   except psycopg.OperationalError:time.sleep(.1)
  else:raise RuntimeError('owned instance not ready')
  listeners=subprocess.check_output(['lsof','-nP',f'-iTCP:{sql_port}','-sTCP:LISTEN','-t'],text=True).split()
  assert set(listeners)=={str(proc.pid)} and marker.read_text()=='r45-purchase'
  report['cluster_id']=str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0]);report['endpoint']=url
  c.execute('CREATE TABLE products (product_id STRING PRIMARY KEY,stock INT NOT NULL CHECK(stock>=0))')
  c.execute('CREATE TABLE orders (order_id INT PRIMARY KEY,customer_id INT NOT NULL,status STRING NOT NULL)')
  c.execute('CREATE TABLE order_items (order_id INT REFERENCES orders,line_no INT,product_id STRING REFERENCES products,quantity INT CHECK(quantity>0),unit_price DECIMAL(8,2),PRIMARY KEY(order_id,line_no))')
  c.execute('CREATE TABLE purchase_requests (request_key STRING PRIMARY KEY,payload JSONB NOT NULL,order_id INT NOT NULL)')
  reset(c)
  # Counterexample: suffix-only replay after a known abort omits the tea update.
  try:
   c.execute('BEGIN');reserve(c,'P3',2);c.execute("SELECT crdb_internal.force_retry('1h')")
  except psycopg.Error as e:
   assert e.sqlstate=='40001';c.execute('ROLLBACK')
  c.execute('BEGIN');reserve(c,'P7',1);c.execute("INSERT INTO orders VALUES (103,1,'pending')");c.execute("INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.5)");c.execute('COMMIT')
  report['tests']['unsafe_suffix']=state(c);assert report['tests']['unsafe_suffix']['stock'][0][1]==12
  reset(c)
  result,errors=purchase(c,inject_first=True)
  assert result==103 and errors==['40001']
  correct=state(c);assert correct['stock']==[('P3',10),('P7',0),('P9',4)] and correct['orders']==[(103,1,'pending')] and correct['lines']==[(103,1,'P7',1,'20.00'),(103,2,'P3',2,'4.50')] and correct['requests']==[('purchase-mina-103',103)]
  report['tests']['whole_retry']={'retry_errors':errors,'state':correct}
  # Successful COMMIT is deliberately withheld from the simulated caller.
  # A fresh connection resolves the same key, never running stock work again.
  other=connect();assert purchase(other)[0]==103 and state(other)==correct
  report['tests']['withheld_commit_reply']={'state_unchanged':True,'returned_order':103,'fault':'caller-boundary reply withholding, not native 40003'}
  changed=dict(payload);changed['customer_id']=2
  try:purchase(other,body_payload=changed)
  except ValueError as e:assert str(e)=='conflicting payload'
  else:raise AssertionError('payload mismatch accepted')
  assert state(other)==correct;report['tests']['payload_conflict']='rejected without change'
  # Separate alternative history: connection closes before COMMIT.
  reset(c);pending=connect();pending.execute('BEGIN');body(pending,'purchase-mina-103',payload);pending.close()
  assert purchase(c)[0]==103 and state(c)==correct
  report['tests']['disconnect_before_commit']={'replayed_once':True,'state':state(c)}
  report['success']=True
 finally:
  for c in conns:
   if not c.closed:c.close()
  if proc is not None:
   assert marker.read_text()=='r45-purchase';proc.terminate()
   try:proc.wait(timeout=15)
   except subprocess.TimeoutExpired:proc.kill();proc.wait(timeout=10)
  report['finished']=time.time();report['cleanup']='owned connections closed, process stopped, temporary store removed'
  shutil.rmtree(root)
  print(json.dumps(report,indent=2))
if __name__=='__main__':main()
