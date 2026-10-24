// A conceptual reference lookup; not a SQL engine or an execution-order claim.
export function referenceStep(facts, shop, step) {
  const orderMatch = facts.order.shop_id === shop;
  const product = facts.products.find(p => p.shop_id === shop && p.product_id === 'P7');
  const orderText = step < 1 ? 'Order reference not yet followed' : orderMatch ? 'Match: order (10, 103)' : 'No match for order (20, 103)';
  const productText = step < 2 ? 'Product reference not yet followed' : `Match: ${product.name}`;
  const outcome = step < 3 ? 'Follow the same shop ID into both parent keys.' : orderMatch ? 'Both references are satisfied.' : 'The order reference refuses this line.';
  const explanations = [
    `The line carries shop ${shop}. Both references use that same ${shop}, together with their own parent ID.`,
    orderMatch ? 'The order reference asks for (10, 103). Mina’s order has that whole key, so it matches.' : 'The order reference asks for (20, 103). Mina’s order is (10, 103); matching 103 alone is not enough.',
    `The product reference asks for (${shop}, P7). It finds the ${product.name} at ${product.price}. The other shop’s P7 cannot satisfy this pair.`,
    orderMatch ? 'Both parents belong to shop 10. These two references are valid. This is not a test of the caller’s authority or of every other line rule.' : 'The Copper mug exists in shop 20, but that cannot repair the absent order (20, 103). Both references must hold, so the attempted line is refused.',
  ];
  return { orderMatch, orderText, productText, outcome, explanation: explanations[step] };
}
