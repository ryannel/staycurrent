#!/usr/bin/env python3
"""A bounded prepared-transaction learning fixture, not a transaction manager.
Two databases on one owned PostgreSQL instance are separate commit participants.
python3 prepared.py --bindir /path/to/postgresql/bin
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bindir', required=True)
    args = parser.parse_args()
    binaries = Path(args.bindir).resolve()
    for name in ('initdb', 'pg_ctl', 'psql', 'postgres'):
        if not (binaries / name).is_file():
            raise SystemExit(f'Missing {name}')
    env = {k: v for k, v in os.environ.items() if not k.startswith('PG')}
    env['LC_ALL'] = 'C'
    result = {'started_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
    running = False
    with tempfile.TemporaryDirectory(prefix='r27-', dir='/private/tmp' if Path('/private/tmp').exists() else '/tmp') as tmp:
        root = Path(tmp).resolve()
        data, sock = root / 'data', root / 'sock'
        sock.mkdir(mode=0o700)
        role, port = 'r27_owner', '56427'
        journal = root / 'decision.json'
        def tool(name, *parts):
            return subprocess.run([str(binaries / name), *map(str, parts)], env=env, text=True, capture_output=True, check=True, timeout=30)
        def q(sql, db='postgres', check=True):
            return subprocess.run([str(binaries / 'psql'), '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-h', str(sock), '-p', port, '-U', role, '-d', db, '-c', sql], env=env, text=True, capture_output=True, check=check, timeout=10)
        def ownership():
            assert Path(q('SHOW data_directory;').stdout.strip()).resolve() == data
            assert q('SELECT current_user;').stdout.strip() == role
        try:
            tool('initdb', '-D', data, '-U', role, '-A', 'trust', '--no-locale')
            with (data / 'postgresql.conf').open('a') as f:
                f.write(f"\nlisten_addresses = ''\nunix_socket_directories = '{sock}'\nport = {port}\nmax_prepared_transactions = 10\n")
            tool('pg_ctl', '-D', data, '-l', root / 'server.log', '-w', 'start')
            running = True
            ownership()
            result['version'] = q('SELECT version();').stdout.strip()
            q('CREATE DATABASE stock;')
            q('CREATE DATABASE orderbook;')
            q("CREATE TABLE products(product_id text PRIMARY KEY, stock int NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES ('P7',1),('P3',12);", 'stock')
            q("CREATE TABLE orders(order_id int PRIMARY KEY, customer_id int NOT NULL, status text NOT NULL); CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text,quantity int NOT NULL CHECK(quantity>0),unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));", 'orderbook')
            # Counterexample: the first local commit cannot be undone by the second database.
            q("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7'; UPDATE products SET stock=stock-2 WHERE product_id='P3'; COMMIT;", 'stock')
            failure = q("BEGIN; INSERT INTO orders VALUES(103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',0,20.00); COMMIT;", 'orderbook', check=False)
            assert failure.returncode != 0 and 'check constraint' in failure.stderr
            result['unsafe'] = {'stock': q('SELECT product_id,stock FROM products ORDER BY product_id;', 'stock').stdout.strip(), 'orders': q('SELECT count(*) FROM orders;', 'orderbook').stdout.strip()}
            assert result['unsafe']['stock'] == 'P3|10\nP7|0' and result['unsafe']['orders'] == '0'
            q("UPDATE products SET stock=CASE product_id WHEN 'P7' THEN 1 ELSE 12 END;", 'stock')
            # Fixed known participant set, no other coordinator or client can resolve these IDs.
            q("BEGIN; UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1; UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2; PREPARE TRANSACTION 'r27-stock-103';", 'stock')
            q("BEGIN; INSERT INTO orders VALUES(103,1,'pending'); INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50); PREPARE TRANSACTION 'r27-order-103';", 'orderbook')
            result['prepared_before_restart'] = q('SELECT gid FROM pg_prepared_xacts ORDER BY gid;').stdout.strip().splitlines()
            assert len(result['prepared_before_restart']) == 2
            decision = {'transaction': 'purchase-mina-103', 'outcome': 'commit', 'participants': [['stock', 'r27-stock-103'], ['orderbook', 'r27-order-103']]}
            with journal.open('x') as f:
                json.dump(decision, f)
                f.flush()
                os.fsync(f.fileno())
            directory = os.open(root, os.O_RDONLY)
            try:
                os.fsync(directory)
            finally:
                os.close(directory)
            tool('pg_ctl', '-D', data, '-w', '-m', 'immediate', 'stop')
            running = False
            tool('pg_ctl', '-D', data, '-l', root / 'server.log', '-w', 'start')
            running = True
            ownership()
            result['prepared_after_restart'] = q('SELECT gid FROM pg_prepared_xacts ORDER BY gid;').stdout.strip().splitlines()
            assert result['prepared_after_restart'] == result['prepared_before_restart']
            result['before_resolution'] = {'stock': q('SELECT product_id,stock FROM products ORDER BY product_id;', 'stock').stdout.strip(), 'orders': q('SELECT count(*) FROM orders;', 'orderbook').stdout.strip()}
            assert result['before_resolution']['stock'] == 'P3|12\nP7|1' and result['before_resolution']['orders'] == '0'
            recovered = json.loads(journal.read_text())
            assert recovered == decision and recovered['outcome'] == 'commit'
            for db, gid in recovered['participants']:
                q(f"COMMIT PREPARED '{gid}';", db)
            result['after_resolution'] = {'stock': q('SELECT product_id,stock FROM products ORDER BY product_id;', 'stock').stdout.strip(), 'order': q('SELECT order_id,customer_id,status FROM orders;', 'orderbook').stdout.strip(), 'lines': q('SELECT order_id,line_no,product_id,quantity,unit_price FROM order_items ORDER BY line_no;', 'orderbook').stdout.strip(), 'prepared_count': q('SELECT count(*) FROM pg_prepared_xacts;').stdout.strip()}
            assert result['after_resolution'] == {'stock': 'P3|10\nP7|0', 'order': '103|1|pending', 'lines': '103|1|P7|1|20.00\n103|2|P3|2|4.50', 'prepared_count': '0'}
            result['assertions_passed'] = True
        finally:
            if running:
                # Cleanup honours a recorded commit, never guesses a contrary outcome.
                action = 'COMMIT' if journal.exists() and json.loads(journal.read_text()).get('outcome') == 'commit' else 'ROLLBACK'
                for db, gid in [('stock','r27-stock-103'),('orderbook','r27-order-103')]:
                    q(f"{action} PREPARED '{gid}';", db, check=False)
                tool('pg_ctl', '-D', data, '-w', '-m', 'fast', 'stop')
            result['owned_server_stopped'] = True
    result['temporary_directory_removed'] = not root.exists()
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
