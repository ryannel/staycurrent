from pathlib import Path
import subprocess,json,hashlib,re
repo=Path('/Users/ryannel/Workspace/staycurrent');work=repo/'docs/article-work/relational-rebuild-2026-10-25';w=Path('/private/tmp/staycurrent-relational-rebuild-indexes-writer-20261025');e=w/'evidence';public=w/'public/relational-rebuild/indexes'
record=json.loads((work/'runtime/indexes-fixture.json').read_text());cid=record['container_id'];schema='indexes_delivery';folder='/tmp/staycurrent-index-delivery'
cli=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
def run(args,**kw):return subprocess.run(cli+args,text=True,capture_output=True,timeout=180,**kw)
def checked(args,**kw):
 p=run(args,**kw)
 if p.returncode:raise RuntimeError(p.stderr)
 return p
expected='relational-rebuild-2026-10-25|indexes|/staycurrent-relational-rebuild-indexes-20261025'
assert checked(['inspect','--format','{{index .Config.Labels "dev.staycurrent.task"}}|{{index .Config.Labels "dev.staycurrent.article"}}|{{.Name}}',cid]).stdout.strip()==expected
psql=['exec','-i',cid,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','sc_indexes_writer','-d','sc_indexes']
identity=json.loads(checked(psql,input="SELECT json_build_object('db',current_database(),'usr',current_user,'cluster',current_setting('cluster_name'),'path',current_setting('data_directory'),'version',version());").stdout)
assert identity['db']=='sc_indexes' and identity['usr']=='sc_indexes_writer' and identity['cluster']=='staycurrent-indexes-20261025' and identity['path']=='/var/lib/postgresql/18/docker' and 'PostgreSQL 18.6' in identity['version']
assert checked(psql,input="SELECT count(*) FROM pg_namespace WHERE nspname='indexes_delivery';").stdout.strip()=='0'
files=['experiment.sql','fixture.sql','index-comparison.sql'];hashes={}
for name in files:
 p=public/name;assert p.is_file() and not p.is_symlink();hashes[name]=hashlib.sha256(p.read_bytes()).hexdigest()
assert hashes['fixture.sql']==hashlib.sha256((w/'input/generated-shop-fixture.sql').read_bytes()).hexdigest()
assert hashes['index-comparison.sql']==hashlib.sha256((e/'index-comparison.sql').read_bytes()).hexdigest()
entry=(public/'experiment.sql').read_text();assert set(re.findall(r'(?m)^\\ir (.+)$',entry))=={'fixture.sql','index-comparison.sql'}
checked(['exec',cid,'mkdir','-p',folder])
for name in files:checked(['cp',str(public/name),cid+':'+folder+'/'+name])
created=False;result={'identity':identity,'file_sha256':hashes,'runner_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'scope':'Execute exact delivered psql entrypoint and included files, retain first-run observations separately.'}
try:
 checked(psql,input='CREATE SCHEMA indexes_delivery;');created=True
 q=checked(psql+['-c',"SET search_path=indexes_delivery,pg_catalog; SET statement_timeout='20s'; SET lock_timeout='2s';",'-f',folder+'/experiment.sql'])
 (e/'delivered-stdout.txt').write_text(q.stdout);(e/'delivered-stderr.txt').write_text(q.stderr)
 decoder=json.JSONDecoder();values=[];position=0
 while position<len(q.stdout):
  while position<len(q.stdout) and q.stdout[position].isspace():position+=1
  if position==len(q.stdout):break
  value,position=decoder.raw_decode(q.stdout,position);values.append(value)
 old=json.loads((e/'native-comparison.json').read_text());baseline={x['label']:x['result'] for x in old if isinstance(x,dict) and 'label' in x};new={x['label']:x['result'] for x in values if isinstance(x,dict) and 'label' in x};assert new==baseline and len(new)==59
 result.update(exit_code=0,documents=len(values),matching_result_sets=len(new),history_cases=56,day_cases=3)
finally:
 if created:checked(psql,input='DROP SCHEMA indexes_delivery CASCADE;');result['owned_schema_removed']=True
 (e/'delivered-execution.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='identity'}))
