\set ON_ERROR_STOP on
BEGIN;
SET LOCAL timezone='UTC';
CREATE TEMP TABLE request_events (
 event_id text NOT NULL, occurred_at timestamptz NOT NULL,
 shop_id integer NOT NULL, endpoint text NOT NULL,
 PRIMARY KEY(occurred_at,event_id)
) PARTITION BY RANGE(occurred_at);
CREATE TEMP TABLE events_sep PARTITION OF request_events
 FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TEMP TABLE events_oct PARTITION OF request_events
 FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');
CREATE TEMP TABLE events_nov PARTITION OF request_events
 FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');
\copy request_events FROM 'events.csv' WITH (FORMAT csv,HEADER true)
ANALYZE request_events;
SELECT tableoid::regclass AS partition,event_id,occurred_at FROM request_events ORDER BY occurred_at;
\echo Literal October range: only October is needed
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT event_id FROM request_events
WHERE occurred_at>=timestamptz '2026-10-01 00:00Z'
AND occurred_at<timestamptz '2026-11-01 00:00Z';
\echo No partition-key restriction: all partitions are candidates
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT event_id FROM request_events WHERE endpoint='/catalogue';
\echo Wrapped key: this expression is not the partition key
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT event_id FROM request_events
WHERE (occurred_at AT TIME ZONE 'UTC')::date BETWEEN date '2026-10-01' AND date '2026-10-31';
PREPARE event_window(timestamptz,timestamptz) AS
SELECT event_id FROM request_events WHERE occurred_at>=$1 AND occurred_at<$2;
SET LOCAL plan_cache_mode=force_generic_plan;
\echo Generic prepared window: runtime pruning
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
EXECUTE event_window('2026-10-01 00:00Z','2026-11-01 00:00Z');
DO $$ BEGIN
 IF (SELECT array_agg(event_id ORDER BY event_id) FROM request_events
 WHERE occurred_at>='2026-10-01 00:00Z' AND occurred_at<'2026-11-01 00:00Z')
 IS DISTINCT FROM ARRAY['E2','E3'] THEN RAISE EXCEPTION 'Wrong October rows'; END IF;
 BEGIN
 CREATE UNIQUE INDEX impossible_global_id ON request_events(event_id);
 RAISE EXCEPTION 'Unexpected global unique index support';
 EXCEPTION WHEN feature_not_supported THEN RAISE NOTICE 'Expected refusal: unique key omits partition key'; END;
 INSERT INTO request_events VALUES('E2','2026-11-02 00:00Z',10,'/catalogue');
 IF (SELECT count(*) FROM request_events WHERE event_id='E2')<>2 THEN RAISE EXCEPTION 'Expected two distinct composite identities'; END IF;
 DELETE FROM request_events WHERE event_id='E2' AND occurred_at='2026-11-02 00:00Z';
 BEGIN
 INSERT INTO request_events VALUES('E2','2026-10-01 00:00Z',10,'/catalogue');
 RAISE EXCEPTION 'Unexpected duplicate composite key';
 EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'Expected refusal: duplicate composite key'; END;
END $$;
CREATE TEMP TABLE event_notes_checked(
 occurred_at timestamptz,event_id text,note text,
 FOREIGN KEY(occurred_at,event_id) REFERENCES request_events(occurred_at,event_id)
);
CREATE TEMP TABLE event_notes_unchecked(occurred_at timestamptz,event_id text,note text);
INSERT INTO event_notes_checked VALUES('2026-09-30 23:59:59Z','E1','retained note');
INSERT INTO event_notes_unchecked TABLE event_notes_checked;
DO $$ BEGIN
 BEGIN
 ALTER TABLE request_events DETACH PARTITION events_sep;
 RAISE EXCEPTION 'Expected reference to prevent detach';
 EXCEPTION WHEN foreign_key_violation THEN RAISE NOTICE 'Expected refusal: retained child references old event'; END;
END $$;
-- This drill explicitly expires the checked note; real policy must decide this.
DELETE FROM event_notes_checked WHERE event_id='E1';
ALTER TABLE request_events DETACH PARTITION events_sep;
DO $$ BEGIN
 IF (SELECT count(*) FROM request_events)<>3 OR (SELECT count(*) FROM events_sep)<>1
 THEN RAISE EXCEPTION 'Detach result mismatch'; END IF;
 IF NOT EXISTS(SELECT 1 FROM event_notes_unchecked n WHERE NOT EXISTS
 (SELECT 1 FROM request_events e WHERE (e.occurred_at,e.event_id)=(n.occurred_at,n.event_id)))
 THEN RAISE EXCEPTION 'Expected unchecked dangling reference'; END IF;
 BEGIN
 INSERT INTO request_events VALUES('E-late','2026-09-30 23:59:59Z',10,'/catalogue');
 RAISE EXCEPTION 'Expected late event to lack partition';
 EXCEPTION WHEN check_violation THEN RAISE NOTICE 'Expected refusal: no September partition remains'; END;
END $$;
SELECT 'parent after detach' AS relation,count(*) FROM request_events
UNION ALL SELECT 'detached table',count(*) FROM events_sep;
ALTER TABLE request_events ATTACH PARTITION events_sep
 FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
DO $$ BEGIN IF (SELECT count(*) FROM request_events)<>4 THEN RAISE EXCEPTION 'Reattach failed'; END IF; END $$;
DEALLOCATE event_window;
ROLLBACK;
