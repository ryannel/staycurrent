import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

binary = Path('/opt/homebrew/opt/postgresql@18/bin')
owned = Path(tempfile.mkdtemp(prefix='sc-ext-', dir='/private/tmp'))
data, socket = owned / 'data', owned / 'socket'
socket.mkdir()
env = {k: v for k, v in os.environ.items() if not k.startswith('PG')}
receipt = {'started_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
           'scope': 'Local extension loading capability only; not article example verification',
           'owned_temporary_root': str(owned), 'commands': [], 'results': {}}

def run(args, check=True):
    result = subprocess.run([str(x) for x in args], env=env, capture_output=True, text=True)
    receipt['commands'].append({'argv': [str(x) for x in args], 'exit_code': result.returncode,
                                'stdout': result.stdout, 'stderr': result.stderr})
    if check and result.returncode:
        raise RuntimeError(result.stderr)
    return result

def sql(statement, check=True):
    return run([binary / 'psql', '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-h', socket,
                '-p', '6549', '-d', 'postgres', '-c', statement], check)

started = False
try:
    receipt['postgres_version'] = run([binary / 'postgres', '--version']).stdout.strip()
    run([binary / 'initdb', '-D', data, '-A', 'trust', '--no-locale'])
    run([binary / 'pg_ctl', '-D', data, '-l', owned / 'postgres.log', '-o',
         f"-k {socket} -p 6549 -c listen_addresses=''", '-w', 'start'])
    started = True
    identity = sql('SHOW data_directory').stdout.strip()
    if Path(identity).resolve() != data.resolve():
        raise RuntimeError('Owned database identity mismatch')
    receipt['data_directory_verified'] = identity
    for extension in ('vector', 'postgis', 'postgres_fdw'):
        result = sql(f'CREATE EXTENSION {extension}', check=False)
        receipt['results'][extension] = {'loaded': result.returncode == 0}
        if result.returncode == 0:
            receipt['results'][extension]['version'] = sql(
                f"SELECT extversion FROM pg_extension WHERE extname = '{extension}'").stdout.strip()
    if receipt['results']['vector']['loaded']:
        receipt['results']['vector']['operator_probe'] = sql(
            "SELECT '[1,0,0]'::vector <-> '[0,1,0]'::vector").stdout.strip()
    if receipt['results']['postgis']['loaded']:
        receipt['results']['postgis']['version_details'] = sql('SELECT postgis_full_version()').stdout.strip()
        receipt['results']['postgis']['operator_probe'] = sql(
            'SELECT ST_Distance(ST_Point(0,0), ST_Point(3,4))').stdout.strip()
finally:
    if (owned / 'postgres.log').exists():
        receipt['server_log'] = (owned / 'postgres.log').read_text()
    receipt['stopped'] = not started or run([binary / 'pg_ctl', '-D', data, '-m', 'fast', '-w', 'stop'],
                                          check=False).returncode == 0
    if receipt['stopped']:
        shutil.rmtree(owned)
    receipt['owned_temporary_root_removed'] = not owned.exists()
    receipt['finished_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    receipt['verifier_sha256'] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    target = Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-collection-2026-10-24/native-extension-capability.json')
    target.write_text(json.dumps(receipt, indent=2) + '\n')
    print(json.dumps({'results': receipt['results'], 'stopped': receipt['stopped'],
                      'removed': receipt['owned_temporary_root_removed']}))
