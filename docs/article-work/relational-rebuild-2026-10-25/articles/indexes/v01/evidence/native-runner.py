from pathlib import Path
import subprocess,json,hashlib,re,time
repo=Path('/Users/ryannel/Workspace/staycurrent');work=repo/'docs/article-work/relational-rebuild-2026-10-25';w=Path('/private/tmp/staycurrent-relational-rebuild-indexes-writer-20261025');e=w/'evidence'
fixture=(w/'input/generated-shop-fixture.sql').read_text();comparison=(e/'index-comparison.sql').read_text()
assert not re.search(r'(?m)^\s*\\',fixture+comparison),'Unexpected psql metacommand'
record=json.loads((work/'runtime/indexes-fixture.json').read_text());cid=record['container_id'];db='sc_indexes';user='sc_indexes_writer';schema='indexes_lab'
cli=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
def run(args,**kw):return subprocess.run(cli+args,text=True,capture_output=True,timeout=180,**kw)
q=run(['inspect','--format','{{index .Config.Labels "dev.staycurrent.task"}}|{{index .Config.Labels "dev.staycurrent.article"}}|{{.Name}}',cid]);assert q.returncode==0 and q.stdout.strip()=='relational-rebuild-2026-10-25|indexes|/staycurrent-relational-rebuild-indexes-20261025'
def sql(text):
 q=run(['exec','-i',cid,'psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U',user,'-d',db],input=text)
 if q.returncode:raise RuntimeError(q.stderr)
 return q
identity=json.loads(sql("SELECT json_build_object('version',version(),'database',current_database(),'user',current_user,'cluster',current_setting('cluster_name'),'data_directory',current_setting('data_directory'));\n").stdout)
assert identity['database']==db and identity['user']==user and identity['cluster']=='staycurrent-indexes-20261025' and identity['data_directory']=='/var/lib/postgresql/18/docker' and 'PostgreSQL 18.6' in identity['version']
assert sql("SELECT count(*) FROM pg_namespace WHERE nspname='indexes_lab';\n").stdout.strip()=='0'
marker='CREATE TABLE order_items';assert fixture.count(marker)==1
effective=fixture.replace(marker,'ALTER TABLE orders SET (autovacuum_enabled=false);\n'+marker,1)
created=False;report={'identity':identity,'fixture_sha256':hashlib.sha256(fixture.encode()).hexdigest(),'comparison_sha256':hashlib.sha256(comparison.encode()).hexdigest(),'effective_fixture_sha256':hashlib.sha256(effective.encode()).hexdigest(),'added_execution_control':'Disable orders autovacuum before load; no data/generator change.','runner_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'limits':'Owned isolated PostgreSQL18.6, single process/jitoff controlled read paths; no production or competing-write latency established.'}
try:
 sql('CREATE SCHEMA indexes_lab;');created=True
 q=sql("SET search_path=indexes_lab,pg_catalog; SET statement_timeout='20s'; SET lock_timeout='2s';\n"+effective+'\n'+comparison)
 (e/'native-stdout.txt').write_text(q.stdout);(e/'native-stderr.txt').write_text(q.stderr)
 decoder=json.JSONDecoder();values=[];position=0
 while position<len(q.stdout):
  while position<len(q.stdout) and q.stdout[position].isspace():position+=1
  if position==len(q.stdout):break
  value,position=decoder.raw_decode(q.stdout,position);values.append(value)
 (e/'native-comparison.json').write_text(json.dumps(values,indent=2)+'\n')
 probes=[x for x in values if isinstance(x,dict) and 'label' in x];history=[x for x in probes if ':' in x['label']];assert len(history)==56
 baseline={x['label'].split(':',1)[1]:x['result'] for x in history if x['label'].startswith('primary-key-only:')};assert len(baseline)==8
 for x in history:assert x['result']==baseline[x['label'].split(':',1)[1]],x['label']
 dates=[x for x in probes if x['label'] in ['direct-utc-range','transformed-utc-day','expression-utc-day']];assert len(dates)==3 and all(x['result']==dates[0]['result'] for x in dates)
 report.update(exit_code=0,documents=len(values),history_cases=56,equivalent_parameter_groups=8,equivalent_day_queries=3)
finally:
 if created:sql('DROP SCHEMA indexes_lab CASCADE;');report['owned_schema_removed']=True
 (e/'native-execution.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['identity']}))
