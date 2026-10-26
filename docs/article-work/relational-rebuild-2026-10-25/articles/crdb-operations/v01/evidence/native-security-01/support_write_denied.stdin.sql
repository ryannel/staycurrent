SET statement_timeout='20s';
UPDATE shop.orders SET status = 'cancelled' WHERE order_id = 103;
