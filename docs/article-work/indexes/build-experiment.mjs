// Writes experiment.sql from the commands the Indexes article displays,
// so the download always matches the page. Run from the repository root:
//   node docs/article-work/indexes/build-experiment.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const here = (file) => new URL(file, import.meta.url);
const page = readFileSync(here('../../../src/pages/learn/databases/relational/indexes.astro'), 'utf8');
const s = Object.fromEntries([...page.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map((m) => [m[1], m[2]]));
const plan = (sql) => 'EXPLAIN (ANALYZE, BUFFERS)\n' + sql;

writeFileSync(here('./experiment.sql'), [
  `-- Indexes: the complete experiment from the article. PostgreSQL 18.
-- Run in a fresh session. Every write affects a temporary table that
-- disappears when the session ends. Use psql -f, or run the statements one
-- at a time in a query editor with autocommit on: VACUUM cannot run inside
-- a transaction block. EXPLAIN ANALYZE executes its statement.`,
  readFileSync(here('./setup.sql'), 'utf8').trim(),
  '-- Sequential scan: no index on customer_id yet.',
  plan(s.lookup),
  plan(s.history),
  '-- Index entries: an index on customer_id.',
  s.customerIndex,
  plan(s.lookup),
  plan(s.history),
  '-- Range scans.',
  plan(s.range),
  '-- Selectivity: try other bounds, such as 550.',
  plan(s.wideRange),
  '-- Composite indexes.',
  s.compositeIndex,
  plan(s.history),
  plan(s.newest),
  '-- Covering indexes and index-only scans.',
  s.coveringIndex,
  plan(s.history),
  'VACUUM (ANALYZE) index_orders;',
  plan(s.history),
  `SELECT pg_relation_size('index_orders') AS table_bytes,
       pg_relation_size('index_orders_cover') AS covering_index_bytes;`,
  '-- Index maintenance: scans per index so far in this session.',
  s.usage,
  '-- Checking an index: a condition the index cannot use.',
  plan(s.residual),
  '-- End the session to remove the temporary table.',
].join('\n\n') + '\n');
