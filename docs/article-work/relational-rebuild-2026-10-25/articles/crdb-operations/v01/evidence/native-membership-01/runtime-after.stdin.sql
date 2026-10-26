SET statement_timeout='20s';
BEGIN; SET LOCAL application_name='10'; SELECT order_id,status FROM shop.orders ORDER BY order_id; COMMIT;
