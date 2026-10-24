import csv, io, json, os, pathlib, shutil, socket, subprocess, tempfile, time, uuid
B='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach'
OUT=pathlib.Path(__file__).parent
ENV={k:v for k,v in os.environ.items() if not k.startswith(('PG','COCKROACH')) and k not in ('DATABASE_URL','SQL_URL')}
ENV['COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING']='true'
root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r49-owned-')); token=str(uuid.uuid4()); (root/'OWNER').write_text(token)
procs=[]; log=[]
def run(args,ok=True,timeout=60):
 p=subprocess.run([B]+args,env=ENV,text=True,capture_output=True,timeout=timeout)
 log.append({'args':args,'returncode':p.returncode,'out':p.stdout,'err':p.stderr})
 if ok and p.returncode: raise RuntimeError(p.stderr)
 return p
def port():
 s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p
ports=[port() for _ in range(4)]; http=[port() for _ in range(4)]
cert=root/'certs';cert.mkdir(); ca=root/'ca.key'
def sql(q,user='root',ok=True):
 return run(['sql','--host=127.0.0.1:'+str(ports[0]),'--certs-dir='+str(cert),'--user='+user,'--database=ops','--format=csv','-e',q],ok)
try:
 assert 'v25.4.17' in run(['version']).stdout
 run(['cert','create-ca','--certs-dir='+str(cert),'--ca-key='+str(ca)])
 run(['cert','create-node','127.0.0.1','localhost','--certs-dir='+str(cert),'--ca-key='+str(ca)])
 for u in ['root','runtime_10','runtime_20']:
  run(['cert','create-client',u,'--certs-dir='+str(cert),'--ca-key='+str(ca)])
 for i,p in enumerate(ports):
  args=[B,'start','--listen-addr=127.0.0.1:'+str(p),'--http-addr=127.0.0.1:'+str(http[i]),'--join=127.0.0.1:'+str(ports[0]),'--certs-dir='+str(cert),'--store='+str(root/('node'+str(i))),'--cache=64MiB','--max-sql-memory=64MiB','--cluster-name=r49-'+token]
  f=open(root/('process'+str(i)+'.log'),'w'); procs.append(subprocess.Popen(args,env=ENV,stdout=f,stderr=f))
 time.sleep(2)
 run(['init','--host=127.0.0.1:'+str(ports[0]),'--certs-dir='+str(cert),'--cluster-name=r49-'+token])
 run(['sql','--host=127.0.0.1:'+str(ports[0]),'--certs-dir='+str(cert),'-e','CREATE DATABASE ops'])
 sql('CREATE TABLE owner_marker (token STRING PRIMARY KEY); INSERT INTO owner_marker VALUES (\''+token+'\');')
 assert token in sql('SELECT token FROM owner_marker').stdout
 sql("SELECT version(), crdb_internal.cluster_id(); SHOW CLUSTER SETTING enterprise.license; SELECT crdb_internal.license_enforcement_status();",ok=False)
 sql("REVOKE CREATE ON SCHEMA public FROM public; CREATE USER runtime_10; CREATE USER runtime_20; CREATE TABLE products(shop_id INT, product_id STRING, name STRING, price DECIMAL(8,2), PRIMARY KEY(shop_id,product_id)); INSERT INTO products VALUES (10,'P3','Green tea, 50 g',4.50),(10,'P7','Blue mug',20.00),(10,'P9','Teapot',35.00),(20,'P7','Copper mug',18.00); GRANT SELECT, INSERT, UPDATE ON products TO runtime_10, runtime_20;")
 assert 'Copper mug' in sql('SELECT * FROM products','runtime_10').stdout
 sql("ALTER TABLE products ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_products ON products TO runtime_10, runtime_20 USING (shop_id = CASE current_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END) WITH CHECK (shop_id = CASE current_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END);")
 a=sql('SELECT session_user,current_user; SELECT * FROM products ORDER BY shop_id,product_id','runtime_10').stdout; assert 'Blue mug' in a and 'Copper mug' not in a
 assert 'Copper mug' in sql('SELECT * FROM products','runtime_20').stdout
 assert 'Copper mug' not in sql("SET application_name='shop20'; SELECT * FROM products WHERE shop_id=20",'runtime_10').stdout
 for q in ["INSERT INTO products VALUES(20,'probe','Other shop',1)",'ALTER TABLE products DISABLE ROW LEVEL SECURITY','SET ROLE admin','SET ROLE runtime_20','DELETE FROM products','CREATE TABLE escape(x INT)']:
  assert sql(q,'runtime_10',False).returncode!=0,q
 assert 'UPDATE 0' in sql('UPDATE products SET price=19 WHERE shop_id=20','runtime_10').stdout
 sql("BEGIN; UPDATE products SET price=20 WHERE shop_id=10 AND product_id='P7'; ROLLBACK",'runtime_10')
 badurl='postgresql://runtime_20@127.0.0.1:'+str(ports[0])+'/ops?sslmode=verify-full&sslrootcert='+str(cert/'ca.crt')+'&sslcert='+str(cert/'client.runtime_10.crt')+'&sslkey='+str(cert/'client.runtime_10.key')
 bad=subprocess.run(['/opt/homebrew/opt/postgresql@18/bin/psql',badurl,'-X','-c','SELECT current_user'],env=ENV,text=True,capture_output=True,timeout=15)
 log.append({'check':'mismatched client certificate via psql URL only','returncode':bad.returncode,'out':bad.stdout,'err':bad.stderr})
 assert bad.returncode!=0
 sql('SHOW CREATE TABLE products; SHOW GRANTS ON products; SHOW ROLES; SHOW POLICIES FOR products')
 deadline=time.time()+90
 while True:
  ranges=sql('SELECT range_id,replicas,voting_replicas FROM [SHOW RANGES FROM DATABASE ops]').stdout
  rows=list(csv.DictReader(io.StringIO(ranges)))
  if rows and all(len(r['voting_replicas'].strip('{}').split(','))==3 for r in rows):break
  assert time.time()<deadline,'ranges failed to reach 3 voters';time.sleep(1)
 status=['node','status','--all','--format=csv','--timeout=10s','--host=127.0.0.1:'+str(ports[0]),'--certs-dir='+str(cert)]
 s=run(status).stdout; nodes=list(csv.DictReader(io.StringIO(s))); assert len(nodes)==4
 victim=next(r['id'] for r in nodes if r['address'].endswith(':'+str(ports[3])))
 nodebase=['--host=127.0.0.1:'+str(ports[0]),'--certs-dir='+str(cert),'--cluster-name=r49-'+token]
 run(['node','decommission',victim,'--dry-run']+nodebase,timeout=90)
 run(['node','decommission',victim,'--wait=all']+nodebase,timeout=150)
 assert token in sql('SELECT token FROM owner_marker').stdout
 rs=sql('SELECT range_id,replicas,voting_replicas FROM [SHOW RANGES FROM DATABASE ops]').stdout
 rows=list(csv.DictReader(io.StringIO(rs))); assert rows and all(victim not in r['replicas'].strip('{}').split(',') for r in rows)
 run(status)
 (OUT/'result.json').write_text(json.dumps({'status':'passed','version':'25.4.17','nodes':4,'decommissioned_node':victim,'scope':'four processes on one host; no physical failure-domain or production-load claim','commands':log},indent=2))
 print('PASS secure identity, RLS denials, placement and 4→3 decommission')
finally:
 for p in reversed(procs):
  if p.poll() is None:p.terminate()
 for p in procs:
  try:p.wait(timeout=20)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 if not (OUT/'result.json').exists():(OUT/'failure.json').write_text(json.dumps(log,indent=2))
 assert (root/'OWNER').read_text()==token
 shutil.rmtree(root)
 print('CLEANED owned processes, keys and stores')
