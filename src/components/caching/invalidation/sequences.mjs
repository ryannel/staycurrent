// Step-by-step sequences for the invalidation article's stepped figures
// (2, 5, 6, 7 and 9). Plain data for sequenceFigure() in ../shared/sequence.mjs;
// tested in node (sequences.test.mjs) so the final states match the prose.

const reader = { id: 'reader', label: 'Reader', kind: 'client' };
const writer = { id: 'writer', label: 'Writer', kind: 'write' };
const redis = { id: 'redis', label: 'Redis', kind: 'redis' };
const db = { id: 'db', label: 'Database', kind: 'database' };
// The lease and tombstone sequences have a second reader; both are drawn on one lane.
const readers = { id: 'reader', label: 'Readers', kind: 'client' };

// Figure 2 and the "without" option of figure 5: the slow reader.
const slowReaderSteps = [
  { from: 'reader', to: 'redis', label: 'GET', kind: 'miss', explanation: 'A customer opens the kettle\'s page. The reader asks Redis for product:42 and misses: the cached copy expired a moment ago.' },
  { from: 'db', to: 'reader', label: '£39', kind: 'database', state: { reader: '£39' }, explanation: 'The reader reads the row from the database and gets £39.' },
  { at: 'reader', note: 'stalls', kind: 'neutral', explanation: 'Before it can store £39 in Redis, the reader stalls. It might be a garbage-collection pause, a slow network or a busy thread; any delay will do.' },
  { from: 'writer', to: 'db', label: 'UPDATE £35', kind: 'write', state: { db: '£35' }, explanation: 'Meanwhile the merchant saves the new price. The writer commits £35 to the database.' },
  { from: 'writer', to: 'redis', label: 'DEL', kind: 'write', explanation: 'The writer deletes product:42 from Redis, exactly as it should. Redis has no copy yet, so the DEL removes nothing and returns 0.' },
  { from: 'reader', to: 'redis', label: 'SET £39', kind: 'stale', state: { redis: '£39' }, explanation: 'The reader resumes and stores the £39 it read before the change, with a fresh one-hour TTL.' },
  { at: 'redis', note: 'stale for an hour', kind: 'stale', explanation: 'Every read for the next hour is a hit that returns £39. Nothing will remove the key before it expires unless the price changes again.' },
];

export const raceSpecs = {
  slow: {
    label: 'Sequence: a slow reader stores an old price after the writer has deleted the key',
    intro: 'Redis has no copy of product:42. The database holds the kettle\'s price, £39. A reader and a writer are about to act on the same key.',
    lanes: [reader, writer, redis, db],
    initial: { redis: 'empty', db: '£39' },
    steps: slowReaderSteps,
  },
  replica: {
    label: 'Sequence: a reader that reads a lagging replica stores an old price after the delete',
    intro: 'Redis holds no copy of product:42. The primary database and its read replica both hold £39. The application writes to the primary and reads from the replica.',
    lanes: [reader, writer, redis, { id: 'primary', label: 'Primary', kind: 'database' }, { id: 'replica', label: 'Replica', kind: 'database' }],
    initial: { redis: 'empty', primary: '£39', replica: '£39' },
    steps: [
      { from: 'writer', to: 'primary', label: 'UPDATE £35', kind: 'write', state: { primary: '£35' }, explanation: 'The writer commits £35 on the primary database.' },
      { from: 'writer', to: 'redis', label: 'DEL', kind: 'write', explanation: 'It deletes product:42 from Redis straight away.' },
      { from: 'reader', to: 'redis', label: 'GET', kind: 'miss', explanation: 'A reader asks for product:42 and misses, because the key has just been deleted.' },
      { from: 'replica', to: 'reader', label: '£39', kind: 'database', state: { reader: '£39' }, explanation: 'It reads the row from the replica. Replication is asynchronous and the replica is a few hundred milliseconds behind, so it still says £39.' },
      { from: 'reader', to: 'redis', label: 'SET £39', kind: 'stale', state: { redis: '£39' }, explanation: 'The reader stores £39 with a one-hour TTL. Nobody paused: the replica\'s lag opened the gap on its own.' },
      { from: 'primary', to: 'replica', label: '£35', kind: 'database', state: { replica: '£35' }, explanation: 'Moments later the replica receives the change. Redis already holds £39.' },
      { at: 'redis', note: 'stale for an hour', kind: 'stale', explanation: 'Every read for the next hour returns £39 from Redis, although both databases now say £35.' },
    ],
  },
};

// Figure 5: the same race with a lease held in the key itself.
export const leaseSpecs = {
  without: { ...raceSpecs.slow, label: 'Sequence: the slow-reader race without a lease' },
  with: {
    label: 'Sequence: the slow-reader race with a lease; the late fill is refused',
    intro: 'The same race, but a reader that misses first takes a lease: a placeholder value holding a token only that reader knows. Its fill only succeeds if the placeholder is still there.',
    lanes: [readers, writer, redis, db],
    initial: { redis: 'empty', db: '£39' },
    steps: [
      { from: 'reader', to: 'redis', label: 'GET', kind: 'miss', explanation: 'The reader asks for product:42 and misses.' },
      { from: 'reader', to: 'redis', label: 'SET lease NX', kind: 'neutral', state: { redis: 'lease:r1' }, explanation: 'Before reading the database, it writes the placeholder lease:r1 with NX (only if the key is absent) and a 2-second expiry. It holds the lease.' },
      { from: 'db', to: 'reader', label: '£39', kind: 'database', state: { reader: '£39' }, explanation: 'It reads £39 from the database.' },
      { at: 'reader', note: 'stalls', kind: 'neutral', explanation: 'Then it stalls, as before.' },
      { from: 'writer', to: 'db', label: 'UPDATE £35', kind: 'write', state: { db: '£35' }, explanation: 'The writer commits £35.' },
      { from: 'writer', to: 'redis', label: 'DEL', kind: 'write', state: { redis: 'empty' }, explanation: 'The writer deletes product:42. This time there is something to delete: the reader\'s placeholder, and with it the lease.' },
      { from: 'reader', to: 'redis', label: 'SET £39 IFEQ', kind: 'stale', explanation: 'The reader resumes. Its fill says: set £39 only if the key still holds lease:r1.' },
      { from: 'redis', to: 'reader', label: 'nil', kind: 'error', explanation: 'The key no longer holds lease:r1, so Redis refuses the fill and replies nil. The old price is never stored.' },
      { from: 'reader', to: 'redis', label: 'r2: GET', kind: 'miss', explanation: 'A second request, a different reader drawn on the same lane, now asks for product:42 and misses. The first reader has given up; nobody retries its old fill.' },
      { from: 'reader', to: 'redis', label: 'r2: SET lease', kind: 'neutral', state: { redis: 'lease:r2' }, explanation: 'The second reader takes its own lease, lease:r2, with NX.' },
      { from: 'db', to: 'reader', label: '£35', kind: 'database', state: { reader: '£35' }, explanation: 'It reads £35 from the database.' },
      { from: 'reader', to: 'redis', label: 'SET £35 IFEQ', kind: 'write', state: { redis: '£35' }, explanation: 'Its placeholder is still there, so its fill succeeds. Redis and the database agree.' },
    ],
  },
};

// Figure 6: two writers update the cache out of order.
const w1 = { id: 'w1', label: 'Writer 1', kind: 'write' };
const w2 = { id: 'w2', label: 'Writer 2', kind: 'write' };
const orderSteps = [
  { from: 'w1', to: 'db', label: 'UPDATE £37', kind: 'write', state: { db: '£37 v8' }, explanation: 'Writer 1 commits £37. The row\'s version number goes from 7 to 8.' },
  { at: 'w1', note: 'stalls', kind: 'neutral', explanation: 'Before it updates Redis, writer 1 stalls.' },
  { from: 'w2', to: 'db', label: 'UPDATE £35', kind: 'write', state: { db: '£35 v9' }, explanation: 'Writer 2 commits £35, version 9. In the database, £35 is the latest price.' },
  { from: 'w2', to: 'redis', label: 'SET £35 v9', kind: 'write', state: { redis: '£35 v9' }, explanation: 'Writer 2 updates the cached copy with its value and version.' },
];
const orderBase = {
  lanes: [w1, w2, redis, db],
  initial: { redis: '£39 v7', db: '£39 v7' },
};
export const versionSpecs = {
  plain: {
    ...orderBase,
    label: 'Sequence: two writers update the cache in the opposite order to their commits',
    intro: 'Redis and the database both hold £39 at version 7. Two writers change the price at almost the same moment, and each updates the cached copy after committing.',
    steps: [...orderSteps,
      { from: 'w1', to: 'redis', label: 'SET £37 v8', kind: 'stale', state: { redis: '£37 v8' }, explanation: 'Writer 1 resumes and sets its value. A plain SET replaces whatever is there, so the older price wins.' },
      { at: 'redis', note: 'stale until expiry', kind: 'stale', explanation: 'Redis serves £37 while the database says £35, until the key expires or another write replaces it.' },
    ],
  },
  newer: {
    ...orderBase,
    label: 'Sequence: two writers out of order, with a set-only-if-newer check',
    intro: 'The same two writers. This time each cache write carries the version the database gave the row, and Redis keeps a value only if its version is newer than the one cached.',
    steps: [...orderSteps,
      { from: 'w1', to: 'redis', label: 'SET v8 if newer', kind: 'error', explanation: 'Writer 1\'s write carries version 8. The check compares it with the cached version 9, finds it older and changes nothing.' },
      { at: 'redis', note: '£35 stays', kind: 'hit', explanation: 'Redis keeps £35, version 9, which matches the database.' },
    ],
  },
  evicted: {
    ...orderBase,
    label: 'Sequence: the version check fails when the newer entry has been evicted',
    intro: 'The same two writers with the same set-only-if-newer check. This time Redis evicts the key between the two cache writes.',
    steps: [...orderSteps,
      { at: 'redis', note: 'evicted', kind: 'expiry', state: { redis: 'empty' }, explanation: 'Under memory pressure Redis evicts product:42. A DEL would have the same effect. With the key goes the cache\'s only record that version 9 exists.' },
      { from: 'w1', to: 'redis', label: 'SET v8 if newer', kind: 'stale', state: { redis: '£37 v8' }, explanation: 'Writer 1\'s version 8 is compared with nothing, so it is accepted. The older price is back, until the key expires.' },
    ],
  },
  tombstone: {
    label: 'Sequence: a version-8 tombstone refuses a slow reader\'s version-7 fill',
    intro: 'Back to Figure 2\'s slow reader, now with versions. Every cache write uses the set-only-if-newer check, and the writer invalidates with a tombstone: instead of deleting the key, it stores the new version with no value.',
    lanes: [readers, writer, redis, db],
    initial: { redis: 'empty', db: '£39 v7' },
    steps: [
      { from: 'reader', to: 'redis', label: 'GET', kind: 'miss', explanation: 'A reader asks for product:42 and misses.' },
      { from: 'db', to: 'reader', label: '£39 v7', kind: 'database', state: { reader: '£39 v7' }, explanation: 'It reads £39, version 7, from the database.' },
      { at: 'reader', note: 'stalls', kind: 'neutral', explanation: 'Then it stalls, as in Figure 2.' },
      { from: 'writer', to: 'db', label: 'UPDATE £35', kind: 'write', state: { db: '£35 v8' }, explanation: 'The writer commits £35. The version becomes 8.' },
      { from: 'writer', to: 'redis', label: 'tombstone v8', kind: 'write', state: { redis: 'v8, no value' }, explanation: 'Instead of deleting product:42, the writer stores a tombstone: version 8 with no value and a short TTL. Readers treat it as a miss.' },
      { from: 'reader', to: 'redis', label: 'SET v7 if newer', kind: 'error', explanation: 'The slow reader resumes. Its fill carries version 7, and Redis holds a record of version 8, so the check refuses it. The old price is never stored.' },
      { from: 'reader', to: 'redis', label: 'r2: GET', kind: 'miss', explanation: 'A second request, a different reader on the same lane, finds the tombstone, which counts as a miss.' },
      { from: 'db', to: 'reader', label: '£35 v8', kind: 'database', state: { reader: '£35 v8' }, explanation: 'It reads £35, version 8.' },
      { from: 'reader', to: 'redis', label: 'SET £35 v8', kind: 'write', state: { redis: '£35 v8' }, explanation: 'Its fill has the same version as the tombstone, and a fill of the same version may replace a tombstone, so it is stored. Redis and the database agree.' },
    ],
  },
};

// Figure 7: a crash between the commit and the delete.
const relay = { id: 'relay', label: 'Relay', kind: 'app' };
export const outboxSpecs = {
  app: {
    label: 'Sequence: the writer crashes after committing and before deleting',
    intro: 'Redis and the database both hold £39. The writer will commit £35 and then delete the cached copy itself.',
    lanes: [writer, db, redis, reader],
    initial: { db: '£39', redis: '£39' },
    steps: [
      { from: 'writer', to: 'db', label: 'UPDATE £35', kind: 'write', state: { db: '£35' }, explanation: 'The writer commits £35.' },
      { at: 'writer', note: 'crashes', kind: 'error', explanation: 'Its process dies before it sends the delete: a deploy, an out-of-memory kill, or a timeout talking to Redis.' },
      { from: 'redis', to: 'reader', label: '£39', kind: 'stale', state: { reader: '£39' }, explanation: 'Readers get £39 from Redis. Nothing in the system knows the copy is old.' },
      { at: 'redis', note: 'expires', kind: 'expiry', state: { redis: 'empty' }, explanation: 'This lasts until the copy expires. The TTL is the only thing left that will correct it.' },
    ],
  },
  outbox: {
    label: 'Sequence: the writer crashes after committing, and an outbox relay deletes the key',
    intro: 'The same writer, but the instruction to invalidate is written into the database with the change, and a separate relay carries it to Redis.',
    lanes: [writer, db, relay, redis],
    initial: { db: '£39', relay: 'idle', redis: '£39' },
    steps: [
      { from: 'writer', to: 'db', label: 'UPDATE + outbox', kind: 'write', state: { db: '£35 +row' }, explanation: 'In one transaction the writer changes the price and inserts an outbox row saying "invalidate product:42". Both commit, or neither does.' },
      { at: 'writer', note: 'crashes', kind: 'error', explanation: 'The writer dies straight after the commit. Nothing is lost: the instruction to delete is already in the database.' },
      { from: 'db', to: 'relay', label: 'new row', kind: 'write', state: { relay: 'product:42' }, explanation: 'The relay, a separate process, picks up new outbox rows (or reads the database\'s change log).' },
      { from: 'relay', to: 'redis', label: 'DEL', kind: 'write', state: { redis: 'empty' }, explanation: 'It deletes product:42 from Redis.' },
      { from: 'relay', to: 'db', label: 'mark done', kind: 'neutral', state: { db: '£35', relay: 'idle' }, explanation: 'Then it marks the row done. If the relay crashed before this step it would send the DEL again after restarting, which is harmless: deleting twice leaves the same state as deleting once.' },
      { at: 'redis', note: 'next read: £35', kind: 'hit', explanation: 'The next read misses and caches £35. The delete arrived later than the writer\'s own would have, but it arrived.' },
    ],
  },
};

// Figure 9: read-your-writes for the user who made the change.
const editor = { id: 'editor', label: 'Sam\'s requests', short: 'Sam', kind: 'client' };
export const markerSpecs = {
  plain: {
    label: 'Sequence: the user who renamed themselves reloads and sees the old name',
    intro: 'A user called Sam renames themselves Samira. Invalidations reach Redis through a relay, about half a second after the commit.',
    lanes: [editor, redis, db, relay],
    initial: { editor: 'Sam', redis: 'Sam', db: 'Sam', relay: 'idle' },
    steps: [
      { from: 'editor', to: 'db', label: 'UPDATE Samira', kind: 'write', state: { db: 'Samira', relay: 'user:7' }, explanation: 'The change commits. The relay will delete user:7 from Redis shortly.' },
      { from: 'redis', to: 'editor', label: 'Sam', kind: 'stale', state: { editor: 'Sam' }, explanation: 'The page says "Saved" and reloads the profile. The delete has not reached Redis yet, so the reload is a hit that returns Sam. To the user, the change did not work.' },
      { from: 'relay', to: 'redis', label: 'DEL', kind: 'write', state: { redis: 'empty', relay: 'idle' }, explanation: 'Half a second later the relay deletes the key. Other users would never notice the gap; this one already has.' },
    ],
  },
  marker: {
    label: 'Sequence: a recent-write marker sends the user\'s own reads to the database',
    intro: 'The same rename, the same half-second invalidation. This time the application marks the user as having written recently.',
    lanes: [editor, redis, db, relay],
    initial: { editor: 'Sam', redis: 'Sam', db: 'Sam', relay: 'idle' },
    steps: [
      { from: 'editor', to: 'db', label: 'UPDATE Samira', kind: 'write', state: { db: 'Samira', relay: 'user:7' }, explanation: 'The change commits, and the relay will delete user:7 shortly.' },
      { from: 'editor', to: 'redis', label: 'SET marker', kind: 'write', state: { redis: 'Sam +mark' }, explanation: 'Straight after the commit, the application sets recent-write:user:7 with a ten-second expiry.' },
      { from: 'redis', to: 'editor', label: 'marker found', kind: 'neutral', explanation: 'On the reload, the application checks for the marker along with the profile, and finds it.' },
      { from: 'db', to: 'editor', label: 'Samira', kind: 'database', state: { editor: 'Samira' }, explanation: 'So it skips the cached profile for this user and reads the database: Samira.' },
      { from: 'relay', to: 'redis', label: 'DEL', kind: 'write', state: { redis: 'mark', relay: 'idle' }, explanation: 'The relay\'s delete arrives as usual.' },
      { at: 'redis', note: 'marker expires', kind: 'expiry', state: { redis: 'empty' }, explanation: 'Ten seconds later the marker expires and the user reads from the cache again, which by then holds nothing older than Samira.' },
    ],
  },
};
