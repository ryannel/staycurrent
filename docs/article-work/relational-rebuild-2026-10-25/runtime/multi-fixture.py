"""Own an empty network-none PostgreSQL runtime for bounded multi-cluster drills."""
from pathlib import Path
import json, re, subprocess, sys

mode, role = sys.argv[1:3]
assert mode in ['create', 'stop'] and re.fullmatch('[a-z][a-z0-9-]{0,31}', role)
R = Path(__file__).resolve().parent; record = R / (role + '-fixture.json')
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
I = 'postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
name = 'staycurrent-relational-rebuild-' + role + '-20261025'
base = '/tmp/sc-' + role + '-20261025'

def docker(args):
    return subprocess.run(D + args, text=True, capture_output=True, timeout=45)

def owned(cid):
    p = docker(['inspect', cid]); assert p.returncode == 0, p.stderr
    i = json.loads(p.stdout)[0]
    assert i['Name'] == '/' + name and i['Config']['Image'] == I
    assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert i['Config']['Labels']['dev.staycurrent.article'] == role
    assert i['HostConfig']['NetworkMode'] == 'none' and not i['HostConfig'].get('PortBindings')

if mode == 'stop':
    f = json.loads(record.read_text()); cid = f['container_id']; owned(cid)
    p = docker(['stop', '--time=10', cid]); assert p.returncode == 0, p.stderr
    p = docker(['rm', '--volumes', cid]); assert p.returncode == 0, p.stderr
    f['stopped_and_removed'] = True; record.write_text(json.dumps(f, indent=2) + '\n')
    print('Owned multi-cluster fixture removed:', role)
else:
    assert docker(['inspect', name]).returncode != 0
    p = docker(['run', '-d', '--name', name, '--network', 'none', '--memory', '1536m', '--cpus', '2', '--shm-size', '128m', '--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25', '--label', 'dev.staycurrent.article=' + role, I, 'sleep', 'infinity'])
    assert p.returncode == 0, p.stderr
    cid = p.stdout.strip()
    try:
        owned(cid)
        for args in [['mkdir', '-p', base], ['chown', 'postgres:postgres', base]]:
            p = docker(['exec', '--user=root', cid] + args); assert p.returncode == 0, p.stderr
        p = docker(['exec', '--user=postgres', cid, '/usr/lib/postgresql/18/bin/postgres', '--version'])
        assert p.returncode == 0 and p.stdout.startswith('postgres (PostgreSQL) 18.6')
        f = {'container_id': cid, 'name': name, 'image': I, 'article': role, 'root': base, 'version': p.stdout.strip(), 'transport': 'network-none; separate Unix sockets; no host mounts or published ports', 'scope': 'Owned single-container SQL/transaction mechanisms, not independent storage, production fencing, workload capacity or host-failure survival.'}
        record.write_text(json.dumps(f, indent=2) + '\n'); print(json.dumps(f))
    except BaseException:
        owned(cid); docker(['stop', '--time=5', cid]); docker(['rm', '--volumes', cid]); raise
