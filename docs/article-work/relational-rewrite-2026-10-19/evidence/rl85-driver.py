import sqlite3

con = sqlite3.connect(":memory:")
con.executescript("""
CREATE TABLE orders (
  tenant_id TEXT NOT NULL, order_id TEXT NOT NULL,
  customer_id INTEGER NOT NULL,
  PRIMARY KEY (tenant_id, order_id)
);
CREATE TABLE lines (
  tenant_id TEXT NOT NULL, order_id TEXT NOT NULL,
  line_no INTEGER NOT NULL, description TEXT NOT NULL,
  PRIMARY KEY (tenant_id, order_id, line_no)
);
INSERT INTO orders VALUES ('t4','o81',42),('t4','o82',42);
INSERT INTO lines VALUES
 ('t4','o81',1,'Workshop seat'),('t4','o81',2,'Workbook');
""")
malicious_id = "o81' OR 1=1 --"
rows = con.execute(
    "SELECT order_id FROM orders WHERE tenant_id = ? AND order_id = ?",
    ("t4", malicious_id),
).fetchall()
print(rows)


parents = con.execute(
    "SELECT order_id FROM orders WHERE tenant_id = ? AND customer_id = ? "
    "ORDER BY order_id LIMIT 20", ("t4", 42)
).fetchall()
by_order = {order_id: [] for (order_id,) in parents}
if by_order:
    placeholders = ",".join("?" for _ in by_order)
    children = con.execute(
        "SELECT order_id, line_no, description FROM lines "
        f"WHERE tenant_id = ? AND order_id IN ({placeholders}) "
        "ORDER BY order_id, line_no", ("t4", *by_order)
    ).fetchall()
    for order_id, line_no, description in children:
        by_order[order_id].append((line_no, description))
print(by_order)

con.close()
