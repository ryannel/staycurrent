"""Own a bounded local CockroachDB topology; labels never imply real geography."""
from pathlib import Path
import csv, io, json, re, subprocess, sys, time, tempfile, hashlib, shutil

mode, role = sys.argv[1:3]
count = int(sys.argv[3]) if len(sys.argv) > 3 else 3
assert mode in ['create', 'stop'] and role == 'crdb-upgrades' and count == 3
R = Path(__file__).resolve().parent; record = R / (role + '-fixture.json')
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
image = json.loads((R / 'crdb-upgrade-source-image.json').read_text())['pinned_image']
target_image = json.loads((R / 'crdb-image.json').read_text())['pinned_image']
name = 'staycurrent-relational-rebuild-' + role + '-20261025'
base = '/tmp/sc-' + role + '-20261025'; db = 'sc_' + role.replace('-', '_'); user = db + '_writer'
marker = 'staycurrent-' + role + '-20261025'

def docker(args, timeout=45):
    return subprocess.run(D + args, capture_output=True, text=True, timeout=timeout)

def owned(cid):
    p = docker(['inspect', cid]); assert p.returncode == 0, p.stderr
    i = json.loads(p.stdout)[0]
    assert i['Name'] == '/' + name and i['Config']['Image'] == image
    assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert i['Config']['Labels']['dev.staycurrent.article'] == role
    assert i['HostConfig']['NetworkMode'] == 'none' and not i['HostConfig'].get('PortBindings')

def execute(cid, args, timeout=45):
    owned(cid)
    p = docker(['exec', cid, 'env', '-i', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'GOMEMLIMIT=384MiB'] + args, timeout)
    assert p.returncode == 0, (args, p.stdout[-1500:], p.stderr[-2500:])
    return p.stdout

def sql(cid, port, query, database='defaultdb', principal='root'):
    return execute(cid, ['/cockroach/cockroach', 'sql', '--insecure', '--host=127.0.0.1:' + str(port), '--database=' + database, '--user=' + principal, '--format=csv', '--set=errexit=true', '--execute=' + query])

if mode == 'stop':
    f = json.loads(record.read_text()); cid = f['container_id']; owned(cid)
    p = docker(['stop', '--time=15', cid]); assert p.returncode == 0, p.stderr
    p = docker(['rm', '--volumes', cid]); assert p.returncode == 0, p.stderr
    f['stopped_and_removed'] = True; record.write_text(json.dumps(f, indent=2) + '\n')
    print('Owned local CockroachDB topology removed:', role); raise SystemExit()

assert docker(['inspect', name]).returncode != 0
memory = '4608m' if count == 9 else '2048m'
p = docker(['run', '-d', '--name', name, '--network', 'none', '--memory', memory, '--cpus', '4', '--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25', '--label', 'dev.staycurrent.article=' + role, '--label', 'dev.staycurrent.engine=cockroachdb', '--entrypoint', '/usr/bin/bash', image, '-c', 'exec sleep infinity'])
assert p.returncode == 0, p.stderr
cid = p.stdout.strip(); nodes = []
try:
    execute(cid, ['mkdir', '-p', base + '/results'])
    # Copy the pinned target binary through a task-owned temporary directory;
    # no host mount, credential material or installed host runtime is involved.
    source_name = name + '-target-binary'
    assert docker(['inspect', source_name]).returncode != 0
    source = docker(['create', '--name', source_name, '--network', 'none',
                     '--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25',
                     '--label', 'dev.staycurrent.article=' + role,
                     target_image, 'version'])
    assert source.returncode == 0, source.stderr
    source_id = source.stdout.strip()
    folder = tempfile.mkdtemp(prefix='staycurrent-upgrade-binary-', dir='/private/tmp')
    binary = Path(folder) / 'cockroach-new'
    try:
        info = json.loads(docker(['inspect', source_id]).stdout)[0]
        assert info['Id'] == source_id and info['Name'] == '/' + source_name
        assert info['Config']['Image'] == target_image
        assert info['Config']['Labels']['dev.staycurrent.article'] == role
        assert info['HostConfig']['NetworkMode'] == 'none'
        copied = docker(['cp', source_id + ':/cockroach/cockroach', str(binary)], 60)
        assert copied.returncode == 0, copied.stderr
        binary_hash = hashlib.sha256(binary.read_bytes()).hexdigest()
        owned(cid)
        copied = docker(['cp', str(binary), cid + ':' + base + '/cockroach-new'], 60)
        assert copied.returncode == 0, copied.stderr
        execute(cid, ['chmod', '755', base + '/cockroach-new'])
        target_version = execute(cid, [base + '/cockroach-new', 'version'])
        assert 'v26.2.8' in target_version
    finally:
        info = json.loads(docker(['inspect', source_id]).stdout)[0]
        assert info['Id'] == source_id and info['Config']['Image'] == target_image
        assert info['Config']['Labels']['dev.staycurrent.article'] == role
        assert docker(['rm', '--volumes', source_id]).returncode == 0
        shutil.rmtree(folder)

    join = ','.join('127.0.0.1:' + str(26257 + i) for i in range(count))
    for i in range(count):
        region = ['North', 'West', 'East'][i // 3 if count == 9 else i]
        zone = region + '-' + str(i % 3 + 1 if count == 9 else 1)
        port = 26257 + i; store = base + '/node-' + str(i + 1); pidfile = base + '/node-' + str(i + 1) + '.pid'
        command = ['/cockroach/cockroach', 'start', '--insecure', '--background', '--pid-file=' + pidfile, '--listen-addr=127.0.0.1:' + str(port), '--advertise-addr=127.0.0.1:' + str(port), '--http-addr=127.0.0.1:' + str(8080 + i), '--join=' + join, '--locality=region=' + region + ',zone=' + zone, '--store=path=' + store + ',size=1GiB', '--cache=32MiB', '--max-sql-memory=64MiB', '--max-tsdb-memory=16MiB', '--max-disk-temp-storage=128MiB']
        execute(cid, command)
        nodes.append({'label': 'node-' + str(i + 1), 'region': region, 'zone': zone, 'port': port, 'store': store, 'pid_file': pidfile, 'start_command': command})
        print('Started owned local process', i + 1, region, zone, flush=True)
    execute(cid, ['/cockroach/cockroach', 'init', '--insecure', '--host=127.0.0.1:26257'])
    identities = []
    for node in nodes:
        last = None
        for attempt in range(60):
            try:
                output = sql(cid, node['port'], "SET allow_unsafe_internals=true; SELECT json_build_object('version',version(),'cluster_id',crdb_internal.cluster_id(),'database',current_database(),'user',current_user())")
                rows = list(csv.reader(io.StringIO(output))); identity = json.loads(rows[-1][0]); assert 'v26.1.8' in identity['version']
                identities.append(identity); node['identity'] = identity; break
            except (AssertionError, ValueError, subprocess.TimeoutExpired) as error:
                last = str(error); time.sleep(.2)
        else: raise RuntimeError('Owned node not ready: ' + str(last))
    cluster = identities[0]['cluster_id']; assert all(x['cluster_id'] == cluster for x in identities)
    sql(cid, 26257, "CREATE DATABASE " + db + "; CREATE USER " + user + "; GRANT admin TO " + user + "; CREATE TABLE " + db + ".public.fixture_guard(marker STRING PRIMARY KEY); INSERT INTO " + db + ".public.fixture_guard VALUES ('" + marker + "');")
    regions = sql(cid, 26257, 'SHOW REGIONS FROM CLUSTER', db, user)
    sql(cid, 26257, "SET CLUSTER SETTING cluster.preserve_downgrade_option='26.1'", db, user)
    preserve = sql(cid, 26257, "SHOW CLUSTER SETTING version; SHOW CLUSTER SETTING cluster.preserve_downgrade_option;", db, user)
    f = {'container_id': cid, 'name': name, 'article': role, 'pinned_image': image, 'root': base, 'database': db, 'user': user, 'cluster_id': cluster, 'marker': marker, 'nodes': nodes, 'observed_regions_csv': regions, 'limits': {'container_memory': memory, 'cpus': 4, 'node_sql_memory': '64MiB', 'node_cache': '32MiB', 'node_go_soft_limit': '384MiB', 'node_store': '1GiB'}, 'transport': 'network-none; all SQL/KV/HTTP on owned container loopback; no published ports or host mounts', 'scope': 'Nine or three local processes with declared region/zone labels on one shared host/container. May establish SQL/configuration/placement and simulated process loss, never real regional latency, independent failure domains, production capacity or whole-application recovery.'}
    f.update(target_pinned_image=target_image, new_binary=base+'/cockroach-new', new_binary_sha256=binary_hash, target_version=target_version, preserve_downgrade_probe=preserve, scope='Three local processes on one shared host, initially26.1.8 with26.2.8 target binary supplied. SQL/binary/cluster-version transitions only; no independent failure domains or production capacity.')
    record.write_text(json.dumps(f, indent=2) + '\n'); print(json.dumps({'container_id': cid, 'nodes': count, 'cluster_id': cluster, 'regions': regions, 'record': str(record)}), flush=True)
except BaseException:
    owned(cid); logs = docker(['logs', '--tail=100', cid]); (R / (role + '-provision-failure.txt')).write_text(logs.stdout + logs.stderr)
    docker(['stop', '--time=10', cid]); docker(['rm', '--volumes', cid]); raise
