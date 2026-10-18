// Scenarios for "Drawing asynchronous and event-driven interactions".
// They register into the shared `scenarios` table, so SequencePlayer renders them like the others.
import { Builder, scenarios } from './sequence-model';
import type { Participant } from './sequence-model';

const P: Record<string, Participant> = {
  api: { id: 'api', label: 'Repair API', short: 'API' },
  db: { id: 'db', label: 'Repair DB', short: 'DB' },
  queue: { id: 'queue', label: 'Email queue', short: 'Queue' },
  worker: { id: 'worker', label: 'Notification worker', short: 'Worker' },
  provider: { id: 'provider', label: 'Email provider', short: 'Provider' },
  sched: { id: 'sched', label: 'Scheduling' },
  topic: { id: 'topic', label: 'Repair events', short: 'Topic' },
  tech: { id: 'tech', label: 'Technician app', short: 'Tech app' },
  billing: { id: 'billing', label: 'Billing' },
  mina: { id: 'mina', label: 'Mina' },
  timer: { id: 'timer', label: 'Scheduler' },
  booking: { id: 'booking', label: 'Booking' },
  slots: { id: 'slots', label: 'Scheduling' },
  parts: { id: 'parts', label: 'Inventory' },
};

Object.assign(scenarios, {
  // Delivery, work and acknowledgement as three separate messages.
  ack: {
    title: 'Where the acknowledgement sits',
    params: [{ id: 'case', label: 'Case', default: 'ok', options: [
      { value: 'ok', label: 'Ack after the work' },
      { value: 'crash', label: 'Crash before the ack' },
      { value: 'early', label: 'Ack first, then crash' },
    ] }],
    build: (p: Record<string, string>) => {
      const b = new Builder([P.api, P.queue, P.worker, P.provider], { strip: true });
      b.status('provider', 'no email', '');
      b.pause(0.2);
      b.msg('api', 'queue', 'Publish J9', 'sync');
      b.msg('queue', 'api', 'Stored', 'reply');
      b.status('queue', 'holds', 'J9');
      b.gap('A worker is free', 0.7, 0);
      const send = () => {
        b.msg('worker', 'provider', 'POST /emails', 'sync');
        b.msg('provider', 'worker', '202 Accepted', 'reply');
      };
      b.msg('queue', 'worker', 'Deliver J9', 'async');
      b.status('queue', 'in flight', 'J9');
      if (p.case === 'early') {
        b.msg('worker', 'queue', 'Ack J9', 'async');
        b.status('queue', 'done', 'J9 removed');
        b.note(['worker'], 'Crashes before sending the email', { tone: 'warn' });
        b.status('worker', 'crashed', '');
        b.gap('Nothing is left to redeliver', 0.8, 0);
        return b.finish('The queue delivers J9 and the worker acknowledges it at once. The worker then crashes before it calls the email provider. The queue has already removed J9, so nothing offers it again and no email is ever sent.');
      }
      send();
      b.status('provider', 'sent', '1 email');
      if (p.case === 'crash') {
        b.note(['worker'], 'Crashes before sending the ack', { tone: 'warn' });
        b.status('worker', 'crashed', '');
        b.gap('The ack deadline passes, so J9 is offered again', 1.0, 0);
        b.msg('queue', 'worker', 'Deliver J9 (again)', 'async');
        send();
        b.status('provider', 'duplicate', '2 emails');
      }
      b.msg('worker', 'queue', 'Ack J9', 'async');
      b.status('queue', 'done', 'J9 removed');
      b.status('worker', 'done', '');
      return b.finish(p.case === 'ok'
        ? 'The queue delivers J9, the worker calls the email provider and gets 202 Accepted, and only then acknowledges J9. The queue removes it.'
        : 'The queue delivers J9 and the worker sends the email, but crashes before it acknowledges. The ack deadline passes, the queue delivers J9 again, and the provider sends a second email.');
    },
  },

  // One event, several subscribers.
  fanout: {
    title: 'One event, two subscribers',
    params: [{ id: 'case', label: 'Case', default: 'ok', options: [
      { value: 'ok', label: 'Both healthy' },
      { value: 'down', label: 'Billing is down' },
      { value: 'first', label: 'Billing answers first' },
    ] }],
    build: (p: Record<string, string>) => {
      const b = new Builder([P.sched, P.topic, P.tech, P.billing], { strip: true });
      b.status('tech', 'unaware', '');
      b.status('billing', 'unaware', '');
      b.pause(0.2);
      b.msg('sched', 'topic', 'Publish Scheduled A5', 'sync');
      b.msg('topic', 'sched', 'Stored', 'reply');
      b.pause(0.15);
      const down = p.case === 'down';
      b.frame('par', 'topic', 'billing', [
        { guard: '[technician app]', offset: p.case === 'first' ? 0.8 : 0.2, body: () => {
          b.msg('topic', 'tech', 'Scheduled A5', 'async');
          b.msg('tech', 'topic', 'Ack', 'async');
          b.status('tech', 'done', 'on route');
        } },
        { guard: '[billing]', offset: p.case === 'first' ? 0.2 : 0.8, body: () => {
          if (down) {
            b.msg('topic', 'billing', 'Scheduled A5', 'lost', { lostAt: 0.5 });
            b.status('billing', 'down', '');
            b.note(['topic', 'billing'], 'No ack from Billing', { tone: 'warn' });
          } else {
            b.msg('topic', 'billing', 'Scheduled A5', 'async');
            b.msg('billing', 'topic', 'Ack', 'async');
            b.status('billing', 'done', 'invoiced');
          }
        } },
      ]);
      if (down) {
        b.note(['topic', 'billing'], 'Assumes push delivery and a durable subscription: the topic keeps A5 for billing', { rows: 2 });
        b.gap('Billing is back 20 minutes later', 0.9, 0);
        b.msg('topic', 'billing', 'Scheduled A5 (again)', 'async');
        b.msg('billing', 'topic', 'Ack', 'async');
        b.status('billing', 'done', 'invoiced');
        return b.finish('Scheduling publishes the event once. The topic delivers it to the technician app and to billing as two separate messages. Billing is down, so the technician app acknowledges and puts A5 on the route while billing hears nothing. The figure assumes a durable subscription, so the topic keeps the event and delivers it to billing again twenty minutes later.');
      }
      return b.finish(`Scheduling publishes the event once. The topic delivers it to the technician app and to billing as two separate messages, each with its own acknowledgement. ${p.case === 'first' ? 'Here billing answers first.' : 'Here the technician app answers first.'} The diagram allows either order.`);
    },
  },

  // Two events sent in order and delivered in the other order.
  overtake: {
    title: 'Two events, one delivered out of order',
    params: [
      { id: 'order', label: 'Delivery', default: 'swapped', options: [{ value: 'order', label: 'In order' }, { value: 'swapped', label: 'Swapped' }] },
      { id: 'consumer', label: 'Billing', default: 'plain', options: [{ value: 'plain', label: 'Applies what arrives' }, { value: 'version', label: 'Checks the version' }] },
    ],
    build: (p: Record<string, string>) => {
      const b = new Builder([P.sched, P.topic, P.billing], { strip: true });
      const swapped = p.order === 'swapped';
      const version = p.consumer === 'version';
      b.status('billing', 'invoice', 'A5 open');
      b.pause(0.2);
      b.msg('sched', 'topic', 'Moved v2: 14 Oct', 'async');
      b.msg('sched', 'topic', 'Cancelled v3', 'async');
      b.pause(0.15);
      if (swapped) b.note(['topic'], 'Delivers v3 before v2', { tone: 'warn' });
      const moved = () => {
        b.msg('topic', 'billing', 'Moved v2: 14 Oct', 'async');
        if (swapped && version) {
          b.note(['billing'], 'Holds v3, so ignores v2', { tone: 'good' });
        } else if (swapped) {
          b.status('billing', 'wrong', 'billed for 14 Oct');
        } else {
          b.status('billing', 'invoice', 'A5 on 14 Oct');
        }
      };
      const cancelled = () => {
        b.msg('topic', 'billing', 'Cancelled v3', 'async');
        b.status('billing', 'void', 'A5 cancelled');
      };
      if (swapped) { cancelled(); moved(); } else { moved(); cancelled(); }
      const end = !swapped || version
        ? 'Billing ends with A5 cancelled.'
        : 'Billing ends with an invoice for a cancelled appointment, because it applied the older event last.';
      return b.finish(`Scheduling sends two events about A5, a move to 14 October (version 2) and then a cancellation (version 3). ${swapped ? 'The topic delivers them in the other order.' : 'The topic delivers them in the order they were sent.'} ${swapped && version ? 'Billing keeps the newest version it has seen and ignores version 2.' : ''} ${end}`.replace('  ', ' '));
    },
  },

  // A callback that carries a correlation id.
  webhook: {
    title: 'A bounce webhook and its correlation id',
    params: [{ id: 'when', label: 'The bounce arrives', default: 'late', options: [
      { value: 'late', label: 'Hours later' },
      { value: 'early200', label: 'Early, answered 200' },
      { value: 'stored', label: 'Early, stored first' },
    ] }],
    build: (p: Record<string, string>) => {
      const b = new Builder([P.worker, P.provider, P.api, P.db], { strip: true });
      b.pause(0.2);
      b.msg('worker', 'provider', 'POST /emails (J9)', 'sync');
      b.msg('provider', 'worker', '202 id m-481', 'reply');
      const save = () => {
        b.msg('worker', 'db', 'Save m-481 on J9', 'sync');
        b.msg('db', 'worker', 'OK', 'reply');
        b.status('worker', 'done', 'J9 sent');
      };
      if (p.when === 'late') {
        save();
        b.gap('Hours later, the email bounces', 0.9, 0);
        b.msg('provider', 'api', 'POST /bounce m-481', 'sync');
        b.msg('api', 'db', 'Find job for m-481', 'sync');
        b.msg('db', 'api', 'J9', 'reply');
        b.msg('api', 'db', 'J9: bounced', 'sync');
        b.msg('db', 'api', 'OK', 'reply');
        b.msg('api', 'provider', '200 OK', 'reply');
        b.status('api', 'done', 'J9 bounced');
        return b.finish('The worker sends the email and the provider replies 202 with its own message id, m-481. The worker saves m-481 on job J9. Hours later the provider posts a bounce that carries m-481. The Repair API finds J9 by that id, records the bounce and answers 200. The figure leaves out the signature check on the callback.');
      }
      b.note(['worker'], 'Has not saved m-481 yet', { tone: 'plain' });
      b.msg('provider', 'api', 'POST /bounce m-481', 'sync');
      if (p.when === 'early200') {
        b.msg('api', 'db', 'Find job for m-481', 'sync');
        b.msg('db', 'api', 'No match', 'reply');
        b.msg('api', 'provider', '200 OK', 'reply');
        b.status('api', 'lost', 'bounce dropped');
        save();
        return b.finish('The email bounces at once, before the worker has saved m-481 on J9. The Repair API finds no job for m-481 but still answers 200, so the provider does not send the bounce again. J9 never learns that the email bounced.');
      }
      // Stored first: keep the bounce as it arrived, answer 200, match it once the id is known.
      b.msg('api', 'db', 'Store bounce m-481', 'sync');
      b.msg('db', 'api', 'OK', 'reply');
      b.msg('api', 'provider', '200 OK', 'reply');
      save();
      b.gap('Next matching pass', 0.8, 0);
      b.msg('api', 'db', 'Match stored m-481', 'sync');
      b.msg('db', 'api', 'J9', 'reply');
      b.msg('api', 'db', 'J9: bounced', 'sync');
      b.msg('db', 'api', 'OK', 'reply');
      b.status('api', 'done', 'J9 bounced');
      return b.finish('The email bounces at once, before the worker has saved m-481 on J9. The Repair API stores the bounce as it arrived and answers 200. After the worker saves m-481, a later matching pass finds J9 and records the bounce.');
    },
  },

  // A flow that waits for a person for up to two days.
  confirm: {
    title: 'Waiting 48 hours for Mina',
    params: [{ id: 'when', label: 'Mina replies', default: 'prompt', options: [
      { value: 'prompt', label: 'Within hours' },
      { value: 'reminded', label: 'After the reminder' },
      { value: 'released', label: 'After the release' },
    ] }],
    build: (p: Record<string, string>) => {
      const b = new Builder([P.mina, P.api, P.timer], { strip: true });
      b.pause(0.2);
      b.msg('api', 'mina', 'Confirm appointment A5', 'async');
      b.msg('api', 'timer', 'Remind +24 h, release +48 h', 'sync');
      b.msg('timer', 'api', 'Timers stored', 'reply');
      b.status('api', 'holding', 'A5 held');
      b.note(['api'], 'Row saved: A5 held until Friday 10:00', { rows: 1.5 });
      const confirm = () => {
        b.msg('mina', 'api', 'Confirm A5', 'sync');
        b.msg('api', 'mina', 'Confirmed', 'reply');
        b.msg('api', 'timer', 'Cancel timers', 'sync');
        b.msg('timer', 'api', 'OK', 'reply');
        b.status('api', 'done', 'A5 confirmed');
      };
      if (p.when === 'prompt') {
        b.gap('2 hours later', 0.7, 0);
        confirm();
        return b.finish('The API offers appointment A5, holds its time and asks the scheduler to fire a reminder after 24 hours and a release after 48. Mina confirms two hours later, so the API confirms the appointment and cancels both timers.');
      }
      b.gap('24 hours later', 0.7, 0);
      b.msg('timer', 'api', 'Reminder due', 'async');
      b.msg('api', 'mina', 'Reminder: confirm A5', 'async');
      if (p.when === 'reminded') {
        b.gap('5 hours later', 0.7, 0);
        confirm();
        return b.finish('The scheduler fires the reminder after 24 hours and the API sends it. Mina confirms 5 hours later, still inside the 48 hours, so the API confirms the appointment and cancels the timers.');
      }
      b.gap('24 hours later, no reply', 0.8, 0);
      b.msg('timer', 'api', 'Release due', 'async');
      b.status('api', 'released', 'A5 free');
      b.msg('api', 'mina', 'A5 released', 'async');
      b.gap('The next morning', 0.7, 0);
      b.msg('mina', 'api', 'Confirm A5', 'sync');
      b.msg('api', 'mina', '409: A5 released', 'error');
      return b.finish('The scheduler fires the reminder after 24 hours and the release after 48. The API frees the time for A5 and tells Mina. When she confirms the next morning, the API refuses with 409, because the time is no longer held for her.');
    },
  },

  // A booking saga with compensation.
  saga: {
    title: 'A booking saga and its compensation',
    params: [{ id: 'deposit', label: 'Deposit', default: 'paid', options: [
      { value: 'paid', label: 'Accepted' },
      { value: 'declined', label: 'Declined' },
      { value: 'retry', label: 'Declined, reply lost' },
    ] }],
    build: (p: Record<string, string>) => {
      const b = new Builder([P.booking, P.slots, P.parts, P.billing], { strip: true });
      b.status('slots', 'free', '');
      b.status('parts', 'free', '');
      b.status('billing', 'free', '');
      b.pause(0.2);
      b.msg('booking', 'slots', 'Hold time for A5', 'sync');
      b.msg('slots', 'booking', 'Held', 'reply');
      b.status('slots', 'held', 'A5');
      b.msg('booking', 'parts', 'Reserve part P3', 'sync');
      b.msg('parts', 'booking', 'Reserved', 'reply');
      b.status('parts', 'reserved', 'P3');
      b.msg('booking', 'billing', 'Take deposit', 'sync');
      if (p.deposit === 'paid') {
        b.msg('billing', 'booking', 'Paid', 'reply');
        b.status('billing', 'done', 'paid');
        b.note(['booking'], 'Booking confirmed', { tone: 'good' });
        return b.finish('The booking service holds the time for A5, reserves part P3 and takes the deposit. All three succeed, so the booking is confirmed.');
      }
      b.msg('billing', 'booking', 'Declined', 'error');
      b.note(['booking'], 'Undo completed steps, latest first', { tone: 'warn' });
      b.msg('booking', 'parts', 'Release part P3', 'sync');
      if (p.deposit === 'retry') {
        b.msg('parts', 'booking', 'Released', 'lost', { lostAt: 0.5 });
        b.status('parts', 'free', '');
        b.note(['booking'], 'No reply: send the release again', { tone: 'warn' });
        b.msg('booking', 'parts', 'Release part P3 (again)', 'sync');
        b.note(['parts'], 'Already released: changes nothing', { tone: 'good' });
      }
      b.msg('parts', 'booking', 'Released', 'reply');
      b.status('parts', 'free', '');
      b.msg('booking', 'slots', 'Release time for A5', 'sync');
      b.msg('slots', 'booking', 'Released', 'reply');
      b.status('slots', 'free', '');
      return b.finish(p.deposit === 'retry'
        ? 'The deposit is declined after the time and the part were taken. The inventory service releases the part, but its reply is lost. The booking service hears nothing and sends the release again, so inventory sees it twice and has to handle the second safely. It then releases the time for A5.'
        : 'The deposit is declined after the time and the part were taken. The booking service releases the part, then the time, in the reverse of the order it took them. Between the first hold and the last release, other customers could not book A5.');
    },
  },
});
