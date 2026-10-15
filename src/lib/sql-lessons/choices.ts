import type { Tutorial } from '../sql-sandbox-tutorials';

export const choicesTutorials: Tutorial[] = [
  {
    id:'product-contract', title:'Turn a product assumption into an acceptance case',
    description:'Inspect rounding, a rejected quantity and the surviving records before carrying the same business rules to another engine.',
    articleHref:'/learn/databases/relational/product-comparison/#correctness',
    steps:[
      {title:'Define the intended stored values', instruction:'Run this setup first on the sandbox connection. A line must have a positive integer quantity and a finite nonnegative price stored to two decimal places. These are PostgreSQL declarations; this lesson does not execute other products. Reset and rerun this step to start again.',
       sql:`DROP TABLE IF EXISTS choice_lines;
CREATE TABLE choice_lines (
  line_id integer PRIMARY KEY,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(6,2) NOT NULL CHECK (unit_price >= 0 AND unit_price <> 'NaN'::numeric)
);`, expected:'The empty table is ready. Its declared scale describes the stored price; it does not promise to reject an input with extra decimal places.'},
      {title:'Inspect an accepted conversion', instruction:'PostgreSQL rounds numeric input to the column’s declared scale. Predict the stored price for 18.005, then the total for two items. This statement commits when the run ends.',
       sql:`INSERT INTO choice_lines (line_id, quantity, unit_price)
VALUES (1, 2, 18.005)
RETURNING quantity, unit_price, quantity * unit_price AS total;`, expected:'The stored price is 18.01 and the total is 36.02. If the business rule requires rejecting third-decimal input, the application needs validation before conversion. Successful storage is not proof that the original input met that rule.'},
      {title:'Send a forbidden quantity', instruction:'Run this update separately from the earlier insert. Predict whether zero can be stored and whether rejecting it will erase the already committed line.',
       sql:'UPDATE choice_lines SET quantity = 0 WHERE line_id = 1;', expected:'SQLSTATE 23514 rejects zero. This standalone statement rolls back; it does not undo the earlier insert.', expectedError:'23514'},
      {title:'Write down the contract you observed', instruction:'Verify the retained values. Then try updating unit_price to 18.004: predict the stored price and total before sending that variation. For another engine, reproduce these intended cases using its actual schema, driver and settings rather than assuming identical conversion or error codes.',
       sql:'SELECT line_id, quantity, unit_price, quantity * unit_price AS total FROM choice_lines ORDER BY line_id;', expected:'The default path retains quantity 2, price 18.01 and total 36.02. The 18.004 variation stores 18.00 and totals 36.00 in PostgreSQL. Reset returns to the beginning. The useful test records accepted inputs, stored values and rejected actions, not just whether SQL parses.'},
    ],
  },
  {
    id:'search-in-postgres', title:'Search product words inside PostgreSQL',
    description:'Turn titles into searchable terms, match a query, and see how a committed title change changes the answer.',
    articleHref:'/learn/databases/relational/adding-another-system/#native-search',
    steps:[
      {title:'Create three product titles', instruction:'Run this independent setup first. PostgreSQL generates searchable terms from each English title. The GIN index offers an access path for those terms. Three records let us reason about matching; they cannot establish search capacity or production ranking quality. Reset and rerun this step to repeat.',
       sql:`DROP TABLE IF EXISTS choice_products;
CREATE TABLE choice_products (
  product_id integer PRIMARY KEY,
  title text NOT NULL,
  terms tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED
);
INSERT INTO choice_products (product_id, title) VALUES
  (1,'Blue mugs'), (2,'Red mug'), (3,'Blue bowl');
CREATE INDEX choice_product_terms ON choice_products USING gin (terms);
SELECT product_id, title, terms FROM choice_products ORDER BY product_id;`, expected:'The first title produces terms blue and mug: the English configuration reduces mugs to mug. The other records contain red/mug and blue/bowl. Positions appear alongside the terms.'},
      {title:'Ask for both words', instruction:'Predict which titles contain both blue and mug after normalisation. plainto_tsquery converts the input words using the same English configuration; @@ tests the match.',
       sql:`SELECT product_id, title FROM choice_products
WHERE terms @@ plainto_tsquery('english', 'blue mug') ORDER BY product_id;`, expected:'Only product 1, Blue mugs, matches. It need not contain the literal substring “blue mug” in a particular spelling, but both normalised terms are required.'},
      {title:'Change the source title', instruction:'Rename product 1, then read its generated terms. The update commits at the end of this run. Predict which old search word will disappear. This is a change inside one database, not an asynchronous copying job.',
       sql:`UPDATE choice_products SET title='Blue ceramic cup' WHERE product_id=1;
SELECT product_id,title,terms FROM choice_products WHERE product_id=1;`, expected:'The terms now include blue, ceram and cup. The generated column and its index are maintained with the row change; mug is absent.'},
      {title:'Compare old and new searches', instruction:'The earlier change has committed. Predict the results of blue mug and blue cup before running these two queries. Afterwards change the matching query to “blu cup”. Only the spelling of blue has changed; predict whether language normalisation will correct it.',
       sql:`SELECT product_id,title FROM choice_products
WHERE terms @@ plainto_tsquery('english','blue mug') ORDER BY product_id;
SELECT product_id,title FROM choice_products
WHERE terms @@ plainto_tsquery('english','blue cup') ORDER BY product_id;`, expected:'The old blue mug search returns no rows; blue cup returns product 1. The typo variation also returns no rows. Matching a tiny fixture is a correctness observation, not proof that this search meets the product’s relevance or latency requirements.'},
    ],
  },
  {
    id:'copy-freshness', title:'Keep a search copy from bringing back an old product',
    description:'Observe a stale copy, apply a newer withdrawal and reject an older replay using per-product versions.',
    articleHref:'/learn/databases/relational/adding-another-system/#another-copy',
    steps:[
      {title:'Make the source and copy visible together', instruction:'Run this setup first. These two tables live in ONE database and model two states you can compare; no replica or network runs here. The copy is deliberately updated by later steps. Product 1 is active at version 1 in both. Reset and rerun this step to restore the starting state.',
       sql:`DROP TABLE IF EXISTS choice_copy, choice_source;
CREATE TABLE choice_source (product_id integer PRIMARY KEY, version integer NOT NULL, title text NOT NULL, active boolean NOT NULL);
CREATE TABLE choice_copy (product_id integer PRIMARY KEY, version integer NOT NULL, title text NOT NULL, active boolean NOT NULL);
INSERT INTO choice_source (product_id,version,title,active) VALUES (1,1,'Blue mug',true);
INSERT INTO choice_copy SELECT * FROM choice_source;
SELECT 'source' AS place,* FROM choice_source UNION ALL SELECT 'copy',* FROM choice_copy;`, expected:'Both show product 1/version 1/Blue mug/active true. The copy has its own values. Keeping them current requires an explicit update.'},
      {title:'Withdraw the product at the source', instruction:'A catalogue operation withdraws product 1 and advances its version. Predict what a search using only the copy will still return. The version identifies the order of this product’s changes, not a wall-clock time.',
       sql:`UPDATE choice_source SET active=false,version=2 WHERE product_id=1;
SELECT product_id,title,version FROM choice_copy WHERE active;`, expected:'The copy still offers Blue mug at version 1. The source change has committed, but the model has not applied it to the copy. A real pipeline has a corresponding interval before the destination applies an event.'},
      {title:'Recheck a candidate against the authority', instruction:'Suppose the application uses the copy to find a candidate, then checks whether that ID is still active at the source. Predict the result. This demonstrates an extra validation step, not an atomic query across independent services.',
       sql:`SELECT c.product_id,c.title FROM choice_copy AS c
JOIN choice_source AS s USING(product_id) WHERE c.active AND s.active;`, expected:'No row is returned because the source has withdrawn product 1. Rechecking can remove this stale positive, but cannot find new matches absent from the copy. Checkout must also enforce its own current stock and purchase rules.'},
      {title:'Apply the newer state', instruction:'Now act as the copy updater receiving product 1 at version 2. The conflict clause replaces a stored product only when the incoming version is newer. Predict the stored row and the active search result.',
       sql:`INSERT INTO choice_copy (product_id,version,title,active)
VALUES (1,2,'Blue mug',false)
ON CONFLICT(product_id) DO UPDATE SET version=EXCLUDED.version,title=EXCLUDED.title,active=EXCLUDED.active
WHERE EXCLUDED.version > choice_copy.version;
SELECT * FROM choice_copy;
SELECT product_id,title FROM choice_copy WHERE active;`, expected:'The copy retains version 2 with active false, and the active search returns no rows. Retaining that version is a tombstone-like record of withdrawal; physically removing it would erase the information used to reject an older replay.'},
      {title:'Replay an older event', instruction:'A delayed or retried version-1 event arrives. Predict whether it can overwrite the stored withdrawal. In a real destination, the version comparison and replacement must be one atomic operation; a separate read then write would permit a race.',
       sql:`INSERT INTO choice_copy (product_id,version,title,active)
VALUES (1,1,'Blue mug',true)
ON CONFLICT(product_id) DO UPDATE SET version=EXCLUDED.version,title=EXCLUDED.title,active=EXCLUDED.active
WHERE EXCLUDED.version > choice_copy.version;
SELECT * FROM choice_copy;`, expected:'Version 2 and active false remain. Repeating version 2 also leaves them unchanged. Try version 3/active true only if it represents an authorised newer restoration; versions cannot decide which business changes should be allowed. Reset and rerun step 1 to compare an unguarded updater.'},
    ],
  },
];
