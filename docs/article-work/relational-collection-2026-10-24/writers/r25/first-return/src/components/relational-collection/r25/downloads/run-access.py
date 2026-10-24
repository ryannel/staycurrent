#!/usr/bin/env python3
"""Check privileges through real PostgreSQL login sessions in a private test cluster.
Run: python3 run-access.py --bindir /path/to/postgresql/bin
Standard library only. Local trust authentication tests SQL authority, not credentials/TLS.
"""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir',required=True,type=Path)
args=parser.parse_args()
start=time.monotonic()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=Path(tempfile.mkdtemp(prefix='staycurrent-r25-'))
base.chmod(0o700)
data=base/'data'
sock=base/'socket'
sock.mkdir(mode=0o700)
port='55425'
owned=False

def tool(name,*tail):
    return subprocess.run([str(args.bindir/name),*map(str,tail)],env=env,text=True,capture_output=True,check=True,timeout=30)

def sql(text,role='r25_admin',ok=True):
    result=subprocess.run([str(args.bindir/'psql'),'-X','-A','-t','-v','ON_ERROR_STOP=1',
      '-v','VERBOSITY=verbose','-h',str(sock),'-p',port,'-U',role,'-d','postgres','-c',text],
      env=env,text=True,capture_output=True,timeout=15)
    if ok and result.returncode:
        raise RuntimeError(result.stderr)
    return result

def expect(text,want,role='r25_admin'):
    got=sql(text,role).stdout.strip()
    assert got==str(want),(role,text,got,want)

def deny(text,role,code='42501'):
    result=sql(text,role,False)
    assert result.returncode and code in result.stderr,(role,text,result.stdout,result.stderr)
    print(f'REFUSED {role}: {text.splitlines()[0]} [SQLSTATE {code}]')

try:
    print(tool('postgres','--version').stdout.strip())
    tool('initdb','-D',data,'-A','trust','-U','r25_admin','--no-locale')
    tool('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p {port} -c listen_addresses='' -c max_connections=12",'-w','start')
    owned=True
    assert Path(sql('SHOW data_directory').stdout.strip()).resolve()==data.resolve()
    expect('SELECT current_user','r25_admin')
    expect('SHOW unix_socket_directories',sock)
    print('Ownership verified: private directory/socket; inherited PG settings cleared; no TCP listener.')
    sql('''CREATE ROLE shop_owner NOLOGIN;
    CREATE ROLE migration LOGIN NOINHERIT;
    CREATE ROLE catalogue NOLOGIN;
    CREATE ROLE runtime_10 LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
    CREATE ROLE runtime_20 LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
    CREATE ROLE support LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
    GRANT shop_owner TO migration WITH INHERIT FALSE, SET TRUE;
    GRANT catalogue TO runtime_10, runtime_20 WITH INHERIT TRUE, SET FALSE;
    REVOKE ALL ON DATABASE postgres FROM PUBLIC;
    GRANT CONNECT ON DATABASE postgres TO migration,runtime_10,runtime_20,support;
    REVOKE CREATE ON SCHEMA public FROM PUBLIC;
    CREATE SCHEMA shop AUTHORIZATION shop_owner;
    CREATE SCHEMA support_read AUTHORIZATION shop_owner;
    SET ROLE shop_owner;
    CREATE TABLE shop.products (
      shop_id integer,product_id text,name text NOT NULL,
      price numeric(8,2) NOT NULL CHECK(price>=0),
      PRIMARY KEY(shop_id,product_id)
    );
    RESET ROLE;''')
    core=json.loads(Path(__file__).with_name('shop.json').read_text())
    rows=','.join(f"(10,'{p['product_id']}','{p['name']}',{p['price']})" for p in core['products'])
    sql('INSERT INTO shop.products VALUES '+rows+",(20,'P7','Copper mug',18.00)")
    sql('''SET ROLE shop_owner;
    GRANT USAGE ON SCHEMA shop TO catalogue;
    GRANT SELECT ON shop.products TO catalogue;
    GRANT INSERT(shop_id,product_id,name,price),UPDATE(price) ON shop.products TO catalogue;
    RESET ROLE;''')
    for role in ['runtime_10','runtime_20','support','migration']:
        expect('SELECT session_user::text || \'/\' || current_user::text',f'{role}/{role}',role)
    expect('SELECT count(*) FROM shop.products',4,'runtime_10')
    print('Counterexample: runtime table SELECT without row policy returns all four rows, including both shops.')
    sql('''SET ROLE shop_owner;
    ALTER TABLE shop.products ENABLE ROW LEVEL SECURITY;
    CREATE POLICY tenant_products ON shop.products TO catalogue
      USING(shop_id=current_setting('app.shop_id')::integer)
      WITH CHECK(shop_id=current_setting('app.shop_id')::integer);
    RESET ROLE;''')
    got=sql("SET app.shop_id='20'; SELECT name FROM shop.products WHERE product_id='P7'",'runtime_10').stdout
    assert 'Copper mug' in got,got
    print('Counterexample: runtime_10 can spoof app.shop_id=20 and read Copper mug under a caller-settable policy.')
    sql('''SET ROLE shop_owner;
    DROP POLICY tenant_products ON shop.products;
    CREATE POLICY tenant_products ON shop.products TO catalogue
      USING(shop_id=CASE current_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END)
      WITH CHECK(shop_id=CASE current_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END);
    CREATE VIEW support_read.catalogue AS
      SELECT shop_id,product_id,name,price FROM shop.products;
    GRANT USAGE ON SCHEMA support_read TO support;
    GRANT SELECT ON support_read.catalogue TO support;
    RESET ROLE;''')
    expect('SELECT count(*) FROM shop.products',3,'runtime_10')
    expect('SELECT count(*) FROM shop.products',1,'runtime_20')
    expect("SELECT name FROM shop.products WHERE product_id='P7'",'Blue mug','runtime_10')
    expect("SELECT name FROM shop.products WHERE product_id='P7'",'Copper mug','runtime_20')
    got=sql("SET app.shop_id='20'; SELECT name FROM shop.products WHERE product_id='P7'",'runtime_10').stdout
    assert 'Blue mug' in got and 'Copper mug' not in got
    expect('SELECT count(*) FROM shop.products WHERE shop_id=20',0,'runtime_10')
    got=sql("UPDATE shop.products SET price=99 WHERE shop_id=20 RETURNING name",'runtime_10').stdout
    assert 'UPDATE 0' in got and 'Copper mug' not in got
    deny("INSERT INTO shop.products VALUES(20,'P9','Teapot',35.00)",'runtime_10')
    deny('UPDATE shop.products SET shop_id=20 WHERE product_id=\'P3\'','runtime_10')
    sql("DELETE FROM shop.products WHERE shop_id=10 AND product_id='P3'")
    sql("INSERT INTO shop.products VALUES(10,'P3','Green tea, 50 g',4.50)",'runtime_10')
    sql("BEGIN; UPDATE shop.products SET price=21 WHERE product_id='P7' RETURNING price; ROLLBACK",'runtime_10')
    expect("SELECT price FROM shop.products WHERE product_id='P7'",'20.00','runtime_10')
    print('Allowed same-shop insert and price edit; rollback restored the core price. Cross-shop SELECT/UPDATE see zero; INSERT is refused.')
    for text in ['ALTER TABLE shop.products ADD COLUMN unwanted text','DROP TABLE shop.products',
                 'TRUNCATE shop.products','DELETE FROM shop.products','CREATE TABLE shop.unwanted(x int)',
                 'SET ROLE shop_owner','SET ROLE runtime_20','SET ROLE catalogue',
                 'SET SESSION AUTHORIZATION runtime_20',
                 'ALTER TABLE shop.products DISABLE ROW LEVEL SECURITY']:
        deny(text,'runtime_10')
    expect('SELECT count(*) FROM support_read.catalogue',4,'support')
    deny('SELECT * FROM shop.products','support')
    deny('UPDATE support_read.catalogue SET price=99','support')
    expect('SELECT count(*) FROM shop.products',4,'r25_admin')
    expect('SET ROLE shop_owner; SELECT count(*) FROM shop.products','SET\n4','migration')
    print('Owner/superuser controls see both shops; support intentionally sees the all-shop projection only. These are privileged exceptions, not tenant policy tests.')
    deny('SELECT * FROM shop.products','migration')
    got=sql('SET ROLE shop_owner; CREATE TABLE shop.new_table(shop_id integer); INSERT INTO shop.new_table VALUES(20);','migration').returncode
    assert got==0
    deny('SELECT * FROM shop.new_table','runtime_10')
    print('New table created by the migration owner has no implicit runtime grant: explicit object allowlist holds.')
    sql('SET ROLE shop_owner; REVOKE SELECT ON shop.products FROM catalogue; RESET ROLE')
    deny('SELECT * FROM shop.products','runtime_10')
    sql('SET ROLE shop_owner; GRANT SELECT ON shop.products TO catalogue; RESET ROLE')
    expect('SELECT count(*) FROM shop.products',3,'runtime_10')
    print('Revoking the actual inherited grant removed read access; regrant restored the same scoped result.')
    expect("SELECT string_agg(shop_id::text||':'||product_id||':'||price,',' ORDER BY shop_id,product_id) FROM shop.products",'10:P3:4.50,10:P7:20.00,10:P9:35.00,20:P7:18.00')
    print('PASS actual login-session privilege checks; no production authentication, TLS, proxy or credential-rotation claim.')
finally:
    if owned:
        tool('pg_ctl','-D',data,'-m','immediate','-w','stop')
    shutil.rmtree(base)
    print(f'Owned cluster removed. Elapsed {time.monotonic()-start:.3f}s.')
