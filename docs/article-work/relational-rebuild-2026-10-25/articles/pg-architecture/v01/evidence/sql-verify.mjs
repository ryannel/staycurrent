import {PGlite} from '@electric-sql/pglite';
import {writeFile} from 'node:fs/promises';
const db=new PGlite();
const out={runtime:'@electric-sql/pglite 0.5.8; PostgreSQL 18.3 WASM',scope:'Ordinary SQL only. No multi-backend, native storage or concurrent-session claim.'};
try{
 await db.waitReady;out.version=(await db.query('SELECT version()')).rows;
 await db.exec(`CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);`);
 out.priceBefore=(await db.query(`SELECT price FROM products WHERE product_id='P7'`)).rows;
 out.physicalBefore=(await db.query(`SELECT product_id,price,ctid FROM products WHERE product_id='P7'`)).rows;
 await db.exec(`BEGIN; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;`);
 out.physicalAfter=(await db.query(`SELECT product_id,price,ctid FROM products WHERE product_id='P7'`)).rows;
 out.stocks=(await db.query('SELECT product_id,stock FROM products ORDER BY product_id')).rows;
 if(out.priceBefore[0].price!=='20.00'||out.physicalAfter[0].price!=='22.00')throw Error('Unexpected price');
 out.status='passed';
}finally{await db.close();out.closed=true;await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');}
console.log(JSON.stringify({status:out.status,closed:out.closed}));
