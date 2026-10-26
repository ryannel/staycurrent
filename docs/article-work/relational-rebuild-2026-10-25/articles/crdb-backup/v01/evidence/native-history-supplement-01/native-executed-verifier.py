#!/usr/bin/env python3
"""Root-run only: bounded, nodelocal-only native backup/recovery drill."""
import csv, io, json, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent
CID = 'fcf636d47d80ed30f166c028701bf65003a13f40ba0242aa57b4ee9f554f52e7'
UUID = '8c349890-5715-4138-bbd3-55d168d40441'
DB = 'sc_crdb_backup'
USER = 'sc_crdb_backup_writer'
URI = 'nodelocal://1/sc-rebuild-backup-20261025/history-supplement-01'
log=[]
def run(label, sql, expected_error=False):
    cmd=['docker','--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock','exec','-i',CID,'/cockroach/cockroach','sql','--insecure','--host=127.0.0.1:26257','--database='+DB,'--user='+USER,'--format=csv','--set=errexit=true']
    p=subprocess.run(cmd,input=sql,text=True,capture_output=True,timeout=90)
    log.append(dict(label=label,sql=sql,exit=p.returncode,stdout=p.stdout,stderr=p.stderr))
    (ROOT/'native-results.json').write_text(json.dumps(log,indent=2))
    if expected_error:
        assert p.returncode != 0, (label,p.stdout)
    else:
        assert p.returncode == 0, (label,p.stderr)
    return p.stdout

def scalar(label,sql):
    return list(csv.reader(io.StringIO(run(label,sql))))[1][0]

# Read-only guards before any database mutation. The root also checks container
# image/network identity before invoking this script.
g=run('guard',"SET allow_unsafe_internals=true; SELECT crdb_internal.cluster_id()::STRING AS cluster_id, current_database() AS db, current_user AS usr, version() AS version;")
row=list(csv.DictReader(io.StringIO(g[g.index('cluster_id,'):])))[0]
assert row['cluster_id']==UUID and row['db']==DB and row['usr']==USER and 'v26.2.8' in row['version'],row
empty=run('empty fixture',"SELECT table_name FROM information_schema.tables WHERE table_catalog='sc_crdb_backup' AND table_schema='public';")
assert list(csv.DictReader(io.StringIO(empty))) == [], empty
run('setup',"""
CREATE TABLE products(product_id STRING PRIMARY KEY, price DECIMAL(8,2) NOT NULL CHECK(price>=0), stock INT NOT NULL CHECK(stock>=0));
CREATE TABLE orders(order_id INT PRIMARY KEY, status STRING NOT NULL CHECK(status IN ('pending','paid','cancelled')));
CREATE TABLE order_items(order_id INT REFERENCES orders(order_id), line_no INT, product_id STRING REFERENCES products(product_id), quantity INT NOT NULL CHECK(quantity>0), unit_price DECIMAL(8,2) NOT NULL, PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id INT PRIMARY KEY, order_id INT NOT NULL REFERENCES orders(order_id), amount DECIMAL(8,2) NOT NULL CHECK(amount>0), method STRING NOT NULL);
CREATE TABLE payment_operations(operation_id STRING PRIMARY KEY, order_id INT NOT NULL, amount DECIMAL(8,2) NOT NULL, method STRING NOT NULL, payment_id INT NOT NULL UNIQUE REFERENCES payments(payment_id));
INSERT INTO products VALUES ('P3',4.50,10),('P7',20.00,0),('P9',35.00,4);
INSERT INTO orders VALUES (103,'pending');
INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
""")
run('full explicit history',f"BACKUP DATABASE {DB} INTO '{URI}' WITH revision_history=true;")
cut=scalar('before mistake',"SELECT cluster_logical_timestamp()::STRING AS cut;")
run('mistake',"UPDATE products SET price=2.20 WHERE product_id='P7';")
run('accepted payment source',"""BEGIN;
INSERT INTO payments VALUES (504,103,10.00,'card');
INSERT INTO payment_operations VALUES ('order-103-part-payment-1',103,10.00,'card',504);
COMMIT;""")
run('increment explicit history',f"BACKUP DATABASE {DB} INTO LATEST IN '{URI}' WITH revision_history=true;")
run('schema plus checksums',f"RESTORE DATABASE {DB} FROM LATEST IN '{URI}' AS OF SYSTEM TIME '{cut}' WITH new_db_name='sc_crdb_backup_schema', schema_only, verify_backup_table_data;")
run('restore candidate',f"RESTORE DATABASE {DB} FROM LATEST IN '{URI}' AS OF SYSTEM TIME '{cut}' WITH new_db_name='sc_crdb_backup_candidate';")
run('restore latest counterexample',f"RESTORE DATABASE {DB} FROM LATEST IN '{URI}' WITH new_db_name='sc_crdb_backup_latest';")
run('cut facts',"""SELECT product_id,price,stock FROM sc_crdb_backup_candidate.products ORDER BY product_id;
SELECT order_id,sum(quantity*unit_price) AS agreed_total FROM sc_crdb_backup_candidate.order_items GROUP BY order_id;
SELECT * FROM sc_crdb_backup_candidate.orders;
SELECT * FROM sc_crdb_backup_candidate.payments;
SELECT * FROM sc_crdb_backup_candidate.payment_operations;
SHOW CONSTRAINTS FROM sc_crdb_backup_candidate.order_items;
SELECT product_id,price FROM sc_crdb_backup_latest.products WHERE product_id='P7';
SELECT * FROM sc_crdb_backup_latest.payments;""")
repair="""BEGIN;
SELECT order_id,status FROM sc_crdb_backup_candidate.orders WHERE order_id=103 FOR UPDATE;
INSERT INTO sc_crdb_backup_candidate.payments VALUES (504,103,10.00,'card');
INSERT INTO sc_crdb_backup_candidate.payment_operations VALUES ('order-103-part-payment-1',103,10.00,'card',504);
COMMIT;"""
run('reconcile known accepted result',repair)
# No charge command exists in this verifier. The provider acceptance is an input.
# An exact retry reads and compares the whole immutable mapping before returning.
r=run('repeat lookup',"SELECT order_id,amount,method,payment_id FROM sc_crdb_backup_candidate.payment_operations WHERE operation_id='order-103-part-payment-1';")
v=list(csv.DictReader(io.StringIO(r)))[0]
assert v==dict(order_id='103',amount='10.00',method='card',payment_id='504'),v
assert v != dict(order_id='103',amount='11.00',method='card',payment_id='504')
run('duplicate without lookup counterexample',repair,True)
run('final facts',"""SELECT product_id,price,stock FROM sc_crdb_backup_candidate.products ORDER BY product_id;
SELECT o.order_id,o.status,(SELECT sum(quantity*unit_price) FROM sc_crdb_backup_candidate.order_items WHERE order_id=o.order_id) AS agreed_total,(SELECT sum(amount) FROM sc_crdb_backup_candidate.payments WHERE order_id=o.order_id) AS paid FROM sc_crdb_backup_candidate.orders o;
SELECT count(*) AS payment_rows FROM sc_crdb_backup_candidate.payments;
SELECT * FROM sc_crdb_backup_candidate.payment_operations;""")
(ROOT/'native-summary.json').write_text(json.dumps({'cut':cut,'cluster':UUID,'version':'26.2.8','scope':'single-node nodelocal SQL drill; provider acceptance is illustrative input; no distributed survival/timing or production runtime access established'},indent=2))
print('Native drill completed. Preserve evidence, then root removes the disposable container including all databases and nodelocal files.')
