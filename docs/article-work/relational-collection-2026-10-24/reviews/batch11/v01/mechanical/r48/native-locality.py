#!/usr/bin/env python3
"""Owned six-process CockroachDB25.4.17 locality inspection, no regional fault test.
Requires psycopg[binary]==3.3.6. python native-locality.py --cockroach PATH.
Only fresh loopback endpoints accepted; all created resources cleaned in finally.
"""
import argparse,json,os,pathlib,shutil,socket,subprocess,tempfile,time,sys
import psycopg

def main():
 a=argparse.ArgumentParser();a.add_argument('--cockroach',required=True);args=a.parse_args();binary=str(pathlib.Path(args.cockroach).resolve())
 for k in list(os.environ):
  if k.startswith(('PG','COCKROACH')):del os.environ[k]
 os.environ['COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING']='true'
 def port():
  with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
 root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r48-owned-'));(root/'owner').write_text('r48-locality')
 ports=[]
 while len(ports)<12:
  p=port()
  if p not in ports:ports.append(p)
 nodes=[{'region':region,'zone':f'z{i%2+1}','port':ports[2*i],'http':ports[2*i+1]} for i,region in enumerate(['eu-north','eu-north','eu-west','eu-west','us-east','us-east'])]
 procs=[];clients=[];logs=[]
 report={'started':time.time(),'version':subprocess.check_output([binary,'version'],text=True),'psycopg':psycopg.__version__,'nodes':nodes,'outputs':[]}
 def verify(n,proc):
  assert (root/'owner').read_text()=='r48-locality'
  assert set(subprocess.check_output(['lsof','-nP',f'-iTCP:{n["port"]}','-sTCP:LISTEN','-t'],text=True).split())=={str(proc.pid)}
 def conn(i):
  verify(nodes[i],procs[i]);p=nodes[i]['port'];c=psycopg.connect(f'postgresql://root@127.0.0.1:{p}/defaultdb?sslmode=disable&connect_timeout=2',autocommit=True);clients.append(c)
  if 'cluster' in report:assert str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0])==report['cluster']
  c.execute("SET statement_timeout='30s'");return c
 def query(c,s):
  cur=c.execute(s);return {'columns':[d.name for d in cur.description] if cur.description else [],'rows':cur.fetchall() if cur.description else []}
 try:
  join=','.join(f'127.0.0.1:{n["port"]}' for n in nodes[:3])
  for i,n in enumerate(nodes):
   log=open(root/f'node{i}.log','w');logs.append(log)
   proc=subprocess.Popen([binary,'start','--insecure','--listen-addr',f'127.0.0.1:{n["port"]}','--http-addr',f'127.0.0.1:{n["http"]}','--join',join,'--locality',f'region={n["region"]},zone={n["zone"]}','--store','type=mem,size=1GiB','--cache=64MiB','--max-sql-memory=64MiB'],stdout=log,stderr=subprocess.STDOUT);procs.append(proc);n['pid']=proc.pid
  for i,n in enumerate(nodes):
   for _ in range(150):
    if procs[i].poll() is not None:raise RuntimeError((root/f'node{i}.log').read_text())
    try:verify(n,procs[i]);break
    except (AssertionError,subprocess.CalledProcessError):time.sleep(.1)
   else:raise RuntimeError('owned listener not ready')
  subprocess.run([binary,'init','--insecure','--host',f'127.0.0.1:{nodes[0]["port"]}'],check=True,timeout=30,stdout=sys.stderr,stderr=sys.stderr)
  for _ in range(100):
   try:c=conn(0);break
   except psycopg.OperationalError:time.sleep(.1)
  else:raise RuntimeError('SQL not ready')
  report['cluster']=str(c.execute('SELECT crdb_internal.cluster_id()').fetchone()[0])
  report['license_key_present']=bool(c.execute('SHOW CLUSTER SETTING enterprise.license').fetchone()[0])
  report['licensing_basis']='fresh ephemeral cluster, documented seven-day no-key grace; no key installed or registration performed'
  for i in range(1,6):
   cc=conn(i);assert str(cc.execute('SELECT crdb_internal.cluster_id()').fetchone()[0])==report['cluster']
  report['gossip_nodes']=query(c,'SELECT node_id,address,locality FROM crdb_internal.gossip_nodes ORDER BY node_id')
  statements=(pathlib.Path(__file__).resolve().parents[1]/'src/components/relational-collection/r48/downloads/locality.sql').read_text()
  for s in statements.split(';'):
   if s.strip():
    print(s.strip().splitlines()[-1],file=sys.stderr,flush=True);report['outputs'].append({'sql':s,**query(c,s)})
  # Inspect convergence rather than treating accepted policy as placement evidence.
  deadline=time.monotonic()+45
  while True:
   result=query(c,'SHOW RANGES FROM TABLE locality_orders WITH DETAILS')
   rows=[dict(zip(result['columns'],r)) for r in result['rows']]
   if rows and all(len(r.get('voting_replicas',[]))==5 for r in rows):break
   if time.monotonic()>deadline:
    report['placement_at_deadline']=result
    report['stores']=query(c,'SELECT * FROM crdb_internal.kv_store_status')
    raise AssertionError('five voters not observed within45s')
   time.sleep(.5)
  report['converged_orders']=result
  try:
   c.execute("INSERT INTO locality_orders(crdb_region,shop_id,order_id,customer_id,status) VALUES ('eu-west',10,103,1,'pending')")
  except psycopg.errors.UniqueViolation as e:report['cross_region_duplicate_sqlstate']=e.sqlstate
  else:raise AssertionError('duplicate identity accepted')
  assert c.execute('SELECT count(*),sum(order_id) FROM locality_orders').fetchone()==(3,306)
  report['success']=True
 finally:
  for c in clients:
   if not c.closed:c.close()
  assert (root/'owner').read_text()=='r48-locality'
  for proc in procs:proc.terminate()
  for proc in procs:
   try:proc.wait(timeout=5)
   except subprocess.TimeoutExpired:proc.kill();proc.wait(timeout=10)
  for l in logs:l.close()
  shutil.rmtree(root);report['finished']=time.time();report['cleanup']='owned clients/six processes/stores removed';print(json.dumps(report,indent=2,default=str))
if __name__=='__main__':main()
