#!/usr/bin/env python3
"""Owned local PostgreSQL/Psycopg experiment. Requires psycopg[binary] and psycopg_pool.
Place shop.json beside this file. Never connects to an existing server.
"""
import argparse, json, os, pathlib, shutil, subprocess, tempfile, threading, time
from decimal import Decimal
import psycopg
from psycopg import sql
from psycopg.pq import TransactionStatus
from psycopg_pool import ConnectionPool
import psycopg_pool

parser=argparse.ArgumentParser()
parser.add_argument('--bindir', required=True)
parser.add_argument('--tmpdir', default='/tmp', help='writable short temporary parent (default: /tmp; macOS/Linux)')
args=parser.parse_args()
binpath=pathlib.Path(args.bindir).resolve()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r09-owned-', dir=args.tmpdir))
data=base/'data'; sock=base/'sock'; sock.mkdir()
started=False

def tool(name,*args):
    return subprocess.run([str(binpath/name),*map(str,args)],env=env,check=True,text=True,capture_output=True).stdout

def record(name,value): print(json.dumps({'check':name,'result':value},default=str),flush=True)

try:
    tool('initdb','-D',data,'--auth=trust','-U','sc_owner','--no-locale','--encoding=UTF8')
    tool('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -h '' -p 55439",'-w','start'); started=True
    conninfo=f'host={sock} port=55439 dbname=postgres user=sc_owner connect_timeout=5'
    with psycopg.connect(conninfo,autocommit=True) as admin:
        assert pathlib.Path(admin.execute('SHOW data_directory').fetchone()[0]).resolve()==data.resolve()
        record('environment',{'server':admin.execute('SELECT version()').fetchone()[0],'driver':psycopg.__version__,'pool':psycopg_pool.__version__,'python':os.sys.version,'transport':'owned private Unix socket; no TCP'})
        core=json.loads(pathlib.Path(__file__).with_name('shop.json').read_text())
        admin.execute('CREATE TABLE products (product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL,stock integer NOT NULL CHECK(stock>=0))')
        for p in core['products']:
            admin.execute('INSERT INTO products VALUES (%s,%s,%s,%s)',(p['product_id'],p['name'],Decimal(p['price']),p['stock_after_103']))
        payload="P7' OR true --"
        unsafe=admin.execute("SELECT product_id FROM products WHERE product_id = '"+payload+"'").fetchall()
        safe=admin.execute('SELECT product_id FROM products WHERE product_id = %s',(payload,)).fetchall()
        assert len(unsafe)==3 and safe==[]
        record('query text versus bound value',{'unsafe_rows':unsafe,'bound_rows':safe})
        column={'name':'name','price':'price'}['price']
        value=admin.execute(sql.SQL('SELECT {} FROM products WHERE product_id=%s').format(sql.Identifier(column)),('P7',)).fetchone()[0]
        assert value==Decimal('20.00')
        record('identifier and result type',{'value':value,'python_type':type(value).__name__})
        row=admin.execute('UPDATE products SET stock=stock-1 WHERE product_id=%s AND stock>=1 RETURNING stock',('P7',)).fetchone()
        assert row is None
        record('zero rows is a successful statement',row)
        with psycopg.connect(conninfo) as implicit:
            implicit.execute('SELECT 1')
            assert implicit.info.transaction_status==TransactionStatus.INTRANS
            implicit.rollback()
            record('default SELECT starts a transaction','INTRANS; explicit rollback restores IDLE')
        with ConnectionPool(conninfo,kwargs={'autocommit':True},min_size=1,max_size=1,open=True) as pool:
            pool.wait(timeout=5)
            try:
                with pool.connection(timeout=5) as conn:
                    pid=conn.info.backend_pid
                    with conn.transaction():
                        conn.execute("UPDATE products SET stock=9 WHERE product_id='P3'")
                        raise ValueError('purchase refused after earlier work')
            except ValueError: pass
            with pool.connection() as conn:
                assert conn.info.backend_pid==pid and conn.info.transaction_status==TransactionStatus.IDLE
                assert conn.execute("SELECT stock FROM products WHERE product_id='P3'").fetchone()[0]==10
            record('application refusal rolls back before reuse',{'same_backend':True,'stock':10,'state':'IDLE'})
            try:
                with pool.connection() as conn:
                    with conn.transaction():
                        conn.execute("UPDATE products SET stock=9 WHERE product_id='P3'")
                        conn.execute("UPDATE products SET stock=-1 WHERE product_id='P7'")
            except psycopg.errors.CheckViolation as error:
                record('constraint error',{'sqlstate':error.sqlstate,'constraint':error.diag.constraint_name})
            with pool.connection() as conn:
                assert conn.execute("SELECT stock FROM products WHERE product_id='P3'").fetchone()[0]==10
                with conn.transaction():
                    conn.execute("SELECT set_config('statement_timeout',%s,true)",('30ms',))
                    try: conn.execute('SELECT pg_sleep(1)')
                    except psycopg.errors.QueryCanceled as error:
                        assert error.sqlstate=='57014'
                        try: conn.execute('SELECT 1')
                        except psycopg.errors.InFailedSqlTransaction as failed:
                            assert failed.sqlstate=='25P02'
                            record('timeout must be cleaned up',{'cancelled':error.sqlstate,'next_command':failed.sqlstate})
                        raise
            # This point is unreachable: the cancellation is deliberately allowed out.
except psycopg.errors.QueryCanceled:
    # pool and transaction contexts have already unwound, including rollback.
    with psycopg.connect(conninfo,autocommit=True) as admin:
        assert admin.execute("SELECT stock FROM products WHERE product_id='P3'").fetchone()[0]==10
        with psycopg.connect(conninfo,autocommit=True) as first, psycopg.connect(conninfo,autocommit=True) as other:
            with first.transaction():
                first.execute("UPDATE products SET stock=9 WHERE product_id='P3'")
                other.execute("UPDATE products SET price=36 WHERE product_id='P9'")
                # Raising discards the first connection's work only.
                first.execute('ROLLBACK')
            result=admin.execute("SELECT product_id,stock,price FROM products ORDER BY product_id").fetchall()
            assert result[0][1]==10 and result[2][2]==Decimal('36.00')
            record('a second connection escapes rollback',result)
        with ConnectionPool(conninfo,kwargs={'autocommit':True},min_size=1,max_size=1) as pool:
            pool.wait(timeout=5)
            with pool.connection() as work:
                backend=work.info.backend_pid; errors=[]
                def slow():
                    try:
                        with work.transaction(): work.execute('SELECT pg_sleep(5)')
                    except psycopg.Error as error: errors.append(error.sqlstate)
                worker=threading.Thread(target=slow); worker.start()
                deadline=time.monotonic()+3
                while time.monotonic()<deadline:
                    state=admin.execute('SELECT wait_event FROM pg_stat_activity WHERE pid=%s',(backend,)).fetchone()
                    if state and state[0]=='PgSleep': break
                    time.sleep(.01)
                else: raise AssertionError('worker did not enter pg_sleep')
                work.cancel_safe(timeout=2)
                worker.join(timeout=3); assert not worker.is_alive() and errors==['57014']
                assert work.info.transaction_status==TransactionStatus.IDLE
                assert work.execute('SELECT 1').fetchone()==(1,)
                record('explicit cancellation and settled cleanup',{'sqlstate':errors[0],'state':'IDLE','reusable':True})
                work.close()
            with pool.connection(timeout=5) as replacement:
                assert replacement.info.backend_pid!=backend
                record('closed connection replaced',{'different_backend':True})
        record('all checks','passed')
finally:
    if started: tool('pg_ctl','-D',data,'-m','immediate','-w','stop')
    shutil.rmtree(base)
    record('cleanup','owned server stopped; temporary cluster removed')
