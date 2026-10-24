import os
for k in list(os.environ):
 if k.startswith(('PG','COCKROACH')) or k in ('DATABASE_URL','SQL_URL'):os.environ.pop(k)
import psycopg,subprocess,pathlib,tempfile,uuid,socket,time,json,shutil
NEW='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach';OLD='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.3.7.darwin-11.0-arm64/cockroach'
out=pathlib.Path(__file__).parent;root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r52-owned-'));token=str(uuid.uuid4());(root/'OWNER').write_text(token);logs=[];procs={};builds={}
def port():
 s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p
ports=[port() for _ in range(3)];http=[port() for _ in range(3)]
def launch(i,binary):
 store=root/('node'+str(i));f=open(root/('node'+str(i)+'-'+str(time.time_ns())+'.log'),'w')
 proc=subprocess.Popen([binary,'start','--insecure','--listen-addr=127.0.0.1:'+str(ports[i]),'--http-addr=127.0.0.1:'+str(http[i]),'--join=127.0.0.1:'+str(ports[0]),'--store=path='+str(store)+',size=1GiB','--cache=64MiB','--max-sql-memory=256MiB'],stdout=f,stderr=f);procs[i]=proc;builds[i]=binary;return proc
def conn(i=0,db='upgrade_drill'):
 proc=procs[i];assert proc.poll() is None
 cmd=subprocess.check_output(['ps','-p',str(proc.pid),'-o','command='],text=True);assert str(root/('node'+str(i))) in cmd
 return psycopg.connect(host='127.0.0.1',port=ports[i],user='root',dbname=db,sslmode='disable',connect_timeout=3,autocommit=True)
def q(c,s,args=None,ok=True):
 try:
  cur=c.execute(s,args);r=cur.fetchall() if cur.description else [];logs.append({'sql':s,'rows':r});return r
 except Exception as e:
  logs.append({'sql':s,'error':str(e),'sqlstate':getattr(e,'sqlstate',None)})
  if ok:raise
  return None
def waitready(i):
 deadline=time.time()+45
 while True:
  try:
   c=conn(i);r=q(c,'SELECT token FROM owner_marker');assert r==[(token,)];c.close();return
  except (psycopg.OperationalError,AssertionError):
   assert time.time()<deadline,'node failed to rejoin';time.sleep(.3)
def accept(label):
 with conn() as c:
  assert q(c,'SELECT token FROM owner_marker')==[(token,)]
  assert q(c,'SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103')==[(29,)]
  q(c,'UPDATE rehearsal_counter SET n=n+1 WHERE id=1')
  logs.append({'phase':label,'cluster_version':q(c,'SHOW CLUSTER SETTING version'),'builds':q(c,'SELECT node_id,build_tag FROM crdb_internal.gossip_nodes ORDER BY node_id')})
def health():
 with conn() as c:
  deadline=time.time()+60
  while True:
   r=q(c,'SELECT voting_replicas FROM [SHOW RANGES FROM DATABASE upgrade_drill]')
   if r and all(len(a[0])==3 for a in r):break
   assert time.time()<deadline;time.sleep(.3)
def replace(i,binary):
 health();proc=procs[i]
 cmd=[builds[i],'node','drain','--self','--shutdown','--insecure','--host=127.0.0.1:'+str(ports[i]),'--drain-wait=20s']
 r=subprocess.run(cmd,text=True,capture_output=True,timeout=40);logs.append({'drain_node':i,'code':r.returncode,'out':r.stdout,'err':r.stderr});assert r.returncode==0
 proc.wait(timeout=20);assert (root/'OWNER').read_text()==token;launch(i,binary);waitready(i);health()
try:
 for binary,expected in [(OLD,'v25.3.7'),(NEW,'v25.4.17')]:
  v=subprocess.check_output([binary,'version'],text=True);assert expected in v;logs.append({'binary':binary,'version':v})
 for i in range(3):launch(i,OLD)
 time.sleep(2);r=subprocess.run([OLD,'init','--insecure','--host=127.0.0.1:'+str(ports[0])],capture_output=True,text=True,timeout=30);assert r.returncode==0,r.stderr
 with conn(0,'defaultdb') as c:q(c,'CREATE DATABASE upgrade_drill');q(c,'USE upgrade_drill');q(c,'CREATE TABLE owner_marker(token STRING PRIMARY KEY)');q(c,'INSERT INTO owner_marker VALUES(%s)',(token,));q(c,'CREATE TABLE rehearsal_counter(id INT PRIMARY KEY,n INT)');q(c,'INSERT INTO rehearsal_counter VALUES(1,0)');q(c,'CREATE TABLE order_items(order_id INT,line_no INT,quantity INT,unit_price DECIMAL(8,2),PRIMARY KEY(order_id,line_no))');q(c,"INSERT INTO order_items VALUES(101,1,1,4.50),(101,2,1,35),(102,1,2,20),(103,1,1,20),(103,2,2,4.50)");q(c,'SHOW CLUSTER SETTING enterprise.license');q(c,'SET CLUSTER SETTING cluster.auto_upgrade.enabled=false');assert q(c,'SHOW CLUSTER SETTING cluster.auto_upgrade.enabled')==[(False,)]
 for i in range(3):waitready(i)
 health();accept('all old; finalisation disabled')
 replace(2,NEW);accept('mixed binaries; old cluster version')
 replace(2,OLD);accept('pre-finalisation rollback to old binary')
 for i in [2,1,0]:replace(i,NEW)
 accept('all new binaries; finalisation still disabled')
 with conn() as c:
  assert str(q(c,'SHOW CLUSTER SETTING version')[0][0]).startswith('25.3')
  result=q(c,"SET CLUSTER SETTING version='25.4'",ok=False)
  if result is None:
   logs.append({'finalisation':'blocked by actual capability; no post-final rollback claim'})
  else:
   deadline=time.time()+60
   while not str(q(c,'SHOW CLUSTER SETTING version')[0][0]).startswith('25.4'):
    assert time.time()<deadline;time.sleep(.3)
   logs.append({'finalisation':'observed25.4'})
 accept('final capability outcome and application acceptance')
 logs.append({'status':'passed','scope':'three processes on one host; no independent-failure-domain or production-load claim'})
 out.joinpath('result.json').write_text(json.dumps(logs,default=str,indent=2));print('PASS mixed binaries, pre-final rollback, new-binary acceptance and recorded finalisation capability')
finally:
 for proc in procs.values():
  if proc.poll() is None:proc.terminate()
 for proc in procs.values():
  try:proc.wait(timeout=15)
  except subprocess.TimeoutExpired:proc.kill();proc.wait()
 if not (out/'result.json').exists():(out/'failure.json').write_text(json.dumps(logs,default=str,indent=2))
 assert (root/'OWNER').read_text()==token;shutil.rmtree(root);print('CLEANED owned test processes and stores')
