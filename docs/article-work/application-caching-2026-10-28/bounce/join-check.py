"""An owned, disposable SQLite fixture; verifies data, not animated latency."""
import sqlite3

db = sqlite3.connect(':memory:')
db.executescript('''
CREATE TABLE products(shop TEXT, id TEXT, locale TEXT, name TEXT);
CREATE TABLE prices(shop TEXT, product_id TEXT, currency TEXT, price_pence INT);
INSERT INTO products VALUES ('north','P7','en-GB','Blue mug');
INSERT INTO products VALUES ('south','P7','en-GB','Blue mug');
INSERT INTO prices VALUES ('north','P7','GBP',2000);
INSERT INTO prices VALUES ('south','P7','GBP',1800);
INSERT INTO prices VALUES ('north','P7','EUR',2400);
''')
query = '''SELECT p.id, p.name, r.price_pence, r.currency
FROM products AS p
JOIN prices AS r ON r.product_id = p.id AND r.shop = p.shop
WHERE p.shop = 'north' AND p.id = 'P7'
  AND p.locale = 'en-GB' AND r.currency = 'GBP' '''
assert db.execute(query).fetchall() == [('P7','Blue mug',2000,'GBP')]
# Without the shop part of the join, another shop's price leaks into the answer.
assert len(db.execute(query.replace(' AND r.shop = p.shop','')).fetchall()) == 2
print('SQLite', sqlite3.sqlite_version)
print(query.strip())
print(db.execute(query).fetchall())
print('Correct shop/currency result; omitted shop join counterexample confirmed.')
db.close()
