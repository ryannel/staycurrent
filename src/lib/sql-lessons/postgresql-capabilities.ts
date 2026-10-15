import type { Tutorial } from '../sql-sandbox-tutorials';

export const jsonCapabilitySql = {
 setup: `DROP TABLE IF EXISTS pg_cap_products, pg_cap_json_scale;
CREATE TABLE pg_cap_products (
  product_id integer PRIMARY KEY,
  name text NOT NULL,
  attributes jsonb NOT NULL CHECK (jsonb_typeof(attributes) = 'object')
);
INSERT INTO pg_cap_products (product_id, name, attributes) VALUES
 (1, 'Blue mug', '{"material":"ceramic","tags":["blue","sale"],"capacity_ml":350,"offers":[{"seller":"A","price":12},{"seller":"B","price":18}]}'),
 (2, 'Red mug', '{"material":"ceramic","tags":["red"],"capacity_ml":250,"offers":[{"seller":"A","price":18},{"seller":"B","price":12}]}'),
 (3, 'Blue flask', '{"material":"steel","tags":["blue"],"capacity_ml":500,"offers":[]}'),
 (4, 'Imported mug', '{"material":"ceramic","tags":["blue"],"capacity_ml":"350","offers":[]}');
CREATE TABLE pg_cap_json_scale AS
SELECT n AS product_id,
       jsonb_build_object('material', CASE WHEN n % 10 = 0 THEN 'ceramic' ELSE 'steel' END,
         'tags', jsonb_build_array(CASE WHEN n % 20 = 0 THEN 'blue' ELSE 'red' END),
         'capacity_ml', 100 + n % 500) AS attributes
FROM generate_series(1,10000) AS g(n);
ANALYZE pg_cap_json_scale;
SELECT product_id,name,attributes FROM pg_cap_products ORDER BY product_id;`,
 containment: `SELECT product_id,name FROM pg_cap_products
WHERE attributes @> '{"material":"ceramic","tags":["blue"]}'
ORDER BY product_id;`,
 correlated: `SELECT product_id,
       attributes @? '$.offers[*] ? (@.seller == "A")'
       AND attributes @? '$.offers[*] ? (@.price < 15)' AS separate_tests,
       attributes @? '$.offers[*] ? (@.seller == "A" && @.price < 15)' AS same_offer
FROM pg_cap_products WHERE product_id IN (1,2) ORDER BY product_id;`,
 rows: `SELECT p.product_id, offer.seller, offer.price
FROM pg_cap_products AS p,
     JSON_TABLE(p.attributes, '$.offers[*]'
       COLUMNS (seller text PATH '$.seller',
                price numeric PATH '$.price' ERROR ON ERROR)) AS offer
WHERE offer.seller = 'A' AND offer.price < 15
ORDER BY p.product_id;`,
 wholeIndex: `CREATE INDEX pg_cap_json_whole ON pg_cap_json_scale USING gin (attributes);
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id FROM pg_cap_json_scale
WHERE attributes->'tags' ? 'blue';`,
 targetedIndex: `CREATE INDEX pg_cap_json_tags ON pg_cap_json_scale USING gin ((attributes->'tags'));
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id FROM pg_cap_json_scale
WHERE attributes->'tags' ? 'blue';
SELECT count(*) AS blue_products FROM pg_cap_json_scale
WHERE attributes->'tags' ? 'blue';`,
 numeric: `SELECT product_id,
       CASE WHEN jsonb_typeof(attributes->'capacity_ml') = 'number'
            THEN (attributes->>'capacity_ml')::numeric END AS capacity
FROM pg_cap_products ORDER BY product_id;`,
 rangeIndex: `CREATE INDEX pg_cap_json_capacity ON pg_cap_json_scale
 ((CASE WHEN jsonb_typeof(attributes->'capacity_ml') = 'number'
        THEN (attributes->>'capacity_ml')::numeric END));
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT product_id FROM pg_cap_json_scale
WHERE (CASE WHEN jsonb_typeof(attributes->'capacity_ml') = 'number'
            THEN (attributes->>'capacity_ml')::numeric END) >= 590;`,
};

export const textCapabilitySql = {
 setup: `DROP TABLE IF EXISTS pg_cap_documents, pg_cap_text_scale;
CREATE TABLE pg_cap_documents (
 document_id integer PRIMARY KEY,
 tenant_id integer NOT NULL,
 published boolean NOT NULL,
 title text NOT NULL,
 body text NOT NULL,
 search tsvector GENERATED ALWAYS AS (
   setweight(to_tsvector('english', title), 'A') ||
   setweight(to_tsvector('english', body), 'D')
 ) STORED
);
INSERT INTO pg_cap_documents (document_id,tenant_id,published,title,body) VALUES
 (1,7,true,'Running shoes','Light shoes for running on roads.'),
 (2,7,true,'Trail guide','Running safely on wet trails.'),
 (3,7,false,'Shoe repair','Repair running shoes rather than replacing them.'),
 (4,8,true,'Running shoes','Private fitting notes.'),
 (5,7,true,'Road safety','Running on roads in wet weather.');
CREATE TABLE pg_cap_text_scale (
 document_id integer PRIMARY KEY,
 body text NOT NULL,
 search tsvector GENERATED ALWAYS AS (to_tsvector('english',body)) STORED
);
INSERT INTO pg_cap_text_scale(document_id,body)
SELECT n, CASE WHEN n%200=0 THEN 'running shoes' ELSE 'database maintenance' END
FROM generate_series(1,10000) AS g(n);
ANALYZE pg_cap_text_scale;
SELECT document_id,tenant_id,published,title,body FROM pg_cap_documents ORDER BY document_id;`,
 lexemes: `SELECT to_tsvector('english','Running on roads') AS words,
       websearch_to_tsquery('english','running roads') AS all_words,
       phraseto_tsquery('english','running roads') AS adjacent,
       phraseto_tsquery('english','running on roads') AS spaced;`,
 phrase: `SELECT document_id,
 search @@ websearch_to_tsquery('english','running roads') AS both_words,
 search @@ phraseto_tsquery('english','running roads') AS adjacent,
 search @@ phraseto_tsquery('english','running on roads') AS phrase_with_stopword
FROM pg_cap_documents WHERE document_id IN (1,5) ORDER BY document_id;`,
 ranked: `WITH q AS (SELECT websearch_to_tsquery('english','running') AS query)
SELECT d.document_id,d.title,ts_rank(d.search,q.query) AS rank
FROM pg_cap_documents AS d CROSS JOIN q
WHERE d.search @@ q.query AND d.tenant_id=7 AND d.published
ORDER BY rank DESC,d.document_id;`,
 eligible: `WITH q AS (SELECT websearch_to_tsquery('english','running shoes') AS query)
SELECT d.document_id,d.title
FROM pg_cap_documents AS d CROSS JOIN q
WHERE d.search @@ q.query AND d.tenant_id=7 AND d.published
ORDER BY d.document_id;`,
 update: `UPDATE pg_cap_documents SET title='Running shoes for trails' WHERE document_id=2
RETURNING document_id,title,search;`,
 index: `CREATE INDEX pg_cap_text_words ON pg_cap_text_scale USING gin(search);
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF)
SELECT document_id FROM pg_cap_text_scale
WHERE search @@ websearch_to_tsquery('english','running shoes');
SELECT count(*) AS matches FROM pg_cap_text_scale
WHERE search @@ websearch_to_tsquery('english','running shoes');`,
 typo: `SELECT websearch_to_tsquery('english','runnng shoes') AS query;
SELECT document_id,title FROM pg_cap_documents
WHERE search @@ websearch_to_tsquery('english','runnng shoes')
  AND tenant_id=7 AND published;`,
};

export const rangeCapabilitySql = {
 setup:`CREATE EXTENSION IF NOT EXISTS btree_gist;
DROP TABLE IF EXISTS pg_cap_assignment,pg_cap_authorisation,pg_cap_booking;
CREATE TABLE pg_cap_booking (
 booking_id integer PRIMARY KEY,
 room text NOT NULL,
 during tsrange NOT NULL CHECK (
   NOT isempty(during) AND lower(during) IS NOT NULL AND upper(during) IS NOT NULL
    AND isfinite(lower(during)) AND isfinite(upper(during))
 ),
 EXCLUDE USING gist (room WITH =, during WITH &&)
);
INSERT INTO pg_cap_booking(booking_id,room,during)
VALUES(1,'Cedar','[2026-10-15 10:00,2026-10-15 11:00)');
CREATE TABLE pg_cap_authorisation (
 worker_id integer NOT NULL,
 valid_at daterange NOT NULL,
 PRIMARY KEY(worker_id,valid_at WITHOUT OVERLAPS)
);
CREATE TABLE pg_cap_assignment (
 assignment_id integer PRIMARY KEY,
 worker_id integer NOT NULL,
 during daterange NOT NULL,
 FOREIGN KEY(worker_id,PERIOD during)
 REFERENCES pg_cap_authorisation(worker_id,PERIOD valid_at)
);
INSERT INTO pg_cap_authorisation(worker_id,valid_at)
VALUES(7,'[2026-10-01,2026-10-16)'),(7,'[2026-10-16,2026-11-01)');
SELECT booking_id,room,during FROM pg_cap_booking;
SELECT worker_id,valid_at FROM pg_cap_authorisation ORDER BY valid_at;`,
 adjacent:`INSERT INTO pg_cap_booking(booking_id,room,during)
VALUES(2,'Cedar','[2026-10-15 11:00,2026-10-15 12:00)')
RETURNING booking_id,room,during;`,
 overlap:`INSERT INTO pg_cap_booking(booking_id,room,during)
VALUES(3,'Cedar','[2026-10-15 10:30,2026-10-15 11:30)');`,
 otherRoom:`INSERT INTO pg_cap_booking(booking_id,room,during)
VALUES(3,'Birch','[2026-10-15 10:30,2026-10-15 11:30)')
RETURNING booking_id,room,during;`,
 covered:`INSERT INTO pg_cap_assignment(assignment_id,worker_id,during)
VALUES(1,7,'[2026-10-10,2026-10-20)')
RETURNING assignment_id,worker_id,during;`,
 deletion:`DELETE FROM pg_cap_authorisation
WHERE worker_id=7 AND lower(valid_at)=DATE '2026-10-16';`,
 gap:`DELETE FROM pg_cap_assignment WHERE assignment_id=1;
UPDATE pg_cap_authorisation SET valid_at='[2026-10-17,2026-11-01)'
WHERE worker_id=7 AND lower(valid_at)=DATE '2026-10-16';
SELECT worker_id,valid_at FROM pg_cap_authorisation ORDER BY valid_at;`,
 repair:`UPDATE pg_cap_authorisation SET valid_at='[2026-10-16,2026-11-01)'
WHERE worker_id=7 AND lower(valid_at)=DATE '2026-10-17';
INSERT INTO pg_cap_assignment(assignment_id,worker_id,during)
VALUES(1,7,'[2026-10-10,2026-10-20)');
SELECT assignment_id,worker_id,during FROM pg_cap_assignment;`,
};

export const postgresqlCapabilityTutorials: Tutorial[] = [
 {
  id: 'pg-json-queries', title: 'JSON predicates and their indexes',
  description: 'Match an object, keep conditions on the same array member, and index the expression that the query actually searches.',
  articleHref: '/learn/databases/relational/postgresql/json/',
  steps: [
   {title:'Create four readable objects and an index fixture',instruction:'Run this independent setup first. It replaces only pg_cap_products and pg_cap_json_scale. Products 1 and 2 offer the same two prices from different sellers; product 4 deliberately stores capacity as text. The separate 10,000-row fixture has a blue tag every twentieth row. Restart this setup to undo any experiment.',sql:jsonCapabilitySql.setup,expected:'Four products. Product 1 has A/12 and B/18; product 2 has A/18 and B/12. The large fixture contains 500 blue products.'},
   {title:'Match structure',instruction:'Predict which objects contain both ceramic material and a blue tag. The string capacity on product 4 is irrelevant to this predicate. As a variation, replace blue with red, then return to blue.',sql:jsonCapabilitySql.containment,expected:'Products 1 and 4. With red instead, only product 2. Containment follows the requested structure, not whole-object equality.'},
   {title:'Keep conditions on the same offer',instruction:'We want seller A to offer a price below 15. Compare two independent existence tests with one filter applied to each offer. Before running, decide whether product 2 should qualify.',sql:jsonCapabilitySql.correlated,expected:'Product 1: true/true. Product 2: true/false. Product 2 has an A offer and a cheap offer, but they are different offers. Change 15 to 20 in both expressions to make both same_offer values true.'},
   {title:'Turn offers into query rows',instruction:'JSON_TABLE emits one query row per offer. The WHERE clause now compares seller and price on that same row. Products with empty offers emit no offer rows here. This does not create a stored offers table.',sql:jsonCapabilitySql.rows,expected:'One row: product_id 1, seller A, price 12. Remove the WHERE clause to inspect all four offers and their parent identities.'},
   {title:'Try an index on the containing object',instruction:'Run once after setup. The query searches attributes->tags, while this GIN indexes attributes. Inspect the scan node and rows removed. Index eligibility depends on the indexed expression as well as the operator.',sql:jsonCapabilitySql.wholeIndex,expected:'The checked plan is a sequential scan: 500 matches and 9,500 rows removed. This whole-object index does not directly index the tags expression used by the ? operator.'},
   {title:'Index the searched expression',instruction:'Run once, then compare the same query and answer. The new GIN extracts entries from the tags array. Edit blue to red afterwards and see whether the planner still chooses the index when almost every row matches.',sql:jsonCapabilitySql.targetedIndex,expected:'The checked blue plan uses pg_cap_json_tags and returns 500 rows. Red returns 9,500; its plan may favour a scan. The answer set follows the predicate regardless of the chosen access path.'},
   {title:'Give numeric extraction a policy',instruction:'Predict the capacity of product 4. CASE casts only JSON numbers, leaving other types as SQL NULL. This is a permissive read policy, not rejection of invalid incoming data.',sql:jsonCapabilitySql.numeric,expected:'Capacities are 350,250,500,NULL for products 1–4. Change product 4’s JSON value to numeric 350 using jsonb_set, rerun, and observe the changed extraction. Setup resets it.'},
   {title:'Index a numeric range',instruction:'Run once to index that same guarded expression on the large fixture. The ten values 590–599 occur twenty times each. Try >= 100 afterwards to change selectivity. Reset setup to remove every index and restore the original objects.',sql:jsonCapabilitySql.rangeIndex,expected:'The checked selective plan uses pg_cap_json_capacity and emits 200 rows. An expression B-tree supplies numeric ordering; the document GIN is not an ordered capacity index.'},
  ],
 },
 {
  id:'pg-text-search',title:'Words, positions and ranked search',
  description:'See what text search stores, distinguish a phrase from word membership, and keep search results inside application filters.',
  articleHref:'/learn/databases/relational/postgresql/full-text-search/',
  steps:[
   {title:'Create a small document collection',instruction:'Run this independent setup first. Documents 1,2,3,5 belong to tenant 7; document 3 is unpublished. Document 4 belongs to tenant 8. A separate 10,000-document fixture has running shoes once every 200 rows. Restart setup to reset all edits and indexes.',sql:textCapabilitySql.setup,expected:'Five readable documents. The generated search column is maintained from each title/body, with title weight A and body weight D. The separate index fixture has 50 matching documents.'},
   {title:'Inspect words and positions',instruction:'Predict what happens to Running, on and roads. Compare an all-words query, an adjacent phrase and a phrase that contains the stop word on. Positions retain a gap even though on is omitted.',sql:textCapabilitySql.lexemes,expected:"The vector is 'road':3 'run':1. Queries are 'run' & 'road', 'run' <-> 'road', and 'run' <2> 'road'. Words are normalised and stop words leave position gaps."},
   {title:'Test the phrase rather than just its words',instruction:'Both documents contain Running on roads in the body. Predict whether the two surviving lexemes count as adjacent. Edit the input phrases to test another ordering.',sql:textCapabilitySql.phrase,expected:'Both rows have true,false,true. Membership permits the gap; the adjacent phrase does not; the phrase with on expects a two-position distance.'},
   {title:'Rank eligible documents',instruction:'The application has established tenant 7 and only publishes public documents. Query running. Compare the title occurrence in document 1 with body-only occurrences in 2 and 5; the ID settles equal ranks.',sql:textCapabilitySql.ranked,expected:'Document 1 ranks first. Documents 2 and 5 follow with equal lower scores in the checked run. Unpublished document 3 and other-tenant document 4 are excluded. Rank is a sorting signal, not a probability.'},
   {title:'Require both words',instruction:'Now require running and shoes using the same ownership/publication filters. Before running, inspect which eligible documents have both normalised words.',sql:textCapabilitySql.eligible,expected:'Only document 1. Removing the application filters would also expose documents 3 and 4; a relevance score is not an access-control decision.'},
   {title:'Edit a source field',instruction:'Rename document 2 and inspect its returned search vector. In the next run, repeat the previous query. The stored generated column updates as part of this row change; no separate worker is involved.',sql:textCapabilitySql.update,expected:'Document 2 now contains shoe as well as run. Repeating step 5 returns documents 1 and 2. Restart setup to undo this edit.'},
   {title:'Find candidates through GIN',instruction:'Run once on the separate larger fixture. Find the Bitmap Index Scan and its heap parent. The query has 50 matching IDs: 200,400,...,10000. This plan demonstrates access, not relevance quality or a server benchmark.',sql:textCapabilitySql.index,expected:'The checked plan uses pg_cap_text_words; the count is 50. GIN finds word candidates. Adding ORDER BY a rank expression still requires computing and ordering the qualifying scores.'},
   {title:'Misspell a query',instruction:'Predict the effect of omitting the i from running. This parser accepts the text but does not infer the intended spelling. Replace runnng with running and rerun; then reset setup when finished.',sql:textCapabilitySql.typo,expected:"The query contains 'runnng' & 'shoe' and matches no document. Correct spelling returns documents 1 and 2 after the edit. Trigram similarity is a separate possible facility, not what this lexical query just did."},
  ],
 },
 {
  id:'pg-vector-filter',title:'Distance and the eligible neighbours',
  description:'Calculate exact distances for four synthetic points and see why filtering a small candidate list differs from finding neighbours inside the eligible set.',
  articleHref:'/learn/databases/relational/postgresql/vector-search/',
  steps:[
   {title:'Create four points',instruction:'Run this independent setup first. The x,y,z columns model three coordinates; this is ordinary exact SQL arithmetic, not pgvector or an approximate index. The article provides a separate executed pgvector server experiment. Restart setup to reset the points.',sql:`DROP TABLE IF EXISTS pg_cap_points;
CREATE TABLE pg_cap_points(id integer PRIMARY KEY,tenant integer NOT NULL,x numeric,y numeric,z numeric);
INSERT INTO pg_cap_points(id,tenant,x,y,z) VALUES
(1,7,1,0,0),(2,8,0.9,0.1,0),(3,7,0.8,0.2,0),(4,7,0,1,0);
SELECT * FROM pg_cap_points ORDER BY id;`,expected:'The query point is (1,0,0). Point 1 is identical; point 2 is nearby but belongs to tenant 8; point 3 is the next tenant-7 neighbour.'},
   {title:'Find the closest eligible two',instruction:'The distance is the square root of summed squared coordinate differences. Filter to tenant 7 before the top-two selection, then calculate the answer. IDs settle equal distances.',sql:`SELECT id,sqrt((x-1)^2+y^2+z^2) AS distance
FROM pg_cap_points WHERE tenant=7 ORDER BY distance,id LIMIT 2;`,expected:'IDs 1 and 3, at distances 0 and about 0.282843. Point 2 would be nearer than 3 but is ineligible.'},
   {title:'Filter an already limited candidate list',instruction:'This time take the nearest two across all tenants, then filter that list. Predict whether two eligible rows remain. This models candidate starvation, not HNSW’s graph algorithm.',sql:`WITH candidates AS MATERIALIZED (
 SELECT id,tenant,sqrt((x-1)^2+y^2+z^2) AS distance
 FROM pg_cap_points ORDER BY distance,id LIMIT 2
)
SELECT id,distance FROM candidates WHERE tenant=7 ORDER BY distance,id;`,expected:'Only ID 1 remains. ID 2 occupied the other candidate slot and is then removed. LIMIT 2 does not refill a list after an outer filter.'},
   {title:'Widen the candidates and vary ownership',instruction:'The nearest three now include IDs 1,2,3. After filtering, compare with the exact eligible answer. Then change point 3 to tenant 8 and predict both queries again; the closest second eligible row becomes point 4, outside this candidate list. Reset setup to restore the original.',sql:`WITH candidates AS MATERIALIZED (
 SELECT id,tenant,sqrt((x-1)^2+y^2+z^2) AS distance
 FROM pg_cap_points ORDER BY distance,id LIMIT 3
)
SELECT id,distance FROM candidates WHERE tenant=7 ORDER BY distance,id LIMIT 2;`,expected:'Initially IDs 1 and 3. After changing point 3’s tenant, this list has only ID 1 while the exact eligible query returns 1 and 4. A larger candidate budget helps only if it reaches enough eligible neighbours.'},
  ],
 },
 {
  id:'pg-range-rules',title:'Overlapping bookings and covered periods',
  description:'Use PostgreSQL ranges and GiST-backed constraints to reject overlapping ownership, then distinguish overlap from full-period coverage.',
  articleHref:'/learn/databases/relational/postgresql/extensions/',
  steps:[
   {title:'Create room and authorisation tables',instruction:'Run this independent setup first. It enables the bundled btree_gist extension and recreates only the pg_cap practice tables. Venue times use one local schedule on 15 October; ranges include the start and exclude the end. Worker 7 has adjacent authorisations covering all October. Reset by rerunning setup.',sql:rangeCapabilitySql.setup,expected:'Cedar is booked 10:00–11:00. Worker 7 has [Oct1,Oct16) and [Oct16,Nov1). Range values carry endpoint meaning, not just two unrelated timestamps.'},
   {title:'Accept an adjacent booking',instruction:'Predict whether a booking starting at exactly 11:00 overlaps the one ending then. Run once. PostgreSQL checks both equal room and overlapping range.',sql:rangeCapabilitySql.adjacent,expected:'Booking 2 is accepted. The first booking excludes 11:00 and the second includes it, so they share no instant.'},
   {title:'Reject an overlap in the same room',instruction:'This deliberately attempts a 10:30–11:30 booking in Cedar. It overlaps both existing bookings. Run it as its own editor submission; the rejection does not remove the earlier accepted bookings.',sql:rangeCapabilitySql.overlap,expectedError:'23P01',expected:'Exclusion-constraint error 23P01. Booking 3 was not inserted. The application should report unavailable time, rather than continue as though it acquired the room.'},
   {title:'Use another room',instruction:'Retry the requested time in Birch using the same unused booking ID. The time overlaps, but the equality comparison on room is false.',sql:rangeCapabilitySql.otherRoom,expected:'Booking 3 is accepted in Birch. The exclusion rule rejects a pair only when both the room equality and time overlap comparisons are true.'},
   {title:'Cover one assignment with two records',instruction:'Worker 7 is assigned Oct10 through Oct19, represented by [Oct10,Oct20). Neither authorisation row covers it alone. Predict whether their continuous combined coverage is sufficient for the PERIOD foreign key.',sql:rangeCapabilitySql.covered,expected:'Assignment 1 is accepted: the first authorisation covers Oct10–15 and the second Oct16–19. The entire referenced period is covered.'},
   {title:'Protect coverage when a parent changes',instruction:'Try to remove the second authorisation while the assignment exists. This is a deliberate failure in a separate run. The database checks the relationship on parent changes too.',sql:rangeCapabilitySql.deletion,expectedError:'23503',expected:'Foreign-key error 23503. The authorisation remains; deleting it would leave part of the assignment uncovered.'},
   {title:'Create a real one-day gap',instruction:'First remove the practice assignment, then move the second authorisation’s start to Oct17. This run finishes before the next attempted assignment, so the changed permissions persist even when that next insert fails.',sql:rangeCapabilitySql.gap,expected:'Authorisations now cover [Oct1,Oct16) and [Oct17,Nov1). The full day Oct16 is uncovered.'},
   {title:'Reject partial coverage',instruction:'Retry the earlier assignment across the gap. Both authorisation rows overlap portions of it; decide whether that is enough.',sql:rangeCapabilitySql.covered,expectedError:'23503',expected:'Foreign-key error 23503. Some overlap is insufficient: the referenced periods must cover the assignment’s whole duration.'},
   {title:'Restore coverage and finish',instruction:'Close the gap, then insert the assignment. As a variation after reset, make the assignment [Oct10,Oct16); it fits entirely within the first authorisation, so removing the second no longer breaks it. Restart setup before repeating single-use inserts.',sql:rangeCapabilitySql.repair,expected:'Assignment 1 is accepted again. The rule checks valid-time coverage; it did not create an audit history of the earlier edits.'},
  ],
 },
];