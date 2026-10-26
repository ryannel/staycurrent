"""Run the inspected upgrade verifier only inside the exact owned disposable fixture."""
from pathlib import Path
import hashlib, json, subprocess, time

R = Path(__file__).resolve().parent
E = Path('/private/tmp/staycurrent-relational-rebuild-pg-upgrades-writer-20261025/evidence')
D = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
f = json.loads((R / 'pg-upgrades-fixture.json').read_text()); cid = f['container_id']
i = json.loads(subprocess.check_output(D + ['inspect', cid]))[0]
assert i['Name'] == '/' + f['name'] and i['Config']['Image'] == f['image']
assert i['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
assert i['Config']['Labels']['dev.staycurrent.article'] == 'pg-upgrades'
assert i['HostConfig']['NetworkMode'] == 'none' and not i['HostConfig'].get('PortBindings')
expected = {'native-verifier.sh': '384e05f18b88d254866e08d694478dff997f2f0b496de80960f7200e51fc8364', 'shop.sql': '6447303eea15a64fa6df14092dbd3f4f78d0aaa194c6b5d299bba456d55cecd7'}
for name, digest in expected.items():
    data = (E / name).read_bytes(); assert hashlib.sha256(data).hexdigest() == digest
    (E / ('executed-' + name)).write_bytes(data)
    subprocess.run(D + ['cp', str(E / ('executed-' + name)), cid + ':' + f['root'] + '/' + name], check=True, capture_output=True, timeout=20)
    subprocess.run(D + ['exec', '--user=root', cid, 'chown', 'postgres:postgres', f['root'] + '/' + name], check=True, capture_output=True, timeout=10)
(E / 'root-fixture.json').write_text(json.dumps(f, indent=2) + '\n')
cmd = D + ['exec', '--user=postgres', cid, 'env', '-i', 'PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin', 'LC_ALL=C', 'bash', f['root'] + '/native-verifier.sh']
started = time.monotonic()
try:
    p = subprocess.run(cmd, capture_output=True, timeout=300)
    (E / 'native-results.txt').write_bytes(p.stdout); (E / 'native-stderr.txt').write_bytes(p.stderr)
    result = {'command': cmd, 'exit_code': p.returncode, 'elapsed_seconds': round(time.monotonic() - started, 2), 'source_sha256_before': expected, 'source_sha256_after': {n: hashlib.sha256((E / n).read_bytes()).hexdigest() for n in expected}, 'scope': f['scope']}
    (E / 'native-execution.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result), p.stdout[-2500:].decode(errors='replace'), p.stderr[-1200:].decode(errors='replace'), flush=True)
finally:
    # Retain text artefacts/generated follow-up instructions, never the database files.
    archive = subprocess.run(D + ['exec', '--user=postgres', cid, 'bash', '-c', "cd /tmp/sc-pg-upgrades-20261025/run && find . -type f \\( -name '*.txt' -o -name '*.log' -o -name '*.sql' -o -name '*.sh' \\) -print0 | tar --null -T - -czf /tmp/sc-pg-upgrades-20261025/artifacts.tar.gz"], capture_output=True, timeout=30)
    (E / 'native-archive-stderr.txt').write_bytes(archive.stderr)
    if archive.returncode == 0:
        subprocess.run(D + ['cp', cid + ':' + f['root'] + '/artifacts.tar.gz', str(E / 'native-artifacts.tar.gz')], check=True, capture_output=True, timeout=20)
    cleanup = subprocess.run(['python3', str(R / 'upgrades-fixture.py'), 'stop'], capture_output=True, timeout=60)
    (E / 'native-cleanup.txt').write_bytes(cleanup.stdout + cleanup.stderr)
    assert cleanup.returncode == 0, cleanup.stderr
assert p.returncode == 0
