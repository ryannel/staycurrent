// Fixed string-only fields. This is an alternative encoding, not the adapter key.
export function encodedProductKey(shop, id, locale = 'en-GB', currency = 'GBP') {
  if (![shop, id, locale, currency].every(value => typeof value === 'string')) {
    throw new TypeError('Every key field must be a string');
  }
  return 'product-json:v1:' + JSON.stringify([shop, id, locale, currency]);
}
export const tuples = [['north:outlet', 'P7'], ['north', 'outlet:P7']];
export function encodingExample(mode) {
  const keys = tuples.map(([shop,id]) => mode === 'joined'
    ? `product:v1:${shop}:${id}:en-GB:GBP`
    : encodedProductKey(shop,id));
  return {keys, same: keys[0] === keys[1]};
}
