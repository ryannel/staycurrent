from pathlib import Path
import subprocess, os, shutil
root=Path(__file__).resolve().parent.parent
cluster=root/'evidence'/'owned-cluster'
socket=root/'pgsock'
socket.mkdir(exist_ok=True)
env={'PATH':'/opt/homebrew/bin:/usr/bin:/bin','LANG':'C','LC_ALL':'C','TMPDIR':'/private/tmp'}
def run(args,**kwargs):
    result = subprocess.run(args,env=env,text=True,capture_output=True,**kwargs)
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    return result
pgctl='/opt/homebrew/bin/pg_ctl'
psql=['/opt/homebrew/bin/psql','-X','-h',str(socket),'-p','56412','-U','query_writer','-d','postgres','-v','ON_ERROR_STOP=1']
started=False
try:
    init=run(['/opt/homebrew/bin/initdb','-D',str(cluster),'-U','query_writer','-A','trust','--no-locale','--encoding=UTF8'])
    run([pgctl,'-D',str(cluster),'-l',str(root/'evidence'/'native-server.log'),'-o',f"-k {socket} -p 56412 -c listen_addresses=''",'start'])
    started=True
    target=run(psql+['-Atc','SHOW data_directory;']).stdout.strip()
    if Path(target).resolve()!=cluster.resolve(): raise RuntimeError('Unexpected database target; refusing writes')
    result=run(psql+['-f',str(root/'public/relational-rebuild/query-results/shop-queries.sql')])
    version=run(psql+['-Atc','SELECT version();']).stdout
    (root/'evidence'/'native-results.txt').write_text('Verified owned data_directory: '+target+'\n'+version+'\n'+result.stdout+'\n'+result.stderr)
finally:
    if started: run([pgctl,'-D',str(cluster),'-m','fast','stop'])
    if cluster.exists(): shutil.rmtree(cluster)
    if socket.exists(): shutil.rmtree(socket)
