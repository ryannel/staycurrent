import argparse,pathlib,subprocess,tempfile,socket,time,json,shutil
parser=argparse.ArgumentParser(description="PostgreSQL 18 disposable backup and recovery drill; no existing cluster is contacted.")
parser.add_argument("--pg-bin",required=True,type=pathlib.Path)
parser.add_argument("--evidence",required=True,type=pathlib.Path)
args=parser.parse_args()
if args.evidence.exists(): parser.error("Choose a new evidence path; this script never overwrites evidence.")
B=args.pg_bin; root=pathlib.Path(tempfile.mkdtemp(prefix='rel3-a39-')); records=[]; running=[]
def run(tool,*args,check=True):
 t=time.monotonic(); p=subprocess.run([str(B/tool),*map(str,args)],text=True,capture_output=True,timeout=45); records.append({'command':[tool,*map(str,args)],'seconds':round(time.monotonic()-t,3),'returncode':p.returncode,'stdout':p.stdout,'stderr':p.stderr});
 if check and p.returncode: raise RuntimeError(p.stderr)
 return p

def port():
 s=socket.socket();s.bind(('127.0.0.1',0));p=s.getsockname()[1];s.close();return p

def sql(p,q):return run('psql','-X','-h','127.0.0.1','-p',p,'-U','drill','-d','shop','-v','ON_ERROR_STOP=1','-At','-c',q).stdout.strip()
def start(d,p):
 running.append(d)
 run('pg_ctl','-D',d,'-l',root/(d.name+'.log'),'-w','-t','15','start')
def stop(d):run('pg_ctl','-D',d,'-m','fast','-w','-t','15','stop');running.remove(d)
def restore(name,target=False,archive=None):
 t=time.monotonic(); d=root/name;shutil.copytree(root/'base',d);p=port()
 with (d/'postgresql.conf').open('a') as f:
  f.write(f"\nport={p}\narchive_mode=off\nrestore_command='cp {archive or root/'archive'}/%f %p'\n")
  if target:f.write("recovery_target_name='before_bad_delete'\nrecovery_target_action='pause'\n")
 (d/'recovery.signal').touch();start(d,p)
 deadline=time.monotonic()+15
 while sql(p,"SELECT CASE WHEN pg_is_in_recovery() THEN pg_is_wal_replay_paused() ELSE false END;" if target else "SELECT NOT pg_is_in_recovery();")!='t':
  if time.monotonic()>deadline:raise RuntimeError('recovery completion timeout')
  time.sleep(.1)
 result=sql(p,"SELECT 'orders='||string_agg(id::text,',' ORDER BY id) FROM orders; SELECT 'items='||count(*) FROM items; SELECT 'recovery='||pg_is_in_recovery()::text; SELECT 'paused='||CASE WHEN pg_is_in_recovery() THEN pg_is_wal_replay_paused()::text ELSE 'not in recovery' END;")
 assert ('orders=101,102,103' in result and 'items=4' in result and 'paused=true' in result) if target else ('orders=102,103,104' in result and 'items=3' in result and 'recovery=false' in result)
 groups=sql(p,"SELECT count(*) AS orphan_items FROM items i LEFT JOIN orders o ON o.id=i.order_id WHERE o.id IS NULL; SELECT order_id,count(*),sum(quantity) FROM items GROUP BY order_id ORDER BY order_id;")
 assert groups == ("0\n101|2|3\n102|1|1\n103|1|1" if target else "0\n102|1|1\n103|1|1\n104|1|1")
 records.append({'result':name,'elapsed_copy_start_to_queries_seconds':round(time.monotonic()-t,3),'observed':result});stop(d)
 return d
try:
 (root/'archive').mkdir();src=root/'source';p=port();run('initdb','-D',src,'--username=drill','--locale=C','--encoding=UTF8','--auth-local=trust','--auth-host=trust')
 with (src/'postgresql.conf').open('a') as f:f.write(f"\nlisten_addresses='127.0.0.1'\nport={p}\nunix_socket_directories='{root}'\nmax_connections=12\nshared_buffers='32MB'\nmax_wal_senders=4\nwal_level=replica\narchive_mode=on\narchive_command='test ! -f {root}/archive/%f && cp %p {root}/archive/%f'\ntimezone='UTC'\nstatement_timeout='30s'\n")
 start(src,p);run('createdb','-h','127.0.0.1','-p',p,'-U','drill','shop')
 sql(p,"CREATE TABLE orders(id int PRIMARY KEY, status text NOT NULL); CREATE TABLE items(order_id int REFERENCES orders ON DELETE CASCADE, line int, quantity int CHECK(quantity>0), PRIMARY KEY(order_id,line)); INSERT INTO orders VALUES(101,'paid'),(102,'paid'); INSERT INTO items VALUES(101,1,2),(101,2,1),(102,1,1);")
 run('pg_basebackup','-h','127.0.0.1','-p',p,'-U','drill','-D',root/'base','-Fp','-X','stream','--checkpoint=fast','--label=a39-rehearsal')
 run('pg_verifybackup',root/'base')
 records.append({'base_file_bytes':sum(f.stat().st_size for f in (root/'base').rglob('*') if f.is_file())})
 sql(p,"INSERT INTO orders VALUES(103,'paid'); INSERT INTO items VALUES(103,1,1);");sql(p,"SELECT pg_create_restore_point('before_bad_delete');")
 sql(p,"BEGIN; DELETE FROM orders WHERE id=101; COMMIT; INSERT INTO orders VALUES(104,'paid'); INSERT INTO items VALUES(104,1,1);")
 seg=sql(p,"SELECT pg_walfile_name(pg_current_wal_lsn());");sql(p,'SELECT pg_switch_wal();')
 deadline=time.monotonic()+15
 while not (root/'archive'/seg).exists():
  if time.monotonic()>deadline:raise RuntimeError('archive timeout')
  time.sleep(.1)
 records.append({'archive_files':sorted(x.name for x in (root/'archive').iterdir()),'last_required_segment':seg,'source':sql(p,"SELECT string_agg(id::text,',' ORDER BY id) FROM orders;")})
 restore('full');target=restore('target',True)
 run('pg_checksums','--check','-D',target)
 gap=root/'gap-archive';shutil.copytree(root/'archive',gap);(gap/seg).unlink();d=root/'gap';shutil.copytree(root/'base',d);gp=port()
 with (d/'postgresql.conf').open('a') as f:f.write(f"\nport={gp}\narchive_mode=off\nrestore_command='cp {gap}/%f %p'\nrecovery_target_name='before_bad_delete'\nrecovery_target_action='pause'\n")
 (d/'recovery.signal').touch();result=run('pg_ctl','-D',d,'-l',root/'gap.log','-w','-t','15','start',check=False)
 if result.returncode==0:running.append(d);raise RuntimeError('Gap unexpectedly accepted')
 assert 'recovery ended before configured recovery target was reached' in (root/'gap.log').read_text()
 records.append({'gap_expected_failure':(root/'gap.log').read_text()})
finally:
 for d in list(running):
  try:stop(d)
  except Exception as e:records.append({'cleanup_error':str(e)})
 evidence={'runtime':str(B),'root':str(root),'records':records,'logs':{x.name:x.read_text() for x in root.glob('*.log')},'cleanup':'all own servers stopped; data directory removed after evidence capture'}
 if running:evidence['cleanup']='cleanup incomplete: data retained; inspect recorded servers'
 with args.evidence.open('x') as output:output.write(json.dumps(evidence,indent=2))
 if not running:shutil.rmtree(root)
 print(json.dumps({'evidence':str(args.evidence),'results':[x for x in records if 'result'in x or 'archive_files'in x],'last_commands':records[-4:]},indent=2))
