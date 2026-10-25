"""Bounded SQL-only drill. Container lifecycle belongs to the coordinator.

Usage: python3 evidence/native-drill.py FIXTURE.json setup|hold|flush|verify
FIXTURE.json must supply all exact guard values; never defaults to a server.
Run hold in its own streamed process, then flush after UNFINISHED_READY.
Only after flush succeeds may the owner immediately stop/restart the fixture.
Evidence is stdout/stderr, which the caller must retain outside the container.
"""
import json, os, re, subprocess, sys
from pathlib import Path

f = json.loads(Path(sys.argv[1]).read_text())
mode = sys.argv[2]
assert mode in ('setup', 'hold', 'flush', 'verify')
required = ('docker', 'config', 'host', 'container_id', 'name', 'label_key',
            'label_value', 'image_id', 'socket', 'user', 'database',
            'data_directory', 'server_version_num', 'memory', 'nano_cpus', 'pids_limit',
            'cluster_name', 'system_identifier')
assert all(k in f for k in required), 'Missing explicit fixture guard'
assert re.fullmatch(r'[0-9a-f]{64}', f['container_id'])
assert f['database'] not in ('postgres', 'template0', 'template1')
assert f['socket'].startswith('/') and f['data_directory'].startswith('/')
env = {'PATH': '/usr/bin:/bin:/usr/sbin:/sbin'}
base = [f['docker'], '--config', f['config'], '--host', f['host']]
def docker(args, **kw):
    return subprocess.run(base + args, env=env, check=True, timeout=kw.pop('timeout', 40), **kw)
raw = docker(['inspect', f['container_id']], capture_output=True, text=True)
c = json.loads(raw.stdout)[0]
assert c['Id'] == f['container_id'] and c['Name'] == '/' + f['name']
assert c['Config']['Labels'].get(f['label_key']) == f['label_value']
assert c['Image'] == f['image_id'] and c['State']['Running']
assert not c['HostConfig']['AutoRemove']
assert c['HostConfig']['NetworkMode'] == 'none'
assert not c['HostConfig']['PortBindings']
assert c['HostConfig']['Memory'] == f['memory']
assert c['HostConfig']['NanoCpus'] == f['nano_cpus']
assert c['HostConfig']['PidsLimit'] == f['pids_limit']
psql = ['exec', '-i', f['container_id'], 'env', '-i', 'PATH=/usr/local/bin:/usr/bin:/bin',
        'PGAPPNAME=staycurrent-wal-drill-' + mode, 'psql', '-X', '-w',
        '-h', f['socket'], '-U', f['user'], '-d', f['database'],
        '-v', 'ON_ERROR_STOP=1', '-P', 'pager=off']
def sql(s, timeout=40, capture=True):
    return docker(psql, input=s, text=True, capture_output=capture, timeout=timeout)
guard = sql("SELECT json_build_object('database',current_database(),'user',current_user,"
            "'data_directory',current_setting('data_directory'),"
            "'server_version_num',current_setting('server_version_num'),"
            "'listen_addresses',current_setting('listen_addresses'),"
            "'fsync',current_setting('fsync'),'full_page_writes',current_setting('full_page_writes'),"
            "'cluster_name',current_setting('cluster_name'),"
            "'synchronous_standby_names',current_setting('synchronous_standby_names'),"
            "'system_identifier',(SELECT system_identifier::text FROM pg_control_system()));\n")
line = next(x for x in guard.stdout.splitlines() if x.strip().startswith('{'))
g = json.loads(line)
for k in ('database', 'user', 'data_directory', 'server_version_num', 'cluster_name', 'system_identifier'):
    assert str(g[k]) == str(f[k]), (k, g[k])
assert g['listen_addresses'] == '' and g['fsync'] == 'on' and g['full_page_writes'] == 'on'
assert g['synchronous_standby_names'] == ''
if mode != 'setup':
    assert f.get('system_identifier') == g['system_identifier'], 'Require recorded system identifier after setup'
print(json.dumps({'mode': mode, 'container_id': c['Id'], 'guard': g}), flush=True)

if mode == 'setup':
    work = r"""
SET statement_timeout='20s'; SET lock_timeout='2s';
CREATE SCHEMA wal_drill_20261025;
SET search_path=wal_drill_20261025,pg_catalog;
CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0));
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL,placed_at timestamptz NOT NULL,status text NOT NULL);
INSERT INTO orders VALUES(103,1,'2026-10-20 10:15+00','pending');
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text REFERENCES products,quantity integer NOT NULL,unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer REFERENCES orders,amount numeric(8,2) NOT NULL,method text NOT NULL);
CREATE TABLE evidence_marker(label text PRIMARY KEY);
CHECKPOINT;
SELECT checkpoint_lsn,redo_lsn,timeline_id FROM pg_control_checkpoint();
SELECT name,setting,unit FROM pg_settings WHERE name IN ('synchronous_commit','fsync','full_page_writes','wal_sync_method','wal_writer_delay','checkpoint_timeout','max_wal_size','checkpoint_completion_target','log_checkpoints') ORDER BY name;
SELECT pg_current_wal_insert_lsn() AS inserted,pg_current_wal_lsn() AS written,pg_current_wal_flush_lsn() AS flushed;
BEGIN; SET LOCAL synchronous_commit=on;
UPDATE products SET price=22.00 WHERE product_id='P7' RETURNING product_id,price;
COMMIT;
\echo ACKNOWLEDGED_P7_22
SELECT pg_current_wal_insert_lsn() AS inserted,pg_current_wal_lsn() AS written,pg_current_wal_flush_lsn() AS flushed;
SELECT wal_records,wal_fpi,wal_bytes,stats_reset FROM pg_stat_wal;
SELECT num_timed,num_requested,num_done,buffers_written,write_time,sync_time,stats_reset FROM pg_stat_checkpointer;
"""
elif mode == 'hold':
    work = r"""
SET statement_timeout='310s'; SET lock_timeout='2s';
BEGIN; SET LOCAL search_path=wal_drill_20261025,pg_catalog;
UPDATE products SET price=36.00 WHERE product_id='P9' RETURNING product_id,price;
\echo UNFINISHED_READY_P9_36_NO_COMMIT
SELECT pg_sleep(300);
ROLLBACK;
"""
elif mode == 'flush':
    work = r"""
SET statement_timeout='20s'; SET lock_timeout='2s';
SELECT application_name,state,wait_event FROM pg_stat_activity WHERE application_name='staycurrent-wal-drill-hold';
BEGIN; SET LOCAL synchronous_commit=on;
INSERT INTO wal_drill_20261025.evidence_marker VALUES('flush-after-unfinished-update');
COMMIT;
\echo ACKNOWLEDGED_FLUSH_AFTER_UNFINISHED_UPDATE
SELECT pg_current_wal_insert_lsn() AS inserted,pg_current_wal_lsn() AS written,pg_current_wal_flush_lsn() AS flushed;
"""
else:
    work = r"""
SET statement_timeout='20s'; SET lock_timeout='2s';
SET search_path=wal_drill_20261025,pg_catalog;
SELECT product_id,price,stock FROM products ORDER BY product_id;
SELECT o.order_id,o.status,sum(i.quantity*i.unit_price) AS line_total,(SELECT count(*) FROM payments p WHERE p.order_id=o.order_id) AS payments FROM orders o JOIN order_items i USING(order_id) GROUP BY o.order_id,o.status;
DO $$ BEGIN
 IF (SELECT price FROM products WHERE product_id='P7')<>22.00 OR (SELECT price FROM products WHERE product_id='P9')<>35.00 THEN RAISE EXCEPTION 'recovered price mismatch'; END IF;
 IF (SELECT string_agg(stock::text,',' ORDER BY product_id) FROM products)<>'10,0,4' THEN RAISE EXCEPTION 'stock mismatch'; END IF;
 IF (SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103)<>29.00 OR (SELECT status FROM orders WHERE order_id=103)<>'pending' OR EXISTS(SELECT FROM payments) THEN RAISE EXCEPTION 'order mismatch'; END IF;
 IF NOT EXISTS(SELECT FROM evidence_marker WHERE label='flush-after-unfinished-update') THEN RAISE EXCEPTION 'marker missing'; END IF;
END $$;
SELECT checkpoint_lsn,redo_lsn,timeline_id FROM pg_control_checkpoint();
SELECT wal_records,wal_fpi,wal_bytes,stats_reset FROM pg_stat_wal;
\echo VERIFIED_ACKNOWLEDGED_AND_UNFINISHED_RESULTS
"""
def literal(value):
    return "'" + str(value).replace("'", "''") + "'"
checks = [
    ('current_database()', f['database']),
    ('current_user::text', f['user']),
    ("current_setting('data_directory')", f['data_directory']),
    ("current_setting('server_version_num')", f['server_version_num']),
    ("current_setting('cluster_name')", f['cluster_name']),
    ('(SELECT system_identifier::text FROM pg_control_system())', f['system_identifier']),
    ("current_setting('listen_addresses')", ''),
    ("current_setting('fsync')", 'on'),
    ("current_setting('full_page_writes')", 'on'),
    ("current_setting('synchronous_standby_names')", '')
]
session_guard = "SET statement_timeout='20s'; SET lock_timeout='2s';\nDO $guard$ BEGIN\n"
for expression, expected in checks:
    session_guard += f"IF {expression} IS DISTINCT FROM {literal(expected)} THEN RAISE EXCEPTION 'fixture guard failed'; END IF;\n"
session_guard += "END $guard$;\n"
r = sql(session_guard + work, timeout=320 if mode == 'hold' else 40, capture=False)
