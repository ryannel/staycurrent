from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
base=Path('/private/tmp/staycurrent-relational-20261024-r05/src/components/relational-collection/r05/downloads/joins-experiment.sql').read_text().split('\\echo Article query 1')[0]
queries=re.findall(r'code=\{`(.*?)`\}',(root/'src/articles/relational-collection/r06.astro').read_text(),re.S)
sql=base
for i,q in enumerate(queries):
 if i==6:sql+="-- Later tie illustration; no line or amount assumptions.\nINSERT INTO orders VALUES(105,1,'2026-10-21 12:00Z','pending'),(106,3,'2026-10-21 12:00Z','pending');\n"
 sql+='\\echo Article query '+str(i+1)+'\n'+q+'\nCREATE TEMP TABLE result_'+str(i)+' AS '+q+'\n'
sql+='''DO $$ BEGIN
 IF (SELECT sum(order_total) FROM result_0)<>108.50 OR (SELECT sum(lines) FROM result_0)<>5 THEN RAISE EXCEPTION 'group total'; END IF;
 IF (SELECT orders FROM result_2 WHERE customer_id=3)<>0 OR (SELECT joined_rows FROM result_2 WHERE customer_id=3)<>1 THEN RAISE EXCEPTION 'left join count'; END IF;
 IF (SELECT customer_total FROM result_3 WHERE customer_id=1)<>68.50 THEN RAISE EXCEPTION 'having'; END IF;
 IF EXISTS(SELECT FROM result_4 WHERE customer_id=1 AND customer_total<>68.50) THEN RAISE EXCEPTION 'window'; END IF;
 IF (SELECT previous_order_at FROM result_5 WHERE order_id=103)<>'2026-10-12 09:30Z'::timestamptz THEN RAISE EXCEPTION 'lag'; END IF;
 IF (SELECT array_agg(through_peers ORDER BY placed_at,order_id) FROM result_6)<>ARRAY[1,2,3,5,5]::bigint[] THEN RAISE EXCEPTION 'peers'; END IF;
 IF (SELECT array_agg(through_row ORDER BY placed_at,order_id) FROM result_6)<>ARRAY[1,2,3,4,5]::bigint[] THEN RAISE EXCEPTION 'rows'; END IF;
 IF (SELECT array_agg(order_id ORDER BY customer_id) FROM result_7)<>ARRAY[105,102,106] THEN RAISE EXCEPTION 'latest'; END IF;
END $$;
-- The first six displayed queries were printed before adding 105/106.
-- Each result table captures that exact article query at its stated input stage.
SELECT round(avg(order_total),2) AS mean_order FROM result_0;
SELECT avg(quantity*unit_price) AS mean_line FROM order_items;
SELECT count(*) FILTER(WHERE status='pending') AS pending_core FROM orders WHERE order_id<=103;
SELECT order_id, count(*) OVER () AS whole_partition,
 last_value(order_id) OVER(ORDER BY placed_at,order_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS final_id
FROM orders ORDER BY placed_at,order_id;
CREATE TEMP VIEW score_ranks AS
 SELECT score, rank() OVER(ORDER BY score DESC) AS r, dense_rank() OVER(ORDER BY score DESC) AS d
 FROM (VALUES(40),(30),(30),(20)) scores(score);
TABLE score_ranks;
DO $$ BEGIN
 IF (SELECT r FROM score_ranks WHERE score=20)<>4 OR (SELECT d FROM score_ranks WHERE score=20)<>3 THEN RAISE EXCEPTION 'ranks'; END IF;
 IF (SELECT round(avg(order_total),2) FROM result_0)<>36.17 THEN RAISE EXCEPTION 'order average'; END IF;
 IF (SELECT avg(quantity*unit_price) FROM order_items)<>21.70 THEN RAISE EXCEPTION 'line average'; END IF;
END $$;
-- Filtering before/after the window separates two legitimate questions:
WITH values_per_order AS(SELECT * FROM result_4),
 filtered_first AS(SELECT order_total, sum(order_total) OVER() AS total FROM values_per_order WHERE order_id=103)
 SELECT * FROM filtered_first;
-- A bounded ROWS frame counts orders; a timestamp RANGE counts an interval:
SELECT order_id,
 count(*) OVER(ORDER BY placed_at,order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS three_orders,
 count(*) OVER(ORDER BY placed_at RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW) AS seven_days
FROM orders ORDER BY placed_at,order_id;
\\echo All aggregate/window checks passed; rolling back temporary experiment.
ROLLBACK;
'''
(root/'src/components/relational-collection/r06/downloads/windows-experiment.sql').write_text(sql)
p=Path('/private/tmp/staycurrent-relational-20261024-r05/evidence/run-owned.py')
(root/'evidence/run-owned.py').write_text(p.read_text().replace('r05','r06').replace('55465','55466'))
