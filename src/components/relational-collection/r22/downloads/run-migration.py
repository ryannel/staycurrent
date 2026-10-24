#!/usr/bin/env python3
"""A local PostgreSQL migration experiment. Uses no Python packages.
Run: python3 run-migration.py --bindir /path/to/postgresql/bin
The private temporary cluster is removed even if a check fails.
"""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir', required=True, type=Path)
args = parser.parse_args()
started = time.monotonic()
env = {k: v for k, v in os.environ.items() if not k.startswith('PG')}
base = Path(tempfile.mkdtemp(prefix='staycurrent-r22-'))
base.chmod(0o700)
data = base / 'data'
sock = base / 'socket'
sock.mkdir(mode=0o700)
port = '55422'
owned = False

def tool(name, *rest, **kwargs):
    return subprocess.run([str(args.bindir / name), *map(str, rest)], env=env,
                          text=True, capture_output=True, check=True, timeout=30, **kwargs)

def command(sql, *, app='r22-check', check=True):
    cmd = [str(args.bindir / 'psql'), '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1',
           '-h', str(sock), '-p', port, '-U', 'r22_owner', '-d', 'postgres', '-c', sql]
    result = subprocess.run(cmd, env={**env, 'PGAPPNAME': app}, text=True,
                            capture_output=True, timeout=15)
    if check and result.returncode:
        raise RuntimeError(result.stderr)
    return result

def scalar(sql):
    return command(sql).stdout.strip()

def expect(sql, answer):
    actual = scalar(sql)
    assert actual == str(answer), (sql, actual, answer)

BRIDGE = """
CREATE FUNCTION fill_minor() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.unit_price_minor := (NEW.unit_price * 100)::bigint;
  RETURN NEW;
END $$;
CREATE TRIGGER fill_minor BEFORE INSERT OR UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION fill_minor();
ALTER TABLE order_items ADD CONSTRAINT price_pair
CHECK (unit_price_minor IS NOT NULL
       AND unit_price_minor::numeric = unit_price * 100) NOT VALID;
"""
BATCH = """
WITH batch AS (
  SELECT order_id, line_no FROM order_items
  WHERE unit_price_minor IS NULL
  ORDER BY order_id, line_no
  LIMIT 2 FOR UPDATE SKIP LOCKED
)
UPDATE order_items AS i
SET unit_price_minor = (i.unit_price * 100)::bigint
FROM batch AS b
WHERE i.order_id = b.order_id AND i.line_no = b.line_no
  AND i.unit_price_minor IS NULL
RETURNING i.order_id, i.line_no, i.unit_price_minor;
"""

try:
    print(tool('postgres', '--version').stdout.strip())
    tool('initdb', '-D', data, '-A', 'trust', '-U', 'r22_owner', '--no-locale')
    tool('pg_ctl', '-D', data, '-l', base / 'server.log', '-o',
         f"-k {sock} -p {port} -c listen_addresses='' -c max_connections=12", '-w', 'start')
    owned = True
    assert Path(scalar('SHOW data_directory')).resolve() == data.resolve()
    assert scalar('SELECT current_user') == 'r22_owner'
    assert scalar('SHOW unix_socket_directories') == str(sock)
    print('Ownership verified: private data directory, socket, role; inherited PG settings cleared.')
    core = json.loads(Path(__file__).with_name('shop.json').read_text())
    values = ','.join(f"({r['order_id']},{r['line_no']},'{r['product_id']}',{r['quantity']},{r['unit_price']})"
                      for r in core['order_items'])
    fixture = """DROP TABLE IF EXISTS order_items CASCADE;
    DROP FUNCTION IF EXISTS fill_minor();
    CREATE TABLE order_items (
      order_id integer, line_no integer, product_id text NOT NULL,
      quantity integer NOT NULL CHECK (quantity > 0),
      unit_price numeric(8,2) NOT NULL, unit_price_minor bigint,
      PRIMARY KEY (order_id, line_no)
    );""" + 'INSERT INTO order_items (order_id,line_no,product_id,quantity,unit_price) VALUES ' + values
    # A minimal projection of core lines; unrelated parent relations are omitted.
    command(fixture)
    saved = scalar('SELECT (unit_price*100)::bigint FROM order_items WHERE order_id=103 AND line_no=1')
    command('UPDATE order_items SET unit_price=21.00 WHERE order_id=103 AND line_no=1', app='r22-editor')
    command(f'UPDATE order_items SET unit_price_minor={saved} WHERE order_id=103 AND line_no=1')
    expect('SELECT unit_price::text || \'/\' || unit_price_minor FROM order_items WHERE order_id=103 AND line_no=1', '21.00/2000')
    print('Counterexample: copying saved 2000 after another writer stored 21.00 leaves a mismatched pair.')
    command(fixture)
    command('DELETE FROM order_items WHERE order_id=101 AND line_no=1')
    command('UPDATE order_items SET unit_price_minor=(unit_price*100)::bigint')
    expect('SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL', 0)
    command("INSERT INTO order_items (order_id,line_no,product_id,quantity,unit_price) VALUES (101,1,'P3',1,4.50)")
    expect('SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL', 1)
    print('Counterexample: zero missing rows, then a late old-format insert below the cursor creates one missing pair.')
    command(fixture)
    command(BRIDGE)
    command('BEGIN; ' + BATCH + ' ROLLBACK;')
    expect('SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL', 5)
    print('An interrupted batch rolled back; all five rows remained eligible.')
    # Hold a row that a backfill wants. Observe its actual lock wait before release.
    holder = subprocess.Popen([str(args.bindir/'psql'), '-X', '-q', '-A', '-t',
        '-v', 'ON_ERROR_STOP=1', '-h', str(sock), '-p', port, '-U', 'r22_owner',
        '-d', 'postgres'], env={**env, 'PGAPPNAME':'r22-editor'}, text=True,
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=1)
    holder.stdin.write("BEGIN; UPDATE order_items SET unit_price=21.00 WHERE order_id=103 AND line_no=1;\n\\echo HELD\n")
    holder.stdin.flush()
    assert holder.stdout.readline().strip() == 'HELD'
    blocked = subprocess.Popen([str(args.bindir/'psql'), '-X', '-A', '-t',
        '-v','ON_ERROR_STOP=1','-h',str(sock),'-p',port,'-U','r22_owner','-d','postgres',
        '-c',"UPDATE order_items SET unit_price_minor=(unit_price*100)::bigint WHERE order_id=103 AND line_no=1 AND unit_price_minor IS NULL RETURNING unit_price_minor"],
        env={**env,'PGAPPNAME':'r22-backfill'}, text=True, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    deadline = time.monotonic() + 5
    while scalar("SELECT count(*) FROM pg_stat_activity WHERE application_name='r22-backfill' AND wait_event_type='Lock'") != '1':
        assert time.monotonic() < deadline, 'backfill did not reach the expected lock wait'
        time.sleep(.02)
    # SKIP LOCKED can finish a batch without this locked missing row.
    command(BATCH)
    command(BATCH)
    expect('SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL', 1)
    holder.stdin.write('COMMIT;\n\\q\n')
    holder.stdin.flush()
    holder.communicate(timeout=10)
    result, error = blocked.communicate(timeout=10)
    assert blocked.returncode == 0, error
    assert '2100' not in result, result  # condition recheck skips the now-filled row
    expect('SELECT unit_price::text || \'/\' || unit_price_minor FROM order_items WHERE order_id=103 AND line_no=1', '21.00/2100')
    print('Observed lock wait: editor bridge wrote 21.00/2100; waiting backfill rechecked NULL and changed no row.')
    command("DELETE FROM order_items WHERE order_id=101 AND line_no=1")
    command("INSERT INTO order_items (order_id,line_no,product_id,quantity,unit_price) VALUES (101,1,'P3',1,4.50)")
    expect('SELECT unit_price_minor FROM order_items WHERE order_id=101 AND line_no=1', 450)
    command(BATCH)
    expect('SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL OR unit_price_minor::numeric IS DISTINCT FROM unit_price*100', 0)
    command('ALTER TABLE order_items VALIDATE CONSTRAINT price_pair')
    expect("SELECT convalidated FROM pg_constraint WHERE conname='price_pair'", 't')
    # Prove the guard itself rejects bypass, independently of the bridge.
    command('ALTER TABLE order_items DISABLE TRIGGER fill_minor')
    refused = command('UPDATE order_items SET unit_price_minor=7 WHERE order_id=103 AND line_no=1',check=False)
    assert refused.returncode != 0 and 'price_pair' in refused.stderr
    command('ALTER TABLE order_items ENABLE TRIGGER fill_minor')
    print('Validated pair constraint; a mismatched write with bridge disabled was refused.')
    # Old-format writers have now been retired; demonstrate final schema alone.
    command('DROP TRIGGER fill_minor ON order_items; ALTER TABLE order_items ALTER COLUMN unit_price_minor SET NOT NULL; ALTER TABLE order_items DROP CONSTRAINT price_pair; ALTER TABLE order_items DROP COLUMN unit_price; DROP FUNCTION fill_minor();')
    command('UPDATE order_items SET unit_price_minor=2100 WHERE order_id=103 AND line_no=1')
    expect('SELECT sum(quantity*unit_price_minor) FROM order_items WHERE order_id=103', 3000)
    print('Scratch changed-price branch total: 3000 hundredths, including the deliberate 21.00 mug edit.')
    # Restore core before recording the canonical displayed conversion.
    command(fixture)
    command(BRIDGE)
    while scalar('SELECT count(*) FROM order_items WHERE unit_price_minor IS NULL') != '0':
        command(BATCH)
    command('ALTER TABLE order_items VALIDATE CONSTRAINT price_pair')
    expect('SELECT sum(quantity*unit_price_minor) FROM order_items WHERE order_id=103', 2900)
    expect('SELECT string_agg(unit_price_minor::text,\',\' ORDER BY order_id,line_no) FROM order_items','450,3500,2000,2000,450')
    print('Canonical core result: 450,3500,2000,2000,450; order 103 total 2900 hundredths = 29.00.')
    print('PASS all migration checks; local functional schedules, no production timing claim.')
finally:
    if owned:
        tool('pg_ctl', '-D', data, '-m', 'immediate', '-w', 'stop')
    shutil.rmtree(base)
    print(f'Owned cluster removed. Elapsed {time.monotonic()-started:.3f}s.')
