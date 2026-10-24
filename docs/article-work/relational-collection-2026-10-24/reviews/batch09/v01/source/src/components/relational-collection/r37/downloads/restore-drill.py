import os, pathlib, subprocess, tempfile, shutil, json, time, hashlib
pathlib.Path('evidence').mkdir(exist_ok=True)
B=pathlib.Path('/opt/homebrew/opt/postgresql@18/bin')
E={k:v for k,v in os.environ.items() if not k.startswith('PG')};E.update(PGCONNECT_TIMEOUT='5',PSQLRC='/dev/null')
root=pathlib.Path(tempfile.mkdtemp(prefix='sc-r37-owned-'));src=root/'source';base=root/'base';cand=root/'candidate';bad=root/'missing-chain';archive=root/'archive';archive.mkdir(mode=0o700)
sock=root/'socket';sock.mkdir(mode=0o700);result={'root':str(root),'scope':'single-host isolated base + archive recovery; no external effects'}
def run(args,check=True,timeout=45):
 r=subprocess.run([str(x) for x in args],env=E,text=True,capture_output=True,timeout=timeout)
 if check and r.returncode:raise RuntimeError(r.stdout+r.stderr)
 return r

def sql(s,port=55437):return run([B/'psql','-X','-h',sock,'-p',port,'-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-At','-c',s]).stdout.strip()
def own(d,p):
 assert sql('SHOW data_directory',p)==str(d)
 assert sql('SHOW port',p)==str(p)
 assert sql('SELECT current_user',p)=='drill'
def stop(d):run([B/'pg_ctl','-D',d,'-m','immediate','-w','stop'],False)
def config(d,p,extra=''):
 with (d/'postgresql.conf').open('a') as f:f.write("\nlisten_addresses=''\nunix_socket_directories='"+str(sock)+"'\nport="+str(p)+"\narchive_mode=off\n"+extra)
def start(d):return run([B/'pg_ctl','-D',d,'-l',root/(d.name+'.log'),'-t','10','-w','start'],timeout=15)
try:
 result['version']=run([B/'postgres','--version']).stdout.strip()
 run([B/'initdb','-D',src,'-U','drill','-A','trust','--no-locale','--encoding=UTF8'])
 archiver=root/'archive.py'
 archiver.write_text("""import sys,pathlib,os
src=pathlib.Path(sys.argv[1]);dst=pathlib.Path(sys.argv[2])/sys.argv[3]
if dst.exists():
 if dst.read_bytes()!=src.read_bytes():sys.exit(1)
 with dst.open('rb') as f:os.fsync(f.fileno())
else:
 with dst.open('xb') as f:f.write(src.read_bytes());f.flush();os.fsync(f.fileno())
fd=os.open(dst.parent,os.O_RDONLY);os.fsync(fd);os.close(fd)
""")
 config(src,55437,"wal_level=replica\narchive_mode=on\narchive_command='/usr/bin/python3 "+str(archiver)+" %p "+str(archive)+" %f'\nfsync=on\nfull_page_writes=on\n")
 start(src);own(src,55437)
 sql("""CREATE TABLE gate(singleton bool PRIMARY KEY DEFAULT true CHECK(singleton),closed bool NOT NULL); INSERT INTO gate VALUES(true,false);
CREATE TABLE sessions(session_id text PRIMARY KEY,capacity int CHECK(capacity>=0),remaining int CHECK(remaining>=0 AND remaining<=capacity));INSERT INTO sessions VALUES('S503',3,3);
CREATE TABLE bookings(booking_id text PRIMARY KEY,customer_id int,session_id text REFERENCES sessions);
CREATE TABLE requests(request_key text PRIMARY KEY,booking_id text,customer_id int,session_id text);
CREATE FUNCTION apply_booking(k text,b text,c int,s text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE old requests; n int;
BEGIN SELECT * INTO old FROM requests WHERE request_key=k;
IF FOUND THEN IF (old.booking_id,old.customer_id,old.session_id) IS DISTINCT FROM (b,c,s) THEN RAISE EXCEPTION 'request payload conflict';END IF;RETURN 'existing';END IF;
UPDATE sessions SET remaining=remaining-1 WHERE session_id=s AND remaining>0;GET DIAGNOSTICS n=ROW_COUNT;
IF n<>1 THEN RAISE EXCEPTION 'no capacity';END IF;
INSERT INTO bookings VALUES(b,c,s);INSERT INTO requests VALUES(k,b,c,s);RETURN 'created';END $$;
CREATE FUNCTION book(k text,b text,c int,s text) RETURNS text LANGUAGE plpgsql AS $$ DECLARE shut bool; BEGIN SELECT closed INTO shut FROM gate FOR SHARE;IF shut THEN RAISE EXCEPTION 'source fenced';END IF;RETURN apply_booking(k,b,c,s);END $$;""")
 run([B/'pg_basebackup','-h',sock,'-p','55437','-U','drill','-D',base,'-X','stream','-c','fast'])
 result['verify_backup']=run([B/'pg_verifybackup',base]).stdout.strip()
 result['base_manifest_sha256']=hashlib.sha256((base/'backup_manifest').read_bytes()).hexdigest()
 # The scenario clock labels are not represented as fabricated commit timestamps.
 result['mistake_xid']=sql("BEGIN;SELECT pg_current_xact_id();UPDATE sessions SET capacity=1,remaining=1 WHERE session_id='S503';COMMIT;").splitlines()[1]
 assert result['mistake_xid'].isdigit(),result['mistake_xid']
 result['valid_booking']=sql("SELECT book('booking-edda-B203','B203',3,'S503')")
 # Hold the fence while a separate request races it. Every admitted path takes the same gate lock.
 fence=subprocess.Popen([str(B/'psql'),'-X','-h',str(sock),'-p','55437','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1'],env=E,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 fence.stdin.write("BEGIN;UPDATE gate SET closed=true;SELECT pg_sleep(2);COMMIT;\n");fence.stdin.flush()
 for _ in range(100):
  if sql("SELECT count(*) FROM pg_stat_activity WHERE query='SELECT pg_sleep(2);' AND wait_event='PgSleep'")=='1':break
  time.sleep(.02)
 race=subprocess.Popen([str(B/'psql'),'-X','-h',str(sock),'-p','55437','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-c',"SELECT book('booking-edda-B203','B203',3,'S503')"],env=E,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 for _ in range(100):
  if sql("SELECT count(*) FROM pg_stat_activity WHERE query LIKE 'SELECT book(%' AND wait_event_type='Lock'")=='1':break
  time.sleep(.02)
 else:raise RuntimeError('fence race did not block')
 fence.stdin.close();fence.wait(timeout=8)
 rout,rerr=race.communicate(timeout=8);result['fence_race']={'returncode':race.returncode,'stderr':rerr.strip()};assert race.returncode and 'source fenced' in rerr
 result['accepted_source_requests']=sql('TABLE requests')
 result['source_state']=sql('TABLE sessions')
 lastfile=sql('SELECT pg_walfile_name(pg_current_wal_lsn())');sql('SELECT pg_switch_wal()')
 for _ in range(200):
  if (archive/lastfile).exists():break
  time.sleep(.05)
 else:raise RuntimeError('final WAL not archived')
 result['archive_files']=sorted(p.name for p in archive.iterdir());result['target_segment']=lastfile
 own(src,55437);stop(src)
 def restore_copy(d,p,a):
  shutil.copytree(base,d)
  for item in (d/'pg_wal').iterdir():
   if item.is_file():item.unlink()
  (d/'recovery.signal').touch()
  config(d,p,"restore_command='cp "+str(a)+"/%f %p'\nrecovery_target_xid='"+result['mistake_xid']+"'\nrecovery_target_inclusive=off\nrecovery_target_action='pause'\nrecovery_target_timeline='1'\n")
 empty=root/'archive-missing';shutil.copytree(archive,empty);(empty/lastfile).unlink()
 restore_copy(bad,55439,empty)
 failure=run([B/'pg_ctl','-D',bad,'-l',root/'missing-chain.log','-t','5','-w','start'],False,timeout=10)
 result['missing_chain_returncode']=failure.returncode;assert failure.returncode!=0
 stop(bad)
 restore_copy(cand,55438,archive);start(cand);own(cand,55438)
 for _ in range(100):
  if sql('SELECT pg_is_wal_replay_paused()',55438)=='t':break
  time.sleep(.05)
 else:raise RuntimeError('target not paused')
 result['at_target']={'recovery':sql('SELECT pg_is_in_recovery()',55438),'session':sql('TABLE sessions',55438),'bookings':sql('SELECT count(*) FROM bookings',55438),'requests':sql('SELECT count(*) FROM requests',55438)}
 assert result['at_target']=={'recovery':'t','session':'S503|3|3','bookings':'0','requests':'0'}
 sql('SELECT pg_wal_replay_resume()',55438)
 for _ in range(100):
  if sql('SELECT pg_is_in_recovery()',55438)=='f':break
  time.sleep(.05)
 sql('UPDATE gate SET closed=true',55438)
 result['first_reconcile']=sql("SELECT apply_booking('booking-edda-B203','B203',3,'S503')",55438)
 result['repeat_reconcile']=sql("SELECT apply_booking('booking-edda-B203','B203',3,'S503')",55438)
 conflict=run([B/'psql','-X','-h',sock,'-p','55438','-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-c',"SELECT apply_booking('booking-edda-B203','B203',1,'S503')"],False)
 result['payload_conflict']=conflict.stderr.strip();assert conflict.returncode and 'request payload conflict' in conflict.stderr
 result['final']={'session':sql('TABLE sessions',55438),'bookings':sql('TABLE bookings',55438),'requests':sql('TABLE requests',55438),'fence':sql('SELECT closed FROM gate',55438)}
 assert result['first_reconcile']=='created' and result['repeat_reconcile']=='existing'
 assert result['final']['session']=='S503|3|2' and result['final']['bookings']=='B203|3|S503' and result['final']['fence']=='t'
 result['acceptance']='PASS: bad transaction excluded; B203 initially absent then restored exactly once; old authority fenced and race rejected; candidate remains isolated'
finally:
 for d in [src,cand,bad]:
  if d.exists():stop(d)
 for p in root.glob('*.log'):pathlib.Path('evidence',p.name).write_text(p.read_text())
 result['cleanup']=all(not (d/'postmaster.pid').exists() for d in [src,cand,bad])
 pathlib.Path('evidence/results.json').write_text(json.dumps(result,indent=2)+'\n')
 if result['cleanup']:shutil.rmtree(root)
print(json.dumps(result,indent=2))
