"""Controlled PostgreSQL sessions for a03. No server settings are changed.
Usage: python3 verify.py postgresql://staycurrent@127.0.0.1:57319/rel3_a03_run1
The target must be a fresh disposable database created by the caller.
"""
import pathlib, queue, socket, struct, subprocess, sys, threading, time

HERE = pathlib.Path(__file__).parent
URI = sys.argv[1]
PSQL = '/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/psql'
sessions = []

class Session:
    def __init__(self, name, uri=URI):
        self.name, self.n = name, 0
        self.p = subprocess.Popen([PSQL, '-X', '-A', '-t', '-v', 'VERBOSITY=verbose', uri],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
        self.q = queue.Queue()
        def reader():
            for line in self.p.stdout:
                self.q.put(line.rstrip())
        threading.Thread(target=reader, daemon=True).start()
        sessions.append(self)
        self.run("SET application_name = 'a03_" + name + "';")
    def send(self, sql):
        self.n += 1
        self.marker = f'END_{self.name}_{self.n}'
        print(f'[{self.name}] {sql}', flush=True)
        self.p.stdin.write(sql + '\n\\echo ' + self.marker + '\n')
        self.p.stdin.flush()
    def finish(self):
        lines = []
        while True:
            line = self.q.get(timeout=12)
            if line == self.marker:
                break
            lines.append(line)
        print('\n'.join(f'[{self.name}] => {x}' for x in lines), flush=True)
        return '\n'.join(lines)
    def run(self, sql):
        self.send(sql)
        return self.finish()
    def close(self):
        if self.p.poll() is None:
            self.p.stdin.write('ROLLBACK;\n\\q\n')
            self.p.stdin.flush()
            self.p.wait(timeout=5)

def has(text, expected):
    assert expected in text, (expected, text)

def wait_lock(observer, target):
    # Poll an explicit server checkpoint; no transaction order depends on sleep duration.
    deadline = time.monotonic() + 4
    while time.monotonic() < deadline:
        out = observer.run("SELECT wait_event_type FROM pg_stat_activity WHERE application_name = 'a03_" + target + "';")
        if 'Lock' in out:
            return
        time.sleep(.02)
    raise AssertionError('Expected lock wait: ' + target)

def reset(s):
    s.run((HERE / 'setup.sql').read_text())

def uniqueness_case(o, a, b):
    print('\nCASE: uniqueness covers two initially absent rows', flush=True)
    reset(o)
    for s in (a, b):
        has(s.run("BEGIN ISOLATION LEVEL READ COMMITTED; SELECT count(*) FROM reservations WHERE request_id='same';"), '0')
    for s, place in ((a, 21), (b, 22)):
        result = s.run('UPDATE places SET remaining=remaining-1 WHERE place_id=' + str(place) + ' AND remaining>0 RETURNING remaining;')
        has(result, 'UPDATE 1')
        assert result.splitlines()[0] == '0', result
    a.run("INSERT INTO reservations VALUES ('same',21,7);")
    b.send("INSERT INTO reservations VALUES ('same',22,8);")
    wait_lock(o, 'B')
    a.run('COMMIT;')
    has(b.finish(), '23505')
    b.run('ROLLBACK;')
    has(o.run("SELECT count(*) FROM reservations WHERE request_id='same';"), '1')
    state = o.run('SELECT p.place_id, p.capacity, p.remaining, count(r.request_id) AS reserved, p.remaining + count(r.request_id) = p.capacity AS agrees FROM places AS p LEFT JOIN reservations AS r USING (place_id) GROUP BY p.place_id ORDER BY p.place_id;')
    assert state.splitlines() == ['21|1|0|1|t', '22|1|1|0|t'], state

try:
    o, a, b = Session('observer'), Session('A'), Session('B')
    o.run('SELECT version(); SHOW default_transaction_isolation; SHOW fsync; SHOW synchronous_commit; SHOW full_page_writes; SHOW lock_timeout; SHOW statement_timeout;')
    if '--only-uniqueness' in sys.argv[2:]:
        uniqueness_case(o, a, b)
        print('\nUniqueness full-protocol assertions passed. Only this repaired case was rerun.', flush=True)
        sys.exit(0)
    reset(o)
    print('\nCASE: atomic reservation and rollback after invalid ownership', flush=True)
    a.run('BEGIN ISOLATION LEVEL READ COMMITTED; UPDATE places SET remaining=remaining-1 WHERE place_id=21 AND remaining>0 RETURNING remaining;')
    has(o.run('SELECT remaining FROM places WHERE place_id=21;'), '1')
    a.run("INSERT INTO reservations VALUES ('R1',21,7); COMMIT;")
    has(o.run('SELECT remaining, (SELECT count(*) FROM reservations WHERE place_id=21) FROM places WHERE place_id=21;'), '0|1')
    a.run('BEGIN; UPDATE places SET remaining=remaining-1 WHERE place_id=22 AND remaining>0;')
    has(a.run("INSERT INTO reservations VALUES ('R1',22,8);"), '23505')
    a.run('ROLLBACK;')
    has(o.run('SELECT remaining FROM places WHERE place_id=22;'), '1')

    print('\nCASE: displayed data-changing WITH statement', flush=True)
    reset(o)
    for request, owner, expected in [('R1',7,'INSERT 0 1'),('R2',8,'INSERT 0 0')]:
        result = a.run("BEGIN ISOLATION LEVEL READ COMMITTED; WITH taken AS (UPDATE places SET remaining=remaining-1 WHERE place_id=21 AND remaining>0 RETURNING place_id) INSERT INTO reservations(request_id,place_id,owner_id) SELECT '"+request+"',place_id,"+str(owner)+" FROM taken RETURNING request_id; COMMIT;")
        has(result, expected)
    has(o.run('SELECT remaining + (SELECT count(*) FROM reservations WHERE place_id=21) = capacity FROM places WHERE place_id=21;'), 't')

    print('\nCASE: stale overwrite loses a capacity change', flush=True)
    reset(o)
    for s in (a,b):
        s.run('BEGIN ISOLATION LEVEL READ COMMITTED; SELECT remaining FROM places WHERE place_id=21;')
    a.run("UPDATE places SET remaining=0 WHERE place_id=21; INSERT INTO reservations VALUES ('R1',21,7); COMMIT;")
    b.run("UPDATE places SET remaining=0 WHERE place_id=21; INSERT INTO reservations VALUES ('R2',21,8); COMMIT;")
    has(o.run('SELECT remaining, (SELECT count(*) FROM reservations WHERE place_id=21) FROM places WHERE place_id=21;'), '0|2')

    print('\nCASE: conditional update waits and rechecks', flush=True)
    reset(o)
    a.run('BEGIN ISOLATION LEVEL READ COMMITTED; UPDATE places SET remaining=remaining-1 WHERE place_id=21 AND remaining>0 RETURNING remaining;')
    b.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
    b.send('UPDATE places SET remaining=remaining-1 WHERE place_id=21 AND remaining>0 RETURNING remaining;')
    wait_lock(o, 'B')
    has(o.run('SELECT remaining FROM places WHERE place_id=21;'), '1')
    a.run("INSERT INTO reservations VALUES ('R1',21,7); COMMIT;")
    has(b.finish(), 'UPDATE 0')
    b.run('ROLLBACK;')
    has(o.run('SELECT remaining + (SELECT count(*) FROM reservations WHERE place_id=21) = capacity FROM places WHERE place_id=21;'), 't')

    print('\nCASE: coordination-row wait then fresh count', flush=True)
    reset(o)
    a.run('BEGIN ISOLATION LEVEL READ COMMITTED; SELECT place_id FROM places WHERE place_id=21 FOR UPDATE; SELECT count(*) FROM reservations WHERE place_id=21;')
    b.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
    b.send('SELECT place_id FROM places WHERE place_id=21 FOR UPDATE;')
    wait_lock(o, 'B')
    a.run("UPDATE places SET remaining=remaining-1 WHERE place_id=21; INSERT INTO reservations VALUES ('R1',21,7); COMMIT;")
    has(b.finish(), '21')
    has(b.run('SELECT count(*) FROM reservations WHERE place_id=21;'), '1')
    b.run('ROLLBACK;')

    uniqueness_case(o, a, b)

    for level in ('REPEATABLE READ', 'SERIALIZABLE'):
        print('\nCASE: staffing under ' + level, flush=True)
        reset(o)
        for s in (a,b):
            has(s.run('BEGIN ISOLATION LEVEL ' + level + '; SELECT count(*) FROM staff WHERE available;'), '2')
        a.run("UPDATE staff SET available=false WHERE name='Mina';")
        b.run("UPDATE staff SET available=false WHERE name='Tariq';")
        a.run('COMMIT;')
        result = b.run('COMMIT;')
        if level == 'SERIALIZABLE':
            has(result, '40001')
            has(o.run('SELECT count(*) FROM staff WHERE available;'), '1')
            has(b.run('BEGIN ISOLATION LEVEL SERIALIZABLE; SELECT count(*) FROM staff WHERE available;'), '1')
            b.run('ROLLBACK;')
        else:
            has(result, 'COMMIT')
            has(o.run('SELECT count(*) FROM staff WHERE available;'), '0')

    print('\nCASE: statement snapshots versus transaction snapshot', flush=True)
    for level, expected in [('READ COMMITTED','0'),('REPEATABLE READ','1')]:
        reset(o)
        a.run('BEGIN ISOLATION LEVEL ' + level + '; SELECT remaining FROM places WHERE place_id=21;')
        b.run('UPDATE places SET remaining=0 WHERE place_id=21;')
        has(a.run('SELECT remaining FROM places WHERE place_id=21;'), expected)
        a.run('ROLLBACK;')

    print('\nCASE: reversed row order creates deadlock', flush=True)
    reset(o)
    a.run('BEGIN; UPDATE places SET remaining=0 WHERE place_id=21;')
    b.run('BEGIN; UPDATE places SET remaining=0 WHERE place_id=22;')
    a.send('UPDATE places SET remaining=0 WHERE place_id=22;')
    wait_lock(o, 'A')
    b.send('UPDATE places SET remaining=0 WHERE place_id=21;')
    # Either session can be chosen. Collect whichever finishes first, then roll it back.
    deadline = time.monotonic() + 6
    while a.q.empty() and b.q.empty() and time.monotonic() < deadline:
        time.sleep(.02)
    results = [(a, a.finish()), (b, b.finish())]
    victims = [s for s, result in results if '40P01' in result]
    assert len(victims) == 1, results
    victim = victims[0]
    has(victim.run('SELECT 1;'), '25P02')
    for s in (a,b):
        s.run('ROLLBACK;')
    has(o.run('SELECT sum(remaining) FROM places;'), '2')

    print('\nCASE: committed but COMMIT reply is deliberately withheld', flush=True)
    reset(o)
    # One-use local wire proxy. Disable TLS on this disposable loopback connection.
    listener = socket.socket()
    listener.bind(('127.0.0.1',0)); listener.listen(1)
    proxy_port = listener.getsockname()[1]
    dropped = threading.Event()
    def proxy():
        client,_ = listener.accept()
        server = socket.create_connection(('127.0.0.1',57319))
        commit = threading.Event()
        def upstream():
            try:
                while data := client.recv(65536):
                    if b'COMMIT;' in data:
                        commit.set()
                    server.sendall(data)
            except OSError:
                pass
        threading.Thread(target=upstream,daemon=True).start()
        try:
            while data := server.recv(65536):
                if commit.is_set():
                    # Wait for server CommandComplete containing COMMIT before disconnecting.
                    if b'COMMIT\x00' in data:
                        print('[proxy] server completed COMMIT; reply withheld', flush=True)
                        dropped.set()
                        break
                else:
                    client.sendall(data)
        finally:
            client.close(); server.close(); listener.close()
    threading.Thread(target=proxy,daemon=True).start()
    proxy_uri = URI.replace(':57319/', ':'+str(proxy_port)+'/') + '?sslmode=disable'
    result = subprocess.run([PSQL,'-X',proxy_uri], input="BEGIN;\nUPDATE places SET remaining=remaining-1 WHERE place_id=21 AND remaining>0;\nINSERT INTO reservations VALUES ('lost-reply',21,7);\nCOMMIT;\n", text=True, stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=10)
    print('[client] ' + result.stdout.replace('\n','\n[client] '), flush=True)
    assert dropped.wait(1)
    assert 'COMMIT' not in result.stdout.splitlines()
    has(o.run("SELECT request_id FROM reservations WHERE request_id='lost-reply';"), 'lost-reply')
    has(o.run('SELECT p.place_id, p.capacity, p.remaining, count(r.request_id) AS reserved, p.remaining + count(r.request_id) = p.capacity AS agrees FROM places AS p LEFT JOIN reservations AS r USING (place_id) GROUP BY p.place_id ORDER BY p.place_id;'), '21|1|0|1|t')
    print('\nAll asserted observations passed. No crash, restart or replica test was performed.', flush=True)
finally:
    for s in sessions:
        s.close()
