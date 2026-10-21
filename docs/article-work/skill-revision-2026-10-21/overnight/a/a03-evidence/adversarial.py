"""Run repaired worksheet with hostile libpq defaults and a non-database trap."""
import json, os, pathlib, socket, subprocess, tempfile, threading

here=pathlib.Path(__file__).resolve().parent
source=pathlib.Path('/private/tmp/staycurrent-skills-night-a-repair/src/components/relational-trial-3/a03/verify.py')
received=[]
trap=socket.socket(socket.AF_INET6,socket.SOCK_STREAM)
trap.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
trap.bind(('::1',56700));trap.listen();trap.settimeout(.1)
done=threading.Event()
def listen():
 while not done.is_set():
  try:
   connection,address=trap.accept()
   received.append(str(address));connection.close()
  except socket.timeout:pass
worker=threading.Thread(target=listen);worker.start()
try:
 with tempfile.TemporaryDirectory(prefix='a03-hostile-service-',dir='/tmp') as tmp:
  service=pathlib.Path(tmp,'service.conf')
  service.write_text('[hostile]\nhostaddr=::1\nport=56700\nuser=unintended\ndbname=postgres\n')
  env=os.environ.copy()
  env.update(PGHOSTADDR='::1',PGHOST='/no-such-socket',PGPORT='56700',PGUSER='unintended',PGDATABASE='postgres',PGSERVICE='hostile',PGSERVICEFILE=str(service),PGOPTIONS='-c unknown_setting=on',PGCONNECT_TIMEOUT='2')
  result=subprocess.run(['python3',str(source),'56700'],env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  here.joinpath('native-56700.json').write_text(result.stdout)
  here.joinpath('native-56700.stderr').write_text(result.stderr)
finally:
 done.set();worker.join();trap.close()
receipt={'port':56700,'hostile_environment':['PGHOSTADDR','PGHOST','PGPORT','PGUSER','PGDATABASE','PGSERVICE','PGSERVICEFILE','PGOPTIONS','PGCONNECT_TIMEOUT'],'non_database_trap_connections':received,'worksheet_exit':result.returncode}
here.joinpath('adversarial.json').write_text(json.dumps(receipt,indent=2)+'\n')
assert result.returncode==0,result.stderr
assert received==[],received
print(json.dumps(receipt,indent=2))
