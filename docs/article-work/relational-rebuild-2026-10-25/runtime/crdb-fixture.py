"""Owned single-node, network-none CockroachDB fixtures for SQL/schema observations."""
from pathlib import Path
import csv
import io
import json
import re
import subprocess
import sys
import time

mode, role = sys.argv[1:3]
assert mode in ['create', 'stop'] and re.fullmatch('crdb-[a-z][a-z0-9-]{0,25}', role)
runtime = Path(__file__).resolve().parent
record = runtime / (role + '-fixture.json')
cli = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
image = json.loads((runtime / 'crdb-image.json').read_text())['pinned_image']
name = 'staycurrent-relational-rebuild-' + role + '-20261025'
db = 'sc_' + role.replace('-', '_')
user = db + '_writer'

def run(args, **kwargs):
    return subprocess.run(cli + args, text=True, capture_output=True, timeout=30, **kwargs)

def owned(cid):
    info = json.loads(run(['inspect', cid]).stdout)[0]
    assert info['Name'] == '/' + name
    assert info['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert info['Config']['Labels']['dev.staycurrent.article'] == role
    assert info['Config']['Image'] == image
    assert info['HostConfig']['NetworkMode'] == 'none' and not info['HostConfig'].get('PortBindings')
    return info

def sql(cid, statement, database='defaultdb', principal='root'):
    return run(['exec', '-i', cid, 'env', '-i', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', '/cockroach/cockroach', 'sql', '--insecure', '--host=127.0.0.1:26257', '--database=' + database, '--user=' + principal, '--format=csv', '--set=errexit=true', '--execute=' + statement])

def stop(cid):
    owned(cid)
    result = run(['stop', '--time=15', cid])
    assert result.returncode == 0, result.stderr
    for _ in range(40):
        if run(['inspect', cid]).returncode != 0:
            return
        time.sleep(.1)
    raise RuntimeError('Owned fixture was not removed')

if mode == 'stop':
    saved = json.loads(record.read_text())
    stop(saved['container_id'])
    saved['stopped_and_removed'] = True
    record.write_text(json.dumps(saved, indent=2) + '\n')
    print('Stopped/removed owned single-node fixture:', role)
    raise SystemExit()

assert run(['inspect', name]).returncode != 0, 'Fixture already exists; inspect its record before reuse.'
result = run(['run', '--rm', '-d', '--name', name, '--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25', '--label', 'dev.staycurrent.article=' + role, '--label', 'dev.staycurrent.engine=cockroachdb', '--network', 'none', '--memory', '1536m', '--cpus', '2', image, 'start-single-node', '--insecure', '--listen-addr=127.0.0.1:26257', '--advertise-addr=127.0.0.1:26257', '--http-addr=127.0.0.1:8080', '--store=path=/cockroach/cockroach-data,size=1GiB', '--cache=64MiB', '--max-sql-memory=64MiB', '--max-tsdb-memory=16MiB', '--max-disk-temp-storage=128MiB'])
assert result.returncode == 0, result.stderr
cid = result.stdout.strip()
try:
    owned(cid)
    for _ in range(80):
        ready = sql(cid, 'SELECT 1;')
        if ready.returncode == 0:
            break
        time.sleep(.25)
    else:
        raise RuntimeError('Owned single-node SQL readiness failed: ' + ready.stderr[-1500:])
    result = sql(cid, f'CREATE USER {user}; GRANT admin TO {user}; CREATE DATABASE {db}; GRANT ALL ON DATABASE {db} TO {user};')
    assert result.returncode == 0, result.stderr
    result = sql(cid, 'SET allow_unsafe_internals=true; SELECT version() AS version, crdb_internal.cluster_id()::STRING AS cluster_id, current_database() AS database, current_user AS principal;', db, user)
    assert result.returncode == 0, result.stderr
    lines = result.stdout.splitlines()
    header = lines.index('version,cluster_id,database,principal')
    rows = list(csv.DictReader(io.StringIO('\n'.join(lines[header:]))))
    assert len(rows) == 1 and rows[0]['database'] == db and rows[0]['principal'] == user
    assert 'v26.2.8' in rows[0]['version']
    saved = {'container_id': cid, 'name': name, 'article': role, 'pinned_image': image, 'database': db, 'user': user, 'cluster_id': rows[0]['cluster_id'], 'runtime_probe': rows[0], 'network': 'none', 'published_ports': [], 'scope': 'Fresh disposable single-node cluster with replication disabled; isolated loopback-only SQL/HTTP. No credentials or host mounts. SQL/schema/range evidence only, not distributed survival or performance. Fixture-only principal has admin for diagnostic observations.', 'source_docs': ['https://docs.cockroachlabs.com/docs/v26.2/cockroach-start-single-node', 'https://docs.cockroachlabs.com/docs/v26.2/cockroach-sql']}
    record.write_text(json.dumps(saved, indent=2) + '\n')
    print(json.dumps(saved))
except BaseException:
    stop(cid)
    raise
