"""SQLite rows of the engine-contract table in "Making concurrent changes correct".

Runs class 21's read-then-write race and the instructors' departures in two
connections to one WAL-mode database file, with deferred and immediate
transactions. Standard library only:  python3 -I verify-sqlite.py
"""
import os, sqlite3, sys, tempfile, threading, time

results, failures = [], 0

def check(ok, label, detail=''):
    global failures
    results.append(f"{'ok  ' if ok else 'FAIL'} {label}{' — ' + detail if detail else ''}")
    failures += 0 if ok else 1

def fresh(path):
    for suffix in ('', '-wal', '-shm'):
        if os.path.exists(path + suffix): os.remove(path + suffix)
    db = sqlite3.connect(path, isolation_level=None)
    db.execute('PRAGMA journal_mode = WAL')
    db.executescript("""
      CREATE TABLE classes (class_id INTEGER PRIMARY KEY, capacity INTEGER NOT NULL,
        remaining INTEGER NOT NULL CHECK (remaining BETWEEN 0 AND capacity));
      CREATE TABLE reservations (request_id TEXT PRIMARY KEY, class_id INTEGER NOT NULL, owner_id INTEGER NOT NULL,
        UNIQUE (class_id, owner_id));
      CREATE TABLE instructors (class_id INTEGER, person TEXT, available INTEGER, PRIMARY KEY (class_id, person));
      INSERT INTO classes VALUES (21, 1, 1), (22, 3, 2);
      INSERT INTO reservations VALUES ('R7', 22, 2);
      INSERT INTO instructors VALUES (21, 'Lena', 1), (21, 'Ravi', 1);
    """)
    db.close()

def connect(path, timeout=0.0):
    return sqlite3.connect(path, isolation_level=None, timeout=timeout)

def error_name(e):
    return getattr(e, 'sqlite_errorname', type(e).__name__)

with tempfile.TemporaryDirectory() as tmp:
    path = os.path.join(tmp, 'classes.db')

    # Deferred transactions: both read, Mina writes and commits, Tariq tries to write.
    fresh(path)
    mina, tariq = connect(path), connect(path)
    mina.execute('BEGIN'); tariq.execute('BEGIN')
    m = mina.execute('SELECT remaining FROM classes WHERE class_id = 21').fetchone()[0]
    t = tariq.execute('SELECT remaining FROM classes WHERE class_id = 21').fetchone()[0]
    mina.execute('UPDATE classes SET remaining = 0 WHERE class_id = 21')
    mina.execute("INSERT INTO reservations VALUES ('R8', 21, 1)")
    mina.execute('COMMIT')
    try:
        tariq.execute('UPDATE classes SET remaining = 0 WHERE class_id = 21')
        outcome = 'updated'
    except sqlite3.OperationalError as e:
        outcome = error_name(e)
    tariq.execute('ROLLBACK')
    booked = connect(path).execute('SELECT count(*) FROM reservations WHERE class_id = 21').fetchone()[0]
    check(m == 1 and t == 1 and outcome == 'SQLITE_BUSY_SNAPSHOT' and booked == 1,
          'SQLite WAL, deferred: Tariq read 1, and his write after Mina committed fails', f'{outcome}; bookings for 21: {booked}')

    # Instructors, deferred: the second departure cannot upgrade its old snapshot.
    fresh(path)
    lena, ravi = connect(path), connect(path)
    lena.execute('BEGIN'); ravi.execute('BEGIN')
    a = lena.execute('SELECT count(*) FROM instructors WHERE class_id = 21 AND available').fetchone()[0]
    b = ravi.execute('SELECT count(*) FROM instructors WHERE class_id = 21 AND available').fetchone()[0]
    lena.execute("UPDATE instructors SET available = 0 WHERE person = 'Lena'")
    try:
        ravi.execute("UPDATE instructors SET available = 0 WHERE person = 'Ravi'")
        second = 'updated'
    except sqlite3.OperationalError as e:
        second = error_name(e)
    lena.execute('COMMIT'); ravi.execute('ROLLBACK')
    left = connect(path).execute('SELECT count(*) FROM instructors WHERE available').fetchone()[0]
    check(a == 2 and b == 2 and second.startswith('SQLITE_BUSY') and left == 1,
          'SQLite WAL, deferred: both count 2; Ravi’s write is refused while Lena holds the write lock', f'{second}; available: {left}')

    # BEGIN IMMEDIATE: the second booking waits for the write lock, then reads 0.
    fresh(path)
    mina = connect(path)
    mina.execute('BEGIN IMMEDIATE')
    mina.execute('SELECT remaining FROM classes WHERE class_id = 21').fetchone()
    seen = {}
    def tariq_books():
        tariq = connect(path, timeout=5)
        start = time.monotonic()
        tariq.execute('BEGIN IMMEDIATE')
        seen['waited'] = time.monotonic() - start
        seen['remaining'] = tariq.execute('SELECT remaining FROM classes WHERE class_id = 21').fetchone()[0]
        tariq.execute('ROLLBACK')
    thread = threading.Thread(target=tariq_books); thread.start()
    time.sleep(0.3)
    mina.execute('UPDATE classes SET remaining = 0 WHERE class_id = 21')
    mina.execute("INSERT INTO reservations VALUES ('R8', 21, 1)")
    mina.execute('COMMIT')
    thread.join()
    check(seen.get('waited', 0) >= 0.25 and seen.get('remaining') == 0,
          'SQLite BEGIN IMMEDIATE: Tariq waits for the write lock, then reads 0 and can decline', f"waited {seen.get('waited', 0):.2f} s, read {seen.get('remaining')}")

print(f'SQLite {sqlite3.sqlite_version}')
print('\n'.join(results))
print('All checks passed.' if failures == 0 else f'{failures} check(s) failed.')
sys.exit(1 if failures else 0)
