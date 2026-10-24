import subprocess,tempfile,os,shutil,json,time
from pathlib import Path
BIN='/opt/homebrew/opt/postgresql@18/bin/';base=Path(tempfile.mkdtemp(prefix='r21-owned-',dir='/private/tmp'));primary=base/'old';candidate=base/'candidate';sock=base/'p';sock.mkdir();csock=base/'c';csock.mkdir();log=[]
env={k:v for k,v in os.environ.items() if not k.startswith('PG')};env.update(PGHOST=str(sock),PGPORT='56421',PGUSER='r21_owner',PGDATABASE='postgres',PGCONNECT_TIMEOUT='2');cenv=dict(env,PGHOST=str(csock),PGPORT='56441')
def run(a,e=None,check=True):
 r=subprocess.run(a,env=e or env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=check,timeout=30);log.append({'command':a,'output':r.stdout,'returncode':r.returncode});return r.stdout

def sql(q,e=None):return run([BIN+'psql','-X','-At','-v','ON_ERROR_STOP=1','-c',q],e)
def ctl(d,*args,e=None):return run([BIN+'pg_ctl','-D',str(d),*args],e)
def wait(q,want,e):
 deadline=time.monotonic()+10
 while time.monotonic()<deadline:
  if sql(q,e).strip()==want:return
  time.sleep(.05)
 raise RuntimeError('wait failed: '+q)

def clone(source_env,dest,socket,port):
 run([BIN+'pg_basebackup','-D',str(dest),'-R','-X','stream','-c','fast'],source_env)
 with (dest/'postgresql.conf').open('a') as f:f.write(f"\nport={port}\nunix_socket_directories='{socket}'\n")
try:
 run([BIN+'initdb','-D',str(primary),'-U','r21_owner','-A','trust','--no-locale'])
 with (primary/'postgresql.conf').open('a') as f:f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=56421\n")
 ctl(primary,'-l',str(base/'old.log'),'-w','start');assert sql('SHOW data_directory').strip()==str(primary)
 sql("CREATE TABLE scratch(branch text); CREATE TABLE products(id text PRIMARY KEY,stock int CHECK(stock>=0)); INSERT INTO products VALUES('P3',12),('P7',1); CREATE TABLE orders(id int PRIMARY KEY,customer_id int,status text); CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no)); CREATE TABLE requests(key text PRIMARY KEY,order_id int)")
 clone(env,candidate,csock,56441);ctl(candidate,'-l',str(base/'candidate.log'),'-w','start',e=cenv);assert sql('SHOW data_directory',cenv).strip()==str(candidate)
 # Explicit unsafe counterexample only on scratch state.
 ctl(candidate,'-w','promote',e=cenv)
 both=[sql('SELECT pg_is_in_recovery()',e).strip() for e in [env,cenv]];assert both==['f','f']
 sql("INSERT INTO scratch VALUES('old still writes')");sql("INSERT INTO scratch VALUES('candidate also writes')",cenv)
 unsafe={'both_writable':both,'old_scratch':sql('TABLE scratch').strip(),'candidate_scratch':sql('TABLE scratch',cenv).strip()}
 # Discard only the owned divergent scratch candidate, then start an independent proper drill.
 ctl(candidate,'-m','fast','-w','stop',e=cenv);shutil.rmtree(candidate);clone(env,candidate,csock,56441)
 # Clone remains stopped and cannot receive this acknowledged tail.
 sql("BEGIN; UPDATE products SET stock=stock-1 WHERE id='P7'; UPDATE products SET stock=stock-2 WHERE id='P3'; INSERT INTO orders VALUES(103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50); INSERT INTO requests VALUES('purchase-mina-103',103); COMMIT")
 source_tail=sql('SELECT pg_current_wal_flush_lsn()').strip()
 closed_history={'requests':sql('TABLE requests').strip(),'order':sql('TABLE orders').strip(),'lines':sql('SELECT * FROM order_items ORDER BY line_no').strip(),'stock':sql('SELECT * FROM products ORDER BY id').strip()}
 ctl(primary,'-m','fast','-w','stop') # Owned-process hard fence; no supervisor can restart this fixture.
 refusal=run([BIN+'psql','-X','-At','-c','SELECT 1'],check=False);assert 'No such file' in refusal or 'Connection refused' in refusal
 ctl(candidate,'-l',str(base/'candidate.log'),'-w','start',e=cenv)
 candidate_boundary=sql('SELECT pg_last_wal_receive_lsn(),pg_last_wal_replay_lsn()',cenv).strip()
 assert sql(f"SELECT (pg_last_wal_receive_lsn() IS NULL OR pg_last_wal_receive_lsn()<'{source_tail}'::pg_lsn) AND pg_last_wal_replay_lsn()<'{source_tail}'::pg_lsn",cenv).strip()=='t'
 ctl(candidate,'-w','promote',e=cenv)
 missing=sql('SELECT count(*) FROM orders WHERE id=103',cenv).strip();assert missing=='0'
 # Reconcile only from the closed, known complete single-client source history.
 reconcile="""DO $$ BEGIN IF NOT EXISTS(SELECT FROM requests WHERE key='purchase-mina-103') THEN
 UPDATE products SET stock=stock-1 WHERE id='P7' AND stock>=1; IF NOT FOUND THEN RAISE EXCEPTION 'mug invariant'; END IF;
 UPDATE products SET stock=stock-2 WHERE id='P3' AND stock>=2; IF NOT FOUND THEN RAISE EXCEPTION 'tea invariant'; END IF;
 INSERT INTO orders VALUES(103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50); INSERT INTO requests VALUES('purchase-mina-103',103);
 END IF; END $$"""
 sql(reconcile,cenv);sql(reconcile,cenv);assert sql('SELECT * FROM products ORDER BY id',cenv).strip()=='P3|10\nP7|0'
 assert sql('SELECT product_id,quantity,unit_price FROM order_items WHERE order_id=103 ORDER BY line_no',cenv).strip()=='P7|1|20.00\nP3|2|4.50'
 # Rejoin former primary from new authority, never restarting its divergent data as a writer.
 shutil.rmtree(primary);clone(cenv,primary,sock,56421);ctl(primary,'-l',str(base/'rejoined.log'),'-w','start')
 assert sql('SHOW data_directory').strip()==str(primary);assert sql('SELECT pg_is_in_recovery()').strip()=='t';assert sql('SELECT count(*) FROM orders WHERE id=103').strip()=='1'
 result={'version':sql('SELECT version()',cenv).strip(),'unsafe_counterexample':unsafe,'closed_single_client_history':closed_history,'old_endpoint_after_fence':refusal.strip(),'old_source_tail_lsn':source_tail,'candidate_receive_replay_before_promotion':candidate_boundary,'candidate_missing103_before_reconcile':missing,'candidate_after_reconcile':sql('SELECT * FROM products ORDER BY id',cenv).strip(),'repeat_reconcile_order_count':sql('SELECT count(*) FROM orders WHERE id=103',cenv).strip(),'former_primary_rejoined_in_recovery':sql('SELECT pg_is_in_recovery()').strip(),'external_effects':'None generated by this fixture; acknowledged SQL history only.','boundary':'Owned local processes/private Unix sockets on one host, no supervisor; stopping old process is an effective fixture fence, not proof of production power/network fencing or regional failover.'}
 Path('evidence/native-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
finally:
 for d in [primary,candidate]:
  if d.exists():subprocess.run([BIN+'pg_ctl','-D',str(d),'-m','immediate','-w','stop'],env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 for n in ['old','candidate','rejoined']:
  if (base/(n+'.log')).exists():Path('evidence/'+n+'.log').write_text((base/(n+'.log')).read_text())
 Path('evidence/native-commands.json').write_text(json.dumps(log,indent=2));shutil.rmtree(base)
