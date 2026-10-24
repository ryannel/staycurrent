import subprocess,tempfile,os,shutil,json,time
from pathlib import Path
BIN='/opt/homebrew/opt/postgresql@18/bin/';base=Path(tempfile.mkdtemp(prefix='r19-owned-',dir='/private/tmp'));data=base/'source';restored=base/'restored';archive=base/'archive';archive.mkdir();sock=base/'s';sock.mkdir();rsock=base/'r';rsock.mkdir();log=[];clients=[]
env={k:v for k,v in os.environ.items() if not k.startswith('PG')};env.update(PGHOST=str(sock),PGPORT='56419',PGUSER='r19_owner',PGDATABASE='postgres',PGCONNECT_TIMEOUT='5')
def run(a,check=True,e=None):
 r=subprocess.run(a,env=e or env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=check,timeout=30);log.append({'command':a,'output':r.stdout,'returncode':r.returncode});return r.stdout

def sql(q,e=None):return run([BIN+'psql','-X','-At','-v','ON_ERROR_STOP=1','-c',q],e=e)
def session():
 p=subprocess.Popen([BIN+'psql','-X','-Atq','-v','ON_ERROR_STOP=1'],env=env,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);clients.append(p);return p

def send(p,q):
 p.stdin.write(q+';\n\\echo READY\n');p.stdin.flush();out=[]
 while True:
  line=p.stdout.readline()
  if not line:raise RuntimeError('session ended')
  if line.strip()=='READY':break
  out.append(line)
 log.append({'session':q,'output':''.join(out)})
try:
 run([BIN+'initdb','-D',str(data),'-U','r19_owner','-A','trust','--no-locale'])
 with (data/'postgresql.conf').open('a') as f:f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=56419\narchive_mode=on\narchive_command='cp %p {archive}/%f'\n")
 run([BIN+'pg_ctl','-D',str(data),'-l',str(base/'source.log'),'-w','start']);assert sql('SHOW data_directory').strip()==str(data)
 core=json.loads(Path('src/lib/relational-collection/core.json').read_text())
 sql("CREATE TABLE products(product_id text PRIMARY KEY,stock int CHECK(stock>=0)); CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int,status text); CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no)); CREATE TABLE gate(singleton bool PRIMARY KEY,open bool); INSERT INTO gate VALUES(true,true); CREATE TABLE accepted(request_key text PRIMARY KEY,order_id int,customer_id int,quantity int,price numeric(8,2));")
 for p in core['products']:sql(f"INSERT INTO products VALUES('{p['product_id']}',{p['stock_after_103']})")
 for o in core['orders']:sql(f"INSERT INTO orders VALUES({o['order_id']},{o['customer_id']},'{o['status']}')")
 for i in core['order_items']:sql(f"INSERT INTO order_items VALUES({i['order_id']},{i['line_no']},'{i['product_id']}',{i['quantity']},{i['unit_price']})")
 sql("""CREATE FUNCTION purchase(k text,oid int,cid int) RETURNS text LANGUAGE plpgsql AS $$
DECLARE a accepted; isopen bool;
BEGIN
 SELECT open INTO isopen FROM gate WHERE singleton FOR SHARE;
 IF NOT isopen THEN RAISE EXCEPTION 'source fenced'; END IF;
 SELECT * INTO a FROM accepted WHERE request_key=k;
 IF FOUND THEN IF a.order_id<>oid OR a.customer_id<>cid OR a.quantity<>1 OR a.price<>4.50 THEN RAISE EXCEPTION 'payload conflict'; END IF; RETURN 'existing'; END IF;
 UPDATE products SET stock=stock-1 WHERE product_id='P3' AND stock>=1;
 IF NOT FOUND THEN RAISE EXCEPTION 'no stock'; END IF;
 INSERT INTO orders VALUES(oid,cid,'pending'); INSERT INTO order_items VALUES(oid,1,'P3',1,4.50);
 INSERT INTO accepted VALUES(k,oid,cid,1,4.50); RETURN 'created';
END $$""")
 run([BIN+'pg_basebackup','-D',str(restored),'-X','stream','-c','fast'])
 target=sql("SELECT pg_create_restore_point('r19_before_bad')").strip()
 bad=sql("BEGIN; SELECT pg_current_xact_id(); DELETE FROM order_items WHERE order_id=103; DELETE FROM orders WHERE order_id=103; COMMIT").strip()
 sql("SELECT purchase('purchase-edda-107',107,3)")
 # Hold the fence row update, then start a request that must wait for its outcome.
 fence=session();send(fence,'BEGIN; UPDATE gate SET open=false WHERE singleton')
 racer=subprocess.Popen([BIN+'psql','-X','-At','-v','ON_ERROR_STOP=1','-c',"SELECT purchase('rejected-race',108,3)"],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);clients.append(racer)
 deadline=time.monotonic()+10
 while time.monotonic()<deadline:
  n=sql("SELECT count(*) FROM pg_stat_activity WHERE pid<>pg_backend_pid() AND wait_event_type='Lock' AND query LIKE '%rejected-race%'").strip()
  if n=='1':break
  time.sleep(.05)
 else:raise RuntimeError('race did not reach gate lock')
 send(fence,'COMMIT');fence.stdin.close();fence.wait(timeout=5)
 raceout=racer.communicate(timeout=5)[0];assert racer.returncode!=0 and 'source fenced' in raceout
 accepted=sql('SELECT * FROM accepted ORDER BY request_key').strip();assert accepted=='purchase-edda-107|107|3|1|4.50'
 sql('SELECT pg_switch_wal()')
 deadline=time.monotonic()+10
 while time.monotonic()<deadline:
  if sql("SELECT count(*) FROM pg_ls_dir('pg_wal/archive_status') n WHERE n LIKE '%.ready'").strip()=='0':break
  time.sleep(.1)
 else:raise RuntimeError('archive not complete')
 run([BIN+'pg_ctl','-D',str(data),'-m','fast','-w','stop'])
 # Restore has no streaming connection to source and can use only saved base+archive.
 with (restored/'postgresql.conf').open('a') as f:f.write(f"\nport=56439\nunix_socket_directories='{rsock}'\narchive_mode=off\nrestore_command='cp {archive}/%f %p'\nrecovery_target_name='r19_before_bad'\nrecovery_target_action='promote'\n")
 (restored/'recovery.signal').touch();renv=dict(env,PGHOST=str(rsock),PGPORT='56439')
 run([BIN+'pg_ctl','-D',str(restored),'-l',str(base/'restored.log'),'-w','start'],e=renv);assert sql('SHOW data_directory',renv).strip()==str(restored)
 before=sql("SELECT string_agg(order_id::text,',' ORDER BY order_id) FROM orders",renv).strip();assert before=='101,102,103'
 restored_lines=sql('SELECT product_id,quantity,unit_price FROM order_items WHERE order_id=103 ORDER BY line_no',renv).strip();assert restored_lines=='P7|1|20.00\nP3|2|4.50'
 assert sql("SELECT stock FROM products WHERE product_id='P3'",renv).strip()=='10'
 # Counterexample: stopping at the good target alone omits valid 107.
 assert sql('SELECT count(*) FROM orders WHERE order_id=107',renv).strip()=='0'
 first=sql("SELECT purchase('purchase-edda-107',107,3)",renv).strip();again=sql("SELECT purchase('purchase-edda-107',107,3)",renv).strip();assert first=='created' and again=='existing'
 final=sql("SELECT stock FROM products WHERE product_id='P3'",renv).strip();assert final=='9'
 assert sql('SELECT count(*) FROM order_items WHERE order_id=107 AND line_no=1 AND product_id=\'P3\' AND quantity=1 AND unit_price=4.50',renv).strip()=='1'
 result={'version':sql('SELECT version()',renv).strip(),'target':{'name':'r19_before_bad','lsn':target,'meaning':'stop at named restore point before bad transaction; timestamp labels are application scenario labels, not captured commit times'},'bad_transaction_output':bad,'source_fenced':True,'race_result':raceout.strip(),'closed_accepted_history':accepted,'restored_before_reconciliation':before,'restored_103_lines':restored_lines,'first_reconcile':first,'repeat_reconcile':again,'final_P3_stock':final,'external_effects':'No provider action executed; drill explicitly has no external effect to reconcile. Production acceptance must check provider/event authorities separately.','archive_files':sorted(p.name for p in archive.iterdir()),'boundary':'One machine, basebackup and WAL archive restored with source stopped; no offsite/lost-host/RPO/RTO certification.'}
 Path('evidence/native-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
finally:
 for p in clients:
  if p.poll() is None:p.terminate();p.wait(timeout=5)
 for d in [data,restored]:
  if d.exists():subprocess.run([BIN+'pg_ctl','-D',str(d),'-m','immediate','-w','stop'],env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 for name in ['source','restored']:
  if (base/(name+'.log')).exists():Path('evidence/'+name+'.log').write_text((base/(name+'.log')).read_text())
 Path('evidence/native-commands.json').write_text(json.dumps(log,indent=2));shutil.rmtree(base)
