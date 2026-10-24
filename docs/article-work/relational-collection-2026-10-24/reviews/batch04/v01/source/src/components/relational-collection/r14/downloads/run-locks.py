#!/usr/bin/env python3
"""Owned disposable PostgreSQL lock experiments; Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time
ap=argparse.ArgumentParser(); ap.add_argument('--bindir',required=True); args=ap.parse_args()
binpath=pathlib.Path(args.bindir); env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r14-')); data=base/'data'; sock=base/'socket'; sock.mkdir(); sessions=[]; results={}
def command(name,*a):
    return subprocess.run([str(binpath/name),*map(str,a)],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True).stdout
class Session:
    def __init__(self):
        self.p=subprocess.Popen([str(binpath/'psql'),'-X','-Atq','-h',str(sock),'-p','55414','-U','writer','-d','postgres','-v','VERBOSITY=verbose'],env=env,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.q=queue.Queue(); self.n=0; sessions.append(self)
        def pump():
            for line in self.p.stdout: self.q.put(line.rstrip())
        threading.Thread(target=pump,daemon=True).start()
        assert self.run('SHOW data_directory;')==str(data)
        self.pid=int(self.run('SELECT pg_backend_pid();'))
    def send(self,sql):
        self.n+=1; self.mark=f'END_{self.n}'; self.p.stdin.write(sql+'\n\\echo '+self.mark+'\n'); self.p.stdin.flush()
    def finish(self):
        out=[]; deadline=time.monotonic()+12
        while True:
            line=self.q.get(timeout=max(.01,deadline-time.monotonic()))
            if line==self.mark:return '\n'.join(out)
            out.append(line)
    def run(self,sql): self.send(sql); return self.finish()
    def close(self):
        if self.p.poll() is None:
            self.p.stdin.write('ROLLBACK;\n\\q\n'); self.p.stdin.flush(); self.p.wait(timeout=5)
started=False
try:
    command('initdb','-D',data,'-U','writer','-A','trust','--no-locale')
    command('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p 55414 -c listen_addresses='' -c deadlock_timeout=100ms",'-w','start'); started=True
    o=Session(); a=Session(); b=Session(); results['version']=o.run('SELECT version();')
    o.run("CREATE TABLE sessions(session_id text PRIMARY KEY, capacity int NOT NULL, guard_epoch int NOT NULL DEFAULT 0); INSERT INTO sessions VALUES ('S501',1,0); CREATE TABLE bookings(booking_id text PRIMARY KEY, session_id text REFERENCES sessions, customer_id int NOT NULL);")
    def reset():
        a.run('ROLLBACK;'); b.run('ROLLBACK;'); o.run('TRUNCATE bookings; UPDATE sessions SET guard_epoch=0;')
    def count(s):return s.run("SELECT count(*) FROM bookings WHERE session_id='S501';")
    def insert(s,id,c):return s.run(f"INSERT INTO bookings VALUES ('{id}','S501',{c});")
    def waiting(waiter,holder):
        for _ in range(150):
            if o.run(f'SELECT {holder.pid}=ANY(pg_blocking_pids({waiter.pid}));')=='t':return
            time.sleep(.01)
        raise AssertionError('expected block not seen')
    a.run('BEGIN;'); b.run('BEGIN;'); assert a.run("SELECT booking_id FROM bookings WHERE session_id='S501' FOR UPDATE;")==''; assert b.run("SELECT booking_id FROM bookings WHERE session_id='S501' FOR UPDATE;")==''
    assert count(a)==count(b)=='0'; insert(a,'B201',1); insert(b,'B202',2); a.run('COMMIT;'); b.run('COMMIT;'); results['empty_child_locks']=int(count(o)); assert results['empty_child_locks']==2
    reset(); a.run('BEGIN ISOLATION LEVEL READ COMMITTED;'); b.run('BEGIN ISOLATION LEVEL READ COMMITTED;'); a.run("SELECT capacity FROM sessions WHERE session_id='S501' FOR UPDATE;"); assert count(a)=='0'; b.send("SELECT capacity FROM sessions WHERE session_id='S501' FOR UPDATE;"); waiting(b,a); insert(a,'B201',1); a.run('COMMIT;'); assert b.finish()=='1'; results['read_committed_count_after_wait']=int(count(b)); assert count(b)=='1'; b.run('ROLLBACK;')
    reset(); a.run('BEGIN ISOLATION LEVEL REPEATABLE READ;'); b.run('BEGIN ISOLATION LEVEL REPEATABLE READ;'); assert count(b)=='0'; a.run("SELECT capacity FROM sessions WHERE session_id='S501' FOR UPDATE;"); b.send("SELECT capacity FROM sessions WHERE session_id='S501' FOR UPDATE;"); waiting(b,a); insert(a,'B201',1); a.run('COMMIT;'); b.finish(); assert count(b)=='0'; insert(b,'B202',2); b.run('COMMIT;'); results['repeatable_read_lock_only']=int(count(o)); assert count(o)=='2'
    reset(); a.run('BEGIN ISOLATION LEVEL REPEATABLE READ;'); b.run('BEGIN ISOLATION LEVEL REPEATABLE READ;'); assert count(b)=='0'; a.run("UPDATE sessions SET guard_epoch=guard_epoch+1 WHERE session_id='S501';"); b.send("UPDATE sessions SET guard_epoch=guard_epoch+1 WHERE session_id='S501';"); waiting(b,a); insert(a,'B201',1); a.run('COMMIT;'); err=b.finish(); assert '40001' in err; results['repeatable_read_update_conflict']=err; b.run('ROLLBACK; BEGIN ISOLATION LEVEL REPEATABLE READ;'); b.run("UPDATE sessions SET guard_epoch=guard_epoch+1 WHERE session_id='S501';"); assert count(b)=='1'; b.run('ROLLBACK;'); results['repeatable_read_retry_count']=1
    reset(); a.run('BEGIN ISOLATION LEVEL SERIALIZABLE;'); b.run('BEGIN ISOLATION LEVEL SERIALIZABLE;'); assert count(a)==count(b)=='0'; insert(a,'B201',1); insert(b,'B202',2); a.run('COMMIT;'); err=b.run('COMMIT;'); assert '40001' in err; results['serializable_conflict']=err; assert count(o)=='1'
    o.run("CREATE TABLE products(product_id text PRIMARY KEY,stock int); INSERT INTO products VALUES ('P3',12),('P7',1);")
    a.run('BEGIN;'); b.run('BEGIN;'); a.run("SELECT * FROM products WHERE product_id='P3' FOR UPDATE;"); b.run("SELECT * FROM products WHERE product_id='P7' FOR UPDATE;"); a.send("SELECT * FROM products WHERE product_id='P7' FOR UPDATE;"); waiting(a,b); b.send("SELECT * FROM products WHERE product_id='P3' FOR UPDATE;"); outa=a.finish(); outb=b.finish(); assert ('40P01' in outa) != ('40P01' in outb); results['deadlock']={'a':outa,'b':outb}; a.run('ROLLBACK;'); b.run('ROLLBACK;')
    a.run('BEGIN;'); b.run('BEGIN;'); a.run("SELECT * FROM products WHERE product_id='P3' FOR UPDATE;"); b.send("SELECT * FROM products WHERE product_id='P3' FOR UPDATE;"); waiting(b,a); a.run("SELECT * FROM products WHERE product_id='P7' FOR UPDATE;"); a.run('COMMIT;'); assert 'P3' in b.finish(); b.run("SELECT * FROM products WHERE product_id='P7' FOR UPDATE;"); b.run('COMMIT;'); results['consistent_order']='both transactions completed; second waited before acquiring its first product'
    a.run('BEGIN;'); a.run("SELECT * FROM products WHERE product_id='P7' FOR UPDATE;"); b.run("BEGIN; SET LOCAL lock_timeout='50ms';"); err=b.run("SELECT * FROM products WHERE product_id='P7' FOR UPDATE;"); assert '55P03' in err; results['lock_timeout']=err
    print(json.dumps(results,indent=2))
finally:
    for s in sessions:
        try:s.close()
        except Exception:s.p.kill();s.p.wait()
    if started:command('pg_ctl','-D',data,'-m','fast','-w','stop')
    shutil.rmtree(base)
