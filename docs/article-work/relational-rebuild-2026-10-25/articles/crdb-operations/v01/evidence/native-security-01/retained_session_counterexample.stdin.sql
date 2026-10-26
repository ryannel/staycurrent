SET statement_timeout='20s';
SET application_name = '20'; BEGIN; SET LOCAL application_name = '10'; SELECT customer_id FROM shop.customers ORDER BY customer_id; COMMIT; SELECT customer_id FROM shop.customers; RESET application_name;
