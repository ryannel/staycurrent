import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
core=json.loads((root/'src/lib/relational-collection/core.json').read_text())
sql='''\\set ON_ERROR_STOP on
BEGIN;
SET LOCAL TIME ZONE 'UTC';
CREATE TEMP TABLE customers(customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE orders(order_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers, placed_at timestamptz NOT NULL, status text NOT NULL);
CREATE TEMP TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL,quantity integer NOT NULL,unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TEMP TABLE payments(payment_id integer PRIMARY KEY,order_id integer NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL,method text NOT NULL);
'''
def lit(v):return str(v) if isinstance(v,int) else "'"+v.replace("'","''")+"'"
for tab,cols in [('customers',['customer_id','name']),('orders',['order_id','customer_id','placed_at','status']),('order_items',['order_id','line_no','product_id','quantity','unit_price']),('payments',['payment_id','order_id','amount','method'])]:
 sql+='INSERT INTO '+tab+' VALUES '+','.join('('+','.join(lit(r[c]) for c in cols)+')' for r in core[tab])+';\n'
queries=re.findall(r'code=\{`(.*?)`\}',(root/'src/articles/relational-collection/r05.astro').read_text(),re.S)
for i,q in enumerate(queries):
 sql+='\\echo Article query '+str(i+1)+'\n'+q+'\n'
 if i in [1,2]:sql+='CREATE TEMP VIEW '+('wrong_report' if i==1 else 'report')+' AS '+q+'\n'
sql+='''DO $$
BEGIN
 IF (SELECT array_agg(order_id ORDER BY order_id) FROM report) <> ARRAY[101,102,103] THEN RAISE EXCEPTION 'lost order'; END IF;
 IF (SELECT sum(order_total) FROM report) <> 108.50 OR (SELECT sum(paid) FROM report) <> 79.50 OR (SELECT sum(due) FROM report) <> 29.00 THEN RAISE EXCEPTION 'wrong report totals'; END IF;
 IF (SELECT order_total FROM wrong_report WHERE order_id=101) <>79 OR EXISTS(SELECT FROM wrong_report WHERE order_id=103) THEN RAISE EXCEPTION 'counterexample failed'; END IF;
 IF (SELECT array_agg(order_id ORDER BY order_id) FROM orders o WHERE NOT EXISTS(SELECT FROM payments p WHERE p.order_id=o.order_id)) <> ARRAY[103] THEN RAISE EXCEPTION 'absence failed'; END IF;
 IF (SELECT array_agg(customer_id) FROM customers c WHERE NOT EXISTS(SELECT FROM orders o WHERE o.customer_id=c.customer_id)) <> ARRAY[3] THEN RAISE EXCEPTION 'customer absence failed'; END IF;
 IF EXISTS(SELECT FROM orders o WHERE o.order_id NOT IN (SELECT order_id FROM payments UNION ALL SELECT NULL::integer)) THEN RAISE EXCEPTION 'NOT IN null counterexample failed'; END IF;
 IF (SELECT SUM(DISTINCT amount) FROM (VALUES (1,10::numeric),(2,10::numeric)) v(id,amount)) <>10 THEN RAISE EXCEPTION 'distinct counterexample failed'; END IF;
END $$;
-- Synthetic edge case only, not an addition to the collection's shop history:
INSERT INTO orders VALUES(999,3,'2026-10-24 00:00Z','pending');
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM report WHERE order_id=999 AND order_total IS NULL AND due IS NULL AND paid=0) THEN RAISE EXCEPTION 'empty order policy'; END IF;
END $$;
\\echo All join checks passed; rolling back temporary experiment.
ROLLBACK;
'''
(root/'src/components/relational-collection/r05/downloads/joins-experiment.sql').write_text(sql)
