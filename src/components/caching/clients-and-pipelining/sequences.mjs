// Step-by-step sequences for the stepped figures in "Redis clients". Every Redis
// command and reply shown was run against Redis 8.10.3 (see the evidence file);
// the TCP and TLS messages follow the protocols' handshakes and were not captured.

const rt = n => `${n} round trip${n === 1 ? '' : 's'}`;

/** Figure 4: opening a connection for one GET, against borrowing one from a pool. */
export const connectSpecs = {
  fresh: {
    label: 'Opening a new TLS connection to Redis for one GET',
    intro: 'The application needs product:42 and opens a new connection to get it: TCP, then TLS 1.3, then HELLO with credentials, then the GET.',
    lanes: [{ id: 'app', label: 'Application', kind: 'app' }, { id: 'redis', label: 'Redis', kind: 'redis' }],
    initial: { app: rt(0) },
    steps: [
      { from: 'app', to: 'redis', label: 'SYN', kind: 'client', explanation: 'TCP: the client asks to open a connection. It cannot send anything else until the server answers.' },
      { from: 'redis', to: 'app', label: 'SYN-ACK', kind: 'client', state: { app: rt(1) }, explanation: 'The server accepts. One round trip has passed and no data has moved.' },
      { from: 'app', to: 'redis', label: 'ClientHello', kind: 'client', explanation: 'TLS 1.3 begins: the client sends its key share and the ciphers it supports.' },
      { from: 'redis', to: 'app', label: 'ServerHello', kind: 'client', state: { app: rt(2) }, explanation: 'The server answers with its key share, its certificate and its Finished message. That is the second round trip. (TLS 1.2 needs two here.)' },
      { from: 'app', to: 'redis', label: 'HELLO 3 AUTH', kind: 'client', explanation: 'The client finishes TLS and, in the same flight, sends HELLO with a user name and password to choose the protocol and authenticate.' },
      { from: 'redis', to: 'app', label: 'server info', kind: 'client', state: { app: rt(3) }, explanation: 'Redis replies with its version and the connection\'s settings. Third round trip.' },
      { from: 'app', to: 'redis', label: 'GET', kind: 'client', explanation: 'Only now does the request the application wanted go out.' },
      { from: 'redis', to: 'app', label: 'value', kind: 'hit', state: { app: rt(4) }, explanation: 'The value arrives after four round trips, three of them spent setting up a connection that will now be closed.' },
    ],
  },
  pooled: {
    label: 'Borrowing an open connection from a pool for one GET',
    intro: 'The application needs product:42. Its client library keeps a pool of connections that were opened, secured and authenticated earlier.',
    lanes: [{ id: 'app', label: 'Application', kind: 'app' }, { id: 'redis', label: 'Redis', kind: 'redis' }],
    initial: { app: rt(0) },
    steps: [
      { at: 'app', note: 'borrow from pool', explanation: 'The application takes an idle connection from the pool. No message is sent.' },
      { from: 'app', to: 'redis', label: 'GET', kind: 'client', explanation: 'The GET goes out at once on the open connection.' },
      { from: 'redis', to: 'app', label: 'value', kind: 'hit', state: { app: rt(1) }, explanation: 'One round trip, the one the application wanted.' },
      { at: 'app', note: 'return to pool', explanation: 'The connection goes back into the pool, still open, for the next request.' },
    ],
  },
};

/** Figure 5: a command that times out on the client still runs on the server. */
const timeoutSpec = ({ command, key, before, after, retryReply, explainRun, explainEnd }) => ({
  label: `A client times out on ${command} and retries`,
  intro: `Redis holds ${key} = ${before}. The application's command timeout is 100 ms. Another client is about to run a command that holds Redis's main thread for 500 ms.`,
  lanes: [{ id: 'app', label: 'Application', kind: 'app' }, { id: 'redis', label: 'Redis', kind: 'redis' }, { id: 'other', label: 'Other client', kind: 'client' }],
  initial: { redis: `${key} = ${before}` },
  steps: [
    { from: 'other', to: 'redis', label: 'slow command', kind: 'client', state: { redis: `${key} = ${before}, busy` }, explanation: 'Another client\'s slow command starts. Until it finishes, Redis executes nothing else. (On my server: DEBUG SLEEP 0.5.)' },
    { from: 'app', to: 'redis', label: command, kind: 'write', explanation: `The application sends ${command}. It reaches Redis's machine and waits, unread, in the connection's socket buffer.` },
    { at: 'app', note: 'times out', kind: 'error', explanation: 'After 100 ms the client library gives up and closes the connection, since a late reply on it would otherwise reach the next request to use it. Nothing in that tells Redis to skip the command.' },
    { at: 'redis', note: `runs ${command.split(' ')[0]}`, kind: 'write', state: { redis: `${key} = ${after[0]}` }, explanation: explainRun },
    { from: 'app', to: 'redis', label: `${command.split(' ')[0]} again`, kind: 'write', explanation: 'The application retries on a new connection, as redis-py and go-redis do by default.' },
    { from: 'redis', to: 'app', label: retryReply, kind: 'hit', state: { redis: `${key} = ${after[1]}` }, explanation: explainEnd },
  ],
});

/** Figure 5, third choice: a retried SET lands after another writer's newer SET. */
const raceSpec = {
  label: 'A client times out on SET price 35 and retries, while writer B stores a newer price',
  intro: 'Redis holds price = 39. The application\'s command timeout is 100 ms. Another client is about to hold Redis\'s main thread for 500 ms, and writer B is about to store a newer price, 36.',
  lanes: [{ id: 'app', label: 'Application', short: 'App', kind: 'app' }, { id: 'redis', label: 'Redis', kind: 'redis' }, { id: 'b', label: 'Writer B', short: 'B', kind: 'app' }, { id: 'other', label: 'Slow client', short: 'Slow', kind: 'client' }],
  initial: { redis: 'price = 39' },
  steps: [
    { from: 'other', to: 'redis', label: 'slow command', kind: 'client', state: { redis: 'price = 39, busy' }, explanation: 'Another client\'s slow command starts. Until it finishes, Redis executes nothing else.' },
    { from: 'app', to: 'redis', label: 'SET price 35', kind: 'write', explanation: 'The application sends SET price 35. It waits, unread, in the connection\'s socket buffer.' },
    { from: 'b', to: 'redis', label: 'SET price 36', kind: 'write', explanation: 'Writer B has a newer price and sends SET price 36. It waits behind the application\'s command.' },
    { at: 'app', note: 'times out', kind: 'error', explanation: 'After 100 ms the application\'s client library gives up and closes the connection.' },
    { at: 'redis', note: 'runs both SETs', kind: 'write', state: { redis: 'price = 36' }, explanation: 'The slow command ends. Redis runs the application\'s SET, then B\'s: price is 36, the newest value. Had nothing retried, the cache would now be right.' },
    { from: 'app', to: 'redis', label: 'SET again', kind: 'stale', state: { redis: 'price = 35, stale' }, explanation: 'The application retries on a new connection, as its library does by default. The retry runs after B\'s write.' },
    { from: 'redis', to: 'app', label: 'OK', kind: 'hit', explanation: 'The retry puts the older price back, and the application sees OK. B\'s change is lost until something writes the key again. Running SET twice was harmless; running it late was not.' },
  ],
};

export const timeoutSpecs = {
  incr: timeoutSpec({
    command: 'INCR views', key: 'views', before: 100, after: [101, 102], retryReply: '102',
    explainRun: 'The slow command ends. Redis reads the waiting INCR and runs it: views is now 101. The reply goes to a connection nobody is reading.',
    explainEnd: 'The retry runs too. One page view has been counted twice, and the application has no way to tell from the reply.',
  }),
  set: timeoutSpec({
    command: 'SET price 35', key: 'price', before: 39, after: [35, 35], retryReply: 'OK',
    explainRun: 'The slow command ends. Redis reads the waiting SET and runs it: price is now 35. The reply goes to a connection nobody is reading.',
    explainEnd: 'The retry sets the same value again. Running it twice left the same result as running it once, so this retry was safe, because nobody else wrote price in between.',
  }),
  race: raceSpec,
};

/** Figure 8: set only if newer, with WATCH, when another writer gets in first. */
export const watchSpec = {
  label: 'Writer A uses WATCH to store version 9 only if the cache holds an older version; writer B stores version 10 in between',
  intro: 'Redis caches product:42 as a hash with fields version and value, at version 8. Writer A has just read version 9 from the database and wants to store it, but only if the cache holds something older. Writer B has version 10.',
  lanes: [{ id: 'a', label: 'Writer A', kind: 'app' }, { id: 'redis', label: 'Redis', kind: 'redis' }, { id: 'b', label: 'Writer B', kind: 'app' }],
  initial: { redis: 'version 8', a: rt(0) },
  steps: [
    { from: 'a', to: 'redis', label: 'WATCH, HGET version', kind: 'client', explanation: 'A asks Redis to watch product:42 and, in the same round trip, reads the cached version. Nothing is locked: B can still write.' },
    { from: 'redis', to: 'a', label: 'OK, 8', kind: 'hit', state: { a: rt(1) }, explanation: 'Version 8 is older than A\'s 9, so A decides to write.' },
    { from: 'b', to: 'redis', label: 'HSET version 10', kind: 'write', state: { redis: 'version 10' }, explanation: 'Before A\'s write arrives, B stores version 10. Redis marks every connection watching product:42.' },
    { from: 'a', to: 'redis', label: 'MULTI…EXEC', kind: 'write', explanation: 'A sends MULTI, HSET version 9 with its value, EXPIRE and EXEC together in one round trip.' },
    { from: 'redis', to: 'a', label: 'nil', kind: 'error', state: { a: rt(2) }, explanation: 'EXEC replies nil: a watched key changed, so none of A\'s queued commands ran. Version 10 stays. Uncontested, A would have finished here, in two round trips.' },
    { from: 'a', to: 'redis', label: 'WATCH, HGET version', kind: 'client', explanation: 'A starts again from the top: watch, then read.' },
    { from: 'redis', to: 'a', label: 'OK, 10', kind: 'hit', state: { a: rt(3) }, explanation: 'The cache now holds version 10, which is newer than A\'s 9, so A will not write: its write would have gone backwards.' },
    { from: 'a', to: 'redis', label: 'UNWATCH', kind: 'client', explanation: 'A cancels its watch. Without UNWATCH (or EXEC or DISCARD) the watch would stay on the connection and affect whoever uses it next.' },
    { from: 'redis', to: 'a', label: 'OK', kind: 'hit', state: { a: rt(4) }, explanation: 'Four round trips in all, ending with version 10 in place.' },
  ],
};
