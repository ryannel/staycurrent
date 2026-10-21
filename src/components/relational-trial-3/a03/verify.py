#!/usr/bin/env python3
"""Own an isolated PostgreSQL cluster; preserve transcripts; stop it in finally.
Usage: python3 verify.py [unused-port] > native.json
Requires PostgreSQL 18 tools at PG_BIN, otherwise Homebrew's versioned path.
"""
import concurrent.futures, json, os, pathlib, subprocess, sys, tempfile, time
BIN=os.environ.get('PG_BIN','/opt/homebrew/opt/postgresql@18/bin')
PORT=int(sys.argv[1]) if len(sys.argv)>1 else 56140
HERE=pathlib.Path(__file__).resolve().parent
log=[]; sessions=[]
def command(args):
 p=subprocess.run(args,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 log.append({'command':args,'status':p.returncode,'output':p.stdout})
 if p.returncode: raise RuntimeError(p.stdout)
 return p.stdout
class Session:
 def __init__(self,name):
  self.name=name; self.n=0
  self.p=subprocess.Popen([BIN+'/psql','-X','-qAt','-h','127.0.0.1','-p',str(PORT),'-d','a03_trial','-v','VERBOSITY=verbose'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
  sessions.append(self)
  self.q("SET statement_timeout='10s'; SET lock_timeout='5s'; SET idle_in_transaction_session_timeout='30s';")
  self.pid=self.q('SELECT pg_backend_pid();').strip()
 def q(self,sql):
  self.n+=1; token=f'END_{self.name}_{self.n}'
  self.p.stdin.write(sql+'\n\\echo '+token+'\n'); self.p.stdin.flush(); out=[]
  for line in self.p.stdout:
   if line.strip()==token:break
   out.append(line)
  answer=''.join(out).strip();log.append({'session':self.name,'sql':sql,'output':answer});return answer
def expect(actual,wanted):
 assert actual==wanted,(actual,wanted)
def run():
 with tempfile.TemporaryDirectory(prefix='staycurrent-a03-') as tmp:
  data=tmp+'/data'; sock=tmp+'/socket';os.mkdir(sock)
  started=False
  try:
   command([BIN+'/initdb','-D',data,'-A','trust','--no-locale','-E','UTF8'])
   command([BIN+'/pg_ctl','-D',data,'-l',tmp+'/server.log','-o',f'-h 127.0.0.1 -p {PORT} -k {sock}','-w','start']);started=True
   command([BIN+'/createdb','-h','127.0.0.1','-p',str(PORT),'a03_trial'])
   fixture=json.loads(command(['node','--input-type=module','-e',f"import {{setup,seed,guarded,optimistic,depart,combinedCount}} from {json.dumps((HERE/'model.mjs').as_uri())}; console.log(JSON.stringify({{setup,seed,guarded,optimistic,depart,combinedCount}}));"]))
   a,b,o=Session('A'),Session('B'),Session('observer')
   version=o.q('SELECT version();');assert '18.6' in version
   o.q('SHOW default_transaction_isolation; SHOW fsync; SHOW synchronous_commit; SHOW full_page_writes; SHOW deadlock_timeout;')
   expect(o.q(fixture['setup']+fixture['seed']), '')
   def reset():
    a.q('ROLLBACK;');b.q('ROLLBACK;');o.q('TRUNCATE reservations,instructors,classes,customers;'+fixture['seed'])
   def state(cid):
    return o.q(f'SELECT remaining,count(request_id),remaining+count(request_id)=capacity FROM classes LEFT JOIN reservations USING(class_id) WHERE class_id={cid} GROUP BY class_id;')
   def wait(s):
    end=time.monotonic()+4
    while time.monotonic()<end:
     if o.q(f"SELECT wait_event_type FROM pg_stat_activity WHERE pid={s.pid};")=='Lock':return
     time.sleep(.02)
    raise AssertionError('No observed lock wait')
   def book(sql,request,owner):return sql.replace("'R8'",f"'{request}'").replace("class_id, 1 FROM taken",f"class_id, {owner} FROM taken")
   # Unsafe: both transactions read 1, then overwrite from that old value.
   reset();a.q('BEGIN;');b.q('BEGIN;');expect(a.q('SELECT remaining FROM classes WHERE class_id=21;'),'1');expect(b.q('SELECT remaining FROM classes WHERE class_id=21;'),'1')
   a.q("UPDATE classes SET remaining=0 WHERE class_id=21; INSERT INTO reservations VALUES ('R8',21,1); COMMIT;")
   b.q("UPDATE classes SET remaining=0 WHERE class_id=21; INSERT INTO reservations VALUES ('R9',21,2); COMMIT;");expect(state(21),'0|2|f')
   # Protected: B waits, then the condition rejects the now unavailable place.
   reset();a.q('BEGIN ISOLATION LEVEL READ COMMITTED;');b.q('BEGIN ISOLATION LEVEL READ COMMITTED;');expect(a.q(fixture['guarded']),'R8')
   with concurrent.futures.ThreadPoolExecutor() as pool:
    future=pool.submit(b.q,book(fixture['guarded'],'R9',2));wait(b);a.q('COMMIT;');expect(future.result(),'')
   b.q('COMMIT;');expect(state(21),'0|1|t')
   # Complete versus split transaction after double click's unique rejection.
   for split in [True,False]:
    reset();a.q('BEGIN; UPDATE classes SET remaining=remaining-1 WHERE class_id=22; INSERT INTO reservations VALUES (\'R10\',22,1); COMMIT;')
    a.q(('' if split else 'BEGIN;')+'UPDATE classes SET remaining=remaining-1 WHERE class_id=22;')
    error=a.q("INSERT INTO reservations VALUES ('R11',22,1);");assert '23505' in error
    a.q('ROLLBACK;');expect(state(22),'0|2|f' if split else '1|2|t')
   # Forced error after the protected decrement, before ownership is inserted.
   reset();a.q('BEGIN; UPDATE classes SET remaining=remaining-1 WHERE class_id=21;');assert '22012' in a.q('SELECT 1/0;');assert '25P02' in a.q('SELECT 1;');a.q('ROLLBACK;');expect(state(21),'1|0|t')
   # Concurrent duplicate booking: capacity alone allows two; uniqueness must arbitrate.
   reset();a.q('BEGIN;');b.q('BEGIN;');a.q("INSERT INTO reservations VALUES ('R10',22,1);")
   with concurrent.futures.ThreadPoolExecutor() as pool:
    future=pool.submit(b.q,"INSERT INTO reservations VALUES ('R11',22,1);");wait(b);a.q('COMMIT;');assert '23505' in future.result()
   b.q('ROLLBACK;')
   # Same row optimistic comparison: missing comparison accepts stale overwrite.
   reset();a.q(fixture['optimistic']);expect(b.q(fixture['optimistic']),'')
   # A stable view: statement snapshots differ, transaction snapshots remain.
   for level,second in [('READ COMMITTED','0'),('REPEATABLE READ','1')]:
    reset();a.q('BEGIN ISOLATION LEVEL '+level+';');expect(a.q('SELECT remaining FROM classes WHERE class_id=21;'),'1');b.q(fixture['guarded']);expect(a.q('SELECT remaining FROM classes WHERE class_id=21;'),second);a.q('ROLLBACK;')
   # Cross-row decisions: the exact same logic, weaker versus stronger contract.
   for level in ['REPEATABLE READ','SERIALIZABLE']:
    reset()
    for s in [a,b]:s.q('BEGIN ISOLATION LEVEL '+level+';');expect(s.q('SELECT count(*) FROM instructors WHERE class_id=21 AND available;'),'2')
    a.q("UPDATE instructors SET available=false WHERE class_id=21 AND person='Lena';")
    b.q("UPDATE instructors SET available=false WHERE class_id=21 AND person='Ravi';")
    a.q('COMMIT;');result=b.q('COMMIT;')
    if level=='SERIALIZABLE':
     assert '40001' in result;b.q('ROLLBACK; BEGIN ISOLATION LEVEL SERIALIZABLE;');expect(b.q('SELECT count(*) FROM instructors WHERE class_id=21 AND available;'),'1');b.q('COMMIT;')
    expect(o.q('SELECT count(*) FROM instructors WHERE class_id=21 AND available;'),'1' if level=='SERIALIZABLE' else '0')
   # Locking returned reservations does not protect a future distinct reservation.
   reset();o.q('UPDATE classes SET capacity=2,remaining=1 WHERE class_id=22;');a.q('BEGIN;');expect(a.q('SELECT request_id FROM reservations WHERE class_id=22 FOR UPDATE;'),'R7')
   b.q('BEGIN;');expect(b.q('SELECT request_id FROM reservations WHERE class_id=22 FOR UPDATE SKIP LOCKED;'),'')
   expect(b.q("INSERT INTO reservations VALUES ('R14',22,3); COMMIT;"),'');a.q("INSERT INTO reservations VALUES ('R13',22,1); COMMIT;")
   expect(o.q('SELECT count(*) FROM reservations WHERE class_id=22;'),'3')
   # Canonical coordination row, count AFTER acquiring, in separate statement.
   reset();o.q('UPDATE classes SET capacity=2,remaining=1 WHERE class_id=22;');a.q('BEGIN; SELECT class_id FROM classes WHERE class_id=22 FOR UPDATE;');b.q('BEGIN;')
   with concurrent.futures.ThreadPoolExecutor() as pool:
    future=pool.submit(b.q,'SELECT class_id FROM classes WHERE class_id=22 FOR UPDATE;');wait(b);a.q("INSERT INTO reservations VALUES ('R13',22,1); COMMIT;");expect(future.result(),'22')
   expect(b.q('SELECT count(*) FROM reservations WHERE class_id=22;'),'2');b.q('ROLLBACK;')
   # Same-command count keeps its starting snapshot across an observed lock wait.
   reset();o.q('UPDATE classes SET capacity=2,remaining=1 WHERE class_id=22;')
   a.q("BEGIN ISOLATION LEVEL READ COMMITTED; SELECT class_id FROM classes WHERE class_id=22 FOR UPDATE; INSERT INTO reservations VALUES ('R13',22,1);")
   b.q('BEGIN ISOLATION LEVEL READ COMMITTED;')
   with concurrent.futures.ThreadPoolExecutor() as pool:
    future=pool.submit(b.q,fixture['combinedCount']);wait(b);a.q('COMMIT;');expect(future.result(),'22|1')
   expect(b.q('SELECT count(*) FROM reservations WHERE class_id=22;'),'2')
   b.q('ROLLBACK;');expect(o.q('SELECT count(*) FROM reservations WHERE class_id=22;'),'2')
   log.append({'same_command_count':'Observed lock wait; combined command returned 22|1; fresh next command counted 2; R14 declined.'})
   # Deadlock and known transaction abort; survivor can finish after victim aborts.
   reset();a.q('BEGIN; SELECT class_id FROM classes WHERE class_id=21 FOR UPDATE;');b.q('BEGIN; SELECT class_id FROM classes WHERE class_id=22 FOR UPDATE;')
   with concurrent.futures.ThreadPoolExecutor() as pool:
    fa=pool.submit(a.q,'SELECT class_id FROM classes WHERE class_id=22 FOR UPDATE;');wait(a)
    fb=pool.submit(b.q,'SELECT class_id FROM classes WHERE class_id=21 FOR UPDATE;');ra,rb=fa.result(),fb.result()
   assert ('40P01' in ra)^('40P01' in rb)
   victim=a if '40P01' in ra else b;assert '25P02' in victim.q('SELECT 1;');a.q('ROLLBACK;');b.q('ROLLBACK;')
   # Bounded load: 20 clients, one place; each statement has its own transaction.
   reset()
   for i in range(101,121):o.q(f"INSERT INTO customers VALUES ({i},'Load client {i}');")
   clients=[Session('load'+str(i)) for i in range(20)]
   with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
    results=list(pool.map(lambda pair:pair[1].q(book(fixture['guarded'],'R'+str(pair[0]+20),pair[0]+101)),enumerate(clients)))
   expect(sum(bool(x) for x in results),1);expect(state(21),'0|1|t')
   log.append({'assertions':'All hostile counterexamples and protected outcomes passed; load: 1 accepted, 19 declined.'})
  finally:
   for s in sessions:
    if s.p.poll() is None:
     try:s.p.stdin.write('\\q\n');s.p.stdin.flush();s.p.wait(timeout=3)
     except Exception:s.p.kill();s.p.wait()
   if started or pathlib.Path(data,'postmaster.pid').exists():command([BIN+'/pg_ctl','-D',data,'-m','fast','-w','stop'])
try:
 run()
except Exception as e:
 log.append({'failure':repr(e)});print(json.dumps(log,indent=2));raise
else: print(json.dumps(log,indent=2))
