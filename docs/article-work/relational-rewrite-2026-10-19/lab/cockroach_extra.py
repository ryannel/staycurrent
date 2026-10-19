"""Additional bounded native histories for the same disposable lab."""
import csv
import io
import json
import os
from pathlib import Path
import queue
import subprocess
import tempfile
import threading
import time
from urllib.parse import urlencode

class Client:
    def __init__(self, lab, name, node=1, database='workshop'):
        self.lab, self.name = lab, name
        params=urlencode({'sslmode':'verify-full','sslrootcert':str(lab.certs/'ca.crt'),
                          'sslcert':str(lab.certs/'client.root.crt'),'sslkey':str(lab.certs/'client.root.key')})
        uri=f'postgresql://root@localhost:{56900+node}/{database}?{params}'
        self.process=subprocess.Popen(['psql','-X','-qAt',uri],stdin=subprocess.PIPE,stdout=subprocess.PIPE,
                                      stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.lines=queue.Queue()
        def read():
            for line in self.process.stdout:self.lines.put(line.rstrip('\n'))
        threading.Thread(target=read,daemon=True).start()
        self.send('SET application_name = \'staycurrent-worksheet\';')
        self.send('\\set VERBOSITY verbose')
    def send(self,statement):
        marker=f'__worksheet_{time.monotonic_ns()}__'
        self.process.stdin.write(statement+'\n\\echo '+marker+'\n')
        self.process.stdin.flush()
        result=[]
        while True:
            line=self.lines.get(timeout=35)
            if line==marker:break
            result.append(line)
        self.lab.records.append({'label':self.name,'sql':statement,'stdout':'\n'.join(result)})
        self.lab.save()
        return '\n'.join(result)
    def close(self):
        self.process.stdin.write('\\q\n');self.process.stdin.flush()
        self.process.wait(timeout=10)

def concurrency(lab):
    lab.sql('RL124-reset-capacity',"UPDATE workshop.sessions SET remaining=1 WHERE session='s7'")
    a,b=Client(lab,'RL124-client-A'),Client(lab,'RL124-client-B')
    try:
        a.send('BEGIN ISOLATION LEVEL SERIALIZABLE; SELECT remaining FROM sessions;')
        b.send('BEGIN ISOLATION LEVEL SERIALIZABLE; SELECT remaining FROM sessions;')
        a.send("UPDATE sessions SET remaining=0; INSERT INTO orders VALUES('t4','concurrent-A',42,20.00); COMMIT;")
        rejected=b.send("UPDATE sessions SET remaining=0; INSERT INTO orders VALUES('t4','concurrent-B',43,20.00); COMMIT;")
        if '40001' not in rejected:raise AssertionError('Expected exposed serializable conflict')
        b.send('ROLLBACK; BEGIN; SELECT remaining FROM sessions; ROLLBACK;')
    finally:
        a.close();b.close()
    lab.sql('RL124-final-accepted-state',"SELECT * FROM workshop.sessions; SELECT request FROM workshop.orders WHERE request LIKE 'concurrent-%' ORDER BY request")
    lab.sql('RL125-unsupported-bounded-scan', "SELECT * FROM workshop.sessions AS OF SYSTEM TIME with_max_staleness('10s')",check=False)
    lab.sql('RL125-native-bounded-read',"SELECT * FROM workshop.sessions AS OF SYSTEM TIME with_max_staleness('10s') WHERE tenant='t4' AND session='s7'")
    lab.sql('RL125-native-history-is-readonly',"BEGIN AS OF SYSTEM TIME follower_read_timestamp(); UPDATE workshop.sessions SET remaining=999; ROLLBACK",check=False)

def online_change(lab):
    lab.sql('RL130-online-fixture', "CREATE TABLE workshop.schema_live(id INT PRIMARY KEY, payload STRING); INSERT INTO workshop.schema_live SELECT x, repeat('x',200) FROM generate_series(1,50000) AS g(x)", timeout=180)
    outcome={}
    def build():
        outcome['result']=lab.sql('RL130-concurrent-index-client', 'CREATE INDEX online_payload ON workshop.schema_live(payload)',check=False,timeout=180)
    thread=threading.Thread(target=build)
    thread.start()
    job=None
    for _ in range(100):
        observed=lab.sql('RL130-find-active-job', "SELECT job_id,status FROM [SHOW JOBS] WHERE description LIKE 'CREATE INDEX online_payload%' AND status IN ('running','pending') ORDER BY created DESC LIMIT 1")
        rows=list(csv.DictReader(io.StringIO(observed.stdout)))
        if rows:
            job=rows[-1]['job_id'];break
        if not thread.is_alive():break
        time.sleep(.1)
    lab.sql('RL130-old-caller-during-build', 'SELECT id FROM workshop.schema_live WHERE id=1; UPDATE workshop.schema_live SET payload=\'changed\' WHERE id=1')
    if job:
        lab.sql('RL130-pause-job',f'PAUSE JOB {job}',check=False)
        lab.sql('RL130-observe-paused',f'SELECT job_id,status,error FROM [SHOW JOBS] WHERE job_id={job}')
        for _ in range(60):
            state=lab.sql('RL130-wait-until-paused',f'SELECT status FROM [SHOW JOBS] WHERE job_id={job}')
            if state.stdout.strip().splitlines()[-1]=='paused':break
            time.sleep(.25)
        else:raise RuntimeError('Pause did not reach paused state')
        lab.sql('RL130-old-caller-while-paused','INSERT INTO workshop.schema_live VALUES(50001,\'new\'); SELECT payload FROM workshop.schema_live WHERE id=1')
        lab.sql('RL130-resume-job',f'RESUME JOB {job}',check=False)
    thread.join(timeout=185)
    if thread.is_alive():raise RuntimeError('Schema client did not finish')
    for _ in range(300):
        result=lab.sql('RL130-final-schema-job',"SELECT job_id,status,error FROM [SHOW JOBS] WHERE description LIKE 'CREATE INDEX online_payload%' ORDER BY created DESC LIMIT 1")
        if 'succeeded' in result.stdout:break
        time.sleep(1)
    else:raise RuntimeError('Schema job did not reach succeeded')
    lab.sql('RL130-new-caller-after-publication',"SELECT id FROM workshop.schema_live@online_payload WHERE payload='changed'; SELECT count(*) FROM workshop.schema_live")

def regions(lab):
    for n in range(4,10):lab.start(n)
    for n in range(4,10):lab.wait(n)
    lab.sql('RL127-three-region-database',"CREATE DATABASE regional PRIMARY REGION 'eu'; ALTER DATABASE regional ADD REGION 'us'; ALTER DATABASE regional ADD REGION 'ap'; ALTER DATABASE regional SURVIVE REGION FAILURE")
    lab.sql('RL127-regional-rows',"CREATE TABLE regional.bookings(tenant STRING, request STRING, amount DECIMAL(10,2), PRIMARY KEY(tenant,request)) LOCALITY REGIONAL BY ROW; INSERT INTO regional.bookings(tenant,request,amount) VALUES('t4','region-r1',20.00); SHOW REGIONS FROM DATABASE regional; SHOW CREATE TABLE regional.bookings", database='regional')
    lab.sql('RL127-global-catalogue', "CREATE TABLE regional.catalogue(id INT PRIMARY KEY, name STRING) LOCALITY GLOBAL; INSERT INTO regional.catalogue VALUES(7,'Repair basics'); SHOW CREATE TABLE regional.catalogue; SHOW RANGES FROM TABLE regional.catalogue WITH DETAILS", database='regional')
    for attempt in range(60):
        observation=lab.sql('RL127-check-voting-placement',"SELECT count(*) AS ranges, min(array_length(voting_replicas,1)) AS min_voters FROM [SHOW RANGES FROM TABLE regional.bookings WITH DETAILS]")
        rows=list(csv.DictReader(io.StringIO(observation.stdout)))
        if rows and rows[-1]['min_voters']=='5':break
        time.sleep(1)
    else:raise AssertionError('Regional replicas did not reach five voters')
    lab.sql('RL127-placement-before-loss','SHOW RANGES FROM TABLE regional.bookings WITH DETAILS')
    for n in (1,4,5):lab.stop(n,abrupt=True)
    lab.sql('RL127-eu-group-unavailable',"SELECT * FROM regional.bookings; INSERT INTO regional.bookings(tenant,request,amount) VALUES('t4','region-r2',22.00); SELECT count(*),sum(amount) FROM regional.bookings",node=2,timeout=150,database='regional')
    for n in (1,4,5):lab.start(n)
    for n in (1,4,5):lab.wait(n)
    lab.sql('RL127-after-group-return','SELECT count(*),sum(amount) FROM regional.bookings; SHOW RANGES FROM TABLE regional.bookings WITH DETAILS')
    lab.command('RL128-nine-node-health',[lab.binary,'node','status',f'--certs-dir={lab.certs}','--host=localhost:56901','--format=csv','--ranges','--stats'])
    # Node IDs are independent of listener numbers. Discover through CLI output.
    status=lab.command('RL128-before-removal',[lab.binary,'node','status',f'--certs-dir={lab.certs}','--host=localhost:56901','--format=csv'])
    node_id=next(row['id'] for row in csv.DictReader(io.StringIO(status.stdout)) if row['address']=='localhost:56909')
    lab.command('RL128-decommission-node',[lab.binary,'node','decommission',node_id,f'--certs-dir={lab.certs}','--host=localhost:56901','--wait=all'],timeout=180)
    lab.stop(9)
    lab.sql('RL128-after-decommission','SELECT count(*),sum(amount) FROM regional.bookings; SHOW RANGES FROM TABLE regional.bookings WITH DETAILS')

def migration(lab):
    directory=Path(tempfile.mkdtemp(prefix='staycurrent-crdb-migration-pg-'))
    env={**os.environ,'PGHOST':str(directory),'PGPORT':'56920','PGUSER':os.environ.get('USER','ryannel'),'PGDATABASE':'postgres'}
    def pg(label,statement,check=True,user=None):
        selected={**env,**({'PGUSER':user} if user else {})}
        result=subprocess.run(['psql','-X','-q','-v','ON_ERROR_STOP=1','-A','-t','-c',statement],env=selected,capture_output=True,text=True,timeout=30)
        lab.record(label,['psql','-X','-v','ON_ERROR_STOP=1','-A','-t','-c','<recorded SQL>'],result,statement)
        if check and result.returncode:raise RuntimeError(result.stderr)
        return result.stdout
    try:
        lab.command('RL132-init-source',['initdb','-D',directory/'data','--auth=trust','--no-locale'])
        lab.command('RL132-start-source',['pg_ctl','-D',directory/'data','-l',directory/'postgres.log','-o',f'-p 56920 -k {directory} -c listen_addresses=127.0.0.1','-w','start'])
        pg('RL132-source-schema-valid',"CREATE TABLE sessions(tenant TEXT,session TEXT,remaining INT,PRIMARY KEY(tenant,session)); CREATE TABLE orders(tenant TEXT,request TEXT,session TEXT,amount NUMERIC(10,2),PRIMARY KEY(tenant,request), FOREIGN KEY(tenant,session) REFERENCES sessions(tenant,session) DEFERRABLE INITIALLY DEFERRED)")
        pg('RL132-deferred-write-order',"BEGIN; INSERT INTO orders VALUES('t4','r81','s7',20.00); INSERT INTO sessions VALUES('t4','s7',1); COMMIT; SELECT count(*),sum(amount) FROM orders")
        lab.sql('RL132-create-target','CREATE DATABASE migration')
        lab.sql('RL132-target-deferred-constraint',"CREATE TABLE migration.sessions(tenant STRING,session STRING,remaining INT,PRIMARY KEY(tenant,session)); CREATE TABLE migration.orders(tenant STRING,request STRING,session STRING,amount DECIMAL(10,2),PRIMARY KEY(tenant,request), FOREIGN KEY(tenant,session) REFERENCES migration.sessions(tenant,session) DEFERRABLE INITIALLY DEFERRED)",check=False)
        lab.sql('RL132-target-immediate-schema',"CREATE TABLE IF NOT EXISTS migration.sessions(tenant STRING,session STRING,remaining INT,PRIMARY KEY(tenant,session)); CREATE TABLE migration.orders(tenant STRING,request STRING,session STRING,amount DECIMAL(10,2),PRIMARY KEY(tenant,request), FOREIGN KEY(tenant,session) REFERENCES migration.sessions(tenant,session))")
        lab.sql('RL132-target-old-write-order',"BEGIN; INSERT INTO migration.orders VALUES('t4','r81','s7',20.00); INSERT INTO migration.sessions VALUES('t4','s7',1); COMMIT",check=False)
        pg('RL132-source-application-identity', 'CREATE ROLE source_app LOGIN; GRANT USAGE ON SCHEMA public TO source_app; GRANT SELECT,INSERT,UPDATE,DELETE ON sessions,orders TO source_app')
        pg('RL132-source-write-fence','REVOKE INSERT,UPDATE,DELETE ON sessions,orders FROM source_app')
        pg('RL132-denied-source-application-write', "INSERT INTO orders VALUES('t4','should-not-commit','s7',1.00)", check=False, user='source_app')
        # This bounded offline rehearsal stops application admission explicitly.
        # No live replication or unimplemented CDC completeness is claimed.
        export=pg('RL132-consistent-source-export', "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY; SELECT json_build_object('sessions',(SELECT json_agg(s ORDER BY tenant,session) FROM sessions s),'orders',(SELECT json_agg(o ORDER BY tenant,request) FROM orders o)); COMMIT")
        rows=json.loads(next(line for line in export.splitlines() if line.startswith('{')))
        literal=lambda value: 'NULL' if value is None else "'"+str(value).replace("'","''")+"'"
        inserts=['BEGIN']
        for table,columns in [('sessions',['tenant','session','remaining']),('orders',['tenant','request','session','amount'])]:
            for row in rows[table]:
                inserts.append(f"INSERT INTO migration.{table} ({','.join(columns)}) VALUES ({','.join(literal(row[c]) for c in columns)})")
        inserts+=['COMMIT','SELECT count(*),sum(amount) FROM migration.orders']
        lab.sql('RL132-corrected-copy-order','; '.join(inserts))
        lab.sql('RL132-new-authority-write',"BEGIN; UPDATE migration.sessions SET remaining=remaining-1 WHERE tenant='t4' AND session='s7' AND remaining>0; INSERT INTO migration.orders VALUES('t4','r82','s7',22.00); COMMIT; SELECT count(*),sum(amount) FROM migration.orders")
        pg('RL132-old-source-misses-later-acceptance','SELECT count(*),sum(amount) FROM orders')
        pg('RL132-reconcile-before-return',"BEGIN; UPDATE sessions SET remaining=0 WHERE tenant='t4' AND session='s7'; INSERT INTO orders VALUES('t4','r82','s7',22.00); COMMIT; SELECT count(*),sum(amount) FROM orders")
    finally:
        subprocess.run(['pg_ctl','-D',str(directory/'data'),'-m','immediate','stop'],env=env,capture_output=True,text=True)
        import shutil
        shutil.rmtree(directory)
