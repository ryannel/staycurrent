import subprocess,tempfile,os,shutil,json
from pathlib import Path
BIN='/opt/homebrew/opt/postgresql@18/bin/'
base=Path(tempfile.mkdtemp(prefix='r18-owned-',dir='/private/tmp'));data=base/'data';sock=base/'socket';sock.mkdir()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')};env.update(PGHOST=str(sock),PGPORT='56418',PGUSER='r18_owner',PGDATABASE='postgres',PGCONNECT_TIMEOUT='5');log=[];p=None

def run(a):
 r=subprocess.run(a,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True);log.append({'command':a,'output':r.stdout});return r.stdout

def sql(q):return run([BIN+'psql','-X','-At','-v','ON_ERROR_STOP=1','-c',q])
try:
 run([BIN+'initdb','-D',str(data),'-U','r18_owner','-A','trust','--no-locale'])
 with (data/'postgresql.conf').open('a') as f:f.write("\nlisten_addresses=''\nunix_socket_directories='"+str(sock)+"'\nport=56418\n")
 run([BIN+'pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-w','start'])
 assert sql('SHOW data_directory').strip()==str(data)
 sql("CREATE TABLE products(id text PRIMARY KEY,stock int CHECK(stock>=0)); INSERT INTO products VALUES('P3',12),('P7',1),('P9',4); CREATE TABLE orders(id int PRIMARY KEY,customer_id int,status text); CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no)); CREATE TABLE scratch(marker text)")
 sql('CHECKPOINT')
 sql("BEGIN; UPDATE products SET stock=stock-1 WHERE id='P7' AND stock>0; UPDATE products SET stock=stock-2 WHERE id='P3' AND stock>=2; INSERT INTO orders VALUES(103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50); COMMIT")
 p=subprocess.Popen([BIN+'psql','-X','-Atq'],env=env,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 p.stdin.write("BEGIN; INSERT INTO scratch VALUES('unfinished'); SELECT pg_current_wal_insert_lsn();\n\\echo READY\n");p.stdin.flush()
 while p.stdout.readline().strip()!='READY':pass
 run([BIN+'pg_ctl','-D',str(data),'-m','immediate','-w','stop']);p.stdin.close();p.wait(timeout=5);p=None
 run([BIN+'pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-w','start'])
 assert sql('SHOW data_directory').strip()==str(data)
 result={'version':sql('SELECT version()').strip(),'orders':sql('TABLE orders').strip(),'lines':sql('SELECT * FROM order_items ORDER BY line_no').strip(),'stock':sql('SELECT * FROM products ORDER BY id').strip(),'unfinished_count':sql('SELECT count(*) FROM scratch').strip(),'boundary':'Immediate PostgreSQL stop and restart on one machine; OS cache retained; no power-cut, torn-page or independent storage failure test.'}
 assert result['orders']=='103|1|pending' and result['unfinished_count']=='0' and result['stock']=='P3|10\nP7|0\nP9|4'
 assert result['lines']=='103|1|P7|1|20.00\n103|2|P3|2|4.50'
 Path('evidence/native-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
finally:
 if p:p.terminate();p.wait(timeout=5)
 if data.exists():subprocess.run([BIN+'pg_ctl','-D',str(data),'-m','immediate','-w','stop'],env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 if (base/'server.log').exists():Path('evidence/server.log').write_text((base/'server.log').read_text())
 Path('evidence/native-commands.json').write_text(json.dumps(log,indent=2));shutil.rmtree(base)
