SET statement_timeout='20s';
BEGIN; SET ROLE shop_bypass; SET LOCAL application_name = '10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; ROLLBACK;
