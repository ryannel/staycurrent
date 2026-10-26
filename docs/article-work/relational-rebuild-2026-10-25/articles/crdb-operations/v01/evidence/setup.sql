-- Root must guard the exact owned UUID/database/fixture marker before this file.
CREATE ROLE shop_rw;
CREATE ROLE shop_view_owner;
CREATE ROLE shop_bypass WITH BYPASSRLS;
CREATE SCHEMA shop AUTHORIZATION shop_migrate;
REVOKE ALL ON SCHEMA shop FROM public;
GRANT USAGE ON SCHEMA shop TO shop_rw, shop_support, shop_view_owner, shop_bypass;
GRANT shop_rw TO shop_runtime;
SET ROLE shop_migrate;
CREATE TABLE shop.customers (
  customer_id INT PRIMARY KEY, tenant_id INT NOT NULL, name STRING NOT NULL,
  UNIQUE (tenant_id, customer_id)
);
CREATE TABLE shop.orders (
  order_id INT PRIMARY KEY, tenant_id INT NOT NULL, customer_id INT NOT NULL,
  placed_at TIMESTAMPTZ NOT NULL,
  status STRING NOT NULL CHECK (status IN ('pending','paid','cancelled')),
  FOREIGN KEY (tenant_id, customer_id) REFERENCES shop.customers (tenant_id, customer_id)
);
CREATE TABLE shop.payments (
  payment_id INT PRIMARY KEY, order_id INT NOT NULL REFERENCES shop.orders,
  amount DECIMAL(8,2) NOT NULL CHECK (amount > 0), method STRING NOT NULL
);
INSERT INTO shop.customers VALUES (1,10,'Mina Shah'),(2,10,'Tariq Aziz'),(3,10,'Edda Berg'),(4,20,'Rowan Vale');
INSERT INTO shop.orders VALUES
 (101,10,1,'2026-10-12 09:30:00+00','paid'),
 (102,10,2,'2026-10-14 16:05:00+00','paid'),
 (103,10,1,'2026-10-20 10:15:00+00','pending');
INSERT INTO shop.payments VALUES (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');
GRANT SELECT, UPDATE ON shop.customers, shop.orders TO shop_rw;
GRANT SELECT ON shop.customers, shop.orders TO shop_view_owner, shop_bypass;
ALTER TABLE shop.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop.customers FORCE ROW LEVEL SECURITY;
ALTER TABLE shop.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop.orders FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_rows ON shop.customers FOR ALL TO public
 USING (tenant_id::STRING = current_setting('application_name'))
 WITH CHECK (tenant_id::STRING = current_setting('application_name'));
CREATE POLICY tenant_rows ON shop.orders FOR ALL TO public
 USING (tenant_id::STRING = current_setting('application_name'))
 WITH CHECK (tenant_id::STRING = current_setting('application_name'));
RESET ROLE;
GRANT CREATE ON SCHEMA shop TO shop_view_owner;
SET ROLE shop_view_owner;
CREATE VIEW shop.support_customers AS SELECT tenant_id, customer_id, name FROM shop.customers;
CREATE VIEW shop.support_orders AS SELECT tenant_id, order_id, customer_id, status FROM shop.orders;
GRANT SELECT ON shop.support_customers, shop.support_orders TO shop_support;
RESET ROLE;
REVOKE CREATE ON SCHEMA shop FROM shop_view_owner;
