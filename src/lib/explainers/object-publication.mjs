/** A schematic two-object export, observed between acknowledged writes. */
export function publicationState(mode, step) {
  if (!['overwrite', 'manifest'].includes(mode)) throw new Error('Unknown publication mode');
  if (!Number.isInteger(step) || step < 0 || step > 3) throw new Error('Step must be 0–3');
  const visibleGeneration = mode === 'manifest' && step < 3 ? 'A' : 'B';
  const priceGeneration = mode === 'overwrite' ? (step >= 1 ? 'B' : 'A') : visibleGeneration;
  const stockGeneration = mode === 'overwrite' ? (step >= 2 ? 'B' : 'A') : visibleGeneration;
  const coherent = priceGeneration === stockGeneration;
  const actions = mode === 'overwrite'
    ? ['No writes yet.', 'Replace prices.json with generation B.', 'Replace stock.json with generation B.', 'The writer has finished. No separate publication step.']
    : ['The manifest names the two generation-A objects.', 'Upload B/prices.json. The manifest still names A.', 'Upload B/stock.json. The manifest still names A.', 'Replace current.json so it names both generation-B objects.'];
  return {
    mode, step, action: actions[step], priceGeneration, stockGeneration, coherent,
    price: priceGeneration === 'A' ? 20 : 24,
    stock: stockGeneration === 'A' ? 4 : 8,
    pointer: mode === 'manifest' ? visibleGeneration : null,
    uploaded: mode === 'manifest' ? Math.min(step, 2) : 0,
    summary: coherent
      ? `The reader gets generation ${priceGeneration}: price ${priceGeneration === 'A' ? 20 : 24} credits and stock ${stockGeneration === 'A' ? 4 : 8}. The two files belong to the same export.`
      : 'The reader gets the new price, 24 credits, with the old stock count, 4. Each object is current, but the two files belong to different exports.',
  };
}
