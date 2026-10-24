"""Run exact changed reader downloads in clean and PGOPTIONS environments."""
from pathlib import Path
import datetime,hashlib,json,os,platform,subprocess,time
root=Path(__file__).resolve().parent.parent
python=Path('/private/tmp/staycurrent-b023-v03-runtime/bin/python')
bindir='/opt/homebrew/opt/postgresql@18/bin'
base_env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
results=[]
for article,filename in [('r04','run-history.py'),('r08','run-imports.py'),('r09','run-boundary.py')]:
    source=root/'src/components/relational-collection'/article/'downloads'/filename
    for case in ['clean','pgoptions-read-only']:
        env=base_env.copy()
        if case!='clean':env['PGOPTIONS']='-c default_transaction_read_only=on'
        command=[str(python),str(source),'--bindir',bindir]
        if article=='r09':command+=['--tmpdir','/tmp']
        start=datetime.datetime.now(datetime.timezone.utc).isoformat();clock=time.monotonic()
        process=subprocess.run(command,env=env,capture_output=True,text=True,timeout=45)
        (root/'evidence'/f'{article}-{case}.jsonl').write_text(process.stdout)
        (root/'evidence'/f'{article}-{case}.stderr.txt').write_text(process.stderr)
        events=[json.loads(line) for line in process.stdout.splitlines() if line.startswith('{')]
        passed=any(e.get('check')=='all checks' and e.get('result')=='passed' for e in events)
        cleanup=any(e.get('check')=='cleanup' and 'removed' in e.get('result','') for e in events)
        ownership=next((e for e in events if e['check']=='owned endpoint'),None)
        row={'article':article,'case':case,'started_utc':start,'elapsed_seconds':time.monotonic()-clock,'command':command,'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'environment_delta':{} if case=='clean' else {'PGOPTIONS':env['PGOPTIONS']},'exit_code':process.returncode,'all_checks_passed':passed,'cleanup_reported':cleanup,'owned_endpoint':ownership}
        if ownership:
            row['data_directory_absent_after_exit']=not Path(ownership['result']['data_directory']).exists()
        results.append(row)
        print(json.dumps(row),flush=True)
        (root/'evidence'/'exact-runs.json').write_text(json.dumps({'platform':platform.platform(),'runs':results},indent=2)+'\n')
        assert process.returncode==0 and passed and cleanup,(article,case,process.stderr)
