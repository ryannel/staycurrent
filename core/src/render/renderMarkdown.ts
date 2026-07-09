import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Root } from 'hast';
import type { RenderMarkdownOptions, RenderedDoc, TocEntry } from '../types.js';
import { assignHeadingIds } from './rehypeHeadingIds.js';
import { transformMermaidFences } from './rehypeMermaid.js';

/**
 * The one rendering pipeline every markdown body in the system goes through
 * (03-api-design.md, `renderMarkdown`): GFM tables, generated heading-anchor ids,
 * and mermaid-fence rewriting behave identically everywhere a body is rendered.
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
      assignHeadingIds(tree, headingIdPrefix, toc);
      if (mermaid) {
        transformMermaidFences(tree);
      }
    })
    .use(rehypeStringify)
    .processSync(md);

  return { html: String(file), toc };
}
