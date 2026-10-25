import fs from 'node:fs/promises';
export const source=await fs.readFile(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
export const snippet=name=>source.match(new RegExp(`const ${name} = \x60([\\s\\S]*?)\x60;`))[1];
export const payload={items:[{product_id:'P3',quantity:2,unit_price:'4.50'},{product_id:'P7',quantity:1,unit_price:'20.00'}]};
export const accepted={outcome:'accepted',order_id:103,status_at_creation:'pending',total:'29.00'};
export const refused={outcome:'refused',reason:'insufficient_stock'};
export const setup=`CREATE TABLE customers(customer_id integer PRIMARY KEY); INSERT INTO customers VALUES(1);
CREATE TABLE products(product_id text PRIMARY KEY,stock integer NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES('P3',12),('P7',1),('P9',4);
CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer REFERENCES customers,placed_at timestamptz,status text);
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text REFERENCES products,quantity integer CHECK(quantity>0),unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer REFERENCES orders,amount numeric(8,2));`;
export const reset=`TRUNCATE purchase_requests,order_items,payments,orders; UPDATE products SET stock=CASE product_id WHEN 'P3' THEN 12 WHEN 'P7' THEN 1 ELSE 4 END;`;
export const begin=snippet('claim').split('\n\n')[0];
export const insert=snippet('claim').split('\n\n')[1];
export async function purchase(db) {
  await db.query('SAVEPOINT purchase_work');
  const sql=snippet('guard').replace('SAVEPOINT purchase_work;','').trim().split(/;\s*/).filter(Boolean);
  for(const statement of sql) {
    const r=await db.query(statement);
    if(!r.rows.length) {
      await db.query('ROLLBACK TO SAVEPOINT purchase_work');
      await db.query('UPDATE purchase_requests SET result=$1::jsonb WHERE customer_id=1 AND request_key=\'purchase-103\'',[JSON.stringify(refused)]);
      return refused;
    }
  }
  await db.query(`INSERT INTO orders VALUES(103,1,'2026-10-20 10:15+00','pending')`);
  await db.query(`INSERT INTO order_items VALUES(103,1,'P7',1,20),(103,2,'P3',2,4.50)`);
  await db.query(snippet('finish').split('\n\n')[0]);
  return accepted;
}
export async function attempt(db,p=payload,doCommit=true) {
  await db.query(begin);
  const r=await db.query(insert,[JSON.stringify(p)]);
  if(!r.rows.length) {
    const receipt=(await db.query(snippet('recover'))).rows[0];
    if(!(await db.query('SELECT $1::jsonb = $2::jsonb AS matches',[JSON.stringify(receipt.payload),JSON.stringify(p)])).rows[0].matches) {await db.query('ROLLBACK');return {outcome:'mismatch'};}
    await db.query('COMMIT');return receipt.result;
  }
  const result=await purchase(db);
  await db.query(doCommit?'COMMIT':'ROLLBACK');return result;
}
export async function state(db) {
  return {stock:(await db.query('SELECT * FROM products ORDER BY product_id')).rows,
    orders:(await db.query('SELECT order_id,status FROM orders')).rows,
    lines:(await db.query('SELECT order_id,line_no,product_id,quantity,unit_price FROM order_items ORDER BY line_no')).rows,
    receipts:(await db.query('SELECT customer_id,request_key,payload,result FROM purchase_requests')).rows,
    payments:(await db.query('SELECT * FROM payments')).rows};
}
