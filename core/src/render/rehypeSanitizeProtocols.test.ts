import type { Element, Root } from 'hast';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { sanitizeUrlProtocols } from './rehypeSanitizeProtocols.js';

// These tests exercise sanitizeUrlProtocols directly against a hand-built
// hast tree rather than through renderMarkdown's markdown parsing: CommonMark's
// own link-destination grammar already rejects or percent-encodes a raw
// control character in a bare/`<...>` destination (verified empirically
// against the built pipeline), so a hostile value carrying a literal tab or
// leading control byte can never survive markdown parsing to reach this
// function that way. The obfuscation resistance the hardening spec calls
// out — case, embedded tab/newline, leading control bytes — is a property of
// this function's own protocol parser, so it is pinned here independent of
// whatever upstream escaping remark happens to do today.

function anchor(href: string, text = 'text'): Element {
  return {
    type: 'element',
    tagName: 'a',
    properties: { href },
    children: [{ type: 'text', value: text }],
  };
}

function image(src: string): Element {
  return { type: 'element', tagName: 'img', properties: { src }, children: [] };
}

function root(...children: Element[]): Root {
  return { type: 'root', children };
}

describe('sanitizeUrlProtocols', () => {
  it('strips a lowercase javascript: href', () => {
    const tree = root(anchor('javascript:alert(1)'));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.href).toBeUndefined();
  });

  it('strips javascript: regardless of case — JaVaScRiPt: is not a bypass', () => {
    const tree = root(anchor('JaVaScRiPt:alert(1)'));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.href).toBeUndefined();
  });

  it('strips a protocol obfuscated with an embedded tab — java\\tscript: is not a bypass', () => {
    const tree = root(anchor('java' + String.fromCharCode(9) + 'script:alert(1)'));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.href).toBeUndefined();
  });

  it('strips a protocol obfuscated with an embedded newline or carriage return', () => {
    const withNewline = root(anchor('java' + String.fromCharCode(10) + 'script:alert(1)'));
    sanitizeUrlProtocols(withNewline);
    expect((withNewline.children[0] as Element).properties?.href).toBeUndefined();

    const withCr = root(anchor('java' + String.fromCharCode(13) + 'script:alert(1)'));
    sanitizeUrlProtocols(withCr);
    expect((withCr.children[0] as Element).properties?.href).toBeUndefined();
  });

  it('strips a protocol preceded by a leading C0 control byte or stray space', () => {
    const leadingControl = root(anchor(String.fromCharCode(1) + 'javascript:alert(1)'));
    sanitizeUrlProtocols(leadingControl);
    expect((leadingControl.children[0] as Element).properties?.href).toBeUndefined();

    const leadingSpace = root(anchor('   javascript:alert(1)'));
    sanitizeUrlProtocols(leadingSpace);
    expect((leadingSpace.children[0] as Element).properties?.href).toBeUndefined();
  });

  it('preserves the element and its text children when the href is stripped — never drops the node', () => {
    const tree = root(anchor('javascript:alert(1)', 'hostile text'));
    sanitizeUrlProtocols(tree);
    const el = tree.children[0] as Element;
    expect(el.tagName).toBe('a');
    expect(el.children).toEqual([{ type: 'text', value: 'hostile text' }]);
  });

  it('strips a data: image src', () => {
    const tree = root(image('data:image/svg+xml,<svg/>'));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.src).toBeUndefined();
  });

  it.each([
    ['https:', 'https://example.com/x'],
    ['http:', 'http://example.com/x'],
    ['mailto:', 'mailto:a@example.com'],
    ['relative path', './sibling'],
    ['fragment anchor', '#anchor'],
    ['protocol-relative', '//example.com/path'],
  ])('leaves a %s href untouched', (_label, href) => {
    const tree = root(anchor(href));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.href).toBe(href);
  });

  // Confirmed surviving mutant: deleting parseProtocol's `.toLowerCase()`
  // leaves every other test in this suite green (they all exercise the
  // hostile direction — an uppercase *unsafe* scheme must still be caught),
  // but silently starts stripping href/src whose SAFE scheme happens to be
  // upper/mixed-case, since `ALLOWED_PROTOCOLS.has('HTTPS')` is false. Pinned
  // here on the safe side: an allowed scheme survives byte-identical
  // regardless of case.
  it('leaves an uppercase-scheme https href untouched, byte-identical', () => {
    const tree = root(anchor('HTTPS://example.com/x'));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.href).toBe('HTTPS://example.com/x');
  });

  it('leaves a mixed-case mailto href untouched, byte-identical', () => {
    const tree = root(anchor('MailTo:a@example.com'));
    sanitizeUrlProtocols(tree);
    expect((tree.children[0] as Element).properties?.href).toBe('MailTo:a@example.com');
  });

  it('leaves attributes other than href/src untouched', () => {
    const el: Element = {
      type: 'element',
      tagName: 'a',
      properties: { href: 'javascript:alert(1)', className: ['flagged'], title: 'note' },
      children: [{ type: 'text', value: 'x' }],
    };
    sanitizeUrlProtocols(root(el));
    expect(el.properties?.href).toBeUndefined();
    expect(el.properties?.className).toEqual(['flagged']);
    expect(el.properties?.title).toBe('note');
  });

  it('does not throw on an element with no properties', () => {
    const el: Element = { type: 'element', tagName: 'p', properties: {}, children: [] };
    delete (el as { properties?: unknown }).properties;
    expect(() => sanitizeUrlProtocols(root(el))).not.toThrow();
  });

  describe('property: never throws, and any surviving href/src is protocol-safe', () => {
    // Hostile-fragment compositions: leading noise (nothing, spaces, C0
    // controls) + a scheme name (safe, hostile, or empty) + a separator (a
    // plain colon, or one polluted with an embedded tab/newline/space,
    // exercising parseProtocol's own obfuscation-resistance seam) + arbitrary
    // trailing content — deliberately shaped to land near the parser's
    // decision boundary rather than relying on fully random strings alone.
    const hostileFragment = fc
      .tuple(
        fc.constantFrom('', ' ', '  ', '\t', '\n', '\r', String.fromCharCode(1)),
        fc.constantFrom(
          'javascript',
          'JavaScript',
          'JAVASCRIPT',
          'vbscript',
          'data',
          'file',
          'about',
          'http',
          'https',
          'mailto',
          ''
        ),
        fc.constantFrom(':', '\t:', ':\t', '\n:', '\r:', ' :', '::', ''),
        fc.string()
      )
      .map(([prefix, scheme, sep, rest]) => `${prefix}${scheme}${sep}${rest}`);

    const arbitraryUrl = fc.oneof(fc.string(), hostileFragment);

    // The WHATWG URL Standard requires an authority ("//...") for a "special"
    // scheme (http/https among them) unless the base's own scheme already
    // matches — so the bare string "http:" (scheme, colon, nothing else)
    // throws against an 'https:' base even though 'http' is itself allowed
    // (empirically confirmed: `new URL('http:', 'https://example.com/')`
    // throws, while `new URL('http:', 'http://example.com/')` resolves).
    // This is a URL-constructor quirk around authority-less special schemes,
    // not a protocol-safety gap, so the oracle retries against a base whose
    // scheme matches the value's own before treating a throw as a failure.
    // WHATWG URL parsing trims leading/trailing C0-control-or-space and then
    // strips every ASCII tab/newline before reading a scheme (the same
    // preprocessing rehypeSanitizeProtocols.ts's own parser mirrors) — applied
    // here too so the fallback base's scheme (below) matches what the URL
    // constructor itself computes internally.
    const LEADING_TRAILING_C0_RE = /^[\x00-\x20]+|[\x00-\x20]+$/g;
    function cleanForSchemeMatch(value: string): string {
      return value.replace(LEADING_TRAILING_C0_RE, '').replace(/[\t\n\r]/g, '');
    }

    function resolveAgainstBase(value: string): URL {
      const httpsBase = 'https://example.com/';
      try {
        return new URL(value, httpsBase);
      } catch {
        const schemeMatch = /^([a-z][a-z0-9+.-]*):/i.exec(cleanForSchemeMatch(value));
        if (!schemeMatch) throw new Error(`unresolvable with no scheme to retry against: ${value}`);
        return new URL(value, `${schemeMatch[1].toLowerCase()}://example.com/`);
      }
    }

    it('never throws, and a surviving href/src always resolves (via the WHATWG URL constructor) to an allowed protocol or a relative/fragment reference', () => {
      fc.assert(
        fc.property(arbitraryUrl, fc.constantFrom('href', 'src'), (value, attr) => {
          const el: Element = {
            type: 'element',
            tagName: attr === 'href' ? 'a' : 'img',
            properties: { [attr]: value },
            children: [],
          };

          expect(() => sanitizeUrlProtocols(root(el))).not.toThrow();

          const survived = el.properties?.[attr];
          if (survived === undefined) return; // stripped — trivially satisfies the property

          // The WHATWG URL constructor is the implementation-independent
          // oracle: anything sanitizeUrlProtocols leaves in place must either
          // carry no scheme of its own (resolves against the https base,
          // covering relative paths, fragments, and protocol-relative URLs
          // alike) or carry one of the three allowed schemes.
          const resolved = resolveAgainstBase(String(survived));
          expect(['http:', 'https:', 'mailto:']).toContain(resolved.protocol);
        }),
        { numRuns: 500 }
      );
    });
  });
});
