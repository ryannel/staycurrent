#!/usr/bin/env python3
"""Owned, disposable PostgreSQL schema-change drill. Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time, uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', required=True)
args = parser.parse_args()
binpath = pathlib.Path(args.bindir).resolve()
root = pathlib.Path(tempfile.mkdtemp(prefix='r40-schema-', dir='/private/tmp' if pathlib.Path('/private/tmp').exists() else None))
data, sock = root / 'data', root / 'sock'
sock.mkdir(mode=0o700)
owner = 'r40_owner'
env = {k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGPASSFILE=str(root/'no-passwords'), PGSERVICEFILE=str(root/'no-services'), LC_ALL='C')
(root/'no-passwords').touch(mode=0o600)
(root/'no-services').touch(mode=0o600)
sessions=[]
results={}
started=False

def run(name, *argv):
    return subprocess.run([str(binpath/name), *argv], env=env, text=True, capture_output=True, check=True, timeout=30)

class Session:
    def __init__(self, label):
        self.label=label
        self.process=subprocess.Popen([str(binpath/'psql'),'-X','-qAt','-F','\t','-v','VERBOSITY=verbose',
            '-h',str(sock),'-p','55440','-U',owner,'-d','postgres'], env={**env,'PGAPPNAME':label},
            stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.lines=queue.Queue()
        threading.Thread(target=lambda: [self.lines.put(line.rstrip('\n')) for line in self.process.stdout],daemon=True).start()
        sessions.append(self)
        proof=self.sql("SELECT current_setting('data_directory'), current_setting('unix_socket_directories'), current_user, current_database(), pg_backend_pid();")
        fields=proof[-1].split('\t')
        assert fields[:4]==[str(data),str(sock),owner,'postgres'],proof
        self.pid=int(fields[4])
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

try:
    run('initdb','-D',str(data),'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8')
    with (data/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=55440\nmax_connections=20\n")
    run('pg_ctl','-D',str(data),'-l',str(root/'server.log'),'-w','start')
    started=True
    admin=Session('r40_observer')
    results['version']=one(admin,'SELECT version();')
    checked(admin,"""CREATE TABLE order_items(order_id integer,line_no integer,product_id text,quantity integer,
      unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
      INSERT INTO order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),
      (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
      CREATE TABLE rewrite_probe AS SELECT g AS n FROM generate_series(1,10000) g;""")
    files=[one(admin,"SELECT pg_relation_filenode('rewrite_probe');")]
    checked(admin,'ALTER TABLE rewrite_probe ADD COLUMN constant_value integer DEFAULT 7;')
    files.append(one(admin,"SELECT pg_relation_filenode('rewrite_probe');"))
    checked(admin,'ALTER TABLE rewrite_probe ADD COLUMN measured_at timestamptz DEFAULT clock_timestamp();')
    files.append(one(admin,"SELECT pg_relation_filenode('rewrite_probe');"))
    assert files[0]==files[1] and files[1]!=files[2],files
    results['rewrite_filenodes']=files
    holder,ddl,reader=Session('r40_holder'),Session('r40_ddl'),Session('r40_reader')
    checked(holder,'BEGIN; SELECT count(*) FROM order_items;')
    checked(ddl,"BEGIN; SET LOCAL lock_timeout='3s'; SET LOCAL statement_timeout='8s';")
    ddlmark=ddl.begin('ALTER TABLE order_items ADD COLUMN unit_price_minor bigint;')
    until(admin,f"SELECT {holder.pid} = ANY(pg_blocking_pids({ddl.pid}));",lambda x:x=='t')
    readmark=reader.begin('SELECT count(*) FROM order_items;')
    until(admin,f"SELECT {ddl.pid} = ANY(pg_blocking_pids({reader.pid}));",lambda x:x=='t')
    results['queued_reader']=checked(admin,f"SELECT application_name,state,wait_event_type,wait_event,pg_blocking_pids(pid) FROM pg_stat_activity WHERE pid IN ({holder.pid},{ddl.pid},{reader.pid}) ORDER BY application_name;")
    failure=ddl.finish(ddlmark)
    assert any('55P03' in x for x in failure),failure
    assert reader.finish(readmark)==['5']
    assert one(admin,f"SELECT state FROM pg_stat_activity WHERE pid={ddl.pid};")=='idle in transaction (aborted)'
    checked(ddl,'ROLLBACK;')
    checked(holder,'ROLLBACK;')
    assert one(admin,"SELECT count(*) FROM pg_attribute WHERE attrelid='order_items'::regclass AND attname='unit_price_minor' AND NOT attisdropped;")=='0'
    results['ddl_timeout']=failure
    checked(admin,"""BEGIN; SET LOCAL lock_timeout='1s'; SET LOCAL statement_timeout='5s';
      ALTER TABLE order_items ADD COLUMN unit_price_minor bigint;
      CREATE FUNCTION fill_minor() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
        NEW.unit_price_minor:=(NEW.unit_price*100)::bigint; RETURN NEW; END $$;
      CREATE TRIGGER fill_minor BEFORE INSERT OR UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION fill_minor();
      ALTER TABLE order_items ADD CONSTRAINT price_pair CHECK (unit_price_minor IS NOT NULL
        AND unit_price_minor::numeric=unit_price*100) NOT VALID; COMMIT;""")
    assert one(admin,"SELECT convalidated FROM pg_constraint WHERE conname='price_pair';")=='f'
    checked(holder,"BEGIN; SELECT 1 FROM order_items WHERE order_id=103 AND line_no=1 FOR UPDATE;")
    batch="""WITH b AS (SELECT order_id,line_no FROM order_items WHERE unit_price_minor IS NULL
      ORDER BY order_id,line_no LIMIT 2 FOR UPDATE SKIP LOCKED)
      UPDATE order_items i SET unit_price_minor=(i.unit_price*100)::bigint FROM b
      WHERE (i.order_id,i.line_no)=(b.order_id,b.line_no) AND i.unit_price_minor IS NULL
      RETURNING i.order_id,i.line_no;"""
    batches=[checked(admin,batch) for _ in range(3)]
    assert [len(x) for x in batches]==[2,2,0],batches
    assert one(admin,'SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL;')=='1'
    checked(holder,'COMMIT;')
    last=checked(admin,batch)
    assert last==['103\t1'],last
    assert one(admin,"SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL OR unit_price_minor::numeric IS DISTINCT FROM unit_price*100;")=='0'
    checked(admin,'ALTER TABLE order_items VALIDATE CONSTRAINT price_pair;')
    old=one(admin,"SELECT pg_relation_filenode('order_items');")
    checked(admin,'ALTER TABLE order_items ALTER COLUMN unit_price_minor SET NOT NULL;')
    assert one(admin,"SELECT pg_relation_filenode('order_items');")==old
    checked(admin,'BEGIN; ALTER TABLE order_items DISABLE TRIGGER fill_minor;')
    failure=admin.sql('UPDATE order_items SET unit_price_minor=7 WHERE order_id=103 AND line_no=1;')
    assert any('23514' in x for x in failure),failure
    checked(admin,'ROLLBACK;')
    assert one(admin,'SELECT sum(quantity*unit_price_minor) FROM order_items WHERE order_id=103;')=='2900'
    results['backfill_batches']=batches+[last]
    results['price_acceptance']=checked(admin,"SELECT order_id,line_no,unit_price,unit_price_minor FROM order_items ORDER BY order_id,line_no;")
    checked(admin,'CREATE TABLE index_probe(row_no integer PRIMARY KEY, candidate integer); INSERT INTO index_probe VALUES(1,1),(2,1);')
    failure=admin.sql('CREATE UNIQUE INDEX CONCURRENTLY probe_unique ON index_probe(candidate);')
    assert any('23505' in x for x in failure),failure
    assert one(admin,"SELECT indisvalid FROM pg_index WHERE indexrelid='probe_unique'::regclass;")=='f'
    checked(admin,'CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS probe_unique ON index_probe(candidate);')
    assert one(admin,"SELECT indisvalid FROM pg_index WHERE indexrelid='probe_unique'::regclass;")=='f'
    results['invalid_index']=checked(admin,"SELECT indisvalid,indisready,pg_get_indexdef(indexrelid) FROM pg_index WHERE indexrelid='probe_unique'::regclass;")
    checked(admin,'DELETE FROM index_probe WHERE row_no=2; REINDEX INDEX CONCURRENTLY probe_unique;')
    assert one(admin,"SELECT indisvalid AND indisready FROM pg_index WHERE indexrelid='probe_unique'::regclass;")=='t'
    checked(holder,'BEGIN; UPDATE index_probe SET candidate=2 WHERE row_no=1;')
    buildmark=ddl.begin('CREATE INDEX CONCURRENTLY probe_candidate ON index_probe(candidate);')
    phase=until(admin,f"SELECT coalesce((SELECT phase FROM pg_stat_progress_create_index WHERE pid={ddl.pid}),'absent');",lambda x:x=='waiting for writers before build')
    assert one(reader,'SELECT candidate FROM index_probe;')=='1'
    results['concurrent_build_phase']=phase
    checked(holder,'ROLLBACK;')
    buildlines=ddl.finish(buildmark)
    assert not any('ERROR:' in x for x in buildlines),buildlines
    assert one(admin,"SELECT indisvalid AND indisready FROM pg_index WHERE indexrelid='probe_candidate'::regclass;")=='t'
    checked(admin,'REINDEX INDEX CONCURRENTLY probe_candidate; DROP INDEX CONCURRENTLY probe_candidate;')
    assert one(admin,"SELECT to_regclass('probe_candidate') IS NULL;")=='t'
    results['success']=True
    print(json.dumps(results,indent=2))
finally:
    for s in reversed(sessions):
        try:s.close()
        except Exception:pass
    if started:
        # pg_ctl targets only the directory created by this invocation.
        pidfile=data/'postmaster.pid'
        if pidfile.exists() and pidfile.read_text().splitlines()[1]==str(data):
            run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
        else: raise RuntimeError('Refusing cleanup: owned postmaster identity unavailable')
    shutil.rmtree(root)
