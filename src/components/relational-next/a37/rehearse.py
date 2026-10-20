#!/usr/bin/env python3
"""Disposable maintenance and copy-mode upgrade drill; Python 3 + PG17/PG18 tools."""
import argparse
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--old-bin', required=True, type=Path)
p.add_argument('--new-bin', required=True, type=Path)
p.add_argument('--evidence', required=True, type=Path)
a = p.parse_args()
if a.evidence.exists():
    p.error('Choose a new evidence filename; existing evidence is never overwritten.')
a.old_bin = a.old_bin.resolve()
a.new_bin = a.new_bin.resolve()
a.evidence = a.evidence.resolve()
work = Path(tempfile.mkdtemp(prefix='a37-drill-', dir='/private/tmp' if Path('/private/tmp').exists() else None))
os.chmod(work, 0o700)
e = {'work_directory': str(work), 'commands': [], 'observations': {}, 'cleaned': False}
clusters = []
held = []

def run(args, ok=True, timeout=60):
    start = time.monotonic()
    r = subprocess.run([str(x) for x in args], cwd=work, text=True,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout,
                       env={**os.environ, 'PGCONNECT_TIMEOUT': '5', 'LC_ALL': 'C'})
    e['commands'].append({'argv': [str(x) for x in args], 'exit': r.returncode,
                          'seconds': round(time.monotonic()-start, 3), 'output': r.stdout})
    if ok and r.returncode:
        raise RuntimeError(r.stdout)
    return r

def port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

def init(name, binary):
    d = work / name
    run([binary/'initdb', '-D', d, '-U', 'drill', '--locale=C', '--encoding=UTF8',
         '--data-checksums', '--auth-local=trust', '--auth-host=trust'])
    n = port()
    with (d/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses='127.0.0.1'\nport={n}\nunix_socket_directories='{work}'\nshared_buffers='16MB'\nmax_connections=12\nmax_parallel_workers=0\nmaintenance_work_mem='16MB'\nstatement_timeout='15s'\nlock_timeout='2s'\n")
    c = (d, binary, n)
    clusters.append(c)
    return c

def start(c):
    d,b,n = c
    run([b/'pg_ctl', '-D', d, '-l', work/(d.name+'.log'), '-w', '-t', '15', 'start'])

def stop(c):
    d,b,n = c
    run([b/'pg_ctl', '-D', d, '-m', 'fast', '-w', '-t', '15', 'stop'], ok=False)

def sql(c, query, ok=True):
    d,b,n = c
    return run([b/'psql', '-X', '-h', '127.0.0.1', '-p', n, '-U', 'drill',
                '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-At', '-c', query], ok=ok)

def hold(c, query, marker):
    d,b,n=c
    r=subprocess.Popen([str(b/'psql'), '-X', '-h','127.0.0.1','-p',str(n),'-U','drill',
                        '-d','postgres','-v','ON_ERROR_STOP=1','-At'], cwd=work,
                       stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                       text=True, bufsize=1)
    held.append(r)
    r.stdin.write(query+f"\nSELECT '{marker}';\n")
    r.stdin.flush()
    lines=[]
    while True:
        line=r.stdout.readline()
        if not line: raise RuntimeError('Holder session ended early')
        lines.append(line)
        if line.strip()==marker: break
    e['commands'].append({'holder_sql':query,'output':''.join(lines)})
    return r

def release(r):
    r.stdin.write('ROLLBACK;\n\\q\n')
    r.stdin.flush()
    out=r.communicate(timeout=10)[0]
    e['commands'].append({'holder_release':out,'exit':r.returncode})
    held.remove(r)

def bytes_in(d):
    return sum(x.stat().st_size for x in d.rglob('*') if x.is_file())

try:
    e['versions'] = [run([a.old_bin/'postgres','--version']).stdout.strip(),
                     run([a.new_bin/'postgres','--version']).stdout.strip()]
    assert '17.6' in e['versions'][0] and '18.6' in e['versions'][1], 'This pinned drill expects 17.6 and 18.6'
    m=init('maintenance18',a.new_bin); start(m)
    sql(m,"CREATE TABLE orders(id integer PRIMARY KEY, status text NOT NULL, payload text NOT NULL) WITH (autovacuum_enabled=false); INSERT INTO orders SELECT i, 'pending', repeat('x',200) FROM generate_series(1,4000)i; ANALYZE orders;")
    h=hold(m,"BEGIN ISOLATION LEVEL REPEATABLE READ; SELECT count(*) FROM orders;",'snapshot_held')
    sql(m,"UPDATE orders SET status='paid';")
    blocked=sql(m,'VACUUM (VERBOSE, TRUNCATE false) orders;').stdout
    assert '4000 are dead but not yet removable' in blocked, blocked
    assert sql(m,"SELECT count(*) FROM orders WHERE status='paid';").stdout.strip()=='4000'
    before=int(sql(m,"SELECT pg_relation_size('orders');").stdout.strip())
    release(h)
    released=sql(m,'VACUUM (VERBOSE, TRUNCATE false) orders;').stdout
    assert '4000 removed' in released, released
    after=int(sql(m,"SELECT pg_relation_size('orders');").stdout.strip())
    assert before==after
    sql(m,'ANALYZE orders;')
    stats=sql(m,"SELECT reltuples::int FROM pg_class WHERE oid='orders'::regclass; SELECT n_dead_tup,last_vacuum IS NOT NULL,last_analyze IS NOT NULL FROM pg_stat_user_tables WHERE relname='orders';").stdout
    h=hold(m,'BEGIN; SELECT count(*) FROM orders;','reader_held')
    d,b,n=m
    blocked_full=run([b/'psql','-X','-h','127.0.0.1','-p',n,'-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-c',"SET lock_timeout='200ms'",'-c','VACUUM FULL orders'],ok=False)
    assert blocked_full.returncode!=0 and 'lock timeout' in blocked_full.stdout
    release(h)
    sql(m,'REINDEX INDEX CONCURRENTLY orders_pkey;')
    assert sql(m,"SELECT indisvalid FROM pg_index WHERE indexrelid='orders_pkey'::regclass;").stdout.strip()=='t'
    e['observations']['maintenance']={'heap_bytes_before':before,'heap_bytes_after':after,'stats':stats,'vacuum_full_gate':'lock timeout', 'reindex_valid':True}
    sql(m,"SELECT relname,n_live_tup,n_dead_tup,last_autovacuum,last_vacuum,last_autoanalyze,last_analyze FROM pg_stat_user_tables WHERE relname='orders'; SELECT pid,state,xact_start,backend_xmin,wait_event_type,wait_event FROM pg_stat_activity WHERE datname=current_database() AND backend_xmin IS NOT NULL; SELECT relid::regclass,phase,heap_blks_total,heap_blks_scanned FROM pg_stat_progress_vacuum; SELECT relname,age(relfrozenxid),mxid_age(relminmxid) FROM pg_class WHERE relkind IN ('r','m','t') ORDER BY age(relfrozenxid) DESC LIMIT 10; SELECT archived_count,last_archived_wal,last_archived_time,failed_count,last_failed_wal,last_failed_time FROM pg_stat_archiver; SELECT slot_name,active,xmin,catalog_xmin,restart_lsn,wal_status,safe_wal_size FROM pg_replication_slots;")
    stop(m)

    old=init('old17',a.old_bin); new=init('new18',a.new_bin)
    start(old)
    sql(old,"CREATE TABLE orders(id integer PRIMARY KEY, total integer NOT NULL CHECK(total>=0)); INSERT INTO orders VALUES(101,2200),(102,1800); CREATE TABLE unsupported(function_id regproc); INSERT INTO unsupported VALUES('now'::regproc); ANALYZE orders;")
    stop(old)
    def upgrade(check=False):
        args=[a.new_bin/'pg_upgrade','--old-bindir',a.old_bin,'--new-bindir',a.new_bin,
              '--old-datadir',old[0],'--new-datadir',new[0], '--old-port',old[2],
              '--new-port',new[2],'--username','drill','--socketdir',work,'--copy','--retain']
        if check: args.append('--check')
        return run(args,ok=False)
    failed=upgrade(True)
    assert failed.returncode!=0 and 'reg' in failed.stdout
    start(old)
    assert sql(old,'SELECT count(*),sum(total) FROM orders;').stdout.strip()=='2|4000'
    sql(old,'DROP TABLE unsupported;')
    stop(old)
    clean=upgrade(True)
    assert clean.returncode==0,clean.stdout
    e['observations']['preflight']={'unsupported_regproc_failed':True,'old_restart_after_failure':True,'repeat_check_passed':True}
    size_old=bytes_in(old[0]); size_new=bytes_in(new[0])
    elapsed=time.monotonic()
    upgraded=upgrade()
    assert upgraded.returncode==0,upgraded.stdout
    start(new)
    result=sql(new,'SHOW server_version; SELECT count(*),sum(total) FROM orders;').stdout
    assert '18.6' in result and '2|4000' in result
    assert sql(new,"SELECT string_agg(id::text||':'||total::text,',' ORDER BY id) FROM orders;").stdout.strip()=='101:2200,102:1800'
    # Deliberately demand the wrong fixture count: reject before ordinary traffic.
    bad=sql(new,'SELECT count(*)=3 AS validation_passes FROM orders;').stdout.strip()
    assert bad=='f'
    stop(new)
    start(old)
    oldresult=sql(old,'SHOW server_version; SELECT count(*),sum(total) FROM orders;').stdout
    assert '17.6' in oldresult and '2|4000' in oldresult
    stop(old)
    start(new)
    run([a.new_bin/'vacuumdb','-h','127.0.0.1','-p',new[2],'-U','drill','--all','--analyze-in-stages','--missing-stats-only'])
    run([a.new_bin/'vacuumdb','-h','127.0.0.1','-p',new[2],'-U','drill','--all','--analyze-only'])
    sql(new,'INSERT INTO orders VALUES(103,500);')
    assert sql(new,'SELECT count(*),sum(total) FROM orders;').stdout.strip()=='3|4500'
    stop(new)
    start(old)
    assert sql(old,'SELECT count(*),sum(total) FROM orders;').stdout.strip()=='2|4000'
    stop(old)
    e['observations']['upgrade']={'initial_new_result':result,'failed_validation':bad,'old_result':oldresult,
        'new_after_write':'3|4500','old_after_new_write':'2|4000','old_bytes':size_old,'new_initial_bytes':size_new,
        'new_upgraded_bytes':bytes_in(new[0]),'upgrade_command_seconds':next(x['seconds'] for x in reversed(e['commands']) if 'argv' in x and str(a.new_bin/'pg_upgrade') in x['argv']),
        'entire_gate_exercise_seconds':round(time.monotonic()-elapsed,3)}
    e['passed']=True
finally:
    for h in held:
        h.kill(); h.communicate(timeout=10)
    for c in reversed(clusters):
        stop(c)
    alive=[]
    for d,b,n in clusters:
        r=run([b/'pg_ctl','-D',d,'status'],ok=False)
        if r.returncode==0: alive.append(str(d))
    e['remaining_servers']=alive
    e['files']={str(x.relative_to(work)):x.read_text(errors='replace') for x in work.rglob('*')
                if x.is_file() and (x.suffix in ['.log','.txt','.sql'] or x.name=='postgresql.conf')}
    if not alive:
        shutil.rmtree(work)
        e['cleaned']=not work.exists()
    a.evidence.parent.mkdir(parents=True,exist_ok=True)
    a.evidence.write_text(json.dumps(e,indent=2)+'\n')
    print(json.dumps({'passed':e.get('passed',False),'cleaned':e['cleaned'],'evidence':str(a.evidence),'observations':e['observations']},indent=2))
