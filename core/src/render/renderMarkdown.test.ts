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

  it('runs the protocol sanitizer after the mermaid transform without touching data-mermaid — only href/src are in scope', () => {
    // sanitizeUrlProtocols runs last in the pipeline (review patch) so it sees
    // every attribute a prior transform emits — but it only ever inspects
    // href/src, so a mermaid source that happens to contain a hostile-looking
    // scheme string must survive verbatim inside data-mermaid.
    const md = '```mermaid\ngraph TD; A[javascript:alert(1)] --> B;\n```\n';
    const { html } = renderMarkdown(md);

    expect(html).toContain('data-mermaid="graph TD; A[javascript:alert(1)] --> B;');
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

  describe('protocol allowlist (G7)', () => {
    it('strips a javascript: href but preserves the link text', () => {
      const { html } = renderMarkdown('[hostile](javascript:alert(1))\n');
      expect(html).not.toContain('javascript:');
      expect(html).toContain('hostile');
      expect(html).toContain('<a>hostile</a>');
    });

    it('strips a data: image src but preserves the element', () => {
      const { html } = renderMarkdown('![img](data:image/svg+xml,<svg/>)\n');
      expect(html).not.toContain('data:image');
      expect(html).toContain('<img');
    });

    it('strips a vbscript: href', () => {
      const { html } = renderMarkdown('[x](vbscript:msgbox(1))\n');
      expect(html).not.toContain('vbscript:');
    });

    it('strips a hostile protocol regardless of case — JaVaScRiPt: is not a bypass', () => {
      const { html } = renderMarkdown('[x](JaVaScRiPt:alert(1))\n');
      expect(html.toLowerCase()).not.toContain('javascript:');
      expect(html).toContain('<a>x</a>');
    });

    it('leaves an https: link untouched, byte-identical', () => {
      const { html } = renderMarkdown('[ok](https://example.com/x)\n');
      expect(html).toContain('<a href="https://example.com/x">ok</a>');
    });

    it('leaves an http: link untouched', () => {
      const { html } = renderMarkdown('[ok](http://example.com/x)\n');
      expect(html).toContain('href="http://example.com/x"');
    });

    it('leaves a mailto: link untouched', () => {
      const { html } = renderMarkdown('[mail](mailto:a@example.com)\n');
      expect(html).toContain('href="mailto:a@example.com"');
    });

    it('leaves a relative link untouched — no scheme means nothing to sanitize', () => {
      const { html } = renderMarkdown('[rel](./sibling)\n');
      expect(html).toContain('href="./sibling"');
    });

    it('leaves a fragment anchor untouched', () => {
      const { html } = renderMarkdown('[frag](#anchor)\n');
      expect(html).toContain('href="#anchor"');
    });

    it('leaves a protocol-relative URL untouched — resolved as https on this https-only site', () => {
      const { html } = renderMarkdown('[rel](//example.com/path)\n');
      expect(html).toContain('href="//example.com/path"');
    });

    // Confirmed surviving mutant (rehypeSanitizeProtocols.test.ts): deleting the
    // protocol parser's `.toLowerCase()` leaves this whole describe block green
    // today because every existing case tests the hostile direction. Pinned here
    // through the full renderMarkdown pipeline on the safe side.
    it('leaves an uppercase-scheme https link untouched, byte-identical', () => {
      const { html } = renderMarkdown('[ok](HTTPS://example.com/x)\n');
      expect(html).toContain('href="HTTPS://example.com/x"');
    });

    it('leaves a mixed-case mailto link untouched, byte-identical', () => {
      const { html } = renderMarkdown('[mail](MailTo:a@example.com)\n');
      expect(html).toContain('href="MailTo:a@example.com"');
    });
  });
});
