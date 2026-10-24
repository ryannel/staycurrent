#!/usr/bin/env python3
"""Owned, disposable PostgreSQL pagination checks. Python 3 standard library only.
Run: python3 run-pagination.py --bindir /path/to/postgresql/bin
No existing connection or database is used. All change histories reset five headers.
"""
import argparse
import getpass
import json
import os
from pathlib import Path
import selectors
import subprocess
import tempfile
import time
import uuid

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir',required=True)
a=parser.parse_args()
bindir=Path(a.bindir).resolve()
env={k:v for k,v in os.environ.items() if not k.startswith('PG') and k not in ('DATABASE_URL','DATABASE_HOST','DATABASE_PORT')}
for name in ('initdb','pg_ctl','postgres','psql'):
    if not (bindir/name).is_file():raise SystemExit('Missing PostgreSQL binary: '+name)

class Session:
    def __init__(self,args):
        self.p=subprocess.Popen([str(bindir/'psql'),*args,'-A','-t','-q'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,env=env,bufsize=0)
        self.buffer=b''
    def query(self,sql):
        marker=('done_'+uuid.uuid4().hex).encode()
        self.p.stdin.write(sql.encode()+b'\n\\echo '+marker+b'\n');self.p.stdin.flush()
        deadline=time.monotonic()+15
        with selectors.DefaultSelector() as select:
            select.register(self.p.stdout,selectors.EVENT_READ)
            while marker+b'\n' not in self.buffer:
                left=deadline-time.monotonic()
                if left<=0 or not select.select(left):raise TimeoutError('Owned SQL session timed out')
                chunk=os.read(self.p.stdout.fileno(),65536)
                if not chunk:raise RuntimeError('Owned psql ended: '+self.buffer.decode())
                self.buffer+=chunk
        before,self.buffer=self.buffer.split(marker+b'\n',1)
        result=before.decode().strip()
        if 'ERROR:' in result:raise RuntimeError(result)
        return result
    def close(self):
        if self.p.poll() is None:
            try:self.p.stdin.write(b'ROLLBACK;\n\\q\n');self.p.stdin.flush();self.p.wait(timeout=3)
            except (BrokenPipeError,subprocess.TimeoutExpired):self.p.kill();self.p.wait(timeout=3)
        self.p.stdin.close();self.p.stdout.close()

def ids(text):return [int(row.split('|')[0]) for row in text.splitlines() if row.strip()]
def expect(actual,wanted,label):
    if actual!=wanted:raise AssertionError((label,actual,wanted))
    print(label+': '+str(actual))

started_at=time.monotonic()
with tempfile.TemporaryDirectory(prefix='staycurrent-r07-pg-') as tmp:
    base=Path(tmp);data=base/'data';sock=base/'socket';sock.mkdir();sessions=[];started=False
    def run(name,args):
        return subprocess.run([str(bindir/name),*args],env=env,text=True,capture_output=True,check=True,timeout=30)
    try:
        run('initdb',['-D',str(data),'--no-locale','-E','UTF8','-A','trust'])
        run('pg_ctl',['-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {sock} -p 55467 -c listen_addresses=''",'-w','start']);started=True
        args=['-X','-h',str(sock),'-p','55467','-U',getpass.getuser(),'-d','postgres','-v','ON_ERROR_STOP=1']
        def session():
            s=Session(args);sessions.append(s)
            own=s.query("SELECT current_setting('data_directory') || '|' || current_user;")
            assert own==str(data)+'|'+getpass.getuser(),own
            s.query("SET TIME ZONE 'UTC';")
            return s
        admin=session();reader=session();writer=session()
        print(run('postgres',['--version']).stdout.strip())
        print('Ownership verified on all three private-socket sessions; inherited PG connection variables removed.')
        admin.query('CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL,placed_at timestamptz NOT NULL,status text NOT NULL);')
        rows="""(101,1,'2026-10-12 09:30Z','paid'),(102,2,'2026-10-14 16:05Z','paid'),(103,1,'2026-10-20 10:15Z','pending'),(105,1,'2026-10-21 12:00Z','pending'),(106,3,'2026-10-21 12:00Z','pending')"""
        def reset():admin.query('TRUNCATE orders; INSERT INTO orders VALUES '+rows+';')
        page="SELECT order_id,placed_at FROM orders WHERE status<>'cancelled'"
        order=' ORDER BY placed_at,order_id LIMIT 2'
        after=" AND (placed_at,order_id) > (timestamptz '2026-10-14 16:05Z',102)"
        reset()
        expect(ids(admin.query(page+order+';')),[101,102],'First page')
        expect(ids(admin.query(page+order+' OFFSET 2;')),[103,105],'Unchanged offset page')
        expect(ids(admin.query(page+after+order+';')),[103,105],'Unchanged keyset page')
        expect(ids(admin.query(page+" AND placed_at>timestamptz '2026-10-21 12:00Z'"+order+';')),[],'Timestamp-only boundary loses tied 106')
        expect(ids(admin.query(page+" AND (placed_at,order_id)>(timestamptz '2026-10-21 12:00Z',105)"+order+';')),[106],'Full boundary keeps tied 106')
        admin.query("UPDATE orders SET status='cancelled' WHERE order_id=101;")
        expect(ids(admin.query(page+order+' OFFSET 2;')),[105,106],'Cancel 101: offset omits 103')
        expect(ids(admin.query(page+after+order+';')),[103,105],'Cancel 101: keyset continues correctly')
        reset();admin.query("UPDATE orders SET placed_at='2026-10-13 12:00Z' WHERE order_id=103;")
        expect(ids(admin.query(page+order+' OFFSET 2;')),[102,105],'Move 103: offset repeats 102')
        expect(ids(admin.query(page+after+order+';')),[105,106],'Move 103: keyset misses moved row')
        for level in ('READ COMMITTED','REPEATABLE READ'):
            reset();reader.query('BEGIN ISOLATION LEVEL '+level+' READ ONLY;')
            expect(int(reader.query("SELECT count(*) FROM orders WHERE status<>'cancelled';")),5,level+' initial count')
            expect(ids(reader.query(page+order+';')),[101,102],level+' first batch')
            writer.query("UPDATE orders SET status='cancelled' WHERE order_id=103;")
            expected=[105,106] if level=='READ COMMITTED' else [103,105]
            expect(ids(reader.query(page+after+order+';')),expected,level+' second keyset query')
            reader.query('COMMIT;')
        for level in ('READ COMMITTED','REPEATABLE READ'):
            reset();reader.query('BEGIN ISOLATION LEVEL '+level+' READ ONLY;')
            expect(int(reader.query("SELECT count(*) FROM orders WHERE status<>'cancelled';")),5,level+' cursor initial count')
            reader.query("DECLARE export_orders NO SCROLL CURSOR FOR SELECT order_id,customer_id,placed_at,status FROM orders WHERE status<>'cancelled' ORDER BY placed_at,order_id;")
            expect(ids(reader.query('FETCH FORWARD 2 FROM export_orders;')),[101,102],level+' cursor first fetch')
            writer.query("UPDATE orders SET status='cancelled' WHERE order_id=103;")
            expect(ids(reader.query('FETCH FORWARD 2 FROM export_orders;')),[103,105],level+' cursor second fetch')
            expect(ids(reader.query('FETCH FORWARD 2 FROM export_orders;')),[106],level+' cursor last nonempty fetch')
            expect(ids(reader.query('FETCH FORWARD 2 FROM export_orders;')),[],level+' cursor end')
            expected=4 if level=='READ COMMITTED' else 5
            expect(int(reader.query("SELECT count(*) FROM orders WHERE status<>'cancelled';")),expected,level+' separate count after commit')
            reader.query('CLOSE export_orders; COMMIT;')
        admin.query('CREATE TABLE page_work(n integer PRIMARY KEY); INSERT INTO page_work SELECT generate_series(1,20000);')
        admin.query('VACUUM ANALYZE page_work;')
        plans={}
        for label,query in [('offset','SELECT n FROM page_work ORDER BY n LIMIT 2 OFFSET 10000'),('seek','SELECT n FROM page_work WHERE n>10000 ORDER BY n LIMIT 2')]:
            plan=json.loads(admin.query('EXPLAIN (ANALYZE,BUFFERS,TIMING OFF,FORMAT JSON) '+query+';'))[0]
            scan=plan['Plan']['Plans'][0]
            expect(scan['Node Type'],'Index Only Scan',label+' plan node')
            expect(scan['Actual Rows'],10002 if label=='offset' else 2,label+' rows produced by scan')
            plans[label]=plan
        print('Native plans (timings are recorded diagnostics, not comparative benchmarks):')
        print(json.dumps(plans,indent=2))
        print('All pagination, snapshot, cursor and plan checks passed.')
    finally:
        for s in reversed(sessions):s.close()
        if started:run('pg_ctl',['-D',str(data),'-m','immediate','-w','stop'])
print('All owned sessions and server stopped; temporary data/socket directory removed.')
print('Elapsed seconds: '+str(round(time.monotonic()-started_at,3)))
