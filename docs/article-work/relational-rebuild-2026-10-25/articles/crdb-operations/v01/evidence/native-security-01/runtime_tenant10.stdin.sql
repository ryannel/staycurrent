SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; SELECT customer_id, name FROM shop.customers ORDER BY customer_id; SELECT order_id, status FROM shop.orders ORDER BY order_id; COMMIT; SELECT count(*) AS after_commit FROM shop.customers;
