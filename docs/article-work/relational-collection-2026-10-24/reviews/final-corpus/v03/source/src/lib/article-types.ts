// The kinds of article, shown first in the line under each title.
//   Introduction    the way into a family of databases or a collection
//   Deep dive       the full explanation of one subject
//   Companion       goes further into part of a deep dive, which it names
//   Worked example  follows one scenario through several subjects
//   Assessment      answers a decision question from current evidence
export const articleTypes = ['Introduction', 'Deep dive', 'Companion', 'Worked example', 'Assessment'] as const;
export type ArticleType = (typeof articleTypes)[number];
