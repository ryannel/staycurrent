"""Bounded PostgreSQL 18 exercise. Creates and drops only rel3_a17_run1.
Requires the commissioned disposable server at 127.0.0.1:57319.
"""
import json, pathlib, re, subprocess
root=pathlib.Path(__file__).resolve().parents[5]
node=pathlib.Path(__file__).parent
bin='/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/'
args=['-h','127.0.0.1','-p','57319','-U','staycurrent']
db='rel3_a17_run1'
source=(root/'src/components/relational-next/a17/queries.mjs').read_text()
queries=dict(re.findall(r'export const (\w+) = `([\s\S]*?)`;',source))
setup=queries['setup']
cases=[]
def check(name,sql,expected,error=None,setup_sql=setup,stop=True):
 p=subprocess.run([bin+'psql',*args,'-d',db,'-X','-A','-t','-q','-v','VERBOSITY=verbose','-v','ON_ERROR_STOP='+('1' if stop else '0')],input=setup_sql+'\n'+sql,text=True,capture_output=True,timeout=35)
 lines=p.stdout.strip().splitlines()
 ok=(lines==expected and ((error in p.stderr) if error else (p.returncode==0 and not p.stderr)))
 cases.append(dict(name=name,sql=sql,expected=expected,stdout=p.stdout,stderr=p.stderr,exit_code=p.returncode,passed=ok))
 if not ok: raise AssertionError((name,lines,p.stderr))
subprocess.run([bin+'createdb',*args,db],check=True,timeout=15)
try:
 check('version','SHOW server_version;', ['18.6 (Homebrew)'],setup_sql='')
 check('target',queries['target']+'SELECT status FROM change_orders WHERE tenant_id=1 AND order_id=101;', ['1|101|open','1|101|cancelled','open'])
 check('scope',"SELECT count(*) FROM change_orders WHERE order_id=101; SELECT count(*) FROM change_orders WHERE tenant_id=1 AND status='open'; SELECT count(*) FROM change_orders; SELECT count(*) FROM change_orders WHERE note=NULL; SELECT count(*) FROM change_orders WHERE tenant_id=1 AND note IS NULL;",['2','2','4','0','2'])
 check('inserts',queries['inserts'],['1|107|open|','1|108|open|','2|1|bank-2|12.00','3|1|bank-3|8.00'])
 check('default',"INSERT INTO change_orders(tenant_id,order_id,status) VALUES (1,107,DEFAULT) RETURNING status;",['open'])
 check('explicit-null',"INSERT INTO change_orders(tenant_id,order_id,status) VALUES (1,107,NULL);",[],error='23502')
 check('insert-empty',"WITH added AS (INSERT INTO stock SELECT tenant_id,sku,units FROM deliveries WHERE false RETURNING *) SELECT count(*) FROM added;",['0'])
 check('source-update',queries['sourceUpdate'],['1|P7|2','1|P7|10'])
 check('ambiguous-source-observation',queries['ambiguous'],['1|P7|7'])
 check('guard',queries['decrement'],['1|P7|2'])
 check('missing-stock',"WITH changed AS (UPDATE stock SET available=available-3 WHERE tenant_id=1 AND sku='missing' AND available>=3 RETURNING *) SELECT count(*) FROM changed;",['0'])
 check('delete-cascade',queries['deletion'],['1|105','0'])
 check('delete-protected',"DELETE FROM change_orders WHERE tenant_id=1 AND order_id=101;",[],error='23503')
 check('delete-none',"WITH gone AS (DELETE FROM change_orders WHERE order_id=999 RETURNING *) SELECT count(*) FROM gone;",['0'])
 check('delete-multiple',"BEGIN; DELETE FROM change_lines WHERE tenant_id=1; WITH gone AS (DELETE FROM change_orders WHERE tenant_id=1 AND order_id IN(102,105) RETURNING *) SELECT count(*) FROM gone; ROLLBACK;",['2'])
 check('conflict-reject',"INSERT INTO stock VALUES(1,'P7',5);",[],error='23505')
 check('conflict-nothing',"WITH changed AS (INSERT INTO stock VALUES(1,'P7',5) ON CONFLICT(tenant_id,sku) DO NOTHING RETURNING *) SELECT count(*) FROM changed; SELECT available FROM stock WHERE tenant_id=1 AND sku='P7';",['0','5'])
 check('conflict-values',queries['conflict'],['1|P7|10','1|P7|5'])
 check('conditional-conflict-zero',"WITH changed AS (INSERT INTO stock VALUES(1,'P7',5) ON CONFLICT(tenant_id,sku) DO UPDATE SET available=EXCLUDED.available WHERE stock.available IS DISTINCT FROM EXCLUDED.available RETURNING *) SELECT count(*) FROM changed;",['0'])
 check('same-value-update',"WITH changed AS (UPDATE stock SET available=available WHERE tenant_id=1 AND sku='P7' RETURNING *) SELECT count(*) FROM changed;",['1'])
 check('duplicate-upsert-source',"INSERT INTO stock VALUES(1,'P7',2),(1,'P7',3) ON CONFLICT(tenant_id,sku) DO UPDATE SET available=stock.available+EXCLUDED.available;",[],error='21000')
 check('merge-actions',queries['merge'],['UPDATE|1|P7|8','DELETE|1|P8|2','INSERT|1|P9|4'])
 check('merge-duplicate',"MERGE INTO stock AS s USING (VALUES(1,'P7',2),(1,'P7',3)) AS d(tenant_id,sku,units) ON s.tenant_id=d.tenant_id AND s.sku=d.sku WHEN MATCHED THEN UPDATE SET available=s.available+d.units;",[],error='21000')
 check('rollback-after-error',queries['failure'],['5'],error='23514',stop=False)
 assert '25P02' in cases[-1]['stderr']
 check('rollback-sequence-gap',"BEGIN; INSERT INTO receipts(tenant_id,order_id,external_ref,amount) VALUES(1,101,'rolled-back',1) RETURNING receipt_id; ROLLBACK; INSERT INTO receipts(tenant_id,order_id,external_ref,amount) VALUES(1,101,'kept',1) RETURNING receipt_id;",['2','3'])
 check('receipt-constraint',"INSERT INTO receipts(tenant_id,order_id,external_ref,amount) VALUES(1,101,'bad',-1);",[],error='23514')
 check('exercise',"BEGIN;"+queries['fromQuery'].replace('BEGIN;','').replace('ROLLBACK;','')+"SELECT tenant_id,sku,available FROM stock ORDER BY tenant_id,sku; ROLLBACK; SELECT tenant_id,sku,available FROM stock ORDER BY tenant_id,sku;",['1|P9|4','1|P7|10','1|P7|10','1|P8|2','1|P9|4','2|P7|9','1|P7|5','1|P8|2','2|P7|9'])
finally:
 (node/'native-results.json').write_text(json.dumps({'database':db,'setup':setup,'cases':cases},indent=2)+'\n')
 subprocess.run([bin+'dropdb',*args,db],check=True,timeout=15)
print(f'{len(cases)} native cases passed; isolated database removed')
