-- PostgreSQL 18; run in a fresh disposable session.
-- Temporary tables are removed on disconnect.

SET TIME ZONE 'UTC';
CREATE TEMP TABLE ledger (
 entity text NOT NULL, event_id integer PRIMARY KEY,
 happened_at timestamptz NOT NULL, amount numeric
);
INSERT INTO ledger VALUES
 ('A',1,'2026-01-01 09:00+00',10),
 ('A',2,'2026-01-02 09:00+00',NULL),
 ('A',3,'2026-01-02 09:00+00',20),
 ('A',4,'2026-01-04 09:00+00',-5),
 ('A',5,'2026-01-04 09:00+00',0),
 ('B',6,'2026-01-03 09:00+00',7);
CREATE TEMP TABLE sales (
 shop text NOT NULL, item text NOT NULL, day date NOT NULL,
 sales numeric NOT NULL CHECK (sales >= 0),
 PRIMARY KEY (shop,item,day)
);
INSERT INTO sales VALUES
 ('North','A','2026-01-01',10),
 ('North','A','2026-01-02',20),
 ('North','A','2026-01-04',40),
 ('North','A','2026-01-05',50),
 ('North','B','2026-01-04',40),
 ('North','C','2026-01-04',20),
 ('North','D','2026-01-04',10),
 ('South','E','2026-01-04',0);

SELECT entity, event_id, amount,
 SUM(amount) OVER (PARTITION BY entity) AS known_total
FROM ledger
ORDER BY entity, event_id;

WITH numbered AS (
 SELECT entity, event_id, happened_at, amount,
  ROW_NUMBER() OVER (
   PARTITION BY entity
   ORDER BY happened_at DESC, event_id DESC
  ) AS position
 FROM ledger
)
SELECT entity, event_id, amount
FROM numbered
WHERE position = 1
ORDER BY entity;

SELECT shop, item, sales,
 ROW_NUMBER() OVER (
  PARTITION BY shop, day ORDER BY sales DESC, item
 ) AS position,
 RANK() OVER (
  PARTITION BY shop, day ORDER BY sales DESC
 ) AS competition_rank,
 DENSE_RANK() OVER (
  PARTITION BY shop, day ORDER BY sales DESC
 ) AS distinct_rank
FROM sales
WHERE day = DATE '2026-01-04'
ORDER BY shop, sales DESC, item;

-- Latest event, then require a positive amount:
WITH numbered AS (
 SELECT l.*, ROW_NUMBER() OVER (
  PARTITION BY entity ORDER BY happened_at DESC, event_id DESC
 ) AS position
 FROM ledger AS l
)
SELECT entity, event_id, amount FROM numbered
WHERE position = 1 AND amount > 0
ORDER BY entity;
-- Result: B | 6 | 7

-- Latest event among positive amounts: move amount > 0 inside.
WITH numbered AS (
 SELECT l.*, ROW_NUMBER() OVER (
  PARTITION BY entity ORDER BY happened_at DESC, event_id DESC
 ) AS position
 FROM ledger AS l WHERE amount > 0
)
SELECT entity, event_id, amount FROM numbered
WHERE position = 1
ORDER BY entity;
-- Result: A | 3 | 20; B | 6 | 7

WITH totals AS (
 SELECT s.*, SUM(sales) OVER (PARTITION BY shop, day) AS shop_total
 FROM sales AS s WHERE day = DATE '2026-01-04'
)
SELECT shop, item, sales, shop_total,
 round(100 * sales / NULLIF(shop_total, 0), 2) AS percent
FROM totals
ORDER BY shop, sales DESC, item;

SELECT entity, event_id, amount,
 SUM(amount) OVER (
  PARTITION BY entity ORDER BY happened_at, event_id
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
 ) AS event_total,
 SUM(amount) OVER (
  PARTITION BY entity ORDER BY happened_at
 ) AS timestamp_total
FROM ledger
ORDER BY entity, happened_at, event_id;

SELECT shop, item, day, sales,
 SUM(sales) OVER (
  PARTITION BY shop, item ORDER BY day
  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
 ) AS last_three_rows,
 SUM(sales) OVER (
  PARTITION BY shop, item ORDER BY day
  RANGE BETWEEN INTERVAL '2 days' PRECEDING AND CURRENT ROW
 ) AS three_day_total
FROM sales
WHERE shop = 'North' AND item = 'A'
ORDER BY day;

WITH calculated AS (
 SELECT l.*, SUM(amount) OVER (
  PARTITION BY entity ORDER BY happened_at, event_id
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
 ) AS known_total
 FROM ledger AS l
)
SELECT event_id, amount, known_total
FROM calculated
WHERE entity = 'A'
 AND happened_at >= TIMESTAMPTZ '2026-01-04 00:00+00'
 AND happened_at < TIMESTAMPTZ '2026-01-05 00:00+00'
ORDER BY happened_at, event_id;
-- 4 | -5 | 25; 5 | 0 | 25
-- Putting the date range inside calculated gives -5 and -5.

WITH compared AS (
 SELECT l.*,
  LAG(event_id) OVER event_order AS previous_id,
  LAG(amount) OVER event_order AS previous_amount,
  LAG(amount, 1, 0::numeric) OVER event_order AS absent_defaults_to_zero
 FROM ledger AS l
 WINDOW event_order AS (
  PARTITION BY entity ORDER BY happened_at, event_id
 )
)
SELECT entity, event_id, amount, previous_id, previous_amount,
 amount - previous_amount AS change, absent_defaults_to_zero
FROM compared
ORDER BY entity, happened_at, event_id;

WITH calculated AS (
 SELECT s.*,
  RANK() OVER (
   PARTITION BY shop, day ORDER BY sales DESC
  ) AS seller_rank,
  SUM(sales) OVER (PARTITION BY shop, day) AS shop_total,
  SUM(sales) OVER (
   PARTITION BY shop, item ORDER BY day
   RANGE BETWEEN INTERVAL '2 days' PRECEDING AND CURRENT ROW
  ) AS three_day_total
 FROM sales AS s
)
SELECT shop, item, day, sales, shop_total,
 round(100 * sales / NULLIF(shop_total, 0), 2) AS percent,
 three_day_total
FROM calculated
WHERE day = DATE '2026-01-04' AND seller_rank = 1
ORDER BY shop, item;
