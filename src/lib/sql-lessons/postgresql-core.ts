import type { Tutorial } from '../sql-sandbox-tutorials';

export const postgresqlCoreTutorials: Tutorial[] = [
 {
  id:'pg-plan-parameters', title:'Give the planner unequal tenants',
  description:'Compare custom and generic prepared plans, then remove the skew that made the parameter matter.',
  articleHref:'/learn/databases/relational/postgresql/query-execution/',
  steps:[
   {title:'Create one large tenant and one hundred small ones',instruction:'Run this independent setup first. It resets this connection’s prepared statements and planning mode, then creates 50,000 jobs: tenant 0 owns 45,000; tenants 1–100 own 50 each. The payload requires heap values beyond the tenant index. Setup commits when this run ends. Rerun it to reset the experiment.',
    sql:`DEALLOCATE ALL;
SET plan_cache_mode=auto;
DROP TABLE IF EXISTS core_parameter_jobs;
CREATE TABLE core_parameter_jobs(job_id integer PRIMARY KEY,tenant_id integer NOT NULL,payload text NOT NULL);
INSERT INTO core_parameter_jobs
SELECT n,CASE WHEN n<=45000 THEN 0 ELSE 1+(n%100) END,repeat(md5(n::text),5)
FROM generate_series(1,50000) AS n;
CREATE INDEX core_parameter_tenant ON core_parameter_jobs(tenant_id);
ANALYZE core_parameter_jobs;
PREPARE core_tenant(integer) AS SELECT job_id,payload FROM core_parameter_jobs WHERE tenant_id=$1;
SELECT tenant_id,count(*) FROM core_parameter_jobs WHERE tenant_id IN (0,1) GROUP BY tenant_id ORDER BY tenant_id;`,
    expected:'Tenant 0 has 45,000 jobs; tenant 1 has 50. The prepared statement belongs to this sandbox connection. No explicit transaction remains open.'},
   {title:'Plan for a known small tenant',instruction:'Force a custom plan temporarily, so this execution can use tenant 1’s value. Predict whether fetching 50 of 50,000 records is likely to use the tenant index. EXPLAIN ANALYZE executes the read but displays its plan instead of thousands of payloads.',
    sql:`SET plan_cache_mode=force_custom_plan;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) EXECUTE core_tenant(1);`,
    expected:'The verified plan uses the tenant index and returns 50 actual rows. Its condition names tenant 1. The forced mode remains set for the next step.'},
   {title:'Keep the statement and change the parameter',instruction:'The same prepared statement now asks for tenant 0. Predict the result count and whether the custom planner should still choose the small-tenant route.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) EXECUTE core_tenant(0);`,
    expected:'45,000 actual rows. The verified custom plan uses a sequential scan: most heap records are needed. The index still exists and can still serve the small tenant.'},
   {title:'Make both calls share a generic plan',instruction:'Force a generic plan, then compare both calls. Look for $1 in the condition and an estimate that stays the same while actual rows change. Predict which call is poorly represented by that shared estimate. This comparison diagnoses a tradeoff; it is not a recommendation to force a global setting.',
    sql:`SET plan_cache_mode=force_generic_plan;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) EXECUTE core_tenant(1);
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) EXECUTE core_tenant(0);
RESET plan_cache_mode;`,
    expected:'The verified generic plan uses the tenant index for both calls, estimating about 495 rows. Actual rows remain 50 and 45,000. Exact estimates depend on statistics. Planning mode returns to its default after this run.'},
   {title:'Remove the exceptional tenant',instruction:'Before running, predict the new count per tenant: job IDs cycle through 100 values using modulo. This variation changes the data distribution, then refreshes statistics. The update commits when this run completes; use the next step for fresh read plans.',
    sql:`UPDATE core_parameter_jobs SET tenant_id=job_id%100;
ANALYZE core_parameter_jobs;
SELECT min(n) AS smallest,max(n) AS largest,count(*) AS tenants
FROM (SELECT count(*) AS n FROM core_parameter_jobs GROUP BY tenant_id) AS counts;`,
    expected:'100 tenants, each with 500 jobs. Statistics now describe an even distribution, so knowing tenant 0 no longer reveals an exceptionally broad request.'},
   {title:'Compare again and restore the session setting',instruction:'Predict whether custom and generic estimates should still differ dramatically. Inspect both actual plans rather than requiring an exact node name after your edits. Rerun setup to restore the skew; this step leaves the default planning mode and no open transaction.',
    sql:`SET plan_cache_mode=force_custom_plan;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) EXECUTE core_tenant(0);
SET plan_cache_mode=force_generic_plan;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) EXECUTE core_tenant(0);
RESET plan_cache_mode;`,
    expected:'Both executions return 500 rows, and their estimates are much closer than the earlier 45,000-versus-about-495 comparison. A known parameter is most useful when its value changes the expected work.'},
  ],
 },
 {
  id:'pg-executor-demand',title:'Ask for five rows and inspect the work',
  description:'Compare a top-N sort with ordered access, then make that ordered scan reject early candidates.',
  articleHref:'/learn/databases/relational/postgresql/query-execution/',
  steps:[
   {title:'Create jobs without a priority index',instruction:'Run this independent setup first. priority=(job_id*37)%101 makes every multiple of 101 have priority zero. Predict the five smallest IDs among that best priority. Setup commits when the run finishes; rerun it to remove the added ordering index and reset.',
    sql:`DROP TABLE IF EXISTS core_demand_jobs;
CREATE TABLE core_demand_jobs(job_id integer PRIMARY KEY,priority integer NOT NULL,payload text NOT NULL);
INSERT INTO core_demand_jobs
SELECT n,(n*37)%101,repeat(md5(n::text),5) FROM generate_series(1,50000) AS n;
ANALYZE core_demand_jobs;
SELECT count(*) AS jobs FROM core_demand_jobs;`,expected:'50,000 jobs. The expected first five IDs in priority,job_id order are 101,202,303,404,505. Only job_id has an index so far.'},
   {title:'Request five results from unordered input',instruction:'Predict whether Limit can stop the underlying table scan after five rows. Inspect the actual rows at the scan beneath Sort, and the sort method. The executor must know that no later candidate belongs in the best five.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT job_id,priority FROM core_demand_jobs ORDER BY priority,job_id LIMIT 5;
SELECT job_id,priority FROM core_demand_jobs ORDER BY priority,job_id LIMIT 5;`,expected:'The verified plan scans 50,000 rows and uses a top-N heapsort to return five. It can retain a small best-so-far set in memory while still examining every input row. The five IDs match the prediction.'},
   {title:'Provide the answer order',instruction:'Create the index once, then rerun just the queries for repeated observations. Predict whether a separate Sort is still necessary and how many rows the scan must produce. Do not assume an Index Only Scan means zero heap visibility checks.',
    sql:`CREATE INDEX core_demand_order ON core_demand_jobs(priority,job_id);
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT job_id,priority FROM core_demand_jobs ORDER BY priority,job_id LIMIT 5;
SELECT job_id,priority FROM core_demand_jobs ORDER BY priority,job_id LIMIT 5;`,expected:'The verified plan follows index order with no separate Sort and produces five scan rows before Limit stops requesting more. The result is unchanged; Heap Fetches may still be nonzero.'},
   {title:'Make early entries fail a filter',instruction:'Now only IDs divisible by 1,000 qualify. The index is still ordered by priority and ID, but that order does not tell us which IDs pass the modulo expression. Predict whether five returned rows still imply only five examined entries. Inspect Rows Removed by Filter and compare the chosen route.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT job_id,priority FROM core_demand_jobs
WHERE job_id%1000=0 ORDER BY priority,job_id LIMIT 5;
SELECT job_id,priority FROM core_demand_jobs
WHERE job_id%1000=0 ORDER BY priority,job_id LIMIT 5;`,expected:'Five qualifying rows still return, but the verified ordered scan rejects many earlier entries. Ordered access permits early stopping after five accepted rows; an additional filter can make reaching them expensive.'},
   {title:'Observe a full sort spilling',instruction:'This query asks for all payloads in their text order, which the priority index does not supply. A small LOCAL work_mem setting applies only inside this transaction. Predict whether the full sort can retain only five candidates as before. The final ROLLBACK ends the transaction and restores the setting; it does not undo setup.',
    sql:`BEGIN;
SET LOCAL work_mem='64kB';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT job_id,payload FROM core_demand_jobs ORDER BY payload,job_id;
ROLLBACK;`,expected:'The verified plan sorts all 50,000 rows using an external merge and temporary disk space. That is a different state requirement from a top-five sort. No transaction or local setting remains active.'},
   {title:'Change the allowance, keep the answer',instruction:'Predict whether 32MB will change the result count or the sort’s storage method. Compare the plan with the previous run. Browser timing is not a production storage benchmark, and work_mem is per operation rather than a total query budget. Reset setup when finished.',
    sql:`BEGIN;
SET LOCAL work_mem='32MB';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT job_id,payload FROM core_demand_jobs ORDER BY payload,job_id;
ROLLBACK;`,expected:'50,000 rows still return. In the verified fixture the sort fits in memory and reports quicksort rather than external merge. The setting is restored. More concurrent operations or workers would multiply the server’s potential memory demand.'},
  ],
 },
 {
  id:'pg-index-candidates',title:'Derive candidates and weaken a summary',
  description:'Combine GIN posting sets, then compare BRIN on identical events placed in different physical orders.',
  articleHref:'/learn/databases/relational/postgresql/indexes/',
  steps:[
   {title:'Create predictable document tags',instruction:'Run this independent setup. Every 100th document contains audit; every 250th contains urgent. Predict how many contain both and how many contain either before running the next step. This run commits its fixture; rerun setup to restore the tags.',
    sql:`DROP TABLE IF EXISTS core_documents;
CREATE TABLE core_documents(id integer PRIMARY KEY,tags text[] NOT NULL,note text NOT NULL);
INSERT INTO core_documents
SELECT n,ARRAY['web',CASE WHEN n%100=0 THEN 'audit' ELSE 'ordinary' END,
 CASE WHEN n%250=0 THEN 'urgent' ELSE 'routine' END],repeat('document ',15)
FROM generate_series(1,20000) AS n;
CREATE INDEX core_documents_tags ON core_documents USING gin(tags);
ANALYZE core_documents;
SELECT count(*) AS documents FROM core_documents;`,expected:'20,000 documents. audit occurs in 200, urgent in 80, and both in IDs divisible by 500: 40. Either should therefore match 200+80−40=240.'},
   {title:'Intersect or combine the key matches',instruction:'The array containment operator asks for both elements; overlap asks for at least one. Inspect the actual rows, Bitmap Index Scan and heap recheck information. A Recheck Cond alone does not prove that every candidate was a false match.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM core_documents WHERE tags @> ARRAY['audit','urgent'];
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM core_documents WHERE tags && ARRAY['audit','urgent'];
SELECT count(*) FILTER (WHERE tags @> ARRAY['audit','urgent']) AS both,
 count(*) FILTER (WHERE tags && ARRAY['audit','urgent']) AS either FROM core_documents;`,expected:'40 contain both; 240 contain either. Verified plans use GIN candidate references followed by heap access. The larger overlap result needs more candidate work even though the index is unchanged.'},
   {title:'Make one key common',instruction:'Predict the effect of changing urgent to web in the overlap query: every fixture document contains web. Compare actual rows and the naturally selected access path. The index remains valid even when it cannot exclude any record.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM core_documents WHERE tags && ARRAY['audit','web'];
SELECT count(*) AS matches FROM core_documents WHERE tags && ARRAY['audit','web'];`,expected:'All 20,000 documents match. The verified planner chooses a sequential scan for this broad condition. An index is useful when its information avoids enough work, not merely because the operator is supported.'},
   {title:'Store identical events in two physical orders',instruction:'This next independent setup creates 20,000 one-second events twice. One table follows time order; the other inserts a permutation of the same records. Both receive four-page BRIN summaries and have the same logical answer to a time query. Rerun this step to reset the event half of the lesson.',
    sql:`DROP TABLE IF EXISTS core_ordered,core_scattered;
CREATE TABLE core_ordered(id integer PRIMARY KEY,occurred_at timestamp NOT NULL,note text NOT NULL);
INSERT INTO core_ordered
SELECT n,timestamp '2026-01-01'+n*interval '1 second',repeat('event detail ',12)
FROM generate_series(1,20000) AS n;
CREATE TABLE core_scattered(LIKE core_ordered INCLUDING ALL);
INSERT INTO core_scattered SELECT * FROM core_ordered ORDER BY (id*7919)%20000;
CREATE INDEX core_ordered_time ON core_ordered USING brin(occurred_at) WITH(pages_per_range=4);
CREATE INDEX core_scattered_time ON core_scattered USING brin(occurred_at) WITH(pages_per_range=4);
ANALYZE core_ordered;
ANALYZE core_scattered;
SELECT (SELECT count(*) FROM core_ordered) AS ordered_events,
 (SELECT count(*) FROM core_scattered) AS scattered_events;`,expected:'Both tables contain 20,000 identical event records. Their physical placement differs. This setup commits at the end of the run; the next step measures fresh read plans.'},
   {title:'Ask both placements for the same minute',instruction:'Predict sixty matches: seconds 1800 through 1859. Then inspect whether each plan uses BRIN and how much candidate heap work remains. Do not force index use. A planner can correctly reject broad summaries.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT count(*) FROM core_ordered
WHERE occurred_at>=timestamp '2026-01-01 00:30:00' AND occurred_at<timestamp '2026-01-01 00:31:00';
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT count(*) FROM core_scattered
WHERE occurred_at>=timestamp '2026-01-01 00:30:00' AND occurred_at<timestamp '2026-01-01 00:31:00';
SELECT (SELECT count(*) FROM core_ordered WHERE occurred_at>=timestamp '2026-01-01 00:30:00' AND occurred_at<timestamp '2026-01-01 00:31:00') AS ordered_matches,
 (SELECT count(*) FROM core_scattered WHERE occurred_at>=timestamp '2026-01-01 00:30:00' AND occurred_at<timestamp '2026-01-01 00:31:00') AS scattered_matches;`,expected:'Both answers are 60. The verified ordered plan uses BRIN with lossy heap blocks and rechecks; the scattered plan uses a sequential scan because its ranges cannot exclude enough pages.'},
   {title:'Look at values sharing the first four pages',instruction:'ctid identifies physical page and item positions. These queries derive bounds from current rows on pages 0–3; they do not read BRIN’s internal metadata. Predict which table’s bounds are wider, and why a minute inside those bounds cannot be ruled out.',
    sql:`SELECT 'ordered' AS placement,min(occurred_at),max(occurred_at),count(*)
FROM core_ordered WHERE (ctid::text::point)[0]<4
UNION ALL
SELECT 'scattered',min(occurred_at),max(occurred_at),count(*)
FROM core_scattered WHERE (ctid::text::point)[0]<4;`,expected:'The ordered range covers only a few minutes; the scattered range spans most of the roughly five-and-a-half-hour fixture. Exact page capacity depends on layout. A min/max summary cannot exclude a time inside its bounds even if few rows there match.'},
   {title:'Widen the question until exclusion disappears',instruction:'Predict the full-day result before executing. All records belong to this day, so even well-correlated BRIN ranges have nothing irrelevant to exclude. Compare the naturally selected plan with the narrow minute. Reset steps 1 and 4 to repeat the complete lesson.',
    sql:`EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT count(*) FROM core_ordered
WHERE occurred_at>=timestamp '2026-01-01' AND occurred_at<timestamp '2026-01-02';
SELECT count(*) AS full_day FROM core_ordered
WHERE occurred_at>=timestamp '2026-01-01' AND occurred_at<timestamp '2026-01-02';`,expected:'20,000 records. The verified planner chooses a sequential scan. A useful narrow-range index need not improve a query that requires the whole table.'},
  ],
 },
];
