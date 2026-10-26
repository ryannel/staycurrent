"""Run an inspected single-file Bash verifier in the exact owned multi-cluster fixture."""
from pathlib import Path
import hashlib, json, re, subprocess, sys, time

role, expected = sys.argv[1:3]
assert re.fullmatch('[a-z][a-z0-9-]{0,31}', role) and re.fullmatch('[a-f0-9]{64}', expected)
R = Path(__file__).resolve().parent
E = Path('/private/tmp/staycurrent-relational-rebuild-' + role + '-writer-20261025/evidence')
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
f = json.loads((R / (role + '-fixture.json')).read_text()); cid = f['container_id']
i = json.loads(subprocess.check_output(D + ['inspect', cid]))[0]
assert i['Name'] == '/' + f['name'] and i['Config']['Image'] == f['image']
assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
assert i['Config']['Labels']['dev.staycurrent.article'] == role
assert i['HostConfig']['NetworkMode'] == 'none' and not i['HostConfig'].get('PortBindings')
source = E / 'native-verifier.sh'; data = source.read_bytes()
assert hashlib.sha256(data).hexdigest() == expected
snapshot = E / 'native-executed-verifier.sh'; assert not snapshot.exists(); snapshot.write_bytes(data)
subprocess.run(D + ['cp', str(snapshot), cid + ':' + f['root'] + '/native-verifier.sh'], check=True, capture_output=True, timeout=20)
subprocess.run(D + ['exec', '--user=root', cid, 'chown', 'postgres:postgres', f['root'] + '/native-verifier.sh'], check=True, capture_output=True, timeout=10)
(E / 'root-fixture.json').write_text(json.dumps(f, indent=2) + '\n')
cmd = D + ['exec', '--user=postgres', cid, 'env', '-i', 'PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin', 'PGCONNECT_TIMEOUT=3', 'LC_ALL=C', 'bash', f['root'] + '/native-verifier.sh']
started = time.monotonic()
try:
    p = subprocess.run(cmd, capture_output=True, timeout=180)
    (E / 'native-stdout.txt').write_bytes(p.stdout); (E / 'native-stderr.txt').write_bytes(p.stderr)
    receipt = {'command': cmd, 'exit_code': p.returncode, 'elapsed_seconds': round(time.monotonic() - started, 2), 'source_sha256_before': expected, 'source_sha256_after': hashlib.sha256(source.read_bytes()).hexdigest(), 'scope': f['scope']}
    (E / 'native-execution.json').write_text(json.dumps(receipt, indent=2) + '\n')
    print(json.dumps(receipt), p.stdout[-3000:].decode(errors='replace'), p.stderr[-1600:].decode(errors='replace'), flush=True)
finally:
    archive = subprocess.run(D + ['exec', '--user=postgres', cid, 'tar', '-C', f['root'] + '/results', '-czf', f['root'] + '/results.tar.gz', '.'], capture_output=True, timeout=30)
    (E / 'native-archive-stderr.txt').write_bytes(archive.stderr)
    if archive.returncode == 0:
        subprocess.run(D + ['cp', cid + ':' + f['root'] + '/results.tar.gz', str(E / 'native-artifacts.tar.gz')], check=True, capture_output=True, timeout=20)
    cleanup = subprocess.run(['python3', str(R / 'multi-fixture.py'), 'stop', role], capture_output=True, timeout=60)
    (E / 'native-cleanup.txt').write_bytes(cleanup.stdout + cleanup.stderr)
    assert cleanup.returncode == 0, cleanup.stderr
assert p.returncode == 0
