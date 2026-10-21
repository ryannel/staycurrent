"""A deliberately wrong owned-cluster identity must stop before CREATE DATABASE."""
import json, pathlib, subprocess, tempfile
here=pathlib.Path(__file__).resolve().parent
source=pathlib.Path('/private/tmp/staycurrent-skills-night-a-repair/src/components/relational-trial-3/a03/verify.py').read_text()
with tempfile.TemporaryDirectory(prefix='a03-identity-failure-',dir='/tmp') as tmp:
 test=pathlib.Path(tmp,'verify.py')
 test.write_text(source.replace("IDENTITY=f'{pathlib.Path(data).resolve()}|{PORT}|{system_id}'", "IDENTITY='deliberate mismatch'"))
 result=subprocess.run(['python3',str(test),'56701'],text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 here.joinpath('identity-failure-native.json').write_text(result.stdout)
 log=json.loads(result.stdout)
 init=next(x for x in log if 'command' in x and x['command'][0].endswith('/initdb'))
 root=pathlib.Path(init['command'][2]).parent
 receipt={'exit':result.returncode,'fixture_mutation_submitted':any('CREATE DATABASE' in x.get('sql','') for x in log),'shutdown':next(x for x in log if 'command' in x and x['command'][-1]=='stop'),'temporary_root_removed':not root.exists()}
 assert result.returncode!=0
 assert not receipt['fixture_mutation_submitted']
 assert receipt['shutdown']['status']==0 and receipt['temporary_root_removed']
 here.joinpath('identity-failure.json').write_text(json.dumps(receipt,indent=2)+'\n')
 print(json.dumps(receipt,indent=2))
