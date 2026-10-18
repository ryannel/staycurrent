-- pages(query): run EXPLAIN (ANALYZE, BUFFERS) on a query and return one line:
-- the plan's node types, the table and index pages it touched (shared hit + read)
-- and the rows the top node returned. Measurement helper only.
CREATE OR REPLACE FUNCTION pages(q text) RETURNS text LANGUAGE plpgsql AS $$
DECLARE j jsonb; p jsonb; kinds text;
BEGIN
  EXECUTE 'EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) ' || q INTO j;
  p := j -> 0 -> 'Plan';
  WITH RECURSIVE t(node) AS (
    SELECT p UNION ALL SELECT c FROM t, jsonb_array_elements(coalesce(node -> 'Plans', '[]')) c)
  SELECT string_agg(node ->> 'Node Type' || coalesce(' ' || (node ->> 'Index Name'), ''), ' > ') INTO kinds FROM t;
  RETURN format('pages=%s rows=%s  %s',
    (p ->> 'Shared Hit Blocks')::int + (p ->> 'Shared Read Blocks')::int,
    p ->> 'Actual Rows', kinds);
END $$;
