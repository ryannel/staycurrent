"""Bounded PostgreSQL selection evidence; owns only rel3_a08_run1/restore1."""
import concurrent.futures, json, pathlib, subprocess, tempfile

BIN = pathlib.Path('/opt/homebrew/Cellar/postgresql@18/18.6_1/bin')
BASE = ['-h', '127.0.0.1', '-p', '57319', '-U', 'staycurrent']
HERE = pathlib.Path(__file__).parent

def command(name, *args, data=None, check=True):
    return subprocess.run([str(BIN/name), *BASE, *args], input=data, text=True, capture_output=True, check=check)

def sql(query, db='rel3_a08_run1', check=True):
    return command('psql', '--no-psqlrc', '-XAt', '-v', 'ON_ERROR_STOP=1', '-d', db, data=query, check=check)

command('createdb', 'rel3_a08_run1')
sql('''CREATE TABLE inventory (sku text PRIMARY KEY, available integer NOT NULL CHECK (available >= 0));
CREATE TABLE reservations (request_id text PRIMARY KEY, sku text NOT NULL REFERENCES inventory, amount numeric(12,2) NOT NULL CHECK (amount > 0));
INSERT INTO inventory VALUES ('P7', 7);''')
settings = sql("SELECT name || '=' || setting FROM pg_settings WHERE name IN ('server_version','max_connections','superuser_reserved_connections','reserved_connections','fsync','full_page_writes','synchronous_commit','synchronous_standby_names','default_transaction_isolation','statement_timeout','lock_timeout','idle_in_transaction_session_timeout') ORDER BY name;").stdout.splitlines()
negative = {}
for label, query, state in [
    ('negative_stock', "UPDATE inventory SET available=-1 WHERE sku='P7';", '23514'),
    ('orphan_reservation', "INSERT INTO reservations VALUES ('bad','missing',20);", '23503'),
    ('null_amount', "INSERT INTO reservations VALUES ('bad','P7',NULL);", '23502')]:
    result = sql('\\set VERBOSITY verbose\n'+query, check=False)
    assert result.returncode != 0 and state in result.stderr, result.stderr
    negative[label] = state

def reserve(request):
    query = f"WITH claimed AS (UPDATE inventory SET available=available-1 WHERE sku='P7' AND available>0 RETURNING sku) INSERT INTO reservations SELECT '{request}',sku,20.00 FROM claimed RETURNING request_id;"
    return sql(query).stdout

reserve('first')
duplicate = sql("\\set VERBOSITY verbose\nWITH claimed AS (UPDATE inventory SET available=available-1 WHERE sku='P7' AND available>0 RETURNING sku) INSERT INTO reservations SELECT 'first',sku,20.00 FROM claimed;", check=False)
assert duplicate.returncode and '23505' in duplicate.stderr
assert sql("SELECT available FROM inventory WHERE sku='P7';").stdout.strip() == '6'

def worker(n):
    return sql('\n'.join(f"WITH claimed AS (UPDATE inventory SET available=available-1 WHERE sku='P7' AND available>0 RETURNING sku) INSERT INTO reservations SELECT 'w{n}-{i}',sku,20.00 FROM claimed RETURNING request_id;" for i in range(25))).stdout

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    outcomes = list(pool.map(worker, range(4)))
expected = "SELECT json_build_object('stock',(SELECT available FROM inventory WHERE sku='P7'),'reservations',(SELECT count(*) FROM reservations),'amount',(SELECT sum(amount) FROM reservations))::text;"
state = json.loads(sql(expected).stdout.strip())
assert state == {'stock': 0, 'reservations': 7, 'amount': 140.00}, state
command('createdb', 'rel3_a08_restore1')
with tempfile.TemporaryDirectory(prefix='rel3-a08-') as folder:
    dump = pathlib.Path(folder)/'selection.dump'
    command('pg_dump', '-Fc', '--no-owner', '--no-acl', '-d', 'rel3_a08_run1', '-f', str(dump))
    command('pg_restore', '--no-owner', '--no-acl', '-d', 'rel3_a08_restore1', str(dump))
    restored = json.loads(sql(expected, db='rel3_a08_restore1').stdout.strip())
    assert restored == state
    rows = "SELECT request_id,sku,amount FROM reservations ORDER BY request_id;"
    assert sql(rows).stdout == sql(rows, db='rel3_a08_restore1').stdout
record = {'date':'2026-10-19','path':'psql 18.6/libpq, direct IPv4 loopback, no TLS or pooler; shared disposable native server', 'settings':settings,'rejected_cases':negative,'duplicate_request_sqlstate':'23505; stock stayed 6','attempts':'one initial request, one rejected duplicate, then 100 distinct requests across four persistent psql sessions (25 each)', 'final':state,'logical_restore':'all seven ordered reservation rows and stock matched in fresh database on same server','limits':['Not application driver/ORM or deployed network','No representative-volume latency or capacity result','No process, disk, zone or region failure exercised','Logical restore on same host proves neither host-loss recovery nor point-in-time recovery']}
(HERE/'observed.json').write_text(json.dumps(record, indent=2)+'\n')
print(json.dumps(record, indent=2))
command('dropdb', 'rel3_a08_restore1')
command('dropdb', 'rel3_a08_run1')
