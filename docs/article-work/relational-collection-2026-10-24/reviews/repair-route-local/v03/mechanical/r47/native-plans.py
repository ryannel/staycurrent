#!/usr/bin/env python3
"""CockroachDB25.4 owned isolation/history drill. Requires psycopg[binary]==3.3.6.
python native-plans.py --cockroach /absolute/path/to/cockroach
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
 root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r47-owned-'));(root/'owner').write_text('r47-reads');p=port();h=port();proc=None;clients=[]
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
  assert (root/'owner').read_text()=='r47-reads'
  report['cluster']=str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0]);report['endpoint']=url
  statements=(pathlib.Path(__file__).resolve().parents[1]/'src/components/relational-collection/r47/downloads/plans.sql').read_text()
  outputs=[]
  for statement in statements.split(';'):
   if statement.strip():
    print(statement.strip().splitlines()[-1],file=__import__('sys').stderr,flush=True)
    cur=c.execute(statement)
    outputs.append({'sql':statement,'rows':cur.fetchall() if cur.description else []})
  report['outputs']=outputs
  answers={}
  for index in ('perf_customer','perf_history','perf_cover'):
   answers[index]=c.execute(f"SELECT order_id,placed_at,status FROM perf_orders@{index} WHERE customer_id=42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00' ORDER BY placed_at DESC,order_id DESC LIMIT 10").fetchall()
  assert answers['perf_customer']==answers['perf_history']==answers['perf_cover']
  assert [r[0] for r in answers['perf_cover']]==list(range(59041,50040,-1000))
  report['answer']=[(a,b.isoformat(),d) for a,b,d in answers['perf_cover']]
  report['success']=True
 finally:
  for c in clients:
   if not c.closed:c.close()
  if proc is not None:
   assert (root/'owner').read_text()=='r47-reads';proc.terminate()
   try:proc.wait(timeout=15)
   except subprocess.TimeoutExpired:proc.kill();proc.wait(timeout=10)
  shutil.rmtree(root);report['finished']=time.time();report['cleanup']='owned clients/process/store removed';print(json.dumps(report,indent=2,default=str))
if __name__=='__main__':main()
