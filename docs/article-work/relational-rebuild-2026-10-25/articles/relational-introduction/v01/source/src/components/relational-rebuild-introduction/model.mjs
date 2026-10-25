const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const table = (name, columns, rows, marks = []) => `<div class="ri-table-wrap" tabindex="0" role="region" aria-label="${esc(name)}"><table><caption>${esc(name)}</caption><thead><tr>${columns.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i) => `<tr class="${marks.includes(i) ? 'ri-match' : ''}">${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const panel = (name, content, state = '') => `<div class="ri-panel ${state}"><strong class="ri-label">${esc(name)}</strong>${content}</div>`;
const arrow = text => `<div class="ri-arrow">↓ <span>${esc(text)}</span></div>`;
const stock = (mug, tea) => `<div class="ri-stock"><div><span>P7 · Blue mug</span><b>${mug}</b><small>in stock</small></div><div><span>P3 · Green tea</span><b>${tea}</b><small>in stock</small></div></div>`;
const order = (exists, lines = 0, committed = false) => exists ? `<div class="ri-order"><b>103 · Mina · pending</b><span>${committed ? 'Committed' : 'Uncommitted: this transaction only'}</span>${lines ? `<ul><li>Line 1 · P7 × 1 · 20.00 each</li>${lines === 2 ? '<li>Line 2 · P3 × 2 · 4.50 each</li>' : ''}</ul>` : '<p>No lines yet</p>'}</div>` : '<p class="ri-empty">Order 103 does not exist</p>';

export const specs = {
  tables: { title: 'One purchase, four kinds of fact', options: [], count: 4, note: 'After order 103. Selected columns and rows are shown; stock is shown later. A highlighted row is the fact being followed.' },
  join: { title: 'Two matches make two result rows', options: [], count: 3, note: 'After order 103. The result has one row per order line paired with its product. Product names are current; unit_price belongs to the order line.' },
  purchase: { title: 'The whole purchase, or none of it', options: [{value:'success',label:'Purchase succeeds'},{value:'failure',label:'Failure after mug change'}], count: 5, note: 'Starts before order 103: P7 stock 1, P3 stock 12. The failure is an invented application failure after the first stock change. This is a procedure model, not a trace or executable purchase program.' },
  race: { title: 'Both readers saw one mug', options: [{value:'unguarded',label:'Write the earlier calculation'},{value:'guarded',label:'Check and subtract together'}], count: 5, note: 'A separate illustration of PostgreSQL Read Committed, with Mina updating first and committing. Only the mug part of each purchase is drawn. The caller rolls back a purchase if its guarded change affects zero rows.' },
  index: { title: 'The same answer by two routes', options: [{value:'scan',label:'Read the orders table'},{value:'index',label:'Use a customer index'}], count: 3, note: 'An illustration using the three shop orders. These are logical row lookups, not measured page reads or a claimed PostgreSQL plan. A real planner may scan a table this small.' },
  recovery: { title: 'The commit and its reply are separate events', options: [{value:'early',label:'Crash before durable commit'},{value:'late',label:'Crash after durable commit'}], count: 5, note: 'A model of a PostgreSQL purchase with normal durable commit settings and storage that honours flush requests. The data files are shown before their later writes; recovery restores any missing changes from the log.' },
  placement: { title: 'Copying data and dividing data', options: [{value:'replicas',label:'Two copies'},{value:'shards',label:'Two portions'}], count: 2, note: 'Invented placements to distinguish replicas from shards. Each shard can itself have replicas. This is not a CockroachDB placement rule or a complete replication protocol.' },
};

export function scene(kind, variant = '', step = 0) {
  let html = '', text = '';
  if (kind === 'tables') {
    const marks = step === 1 ? [0] : [];
    html = `<div class="ri-grid">${table('customers', ['customer_id','name'], [[1,'Mina Shah'],[2,'Tariq Aziz'],[3,'Edda Berg']],marks)}${table('orders', ['order_id','customer_id','status'],[[101,1,'paid'],[102,2,'paid'],[103,1,'pending']],step < 2 ? [2] : [])}${table('order_items · order lines',['order_id','line_no','product_id','quantity'],[[103,1,'P7',1],[103,2,'P3',2]],step === 2 ? [0,1] : [])}${table('products',['product_id','name','price'],[['P3','Green tea, 50 g','4.50'],['P7','Blue mug','20.00'],['P9','Teapot','35.00']],step === 3 ? [0,1] : [])}</div>`;
    text = [
      'Order 103 is one row in orders. Its customer_id is 1. The value identifies the customer; its position on the page does not.',
      'Follow customer_id 1 to customers. The matching row names Mina Shah. Order 101 points to the same customer.',
      'Follow order_id 103 to order_items. There are two lines: one blue mug and two packets of green tea. Each line is identified by its order_id together with line_no.',
      'The lines name products by product_id. P7 finds Blue mug; P3 finds Green tea, 50 g. The customer, order, line and product remain separate facts.'
    ][step];
  }
  if (kind === 'join') {
    const selected = step === 0 ? [] : step === 1 ? [0] : [0,1];
    html = `<div class="ri-grid">${table('order_items · order 103',['line_no','product_id','quantity','unit_price'],[[1,'P7',1,'20.00'],[2,'P3',2,'4.50']],selected)}${table('products',['product_id','name'],[['P7','Blue mug'],['P3','Green tea, 50 g']],selected)}</div>${arrow('Pair rows where product_id matches')}${table('Result · one row per matched order line',['order_id','line_no','name','quantity','unit_price'],step === 0 ? [] : step === 1 ? [[103,1,'Blue mug',1,'20.00']] : [[103,1,'Blue mug',1,'20.00'],[103,2,'Green tea, 50 g',2,'4.50']],step ? [step-1] : [])}`;
    text = ['The input holds two order lines. The query asks for each line together with its product name. No rows have been paired yet.','Line 1 names P7. Pair it with product P7 and return one result row: order 103, line 1, Blue mug, quantity 1, unit price 20.00.','Line 2 names P3. Its match adds the green tea row. The result repeats 103 because both lines belong to that one order.'][step];
  }
  if (kind === 'purchase') {
    const fail = variant === 'failure';
    const mug = step > 0 && !(fail && step === 4) ? 0 : 1;
    const tea = !fail && step >= 3 ? 10 : 12;
    const exists = step >= 2 && !(fail && step === 4);
    html = `<div class="ri-status">${step === 4 ? fail ? 'ROLLBACK · no purchase committed' : 'COMMIT · purchase accepted' : step === 0 ? 'Before purchase 103' : 'Inside one transaction'}</div><div class="ri-grid">${panel('products',stock(mug,tea),step === 1 ? 'ri-active' : '')}${panel('orders + order_items',order(exists,step >= 3 && !fail ? 2 : 0,step === 4),step >= 2 ? 'ri-active' : '')}</div><div class="ri-payment">Payments for 103: none · ${step === 4 && !fail ? '29.00 still due' : 'payment is a separate change'}</div>`;
    text = fail ? [
      'Before the purchase, order 103 does not exist. P7 has one mug; P3 has twelve packets of tea. BEGIN starts the transaction.',
      'The guarded mug change succeeds: P7 stock falls from 1 to 0 inside this transaction. No order has been committed.',
      'An application failure occurs now, before the order and its lines are inserted. The mug change alone must not become a sale.',
      'The application chooses ROLLBACK. The transaction is abandoned, including the mug change.',
      'After rollback, P7 stock is 1 and P3 stock is 12. Order 103 and its lines do not exist. A partial purchase has not escaped.'
    ][step] : [
      'Before the purchase, order 103 does not exist. P7 has one mug; P3 has twelve packets of tea. BEGIN starts the transaction.',
      'Check P7 has at least one mug and subtract one in the same UPDATE. One row changes. The new stock, 0, is still uncommitted.',
      'INSERT adds order 103 for customer 1, with status pending. It is still part of the same uncommitted purchase.',
      'The guarded tea change subtracts two, taking P3 from 12 to 10. INSERT adds line 1 for the mug at 20.00 and line 2 for two teas at 4.50 each.',
      'COMMIT accepts the stock changes, order and two lines together. Order 103 is pending, not paid. Its line values total 20.00 + 2 × 4.50 = 29.00.'
    ][step];
    if (fail && step >= 2 && step < 4) html = `<div class="ri-status">${step === 2 ? 'Application failure' : 'ROLLBACK requested'}</div><div class="ri-grid">${panel('products',stock(0,12),'ri-active')}${panel('orders + order_items',order(false))}</div><div class="ri-payment">The mug change is uncommitted</div>`;
  }
  if (kind === 'race') {
    const guarded = variant === 'guarded';
    const mina = ['Read P7 stock: 1','Read P7 stock: 1',guarded ? 'UPDATE stock = stock − 1 WHERE stock ≥ 1 → 1 row' : 'UPDATE stock = 0 from earlier read', 'COMMIT purchase 103', '103 kept · one mug allocated'];
    const tariq = ['Request 104 has not read yet','Read P7 stock: 1',guarded ? 'Try guarded UPDATE → waits for Mina' : 'Try UPDATE stock = 0 → waits for Mina',guarded ? 'Recheck stock 0 → 0 rows changed' : 'Write stock = 0 after Mina commits',guarded ? 'ROLLBACK 104 · no mug allocated' : 'COMMIT 104 · a second mug allocated'];
    html = `<div class="ri-race"><div class="ri-lane"><strong>Mina · purchase 103</strong>${mina.map((t,i)=> `<div class="ri-event ${i > step ? 'ri-future' : i === step ? 'ri-active' : ''}"><span>${i+1}</span>${i <= step ? esc(t) : '…'}</div>`).join('')}</div><div class="ri-lane"><strong>Tariq · purchase 104</strong>${tariq.map((t,i)=> `<div class="ri-event ${i > step ? 'ri-future' : i === step ? 'ri-active' : ''}"><span>${i+1}</span>${i <= step ? esc(t) : '…'}</div>`).join('')}</div></div><div class="ri-outcome">${step === 4 ? guarded ? 'P7 stock 0 · 1 accepted purchase for 1 mug' : 'P7 stock 0 · 2 accepted purchases for 1 mug' : 'Purchase outcomes still in progress; uncommitted writes belong to their own transactions'}</div>`;
    text = [
      'Mina reads stock 1. Her request intends to buy one mug. Tariq’s request is separate.',
      'Tariq also reads stock 1 before Mina changes it. Both requests can now decide that one mug is available.',
      guarded ? 'Mina’s UPDATE checks stock and subtracts one together. Tariq’s attempt to update the same row waits while Mina’s transaction is open.' : 'Mina calculates 1 − 1 in the application and writes stock 0. Tariq has also calculated 0 from his earlier read; his write waits for Mina.',
      guarded ? 'Mina commits. PostgreSQL applies Tariq’s condition to the updated row: stock is now 0, so stock ≥ 1 is false. Tariq changes zero rows.' : 'Mina commits. Tariq now writes his already calculated 0. The stock check still passes: 0 is not negative. But two purchases have claimed one mug.',
      guarded ? 'The caller treats zero changed rows as an unavailable mug and rolls back all of purchase 104. Only Mina’s purchase is kept.' : 'Both transactions commit all their own steps. Each purchase is atomic, yet the combined decision is wrong. Non-negative stock alone did not prevent the oversale.'
    ][step];
  }
  if (kind === 'index') {
    const indexed = variant === 'index';
    html = `<div class="ri-grid">${panel(indexed ? 'Index on customer_id' : 'Read every order',indexed ? table('Customer → order',['customer_id','order_id'],[[1,101],[1,103],[2,102]],step ? [0,1] : []) : '<div class="ri-scan">'+[101,102,103].map((v,i)=> `<span class="${step && (step===2 || i===0) ? 'ri-visited' : ''}">${v}<small>customer ${v===102 ? 2 : 1}</small></span>`).join('')+'</div>')}${panel('Result · customer 1',table('Same two orders',['order_id','status'],step===2 ? [[101,'paid'],[103,'pending']] : [],step===2 ? [0,1] : []))}</div>${arrow(indexed ? 'Look up 1, then follow its entries to orders 101 and 103' : 'Test customer_id on every order; discard 102')}`;
    text = indexed ? ['An index keeps customer IDs arranged for lookup, with a way to find their orders. The table still contains the same three orders.','Look up customer 1. Its entries lead to 101 and 103, so the database can find those rows without testing every order.','Return 101 and 103. Every later order also needs an index entry; faster lookup costs maintained data on writes.'] : ['With no suitable index, a scan starts at the orders table. It has no shortcut to customer 1.','Read order 101 and test customer_id. It matches 1. Continue through the table rather than stopping at the first match.','Read and test 102 and 103 as well. Discard 102 and return 101 and 103. Two result rows required testing all three input rows.'][step];
    if (indexed) text = text[step];
  }
  if (kind === 'recovery') {
    const late = variant === 'late';
    const committed = late && step >= 2;
    const restart = step === 4;
    html = `<div class="ri-recovery">${panel('Application',`<b>${step < 3 ? step===0 ? 'Preparing purchase 103' : 'Waiting for COMMIT reply' : 'Connection lost · outcome unknown'}</b>`)}${arrow(step >= 3 && !restart ? 'Server crashes; memory is lost' : restart ? 'Server restarts and recovers' : 'One database transaction')}${panel('Durable storage',`<div class="ri-grid"><div><strong>Recovery log</strong><p>${committed ? '103: changes + durable commit record' : 'No durable commit for 103'}</p></div><div><strong>Table files</strong><p>${restart && committed ? '103 + two lines; P7 0, P3 10' : 'Before 103; P7 1, P3 12'}</p></div></div>`)}<div class="ri-outcome">${restart ? committed ? 'After restart: purchase 103 exists · pending · 29.00 due' : 'After restart: no purchase 103 · original stock' : 'An absent reply does not reveal what reached durable storage'}</div></div>`;
    text = [
      'Start before purchase 103. The application is about to create the order, its two lines and the stock changes.',
      'The transaction makes its changes and asks to commit. Updated data can still be in memory; the table files need not yet contain the purchase.',
      late ? 'The recovery log, including the commit record, reaches durable storage. The purchase has committed, but its successful reply has not reached the application.' : 'The server has not made a commit record durable. The application still has no answer.',
      'The server crashes before the application receives a reply. The connection drops. The application sees the same failure in either case.',
      late ? 'Recovery finds the durable commit and restores the purchase from the log where needed. Order 103 has two lines, P7 stock 0 and P3 stock 10. It remains pending.' : 'Recovery finds no durable commit for 103. Its changes are not kept as a purchase. Stock is back at P7 1 and P3 12.'
    ][step];
  }
  if (kind === 'placement') {
    const shards = variant === 'shards';
    html = `<div class="ri-grid">${panel(shards ? 'Portion A · machine A' : 'Copy A · machine A',shards ? `<p>P7 · Blue mug</p><b>stock ${step ? 0 : 1}</b>` : stock(step ? 0 : 1,step ? 10 : 12))}${panel(shards ? 'Portion B · machine B' : 'Copy B · machine B',shards ? `<p>P3 · Green tea</p><b>stock ${step ? 10 : 12}</b>` : stock(step ? 0 : 1,step ? 10 : 12))}</div>${arrow(shards ? 'Purchase 103 must change both portions together' : 'One history is copied to another machine')}<div class="ri-outcome">${shards ? 'Different facts · one purchase crosses the boundary' : 'Same facts · two locations'}</div>`;
    text = shards ? ['A shard is a portion of the data. In this invented layout, machine A owns P7 and machine B owns P3. Neither holds the whole product table.','Purchase 103 needs one mug and two teas. The system must coordinate both portions so a failure cannot leave only one stock change committed. Each portion can have replicas too.'][step] : ['A replica is another copy of the same data. Both machines hold the mug and the tea. Copying the data is different from dividing it.','The accepted purchase is copied to the other machine. Which copies must acknowledge it, and which can serve reads, depends on the replication protocol. Both copies still represent the same mug.'][step];
  }
  return {html, text};
}
