import os,pathlib,subprocess,tempfile,shutil,json,time
pathlib.Path('evidence').mkdir(exist_ok=True)
B=pathlib.Path('/opt/homebrew/opt/postgresql@18/bin');E={k:v for k,v in os.environ.items() if not k.startswith('PG')};E.update(PGCONNECT_TIMEOUT='3',PSQLRC='/dev/null')
root=pathlib.Path(tempfile.mkdtemp(prefix='sc-r38-owned-'));old=root/'old';copy=root/'copy';sock=root/'socket';sock.mkdir(mode=0o700);r={'scope':'owned local physical primary/standby; no independent failure domain','root':str(root)}
def run(args,check=True,timeout=30):
 q=subprocess.run([str(x) for x in args],env=E,text=True,capture_output=True,timeout=timeout)
 if check and q.returncode:raise RuntimeError(q.stdout+q.stderr)
 return q
def sql(s,p=55440):return run([B/'psql','-X','-h',sock,'-p',p,'-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-At','-c',s]).stdout.strip()
def own(d,p):assert sql('SHOW data_directory',p)==str(d) and sql('SHOW port',p)==str(p) and sql('SELECT current_user',p)=='drill'
def config(d,p):
 with (d/'postgresql.conf').open('a') as f:f.write("\nlisten_addresses=''\nunix_socket_directories='"+str(sock)+"'\nport="+str(p)+"\nwal_level=replica\nfull_page_writes=on\nfsync=on\n")
def start(d):run([B/'pg_ctl','-D',d,'-l',root/(d.name+'.log'),'-w','start'])
def stop(d):return run([B/'pg_ctl','-D',d,'-m','fast','-w','stop'],False)
def wait(s,p,want='t'):
 for _ in range(200):
  if sql(s,p)==want:return
  time.sleep(.05)
 raise RuntimeError('condition not reached: '+s)
def backup(d,p,name):
 run([B/'pg_basebackup','-d','host='+str(sock)+' port='+str(p)+' user=drill application_name='+name,'-D',d,'-R','-X','stream','-C','-S',name,'-c','fast'])
try:
 r['version']=run([B/'postgres','--version']).stdout.strip();run([B/'initdb','-D',old,'-U','drill','-A','trust','--no-locale','--encoding=UTF8']);config(old,55440);start(old);own(old,55440)
 sql("CREATE TABLE products(product_id text PRIMARY KEY,stock int CHECK(stock>=0));INSERT INTO products VALUES('P3',12),('P7',1);CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int,status text);CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));CREATE TABLE scratch(label text PRIMARY KEY);")
 backup(copy,55440,'r38copy');config(copy,55441);start(copy);own(copy,55441);assert sql('SELECT pg_is_in_recovery()',55441)=='t'
 wait("SELECT count(*)=1 FROM pg_stat_replication WHERE application_name='r38copy'",55440)
 sql("ALTER SYSTEM SET synchronous_standby_names='FIRST 1 (r38copy)'");sql('SELECT pg_reload_conf()');wait("SELECT sync_state='sync' FROM pg_stat_replication WHERE application_name='r38copy'",55440)
 sql('SELECT pg_wal_replay_pause()',55441);wait("SELECT pg_get_wal_replay_pause_state()='paused'",55441)
 sql("BEGIN;SET LOCAL synchronous_commit=on;UPDATE products SET stock=stock-2 WHERE product_id='P3';UPDATE products SET stock=stock-1 WHERE product_id='P7';INSERT INTO orders VALUES(103,1,'pending');INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.5);COMMIT;")
 barrier=sql('SELECT pg_current_wal_flush_lsn()');r['on_barrier']=barrier
 wait("SELECT flush_lsn>='"+barrier+"'::pg_lsn FROM pg_stat_replication WHERE application_name='r38copy'",55440)
 r['on_paused']={'primary':sql("SELECT sent_lsn,write_lsn,flush_lsn,replay_lsn,sync_state FROM pg_stat_replication WHERE application_name='r38copy'"),'standby':sql('SELECT pg_last_wal_receive_lsn(),pg_last_wal_replay_lsn()',55441),'order_count':sql('SELECT count(*) FROM orders WHERE order_id=103',55441)}
 assert r['on_paused']['order_count']=='0'
 apply=subprocess.Popen([str(B/'psql'),'-X','-h',str(sock),'-p','55440','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-c',"SET synchronous_commit=remote_apply;INSERT INTO scratch VALUES('apply-commit');"],env=E,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 wait("SELECT count(*)=1 FROM pg_stat_activity WHERE wait_event='SyncRep'",55440)
 r['remote_apply_wait']={'source_visible':sql("SELECT count(*) FROM scratch WHERE label='apply-commit'"),'standby_visible':sql("SELECT count(*) FROM scratch WHERE label='apply-commit'",55441),'client_still_waiting':apply.poll() is None}
 sql('SELECT pg_wal_replay_resume()',55441);aout,aerr=apply.communicate(timeout=15);assert apply.returncode==0,aerr
 wait("SELECT count(*)=1 FROM scratch WHERE label='apply-commit'",55441)
 r['after_replay']={'stock':sql('SELECT product_id,stock FROM products ORDER BY product_id',55441),'order':sql('TABLE orders',55441),'lines':sql('SELECT count(*) FROM order_items',55441)}
 own(copy,55441);stop(copy)
 sql("BEGIN;SET LOCAL synchronous_commit=local;INSERT INTO scratch VALUES('local-only');COMMIT;")
 r['closed_old_tail']=sql('SELECT label FROM scratch ORDER BY label');r['old_flush']=sql('SELECT pg_current_wal_flush_lsn()')
 own(old,55440);stop(old)
 unreachable=run([B/'psql','-X','-h',sock,'-p','55440','-U','drill','-d','postgres','-c','SELECT 1'],False);assert unreachable.returncode!=0 and not (old/'postmaster.pid').exists();r['fence']='old process stopped; private endpoint unavailable; no supervisor in fixture'
 start(copy);own(copy,55441);run([B/'pg_ctl','-D',copy,'-w','promote']);wait('SELECT NOT pg_is_in_recovery()',55441)
 r['promoted']={'order':sql('TABLE orders',55441),'lines':sql('SELECT count(*) FROM order_items',55441),'stock':sql('SELECT product_id,stock FROM products ORDER BY product_id',55441),'local_only_count':sql("SELECT count(*) FROM scratch WHERE label='local-only'",55441),'timeline':sql('SELECT timeline_id FROM pg_control_checkpoint()',55441)}
 assert r['promoted']['local_only_count']=='0' and r['promoted']['lines']=='2' and r['promoted']['stock']=='P3|10\nP7|0'
 # The discarded anonymous local-only scratch row is preserved as evidence above, never silently merged.
 assert not (old/'postmaster.pid').exists();shutil.rmtree(old)
 backup(old,55441,'r38return');config(old,55440);start(old);own(old,55440);wait('SELECT pg_is_in_recovery()',55440)
 sql("INSERT INTO scratch VALUES('new-authority')",55441);wait("SELECT count(*)=1 FROM scratch WHERE label='new-authority'",55440)
 write=run([B/'psql','-X','-h',sock,'-p','55440','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-c',"INSERT INTO scratch VALUES('wrong-writer')"],False)
 assert write.returncode and 'read-only' in write.stderr
 r['rejoined']={'in_recovery':sql('SELECT pg_is_in_recovery()',55440),'new_write_replayed':sql("SELECT count(*) FROM scratch WHERE label='new-authority'",55440),'write_rejection':write.stderr.strip()}
 r['acceptance']='PASS: on flushed remotely before replay; remote_apply waited; fenced promotion lost declared local-only scratch tail; complete purchase retained; old host rebuilt as read-only standby'
finally:
 for d in [old,copy]:
  if d.exists():stop(d)
 for p in root.glob('*.log'):pathlib.Path('evidence',p.name).write_text(p.read_text())
 r['cleanup']=all(not(d/'postmaster.pid').exists() for d in [old,copy]);pathlib.Path('evidence/results.json').write_text(json.dumps(r,indent=2)+'\n')
 if r['cleanup']:shutil.rmtree(root)
print(json.dumps(r,indent=2))
