const step = (a, b, holder, value, explanation) => ({ a, b, holder, value, explanation });

export const mug = {
  id: 'lock-lifetime', number: 1, title: 'The row stays locked after the statement returns',
  labels: ['Mina · purchase 103', 'Tariq · purchase 104'],
  resource: 'Product P7 · Blue mug', valueLabel: 'Committed stock',
  caption: 'A separate last-mug illustration at PostgreSQL Read Committed. Only the mug step is drawn. Mina commits first; Tariq rolls back purchase 104 when its guarded change returns no row. The ordinary-read option is an observation, not a purchase decision.',
  options: [
    { value: 'write', label: 'Guarded change', steps: [
      step('BEGIN; subtract one mug if stock ≥ 1', 'Not started', 'Mina holds P7', '1', 'Mina’s UPDATE returns one row, with stock 0. It has not committed. P7’s row lock belongs to the transaction.'),
      step('Statement finished; transaction open', 'UPDATE P7: waiting', 'Mina holds P7 → Tariq waits', '1', 'Tariq asks to change P7 too. His UPDATE cannot finish while Mina holds the conflicting row lock.'),
      step('COMMIT', 'Still waiting for Mina to finish', 'Mina releases P7 at transaction end', '0', 'Mina commits. Stock 0 becomes visible, and her row lock is released. Finishing the earlier UPDATE did not release it.'),
      step('Purchase 103 committed', 'Condition tested again: 0 ≥ 1 is false', 'No holder', '0', 'Tariq’s UPDATE can continue, but P7 no longer has a mug. It returns no row. Waiting was not a promise that the purchase would succeed.'),
      step('Mina keeps the mug', 'ROLLBACK purchase 104', 'No holder', '0', 'The caller refuses Tariq’s purchase and rolls back any of its earlier work. Mina wins the last mug.')
    ]},
    { value: 'lock', label: 'Locking read', steps: [
      step('BEGIN; subtract one mug if stock ≥ 1', 'Not started', 'Mina holds P7', '1', 'Mina’s change leaves P7 locked until her transaction ends.'),
      step('Statement finished; transaction open', 'SELECT P7 FOR UPDATE: waiting', 'Mina holds P7 → Tariq waits', '1', 'A locking read asks for its own conflicting lock. Tariq must wait even though his statement is a SELECT.'),
      step('COMMIT', 'Waiting ends', 'Mina releases P7', '0', 'Mina commits. Tariq can now acquire the lock.'),
      step('Purchase 103 committed', 'Lock acquired; reads stock 0', 'Tariq holds P7', '0', 'At Read Committed, Tariq locks and reads the updated row. An explicit lock does not create stock; he still has to check it.'),
      step('Mina keeps the mug', 'ROLLBACK purchase 104', 'No holder', '0', 'Tariq refuses the purchase and ends his transaction, releasing his lock.')
    ]},
    { value: 'read', label: 'Ordinary read', steps: [
      step('BEGIN; subtract one mug if stock ≥ 1', 'Not started', 'Mina holds P7', '1', 'Mina has changed stock to 0 in her transaction, but committed stock is still 1.'),
      step('Transaction open', 'SELECT stock: returns 1', 'Mina holds P7; reader proceeds', '1', 'An ordinary snapshot read does not wait for this row lock. Tariq reads the committed stock of 1, not Mina’s uncommitted 0.'),
      step('COMMIT', 'Earlier result still says 1', 'No holder', '0', 'Mina commits stock 0. A value already returned to Tariq does not change with it.'),
      step('Purchase 103 committed', 'A new SELECT returns 0', 'No holder', '0', 'A later Read Committed SELECT sees the committed stock 0. Neither read reserved a mug.'),
      step('Mina keeps the mug', 'No purchase made by these reads', 'No holder', '0', 'Ordinary reading is useful for a display. Buying needs a protocol that checks and changes the available stock safely.')
    ]}
  ]
};

export const authority = {
  id: 'payment-authority', number: 2, title: 'One order, two attempted payments',
  labels: ['Attempt A · add 20.00', 'Attempt B · add 20.00'],
  resource: 'Order 103 · line value 29.00', valueLabel: 'Committed payments',
  caption: 'Independent payment scenario: order 103 already exists, has lines worth 29.00 and starts with no payments. Both attempts use separate Read Committed statements. The order row is left unchanged. Payment IDs 601 and 602 identify the two attempts only in this scenario.',
  options: [
    { value: 'parent', label: 'Lock the order row', steps: [
      step('FOR UPDATE on order 103: acquired', 'Not started', 'A holds order 103', '0.00', 'A locks the existing order row. The lock is the agreed turnstile for changes to this order’s payment limit.'),
      step('Read payments: 0.00; 0 + 20 ≤ 29', 'FOR UPDATE on order 103: waiting', 'A holds order 103 → B waits', '0.00', 'B asks for that same row and waits. A reads the total in a separate statement after acquiring the lock.'),
      step('INSERT payment 601: 20.00', 'Waiting', 'A holds order 103 → B waits', '0.00', 'A adds its payment inside the transaction. The payment is not yet committed, and A still holds the order lock.'),
      step('COMMIT', 'Order lock acquired after A ends', 'B holds order 103', '20.00', 'A’s payment commits before B acquires the authority. B has its turn, but has not yet read the decision total.'),
      step('Finished', 'New statement reads 20.00; 20 + 20 > 29', 'B holds order 103', '20.00', 'B’s later Read Committed statement includes A’s committed payment. Its proposed payment would bring the total to 40.00, exceeding 29.00.'),
      step('20.00 recorded', 'Refuse payment; ROLLBACK', 'No holder', '20.00', 'B adds no payment. The final total is 20.00, leaving 9.00 unpaid. The shared authority and the later decision read worked together.')
    ]},
    { value: 'children', label: 'Lock existing payments', steps: [
      step('SELECT payments FOR UPDATE: zero rows', 'Not started', 'No payment rows to lock', '0.00', 'A asks to lock payment rows for order 103. There are none, so this statement obtains no row lock on a payment.'),
      step('Read payments: 0.00; 0 + 20 ≤ 29', 'SELECT payments FOR UPDATE: zero rows', 'No shared exclusive authority', '0.00', 'B also finds no payment row. The absence of a row has not become a mutually exclusive turn.'),
      step('INSERT payment 601: 20.00', 'Read payments: 0.00; 0 + 20 ≤ 29', 'Different payment rows', '0.00', 'A inserts an uncommitted payment. B’s ordinary read cannot see it and also decides that 20.00 fits.'),
      step('COMMIT', 'Decision already made from 0.00', 'No shared exclusive authority', '20.00', 'A commits. Nothing in this protocol requires B to reconsider its earlier decision.'),
      step('Finished', 'INSERT payment 602: 20.00', 'Different payment rows', '20.00', 'B inserts a different payment row. Unique payment identifiers do not prevent two amounts for the same order.'),
      step('20.00 recorded', 'COMMIT: another 20.00', 'No holder', '40.00', 'Both payments commit. Their sum is 40.00 against a 29.00 order. Locking the rows already present did not protect the condition on all payments.')
    ]}
  ]
};

export const snapshot = {
  id: 'decision-snapshot', number: 3, title: 'Taking a turn does not replace an earlier view',
  labels: ['Attempt A', 'Attempt B'], resource: 'Order 103 · unchanged guard row',
  valueLabel: 'B’s decision sees payments',
  caption: 'Restart the payment scenario with no payments. A holds order 103, inserts 20.00 and commits while B waits. Only the timing of B’s decision snapshot changes. A locking SELECT itself can establish a Repeatable Read snapshot before it waits.',
  options: [
    { value: 'rc', label: 'Read Committed · later statement', steps: [
      step('Holds order 103', 'Starts locking SELECT', 'A holds order 103 → B waits', 'Not read yet', 'B’s first statement asks only for the order lock. The decision query has not started.'),
      step('Inserts payment 601: 20.00', 'Locking SELECT waits', 'A holds order 103 → B waits', 'Not read yet', 'B cannot take its turn until A ends. It has not saved a payment total to use afterwards.'),
      step('COMMIT: payments now 20.00', 'Lock acquired; first statement returns', 'B holds order 103', 'Not read yet', 'A ends. B’s locking statement returns. Acquisition is complete before B sends its decision query.'),
      step('Finished', 'Separate SELECT starts a new snapshot', 'B holds order 103', '20.00', 'The new statement includes A’s committed payment. B calculates 20 + 20 = 40, which exceeds 29.'),
      step('20.00 committed', 'Refuse; ROLLBACK', 'No holder', '20.00', 'B refuses the second payment. Committed payments stay at 20.00.')
    ]},
    { value: 'rr', label: 'Repeatable Read · earlier snapshot', steps: [
      step('Holds order 103', 'First SELECT fixes transaction snapshot', 'A holds order 103 → B waits', '0.00 in B’s snapshot', 'B’s first SELECT starts before A commits. At Repeatable Read, its transaction snapshot does not include A’s payment.'),
      step('Inserts payment 601: 20.00', 'Locking SELECT waits', 'A holds order 103 → B waits', '0.00 in B’s snapshot', 'B waits for the unchanged order row. Waiting does not advance the transaction snapshot.'),
      step('COMMIT: payments now 20.00', 'Lock acquired; same snapshot retained', 'B holds order 103', '0.00 in B’s snapshot', 'A did not update the guard row. B can acquire its lock without the concurrent-update failure that a changed guard could cause.'),
      step('Finished', 'Separate SELECT still reads 0.00', 'B holds order 103', '0.00', 'B has the lock, but reads payments from its earlier snapshot. It decides 0 + 20 ≤ 29 and inserts payment 602.'),
      step('20.00 committed', 'COMMIT: another 20.00', 'No holder', '0.00 was used', 'The two payments total 40.00. The lock serialised ownership, but the decision used a view that excluded A’s committed payment.')
    ]},
    { value: 'one', label: 'Read Committed · one statement', steps: [
      step('Holds order 103', 'Starts lock + total in one SELECT', 'A holds order 103 → B waits', 'Statement snapshot: 0.00', 'Suppose one SQL statement both locks order 103 and reads the payment aggregate through a subquery. Its snapshot starts before A commits.'),
      step('Inserts payment 601: 20.00', 'Same statement waits for the lock', 'A holds order 103 → B waits', 'Statement snapshot: 0.00', 'Putting the aggregate after the lock in the SQL text does not give it a new statement snapshot.'),
      step('COMMIT: payments now 20.00', 'Same statement acquires order lock', 'B holds order 103', 'Statement snapshot: 0.00', 'The lock wait ends, but this is still the statement that began before A committed.'),
      step('Finished', 'Payment aggregate returns 0.00', 'B holds order 103', '0.00', 'The payment subquery uses that statement’s snapshot. Even a deliberately materialised lock-first CTE does not supply the later snapshot promised by two statements.'),
      step('20.00 committed', 'Would accept another 20.00', 'B must end its transaction', '0.00 was used', 'Using this total would allow 40.00. Keep acquisition and the later Read Committed decision as separate statements for this protocol.')
    ]}
  ]
};

export const deadlock = {
  id:'product-deadlock', number:4, title:'Two held rows, two requests', labels:['Transaction A', 'Transaction B'],
  resource:'Products P3 and P7 · locks only', valueLabel:'Wait graph',
  caption:'Independent lock-only scenario. No stock, order or payment is changed. An arrow A → B means A is waiting for a conflicting lock held by B. The drawing does not choose a victim: PostgreSQL can abort either transaction.',
  options:[
    { value:'opposite', label:'Opposite order', steps:[
      step('Lock P3: acquired','Not started','P3: A · P7: free','No waits','A locks P3. There is no wait.'),
      step('Holds P3','Lock P7: acquired','P3: A · P7: B','No waits','B locks a different row, P7. Both transactions can continue.'),
      step('Request P7: waiting','Holds P7','P3: A · P7: B','A → B','A requests P7 and waits for B. This single edge is a wait, not yet a deadlock.'),
      step('Holds P3; waits for P7','Request P3: waiting','P3: A · P7: B','A → B → A','B now requests P3, which A holds. Both transactions need the other to finish before they can continue. The arrows close a cycle.'),
      step('May survive or be aborted','May survive or be aborted','Victim releases locks; survivor proceeds','Cycle broken','PostgreSQL detects the deadlock and aborts one transaction. Either can be the victim. Its released locks let the survivor proceed; retrying the victim means restarting its complete aborted work.')
    ]},
    { value:'ordered', label:'Both take P3 before P7', steps:[
      step('Lock P3: acquired','Not started','P3: A · P7: free','No waits','Both paths agree to acquire P3 before P7. A starts first.'),
      step('Holds P3','Request P3: waiting','P3: A · P7: free','B → A','B waits at the first row. It has not locked P7, so A will not need anything B holds in this scenario.'),
      step('Lock P7: acquired','Still waiting for P3','P3: A · P7: A','B → A','A acquires P7. The graph still has only B → A; there is no edge back.'),
      step('COMMIT; releases P3 and P7','P3 lock acquired','P3: B · P7: free','Wait ends','A ends, and B acquires P3. This wait had a transaction able to move it forward.'),
      step('Finished','Lock P7; COMMIT; release both','P3: free · P7: free','No waits','B acquires P7 in the same order and commits. Both transactions finish. Ordering removed this cycle, not the need to handle all failures in a real operation.')
    ]}
  ]
};
