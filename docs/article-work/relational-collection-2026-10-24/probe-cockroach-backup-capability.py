"""Probe backup availability on one owned local node; not an article recovery drill."""
from pathlib import Path
import datetime
import hashlib
import json
import os
import shutil
import socket
import subprocess
import tempfile
import time

binary = Path('/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach')
owned = Path(tempfile.mkdtemp(prefix='sc-cr-cap-', dir='/private/tmp'))
env = {k: v for k, v in os.environ.items() if not k.startswith('PG') and k not in ('DATABASE_URL', 'DB_URL')}
with socket.socket() as reservation:
    reservation.bind(('127.0.0.1', 0))
    port = reservation.getsockname()[1]
record = {'started_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'scope': 'Backup capability on an empty owned single-node installation; not recovery acceptance or production licensing advice',
          'binary_sha256': hashlib.sha256(binary.read_bytes()).hexdigest(), 'commands': []}

def sql(query, check=True):
    command = [str(binary), 'sql', '--insecure', f'--host=127.0.0.1:{port}', '--format=csv', '--execute', query]
    result = subprocess.run(command, env=env, capture_output=True, text=True, timeout=30)
    record['commands'].append({'argv': command, 'exit_code': result.returncode,
                               'stdout': result.stdout, 'stderr': result.stderr})
    if check and result.returncode:
        raise RuntimeError(result.stderr)
    return result

command = [str(binary), 'start-single-node', '--insecure', f'--listen-addr=127.0.0.1:{port}',
           '--http-addr=127.0.0.1:0', f'--store={owned}/store', '--cache=128MiB', '--max-sql-memory=128MiB']
record['server_argv'] = command
log = (owned / 'server.log').open('w')
process = subprocess.Popen(command, env=env, stdout=log, stderr=subprocess.STDOUT)
try:
    for attempt in range(60):
        if process.poll() is not None:
            raise RuntimeError('Owned server exited during startup')
        ready = sql('SELECT version(), crdb_internal.node_id()', check=False)
        if ready.returncode == 0:
            break
        time.sleep(.25)
    else:
        raise RuntimeError('Owned server did not become ready')
    listener = subprocess.run(['/usr/sbin/lsof', '-nP', '-a', '-p', str(process.pid),
                               '-iTCP:' + str(port), '-sTCP:LISTEN', '-Fp'],
                              capture_output=True, text=True, check=True)
    assert f'p{process.pid}' in listener.stdout.splitlines(), listener.stdout
    record['listener_identity'] = {'argv_pid': process.pid, 'endpoint_port': port,
                                   'lsof_output': listener.stdout, 'verified_before_mutation': True}
    record['ownership'] = {'pid': process.pid, 'live_child': process.poll() is None,
                           'owned_store': str(owned / 'store'), 'fixed_loopback_endpoint': f'127.0.0.1:{port}',
                           'verified_before_mutation': True}
    sql('SET CLUSTER SETTING diagnostics.reporting.enabled = false')
    sql('CREATE DATABASE capability_probe')
    sql('CREATE TABLE capability_probe.public.sample (id INT PRIMARY KEY, value STRING)')
    sql("INSERT INTO capability_probe.public.sample VALUES (1, 'artificial capability row')")
    result = sql("BACKUP DATABASE capability_probe INTO 'nodelocal://1/base'", check=False)
    record['backup_command_succeeded'] = result.returncode == 0
finally:
    if process.poll() is None:
        process.terminate()
        try:
            process.wait(timeout=15)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=10)
    log.close()
    record['server_log'] = (owned / 'server.log').read_text()
    record['owned_process_stopped'] = process.poll() is not None
    if record['owned_process_stopped']:
        shutil.rmtree(owned)
    record['owned_directory_removed'] = not owned.exists()
    record['finished_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    record['verifier_sha256'] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    Path(__file__).with_name('native-cockroach-backup-capability.json').write_text(json.dumps(record, indent=2) + '\n')
    print(json.dumps({key: record.get(key) for key in ('backup_command_succeeded', 'owned_process_stopped', 'owned_directory_removed')}))
