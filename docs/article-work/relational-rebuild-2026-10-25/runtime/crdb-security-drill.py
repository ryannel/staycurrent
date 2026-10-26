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
E = W / 'evidence/native-security-01'
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


(E / 'fixture.json').write_text(json.dumps(F, indent=2) + '\n')
for name in ['setup.sql', 'cases.json', 'probe-plan.md']:
    (E / ('authored-' + name)).write_bytes((W / 'evidence' / name).read_bytes())
(E / 'executed-runner.py').write_bytes(Path(__file__).read_bytes())
setup = sql('setup', 'root', (E / 'authored-setup.sql').read_text())
assert setup.returncode == 0, 'Setup failed; retain output and inspect before any supplement'
for case in json.loads((E / 'authored-cases.json').read_text()):
    p = sql(case['name'], case['user'], case['sql'])
    failed_expected = case['expected'].startswith('FAIL')
    results[-1].update(expected=case['expected'], expected_failure=failed_expected,
                       exit_expectation_met=(p.returncode != 0) == failed_expected)
    (E / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
sql('final-stored-rows', 'root', 'SELECT * FROM shop.customers ORDER BY customer_id; SELECT * FROM shop.orders ORDER BY order_id; SELECT * FROM shop.payments ORDER BY payment_id;')
print(json.dumps({'evidence': str(E), 'exit_mismatches': [r['name'] for r in results if r.get('exit_expectation_met') is False]}))
