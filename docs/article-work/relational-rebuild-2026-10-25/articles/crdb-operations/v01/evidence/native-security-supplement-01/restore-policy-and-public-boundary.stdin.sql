SET statement_timeout='20s';
ALTER TABLE shop.customers ENABLE ROW LEVEL SECURITY; ALTER TABLE shop.customers FORCE ROW LEVEL SECURITY; DROP TABLE IF EXISTS shop.allowed_migration; REVOKE CREATE ON SCHEMA public FROM public; SHOW CREATE TABLE shop.customers; SHOW GRANTS ON SCHEMA public;
