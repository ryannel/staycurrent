"""Check worksheet endpoint inheritance without contacting an existing database."""
import datetime,json,os,pathlib,socket,subprocess,threading
ROOT=pathlib.Path('/private/tmp/staycurrent-skills-night-a')
OUT=pathlib.Path('/Users/ryannel/Workspace/staycurrent/docs/article-work/skill-revision-2026-10-21/overnight/a')
started=datetime.datetime.now(datetime.timezone.utc).isoformat()
s=socket.socket(socket.AF_INET6);s.bind(('::1',56600));s.listen();s.settimeout(30)
accepted=[]
def endpoint():
 try:
  c,addr=s.accept();accepted.append(addr);c.close()
 except socket.timeout:pass
thread=threading.Thread(target=endpoint);thread.start()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGHOSTADDR='::1',PGCONNECT_TIMEOUT='2',PG_BIN='/opt/homebrew/opt/postgresql@18/bin')
try:
 p=subprocess.run(['python3','src/components/relational-trial-3/a03/verify.py','56600'],cwd=ROOT,env=env,text=True,capture_output=True,timeout=60)
finally:
 thread.join(timeout=1);s.close()
record={'start':started,'end':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':'python3 src/components/relational-trial-3/a03/verify.py 56600','environment_overrides':{k:env[k] for k in ['PGHOSTADDR','PGCONNECT_TIMEOUT','PG_BIN']},'owned_non_database_listener':'[::1]:56600','listener_accepted':len(accepted),'returncode':p.returncode,'stdout':p.stdout,'stderr':p.stderr}
OUT.joinpath('practitioner-hostaddr.json').write_text(json.dumps(record,indent=2))
print(json.dumps({'returncode':p.returncode,'listener_accepted':len(accepted),'evidence':str(OUT/'practitioner-hostaddr.json')}))
