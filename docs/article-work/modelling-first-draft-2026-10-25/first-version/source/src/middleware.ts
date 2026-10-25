// Fills each <span data-reading-time> with the page's reading time once the
// page has rendered, so the figure always matches the text it describes.
import { defineMiddleware } from 'astro:middleware';
import { readingMinutes, readingTimeLabel } from './lib/reading-time';

// Dev mode adds source attributes to the span, so match any attributes after the marker.
const PLACEHOLDER = /<span data-reading-time([^>]*)><\/span>/g;

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  const filled = html.includes('data-reading-time') ? html.replace(PLACEHOLDER, (_, attrs) => `<span data-reading-time${attrs}>${readingTimeLabel(readingMinutes(html))}</span>`) : html;
  return new Response(filled, { status: response.status, statusText: response.statusText, headers: response.headers });
});
