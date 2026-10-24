#!/usr/bin/env python3
"""Owned, disposable PostgreSQL pool and blocker drill. Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time, uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', required=True)
args = parser.parse_args()
binpath = pathlib.Path(args.bindir).resolve()
root = pathlib.Path(tempfile.mkdtemp(prefix='r41-schema-', dir='/private/tmp' if pathlib.Path('/private/tmp').exists() else None))
data, sock = root / 'data', root / 'sock'
sock.mkdir(mode=0o700)
owner = 'r41_owner'
env = {k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGPASSFILE=str(root/'no-passwords'), PGSERVICEFILE=str(root/'no-services'), LC_ALL='C')
(root/'no-passwords').touch(mode=0o600)
(root/'no-services').touch(mode=0o600)
sessions=[]
results={}
started=False

def run(name, *argv):
    return subprocess.run([str(binpath/name), *argv], env=env, text=True, capture_output=True, check=True, timeout=30)

class Session:
    def __init__(self, label):
        self.label=label
        self.process=subprocess.Popen([str(binpath/'psql'),'-X','-qAt','-F','\t','-v','VERBOSITY=verbose',
            '-h',str(sock),'-p','55441','-U',owner,'-d','postgres'], env={**env,'PGAPPNAME':label},
            stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.lines=queue.Queue()
        threading.Thread(target=lambda: [self.lines.put(line.rstrip('\n')) for line in self.process.stdout],daemon=True).start()
        sessions.append(self)
        proof=self.sql("SELECT current_setting('data_directory'), current_setting('unix_socket_directories'), current_user, current_database(), pg_backend_pid();")
        fields=proof[-1].split('\t')
        assert fields[:4]==[str(data),str(sock),owner,'postgres'],proof
        self.pid=int(fields[4])
    def begin(self, sql):
        marker='done_'+uuid.uuid4().hex
        self.process.stdin.write(sql+'\n\\echo '+marker+'\n')
        self.process.stdin.flush()
        return marker
    def finish(self, marker, timeout=15):
        end=time.monotonic()+timeout
        lines=[]
        while time.monotonic()<end:
            try: line=self.lines.get(timeout=max(.01,end-time.monotonic()))
            except queue.Empty: break
            if line==marker: return lines
            lines.append(line)
        raise TimeoutError((self.label,lines))
    def sql(self, sql): return self.finish(self.begin(sql))
    def close(self):
        if self.process.poll() is None:
            self.process.stdin.write('ROLLBACK;\n\\q\n');self.process.stdin.flush()
            try: self.process.wait(timeout=3)
            except subprocess.TimeoutExpired: self.process.terminate();self.process.wait(timeout=3)

def checked(session, sql):
    lines=session.sql(sql)
    assert not any('ERROR:' in x for x in lines),lines
    return lines

def one(session, sql): return checked(session,sql)[-1]

def until(observer, sql, predicate, seconds=5):
    end=time.monotonic()+seconds
    while time.monotonic()<end:
        value=one(observer,sql)
        if predicate(value):return value
        time.sleep(.025)
    raise AssertionError(('condition not observed',sql,value))

try:
    run('initdb','-D',str(data),'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8')
    with (data/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=55441\nmax_connections=20\n")
    run('pg_ctl','-D',str(data),'-l',str(root/'server.log'),'-w','start')
    started=True
    admin=Session('r41_observer')
    results['version']=one(admin,'SELECT version();')
    checked(admin,"CREATE TABLE products(product_id text PRIMARY KEY,stock integer CHECK(stock>=0)); INSERT INTO products VALUES('P7',1); CREATE TABLE pending_note(note text);")
    holder=Session('r41_holder')
    checked(holder,"BEGIN; SELECT stock FROM products WHERE product_id='P7' FOR UPDATE; INSERT INTO pending_note VALUES('uncommitted maintenance note');")
    holder_start=one(admin,f"SELECT backend_start FROM pg_stat_activity WHERE pid={holder.pid};")
    pool=queue.Queue(maxsize=2)
    for label in ['r41_pool_A','r41_pool_B']:pool.put(Session(label))
    borrowed=[]
    markers=[]
    for request in ['A','B']:
        session=pool.get(timeout=1)
        borrowed.append(session)
        markers.append(session.begin("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>0 RETURNING stock;"))
    for session in borrowed:
        until(admin,f"SELECT cardinality(pg_blocking_pids({session.pid}))>0;",lambda x:x=='t')
    results['blocked_activity']=checked(admin,"SELECT application_name,state,wait_event_type,wait_event,pg_blocking_pids(pid) FROM pg_stat_activity WHERE application_name IN ('r41_holder','r41_pool_A','r41_pool_B') ORDER BY application_name;")
    results['pool_before']={'maximum':2,'borrowed':len(borrowed),'available':pool.qsize()}
    start=time.monotonic()
    try:
        pool.get(timeout=.25)
        raise AssertionError('Unexpected connection available to C')
    except queue.Empty:pass
    results['C']={'outcome':'acquisition timeout; no SQL submitted','measured_wait_ms':round((time.monotonic()-start)*1000,3)}
    assert one(admin,"SELECT count(*) FROM pg_stat_activity WHERE application_name='r41_request_C';")=='0'
    assert one(admin,f"SELECT state FROM pg_stat_activity WHERE pid={holder.pid};")=='idle in transaction'
    assert one(admin,f"SELECT pg_cancel_backend({holder.pid});")=='t'
    # Observe the dependency after the cancel signal has been sent.
    assert one(admin,f"SELECT state FROM pg_stat_activity WHERE pid={holder.pid};")=='idle in transaction'
    assert one(admin,f"SELECT cardinality(pg_blocking_pids({borrowed[1].pid}))>0;")=='t'
    results['cancel_idle_holder']='signal sent; transaction still open; B still blocked'
    assert one(admin,f"SELECT pg_cancel_backend({borrowed[0].pid});")=='t'
    canceled=borrowed[0].finish(markers[0])
    assert any('57014' in x for x in canceled),canceled
    assert one(admin,f"SELECT state FROM pg_stat_activity WHERE pid={borrowed[0].pid};")=='idle in transaction (aborted)'
    checked(borrowed[0],'ROLLBACK;')
    pool.put(borrowed[0])
    results['cancel_A']={'server_result':canceled,'pool_available_after_rollback':pool.qsize(),'B_still_blocked':one(admin,f"SELECT cardinality(pg_blocking_pids({borrowed[1].pid}))>0;")}
    # Recheck both PID and backend creation identity immediately before the owned intervention.
    assert one(admin,f"SELECT backend_start FROM pg_stat_activity WHERE pid={holder.pid} AND application_name='r41_holder';")==holder_start
    assert one(admin,f"SELECT pg_terminate_backend({holder.pid},5000);")=='t'
    results['holder_absent']=one(admin,f"SELECT count(*) FROM pg_stat_activity WHERE pid={holder.pid};")=='0'
    b_output=borrowed[1].finish(markers[1])
    assert b_output==['0'],b_output
    checked(borrowed[1],'COMMIT;')
    pool.put(borrowed[1])
    assert one(admin,'SELECT count(*) FROM pending_note;')=='0'
    results['B']={'returned_stock':b_output,'outcome':'committed one scratch stock decrement'}
    results['termination_cost']={'uncommitted_notes_retained':0,'holder_session_lost':True}
    retry=pool.get(timeout=1)
    checked(retry,'BEGIN;')
    retry_rows=checked(retry,"UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>0 RETURNING stock;")
    assert retry_rows==[],retry_rows
    checked(retry,'ROLLBACK;')
    pool.put(retry)
    results['A_retry']={'outcome':'no stock; zero rows changed','rows':retry_rows}
    results['pool_after']={'maximum':2,'available':pool.qsize(),'borrowed':0}
    results['final_stock']=one(admin,"SELECT stock FROM products WHERE product_id='P7';")
    assert results['final_stock']=='0' and pool.qsize()==2
    results['success']=True
    print(json.dumps(results,indent=2))

finally:
    for s in reversed(sessions):
        try:s.close()
        except Exception:pass
    if started:
        # pg_ctl targets only the directory created by this invocation.
        pidfile=data/'postmaster.pid'
        if pidfile.exists() and pidfile.read_text().splitlines()[1]==str(data):
            run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
        else: raise RuntimeError('Refusing cleanup: owned postmaster identity unavailable')
    shutil.rmtree(root)
