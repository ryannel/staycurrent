"""Own a network-isolated two-major PostgreSQL rehearsal runtime; no user data."""
from pathlib import Path
import json, subprocess, sys

R = Path(__file__).resolve().parent
RECORD = R / 'pg-upgrades-fixture.json'
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
I17 = 'postgres@sha256:b8faeff7712663c2773a190181e1246e37e364b887611c04658c28b44e2408fe'
I18 = 'postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
NAME = 'staycurrent-relational-rebuild-pg-upgrades-20261025'
EXPORT = NAME + '-binary-export'
BASE = Path('/private/tmp/staycurrent-rebuild-pg-upgrades-native-20261025')

def docker(args, **kwargs):
    return subprocess.run(D + args, text=True, capture_output=True, timeout=60, **kwargs)

def owned(cid, name=NAME, image=I18):
    p = docker(['inspect', cid]); assert p.returncode == 0, p.stderr
    i = json.loads(p.stdout)[0]
    assert i['Name'] == '/' + name and i['Config']['Image'] == image
    assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert i['Config']['Labels']['dev.staycurrent.article'] == 'pg-upgrades'
    assert i['HostConfig']['NetworkMode'] == 'none' and not i['HostConfig'].get('PortBindings')

def execute(cid, args, user='postgres'):
    owned(cid)
    p = docker(['exec', '--user=' + user, cid, 'env', '-i', 'PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin'] + args)
    assert p.returncode == 0, (args, p.stderr)
    return p.stdout

if sys.argv[1] == 'stop':
    f = json.loads(RECORD.read_text()); cid = f['container_id']; owned(cid)
    p = docker(['stop', '--time=10', cid]); assert p.returncode == 0, p.stderr
    p = docker(['rm', '--volumes', cid]); assert p.returncode == 0, p.stderr
    f['stopped_and_removed'] = True; RECORD.write_text(json.dumps(f, indent=2) + '\n')
    print('Owned two-major upgrade fixture removed'); raise SystemExit()

assert sys.argv[1] == 'create'
assert docker(['inspect', NAME]).returncode != 0
assert docker(['inspect', EXPORT]).returncode != 0
BASE.mkdir(exist_ok=True)
labels = ['--label', 'dev.staycurrent.task=relational-rebuild-2026-10-25', '--label', 'dev.staycurrent.article=pg-upgrades']
cid = export = None
try:
    p = docker(['create', '--name', EXPORT, '--network', 'none'] + labels + [I17, 'sleep', 'infinity'])
    assert p.returncode == 0, p.stderr
    export = p.stdout.strip(); owned(export, EXPORT, I17)
    for source, target in [('/usr/lib/postgresql/17', 'lib17'), ('/usr/share/postgresql/17', 'share17')]:
        assert not (BASE / target).exists()
        p = docker(['cp', export + ':' + source, str(BASE / target)]); assert p.returncode == 0, p.stderr
    p = docker(['run', '-d', '--name', NAME, '--network', 'none', '--memory', '1536m', '--cpus', '2', '--shm-size', '128m'] + labels + [I18, 'sleep', 'infinity'])
    assert p.returncode == 0, p.stderr
    cid = p.stdout.strip(); owned(cid)
    for source, target in [('lib17', '/usr/lib/postgresql/17'), ('share17', '/usr/share/postgresql/17')]:
        p = docker(['cp', str(BASE / source), cid + ':' + target]); assert p.returncode == 0, p.stderr
    execute(cid, ['mkdir', '-p', '/tmp/sc-pg-upgrades-20261025'], 'root')
    execute(cid, ['chown', 'postgres:postgres', '/tmp/sc-pg-upgrades-20261025'], 'root')
    versions = {str(v): execute(cid, ['/usr/lib/postgresql/' + str(v) + '/bin/postgres', '--version']).strip() for v in [17, 18]}
    assert versions['17'].startswith('postgres (PostgreSQL) 17.') and versions['18'].startswith('postgres (PostgreSQL) 18.6')
    for v in [17, 18]:
        missing = execute(cid, ['ldd', '/usr/lib/postgresql/' + str(v) + '/bin/postgres'])
        assert 'not found' not in missing, missing
    f = {'container_id': cid, 'name': NAME, 'image': I18, 'source_binary_image': I17, 'versions': versions, 'root': '/tmp/sc-pg-upgrades-20261025', 'transport': 'network-none, separate Unix sockets; no host mounts or published ports', 'scope': 'Owned single-container major-version and logical SQL mechanisms; no independent storage, distributed failure, production duration or production privilege claim.'}
    RECORD.write_text(json.dumps(f, indent=2) + '\n'); print(json.dumps(f))
except BaseException:
    if cid:
        owned(cid); docker(['stop', '--time=5', cid]); docker(['rm', '--volumes', cid])
    raise
finally:
    if export:
        owned(export, EXPORT, I17); docker(['rm', '--volumes', export])
