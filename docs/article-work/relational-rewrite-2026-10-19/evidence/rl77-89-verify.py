"""Run author-owned draft examples against a caller-selected disposable cluster.
Usage: python3 rl77-89-verify.py /absolute/lab/root
The cluster must be ours, PostgreSQL 18, port 56679. Default services are unused.
"""
from pathlib import Path
import sys,re,ctypes,ctypes.util,subprocess,sqlite3,platform
work=Path(__file__).parent
root=work.parents[3]
lab=Path(sys.argv[1])
lib=ctypes.CDLL('/opt/homebrew/opt/postgresql@18/lib/postgresql/libpq.dylib')
lib.PQconnectdb.argtypes=[ctypes.c_char_p];lib.PQconnectdb.restype=ctypes.c_void_p
lib.PQexec.argtypes=[ctypes.c_void_p,ctypes.c_char_p];lib.PQexec.restype=ctypes.c_void_p
for name in ['PQresultStatus','PQntuples','PQnfields']:
 getattr(lib,name).argtypes=[ctypes.c_void_p];getattr(lib,name).restype=ctypes.c_int
for name in ['PQfname','PQgetvalue']:
 getattr(lib,name).restype=ctypes.c_char_p
lib.PQfname.argtypes=[ctypes.c_void_p,ctypes.c_int]
lib.PQgetvalue.argtypes=[ctypes.c_void_p,ctypes.c_int,ctypes.c_int]
lib.PQresultErrorMessage.argtypes=[ctypes.c_void_p];lib.PQresultErrorMessage.restype=ctypes.c_char_p
lib.PQresultErrorField.argtypes=[ctypes.c_void_p,ctypes.c_int];lib.PQresultErrorField.restype=ctypes.c_char_p
lib.PQclear.argtypes=[ctypes.c_void_p];lib.PQfinish.argtypes=[ctypes.c_void_p]
connection=f'host={lab} port=56679 dbname=postgres user={subprocess.check_output(["whoami"],text=True).strip()}'
def connect():return lib.PQconnectdb(connection.encode())
def query(conn,sql,expected_error=None):
 res=lib.PQexec(conn,sql.encode());status=lib.PQresultStatus(res)
 out=['SQL: '+sql.strip()]
 if status not in (1,2):
  code=lib.PQresultErrorField(res,ord('C')).decode();err=lib.PQresultErrorMessage(res).decode().strip()
  out.append('SQLSTATE '+code+' '+err)
  if code!=expected_error: raise RuntimeError('\n'.join(out))
 else:
  if expected_error:raise RuntimeError('Expected error '+expected_error)
  n=lib.PQnfields(res)
  if n:
   out.append(' | '.join(lib.PQfname(res,j).decode() for j in range(n)))
   for i in range(lib.PQntuples(res)):
    out.append(' | '.join(lib.PQgetvalue(res,i,j).decode() for j in range(n)))
   out.append(f'({lib.PQntuples(res)} rows)')
  else:out.append('OK')
 lib.PQclear(res);return '\n'.join(out)+'\n\n'
def statements(s):
 # This commission's SQL blocks have no procedural or quoted semicolons.
 return [q.strip()+';' for q in s.split(';') if q.strip()]
summary=[]
for num in [77,78,79,80,81,82,84,87,89]:
 md=(root/f'src/drafts/relational/rl{num}.md').read_text()
 blocks=re.findall(r'```sql\n(.*?)```',md,re.S)
 sql='\n\n'.join(blocks)
 if num==84:
  sql+='''
CREATE TEMP TABLE import_conflicts AS
SELECT tenant_id,booking_id,revision FROM import_valid
GROUP BY tenant_id,booking_id,revision HAVING count(DISTINCT status)>1;
CREATE TEMP TABLE import_candidates AS
SELECT DISTINCT ON (v.tenant_id,v.booking_id)
 v.* FROM import_valid v
WHERE NOT EXISTS (SELECT 1 FROM import_conflicts c
 WHERE (c.tenant_id,c.booking_id,c.revision)=(v.tenant_id,v.booking_id,v.revision))
ORDER BY v.tenant_id,v.booking_id,v.revision DESC,v.source_row;
CREATE TEMP TABLE import_outcomes AS
SELECT r.source_row,
 CASE WHEN v.source_row IS NULL THEN 'malformed'
 WHEN EXISTS (SELECT 1 FROM import_conflicts c WHERE
 (c.tenant_id,c.booking_id,c.revision)=(v.tenant_id,v.booking_id,v.revision)) THEN 'contradictory'
 WHEN EXISTS (SELECT 1 FROM import_valid d WHERE
 (d.tenant_id,d.booking_id,d.revision,d.status)=(v.tenant_id,v.booking_id,v.revision,v.status)
 AND d.source_row<v.source_row) THEN 'duplicate'
 WHEN v.source_row<>c.source_row THEN 'superseded'
 WHEN b.revision>v.revision THEN 'stale'
 WHEN b.revision=v.revision AND b.status<>v.status THEN 'destination disagreement'
 WHEN b.revision=v.revision THEN 'already present'
 ELSE 'applied' END AS outcome
FROM import_raw r LEFT JOIN import_valid v USING(source_row)
LEFT JOIN import_candidates c ON (c.tenant_id,c.booking_id)=(v.tenant_id,v.booking_id)
LEFT JOIN bookings b ON (b.tenant_id,b.booking_id)=(v.tenant_id,v.booking_id);
SELECT * FROM import_outcomes ORDER BY source_row;
INSERT INTO bookings AS current
SELECT tenant_id,booking_id,status,revision FROM import_candidates
ON CONFLICT (tenant_id,booking_id) DO UPDATE
SET status=excluded.status,revision=excluded.revision
WHERE excluded.revision>current.revision
RETURNING *;
SELECT * FROM bookings ORDER BY booking_id;
INSERT INTO bookings AS current
SELECT tenant_id,booking_id,status,revision FROM import_candidates
ON CONFLICT (tenant_id,booking_id) DO UPDATE
SET status=excluded.status,revision=excluded.revision
WHERE excluded.revision>current.revision RETURNING *;
SELECT * FROM bookings ORDER BY booking_id;
'''
 (work/f'rl{num}.sql').write_text('-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.\n'+sql)
 conn=connect();out=query(conn,'SELECT version();')
 out+=query(conn,f'DROP SCHEMA IF EXISTS author_rl{num} CASCADE; CREATE SCHEMA author_rl{num}; SET search_path=author_rl{num}; SET TIME ZONE \'UTC\';')
 failures=0
 for q in statements(sql):
  expected=None
  if num==79 and q.startswith('INSERT INTO bookings VALUES'):
   if ",0,'confirmed'" in q: expected='23514'
   elif ',NULL,' in q:expected='23502'
   elif "'b17'" in q and 'b17' in out:expected='23505' # initial is detected below
   elif "'s8'" in q:expected='23503'
   if "('t4','b17',42,'s7',1,'confirmed')" in q:
    if failures==0:expected=None;failures=1
    else:expected='23505'
  if num==89 and q.startswith('INSERT INTO sessions VALUES') and "'s9'" in q:expected='23514'
  out+=query(conn,q,expected)
 # meaningful additional variations that are mentioned in prose
 if num==84:
  out+=query(conn,"UPDATE sessions SET remaining=remaining-1 WHERE tenant_id='t4' AND session_id='s7' AND remaining>=1 RETURNING remaining;")
  out+=query(conn,"UPDATE sessions SET remaining=remaining-1 WHERE tenant_id='t4' AND session_id='s7' AND remaining>=1 RETURNING remaining;")
  out+=query(conn,"UPDATE bookings SET status='confirmed',revision=revision+1 WHERE tenant_id='t4' AND booking_id='b17' AND revision=7 RETURNING *;")
 if num==78:
  out+=query(conn,"SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM payments WHERE false) ORDER BY order_id;")
  out+=query(conn,"SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM payments WHERE order_id IS NULL);")
 if num==80:
  out+=query(conn,"SELECT a.valid_from,b.valid_from FROM price_history a JOIN price_history b ON a.tenant_id=b.tenant_id AND a.product_id=b.product_id AND a.valid_from<b.valid_from AND a.valid_from<b.valid_to AND b.valid_from<a.valid_to;")
 if num==82:
  out+=query(conn,"SELECT count(*),sum(total) FROM orders WHERE false;")
  out+=query(conn,"UPDATE orders SET total=30 WHERE order_id='o82';")
  out+=query(conn,"SELECT order_id,total,rank() OVER (ORDER BY total DESC) AS rank,dense_rank() OVER (ORDER BY total DESC) AS dense_rank FROM orders ORDER BY total DESC,order_id;")
 if num==87:
  out+=query(conn,"SET work_mem='64kB';")
  out+=query(conn,"EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) SELECT * FROM events ORDER BY payload,event_id;")
 lib.PQfinish(conn);(work/f'rl{num}-native.txt').write_text(out);summary.append(f'RL{num}: executed {len(statements(sql))} statements plus documented variations')
# Two real connections prove both Read Committed change and Repeatable Read stability.
a,b=connect(),connect();out=query(a,'SELECT version();')
setup=re.findall(r'```sql\n(.*?)```',(root/'src/drafts/relational/rl83.md').read_text(),re.S)[0]
out+=query(a,'DROP SCHEMA IF EXISTS author_rl83 CASCADE; CREATE SCHEMA author_rl83; SET search_path=author_rl83; SET TIME ZONE \'UTC\';')
out+=query(b,"SET search_path=author_rl83; SET TIME ZONE 'UTC';")
for q in statements(setup):out+=query(a,q)
out+='CONNECTION B: insert before boundary\n'+query(b,"INSERT INTO orders VALUES ('t4','o86','2026-10-19 13:00+00',60);")
out+=query(a,"SELECT order_id FROM orders WHERE tenant_id='t4' ORDER BY placed_at DESC,order_id DESC OFFSET 2 LIMIT 2;")
out+=query(a,"SELECT order_id FROM orders WHERE tenant_id='t4' AND (placed_at,order_id)<('2026-10-19 12:00+00'::timestamptz,'o84') ORDER BY placed_at DESC,order_id DESC LIMIT 2;")
out+='CONNECTION B: move unseen order ahead of boundary\n'+query(b,"UPDATE orders SET placed_at='2026-10-19 14:00+00' WHERE order_id='o82';")
out+=query(a,"SELECT order_id FROM orders WHERE tenant_id='t4' AND (placed_at,order_id)<('2026-10-19 12:00+00'::timestamptz,'o84') ORDER BY placed_at DESC,order_id DESC LIMIT 2;")
out+='CONNECTION A: snapshot begins at first read\n'+query(a,'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;')
out+=query(a,"SELECT order_id,total FROM orders ORDER BY order_id;")
out+='CONNECTION B: commits correction and insert\n'+query(b,"UPDATE orders SET total=44 WHERE order_id='o81'; INSERT INTO orders VALUES ('t4','o87','2026-10-19 15:00+00',70);")
out+='CONNECTION A: same old values and membership\n'+query(a,"SELECT order_id,total FROM orders ORDER BY order_id;")
out+=query(a,"DECLARE export_orders NO SCROLL CURSOR FOR SELECT order_id,total FROM orders WHERE tenant_id='t4' ORDER BY placed_at,order_id;")
out+=query(a,'FETCH FORWARD 2 FROM export_orders;');out+=query(a,'FETCH FORWARD 2 FROM export_orders;');out+=query(a,'CLOSE export_orders;');out+=query(a,'COMMIT;')
out+='CONNECTION A: fresh snapshot\n'+query(a,"SELECT order_id,total FROM orders ORDER BY order_id;")
for conn in [a,b]:lib.PQfinish(conn)
(work/'rl83-native.txt').write_text(out);summary.append('RL83: real two-connection insert, movement and snapshot histories executed')
# Execute the complete Python driver binding/batching example, using standard-library SQLite.
md=(root/'src/drafts/relational/rl85.md').read_text();code='\n\n'.join(re.findall(r'```python\n(.*?)```',md,re.S))
(work/'rl85-driver.py').write_text(code+'\ncon.close()\n')
r=subprocess.run([sys.executable,str(work/'rl85-driver.py')],text=True,capture_output=True,check=True)
(work/'rl85-driver.txt').write_text(f'Python {platform.python_version()}, SQLite {sqlite3.sqlite_version}\n'+r.stdout)
conn=connect();out=query(conn,'SELECT version();')
out+=query(conn,"DROP SCHEMA IF EXISTS author_rl85 CASCADE; CREATE SCHEMA author_rl85; SET search_path=author_rl85;")
cursor_sql=re.findall(r'```sql\n(.*?)```',md,re.S)[-1]
for q in statements(cursor_sql):out+=query(conn,q,'34000' if q.startswith('FETCH') and 'COMMIT;' in out else None)
lib.PQfinish(conn);(work/'rl85-native.txt').write_text(out);summary.append('RL85: Python driver injection and batching executed; PostgreSQL cursor lifetime error verified')
(work/'rl77-89-execution-summary.txt').write_text('\n'.join(summary)+'\n')
print('\n'.join(summary))

con=sqlite3.connect(":memory:")
con.executescript("CREATE TABLE money(amount DECIMAL(10,2)); INSERT INTO money VALUES (1.005);")
results=[("decimal affinity",con.execute("SELECT amount,typeof(amount) FROM money").fetchall()),("ASCII and Unicode NOCASE",con.execute("SELECT 'Ada'='ada' COLLATE NOCASE,'Æ'='æ' COLLATE NOCASE").fetchall()),("binary float",con.execute("SELECT 0.1+0.2=0.3").fetchall())]
(work/'rl78-sqlite.txt').write_text(f"Python {platform.python_version()}, SQLite {sqlite3.sqlite_version}\n"+'\n'.join(str(x) for x in results)+'\n')
con.close()
