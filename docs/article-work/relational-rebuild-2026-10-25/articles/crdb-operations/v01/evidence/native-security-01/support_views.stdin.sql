SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; SELECT * FROM shop.support_customers ORDER BY customer_id; SELECT * FROM shop.support_orders ORDER BY order_id; COMMIT; SELECT count(*) AS after_commit FROM shop.support_customers;
