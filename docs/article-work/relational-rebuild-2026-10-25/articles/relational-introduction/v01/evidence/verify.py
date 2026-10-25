from pathlib import Path
import os, subprocess, time, json, hashlib
BASE = Path(__file__).resolve().parents[1]
PG = '/opt/homebrew/bin/'
DATA = BASE/'db-data'
SOCKET = BASE/'db-socket'
ENV = {k:v for k,v in os.environ.items() if not k.startswith('PG')}
ENV.update({'LC_ALL':'C','LANG':'C'})
CONN = [PG+'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-h',str(SOCKET),'-p','55461','-U','intro_writer','-d','postgres']
def sql(source, fail=False):
    result = subprocess.run(CONN,input=source,text=True,capture_output=True,env=ENV)
    if fail:
        assert result.returncode != 0, result.stdout
    else:
        assert result.returncode == 0,result.stderr
    return result.stdout.strip() or result.stderr.strip()
def worker(name, source):
    env = dict(ENV, PGAPPNAME=name)
    return subprocess.Popen(CONN,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,env=env)
def send(p,source):
    p.stdin.write(source+'\n');p.stdin.flush()
def read_to(p, marker):
    result=[]
    while True:
        line = p.stdout.readline()
        assert line, p.stderr.read()
        if line.strip()==marker:return '\n'.join(result)
        result.append(line.strip())
results={}
SOCKET.mkdir(exist_ok=True)
try:
    subprocess.run([PG+'initdb','-D',str(DATA),'-U','intro_writer','-A','trust','--no-locale','--encoding=UTF8','-c','shared_memory_type=mmap','-c','dynamic_shared_memory_type=mmap'],env=ENV,check=True,capture_output=True)
    subprocess.run([PG+'pg_ctl','-D',str(DATA),'-l',str(BASE/'evidence/postgres.log'),'-o',f"-k {SOCKET} -p 55461 -h ''",'-w','start'],env=ENV,check=True,capture_output=True)
    assert Path(sql('SHOW data_directory;')).resolve()==DATA.resolve()
    results['environment']=sql("SELECT version(); SHOW data_directory; SHOW default_transaction_isolation;")
    setup=(BASE/'evidence/setup.sql').read_text()
    sql(setup)
    results['success']=sql("""BEGIN;
UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING product_id,stock;
INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending');
UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING product_id,stock;
INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
COMMIT;
SELECT order_id,status FROM orders WHERE customer_id=1 ORDER BY order_id;
SELECT i.order_id,i.line_no,p.name,i.quantity,i.unit_price FROM order_items i JOIN products p ON p.product_id=i.product_id WHERE i.order_id=103 ORDER BY i.line_no;
SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103;
SELECT count(*) FROM payments WHERE order_id=103;
SELECT product_id,stock FROM products ORDER BY product_id;""")
    assert results['success']=='''P7|0
P3|10
101|paid
103|pending
103|1|Blue mug|1|20.00
103|2|Green tea, 50 g|2|4.50
29.00
0
P3|10
P7|0
P9|4'''
    results['constraints']={
      'duplicate_order':sql("INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending');",True),
      'unknown_customer':sql("INSERT INTO orders VALUES (105,99,'2026-10-20 10:15+00','pending');",True),
      'negative_stock':sql("UPDATE products SET stock=-1 WHERE product_id='P7';",True),
      'valid_price':sql("BEGIN; UPDATE products SET price=22 WHERE product_id='P7' RETURNING price; ROLLBACK;")}
    results['without_constraints']=sql("CREATE TABLE loose_orders(order_id integer,customer_id integer); INSERT INTO loose_orders VALUES(103,1),(103,99); CREATE TABLE loose_stock(stock integer); INSERT INTO loose_stock VALUES(-1); SELECT * FROM loose_orders; SELECT * FROM loose_stock;")
    assert results['without_constraints']=='103|1\n103|99\n-1'
    sql(setup)
    results['rollback']=sql("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1; ROLLBACK; SELECT product_id,stock FROM products WHERE product_id='P7'; SELECT count(*) FROM orders WHERE order_id=103;")
    assert results['rollback']=='P7|1\n0'
    results['without_transaction']=sql("UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1; SELECT product_id,stock FROM products WHERE product_id='P7'; SELECT count(*) FROM orders WHERE order_id=103;")
    assert results['without_transaction']=='P7|0\n0'
    for guarded in [False,True]:
      sql(setup)
      mina=worker('intro_mina',''); tariq=worker('intro_tariq','')
      for p in (mina,tariq):
        send(p,"BEGIN ISOLATION LEVEL READ COMMITTED; SELECT stock FROM products WHERE product_id='P7'; \\echo READ")
        assert read_to(p,'READ')=='1'
      update="UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock;" if guarded else "UPDATE products SET stock=0 WHERE product_id='P7' RETURNING stock;"
      send(mina,update+'\n\\echo UPDATED')
      assert read_to(mina,'UPDATED')=='0'
      send(tariq,update+'\n\\echo UPDATED')
      for _ in range(100):
        waiting=sql("SELECT count(*) FROM pg_stat_activity WHERE application_name='intro_tariq' AND wait_event_type='Lock';")
        if waiting=='1':break
        time.sleep(.02)
      assert waiting=='1','Tariq must wait behind Mina'
      send(mina,"INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending'); UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2; INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.5); COMMIT;\n\\echo COMMITTED")
      read_to(mina,'COMMITTED')
      tariq_update=read_to(tariq,'UPDATED')
      assert tariq_update==('' if guarded else '0')
      send(tariq,"ROLLBACK;\n\\q" if guarded else "INSERT INTO orders VALUES(104,2,'2026-10-20 10:15:01+00','pending'); INSERT INTO order_items VALUES(104,1,'P7',1,20); COMMIT;\n\\q")
      send(mina,'\\q')
      for p in [mina,tariq]:
        p.stdin.close(); p.wait(timeout=10); assert p.returncode==0,p.stderr.read()
      key='guarded_race' if guarded else 'unguarded_race'
      results[key]=sql("SELECT product_id,stock FROM products WHERE product_id='P7'; SELECT order_id FROM orders WHERE order_id>=103 ORDER BY order_id;")
      assert results[key]==('P7|0\n103' if guarded else 'P7|0\n103\n104')
      results[key+'_wait_observed']=True
    (BASE/'evidence/database-results.json').write_text(json.dumps(results,indent=2)+'\n')
finally:
    if DATA.exists():
      subprocess.run([PG+'pg_ctl','-D',str(DATA),'-m','fast','-w','stop'],env=ENV,capture_output=True)
      import shutil
      shutil.rmtree(DATA)
    if SOCKET.exists(): SOCKET.rmdir()
print('Verified query results, rejected changes, rollback and both controlled concurrent schedules. Owned cluster stopped and removed.')
