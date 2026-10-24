#!/usr/bin/env python3
"""Run the delivered worksheet on an owned Unix-socket-only PostgreSQL instance."""
import datetime, hashlib, json, os, pathlib, shutil, subprocess, tempfile, time
root = pathlib.Path(__file__).resolve().parents[1]
bin_dir = pathlib.Path('/opt/homebrew/opt/postgresql@18/bin')
env = {key: value for key, value in os.environ.items() if not key.startswith('PG') and key not in ('DATABASE_URL', 'DB_URL')}
owned = pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r02-pg-', dir='/private/tmp'))
data = owned / 'data'; socket = owned / 'socket'; socket.mkdir()
port = '55482'
start = time.monotonic()
record = {'started_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'owned_directory': str(owned), 'connection': 'Private Unix socket, TCP disabled, inherited PG* and database URL settings removed'}
def run(args, **kwargs):
    result = subprocess.run([str(x) for x in args], env=env, text=True, capture_output=True, **kwargs)
    if result.returncode:
        raise RuntimeError(f'{args[0]} failed: {result.stdout} {result.stderr}')
    return result
def sql(query):
    return run([bin_dir/'psql','-X','-A','-t','-h',socket,'-p',port,'-d','postgres','-v','ON_ERROR_STOP=1','-c',query]).stdout.strip()
started = False
try:
    run([bin_dir/'initdb','-D',data,'-A','trust','--encoding=UTF8','--locale=C'])
    run([bin_dir/'pg_ctl','-D',data,'-l',owned/'server.log','-o',f"-k {socket} -p {port} -c listen_addresses=''",'-w','start'])
    started = True
    actual = sql("SELECT current_setting('data_directory');")
    assert pathlib.Path(actual).resolve() == data.resolve(), (actual, data)
    record['ownership_verified_before_mutation'] = actual
    record['server_version'] = sql('SHOW server_version;')
    assert record['server_version'].startswith('18.6')
    record['system_identifier'] = sql('SELECT system_identifier FROM pg_control_system();')
    worksheet = root/'src/components/relational-collection/r02/downloads/values-experiment.sql'
    record['worksheet_sha256'] = hashlib.sha256(worksheet.read_bytes()).hexdigest()
    result = run([bin_dir/'psql','-X','-h',socket,'-p',port,'-d','postgres','-v','ON_ERROR_STOP=1','-f',worksheet])
    (root/'evidence/native-results.txt').write_text(result.stdout + '\n' + result.stderr)
    assert result.stderr.count('PASS:') == 4, result.stderr
    # Compare the browser model's every scalar result to native PostgreSQL, using
    # the same centrally supplied variant and exact SQL expressions it presents.
    variant = json.loads((root/'src/lib/relational-collection/values.json').read_text())
    expr = ["delivery_note = ''", "delivery_note <> ''", "NOT (delivery_note = '')", 'delivery_note IS NULL', "delivery_note <> '' OR delivery_note IS NULL", "delivery_note IS DISTINCT FROM ''"]
    rows = ','.join(f"({r['order_id']},{'NULL::text' if r['delivery_note'] is None else chr(39)+r['delivery_note'].replace(chr(39),chr(39)*2)+chr(39)})" for r in variant['orders'])
    matrix = json.loads(sql('SELECT json_agg(x) FROM (SELECT order_id, '+','.join(f'({x}) AS p{i}' for i,x in enumerate(expr))+f' FROM (VALUES {rows}) AS v(order_id,delivery_note) ORDER BY order_id) x;'))
    (root/'evidence/predicate-native.json').write_text(json.dumps(matrix, indent=2)+'\n')
    checks = {
      'exact_and_approximate': "SELECT (0.1::numeric+0.2::numeric=0.3::numeric) AND NOT (0.1::float8+0.2::float8=0.3::float8);",
      'scale_rounding': "SELECT 1.005::numeric(8,2)=1.01;",
      'rounding_point': "SELECT round(3*0.335::numeric,2)=1.01 AND 3*round(0.335::numeric,2)=1.02;",
      'stockholm_day': "SELECT timestamptz '2026-10-25 00:00 Europe/Stockholm'=timestamptz '2026-10-24 22:00Z' AND timestamptz '2026-10-26 00:00 Europe/Stockholm'=timestamptz '2026-10-25 23:00Z';",
      's501': "SELECT timestamptz '2026-11-04 18:00Z' AT TIME ZONE 'Europe/Stockholm'=timestamp '2026-11-04 19:00';",
      'unicode': "SELECT NOT ('café' COLLATE \"C\"=('cafe'||chr(769))) AND normalize('café',NFC) COLLATE \"C\"=normalize('cafe'||chr(769),NFC);",
      'null_comparisons': "SELECT (NULL::text=NULL::text) IS NULL AND (NULL::text IS NOT DISTINCT FROM NULL::text) AND (7 NOT IN (3,NULL)) IS NULL;"
    }
    record['assertions'] = {name: sql(query) for name, query in checks.items()}
    assert set(record['assertions'].values()) == {'t'}
    record['outcome'] = 'pass'
finally:
    if started:
        run([bin_dir/'pg_ctl','-D',data,'-m','fast','-w','stop'])
    shutil.rmtree(owned)
    record['owned_server_stopped_and_directory_removed'] = not owned.exists()
    record['elapsed_seconds'] = round(time.monotonic()-start, 3)
    (root/'evidence/native-run.json').write_text(json.dumps(record,indent=2)+'\n')
