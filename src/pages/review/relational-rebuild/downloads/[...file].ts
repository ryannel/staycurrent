import type { APIRoute } from 'astro';
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { basename, extname, isAbsolute, relative, resolve, sep } from 'node:path';

const root = resolve('src/article-downloads/relational-rebuild');
const contentTypes: Record<string, string> = {
  '.sql': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.tsv': 'text/tab-separated-values; charset=utf-8',
  '.json': 'application/json',
  '.yaml': 'application/yaml',
  '.yml': 'application/yaml',
  '.xml': 'application/xml',
  '.py': 'text/plain; charset=utf-8',
  '.sh': 'text/plain; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/vnd.microsoft.icon',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.gz': 'application/gzip',
  '.tar': 'application/x-tar',
  '.parquet': 'application/vnd.apache.parquet',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const safeFile = (file: string) => {
  const [key, ...parts] = file.split('/');
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)
    && parts.length > 0
    && parts.every(part => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(part) && part !== '.' && part !== '..')
    && Object.hasOwn(contentTypes, extname(file).toLowerCase());
};

export function getStaticPaths() {
  if (process.env.RELATIONAL_REBUILD_PREVIEW !== '1' || !existsSync(root) || !lstatSync(root).isDirectory()) return [];
  const walk = (directory: string, prefix = ''): string[] => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    // A staged symlink must never expose another part of the working tree.
    if (entry.isSymbolicLink() || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(entry.name)) return [];
    const file = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return walk(resolve(directory, entry.name), file);
    return entry.isFile() && safeFile(file) ? [file] : [];
  });
  return walk(root).map(file => ({ params: { file }, props: { file } }));
}

export const GET: APIRoute = ({ props }) => {
  if (process.env.RELATIONAL_REBUILD_PREVIEW !== '1' || typeof props.file !== 'string' || !safeFile(props.file)) return new Response(null, { status: 404 });
  try {
    if (!lstatSync(root).isDirectory()) return new Response(null, { status: 404 });
    const file = realpathSync(resolve(root, props.file));
    const withinRoot = relative(realpathSync(root), file);
    if (!withinRoot || isAbsolute(withinRoot) || withinRoot === '..' || withinRoot.startsWith(`..${sep}`) || !lstatSync(file).isFile()) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(readFileSync(file)), {
      headers: {
        'Content-Type': contentTypes[extname(file).toLowerCase()],
        'Content-Disposition': `attachment; filename="${basename(file)}"`,
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
};
