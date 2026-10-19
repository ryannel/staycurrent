export const joinSteps = (left = false) => [
 {note:'Start with orders 101, 102 and 106. One input row means one order.', rows:[]},
 {note:'Order 101 matches line 1 for 20. The result row identifies an order and a line.', rows:[[101,1,20]]},
 {note:'Order 101 also matches line 2 for 10. The same order now contributes a second result row.', rows:[[101,1,20],[101,2,10]]},
 {note:'Order 102 matches its one line for 20.', rows:[[101,1,20],[101,2,10],[102,1,20]]},
 {note:left?'Order 106 has no line. LEFT JOIN preserves it with NULL line columns.':'Order 106 has no line. The inner join produces no row for it.', rows:left?[[101,1,20],[101,2,10],[102,1,20],[106,null,null]]:[[101,1,20],[101,2,10],[102,1,20]]}
];
export const reportOrder = [100,101,102,106,103];
export function reportModel(change='none') {
 const lines = [
  {order_id:100,line_no:1,amount:10},{order_id:101,line_no:1,amount:20},
  {order_id:101,line_no:2,amount:10},{order_id:102,line_no:1,amount:20},
  {order_id:103,line_no:1,amount:40}
 ];
 const payments = [
  {payment_id:200,order_id:100,amount:10},{payment_id:201,order_id:101,amount:10},
  {payment_id:202,order_id:101,amount:5},{payment_id:203,order_id:103,amount:40}
 ];
 if(change==='receipt')payments.push({payment_id:204,order_id:101,amount:5});
 if(change==='settle')payments.push({payment_id:204,order_id:101,amount:15});
 if(change==='line')lines.push({order_id:106,line_no:1,amount:10});
 const rows=reportOrder.map(order_id=>{
  const lineRows=lines.filter(x=>x.order_id===order_id), receiptRows=payments.filter(x=>x.order_id===order_id);
  const order_value=lineRows.length?lineRows.reduce((sum,r)=>sum+r.amount,0):null;
  const paid=receiptRows.length?receiptRows.reduce((sum,r)=>sum+r.amount,0):null;
  const due=order_value===null?null:order_value-(paid??0);
  return {order_id,name:order_id===103?'Tariq':order_id===106?'Edda':'Mina',lineRows,receiptRows,order_value,paid,due,has_payment:receiptRows.length>0,keep:due===null||due>0};
 });
 return {rows,final:rows.filter(r=>r.keep).map(({order_id,name,due,has_payment})=>({order_id,name,due,has_payment}))};
}
export function reportNote(change,step) {
 const data=reportModel(change), r101=data.rows.find(r=>r.order_id===101), r106=data.rows.find(r=>r.order_id===106);
 const changed={none:'',receipt:' Add receipt 204 for 5 to order 101.',settle:' Add receipt 204 for 15 to settle order 101.',line:' Add line 1 for 10 to value order 106.'}[change];
 if(step===0)return 'Start with five open January orders. Each source line and receipt keeps its own identity. Order 101 has '+r101.lineRows.length+' lines and '+r101.receiptRows.length+' receipts. The earlier date and status tests already excluded 104 and 105.'+changed;
 if(step===1)return 'GROUP BY order_id totals each detail independently. Order 101 has one line subtotal of 30 and one receipt subtotal of '+r101.paid+'. There is no receipt subtotal for 102. Order 106 '+(r106.order_value===null?'still has no line subtotal.':'now has a line subtotal of 10.');
 if(step===2)return 'The left joins preserve five order identities. For 101, 30 − '+r101.paid+' = '+r101.due+'. For 102, an absent payment defaults to zero: 20 − 0 = 20. '+(r106.due===null?'Order 106’s absent line total remains NULL, so its due is unknown.':'Order 106 now has lines worth 10, so 10 − 0 = 10.')+' EXISTS records receipt presence without adding rows.';
 return 'WHERE keeps positive or unknown balances and removes settled orders '+data.rows.filter(r=>!r.keep).map(r=>r.order_id).join(', ')+'. Faint excluded rows remain only for comparison. The answer contains '+data.final.length+' order identities in the promised order.';
}
export const reportSql = [
 "FROM orders AS o\nWHERE o.status = 'open'\n  AND o.placed_at >= TIMESTAMPTZ '2026-01-01 00:00:00+00'\n  AND o.placed_at < TIMESTAMPTZ '2026-02-01 00:00:00+00'",
 '-- line_totals\nSELECT order_id, SUM(amount) AS order_value\nFROM order_lines GROUP BY order_id;\n-- payment_totals\nSELECT order_id, SUM(amount) AS paid\nFROM payments GROUP BY order_id;',
 'l.order_value - COALESCE(p.paid, 0) AS due\nEXISTS (SELECT 1 FROM payments AS receipt\n        WHERE receipt.order_id = o.order_id) AS has_payment',
 'WHERE b.due > 0 OR b.due IS NULL\nORDER BY b.placed_at, b.order_id'
];
export const original = [100,101,102,105,106,103,104];
export function paging(mode='offset', change='none', step=2) {
 let rows=[...original];
 if(step>=1) {
  if(change==='insert') rows=[100,107,101,102,105,106,103,104];
  if(change==='delete') rows=rows.filter(x=>x!==100);
  if(change==='move') rows=[100,102,101,105,106,103,104];
 }
 const afterCursor=rows.filter(x=>[102,105,106,103,104].includes(x) && !(change==='move'&&x===102));
 const next=step<2?[]:mode==='offset'?rows.slice(2,4):afterCursor.slice(0,2);
 return {rows, first:[100,101], next, note: step===0?'First request returns 100 and 101. Save the timestamp and ID of 101.':step===1?({none:'Nothing changes between requests.',insert:'A new order, 107, arrives between 100 and 101.',delete:'Order 100 is deleted after it was read.',move:'Order 102’s timestamp is corrected to a point before 101.'})[change]:`Second request returns ${next.join(' and ')}. ${mode==='offset'?'It skips the first two rows that exist now.':'It selects rows strictly after the saved timestamp and ID.'}`};
}
