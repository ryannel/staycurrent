import type { Element, ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';
import { hastToText } from './text.js';

/**
 * Mutates `tree` in place: rewrites every ` ```mermaid ` fence (rendered by
 * remark-rehype as `<pre><code class="language-mermaid">…</code></pre>`) into a
 * container the client can render, while keeping the fenced source readable with
 * JavaScript off (architecture §3):
 *
 *   <div class="mermaid-figure" data-mermaid="<source>">
 *     <pre class="mermaid-source"><source></pre>
 *   </div>
 *
 * Reserved-space / CLS behavior and the actual mermaid render are the site's
 * concern — content-core carries no server-side mermaid dependency.
 */
export function transformMermaidFences(tree: Root): void {
  visit(tree, 'element', (node: Element, index, parent) => {
    if (node.tagName !== 'pre' || parent == null || index == null) return;

    const codeChild = node.children.find(
      (child): child is Element => child.type === 'element' && child.tagName === 'code'
    );
    if (!codeChild) return;

    const classNames = Array.isArray(codeChild.properties?.className)
      ? (codeChild.properties.className as unknown[]).map(String)
      : [];
    if (!classNames.includes('language-mermaid')) return;

    const source = hastToText(codeChild);
    const container: Element = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['mermaid-figure'], 'data-mermaid': source },
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: { className: ['mermaid-source'] },
          children: [{ type: 'text', value: source }],
        },
      ],
    };

    (parent.children as ElementContent[])[index] = container;
  });
}
