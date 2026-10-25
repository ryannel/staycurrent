export const work = { id: 'order-103-ack', order: 103, total: '29.00', kind: 'order_received' };

export function deliverySteps(stop, deduplicate) {
  const before = stop === 'before';
  const finished = stop === 'finished';
  const effect = deduplicate || before || finished ? 1 : 2;
  const steps = [
    { db: 'ready · completion absent', receiver: 0, worker: 'Committed work is ready for the relay', action: 'Read order-103-ack from the outbox', explanation: 'Order 103 and its acknowledgement intention have committed. Nothing has been accepted by the receiver yet.' },
  ];
  if (!before) steps.push({ db: 'running · completion absent', receiver: 1, worker: 'Relay sends the fixed ID and payload', action: 'Relay → receiver: order-103-ack', explanation: 'The receiver accepts the acknowledgement. Its acceptance and the shop’s completion record belong to different systems.' });
  if (finished) steps.push({ db: 'done · acceptance recorded', receiver: 1, worker: 'Relay records the acceptance', action: 'Relay → shop DB: finish current claim', explanation: 'The shop records completion after the receiver’s reply. A later poll does not select this finished row.' });
  steps.push({ db: finished ? 'done · acceptance recorded' : 'running · completion absent', receiver: before ? 0 : 1, worker: 'Relay stops', action: 'Process lost', explanation: before ? 'The relay stops before making the call. The intention remains unfinished, so recovery still has something to find.' : finished ? 'The relay stops after recording completion. Both systems have the evidence they need for this delivery.' : 'The relay stops after acceptance but before recording completion. This includes a lost reply: the shop cannot tell whether acceptance happened.' });
  if (!finished) {
    steps.push({ db: 'running · new claim', receiver: before ? 0 : 1, worker: 'Recovery reuses the same work ID', action: 'After lease expiry: claim and send again', explanation: 'A replacement relay delivers order-103-ack with the original payload. Making a new work ID here would hide the retry from the receiver.' });
    steps.push({ db: 'done · acceptance recorded', receiver: effect, worker: 'Replacement records completion', action: deduplicate && !before ? 'Receiver → relay: existing result' : 'Receiver → relay: accepted', explanation: !before && deduplicate ? 'The example receiver recognises the ID and matching payload, returns its saved result and leaves one accepted acknowledgement.' : !before ? 'With no receiver deduplication, the same intention is accepted twice. The outbox can now say done, but it could not prevent that second acceptance.' : 'The recovered call is the first acceptance. The relay records it, leaving one accepted acknowledgement.' });
  }
  return steps;
}

export const leaseSteps = [
  { db: 'A · generation 7', deadline: '10:17:00 UTC', a: 'working with claim 7', b: 'no claim', action: '10:16:00 · A commits its claim', explanation: 'The row lock ends at COMMIT. The stored owner, generation and lease deadline remain in the row.' },
  { db: 'A · generation 7', deadline: '10:17:00 UTC', a: 'paused; may resume', b: 'no claim', action: '10:16:20 · A stops responding', explanation: 'A may have crashed, or it may merely be paused. The database cannot distinguish those cases from a missed heartbeat.' },
  { db: 'A · generation 7 · expired', deadline: '10:17:00 UTC', a: 'still paused', b: 'eligible to claim', action: '10:17:00 · database clock reaches expiry', explanation: 'The lease no longer excludes another claimant. Expiry records no fact about whether A’s process or an earlier remote request has stopped.' },
  { db: 'B · generation 8', deadline: '10:18:01 UTC', a: 'still holds stale claim 7', b: 'working with claim 8', action: '10:17:01 · B reclaims the same work', explanation: 'B increments the stored generation to 8. The work ID is still order-103-ack; this is another claim for the same intention.' },
  { db: 'B · generation 8', deadline: '10:18:01 UTC', a: 'resumes; completion rejected', b: 'still current', action: '10:17:02 · A tries to finish with generation 7', explanation: 'The guarded update matches zero rows. A has lost authority to change this job, even if its external call succeeded. An update guarded only by work_id would wrongly finish B’s claim.' },
  { db: 'done · generation 8', deadline: 'cleared', a: 'must stop; remote call may persist', b: 'completion accepted', action: '10:17:03 · B finishes with generation 8', explanation: 'B’s current, unexpired claim can finish. Receiver deduplication is still needed if A and B both made the external call; the database guard cannot retract A’s request.' },
];
