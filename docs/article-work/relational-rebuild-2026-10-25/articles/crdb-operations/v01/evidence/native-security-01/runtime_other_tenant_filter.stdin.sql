SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; SELECT customer_id, name FROM shop.customers WHERE tenant_id = 20 OR customer_id = 4; ROLLBACK; SELECT count(*) AS after_rollback FROM shop.customers;
