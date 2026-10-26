"""Disposable four-process TLS fixture; certificates never leave its container."""
from pathlib import Path
import csv
import io
import json
import subprocess
import sys
import time

MODE = sys.argv[1]
assert MODE in ('create', 'stop')
R = Path(__file__).resolve().parent
ROLE = 'crdb-operations'
NAME = 'staycurrent-relational-rebuild-' + ROLE + '-20261025'
BASE = '/tmp/sc-' + ROLE + '-20261025'
CERTS = BASE + '/certs'
DB = 'sc_crdb_operations'
MARKER = 'staycurrent-crdb-operations-20261025'
RECORD = R / (ROLE + '-fixture.json')
IMAGE = json.loads((R / 'crdb-image.json').read_text())['pinned_image']
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config',
     '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']


def docker(args, timeout=50):
    return subprocess.run(D + args, capture_output=True, text=True, timeout=timeout)


def owned(cid):
    p = docker(['inspect', cid])
    assert p.returncode == 0, p.stderr
    i = json.loads(p.stdout)[0]
    assert i['Id'] == cid and i['Name'] == '/' + NAME
    assert i['Config']['Image'] == IMAGE
    assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert i['Config']['Labels']['dev.staycurrent.article'] == ROLE
    assert i['HostConfig']['NetworkMode'] == 'none'
    assert not i['HostConfig'].get('PortBindings') and not i.get('Mounts')
    return i


def execute(cid, args, timeout=50):
    owned(cid)
    p = docker(['exec', cid, 'env', '-i',
                'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                'GOMEMLIMIT=384MiB'] + args, timeout)
    assert p.returncode == 0, (args, p.stdout[-1800:], p.stderr[-2500:])
    return p.stdout


def sql(cid, port, query, db='defaultdb', user='root'):
    return execute(cid, ['/cockroach/cockroach', 'sql', '--certs-dir=' + CERTS,
                         '--host=localhost:' + str(port), '--database=' + db,
                         '--user=' + user, '--format=csv', '--set=errexit=true',
                         '--execute=' + query])


def stop(cid):
    owned(cid)
    p = docker(['stop', '--time=15', cid])
    assert p.returncode == 0, p.stderr
    p = docker(['rm', '--volumes', cid])
    assert p.returncode == 0, p.stderr


if MODE == 'stop':
    saved = json.loads(RECORD.read_text())
    stop(saved['container_id'])
    saved['stopped_and_removed'] = True
    RECORD.write_text(json.dumps(saved, indent=2) + '\n')
    print('Removed exact owned secure fixture')
    raise SystemExit()

assert docker(['inspect', NAME]).returncode != 0, 'Owned name exists; inspect before reuse'
p = docker(['run', '-d', '--name', NAME, '--network', 'none', '--memory', '3072m',
            '--cpus', '4', '--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25',
            '--label', 'dev.staycurrent.article=' + ROLE,
            '--label', 'dev.staycurrent.engine=cockroachdb',
            '--entrypoint', '/usr/bin/bash', IMAGE, '-c', 'exec sleep infinity'])
assert p.returncode == 0, p.stderr
cid = p.stdout.strip()
nodes = []
try:
    execute(cid, ['mkdir', '-p', CERTS, BASE + '/results', BASE + '/ca'])
    execute(cid, ['/cockroach/cockroach', 'cert', 'create-ca', '--certs-dir=' + CERTS,
                  '--ca-key=' + BASE + '/ca/ca.key'])
    execute(cid, ['/cockroach/cockroach', 'cert', 'create-node', 'localhost', '127.0.0.1',
                  '--certs-dir=' + CERTS, '--ca-key=' + BASE + '/ca/ca.key'])
    for user in ['root', 'shop_runtime', 'shop_migrate', 'shop_support']:
        execute(cid, ['/cockroach/cockroach', 'cert', 'create-client', user,
                      '--certs-dir=' + CERTS, '--ca-key=' + BASE + '/ca/ca.key'])
    join = ','.join('127.0.0.1:' + str(26257 + n) for n in range(4))
    for n in range(4):
        port = 26257 + n
        command = ['/cockroach/cockroach', 'start', '--background', '--certs-dir=' + CERTS,
                   '--pid-file=' + BASE + f'/node-{n + 1}.pid',
                   '--listen-addr=0.0.0.0:' + str(port),
                   '--advertise-addr=127.0.0.1:' + str(port),
                   '--http-addr=127.0.0.1:' + str(8080 + n), '--join=' + join,
                   '--locality=zone=local-' + str(n + 1),
                   '--store=path=' + BASE + f'/node-{n + 1},size=1GiB',
                   '--cache=32MiB', '--max-sql-memory=64MiB', '--max-tsdb-memory=16MiB',
                   '--max-disk-temp-storage=128MiB']
        execute(cid, command)
        nodes.append({'label': 'node-' + str(n + 1), 'port': port,
                      'pid_file': BASE + f'/node-{n + 1}.pid', 'start_command': command})
        print('Started secure local process', n + 1, flush=True)
    execute(cid, ['/cockroach/cockroach', 'init', '--certs-dir=' + CERTS,
                  '--host=localhost:26257'])
    identities = []
    for node in nodes:
        for attempt in range(30):
            try:
                output = sql(cid, node['port'], "SET allow_unsafe_internals=true; "
                             "SELECT json_build_object('version',version(),"
                             "'cluster_id',crdb_internal.cluster_id(),'database',current_database(),"
                             "'user',current_user());")
                rows = list(csv.reader(io.StringIO(output)))
                identity = json.loads(rows[-1][0])
                assert 'v26.2.8' in identity['version']
                identities.append(identity)
                node['identity'] = identity
                break
            except (AssertionError, ValueError, subprocess.TimeoutExpired):
                time.sleep(.3)
        else:
            raise RuntimeError('Secure readiness bound reached')
    cluster = identities[0]['cluster_id']
    assert all(i['cluster_id'] == cluster for i in identities)
    sql(cid, 26257, 'CREATE DATABASE ' + DB + '; CREATE TABLE ' + DB +
        ".public.fixture_guard(marker STRING PRIMARY KEY); INSERT INTO " + DB +
        ".public.fixture_guard VALUES ('" + MARKER + "'); "
        'CREATE USER shop_runtime; CREATE USER shop_migrate; CREATE USER shop_support;')
    saved = {'container_id': cid, 'name': NAME, 'article': ROLE, 'pinned_image': IMAGE,
             'database': DB, 'user': 'root', 'cluster_id': cluster, 'marker': MARKER,
             'nodes': nodes, 'root': BASE, 'certs_dir': CERTS,
             'client_users': ['root', 'shop_runtime', 'shop_migrate', 'shop_support'],
             'transport': 'TLS full verification; network-none, no host ports/mounts',
             'certificate_sans': ['localhost', '127.0.0.1'],
             'scope': 'Four local TLS processes in one container/shared host; native SQL/security/membership only, no independent failure domains or production capacity.',
             'limits': {'memory': '3072MiB', 'cpus': 4, 'node_sql': '64MiB',
                        'node_cache': '32MiB', 'node_go_soft_limit': '384MiB'}}
    RECORD.write_text(json.dumps(saved, indent=2) + '\n')
    print(json.dumps({'record': str(RECORD), 'cluster_id': cluster, 'container_id': cid}), flush=True)
except BaseException:
    owned(cid)
    logs = docker(['logs', '--tail=100', cid])
    (R / (ROLE + '-provision-failure.txt')).write_text(logs.stdout + logs.stderr)
    stop(cid)
    raise
