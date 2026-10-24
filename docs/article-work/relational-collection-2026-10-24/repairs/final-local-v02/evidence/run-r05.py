#!/usr/bin/env python3
"""Execute the exact repaired reader download on one verified owned PG18 cluster."""
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
import shutil
import subprocess
import tempfile
import uuid

for key in list(os.environ):
    if key.startswith('PG'):
        del os.environ[key]

workspace = Path(__file__).resolve().parent.parent
evidence = workspace / 'evidence'
bindir = Path('/opt/homebrew/opt/postgresql@18/bin')
download = workspace / 'src/components/relational-collection/r05/downloads/joins-experiment.sql'
owned = Path(tempfile.mkdtemp(prefix='sc-final-local-v02-r05-', dir='/private/tmp'))
data, sock = owned / 'data', owned / 'sock'
sock.mkdir(mode=0o700)
tag = 'final_local_v02_' + uuid.uuid4().hex
owner = 'sc_final_v02'
port = '55463'
env = dict(os.environ, LC_ALL='C', PGPASSFILE=str(owned/'no-pass'), PGSERVICEFILE=str(owned/'no-service'))
for empty in ['no-pass', 'no-service']:
    (owned/empty).touch(mode=0o600)
started = False
record = {'download':str(download), 'download_sha256':hashlib.sha256(download.read_bytes()).hexdigest(),
          'verifier_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
          'endpoint':{'data':str(data),'socket':str(sock),'port':port,'owner':owner,'marker':tag},
          'inherited_pg_settings_removed_from_process':not any(k.startswith('PG') for k in os.environ),
          'commands':[]}

def run(tool, *args):
    command = [str(bindir/tool),*map(str,args)]
    process = subprocess.Popen(command,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    receipt = {'command':command,'pid':process.pid,'started_utc':datetime.now(timezone.utc).isoformat()}
    record['commands'].append(receipt)
    (evidence/f'{tag}-commands.json').write_text(json.dumps(record['commands'],indent=2)+'\n')
    try:
        stdout,stderr = process.communicate(timeout=45)
    except subprocess.TimeoutExpired:
        process.kill()
        stdout,stderr = process.communicate()
        receipt['timed_out'] = True
    receipt.update(returncode=process.returncode,stdout=stdout,stderr=stderr)
    (evidence/f'{tag}-commands.json').write_text(json.dumps(record['commands'],indent=2)+'\n')
    if process.returncode or receipt.get('timed_out'):
        raise RuntimeError(receipt)
    return subprocess.CompletedProcess(command,process.returncode,stdout,stderr)

try:
    record['version'] = run('postgres','--version').stdout.strip()
    assert '18.6' in record['version'], record['version']
    record['initdb'] = run('initdb','-D',data,'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8').stdout
    with (data/'postgresql.conf').open('a') as config:
        config.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport={port}\ncluster_name='{tag}'\n")
    run('pg_ctl','-D',data,'-l',owned/'server.log','-w','start')
    started = True
    proof = owned/'proof.sql'
    proof.write_text(f"""DO $$ BEGIN
IF current_setting('data_directory') <> '{data}'
 OR current_setting('unix_socket_directories') <> '{sock}'
 OR current_setting('cluster_name') <> '{tag}'
 OR current_setting('port') <> '{port}'
 OR current_setting('listen_addresses') <> ''
 OR current_user <> '{owner}' OR current_database() <> 'postgres'
 THEN RAISE EXCEPTION 'Refusing mutation: owned endpoint mismatch'; END IF;
END $$;
SELECT version(),current_setting('data_directory'),current_setting('unix_socket_directories'),
 current_setting('cluster_name'),current_user,current_database();
""")
    command = ['-X','-h',sock,'-p',port,'-U',owner,'-d','postgres','-v','ON_ERROR_STOP=1','-f',proof,'-f',download]
    record['command'] = [str(bindir/'psql'),*map(str,command)]
    result = run('psql',*command)
    (evidence/'r05-native-output.txt').write_text(result.stdout)
    (evidence/'r05-native-stderr.txt').write_text(result.stderr)
    assert 'All join checks passed' in result.stdout
    record['success'] = True
    record['scope'] = 'Exact complete delivered temporary-table SQL, including UNION ALL/UNION identity assertions; one local PG18.6 instance. No plan, timing, remote or failure claim.'
finally:
    if started:
        pidfile = data/'postmaster.pid'
        assert pidfile.exists() and pidfile.read_text().splitlines()[1] == str(data), 'Owned identity lost; refusing cleanup'
        run('pg_ctl','-D',data,'-m','fast','-w','stop')
        (evidence/'r05-server.log').write_bytes((owned/'server.log').read_bytes())
    shutil.rmtree(owned)
    record['owned_directory_absent_after_cleanup'] = not owned.exists()
    (evidence/'r05-native-result.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({k:record[k] for k in ['version','download_sha256','success','owned_directory_absent_after_cleanup']},indent=2))
