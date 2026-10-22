// Embed the same modules used by the article; the downloaded HTML needs no imports.
export function standaloneEditor(connection, sources) {
  const code = sources.map(source => source.replace(/^import .*?;\s*$/gm, '').replace(/^export /gm, '')).join('\n');
  return connection.replace('/* SHARED MODULES */', () => code);
}
