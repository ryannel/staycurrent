SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; UPDATE shop.orders SET customer_id = 4 WHERE order_id = 103; ROLLBACK;
