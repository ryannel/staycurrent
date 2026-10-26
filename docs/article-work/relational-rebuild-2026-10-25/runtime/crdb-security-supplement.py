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
E = W / 'evidence/native-security-supplement-01'
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


(E / 'fixture.json').write_text(json.dumps(F, indent=2)+'\n')
(E / 'executed-runner.py').write_bytes(Path(__file__).read_bytes())
# Restore explicitly: earlier CLI auto-committed these DDL operations.
p=sql('restore-policy-and-public-boundary','root', "ALTER TABLE shop.customers ENABLE ROW LEVEL SECURITY; ALTER TABLE shop.customers FORCE ROW LEVEL SECURITY; DROP TABLE IF EXISTS shop.allowed_migration; REVOKE CREATE ON SCHEMA public FROM public; SHOW CREATE TABLE shop.customers; SHOW GRANTS ON SCHEMA public;")
assert p.returncode==0
p=sql('runtime-public-create-denied','shop_runtime','CREATE TABLE public.forbidden(id INT);')
assert p.returncode!=0 and '42501' in p.stderr
# Deliberate autocommitted DDL, with explicit restore rather than a rollback claim.
assert sql('owner-no-force','root', 'ALTER TABLE shop.customers NO FORCE ROW LEVEL SECURITY;').returncode==0
assert sql('owner-no-force-observation','shop_migrate', "BEGIN; SET LOCAL application_name='10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; ROLLBACK;").returncode==0
assert sql('owner-force-restored','root', 'ALTER TABLE shop.customers FORCE ROW LEVEL SECURITY;').returncode==0
assert sql('disable-policy','root', 'ALTER TABLE shop.customers DISABLE ROW LEVEL SECURITY;').returncode==0
assert sql('disabled-runtime-observation','shop_runtime', "BEGIN; SET LOCAL application_name='10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; ROLLBACK;").returncode==0
assert sql('enable-policy-restored','root', 'ALTER TABLE shop.customers ENABLE ROW LEVEL SECURITY;').returncode==0
for user in ['shop_runtime','shop_support','shop_migrate']:
 table='shop.support_customers' if user=='shop_support' else 'shop.customers'
 assert sql('restored-policy-'+user,user,"BEGIN; SET LOCAL application_name='10'; SELECT customer_id FROM "+table+" ORDER BY customer_id; COMMIT; SELECT count(*) FROM "+table+";").returncode==0
assert sql('restored-final-definition','root','SHOW CREATE TABLE shop.customers; SHOW GRANTS FOR shop_runtime; SHOW GRANTS ON SCHEMA public, shop;').returncode==0
# Probe schema migration in a dedicated transaction with the CLI auto-commit switch off.
C.append('--set=autocommit_before_ddl=false')
p=sql('migration-ddl-rollback','shop_migrate','BEGIN; CREATE TABLE shop.allowed_migration(id INT); ROLLBACK;')
assert p.returncode==0
assert sql('migration-absence','root',"SELECT count(*) FROM information_schema.tables WHERE table_schema='shop' AND table_name='allowed_migration';").returncode==0
print(json.dumps({'evidence':str(E),'completed':True}))
