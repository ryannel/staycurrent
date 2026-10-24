#!/usr/bin/env python3
"""Owned, disposable PostgreSQL full-text search drill. Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time, uuid

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', required=True)
args = parser.parse_args()
binpath = pathlib.Path(args.bindir).resolve()
root = pathlib.Path(tempfile.mkdtemp(prefix='r55-schema-', dir='/private/tmp' if pathlib.Path('/private/tmp').exists() else None))
data, sock = root / 'data', root / 'sock'
sock.mkdir(mode=0o700)
owner = 'r55_owner'
env = {k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGPASSFILE=str(root/'no-passwords'), PGSERVICEFILE=str(root/'no-services'), LC_ALL='C')
(root/'no-passwords').touch(mode=0o600)
(root/'no-services').touch(mode=0o600)
sessions=[]
results={}
started=False
cluster_tag="r55_"+uuid.uuid4().hex

def run(name, *argv):
    return subprocess.run([str(binpath/name), *argv], env=env, text=True, capture_output=True, check=True, timeout=30)

class Session:
    def __init__(self, label, user=None):
        user=user or owner
        self.label=label
        self.process=subprocess.Popen([str(binpath/'psql'),'-X','-qAt','-F','\t','-v','VERBOSITY=verbose',
            '-h',str(sock),'-p','55455','-U',user,'-d','postgres'], env={**env,'PGAPPNAME':label},
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

# Exact centrally approved illustrative corpus, paired with unchanged core rows.
CORPUS=[{'product_id': 'P3', 'name': 'Green tea, 50 g', 'price': '4.50', 'stock_before_103': 12, 'stock_after_103': 10, 'description': 'Loose green tea for a quiet afternoon. Brew the leaves gently.'}, {'product_id': 'P7', 'name': 'Blue mug', 'price': '20.00', 'stock_before_103': 1, 'stock_after_103': 0, 'description': 'A ceramic mug for green tea. The blue glaze is dishwasher safe.'}, {'product_id': 'P9', 'name': 'Teapot', 'price': '35.00', 'stock_before_103': 4, 'stock_after_103': 4, 'description': 'A ceramic teapot for brewing tea. A mug is not included.'}]
def literal(value): return "'"+str(value).replace("'","''")+"'"
try:
    run('initdb','-D',str(data),'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8')
    with (data/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=55455\nmax_connections=12\nshared_buffers='16MB'\ncluster_name='{cluster_tag}'\n")
    run('pg_ctl','-D',str(data),'-l',str(root/'server.log'),'-w','start');started=True
    admin=Session('r55_observer')
    assert one(admin,"SELECT current_setting('data_directory');")==str(data)
    assert one(admin,"SELECT current_setting('unix_socket_directories');")==str(sock)
    results['version']=one(admin,'SELECT version();')
    checked(admin,'SET client_min_messages=warning;')
    checked(admin,"""CREATE TABLE products(shop_id integer NOT NULL,product_id text NOT NULL,title text NOT NULL,description text,stock integer NOT NULL,
      document tsvector GENERATED ALWAYS AS
      (setweight(to_tsvector('pg_catalog.english',coalesce(title,'')),'A') || setweight(to_tsvector('pg_catalog.english',coalesce(description,'')),'D')) STORED,
      PRIMARY KEY(shop_id,product_id));""")
    for p in CORPUS:
        checked(admin,'INSERT INTO products(shop_id,product_id,title,description,stock) VALUES(10,'+','.join(literal(p[key]) for key in ['product_id','name','description','stock_after_103'])+');')
    results['documents']=checked(admin,'SELECT product_id,document FROM products ORDER BY product_id;')
    results['normalisation']=one(admin,"SELECT to_tsvector('english','brewing brewed brew'),to_tsvector('simple','brewing brewed brew');")
    results['phrase_gap']=one(admin,"SELECT phraseto_tsquery('english','mug for green');")
    results['phrase_gap_matches']=checked(admin,"SELECT product_id FROM products WHERE document @@ phraseto_tsquery('english','mug for green') ORDER BY product_id;")
    results['cross_field_phrase']=one(admin,"SELECT phraseto_tsquery('english','teapot a ceramic');")
    results['cross_field_matches']=checked(admin,"SELECT product_id FROM products WHERE document @@ phraseto_tsquery('english','teapot a ceramic') ORDER BY product_id;")
    results['cross_field_separate_matches']=checked(admin,"SELECT product_id FROM products WHERE to_tsvector('english',title) @@ phraseto_tsquery('english','teapot a ceramic') OR to_tsvector('english',description) @@ phraseto_tsquery('english','teapot a ceramic') ORDER BY product_id;")
    assert results['cross_field_matches']==['P9'] and results['cross_field_separate_matches']==[]
    results['queries']={}
    for label,raw in [('mug','mug'),('green_phrase','"green tea"'),('minus_teapot','mug -teapot'),('or_query','"green tea" OR mug'),('stop_only','the and'),('malformed','" ) &')]:
        query="websearch_to_tsquery('english',"+literal(raw)+')'
        normalised=one(admin,'SELECT '+query+'::text;')
        rows=checked(admin,'SELECT product_id,round(ts_rank_cd(document,'+query+')::numeric,6),stock FROM products WHERE shop_id=10 AND document @@ '+query+' ORDER BY ts_rank_cd(document,'+query+') DESC,product_id;')
        eligible=checked(admin,'SELECT product_id FROM products WHERE shop_id=10 AND stock>0 AND document @@ '+query+' ORDER BY ts_rank_cd(document,'+query+') DESC,product_id;')
        results['queries'][label]={'input':raw,'query':normalised,'all_ranked':rows,'eligible':eligible}
    assert results['queries']['mug']['eligible']==['P9']
    assert results['queries']['minus_teapot']['eligible']==[]
    assert results['queries']['stop_only']['all_ranked']==[]
    results['title_only_mug']=checked(admin,"SELECT product_id FROM products WHERE document @@ to_tsquery('english','mug:A') ORDER BY product_id;")
    assert results['title_only_mug']==['P7']
    checked(admin,'CREATE INDEX products_document_gin ON products USING gin(document);')
    original=one(admin,"SELECT document FROM products WHERE product_id='P3';")
    checked(admin,"BEGIN; UPDATE products SET description='A kettle only.' WHERE product_id='P3';")
    assert one(admin,"SELECT document @@ plainto_tsquery('english','kettle') FROM products WHERE product_id='P3';")=='t'
    checked(admin,'ROLLBACK;');assert one(admin,"SELECT document FROM products WHERE product_id='P3';")==original
    results['generated_document_update_and_rollback']=True
    checked(admin,"""CREATE TABLE retrieval_fixture(id integer PRIMARY KEY,shop_id integer,stock integer,document tsvector);
      INSERT INTO retrieval_fixture SELECT n,10,CASE WHEN n%200=0 THEN 0 ELSE 1 END,
      to_tsvector('english',CASE WHEN n%100=0 THEN 'ceramic mug' ELSE 'plain catalogue entry' END)
      FROM generate_series(1,20000) n;
      CREATE INDEX retrieval_fixture_gin ON retrieval_fixture USING gin(document);
      ANALYZE retrieval_fixture;""")
    sql="SELECT id,ts_rank_cd(document,websearch_to_tsquery('english','mug')) AS rank FROM retrieval_fixture WHERE shop_id=10 AND stock>0 AND document @@ websearch_to_tsquery('english','mug') ORDER BY rank DESC,id LIMIT 5"
    plan=''.join(checked(admin,'EXPLAIN(ANALYZE,BUFFERS,COSTS OFF,TIMING OFF,FORMAT JSON) '+sql+';'))
    results['retrieval_plan']=json.loads(plan)
    assert 'Bitmap Index Scan' in plan and 'retrieval_fixture_gin' in plan and 'Sort' in plan,plan
    results['retrieval_rows']=checked(admin,sql+';')
    assert [row.split('\t')[0] for row in results['retrieval_rows']]==['100','300','500','700','900']
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
        else:raise RuntimeError('Refusing cleanup: owned postmaster identity unavailable')
    shutil.rmtree(root)
