export const shop = Object.freeze({
  operation: 'order-103-part-payment-1', order: 103, payment: 504,
  amount: '10.00', total: '29.00', due: '19.00',
  stock: 'P3 10 · P7 0 · P9 4',
});
export const cuts = [
  { label: 'Before the mistake', price: '20.00', payment: 'Absent', paid: '0.00', due: '29.00', retained: 1,
    explanation: 'Order 103 is retained. The mistaken price and the later payment are both outside the recovered history. The provider still has the accepted 10.00 charge.' },
  { label: 'Through the mistake', price: '2.20', payment: 'Absent', paid: '0.00', due: '29.00', retained: 2,
    explanation: 'Replay has included the unwanted committed change. The database is consistent, but P7 still costs 2.20. Payment 504 is later than this cut and remains absent.' },
  { label: 'Through the payment', price: '2.20', payment: '504 · 10.00', paid: '10.00', due: '19.00', retained: 3,
    explanation: 'The later payment is now present, but replay also retained the earlier price mistake. Recovery does not skip one committed change on its way to another.' },
];
export const paymentSteps = [
  { title: 'Restore the earlier database', local: 'No payment 504', mapping: 'No operation mapping', action: 'External dispatch disabled',
    text: 'The verified restore has P7 at 20.00 and order 103 pending, total 29.00. Local absence of the payment does not establish whether a charge happened.' },
  { title: 'Use the original operation identity', local: 'No payment 504', mapping: 'Identity recovered from evidence', action: 'Look up the existing operation',
    text: 'Retained evidence maps order-103-part-payment-1 to order 103, payment 504 and 10.00 by card. Query that identity at the provider; do not create a new charge.' },
  { title: 'Establish the provider outcome', local: 'No payment 504', mapping: 'Payload and outcome checked', action: 'Known accepted result',
    text: 'The provider reports that this exact operation accepted 10.00 for order 103. That is evidence for recording the existing effect, not for taking the money again.' },
  { title: 'Check the recovered business facts', local: 'No payment 504', mapping: 'Accepted repair prepared', action: '29.00 total − 0.00 paid ≥ 10.00',
    text: 'The recovered order and agreed lines still support the payment. The repair records money already taken. It does not place the order again or decrement stock.' },
  { title: 'Commit the repair and its identity together', local: '504 · 10.00 by card', mapping: 'Operation → payment 504', action: 'One database transaction',
    text: 'Insert payment 504 and the mapping from the original operation in one transaction. Both commit, or neither does. The provider receives no new charge request.' },
  { title: 'Repeat by verifying the same result', local: '504 · 10.00 by card', mapping: 'Same identity and meaning', action: 'One payment · 19.00 due',
    text: 'A repeat verifies the existing payment and mapping. It adds nothing. A changed order, amount or result under the same identity stops for investigation.' },
];
export function paymentState(step, outcome) {
  if (outcome === 'accepted' || step < 2) return paymentSteps[step];
  const unknown = outcome === 'unknown';
  return { title: unknown ? 'Outcome unresolved — stop here' : 'Evidence disagrees — stop here',
    local: 'No payment 504', mapping: 'Repair remains unresolved', action: 'No new charge; no payment repair',
    text: unknown ? 'The provider result cannot be established. Keep the operation unresolved and investigate under the provider’s lookup and retry contract. Local absence is not permission to charge again.' : 'The returned order or amount does not match the retained operation. Do not overwrite the meaning of the identity or label the payment reconciled. Investigate the disagreement.' };
}
