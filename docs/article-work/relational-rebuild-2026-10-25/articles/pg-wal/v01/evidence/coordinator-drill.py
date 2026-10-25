"""Coordinator lifecycle for the separately inspected SQL-only WAL verifier."""
from pathlib import Path
import datetime
import hashlib
import json
import os
import selectors
import shutil
import subprocess
import time

runtime = Path(__file__).resolve().parent
evidence = Path('/private/tmp/staycurrent-relational-rebuild-pg-wal-writer-20261025/evidence')
script = evidence / 'native-drill.py'
guards = evidence / 'fixture-guards.json'
f = json.loads(guards.read_text())
saved = json.loads((runtime / 'pg-wal-fixture.json').read_text())
assert f['container_id'] == saved['container_id'] and f['name'] == 'staycurrent-relational-rebuild-pg-wal-20261025'
assert f['database'] == 'sc_pg_wal' and f['user'] == 'sc_pg_wal_writer'
cli = [f['docker'], '--config', f['config'], '--host', f['host']]
cid = f['container_id']
command = ['python3', str(script), str(guards)]
status = {'verifier_sha256_before': hashlib.sha256(script.read_bytes()).hexdigest(), 'guards_sha256_before': hashlib.sha256(guards.read_bytes()).hexdigest(), 'container_id': cid, 'system_identifier': f['system_identifier'], 'phases': {}, 'started_utc': datetime.datetime.now(datetime.timezone.utc).isoformat()}
held = None
hold_out = hold_err = None
start = time.monotonic()

def docker(args, timeout=30):
    return subprocess.run(cli + args, text=True, capture_output=True, timeout=timeout)

def identity():
    info = json.loads(docker(['inspect', cid]).stdout)[0]
    assert info['Id'] == cid and info['Name'] == '/' + f['name']
    assert info['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25' and info['Config']['Labels']['dev.staycurrent.article'] == 'pg-wal'
    assert info['Config']['Image'] == saved['image'] and info['Image'] == f['image_id']
    assert info['HostConfig']['NetworkMode'] == 'none' and not info['HostConfig'].get('PortBindings') and not info['HostConfig']['AutoRemove']
    return info

def phase(mode, marker):
    result = subprocess.run(command + [mode], capture_output=True, text=True, timeout=50)
    (evidence / ('native-' + mode + '.txt')).write_text(result.stdout)
    (evidence / ('native-' + mode + '-stderr.txt')).write_text(result.stderr)
    status['phases'][mode] = {'exit_code': result.returncode, 'marker_present': marker in result.stdout, 'command': command + [mode]}
    assert result.returncode == 0 and marker in result.stdout, result.stderr[-1200:]

def logs(name):
    result = docker(['logs', '--timestamps', cid])
    content = result.stdout + result.stderr
    (evidence / name).write_text(content)
    return content

try:
    assert identity()['State']['Running']
    logs('native-baseline.log')
    phase('setup', 'ACKNOWLEDGED_P7_22')
    hold_out = (evidence / 'native-hold.txt').open('wb')
    hold_err = (evidence / 'native-hold-stderr.txt').open('wb')
    held = subprocess.Popen(command + ['hold'], stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=hold_err)
    os.set_blocking(held.stdout.fileno(), False)
    selector = selectors.DefaultSelector()
    selector.register(held.stdout, selectors.EVENT_READ)
    received = b''
    deadline = time.monotonic() + 20
    while b'UNFINISHED_READY_P9_36_NO_COMMIT' not in received:
        assert time.monotonic() < deadline and held.poll() is None, 'Unfinished writer did not reach its marker'
        for key, _ in selector.select(1):
            chunk = os.read(key.fd, 65536)
            received += chunk
            hold_out.write(chunk)
            hold_out.flush()
    selector.close()
    status['phases']['hold_ready'] = {'marker_present': True, 'command': command + ['hold']}
    phase('flush', 'ACKNOWLEDGED_FLUSH_AFTER_UNFINISHED_UPDATE')
    assert held.poll() is None and identity()['State']['Running']
    stop_command = ['exec', '--user=postgres', cid, 'pg_ctl', '-D', f['data_directory'], 'stop', '-m', 'immediate', '-w', '-t', '15']
    result = docker(stop_command)
    status['phases']['immediate_stop'] = {'exit_code': result.returncode, 'command': cli + stop_command, 'stdout': result.stdout, 'stderr': result.stderr}
    for _ in range(50):
        if not identity()['State']['Running']:
            break
        time.sleep(.1)
    else:
        raise RuntimeError('Owned instance did not stop')
    logs('native-after-stop.log')
    os.set_blocking(held.stdout.fileno(), True)
    remaining, _ = held.communicate(timeout=10)
    hold_out.write(remaining)
    hold_out.flush()
    status['phases']['held_session_at_stop'] = {'exit_code': held.returncode, 'expected': 'Connection interrupted before COMMIT; not a successful SQL completion.'}
    result = docker(['start', cid])
    assert result.returncode == 0, result.stderr
    status['phases']['start'] = {'exit_code': result.returncode, 'command': cli + ['start', cid]}
    for _ in range(60):
        if docker(['exec', cid, 'cat', '/proc/1/comm']).stdout.strip() == 'postgres' and docker(['exec', cid, 'pg_isready', '-h', f['socket'], '-U', f['user'], '-d', f['database']]).returncode == 0:
            break
        time.sleep(.25)
    else:
        raise RuntimeError('Restart readiness failed')
    phase('verify', 'VERIFIED_ACKNOWLEDGED_AND_UNFINISHED_RESULTS')
    recovery = logs('native-recovery.log')
    assert 'redo starts at' in recovery and 'database system was interrupted' in recovery
    status['passed'] = True
except BaseException as error:
    status.update(passed=False, error=str(error))
    try:
        logs('native-failure.log')
    except BaseException:
        pass
finally:
    if held and held.poll() is None:
        held.terminate()
        try:
            held.wait(timeout=5)
        except subprocess.TimeoutExpired:
            held.kill()
            held.wait()
    for stream in [hold_out, hold_err]:
        if stream:
            stream.close()
    cleanup = subprocess.run(['python3', str(runtime / 'native-fixture.py'), 'stop', 'pg-wal'], text=True, capture_output=True, timeout=40)
    status.update(fixture_cleanup_exit_code=cleanup.returncode, elapsed_seconds=round(time.monotonic()-start, 2), verifier_sha256_after=hashlib.sha256(script.read_bytes()).hexdigest(), guards_sha256_after=hashlib.sha256(guards.read_bytes()).hexdigest(), scope='Process immediate-stop/restart with surviving owned container storage, not power-loss, storage-loss or recovery-capacity test.')
    shutil.copy2(runtime / 'pg-wal-fixture.json', evidence / 'native-fixture.json')
    (evidence / 'native-execution.json').write_text(json.dumps(status, indent=2) + '\n')
print(json.dumps(status))
raise SystemExit(0 if status.get('passed') and status['fixture_cleanup_exit_code'] == 0 else 1)
