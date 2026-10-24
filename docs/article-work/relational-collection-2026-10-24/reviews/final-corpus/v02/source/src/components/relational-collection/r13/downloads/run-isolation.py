#!/usr/bin/env python3
"""Run only in a new, owned throwaway PostgreSQL cluster. Python 3 standard library.
Usage: python3 run-isolation.py --bindir /path/to/postgresql/bin
Creates and removes its own cluster; does not use existing connection settings.
"""
import argparse, concurrent.futures, json, os, pathlib, shutil, subprocess, tempfile, time
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', default='/opt/homebrew/opt/postgresql@18/bin')
parser.add_argument('--output', default='isolation-results.json')
args=parser.parse_args()
binpath=pathlib.Path(args.bindir).resolve()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r13-'))
data=root/'data'; sock=root/'socket'; sock.mkdir()
transcript=[]; sessions=[]; started=False

def command(name,*params):
    result=subprocess.run([str(binpath/name),*map(str,params)],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    transcript.append({'command':[name,*map(str,params)],'output':result.stdout,'returncode':result.returncode})
    if result.returncode: raise RuntimeError(result.stdout)
    return result.stdout

class Session:
    def __init__(self,name):
        self.name=name
        self.p=subprocess.Popen([str(binpath/'psql'),'-X','-qAt','-h',str(sock),'-p','55439','-U','r13_owner','-d','postgres','-v','VERBOSITY=verbose'],env=env,text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,bufsize=1)
        sessions.append(self)
        self.pid=int(self.sql('SELECT pg_backend_pid();')[0][0])
    def sql(self,sql):
        self.p.stdin.write(sql+'\n\\echo __R13_DONE__ :SQLSTATE\n');self.p.stdin.flush()
        lines=[]
        while True:
            line=self.p.stdout.readline()
            if not line: raise RuntimeError('psql ended unexpectedly: '+repr(lines))
            if line.startswith('__R13_DONE__ '):
                state=line.strip().split()[-1];break
            lines.append(line.rstrip())
        transcript.append({'session':self.name,'sql':sql,'output':lines,'sqlstate':state})
        return lines,state
    def close(self):
        if self.p.poll() is None:
            self.p.stdin.write('ROLLBACK;\n\\q\n');self.p.stdin.flush()
            self.p.wait(timeout=5)

def value(s,sql):
    rows,state=s.sql(sql)
    assert state=='00000',(sql,rows,state)
    return rows[-1]

def purchase(s,order):
    customer=1 if order==103 else 2
    if order==103:
        assert value(s,"UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING stock;")=='10'
    sql=f"INSERT INTO orders VALUES ({order},{customer},'2026-10-20 10:15:00Z','pending'); INSERT INTO order_items VALUES ({order},1,'P7',1,20.00);"
    if order==103: sql+=" INSERT INTO order_items VALUES (103,2,'P3',2,4.50);"
    assert s.sql(sql)[1]=='00000'

try:
    version=command('postgres','--version').strip()
    command('initdb','-D',data,'-U','r13_owner','--no-locale','--encoding=UTF8','--auth=trust')
    command('pg_ctl','-D',data,'-l',root/'server.log','-o',f"-k {sock} -p 55439 -h '' -c max_connections=8 -c shared_buffers=16MB",'-w','start');started=True
    admin=Session('observer');a=Session('A');b=Session('B')
    assert pathlib.Path(value(admin,'SHOW data_directory;')).resolve()==data.resolve()
    assert value(admin,'SELECT current_user;')=='r13_owner'
    ddl="""CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL);
CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL CHECK(status IN('pending','paid','cancelled')));
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL REFERENCES products,quantity integer NOT NULL CHECK(quantity>0),unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TABLE duty(session_id text NOT NULL,instructor_id text NOT NULL,on_duty boolean NOT NULL,PRIMARY KEY(session_id,instructor_id));
INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,12),('P7','Blue mug',20.00,1),('P9','Teapot',35.00,4);
INSERT INTO duty VALUES('S502','I1',true),('S502','I2',true);"""
    assert admin.sql(ddl)[1]=='00000'
    def reset():
        assert admin.sql("TRUNCATE order_items,orders; UPDATE products SET stock=CASE product_id WHEN 'P3' THEN 12 WHEN 'P7' THEN 1 ELSE 4 END;")[1]=='00000'
    results={}
    # Atomic rollback leaves neither order nor stock effect.
    a.sql('BEGIN;');a.sql("UPDATE products SET stock=0 WHERE product_id='P7';");purchase(a,103)
    assert value(admin,"SELECT stock FROM products WHERE product_id='P7';")=='1'
    a.sql('ROLLBACK;')
    assert value(admin,'SELECT count(*) FROM orders;')=='0'
    assert value(admin,"SELECT stock FROM products WHERE product_id='P3';")=='12'
    results['rollback']='no order, no stock effects; observer saw only committed stock'
    # Separate saved-value writes lose a sale despite non-negative stock.
    reset();a.sql('BEGIN;');b.sql('BEGIN;')
    assert value(a,"SELECT stock FROM products WHERE product_id='P7';")=='1'
    assert value(b,"SELECT stock FROM products WHERE product_id='P7';")=='1'
    a.sql("UPDATE products SET stock=0 WHERE product_id='P7';");purchase(a,103);a.sql('COMMIT;')
    b.sql("UPDATE products SET stock=0 WHERE product_id='P7';");purchase(b,104);b.sql('COMMIT;')
    assert value(admin,'SELECT count(*) FROM orders;')=='2'
    assert value(admin,"SELECT stock FROM products WHERE product_id='P7';")=='0'
    results['saved_value']='orders 103 and 104 committed, stock 0: oversold'
    # Conditional UPDATE in Read Committed waits and rechecks.
    reset();a.sql('BEGIN ISOLATION LEVEL READ COMMITTED;');b.sql('BEGIN ISOLATION LEVEL READ COMMITTED;')
    assert value(a,"UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>0 RETURNING stock;")=='0'
    with concurrent.futures.ThreadPoolExecutor() as pool:
        pending=pool.submit(b.sql,"UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>0 RETURNING stock;")
        deadline=time.monotonic()+5; waiting=False
        while time.monotonic()<deadline:
            if value(admin,f"SELECT COALESCE(wait_event_type,'') FROM pg_stat_activity WHERE pid={b.pid};")=='Lock':waiting=True;break
            time.sleep(.02)
        assert waiting,'Second updater never observed waiting for owned first transaction'
        purchase(a,103);a.sql('COMMIT;')
        rows,state=pending.result(timeout=5)
        assert state=='00000' and rows==[],(rows,state)
    b.sql('ROLLBACK;')
    assert value(admin,'SELECT string_agg(order_id::text,\',\' ORDER BY order_id) FROM orders;')=='103'
    assert value(admin,"SELECT string_agg(product_id||':'||stock,',' ORDER BY product_id) FROM products;")=='P3:10,P7:0,P9:4'
    results['conditional_update']='B observed Lock wait, then zero rows; only order 103; P3:10,P7:0,P9:4'
    # Same row read twice, concurrent commit between reads.
    for level,expected in [('READ COMMITTED','0'),('REPEATABLE READ','1')]:
        reset();a.sql('BEGIN ISOLATION LEVEL '+level+';')
        first=value(a,"SELECT stock FROM products WHERE product_id='P7';")
        b.sql("UPDATE products SET stock=0 WHERE product_id='P7';")
        second=value(a,"SELECT stock FROM products WHERE product_id='P7';")
        assert first=='1' and second==expected
        a.sql('COMMIT;');results['snapshot_'+level]=[first,second]
    # Two instructors, each leaves only after counting another on duty.
    for level in ['REPEATABLE READ','SERIALIZABLE']:
        admin.sql('UPDATE duty SET on_duty=true;');a.sql('BEGIN ISOLATION LEVEL '+level+';');b.sql('BEGIN ISOLATION LEVEL '+level+';')
        assert value(a,"SELECT count(*) FROM duty WHERE session_id='S502' AND on_duty;")=='2'
        assert value(b,"SELECT count(*) FROM duty WHERE session_id='S502' AND on_duty;")=='2'
        a.sql("UPDATE duty SET on_duty=false WHERE session_id='S502' AND instructor_id='I1';");a.sql('COMMIT;')
        rows,state=b.sql("UPDATE duty SET on_duty=false WHERE session_id='S502' AND instructor_id='I2';")
        if level=='REPEATABLE READ':
            assert state=='00000';assert b.sql('COMMIT;')[1]=='00000'
            assert value(admin,"SELECT count(*) FROM duty WHERE session_id='S502' AND on_duty;")=='0'
            results['write_skew']='both commits, zero instructors on duty'
        else:
            if state=='00000':rows,state=b.sql('COMMIT;')
            assert state=='40001',(rows,state)
            b.sql('ROLLBACK;');b.sql('BEGIN ISOLATION LEVEL SERIALIZABLE;')
            assert value(b,"SELECT count(*) FROM duty WHERE session_id='S502' AND on_duty;")=='1'
            # Complete decision reruns: no other instructor remains, so do not leave.
            b.sql('COMMIT;')
            assert value(admin,"SELECT string_agg(instructor_id||':'||on_duty,',' ORDER BY instructor_id) FROM duty WHERE session_id='S502';")=='I1:false,I2:true'
            results['serializable']='B gets 40001; fresh decision retains I2; I1:false,I2:true'
    print(json.dumps({'version':version,'results':results},indent=2))
finally:
    for s in reversed(sessions):
        try:s.close()
        except Exception as exc:transcript.append({'cleanup_error':str(exc)})
    if started or (data/'postmaster.pid').exists():
        command('pg_ctl','-D',data,'-m','fast','-w','stop')
    if (root/'server.log').exists():transcript.append({'server_log':(root/'server.log').read_text()})
    pathlib.Path(args.output).write_text(json.dumps({'transcript':transcript},indent=2)+'\n')
    shutil.rmtree(root)
