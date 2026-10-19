CREATE TABLE customers(tenant TEXT,customer INTEGER,name TEXT,PRIMARY KEY(tenant,customer));
CREATE TABLE sessions(tenant TEXT,session TEXT,title TEXT,remaining INTEGER,PRIMARY KEY(tenant,session));
CREATE TABLE bookings(tenant TEXT,booking TEXT,customer INTEGER,session TEXT,PRIMARY KEY(tenant,booking));
INSERT INTO customers VALUES('t4',42,'Ada');
INSERT INTO sessions VALUES('t4','s7','Repair basics',2);
INSERT INTO bookings VALUES('t4','b17',42,'s7');
SELECT c.name,s.title FROM bookings AS b JOIN customers AS c ON c.tenant=b.tenant AND c.customer=b.customer JOIN sessions AS s ON s.tenant=b.tenant AND s.session=b.session WHERE b.tenant='t4' AND b.booking='b17';
