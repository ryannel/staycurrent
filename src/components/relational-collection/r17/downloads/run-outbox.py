#!/usr/bin/env python3
"""Owned disposable PostgreSQL outbox experiments; Python standard library only."""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time
ap=argparse.ArgumentParser(); ap.add_argument('--bindir',required=True); args=ap.parse_args()
binpath=pathlib.Path(args.bindir); env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=pathlib.Path(tempfile.mkdtemp(prefix='sc-r17-')); data=base/'data'; sock=base/'socket'; sock.mkdir(); sessions=[]; results={}
def command(name,*a):
    return subprocess.run([str(binpath/name),*map(str,a)],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True).stdout
class Session:
    def __init__(self,dbname="postgres"):
        self.p=subprocess.Popen([str(binpath/'psql'),'-X','-Atq','-h',str(sock),'-p','55417','-U','writer','-d',dbname,'-v','VERBOSITY=verbose'],env=env,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.q=queue.Queue(); self.n=0; sessions.append(self)
        def pump():
            for line in self.p.stdout: self.q.put(line.rstrip())
        threading.Thread(target=pump,daemon=True).start()
        assert self.run('SHOW data_directory;')==str(data)
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
started=False
try:
    command('initdb','-D',data,'-U','writer','-A','trust','--no-locale')
    command('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p 55417 -c listen_addresses=''",'-w','start'); started=True
    o=Session(); a=Session(); b=Session(); results['version']=o.run('SELECT version();')
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
    assert a.run(renew)=='order-103-created'; results['current_renewal']='matching unexpired generation renewed'
    # Deterministic fault injection: move deadline into the past, no real 5min wait.
    o.run("UPDATE outbox SET lease_until=clock_timestamp()-interval '1 second';"); assert a.run(renew)==''; results['expired_renewal']='expired claim changed0 rows'; assert b.run(claim)=='order-103-created|2'; assert provider.run(deliver)==''; provider.run("INSERT INTO raw_effects VALUES ('order-103-created:confirmation');")
    assert provider.run('SELECT count(*) FROM effects; SELECT count(*) FROM raw_effects;')=='1\n2'; results['effect_then_worker_loss']={'deduplicated_effects':1,'unprotected_effects':2,'delivery_attempts':2}
    assert provider.run("SELECT payload='{}'::jsonb FROM effects WHERE effect_id='order-103-created:confirmation';")=='f'; results['payload_mismatch']='receiver detects changed payload under same effect identity'
    def ack(s,token):return s.run(f"UPDATE outbox SET completed_at=clock_timestamp(),lease_until=NULL WHERE event_id='order-103-created' AND claim_token={token} AND lease_until>clock_timestamp() AND completed_at IS NULL RETURNING event_id;")
    a.run('BEGIN;'); assert a.run("UPDATE outbox SET completed_at=clock_timestamp() WHERE event_id='order-103-created' RETURNING claim_token;")=='2'; a.run('ROLLBACK;'); results['unguarded_stale_completion']='old worker could mark token2 complete without a token predicate; counterexample rolled back'
    assert ack(a,1)==''; assert ack(b,2)=='order-103-created'; results['stale_completion']='token1 changed0 rows; token2 changed1'; assert o.run('SELECT claim_token,attempts,completed_at IS NOT NULL FROM outbox;')=='2|2|t'
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
    results['limits']='Receiver is a stand-in in a second database on the same local PostgreSQL server. No email/payment provider, broker, distributed failure, real lease duration or latency measured. Deadline expiry was injected explicitly.'
    print(json.dumps(results,indent=2))
finally:
    for s in sessions:
        try:s.close()
        except Exception:
            if s.p.poll() is None:s.p.kill();s.p.wait()
    if started:command('pg_ctl','-D',data,'-m','fast','-w','stop')
    shutil.rmtree(base)
