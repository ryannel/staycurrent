#!/usr/bin/env python3
"""Owned, disposable PostgreSQL privilege and routine drill. Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time, uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', required=True)
args = parser.parse_args()
binpath = pathlib.Path(args.bindir).resolve()
root = pathlib.Path(tempfile.mkdtemp(prefix='r42-schema-', dir='/private/tmp' if pathlib.Path('/private/tmp').exists() else None))
data, sock = root / 'data', root / 'sock'
sock.mkdir(mode=0o700)
owner = 'r42_owner'
env = {k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGPASSFILE=str(root/'no-passwords'), PGSERVICEFILE=str(root/'no-services'), LC_ALL='C')
(root/'no-passwords').touch(mode=0o600)
(root/'no-services').touch(mode=0o600)
sessions=[]
results={}
started=False
cluster_tag="r42_"+uuid.uuid4().hex

def run(name, *argv):
    return subprocess.run([str(binpath/name), *argv], env=env, text=True, capture_output=True, check=True, timeout=30)

class Session:
    def __init__(self, label, user=None):
        user=user or owner
        self.label=label
        self.process=subprocess.Popen([str(binpath/'psql'),'-X','-qAt','-F','\t','-v','VERBOSITY=verbose',
            '-h',str(sock),'-p','55442','-U',user,'-d','postgres'], env={**env,'PGAPPNAME':label},
            stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.lines=queue.Queue()
        threading.Thread(target=lambda: [self.lines.put(line.rstrip('\n')) for line in self.process.stdout],daemon=True).start()
        sessions.append(self)
        proof=self.sql("SELECT current_setting('cluster_name'), current_user, current_database(), pg_backend_pid();")
        fields=proof[-1].split('\t')
        assert fields[:3]==[cluster_tag,user,'postgres'],proof
        self.pid=int(fields[3])

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

def denied(s, sql, code='42501'):
    lines=s.sql(sql)
    assert any(code in line for line in lines),lines
    return lines

try:
    run('initdb','-D',str(data),'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8')
    with (data/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=55442\nmax_connections=20\ncluster_name='{cluster_tag}'\n")
    run('pg_ctl','-D',str(data),'-l',str(root/'server.log'),'-w','start')
    started=True
    admin=Session('r42_observer')
    assert one(admin,"SELECT current_setting('data_directory');")==str(data)
    assert one(admin,"SELECT current_setting('unix_socket_directories');")==str(sock)
    results['version']=one(admin,'SELECT version();')
    checked(admin,"""CREATE ROLE shop_owner NOLOGIN;
      CREATE ROLE migration LOGIN NOINHERIT;
      CREATE ROLE catalogue NOLOGIN;
      CREATE ROLE runtime_10 LOGIN; CREATE ROLE runtime_20 LOGIN;
      CREATE ROLE catalogue_code NOLOGIN; CREATE ROLE bypass_probe LOGIN BYPASSRLS;
      GRANT shop_owner TO migration WITH INHERIT FALSE, SET TRUE;
      GRANT catalogue TO runtime_10,runtime_20 WITH INHERIT TRUE, SET FALSE;
      REVOKE CREATE ON SCHEMA public FROM PUBLIC;
      CREATE SCHEMA shop AUTHORIZATION shop_owner;
      CREATE SCHEMA api AUTHORIZATION shop_owner;
      CREATE TABLE shop.products(shop_id integer,product_id text,name text,price numeric(8,2),PRIMARY KEY(shop_id,product_id));
      ALTER TABLE shop.products OWNER TO shop_owner;
      INSERT INTO shop.products VALUES(10,'P3','Green tea, 50 g',4.50),(10,'P7','Blue mug',20.00),
       (10,'P9','Teapot',35.00),(20,'P7','Copper mug',18.00);
      GRANT USAGE ON SCHEMA shop TO catalogue,catalogue_code,bypass_probe;
      GRANT SELECT ON shop.products TO catalogue,catalogue_code,bypass_probe;
      GRANT INSERT(shop_id,product_id,name,price), UPDATE(price) ON shop.products TO catalogue;
      GRANT USAGE ON SCHEMA api TO catalogue;
      """)
    ten=Session('r42_shop10','runtime_10');twenty=Session('r42_shop20','runtime_20');migration=Session('r42_migration','migration')
    results['login_identities']=[one(s,'SELECT session_user,current_user;') for s in [ten,twenty,migration]]
    assert one(ten,'SELECT count(*) FROM shop.products;')=='4'
    results['without_rls_rows']=4
    denied(ten,'SET ROLE shop_owner;');denied(ten,'SET ROLE catalogue;');denied(ten,'SET ROLE runtime_20;')
    denied(migration,'SELECT count(*) FROM shop.products;')
    checked(migration,'SET ROLE shop_owner;')
    assert one(migration,'SELECT current_user;')=='shop_owner'
    checked(migration,'RESET ROLE;')
    checked(admin,"""ALTER TABLE shop.products ENABLE ROW LEVEL SECURITY;
      CREATE POLICY tenant_products ON shop.products TO catalogue
      USING (shop_id=CASE current_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END)
      WITH CHECK (shop_id=CASE current_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END);
      CREATE POLICY code_products ON shop.products FOR SELECT TO catalogue_code
      USING (shop_id=CASE session_user WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END);""")
    assert one(ten,'SELECT count(*) FROM shop.products;')=='3'
    assert one(twenty,'SELECT count(*) FROM shop.products;')=='1'
    assert checked(ten,'SELECT * FROM shop.products WHERE shop_id=20;')==[]
    denied(ten,"INSERT INTO shop.products VALUES(20,'forbidden','forbidden',1);")
    denied(ten,'DELETE FROM shop.products;')
    denied(ten,'ALTER TABLE shop.products ADD COLUMN forbidden integer;')
    checked(ten,"BEGIN; UPDATE shop.products SET price=21 WHERE shop_id=10 AND product_id='P7'; ROLLBACK;")
    checked(admin,"""CREATE FUNCTION api.unsafe_scope(p_shop integer,p_id text) RETURNS numeric
      LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
      AS $$ SELECT p.price FROM shop.products p WHERE p.shop_id=p_shop AND p.product_id=p_id $$;
      ALTER FUNCTION api.unsafe_scope(integer,text) OWNER TO shop_owner;
      CREATE FUNCTION api.unsafe_lookup(p_id text) RETURNS numeric
      LANGUAGE sql STABLE SECURITY DEFINER SET search_path=shop
      AS $$ SELECT p.price FROM products p WHERE p.shop_id=CASE session_user
       WHEN 'runtime_10' THEN 10 WHEN 'runtime_20' THEN 20 END AND p.product_id=p_id $$;
      ALTER FUNCTION api.unsafe_lookup(text) OWNER TO shop_owner;""")
    assert one(ten,"SELECT api.unsafe_scope(20,'P7');")=='18.00'
    results['unsafe_scope_other_shop']='18.00'
    checked(ten,"CREATE TEMP TABLE products(shop_id integer,product_id text,price numeric); INSERT INTO products VALUES(10,'P7',999); GRANT SELECT ON pg_temp.products TO shop_owner;")
    assert one(ten,"SELECT api.unsafe_lookup('P7');")=='999'
    results['unsafe_temp_shadow']='999'
    checked(admin,"""BEGIN;
      CREATE FUNCTION api.catalogue_price(p_id text) RETURNS numeric
      LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
      AS $$ SELECT p.price FROM shop.products AS p WHERE p.product_id=p_id $$;
      ALTER FUNCTION api.catalogue_price(text) OWNER TO catalogue_code;
      REVOKE ALL ON FUNCTION api.catalogue_price(text) FROM PUBLIC;
      GRANT EXECUTE ON FUNCTION api.catalogue_price(text) TO catalogue;
      CREATE FUNCTION api.execution_identity() RETURNS text
      LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
      AS $$ SELECT session_user::text || '/' || current_user::text $$;
      ALTER FUNCTION api.execution_identity() OWNER TO catalogue_code;
      REVOKE ALL ON FUNCTION api.execution_identity() FROM PUBLIC;
      GRANT EXECUTE ON FUNCTION api.execution_identity() TO catalogue;
      COMMIT;""")
    assert one(ten,"SELECT api.catalogue_price('P7');")=='20.00'
    assert one(twenty,"SELECT api.catalogue_price('P7');")=='18.00'
    assert one(ten,'SELECT api.execution_identity();')=='runtime_10/catalogue_code'
    checked(ten,"SET app.shop_id='20';")
    assert one(ten,"SELECT api.catalogue_price('P7');")=='20.00'
    denied(ten,'SET ROLE catalogue_code;')
    denied(ten,"CREATE OR REPLACE FUNCTION api.catalogue_price(p_id text) RETURNS numeric LANGUAGE sql AS $$ SELECT 7 $$;")
    results['secure_prices']={'runtime_10':'20.00','runtime_20':'18.00','runtime_10_with_temp_shadow_and_setting20':'20.00'}
    results['definer_identity']='runtime_10/catalogue_code'
    assert one(admin,"SELECT api.catalogue_price('P7') IS NULL;")=='t'
    bypass=Session('r42_bypass_control','bypass_probe')
    assert one(bypass,'SELECT count(*) FROM shop.products;')=='4'
    checked(migration,'SET ROLE shop_owner;')
    assert one(migration,'SELECT count(*) FROM shop.products;')=='4'
    checked(migration,'ALTER TABLE shop.products FORCE ROW LEVEL SECURITY;')
    assert one(migration,'SELECT count(*) FROM shop.products;')=='0'
    assert one(admin,'SELECT count(*) FROM shop.products;')=='4'
    assert one(bypass,'SELECT count(*) FROM shop.products;')=='4'
    assert one(ten,'SELECT count(*) FROM shop.products;')=='3'
    checked(migration,'ALTER TABLE shop.products DISABLE ROW LEVEL SECURITY;')
    assert one(migration,'SELECT count(*) FROM shop.products;')=='4'
    checked(migration,'ALTER TABLE shop.products ENABLE ROW LEVEL SECURITY; ALTER TABLE shop.products FORCE ROW LEVEL SECURITY; RESET ROLE;')
    assert one(ten,"SELECT api.catalogue_price('P7');")=='20.00'
    assert one(twenty,"SELECT api.catalogue_price('P7');")=='18.00'
    results['force_rls']={'owner_before_force':4,'owner_under_force':0,'superuser_under_force':4,'bypass_role_under_force':4,'owner_can_disable':True}
    results['final_catalogue']=checked(admin,'SELECT shop_id,product_id,name,price FROM shop.products ORDER BY shop_id,product_id;')
    results['success']=True
    print(json.dumps(results,indent=2))
finally:
    for s in reversed(sessions):
        try:s.close()
        except Exception:pass
    if started:
        pidfile=data/'postmaster.pid'
        if pidfile.exists() and pidfile.read_text().splitlines()[1]==str(data):
            run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
        else: raise RuntimeError('Refusing cleanup: owned postmaster identity unavailable')
    shutil.rmtree(root)
