#!/usr/bin/env python3
"""Bounded PostgreSQL two-session worksheet. Creates and removes its own database.

PGHOST/PGPORT/PGUSER select a disposable server; PG_BIN optionally locates tools.
REL3_ISOLATION_DB defaults to rel3_a19_run1; choose an unused name. No server settings
are changed. Requires database-creation rights. Run: python3 rehearse.py > result.json
"""
import json
import os
import queue
import subprocess
import threading
import time

BIN = os.environ.get('PG_BIN', '')
DB = os.environ.get('REL3_ISOLATION_DB', 'rel3_a19_run1')
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
        self.run("SET application_name = 'isolation_%s'; SET statement_timeout='12s'; SET lock_timeout='5s'; SET idle_in_transaction_session_timeout='45s';" % name)

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
        state = observer.run("SELECT wait_event_type FROM pg_stat_activity WHERE datname=current_database() AND application_name='isolation_%s';" % session.name)
        if state == 'Lock':
            return True
        time.sleep(.03)
    raise AssertionError('Expected observed lock wait: ' + session.name)


def main():
    subprocess.run([tool('createdb'), DB], env=ENV, check=True, capture_output=True, text=True)
    sessions = []
    try:
        a, b, o = [Session(n) for n in ('A', 'B', 'observer')]
        sessions = [a, b, o]
        evidence['runtime'] = o.run("SELECT version(); SHOW default_transaction_isolation; SHOW default_transaction_read_only; SHOW fsync; SHOW synchronous_commit; SHOW full_page_writes; SHOW statement_timeout; SHOW lock_timeout; SHOW idle_in_transaction_session_timeout;")
        o.run("CREATE TABLE places (place_id integer PRIMARY KEY, capacity integer NOT NULL, remaining integer NOT NULL CHECK(remaining BETWEEN 0 AND capacity)); CREATE TABLE reservations (request_id text PRIMARY KEY, place_id integer NOT NULL REFERENCES places, owner_id integer NOT NULL, UNIQUE(place_id,owner_id)); CREATE TABLE staff (person text PRIMARY KEY, available boolean NOT NULL);")
        def reset():
            for s in (a, b): s.run('ROLLBACK;')
            o.run("TRUNCATE reservations, places, staff; INSERT INTO places VALUES (21,1,1); INSERT INTO staff VALUES ('Mina',true),('Tariq',true);")
        read = 'SELECT remaining FROM places WHERE place_id=21;'
        count = 'SELECT count(*) FROM staff WHERE available;'
        update = 'UPDATE places SET remaining=remaining-1 WHERE place_id=21 AND remaining>0 RETURNING remaining;'
        for level, expected in [('READ COMMITTED','0'),('REPEATABLE READ','1')]:
            reset(); a.run('BEGIN ISOLATION LEVEL '+level+';')
            check(level+' first read', a.run(read)=='1', '1')
            b.run('BEGIN; UPDATE places SET remaining=0 WHERE place_id=21; COMMIT;')
            result=a.run(read); check(level+' second read', result==expected, result)
            a.run('ROLLBACK;')
        reset(); a.run('BEGIN ISOLATION LEVEL REPEATABLE READ;')
        b.run('UPDATE places SET remaining=0 WHERE place_id=21;')
        check('BEGIN does not fix RR snapshot', a.run(read)=='0', '0, first data query after competing commit')
        a.run('UPDATE places SET remaining=1 WHERE place_id=21;')
        check('own update visible', a.run(read)=='1', '1')
        a.run('ROLLBACK;')
        for level in ['READ COMMITTED','REPEATABLE READ']:
            reset(); b.run('BEGIN ISOLATION LEVEL '+level+';'); check(level+' pre-lock read',b.run(read)=='1','1')
            a.run('BEGIN; UPDATE places SET remaining=0 WHERE place_id=21;')
            pending=b.start('SELECT remaining FROM places WHERE place_id=21 FOR UPDATE;')
            check(level+' locking read waits',blocked(o,b), 'pg_stat_activity wait_event_type=Lock')
            a.run('COMMIT;'); result=b.finish(pending)
            check(level+' locking read outcome',result=='0' if level=='READ COMMITTED' else '40001' in result,result)
            b.run('ROLLBACK;')
        for level in ['READ COMMITTED','REPEATABLE READ']:
            reset(); b.run('BEGIN ISOLATION LEVEL '+level+';'); b.run(read)
            a.run('BEGIN; '+update)
            pending=b.start(update); check(level+' guarded update waits',blocked(o,b),'Lock')
            a.run("INSERT INTO reservations VALUES ('R1',21,7); COMMIT;"); result=b.finish(pending)
            check(level+' guarded update outcome',result=='' if level=='READ COMMITTED' else '40001' in result,result or 'zero returned rows')
            b.run('ROLLBACK;')
            final=o.run('SELECT remaining,(SELECT count(*) FROM reservations) FROM places;')
            check(level+' counter invariant', final=='0|1', final)
        for level in ['REPEATABLE READ','SERIALIZABLE']:
            reset()
            for s in (a,b):
                s.run('BEGIN ISOLATION LEVEL '+level+';'); check(level+' staffing read '+s.name,s.run(count)=='2','2')
            a.run("UPDATE staff SET available=false WHERE person='Mina';")
            b.run("UPDATE staff SET available=false WHERE person='Tariq';")
            ra=a.run('COMMIT;'); rb=b.run('COMMIT;'); final=o.run(count)
            check(level+' staffing commits',final==('0' if level=='REPEATABLE READ' else '1'),{'A':ra,'B':rb,'available':final})
            if level=='SERIALIZABLE':
                check('serial staffing rejected B at commit','40001' in rb,rb)
                b.run('BEGIN ISOLATION LEVEL SERIALIZABLE;'); check('whole retry changes decision',b.run(count)=='1','1: decline departure'); b.run('COMMIT;')
        for level in ['REPEATABLE READ','SERIALIZABLE']:
            reset()
            for s in (a,b):
                s.run('BEGIN ISOLATION LEVEL '+level+';'); check(level+' empty predicate '+s.name,s.run('SELECT count(*) FROM reservations WHERE place_id=21;')=='0','0')
            a.run("INSERT INTO reservations VALUES ('R1',21,7);")
            b.run("INSERT INTO reservations VALUES ('R2',21,8);")
            ra=a.run('COMMIT;'); rb=b.run('COMMIT;'); final=o.run('SELECT count(*) FROM reservations;')
            check(level+' predicate insert outcome',final==('2' if level=='REPEATABLE READ' else '1'),{'A':ra,'B':rb,'reserved':final})
            if level=='SERIALIZABLE': check('serial predicate rejects B','40001' in rb,rb)
        reset()
        # An incorrect single-transaction decision cannot be repaired by serialisability.
        for s,person in [(a,'Mina'),(b,'Tariq')]:
            s.run('BEGIN ISOLATION LEVEL SERIALIZABLE;')
            result=s.run("SELECT count(*) FROM staff WHERE person='%s' AND available;" % person)
            check('wrong predicate only sees self '+person,result=='1',result)
            s.run("UPDATE staff SET available=false WHERE person='%s'; COMMIT;" % person)
        check('serial wrong query still breaks rule',o.run(count)=='0','0, sequential transactions; wrong decision rule')
        evidence['pass']=True
    finally:
        for s in sessions: s.close()
        subprocess.run([tool('dropdb'), DB],env=ENV,check=True,capture_output=True,text=True)
        evidence['cleanup']='all three sessions closed; own database removed; server unchanged'
    print(json.dumps(evidence,indent=2))


if __name__=='__main__':
    main()
