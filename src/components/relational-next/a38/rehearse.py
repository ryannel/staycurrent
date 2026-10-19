"""Bounded PostgreSQL 18 replication drill. Only fresh temporary clusters are used."""
import argparse, json, pathlib, shutil, socket, subprocess, tempfile, time

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--pg-bin', required=True, type=pathlib.Path)
p.add_argument('--evidence', required=True, type=pathlib.Path)
a = p.parse_args()
if a.evidence.exists(): p.error('Choose a new evidence filename')
B = a.pg_bin
root = pathlib.Path(tempfile.mkdtemp(prefix='rel3-a38-'))
records, running = [], []

def run(tool, *args, check=True):
    t = time.monotonic()
    r = subprocess.run([str(B/tool), *map(str,args)], capture_output=True, text=True, timeout=35)
    records.append(dict(command=[tool,*map(str,args)], seconds=round(time.monotonic()-t,3), code=r.returncode, out=r.stdout, err=r.stderr))
    if check and r.returncode: raise RuntimeError(r.stderr)
    return r

def port():
    with socket.socket() as s:
        s.bind(('127.0.0.1',0)); return s.getsockname()[1]

def cmdsql(n,q): return [str(B/'psql'),'-X','-h','127.0.0.1','-p',str(n),'-U','drill','-d','postgres','-v','ON_ERROR_STOP=1','-At','-c',q]
def sql(n,q): return run('psql',*cmdsql(n,q)[1:]).stdout.strip()
def until(fn):
    end=time.monotonic()+12
    while not fn():
        if time.monotonic()>end: raise RuntimeError('12-second condition timeout')
        time.sleep(.1)
def start(d):
    running.append(d)
    run('pg_ctl','-D',d,'-l',root/(d.name+'.log'),'-w','-t','15','start')
def stop(d,mode='fast'):
    run('pg_ctl','-D',d,'-m',mode,'-w','-t','15','stop'); running.remove(d)
def pair(label):
    d=root/(label+'-writer'); r=root/(label+'-standby'); wp,rp=port(),port()
    run('initdb','-D',d,'--username=drill','--locale=C','--encoding=UTF8','--auth-local=trust','--auth-host=trust')
    with (d/'postgresql.conf').open('a') as f:
        f.write(f"\nlisten_addresses='127.0.0.1'\nport={wp}\nunix_socket_directories='{root}'\nshared_buffers='32MB'\nmax_connections=12\nmax_wal_senders=4\nmax_replication_slots=4\nwal_level=replica\nwal_keep_size='64MB'\nmax_slot_wal_keep_size='128MB'\nstatement_timeout='15s'\nlock_timeout='3s'\ntimezone='UTC'\n")
    start(d)
    sql(wp,"CREATE TABLE orders(id int PRIMARY KEY, status text NOT NULL); INSERT INTO orders VALUES(101,'paid');")
    run('pg_basebackup','-h','127.0.0.1','-p',wp,'-U','drill','-D',r,'-Fp','-X','stream','-R','-C','-S','replica_slot','--checkpoint=fast')
    with (r/'postgresql.conf').open('a') as f: f.write(f'\nport={rp}\n')
    with (r/'postgresql.auto.conf').open('a') as f:
        f.write(f"\nprimary_conninfo='host=127.0.0.1 port={wp} user=drill application_name=replica connect_timeout=2'\nwal_receiver_status_interval='100ms'\nwal_retrieve_retry_interval='100ms'\n")
    start(r)
    until(lambda:sql(rp,'SELECT count(*) FROM orders;')=='1')
    return d,r,wp,rp

def result(name,**kw): records.append(dict(result=name,**kw))
try:
    d,r,wp,rp=pair('planned')
    result('runtime',version=sql(wp,'SELECT version();'),durability=sql(wp,'SHOW fsync; SHOW synchronous_commit; SHOW full_page_writes;'))
    sql(wp,"ALTER SYSTEM SET synchronous_standby_names='FIRST 1 (replica)';");sql(wp,'SELECT pg_reload_conf();')
    until(lambda:sql(wp,"SELECT count(*) FROM pg_stat_replication WHERE sync_state='sync';")=='1')
    sql(rp,'SELECT pg_wal_replay_pause();')
    until(lambda:sql(rp,'SELECT pg_is_wal_replay_paused();')=='t')
    sql(wp,"SET synchronous_commit=on; INSERT INTO orders VALUES(103,'paid');")
    boundary=sql(wp,'SELECT pg_current_wal_flush_lsn();')
    positions=sql(wp,'SELECT sent_lsn,write_lsn,flush_lsn,replay_lsn FROM pg_stat_replication;')
    assert sql(rp,'SELECT count(*) FROM orders WHERE id=103;')=='0'
    result('remote-flush-before-visibility',boundary=boundary,positions=positions,writer=sql(wp,'SELECT string_agg(id::text,\',\' ORDER BY id) FROM orders;'),standby=sql(rp,'SELECT string_agg(id::text,\',\' ORDER BY id) FROM orders;'))
    proc=subprocess.Popen(cmdsql(wp,"SET synchronous_commit=remote_apply; INSERT INTO orders VALUES(104,'paid');"),stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    try:
        until(lambda:sql(wp,"SELECT count(*) FROM pg_stat_activity WHERE wait_event='SyncRep';")=='1')
        assert proc.poll() is None
        result('remote-apply-waits',wait_event='SyncRep',standby_count=sql(rp,'SELECT count(*) FROM orders WHERE id=104;'))
        sql(rp,'SELECT pg_wal_replay_resume();')
        out,err=proc.communicate(timeout=12);assert proc.returncode==0,(out,err)
        assert sql(rp,'SELECT count(*) FROM orders WHERE id=104;')=='1'
    finally:
        if proc.poll() is None: proc.kill();proc.communicate()
    # Break only the replica's connection configuration, never host networking.
    wrong=port()
    sql(rp,f"ALTER SYSTEM SET primary_conninfo='host=127.0.0.1 port={wrong} user=drill application_name=replica connect_timeout=2';")
    sql(rp,'SELECT pg_reload_conf();')
    until(lambda:sql(wp,'SELECT count(*) FROM pg_stat_replication;')=='0')
    sql(wp,"SET synchronous_commit=local; INSERT INTO orders VALUES(105,'paid');")
    retained=sql(wp,"SELECT pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn)::bigint,wal_status FROM pg_replication_slots WHERE slot_name='replica_slot';")
    proc=subprocess.Popen(cmdsql(wp,"SET synchronous_commit=on; INSERT INTO orders VALUES(106,'paid');"),stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
    try:
        until(lambda:sql(wp,"SELECT count(*) FROM pg_stat_activity WHERE wait_event='SyncRep';")=='1')
        assert proc.poll() is None
        result('disconnected-member',asynchronous_ack=105,required_sync_wait='SyncRep',retained_bytes_and_status=retained,standby=sql(rp,'SELECT string_agg(id::text,\',\' ORDER BY id) FROM orders;'))
        sql(rp,f"ALTER SYSTEM SET primary_conninfo='host=127.0.0.1 port={wp} user=drill application_name=replica connect_timeout=2';");sql(rp,'SELECT pg_reload_conf();')
        out,err=proc.communicate(timeout=12);assert proc.returncode==0,(out,err)
    finally:
        if proc.poll() is None: proc.kill();proc.communicate()
    until(lambda:sql(rp,'SELECT count(*) FROM orders;')=='5')
    final=sql(wp,'SELECT pg_current_wal_flush_lsn();')
    until(lambda:sql(rp,f"SELECT pg_last_wal_replay_lsn()>='{final}'::pg_lsn;")=='t')
    t=time.monotonic();stop(d)
    assert run('pg_ctl','-D',d,'status',check=False).returncode==3
    run('pg_ctl','-D',r,'-w','-t','15','promote')
    assert sql(rp,'SELECT pg_is_in_recovery();')=='f'
    sql(rp,"INSERT INTO orders VALUES(107,'paid');")
    assert run('psql',*cmdsql(wp,'SELECT 1;')[1:],check=False).returncode!=0
    result('planned-switchover',final_boundary=final,orders=sql(rp,'SELECT string_agg(id::text,\',\' ORDER BY id) FROM orders;'),stop_to_new_write_seconds=round(time.monotonic()-t,3),former_writer_stopped=True)
    # Former writer is never started on its old history. Replace from new authority.
    assert not (d/'standby.signal').exists()
    shutil.rmtree(d)
    run('pg_basebackup','-h','127.0.0.1','-p',rp,'-U','drill','-D',d,'-Fp','-X','stream','-R','--checkpoint=fast')
    with (d/'postgresql.conf').open('a') as f:f.write(f'\nport={wp}\n')
    with (d/'postgresql.auto.conf').open('a') as f:f.write("\nprimary_slot_name=''\n")
    start(d);until(lambda:sql(wp,'SELECT count(*) FROM orders;')=='6')
    sql(rp,"INSERT INTO orders VALUES(109,'paid');")
    until(lambda:sql(wp,'SELECT count(*) FROM orders WHERE id=109;')=='1')
    denied=run('psql',*cmdsql(wp,"INSERT INTO orders VALUES(108,'paid');")[1:],check=False)
    assert denied.returncode and 'read-only' in denied.stderr
    result('former-member-replaced',in_recovery=sql(wp,'SELECT pg_is_in_recovery();'),subsequent_order_replayed=109,write_rejected=denied.stderr)
    # A separate pair shows acknowledged asynchronous loss after writer crash.
    x,y,xp,yp=pair('loss');stop(y)
    sql(xp,"INSERT INTO orders VALUES(201,'paid');")
    stop(x,'immediate');t=time.monotonic();start(y)
    run('pg_ctl','-D',y,'-w','-t','15','promote')
    assert sql(yp,'SELECT count(*) FROM orders WHERE id=201;')=='0'
    result('unplanned-writer-loss',acknowledged=[101,201],surviving=[101],lost_acknowledged=[201],start_to_promotion_seconds=round(time.monotonic()-t,3),zero_loss_requirement='FAIL')
    # Local partitions exercise routing, correction, enforcement and retirement.
    sql(rp,"CREATE TABLE events(day date NOT NULL,id int NOT NULL,PRIMARY KEY(day,id)) PARTITION BY RANGE(day); CREATE TABLE events_oct PARTITION OF events FOR VALUES FROM('2026-10-01') TO('2026-11-01'); CREATE TABLE events_nov PARTITION OF events FOR VALUES FROM('2026-11-01') TO('2026-12-01'); INSERT INTO events VALUES('2026-10-20',7),('2026-11-20',7);")
    unique=run('psql',*cmdsql(rp,'ALTER TABLE events ADD UNIQUE(id);')[1:],check=False)
    assert unique.returncode and 'partition' in unique.stderr
    errors=[]
    for day in ['2026-09-30','2026-12-01']:
        z=run('psql',*cmdsql(rp,f"INSERT INTO events VALUES('{day}',9);")[1:],check=False)
        assert z.returncode and 'no partition' in z.stderr;errors.append(z.stderr)
    before=sql(rp,"SELECT tableoid::regclass FROM events WHERE day='2026-10-20' AND id=7;")
    sql(rp,"UPDATE events SET day='2026-11-21' WHERE day='2026-10-20' AND id=7;")
    after=sql(rp,"SELECT tableoid::regclass FROM events WHERE day='2026-11-21' AND id=7;")
    pruned=json.loads(sql(rp,"EXPLAIN(FORMAT JSON) SELECT * FROM events WHERE day>='2026-11-01' AND day<'2026-12-01';"))
    sql(rp,"INSERT INTO events VALUES('2026-10-22',8); CREATE TABLE events_dec (LIKE events INCLUDING ALL); ALTER TABLE events_dec ADD CONSTRAINT events_dec_range CHECK(day>='2026-12-01' AND day<'2027-01-01'); ALTER TABLE events ATTACH PARTITION events_dec FOR VALUES FROM('2026-12-01') TO('2027-01-01'); INSERT INTO events VALUES('2026-12-01',9);")
    assert sql(rp,"SELECT tableoid::regclass FROM events WHERE id=9;")=='events_dec'
    sql(rp,'ALTER TABLE events DETACH PARTITION events_oct;')
    assert sql(rp,'SELECT count(*) FROM events_oct;')=='1'
    result('partition-lifecycle',global_unique_rejected=unique.stderr,missing_bounds=errors,correction_before=before,correction_after=after,pruned_plan=pruned,continuing_rows=sql(rp,'SELECT day,id FROM events ORDER BY day,id;'),detached_rows=sql(rp,'SELECT count(*) FROM events_oct;'))
finally:
    for d in list(running):
        try:stop(d)
        except Exception as e:records.append(dict(cleanup_error=str(e)))
    evidence=dict(runtime=str(B),root=str(root),records=records,logs={x.name:x.read_text() for x in root.glob('*.log')},cleanup='incomplete; directories retained' if running else 'all own clusters stopped and temporary directories removed')
    with a.evidence.open('x') as f:json.dump(evidence,f,indent=2)
    if not running:shutil.rmtree(root)
    print(json.dumps(dict(evidence=str(a.evidence),results=[x for x in records if 'result'in x],cleanup=evidence['cleanup']),indent=2))
