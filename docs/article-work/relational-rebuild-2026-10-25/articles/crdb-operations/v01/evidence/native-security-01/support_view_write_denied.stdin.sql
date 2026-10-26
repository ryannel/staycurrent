SET statement_timeout='20s';
UPDATE shop.support_orders SET status = 'cancelled' WHERE order_id = 103;
