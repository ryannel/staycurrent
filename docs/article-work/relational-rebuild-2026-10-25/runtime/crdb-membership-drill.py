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
E = W / 'evidence/native-membership-01'
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
    try:
        p = subprocess.run(argv, input=stdin, text=True, capture_output=True, timeout=timeout)
    except subprocess.TimeoutExpired as err:
        out = err.stdout.decode() if isinstance(err.stdout, bytes) else (err.stdout or '')
        error = err.stderr.decode() if isinstance(err.stderr, bytes) else (err.stderr or '')
        p = subprocess.CompletedProcess(argv, 124, out, error + '\nROOT COMMAND TIMEOUT\n')
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
execbase=D+['exec',CID,'env','-i','PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin','GOMEMLIMIT=384MiB']
nodebase=execbase+['/cockroach/cockroach','node'];common=['--certs-dir='+F['certs_dir'],'--host=localhost:26257','--format=csv']
error=None
try:
 guard('initial')
 p=capture('status-before',nodebase+['status','--all','--ranges','--decommission']+common)
 assert p.returncode==0
 statuses=list(csv.DictReader(io.StringIO(p.stdout)))
 target=next(row for row in statuses if row['address']=='127.0.0.1:26260')
 assert target['membership']=='active' and target['is_live']=='true'
 assert all(row['ranges_unavailable']=='0' and row['ranges_underreplicated']=='0' for row in statuses)
 targetid=target['id']
 (E/'selected-target.json').write_text(json.dumps(target,indent=2)+'\n')
 p=sql('native-policy-and-metrics','root',"SET allow_unsafe_internals=true; SHOW RANGES FROM TABLE shop.orders WITH DETAILS; SHOW ZONE CONFIGURATION FOR TABLE shop.orders; SELECT name,value FROM crdb_internal.node_metrics WHERE name IN ('ranges.unavailable','ranges.underreplicated','ranges');")
 assert p.returncode==0
 p=capture('preflight-four-to-three',nodebase+['decommission',targetid,'--dry-run','--checks=strict']+common,timeout=60)
 assert p.returncode==0
 guard('before-drain')
 p=capture('drain-target',nodebase+['drain',targetid,'--drain-wait=20s']+common,timeout=45)
 assert p.returncode==0
 capture('status-drained',nodebase+['status','--all','--ranges','--decommission']+common)
 guard('before-decommission')
 p=capture('decommission-target',nodebase+['decommission',targetid,'--checks=strict','--wait=all']+common,timeout=100)
 assert p.returncode==0
 p=capture('status-after',nodebase+['status','--all','--ranges','--decommission']+common)
 assert p.returncode==0
 after=list(csv.DictReader(io.StringIO(p.stdout)))
 observed=next(row for row in after if row['id']==targetid)
 assert observed['membership']=='decommissioned'
 sql('ranges-after','root','SHOW RANGES FROM TABLE shop.orders WITH DETAILS;')
 sql('runtime-after','shop_runtime',"BEGIN; SET LOCAL application_name='10'; SELECT order_id,status FROM shop.orders ORDER BY order_id; COMMIT;")
 # Dry-run is observational and cannot mark another node for removal.
 remaining=next(row for row in after if row['id'] not in [targetid,'1'] and row['membership']=='active')
 capture('preflight-three-to-two',nodebase+['decommission',remaining['id'],'--dry-run','--checks=strict']+common,timeout=60)
 capture('status-final',nodebase+['status','--all','--ranges','--decommission']+common)
except BaseException as exc:
 error=type(exc).__name__+': '+str(exc)
finally:
 p=capture('cleanup-owned-fixture',['python3',str(R/'crdb-secure-fixture.py'),'stop'],timeout=80)
 (E/'summary.json').write_text(json.dumps({'error':error,'cleanup_exit':p.returncode,'scope':'Four local processes, one shared host; no geographical failure or capacity claim. No process outage experiment performed.'},indent=2)+'\n')
print(json.dumps({'evidence':str(E),'error':error}))
raise SystemExit(1 if error else 0)
