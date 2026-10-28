import { readFileSync, readdirSync } from 'node:fs';

export function getStaticPaths() {
  if (process.env.APPLICATION_CACHING_DRAFT_PREVIEW !== '1') return [];
  const folder = new URL('../../../../../docs/article-work/application-caching-2026-10-28/practice/', import.meta.url);
  return readdirSync(folder).filter(name => /\.(py|md|txt|json|mjs)$/.test(name)).map(file => ({
    params: { file }, props: { body: readFileSync(new URL(file, folder), 'utf8') },
  }));
}

export function GET({ params, props }) {
  return new Response(props.body, { headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Disposition': `attachment; filename="${params.file}"`,
    'X-Robots-Tag': 'noindex, nofollow',
  } });
}
