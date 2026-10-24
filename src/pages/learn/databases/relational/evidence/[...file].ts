import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve('docs/article-work/relational-rewrite-2026-10-19');
const collectionRoot = path.resolve('src/components/relational-collection');
export function getStaticPaths() {
  const walk = (directory: string, base = root): string[] => readdirSync(path.join(base, directory), { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name), base) : [path.join(directory, entry.name)]);
  const legacy = [...walk('evidence'), ...walk('lab')].filter(file => /\.(md|json|txt|sql|py|mjs|csv|zip)$/.test(file)).map(file => ({ params: { file: file.startsWith('evidence/') ? file.slice('evidence/'.length) : file }, props: { file, collection: false } }));
  const current = readdirSync(collectionRoot).filter(key => /^r\d{2}$/.test(key) && existsSync(path.join(collectionRoot, key, 'downloads'))).flatMap(key => walk(`${key}/downloads`, collectionRoot)).filter(file => /\.(sql|py|sh|mjs|json|md|txt|csv)$/i.test(file)).map(file => ({ params: { file: file.replace('/downloads/', '/') }, props: { file, collection: true } }));
  return [...legacy, ...current];
}
export function GET({ props }: { props: { file: string; collection?: boolean } }) {
  const data = readFileSync(path.join(props.collection ? collectionRoot : root, props.file));
  return new Response(data, { headers: { 'Content-Type': props.file.endsWith('.zip') ? 'application/zip' : 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="${path.basename(props.file)}"`, 'X-Content-Type-Options': 'nosniff' } });
}
