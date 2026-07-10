import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * The protocol allowlist every `href`/`src` renderMarkdown emits must satisfy
 * (03-api-design.md, RenderedDoc; maturity ledger G7). Content is
 * repo-authored and gate-reviewed today, but the research loop ingests
 * external sources (M4), so a hostile or sloppily-copied link protocol must
 * never reach a reader's browser through `dangerouslySetInnerHTML`.
 */
const ALLOWED_PROTOCOLS = new Set(['http', 'https', 'mailto']);

// A URL scheme is ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ) ":" (RFC 3986,
// section 3.1). No match means the (cleaned) value carries no scheme at all -
// a relative path ("./sibling") or a fragment anchor ("#anchor"), both of
// which pass through untouched.
const SCHEME_RE = /^([a-z][a-z0-9+.-]*):/i;

// The "C0 control or space" codepoints (0x00-0x20) a browser's URL parser
// trims from both ends of a URL before reading its scheme. Built from
// charCodes rather than written as a literal escape range in the regex
// source, so the codepoint list stays unambiguous and survives verbatim.
const C0_OR_SPACE_CHARS = Array.from({ length: 0x21 }, (_, code) => String.fromCharCode(code)).join('');
const LEADING_TRAILING_C0_RE = new RegExp('^[' + C0_OR_SPACE_CHARS + ']+|[' + C0_OR_SPACE_CHARS + ']+$', 'g');
const TAB_NEWLINE_RE = /[\t\n\r]/g;

/**
 * Parses the protocol the way a browser's URL parser does (WHATWG URL "basic
 * URL parser"): trim leading/trailing C0-control-or-space, then strip every
 * TAB/LF/CR anywhere in the string. This is what keeps `JaVaScRiPt:` (case)
 * and `java\tscript:` (an embedded tab breaking a naive prefix check) from
 * slipping past a case-sensitive or whitespace-naive match - both clean up to
 * the same `javascript` scheme a browser would also resolve. Returns null
 * when the cleaned value has no scheme.
 */
function parseProtocol(url: string): string | null {
  const cleaned = url.replace(LEADING_TRAILING_C0_RE, '').replace(TAB_NEWLINE_RE, '');
  const match = SCHEME_RE.exec(cleaned);
  return match ? match[1].toLowerCase() : null;
}

/**
 * A protocol-relative URL ("//host/path") carries no scheme of its own - a
 * browser resolves it against the containing document's own protocol. This
 * site is only ever served over https (GitHub Pages), so treating it as safe
 * here is the https-equivalent reading; it is not a scheme string a hostile
 * or obfuscated value could be confused with.
 */
function isSafeUrl(url: string): boolean {
  const protocol = parseProtocol(url);
  return protocol === null || ALLOWED_PROTOCOLS.has(protocol);
}

/**
 * Mutates `tree` in place: strips `href`/`src` from any element whose URL
 * protocol falls outside {http, https, mailto}. Only the offending attribute
 * is removed - the element and its text children are preserved, never the
 * whole node - so `[hostile](javascript:...)` renders as `<a>hostile</a>`
 * rather than disappearing (03-api-design.md's fail-closed stance, G7).
 */
export function sanitizeUrlProtocols(tree: Root): void {
  visit(tree, 'element', (node: Element) => {
    if (!node.properties) return;
    for (const attr of ['href', 'src'] as const) {
      const value = node.properties[attr];
      if (typeof value === 'string' && !isSafeUrl(value)) {
        delete node.properties[attr];
      }
    }
  });
}
