// Step-by-step specs for Figures 4 and 6. Every Redis command and reply shown
// was observed on Redis 8.10.3 (evidence/stampedes.txt, sections B to D).

const lanes = [
  { id: 'a', label: 'Request A', short: 'A', kind: 'client' },
  { id: 'b', label: 'Request B', short: 'B', kind: 'client' },
  { id: 'redis', label: 'Redis', kind: 'redis' },
  { id: 'db', label: 'Database', kind: 'database' },
];

export const lockSpec = {
  label: 'Sequence diagram: two requests miss on the same key; one takes the rebuild lock and rebuilds, the other waits',
  intro: 'The copy of trending has just expired. Requests A and B arrive a few milliseconds apart, in different processes.',
  lanes,
  initial: { redis: 'no copy', db: 'rows' },
  steps: [
    { from: 'a', to: 'redis', label: 'GET → nil', kind: 'miss', explanation: 'A asks Redis for trending and misses.' },
    { from: 'a', to: 'redis', label: 'SET NX → OK', kind: 'write', state: { redis: 'lock = tok-A' }, explanation: 'A tries to take the lock: SET lock:trending tok-A NX PX 5000. NX means "only if the key does not exist", so this succeeds only for the first caller. Redis replies OK. The token tok-A is a random value that only A knows.' },
    { from: 'b', to: 'redis', label: 'GET → nil', kind: 'miss', explanation: 'B also misses: the copy is still being built.' },
    { from: 'b', to: 'redis', label: 'SET NX → nil', kind: 'write', explanation: 'B tries the same SET … NX with its own token. The key exists, so Redis does nothing and replies nil. B did not get the lock.' },
    { at: 'b', note: 'waits, polls GET', kind: 'neutral', explanation: 'B does not query the database. It waits and asks Redis again every 20 milliseconds or so.' },
    { from: 'a', to: 'redis', label: 'GET → nil', kind: 'miss', explanation: 'Before querying, A reads the key once more. Another process might have stored a fresh copy between A’s first miss and A taking the lock; if so, A would release the lock and use that copy.' },
    { from: 'a', to: 'db', label: 'query', kind: 'miss', explanation: 'Still missing, so A runs the 200 ms query. It is the only query for this key.' },
    { from: 'a', to: 'redis', label: 'SET EX 60 → OK', kind: 'write', state: { redis: 'copy, lock' }, explanation: 'A stores the new copy with its usual TTL.' },
    { from: 'a', to: 'redis', label: 'DELEX IFEQ → 1', kind: 'write', state: { redis: 'copy' }, explanation: 'A releases the lock with DELEX lock:trending IFEQ tok-A, which deletes the key only if it still holds A’s token. Redis replies 1.' },
    { from: 'b', to: 'redis', label: 'GET → hit', kind: 'hit', explanation: 'B’s next poll is a hit. B waited about one rebuild, but the database answered one query instead of two.' },
  ],
};

const hazardLanes = [
  { id: 'a', label: 'Request A', short: 'A', kind: 'client' },
  { id: 'b', label: 'Request B', short: 'B', kind: 'client' },
  { id: 'c', label: 'Request C', short: 'C', kind: 'client' },
  { id: 'redis', label: 'Redis', kind: 'redis' },
];
const hazardStart = [
  { from: 'a', to: 'redis', label: 'SET NX PX 300', kind: 'write', state: { redis: 'lock = tok-A' }, explanation: 'A misses and takes the lock with a 300 ms expiry: SET lock:trending tok-A NX PX 300. Redis replies OK.' },
  { at: 'a', note: 'slow query', kind: 'neutral', explanation: 'A starts its query. The database is busy, so today the query takes 400 ms, longer than the lock lives.' },
  { at: 'redis', note: 'lock expires', kind: 'expiry', state: { redis: 'no lock' }, explanation: 'At 300 ms the lock expires, although A is still rebuilding. Redis has no idea A exists; the key simply reaches its TTL.' },
  { from: 'b', to: 'redis', label: 'SET NX PX 300', kind: 'write', state: { redis: 'lock = tok-B' }, explanation: 'B misses at 350 ms and tries the lock. It is free, so Redis replies OK.' },
  { at: 'b', note: 'query', kind: 'neutral', explanation: 'B starts its own query for the same key. Two requests are now rebuilding it at once.' },
  { at: 'a', note: 'query fails', kind: 'error', explanation: 'At 400 ms A’s query times out. A gives up and, in its cleanup code, releases the lock it thinks it holds.' },
];
export const hazardSpecs = {
  del: {
    label: 'Sequence diagram: a lock expires during a slow rebuild, and the first holder deletes the second holder’s lock with DEL',
    intro: 'The copy of trending has expired and the database is struggling. Watch who holds the lock.',
    lanes: hazardLanes,
    initial: { redis: 'no copy' },
    steps: [
      ...hazardStart,
      { from: 'a', to: 'redis', label: 'DEL lock', kind: 'error', state: { redis: 'no lock' }, explanation: 'A releases with a plain DEL lock:trending. DEL does not know whose lock it is: it deletes B’s lock and replies 1.' },
      { from: 'c', to: 'redis', label: 'SET NX PX 300', kind: 'write', state: { redis: 'lock = tok-C' }, explanation: 'C misses and finds no lock, so it takes one. Redis replies OK.' },
      { at: 'c', note: 'query', kind: 'neutral', explanation: 'C starts a third query while B’s is still running. Each failing holder that releases this way lets the next request in, exactly when the database is least able to take it.' },
    ],
  },
  delex: {
    label: 'Sequence diagram: a lock expires during a slow rebuild, and the first holder’s DELEX IFEQ leaves the second holder’s lock alone',
    intro: 'The same timeline, but A releases with DELEX … IFEQ and its own token.',
    lanes: hazardLanes,
    initial: { redis: 'no copy' },
    steps: [
      ...hazardStart,
      { from: 'a', to: 'redis', label: 'DELEX IFEQ tok-A', kind: 'write', explanation: 'A releases with DELEX lock:trending IFEQ tok-A. The lock holds tok-B, not tok-A, so Redis deletes nothing and replies 0.' },
      { from: 'c', to: 'redis', label: 'SET NX PX 300', kind: 'write', explanation: 'C misses and tries the lock. B still holds it, so Redis replies nil and C waits for B’s copy. The token check limited the damage to the overlap that the short lock expiry caused.' },
    ],
  },
};
