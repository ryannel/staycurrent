-- CockroachDB25.4.17. New disposable cluster only.
-- Nodes must advertise eu-north,eu-west,us-east region localities.
-- Six local processes verified syntax/placement, not regional failures.
CREATE DATABASE locality_lab PRIMARY REGION "eu-north"
 REGIONS "eu-west", "us-east";
ALTER DATABASE locality_lab SURVIVE REGION FAILURE;
USE locality_lab;
CREATE TABLE shop_directory (
 shop_id INT PRIMARY KEY, name STRING NOT NULL, home_region STRING NOT NULL
) LOCALITY REGIONAL BY TABLE IN "eu-north";
INSERT INTO shop_directory VALUES
 (10,'Original shop','eu-north'),(20,'Harbour Tea','eu-west');
CREATE TABLE locality_orders (
 shop_id INT NOT NULL,order_id INT NOT NULL,
 customer_id INT NOT NULL,status STRING NOT NULL,
 PRIMARY KEY(shop_id,order_id),
 INDEX locality_orders_customer(shop_id,customer_id)
) LOCALITY REGIONAL BY ROW;
INSERT INTO locality_orders(crdb_region,shop_id,order_id,customer_id,status)
VALUES ('eu-north',10,101,1,'paid'),('eu-north',10,102,2,'paid'),
 ('eu-north',10,103,1,'pending');
-- Empty reference-table schema. No new business policy values are invented.
CREATE TABLE policy_reference (policy_id INT PRIMARY KEY,description STRING)
 LOCALITY GLOBAL;
SHOW REGIONS FROM CLUSTER;
SHOW REGIONS FROM DATABASE locality_lab;
SHOW CREATE DATABASE locality_lab;
SHOW TABLES;
SHOW CREATE TABLE locality_orders;
SELECT crdb_region,shop_id,order_id,customer_id,status FROM locality_orders
 ORDER BY shop_id,order_id;
SHOW PARTITIONS FROM TABLE locality_orders;
SHOW ZONE CONFIGURATIONS;
SHOW RANGES FROM TABLE locality_orders WITH DETAILS;
SHOW RANGES FROM TABLE shop_directory WITH DETAILS;
SHOW RANGES FROM TABLE policy_reference WITH DETAILS;
