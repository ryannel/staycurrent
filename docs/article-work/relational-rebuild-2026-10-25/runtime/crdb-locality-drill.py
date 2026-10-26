"""Bounded native SQL evidence on the exact owned, shared-host locality fixture.

Running this script executes the drill and removes the fixture in finally. It
does not provision a fixture, publish anything, or simulate a regional outage.
No host SQL connections are used. Authored templates are read, never rewritten.
"""
from pathlib import Path
import csv
import hashlib
import io
import json
import os
import re
import signal
import subprocess
import sys
import time


RUNTIME = Path(__file__).resolve().parent
PRIVATE = Path('/private/tmp/staycurrent-relational-rebuild-crdb-locality-writer-20261025/evidence')
EVIDENCE = PRIVATE / 'native-executed'
EXPECTED_ID = '44f876e580106e87d2bee2de24ca6a1122d90095b85815d32148688c77c31977'
EXPECTED_CLUSTER = 'ba4cd26c-fbfd-48ad-b1e5-eb2890c6dc6e'
BODY_SECONDS = 420
CLEANUP_SECONDS = 100
POLL_SECONDS = 60
DOCKER = ['docker', '--config', '/private/tmp/staycurrent-rebuild-docker-public-config',
          '--host', 'unix:///Users/ryannel/.docker/run/docker.sock']
SCOPE = ('One network-none container, nine local processes, one shared host; '
         'North/West/East are declared locality labels. No real geography, '
         'regional outage, latency, production capacity or recovery claim.')


def save_new(path, value):
    """Never overwrite an earlier snapshot, including after a failed run."""
    data = value if isinstance(value, bytes) else value.encode('utf-8')
    with path.open('xb') as stream:
        stream.write(data)
    return hashlib.sha256(data).hexdigest()


def json_new(path, value):
    return save_new(path, json.dumps(value, indent=2) + '\n')


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def rows(output):
    parsed = list(csv.reader(io.StringIO(output)))
    # Cockroach emits command tags for the leading SET statements even in CSV.
    while parsed and parsed[0] in (['SET'], []):
        parsed.pop(0)
    require(bool(parsed), 'No CSV header returned')
    return [dict(zip(parsed[0], row)) for row in parsed[1:] if row]


class BoundReached(RuntimeError):
    """An explicit overall/poll bound, distinct from a SQL or ownership error."""


class Drill:
    def __init__(self, fixture):
        self.fixture = fixture
        self.started = time.monotonic()
        self.deadline = self.started + BODY_SECONDS
        self.sequence = 0
        self.cleanup_owned = False
        self.outcomes = []
        self.db = fixture['database']
        self.user = fixture['user']
        self.cid = fixture['container_id']
        self.ports = {region: min(n['port'] for n in fixture['nodes'] if n['region'] == region)
                      for region in ('North', 'West', 'East')}

    def record(self, value):
        self.outcomes.append(value)
        with (EVIDENCE / 'outcomes.jsonl').open('a', encoding='utf-8') as stream:
            stream.write(json.dumps(value) + '\n')

    def command(self, name, command, *, stdin=None, timeout=55, cleanup=False):
        self.sequence += 1
        prefix = EVIDENCE / f'{self.sequence:03d}-{name}'
        remaining = self.deadline - time.monotonic()
        if not cleanup:
            if remaining <= 0:
                raise BoundReached('Overall body/poll deadline reached')
            timeout = min(timeout, remaining)
        json_new(prefix.with_suffix('.command.json'), {'argv': command, 'timeout_seconds': timeout})
        before = time.monotonic()
        process = None
        try:
            process = subprocess.Popen(command, stdin=subprocess.PIPE if stdin is not None else subprocess.DEVNULL,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
            stdout, stderr = process.communicate(input=stdin, timeout=timeout)
            code, timed_out = process.returncode, False
        except subprocess.TimeoutExpired as error:
            # Kill only our own child group, including cleanup-helper Docker clients.
            os.killpg(process.pid, signal.SIGKILL)
            stdout, stderr = process.communicate()
            code, timed_out = process.returncode, True
        except OSError as error:
            stdout, stderr, code, timed_out = b'', str(error).encode('utf-8'), None, False
        save_new(prefix.with_suffix('.stdout'), stdout)
        save_new(prefix.with_suffix('.stderr'), stderr)
        outcome = {'phase': name, 'command_prefix': prefix.name, 'returncode': code,
                   'timed_out': timed_out, 'elapsed_seconds': time.monotonic() - before}
        self.record(outcome)
        if timed_out:
            message = f'{name}: command timed out; partial output retained'
            if not cleanup and time.monotonic() >= self.deadline:
                raise BoundReached(message)
            raise RuntimeError(message)
        return code, stdout.decode('utf-8', errors='replace'), stderr.decode('utf-8', errors='replace')

    def verify_container(self, name):
        code, stdout, _ = self.command(name, DOCKER + ['inspect', self.cid], timeout=10)
        require(code == 0, 'Cannot inspect exact owned container')
        items = json.loads(stdout)
        require(len(items) == 1, 'Expected one exact container')
        item = items[0]
        labels = item['Config'].get('Labels') or {}
        require(item['Id'] == EXPECTED_ID == self.cid, 'Container ID differs')
        require(item['Name'] == '/' + self.fixture['name'], 'Container name differs')
        require(item['Config']['Image'] == self.fixture['pinned_image'], 'Pinned image differs')
        expected_labels = {'dev.staycurrent.task': 'relational-rebuild-2026-10-25',
                           'dev.staycurrent.article': 'crdb-locality',
                           'dev.staycurrent.engine': 'cockroachdb'}
        require(all(labels.get(k) == v for k, v in expected_labels.items()), 'Ownership labels differ')
        require(item['HostConfig']['NetworkMode'] == 'none', 'Container network is not none')
        require(not item['HostConfig'].get('PortBindings'), 'Host port bindings found')
        require(not any(item['NetworkSettings'].get('Ports', {}).values()), 'Published ports found')
        require(not item.get('Mounts'), 'Unexpected host/volume mounts found')
        require(item['State']['Running'], 'Owned container is not running')
        return item

    def sql(self, name, query, region='North', expected_state=None, timeout=55):
        # Every session has explicit owned identity, host, application and limits.
        self.verify_container(name + '-container')
        full = ("SET application_name = 'staycurrent-crdb-locality-verifier';\n"
                "SET statement_timeout = '45s';\n" + query.rstrip() + '\n')
        path = EVIDENCE / (name + '.executed.sql')
        digest = save_new(path, full)
        self.record({'phase': name, 'executed_sql': path.name, 'sha256': digest,
                     'gateway_label': region, 'gateway_port': self.ports[region],
                     'database': self.db, 'user': self.user, 'expected_sqlstate': expected_state})
        command = DOCKER + ['exec', '-i', self.cid, 'env', '-i',
                            'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                            'GOMEMLIMIT=384MiB', '/cockroach/cockroach', 'sql', '--insecure',
                            '--host=127.0.0.1:' + str(self.ports[region]),
                            '--database=' + self.db, '--user=' + self.user,
                            '--format=csv', '--set=errexit=true']
        code, stdout, stderr = self.command(name, command, stdin=full.encode('utf-8'), timeout=timeout)
        states = re.findall(r'SQLSTATE:\s*([0-9A-Z]{5})\b', stderr + '\n' + stdout)
        passed = (code != 0 and expected_state in states) if expected_state else code == 0
        self.record({'phase': name, 'observed_sqlstates': states, 'expectation_met': passed})
        require(passed, f'{name}: expected ' + (expected_state or 'successful SQL') + '; inspect retained output')
        return stdout

    def identity(self, region):
        output = self.sql('identity-' + region.lower(),
                          "SET allow_unsafe_internals=true;\n"
                          "SELECT json_build_object('cluster_id',crdb_internal.cluster_id(),"
                          "'database',current_database(),'user',current_user(),'version',version(),"
                          "'gateway_region',gateway_region()) AS identity;", region)
        parsed = list(csv.reader(io.StringIO(output)))
        identity = next(json.loads(row[0]) for row in reversed(parsed) if row and row[0].startswith('{'))
        require(identity['cluster_id'] == EXPECTED_CLUSTER == self.fixture['cluster_id'], 'Live cluster differs')
        require(identity['database'] == self.db and identity['user'] == self.user, 'Live DB/user differs')
        require('v26.2.8 ' in identity['version'], 'Live product version differs')
        require(identity['gateway_region'] == region, 'Gateway locality differs')
        self.record({'phase': 'verified-identity-' + region, 'identity': identity})

    def ranges(self, phase):
        result = {}
        for name, target in [('products', 'TABLE products'), ('orders', 'TABLE orders'),
                             ('orders-history', 'INDEX orders@orders_history')]:
            # Separate statements make each CSV result unambiguous to parse.
            output = self.sql(phase + '-' + name, 'SHOW RANGES FROM ' + target + ' WITH DETAILS;')
            result[name] = rows(output)
        return result

    def policy(self, phase):
        self.sql(phase + '-desired-policy',
                 f'SHOW CREATE DATABASE {self.db};\nSHOW REGIONS FROM DATABASE {self.db};\n'
                 f'SHOW ZONE CONFIGURATION FOR DATABASE {self.db};\n'
                 'SHOW CREATE TABLE products;\nSHOW CREATE TABLE orders;\n'
                 'SHOW ZONE CONFIGURATION FOR TABLE products;\n'
                 'SHOW ZONE CONFIGURATION FOR TABLE orders;\n'
                 'SHOW ZONE CONFIGURATION FOR INDEX orders@orders_history;\n'
                 'SHOW PARTITIONS FROM TABLE orders;\nSHOW INDEXES FROM orders;')

    def capture_rehoming(self):
        captures = {}
        for name, query in [('session-show-all', 'SHOW ALL;'),
                            ('cluster-settings', 'SHOW ALL CLUSTER SETTINGS;'),
                            ('pg-settings-defaults', "SELECT * FROM pg_catalog.pg_settings WHERE name ILIKE '%rehom%';")]:
            output = self.sql('pre-probe-3-' + name, query, 'West')
            captures[name] = [row for row in rows(output)
                              if any(re.search(r'rehom|infer_rbr_region', str(value), re.I)
                                     for value in row.values())]
        json_new(EVIDENCE / 'pre-probe-3-rehoming-observed.json',
                 {'observed_rows': captures,
                  'interpretation': 'Raw current/default metadata retained. Missing or unknown is not false; '
                                    'probe 3 must be interpreted against the observed settings.'})


def resolve_templates(fixture):
    substitutions = {'__OWNED_DATABASE__': fixture['database']}
    substitutions.update({'__' + name.upper() + '__': name for name in ('North', 'West', 'East')
                          if name in {node['region'] for node in fixture['nodes']}})
    resolved = {}
    hashes = {}
    for filename in ('native-verification.sql', 'native-probes.sql'):
        raw = (PRIVATE / filename).read_bytes()
        source_hash = save_new(EVIDENCE / (filename + '.authored'), raw)
        text = raw.decode('utf-8')
        tokens = set(re.findall(r'__[A-Z][A-Z0-9_]*__', text))
        require(tokens <= substitutions.keys(), 'Unknown template token: ' + str(tokens - substitutions.keys()))
        for key, value in substitutions.items():
            text = text.replace(key, value)
        require(not re.search(r'__[A-Z][A-Z0-9_]*__', text), 'Unresolved template token')
        resolved[filename] = text
        digest = save_new(EVIDENCE / (filename + '.resolved'), text)
        hashes[filename] = {'authored_sha256': source_hash, 'resolved_sha256': digest}
    # Numbered markers define whole sessions, so BEGIN/ROLLBACK never split.
    parts = re.split(r'(?m)^(-- ([1-7])\. [^\n]*\n)', resolved['native-probes.sql'])
    require(len(parts) == 22, 'Expected precisely seven numbered authored probes')
    probes = {}
    for offset in range(1, len(parts), 3):
        number = int(parts[offset + 1])
        require(number not in probes, 'Duplicate probe number')
        probes[number] = parts[offset] + parts[offset + 2]
    require(sorted(probes) == list(range(1, 8)), 'Probe numbering differs')
    for number in (2, 3, 4, 7):
        require(re.search(r'(?mi)^BEGIN;', probes[number]) and re.search(r'(?mi)^ROLLBACK;', probes[number]),
                'Transactional probe must contain BEGIN and ROLLBACK')
        require(not re.search(r'(?mi)^COMMIT;', probes[number]), 'Transactional probe must not commit')
    json_new(EVIDENCE / 'template-resolution.json', {'substitutions': substitutions, 'hashes': hashes})
    return resolved['native-verification.sql'], probes


def five_voters(captures):
    """Conservative: missing voter metadata is unknown, never convergence."""
    details = {}
    for target, records in captures.items():
        counts = []
        for row in records:
            value = row.get('voting_replicas', row.get('voter_replicas'))
            counts.append(None if value is None else len(re.findall(r'\d+', value)))
        details[target] = counts
    return bool(details) and all(counts and all(n == 5 for n in counts) for counts in details.values()), details


def main():
    # Exclusive directory also refuses rerunning over any prior executed snapshot.
    EVIDENCE.mkdir(mode=0o700, parents=False, exist_ok=False)
    fixture = json.loads((RUNTIME / 'crdb-locality-fixture.json').read_text())
    require(fixture['container_id'] == EXPECTED_ID and fixture['cluster_id'] == EXPECTED_CLUSTER,
            'Fixture is not the specifically commissioned live instance')
    require(fixture['article'] == 'crdb-locality' and fixture['name'] == 'staycurrent-relational-rebuild-crdb-locality-20261025',
            'Fixture ownership metadata differs')
    require(fixture['database'] == 'sc_crdb_locality' and fixture['user'] == 'sc_crdb_locality_writer'
            and fixture['marker'] == 'staycurrent-crdb-locality-20261025', 'Owned DB/user/marker differs')
    image = json.loads((RUNTIME / 'crdb-image.json').read_text())['pinned_image']
    require(fixture['pinned_image'] == image, 'Fixture image differs from pinned image record')
    require(sorted((n['port'], n['region']) for n in fixture['nodes']) ==
            [(26257 + i, ('North', 'West', 'East')[i // 3]) for i in range(9)], 'Topology metadata differs')
    json_new(EVIDENCE / 'fixture-before.json', fixture)
    setup, probes = resolve_templates(fixture)
    drill = Drill(fixture)
    error = None
    cleanup_ok = False
    try:
        inspection = drill.verify_container('initial-container')
        drill.cleanup_owned = True
        # Exact digest reference above plus Docker's resolved immutable image ID.
        code, output, _ = drill.command('pinned-image', DOCKER + ['image', 'inspect', image], timeout=10)
        require(code == 0 and json.loads(output)[0]['Id'] == inspection['Image'], 'Resolved image ID differs')
        json_new(EVIDENCE / 'limits-and-scope.json',
                 {'scope': SCOPE, 'body_bound_seconds': BODY_SECONDS, 'cleanup_bound_seconds': CLEANUP_SECONDS,
                  'total_bound_seconds': BODY_SECONDS + CLEANUP_SECONDS, 'range_poll_bound_seconds': POLL_SECONDS,
                  'actual_container_memory_bytes': inspection['HostConfig'].get('Memory'),
                  'actual_container_nano_cpus': inspection['HostConfig'].get('NanoCpus'),
                  'declared_node_limits': fixture['limits']})
        for region in ('North', 'West', 'East'):
            drill.identity(region)
        guard = drill.sql('fixture-marker', 'SELECT marker FROM public.fixture_guard ORDER BY marker;')
        require(rows(guard) == [{'marker': fixture['marker']}], 'Live fixture marker differs')
        tables = drill.sql('fresh-owned-database',
                           "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")
        require(rows(tables) == [{'table_name': 'fixture_guard'}], 'Owned database is not fresh')
        drill.sql('configure-regions', f'ALTER DATABASE {drill.db} PRIMARY REGION "North";\n'
                  f'ALTER DATABASE {drill.db} ADD REGION "West";\nALTER DATABASE {drill.db} ADD REGION "East";')
        drill.sql('authored-setup', setup)
        drill.policy('zone-survival')
        drill.ranges('zone-survival')
        for number in range(1, 8):
            if number == 3:
                drill.capture_rehoming()
            drill.sql(f'probe-{number}', probes[number], 'West', {1: '23505', 5: '23503'}.get(number))
        # Spare table avoids re-running locality changes on populated authored tables.
        drill.sql('extra-alter-locality-syntax',
                  'CREATE TABLE locality_syntax_demo (id INT PRIMARY KEY);\n'
                  'ALTER TABLE locality_syntax_demo SET LOCALITY REGIONAL BY ROW;\n'
                  'SHOW CREATE TABLE locality_syntax_demo;\nDROP TABLE locality_syntax_demo;')
        # Exact authored home assignment, same values as the setup; one rollback session.
        drill.sql('extra-matching-homes-update',
                  "BEGIN;\nUPDATE orders SET crdb_region = 'North'\nWHERE order_id IN (101, 103);\n"
                  "UPDATE orders SET crdb_region = 'West'\nWHERE order_id = 102;\n"
                  'UPDATE order_items AS i SET crdb_region = o.crdb_region\n'
                  'FROM orders AS o WHERE i.order_id = o.order_id;\n'
                  'SELECT i.order_id,i.line_no,i.crdb_region,o.crdb_region AS parent_region\n'
                  'FROM order_items AS i JOIN orders AS o ON i.order_id=o.order_id ORDER BY i.order_id,i.line_no;\n'
                  'ROLLBACK;', 'West')
        drill.sql('region-survival-change', f'ALTER DATABASE {drill.db} SURVIVE REGION FAILURE;')
        drill.policy('region-survival')
        # Total polling wall time, including commands, is capped at sixty seconds.
        poll_started = time.monotonic()
        prior_deadline = drill.deadline
        drill.deadline = min(drill.deadline, poll_started + POLL_SECONDS)
        convergence = False
        attempt = 0
        details = {}
        try:
            while time.monotonic() < drill.deadline:
                attempt += 1
                captures = drill.ranges(f'region-survival-poll-{attempt:02d}')
                convergence, details = five_voters(captures)
                if convergence:
                    break
                pause = min(2, max(0, drill.deadline - time.monotonic()))
                time.sleep(pause)
        except BoundReached as poll_error:
            # Only deadline expiry is an observation; SQL/ownership errors still fail.
            drill.record({'phase': 'range-poll-bound', 'detail': str(poll_error)})
        finally:
            drill.deadline = prior_deadline
        drill.record({'phase': 'five-voter-observation', 'converged': convergence,
                      'observed_counts': details, 'attempts': attempt,
                      'elapsed_seconds': time.monotonic() - poll_started,
                      'interpretation': 'Placement observation only. Nonconvergence within bound is not a failed SQL drill; '
                                        'no outage or independent regional failure domains were tested.'})
    except BaseException as failure:
        error = f'{type(failure).__name__}: {failure}'
        drill.record({'phase': 'drill-failure', 'error': error})
    finally:
        if drill.cleanup_owned:
            try:
                code, _, _ = drill.command('cleanup-owned-fixture',
                                            [sys.executable, str(RUNTIME / 'crdb-multi-fixture.py'),
                                             'stop', 'crdb-locality'], timeout=CLEANUP_SECONDS, cleanup=True)
                cleanup_ok = code == 0
            except BaseException as failure:
                drill.record({'phase': 'cleanup-failure', 'error': f'{type(failure).__name__}: {failure}'})
        json_new(EVIDENCE / 'summary.json',
                 {'scope': SCOPE, 'error': error, 'cleanup_succeeded': cleanup_ok,
                  'elapsed_seconds': time.monotonic() - drill.started,
                  'sql_drill_completed': error is None, 'outcomes': drill.outcomes})
    print(json.dumps({'evidence': str(EVIDENCE), 'error': error, 'cleanup_succeeded': cleanup_ok}))
    return 0 if error is None and cleanup_ok else 1


if __name__ == '__main__':
    sys.exit(main())
