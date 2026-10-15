// Keep the download identical to the article's displayed commands.
import { readFileSync, writeFileSync } from 'node:fs';
const page=readFileSync(new URL('../../../src/pages/learn/databases/relational/indexes.astro',import.meta.url),'utf8');
const snippets=Object.fromEntries([...page.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map(m=>[m[1],m[2]]));
const plan=sql=>'EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)\n'+sql;
const size=`SELECT pg_relation_size('index_orders') AS table_bytes,
       pg_relation_size('index_orders_cover') AS covering_index_bytes;`;
const checks=`DO $$
BEGIN
  IF (SELECT count(*) FROM index_orders) <> 60900 THEN
    RAISE EXCEPTION 'Unexpected final order count';
  END IF;
  IF (SELECT count(*) FROM index_orders WHERE total = 26.00 AND order_id BETWEEN 60001 AND 60200) <> 200 THEN
    RAISE EXCEPTION 'Amount changes did not persist';
  END IF;
END $$;`;
writeFileSync(new URL('./experiment.sql',import.meta.url),[
'-- Indexes: complete isolated experiment. PostgreSQL 18.\n-- Run in a fresh session. All writes affect a temporary table.\n-- Use psql -f against your practice database, or run statements individually\n-- in a query editor with autocommit enabled. VACUUM cannot run in a transaction.\n-- EXPLAIN ANALYZE executes its statement. No production benchmark is claimed.',
readFileSync(new URL('./setup.sql',import.meta.url),'utf8'),
'-- Baseline: only the primary-key index exists.',plan(snippets.history),snippets.history,
snippets.customerIndex,plan(snippets.history),
snippets.compositeIndex,plan(snippets.history),
'-- The paid-only query adds a remaining filter.',plan(snippets.residual),
snippets.coveringIndex,plan(snippets.history),
'VACUUM (ANALYZE) index_orders;',plan(snippets.history),plan(snippets.broad),size,
'-- Exercise the maintained index as data changes.',snippets.writes,checks,size,plan(snippets.history),
'-- End the session to remove the temporary table.\n',
].join('\n\n'));
