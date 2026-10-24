from pathlib import Path
import os, subprocess, tempfile, shutil, json, time, pwd
base=Path(__file__).resolve().parents[1]
pg=Path('/opt/homebrew/opt/postgresql@18/bin')
owned=Path(tempfile.mkdtemp(prefix='sc-r11-native-',dir='/private/tmp'))
data=owned/'data'; sock=owned/'sock'; sock.mkdir()
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env['LC_ALL']='C'
def run(args,**kw):
 return subprocess.run([str(x) for x in args],env=env,text=True,check=True,**kw)
started=False; begin=time.time()
try:
 run([pg/'initdb','-D',data,'--no-locale','-E','UTF8','-A','trust'],capture_output=True)
 run([pg/'pg_ctl','-D',data,'-l',owned/'server.log','-o',f'-k {sock} -h "" -p 55492','-w','start'],capture_output=True);started=True
 conn=[pg/'psql','-X','-h',sock,'-p','55492','-U',pwd.getpwuid(os.getuid()).pw_name,'-d','postgres','-v','ON_ERROR_STOP=1']
 check=run(conn+['-Atc','SHOW data_directory'],capture_output=True).stdout.strip()
 assert Path(check)==data
 result=run(conn+['-f',base/'src/components/relational-collection/r11/downloads/query-work.sql'],capture_output=True)
 (base/'evidence/native-output.txt').write_text(result.stdout+result.stderr)
 (base/'evidence/native-environment.json').write_text(json.dumps({'version':run([pg/'postgres','--version'],capture_output=True).stdout.strip(),'data_directory_verified':check,'socket':str(sock),'listen_addresses':'','elapsed_seconds':time.time()-begin,'command':'psql -X -v ON_ERROR_STOP=1 -f query-work.sql','fixture':'g=1..100000; shop10 paid99000, shop20 pending1000; 3 generated lines per generated order; no randomness; parallel gathering disabled'},indent=2))
finally:
 if started: run([pg/'pg_ctl','-D',data,'-m','fast','-w','stop'],capture_output=True)
 shutil.rmtree(owned)
print('Owned PostgreSQL run complete; instance stopped and temporary directory removed.')
