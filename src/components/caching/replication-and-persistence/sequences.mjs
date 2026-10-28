// Step-by-step specs for Figures 3, 9 and 10. Every command, reply and log
// line described was observed on Redis 8.10.3 (evidence/replication-and-persistence.txt,
// sections e1c, r6, r7 and s3), except the partition version of Figure 9.

export const snapshotSpec = {
  label: 'Sequence diagram: a value deleted after a snapshot comes back when Redis restarts from that snapshot, while a value whose TTL has passed does not',
  intro: 'Redis takes a snapshot now and then. The database holds the kettle at £39.',
  lanes: [
    { id: 'app', label: 'Application', short: 'App', kind: 'app' },
    { id: 'redis', label: 'Redis', kind: 'redis' },
    { id: 'disk', label: 'dump.rdb', kind: 'neutral' },
    { id: 'db', label: 'Database', short: 'DB', kind: 'database' },
  ],
  initial: { redis: 'empty', disk: 'no file', db: '£39' },
  steps: [
    { from: 'app', to: 'redis', label: 'SET EX 3600', kind: 'write', state: { redis: 'kettle £39' }, explanation: 'A miss loads the kettle and caches it for an hour: SET product:42 … EX 3600. The application also caches today’s banner for 20 seconds.' },
    { from: 'redis', to: 'disk', label: 'BGSAVE', kind: 'write', state: { disk: 'kettle £39' }, explanation: 'A snapshot is taken. The file holds the kettle at £39 and the banner, each with the absolute time at which it expires.' },
    { at: 'db', note: 'price → £35', kind: 'write', state: { db: '£35' }, explanation: 'The merchant cuts the price. The database commits £35.' },
    { from: 'app', to: 'redis', label: 'DEL', kind: 'write', state: { redis: 'banner' }, explanation: 'The application deletes the cached kettle, as it should. Redis replies 1. The snapshot on disk still has the old copy.' },
    { at: 'redis', note: 'banner expires', kind: 'expiry', state: { redis: 'empty' }, explanation: 'The banner’s 20 seconds run out, and it expires.' },
    { at: 'redis', note: 'crash', kind: 'error', state: { redis: 'down' }, explanation: 'Redis is killed (kill -9). No new snapshot is written.' },
    { from: 'disk', to: 'redis', label: 'load file', kind: 'stale', state: { redis: 'kettle £39' }, explanation: 'Redis restarts and loads dump.rdb. The banner’s expiry time has passed, so Redis drops it while loading; the kettle’s has not, so it is back.' },
    { from: 'app', to: 'redis', label: 'GET', kind: 'stale', explanation: 'The next read is a hit for £39, with a TTL of 3,573 seconds. A price the application deleted is served again for up to an hour, unless something deletes it again.' },
  ],
};

export const failoverSpec = {
  label: 'Sequence diagram: a delete acknowledged by the primary is lost when the primary crashes before the replica receives it, and the promoted replica serves the old value',
  intro: 'A primary with one replica. Both hold the kettle at £39.',
  lanes: [
    { id: 'app', label: 'Application', short: 'App', kind: 'app' },
    { id: 'primary', label: 'Primary', kind: 'redis' },
    { id: 'replica', label: 'Replica', kind: 'redis' },
  ],
  initial: { primary: 'kettle £39', replica: 'kettle £39' },
  steps: [
    { at: 'replica', note: 'falls behind', kind: 'neutral', explanation: 'The replica falls behind. In my test I froze it; in production it is a busy replica, a slow network or a big write burst. The primary keeps going and holds the unsent stream in an output buffer (9 MB of it in my test).' },
    { from: 'app', to: 'primary', label: 'DEL', kind: 'write', state: { primary: 'no kettle' }, explanation: 'The price changes, and the application deletes the cached kettle on the primary. The primary deletes it and replies 1 at once; it does not wait for the replica.' },
    { from: 'app', to: 'primary', label: 'WAIT 1 500', kind: 'error', explanation: 'Had the application asked, WAIT 1 500 would have waited half a second and replied 0: no replica has confirmed the delete. Most applications do not ask.' },
    { at: 'primary', note: 'crash', kind: 'error', state: { primary: 'down' }, explanation: 'The primary dies (kill -9). The stream it had not yet sent, including the delete, dies with it.' },
    { at: 'replica', note: 'promoted', kind: 'redis', state: { replica: 'kettle £39' }, explanation: 'The replica is promoted to primary (REPLICAOF NO ONE, as Sentinel would send). It never received the delete.' },
    { from: 'app', to: 'replica', label: 'GET', kind: 'stale', explanation: 'Reads now go to the new primary, which returns £39 with almost an hour of TTL left. The delete was acknowledged and then undone.' },
  ],
};

const wipeLanes = [
  { id: 'primary', label: 'Redis A', kind: 'redis' },
  { id: 'replica', label: 'Redis B', kind: 'redis' },
  { id: 'sentinel', label: 'Sentinels', kind: 'neutral' },
];
const wipeInitial = { primary: '5,000 keys', replica: '5,000 keys', sentinel: 'watching' };
const wipeStart = [
  { at: 'primary', note: 'crash', kind: 'error', state: { primary: 'down' }, explanation: 'The primary, Redis A, crashes. Persistence is off, as on many caches.' },
];
export const wipeSpecs = {
  restart: {
    label: 'Sequence diagram: a primary without persistence restarts empty within a second; Sentinel sees nothing wrong and the replica copies the empty dataset',
    intro: 'Redis A is the primary and Redis B its replica; each holds 5,000 keys. Three Sentinels watch, with the default 30-second detection.',
    lanes: wipeLanes,
    initial: wipeInitial,
    steps: [
      ...wipeStart,
      { at: 'primary', note: 'restarted', kind: 'error', state: { primary: '0 keys' }, explanation: 'A supervisor such as systemd restarts it at once. It is back 0.4 seconds later, empty, with a new replication ID.' },
      { from: 'sentinel', to: 'primary', label: 'PING', kind: 'hit', explanation: 'The Sentinels’ next pings are answered. The primary was silent for well under 30 seconds, so nothing is marked down; the Sentinel log records only “+reboot”.' },
      { from: 'replica', to: 'primary', label: 'PSYNC', kind: 'miss', explanation: 'The replica reconnects and asks to continue from its replication ID and offset (the PSYNC command). The primary has no record of that history, so it answers with a full resynchronisation.' },
      { from: 'primary', to: 'replica', label: 'full sync', kind: 'write', state: { replica: '0 keys' }, explanation: 'The primary sends its dataset: nothing. The replica flushes its 5,000 keys and loads zero. In my run with Sentinel this had happened within 10 seconds of the crash.' },
      { at: 'sentinel', note: 'all well', kind: 'neutral', explanation: 'Both servers are empty and every Sentinel still reports the same primary. The replica that was meant to keep a warm copy has been wiped by the very primary it was protecting.' },
    ],
  },
  down: {
    label: 'Sequence diagram: a primary that stays down is detected after 30 seconds and the replica, still holding its keys, is promoted',
    intro: 'The same setup: Redis A is the primary and Redis B its replica, each with 5,000 keys; three Sentinels watch.',
    lanes: wipeLanes,
    initial: wipeInitial,
    steps: [
      ...wipeStart,
      { at: 'primary', note: 'stays down', kind: 'error', explanation: 'This time nothing restarts it.' },
      { at: 'sentinel', note: 'marked down', kind: 'error', state: { sentinel: 'failing over' }, explanation: 'After 30 seconds without a reply, each Sentinel marks the primary subjectively down; two agree, so it is objectively down, and one Sentinel is elected to fail over.' },
      { from: 'sentinel', to: 'replica', label: 'promote', kind: 'write', state: { sentinel: 'watching' }, explanation: 'The leader sends REPLICAOF NO ONE to Redis B. It becomes the primary with all 5,000 keys, and clients that ask Sentinel are sent to it.' },
      { at: 'primary', note: 'back as replica', kind: 'neutral', state: { primary: '0 keys' }, explanation: 'When Redis A comes back, empty, Sentinel turns it into a replica of Redis B.' },
      { from: 'replica', to: 'primary', label: 'full sync', kind: 'write', state: { primary: '5,000 keys' }, explanation: 'Redis A copies the 5,000 keys. The warm copy survived because the empty server became the replica, not the primary.' },
    ],
  },
};

// Figure 9's second version: a network partition. Not run on my laptop; it
// follows the Redis Sentinel documentation's partition example.
export const partitionSpec = {
  label: 'Sequence diagram: during a network partition the old primary keeps accepting writes from clients on its side, including a delete; when the partition heals it is turned into a replica and that delete is discarded',
  intro: 'Redis A is the primary and Redis B its replica; both hold the kettle at £39. Three Sentinels watch.',
  lanes: [
    { id: 'app', label: 'Application', short: 'App', kind: 'app' },
    { id: 'primary', label: 'Redis A', kind: 'redis' },
    { id: 'replica', label: 'Redis B', kind: 'redis' },
    { id: 'sentinel', label: 'Sentinels', kind: 'neutral' },
  ],
  initial: { primary: 'kettle £39', replica: 'kettle £39', sentinel: 'watching' },
  steps: [
    { at: 'primary', note: 'cut off', kind: 'error', explanation: 'A network fault cuts Redis A, and one application server with it, off from the Sentinels and from Redis B. Redis A is still running, and that application server can still reach it. (This version follows the Sentinel documentation’s example; I did not run it.)' },
    { at: 'sentinel', note: 'marked down', kind: 'error', state: { sentinel: 'failing over' }, explanation: 'After down-after-milliseconds without a reply, the Sentinels agree that Redis A is down and elect a leader.' },
    { from: 'sentinel', to: 'replica', label: 'promote', kind: 'write', explanation: 'The leader promotes Redis B to primary. Application servers on the Sentinels’ side of the fault now use it.' },
    { from: 'app', to: 'primary', label: 'DEL', kind: 'write', state: { primary: 'no kettle' }, explanation: 'The price changes. The cut-off application server still has its connection to Redis A, which does not know it has been replaced. Redis A deletes the kettle and replies 1.' },
    { at: 'primary', note: 'fault heals', kind: 'neutral', explanation: 'The network fault heals. Redis A is still acting as a primary.' },
    { from: 'sentinel', to: 'primary', label: 'REPLICAOF', kind: 'write', state: { sentinel: 'watching' }, explanation: 'The Sentinels see Redis A again and reconfigure it as a replica of Redis B, the primary they elected.' },
    { from: 'replica', to: 'primary', label: 'full sync', kind: 'write', state: { primary: 'kettle £39' }, explanation: 'Redis A discards its own data, delete included, and copies Redis B’s dataset, which still has the kettle at £39.' },
    { from: 'app', to: 'replica', label: 'GET', kind: 'stale', explanation: 'Every application server now reads from Redis B and gets £39. The delete was acknowledged by a primary whose writes no longer counted.' },
  ],
};
