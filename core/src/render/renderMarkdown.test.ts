import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './renderMarkdown.js';

describe('renderMarkdown', () => {
  it('renders GFM tables to <table> markup', () => {
    const md = ['| A | B |', '| --- | --- |', '| 1 | 2 |'].join('\n');
    const { html } = renderMarkdown(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<td>1</td>');
    expect(html).toContain('<td>2</td>');
  });

  it('generates a heading-anchor id per heading and returns matching toc entries', () => {
    const md = '# Title\n\n## Overview\n\n### Details\n';
    const { html, toc } = renderMarkdown(md);

    expect(toc).toEqual([
      { depth: 1, text: 'Title', id: 'title' },
      { depth: 2, text: 'Overview', id: 'overview' },
      { depth: 3, text: 'Details', id: 'details' },
    ]);
    expect(html).toContain('id="title"');
    expect(html).toContain('id="overview"');
  });

  it('dedupes two headings that slugify to the same id', () => {
    const md = '## Overview\n\nfirst\n\n## Overview\n\nsecond\n';
    const { toc } = renderMarkdown(md);
    expect(toc.map((entry) => entry.id)).toEqual(['overview', 'overview-1']);
  });

  it('dedupes against emitted ids, not base-slug counters — Overview, Overview, Overview 1 stay distinct', () => {
    const md = '## Overview\n\na\n\n## Overview\n\nb\n\n## Overview 1\n\nc\n';
    const { toc } = renderMarkdown(md);

    const ids = toc.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).toEqual(['overview', 'overview-1', 'overview-1-1']);
  });

  it('namespaces generated ids with opts.headingIdPrefix so two rendered docs never collide on one page', () => {
    const md = '## Overview\n';
    const { toc, html } = renderMarkdown(md, { headingIdPrefix: 'v5-' });
    expect(toc[0].id).toBe('v5-overview');
    expect(html).toContain('id="v5-overview"');
  });

  it('rewrites a mermaid fence into the client-rendered marker while keeping the source readable', () => {
    const md = '```mermaid\ngraph TD; A-->B;\n```\n';
    const { html } = renderMarkdown(md);

    expect(html).not.toContain('```');
    expect(html).toContain('mermaid-figure');
    expect(html).toContain('data-mermaid=');
    expect(html).toContain('mermaid-source');
    expect(html.includes('A-->B') || html.includes('A--&gt;B')).toBe(true);
  });

  it('leaves a mermaid fence as an ordinary code block when opts.mermaid === false', () => {
    const md = '```mermaid\ngraph TD; A-->B;\n```\n';
    const { html } = renderMarkdown(md, { mermaid: false });

    expect(html).not.toContain('mermaid-figure');
    expect(html).not.toContain('data-mermaid');
    expect(html).toContain('language-mermaid');
  });

  it('does not throw on well-formed markdown with no mermaid fences and no headings', () => {
    expect(() => renderMarkdown('just a paragraph of text.\n')).not.toThrow();
  });
});
