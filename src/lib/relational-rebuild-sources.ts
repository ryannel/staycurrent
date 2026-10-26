import { parse } from 'node-html-parser';

/** Move sources without moving an enclosing article's closing tags or trailing assets. */
export function splitRelationalRebuildSources(html: string): { body: string; heading: string; sources: string; id?: string } {
  const root = parse(html, { comment: true });
  const heading = root.querySelectorAll('h2').filter(node => /^\s*Sources and further reading\s*$/i.test(node.textContent)).at(-1);
  if (!heading) return { body: html, heading: '', sources: '' };

  const parent = heading.parentNode;
  const section = parent?.tagName === 'SECTION'
    && /^<section\b[^>]*>\s*$/i.test(html.slice(parent.range[0], heading.range[0])) ? parent : undefined;
  let start = heading.range[0];
  let end = heading.range[1];
  let sourceEnd = end;
  let id: string | undefined;
  if (section) {
    start = section.range[0];
    end = section.range[1];
    sourceEnd = end - (html.slice(start, end).match(/<\/section\s*>$/i)?.[0].length ?? 0);
    id = section.getAttribute('id');
  } else {
    // Unwrapped sources end with their siblings, before their parent's closing tag.
    // Keep trailing styles/scripts outside the collapsed sources, as article assets.
    const following = parent.childNodes.slice(parent.childNodes.indexOf(heading) + 1);
    while (following.length && (/^\s*$/.test(following.at(-1)!.rawText)
      || /^(STYLE|SCRIPT|LINK)$/.test((following.at(-1) as { tagName?: string }).tagName ?? ''))) following.pop();
    end = sourceEnd = following.at(-1)?.range[1] ?? end;
  }

  // Slice the original bytes: serialising the parsed tree could change SVG, code or scripts.
  const originalHeading = html.slice(...heading.range);
  const sourceHeading = heading.hasAttribute('id') ? originalHeading
    : originalHeading.replace(/<h2/i, '<h2 id="sources-and-further-reading"');
  const headingId = heading.getAttribute('id') ?? 'sources-and-further-reading';
  return { body: html.slice(0, start) + html.slice(end), heading: sourceHeading,
    sources: html.slice(heading.range[1], sourceEnd), id: id === headingId ? undefined : id };
}
