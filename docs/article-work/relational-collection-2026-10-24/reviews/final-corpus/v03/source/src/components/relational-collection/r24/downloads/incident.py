#!/usr/bin/env python3
"""Repeat one bounded lock incident in a private disposable PostgreSQL cluster.

python3 incident.py --bindir /path/to/postgresql/bin
Requires Python 3 and PostgreSQL tools. Does not contact an existing server.
"""
import argparse
import json
import os
from pathlib import Path
import queue
import subprocess
import tempfile
import threading
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bindir', required=True)
    args = parser.parse_args()
    bindir = Path(args.bindir).resolve()
    for name in ('initdb', 'pg_ctl', 'psql', 'postgres'):
        if not (bindir / name).is_file():
            raise SystemExit(f'Missing PostgreSQL tool: {name}')
    env = {k: v for k, v in os.environ.items() if not k.startswith('PG')}
    env['LC_ALL'] = 'C'
    sessions = []
    started = False
    report = {'started_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
    with tempfile.TemporaryDirectory(prefix='r24-', dir='/private/tmp' if Path('/private/tmp').exists() else '/tmp') as tmp:
        root = Path(tmp).resolve()
        data, socket = root / 'data', root / 'socket'
        socket.mkdir(mode=0o700)
        role = 'r24_owner'
        port = '56424'  # private Unix socket directory; TCP is disabled
        def tool(name, *items, **kwargs):
            return subprocess.run([str(bindir / name), *map(str, items)], env=env, check=True, text=True, capture_output=True, timeout=30, **kwargs)
        base = [str(bindir / 'psql'), '-X', '-qAt', '-h', str(socket), '-p', port, '-U', role, '-d', 'postgres']
        def query(sql):
            return subprocess.run([*base, '-v', 'ON_ERROR_STOP=1', '-c', sql], env=env, text=True, check=True, capture_output=True, timeout=10).stdout.strip()
        class Session:
            def __init__(self, name):
                self.name = name
                self.proc = subprocess.Popen(base, env={**env, 'PGAPPNAME': name}, text=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, bufsize=1)
                self.lines = queue.Queue()
                def read():
                    for line in self.proc.stdout:
                        self.lines.put(line.rstrip('\n'))
                self.reader = threading.Thread(target=read, daemon=True)
                self.reader.start()
                sessions.append(self)
                self.pid = int(self.run('SELECT pg_backend_pid();')[0])
            def run(self, sql):
                marker = f'R24_END_{time.monotonic_ns()}'
                self.proc.stdin.write(sql + '\n\\echo ' + marker + '\n')
                self.proc.stdin.flush()
                result = []
                deadline = time.monotonic() + 10
                while True:
                    line = self.lines.get(timeout=max(.01, deadline - time.monotonic()))
                    if line == marker:
                        return result
                    result.append(line)
            def close(self):
                if self.proc.poll() is None:
                    try:
                        self.proc.stdin.write('ROLLBACK;\n\\q\n')
                        self.proc.stdin.flush()
                        self.proc.wait(timeout=5)
                    except (BrokenPipeError, subprocess.TimeoutExpired):
                        self.proc.terminate()
                        self.proc.wait(timeout=5)
        try:
            tool('initdb', '-D', data, '-U', role, '-A', 'trust', '--no-locale')
            with (data / 'postgresql.conf').open('a') as f:
                f.write(f"\nlisten_addresses = ''\nunix_socket_directories = '{socket}'\nport = {port}\n")
            tool('pg_ctl', '-D', data, '-l', root / 'server.log', '-w', 'start')
            started = True
            actual = query('SHOW data_directory;')
            assert Path(actual).resolve() == data, (actual, data)
            assert query('SELECT current_user;') == role
            assert (data / 'postmaster.pid').is_file()
            report['ownership_checked'] = True
            report['server_version'] = query('SELECT version();')
            query("CREATE TABLE products(product_id text PRIMARY KEY, stock int NOT NULL CHECK(stock >= 0)); INSERT INTO products VALUES ('P7',1);")
            holder = Session('r24-holder')
            waiter = Session('r24-waiter')
            holder.run("BEGIN; SELECT stock FROM products WHERE product_id='P7' FOR UPDATE;")
            result = []
            worker = threading.Thread(target=lambda: result.extend(waiter.run("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock;")), daemon=True)
            worker.start()
            # Bounded polling of this exact owned waiter, before any intervention.
            observed = None
            for _ in range(100):
                value = query(f"SELECT json_build_object('state',state,'wait_event_type',wait_event_type,'blockers',pg_blocking_pids(pid),'application_name',application_name) FROM pg_stat_activity WHERE pid={waiter.pid};")
                sample = json.loads(value)
                if sample['wait_event_type'] == 'Lock' and holder.pid in sample['blockers']:
                    observed = sample
                    break
                time.sleep(.02)
            assert observed, 'Did not observe the intended owned lock wait'
            report['wait_observation'] = observed
            assert query(f"SELECT application_name FROM pg_stat_activity WHERE pid={holder.pid};") == holder.name
            report['holder_before'] = query(f"SELECT state FROM pg_stat_activity WHERE pid={holder.pid};")
            assert report['holder_before'] == 'idle in transaction'
            report['cancel_idle_holder_returned'] = query(f'SELECT pg_cancel_backend({holder.pid});')
            report['still_blocks_after_cancel'] = query(f'SELECT {holder.pid}=ANY(pg_blocking_pids({waiter.pid}));')
            assert report['still_blocks_after_cancel'] == 't'
            assert query(f"SELECT application_name FROM pg_stat_activity WHERE pid={waiter.pid};") == waiter.name
            query(f'SELECT pg_cancel_backend({waiter.pid});')
            worker.join(timeout=10)
            assert not worker.is_alive()
            report['cancelled_waiter_output'] = result
            assert any('canceling statement due to user request' in x for x in result)
            report['waiter_after_cancel'] = query(f"SELECT state FROM pg_stat_activity WHERE pid={waiter.pid};")
            assert report['waiter_after_cancel'] == 'idle in transaction (aborted)'
            waiter.run('ROLLBACK;')
            holder.run('ROLLBACK;')
            report['retry_output'] = waiter.run("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock; COMMIT;")
            report['final_stock'] = query("SELECT stock FROM products WHERE product_id='P7';")
            assert report['final_stock'] == '0'
            report['assertions_passed'] = True
        finally:
            for session in reversed(sessions):
                session.close()
            if started:
                tool('pg_ctl', '-D', data, '-w', '-m', 'fast', 'stop')
            report['owned_server_stopped'] = True
    report['temporary_directory_removed'] = not root.exists()
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
