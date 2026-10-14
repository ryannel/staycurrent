/** A deliberately simple equality join: unique product IDs, no index or disk model. */
export function queryWork(catalogueSize: number, lineCount: number) {
  const products = Array.from({ length: catalogueSize }, (_, i) => ({
    id: `P${i + 7}`, name: i === 0 ? 'Blue mug' : i === 1 ? 'Bowl' : `Product ${i + 7}`,
  }));
  const lines = Array.from({ length: lineCount }, (_, i) => ({
    line: i + 1, product: i % 2 === 0 ? 'P7' : 'P8', amount: i % 2 === 0 ? 20 : 24,
  }));
  let comparisons = 0;
  const scanRows: { line: number; product: string; name: string; amount: number }[] = [];
  for (const line of lines) {
    for (const product of products) {
      comparisons++;
      if (line.product === product.id) scanRows.push({ ...line, name: product.name });
    }
  }
  let builds = 0, probes = 0;
  const lookup = new Map<string, string>();
  for (const product of products) { lookup.set(product.id, product.name); builds++; }
  const lookupRows = lines.map(line => {
    probes++;
    return { ...line, name: lookup.get(line.product)! };
  });
  return { products, lines, scanRows, lookupRows, comparisons, builds, probes };
}
