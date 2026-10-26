SET statement_timeout='20s';
BEGIN; SET LOCAL application_name='10'; SELECT customer_id FROM shop.support_customers ORDER BY customer_id; COMMIT; SELECT count(*) FROM shop.support_customers;
