"""Verify the opening's rules in an owned, disposable PostgreSQL cluster."""
import datetime
import getpass
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[3]
RECORD = Path(__file__).parent / 'native-receipt.json'
SOURCES = [ROOT / 'src/articles/relational-reference-test/opening.astro', ROOT / 'src/components/relational-reference-test/ShopSchema.astro']
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
env = {key: value for key, value in os.environ.items() if not key.startswith('PG')}
checks = []

def run(args, **kwargs):
    return subprocess.run(args, env=env, text=True, capture_output=True, **kwargs)

with tempfile.TemporaryDirectory(prefix='relational-opening-') as tmp:
    work = Path(tmp)
    work.chmod(0o700)
    data, socket = work / 'data', work / 'socket'
    socket.mkdir(mode=0o700)
    env.update({'PGSYSCONFDIR': str(work), 'PGPASSFILE': str(work / 'no-password-file')})
    initialised = run(['initdb', '-D', str(data), '-U', 'opening_verifier', '-A', 'trust', '--no-locale', '--encoding=UTF8'])
    assert initialised.returncode == 0, initialised.stderr
    running = False
    try:
        launch = run(['pg_ctl', '-D', str(data), '-l', str(work / 'server.log'), '-o', f"-p 56812 -k {socket} -h ''", '-w', 'start'])
        running = launch.returncode == 0
        assert running, launch.stderr
        psql = ['psql', '-X', '-w', '-h', str(socket), '-p', '56812', '-U', 'opening_verifier', '-d', 'postgres', '-At', '-v', 'ON_ERROR_STOP=1']

        def sql(statement, expected=None):
            result = run(psql, input='\\set VERBOSITY sqlstate\n' + statement)
            if expected:
                assert result.returncode != 0 and expected in result.stderr, (statement, result.stdout, result.stderr)
            else:
                assert result.returncode == 0, result.stderr
            return result.stdout.strip()

        endpoint = sql("SELECT json_build_object('data_directory',current_setting('data_directory'),'port',current_setting('port'),'socket',current_setting('unix_socket_directories'),'address',inet_server_addr(),'database',current_database(),'user',current_user,'version',version());")
        endpoint_data = json.loads(endpoint)
        assert endpoint_data['data_directory'] == str(data)
        assert endpoint_data['port'] == '56812' and endpoint_data['socket'] == str(socket)
        assert endpoint_data['address'] is None and endpoint_data['database'] == 'postgres'
        assert endpoint_data['user'] == 'opening_verifier'
        sql('''
CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK (price >= 0), stock integer NOT NULL CHECK (stock >= 0));
CREATE TABLE orders (order_id integer PRIMARY KEY,
 customer_id integer NOT NULL REFERENCES customers, placed_at timestamptz NOT NULL,
 status text NOT NULL CHECK (status IN ('pending','paid','cancelled')));
CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products, quantity integer NOT NULL CHECK (quantity > 0),
 unit_price numeric(8,2) NOT NULL, PRIMARY KEY (order_id,line_no));
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
''')
        checks.append('All canonical depicted rows accepted, including repeated line_no 1 on different orders')
        sql("INSERT INTO customers VALUES (1,'Other customer');", '23505')
        checks.append('Repeated customer primary key refused (23505)')
        sql("INSERT INTO customers VALUES (NULL,'Missing identifier');", '23502')
        checks.append('Missing customer primary key refused (23502)')
        sql("INSERT INTO orders VALUES (199,99,'2026-10-22 12:00+00','pending');", '23503')
        checks.append('Order naming absent customer 99 refused (23503)')
        sql("INSERT INTO order_items VALUES (103,1,'P3',1,4.50);", '23505')
        checks.append('Repeated (103,1) composite primary key refused (23505)')
        sql("INSERT INTO order_items VALUES (199,1,'P3',1,4.50);", '23503')
        sql("INSERT INTO order_items VALUES (103,3,'P99',1,4.50);", '23503')
        checks.append('Line naming absent order or product refused (23503)')
        for value in ['0', '-1', 'NULL']:
            sql(f'UPDATE order_items SET quantity={value} WHERE order_id=103 AND line_no=2;', '23502' if value == 'NULL' else '23514')
            assert sql('SELECT quantity FROM order_items WHERE order_id=103 AND line_no=2;') == '2'
        checks.append('Zero, negative and missing quantity refused; tea line remains 2 after each failure')
        sql("UPDATE products SET price=22.00 WHERE product_id='P7';")
        assert sql("SELECT unit_price FROM order_items WHERE order_id=103 AND line_no=1;") == '20.00'
        checks.append('Changing offered mug price to 22.00 leaves agreed line price at 20.00')
        sql('ALTER TABLE order_items DROP CONSTRAINT order_items_quantity_check; UPDATE order_items SET quantity=0 WHERE order_id=103 AND line_no=2;')
        assert sql('SELECT quantity FROM order_items WHERE order_id=103 AND line_no=2;') == '0'
        checks.append('Counterexample: removing positive CHECK permits zero')
    finally:
        # Attempt a stop even if launch failed part-way through.
        stopped = run(['pg_ctl', '-D', str(data), '-m', 'immediate', '-w', 'stop'])
        status = run(['pg_ctl', '-D', str(data), 'status'])
        assert status.returncode != 0, 'Owned server still running'

assert not work.exists(), 'Disposable files remain'
receipt = {
    'started_utc': started,
    'ended_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'command': 'python3 docs/article-work/relational-reference-test-2026-10-22/verify.py',
    'endpoint': endpoint_data,
    'checks': checks,
    'source_sha256': {str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest() for path in SOURCES},
    'cleanup': 'Owned server stopped; temporary data, private socket and server log removed',
}
RECORD.write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt, indent=2))
