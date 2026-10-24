import subprocess, tempfile, os, shutil, json, time
from pathlib import Path
BIN='/opt/homebrew/opt/postgresql@18/bin/'
base=Path(tempfile.mkdtemp(prefix='r15-owned-',dir='/private/tmp')); data=base/'data'; sock=base/'socket';sock.mkdir()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')};env.update(PGHOST=str(sock),PGPORT='56415',PGUSER='r15_owner',PGDATABASE='postgres',PGCONNECT_TIMEOUT='5')
log=[]
def run(a,**kw):
 p=subprocess.run(a,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True,**kw);log.append({'command':a,'output':p.stdout});return p.stdout
def sql(q):return run([BIN+'psql','-X','-At','-v','ON_ERROR_STOP=1','-c',q])
p=None
try:
 run([BIN+'initdb','-D',str(data),'-U','r15_owner','-A','trust','--no-locale'])
 with (data/'postgresql.conf').open('a') as f:f.write("\nlisten_addresses=''\nunix_socket_directories='"+str(sock)+"'\nport=56415\nautovacuum=off\n")
 run([BIN+'pg_ctl','-D',str(data),'-l',str(base/'server.log'),'-w','start'])
 assert sql('SHOW data_directory').strip()==str(data)
 sql("CREATE EXTENSION pgstattuple; CREATE TABLE products(product_id text PRIMARY KEY,price numeric(8,2)) WITH(fillfactor=70); INSERT INTO products VALUES('P7',20.00)")
 p=subprocess.Popen([BIN+'psql','-X','-Atq','-v','ON_ERROR_STOP=1'],env=env,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 def reader(q):
  p.stdin.write(q+';\n\\echo READY\n');p.stdin.flush(); lines=[]
  while True:
   line=p.stdout.readline()
   if not line:raise RuntimeError('reader stopped')
   if line.strip()=='READY':break
   lines.append(line)
  answer=''.join(lines);log.append({'reader':q,'output':answer});return answer
 reader('BEGIN ISOLATION LEVEL REPEATABLE READ')
 assert '20.00' in reader("SELECT product_id,price,ctid FROM products")
 sql("UPDATE products SET price=25.00 WHERE product_id='P7'")
 assert '25.00' in sql('SELECT product_id,price,ctid FROM products')
 sql('VACUUM products')
 assert '20.00' in reader('SELECT product_id,price,ctid FROM products')
 held=sql("SELECT tuple_count,dead_tuple_count FROM pgstattuple('products')")
 reader('COMMIT');p.stdin.close();p.wait(timeout=5);p=None
 sql('VACUUM products')
 cleaned=sql("SELECT tuple_count,dead_tuple_count FROM pgstattuple('products')")
 assert held.strip()=='1|1' and cleaned.strip()=='1|0'
 sql('CREATE TABLE scratch(row_no int,payload text); ALTER TABLE scratch ALTER payload SET STORAGE PLAIN; INSERT INTO scratch SELECT n,repeat(\'x\',1600) FROM generate_series(1,2000)n')
 before=int(sql("SELECT pg_relation_size('scratch')").strip());sql('DELETE FROM scratch WHERE row_no%2=0');sql('VACUUM (TRUNCATE FALSE) scratch');after=int(sql("SELECT pg_relation_size('scratch')").strip())
 assert before==after
 sql('VACUUM FULL scratch');rewritten=int(sql("SELECT pg_relation_size('scratch')").strip());assert rewritten<after
 result={'version':sql('SELECT version()').strip(),'held_versions':held.strip(),'after_snapshot_end':cleaned.strip(),'scratch_bytes':{'before_delete':before,'after_vacuum':after,'after_rewrite':rewritten},'boundary':'Owned single local PostgreSQL process; no production workload, performance or power-loss claim.'}
 Path('evidence/native-result.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
finally:
 if p:
  p.terminate();p.wait(timeout=5)
 if data.exists():
  subprocess.run([BIN+'pg_ctl','-D',str(data),'-m','immediate','-w','stop'],env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
  if (base/'server.log').exists():Path('evidence/server.log').write_text((base/'server.log').read_text())
 Path('evidence/native-commands.json').write_text(json.dumps(log,indent=2));shutil.rmtree(base)
