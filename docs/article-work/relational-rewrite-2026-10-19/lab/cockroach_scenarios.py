#!/usr/bin/env python3
"""Continue an explicitly supplied disposable Cockroach lab, recording each case."""
import argparse
import csv
import io
import json
import os
from pathlib import Path
import re
import signal
import subprocess
import time
from cockroach_lab import Lab, WORK, bootstrap

class ExistingProcess:
    def __init__(self, pid):
        self.pid = pid
        self.returncode = None
    def send_signal(self, sig):
        try:
            os.kill(self.pid, sig)
        except ProcessLookupError:
            self.returncode = 0
    def wait(self, timeout):
        until = time.monotonic() + timeout
        while time.monotonic() < until:
            try:
                os.kill(self.pid, 0)
            except ProcessLookupError:
                self.returncode = 0
                return 0
            time.sleep(.2)
        raise subprocess.TimeoutExpired('owned Cockroach process', timeout)
    def kill(self):
        self.send_signal(signal.SIGKILL)
    def poll(self):
        try:
            os.kill(self.pid, 0)
            return None
        except ProcessLookupError:
            return 0

def attach(directory, binary, old):
    lab = Lab.__new__(Lab)
    lab.directory = Path(directory).resolve()
    if not lab.directory.name.startswith('staycurrent-cockroach-'):
        raise ValueError('Only this worksheet\'s disposable directories are accepted')
    lab.certs = lab.directory / 'certs'
    lab.binary, lab.old = binary, old
    lab.keep = True
    lab.env = {**os.environ, 'COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING':'true'}
    lab.records, lab.processes = [], {}
    record = WORK / 'evidence/cockroach-observed.json'
    if record.exists():
        previous = json.loads(record.read_text())
        if previous['directory'] == str(lab.directory):
            lab.records = previous['records']
        else:
            (WORK / 'evidence/cockroach-sandbox-start-failed.json').write_text(record.read_text())
    for folder in lab.directory.glob('logs*'):
        n = int(folder.name[4:])
        name = (folder / 'cockroach.log').readlink().name
        pid = int(re.search(r'\.(\d+)\.log$', name)[1])
        lab.processes[n] = ExistingProcess(pid)
    lab.save()
    return lab

def status(lab, label):
    return lab.command(label, [lab.binary, 'node', 'status', f'--certs-dir={lab.certs}', '--host=localhost:56901', '--format=csv'])

def upgrade(lab):
    lab.sql('RL131-preserve-downgrade', "SET CLUSTER SETTING cluster.preserve_downgrade_option='25.3'")
    lab.sql('RL131-source-cluster-version', 'SHOW CLUSTER SETTING version')
    time.sleep(8)
    lab.stop(1)
    lab.start(1)
    lab.wait()
    status(lab, 'RL131-mixed-version-after-first-node')
    lab.sql('RL131-mixed-version-application', "SELECT * FROM workshop.sessions; INSERT INTO workshop.orders VALUES ('t4','upgrade-r1',42,20.00)")
    lab.stop(1)
    lab.start(1, lab.old)
    lab.wait()
    lab.sql('RL131-supported-prefinalisation-return', "SELECT version(); SELECT request FROM workshop.orders WHERE request='upgrade-r1'")
    lab.stop(1)
    lab.start(1)
    lab.wait()
    for n in (2,3):
        lab.stop(n)
        lab.start(n)
        lab.wait(n)
        lab.sql(f'RL131-traffic-after-node-{n}', 'SELECT sum(remaining) AS remaining FROM workshop.sessions')
    status(lab, 'RL131-all-target-binaries-not-yet-finalised')
    lab.sql('RL131-before-finalise', 'SHOW CLUSTER SETTING version')
    lab.sql('RL131-finalise', "SET CLUSTER SETTING cluster.preserve_downgrade_option=''", timeout=120)
    for _ in range(60):
        result = lab.sql('RL131-observe-cluster-version', 'SHOW CLUSTER SETTING version')
        if result.stdout.strip().splitlines()[-1] == '25.4':
            break
        time.sleep(1)
    lab.sql('RL131-finalised-acceptance', 'SELECT count(*) FROM workshop.orders')
    lab.sql('RL131-finalised-version', 'SHOW CLUSTER SETTING version')
    lab.stop(1)
    lab.start(1, lab.old)
    time.sleep(3)
    process = lab.processes[1]
    lab.records.append({'label':'RL131-old-binary-after-finalisation', 'exit':process.poll(),
                        'console_tail':(lab.directory/'node1.console').read_text()[-5000:]})
    lab.save()
    lab.stop(1)
    lab.start(1)
    lab.wait()

def core(lab):
    lab.sql('RL123-native-layout', """CREATE TABLE workshop.events(id INT PRIMARY KEY, tenant STRING, created INT, value INT);
      INSERT INTO workshop.events SELECT x, 't' || (x%10)::STRING, x, x%71 FROM generate_series(1,10000) AS g(x);
      CREATE INDEX events_by_tenant ON workshop.events(tenant,created);
      ALTER TABLE workshop.events SPLIT AT VALUES (2500),(5000),(7500);
      SHOW INDEX FROM workshop.events;
      SHOW RANGES FROM TABLE workshop.events WITH DETAILS;""")
    lab.sql('RL126-noncovering-query', "EXPLAIN ANALYZE SELECT value FROM workshop.events@events_by_tenant WHERE tenant='t4' ORDER BY created DESC LIMIT 10")
    lab.sql('RL126-covering-query', "CREATE INDEX events_cover ON workshop.events(tenant,created DESC) STORING(value); EXPLAIN ANALYZE SELECT value FROM workshop.events@events_cover WHERE tenant='t4' ORDER BY created DESC LIMIT 10")
    lab.sql('RL126-ordered-read', "CREATE INDEX events_ordered ON workshop.events(created) STORING(value); EXPLAIN ANALYZE SELECT created,value FROM workshop.events@events_ordered ORDER BY created DESC LIMIT 10")
    lab.sql('RL126-sharded-read', "CREATE INDEX events_sharded ON workshop.events(created) USING HASH WITH BUCKET_COUNT=4 STORING(value); SHOW CREATE TABLE workshop.events; EXPLAIN ANALYZE SELECT created,value FROM workshop.events@events_sharded ORDER BY created DESC LIMIT 10")
    lab.sql('RL125-supported-isolation', "SHOW default_transaction_isolation; BEGIN ISOLATION LEVEL READ COMMITTED; SHOW transaction_isolation; COMMIT")
    before = lab.sql('RL125-history-before-change', 'SELECT cluster_logical_timestamp() AS before_change').stdout.strip().splitlines()[-1]
    lab.sql('RL125-current-change', "UPDATE workshop.sessions SET remaining=1 WHERE tenant='t4' AND session='s7'; SELECT * FROM workshop.sessions")
    lab.sql('RL125-exact-historical-read', f"SELECT * FROM workshop.sessions AS OF SYSTEM TIME '{before}'")
    time.sleep(5)
    lab.sql('RL125-follower-historical-read', "SELECT * FROM workshop.sessions AS OF SYSTEM TIME follower_read_timestamp(); SELECT * FROM workshop.sessions")
    lab.sql('RL130-backfill', "ALTER TABLE workshop.events ADD COLUMN doubled INT AS (value*2) STORED; SELECT count(*),sum(doubled-value*2) FROM workshop.events; SELECT job_id,job_type,status,description FROM [SHOW JOBS] WHERE job_type LIKE '%SCHEMA%' ORDER BY created DESC LIMIT 8")
    lab.sql('RL130-failed-unique-build', "CREATE UNIQUE INDEX duplicate_values ON workshop.events(value)", check=False)
    lab.sql('RL130-after-failed-build', "SHOW INDEX FROM workshop.events; SELECT job_id,job_type,status,error FROM [SHOW JOBS] WHERE job_type LIKE '%SCHEMA%' ORDER BY created DESC LIMIT 5")
    lab.sql('RL128-limited-role', "CREATE USER booking_app; GRANT CONNECT ON DATABASE workshop TO booking_app; GRANT USAGE ON SCHEMA workshop.public TO booking_app; GRANT SELECT ON TABLE workshop.sessions TO booking_app")
    lab.command('RL128-create-client-identity', [lab.binary,'cert','create-client','booking_app',f'--certs-dir={lab.certs}',f'--ca-key={lab.directory}/ca.key'])
    lab.sql('RL128-permitted-read', 'SELECT * FROM workshop.sessions', user='booking_app', database='workshop')
    lab.sql('RL128-denied-write', "UPDATE sessions SET remaining=99", user='booking_app',database='workshop',check=False)
    lab.sql('RL128-health-evidence', 'SHOW RANGES FROM TABLE workshop.events WITH DETAILS; SHOW COLUMNS FROM crdb_internal.kv_store_status')
    status(lab, 'RL128-node-health')

def backup(lab):
    lab.sql('RL129-full-backup', "BACKUP DATABASE workshop INTO 'nodelocal://1/workshop-backup' WITH revision_history",timeout=180)
    recovery_target = lab.sql('RL129-before-later-acceptance', 'SELECT cluster_logical_timestamp()').stdout.strip().splitlines()[-1]
    lab.sql('RL129-later-valid-order', "INSERT INTO workshop.orders VALUES('t4','r82',42,22.00); SELECT cluster_logical_timestamp() AS recovery_target")
    lab.sql('RL129-incremental', "BACKUP DATABASE workshop INTO LATEST IN 'nodelocal://1/workshop-backup' WITH revision_history",timeout=180)
    lab.sql('RL129-committed-mistake', "DELETE FROM workshop.orders WHERE request='r80'; SELECT * FROM workshop.orders ORDER BY request")
    lab.sql('RL129-restore-latest', "RESTORE DATABASE workshop FROM LATEST IN 'nodelocal://1/workshop-backup' WITH new_db_name='recovered'",timeout=180)
    lab.sql('RL129-restore-earlier', f"RESTORE DATABASE workshop FROM LATEST IN 'nodelocal://1/workshop-backup' AS OF SYSTEM TIME '{recovery_target}' WITH new_db_name='earlier'", timeout=180)
    lab.sql('RL129-earlier-misses-valid-order', "SELECT request,amount FROM earlier.orders ORDER BY request")
    lab.sql('RL129-reconcile-later-order', "INSERT INTO earlier.orders VALUES('t4','r82',42,22.00); SELECT request,amount FROM earlier.orders ORDER BY request")
    lab.sql('RL129-restored-application', "SELECT * FROM recovered.orders ORDER BY request; SELECT * FROM recovered.sessions; SHOW GRANTS ON recovered.sessions")
    lab.sql('RL129-missing-backup', "RESTORE DATABASE workshop FROM LATEST IN 'nodelocal://1/not-a-backup' WITH new_db_name='missing'",check=False)

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--directory')
    p.add_argument('--bin',required=True)
    p.add_argument('--old-bin',required=True)
    p.add_argument('--phase',choices=['all','native','upgrade','core','backup'],default='all')
    a=p.parse_args()
    if a.phase in ('all','native'):
        lab=Lab(a.bin,a.old_bin if a.phase=='all' else a.bin)
        try:
            bootstrap(lab)
            if a.phase=='all':
                upgrade(lab)
                (WORK/'evidence/cockroach-upgrade-observed.json').write_text((WORK/'evidence/cockroach-observed.json').read_text())
            core(lab)
            from cockroach_extra import concurrency, regions, migration, online_change
            concurrency(lab)
            online_change(lab)
            backup(lab)
            regions(lab)
            migration(lab)
        finally:
            lab.cleanup()
    else:
        lab=attach(a.directory,a.bin,a.old_bin)
        {'upgrade':upgrade,'core':core,'backup':backup}[a.phase](lab)
        lab.save()

if __name__=='__main__':main()
