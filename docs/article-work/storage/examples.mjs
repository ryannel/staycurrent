import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

// SQL and row-version verification only. This is not a durability or crash test.
const db = new PGlite();
try {
  const version = await db.query('SELECT version() AS version');
  await db.exec(`CREATE TABLE products (
    product_id text PRIMARY KEY,
    name text NOT NULL,
    current_price numeric(10,2) NOT NULL
  );
  INSERT INTO products (product_id, name, current_price)
  VALUES ('P3', 'Plate', 15.00), ('P7', 'Blue mug', 20.00), ('P9', 'Jug', 28.00);`);
  const read = () => db.query(`SELECT current_price::text, ctid::text
    FROM products WHERE product_id = 'P7'`);
  const before = (await read()).rows[0];
  assert.equal(before.current_price, '20.00');
  await db.exec(`BEGIN;
    UPDATE products SET current_price = 22.00 WHERE product_id = 'P7';
    COMMIT;`);
  const after = (await read()).rows[0];
  assert.equal(after.current_price, '22.00');
  assert.notEqual(after.ctid, before.ctid);
  await db.exec(`BEGIN;
    UPDATE products SET current_price = 24.00 WHERE product_id = 'P7';
    ROLLBACK;`);
  assert.equal((await read()).rows[0].current_price, '22.00');
  console.log(JSON.stringify({engine: version.rows[0].version, before, after,
    rollbackPrice:'22.00', scope:'SQL and visible row versions; no crash test'}, null, 2));
} finally {
  await db.close();
}
