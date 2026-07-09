import type { Element, Root, RootContent } from 'hast';

/** Flattens a hast node's text content, ignoring markup. */
export function hastToText(node: Element | RootContent | Root): string {
  if ('type' in node && node.type === 'text') {
    return (node as { value: string }).value ?? '';
  }
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map((child) => hastToText(child)).join('');
  }
  return '';
}

/** GitHub-style heading slug: lowercase, strip punctuation, spaces to hyphens. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
