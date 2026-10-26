\set ON_ERROR_STOP on
\pset pager off
SELECT current_database() = :'fixture_db' AND session_user = :'fixture_admin' AS owned_target \gset
\if :owned_target
\else
  \echo 'Wrong owned fixture target; stopping before mutations.'
  \quit 3
\endif
SELECT version(), current_database(), session_user, inet_server_addr();
CREATE ROLE shop_migrate NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
CREATE ROLE shop_runtime LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
CREATE ROLE shop_support LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
CREATE ROLE shop_lookup NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
CREATE ROLE shop_reader NOLOGIN;
CREATE ROLE shop_deploy LOGIN NOINHERIT;
CREATE ROLE shop_outsider LOGIN;
GRANT shop_reader TO shop_runtime WITH INHERIT TRUE, SET FALSE, ADMIN FALSE;
GRANT shop_migrate TO shop_deploy WITH INHERIT FALSE, SET TRUE, ADMIN FALSE;
CREATE SCHEMA sc_access_verify AUTHORIZATION shop_migrate;
CREATE SCHEMA sc_access_private AUTHORIZATION shop_migrate;
GRANT USAGE ON SCHEMA sc_access_verify TO shop_reader, shop_runtime, shop_support, shop_lookup, shop_outsider;
GRANT USAGE ON SCHEMA sc_access_private TO shop_lookup;
SET ROLE shop_migrate;
CREATE TABLE sc_access_verify.customers(tenant_id int NOT NULL, customer_id int PRIMARY KEY, name text NOT NULL, UNIQUE(tenant_id,customer_id));
INSERT INTO sc_access_verify.customers VALUES(10,1,'Mina Shah'),(10,2,'Tariq Aziz'),(10,3,'Edda Berg'),(20,4,'Rowan Vale');
CREATE TABLE sc_access_verify.orders(tenant_id int NOT NULL,order_id int PRIMARY KEY,customer_id int NOT NULL,placed_at timestamptz NOT NULL,status text NOT NULL,FOREIGN KEY(tenant_id,customer_id) REFERENCES sc_access_verify.customers(tenant_id,customer_id));
INSERT INTO sc_access_verify.orders VALUES(10,101,1,'2026-10-12 09:30+00','paid'),(10,102,2,'2026-10-14 16:05+00','paid'),(10,103,1,'2026-10-20 10:15+00','pending');
GRANT SELECT ON sc_access_verify.customers TO shop_reader;
GRANT UPDATE(name) ON sc_access_verify.customers TO shop_runtime;
GRANT SELECT ON sc_access_verify.orders TO shop_runtime;
GRANT UPDATE(tenant_id) ON sc_access_verify.orders TO shop_runtime;
GRANT INSERT ON sc_access_verify.orders TO shop_runtime;
GRANT SELECT(tenant_id,customer_id,name) ON sc_access_verify.customers TO shop_support, shop_lookup;
GRANT SELECT(tenant_id,order_id,customer_id,status) ON sc_access_verify.orders TO shop_support;
RESET ROLE;
\connect :DBNAME shop_runtime
SELECT 'actual runtime identity',session_user,current_user;
DO $$ DECLARE n int; BEGIN
 UPDATE sc_access_verify.customers SET name=name WHERE customer_id=4; GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION 'Unprotected update counterexample failed'; END IF;
 IF (SELECT count(*) FROM sc_access_verify.customers) <> 4 THEN RAISE EXCEPTION 'Unprotected counterexample failed'; END IF;
 IF NOT pg_has_role(current_user,'shop_reader','USAGE') THEN RAISE EXCEPTION 'Inheritance failed'; END IF;
 BEGIN EXECUTE 'SET ROLE shop_reader'; RAISE EXCEPTION 'SET unexpectedly allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN EXECUTE 'SET ROLE shop_migrate'; RAISE EXCEPTION 'Migration SET unexpectedly allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN EXECUTE 'ALTER TABLE sc_access_verify.customers ADD COLUMN forbidden int'; RAISE EXCEPTION 'ALTER unexpectedly allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 END $$;
\connect :DBNAME :fixture_admin
SET ROLE shop_migrate;
ALTER TABLE sc_access_verify.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sc_access_verify.orders ENABLE ROW LEVEL SECURITY;
RESET ROLE;
\connect :DBNAME shop_runtime
DO $$ BEGIN IF EXISTS(SELECT FROM sc_access_verify.customers) THEN RAISE EXCEPTION 'Default deny failed'; END IF; END $$;
\connect :DBNAME :fixture_admin
SET ROLE shop_migrate;
CREATE POLICY tenant_customers ON sc_access_verify.customers TO shop_runtime,shop_support USING(tenant_id = nullif(current_setting('shop.tenant_id',true),'')::int) WITH CHECK(tenant_id = nullif(current_setting('shop.tenant_id',true),'')::int);
CREATE POLICY tenant_orders ON sc_access_verify.orders TO shop_runtime,shop_support USING(tenant_id = nullif(current_setting('shop.tenant_id',true),'')::int) WITH CHECK(tenant_id = nullif(current_setting('shop.tenant_id',true),'')::int);
RESET ROLE;
\connect :DBNAME shop_runtime
BEGIN;
SET LOCAL shop.tenant_id='10';
SELECT 'tenant10',array_agg(customer_id ORDER BY customer_id) FROM sc_access_verify.customers;
DO $$ DECLARE n int; BEGIN
 IF (SELECT count(*) FROM sc_access_verify.customers) <> 3 THEN RAISE EXCEPTION 'Tenant10 read failed'; END IF;
 IF EXISTS(SELECT FROM sc_access_verify.customers WHERE customer_id=4) THEN RAISE EXCEPTION 'Rowan leaked'; END IF;
 UPDATE sc_access_verify.customers SET name=name WHERE customer_id=4; GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>0 THEN RAISE EXCEPTION 'Hidden update affected rows'; END IF;
 BEGIN UPDATE sc_access_verify.orders SET tenant_id=20 WHERE order_id=103; RAISE EXCEPTION 'WITH CHECK failed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN INSERT INTO sc_access_verify.orders VALUES(20,103,4,'2026-10-20 10:15+00','pending'); RAISE EXCEPTION 'Insert CHECK failed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 END $$;
COMMIT;
DO $$ BEGIN IF EXISTS(SELECT FROM sc_access_verify.customers) THEN RAISE EXCEPTION 'Context survived COMMIT'; END IF; END $$;
BEGIN; SET LOCAL shop.tenant_id='10'; ROLLBACK;
DO $$ BEGIN IF EXISTS(SELECT FROM sc_access_verify.customers) THEN RAISE EXCEPTION 'Context survived ROLLBACK'; END IF; END $$;
BEGIN; SET LOCAL shop.tenant_id='20';
SELECT 'forged context counterexample',array_agg(customer_id) FROM sc_access_verify.customers;
DO $$ BEGIN IF (SELECT name FROM sc_access_verify.customers WHERE customer_id=4) <> 'Rowan Vale' THEN RAISE EXCEPTION 'Forged context counterexample failed'; END IF; END $$;
ROLLBACK;
SET shop.tenant_id='10'; BEGIN; SET LOCAL shop.tenant_id='20'; COMMIT;
DO $$ BEGIN IF current_setting('shop.tenant_id') <> '10' THEN RAISE EXCEPTION 'Underlying session baseline not restored'; END IF; END $$;
RESET shop.tenant_id;
\connect :DBNAME shop_support
SELECT 'actual support identity',session_user,current_user;
BEGIN; SET LOCAL shop.tenant_id='10';
SELECT tenant_id,order_id,customer_id,status FROM sc_access_verify.orders ORDER BY order_id;
DO $$ BEGIN
 BEGIN PERFORM placed_at FROM sc_access_verify.orders; RAISE EXCEPTION 'Ungranted column visible'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN UPDATE sc_access_verify.orders SET status='paid' WHERE order_id=103; RAISE EXCEPTION 'Support write allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 END $$;
ROLLBACK;
\connect :DBNAME :fixture_admin
SET ROLE shop_migrate;
SELECT 'owner bypass',count(*) FROM sc_access_verify.customers;
CREATE VIEW sc_access_verify.owner_names AS SELECT tenant_id,customer_id,name FROM sc_access_verify.customers;
CREATE VIEW sc_access_verify.invoker_names WITH(security_invoker=true) AS SELECT tenant_id,customer_id,name FROM sc_access_verify.customers;
GRANT SELECT ON sc_access_verify.owner_names,sc_access_verify.invoker_names TO shop_support;
RESET ROLE;
\connect :DBNAME shop_support
BEGIN; SET LOCAL shop.tenant_id='10';
DO $$ BEGIN
 IF (SELECT count(*) FROM sc_access_verify.owner_names)<>4 THEN RAISE EXCEPTION 'Owner view counterexample failed'; END IF;
 IF (SELECT count(*) FROM sc_access_verify.invoker_names)<>3 THEN RAISE EXCEPTION 'Invoker view failed'; END IF;
 END $$;
ROLLBACK;
\connect :DBNAME :fixture_admin
SET ROLE shop_migrate;
ALTER TABLE sc_access_verify.customers FORCE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS(SELECT FROM sc_access_verify.customers) THEN RAISE EXCEPTION 'FORCE owner default deny failed'; END IF; END $$;
ALTER TABLE sc_access_verify.customers NO FORCE ROW LEVEL SECURITY;
CREATE POLICY extra_read ON sc_access_verify.customers FOR SELECT TO shop_runtime USING(true);
RESET ROLE;
\connect :DBNAME shop_runtime
BEGIN; SET LOCAL shop.tenant_id='10';
DO $$ BEGIN IF (SELECT count(*) FROM sc_access_verify.customers)<>4 THEN RAISE EXCEPTION 'Permissive OR counterexample failed'; END IF; END $$;
ROLLBACK;
\connect :DBNAME :fixture_admin
SET ROLE shop_migrate;
CREATE POLICY tenant_fence ON sc_access_verify.customers AS RESTRICTIVE FOR SELECT TO shop_runtime USING(tenant_id=nullif(current_setting('shop.tenant_id',true),'')::int);
RESET ROLE;
\connect :DBNAME shop_runtime
BEGIN; SET LOCAL shop.tenant_id='10';
DO $$ BEGIN IF (SELECT count(*) FROM sc_access_verify.customers)<>3 THEN RAISE EXCEPTION 'Restrictive AND failed'; END IF; END $$;
ROLLBACK;
\connect :DBNAME :fixture_admin
SET ROLE shop_migrate;
DROP POLICY extra_read ON sc_access_verify.customers;
DROP POLICY tenant_fence ON sc_access_verify.customers;
DROP VIEW sc_access_verify.owner_names, sc_access_verify.invoker_names;
CREATE TABLE sc_access_private.support_scope(login_name name PRIMARY KEY,tenant_id int NOT NULL);
INSERT INTO sc_access_private.support_scope VALUES('shop_support',10);
GRANT SELECT ON sc_access_private.support_scope TO shop_lookup;
CREATE POLICY lookup_read ON sc_access_verify.customers FOR SELECT TO shop_lookup USING(true);
GRANT CREATE ON SCHEMA sc_access_verify TO shop_lookup;
RESET ROLE;
SET ROLE shop_lookup;
BEGIN;
CREATE FUNCTION sc_access_verify.customer_name(p_customer_id int) RETURNS TABLE(customer_id int,name text) LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog,sc_access_private,pg_temp AS $$ SELECT c.customer_id,c.name FROM sc_access_verify.customers c JOIN sc_access_private.support_scope s ON s.tenant_id=c.tenant_id WHERE s.login_name=session_user AND c.customer_id=p_customer_id $$;
REVOKE ALL ON FUNCTION sc_access_verify.customer_name(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION sc_access_verify.customer_name(int) TO shop_support;
COMMIT;
CREATE FUNCTION sc_access_verify.unsafe_name(p_customer_id int) RETURNS TABLE(customer_id int,name text) LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN QUERY SELECT c.customer_id,c.name FROM sc_access_verify.customers c JOIN support_scope s ON s.tenant_id=c.tenant_id WHERE s.login_name=session_user AND c.customer_id=p_customer_id; END $$;
REVOKE ALL ON FUNCTION sc_access_verify.unsafe_name(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION sc_access_verify.unsafe_name(int) TO shop_support;
RESET ROLE;
REVOKE CREATE ON SCHEMA sc_access_verify FROM shop_lookup;
SET ROLE shop_migrate;
REVOKE SELECT(tenant_id,customer_id,name) ON sc_access_verify.customers FROM shop_support;
RESET ROLE;
\connect :DBNAME shop_support
SELECT 'secure function Mina',* FROM sc_access_verify.customer_name(1);
SELECT 'secure function Rowan',* FROM sc_access_verify.customer_name(4);
DO $$ BEGIN
 IF (SELECT name FROM sc_access_verify.customer_name(1)) <> 'Mina Shah' THEN RAISE EXCEPTION 'Allowed function failed'; END IF;
 IF EXISTS(SELECT FROM sc_access_verify.customer_name(4)) THEN RAISE EXCEPTION 'Secure function leaked Rowan'; END IF;
 BEGIN PERFORM name FROM sc_access_verify.customers; RAISE EXCEPTION 'Raw support read still allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 END $$;
SET shop.tenant_id='20';
CREATE TEMP TABLE support_scope(login_name name,tenant_id int);
INSERT INTO support_scope VALUES('shop_support',20);
GRANT SELECT ON support_scope TO shop_lookup;
SELECT 'unsafe temp attack',* FROM sc_access_verify.unsafe_name(4);
DO $$ BEGIN
 IF (SELECT name FROM sc_access_verify.unsafe_name(4)) <> 'Rowan Vale' THEN RAISE EXCEPTION 'Unsafe temp counterexample failed'; END IF;
 IF EXISTS(SELECT FROM sc_access_verify.customer_name(4)) THEN RAISE EXCEPTION 'Secure temp protection failed'; END IF;
 BEGIN UPDATE sc_access_private.support_scope SET tenant_id=20; RAISE EXCEPTION 'Scope change allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 END $$;
\connect :DBNAME shop_outsider
DO $$ BEGIN BEGIN PERFORM * FROM sc_access_verify.customer_name(1); RAISE EXCEPTION 'PUBLIC execute left open'; EXCEPTION WHEN insufficient_privilege THEN NULL; END; END $$;
\connect :DBNAME shop_deploy
DO $$ BEGIN IF current_user <> 'shop_deploy' THEN RAISE EXCEPTION 'Wrong deploy login'; END IF; END $$;
SET ROLE shop_migrate;
SELECT 'NOINHERIT still SET',session_user,current_user;
CREATE TABLE sc_access_verify.before_default(x int);
ALTER DEFAULT PRIVILEGES FOR ROLE shop_migrate IN SCHEMA sc_access_verify GRANT SELECT ON TABLES TO shop_reader;
CREATE TABLE sc_access_verify.after_default(x int);
ALTER DEFAULT PRIVILEGES FOR ROLE shop_migrate REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
CREATE FUNCTION sc_access_verify.closed_default() RETURNS int LANGUAGE sql AS 'SELECT 1';
RESET ROLE;
\connect :DBNAME shop_runtime
DO $$ BEGIN
 BEGIN PERFORM * FROM sc_access_verify.before_default; RAISE EXCEPTION 'Defaults changed existing table'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 PERFORM * FROM sc_access_verify.after_default;
 BEGIN PERFORM sc_access_verify.closed_default(); RAISE EXCEPTION 'Default PUBLIC execute remained'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 END $$;
\connect :DBNAME :fixture_admin
SELECT 'final customers',* FROM sc_access_verify.customers ORDER BY customer_id;
SELECT 'final orders',* FROM sc_access_verify.orders ORDER BY order_id;
SELECT 'ALL ASSERTIONS PASSED' AS outcome;
-- Coordinator removes the entire disposable container/database after collecting output.
