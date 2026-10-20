// Illustrative models for Figures 4 to 7. Each scene gives its options, the
// stage labels for each option, and the picture and narration for each step.
// Pictures are HTML strings so the first step can also be rendered on the server.

const escape = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const card = (title, value, { note = '', mark = '' } = {}) =>
  `<div class="state-card${mark ? ` ${mark}` : ''}"><strong>${escape(title)}</strong><span>${escape(value)}</span>${note ? `<small>${escape(note)}</small>` : ''}</div>`;
const table = (caption, heads, rows) =>
  `<div class="mini"><table><caption>${caption}</caption><thead><tr>${heads.map(h => `<th>${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(({ cells, mark = '' }) => `<tr${mark ? ` class="${mark}"` : ''}>${cells.map(c => `<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const outcome = {
  title: 'The same missing reply, two possible outcomes',
  label: 'Connection breaks',
  options: [['before', 'Before COMMIT arrives'], ['after', 'After COMMIT, before its reply']],
  stages: () => ['Write order 103', 'Send COMMIT', 'Lose connection', 'Retry with R103'],
  caption: 'Two illustrative paths for purchase attempt R103, stored in the purchase_attempt column the shop adds to orders under a unique constraint. No payment is sent. Both retries, and a retry that overlaps a still-open attempt, were reproduced on PostgreSQL 18.6; the figure itself does not contact a server.',
  alternative: 'Before COMMIT arrives, the lost connection leaves the transaction open until the server notices the session has ended and rolls it back. After COMMIT but before its reply, order 103 is stored. The application sees the same connection error in both cases. Retrying with the same purchase attempt, R103, is safe in both: after the commit, the unique constraint refuses a second R103 and the application returns order 103; before it, the retry stores order 103 once.',
  draw(step, choice) {
    const after = choice === 'after';
    const db = step < 2 ? ['103 · R103 · not committed', 'Inside an open transaction']
      : step === 2 ? (after ? ['103 · R103 · committed', 'Stored, though nobody was told'] : ['103 · R103 · not committed', 'Rolled back once the server notices the session ended; until then it keeps its locks'])
      : (after ? ['103 · R103 · committed', 'Still one row: the retry added nothing'] : ['103 · R103 · committed', 'Stored once, by the retry']);
    const app = [
      ['Order written, not committed', 'Purchase attempt R103'],
      ['Waiting for the COMMIT reply', ''],
      ['Connection lost: outcome unknown', 'The same error on both paths'],
      after ? ['Retry refused: R103 already stored', 'Reads order 103 and returns it'] : ['Retry committed', 'Returns order 103'],
    ][step];
    return {
      picture: card('Order in the database', db[0], { note: db[1], mark: step === 3 || (step === 2 && after) ? 'changed' : '' }) +
        card('What the application knows', app[0], { note: app[1], mark: step === 2 ? 'problem' : step === 3 ? 'changed' : '' }),
      message: [
        'Inside an open transaction, the application inserts order 103 with purchase attempt R103. Nothing is committed yet.',
        'The application sends COMMIT. Sending it does not establish that the database received it.',
        after ? 'The database commits, but its reply is lost. Order 103 exists; the application has only a connection error.'
          : 'The connection fails before COMMIT reaches the database. When the server notices the session has ended, it rolls the transaction back; until then the transaction keeps its locks, including the one on the mug’s row. The application has only a connection error.',
        after ? 'The application reconnects and repeats the purchase with R103. The unique constraint refuses a second R103, so the application reads the order stored under R103 and returns order 103. No second order is created.'
          : 'The application reconnects and repeats the purchase with R103. No stored order holds R103, so the insert succeeds and commits: order 103 is stored once.',
      ][step],
    };
  },
};

// Twelve orders in arrival order, three to a page. Orders 101 to 103 are the earlier figures' orders (customer 1 is Mina,
// customer 2 is Arun). There is no order 104: Arun's attempt was refused in Figure 3. Orders 105 to 113 are invented.
const later = [[101, 1], [102, 2], [103, 1], [105, 3], [106, 2], [107, 4], [108, 3], [109, 1], [110, 5], [111, 4], [112, 2], [113, 5]]
  .map(([order_id, customer_id]) => ({ order_id, customer_id }));
const lookup = {
  title: 'The same orders, with two routes to find them',
  label: 'Find customer 1’s orders by',
  options: [['scan', 'Scanning the table'], ['index', 'Searching an index']],
  stages: () => ['Start', 'Find where to look', 'Read table pages', 'Return the orders'],
  caption: 'Twelve orders, three per page, stored in the order they arrived. Orders 101 to 103 are the ones from earlier figures, and the rest are invented. There is no order 104, because the conditional UPDATE in Figure 3 refused Arun’s attempt. Accent borders mark table pages read; bold, underlined rows are customer 1’s. The index search is shown as one operation, without drawing or counting its own pages. These are work counts, not timings or a captured plan.',
  alternative: 'Scanning reads all four pages and tests twelve rows to find customer 1’s three orders, 101, 103 and 109. The index on customer_id gives their locations, pages 1 and 3, so only those two pages are read. Both routes return the same orders. The index has its own storage and search cost and must be maintained when orders change.',
  draw(step, choice) {
    const indexed = choice === 'index';
    const pagesWithMatches = [0, 2];
    const route = step === 0 ? 'customer_id = 1 · not looked up yet'
      : indexed ? 'Index entry: customer_id 1 → rows on pages 1 and 3'
      : step === 1 ? 'No index on customer_id → read pages 1 to 4 and test every row' : 'Read table pages 1 → 2 → 3 → 4';
    const pages = [0, 1, 2, 3].map(page => {
      const read = step >= 2 && (!indexed || pagesWithMatches.includes(page));
      const rows = later.slice(page * 3, page * 3 + 3).map(row => ({
        cells: [row.order_id, row.customer_id],
        mark: step >= 2 && row.customer_id === 1 ? 'answer' : '',
      }));
      return `<div class="page${read ? ' examined' : ''}">${table(`Page ${page + 1}`, ['order_id', 'customer_id'], rows)}</div>`;
    }).join('');
    const where = step === 0 ? 'Not looked up yet' : indexed ? 'Pages 1 and 3, from the index' : step === 1 ? 'Unknown until every row is read' : 'Pages 1 and 3, found by scanning';
    const work = step < 2 ? ['Not counted yet', 'No table page read yet'] : indexed ? ['2 pages · 3 rows fetched', 'Plus the index search'] : ['4 pages · 12 rows checked', 'Every row tested'];
    return {
      picture: `<div class="access">${escape(route)}</div><div class="pages">${pages}</div>` +
        card('Where customer 1’s orders are', where, { mark: step === 1 || step === 2 ? 'changed' : '' }) +
        card('Table work', work[0], { note: work[1], mark: step === 2 ? 'changed' : '' }) +
        card('Result', step < 3 ? 'Not returned yet' : 'Orders 101, 103 and 109', { mark: step === 3 ? 'changed' : '' }),
      message: [
        'Both routes start with the same twelve orders, stored in the order they arrived (order 104 was refused, so there is none), and the same question: which orders belong to customer 1?',
        indexed ? 'An index on customer_id keeps its values sorted, each with the location of its row. The entry for customer 1 points to pages 1 and 3. No table page has been read yet.'
          : 'Without an index on customer_id, nothing says where customer 1’s orders are. They arrived among other customers’ orders, so the scan must read every page and test every row.',
        indexed ? 'The engine reads only pages 1 and 3 and fetches the three matching rows. Pages 2 and 4 are not needed.' : 'The scan reads all four pages and tests all twelve rows. Three match.',
        indexed ? 'The result is the same three orders. Less table work came from an extra structure with its own search, storage and maintenance costs.' : 'The result holds three orders, but finding them meant checking twelve. A small answer does not imply a small read.',
      ][step],
    };
  },
};

const change = {
  title: 'A required delivery instruction meets the old application',
  label: 'Require the delivery instruction',
  options: [['early', 'As soon as the column is added'], ['staged', 'Once every version sends it and rows are filled']],
  stages: choice => choice === 'staged'
    ? ['Before the change', 'Add an optional column', 'Old version places an order', 'Replace old version, convert rows', 'Require the value']
    : ['Before the change', 'Add a required column', 'Old version places an order', 'Fill rows, require at once', 'Old version places another order'],
  caption: 'An illustrative rollout showing one existing order, 101, and one old application version. In this example the shop can recover each existing order’s delivery instruction from its courier records, so old rows can be filled with real values. If no valid value can be found, the final rule has to allow historical orders without one. Both rejections were reproduced on PostgreSQL 18.6; the figure itself is a model.',
  alternative: 'Requiring the delivery instruction as soon as the column is added fails, because order 101 has no value, so the column is not added and the old version carries on unchanged. If the rows were instead filled and the value required at once, the old version’s next order would be rejected. Adding the column as optional lets the old version continue while a new version and real conversions are prepared. Require the value only after every application version supplies it and every row has one.',
  draw(step, choice) {
    const staged = choice === 'staged';
    const none = '(no column)';
    const filled = { 101: 'Leave at reception', 114: 'Ring twice' };
    let rule; let rows; let app;
    if (staged) {
      rule = [['No delivery_instruction column', ''], ['delivery_instruction text · optional', 'changed'], ['delivery_instruction text · optional', ''],
        ['delivery_instruction text · optional', ''], ['delivery_instruction text NOT NULL · accepted: every row has a value', 'changed']][step];
      rows = step === 0 ? [{ cells: [101, none] }]
        : step === 1 ? [{ cells: [101, 'NULL'], mark: 'changed' }]
        : step === 2 ? [{ cells: [101, 'NULL'] }, { cells: [114, 'NULL'], mark: 'changed' }]
        : [{ cells: [101, filled[101]], mark: step === 3 ? 'changed' : '' }, { cells: [114, filled[114]], mark: step === 3 ? 'changed' : '' }, { cells: [115, 'Side gate'], mark: step === 3 ? 'changed' : '' }];
      app = [['Sends orders without a delivery instruction', ''], ['Sends orders without a delivery instruction', ''], ['Order 114 accepted, with NULL', 'changed'],
        ['Retired; its last requests finished', 'changed'], ['Retired; its last requests finished', '']][step];
    } else {
      rule = [['No delivery_instruction column', ''], ['ADD COLUMN … NOT NULL · rejected: order 101 has no value', 'problem'], ['No delivery_instruction column', ''],
        ['delivery_instruction text NOT NULL', 'changed'], ['delivery_instruction text NOT NULL', '']][step];
      rows = step < 2 ? [{ cells: [101, none] }]
        : step === 2 ? [{ cells: [101, none] }, { cells: [114, none], mark: 'changed' }]
        : [{ cells: [101, filled[101]], mark: step === 3 ? 'changed' : '' }, { cells: [114, filled[114]], mark: step === 3 ? 'changed' : '' }, ...(step === 4 ? [{ cells: [115, 'NULL · rejected'], mark: 'problem' }] : [])];
      app = [['Sends orders without a delivery instruction', ''], ['Sends orders without a delivery instruction', ''], ['Order 114 accepted unchanged', 'changed'],
        ['Still sends orders without one', ''], ['Order 115 rejected: null value violates the not-null constraint', 'problem']][step];
    }
    return {
      picture: card('Column rule', rule[0], { mark: rule[1] }) + card('Old application version', app[0], { mark: app[1] }) +
        `<div class="full-row">${table('<code>orders</code>', ['order_id', 'delivery_instruction'], rows)}</div>`,
      message: (staged ? [
        'Order 101 was taken before the shop asked for delivery instructions. The old application version sends orders without one.',
        'Add the column as optional. Order 101 holds NULL: no value has been recorded, which is true.',
        'The old version’s next order, 114, is accepted with NULL. Keep that compatibility until the old version is replaced.',
        'The new version sends a delivery instruction with every order, such as 115. The old version is retired once its last requests finish, and orders 101 and 114 are filled from courier records.',
        'Check that no row is NULL and no old version remains, then require the value. Every later order must carry one.',
      ] : [
        'Order 101 was taken before the shop asked for delivery instructions. The old application version sends orders without one.',
        'Adding the column as required fails: PostgreSQL would have to give order 101 a value, and it has none. The column is not added.',
        'The old version’s next order, 114, is accepted unchanged, because nothing changed. The early attempt failed without breaking anything.',
        'Suppose the shop instead adds the column, fills orders 101 and 114 from its courier records and requires the value straight away, while the old version still runs.',
        'The old version’s next order, 115, omits the delivery instruction and is rejected. Customers on the old version cannot order until it is replaced.',
      ])[step],
    };
  },
};

const recovery = {
  title: 'A current copy and an earlier copy answer different failures',
  label: 'What failed?',
  options: [['host', 'The primary and its storage are lost'], ['delete', 'Order 101 was deleted by mistake']],
  stages: () => ['Order exists', 'Failure', 'Look at the replica', 'Choose what to recover from'],
  caption: 'Illustrative copies, with order 101 already copied to the replica before the failure. In the deletion case, the deletion reaches it too. The backup is assumed usable and stored separately. No failover or restore is executed.',
  alternative: 'After the primary is lost, the replica still has order 101 and may be promoted if it meets the deployment’s loss and promotion requirements. After a committed deletion reaches the replica, neither current copy has order 101. A backup from before the deletion is needed; restore it separately and account for valid later work before repairing the live service.',
  draw(step, choice) {
    const deleted = choice === 'delete';
    const final = step === 3;
    const primary = step === 0 ? 'Order 101 present' : deleted ? 'Order 101 deleted' : 'Unavailable; storage lost';
    const replica = step < 2 ? 'Order 101 present' : deleted ? 'Order 101 deleted too' : 'Order 101 present';
    return {
      picture:
        card('Primary', primary, { note: final ? (deleted ? 'Has the deletion' : 'Lost') : 'Accepts every change', mark: final ? 'unusable' : step === 1 ? 'changed' : '' }) +
        card('Replica', replica, { note: final ? (deleted ? 'Has the deletion too' : 'Recover from this: promote it') : 'Receives a copy of each change', mark: final ? (deleted ? 'unusable' : 'chosen') : step === 2 && deleted ? 'changed' : '' }) +
        card('Backup (from before this failure)', 'Order 101 present', { note: final ? (deleted ? 'Recover order 101 from this' : 'Not needed: it lacks later orders') : 'Taken earlier, stored separately', mark: final && deleted ? 'chosen' : '' }),
      message: [
        'Order 101 exists on the primary, on its replica and in a backup taken earlier.',
        deleted ? 'An authorised statement commits a mistaken deletion of order 101. Durability keeps that deletion; it cannot recognise the mistake.' : 'The primary and its storage are lost. The application can no longer use that copy.',
        deleted ? 'Replication carries the deletion to the replica. Promoting the replica cannot bring order 101 back.' : 'The replica already had order 101 before the failure. Check how far it had caught up, and whether that meets the allowed loss, before choosing it.',
        deleted ? 'Recover from the backup: restore it separately, find order 101 and its items, and check them against valid later work before repairing the live service.' : 'Promote the replica to be the new primary. Reconnecting clients and checking the data still have to finish before service resumes.',
      ][step],
    };
  },
};

export const scenes = { outcome, lookup, change, recovery };
