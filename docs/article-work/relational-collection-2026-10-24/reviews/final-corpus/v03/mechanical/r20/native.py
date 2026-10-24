import subprocess,tempfile,os,shutil,json,time
from pathlib import Path
BIN='/opt/homebrew/opt/postgresql@18/bin/';base=Path(tempfile.mkdtemp(prefix='r20-owned-',dir='/private/tmp'));primary=base/'primary';standby=base/'standby';sock=base/'p';sock.mkdir();ssock=base/'s';ssock.mkdir();log=[];reader=None
env={k:v for k,v in os.environ.items() if not k.startswith('PG')};env.update(PGHOST=str(sock),PGPORT='56420',PGUSER='r20_owner',PGDATABASE='postgres',PGCONNECT_TIMEOUT='5');senv=dict(env,PGHOST=str(ssock),PGPORT='56440')
def run(a,e=None):
 p=subprocess.run(a,env=e or env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True,timeout=30);log.append({'command':a,'output':p.stdout});return p.stdout

def sql(q,e=None):return run([BIN+'psql','-X','-At','-v','ON_ERROR_STOP=1','-c',q],e)
def wait(q,want,e):
 deadline=time.monotonic()+10
 while time.monotonic()<deadline:
  v=sql(q,e).strip()
  if v==want:return v
  time.sleep(.05)
 raise RuntimeError('bounded wait failed: '+q)
try:
 run([BIN+'initdb','-D',str(primary),'-U','r20_owner','-A','trust','--no-locale'])
 with (primary/'postgresql.conf').open('a') as f:f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=56420\n")
 run([BIN+'pg_ctl','-D',str(primary),'-l',str(base/'primary.log'),'-w','start']);assert sql('SHOW data_directory').strip()==str(primary)
 sql("CREATE TABLE products(id text PRIMARY KEY,stock int CHECK(stock>=0)); INSERT INTO products VALUES('P3',12),('P7',1); CREATE TABLE orders(id int PRIMARY KEY,customer_id int,status text); CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no))")
 run([BIN+'pg_basebackup','-D',str(standby),'-R','-X','stream','-c','fast'])
 with (standby/'postgresql.conf').open('a') as f:f.write(f"\nport=56440\nunix_socket_directories='{ssock}'\n")
 run([BIN+'pg_ctl','-D',str(standby),'-l',str(base/'standby.log'),'-w','start'],senv);assert sql('SHOW data_directory',senv).strip()==str(standby);assert sql('SELECT pg_is_in_recovery()',senv).strip()=='t'
 sql('SELECT pg_wal_replay_pause()',senv);wait("SELECT pg_get_wal_replay_pause_state()",'paused',senv)
 reader=subprocess.Popen([BIN+'psql','-X','-Atq','-v','ON_ERROR_STOP=1'],env=senv,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 def read(q):
  reader.stdin.write(q+';\n\\echo READY\n');reader.stdin.flush();a=[]
  while True:
   line=reader.stdout.readline()
   if not line:raise RuntimeError('reader closed')
   if line.strip()=='READY':break
   a.append(line)
  out=''.join(a).strip();log.append({'reader':q,'output':out});return out
 read('BEGIN ISOLATION LEVEL REPEATABLE READ');assert read('SELECT count(*) FROM orders')=='0'
 sql("BEGIN; UPDATE products SET stock=stock-1 WHERE id='P7'; UPDATE products SET stock=stock-2 WHERE id='P3'; INSERT INTO orders VALUES(103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50); COMMIT")
 target=sql('SELECT pg_current_wal_flush_lsn()').strip()
 wait(f"SELECT pg_last_wal_receive_lsn()>='{target}'::pg_lsn",'t',senv)
 stale=sql('SELECT count(*) FROM orders WHERE id=103',senv).strip();assert stale=='0'
 positions=sql('SELECT pg_last_wal_receive_lsn(),pg_last_wal_replay_lsn()',senv).strip()
 sql('SELECT pg_wal_replay_resume()',senv);wait(f"SELECT pg_last_wal_replay_lsn()>='{target}'::pg_lsn",'t',senv)
 fresh=sql('SELECT count(*) FROM orders WHERE id=103',senv).strip();assert fresh=='1'
 old=read('SELECT count(*) FROM orders WHERE id=103');assert old=='0';read('COMMIT');reader.stdin.close();reader.wait(timeout=5);reader=None
 assert sql('SELECT count(*) FROM order_items WHERE order_id=103',senv).strip()=='2'
 stock=sql('SELECT * FROM products ORDER BY id',senv).strip();assert stock=='P3|10\nP7|0'
 result={'version':sql('SELECT version()').strip(),'target_lsn':target,'paused_receive_and_replay':positions,'paused_order103_count':stale,'after_replay_fresh_snapshot_count':fresh,'after_replay_old_snapshot_count':old,'standby_stock':stock,'boundary':'Owned local physical primary/standby processes on one machine; deliberate replay pause, not measured network lag or separate storage failure.'}
 Path('evidence/native-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
finally:
 if reader:reader.terminate();reader.wait(timeout=5)
 for d in [standby,primary]:
  if d.exists():subprocess.run([BIN+'pg_ctl','-D',str(d),'-m','immediate','-w','stop'],env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 for n in ['primary','standby']:
  if (base/(n+'.log')).exists():Path('evidence/'+n+'.log').write_text((base/(n+'.log')).read_text())
 Path('evidence/native-commands.json').write_text(json.dumps(log,indent=2));shutil.rmtree(base)
