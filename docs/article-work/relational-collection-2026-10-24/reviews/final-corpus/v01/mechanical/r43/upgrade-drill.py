import os,pathlib,subprocess,tempfile,shutil,json,time
pathlib.Path('evidence').mkdir(exist_ok=True)
OLD=pathlib.Path('/private/tmp/staycurrent-relational-20261024-tools/pg17-complete/install/bin');NEW=pathlib.Path('/opt/homebrew/opt/postgresql@18/bin');E={k:v for k,v in os.environ.items() if not k.startswith('PG')};E.update(PGCONNECT_TIMEOUT='3',PSQLRC='/dev/null')
root=pathlib.Path(tempfile.mkdtemp(prefix='sc-r43-owned-'));old=root/'old';new=root/'new';sock=root/'socket';sock.mkdir(mode=0o700);work=root/'upgrade-work';work.mkdir();r={'root':str(root),'scope':'owned local17.6→18.6 pg_upgrade copy mode; scratch authority probes independent of shop history'}
def run(args,check=True,cwd=None,timeout=60):
 q=subprocess.run([str(x) for x in args],env=E,text=True,capture_output=True,timeout=timeout,cwd=cwd)
 if check and q.returncode:raise RuntimeError(q.stdout+q.stderr)
 return q
def query(s,p=55444,user='drill',check=True):return run([NEW/'psql','-X','-h',sock,'-p',p,'-U',user,'-d','postgres','-v','ON_ERROR_STOP=1','-At','-c',s],check)
def sql(s,p=55444):return query(s,p).stdout.strip()
def own(d,p):assert sql('SHOW data_directory',p)==str(d) and sql('SHOW port',p)==str(p) and sql('SELECT current_user',p)=='drill'
def config(d,p):
 with (d/'postgresql.conf').open('a') as f:f.write("\nlisten_addresses=''\nunix_socket_directories='"+str(sock)+"'\nport="+str(p)+"\n")
def init(b,d,p,extra=[]):run([b/'initdb','-D',d,'-U','drill','-A','trust','--no-locale','--encoding=UTF8',*extra]);config(d,p)
def start(b,d):run([b/'pg_ctl','-D',d,'-l',root/(d.name+'.log'),'-w','start'])
def stop(b,d):return run([b/'pg_ctl','-D',d,'-m','fast','-w','stop'],False)
def upgrade(check=False):return run([NEW/'pg_upgrade','-b',OLD,'-B',NEW,'-d',old,'-D',new,'-p','55444','-P','55445','-s',sock,'-U','drill','--copy','--retain',*(['--check'] if check else [])],False,cwd=work)
report="""WITH line_totals AS(SELECT order_id,sum(quantity*unit_price) AS total FROM order_items GROUP BY order_id),paid AS(SELECT order_id,sum(amount) AS amount FROM payments GROUP BY order_id) SELECT o.order_id,t.total,coalesce(p.amount,0),t.total-coalesce(p.amount,0) FROM orders o JOIN line_totals t USING(order_id) LEFT JOIN paid p USING(order_id) ORDER BY o.order_id"""
def acceptance(p):return {'products':sql('SELECT product_id,price,stock FROM products ORDER BY product_id',p),'orders':sql('SELECT order_id,customer_id,status FROM orders ORDER BY order_id',p),'lines':sql('SELECT order_id,line_no,product_id,quantity,unit_price FROM order_items ORDER BY order_id,line_no',p),'report':sql(report,p),'probes':sql('SELECT request_key FROM upgrade_probe ORDER BY request_key',p)}
try:
 r['versions']={'old':run([OLD/'postgres','--version']).stdout.strip(),'new':run([NEW/'postgres','--version']).stdout.strip(),'upgrade':run([NEW/'pg_upgrade','--version']).stdout.strip()}
 init(OLD,old,55444);start(OLD,old);own(old,55444)
 sql("""CREATE TABLE customers(customer_id int PRIMARY KEY,name text NOT NULL);INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock int NOT NULL CHECK(stock>=0));INSERT INTO products VALUES('P3','Green tea, 50 g',4.5,10),('P7','Blue mug',20,0),('P9','Teapot',35,4);
CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int REFERENCES customers,placed_at timestamptz,status text CHECK(status IN('pending','paid','cancelled')));INSERT INTO orders VALUES(101,1,'2026-10-12 09:30Z','paid'),(102,2,'2026-10-14 16:05Z','paid'),(103,1,'2026-10-20 10:15Z','pending');
CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int CHECK(quantity>0),unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));INSERT INTO order_items VALUES(101,1,'P3',1,4.5),(101,2,'P9',1,35),(102,1,'P7',2,20),(103,1,'P7',1,20),(103,2,'P3',2,4.5);
CREATE TABLE payments(payment_id int PRIMARY KEY,order_id int REFERENCES orders,amount numeric(8,2),method text);INSERT INTO payments VALUES(501,101,30,'card'),(502,101,9.5,'gift card'),(503,102,40,'card');
CREATE TABLE admissions(singleton bool PRIMARY KEY DEFAULT true CHECK(singleton),closed bool NOT NULL);INSERT INTO admissions VALUES(true,false);CREATE TABLE upgrade_probe(request_key text PRIMARY KEY);
CREATE ROLE app_writer LOGIN;CREATE FUNCTION admit_probe(k text) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$ DECLARE shut bool;BEGIN SELECT closed INTO shut FROM public.admissions FOR SHARE;IF shut THEN RAISE EXCEPTION 'source fenced';END IF;INSERT INTO public.upgrade_probe VALUES(k);RETURN 'accepted';END $$;GRANT EXECUTE ON FUNCTION admit_probe(text) TO app_writer;
SELECT admit_probe('before-upgrade');ANALYZE;""")
 # Enforced admission gate: waiting request must observe closure, not merely a new route.
 fence=subprocess.Popen([str(NEW/'psql'),'-X','-h',str(sock),'-p','55444','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1'],env=E,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 fence.stdin.write('BEGIN;UPDATE admissions SET closed=true;SELECT pg_sleep(2);COMMIT;\n');fence.stdin.flush()
 for _ in range(100):
  if sql("SELECT count(*) FROM pg_stat_activity WHERE query='SELECT pg_sleep(2);' AND wait_event='PgSleep'")=='1':break
  time.sleep(.02)
 race=subprocess.Popen([str(NEW/'psql'),'-X','-h',str(sock),'-p','55444','-U','app_writer','-d','postgres','-v','ON_ERROR_STOP=1','-c',"SELECT admit_probe('race-at-fence')"],env=E,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 for _ in range(100):
  if sql("SELECT count(*) FROM pg_stat_activity WHERE usename='app_writer' AND wait_event_type='Lock'")=='1':break
  time.sleep(.02)
 else:raise RuntimeError('fence race did not block')
 fence.stdin.close();fence.wait(timeout=10);o,e=race.communicate(timeout=10);r['fence_race']=e.strip();assert race.returncode and 'source fenced' in e
 r['before']=acceptance(55444);r['old_checksums']=sql('SHOW data_checksums');own(old,55444);stop(OLD,old)
 init(NEW,new,55445)
 mismatch=upgrade(True);r['checksum_mismatch']={'returncode':mismatch.returncode,'output':mismatch.stdout+mismatch.stderr};assert mismatch.returncode and 'checksum' in r['checksum_mismatch']['output']
 assert not (new/'postmaster.pid').exists();shutil.rmtree(new);init(NEW,new,55445,['--no-data-checksums'])
 checked=upgrade(True);r['check']={'returncode':checked.returncode,'output':checked.stdout+checked.stderr};assert checked.returncode==0,r['check']
 converted=upgrade();r['upgrade']={'returncode':converted.returncode,'output':converted.stdout+converted.stderr};assert converted.returncode==0,r['upgrade']
 start(NEW,new);own(new,55445)
 r['post_upgrade_missing_stats']=run([NEW/'vacuumdb','-h',sock,'-p','55445','-U','drill','--all','--analyze-in-stages','--missing-stats-only']).stdout.strip()
 r['post_upgrade_analyze']=run([NEW/'vacuumdb','-h',sock,'-p','55445','-U','drill','--all','--analyze-only']).stdout.strip()
 r['new_server_version']=sql('SHOW server_version',55445);r['after']=acceptance(55445);assert r['before']==r['after']
 blocked=query("SELECT admit_probe('before-acceptance')",55445,'app_writer',False);r['candidate_blocked_before_acceptance']=blocked.stderr.strip();assert blocked.returncode and 'source fenced' in blocked.stderr
 sql('UPDATE admissions SET closed=false',55445);r['new_accepted']=query("SELECT admit_probe('after-cutover')",55445,'app_writer').stdout.strip();assert r['new_accepted']=='accepted'
 stop(NEW,new)
 # Copy mode preserves distinct old files, but returning to them loses accepted new work.
 start(OLD,old);own(old,55444);r['old_return']={'after_cutover_count':sql("SELECT count(*) FROM upgrade_probe WHERE request_key='after-cutover'"),'gate_closed':sql('SELECT closed FROM admissions')}
 denied=query("SELECT admit_probe('wrong-old-route')",55444,'app_writer',False);r['old_return']['write_rejected']=denied.stderr.strip()
 assert r['old_return']['after_cutover_count']=='0' and r['old_return']['gate_closed']=='t' and denied.returncode and 'source fenced' in denied.stderr
 r['acceptance']='PASS: default checksum mismatch rejected; compatible17.6→18.6 copy upgrade preserved shop/report; fenced race rejected; candidate blocked before acceptance; new accepted write absent from preserved old copy'
finally:
 for b,d in [(OLD,old),(NEW,new)]:
  if d.exists():stop(b,d)
 for p in root.glob('*.log'):pathlib.Path('evidence',p.name).write_text(p.read_text())
 if new.exists():
  for p in new.glob('pg_upgrade_output.d/**/log/pg_upgrade_internal.log'):pathlib.Path('evidence','upgrade-internal-'+p.parent.parent.name+'.log').write_text(p.read_text())
 r['cleanup']=all(not(d/'postmaster.pid').exists() for d in [old,new]);pathlib.Path('evidence/results.json').write_text(json.dumps(r,indent=2)+'\n')
 if r['cleanup']:shutil.rmtree(root)
print(json.dumps(r,indent=2))
