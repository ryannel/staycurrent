from pathlib import Path
import datetime,hashlib,json,os,platform,subprocess,sys
root=Path(__file__).resolve().parent.parent
evidence=root/'evidence'
python=Path('/private/tmp/staycurrent-b03-v02-runtime/bin/python')
bindir=Path('/opt/homebrew/opt/postgresql@18/bin')
results=[]
for key,script in [('r04','run-history.py'),('r08','run-imports.py')]:
    folder=root/f'src/components/relational-collection/{key}/downloads'
    argv=[str(python),str(folder/script),'--bindir',str(bindir)]
    env=dict(os.environ,PGHOST='/this-is-not-a-database',PGPORT='1',PGUSER='unowned',PGDATABASE='unowned')
    began=datetime.datetime.now(datetime.UTC).isoformat()
    run=subprocess.run(argv,cwd=folder,env=env,capture_output=True,text=True,timeout=60)
    (evidence/f'{key}-native.jsonl').write_text(run.stdout)
    (evidence/f'{key}-native-stderr.txt').write_text(run.stderr)
    checks=[json.loads(line) for line in run.stdout.splitlines() if line.startswith('{')]
    ownership=next((line['result'] for line in checks if line['check']=='owned endpoint'),None)
    cleanup_absent=ownership is not None and not Path(ownership['data_directory']).parent.exists()
    result={'key':key,'started_utc':began,'finished_utc':datetime.datetime.now(datetime.UTC).isoformat(),'argv':argv,'exit_code':run.returncode,'platform':platform.platform(),'python':sys.version,'inherited_PG_test':'deliberately invalid host/port/user/database; child strips all PG-prefixed variables','owned_endpoint':ownership,'owned_directory_absent_after_run':cleanup_absent,'download_hashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in folder.iterdir() if p.is_file()},'output_sha256':hashlib.sha256(run.stdout.encode()).hexdigest()}
    results.append(result)
    print(json.dumps({'key':key,'exit_code':run.returncode,'ownership':ownership,'cleanup_absent':cleanup_absent,'last_check':checks[-1] if checks else None}))
    if run.returncode or not cleanup_absent:
        print(run.stderr)
        break
(evidence/'native-execution.json').write_text(json.dumps(results,indent=2)+'\n')
assert len(results)==2 and all(x['exit_code']==0 and x['owned_directory_absent_after_run'] for x in results)
