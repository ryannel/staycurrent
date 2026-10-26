"""Capture authored SQL on the exact owned TLS fixture; never copy credentials."""
from pathlib import Path
import csv
import hashlib
import io
import json
import subprocess
import time

R = Path(__file__).resolve().parent
W = Path('/private/tmp/staycurrent-relational-rebuild-crdb-operations-writer-20261025')
E = W / 'evidence/native-operations-01'
E.mkdir(exist_ok=False)
F = json.loads((R / 'crdb-operations-fixture.json').read_text())
CID = '95eaed7f33fa4a7d24adc93506ff8d9b9f655e01c329bb1c40878aec36778fd8'
UUID = '64c14368-e7cf-4fb1-8a00-b4b13c1fa30e'
assert F['container_id'] == CID and F['cluster_id'] == UUID
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config',
     '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
C = ['/cockroach/cockroach', 'sql', '--certs-dir=' + F['certs_dir'],
     '--host=localhost:26257', '--database=' + F['database'], '--format=csv',
     '--set=errexit=true']
results = []


def capture(name, argv, stdin=None, timeout=45):
    (E / (name + '.command.json')).write_text(json.dumps(argv, indent=2) + '\n')
    if stdin is not None:
        (E / (name + '.stdin.sql')).write_text(stdin)
    started = time.monotonic()
    p = subprocess.run(argv, input=stdin, text=True, capture_output=True, timeout=timeout)
    (E / (name + '.stdout')).write_text(p.stdout)
    (E / (name + '.stderr')).write_text(p.stderr)
    record = {'name': name, 'returncode': p.returncode,
              'elapsed_seconds': time.monotonic() - started,
              'stdin_sha256': hashlib.sha256(stdin.encode()).hexdigest() if stdin else None}
    results.append(record)
    (E / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
    return p


def guard(name):
    p = capture(name + '-container', D + ['inspect', CID], timeout=10)
    assert p.returncode == 0
    i = json.loads(p.stdout)[0]
    assert i['Id'] == CID and i['Name'] == '/' + F['name']
    assert i['Config']['Image'] == F['pinned_image']
    assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert i['Config']['Labels']['dev.staycurrent.article'] == 'crdb-operations'
    assert i['HostConfig']['NetworkMode'] == 'none'
    assert not i['HostConfig'].get('PortBindings') and not i.get('Mounts')
    q = "SET allow_unsafe_internals=true; SELECT json_build_object('cluster',crdb_internal.cluster_id(),'database',current_database(),'user',current_user,'marker',(SELECT marker FROM public.fixture_guard));"
    p = sql(name + '-identity', 'root', q, guarded=False)
    assert p.returncode == 0
    rows = list(csv.reader(io.StringIO(p.stdout)))
    identity = json.loads(rows[-1][0])
    assert identity == {'cluster': UUID, 'database': F['database'], 'user': 'root', 'marker': F['marker']}


def sql(name, user, q, guarded=True):
    if guarded:
        guard(name)
    full = "SET statement_timeout='20s';\n" + q.rstrip() + '\n'
    return capture(name, D + ['exec', '-i', CID, 'env', '-i',
                   'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                   'GOMEMLIMIT=384MiB'] + C + ['--user=' + user], full)


(E / 'fixture.json').write_text(json.dumps(F,indent=2)+'\n')
(E / 'executed-runner.py').write_bytes(Path(__file__).read_bytes())
guard('initial')
sql('ddl-setting-and-migration-rollback','shop_migrate', "SHOW autocommit_before_ddl; SET autocommit_before_ddl=false; BEGIN; CREATE TABLE shop.allowed_migration(id INT); ROLLBACK;")
sql('migration-absence','root',"SELECT count(*) FROM information_schema.tables WHERE table_schema='shop' AND table_name='allowed_migration';")
execbase=D+['exec',CID,'env','-i','PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin','GOMEMLIMIT=384MiB']
certs=F['certs_dir'];base=F['root']
capture('certificate-metadata',execbase+['/cockroach/cockroach','cert','list','--certs-dir='+certs])
url='postgresql://shop_runtime@localhost:26257/'+F['database']+'?sslmode=verify-full&sslrootcert='+certs+'/ca.crt&sslcert='+certs+'/client.shop_runtime.crt&sslkey='+certs+'/client.shop_runtime.key'
for name,value in [('tls-verified',url),('tls-hostname-mismatch',url.replace('@localhost:', '@127.0.0.2:')),('tls-client-identity-mismatch',url.replace('client.shop_runtime','client.shop_support'))]:
 capture(name,execbase+['/cockroach/cockroach','sql','--url='+value,'--format=csv','--set=errexit=true'], 'SELECT current_user,session_user,current_database();\n')
capture('unrelated-ca-dir',execbase+['mkdir','-p',base+'/unrelated-ca'])
capture('unrelated-ca-create',execbase+['/cockroach/cockroach','cert','create-ca','--certs-dir='+base+'/unrelated-ca','--ca-key='+base+'/unrelated-ca/key'])
badurl=url.replace('sslrootcert='+certs+'/ca.crt','sslrootcert='+base+'/unrelated-ca/ca.crt')
capture('tls-untrusted-ca',execbase+['/cockroach/cockroach','sql','--url='+badurl,'--format=csv','--set=errexit=true'],'SELECT current_user;\n')
for name,args in [('node-status',['status','--all','--ranges','--decommission']),('drain-help',['drain','--help']),('decommission-help',['decommission','--help'])]:
 capture(name,execbase+['/cockroach/cockroach','node']+args+([] if name.endswith('help') else ['--certs-dir='+certs,'--host=localhost:26257','--format=csv']))
sql('health-baseline','root', "SHOW RANGES FROM TABLE shop.orders WITH DETAILS; SHOW ZONE CONFIGURATION FOR DATABASE sc_crdb_operations; SHOW ZONE CONFIGURATION FOR TABLE shop.orders; SELECT name,value FROM crdb_internal.node_metrics WHERE name IN ('ranges.unavailable','ranges.underreplicated','ranges');")
print(json.dumps({'evidence':str(E),'results':results}))
