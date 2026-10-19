// Explicit teaching models. These are not captured database traces.
export const scenes = {
 request: { title: 'One order, three different completions', choices: ['Response arrives', 'Response is lost'], variants: [
  [
   ['Validate and authorise', 'API', 'Mina may order for customer 1 in tenant 7.', 'No database work yet', 'No order'],
   ['Borrow, then BEGIN', 'Driver + pool', 'One checked-out client owns the transaction.', 'Waiting for database', 'Transaction open'],
   ['Write order and items', 'Database', 'Statements succeed; a stock reservation must also succeed.', 'Has statement results', 'Uncommitted order 103'],
   ['COMMIT completes', 'Database', 'Order and item changes commit together under the configured contract.', 'Still awaiting reply', 'Committed order 103'],
   ['COMMIT reply arrives', 'Driver → API', 'The API now has confirmation of commit.', 'Knows order committed', 'Committed order 103'],
   ['Return response', 'API → browser', 'The connection has been released. Mina receives order 103.', 'User has confirmation', 'Committed order 103']
  ],
  [
   ['Validate and authorise', 'API', 'Mina may order for customer 1 in tenant 7.', 'No database work yet', 'No order'],
   ['Borrow, then BEGIN', 'Driver + pool', 'One checked-out client owns the transaction.', 'Waiting for database', 'Transaction open'],
   ['Write order and items', 'Database', 'Statements succeed; a stock reservation must also succeed.', 'Has statement results', 'Uncommitted order 103'],
   ['COMMIT completes', 'Database', 'The database commits before the response can reach the user.', 'Still awaiting reply', 'Committed order 103'],
   ['COMMIT reply arrives', 'Driver → API', 'The API knows the order committed and releases its connection.', 'Knows order committed', 'Committed order 103'],
   ['HTTP response is lost', 'API → browser', 'The user sees a failed request. Repeating it with a new identity could create another order.', 'User has no confirmation', 'Committed order 103']
  ]
 ]},
 values: { title: 'A correct database can receive the wrong identifier', choices: ['Keep decimal text', 'Convert to Number'], variants: [
  [
   ['Receive identifier', 'HTTP boundary', 'The request carries the exact text 9007199254740993.', '9007199254740993', 'Not sent'],
   ['Choose representation', 'Application', 'Keep it as validated decimal text, or use an exact integer representation.', '9007199254740993', 'Not sent'],
   ['Bind $1::bigint', 'Driver → database', 'The decimal text reaches PostgreSQL without a JavaScript Number conversion.', '9007199254740993', '9007199254740993'],
   ['Read it back', 'Database → driver', 'The tested default parser returns this bigint as text. Equality is preserved.', '9007199254740993', '9007199254740993']
  ],
  [
   ['Receive identifier', 'HTTP boundary', 'The request carries the exact text 9007199254740993.', '9007199254740993', 'Not sent'],
   ['Convert to Number', 'Application', 'JavaScript Number rounds this integer before binding sees it.', '9007199254740992', 'Not sent'],
   ['Bind $1::bigint', 'Driver → database', 'Binding prevents injection. It cannot restore the digit already lost.', '9007199254740992', '9007199254740992'],
   ['Read it back', 'Database → driver', 'The database faithfully returns the wrong identifier it received.', '9007199254740992', '9007199254740992']
  ]
 ]},
 pool: { title: 'Two connections, three requests', choices: ['Release before external call', 'Hold across external call'], variants: [
  [
   ['A and B borrow', 'Pool', 'Two requests occupy the two available slots. C arrives and queues.', '2 leased · C waiting', 'A and B doing SQL'],
   ['A commits and releases', 'Request A', 'A returns its client before calling the notification service.', '1 leased · C can borrow', 'A committed'],
   ['C starts database work', 'Request C', 'A’s slow external call no longer occupies a database connection.', 'B and C leased', 'C executing']
  ],
  [
   ['A and B borrow', 'Pool', 'Two requests occupy the two available slots. C arrives and queues.', '2 leased · C waiting', 'A and B doing SQL'],
   ['A commits but holds client', 'Request A', 'A waits for the notification service without releasing its client.', '2 leased · C waiting', 'A idle, B doing SQL'],
   ['External service stays slow', 'Request C', 'C cannot start. Database execution is not the reason A still occupies its slot.', '2 leased · C waiting', 'A idle, B doing SQL']
  ]
 ]},
 recovery: { title: 'The same missing reply, two database outcomes', choices: ['Commit never reaches server', 'Commit reply is lost'], variants: [
  [
   ['Write order 103', 'Database', 'The insert succeeds inside the open transaction.', 'Has insert result', 'Uncommitted order'],
   ['Connection fails', 'Network', 'In this model COMMIT was never delivered. The ordinary session ends.', 'No commit confirmation', 'Transaction abandoned'],
   ['Observe settled state', 'New database session', 'The disconnected transaction is rolled back. The original caller could not infer this solely from the missing reply.', 'Needs outcome evidence', 'No committed order']
  ],
  [
   ['Write order 103', 'Database', 'The insert succeeds inside the open transaction.', 'Has insert result', 'Uncommitted order'],
   ['Connection fails', 'Network', 'In this model COMMIT completed, but its reply was lost.', 'No commit confirmation', 'Committed order 103'],
   ['Observe settled state', 'New database session', 'The order exists. Repeating create-order with a new identity would be a new operation.', 'Needs outcome evidence', 'Committed order 103']
  ]
 ]},
 external: { title: 'What remains after the API process dies?', choices: ['Call after commit', 'Commit a work record too'], variants: [
  [
   ['Commit the order', 'Database', 'The order commits; the API plans to call fulfilment next.', 'Order accepted', 'Order 103 only'],
   ['API process dies', 'Application', 'The external call has not started. Memory no longer holds the plan.', 'No worker instruction', 'Order 103 only'],
   ['Worker looks for work', 'Background worker', 'There is no durable work record to discover. A separate reconciliation process would be needed.', 'Fulfilment missing', 'No pending job']
  ],
  [
   ['Commit order + job', 'Database', 'Order 103 and fulfilment job J9 commit in the same transaction.', 'Order accepted', 'Order 103 + pending J9'],
   ['API process dies', 'Application', 'The external call has not started, but J9 remains discoverable.', 'Worker can resume', 'Order 103 + pending J9'],
   ['Worker calls fulfilment', 'Background worker', 'If fulfilment succeeds and the worker dies before recording completion, another attempt may repeat the call.', 'External outcome needs evidence', 'J9 still pending until recorded']
  ]
 ]}
};
