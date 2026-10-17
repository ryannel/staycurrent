export default {
  id: 'single-h1',
  why: 'The h1 is the page title; screen readers and search treat a second one as a second page title.',
  kinds: 'all',
  check(page) {
    const n = page.main.querySelectorAll('h1').length;
    return n === 1 ? [] : [{ message: `${n} h1 elements; a page has exactly one` }];
  },
};
