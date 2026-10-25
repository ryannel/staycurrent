-- Modelling hierarchies. PostgreSQL 18. Run in a disposable, empty database.
-- Creates hierarchy_lab and installs ltree if absent. Does not drop existing data.
-- psql -v ON_ERROR_STOP=1 -f hierarchy-example.sql <explicit owned connection>
BEGIN;
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE SCHEMA hierarchy_lab;
SET search_path = hierarchy_lab, public;
CREATE TABLE categories (
  category_id integer PRIMARY KEY,
  name text NOT NULL,
  parent_id integer REFERENCES categories(category_id) ON DELETE RESTRICT,
  CHECK (category_id <> parent_id),
  CHECK ((category_id = 0 AND parent_id IS NULL)
      OR (category_id <> 0 AND parent_id IS NOT NULL))
);
CREATE INDEX categories_parent ON categories(parent_id);
INSERT INTO categories VALUES
  (0, 'Catalogue', NULL), (10, 'Teaware', 0),
  (11, 'Mugs', 10), (12, 'Blue mugs', 11), (20, 'Gifts', 0);

-- The guarded walk includes its starting category. Repeated IDs are not expanded.
CREATE VIEW tree_walk AS
WITH RECURSIVE walk(category_id, depth, route) AS (
  SELECT category_id, 0, ARRAY[category_id] FROM categories WHERE category_id = 0
  UNION ALL
  SELECT c.category_id, w.depth + 1, w.route || c.category_id
  FROM walk w JOIN categories c ON c.parent_id = w.category_id
  WHERE NOT c.category_id = ANY(w.route)
)
SELECT * FROM walk;

COMMIT;

-- A parent-only move, before any derived structures exist.
BEGIN ISOLATION LEVEL READ COMMITTED;
LOCK TABLE categories IN SHARE ROW EXCLUSIVE MODE;
DO $$
DECLARE moving integer := 11; new_parent integer := 20;
BEGIN
  IF moving = 0 OR moving IS NULL OR new_parent IS NULL
     OR NOT EXISTS (SELECT FROM categories WHERE category_id = moving)
     OR NOT EXISTS (SELECT FROM categories WHERE category_id = new_parent) THEN
    RAISE EXCEPTION 'invalid category or root move';
  END IF;
  IF EXISTS (
    WITH RECURSIVE subtree(id) AS (
      SELECT category_id FROM categories WHERE category_id = moving
      UNION
      SELECT c.category_id FROM categories c JOIN subtree s ON c.parent_id = s.id
    ) SELECT FROM subtree WHERE id = new_parent
  ) THEN RAISE EXCEPTION 'new parent is inside the moving subtree'; END IF;
  UPDATE categories SET parent_id = new_parent WHERE category_id = moving;
END $$;
ROLLBACK; -- Use COMMIT to keep an accepted move; this example restores its baseline.

BEGIN;
CREATE TABLE category_paths (
  category_id integer PRIMARY KEY REFERENCES categories,
  path ltree NOT NULL UNIQUE
);
CREATE TABLE category_closure (
  ancestor_id integer REFERENCES categories,
  descendant_id integer REFERENCES categories,
  depth integer NOT NULL CHECK (depth >= 0),
  PRIMARY KEY (ancestor_id, descendant_id)
);
CREATE TABLE category_bounds (
  category_id integer PRIMARY KEY REFERENCES categories,
  lo integer NOT NULL UNIQUE,
  hi integer NOT NULL UNIQUE,
  CHECK (lo < hi)
);

-- All helpers assume the caller has locked categories first. They are an
-- educational maintenance interface, not a privilege/security boundary.
CREATE FUNCTION expected_paths()
RETURNS TABLE(category_id integer, path ltree) LANGUAGE sql STABLE AS $$
  SELECT category_id, text2ltree(array_to_string(route, '.')) FROM tree_walk
$$;
CREATE FUNCTION expected_closure()
RETURNS TABLE(ancestor_id integer, descendant_id integer, depth integer)
LANGUAGE sql STABLE AS $$
  WITH RECURSIVE reach(ancestor_id, descendant_id, depth, route) AS (
    SELECT category_id, category_id, 0, ARRAY[category_id] FROM categories
    UNION ALL
    SELECT r.ancestor_id, c.category_id, r.depth + 1, r.route || c.category_id
    FROM reach r JOIN categories c ON c.parent_id = r.descendant_id
    WHERE NOT c.category_id = ANY(r.route)
  ) SELECT ancestor_id, descendant_id, depth FROM reach
$$;
CREATE FUNCTION expected_bounds()
RETURNS TABLE(category_id integer, lo integer, hi integer)
LANGUAGE sql STABLE AS $$
  WITH events AS (
    SELECT category_id, route || -1 AS event_path, false AS exiting FROM tree_walk
    UNION ALL
    SELECT category_id, route || 2147483647, true FROM tree_walk
  ), numbered AS (
    SELECT category_id, exiting,
           row_number() OVER (ORDER BY event_path)::integer AS n
    FROM events
  )
  SELECT category_id, min(n), max(n) FROM numbered GROUP BY category_id
$$;
-- Numbering orders siblings by ID. Reserve -1 and 2147483647 as event markers;
-- all category IDs in this example lie in 0..2147483646.
ALTER TABLE categories ADD CHECK (category_id BETWEEN 0 AND 2147483646);

CREATE FUNCTION assert_tree() RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM tree_walk) <> (SELECT count(*) FROM categories) THEN
    RAISE EXCEPTION 'not every category is reachable from Catalogue';
  END IF;
END $$;
CREATE FUNCTION assert_derived() RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM assert_tree();
  IF EXISTS (
    (SELECT * FROM expected_paths() EXCEPT SELECT * FROM category_paths)
    UNION ALL
    (SELECT * FROM category_paths EXCEPT SELECT * FROM expected_paths())
  ) THEN RAISE EXCEPTION 'path mismatch'; END IF;
  IF EXISTS (
    (SELECT * FROM expected_closure() EXCEPT SELECT * FROM category_closure)
    UNION ALL
    (SELECT * FROM category_closure EXCEPT SELECT * FROM expected_closure())
  ) THEN RAISE EXCEPTION 'closure mismatch'; END IF;
  IF EXISTS (
    (SELECT * FROM expected_bounds() EXCEPT SELECT * FROM category_bounds)
    UNION ALL
    (SELECT * FROM category_bounds EXCEPT SELECT * FROM expected_bounds())
  ) THEN RAISE EXCEPTION 'bounds mismatch'; END IF;
  -- Unique endpoints across both columns, not just within each column.
  IF (SELECT count(*) FROM (
    SELECT lo AS endpoint FROM category_bounds UNION SELECT hi FROM category_bounds
  ) x) <> 2 * (SELECT count(*) FROM categories) THEN
    RAISE EXCEPTION 'reused endpoint';
  END IF;
  IF EXISTS (SELECT FROM category_bounds a JOIN category_bounds b
    ON a.lo < b.lo AND b.lo < a.hi AND a.hi < b.hi) THEN
    RAISE EXCEPTION 'crossing intervals';
  END IF;
END $$;

INSERT INTO category_paths SELECT * FROM expected_paths();
INSERT INTO category_closure SELECT * FROM expected_closure();
INSERT INTO category_bounds SELECT * FROM expected_bounds();
SELECT assert_derived();

-- This transaction protocol deliberately serialises all category-table writers.
-- Start a fresh Read Committed transaction; lock before reading topology.
-- Always use this same categories -> paths -> closure -> bounds lock order.
CREATE FUNCTION move_tree_node(moving integer, new_parent integer)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE old_path ltree; destination ltree;
BEGIN
  IF current_setting('transaction_isolation') <> 'read committed' THEN
    RAISE EXCEPTION 'use a fresh Read Committed transaction';
  END IF;
  LOCK TABLE categories IN SHARE ROW EXCLUSIVE MODE;
  LOCK TABLE category_paths, category_closure, category_bounds
    IN SHARE ROW EXCLUSIVE MODE;
  PERFORM assert_derived();
  IF moving = 0 OR moving IS NULL OR new_parent IS NULL
     OR NOT EXISTS (SELECT FROM categories WHERE category_id = moving)
     OR NOT EXISTS (SELECT FROM categories WHERE category_id = new_parent) THEN
    RAISE EXCEPTION 'invalid category or root move';
  END IF;
  IF EXISTS (
    WITH RECURSIVE subtree(id) AS (
      SELECT category_id FROM categories WHERE category_id = moving
      UNION
      SELECT c.category_id FROM categories c JOIN subtree s ON c.parent_id = s.id
    ) SELECT FROM subtree WHERE id = new_parent
  ) THEN RAISE EXCEPTION 'new parent is inside the moving subtree'; END IF;
  SELECT path INTO old_path FROM category_paths WHERE category_id = moving;
  SELECT path INTO destination FROM category_paths WHERE category_id = new_parent;

  -- Remove only pairs from ancestors outside the subtree to nodes inside it.
  -- Internal subtree pairs, including their depths, remain valid.
  DELETE FROM category_closure c
  WHERE c.descendant_id IN (
    SELECT descendant_id FROM category_closure WHERE ancestor_id = moving
  ) AND c.ancestor_id NOT IN (
    SELECT descendant_id FROM category_closure WHERE ancestor_id = moving
  );
  -- Add all new ancestors x subtree descendants. The retained self pairs
  -- make both the destination and the moving root participate in this product.
  INSERT INTO category_closure(ancestor_id, descendant_id, depth)
  SELECT a.ancestor_id, d.descendant_id, a.depth + 1 + d.depth
  FROM category_closure a CROSS JOIN category_closure d
  WHERE a.descendant_id = new_parent AND d.ancestor_id = moving;

  UPDATE category_paths SET path = destination ||
    CASE WHEN path = old_path THEN text2ltree(moving::text)
         ELSE text2ltree(moving::text) || subpath(path, nlevel(old_path)) END
  WHERE path <@ old_path;
  UPDATE categories SET parent_id = new_parent WHERE category_id = moving;
  -- Replace a small catalogue's derived numbering atomically.
  DELETE FROM category_bounds;
  INSERT INTO category_bounds SELECT * FROM expected_bounds();
  PERFORM assert_derived();
END $$;

COMMIT;

-- Same baseline used in the article. The move is an independent variation.
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT move_tree_node(11,20);
SELECT * FROM categories ORDER BY category_id;
SELECT * FROM category_paths ORDER BY category_id;
SELECT * FROM category_closure ORDER BY ancestor_id, descendant_id;
SELECT * FROM category_bounds ORDER BY lo;
ROLLBACK;

-- Build the existing Blue mugs leaf: this is baseline construction, no new ID.
BEGIN ISOLATION LEVEL READ COMMITTED;
LOCK TABLE categories, category_paths, category_closure, category_bounds
  IN SHARE ROW EXCLUSIVE MODE;
DELETE FROM category_paths WHERE category_id = 12;
DELETE FROM category_closure WHERE ancestor_id = 12 OR descendant_id = 12;
DELETE FROM category_bounds;
DELETE FROM categories WHERE category_id = 12;
INSERT INTO categories VALUES (12, 'Blue mugs', 11);
INSERT INTO category_paths
  SELECT 12, path || '12'::ltree FROM category_paths WHERE category_id = 11;
INSERT INTO category_closure
  SELECT ancestor_id, 12, depth + 1 FROM category_closure WHERE descendant_id = 11
  UNION ALL SELECT 12,12,0;
INSERT INTO category_bounds SELECT * FROM expected_bounds();
SELECT assert_derived();
ROLLBACK;

-- A multiple-parent alternative uses authoritative edges in separate tables.
BEGIN;
CREATE TABLE dag_categories(category_id integer PRIMARY KEY, name text NOT NULL);
INSERT INTO dag_categories SELECT category_id,name FROM categories;
CREATE TABLE category_edges (
  parent_id integer REFERENCES dag_categories,
  child_id integer REFERENCES dag_categories,
  PRIMARY KEY(parent_id,child_id),
  CHECK(parent_id <> child_id), CHECK(child_id <> 0)
);
INSERT INTO category_edges VALUES (0,10),(10,11),(11,12),(0,20),(20,11);
CREATE TABLE dag_closure (
  ancestor_id integer REFERENCES dag_categories,
  descendant_id integer REFERENCES dag_categories,
  PRIMARY KEY(ancestor_id,descendant_id)
);
CREATE FUNCTION expected_dag_closure()
RETURNS TABLE(ancestor_id integer, descendant_id integer) LANGUAGE sql STABLE AS $$
  WITH RECURSIVE reach(a,d) AS (
    SELECT category_id, category_id FROM dag_categories
    UNION
    SELECT r.a,e.child_id FROM reach r JOIN category_edges e ON e.parent_id = r.d
  ) SELECT a,d FROM reach
$$;
INSERT INTO dag_closure SELECT * FROM expected_dag_closure();
CREATE FUNCTION rebuild_dag_closure() RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM dag_closure;
  INSERT INTO dag_closure SELECT * FROM expected_dag_closure();
  IF EXISTS (
    (SELECT * FROM expected_dag_closure() EXCEPT SELECT * FROM dag_closure)
    UNION ALL
    (SELECT * FROM dag_closure EXCEPT SELECT * FROM expected_dag_closure())
  ) THEN RAISE EXCEPTION 'DAG closure mismatch'; END IF;
END $$;
CREATE FUNCTION change_edge(parent integer, child integer, adding boolean)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF current_setting('transaction_isolation') <> 'read committed' THEN
    RAISE EXCEPTION 'use a fresh Read Committed transaction';
  END IF;
  LOCK TABLE dag_categories, category_edges, dag_closure IN SHARE ROW EXCLUSIVE MODE;
  IF adding THEN
    IF child = 0 OR parent IS NULL OR child IS NULL OR parent = child THEN
      RAISE EXCEPTION 'invalid edge';
    END IF;
    IF EXISTS (
      WITH RECURSIVE below(id) AS (
        SELECT child
        UNION
        SELECT e.child_id FROM category_edges e JOIN below b ON e.parent_id = b.id
      ) SELECT FROM below WHERE id = parent
    ) THEN RAISE EXCEPTION 'edge closes a cycle'; END IF;
    INSERT INTO category_edges VALUES(parent,child);
  ELSE
    DELETE FROM category_edges WHERE parent_id = parent AND child_id = child;
  END IF;
  -- Chosen shop policy: every node must remain reachable from Catalogue.
  IF EXISTS (SELECT FROM dag_categories n WHERE NOT EXISTS (
    SELECT FROM expected_dag_closure() r
    WHERE r.ancestor_id = 0 AND r.descendant_id = n.category_id
  )) THEN RAISE EXCEPTION 'edge change disconnects a category'; END IF;
  PERFORM rebuild_dag_closure();
END $$;
COMMIT;
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT change_edge(20,11,false);
-- Mugs/Blue mugs remain reachable through Teaware; Gifts is no longer ancestor.
SELECT * FROM dag_closure ORDER BY ancestor_id,descendant_id;
ROLLBACK;

-- Descendants including the start: path rows, deliberately sorted for display.
WITH RECURSIVE below(category_id,name,depth,route) AS (
  SELECT category_id,name,0,ARRAY[category_id] FROM categories WHERE category_id=10
  UNION ALL
  SELECT c.category_id,c.name,b.depth+1,b.route||c.category_id
  FROM below b JOIN categories c ON c.parent_id=b.category_id
  WHERE NOT c.category_id=ANY(b.route)
) SELECT category_id,name,depth,route FROM below ORDER BY route;

-- Breadcrumbs: reverse the join and reverse the depth order.
WITH RECURSIVE above(category_id,name,parent_id,depth,route) AS (
  SELECT category_id,name,parent_id,0,ARRAY[category_id]
  FROM categories WHERE category_id=12
  UNION ALL
  SELECT c.category_id,c.name,c.parent_id,a.depth+1,a.route||c.category_id
  FROM above a JOIN categories c ON c.category_id=a.parent_id
  WHERE NOT c.category_id=ANY(a.route)
) SELECT category_id,name FROM above ORDER BY depth DESC;

-- CYCLE reports the repeated row and stops expanding it.
WITH RECURSIVE below(category_id,parent_id,depth) AS (
  SELECT category_id,parent_id,0 FROM categories WHERE category_id=10
  UNION ALL
  SELECT c.category_id,c.parent_id,b.depth+1
  FROM below b JOIN categories c ON c.parent_id=b.category_id
) CYCLE category_id SET is_cycle USING route
SELECT category_id,depth,is_cycle FROM below ORDER BY route;

-- One reachable node rather than one row per route.
WITH RECURSIVE reachable(id) AS (
  SELECT 0
  UNION
  SELECT e.child_id FROM reachable r JOIN category_edges e ON e.parent_id=r.id
) SELECT id FROM reachable ORDER BY id;
-- Each distinct path: Mugs and Blue mugs each appear twice from Catalogue.
WITH RECURSIVE routes(id,route) AS (
  SELECT 0,ARRAY[0]
  UNION ALL
  SELECT e.child_id,r.route||e.child_id
  FROM routes r JOIN category_edges e ON e.parent_id=r.id
  WHERE NOT e.child_id=ANY(r.route)
) SELECT * FROM routes ORDER BY route;
