"""Keep task-owned local previews alive across chat interruptions."""
from pathlib import Path
import json, os, signal, socket, subprocess, sys, time

mode, key = sys.argv[1:3]
assert mode in ['start', 'stop']
repo = Path('/Users/ryannel/Workspace/staycurrent')
profiles = {'main': (repo, 4606), 'references': (repo, 4584)}
ports = {'pg-upgrades': 4704, 'pg-distribution': 4706, 'pg-text': 4708, 'pg-vector': 4710, 'pg-extensions': 4712, 'crdb-locality': 4714, 'crdb-operations': 4716, 'crdb-backup': 4718, 'crdb-schema-change': 4720, 'crdb-upgrades': 4722, 'crdb-migration': 4724}
profiles.update({k: (Path('/private/tmp/staycurrent-relational-rebuild-' + k + '-writer-20261025'), p) for k, p in ports.items()})
assert key in profiles
cwd, port = profiles[key]; assert cwd.is_dir()
base = Path('/private/tmp/staycurrent-rebuild-preview-servers-20261025'); base.mkdir(exist_ok=True); base.chmod(0o700)
record = base / (key + '.json')
command = ['/opt/homebrew/bin/node', str(repo / 'node_modules/astro/astro.js'), 'dev', '--host', '127.0.0.1', '--port', str(port)]

def listening():
    with socket.socket() as s:
        s.settimeout(.3)
        return s.connect_ex(('127.0.0.1', port)) == 0

def owned(r):
    assert r['command'] == command and r['cwd'] == str(cwd) and r['port'] == port
    p = subprocess.run(['ps', '-p', str(r['pid']), '-o', 'command='], capture_output=True, text=True)
    assert p.returncode == 0 and str(repo / 'node_modules/astro/astro.js') in p.stdout and '--port ' + str(port) in p.stdout
    p = subprocess.run(['lsof', '-a', '-p', str(r['pid']), '-d', 'cwd', '-Fn'], capture_output=True, text=True)
    assert p.returncode == 0 and 'n' + str(cwd.resolve()) in p.stdout
    assert os.getpgid(r['pid']) == r['pid']

if mode == 'stop':
    r = json.loads(record.read_text()); owned(r); os.killpg(r['pid'], signal.SIGTERM)
    for _ in range(30):
        if not listening(): break
        time.sleep(.1)
    assert not listening(); r['stopped'] = True; record.write_text(json.dumps(r, indent=2) + '\n'); print('Stopped owned preview:', key)
elif listening():
    assert record.exists(), 'An untracked process owns the requested port; inspect without replacing it'
    r = json.loads(record.read_text()); owned(r); print('Owned preview already running:', key, port)
else:
    env = os.environ.copy(); env['ASTRO_TELEMETRY_DISABLED'] = '1'
    if key == 'main': env.update(RELATIONAL_REBUILD_PREVIEW='1', STAYCURRENT_REFERENCE_PREVIEW='1')
    elif key == 'references': env.update(STAYCURRENT_REFERENCE_PREVIEW='1')
    else: env.update(ARTICLE_DRAFT_PREVIEW='1')
    log = base / (key + '.log')
    with log.open('ab') as output:
        p = subprocess.Popen(command, cwd=cwd, env=env, stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.STDOUT, start_new_session=True)
    r = {'key': key, 'pid': p.pid, 'cwd': str(cwd), 'port': port, 'command': command, 'log': str(log), 'lifecycle': 'Task-owned persistent local preview; stop only after exact process/cwd/port identity checks'}
    record.write_text(json.dumps(r, indent=2) + '\n')
    for _ in range(50):
        assert p.poll() is None, log.read_text()[-2000:]
        if listening(): break
        time.sleep(.1)
    assert listening(), log.read_text()[-2000:]
    owned(r); print('Started owned preview:', key, port, 'pid', p.pid)
