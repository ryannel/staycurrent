SET statement_timeout='20s';
BEGIN; SET LOCAL application_name='10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; COMMIT; SELECT count(*) FROM shop.customers;
