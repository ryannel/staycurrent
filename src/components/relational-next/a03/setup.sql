-- Disposable exercise database only. Each reset removes this exercise's rows.
DROP TABLE IF EXISTS reservations, places, staff;
CREATE TABLE places (
  place_id integer PRIMARY KEY,
  capacity integer NOT NULL CHECK (capacity >= 0),
  remaining integer NOT NULL CHECK (remaining BETWEEN 0 AND capacity)
);
CREATE TABLE reservations (
  request_id text PRIMARY KEY,
  place_id integer NOT NULL REFERENCES places,
  owner_id integer NOT NULL,
  UNIQUE (place_id, owner_id)
);
CREATE TABLE staff (
  name text PRIMARY KEY,
  available boolean NOT NULL
);
INSERT INTO places VALUES (21, 1, 1), (22, 1, 1);
INSERT INTO staff VALUES ('Mina', true), ('Tariq', true);
