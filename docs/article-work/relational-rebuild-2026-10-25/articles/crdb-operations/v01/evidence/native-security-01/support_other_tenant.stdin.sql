SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; SELECT * FROM shop.support_customers WHERE customer_id = 4; ROLLBACK;
