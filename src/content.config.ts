import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every collection reads straight from topics/. A topic is a directory:
//   topics/<slug>/article.md          the living article; frontmatter is the topic's state
//   topics/<slug>/changelog.md        newest entry first, "## vN — YYYY-MM-DD"
//   topics/<slug>/research-log.md     every run, cut or no-cut
//   topics/<slug>/versions/vN/article.md      frozen snapshot of the article at vN
//   topics/<slug>/versions/vN/provenance.md   "## Sources" and "## Synthesis" for vN
//   topics/<slug>/evidence/           lab harnesses and raw logs, published as-is on GitHub

const articles = defineCollection({
  loader: glob({ pattern: '*/article.md', base: './topics' }),
  schema: z.object({
    topic: z.string(),
    title: z.string(),
    stance: z.string(),
    version: z.number().int().positive(),
    cadence: z.string().regex(/^\d+d$/),
    last_researched: z.coerce.date(),
    area: z.string().optional(),
    register: z.enum(['hub', 'foundation', 'profile']).optional(),
    movement: z.string().optional(),
    reading_order: z.number().optional(),
    prereqs: z.array(z.string()).optional(),
    core: z.boolean().optional(),
    axes: z.record(z.string()).optional(),
  }),
});

const versions = defineCollection({
  loader: glob({ pattern: '*/versions/v*/article.md', base: './topics' }),
  schema: z.object({
    version: z.number().int().positive(),
    cut: z.coerce.date(),
  }),
});

const provenance = defineCollection({
  loader: glob({ pattern: '*/versions/v*/provenance.md', base: './topics' }),
});

const changelogs = defineCollection({
  loader: glob({ pattern: '*/changelog.md', base: './topics' }),
});

const researchLogs = defineCollection({
  loader: glob({ pattern: '*/research-log.md', base: './topics' }),
});

export const collections = { articles, versions, provenance, changelogs, researchLogs };
