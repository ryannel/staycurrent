import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve('docs/article-work/relational-rewrite-2026-10-19');
export function getStaticPaths() {
 if (process.env.RELATIONAL_DRAFT_PREVIEW !== '1') return [];
 const walk = (directory: string): string[] => readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
 return [...walk('evidence'), ...walk('lab')].filter(file => /\.(md|json|txt|sql|py|mjs|csv|zip)$/.test(file)).map(file => ({ params: { file: file.startsWith('evidence/') ? file.slice('evidence/'.length) : file }, props: { file } }));
}
export function GET({ props }: { props: { file: string } }) {
 const data = readFileSync(path.join(root, props.file));
 return new Response(data, { headers: { 'Content-Type': props.file.endsWith('.zip') ? 'application/zip' : 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="${path.basename(props.file)}"` } });
}
