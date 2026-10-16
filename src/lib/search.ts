export function searchKind(path: string) {
  if (path.endsWith('/sandbox/')) return 'Playground';
  if (path.endsWith('/practice/') || path.endsWith('/choosing/') ||
      path === '/learn/databases/relational/' || path === '/learn/databases/object-storage/' ||
      path === '/learn/drawing-systems/') return 'Guide';
  return 'Article';
}
