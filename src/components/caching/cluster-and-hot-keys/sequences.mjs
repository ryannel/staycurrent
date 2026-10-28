// Step specs for the sequence figures. The redirections (Figure 3) and the tracking
// messages (Figure 9) are the replies I observed on Redis 8.10.3 (evidence sections C3,
// C5 and C11); the race (Figure 10) is the one described in Redis's client-side caching
// reference, drawn rather than captured.

const clusterLanes = [
  { id: 'client', label: 'Client', kind: 'client' },
  { id: 'c', label: 'Node C', kind: 'redis' },
  { id: 'a', label: 'Node A', kind: 'redis' },
];

export const redirectSpecs = {
  moved: {
    label: 'A client following a MOVED redirection',
    intro: 'Slot 12456, which holds product:42, used to be on node C and has moved to node A. The client’s slot map is out of date: it still says node C.',
    lanes: clusterLanes,
    initial: { client: 'map: 12456 → C', c: 'not owner', a: 'owns 12456' },
    steps: [
      { from: 'client', to: 'c', label: 'GET product:42', kind: 'client', explanation: 'The client sends the command to the node its map names for slot 12456.' },
      { from: 'c', to: 'client', label: 'MOVED 12456 A', kind: 'neutral', explanation: 'Node C does not own the slot. It replies MOVED with the slot number and the address of the node that owns it now. (On my cluster: MOVED 12456 127.0.0.1:7195.)' },
      { at: 'client', note: 'update map', state: { client: 'map: 12456 → A' }, explanation: 'MOVED means the move is permanent, so the client updates its map. A good client reloads the whole map, with CLUSTER SHARDS or the older CLUSTER SLOTS, because one moved slot usually means others have moved too.' },
      { from: 'client', to: 'a', label: 'GET product:42', kind: 'client', explanation: 'The client sends the command again, to node A.' },
      { from: 'a', to: 'client', label: '"kettle"', kind: 'hit', explanation: 'Node A answers. The redirection cost one extra round trip, once: every later request for this slot goes straight to node A.' },
    ],
  },
  ask: {
    label: 'A client following an ASK redirection during a key-by-key migration',
    intro: 'Slot 12456 is being migrated from node C to node A one key at a time. product:42 has already been copied; {product:42}:stock has not. Node C still owns the slot until the migration ends, so the client’s map is correct.',
    lanes: clusterLanes,
    initial: { client: 'map: 12456 → C', c: 'MIGRATING', a: 'IMPORTING' },
    steps: [
      { from: 'client', to: 'c', label: 'GET …:stock', kind: 'client', explanation: 'The client asks node C for {product:42}:stock, a key in the same slot that has not moved yet.' },
      { from: 'c', to: 'client', label: '"7"', kind: 'hit', explanation: 'Node C still holds that key, so it answers as usual.' },
      { from: 'client', to: 'c', label: 'GET product:42', kind: 'client', explanation: 'Now the client asks node C for a key that has already moved.' },
      { from: 'c', to: 'client', label: 'ASK 12456 A', kind: 'neutral', explanation: 'Node C no longer has product:42, and the slot is migrating, so it replies ASK: try node A, for this one command only. It replies the same way for a key that was never there, so during a migration every cache miss in the slot costs this extra hop too.' },
      { from: 'client', to: 'a', label: 'ASKING', kind: 'client', explanation: 'The client sends ASKING to node A. Without it, node A, which does not own the slot yet, would answer MOVED 12456 back to node C, and the client would go round in a circle.' },
      { from: 'client', to: 'a', label: 'GET product:42', kind: 'client', explanation: 'Then the command itself, on the same connection.' },
      { from: 'a', to: 'client', label: '"kettle"', kind: 'hit', explanation: 'Node A answers. ASKING counts for one command: a second GET on that connection without it got MOVED back to node C.' },
      { at: 'client', note: 'map unchanged', explanation: 'The client leaves its map alone. Its next request for slot 12456 goes to node C again, which is still the owner.' },
      { from: 'client', to: 'c', label: 'MGET both keys', kind: 'client', explanation: 'A multi-key command whose keys are split between the two nodes cannot be answered by either.' },
      { from: 'c', to: 'client', label: 'TRYAGAIN', kind: 'error', explanation: 'Node C replies TRYAGAIN. The client must wait and retry; until the slot has finished moving, that command keeps failing.' },
    ],
  },
};

// Atomic slot migration (Redis 8.4 and later), as described in the CLUSTER MIGRATION reference
// and src/cluster_asm.c at 8.10.3; the steps are drawn, the timings measured in evidence C6.
export const asmSpec = {
  label: 'Atomic slot migration of slot 12456 from node C to node A',
  intro: 'Slot 12456, which holds product:42 and {product:42}:stock, belongs to node C. A new, empty node A is to take it over. redis-cli --cluster reshard starts the move; the client keeps reading and writing throughout.',
  lanes: clusterLanes,
  initial: { client: 'map: 12456 → C', c: 'owns 12456', a: 'empty' },
  steps: [
    { at: 'a', note: 'MIGRATION IMPORT', state: { a: 'importing' }, explanation: 'redis-cli sends CLUSTER MIGRATION IMPORT 12456 12456 to node A, which asks node C to send it the slot.' },
    { at: 'c', note: 'fork: snapshot', state: { c: 'sending' }, explanation: 'Node C forks, as it would for a backup, and the child process takes a snapshot of every key in the slot.' },
    { from: 'c', to: 'a', label: 'snapshot of slot', kind: 'write', state: { a: 'loading' }, explanation: 'The snapshot streams to node A. Node C still owns the slot and still has every key in it.' },
    { from: 'client', to: 'c', label: 'GET product:42', kind: 'client', explanation: 'Meanwhile the client reads as usual, from node C.' },
    { from: 'c', to: 'client', label: '"kettle"', kind: 'hit', explanation: 'An ordinary hit. No key is ever missing from node C before the handoff, so there is no ASK and no TRYAGAIN.' },
    { from: 'client', to: 'c', label: 'SET …:stock 6', kind: 'write', explanation: 'Writes still go to node C as well.' },
    { from: 'c', to: 'a', label: 'SET …:stock 6', kind: 'write', state: { a: 'catching up' }, explanation: 'Node C forwards every write made to the slot since the snapshot, much as a primary streams writes to a replica.' },
    { at: 'c', note: 'pause writes', explanation: 'When node A is within 1 MB of node C (the default threshold), node C pauses writes to the slot for a moment, so that node A can apply the last of them and hold an exact copy.' },
    { at: 'a', note: 'takes the slot', state: { a: 'owns 12456', c: 'not owner' }, explanation: 'Node A takes ownership of the slot in one step, and the other nodes learn of it over the cluster bus. Node C lets the paused writes go on, and from now on answers MOVED for the slot.' },
    { from: 'client', to: 'c', label: 'GET product:42', kind: 'client', explanation: 'The client’s map still says node C.' },
    { from: 'c', to: 'client', label: 'MOVED 12456 A', kind: 'neutral', state: { client: 'map: 12456 → A' }, explanation: 'One MOVED, as in Figure 3, and the client updates its map.' },
    { from: 'client', to: 'a', label: 'GET product:42', kind: 'client', explanation: 'The client asks node A.' },
    { from: 'a', to: 'client', label: '"kettle"', kind: 'hit', explanation: 'A hit: the key moved with its slot.' },
    { at: 'c', note: 'delete copies', state: { c: 'trimming' }, explanation: 'Node C deletes its old copies of the slot’s keys, normally in the background. If any client is tracking keys for a near cache, it deletes them on its main thread instead, one key at a time, so that each deletion can send that client an invalidation.' },
  ],
};

const trackLanes = [
  { id: 'a', label: 'App A', kind: 'app' },
  { id: 'redis', label: 'Redis', kind: 'redis' },
  { id: 'b', label: 'App B', short: 'App B', kind: 'app' },
];

export const trackingSpecs = {
  default: {
    label: 'Server-assisted client-side caching in the default mode',
    intro: 'App A keeps a near cache and has sent CLIENT TRACKING ON on its RESP3 connection. Redis holds product:42 = v1. App B writes to Redis without tracking.',
    lanes: trackLanes,
    initial: { a: 'cache: empty', redis: 'v1', b: '' },
    steps: [
      { from: 'a', to: 'redis', label: 'GET product:42', kind: 'client', explanation: 'App A misses its near cache and reads from Redis.' },
      { from: 'redis', to: 'a', label: 'v1', kind: 'hit', state: { a: 'cache: v1', redis: 'v1 · A read it' }, explanation: 'Redis replies and records that A’s connection read product:42. A keeps v1 in its near cache.' },
      { from: 'b', to: 'redis', label: 'SET v2', kind: 'write', state: { redis: 'v2' }, explanation: 'App B changes the value of product:42.' },
      { from: 'redis', to: 'a', label: 'invalidate', kind: 'write', state: { a: 'cache: empty', redis: 'v2 · forgotten' }, explanation: 'Redis pushes an invalidation message naming product:42 to A, on the same connection, and forgets that A read the key. A drops its copy.' },
      { from: 'b', to: 'redis', label: 'SET v3', kind: 'write', state: { redis: 'v3' }, explanation: 'B writes again. A hears nothing this time: Redis only tracks keys A has read since its last invalidation, and A has not read this one again.' },
      { from: 'a', to: 'redis', label: 'GET product:42', kind: 'client', explanation: 'A’s next read misses its near cache and goes to Redis.' },
      { from: 'redis', to: 'a', label: 'v3', kind: 'hit', state: { a: 'cache: v3', redis: 'v3 · A read it' }, explanation: 'A gets v3, and Redis tracks the key for A again. In default mode, each read earns at most one invalidation.' },
    ],
  },
  bcast: {
    label: 'Server-assisted client-side caching in broadcast mode',
    intro: 'App A has sent CLIENT TRACKING ON BCAST PREFIX product: instead. Redis keeps no record of what A reads; it remembers only the prefix.',
    lanes: trackLanes,
    initial: { a: 'cache: v1', redis: 'v1', b: '' },
    steps: [
      { from: 'b', to: 'redis', label: 'SET product:42', kind: 'write', state: { redis: 'v2' }, explanation: 'App B changes product:42, whose name starts with product:.' },
      { from: 'redis', to: 'a', label: 'invalidate', kind: 'write', state: { a: 'cache: empty' }, explanation: 'Redis sends A an invalidation for product:42, whether or not A ever read the key: it checks the name against the prefix, not a list of reads.' },
      { from: 'b', to: 'redis', label: 'SET order:7', kind: 'write', explanation: 'B writes a key that does not match the prefix.' },
      { at: 'a', note: 'no message', explanation: 'A hears nothing about order:7.' },
      { from: 'b', to: 'redis', label: 'SET product:42', kind: 'write', state: { redis: 'v3' }, explanation: 'B writes product:42 again, although A has not re-read it.' },
      { from: 'redis', to: 'a', label: 'invalidate', kind: 'write', explanation: 'A is told again. Broadcast mode never forgets, so it costs Redis no memory per key, but every change to a matching key reaches every client that registered the prefix.' },
    ],
  },
};

const raceLanes = [
  { id: 'a', label: 'App A', kind: 'app' },
  { id: 'redis', label: 'Redis', kind: 'redis' },
  { id: 'b', label: 'App B', short: 'App B', kind: 'app' },
];

export const raceSpecs = {
  plain: {
    label: 'An invalidation overtaking the reply it concerns',
    intro: 'App A reads on a data connection and receives invalidations on a second connection (CLIENT TRACKING ON REDIRECT), as RESP2 clients must. Redis holds product:42 = v1.',
    lanes: raceLanes,
    initial: { a: 'cache: empty', redis: 'v1', b: '' },
    steps: [
      { from: 'a', to: 'redis', label: 'GET (data)', kind: 'client', explanation: 'A misses its near cache and sends GET product:42 on its data connection. Redis executes it and records the read.' },
      { from: 'b', to: 'redis', label: 'SET v2', kind: 'write', state: { redis: 'v2' }, explanation: 'Just afterwards, B writes v2.' },
      { from: 'redis', to: 'a', label: 'invalidate', kind: 'write', explanation: 'Redis sends the invalidation on A’s other connection, and it happens to arrive first. A has nothing cached for the key yet, so there is nothing to drop.' },
      { from: 'redis', to: 'a', label: 'v1 (data)', kind: 'stale', departs: 0, state: { a: 'cache: v1 (stale)' }, explanation: 'The reply to the GET left Redis before the write was made (the sloping arrow starts at step 1), but it arrives late on the data connection, after the invalidation. A stores v1.' },
      { at: 'a', note: 'serves v1', kind: 'stale', explanation: 'No further invalidation is coming: Redis has already sent one and forgotten the key. A serves the stale v1 until its copy expires.' },
    ],
  },
  placeholder: {
    label: 'The same race with a placeholder',
    intro: 'The same two connections, but A marks a key as being fetched before it sends the read, as Redis’s client-side caching reference recommends.',
    lanes: raceLanes,
    initial: { a: 'cache: empty', redis: 'v1', b: '' },
    steps: [
      { at: 'a', note: 'placeholder', state: { a: 'cache: fetching' }, explanation: 'Before sending the GET, A puts a placeholder for product:42 in its near cache.' },
      { from: 'a', to: 'redis', label: 'GET (data)', kind: 'client', explanation: 'A sends GET product:42 on its data connection.' },
      { from: 'b', to: 'redis', label: 'SET v2', kind: 'write', state: { redis: 'v2' }, explanation: 'B writes v2.' },
      { from: 'redis', to: 'a', label: 'invalidate', kind: 'write', state: { a: 'cache: empty' }, explanation: 'The invalidation arrives first, as before, and this time it removes the placeholder.' },
      { from: 'redis', to: 'a', label: 'v1 (data)', kind: 'stale', departs: 1, explanation: 'The late reply, sent at step 2, arrives. A finds no placeholder, so it knows the value may already be out of date, returns it to this one request at most, and does not store it.' },
      { from: 'a', to: 'redis', label: 'GET (data)', kind: 'client', explanation: 'The next read misses and goes to Redis.' },
      { from: 'redis', to: 'a', label: 'v2 (data)', kind: 'hit', state: { a: 'cache: v2' }, explanation: 'A caches v2. With a single RESP3 connection carrying both replies and invalidations, the race cannot happen at all, because messages on one connection arrive in order.' },
    ],
  },
};
