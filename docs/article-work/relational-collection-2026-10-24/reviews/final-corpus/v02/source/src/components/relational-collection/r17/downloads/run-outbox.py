#!/usr/bin/env python3
"""Owned disposable PostgreSQL outbox experiments; Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time
ap=argparse.ArgumentParser(); ap.add_argument('--bindir',required=True); args=ap.parse_args()
binpath=pathlib.Path(args.bindir); env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r17-')); base.chmod(0o700); data=base/'data'; sock=base/'socket'; sock.mkdir(mode=0o700); sessions=[]; results={}
def command(name,*a):
    return subprocess.run([str(binpath/name),*map(str,a)],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True,timeout=30).stdout
class Session:
    def __init__(self,dbname="postgres"):
        self.p=subprocess.Popen([str(binpath/'psql'),'-X','-Atq','-h',str(sock),'-p','55417','-U','writer','-d',dbname,'-v','VERBOSITY=verbose'],env=env,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.q=queue.Queue(); self.n=0; sessions.append(self)
        def pump():
            for line in self.p.stdout: self.q.put(line.rstrip())
        threading.Thread(target=pump,daemon=True).start()
        assert self.run('SHOW data_directory;')==str(data)
        assert self.run('SHOW unix_socket_directories;')==str(sock)
        assert self.run('SELECT current_user;')=='writer'
        assert self.run('SELECT current_database();')==dbname
        assert self.run('SHOW port;')=='55417'
        assert self.run('SHOW listen_addresses;')==''
        self.pid=int(self.run('SELECT pg_backend_pid();'))
    def send(self,sql):
        self.n+=1; self.mark=f'END_{self.n}'; self.p.stdin.write(sql+'\n\\echo '+self.mark+'\n'); self.p.stdin.flush()
    def finish(self):
        out=[]; deadline=time.monotonic()+12
        while True:
            line=self.q.get(timeout=max(.01,deadline-time.monotonic()))
            if line==self.mark:return '\n'.join(out)
            out.append(line)
    def run(self,sql): self.send(sql); return self.finish()
    def close(self):
        if self.p.poll() is None:
            self.p.stdin.write('ROLLBACK;\n\\q\n'); self.p.stdin.flush(); self.p.wait(timeout=5)

lock_sql="SELECT event_id FROM outbox WHERE event_id='order-103-created' FOR UPDATE;"
def mutate(session,sql):
    session.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
    session.run(lock_sql)
    row=session.run(sql)
    session.run('COMMIT;')
    return row

class Worker:
    """The article's bounded contract: uncertain replies permanently retire a claim.

    These are synchronous application steps. No receiver request is in flight when
    a renewal begins. Retiring a claim cannot recall an already-sent request.
    """
    def __init__(self,session):
        self.session=session; self.token=None; self.blocked=[]; self.sent=[]
    def claim(self,sql,lose_reply=False,disconnect_before_commit=False):
        assert self.token is None
        self.session.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
        row=self.session.run(sql)
        provisional=int(row.rsplit('|',1)[1]) if row else None
        if disconnect_before_commit:
            self.session.p.kill(); self.session.p.wait(); self.session.p.stdin.close()
            # RETURNING was received, but no COMMIT was sent.
        else:
            self.session.run('COMMIT;')
            # The harness consumed the real response; the simulated worker may not.
            if not lose_reply:self.token=provisional
        return provisional
    def perform(self,kind,sql,lose_reply=False,disconnect_before_commit=False):
        if self.token is None:
            self.blocked.append(kind); return 'abandoned'
        self.sent.append(kind)
        self.session.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
        if kind!='receiver':self.session.run(lock_sql)
        row=self.session.run(sql.format(token=self.token))
        if disconnect_before_commit:
            self.session.p.kill(); self.session.p.wait(); self.session.p.stdin.close()
            self.token=None; return 'uncertain'
        self.session.run('COMMIT;')
        if lose_reply or not row or kind in ('complete','release'):self.token=None
        return row if not lose_reply else 'uncertain'

started=False
try:
    command('initdb','-D',data,'-U','writer','-A','trust','--no-locale')
    command('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p 55417 -c listen_addresses=''",'-w','start'); started=True
    o=Session(); a=Session(); b=Session(); results['version']=o.run('SELECT version();')
    results['ownership']={'data_directory':str(data),'private_socket':str(sock),'role':'writer','every_session_verified':True,'inherited_PG_cleared':True,'tcp_listener':False}
    o.run("CREATE TABLE orders(order_id int PRIMARY KEY); CREATE TABLE outbox(event_id text PRIMARY KEY,order_id int NOT NULL REFERENCES orders,payload jsonb NOT NULL,available_at timestamptz NOT NULL DEFAULT clock_timestamp(),lease_until timestamptz,claim_token bigint NOT NULL DEFAULT 0,attempts int NOT NULL DEFAULT 0,completed_at timestamptz);")
    event="INSERT INTO outbox(event_id,order_id,payload) VALUES ('order-103-created',103,'{\"order_id\":103}');"
    def state():return o.run('SELECT count(*) FROM orders; SELECT count(*) FROM outbox;')
    o.run('INSERT INTO orders VALUES (103);'); assert state()=='1\n0'; results['separate_writes_gap']=state(); o.run('TRUNCATE outbox,orders;')
    a.run('BEGIN; INSERT INTO orders VALUES (103);'); a.run(event); a.p.kill();a.p.wait();a.p.stdin.close()
    for _ in range(150):
        if o.run(f'SELECT count(*) FROM pg_stat_activity WHERE pid={a.pid};')=='0':break
        time.sleep(.01)
    assert state()=='0\n0'; results['precommit_client_loss']=state(); a=Session(); a.run('BEGIN; INSERT INTO orders VALUES (103);'); a.run(event); a.run('COMMIT;'); assert state()=='1\n1'; results['atomic_commit']=state()
    claim="""WITH candidate AS (
 SELECT event_id FROM outbox
 WHERE completed_at IS NULL AND available_at<=clock_timestamp()
 AND (lease_until IS NULL OR lease_until<=clock_timestamp())
 ORDER BY available_at,event_id FOR UPDATE SKIP LOCKED LIMIT 1
) UPDATE outbox AS o SET lease_until=clock_timestamp()+interval '5 minutes',claim_token=o.claim_token+1,attempts=o.attempts+1
FROM candidate AS c WHERE o.event_id=c.event_id RETURNING o.event_id,o.claim_token;"""
    unguarded="SELECT event_id FROM outbox WHERE completed_at IS NULL AND lease_until IS NULL;"
    assert a.run(unguarded)==b.run(unguarded)=='order-103-created'; results['unguarded_selection']='two workers both selected the same event before either claimed it'
    a.run('BEGIN;'); assert a.run(claim)=='order-103-created|1'; b.run('BEGIN;'); assert b.run(claim)==''; b.run('COMMIT;'); a.run('COMMIT;'); assert b.run(claim)==''; results['claim_overlap']='locked row skipped; after commit active lease excludes it'
    o.run('CREATE DATABASE receiver;'); provider=Session('receiver'); provider.run('CREATE TABLE raw_effects(effect_id text); CREATE TABLE effects(effect_id text PRIMARY KEY,payload jsonb NOT NULL);')
    deliver="INSERT INTO effects VALUES ('order-103-created:confirmation','{\"order_id\":103}') ON CONFLICT(effect_id) DO NOTHING RETURNING effect_id;"
    assert provider.run(deliver)=='order-103-created:confirmation'; provider.run("INSERT INTO raw_effects VALUES ('order-103-created:confirmation');")
    renew="UPDATE outbox SET lease_until=clock_timestamp()+interval '5 minutes' WHERE event_id='order-103-created' AND claim_token=1 AND lease_until>clock_timestamp() AND completed_at IS NULL RETURNING event_id;"
    assert mutate(a,renew)=='order-103-created'; results['current_renewal']='matching unexpired generation renewed'
    # Deterministic fault injection: move deadline into the past, no real 5min wait.
    o.run("UPDATE outbox SET lease_until=clock_timestamp()-interval '1 second';"); assert mutate(a,renew)==''; results['expired_renewal']='expired claim changed0 rows'; assert b.run(claim)=='order-103-created|2'; assert provider.run(deliver)==''; provider.run("INSERT INTO raw_effects VALUES ('order-103-created:confirmation');")
    assert provider.run('SELECT count(*) FROM effects; SELECT count(*) FROM raw_effects;')=='1\n2'; results['effect_then_worker_loss']={'deduplicated_effects':1,'unprotected_effects':2,'delivery_attempts':2}
    assert provider.run("SELECT payload='{}'::jsonb FROM effects WHERE effect_id='order-103-created:confirmation';")=='f'; results['payload_mismatch']='receiver detects changed payload under same effect identity'
    def ack(s,token):return mutate(s,f"UPDATE outbox SET completed_at=clock_timestamp(),lease_until=NULL WHERE event_id='order-103-created' AND claim_token={token} AND lease_until>clock_timestamp() AND completed_at IS NULL RETURNING event_id;")
    a.run('BEGIN;'); assert a.run("UPDATE outbox SET completed_at=clock_timestamp() WHERE event_id='order-103-created' RETURNING claim_token;")=='2'; a.run('ROLLBACK;'); results['unguarded_stale_completion']='old worker could mark token2 complete without a token predicate; counterexample rolled back'
    assert ack(a,1)==''; assert ack(b,2)=='order-103-created'; results['stale_completion']='token1 changed0 rows; token2 changed1'; assert o.run('SELECT claim_token,attempts,completed_at IS NOT NULL FROM outbox;')=='2|2|t'

    # The same claim statement as the article, including its returned payload.
    claim_full=claim.replace('RETURNING o.event_id,o.claim_token','RETURNING o.event_id,o.payload,o.claim_token')
    renew_sql="UPDATE outbox SET lease_until=clock_timestamp()+interval '5 minutes' WHERE event_id='order-103-created' AND claim_token={token} AND lease_until>clock_timestamp() AND completed_at IS NULL RETURNING event_id;"
    complete_sql="UPDATE outbox SET completed_at=clock_timestamp(),lease_until=NULL WHERE event_id='order-103-created' AND claim_token={token} AND lease_until>clock_timestamp() AND completed_at IS NULL RETURNING event_id;"
    release_sql="UPDATE outbox SET available_at=clock_timestamp(),lease_until=NULL WHERE event_id='order-103-created' AND claim_token={token} AND lease_until>clock_timestamp() AND completed_at IS NULL RETURNING event_id;"
    receiver_sql="SELECT 'receiver stand-in called';"
    def reset_claim():
        o.run('UPDATE outbox SET claim_token=0,attempts=0,completed_at=NULL,lease_until=NULL,available_at=clock_timestamp();')
    def expire():o.run("UPDATE outbox SET lease_until=clock_timestamp()-interval '1 second';")
    def assert_retired(worker):
        before=list(worker.sent)
        for kind,sql in [('receiver',receiver_sql),('renew',renew_sql),('complete',complete_sql),('release',release_sql)]:
            assert worker.perform(kind,sql)=='abandoned'
        assert worker.sent==before

    # A lock-only holder does not change the tuple. Observe the waiting backend,
    # then let the short deadline pass before releasing it. No timing assumption
    # substitutes for checking both the Lock wait and expiry on the server.
    def wait_for_lock(session):
        deadline=time.monotonic()+5
        while time.monotonic()<deadline:
            if o.run(f"SELECT wait_event_type='Lock' FROM pg_stat_activity WHERE pid={session.pid};")=='t':return
            time.sleep(.01)
        raise AssertionError('expected row-lock wait was not observed')
    def wait_for_expiry():
        deadline=time.monotonic()+5
        while time.monotonic()<deadline:
            if o.run("SELECT lease_until<=clock_timestamp() FROM outbox;")=='t':return
            time.sleep(.01)
        raise AssertionError('expected short deadline did not expire')
    results['lock_wait_expiry']={}
    for kind,sql in [('renew',renew_sql),('complete',complete_sql),('release',release_sql)]:
        results['lock_wait_expiry'][kind]={}
        for lock_first in (False,True):
            reset_claim(); assert a.run(claim_full).endswith('|1')
            o.run("UPDATE outbox SET lease_until=clock_timestamp()+interval '1 second';")
            before=o.run('SELECT lease_until::text FROM outbox;')
            b.run('BEGIN;'); b.run(lock_sql)
            a.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
            assert o.run('SELECT lease_until>clock_timestamp() FROM outbox;')=='t'
            a.send(lock_sql if lock_first else sql.format(token=1))
            wait_for_lock(a); wait_for_expiry()
            expiry_seen=o.run('SELECT clock_timestamp()::text FROM outbox;')
            b.run('COMMIT;'); waited=a.finish()
            changed=a.run(sql.format(token=1)) if lock_first else waited
            a.run('COMMIT;')
            assert changed==('' if lock_first else 'order-103-created')
            results['lock_wait_expiry'][kind]['lock_first' if lock_first else 'direct_counterexample']={
                'lock_wait_observed':True,'expired_before_unlock':True,
                'original_deadline':before,'observer_before_unlock':expiry_seen,
                'updated_row':changed,'state':o.run('SELECT claim_token,lease_until,completed_at,available_at FROM outbox;')}

        # A contrasting waiter meets a newly committed generation, not the same
        # unchanged tuple. A fresh post-lock statement rejects the old token.
        reset_claim(); assert a.run(claim_full).endswith('|1')
        expire(); b.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
        assert b.run(claim_full).endswith('|2')
        a.run('BEGIN ISOLATION LEVEL READ COMMITTED;'); a.send(lock_sql)
        wait_for_lock(a); b.run('COMMIT;'); assert a.finish()=='order-103-created'
        assert a.run(sql.format(token=1))==''; a.run('COMMIT;')
        assert o.run('SELECT claim_token,completed_at IS NULL FROM outbox;')=='2|t'
        results['lock_wait_expiry'][kind]['newer_generation']={'lock_wait_observed':True,'committed_token':2,'old_token_updated_row':''}

    # The chosen boundary is the post-lock check, not the COMMIT time.
    reset_claim(); assert a.run(claim_full).endswith('|1')
    o.run("UPDATE outbox SET lease_until=clock_timestamp()+interval '1 second';")
    original_deadline=o.run('SELECT lease_until::text FROM outbox;')
    a.run('BEGIN ISOLATION LEVEL READ COMMITTED;'); a.run(lock_sql)
    assert a.run(complete_sql.format(token=1))=='order-103-created'
    o.run('SELECT pg_sleep(1.1);')
    assert o.run(f"SELECT clock_timestamp()>'{original_deadline}'::timestamptz;")=='t'
    assert b.run(claim_full)==''
    a.run('COMMIT;')
    assert o.run('SELECT completed_at IS NOT NULL FROM outbox;')=='t'
    results['post_lock_authorisation']={'completion_checked_before_expiry':True,'commit_deliberately_delayed':True,'poll_while_locked':'no claim','completed':True}

    # Exact false-match history: A sees token1, disconnects before COMMIT;
    # B commits token1; A's fresh locking equality lookup matches B's lease.
    reset_claim(); lost=Worker(Session()); survivor=Worker(Session())
    assert lost.claim(claim_full,disconnect_before_commit=True)==1
    for _ in range(150):
        if o.run(f'SELECT count(*) FROM pg_stat_activity WHERE pid={lost.session.pid};')=='0':break
        time.sleep(.01)
    assert o.run('SELECT claim_token,lease_until IS NULL FROM outbox;')=='0|t'
    assert survivor.claim(claim_full)==1 and survivor.token==1
    probe=Session(); probe.run('BEGIN ISOLATION LEVEL READ COMMITTED;')
    assert probe.run("SELECT claim_token=1 AND lease_until>clock_timestamp() FROM outbox WHERE event_id='order-103-created' FOR UPDATE;")=='t'
    # Without retirement, token-only renewal AND completion can change B's row.
    assert probe.run(renew_sql.format(token=1))=='order-103-created'
    assert probe.run(complete_sql.format(token=1))=='order-103-created'
    probe.run('ROLLBACK;')
    assert_retired(lost)
    assert o.run('SELECT claim_token,attempts,completed_at IS NULL FROM outbox;')=='1|1|t'
    assert survivor.perform('receiver',receiver_sql)=='receiver stand-in called'
    assert survivor.perform('renew',renew_sql)=='order-103-created'
    assert survivor.perform('complete',complete_sql)=='order-103-created'
    results['aborted_claim_alias']={'A_returned':1,'after_abort':0,'B_committed':1,'old_locking_test':True,'unsafe_token_only_mutations':'renewal and completion each returned the event; counterexample rolled back','abandoned_A_blocked':lost.blocked,'B_completed':True}

    # Real COMMIT succeeds, but its response is withheld from the worker.
    # A retires even though its token would match; normal polling waits for expiry.
    reset_claim(); lost=Worker(Session()); survivor=Worker(Session())
    assert lost.claim(claim_full,lose_reply=True)==1 and lost.token is None
    assert o.run('SELECT claim_token,lease_until>clock_timestamp() FROM outbox;')=='1|t'
    assert_retired(lost)
    assert survivor.claim(claim_full) is None
    expire(); assert survivor.claim(claim_full)==2 and survivor.token==2
    assert survivor.perform('receiver',receiver_sql)=='receiver stand-in called'
    assert survivor.perform('complete',complete_sql)=='order-103-created'
    results['committed_claim_reply_withheld']={'committed_token':1,'abandoned_A_blocked':lost.blocked,'poll_during_lease':'no claim','after_injected_expiry':2,'recovery_completed':True}

    # Losing a renewal, completion or release response also retires the worker.
    # Actual committed row state decides when normal polling can recover work.
    results['uncertain_followup']={}
    for kind,sql in [('renew',renew_sql),('complete',complete_sql),('release',release_sql)]:
        for fault in ('commit_reply_withheld','disconnect_before_commit'):
            reset_claim(); lost=Worker(Session()); survivor=Worker(Session())
            assert lost.claim(claim_full)==1
            assert lost.perform(kind,sql,lose_reply=True,disconnect_before_commit=fault=='disconnect_before_commit')=='uncertain'
            assert_retired(lost)
            completed=kind=='complete' and fault=='commit_reply_withheld'
            assert o.run('SELECT completed_at IS NOT NULL FROM outbox;')==('t' if completed else 'f')
            eligible=survivor.claim(claim_full)
            if completed:
                assert eligible is None
            elif kind=='release' and fault=='commit_reply_withheld':assert eligible==2
            else:
                assert eligible is None
                expire(); assert survivor.claim(claim_full)==2
            if not completed:assert survivor.perform('complete',complete_sql)=='order-103-created'
            results['uncertain_followup'][kind+'_'+fault]={'retired_operations':lost.blocked,'normal_recovery':'completed event stays excluded' if completed else 'new acknowledged claim completed'}
    provider.run("CREATE TABLE fenced_state(event_id text PRIMARY KEY,last_token bigint NOT NULL,value text); INSERT INTO fenced_state VALUES ('order-103-created',0,'initial');")
    assert provider.run("UPDATE fenced_state SET last_token=2,value='new' WHERE event_id='order-103-created' AND last_token<2 RETURNING last_token;")=='2'
    assert provider.run("UPDATE fenced_state SET last_token=1,value='stale' WHERE event_id='order-103-created' AND last_token<1 RETURNING last_token;")==''
    results['receiver_fence']='receiver accepted2 then rejected1 for this event; higher tokens are not deduplication identities'
    provider.run("CREATE TABLE inbox(consumer text,event_id text,payload jsonb NOT NULL,PRIMARY KEY(consumer,event_id)); CREATE TABLE counter(n int); INSERT INTO counter VALUES (0);")
    receipt="INSERT INTO inbox VALUES ('confirmation-projection','order-103-created','{\"order_id\":103}') ON CONFLICT DO NOTHING RETURNING event_id;"
    provider.run('BEGIN;'); assert provider.run(receipt)=='order-103-created'; provider.run('UPDATE counter SET n=n+1; ROLLBACK;'); assert provider.run('SELECT count(*) FROM inbox; SELECT n FROM counter;')=='0\n0'
    provider.run('BEGIN;'); assert provider.run(receipt)=='order-103-created'; provider.run('UPDATE counter SET n=n+1; COMMIT;'); provider.run('BEGIN;'); assert provider.run(receipt)==''; provider.run('COMMIT;'); assert provider.run('SELECT count(*) FROM inbox; SELECT n FROM counter;')=='1\n1'; results['consumer_atomic_dedup']='rolled-back receipt+effect both0; committed replay leaves one receipt and effect1'
    assert provider.run("SELECT payload='{\"order_id\":103}'::jsonb FROM inbox WHERE consumer='confirmation-projection' AND event_id='order-103-created';")=='t'
    assert provider.run("SELECT payload='{}'::jsonb FROM inbox WHERE consumer='confirmation-projection' AND event_id='order-103-created';")=='f'; results['inbox_payload_conflict']='stored payload matches identical replay and rejects changed input before effect'
    provider.run('TRUNCATE inbox; UPDATE counter SET n=0;'); provider.run(receipt); assert provider.run('SELECT count(*) FROM inbox; SELECT n FROM counter;')=='1\n0'; results['separate_receipt_gap']='receipt committed before effect; simulated crash leaves1 receipt but0 effects'
    results['limits']='Receiver is a stand-in in a second database on the same local PostgreSQL server. Claim-fault cases gate a synchronous receiver-call marker; the existing separate receiver-database cases test effect deduplication. A client is killed before COMMIT and successful replies are withheld from a simulated worker: controlled fault injection, not a real network fault. No email/payment provider, broker, independent machine failure, real five-minute lease duration or latency measured. Lock-wait cases use observed one-second deadlines; other expiry is injected explicitly. Follow-ups authorise at a post-lock predicate test; a delayed commit need not precede the deadline. Retirement cannot recall a request already sent.'
finally:
    for s in sessions:
        try:s.close()
        except Exception:
            if s.p.poll() is None:s.p.kill();s.p.wait()
    if started:command('pg_ctl','-D',data,'-m','fast','-w','stop')
    shutil.rmtree(base)
results['cleanup_verified']=not base.exists() and all(s.p.poll() is not None for s in sessions)
assert results['cleanup_verified']
print(json.dumps(results,indent=2))
