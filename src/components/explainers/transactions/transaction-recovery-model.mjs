/** A documented teaching schedule. It does not simulate transport or execute SQL. */
export function recoveryState(step, originalCommits, reuseKey) {
  if (!Number.isInteger(step) || step < 0 || step > 5) throw new RangeError('Step must be 0–5');
  const committed = originalCommits && step >= 2;
  const replayFinishes = step >= 5;
  const secondPurchase = replayFinishes && (!originalCommits || !reuseKey);
  const orders = Number(committed) + Number(secondPurchase);
  const stock = 5 - orders * 2;
  const key = reuseKey ? 'K14' : 'K15';
  const database = [
    '5 mugs available; no order for K14.',
    'K14 has a provisional order and stock reduction. Neither is committed.',
    originalCommits ? 'K14 committed: one order for 2 mugs, 3 available.' : 'The unfinished K14 transaction rolled back: no order, 5 available.',
    originalCommits ? 'K14 is still recorded. The application has not learned this.' : 'K14 is still absent. The application has not learned this.',
    originalCommits && reuseKey ? 'The unique K14 claim inserts nothing. The following read returns the existing purchase.' : `The ${key} claim inserts a provisional order. It can now reserve 2 mugs.`,
    orders === 2 ? 'Two orders now exist: K14 and K15. They consume 4 mugs for one customer intent.' : 'One completed order consumes 2 mugs. Repeating the original intent has not doubled its effect.'
  ];
  const application = [
    'Retains K14: Ada wants 2 mugs at €20 each.',
    'Sent COMMIT; has no result yet.',
    'Connection lost. Outcome unknown.',
    `Will attempt the same purchase using ${key}.`,
    originalCommits && reuseKey ? 'Verifies the stored customer and complete purchase details before returning that result.' : 'The claim succeeded. Completes the purchase within this transaction.',
    orders === 2 ? 'Received success for K15; the earlier K14 purchase also exists.' : originalCommits ? 'Returns the recovered K14 result.' : `Returns the new completed ${key} result.`
  ];
  const event = [
    'This experiment starts with five mugs so an accidental second purchase can also succeed.',
    'The application has prepared one order and reserved two mugs inside a transaction.',
    'Both database histories produce the same evidence at the application: no commit reply.',
    reuseKey ? 'The retry keeps the identity of the customer’s original intent.' : 'A new key tells the database this is another purchase, even though the customer intended only one.',
    originalCommits && reuseKey ? 'Recovering K14 skips reservation. A unique key coordinates repeated attempts.' : 'A successful new claim still needs its guarded stock update, line insert and commit.',
    orders === 2 ? 'A new key duplicated the purchase. Stock staying non-negative did not protect the customer’s intent.' : 'One purchase is recorded. Compare the other hidden history before judging a recovery policy safe.'
  ];
  return { step, stock, orders, database: database[step], application: application[step], event: event[step] };
}
