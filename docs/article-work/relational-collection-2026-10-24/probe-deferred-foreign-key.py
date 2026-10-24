"""Resolve a planning assumption using owned disposable native instances only."""
from pathlib import Path
import datetime
import hashlib
import json
import shutil
import socket
import subprocess
import tempfile
import time

WORK = Path(__file__).resolve().parent
PG = Path('/opt/homebrew/opt/postgresql@18/bin')
CR = Path('/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach')
owned = Path(tempfile.mkdtemp(prefix='sc-rel-deferred-'))
environment = {'PATH': f'{PG}:/usr/bin:/bin', 'LC_ALL': 'C', 'TZ': 'UTC',
               'COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING': 'true'}
commands = []

def run(command, timeout=30):
    result = subprocess.run([str(x) for x in command], env=environment, text=True,
                            capture_output=True, timeout=timeout)
    commands.append({'command': [str(x) for x in command], 'exit_code': result.returncode,
                     'stdout': result.stdout, 'stderr': result.stderr})
    return result

def unused_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]

def statements(prefix, deferred):
    clause = ' DEFERRABLE INITIALLY DEFERRED' if deferred else ''
    return [f'CREATE TABLE {prefix}_parent(id integer PRIMARY KEY);',
            f'CREATE TABLE {prefix}_child(id integer PRIMARY KEY, parent_id integer REFERENCES {prefix}_parent(id){clause});',
            f'BEGIN; INSERT INTO {prefix}_child VALUES (1, 1); '
            f'INSERT INTO {prefix}_parent VALUES (1); COMMIT; '
            f'SELECT count(*) AS joined_rows FROM {prefix}_child c JOIN {prefix}_parent p ON p.id=c.parent_id;']

pg_started = False
cr_process = None
results = {}
try:
    data, sockets = owned / 'pgdata', owned / 'socket'
    sockets.mkdir()
    initialized = run([PG / 'initdb', '-D', data, '-U', 'trialowner', '--auth=trust', '--no-locale', '-E', 'UTF8'])
    if initialized.returncode:
        raise RuntimeError('owned initdb failed')
    pg_port = unused_port()
    started = run([PG / 'pg_ctl', '-D', data, '-l', owned / 'postgres.log', '-o', f'-h "" -k {sockets} -p {pg_port}', '-w', 'start'])
    if started.returncode:
        raise RuntimeError('owned PostgreSQL failed to start')
    pg_started = True
    client = [PG / 'psql', '-X', '-h', sockets, '-p', pg_port, '-U', 'trialowner', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose']
    identity = run(client + ['-Atc', "SELECT current_setting('data_directory')"])
    if identity.returncode or Path(identity.stdout.strip()).resolve() != data.resolve():
        raise RuntimeError('PostgreSQL ownership identity mismatch')
    for deferred in (False, True):
        label = 'deferred' if deferred else 'immediate'
        steps = []
        for sql in statements(f'probe_{label}', deferred):
            outcome = run(client + ['-c', sql])
            steps.append({'sql': sql, 'exit_code': outcome.returncode, 'stdout': outcome.stdout, 'stderr': outcome.stderr})
            if outcome.returncode:
                break
        results[f'postgres_{label}'] = {'exit_code': outcome.returncode, 'steps': steps}
    cr_port, http_port = unused_port(), unused_port()
    cr_command = [str(CR), 'start-single-node', '--insecure', f'--listen-addr=127.0.0.1:{cr_port}',
                  f'--http-addr=127.0.0.1:{http_port}', f'--store={owned / "crstore"}',
                  '--cache=64MiB', '--max-sql-memory=128MiB']
    with (owned / 'cockroach.log').open('w') as log:
        cr_process = subprocess.Popen(cr_command, env=environment, stdout=log, stderr=subprocess.STDOUT)
        commands.append({'owned_server_command': cr_command, 'pid': cr_process.pid})
        cr_client = [CR, 'sql', '--insecure', f'--host=127.0.0.1:{cr_port}', '--database=defaultdb', '--format=tsv']
        for attempt in range(60):
            if cr_process.poll() is not None:
                raise RuntimeError('owned CockroachDB exited during startup')
            readiness = run(cr_client + ['--execute=SELECT 1'], timeout=4)
            if readiness.returncode == 0:
                break
            time.sleep(.25)
        else:
            raise RuntimeError('owned CockroachDB did not become ready')
        for deferred in (False, True):
            label = 'deferred' if deferred else 'immediate'
            steps = []
            for sql in statements(f'probe_{label}', deferred):
                outcome = run(cr_client + [f'--execute={sql}'])
                steps.append({'sql': sql, 'exit_code': outcome.returncode, 'stdout': outcome.stdout, 'stderr': outcome.stderr})
                if outcome.returncode:
                    break
            results[f'cockroach_{label}'] = {'exit_code': outcome.returncode, 'steps': steps}
finally:
    if cr_process is not None and cr_process.poll() is None:
        cr_process.terminate()
        try:
            cr_process.wait(timeout=15)
        except subprocess.TimeoutExpired:
            cr_process.kill()
            cr_process.wait(timeout=5)
    if pg_started:
        run([PG / 'pg_ctl', '-D', owned / 'pgdata', '-m', 'immediate', '-w', 'stop'])
    record = {'checked_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'purpose': 'Native capability probe for a deferred-reference migration planning assumption; no article results or general engine equivalence certified.',
              'verifier_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              'tool_versions': json.loads((WORK / 'native-environment.json').read_text()),
              'owned_temporary_root': str(owned), 'results': results, 'commands': commands,
              'limits': 'Disposable local PostgreSQL18.6 and CockroachDB25.4.17 only. No existing database contacted. This probes child-before-parent insertion with a declared deferred FK, not every possible compatibility issue.'}
    (WORK / 'planning/deferred-foreign-key-native.json').write_text(json.dumps(record, indent=2) + '\n')
    shutil.rmtree(owned)
print(json.dumps(results, indent=2))
