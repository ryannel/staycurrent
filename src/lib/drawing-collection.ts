export const drawingCollection = [
  { slug: '', title: 'Drawing systems and processes', description: 'Choose a view that answers the question in front of you.' },
  { slug: 'architecture', title: 'Architecture diagrams', description: 'Context, C4 zoom levels, relationships and deployment.' },
  { slug: 'processes', title: 'Processes and swimlanes', description: 'Activities, responsibility, handoffs and exceptions.' },
  { slug: 'sequences', title: 'Sequence diagrams', description: 'Messages, time, replies and uncertain outcomes.' },
  { slug: 'domains', title: 'Domains and data relationships', description: 'Shared language, identities, cardinality and information flow.' },
  { slug: 'states', title: 'States and lifecycles', description: 'Events, conditions and the changes an object may make.' },
  { slug: 'whiteboarding', title: 'Drawing at the whiteboard', description: 'Turn a conversation into a drawing people can correct.' },
  { slug: 'vocabulary', title: 'A whiteboard shape vocabulary', description: 'Quick symbols, drawing steps and room for personality.' },
  { slug: 'layout', title: 'Layout, labels and five colours', description: 'Make a drawing easy to follow across a room.' },
  { slug: 'maintaining', title: 'Keeping diagrams useful', description: 'Choose tools, capture decisions and keep views trustworthy.' },
];
export const drawingHref = (slug: string) => `/learn/drawing-systems/${slug ? `${slug}/` : ''}`;
