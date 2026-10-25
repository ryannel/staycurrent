SET search_path=hierarchy_lab,public;
SELECT version();
DO $$ BEGIN
  IF (SELECT array_agg(category_id ORDER BY category_id) FROM tree_walk) <> ARRAY[0,10,11,12,20] THEN RAISE EXCEPTION 'walk'; END IF;
  IF (SELECT count(*) FROM category_closure) <> 12 THEN RAISE EXCEPTION 'baseline pair count'; END IF;
END $$;
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT move_tree_node(11,20);
DO $$ BEGIN
 IF (SELECT path::text FROM category_paths WHERE category_id=12) <> '0.20.11.12' THEN RAISE EXCEPTION 'moved path'; END IF;
 IF EXISTS(SELECT FROM category_closure WHERE ancestor_id=10 AND descendant_id=12) THEN RAISE EXCEPTION 'stale ancestry'; END IF;
 IF NOT EXISTS(SELECT FROM category_closure WHERE ancestor_id=20 AND descendant_id=12 AND depth=2) THEN RAISE EXCEPTION 'missing ancestry'; END IF;
END $$;
ROLLBACK;
DO $$ BEGIN
 BEGIN PERFORM move_tree_node(10,12); RAISE EXCEPTION 'accepted cycle';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'new parent is inside the moving subtree' THEN RAISE; END IF;
 END;
 BEGIN PERFORM move_tree_node(11,11); RAISE EXCEPTION 'accepted self';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'new parent is inside the moving subtree' THEN RAISE; END IF;
 END;
 BEGIN PERFORM move_tree_node(0,20); RAISE EXCEPTION 'accepted root';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'invalid category or root move' THEN RAISE; END IF;
 END;
END $$;
-- Declarative rules alone accept a multi-row cycle.
BEGIN;
UPDATE categories SET parent_id=12 WHERE category_id=10;
WITH RECURSIVE b(category_id,parent_id,depth) AS (
 SELECT category_id,parent_id,0 FROM categories WHERE category_id=10
 UNION ALL SELECT c.category_id,c.parent_id,b.depth+1 FROM b JOIN categories c ON c.parent_id=b.category_id
) CYCLE category_id SET cyclic USING route
SELECT category_id,depth,cyclic FROM b ORDER BY route;
-- UNION of IDs terminates even here; changing depth makes whole rows different.
WITH RECURSIVE b(id) AS (
 SELECT 10 UNION SELECT c.category_id FROM categories c JOIN b ON c.parent_id=b.id
) SELECT array_agg(id ORDER BY id) AS terminating_ids FROM b;
ROLLBACK;
-- Corruption counterexamples must be noticed, then roll back.
DO $$ BEGIN
 BEGIN
  DELETE FROM category_paths WHERE category_id=12;
  PERFORM assert_derived(); RAISE EXCEPTION 'missed deleted path';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'path mismatch' THEN RAISE; END IF;
 END;
 BEGIN
  DELETE FROM category_closure WHERE ancestor_id=10 AND descendant_id=12;
  PERFORM assert_derived(); RAISE EXCEPTION 'missed deleted pair';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'closure mismatch' THEN RAISE; END IF;
 END;
 BEGIN
  UPDATE category_bounds SET hi=99 WHERE category_id=10;
  PERFORM assert_derived(); RAISE EXCEPTION 'missed stale bound';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'bounds mismatch' THEN RAISE; END IF;
 END;
 BEGIN
  PERFORM change_edge(12,10,true); RAISE EXCEPTION 'accepted DAG cycle';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'edge closes a cycle' THEN RAISE; END IF;
 END;
END $$;
BEGIN;
SELECT change_edge(20,11,false);
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM dag_closure WHERE ancestor_id=0 AND descendant_id=12) THEN RAISE EXCEPTION 'lost alternate route'; END IF;
 IF EXISTS(SELECT FROM dag_closure WHERE ancestor_id=20 AND descendant_id=12) THEN RAISE EXCEPTION 'stale Gifts'; END IF;
END $$;
ROLLBACK;
SELECT assert_derived();
