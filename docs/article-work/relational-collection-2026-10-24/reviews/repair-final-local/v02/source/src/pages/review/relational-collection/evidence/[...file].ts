import type { APIRoute } from 'astro';

export function getStaticPaths() {
  if (process.env.RELATIONAL_COLLECTION_PREVIEW !== '1') return [];
  const files = import.meta.glob('../../../../components/relational-collection/*/downloads/**/*', {
    eager: true,
    query: '?raw',
    import: 'default',
  });
  return Object.entries(files).flatMap(([path, content]) => {
    const match = path.match(/\/(r\d{2})\/downloads\/(.+)$/);
    if (!match || !/\.(sql|py|sh|mjs|json|md|txt|csv)$/i.test(match[2])) return [];
    return [{ params: { file: `${match[1]}/${match[2]}` }, props: { content, name: match[2].split('/').at(-1) } }];
  });
}

export const GET: APIRoute = ({ props }) => new Response(props.content, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Disposition': `attachment; filename="${props.name}"`,
    'X-Content-Type-Options': 'nosniff',
  },
});
