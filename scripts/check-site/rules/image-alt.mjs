export default {
  id: 'image-alt',
  why: 'Every image needs alt text, or alt="" when it is decorative.',
  kinds: 'all',
  check(page) {
    return page.root.querySelectorAll('img')
      .filter((img) => img.getAttribute('alt') === undefined)
      .map((img) => ({ message: `image without alt: ${img.getAttribute('src')}` }));
  },
};
