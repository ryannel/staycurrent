// The one slug guard every write-side entry point shares (change-proposal-1 review
// patch): a slug is a path segment under topics/ and .staycurrent/staged/, so an
// invalid slug is not just a naming violation — an unguarded '../..' would be path
// traversal. Every exported function that takes a slug validates here before
// touching the filesystem.

import { ContentValidationError } from './errors.js';

// Reserved root slugs a topic must never collide with (04-data-design.md, Directory
// Layout; 03-api-design.md Publish gate check 8).
export const RESERVED_SLUGS = new Set(['skills', 'changelog', 'about', 'rss.xml']);

// Naming & Taxonomy (docs/design-system.md): kebab-case, at most 3 words. "Noun-form"
// is not mechanically checkable, so this regex enforces the shape 01-ui-design.md
// names as the concrete slug-validation rule: lowercase alphanumeric words joined by
// single hyphens, at most two hyphens (three words). As a side effect it admits no
// '/', '\', or '.' — a valid slug can never escape its directory.
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+){0,2}$/;

/** Throws ContentValidationError unless `slug` is kebab-case, ≤3 words, unreserved. */
export function assertValidSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw new ContentValidationError(slug, 'slug', [
      `'${slug}' is not a valid slug — must be kebab-case, at most 3 words`,
    ]);
  }
  if (RESERVED_SLUGS.has(slug)) {
    throw new ContentValidationError(slug, 'slug', [
      `'${slug}' collides with a reserved root path`,
    ]);
  }
}
