-- PostgreSQL 18.6; disposable session tables, no production objects.
SET search_path=author_rl86,public;
CREATE TEMP TABLE tagged_sessions(session_no integer,tags text[]);
INSERT INTO tagged_sessions
SELECT n,ARRAY[CASE WHEN n%2=0 THEN 'wood' ELSE 'metal' END,
CASE WHEN n%3=0 THEN 'beginner' ELSE 'advanced' END]
FROM generate_series(1,10000) n;
CREATE INDEX ON tagged_sessions USING gin(tags);
ANALYZE tagged_sessions;
SELECT count(*) FROM tagged_sessions WHERE tags @> ARRAY['wood','beginner'];
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT * FROM tagged_sessions WHERE tags @> ARRAY['wood','beginner'];
CREATE TEMP TABLE dated_events(event_no integer,at_time timestamp);
INSERT INTO dated_events SELECT n,timestamp '2026-01-01'+n*interval '1 minute'
FROM generate_series(1,200000) n;
CREATE INDEX dated_events_brin ON dated_events USING brin(at_time) WITH(pages_per_range=16);
ANALYZE dated_events;
SELECT count(*) FROM dated_events WHERE at_time>=timestamp '2026-02-01' AND at_time<timestamp '2026-02-02';
-- Diagnostic route inspection only; RESET restores the planner afterwards.
SET enable_seqscan=off;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT * FROM dated_events WHERE at_time>=timestamp '2026-02-01' AND at_time<timestamp '2026-02-02';
RESET enable_seqscan;
