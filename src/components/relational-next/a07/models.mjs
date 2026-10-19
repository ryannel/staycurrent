export function capacity(rate, hours) {
  const free = 96 - rate * hours;
  const reserve = 32;
  return { free, reserve, hoursToReserve: Math.max(0, (free - reserve) / rate), act: (free - reserve) / rate <= 8 };
}

export function copyState(wait, step) {
  return {
    acknowledged: step >= (wait === 'standby' ? 2 : 1),
    writer: step < 1 ? 'No order 103' : step < 4 ? 'Order 103' : '103 deleted',
    durable: step < 2 ? 'No order 103' : step < 5 ? 'Order 103 durable' : 'Deletion durable',
    readable: step < 3 ? 'No order 103' : step < 5 ? 'Order 103 visible' : '103 deleted',
  };
}

export const incidents = [
  {
    phase: '1 · Establish impact and ownership',
    note: 'Both incidents begin with a customer-visible failure. Name an incident lead and a database operator; start a record of observations, decisions and times.',
    overload: ['09:12 · Orders time out', 'The API cannot finish new orders. Its database pool is full. The incident lead pauses unrelated deployments and asks the operator to compare demand, active work and waits.'],
    deletion: ['09:12 · Paid orders missing', 'Support reports order 101 missing. Database queries still answer quickly. The incident lead involves the application owner and stops the suspect cleanup job.'],
  },
  {
    phase: '2 · Preserve evidence and recovery choices',
    note: 'Contain harm promptly. Capture evidence alongside containment; do not delay stopping an identified destructive job just to collect a perfect trace.',
    overload: ['09:13 · Save the changing evidence', 'Capture request rates, pool queues, active statements, waits, recent changes and logs with timestamps. A restart would clear sessions without explaining why they accumulated.'],
    deletion: ['09:13 · Keep the current history', 'Retain job identity, audit evidence, affected identifiers, backup catalogue and transaction history. Preserve a supported copy of the current state for comparison and valid later orders.'],
  },
  {
    phase: '3 · Test competing explanations',
    note: 'A full pool is a symptom. Missing data is evidence of a different class of incident even when every infrastructure dashboard is green.',
    overload: ['09:14 · A report workload arrived', 'In this invented case, active reporting work and CPU rose with a scheduled batch; lock waits did not. That supports demand saturation. A blocking transaction would require a different action.'],
    deletion: ['09:15 · A committed cleanup removed data', 'Job evidence identifies deletion at 09:10. The replica has applied it too. The application owner establishes which orders and dependent records were affected.'],
  },
  {
    phase: '4 · Contain the continuing damage',
    note: 'Choose the smallest supported intervention that arrests the observed damage while retaining the route back. Record its owner and stop condition.',
    overload: ['09:15 · Pause the reporting batch', 'Use the prepared workload control to stop new batch work and bound incoming demand. Observe whether active work and the request queue fall. Escalate if they do not.'],
    deletion: ['09:16 · Hold affected writes and effects', 'Keep the cleanup stopped. Coordinate writes to affected orders and pause their fulfilment work while preserving unaffected service where safe. Do not promote a replica that contains the same deletion.'],
  },
  {
    phase: '5 · Select and execute a prepared procedure',
    note: 'The procedure must fit the observed loss. An unverified recovery target, missing history or unresolved data conflict is a reason to stop and revise the plan.',
    overload: ['09:16 · Restore capacity', 'The queue drains after reporting is paused. Keep that workload held while the performance owner investigates. No data restore or writer promotion is needed on this evidence.'],
    deletion: ['09:20–09:48 · Restore separately, then repair', 'The restoration owner reconstructs the state before 09:10 in isolation. The application owner compares it with the current state, retains valid order 106 and approves a checked repair of the missing order facts.'],
  },
  {
    phase: '6 · Apply the return-to-traffic gate',
    note: 'A listening database is one check. The incident lead also needs evidence of correct data, application access, exclusive write authority, controlled demand and owned reconciliation.',
    overload: ['09:18 · Verify the recovery', 'New order, status lookup and stock checks pass through the application. Error rate, latency and queue remain acceptable under a bounded return of traffic. Uncertain requests go to reconciliation.'],
    deletion: ['09:52 · Verify the repaired facts', 'Check affected orders, items, payment references and stock obligations, then application reads and writes. Reconcile already sent fulfilment messages before resuming those effects. Keep the comparison copy.'],
  },
  {
    phase: '7 · Resume deliberately and record the result',
    note: 'These clocks are illustrative, not a rehearsal result. Record measured interruption, affected operations, actual loss, remaining uncertainty and the follow-up owner in a real incident.',
    overload: ['09:19 · Controlled traffic resumed', 'The illustrative interruption is 7 minutes, within the ten-minute overload budget. No acknowledged-order loss was found in this scenario. Reduce the reporting batch budget and verify its effect before restarting it.'],
    deletion: ['09:54 · Affected workflow resumed', 'The illustrative interruption is 42 minutes, within the 60-minute mistake budget. The scenario assumes all missing facts were repaired and later work reconciled; an unresolved order would keep the gate closed. Restrict and test cleanup access.'],
  },
];

export const copySteps = [
  'The application asks the writer to create order 103. No copy contains it yet.',
  'The writer has flushed the commit locally. A local-only acknowledgement can return now. If this writer and its storage are lost here, this replica cannot preserve order 103.',
  'The selected standby has flushed the commit. A standby-flush acknowledgement can now return, but its query view has not replayed the change yet.',
  'The replica replays the commit. A new query there can now see order 103. Receiving and preserving the change happened before making it readable.',
  'An authorised but mistaken cleanup deletes order 103 on the writer. Both acknowledgement policies can faithfully preserve a wrong change.',
  'The replica replays the deletion too. A retained base copy and complete log history can reconstruct an earlier state separately; the live replica is no longer that earlier state.',
];

export const capacityHours = [0, 2, 4, 6];

export function readingDelay(text) {
  return Math.max(6500, text.trim().split(/\s+/).length * 270);
}
