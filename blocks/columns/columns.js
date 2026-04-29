export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }

      // wrap bare <a> links (not in <p>) as buttons so EDS decorates them
      [...col.children].forEach((child) => {
        if (child.tagName === 'A' && !child.closest('p')) {
          const p = document.createElement('p');
          child.before(p);
          p.append(child);
        }
      });
    });
  });
}
