import os
for k in list(os.environ):
 if k.startswith(('PG','COCKROACH')) or k in ('DATABASE_URL','SQL_URL'):os.environ.pop(k)
import psycopg,subprocess,pathlib,tempfile,uuid,socket,time,json,shutil,threading
B='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach'
out=pathlib.Path(__file__).parent; root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r50-owned-'));token=str(uuid.uuid4());(root/'OWNER').write_text(token);ext=root/'backups';ext.mkdir();logs=[];procs=[]
def port():
 s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p
def start(name):
 p=port();h=port();store=root/name
 f=open(root/(name+'.log'),'w');proc=subprocess.Popen([B,'start-single-node','--insecure','--listen-addr=127.0.0.1:'+str(p),'--http-addr=127.0.0.1:'+str(h),'--store=path='+str(store)+',size=1GiB','--external-io-dir='+str(ext),'--cache=64MiB','--max-sql-memory=64MiB'],stdout=f,stderr=f);procs.append(proc)
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
 c,p,proc=start('source');source_id=q(c,'SELECT crdb_internal.cluster_id()')[0][0];q(c,'SHOW CLUSTER SETTING enterprise.license')
 q(c,'CREATE DATABASE classes');q(c,'USE classes');q(c,'CREATE TABLE owner_marker(token STRING PRIMARY KEY)');q(c,'INSERT INTO owner_marker VALUES(%s)',(token,));assert q(c,'SELECT token FROM owner_marker')[0][0]==token
 q(c,'CREATE TABLE sessions(session_id STRING PRIMARY KEY,capacity INT NOT NULL,remaining INT NOT NULL CHECK(remaining>=0 AND remaining<=capacity))');q(c,"INSERT INTO sessions VALUES('S503',3,3)")
 q(c,'CREATE TABLE bookings(booking_id STRING PRIMARY KEY,session_id STRING REFERENCES sessions,customer_id INT NOT NULL)');q(c,'CREATE TABLE requests(request_key STRING PRIMARY KEY,fingerprint STRING NOT NULL,booking_id STRING NOT NULL)');q(c,'CREATE TABLE gate(id INT PRIMARY KEY,open BOOL NOT NULL,serial INT NOT NULL)');q(c,'INSERT INTO gate VALUES(1,true,0)');q(c,'CREATE TABLE history(event_id STRING PRIMARY KEY,kind STRING)')
 q(c,"BACKUP DATABASE classes INTO 'nodelocal://1/drill' WITH revision_history")
 target=str(q(c,'SELECT cluster_logical_timestamp()')[0][0]);logs.append({'pre_mistake_target_hlc':target})
 with c.transaction():q(c,"UPDATE sessions SET capacity=30 WHERE session_id='S503'");q(c,"INSERT INTO history VALUES('mistake-r50','erroneous capacity increase')")
 def admit(conn,key='booking-edda-B203',fp='S503/customer3/B203',bid='B203'):
  for attempt in range(6):
   try:
    with conn.transaction():
     gate=q(conn,'UPDATE gate SET serial=serial+1 WHERE id=1 AND open RETURNING serial')
     if not gate:return 'fenced'
     found=q(conn,'SELECT fingerprint,booking_id FROM requests WHERE request_key=%s',(key,))
     if found:
      if found[0]!=(fp,bid):raise ValueError('request key conflict')
      return 'existing'
     r=q(conn,"UPDATE sessions SET remaining=remaining-1 WHERE session_id='S503' AND remaining>0 RETURNING remaining")
     if not r:raise ValueError('no capacity')
     q(conn,'INSERT INTO bookings VALUES(%s,%s,3)',(bid,'S503'));q(conn,'INSERT INTO requests VALUES(%s,%s,%s)',(key,fp,bid));return 'created'
   except psycopg.errors.SerializationFailure:
    time.sleep(.05)
  raise RuntimeError('retry cap')
 assert admit(c)=='created';assert q(c,"SELECT remaining FROM sessions WHERE session_id='S503'")==[(2,)]
 q(c,"BACKUP DATABASE classes INTO LATEST IN 'nodelocal://1/drill' WITH revision_history")
 q(c,"SHOW BACKUP FROM LATEST IN 'nodelocal://1/drill' WITH check_files")
 # Close every fixture admission path before enumerating excluded valid requests.
 fence=psycopg.connect(host='127.0.0.1',port=p,user='root',dbname='classes',sslmode='disable',autocommit=True)
 race=psycopg.connect(host='127.0.0.1',port=p,user='root',dbname='classes',sslmode='disable',application_name='r50-fence-racer',autocommit=True)
 fence.execute('BEGIN');fence.execute('UPDATE gate SET open=false WHERE id=1');started=threading.Event();result=[]
 def racer():started.set();result.append(admit(race,key='racing-request',fp='not-admitted',bid='scratch'))
 t=threading.Thread(target=racer);t.start();started.wait(3);time.sleep(.5);assert not result
 q(c,"SELECT application_name,query FROM [SHOW CLUSTER STATEMENTS] WHERE application_name='r50-fence-racer'")
 fence.execute('COMMIT');t.join(10);assert result==['fenced'];race.close();fence.close()
 assert q(c,'SELECT open FROM gate')==[(False,)];accepted=q(c,'SELECT request_key,fingerprint,booking_id FROM requests');assert len(accepted)==1
 logs.append({'fence_racer':result,'accepted_closed_history':accepted});stop(c,proc)
 d,dp,dproc=start('candidate');assert q(d,'SELECT crdb_internal.cluster_id()')[0][0]!=source_id
 # A missing required data object must be detected before the successful restore.
 ssts=list(ext.rglob('*.sst'));assert ssts;missing=ssts[0];hidden=missing.with_suffix('.hidden');missing.rename(hidden)
 try:assert q(d,"SHOW BACKUP FROM LATEST IN 'nodelocal://1/drill' WITH check_files",ok=False) is None
 finally:hidden.rename(missing)
 q(d,"RESTORE DATABASE classes FROM LATEST IN 'nodelocal://1/drill' AS OF SYSTEM TIME '"+target+"'")
 q(d,'USE classes');assert q(d,'SELECT token FROM owner_marker')[0][0]==token
 assert q(d,"SELECT remaining FROM sessions WHERE session_id='S503'")==[(3,)]
 assert q(d,'SELECT * FROM bookings')==[];assert q(d,"SELECT * FROM history WHERE event_id='mistake-r50'")==[]
 # Restore is isolated; establish a closed candidate gate before controlled reconciliation.
 q(d,'UPDATE gate SET open=false WHERE id=1')
 def reconcile(key,fp,bid):
  with d.transaction():
   found=q(d,'SELECT fingerprint,booking_id FROM requests WHERE request_key=%s',(key,))
   if found:
    if found[0]!=(fp,bid):raise ValueError('request key conflict')
    return 'existing'
   assert q(d,"UPDATE sessions SET remaining=remaining-1 WHERE session_id='S503' AND remaining>0 RETURNING remaining")
   q(d,'INSERT INTO bookings VALUES(%s,%s,3)',(bid,'S503'));q(d,'INSERT INTO requests VALUES(%s,%s,%s)',(key,fp,bid));return 'created'
 assert reconcile(*accepted[0])=='created';assert reconcile(*accepted[0])=='existing'
 try:reconcile(accepted[0][0],'different-payload','B203');raise AssertionError('conflict accepted')
 except ValueError:pass
 assert q(d,'SELECT * FROM bookings')==[('B203','S503',3)]
 assert q(d,"SELECT remaining FROM sessions WHERE session_id='S503'")==[(2,)]
 assert q(d,'SELECT capacity-remaining=(SELECT count(*) FROM bookings) FROM sessions')==[(True,)]
 logs.append({'external_effects':'fixture executes no providers/messages; no external effect generated','status':'passed','source_stopped_before_restore':True})
 out.joinpath('result.json').write_text(json.dumps(logs,default=str,indent=2));print('PASS full/incremental chain, HLC target, missing-file detection, fence race, B203 once-only reconciliation')
finally:
 for proc in procs:
  if proc.poll() is None:proc.terminate()
 for proc in procs:
  try:proc.wait(timeout=12)
  except subprocess.TimeoutExpired:proc.kill();proc.wait()
 if not (out/'result.json').exists():(out/'failure.json').write_text(json.dumps(logs,default=str,indent=2))
 assert (root/'OWNER').read_text()==token;shutil.rmtree(root);print('CLEANED owned stores, backup files and processes')
