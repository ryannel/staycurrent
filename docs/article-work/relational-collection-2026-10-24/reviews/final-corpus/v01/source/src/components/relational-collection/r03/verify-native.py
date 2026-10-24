"""Run only against an owned disposable PostgreSQL cluster; never inherits PG settings."""
from pathlib import Path
import subprocess, tempfile, os, shutil, time, json, hashlib, select
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
BIN=Path('/opt/homebrew/opt/postgresql@18/bin')
ENV={k:v for k,v in os.environ.items() if not k.startswith('PG')}
ENV.update({'PATH':str(BIN)+':/usr/bin:/bin','LC_ALL':'C'})
base=Path(tempfile.mkdtemp(prefix='staycurrent-r03-owned-',dir='/private/tmp'))
marker=base/'owner-r03'; marker.write_text('disposable r03 constraint verification\n')
data=base/'data'; sock=base/'socket'; sock.mkdir(mode=0o700)
started=False; beginning=time.time(); record={'started_utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'data_directory':str(data),'socket_directory':str(sock),'port':55473,'environment':'inherited PG* variables removed; explicit user/database/socket/port; no TCP listener','commands':[]}
record['source_hashes']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__).resolve(),HERE/'downloads/constraints.sql',ROOT/'src/lib/relational-collection/core.json']}
def run(args,**kw):
    record['commands'].append([str(x) for x in args])
    return subprocess.run([str(x) for x in args],env=ENV,text=True,capture_output=True,check=True,**kw)
def psql(sql,app='r03_verifier'):
    args=[str(BIN/'psql'),'-X','-qAt','-h',str(sock),'-p','55473','-U','r03_owner','-d','postgres','-v','ON_ERROR_STOP=1','-c',sql]
    record['commands'].append(args)
    return subprocess.run(args,env={**ENV,'PGAPPNAME':app},text=True,capture_output=True,check=True)

try:
    record['version']=run([BIN/'postgres','--version']).stdout.strip()
    run([BIN/'initdb','-D',data,'-A','trust','-U','r03_owner','--no-locale','--encoding=UTF8'])
    run([BIN/'pg_ctl','-D',data,'-l',base/'server.log','-o',f"-k {sock} -p 55473 -c listen_addresses=''",'-w','start']); started=True
    identity=psql("SELECT current_user || '|' || current_database() || '|' || current_setting('data_directory');").stdout.strip()
    assert identity==f'r03_owner|postgres|{data}',identity
    record['ownership_verified']=identity
    worksheet=HERE/'downloads/constraints.sql'
    result=run([BIN/'psql','-X','-h',sock,'-p','55473','-U','r03_owner','-d','postgres','-v','ON_ERROR_STOP=1','-f',worksheet])
    (ROOT/'evidence/worksheet-output.txt').write_text(result.stdout+'\nSTDERR (expected-failure notices)\n'+result.stderr)
    assert 'All expected constraint outcomes checked' in result.stdout
    record['worksheet']='passed exact downloaded file'
    # A shared scratch table needs permanent lifetime across the three owned sessions.
    psql('CREATE TABLE race_lines(order_id integer,line_no integer,PRIMARY KEY(order_id,line_no)); CREATE TABLE race_unchecked(order_id integer,line_no integer);')
    baseargs=[str(BIN/'psql'),'-X','-qAt','-h',str(sock),'-p','55473','-U','r03_owner','-d','postgres','-v','ON_ERROR_STOP=1']
    a=subprocess.Popen(baseargs,env={**ENV,'PGAPPNAME':'r03_a'},text=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,bufsize=1)
    a.stdin.write("BEGIN; INSERT INTO race_lines VALUES(103,1); SELECT 'a_inserted';\n"); a.stdin.flush()
    ready,_,_=select.select([a.stdout],[],[],10)
    assert ready,'A did not signal its uncommitted insert'
    assert a.stdout.readline().strip()=='a_inserted'
    b=subprocess.Popen(baseargs+['-c','BEGIN; INSERT INTO race_lines VALUES(103,1); COMMIT;'],env={**ENV,'PGAPPNAME':'r03_b'},text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    end=time.monotonic()+10; waiting=''
    while time.monotonic()<end:
        waiting=psql("SELECT wait_event_type || ':' || wait_event FROM pg_stat_activity WHERE application_name='r03_b' AND wait_event_type='Lock';").stdout.strip()
        if waiting: break
        time.sleep(0.03)
    assert waiting,'B was not observed waiting on the conflicting insertion'
    record['unique_wait']=waiting
    a.stdin.write('COMMIT;\n\\q\n'); a.stdin.flush()
    aout,aerr=a.communicate(timeout=10)
    bout,berr=b.communicate(timeout=10)
    assert a.returncode==0,(aout,aerr)
    assert b.returncode!=0 and 'duplicate key' in berr,(bout,berr)
    record['second_insert_error']=berr.strip()
    record['protected_count']=int(psql('SELECT count(*) FROM race_lines;').stdout.strip())
    assert record['protected_count']==1
    # Counterexample: both independently read an empty identity and both commit it.
    e1=psql('SELECT count(*) FROM race_unchecked WHERE order_id=103 AND line_no=1;').stdout.strip()
    e2=psql('SELECT count(*) FROM race_unchecked WHERE order_id=103 AND line_no=1;').stdout.strip()
    psql('INSERT INTO race_unchecked VALUES(103,1);')
    psql('INSERT INTO race_unchecked VALUES(103,1);')
    record['unchecked_prechecks']=[e1,e2]
    record['unchecked_count']=int(psql('SELECT count(*) FROM race_unchecked;').stdout.strip())
    assert record['unchecked_count']==2
    record['status']='passed'
finally:
    if started:
        try: run([BIN/'pg_ctl','-D',data,'-m','fast','-w','stop']); record['server_stopped']=True
        except Exception as exc:
            record['fast_stop_error']=str(exc)
            try: run([BIN/'pg_ctl','-D',data,'-m','immediate','-w','stop']); record['server_stopped']=True
            except Exception as last_exc: record['stop_error']=str(last_exc)
    if (not started or record.get('server_stopped')) and marker.exists() and marker.read_text()=='disposable r03 constraint verification\n':
        shutil.rmtree(base); record['owned_directory_removed']=not base.exists()
    record['elapsed_seconds']=round(time.time()-beginning,3)
    record['finished_utc']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
    (ROOT/'evidence/native-results.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps(record,indent=2))
