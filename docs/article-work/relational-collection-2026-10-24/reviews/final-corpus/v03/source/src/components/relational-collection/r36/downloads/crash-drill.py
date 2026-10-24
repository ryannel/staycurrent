import os, pathlib, subprocess, tempfile, json, shutil, time
pathlib.Path('evidence').mkdir(exist_ok=True)
B=pathlib.Path('/opt/homebrew/opt/postgresql@18/bin')
E={k:v for k,v in os.environ.items() if not k.startswith('PG')}
E.update(PGCONNECT_TIMEOUT='5', PSQLRC='/dev/null')
root=pathlib.Path(tempfile.mkdtemp(prefix='sc-r36-owned-')); data=root/'data'; sock=root/'socket'; sock.mkdir(mode=0o700)
log=root/'server.log'; out={'root':str(root),'scope':'owned local process crash; OS and storage remain running','versions':{}}
def run(args,check=True):
 r=subprocess.run([str(x) for x in args],env=E,text=True,capture_output=True,timeout=30)
 if check and r.returncode: raise RuntimeError(r.stdout+r.stderr)
 return r.stdout+r.stderr
def sql(s): return run([B/'psql','-X','-h',sock,'-p','55436','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-At','-c',s]).strip()
def own():
 assert sql('SHOW data_directory')==str(data)
 assert sql('SHOW port')=='55436'
 assert sql('SELECT current_user')=='drill'
try:
 out['versions']['postgres']=run([B/'postgres','--version']).strip()
 run([B/'initdb','-D',data,'-U','drill','-A','trust','--no-locale','--encoding=UTF8'])
 with (data/'postgresql.conf').open('a') as f:f.write("\nlisten_addresses=''\nunix_socket_directories='"+str(sock)+"'\nport=55436\nfsync=on\nfull_page_writes=on\nsynchronous_commit=on\nwal_sync_method=fsync_writethrough\nlog_checkpoints=on\ncheckpoint_timeout='1h'\nmax_wal_size='1GB'\n")
 run([B/'pg_ctl','-D',data,'-l',log,'-w','start']);own()
 out['settings']=sql("SELECT name||'='||setting FROM pg_settings WHERE name IN ('fsync','full_page_writes','synchronous_commit','wal_sync_method','checkpoint_timeout','max_wal_size','wal_level') ORDER BY name").splitlines()
 sql("CREATE TABLE products(product_id text PRIMARY KEY, stock int NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES ('P3',12),('P7',1); CREATE TABLE orders(order_id int PRIMARY KEY, customer_id int, status text); CREATE TABLE order_items(order_id int REFERENCES orders, line_no int, product_id text REFERENCES products, quantity int, unit_price numeric(8,2), PRIMARY KEY(order_id,line_no)); CREATE TABLE scratch(label text); CREATE UNLOGGED TABLE rebuildable(label text); CHECKPOINT;")
 out['checkpoint']=sql('SELECT checkpoint_lsn, redo_lsn FROM pg_control_checkpoint()')
 out['before']=sql('SELECT pg_current_wal_insert_lsn(),pg_current_wal_lsn(),pg_current_wal_flush_lsn()')
 sql("BEGIN; UPDATE products SET stock=stock-2 WHERE product_id='P3'; UPDATE products SET stock=stock-1 WHERE product_id='P7'; INSERT INTO orders VALUES (103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.5); INSERT INTO rebuildable VALUES('same committed transaction'); COMMIT;")
 out['after_commit']=sql('SELECT pg_current_wal_insert_lsn(),pg_current_wal_lsn(),pg_current_wal_flush_lsn()')
 out['before_crash']=sql("SELECT 'products',string_agg(product_id||':'||stock,',' ORDER BY product_id) FROM products UNION ALL SELECT 'order',string_agg(order_id||':'||status,',') FROM orders UNION ALL SELECT 'lines',count(*)::text FROM order_items UNION ALL SELECT 'unlogged',count(*)::text FROM rebuildable")
 pending=subprocess.Popen([str(B/'psql'),'-X','-h',str(sock),'-p','55436','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-c',"BEGIN; INSERT INTO scratch VALUES('unfinished'); SELECT pg_sleep(60);"],env=E,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 for _ in range(100):
  if sql("SELECT count(*) FROM pg_stat_activity WHERE query LIKE 'BEGIN; INSERT INTO scratch%' AND wait_event='PgSleep'")=='1':break
  time.sleep(.05)
 else:raise RuntimeError('unfinished transaction not established')
 own();out['stop']=run([B/'pg_ctl','-D',data,'-m','immediate','-w','stop'])
 pending.communicate(timeout=5)
 t=time.monotonic();run([B/'pg_ctl','-D',data,'-l',log,'-w','start']);out['start_command_seconds']=round(time.monotonic()-t,4);own()
 out['after_crash']=sql("SELECT 'products',string_agg(product_id||':'||stock,',' ORDER BY product_id) FROM products UNION ALL SELECT 'order',string_agg(order_id||':'||status,',') FROM orders UNION ALL SELECT 'lines',count(*)::text FROM order_items UNION ALL SELECT 'unlogged',count(*)::text FROM rebuildable UNION ALL SELECT 'unfinished',count(*)::text FROM scratch")
 assert out['after_crash'].splitlines()==['products|P3:10,P7:0','order|103:pending','lines|2','unlogged|0','unfinished|0']
 out['acceptance']='PASS: logged purchase complete; unfinished absent; unlogged empty'
finally:
 if data.exists():run([B/'pg_ctl','-D',data,'-m','immediate','-w','stop'],False)
 if log.exists():pathlib.Path('evidence/server.log').write_text(log.read_text())
 out['cleanup']=not (data/'postmaster.pid').exists()
 pathlib.Path('evidence/results.json').write_text(json.dumps(out,indent=2)+'\n')
 if out['cleanup']:shutil.rmtree(root)
print(json.dumps(out,indent=2))
