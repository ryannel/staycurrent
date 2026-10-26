SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; UPDATE shop.customers SET tenant_id = 20 WHERE customer_id = 3; ROLLBACK;
