SET statement_timeout='20s';
BEGIN; ALTER TABLE shop.customers DISABLE ROW LEVEL SECURITY; SET ROLE shop_runtime; SET LOCAL application_name = '10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; ROLLBACK;
