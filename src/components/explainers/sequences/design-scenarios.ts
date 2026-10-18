// Scenarios for reading a design from its sequence diagram, in the Sequence diagrams article.
// They register into the shared `scenarios` table, so SequencePlayer renders them like the others.
import { Builder, scenarios } from './sequence-model';
import type { Participant, ScenarioDef } from './sequence-model';

const P: Record<string, Participant> = {
  client: { id: 'client', label: 'Browser' },
  server: { id: 'server', label: 'Repair API', short: 'API' },
  api: { id: 'api', label: 'Repair API', short: 'API' },
  ui: { id: 'ui', label: 'Browser' },
  db: { id: 'db', label: 'Repair DB', short: 'DB' },
  customers: { id: 'customers', label: 'Customer service', short: 'Customers' },
  slots: { id: 'slots', label: 'Scheduling' },
  parts: { id: 'parts', label: 'Inventory' },
  billing: { id: 'billing', label: 'Billing' },
  browser: { id: 'browser', label: 'Mina’s browser', short: 'Browser' },
  app: { id: 'app', label: 'Repair app server', short: 'Repair app' },
  auth: { id: 'auth', label: 'Sign-in provider', short: 'Sign-in' },
};

const defs: Record<string, ScenarioDef> = {
  // Figure 4 of the deep dive: the outbox when everything works. Its failures are drawn in the companion.
  outboxPath: {
    title: 'A job in the database',
    params: [],
    build: () => scenarios.outbox.build({ case: 'ok' }),
  },

  // TLS 1.2 against TLS 1.3, drawn as an RFC ladder with its legend. One-way trips take 25 ms.
  tls: {
    title: 'Round trips before the first request',
    params: [{ id: 'v', label: 'Protocol', default: '12', options: [{ value: '12', label: 'TLS 1.2' }, { value: '13', label: 'TLS 1.3' }] }],
    build: p => {
      const b = new Builder([P.client, P.server], { clock: true });
      b.pause(0.2);
      if (p.v === '12') {
        b.msg('client', 'server', 'ClientHello', 'sync', { ms: 25 }); b.pause(0.15);
        b.msg('server', 'client', 'ServerHello … ServerKeyExchange*, ServerHelloDone', 'reply', { ms: 25 }); b.pause(0.15);
        b.msg('client', 'server', 'ClientKeyExchange, ChangeCipherSpec, Finished', 'sync', { ms: 25 }); b.pause(0.15);
        b.msg('server', 'client', 'ChangeCipherSpec, Finished', 'reply', { ms: 25 }); b.pause(0.15);
        b.note(['client'], 'Two round trips: 100 ms before the request can go', { tone: 'warn', rows: 1.4 });
        b.msg('client', 'server', 'GET /repairs/R17', 'sync', { ms: 25 });
        return b.finish('A full TLS 1.2 handshake. The browser sends ClientHello and waits for the server’s flight: ServerHello, Certificate*, ServerKeyExchange* and ServerHelloDone. It then sends its key exchange and Finished and waits for the server’s Finished. Only after those two round trips, 100 ms at 50 ms each, can it send GET /repairs/R17.');
      }
      b.msg('client', 'server', 'ClientHello + key_share', 'sync', { ms: 25 }); b.pause(0.15);
      b.msg('server', 'client', 'ServerHello + key_share, {Certificate* … Finished}', 'reply', { ms: 25 }); b.pause(0.15);
      b.note(['client'], 'One round trip: 50 ms', { tone: 'good' });
      b.msg('client', 'server', '{Finished}, [GET /repairs/R17]', 'sync', { ms: 25 });
      return b.finish('TLS 1.3. The browser sends ClientHello with a key share and waits for the server’s one flight, which ends with Finished and is protected from EncryptedExtensions onward, shown in braces. The browser’s next message carries its own Finished and, in square brackets, the request itself, after one round trip of 50 ms.');
    },
  },

  // The same booking with central and delegated control.
  control: {
    title: 'The same booking, fork or stair',
    params: [{ id: 'shape', label: 'Control', default: 'fork', options: [{ value: 'fork', label: 'Central (fork)' }, { value: 'stair', label: 'Delegated (stair)' }] }],
    build: p => {
      const b = new Builder([P.api, P.slots, P.parts, P.billing], { bars: true });
      b.pause(0.2);
      if (p.shape === 'fork') {
        b.call('api', 'slots', 'Hold time for A5', 'Held');
        b.call('api', 'parts', 'Reserve part P3', 'Reserved');
        b.call('api', 'billing', 'Take deposit', 'Paid');
        return b.finish('Central control. The Repair API calls Scheduling to hold the time, then Inventory to reserve the part, then Billing to take the deposit, and hears each reply itself. The arrows fan out from one lifeline like the tines of a fork.');
      }
      b.call('api', 'slots', 'Book A5', 'Booked', {
        inner: () => b.call('slots', 'parts', 'Reserve part P3', 'Reserved', {
          inner: () => b.call('parts', 'billing', 'Take deposit', 'Paid'),
        }),
      });
      return b.finish('Delegated control. The Repair API asks Scheduling to book A5. Scheduling asks Inventory to reserve the part, and Inventory asks Billing for the deposit. The replies come back up the same chain, so the arrows step down and back like a stair, and each caller waits for everything below it.');
    },
  },

  // A page of repairs that asks for each customer separately, or once.
  chatty: {
    title: 'One call per repair',
    params: [{ id: 'calls', label: 'Customer lookups', default: 'each', options: [{ value: 'each', label: 'One per repair' }, { value: 'batch', label: 'One batched call' }] }],
    build: p => {
      const b = new Builder([P.ui, P.api, P.db, P.customers], { clock: true });
      b.pause(0.2);
      b.msg('ui', 'api', 'GET /repairs?day=today', 'sync', { ms: 30 }); b.pause(0.12);
      b.msg('api', 'db', 'SELECT today’s repairs', 'sync', { ms: 1 }); b.pause(0.12, 3);
      b.msg('db', 'api', '10 rows', 'reply', { ms: 1 }); b.pause(0.12);
      if (p.calls === 'each') {
        b.loop('[each of 10 repairs]', 'api', 'customers', 10, () => {
          b.msg('api', 'customers', 'GET /customers/{id}', 'sync', { ms: 10, T: 0.3 });
          b.msg('customers', 'api', '200: customer', 'reply', { ms: 10, T: 0.3 });
        });
      } else {
        b.msg('api', 'customers', 'GET /customers?ids=… (10 ids)', 'sync', { ms: 10 }); b.pause(0.12, 2);
        b.msg('customers', 'api', '200: 10 customers', 'reply', { ms: 10 }); b.pause(0.12);
      }
      b.msg('api', 'ui', '200: 10 repairs', 'reply', { ms: 30 });
      return b.finish(p.calls === 'each'
        ? 'The browser asks for today’s repairs. The API reads 10 rows from Repair DB, then calls Customer service once for each repair inside a loop, ten round trips one after another, before it answers. The loop is drawn once and runs ten times.'
        : 'The browser asks for today’s repairs. The API reads 10 rows from Repair DB, then asks Customer service for all ten customers in one call, and answers. Two round trips from the API instead of eleven.');
    },
  },

  // The OAuth authorization code flow, with a box for each party's systems.
  oauth: {
    title: 'What crosses the browser when Mina signs in',
    params: [],
    build: () => {
      const b = new Builder([P.browser, P.app, P.auth], { groups: [
        { label: 'Mina’s device', from: 'browser', to: 'browser' },
        { label: 'Repair service', from: 'app', to: 'app' },
        { label: 'Provider', from: 'auth', to: 'auth' },
      ] });
      b.pause(0.2);
      b.msg('browser', 'app', 'GET /sign-in', 'sync'); b.pause(0.15);
      b.msg('app', 'browser', '302 to provider + code_challenge', 'reply'); b.pause(0.15);
      b.msg('browser', 'auth', 'GET /authorize', 'sync'); b.pause(0.15);
      b.note(['auth'], 'Mina signs in', { T: 0.5 });
      b.msg('auth', 'browser', '302 to app with code', 'reply'); b.pause(0.15);
      b.msg('browser', 'app', 'GET /callback?code=…', 'sync'); b.pause(0.15);
      b.msg('app', 'auth', 'POST /token: code, secret, code_verifier', 'sync'); b.pause(0.15);
      b.msg('auth', 'app', 'ID token + access token', 'reply'); b.pause(0.15);
      b.msg('app', 'browser', 'Signed in (session cookie)', 'reply');
      return b.finish('Three boxes: Mina’s device holds the browser, the repair service holds its app server, and the provider holds its sign-in server. The browser is redirected to the provider with a code_challenge, Mina signs in at the provider, and the provider redirects her back to the app with a code, so the code passes through the browser. The app then sends the code, its client secret and the matching code_verifier straight to the provider and gets an ID token and an access token back. The tokens never enter Mina’s device.');
    },
  },
};

Object.assign(scenarios, defs);
