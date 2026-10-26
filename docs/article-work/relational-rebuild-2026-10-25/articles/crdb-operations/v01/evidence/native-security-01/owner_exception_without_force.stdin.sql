SET statement_timeout='20s';
BEGIN; ALTER TABLE shop.customers NO FORCE ROW LEVEL SECURITY; SET ROLE shop_migrate; SET LOCAL application_name = '10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; ROLLBACK;
