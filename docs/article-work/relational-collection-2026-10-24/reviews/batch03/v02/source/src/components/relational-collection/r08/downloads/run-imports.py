#!/usr/bin/env python3
"""Replayable catalogue import, on a newly created owned PostgreSQL instance.
For macOS/Linux with Python 3 and PostgreSQL 18.
Requires psycopg[binary]. Put shop.json and feed.json beside this file.
No existing database connection.
"""
import argparse,json,os,pathlib,shutil,subprocess,tempfile,threading,time
from decimal import Decimal,InvalidOperation
import psycopg
parser=argparse.ArgumentParser();parser.add_argument('--bindir',required=True);args=parser.parse_args()
binpath=pathlib.Path(args.bindir).resolve();env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r08-owned-',dir='/tmp')); data=base/'data';sock=base/'sock';sock.mkdir();started=False

def tool(name,*args):return subprocess.run([str(binpath/name),*map(str,args)],env=env,check=True,text=True,capture_output=True).stdout

def report(name,value):print(json.dumps({'check':name,'result':value},default=str),flush=True)

class Rejected(ValueError):pass

def apply_batch(conn,batch_id,rows,fail=False):
    with conn.transaction():
        conn.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED')
        conn.execute('CREATE TEMP TABLE raw_stage (row_no integer,source_id text,product_id text,version_text text,price_text text) ON COMMIT DROP')
        with conn.cursor().copy('COPY raw_stage FROM STDIN') as copy:
            for n,row in enumerate(rows,1):copy.write_row((n,*row))
        typed=[]
        for n,source,product,version_text,price_text in conn.execute('SELECT * FROM raw_stage ORDER BY row_no'):
            try:
                version=int(version_text);price=Decimal(price_text)
                if version<1 or not price.is_finite() or price<0 or price>Decimal('999999.99') or price!=price.quantize(Decimal('.01')):raise ValueError()
            except (ValueError,InvalidOperation,TypeError):raise Rejected(f'row {n}: invalid version or exact two-decimal price')
            if source!='catalogue-office':raise Rejected(f'row {n}: unexpected source')
            typed.append((source,product,version,format(price,'.2f')))
        # One guard for this source. Every writer of this import state uses it.
        conn.execute("SELECT source_id FROM source_guard WHERE source_id='catalogue-office' FOR UPDATE").fetchone()
        canonical=json.dumps(sorted(typed),separators=(',',':'))
        prior=conn.execute('SELECT payload,receipt FROM import_batches WHERE batch_id=%s',(batch_id,)).fetchone()
        if prior:
            if prior[0]!=canonical:raise Rejected('batch ID reused with different content')
            return {'replay':True,'original_receipt':json.loads(prior[1])}
        seen={}
        for source,product,version,price in typed:
            if not conn.execute('SELECT 1 FROM products WHERE product_id=%s',(product,)).fetchone():raise Rejected('unknown product '+product)
            identity=(source,product,version)
            if identity in seen and seen[identity]!=price:raise Rejected('contradictory versions within batch')
            seen[identity]=price
        for identity,price in seen.items():
            prior=conn.execute('SELECT price FROM feed_seen WHERE source_id=%s AND product_id=%s AND source_version=%s',identity).fetchone()
            if prior and prior[0]!=Decimal(price):raise Rejected('same source version with different payload')
        latest={}
        for (source,product,version),price in seen.items():
            if product not in latest or latest[product][1]<version:latest[product]=(source,version,price)
        receipt={'received':len(rows),'identical_in_batch':len(rows)-len(seen),'superseded_in_batch':len(seen)-len(latest),'advanced':0,'already_current':0,'stale':0}
        for identity,price in seen.items():
            conn.execute('INSERT INTO feed_seen VALUES (%s,%s,%s,%s) ON CONFLICT DO NOTHING',(*identity,Decimal(price)))
        for product,(source,version,price) in latest.items():
            old=conn.execute('SELECT source_version FROM product_feed WHERE product_id=%s',(product,)).fetchone()
            changed=conn.execute('INSERT INTO product_feed VALUES (%s,%s,%s,%s) ON CONFLICT(product_id) DO UPDATE SET source_version=excluded.source_version,price=excluded.price WHERE product_feed.source_version<excluded.source_version RETURNING product_id,price',(product,source,version,Decimal(price))).fetchone()
            if changed:
                conn.execute('UPDATE products SET price=%s WHERE product_id=%s',(changed[1],changed[0]));receipt['advanced']+=1
            elif old and old[0]==version:receipt['already_current']+=1
            else:receipt['stale']+=1
        if fail:raise Rejected('injected stop before receipt')
        conn.execute('INSERT INTO import_batches VALUES(%s,%s,%s)',(batch_id,canonical,json.dumps(receipt)))
        return receipt

try:
    tool('initdb','-D',data,'--auth=trust','-U','sc_owner','--no-locale','--encoding=UTF8')
    tool('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -h '' -p 55438",'-w','start');started=True
    ci=f'host={sock} port=55438 dbname=postgres user=sc_owner connect_timeout=5'
    with psycopg.connect(ci,autocommit=True) as conn:
        assert pathlib.Path(conn.execute('SHOW data_directory').fetchone()[0]).resolve()==data.resolve()
        assert conn.execute('SELECT current_user').fetchone()[0]=='sc_owner'
        assert conn.execute('SHOW listen_addresses').fetchone()[0]==''
        report('owned endpoint',{'data_directory':str(data.resolve()),'socket':str(sock),'port':55438,'user':'sc_owner','listen_addresses':''})
        report('environment',{'server':conn.execute('SELECT version()').fetchone()[0],'driver':psycopg.__version__,'transport':'owned private Unix socket'})
        core=json.loads(pathlib.Path(__file__).with_name('shop.json').read_text())
        conn.execute('CREATE TABLE products(product_id text PRIMARY KEY,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0))')
        for p in core['products']:conn.execute('INSERT INTO products VALUES(%s,%s,%s)',(p['product_id'],Decimal(p['price']),p['stock_after_103']))
        conn.execute('CREATE TABLE source_guard(source_id text PRIMARY KEY)');conn.execute("INSERT INTO source_guard VALUES('catalogue-office')")
        conn.execute('CREATE TABLE product_feed(product_id text PRIMARY KEY REFERENCES products,source_id text NOT NULL REFERENCES source_guard,source_version bigint NOT NULL CHECK(source_version>0),price numeric(8,2) NOT NULL CHECK(price>=0))')
        conn.execute('CREATE TABLE feed_seen(source_id text REFERENCES source_guard,product_id text REFERENCES products,source_version bigint CHECK(source_version>0),price numeric(8,2) NOT NULL CHECK(price>=0),PRIMARY KEY(source_id,product_id,source_version))')
        conn.execute('CREATE TABLE import_batches(batch_id text PRIMARY KEY,payload text NOT NULL,receipt text NOT NULL)')
        conn.execute("INSERT INTO product_feed SELECT product_id,'catalogue-office',1,price FROM products")
        conn.execute('INSERT INTO feed_seen SELECT source_id,product_id,source_version,price FROM product_feed')
        # A conditional edit is a separate scratch transaction, then rolled back.
        with conn.transaction():
            first=conn.execute("UPDATE products SET price=25 WHERE product_id='P7' AND price=20 RETURNING price").fetchall()
            second=conn.execute("UPDATE products SET price=24 WHERE product_id='P7' AND price=20 RETURNING price").fetchall()
            assert first==[(Decimal('25.00'),)] and second==[]
            report('expected-value update',{'first':first,'stale_edit':second})
            conn.execute('ROLLBACK')
        batch=[tuple(row) for row in json.loads(pathlib.Path(__file__).with_name('feed.json').read_text())['batch_a']]
        try:apply_batch(conn,'batch-a',batch,fail=True)
        except Rejected:pass
        assert conn.execute("SELECT price FROM products WHERE product_id='P7'").fetchone()[0]==20
        assert conn.execute('SELECT count(*) FROM import_batches').fetchone()[0]==0
        assert conn.execute('SELECT count(*) FROM feed_seen').fetchone()[0]==3
        report('interrupted batch rolls back','price20; baseline ledger3; receipts0')
        receipt=apply_batch(conn,'batch-a',batch);assert receipt=={'received':4,'identical_in_batch':1,'superseded_in_batch':1,'advanced':1,'already_current':1,'stale':0};report('batch-a',receipt)
        replay=apply_batch(conn,'batch-a',list(reversed(batch)));assert replay['replay'];report('same batch reordered',replay)
        delayed=apply_batch(conn,'batch-b',[batch[0]]);assert delayed['stale']==1;report('delayed version2',delayed)
        for name,ident,rows in [('changed batch','batch-a',[batch[0]]),('conflicting old version','batch-c',[('catalogue-office','P7','2','26.00')]),('conflicting input','batch-d',[batch[1],('catalogue-office','P7','3','23.00')]),('invalid price','batch-e',[('catalogue-office','P7','4','not-money')]),('unknown product','batch-f',[('catalogue-office','P404','1','4.50')])]:
            try:apply_batch(conn,ident,rows)
            except Rejected as e:report(name,str(e))
            else:raise AssertionError('expected rejection '+name)
        assert conn.execute("SELECT price,stock FROM products WHERE product_id='P7'").fetchone()==(Decimal('24.00'),0)
        conn.execute('CREATE TEMP TABLE naive(product_id text PRIMARY KEY,source_version integer,price numeric)')
        conn.execute("INSERT INTO naive VALUES('P7',3,24)")
        conn.execute("INSERT INTO naive VALUES('P7',2,25) ON CONFLICT(product_id) DO UPDATE SET source_version=excluded.source_version,price=excluded.price")
        assert conn.execute('SELECT price FROM naive').fetchone()[0]==25;report('unguarded late upsert regresses',25)
        # Reset only this disposable import history and force two importers to overlap.
        conn.execute("DELETE FROM import_batches");conn.execute('DELETE FROM feed_seen WHERE source_version>1');conn.execute("UPDATE products SET price=20 WHERE product_id='P7'");conn.execute('UPDATE product_feed f SET source_version=1,price=p.price FROM products p WHERE p.product_id=f.product_id')
        results=[];errors=[]
        def worker(batch_id,row):
            try:
                with psycopg.connect(ci,autocommit=True) as c:results.append(apply_batch(c,batch_id,[row]))
            except Exception as e:errors.append(str(e))
        with conn.transaction():
            conn.execute('SELECT * FROM source_guard FOR UPDATE')
            workers=[threading.Thread(target=worker,args=('overlap-2',batch[0])),threading.Thread(target=worker,args=('overlap-3',batch[1]))]
            for w in workers:w.start()
            deadline=time.monotonic()+3
            while time.monotonic()<deadline:
                conn.execute('SELECT pg_stat_clear_snapshot()')
                waiting=conn.execute("SELECT count(*) FROM pg_stat_activity WHERE pid<>pg_backend_pid() AND wait_event_type='Lock'").fetchone()[0]
                if waiting==2:break
                time.sleep(.01)
            else:raise AssertionError('two importer waits not observed')
        for w in workers:w.join(timeout=5);assert not w.is_alive()
        assert not errors,errors
        assert conn.execute("SELECT source_version,price FROM product_feed WHERE product_id='P7'").fetchone()==(3,Decimal('24.00'))
        report('overlapping importers',{'observed_waiters':2,'final_version':3,'final_price':'24.00','receipts':results})
        report('all checks','passed')
finally:
    if started:tool('pg_ctl','-D',data,'-m','immediate','-w','stop')
    shutil.rmtree(base);report('cleanup','owned server stopped; temporary cluster removed')
