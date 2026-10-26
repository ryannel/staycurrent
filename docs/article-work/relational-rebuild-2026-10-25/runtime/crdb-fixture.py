"""Owned single-node CockroachDB SQL fixtures, isolated or host-loopback only."""
from pathlib import Path
import csv
import io
import json
import re
import subprocess
import sys
import time

mode, role = sys.argv[1:3]
transport = sys.argv[3] if len(sys.argv)>3 else 'network-none'
assert transport in ['network-none','localhost-tcp']
assert mode in ['create', 'stop'] and re.fullmatch('crdb-[a-z][a-z0-9-]{0,25}', role)
runtime = Path(__file__).resolve().parent
record = runtime / (role + '-fixture.json')
cli = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
image = json.loads((runtime / 'crdb-image.json').read_text())['pinned_image']
name = 'staycurrent-relational-rebuild-' + role + '-20261025'
sql_memory = '256MiB' if role in ['crdb-performance', 'crdb-schema-change'] else '64MiB'
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
    if transport == 'network-none':
        assert info['HostConfig']['NetworkMode'] == 'none' and not info['HostConfig'].get('PortBindings')
    else:
        assert info['HostConfig']['NetworkMode'] == 'bridge'
        ports=info['HostConfig']['PortBindings']
        assert set(ports)=={'26258/tcp'}
        assert len(ports['26258/tcp'])==1 and ports['26258/tcp'][0]['HostIp']=='127.0.0.1'
    return info

def sql(cid, statement, database='defaultdb', principal='root'):
    return run(['exec', '-i', cid, 'env', '-i', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', '/cockroach/cockroach', 'sql', '--insecure', '--host=127.0.0.1:'+str(26257 if transport=='network-none' else 26258), '--database=' + database, '--user=' + principal, '--format=csv', '--set=errexit=true', '--execute=' + statement])

def stop(cid):
    owned(cid)
    result = run(['stop', '--time=15', cid])
    assert result.returncode == 0, result.stderr
    if transport=='localhost-tcp':
        result=run(['rm','--volumes',cid]); assert result.returncode==0,result.stderr
    for _ in range(40):
        if run(['inspect', cid]).returncode != 0:
            return
        time.sleep(.1)
    raise RuntimeError('Owned fixture was not removed')

if mode == 'stop':
    saved = json.loads(record.read_text())
    transport = saved.get('transport','network-none')
    stop(saved['container_id'])
    saved['stopped_and_removed'] = True
    record.write_text(json.dumps(saved, indent=2) + '\n')
    print('Stopped/removed owned single-node fixture:', role)
    raise SystemExit()

assert run(['inspect', name]).returncode != 0, 'Fixture already exists; inspect its record before reuse.'
network = ['--network','none'] if transport=='network-none' else ['--network','bridge','--publish','127.0.0.1::26258']
listen = '127.0.0.1:26257'
sql_port = 26257 if transport=='network-none' else 26258
sql_binding=[] if transport=='network-none' else ['--sql-addr=0.0.0.0:26258']
removal=['--rm'] if transport=='network-none' else []
result = run(['run']+removal+['-d', '--name', name, '--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25', '--label', 'dev.staycurrent.article=' + role, '--label', 'dev.staycurrent.engine=cockroachdb']+network+['--memory', '1536m', '--cpus', '2', image, 'start-single-node', '--insecure', '--listen-addr='+listen, '--advertise-addr='+listen]+sql_binding+['--http-addr=127.0.0.1:8080', '--store=path=/cockroach/cockroach-data,size=1GiB', '--cache=64MiB', '--max-sql-memory='+sql_memory, '--max-tsdb-memory=16MiB', '--max-disk-temp-storage=128MiB'])
assert result.returncode == 0, result.stderr
cid = result.stdout.strip()
try:
    owned(cid)
    for _ in range(80):
        ready = sql(cid, 'SELECT 1;')
        if ready.returncode == 0:
            break
        state=owned(cid)['State']
        if not state['Running']:
            raise RuntimeError('Fixture exited: '+run(['logs','--tail=50',cid]).stdout+run(['logs','--tail=50',cid]).stderr)
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
    saved['transport']=transport
    saved['limits']={'container_memory':'1536MiB','cpus':2,'sql_memory':sql_memory,'cache':'64MiB','store':'1GiB','disk_temp':'128MiB'}
    if transport=='localhost-tcp':
        binding=owned(cid)['NetworkSettings']['Ports']['26258/tcp'][0]
        saved['published_ports']=[binding]
        saved['connection']={'host':'127.0.0.1','port':int(binding['HostPort']),'database':db,'user':user,'password':'','ssl':False,'application_name':name,'options':''}
        saved['network']='bridge; only SQL is published on host loopback'
        saved['scope']='Disposable single-node native SQL fixture, no credentials or host mounts. Host loopback SQL only. No distributed survival or regional timing evidence.'
    record.write_text(json.dumps(saved, indent=2) + '\n')
    print(json.dumps(saved))
except BaseException:
    logs=run(['logs','--tail=100',cid])
    (runtime/(role+'-startup-failure.txt')).write_text(logs.stdout+logs.stderr)
    stop(cid)
    raise
