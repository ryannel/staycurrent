import json,os,subprocess,tempfile,shutil
from pathlib import Path
bindir=Path('/opt/homebrew/opt/postgresql@18/bin')
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
base=Path(tempfile.mkdtemp(prefix='sc-practitioner-r17-aba-'));base.chmod(0o700)
data=base/'data';sock=base/'socket';sock.mkdir(mode=0o700);started=False
out={'mechanism':'Controlled connection exit before COMMIT, followed by claim on fresh connection; not a network fault measurement.'}
def tool(name,*args):return subprocess.run([str(bindir/name),*map(str,args)],env=env,text=True,capture_output=True,check=True,timeout=20).stdout.strip()
def sql(text):return tool('psql','-X','-Atq','-v','ON_ERROR_STOP=1','-h',sock,'-p','55477','-U','sc_reviewer','-d','postgres','-c',text)
claim="""WITH candidate AS (SELECT event_id FROM outbox WHERE completed_at IS NULL AND available_at<=clock_timestamp() AND (lease_until IS NULL OR lease_until<=clock_timestamp()) ORDER BY available_at,event_id FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE outbox AS o SET lease_until=clock_timestamp()+interval '5 minutes',claim_token=o.claim_token+1,attempts=o.attempts+1 FROM candidate AS c WHERE o.event_id=c.event_id RETURNING o.event_id,o.claim_token;"""
try:
 out['version']=tool('postgres','--version')
 tool('initdb','-D',data,'-A','trust','-U','sc_reviewer','--no-locale')
 tool('pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p 55477 -c listen_addresses=''",'-w','start');started=True
 assert Path(sql('SHOW data_directory')).resolve()==data.resolve()
 assert sql('SHOW unix_socket_directories')==str(sock)
 assert sql('SELECT current_user')=='sc_reviewer'
 out['ownership_verified']={'private_directory':str(base),'data_directory':str(data),'socket':str(sock),'role':'sc_reviewer','inherited_PG_cleared':True,'tcp_listener':False}
 sql("CREATE TABLE outbox(event_id text PRIMARY KEY,available_at timestamptz NOT NULL DEFAULT clock_timestamp(),lease_until timestamptz,claim_token bigint NOT NULL DEFAULT 0,attempts int NOT NULL DEFAULT 0,completed_at timestamptz);INSERT INTO outbox(event_id) VALUES('order-103-created');")
 out['A_returned_before_commit']=sql('BEGIN ISOLATION LEVEL READ COMMITTED;'+claim)
 assert out['A_returned_before_commit']=='order-103-created|1'
 # psql disconnects with the explicit transaction still open: server rolls it back.
 out['after_A_disconnect']=sql('SELECT claim_token,lease_until IS NULL FROM outbox;')
 assert out['after_A_disconnect']=='0|t'
 out['B_committed_claim']=sql('BEGIN ISOLATION LEVEL READ COMMITTED;'+claim+'COMMIT;')
 assert out['B_committed_claim']=='order-103-created|1'
 out['A_proposed_resolution']=sql("BEGIN ISOLATION LEVEL READ COMMITTED;SELECT event_id,claim_token,claim_token=1 AND lease_until>clock_timestamp() AS proposed_owner_test FROM outbox WHERE event_id='order-103-created' FOR UPDATE;COMMIT;")
 assert out['A_proposed_resolution']=='order-103-created|1|t'
 out['conclusion']='A token equality/unexpired check succeeds against B\u2019s committed claim although A\u2019s claim rolled back.'
finally:
 if started:tool('pg_ctl','-D',data,'-m','fast','-w','stop')
 shutil.rmtree(base)
 out['cleanup_verified']=not base.exists()
Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/relational-collection-2026-10-24/reviews/batch04/practitioner-v01-r17-claim-aba.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
