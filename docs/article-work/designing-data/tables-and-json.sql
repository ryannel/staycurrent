-- Tables and JSON: PostgreSQL 18 practice.
-- Start with designing-data.sql in a fresh database dedicated to this article.
-- Run as a SQL script, or execute statements individually in reading order.
-- This follows the JSON-to-typed-capacity path, not the relatedRows alternative.
-- Query results before the final material change include P7, Blue mug, 350.

-- addJson
ALTER TABLE products
ADD COLUMN attributes jsonb NOT NULL DEFAULT '{}'
  CHECK (jsonb_typeof(attributes) = 'object');

UPDATE products
SET attributes = '{"capacity_ml":350,"material":"ceramic"}'
WHERE product_id = 'P7';

UPDATE products
SET attributes = '{"diameter_cm":18,"material":"ceramic"}'
WHERE product_id = 'P8';

-- valuesQuery
WITH samples (label, attributes) AS (
  VALUES
    ('missing key', '{}'::jsonb),
    ('JSON null', '{"capacity_ml":null}'::jsonb),
    ('number', '{"capacity_ml":350}'::jsonb),
    ('string', '{"capacity_ml":"350"}'::jsonb),
    ('SQL NULL', NULL::jsonb)
)
SELECT label,
       attributes ? 'capacity_ml' AS has_key,
       jsonb_typeof(attributes -> 'capacity_ml') AS json_type,
       attributes ->> 'capacity_ml' AS text_value
FROM samples;

-- jsonQuery
SELECT product_id, name,
       (attributes ->> 'capacity_ml')::integer AS capacity_ml
FROM products
WHERE attributes @> '{"material":"ceramic"}'::jsonb
  AND (attributes ->> 'capacity_ml')::integer >= 300;

-- typeCheck
ALTER TABLE products
ADD CONSTRAINT capacity_is_number
CHECK (
  NOT (attributes ? 'capacity_ml')
  OR jsonb_typeof(attributes -> 'capacity_ml') = 'number'
);

-- moveCapacity
BEGIN;
CREATE TABLE mug_details (
  product_id text PRIMARY KEY
    REFERENCES products (product_id) ON DELETE CASCADE,
  capacity_ml integer NOT NULL CHECK (capacity_ml > 0)
);

INSERT INTO mug_details (product_id, capacity_ml)
SELECT product_id,
       CASE WHEN jsonb_typeof(attributes -> 'capacity_ml') = 'number'
         THEN CASE
           WHEN (attributes ->> 'capacity_ml')::numeric
                  BETWEEN 1 AND 2147483647
            AND (attributes ->> 'capacity_ml')::numeric
                  = trunc((attributes ->> 'capacity_ml')::numeric)
           THEN (attributes ->> 'capacity_ml')::numeric::integer
           ELSE NULL
         END
         ELSE NULL
       END
FROM products
WHERE product_id = 'P7';

UPDATE products
SET attributes = attributes - 'capacity_ml'
WHERE product_id = 'P7';
COMMIT;

-- hybridQuery
SELECT p.product_id, p.name, m.capacity_ml
FROM products AS p
JOIN mug_details AS m ON m.product_id = p.product_id
WHERE p.attributes @> '{"material":"ceramic"}'::jsonb
  AND m.capacity_ml >= 300;

-- indexes
-- One option for containment queries over descriptions.
CREATE INDEX products_attributes_gin
ON products USING gin (attributes);

-- One option for ranges over the typed capacity column.
CREATE INDEX mug_details_capacity_idx
ON mug_details (capacity_ml);

-- updateJson
UPDATE products
SET attributes = jsonb_set(
  attributes, '{material}', '"stoneware"'::jsonb
)
WHERE product_id = 'P7';

-- After the final update, P7 is stoneware, with typed capacity still 350.
SELECT p.product_id, p.attributes, m.capacity_ml
FROM products AS p
JOIN mug_details AS m ON m.product_id = p.product_id;
