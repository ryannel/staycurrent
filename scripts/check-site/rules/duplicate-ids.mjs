export default {
  id: 'duplicate-ids',
  why: 'A repeated id makes anchors and aria references point at the wrong element.',
  kinds: 'all',
  check(page) {
    return [...page.ids].filter(([, n]) => n > 1).map(([id, n]) => ({ message: `id "${id}" appears ${n} times` }));
  },
};
