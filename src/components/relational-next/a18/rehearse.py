#!/usr/bin/env python3
"""Bounded PostgreSQL two-session worksheet. Creates and removes its own database.

PGHOST/PGPORT/PGUSER select a disposable server; PG_BIN optionally locates tools.
REL3_LOCK_DB defaults to rel3_a18_run1; choose an unused name. No server settings
are changed. Requires database-creation rights. Run: python3 rehearse.py > result.json
"""
import json
import os
import queue
import subprocess
import threading
import time

BIN = os.environ.get('PG_BIN', '')
DB = os.environ.get('REL3_LOCK_DB', 'rel3_a18_run1')
ENV = dict(os.environ, PGDATABASE=DB)
evidence = {'cases': [], 'commands': []}


def tool(name):
    return os.path.join(BIN, name) if BIN else name


class Session:
    def __init__(self, name):
        self.name, self.n, self.lines = name, 0, queue.Queue()
        self.p = subprocess.Popen([tool('psql'), '-X', '-qAt', '-v', 'VERBOSITY=verbose'],
                                  stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                  stderr=subprocess.STDOUT, text=True, env=ENV)
        threading.Thread(target=self.read, daemon=True).start()
        self.run("SET application_name = 'locking_%s'; SET statement_timeout='12s'; SET lock_timeout='5s'; SET idle_in_transaction_session_timeout='45s';" % name)

    def read(self):
        for line in self.p.stdout:
            self.lines.put(line.rstrip())

    def start(self, sql):
        self.n += 1
        marker = 'END_%s_%s' % (self.name, self.n)
        self.p.stdin.write(sql + '\n\\echo ' + marker + '\n')
        self.p.stdin.flush()
        return marker, sql

    def finish(self, ticket):
        marker, sql = ticket
        rows = []
        while True:
            line = self.lines.get(timeout=15)
            if line == marker:
                result = '\n'.join(rows)
                evidence['commands'].append({'session': self.name, 'sql': sql, 'output': result})
                return result
            rows.append(line)

    def run(self, sql):
        return self.finish(self.start(sql))

    def close(self):
        self.p.stdin.write('ROLLBACK;\n\\q\n')
        self.p.stdin.flush()
        self.p.wait(timeout=5)


def check(name, condition, detail):
    assert condition, (name, detail)
    evidence['cases'].append({'name': name, 'pass': True, 'observed': detail})


def blocked(observer, session):
    deadline = time.monotonic() + 3
    while time.monotonic() < deadline:
        state = observer.run("SELECT wait_event_type FROM pg_stat_activity WHERE datname=current_database() AND application_name='locking_%s';" % session.name)
        if state == 'Lock':
            return True
        time.sleep(.03)
    raise AssertionError('Expected observed lock wait: ' + session.name)


def reset(o):
    o.run('TRUNCATE reservations, resources; INSERT INTO resources VALUES (21,1),(22,1);')


def main():
    # createdb refuses an existing name; cleanup runs only after successful creation.
    subprocess.run([tool('createdb'), DB], env=ENV, check=True, capture_output=True, text=True)
    sessions = []
    try:
        a, b, o = [Session(n) for n in ('A', 'B', 'observer')]
        sessions = [a, b, o]
        evidence['runtime'] = o.run("SELECT version(); SHOW default_transaction_isolation; SHOW statement_timeout; SHOW lock_timeout; SHOW deadlock_timeout; SHOW fsync; SHOW synchronous_commit;")
        o.run('CREATE TABLE resources (resource_id integer PRIMARY KEY, capacity integer NOT NULL CHECK(capacity>=0)); CREATE TABLE reservations (request_id text PRIMARY KEY, resource_id integer NOT NULL REFERENCES resources, owner_id integer NOT NULL, UNIQUE(resource_id,owner_id));')
        count = 'SELECT count(*) FROM reservations WHERE resource_id=21;'
        lock = 'SELECT resource_id FROM resources WHERE resource_id=21 FOR UPDATE;'
        invariant = 'SELECT count(*)<=capacity FROM resources LEFT JOIN reservations USING(resource_id) WHERE resource_id=21 GROUP BY capacity;'

        reset(o)
        for s in (a,b):
            s.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
            check('empty count '+s.name, s.run(count)=='0', '0')
        a.run("INSERT INTO reservations VALUES ('R1',21,7); COMMIT;")
        b.run("INSERT INTO reservations VALUES ('R2',21,8); COMMIT;")
        check('unprotected empty-set race', o.run(invariant)=='f', o.run(count))

        reset(o)
        a.run('BEGIN ISOLATION LEVEL READ COMMITTED; '+lock)
        a.run("INSERT INTO reservations VALUES ('R1',21,7);")
        b.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
        check('ordinary read sees previous committed count', b.run(count)=='0', '0')
        pending = b.start(lock)
        blocked(o,b)
        a.run('COMMIT;')
        check('lock resumes with resource', b.finish(pending)=='21', '21')
        check('separate fresh statement counts prior holder', b.run(count)=='1', '1; reject R2')
        b.run('ROLLBACK;')
        check('protected final capacity', o.run(invariant)=='t', o.run(count))

        reset(o)
        a.run('BEGIN ISOLATION LEVEL READ COMMITTED; '+lock)
        a.run("INSERT INTO reservations VALUES ('R1',21,7);")
        b.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
        pending=b.start('SELECT resource_id,(SELECT count(*) FROM reservations WHERE resource_id=21) FROM resources WHERE resource_id=21 FOR UPDATE;')
        blocked(o,b); a.run('COMMIT;')
        check('same statement count predates wait completion', b.finish(pending)=='21|0', 'resource 21; count 0')
        check('next statement repairs count visibility', b.run(count)=='1', '1')
        b.run('ROLLBACK;')

        # Run the article's guarded INSERT and move shapes too.
        reset(o)
        insert = "INSERT INTO reservations (request_id, resource_id, owner_id) SELECT '%s', p.resource_id, %s FROM resources AS p WHERE p.resource_id=21 AND (SELECT count(*) FROM reservations AS r WHERE r.resource_id=p.resource_id)<p.capacity RETURNING request_id;"
        a.run('BEGIN ISOLATION LEVEL READ COMMITTED; '+lock)
        check('displayed guarded insert accepts R1', a.run(insert % ('R1',7))=='R1', 'R1')
        b.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
        pending=b.start(lock); blocked(o,b); a.run('COMMIT;'); b.finish(pending)
        check('displayed guarded insert declines R2', b.run(insert % ('R2',8))=='', 'zero inserted rows')
        b.run('COMMIT;')
        check('displayed guarded final invariant', o.run(invariant)=='t', '1 booking; capacity 1')
        o.run("INSERT INTO reservations VALUES ('other',22,8);")
        move_sql = "UPDATE reservations SET resource_id=22 WHERE request_id='R1' AND resource_id=21 AND owner_id=7 AND (SELECT count(*) FROM reservations WHERE resource_id=22)<(SELECT capacity FROM resources WHERE resource_id=22) RETURNING request_id;"
        move_locks = "BEGIN; SELECT resource_id FROM resources WHERE resource_id=21 FOR UPDATE; SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE; SELECT resource_id,owner_id FROM reservations WHERE request_id='R1' FOR UPDATE;"
        a.run(move_locks)
        check('displayed move declines full destination', a.run(move_sql)=='', 'R1 remains in 21')
        a.run('COMMIT;')
        b.run('BEGIN; SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE;')
        check('cancellation deletes existing row once', b.run("DELETE FROM reservations WHERE request_id='other' AND resource_id=22 RETURNING request_id;")=='other', 'other')
        check('repeat cancellation changes nothing', b.run("DELETE FROM reservations WHERE request_id='other' AND resource_id=22 RETURNING request_id;")=='', 'zero rows')
        b.run('COMMIT;')
        a.run(move_locks)
        check('displayed move accepts empty destination', a.run(move_sql)=='R1', 'R1 moved to 22')
        a.run('COMMIT;')
        check('move preserves both capacities', o.run('SELECT count(*) FROM resources AS p WHERE (SELECT count(*) FROM reservations AS r WHERE r.resource_id=p.resource_id)>p.capacity;')=='0', 'no over-capacity class')
        a.run('BEGIN; SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE;')
        check('capacity reduction rejects booked class', a.run('UPDATE resources SET capacity=0 WHERE resource_id=22 AND (SELECT count(*) FROM reservations WHERE resource_id=22)<=0 RETURNING resource_id;')=='', 'zero changed rows; capacity remains 1')
        a.run('COMMIT;')

        reset(o)
        a.run('BEGIN; SELECT * FROM reservations WHERE resource_id=21 FOR UPDATE;')
        b.run("BEGIN; INSERT INTO reservations VALUES ('R1',21,7); COMMIT;")
        check('empty reservation lock permits insert', o.run(count)=='1', '1; no lock wait')
        a.run('ROLLBACK;')
        a.run('BEGIN; SELECT * FROM resources WHERE resource_id=99 FOR UPDATE;')
        out=a.run("INSERT INTO reservations VALUES ('bad',99,7);")
        check('absent resource rejected by reference', '23503' in out, out)
        a.run('ROLLBACK;')

        # Exact mode compatibility, real UPDATE/DELETE/reference paths.
        reset(o)
        a.run('BEGIN; '+lock)
        b.run('BEGIN;')
        pending=b.start('UPDATE resources SET capacity=2 WHERE resource_id=21 RETURNING capacity;')
        blocked(o,b); a.run('ROLLBACK;')
        check('FOR UPDATE blocks capacity update', b.finish(pending)=='2', 'wait then 2')
        b.run('ROLLBACK;')
        a.run('BEGIN; '+lock); b.run('BEGIN;')
        pending=b.start('DELETE FROM resources WHERE resource_id=21 RETURNING resource_id;')
        blocked(o,b); a.run('ROLLBACK;')
        check('FOR UPDATE blocks deletion', b.finish(pending)=='21', 'wait then deleted 21')
        b.run('ROLLBACK;')
        a.run('BEGIN; '+lock); b.run('BEGIN;')
        pending=b.start("INSERT INTO reservations VALUES ('fk',21,7) RETURNING request_id;")
        blocked(o,b); a.run('ROLLBACK;')
        check('FOR UPDATE conflicts with FK insertion', b.finish(pending)=='fk', 'wait then fk')
        b.run('ROLLBACK;')
        a.run('BEGIN; SELECT resource_id FROM resources WHERE resource_id=21 FOR NO KEY UPDATE;')
        b.run('BEGIN;')
        check('weaker lock allows reference insertion', b.run("INSERT INTO reservations VALUES ('fk',21,7) RETURNING request_id;")=='fk', 'fk; no wait')
        b.run('ROLLBACK;'); a.run('ROLLBACK;')

        reset(o)
        a.run('BEGIN; '+lock); b.run('BEGIN;')
        out=b.run('SELECT resource_id FROM resources WHERE resource_id=21 FOR UPDATE NOWAIT;')
        check('NOWAIT error', '55P03' in out, out)
        check('NOWAIT failed transaction state', '25P02' in b.run('SELECT 1;'), '25P02 until rollback')
        b.run('ROLLBACK; BEGIN; SET LOCAL lock_timeout=\'150ms\';')
        out=b.run(lock)
        check('bounded wait error', '55P03' in out and 'lock timeout' in out, out)
        b.run('ROLLBACK; BEGIN;')
        out=b.run('SELECT resource_id FROM resources WHERE resource_id=21 FOR UPDATE SKIP LOCKED;')
        check('SKIP LOCKED empty despite existing candidate', out=='' and o.run('SELECT count(*) FROM resources WHERE resource_id=21;')=='1', 'empty; resource 21 exists')
        b.run('ROLLBACK;'); a.run('ROLLBACK;')

        reset(o)
        a.run('BEGIN; '+lock)
        b.run('BEGIN; SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE;')
        pa=a.start('SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE;')
        blocked(o,a)
        pb=b.start(lock)
        # PostgreSQL detects the cycle, choosing a victim without an application promise.
        ra=a.finish(pa); rb=b.finish(pb)
        victims=[s for s,r in ((a,ra),(b,rb)) if '40P01' in r]
        check('reversed-order deadlock', len(victims)==1, {'A':ra,'B':rb})
        check('deadlock transaction failed', '25P02' in victims[0].run('SELECT 1;'), '25P02 until rollback')
        a.run('ROLLBACK;'); b.run('ROLLBACK;')

        reset(o)
        a.run('BEGIN; '+lock)
        b.run('BEGIN;')
        pb=b.start(lock); blocked(o,b)
        a.run('SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE; COMMIT;')
        b.finish(pb)
        check('explicit canonical acquisitions complete', b.run('SELECT resource_id FROM resources WHERE resource_id=22 FOR UPDATE;')=='22', 'A21,A22,commit; B21,B22,commit')
        b.run('COMMIT;')
    finally:
        for s in sessions:
            s.close()
        subprocess.run([tool('dropdb'), DB], env=ENV, check=True, capture_output=True, text=True)
    evidence['cleanup']='All three sessions closed; own database dropped; server unchanged.'
    print(json.dumps(evidence, indent=2))


if __name__ == '__main__':
    main()
