#!/usr/bin/env python3
"""Disposable, loopback-only CockroachDB worksheets. No production credentials.

Pass --old-bin and --bin pointing at official 25.3.7 and 25.4.17 binaries.
Data and generated certificates live in a fresh temporary directory. The JSON
record contains statements/results, never private keys. --keep permits follow-up
inspection; otherwise all processes are stopped and the directory is removed.
"""
import argparse
import csv
import io
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import tempfile
import time

WORK = Path(__file__).resolve().parents[1]

class Lab:
    def __init__(self, binary, old=None, keep=False):
        self.binary = str(Path(binary).resolve())
        self.old = str(Path(old).resolve()) if old else self.binary
        self.directory = Path(tempfile.mkdtemp(prefix='staycurrent-cockroach-'))
        self.certs = self.directory / 'certs'
        self.certs.mkdir()
        (self.directory / 'external').mkdir()
        self.keep = keep
        self.processes = {}
        self.records = []
        self.env = {**os.environ, 'COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING': 'true'}

    def record(self, label, args, result, sql=None):
        entry = {'label': label, 'command': [str(x) for x in args], 'exit': result.returncode,
                 'stdout': result.stdout, 'stderr': result.stderr}
        if sql is not None:
            entry['sql'] = sql
        self.records.append(entry)
        self.save()
        print(label, 'exit', result.returncode, flush=True)
        return entry

    def save(self):
        (WORK / 'evidence/cockroach-observed.json').write_text(json.dumps({
            'setting': 'Native macOS ARM64, loopback-only processes on one host. Not a production or geographical failure test.',
            'binary': self.binary, 'old_binary': self.old,
            'directory': str(self.directory), 'records': self.records,
        }, indent=2) + '\n')

    def command(self, label, args, check=True, timeout=90):
        result = subprocess.run([str(x) for x in args], capture_output=True, text=True,
                                env=self.env, timeout=timeout)
        self.record(label, args, result)
        if check and result.returncode:
            raise RuntimeError(label + ': ' + result.stderr)
        return result

    def sql(self, label, statement, node=1, user='root', database='defaultdb', check=True, timeout=90):
        args = [self.binary, 'sql', f'--certs-dir={self.certs}',
                f'--host=localhost:{56900+node}', f'--user={user}',
                f'--database={database}', '--format=csv']
        # Controlled worksheet statements contain no semicolons inside literals.
        # Repeated --execute arguments retain the connection but let each statement
        # complete, instead of submitting unrelated DDL as one implicit transaction.
        for part in statement.split(';'):
            if part.strip():
                args.extend(['--execute', part.strip()])
        result = subprocess.run(args, capture_output=True, text=True, env=self.env, timeout=timeout)
        self.record(label, args[:8] + ['<recorded SQL statements>'], result, statement)
        if check and result.returncode:
            raise RuntimeError(label + ': ' + result.stderr)
        return result

    def certs_init(self):
        common = [f'--certs-dir={self.certs}', f'--ca-key={self.directory}/ca.key']
        self.command('create-ca', [self.binary, 'cert', 'create-ca', *common])
        self.command('create-node', [self.binary, 'cert', 'create-node', 'localhost', '127.0.0.1', *common])
        self.command('create-root-client', [self.binary, 'cert', 'create-client', 'root', *common])

    def start(self, n, binary=None):
        regions = {1: 'eu', 2: 'us', 3: 'ap', 4: 'eu', 5: 'eu', 6: 'us', 7: 'us', 8: 'ap', 9: 'ap'}
        args = [binary or self.binary, 'start', f'--certs-dir={self.certs}',
                f'--store={self.directory}/node{n}', f'--listen-addr=127.0.0.1:{56900+n}',
                f'--advertise-addr=localhost:{56900+n}', f'--http-addr=127.0.0.1:{57900+n}',
                '--join=localhost:56901,localhost:56902,localhost:56903',
                f'--locality=region={regions[n]},zone={regions[n]}{n}',
                '--cache=64MiB', '--max-sql-memory=256MiB',
                f'--external-io-dir={self.directory}/external',
                f'--log-dir={self.directory}/logs{n}']
        output = open(self.directory / f'node{n}.console', 'a')
        self.processes[n] = subprocess.Popen(args, stdout=output, stderr=output, env=self.env)
        output.close()
        self.records.append({'label': f'start-node-{n}', 'command': args, 'pid': self.processes[n].pid})
        self.save()

    def stop(self, n, abrupt=False):
        process = self.processes.pop(n, None)
        if process is None:
            return
        process.send_signal(signal.SIGKILL if abrupt else signal.SIGTERM)
        try:
            process.wait(timeout=30)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
        self.records.append({'label': f'stop-node-{n}', 'signal': 'KILL' if abrupt else 'TERM', 'exit': process.returncode})
        self.save()

    def wait(self, node=1, attempts=60):
        args = [self.binary, 'sql', f'--certs-dir={self.certs}', f'--host=localhost:{56900+node}', '--format=csv', '--execute=SELECT 1']
        for _ in range(attempts):
            result = subprocess.run(args, capture_output=True, text=True, env=self.env, timeout=10)
            if result.returncode == 0:
                return
            if node in self.processes and self.processes[node].poll() is not None:
                raise RuntimeError((self.directory / f'node{node}.console').read_text()[-6000:])
            time.sleep(1)
        raise RuntimeError(f'Node {node} not SQL ready')

    def cleanup(self):
        if self.keep:
            self.save()
            print('Retained disposable lab:', self.directory, flush=True)
            return
        for n in list(self.processes):
            self.stop(n, abrupt=True)
        shutil.rmtree(self.directory)

def bootstrap(lab):
    lab.command('target-version', [lab.binary, 'version'])
    lab.command('source-version', [lab.old, 'version'])
    lab.certs_init()
    for n in (1, 2, 3):
        lab.start(n, lab.old)
    time.sleep(2)
    lab.command('initialise-cluster', [lab.old, 'init', f'--certs-dir={lab.certs}', '--host=localhost:56901'])
    lab.wait()
    lab.sql('disable-diagnostics', 'SET CLUSTER SETTING diagnostics.reporting.enabled=false')
    lab.sql('seed-workshop', """CREATE DATABASE workshop;
      CREATE TABLE workshop.sessions (tenant STRING, session STRING, remaining INT CHECK(remaining>=0), PRIMARY KEY(tenant,session));
      INSERT INTO workshop.sessions VALUES ('t4','s7',2);
      CREATE TABLE workshop.orders (tenant STRING, request STRING, customer INT, amount DECIMAL(10,2), PRIMARY KEY(tenant,request));
      INSERT INTO workshop.orders VALUES ('t4','r80',42,20.00);
      SELECT tenant,session,remaining FROM workshop.sessions;""")
    lab.command('initial-node-status', [lab.binary, 'node', 'status', f'--certs-dir={lab.certs}', '--host=localhost:56901', '--format=csv'])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--bin', required=True)
    parser.add_argument('--old-bin')
    parser.add_argument('--keep', action='store_true')
    args = parser.parse_args()
    lab = Lab(args.bin, args.old_bin, args.keep)
    try:
        bootstrap(lab)
        print('Initial cluster ready:', lab.directory, flush=True)
    finally:
        lab.cleanup()

if __name__ == '__main__':
    main()
