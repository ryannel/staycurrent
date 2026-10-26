#!/usr/bin/env python3
"""One bounded rehearsal on the root-owned, network-none upgrade fixture only.
Root inspects and runs. Leaves the container/stores intact for root cleanup.
"""
import csv, io, json, os, subprocess, sys, time
from pathlib import Path
HERE=Path(__file__).resolve().parent
META=json.loads((HERE.parent/'input/native-runtime.json').read_text())
CID='75b0956fac4354bcf448f42631ee193ea04f9aa02bd131f79222ddf6c9b77e35'
UUID='2d4ec1b4-0470-4b94-93dc-fe34a8efcab0'
DB='sc_crdb_upgrades'; USER='sc_crdb_upgrades_writer'
DOCKER=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock']
OLD='/cockroach/cockroach'; NEW=META['new_binary']
ENV={k:v for k,v in os.environ.items() if not k.startswith(('PG','COCKROACH','DOCKER'))}
LOG=[]
def run(args,timeout=25,required=True):
    p=subprocess.run(args,text=True,capture_output=True,timeout=timeout,env=ENV)
    LOG.append({'args':args,'rc':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
    (HERE/'native-run.json').write_text(json.dumps(LOG,indent=2))
    if required and p.returncode: raise RuntimeError(p.stderr)
    return p

def sql(query,port=26257,required=True,timeout=25):
    return run(DOCKER+['exec',CID,OLD,'sql','--insecure',f'--host=127.0.0.1:{port}',f'--database={DB}',f'--user={USER}','--format=csv','--execute',query],timeout,required)
def rows(query,port=26257):
    lines=sql(query,port).stdout.splitlines()
    while lines and lines[0] in ('SET','RESET','BEGIN','COMMIT'):
        lines.pop(0)
    return list(csv.DictReader(io.StringIO('\n'.join(lines))))
def val(query,port=26257): return next(iter(rows(query,port)[0].values()))
def guard(port=26257):
    r=rows("SET allow_unsafe_internals=true; SELECT crdb_internal.cluster_id()::STRING AS cluster_id, current_database() AS db, current_user AS usr, (SELECT marker FROM public.fixture_guard) AS marker",port)[0]
    assert r==dict(cluster_id=UUID,db=DB,usr=USER,marker=META['marker']),r

def version_hold():
    assert val('SHOW CLUSTER SETTING version')=='26.1'
    assert val('SHOW CLUSTER SETTING cluster.preserve_downgrade_option')=='26.1'
    assert val('SHOW CLUSTER SETTING cluster.auto_upgrade.enabled') in ('f','false')

def acceptance(price):
    for n in META['nodes']:
        guard(n['port'])
        r=rows("SELECT (SELECT price FROM upgrade_shop.products WHERE product_id='P7')::STRING AS price, (SELECT string_agg(stock::STRING, ',' ORDER BY product_id) FROM upgrade_shop.products) AS stock, (SELECT status FROM upgrade_shop.orders WHERE order_id=103) AS status, (SELECT sum(quantity*unit_price)::STRING FROM upgrade_shop.order_items WHERE order_id=103) AS total, (SELECT count(*)::STRING FROM upgrade_shop.payments WHERE order_id=103) AS payments",n['port'])[0]
        assert r==dict(price=price,stock='10,0,4',status='pending',total='29.00',payments='0'),r
        q=rows("WITH changed AS (UPDATE upgrade_shop.products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING product_id) SELECT count(*)::STRING AS affected FROM changed",n['port'])
        assert q==[{'affected':'0'}],q

def checkpoint(label,expected):
    version_hold(); acceptance('22.00' if label!='baseline' else '20.00')
    got=[val('SELECT version()',n['port']) for n in META['nodes']]
    assert all(f'v{e} ' in g for e,g in zip(expected,got)),got
    for attempt in range(30):
        status=run(DOCKER+['exec',CID,OLD,'node','status','--insecure','--host=127.0.0.1:26257','--ranges','--format=csv'])
        parsed=list(csv.DictReader(io.StringIO(status.stdout)))
        required_fields={'is_live','is_available','build','ranges_unavailable','ranges_underreplicated'}
        if not parsed or not required_fields.issubset(parsed[0]):
            raise RuntimeError('Missing required health/build fields: '+repr(parsed))
        healthy=(len(parsed)==3 and all(r['is_live'] in ('t','true') and r['is_available'] in ('t','true') and int(r['ranges_unavailable'])==0 and int(r['ranges_underreplicated'])==0 for r in parsed))
        current_builds=sorted(r['build'].lstrip('v') for r in parsed)==sorted(expected)
        if healthy and current_builds: break
        time.sleep(1)
    else: raise RuntimeError('Health/build checkpoint did not qualify in bounded observations: '+repr(parsed))
    LOG.append({'checkpoint':label,'binaries':got,'cluster_version':'26.1','shop_acceptance':'passed'}); (HERE/'native-run.json').write_text(json.dumps(LOG,indent=2))

def restart(index,binary):
    node=META['nodes'][index]; guard(node['port']); version_hold()
    # Exact PID file is validated before signalling; no broad process matching.
    pid=run(DOCKER+['exec',CID,'cat',node['pid_file']]).stdout.strip(); assert pid.isdigit() and int(pid)>1
    cmdline=run(DOCKER+['exec',CID,'cat',f'/proc/{pid}/cmdline']).stdout
    assert node['store'] in cmdline and 'start' in cmdline,cmdline
    run(DOCKER+['exec',CID,'kill','-TERM',pid])
    for attempt in range(40):
        alive=run(DOCKER+['exec',CID,'kill','-0',pid],required=False)
        if alive.returncode: break
        stat=run(DOCKER+['exec',CID,'cat',f'/proc/{pid}/stat'],required=False)
        if stat.returncode==0 and stat.stdout.rsplit(')',1)[1].split()[0]=='Z': break
        time.sleep(.5)
    else: raise RuntimeError('Node did not stop within bounded attempts; stop rehearsal')
    command=[binary]+node['start_command'][1:]
    run(DOCKER+['exec','--env','GOMEMLIMIT=384MiB',CID]+command,timeout=40)
    for attempt in range(40):
        ready=sql('SELECT 1',node['port'],required=False,timeout=8)
        if ready.returncode==0: break
        time.sleep(.5)
    else: raise RuntimeError('Node did not become SQL-ready; stop rehearsal')
    guard(node['port'])

try:
    inspect=json.loads(run(DOCKER+['inspect',CID]).stdout)[0]
    assert inspect['Id']==CID and inspect['Name']=='/'+META['name']
    assert inspect['HostConfig']['NetworkMode']=='none' and not inspect['Mounts'] and not inspect['HostConfig'].get('PortBindings')
    assert run(DOCKER+['exec',CID,'sha256sum',NEW]).stdout.split()[0]==META['new_binary_sha256']
    for n in META['nodes']: guard(n['port'])
    sql('SET CLUSTER SETTING cluster.auto_upgrade.enabled = false')
    sql('CREATE SCHEMA upgrade_shop')
    sql("""CREATE TABLE upgrade_shop.products(product_id STRING PRIMARY KEY, price DECIMAL(8,2) NOT NULL CHECK(price>=0),stock INT NOT NULL CHECK(stock>=0));
CREATE TABLE upgrade_shop.orders(order_id INT PRIMARY KEY,status STRING NOT NULL);
CREATE TABLE upgrade_shop.order_items(order_id INT REFERENCES upgrade_shop.orders, line_no INT,product_id STRING REFERENCES upgrade_shop.products,quantity INT NOT NULL, unit_price DECIMAL(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TABLE upgrade_shop.payments(payment_id INT PRIMARY KEY,order_id INT REFERENCES upgrade_shop.orders,amount DECIMAL(8,2) NOT NULL);
INSERT INTO upgrade_shop.products VALUES('P3',4.50,10),('P7',20.00,0),('P9',35.00,4);
INSERT INTO upgrade_shop.orders VALUES(103,'pending');
INSERT INTO upgrade_shop.order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);""")
    checkpoint('baseline',['26.1.8']*3)
    sql("UPDATE upgrade_shop.products SET price=22.00 WHERE product_id='P7'")
    for i in range(3):
        restart(i,NEW); checkpoint('outbound-'+str(i+1),['26.2.8']*(i+1)+['26.1.8']*(2-i))
    for i in range(3):
        restart(i,OLD); checkpoint('return-'+str(i+1),['26.1.8']*(i+1)+['26.2.8']*(2-i))
    for i in range(3):
        restart(i,NEW); checkpoint('second-outbound-'+str(i+1),['26.2.8']*(i+1)+['26.1.8']*(2-i))
    # No later binary return is attempted, whether finalisation completes or fails.
    sql('RESET CLUSTER SETTING cluster.preserve_downgrade_option')
    final=sql("SET CLUSTER SETTING version='26.2'",required=False,timeout=45)
    for attempt in range(12):
        cv=val('SHOW CLUSTER SETTING version')
        sql("SELECT job_id,job_type,description,status,error FROM [SHOW JOBS] WHERE job_type='MIGRATION' ORDER BY created DESC LIMIT 30")
        acceptance('22.00')
        if cv=='26.2' or final.returncode: break
        time.sleep(1)
    LOG.append({'finalisation_request_rc':final.returncode,'observed_cluster_version':cv,'return_attempted_after_request':False,'limits':'Three processes share one host; no distributed failure-domain, workload latency, driver, TLS, licence or post-finalisation feature acceptance claim.'})
    (HERE/'native-run.json').write_text(json.dumps(LOG,indent=2))
    print(json.dumps(LOG[-1],indent=2))
except Exception as exc:
    LOG.append({'stopped':repr(exc),'no_automatic_repair_or_cleanup':True}); (HERE/'native-run.json').write_text(json.dumps(LOG,indent=2))
    raise
