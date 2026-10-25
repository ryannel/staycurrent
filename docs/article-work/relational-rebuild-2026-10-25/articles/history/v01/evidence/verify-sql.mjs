import { PGlite } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { schemaSql, rowsSql, currentQuery, earlierQuery, answer, instants, records } from '../src/components/relational-rebuild-history/model.mjs';

await mkdir(new URL('../public/relational-rebuild/history/', import.meta.url), { recursive: true });
const download = new URL('../public/relational-rebuild/history/price-history.sql', import.meta.url);
const text = `-- History, correction and deletion: illustrative P7 assertions.
-- PostgreSQL 18; btree_gist must be available and its creation permitted.
-- Everything created here is rolled back at the end.
-- Run in a disposable database. All instants are UTC.
-- This installs the final history, not a correction service.
BEGIN;
SET LOCAL TIME ZONE 'UTC';
${schemaSql}

${rowsSql}

${currentQuery}

${earlierQuery}

-- Without recorded time, two accounts match the same business instant.
SELECT assertion_id, price FROM price_history
WHERE product_id = 'P7'
  AND effective_during @> timestamptz '2026-10-21 12:00+00'
ORDER BY assertion_id;
-- 1 | 20.00
-- 4 | 22.00
ROLLBACK;
`;
await writeFile(download, text);
const db = new PGlite({ extensions: { btree_gist } });
const result = { checkedAt: new Date().toISOString(), runtime: 'PGlite 0.5.8 (owned in-memory instance)', checks: [] };
try {
  result.version = (await db.query('SELECT version()')).rows;
  const downloaded = await readFile(download, 'utf8');
  const run = await db.exec(downloaded);
  assert.equal(run.at(-2).rows.length, 2);
  result.downloadResults = run.filter(r => r.rows?.length).map(r => r.rows);
  await db.exec(`SET TIME ZONE 'UTC'; ${schemaSql} ${rowsSql}`);
  for (const effective of instants) for (const recorded of records) {
    const observed = (await db.query('SELECT assertion_id, price FROM price_history WHERE product_id = $1 AND effective_during @> $2::timestamptz AND recorded_during @> $3::timestamptz', ['P7',effective.value,recorded.value])).rows;
    const expected = answer(effective.value, recorded.value).map(r => ({ assertion_id:r.id, price:r.price }));
    assert.deepEqual(observed, expected);
    result.checks.push({ effective: effective.value, recorded:recorded.value, observed });
  }
  const beforeRecorded = await db.query("SELECT assertion_id FROM price_history WHERE recorded_during @> timestamptz '2026-10-21 11:00+00'");
  assert.equal(beforeRecorded.rows.length, 0);
  result.checks.push({ outsideRecordingCoverage:beforeRecorded.rows });
  const future = await db.query("SELECT assertion_id,price FROM price_history WHERE upper_inf(effective_during) AND recorded_during @> timestamptz '2026-10-21 12:00+00'");
  assert.deepEqual(future.rows,[{assertion_id:2,price:'22.00'}]);
  result.checks.push({ openEffectiveEndSelectsFutureVersion:future.rows, actualPriceAtThatInstant:'20.00 (A1)' });
  const overlap = "INSERT INTO price_history VALUES (5,'P7',21.00,tstzrange('2026-10-21 00:00+00','2026-10-23 00:00+00','[)'),tstzrange('2026-10-24 09:00+00',NULL,'[)'))";
  try { await db.exec(overlap); assert.fail('Overlap accepted'); } catch(e) { assert.equal(e.code, '23P01'); result.checks.push({ overlapRejected:e.code }); }
  await db.exec('CREATE TEMP TABLE unprotected (LIKE price_history INCLUDING DEFAULTS);');
  await db.exec('INSERT INTO unprotected SELECT * FROM price_history;');
  await db.exec(overlap.replace('price_history', 'unprotected'));
  const ambiguous = await db.query("SELECT assertion_id,price FROM unprotected WHERE effective_during @> timestamptz '2026-10-21 12:00+00' AND recorded_during @> timestamptz '2026-10-24 09:00+00' ORDER BY assertion_id");
  assert.equal(ambiguous.rows.length,2);
  result.checks.push({ withoutExclusionConflictingPrices:ambiguous.rows });
  await db.exec("CREATE TEMP TABLE gap_price (id integer, during tstzrange NOT NULL, EXCLUDE USING gist (during WITH &&)); INSERT INTO gap_price VALUES (1,tstzrange(NULL,'2026-10-21 00:00+00','[)')),(2,tstzrange('2026-10-22 00:00+00',NULL,'[)'));");
  const gap = await db.query("SELECT id FROM gap_price WHERE during @> timestamptz '2026-10-21 12:00+00'");
  assert.equal(gap.rows.length,0);
  result.checks.push({ nonOverlapDoesNotPreventGap:gap.rows });
  const boundary = await db.query("SELECT tstzrange(NULL,'2026-10-22 00:00+00','[]') @> timestamptz '2026-10-22 00:00+00' AS old_matches, tstzrange('2026-10-22 00:00+00',NULL,'[)') @> timestamptz '2026-10-22 00:00+00' AS new_matches");
  assert.deepEqual(boundary.rows,[{old_matches:true,new_matches:true}]);
  result.checks.push({ bothInclusiveDoubleMatches:boundary.rows });
  await db.exec("CREATE TEMP TABLE customers (id integer PRIMARY KEY, deleted_at timestamptz); CREATE TEMP TABLE purchases (id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers); INSERT INTO customers VALUES (1,'2026-10-25 00:00+00'); INSERT INTO purchases VALUES (103,1);");
  result.checks.push({ flagDoesNotPreventReference:(await db.query('SELECT * FROM purchases')).rows });
  try { await db.exec('DELETE FROM customers WHERE id=1'); assert.fail('Dangling reference accepted'); } catch(e) { assert.equal(e.code,'23503'); result.checks.push({ requiredReferenceBlocksDelete:e.code }); }
  try { await db.exec('UPDATE purchases SET customer_id=NULL WHERE id=103'); assert.fail('Null accepted'); } catch(e) { assert.equal(e.code,'23502'); result.checks.push({ requiredReferenceBlocksNull:e.code }); }
  await db.exec("CREATE TEMP TABLE live_accounts (id integer PRIMARY KEY, handle text NOT NULL, deleted_at timestamptz); CREATE UNIQUE INDEX live_handle ON live_accounts(handle) WHERE deleted_at IS NULL; INSERT INTO live_accounts VALUES (1,'Mina','2026-10-25 00:00+00'),(2,'Mina',NULL);");
  try { await db.exec('UPDATE live_accounts SET deleted_at=NULL WHERE id=1'); assert.fail('Conflicting restore accepted'); } catch(e) { assert.equal(e.code,'23505'); result.checks.push({ partialUniqueRestorationConflict:e.code }); }
  result.outcome = 'PASS';
} finally { await db.close(); }
await writeFile(new URL('./sql-results.json', import.meta.url), JSON.stringify(result, null, 2)+'\n');
console.log(JSON.stringify({outcome:result.outcome, version:result.version, checks:result.checks.length, downloadExecuted:true, instanceClosed:true}));
