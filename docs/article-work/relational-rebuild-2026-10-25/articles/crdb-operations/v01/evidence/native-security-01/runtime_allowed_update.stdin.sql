SET statement_timeout='20s';
BEGIN; SET LOCAL application_name = '10'; UPDATE shop.orders SET status = 'pending' WHERE order_id = 103 RETURNING order_id,status; ROLLBACK;
