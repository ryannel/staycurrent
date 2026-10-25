"""Continue only the already-created, exact owned backup fixture."""
from pathlib import Path
import hashlib, json, subprocess, time, sys

E = Path('/private/tmp/staycurrent-relational-rebuild-pg-backup-writer-20261025/evidence')
R = '/tmp/sc-pg-backup-20261025'
C = '0333cfbb71d61cd072e7d84c8c7d09bd5cc0edf2f5a6bb6133a028e0e674d6d4'
D = ['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
image = 'postgres@sha256:edb0c08dc33befd0262ab3b5cf1c4f3f8cfd8b09e88c05b45adee29d6761ddb6'
def owned():
    i=json.loads(subprocess.check_output(D+['inspect',C]))[0]
    assert i['Name']=='/staycurrent-relational-rebuild-pg-backup-20261025'
    assert i['Config']['Image']==image
    assert i['Config']['Labels']['dev.staycurrent.article']=='pg-backup'
    assert i['Config']['Labels']['dev.staycurrent.task']=='relational-rebuild-2026-10-25'
    assert i['HostConfig']['NetworkMode']=='none' and not i['HostConfig'].get('PortBindings')
    assert not i['HostConfig']['AutoRemove']
def run(label,args,expected=0,timeout=90):
    owned()
    cmd=D+['exec','--user=postgres',C,'env','-i','PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin','SC_EXPECTED_SYSID=7700753450331590705']+args
    t=time.monotonic(); p=subprocess.run(cmd,capture_output=True,timeout=timeout)
    (E/(label+'.txt')).write_bytes(p.stdout); (E/(label+'-stderr.txt')).write_bytes(p.stderr)
    (E/(label+'-execution.json')).write_text(json.dumps({'command':cmd,'exit_code':p.returncode,'elapsed_seconds':round(time.monotonic()-t,2),'author_script_sha256':hashlib.sha256((E/'native-drill.sh').read_bytes()).hexdigest()},indent=2)+'\n')
    print(label,p.returncode,p.stdout[-500:].decode(errors='replace'),p.stderr[-500:].decode(errors='replace'),flush=True)
    if expected is not None: assert p.returncode==expected
    return p
def phase(name): return run('native-'+name,['/bin/bash',R+'/native-drill.sh',name],timeout=180)

def checked(database,socket,port,data,cluster,statement,label):
    guard=f"DO $g$ BEGIN IF current_database()<>'{database}' OR session_user<>'sc_pg_backup_writer' OR current_setting('server_version_num')<>'180006' OR (SELECT system_identifier::text FROM pg_control_system())<>'7700753450331590705' OR current_setting('data_directory')<>'{data}' OR current_setting('cluster_name')<>'{cluster}' OR current_setting('listen_addresses')<>'' THEN RAISE EXCEPTION 'Wrong fixture'; END IF; END $g$;"
    return run(label,['psql','-X','-qAt','-v','ON_ERROR_STOP=1','-h',socket,'-p',str(port),'-U','sc_pg_backup_writer','-d',database,'-c',guard,'-c',statement])

if __name__=='__main__' and sys.argv[1:]==['finish']:
    # This fences the disposable source database, not an external provider.
    checked('sc_pg_backup_control','/var/run/postgresql',5432,'/var/lib/postgresql/18/docker','staycurrent-pg-backup-20261025',"SELECT datname,datallowconn FROM pg_database WHERE datname='sc_pg_backup';",'native-control-before')
    checked('sc_pg_backup_control','/var/run/postgresql',5432,'/var/lib/postgresql/18/docker','staycurrent-pg-backup-20261025',"ALTER DATABASE sc_pg_backup ALLOW_CONNECTIONS false; SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='sc_pg_backup' AND backend_type='client backend'; SELECT datname,datallowconn FROM pg_database WHERE datname='sc_pg_backup';",'native-source-fence')
    denied=run('native-source-denied',['psql','-X','-h','/var/run/postgresql','-p','5432','-U','sc_pg_backup_writer','-d','sc_pg_backup','-c','SELECT 1'],expected=None)
    assert denied.returncode!=0 and b'not currently accepting connections' in denied.stderr
    run('native-fence-marker',['touch',R+'/SOURCE-CLOSED'])
    checked('sc_pg_backup',R+'/sockets/restore',55432,R+'/restore','staycurrent-pg-backup-restore-20261025','SELECT pg_wal_replay_resume();','native-resume')
    for n in range(60):
        p=checked('sc_pg_backup',R+'/sockets/restore',55432,R+'/restore','staycurrent-pg-backup-restore-20261025','SELECT pg_is_in_recovery();','native-recovery-role')
        if p.stdout.strip()==b'f': break
        time.sleep(.2)
    else: raise RuntimeError('Target did not leave recovery')
    phase('reconcile')
    run('native-final-manifest',['pg_verifybackup',R+'/base'])
    run('native-restore-server-log',['cat',R+'/logs/restore-server.log'])
    # Retain text only; withheld WAL and backup/dump binaries stay disposable.
    files=run('native-evidence-list',['find',R+'/logs','-maxdepth','1','-type','f','-name','*.txt','-print']).stdout.decode().splitlines()
    for f in files: run('captured-'+Path(f).stem,['cat',f])
    run('native-stop-target',['pg_ctl','-D',R+'/restore','-w','-t','30','stop','-m','fast'])
elif __name__=='__main__':
    assert json.loads((E/'native-source-execution.json').read_text())['exit_code']==0
    phase('logical'); phase('prepare')
    run('native-start-restore',['pg_ctl','-D',R+'/restore','-l',R+'/logs/restore-server.log','-w','-t','30','start'])
    phase('paused')
    gap=run('native-start-gap',['pg_ctl','-D',R+'/gap','-l',R+'/logs/gap-server.log','-w','-t','30','start'],expected=None)
    assert gap.returncode!=0, 'Incomplete archive unexpectedly reached target'
    log=run('native-gap-server-log',['cat',R+'/logs/gap-server.log'])
    assert b'recovery ended before configured recovery target was reached' in log.stdout
