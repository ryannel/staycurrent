import os,subprocess,tempfile,pathlib,getpass,sys,time,json
bindir=pathlib.Path('/opt/homebrew/opt/postgresql@18/bin')
script=pathlib.Path(sys.argv[1]).resolve()
env={k:v for k,v in os.environ.items() if not k.startswith('PG') and k not in ('DATABASE_URL','DATABASE_HOST','DATABASE_PORT')}
t0=time.time()
with tempfile.TemporaryDirectory(prefix='staycurrent-r05-pg-') as tmp:
 base=pathlib.Path(tmp); data=base/'data';sock=base/'socket';sock.mkdir(); started=False
 def run(name,args,**kw):return subprocess.run([str(bindir/name),*args],env=env,text=True,capture_output=True,check=True,**kw)
 try:
  run('initdb',['-D',str(data),'--no-locale','-E','UTF8','-A','trust'])
  run('pg_ctl',['-D',str(data),'-l',str(base/'server.log'),'-o',f"-k {sock} -p 55465 -c listen_addresses=''",'-w','start']);started=True
  args=['-X','-h',str(sock),'-p','55465','-U',getpass.getuser(),'-d','postgres','-v','ON_ERROR_STOP=1']
  own=run('psql',args+['-Atc',"SELECT current_setting('data_directory') || '|' || current_user;"]).stdout.strip()
  assert own==str(data)+'|'+getpass.getuser(),own
  print(run('postgres',['--version']).stdout.strip());print('Verified owned private instance; connection variables cleared.')
  print(run('psql',args+['-f',str(script)]).stdout)
 finally:
  if started:run('pg_ctl',['-D',str(data),'-m','immediate','-w','stop'])
print('Owned server stopped; temporary data and socket removed.')
print('Elapsed seconds:',round(time.time()-t0,3))
