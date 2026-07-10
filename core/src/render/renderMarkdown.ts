import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Root } from 'hast';
import type { RenderMarkdownOptions, RenderedDoc, TocEntry } from '../types.js';
import { assignHeadingIds } from './rehypeHeadingIds.js';
import { transformMermaidFences } from './rehypeMermaid.js';
import { sanitizeUrlProtocols } from './rehypeSanitizeProtocols.js';

/**
 * The one rendering pipeline every markdown body in the system goes through
 * (03-api-design.md, `renderMarkdown`): GFM tables, generated heading-anchor ids,
 * mermaid-fence rewriting, and the href/src protocol allowlist (G7) behave
 * identically everywhere a body is rendered — every caller inherits the
 * sanitization with no per-caller opt-in.
 */
export function renderMarkdown(md: string, opts: RenderMarkdownOptions = {}): RenderedDoc {
  const mermaid = opts.mermaid ?? true;
  const headingIdPrefix = opts.headingIdPrefix ?? '';
  const toc: TocEntry[] = [];

  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (tree: Root) => {
      // sanitizeUrlProtocols runs LAST: any href/src a later transform in this
      // pipeline emits still passes through the protocol allowlist before the
      // tree is stringified — the security pass covers every attribute source,
      // not just remark's own output (review patch, G7). assignHeadingIds and
      // transformMermaidFences never emit href/src (heading ids and
      // data-mermaid are untouched by the sanitizer, which only inspects
      // href/src), so reordering changes no existing behavior.
      assignHeadingIds(tree, headingIdPrefix, toc);
      if (mermaid) {
        transformMermaidFences(tree);
      }
      sanitizeUrlProtocols(tree);
    })
    .use(rehypeStringify)
    .processSync(md);

  return { html: String(file), toc };
}
