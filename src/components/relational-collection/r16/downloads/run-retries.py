#!/usr/bin/env python3
"""Owned disposable PostgreSQL request identity experiments; Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time
ap=argparse.ArgumentParser(); ap.add_argument('--bindir',required=True); args=ap.parse_args()
binpath=pathlib.Path(args.bindir); env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r16-')); data=base/'data'; sock=base/'socket'; sock.mkdir(); sessions=[]; results={}
def command(name,*a):
    return subprocess.run([str(binpath/name),*map(str,a)],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True).stdout
class Session:
    def __init__(self):
        self.p=subprocess.Popen([str(binpath/'psql'),'-X','-Atq','-h',str(sock),'-p','55416','-U','writer','-d','postgres','-v','VERBOSITY=verbose'],env=env,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
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
# The fault injector consumes a real COMMIT response but withholds it from the
# simulated caller. It is a controlled reply-loss model, not a network/power test.
started=False
try:
    command('initdb','-D',data,'-U','writer','-A','trust','--no-locale')
    command('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p 55416 -c listen_addresses=''",'-w','start'); started=True
    o=Session(); a=Session(); b=Session(); results['version']=o.run('SELECT version();')
    shop=json.loads((pathlib.Path(__file__).parent/'shop.json').read_text())
    o.run('CREATE TABLE products(product_id text PRIMARY KEY, stock int NOT NULL CHECK(stock>=0)); CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int NOT NULL,status text NOT NULL); CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text REFERENCES products,quantity int,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no)); CREATE TABLE purchase_requests(request_key text PRIMARY KEY,payload jsonb NOT NULL,order_id int NOT NULL REFERENCES orders DEFERRABLE INITIALLY DEFERRED);')
    for p in shop['products']:o.run(f"INSERT INTO products VALUES ('{p['product_id']}',{p['stock_before_103']});")
    payload={'customer_id':1,'lines':[{'product_id':i['product_id'],'quantity':i['quantity'],'unit_price':i['unit_price']} for i in shop['order_items'] if i['order_id']==103]}
    encoded=json.dumps(payload).replace("'","''")
    claim=f"INSERT INTO purchase_requests VALUES ('purchase-mina-103','{encoded}',103) ON CONFLICT(request_key) DO NOTHING RETURNING request_key;"
    def start(s):return s.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
    def reserve(s):
        for line in sorted(payload['lines'],key=lambda x:x['product_id']):
            q=line['quantity']; p=line['product_id']; out=s.run(f"UPDATE products SET stock=stock-{q} WHERE product_id='{p}' AND stock>={q} RETURNING stock;"); assert out!=''
        s.run("INSERT INTO orders VALUES (103,1,'pending');")
        for n,line in enumerate(payload['lines'],1):s.run(f"INSERT INTO order_items VALUES (103,{n},'{line['product_id']}',{line['quantity']},{line['unit_price']});")
    def state():return o.run("SELECT product_id,stock FROM products ORDER BY product_id; SELECT count(*) FROM orders; SELECT count(*) FROM order_items; SELECT count(*) FROM purchase_requests;")
    def reset():
        a.run('ROLLBACK;'); b.run('ROLLBACK;'); o.run('TRUNCATE purchase_requests,order_items,orders;')
        for p in shop['products']:o.run(f"UPDATE products SET stock={p['stock_before_103']} WHERE product_id='{p['product_id']}';")
    start(a); assert a.run(claim)=='purchase-mina-103'; reserve(a)
    withheld=a.run('COMMIT;'); assert withheld=='' # psql quiet consumes server success
    results['fault_injection']='COMMIT completed; test harness deliberately withheld success from simulated caller'
    assert state()=='P3|10\nP7|0\nP9|4\n1\n2\n1'; results['after_withheld_commit']=state()
    start(b); assert b.run(claim)==''; assert b.run(f"SELECT payload='{encoded}'::jsonb,order_id FROM purchase_requests WHERE request_key='purchase-mina-103';")=='t|103'; b.run('COMMIT;'); assert state()==results['after_withheld_commit']; results['same_key_replay']='103 returned; stock/order/line/request counts unchanged'
    start(b); assert b.run(claim)==''; assert b.run("SELECT payload='{}'::jsonb FROM purchase_requests WHERE request_key='purchase-mina-103';")=='f'; b.run('ROLLBACK;'); results['conflicting_payload']='rejected before purchase work; state unchanged'; assert state()==results['after_withheld_commit']
    start(b); blind=b.run("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock;"); assert blind==''; b.run('ROLLBACK;'); results['blind_replay']='no mug returned: original success would be misreported as out of stock'
    reset(); start(a); assert a.run(claim)=='purchase-mina-103'; reserve(a); a.p.kill(); a.p.wait(); a.p.stdin.close()
    for _ in range(150):
        if o.run('SELECT count(*) FROM purchase_requests;')=='0':break
        time.sleep(.01)
    assert state()=='P3|12\nP7|1\nP9|4\n0\n0\n0'; start(b); assert b.run(claim)=='purchase-mina-103'; reserve(b); b.run('COMMIT;'); results['disconnect_before_commit_then_retry']=state(); assert state()=='P3|10\nP7|0\nP9|4\n1\n2\n1'
    a=Session(); reset(); start(a); start(b); assert a.run(claim)=='purchase-mina-103'; b.send(claim)
    for _ in range(150):
        if o.run(f'SELECT {a.pid}=ANY(pg_blocking_pids({b.pid}));')=='t':break
        time.sleep(.01)
    else:raise AssertionError('same-key overlap did not block')
    reserve(a); a.run('COMMIT;'); assert b.finish()==''; assert b.run("SELECT order_id FROM purchase_requests WHERE request_key='purchase-mina-103';")=='103'; b.run('COMMIT;'); results['overlap']='second claim waited; separate subsequent SELECT returned103'; assert state()=='P3|10\nP7|0\nP9|4\n1\n2\n1'
    results['limits']='No network partition, crash durability, provider call or latency measurement. Reply withholding is deliberately injected at the caller boundary.'
    print(json.dumps(results,indent=2))
finally:
    for s in sessions:
        try:s.close()
        except Exception:
            if s.p.poll() is None:s.p.kill();s.p.wait()
    if started:command('pg_ctl','-D',data,'-m','fast','-w','stop')
    shutil.rmtree(base)
