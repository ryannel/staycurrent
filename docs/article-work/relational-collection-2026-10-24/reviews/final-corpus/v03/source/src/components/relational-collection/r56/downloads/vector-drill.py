#!/usr/bin/env python3
"""Owned, disposable PostgreSQL vector retrieval drill. Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time, uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', required=True)
args = parser.parse_args()
binpath = pathlib.Path(args.bindir).resolve()
root = pathlib.Path(tempfile.mkdtemp(prefix='r56-schema-', dir='/private/tmp' if pathlib.Path('/private/tmp').exists() else None))
data, sock = root / 'data', root / 'sock'
sock.mkdir(mode=0o700)
owner = 'r56_owner'
env = {k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGPASSFILE=str(root/'no-passwords'), PGSERVICEFILE=str(root/'no-services'), LC_ALL='C')
(root/'no-passwords').touch(mode=0o600)
(root/'no-services').touch(mode=0o600)
sessions=[]
results={}
started=False
cluster_tag="r56_"+uuid.uuid4().hex

def run(name, *argv):
    return subprocess.run([str(binpath/name), *argv], env=env, text=True, capture_output=True, check=True, timeout=30)

class Session:
    def __init__(self, label, user=None):
        user=user or owner
        self.label=label
        self.process=subprocess.Popen([str(binpath/'psql'),'-X','-qAt','-F','\t','-v','VERBOSITY=verbose',
            '-h',str(sock),'-p','55456','-U',user,'-d','postgres'], env={**env,'PGAPPNAME':label},
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

# Chosen illustrative coordinates, not model embeddings.
CORPUS=[{'product_id': 'P3', 'name': 'Green tea, 50 g', 'price': '4.50', 'stock_before_103': 12, 'stock_after_103': 10, 'coordinates': [1, 0]}, {'product_id': 'P7', 'name': 'Blue mug', 'price': '20.00', 'stock_before_103': 1, 'stock_after_103': 0, 'coordinates': [0, 1]}, {'product_id': 'P9', 'name': 'Teapot', 'price': '35.00', 'stock_before_103': 4, 'stock_after_103': 4, 'coordinates': [0.6, 0.8]}]
def literal(value):return "'"+str(value).replace("'","''")+"'"
def plan(s,sql):return json.loads(''.join(checked(s,'EXPLAIN(ANALYZE,BUFFERS,COSTS OFF,TIMING OFF,FORMAT JSON) '+sql+';')))
def ids(rows):return [int(row.split('\t')[0]) for row in rows]
try:
    run('initdb','-D',str(data),'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8')
    with (data/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=55456\nmax_connections=12\nshared_buffers='16MB'\ncluster_name='{cluster_tag}'\n")
    run('pg_ctl','-D',str(data),'-l',str(root/'server.log'),'-w','start');started=True
    admin=Session('r56_observer')
    assert one(admin,"SELECT current_setting('data_directory');")==str(data)
    assert one(admin,"SELECT current_setting('unix_socket_directories');")==str(sock)
    results['version']=one(admin,'SELECT version();');checked(admin,'SET client_min_messages=warning; CREATE EXTENSION vector;')
    results['vector_version']=one(admin,"SELECT extversion FROM pg_extension WHERE extname='vector';")
    assert results['vector_version']=='0.8.7'
    checked(admin,'CREATE TABLE products(shop_id integer,product_id text,title text,stock integer,embedding vector(2),PRIMARY KEY(shop_id,product_id));')
    for p in CORPUS:
        values=[10,p['product_id'],p['name'],p['stock_after_103'],json.dumps(p['coordinates'])]
        checked(admin,'INSERT INTO products VALUES('+','.join(literal(value) for value in values)+');')
    results['toy_all']=checked(admin,"SELECT product_id,embedding <-> '[0,1]'::vector AS distance FROM products WHERE shop_id=10 ORDER BY distance,product_id;")
    results['toy_eligible']=checked(admin,"SELECT product_id,embedding <-> '[0,1]'::vector AS distance FROM products WHERE shop_id=10 AND stock>0 ORDER BY distance,product_id;")
    assert [row.split('\t')[0] for row in results['toy_all']]==['P7','P9','P3']
    assert [row.split('\t')[0] for row in results['toy_eligible']]==['P9','P3']
    results['limit_before_filter']=checked(admin,"SELECT product_id FROM (SELECT * FROM products ORDER BY embedding <-> '[0,1]'::vector LIMIT 1) candidate WHERE shop_id=10 AND stock>0;")
    assert results['limit_before_filter']==[]
    checked(admin,"""CREATE TABLE ann_fixture(id integer PRIMARY KEY,cohort integer NOT NULL,embedding vector(8) NOT NULL);
      INSERT INTO ann_fixture SELECT n,CASE WHEN n%100=0 THEN 1 ELSE 0 END,
      ARRAY(SELECT (('x'||substr(md5(n::text||':'||d::text),1,8))::bit(32)::bigint / 4294967295.0)::real FROM generate_series(1,8) d)::vector(8)
      FROM generate_series(1,30000) n;
      ANALYZE ann_fixture;
      BEGIN ISOLATION LEVEL REPEATABLE READ;
      SET LOCAL max_parallel_workers_per_gather=0;
      SET LOCAL max_parallel_maintenance_workers=0;
      SET LOCAL maintenance_work_mem='64MB';""")
    query_vector="'[0.37,0.53,0.19,0.71,0.29,0.83,0.41,0.61]'::vector"
    select='SELECT id,embedding <-> '+query_vector+' AS distance FROM ann_fixture WHERE cohort=1 ORDER BY embedding <-> '+query_vector+' LIMIT 20'
    results['fixture']={'rows':30000,'dimensions':8,'eligible_rows':300,'k':20,'query':query_vector,'parallel_workers':0,'snapshot':'one Repeatable Read transaction; fixture unchanged'}
    results['exact_rows']=checked(admin,select+';');results['exact_plan']=plan(admin,select)
    assert len(results['exact_rows'])==20
    assert 'Seq Scan' in json.dumps(results['exact_plan'])
    boundary=results['exact_rows'][-1].split('\t')[1]
    assert one(admin,'SELECT count(*) FROM ann_fixture WHERE cohort=1 AND embedding <-> '+query_vector+' = '+literal(boundary)+'::float8;')=='1'
    exact=set(ids(results['exact_rows']));results['trials']=[]
    for method,ddl,settings in [
      ('hnsw','CREATE INDEX fixture_ann ON ann_fixture USING hnsw(embedding vector_l2_ops) WITH(m=16,ef_construction=64)',[
        ('hnsw_off','SET LOCAL hnsw.ef_search=40; SET LOCAL hnsw.iterative_scan=off;'),
        ('hnsw_iterative','SET LOCAL hnsw.ef_search=40; SET LOCAL hnsw.iterative_scan=strict_order; SET LOCAL hnsw.max_scan_tuples=20000;')]),
      ('ivfflat','CREATE INDEX fixture_ann ON ann_fixture USING ivfflat(embedding vector_l2_ops) WITH(lists=100)',[
        ('ivf_1','SET LOCAL ivfflat.probes=1; SET LOCAL ivfflat.iterative_scan=off;'),
        ('ivf_10','SET LOCAL ivfflat.probes=10; SET LOCAL ivfflat.iterative_scan=off;')])]:
        started_build=time.monotonic();checked(admin,ddl+';');build_seconds=round(time.monotonic()-started_build,4)
        index_bytes=int(one(admin,"SELECT pg_relation_size('fixture_ann');"))
        for label,config in settings:
            # A diagnostic comparison of access methods, not a natural-plan claim.
            checked(admin,'SET LOCAL enable_seqscan=off; '+config)
            rows=checked(admin,select+';');execution_plan=plan(admin,select)
            assert 'fixture_ann' in json.dumps(execution_plan),execution_plan
            hit=len(set(ids(rows))&exact)
            results['trials'].append({'label':label,'method':method,'settings':config,'diagnostic_seqscan_disabled':True,'rows':rows,'returned':len(rows),'exact_overlap':hit,'recall_at_20':hit/20,'plan':execution_plan,'index_bytes':index_bytes,'build_seconds':build_seconds})
        checked(admin,'DROP INDEX fixture_ann; SET LOCAL enable_seqscan=on;')
    checked(admin,'COMMIT;')
    assert results['trials'][0]['returned']<20
    assert results['trials'][1]['returned']==20
    assert results['trials'][2]['returned']<20
    results['success']=True
    print(json.dumps(results,indent=2))
finally:
    for s in reversed(sessions):
        try:s.close()
        except Exception:pass
    if started:
        pidfile=data/'postmaster.pid'
        if pidfile.exists() and pidfile.read_text().splitlines()[1]==str(data):run('pg_ctl','-D',str(data),'-m','fast','-w','stop')
        else:raise RuntimeError('Refusing cleanup: owned postmaster identity unavailable')
    shutil.rmtree(root)
