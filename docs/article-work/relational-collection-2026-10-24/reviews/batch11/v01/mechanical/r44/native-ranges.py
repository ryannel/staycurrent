import os, pathlib, subprocess, tempfile, socket, time, json, shutil, signal, hashlib
BASE=pathlib.Path(__file__).resolve().parents[1]
BIN='/private/tmp/staycurrent-relational-20261024-tools/cockroach-v25.4.17.darwin-11.0-arm64/cockroach'
ENV={k:v for k,v in os.environ.items() if not k.startswith(('PG','COCKROACH'))}
ENV['COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING']='true'
def port():
 with socket.socket() as s:
  s.bind(('127.0.0.1',0)); return s.getsockname()[1]
root=pathlib.Path(tempfile.mkdtemp(prefix='staycurrent-r44-owned-'))
marker=root/'owner';marker.write_text('staycurrent-r44-native-ranges')
p=port();h=port();url=f'postgresql://root@127.0.0.1:{p}/defaultdb?sslmode=disable'
proc=None
record={'binary':subprocess.check_output([BIN,'version'],env=ENV,text=True),'endpoint':url,'owner_directory':str(root),'started':time.time()}
def sql(q,check=True,database='defaultdb'):
 target=url.replace('/defaultdb?',f'/{database}?')
 r=subprocess.run([BIN,'sql','--url',target,'--format=tsv','--execute',q],env=ENV,text=True,capture_output=True,timeout=180)
 if check and r.returncode: raise RuntimeError(r.stderr)
 return r
try:
 log=open(root/'server.log','w')
 proc=subprocess.Popen([BIN,'start-single-node','--insecure','--listen-addr',f'127.0.0.1:{p}','--http-addr',f'127.0.0.1:{h}','--store',f'path={root}/store,size=1GiB','--cache=128MiB','--max-sql-memory=128MiB'],env=ENV,stdout=log,stderr=subprocess.STDOUT)
 for _ in range(100):
  if proc.poll() is not None: raise RuntimeError((root/'server.log').read_text())
  r=sql('SELECT 1',False)
  if r.returncode==0: break
  time.sleep(.2)
 else: raise RuntimeError('owned server not ready')
 # Check OS ownership of the listening process before any SQL mutation.
 listener=subprocess.check_output(['lsof','-nP',f'-iTCP:{p}','-sTCP:LISTEN','-t'],text=True).split()
 assert listener and set(listener)=={str(proc.pid)},listener
 assert marker.read_text()=='staycurrent-r44-native-ranges'
 record['identity']=sql('SELECT crdb_internal.cluster_id(), crdb_internal.node_id(), version()').stdout
 sql('CREATE DATABASE author_r44')
 script=BASE/'src/components/relational-collection/r44/downloads/ranges.sql'
 record['script_sha256']=hashlib.sha256(script.read_bytes()).hexdigest()
 outputs=[]
 for statement in script.read_text().split(';'):
  if statement.strip():
   print(statement.strip().splitlines()[-1],flush=True)
   r=sql(statement,database='author_r44');outputs.append(r.stdout)
 record['output']='\n'.join(outputs)
 record['acceptance']=sql("SELECT count(*) AS rows, sum(order_id) AS id_sum FROM range_orders; SELECT count(*) AS primary_ranges FROM [SHOW RANGES FROM INDEX range_orders@range_orders_pkey];",database='author_r44').stdout
 assert '3\t306' in record['acceptance'] and '\n2\n' in record['acceptance'],record['acceptance']
 record['success']=True
finally:
 if proc is not None:
  assert marker.read_text()=='staycurrent-r44-native-ranges'
  proc.terminate()
  try: proc.wait(timeout=15)
  except subprocess.TimeoutExpired: proc.kill();proc.wait(timeout=10)
  record['process_exit']=proc.returncode
 record['finished']=time.time()
 record['cleanup']='owned process stopped; owned temporary directory removed'
 shutil.rmtree(root)
 (BASE/'evidence/native-ranges.json').write_text(json.dumps(record,indent=2))
print(record['acceptance'])
