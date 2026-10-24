#!/usr/bin/env python3
"""CockroachDB25.4 owned isolation/history drill. Requires psycopg[binary]==3.3.6.
python read-contracts.py --cockroach /absolute/path/to/cockroach
Never connects to an existing service. macOS verification uses lsof.
"""
import argparse,json,os,pathlib,shutil,socket,subprocess,tempfile,time
import psycopg
from psycopg import sql

def main():
 a=argparse.ArgumentParser();a.add_argument('--cockroach',required=True);args=a.parse_args();binary=str(pathlib.Path(args.cockroach).resolve())
 for k in list(os.environ):
  if k.startswith(('PG','COCKROACH')):del os.environ[k]
 os.environ['COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING']='true'
 def port():
  with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
 root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r46-owned-'));(root/'owner').write_text('r46-reads');p=port();h=port();proc=None;clients=[]
 report={'started':time.time(),'version':subprocess.check_output([binary,'version'],text=True),'psycopg':psycopg.__version__,'tests':{}}
 url=f'postgresql://root@127.0.0.1:{p}/defaultdb?sslmode=disable&connect_timeout=2'
 def conn():
  c=psycopg.connect(url,autocommit=True);clients.append(c)
  if 'cluster' in report:assert str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0])==report['cluster']
  c.execute("SET statement_timeout='15s'");return c
 try:
  log=open(root/'server.log','w');proc=subprocess.Popen([binary,'start-single-node','--insecure','--listen-addr',f'127.0.0.1:{p}','--http-addr',f'127.0.0.1:{h}','--store',f'path={root}/store,size=1GiB','--cache=128MiB','--max-sql-memory=128MiB'],stdout=log,stderr=subprocess.STDOUT)
  for _ in range(100):
   try:c=conn();break
   except psycopg.OperationalError:
    if proc.poll() is not None:raise RuntimeError((root/'server.log').read_text())
    time.sleep(.1)
  else:raise RuntimeError('not ready')
  assert set(subprocess.check_output(['lsof','-nP',f'-iTCP:{p}','-sTCP:LISTEN','-t'],text=True).split())=={str(proc.pid)}
  assert (root/'owner').read_text()=='r46-reads'
  report['cluster']=str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0]);report['endpoint']=url
  c.execute('CREATE TABLE duty(session_id STRING,instructor_id STRING,on_duty BOOL NOT NULL,PRIMARY KEY(session_id,instructor_id))')
  c.execute("INSERT INTO duty VALUES('S502','I1',true),('S502','I2',true)")
  for level in ('READ COMMITTED','SERIALIZABLE'):
   c.execute('UPDATE duty SET on_duty=true');x=conn();y=conn()
   for client in (x,y):client.execute(f'BEGIN ISOLATION LEVEL {level}')
   actual=[client.execute('SHOW transaction_isolation').fetchone()[0] for client in (x,y)]
   assert all(v.lower()==level.lower() for v in actual),actual
   reads=[client.execute("SELECT count(*) FROM duty WHERE session_id='S502' AND on_duty").fetchone()[0] for client in (x,y)]
   assert reads==[2,2]
   x.execute("UPDATE duty SET on_duty=false WHERE session_id='S502' AND instructor_id='I1'");x.execute('COMMIT')
   error=None
   try:y.execute("UPDATE duty SET on_duty=false WHERE session_id='S502' AND instructor_id='I2'");y.execute('COMMIT')
   except psycopg.Error as e:error=e.sqlstate;y.execute('ROLLBACK')
   remaining=c.execute("SELECT count(*) FROM duty WHERE on_duty AND session_id='S502'").fetchone()[0]
   if level=='READ COMMITTED':assert error is None and remaining==0
   else:
    assert error=='40001' and remaining==1
    y.execute('BEGIN ISOLATION LEVEL SERIALIZABLE')
    assert y.execute("SELECT count(*) FROM duty WHERE on_duty AND session_id='S502'").fetchone()[0]==1
    y.execute('COMMIT') # application refuses to remove the last instructor
   report['tests'][level]={'actual_isolation':actual,'initial_counts':reads,'second_error':error,'remaining':remaining}
  c.execute('CREATE TABLE products(product_id STRING PRIMARY KEY,stock INT NOT NULL)');c.execute("INSERT INTO products VALUES('P3',12),('P7',1),('P9',4)")
  c.execute('CREATE TABLE orders(order_id INT PRIMARY KEY,customer_id INT,status STRING)')
  c.execute('CREATE TABLE order_items(order_id INT,line_no INT,product_id STRING,quantity INT,unit_price DECIMAL(8,2),PRIMARY KEY(order_id,line_no))')
  # Ensure the convenience timestamp does not precede this just-created schema.
  time.sleep(5)
  before=c.execute('SELECT cluster_logical_timestamp()').fetchone()[0]
  c.execute('BEGIN');c.execute("UPDATE products SET stock=stock-2 WHERE product_id='P3'");c.execute("UPDATE products SET stock=stock-1 WHERE product_id='P7'");c.execute("INSERT INTO orders VALUES(103,1,'pending')");c.execute("INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.5)");c.execute('COMMIT')
  def view(client):return {'stock':client.execute('SELECT product_id,stock FROM products ORDER BY product_id').fetchall(),'orders':client.execute('SELECT order_id FROM orders').fetchall(),'line_count':client.execute('SELECT count(*) FROM order_items').fetchone()[0]}
  fresh=view(c);assert fresh=={'stock':[('P3',10),('P7',0),('P9',4)],'orders':[(103,)],'line_count':2}
  c.execute('BEGIN');c.execute(sql.SQL('SET TRANSACTION AS OF SYSTEM TIME {}').format(sql.Literal(str(before))));old=view(c);c.execute('COMMIT')
  assert old=={'stock':[('P3',12),('P7',1),('P9',4)],'orders':[],'line_count':0}
  c.execute('BEGIN');c.execute('SET TRANSACTION AS OF SYSTEM TIME follower_read_timestamp()');convenience=view(c);c.execute('COMMIT');assert convenience==old
  c.execute('BEGIN');c.execute(sql.SQL('SET TRANSACTION AS OF SYSTEM TIME {}').format(sql.Literal(str(before))))
  try:c.execute("UPDATE products SET stock=stock-1 WHERE product_id='P7'")
  except psycopg.Error as e:readonly=e.sqlstate;c.execute('ROLLBACK')
  else:raise AssertionError('historical write succeeded')
  assert readonly=='25006'
  bounded=c.execute("SELECT stock FROM products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'").fetchone()[0]
  assert bounded in (0,1)
  try:c.execute("SELECT stock FROM products AS OF SYSTEM TIME with_max_staleness('10s')")
  except psycopg.Error as e:unsupported=e.sqlstate
  else:raise AssertionError('multirow bounded read unexpectedly allowed; recheck article')
  assert unsupported=='0A000'
  report['tests']['history']={'before_hlc':str(before),'current':fresh,'exact_before':old,'follower_timestamp_view':convenience,'historical_write_error':readonly,'bounded_point_stock':bounded,'bounded_multirow_error':unsupported,'follower_routing':'not established: single node'}
  report['success']=True
 finally:
  for c in clients:
   if not c.closed:c.close()
  if proc is not None:
   assert (root/'owner').read_text()=='r46-reads';proc.terminate()
   try:proc.wait(timeout=15)
   except subprocess.TimeoutExpired:proc.kill();proc.wait(timeout=10)
  shutil.rmtree(root);report['finished']=time.time();report['cleanup']='owned clients/process/store removed';print(json.dumps(report,indent=2))
if __name__=='__main__':main()
