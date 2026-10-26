interface ReadingEntry {
  key: string;
  parent: string | null;
  available: boolean;
}

/** Ownership depth is optional reading, separate from the foundation sequence. */
export function relationalRebuildPager<T extends ReadingEntry>(
  current: T,
  entries: T[],
  readingOrder: readonly string[],
): { previous?: T; next?: T; primary: boolean } {
  const byKey = new Map(entries.map(entry => [entry.key, entry]));
  const path = readingOrder.map(key => byKey.get(key)).filter((entry): entry is T => !!entry?.available);
  const index = path.findIndex(entry => entry.key === current.key);
  if (index >= 0) return { previous: path[index - 1], next: path[index + 1], primary: true };
  const parent = current.parent ? byKey.get(current.parent) : undefined;
  return { previous: parent?.available ? parent : undefined, primary: false };
}
