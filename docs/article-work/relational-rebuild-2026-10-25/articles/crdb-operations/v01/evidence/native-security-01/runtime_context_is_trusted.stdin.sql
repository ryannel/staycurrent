SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '20'; SELECT customer_id, name FROM shop.customers; ROLLBACK;
