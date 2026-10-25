"""Run an inspected SQL verifier on an owned single-node CockroachDB fixture."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import subprocess
import sys
import time

role, filename = sys.argv[1:3]
assert re.fullmatch('crdb-[a-z][a-z0-9-]{0,25}', role)
runtime = Path(__file__).resolve().parent
source = Path(filename).resolve()
assert source.is_relative_to(Path('/private/tmp/staycurrent-relational-rebuild-' + role + '-writer-20261025/evidence')) and source.suffix == '.sql'
evidence = source.parent
saved = json.loads((runtime / (role + '-fixture.json')).read_text())
cli = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
before = hashlib.sha256(source.read_bytes()).hexdigest()
start = time.time()
status = {'verifier_sha256_before': before, 'whole_process_timeout_seconds': 120}
try:
    info = json.loads(subprocess.check_output(cli + ['inspect', saved['container_id']], text=True))[0]
    assert info['Name'] == '/' + saved['name'] and info['Config']['Image'] == saved['pinned_image']
    assert info['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25' and info['Config']['Labels']['dev.staycurrent.article'] == role
    assert info['HostConfig']['NetworkMode'] == 'none' and not info['HostConfig'].get('PortBindings')
    saved.update(launch_arguments=info['Config']['Cmd'], memory_bytes=info['HostConfig']['Memory'], nano_cpus=info['HostConfig']['NanoCpus'], identity_probe_session_setting='allow_unsafe_internals=true on this isolated diagnostic session; required by26.2 for cluster/node identity functions, not production guidance')
    (runtime / (role + '-fixture.json')).write_text(json.dumps(saved, indent=2) + '\n')
    command = cli + ['exec', '-i', info['Id'], 'env', '-i', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', '/cockroach/cockroach', 'sql', '--insecure', '--host=127.0.0.1:26257', '--database=' + saved['database'], '--user=' + saved['user'], '--format=tsv', '--set=errexit=true', '--file=/dev/stdin']
    guard = f"SET allow_unsafe_internals=true; SELECT crdb_internal.force_error('XX000','Refusing unowned fixture') WHERE current_database()<>'{saved['database']}' OR current_user<>'{saved['user']}' OR version() NOT LIKE '%v26.2.8 %' OR crdb_internal.cluster_id()::STRING<>'{saved['cluster_id']}';\n"
    result = subprocess.run(command, input=guard + source.read_text(), text=True, capture_output=True, timeout=120)
    (evidence / 'native-results.txt').write_text(result.stdout)
    (evidence / 'native-stderr.txt').write_text(result.stderr)
    if result.returncode:
        logs = subprocess.run(cli + ['logs', '--tail', '120', info['Id']], text=True, capture_output=True, timeout=10)
        (evidence / 'native-server-tail.log').write_text(logs.stdout + logs.stderr)
        diagnostic = subprocess.run(command[:-1] + ["--execute=SET allow_unsafe_internals=true; SELECT job_id,status,error FROM [SHOW JOBS] WHERE status<>'succeeded' ORDER BY created DESC LIMIT 10;"], text=True, capture_output=True, timeout=15)
        (evidence / 'native-failure-jobs.txt').write_text(diagnostic.stdout + diagnostic.stderr)
    status.update(exit_code=result.returncode, container_id=info['Id'], cluster_id=saved['cluster_id'], command=command, guard_sql=guard, scope='Coordinator inspected author SQL separately. Same-session database/user/version/cluster UUID guard before author DDL. Single-node replication-disabled SQL/schema/range observations only.')
except BaseException as error:
    status.update(exit_code='timeout' if isinstance(error, subprocess.TimeoutExpired) else 'exception', error=str(error))
finally:
    status.update(elapsed_seconds=round(time.time()-start, 2), verifier_sha256_after=hashlib.sha256(source.read_bytes()).hexdigest())
    cleanup = subprocess.run(['python3', str(runtime / 'crdb-fixture.py'), 'stop', role], text=True, capture_output=True, timeout=30)
    status['fixture_cleanup_exit_code'] = cleanup.returncode
    shutil.copy2(runtime / (role + '-fixture.json'), evidence / 'native-fixture.json')
    (evidence / 'native-execution.json').write_text(json.dumps(status, indent=2) + '\n')
print(json.dumps(status))
sys.exit(0 if status.get('exit_code') == 0 and status['fixture_cleanup_exit_code'] == 0 else 1)
