#!/usr/bin/env python3
"""Temporal and deletion-policy drills on a newly owned disposable PostgreSQL.
For macOS/Linux with Python 3 and PostgreSQL 18, including btree_gist.
Requires psycopg[binary]. Put shop.json and history.json beside this file.
No existing database connection.
"""
import argparse,json,os,pathlib,shutil,subprocess,tempfile
from decimal import Decimal
# This standalone experiment controls every connection, including later workers.
# Clear PG-prefixed defaults in this process as well as in its child tools.
for name in tuple(os.environ):
    if name.startswith('PG'):
        del os.environ[name]
env=os.environ.copy()
import psycopg
parser=argparse.ArgumentParser();parser.add_argument('--bindir',required=True);args=parser.parse_args()
binpath=pathlib.Path(args.bindir).resolve()
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r04-owned-',dir='/tmp'));data=base/'data';sock=base/'sock';sock.mkdir();started=False

def tool(name,*args):return subprocess.run([str(binpath/name),*map(str,args)],env=env,check=True,text=True,capture_output=True).stdout

def report(name,value):print(json.dumps({'check':name,'result':value},default=str),flush=True)

try:
    tool('initdb','-D',data,'--auth=trust','-U','sc_owner','--no-locale','--encoding=UTF8')
    tool('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -h '' -p 55437",'-w','start');started=True
    ci=f'host={sock} port=55437 dbname=postgres user=sc_owner connect_timeout=5'
    with psycopg.connect(ci,autocommit=True) as conn:
        assert pathlib.Path(conn.execute('SHOW data_directory').fetchone()[0]).resolve()==data.resolve()
        assert conn.execute('SELECT current_user').fetchone()[0]=='sc_owner'
        assert conn.execute('SHOW listen_addresses').fetchone()[0]==''
        report('owned endpoint',{'data_directory':str(data.resolve()),'socket':str(sock),'port':55437,'user':'sc_owner','listen_addresses':''})
        report('environment',{'server':conn.execute('SELECT version()').fetchone()[0],'driver':psycopg.__version__,'python':os.sys.version})
        core=json.loads(pathlib.Path(__file__).with_name('shop.json').read_text());h=json.loads(pathlib.Path(__file__).with_name('history.json').read_text());t0=h['baseline'];eff=h['effective'];correct=h['correction_recorded']
        conn.execute('CREATE EXTENSION btree_gist')
        conn.execute('CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL)')
        conn.execute('CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL,stock integer NOT NULL CHECK(stock>=0),retired_at timestamptz)')
        conn.execute('CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,status text NOT NULL)')
        conn.execute('CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL REFERENCES products,quantity integer NOT NULL,unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no))')
        for c in core['customers']:conn.execute('INSERT INTO customers VALUES(%s,%s)',(c['customer_id'],c['name']))
        for p in core['products']:conn.execute('INSERT INTO products VALUES(%s,%s,%s,%s,NULL)',(p['product_id'],p['name'],Decimal(p['price']),p['stock_after_103']))
        for o in core['orders']:conn.execute('INSERT INTO orders VALUES(%s,%s,%s)',(o['order_id'],o['customer_id'],o['status']))
        for i in core['order_items']:conn.execute('INSERT INTO order_items VALUES(%s,%s,%s,%s,%s)',(i['order_id'],i['line_no'],i['product_id'],i['quantity'],Decimal(i['unit_price'])))
        conn.execute('''CREATE TABLE price_assertions(
            assertion_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            product_id text NOT NULL REFERENCES products,
            price numeric(8,2) NOT NULL CHECK(price>=0 AND price<=999999.99),
            effective_period tstzrange NOT NULL CHECK(NOT isempty(effective_period)),
            recorded_period tstzrange NOT NULL CHECK(NOT isempty(recorded_period)),
            EXCLUDE USING gist(product_id WITH =,effective_period WITH &&,recorded_period WITH &&))''')
        conn.execute('CREATE TABLE corrections(change_id text PRIMARY KEY,product_id text REFERENCES products,reason text NOT NULL)')
        conn.execute("INSERT INTO price_assertions(product_id,price,effective_period,recorded_period) VALUES('P7',20,tstzrange(NULL,NULL),tstzrange(%s,NULL,'[)'))",(t0,))
        with conn.transaction():
            conn.execute("SELECT product_id FROM products WHERE product_id='P7' FOR UPDATE")
            conn.execute('UPDATE price_assertions SET recorded_period=tstzrange(lower(recorded_period),%s,\'[)\') WHERE product_id=\'P7\' AND upper_inf(recorded_period)',(eff,))
            conn.execute("INSERT INTO price_assertions(product_id,price,effective_period,recorded_period) VALUES('P7',20,tstzrange(NULL,%s,'[)'),tstzrange(%s,NULL,'[)')),('P7',%s,tstzrange(%s,NULL,'[)'),tstzrange(%s,NULL,'[)'))",(eff,eff,Decimal(h['first_price']),eff,eff))
            conn.execute("UPDATE products SET price=%s WHERE product_id='P7'",(Decimal(h['first_price']),))
        def price_at(effective,known):return conn.execute("SELECT price FROM price_assertions WHERE product_id='P7' AND effective_period @> %s::timestamptz AND recorded_period @> %s::timestamptz",(effective,known)).fetchall()
        def correction(fail=False):
            with conn.transaction():
                conn.execute("SELECT product_id FROM products WHERE product_id='P7' FOR UPDATE")
                count=conn.execute("UPDATE price_assertions SET recorded_period=tstzrange(lower(recorded_period),%s,'[)') WHERE product_id='P7' AND lower(effective_period)=%s AND upper_inf(recorded_period) RETURNING assertion_id",(correct,eff)).fetchall()
                assert len(count)==1
                if fail:raise ValueError('injected stop after closing old assertion')
                conn.execute("INSERT INTO price_assertions(product_id,price,effective_period,recorded_period) VALUES('P7',%s,tstzrange(%s,NULL,'[)'),tstzrange(%s,NULL,'[)'))",(Decimal(h['corrected_price']),eff,correct))
                conn.execute("UPDATE products SET price=%s WHERE product_id='P7'",(Decimal(h['corrected_price']),))
                conn.execute("INSERT INTO corrections VALUES('price-correction-20261022','P7','correct effective catalogue price')")
        try:correction(fail=True)
        except ValueError:pass
        assert price_at(h['effective_queries'][1],h['known_queries'][2])==[(Decimal('25.00'),)]
        report('interrupted correction','rollback retains open25 assertion and no correction record')
        correction()
        grid=[]
        for known in h['known_queries']:
            row=[str(price_at(effective,known)[0][0]) for effective in h['effective_queries']];grid.append(row)
        assert grid==[['20.00','20.00'],['20.00','25.00'],['20.00','24.00']]
        report('two-time query matrix',grid)
        assert price_at(eff,eff)==[(Decimal('25.00'),)] and price_at(eff,correct)==[(Decimal('24.00'),)]
        report('half-open boundaries','effective21Oct09 includes25; recorded22Oct14 includes24')
        try:
            conn.execute("INSERT INTO price_assertions(product_id,price,effective_period,recorded_period) VALUES('P7',99,tstzrange(%s,NULL,'[)'),tstzrange(%s,NULL,'[)'))",(eff,correct))
        except psycopg.errors.ExclusionViolation as error:report('overlap refused',error.sqlstate)
        else:raise AssertionError('overlap accepted')
        conn.execute('CREATE TEMP TABLE unconstrained AS SELECT * FROM price_assertions')
        conn.execute("INSERT INTO unconstrained(product_id,price,effective_period,recorded_period) VALUES('P7',99,tstzrange(%s,NULL,'[)'),tstzrange(%s,NULL,'[)'))",(eff,correct))
        assert conn.execute("SELECT count(*) FROM unconstrained WHERE effective_period @> %s::timestamptz AND recorded_period @> %s::timestamptz",(eff,correct)).fetchone()[0]==2
        report('without overlap rule','two simultaneous answers')
        assert conn.execute("SELECT unit_price FROM order_items WHERE order_id=103 AND line_no=1").fetchone()[0]==20
        assert conn.execute("SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103").fetchone()[0]==29
        report('agreement unchanged',{'mug_unit_price':'20.00','order_total':'29.00'})
        # A separate retirement-policy drill. It is rolled back after its queries.
        with conn.transaction():
            conn.execute("UPDATE products SET retired_at='2026-10-24 00:00Z' WHERE product_id='P7'")
            all_lines=conn.execute('SELECT i.line_no FROM order_items i JOIN products p USING(product_id) WHERE i.order_id=103').fetchall()
            active_only=conn.execute('SELECT i.line_no FROM order_items i JOIN products p USING(product_id) WHERE i.order_id=103 AND p.retired_at IS NULL').fetchall()
            assert len(all_lines)==2 and len(active_only)==1
            report('retired product still belongs on receipt',{'correct_lines':len(all_lines),'active_filter_lines':len(active_only)})
            conn.execute('ROLLBACK')
        try:conn.execute("DELETE FROM products WHERE product_id='P7'")
        except psycopg.errors.ForeignKeyViolation as error:report('referenced product delete refused',error.sqlstate)
        else:raise AssertionError('delete accepted')
        # Separate cancellation drill from core post103 stock: P3=10,P7=0.
        def cancel():
            with conn.transaction():
                changed=conn.execute("UPDATE orders SET status='cancelled' WHERE order_id=103 AND status='pending' RETURNING order_id").fetchone()
                if changed is None:return False
                conn.execute('''UPDATE products p SET stock=p.stock+r.quantity FROM
                    (SELECT product_id,sum(quantity)::integer AS quantity FROM order_items WHERE order_id=103 GROUP BY product_id)r
                    WHERE p.product_id=r.product_id''')
                return True
        assert cancel() and not cancel()
        stock=conn.execute('SELECT product_id,stock FROM products ORDER BY product_id').fetchall()
        assert stock==[('P3',12),('P7',1),('P9',4)]
        report('one cancellation and one repeat',{'stock':stock,'lines_retained':2,'payment_for103':'none in core; no external refund claimed'})
        conn.execute('CREATE TEMP TABLE scratch_orders(order_id integer PRIMARY KEY)')
        conn.execute('CREATE TEMP TABLE scratch_lines(order_id integer REFERENCES scratch_orders ON DELETE CASCADE,line_no integer)')
        conn.execute('CREATE TEMP TABLE independent_copy(order_id integer,rendered_text text)')
        conn.execute('INSERT INTO scratch_orders VALUES(103)');conn.execute('INSERT INTO scratch_lines VALUES(103,1),(103,2)');conn.execute("INSERT INTO independent_copy VALUES(103,'receipt copy')")
        conn.execute('DELETE FROM scratch_orders WHERE order_id=103')
        assert conn.execute('SELECT count(*) FROM scratch_lines').fetchone()[0]==0 and conn.execute('SELECT count(*) FROM independent_copy').fetchone()[0]==1
        report('cascade boundary',{'child_lines':0,'independent_copy':1,'copy_note':'local stand-in for an unreferenced copy, no external system executed'})
        report('all checks','passed')
finally:
    if started:tool('pg_ctl','-D',data,'-m','immediate','-w','stop')
    shutil.rmtree(base);report('cleanup','owned server stopped; temporary cluster removed')
