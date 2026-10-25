"""Execute an already inspected author SQL verifier on its owned network-none fixture."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import subprocess
import sys
import time

role, filename = sys.argv[1:3]
prefix = sys.argv[3] if len(sys.argv) > 3 else 'native'
assert re.fullmatch('[a-z][a-z0-9-]{0,40}', prefix)
assert re.fullmatch('[a-z][a-z0-9-]{0,31}', role)
source = Path(filename).resolve()
workspace = Path('/private/tmp/staycurrent-relational-rebuild-' + role + '-writer-20261025')
assert source.is_relative_to(workspace / 'evidence') and source.suffix == '.sql'
evidence = source.parent
runtime = Path(__file__).resolve().parent
cli = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config', '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
name = 'staycurrent-relational-rebuild-' + role + '-20261025'
image = 'postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
db = 'sc_' + role.replace('-', '_')
user = db + '_writer'
cluster = 'staycurrent-' + role + '-20261025'
before = hashlib.sha256(source.read_bytes()).hexdigest()
start = time.time()
status = {'verifier_sha256_before': before, 'whole_process_timeout_seconds': 180}
try:
    info = json.loads(subprocess.check_output(cli + ['inspect', name], text=True))[0]
    assert info['Config']['Image'] == image
    assert info['HostConfig']['NetworkMode'] == 'none' and not info['HostConfig'].get('PortBindings')
    assert info['Config']['Labels']['dev.staycurrent.task'] == 'relational-rebuild-2026-10-25'
    assert info['Config']['Labels']['dev.staycurrent.article'] == role
    cid = info['Id']
    command = cli + ['exec', '-i', cid, 'env', '-i', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'PGAPPNAME=' + role + '-owned-verifier', 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-h', '/var/run/postgresql', '-U', user, '-d', db]
    guard = f"DO $root_guard$ BEGIN IF current_database()<>'{db}' OR current_user<>'{user}' OR current_setting('cluster_name')<>'{cluster}' OR current_setting('server_version_num')<>'180006' OR current_setting('data_directory')<>'/var/lib/postgresql/18/docker' OR current_setting('listen_addresses')<>'' THEN RAISE EXCEPTION 'Refusing unowned fixture'; END IF; END $root_guard$;\n"
    result = subprocess.run(command, input=guard + source.read_text(), capture_output=True, text=True, timeout=180)
    (evidence / (prefix + '-results.txt')).write_text(result.stdout)
    (evidence / (prefix + '-stderr.txt')).write_text(result.stderr)
    status.update(exit_code=result.returncode, container_id=cid, configured_image=image, image_id=info['Image'], network='none', port_bindings=info['HostConfig'].get('PortBindings'), command=command, execution='Coordinator inspected author SQL separately; executor adds same-session runtime guard before supplied SQL. Exit0 establishes execution, not unasserted model conclusions.')
except BaseException as error:
    status.update(exit_code='timeout' if isinstance(error, subprocess.TimeoutExpired) else 'exception', error=str(error))
finally:
    status.update(elapsed_seconds=round(time.time()-start, 2), verifier_sha256_after=hashlib.sha256(source.read_bytes()).hexdigest())
    cleanup = subprocess.run(['python3', str(runtime / 'native-fixture.py'), 'stop', role], capture_output=True, text=True, timeout=30)
    status['fixture_cleanup_exit_code'] = cleanup.returncode
    shutil.copy2(runtime / (role + '-fixture.json'), evidence / (prefix + '-fixture.json'))
    (evidence / (prefix + '-execution.json')).write_text(json.dumps(status, indent=2) + '\n')
print(json.dumps(status))
sys.exit(0 if status.get('exit_code') == 0 and status['fixture_cleanup_exit_code'] == 0 else 1)
